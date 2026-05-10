using MarinhoDiscos.Application.DTOs.Stats;
using MarinhoDiscos.Domain.Repositories;
using MediatR;

namespace MarinhoDiscos.Application.Queries.GetLibraryStats;

public class GetLibraryStatsHandler
    : IRequestHandler<GetLibraryStatsQuery, LibraryStatsResponse>
{
    private readonly IAlbumRepository _albumRepository;

    public GetLibraryStatsHandler(IAlbumRepository albumRepository)
    {
        _albumRepository = albumRepository;
    }

    public async Task<LibraryStatsResponse> Handle(
        GetLibraryStatsQuery request,
        CancellationToken ct)
    {
        var s = await _albumRepository.GetLibraryStatsAsync(ct);
        return new LibraryStatsResponse(
            s.TotalAlbums,
            s.ReviewedAlbums,
            s.TotalReviews,
            s.TotalTracks,
            s.TotalDurationSeconds,
            s.AverageRating);
    }
}
