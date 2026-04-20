using MarinhoDiscos.Application.Common.Pagination;
using MarinhoDiscos.Application.DTOs.Albums;
using MarinhoDiscos.Domain.Repositories;
using MediatR;

namespace MarinhoDiscos.Application.Queries.ListAlbums;

public class ListAlbumsHandler
    : IRequestHandler<ListAlbumsQuery, PagedResult<AlbumListItemResponse>>
{
    private readonly IAlbumRepository _albumRepository;

    public ListAlbumsHandler(IAlbumRepository albumRepository)
    {
        _albumRepository = albumRepository;
    }

    public async Task<PagedResult<AlbumListItemResponse>> Handle(
        ListAlbumsQuery request,
        CancellationToken ct)
    {
        var (items, total) = await _albumRepository.GetPagedAsync(
            request.Page,
            request.PageSize,
            request.ArtistId,
            request.GenreId,
            ct);

        var responses = items
            .Select(i => new AlbumListItemResponse(
                i.Id,
                i.Title,
                i.ReleaseDate,
                i.ArtistName,
                i.TrackCount))
            .ToList();

        return new PagedResult<AlbumListItemResponse>(
            responses,
            total,
            request.Page,
            request.PageSize);
    }
}
