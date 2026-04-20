using MarinhoDiscos.Application.Common.Pagination;
using MarinhoDiscos.Application.DTOs.Albums;
using MediatR;

namespace MarinhoDiscos.Application.Queries.ListAlbums;

public record ListAlbumsQuery(
    int Page = 1,
    int PageSize = 10,
    Guid? ArtistId = null,
    Guid? GenreId = null
) : IRequest<PagedResult<AlbumListItemResponse>>;