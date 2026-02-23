using MarinhoDiscos.Application.DTOs.Albums;
using MarinhoDiscos.Domain.Repositories;
using MediatR;

namespace MarinhoDiscos.Application.Queries.GetAlbumById;

public class GetAlbumByIdHandler 
    : IRequestHandler<GetAlbumByIdQuery, AlbumDetailsResponse>
{
    private readonly IAlbumRepository _albumRepository;

    public GetAlbumByIdHandler(IAlbumRepository albumRepository)
    {
        _albumRepository = albumRepository;
    }

    public async Task<AlbumDetailsResponse> Handle(
        GetAlbumByIdQuery request,
        CancellationToken ct)
    {
        var album = await _albumRepository.GetDetailsByIdAsync(request.AlbumId, ct);

        if (album is null)
            throw new NotFoundException("Album not found");

        return new AlbumDetailsResponse(
            album.Id,
            album.Title,
            album.ReleaseDate,
            album.DurationSeconds,

            new ArtistSummary(
                album.Artist.Id,
                album.Artist.Name
            ),

            album.Genres
                .Select(g => new GenreSummary(g.Id, g.Name))
                .ToList(),

            album.Tracks
                .OrderBy(t => t.Number)
                .Select(t => new TrackResponse(
                    t.Id,
                    t.Title,
                    t.DurationSeconds,
                    t.Number
                )).ToList(),

            album.Reviews
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewResponse(
                    r.Id,
                    r.Rating.Value,
                    r.Comment,
                    r.CreatedAt
                )).ToList()
        );
    }
}
