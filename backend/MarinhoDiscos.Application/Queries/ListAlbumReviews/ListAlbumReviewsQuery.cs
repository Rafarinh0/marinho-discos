using MarinhoDiscos.Application.Common.Pagination;
using MarinhoDiscos.Application.DTOs.Albums;
using MediatR;

namespace MarinhoDiscos.Application.Queries.ListAlbumReviews;

public record ListAlbumReviewsQuery(
    Guid AlbumId,
    int Page = 1,
    int PageSize = 10
) : IRequest<PagedResult<ReviewResponse>>;