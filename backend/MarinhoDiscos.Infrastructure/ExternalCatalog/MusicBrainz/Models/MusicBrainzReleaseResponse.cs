using System.Text.Json.Serialization;

namespace MarinhoDiscos.Infrastructure.ExternalCatalog.MusicBrainz.Models;

internal record MusicBrainzReleaseResponse(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("date")] string? Date,
    [property: JsonPropertyName("artist-credit")] List<MusicBrainzArtistCredit>? ArtistCredit,
    [property: JsonPropertyName("media")] List<MusicBrainzMedia>? Media,
    [property: JsonPropertyName("release-group")] MusicBrainzReleaseGroupReference? ReleaseGroup, 
    [property: JsonPropertyName("genres")] List<MusicBrainzGenre>? Genres
);

internal record MusicBrainzMedia(
    [property: JsonPropertyName("tracks")] List<MusicBrainzTrack>? Tracks
);

internal record MusicBrainzTrack(
    [property: JsonPropertyName("position")] int Position,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("length")] int? Length  //ms
);

internal record MusicBrainzReleaseGroupReference(
    [property: JsonPropertyName("id")] string Id
);

internal record MusicBrainzGenre(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("count")] int? Count
);