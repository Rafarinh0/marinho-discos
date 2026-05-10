using MarinhoDiscos.Application.Common.Errors;
using MarinhoDiscos.Application.Common.Exceptions;
using MarinhoDiscos.Application.DTOs.Stats;
using MarinhoDiscos.Domain.Repositories;
using MediatR;

namespace MarinhoDiscos.Application.Queries.GetArtistStats;

public class GetArtistStatsHandler
    : IRequestHandler<GetArtistStatsQuery, ArtistStatsResponse>
{
    private readonly IArtistRepository _artistRepository;
    private readonly IAlbumRepository _albumRepository;

    public GetArtistStatsHandler(
        IArtistRepository artistRepository,
        IAlbumRepository albumRepository)
    {
        _artistRepository = artistRepository;
        _albumRepository = albumRepository;
    }

    public async Task<ArtistStatsResponse> Handle(
        GetArtistStatsQuery request,
        CancellationToken ct)
    {
        if (!await _artistRepository.ExistsByIdAsync(request.ArtistId, ct))
            throw new NotFoundException(
                ErrorCodes.ArtistNotFound,
                $"Artist '{request.ArtistId}' was not found");

        var s = await _albumRepository.GetArtistStatsAsync(request.ArtistId, ct);
        return new ArtistStatsResponse(
            s.TotalAlbums,
            s.TotalReviews,
            s.TotalTracks,
            s.TotalDurationSeconds,
            s.AverageRating);
    }
}
