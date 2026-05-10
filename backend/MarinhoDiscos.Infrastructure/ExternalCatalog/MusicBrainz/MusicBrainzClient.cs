using System.Net.Http.Json;
using MarinhoDiscos.Application.ExternalCatalog;
using MarinhoDiscos.Application.ExternalCatalog.DTOs;
using MarinhoDiscos.Infrastructure.ExternalCatalog.MusicBrainz.Models;
using Microsoft.Extensions.Logging;

namespace MarinhoDiscos.Infrastructure.ExternalCatalog.MusicBrainz;

public class MusicBrainzClient : IMusicCatalogClient
{
    private readonly HttpClient _http;
    private readonly ILogger<MusicBrainzClient> _logger;
    
    public MusicBrainzClient(HttpClient http, ILogger<MusicBrainzClient> logger)
    {
        _http = http;
        _logger = logger;
    }

    public async Task<IReadOnlyList<ExternalAlbumSummary>> SearchAlbumsAsync(string query, int limit, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Array.Empty<ExternalAlbumSummary>();

        var url = $"release/?query={Uri.EscapeDataString(query)}&limit={limit}&fmt=json";
        var response = await _http.GetFromJsonAsync<MusicBrainzSearchResponse>(url, ct);

        if (response?.Releases is null)
            return Array.Empty<ExternalAlbumSummary>();

        return response.Releases
            .Select(r => new ExternalAlbumSummary(
                ExternalId: r.Id,
                Title: r.Title,
                ArtistName: r.ArtistCredit?.FirstOrDefault()?.Name ?? "Unknown",
                ArtistExternalId: r.ArtistCredit?.FirstOrDefault()?.Artist?.Id,
                ReleaseYear: ParseYear(r.Date)))
            .ToList();
    }

    public async Task<ExternalAlbumDetails> GetAlbumDetailsAsync(string externalId, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(externalId))
            return null;

        var url = $"release/{externalId}" +
                         "?inc=recordings+artist-credits+release-groups+genres&fmt=json";
        
        MusicBrainzReleaseResponse? release;

        try
        {
            release = await _http.GetFromJsonAsync<MusicBrainzReleaseResponse>(url, ct);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }

        if (release == null) return null;
        
        var releaseGroupGenres = new List<MusicBrainzGenre>();
        if (release.ReleaseGroup != null)
        {
            var releaseGroupUrl = $"release-group/{release.ReleaseGroup.Id}?inc=genres&fmt=json";
            try
            {
                var releaseGroup = await _http.GetFromJsonAsync<MusicBrainzReleaseGroupResponse>(releaseGroupUrl, ct);
                if (releaseGroup?.Genres is not null) releaseGroupGenres = releaseGroup.Genres;
            }
            catch (HttpRequestException)
            {
                //release-group genres are optional, won't fail the import
            }
        }

        var firstCredit = release.ArtistCredit?.FirstOrDefault();
        var artistReference = firstCredit?.Artist;
        
        var artist = new ExternalArtistInfo(
            ExternalId: artistReference?.Id ?? string.Empty,
            Name: artistReference?.Name ?? firstCredit?.Name ?? "Unknown",
            Country: artistReference?.Country);
        
        var tracks = (release.Media ?? new())
            .SelectMany(m => m.Tracks ?? new())
            .Select(t => new ExternalTrackInfo(
                Number: t.Position,
                Title: t.Title,
                DurationSeconds: (t.Length ?? 0) / 1000))
            .ToList();
        
        var genres = (release.Genres ?? new())
            .Concat(releaseGroupGenres)
            .Select(g => g.Name.Trim().ToLowerInvariant())
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .Distinct()
            .ToList();

        return new ExternalAlbumDetails(
            ExternalId: release.Id,
            Title: release.Title,
            ReleaseDate: ParseDate(release.Date),
            Artist: artist,
            Tracks: tracks,
            Genres: genres
        );
    }
    
    private static int? ParseYear(string? date)
    {
        if (string.IsNullOrEmpty(date)) return null;
        return int.TryParse(date.Split('-')[0], out var y) ? y : null;
    }
    
    private static DateTime ParseDate(string? date)
    {
        if (string.IsNullOrEmpty(date)) return DateTime.MinValue;
        // MusicBrainz: "1997", "1997-05", "1997-05-21" are all valid
        if (DateTime.TryParse(date, out var d)) return DateTime.SpecifyKind(d, DateTimeKind.Utc);
        if (int.TryParse(date.Split('-')[0], out var y))
            return new DateTime(y, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        return DateTime.MinValue;
    }
}