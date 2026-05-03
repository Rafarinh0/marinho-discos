using MarinhoDiscos.Application.Common.Errors;
using MarinhoDiscos.Application.Common.Exceptions;
using MarinhoDiscos.Application.Common.Pagination;
using MarinhoDiscos.Application.DTOs.Albums;
using MarinhoDiscos.Domain.Repositories;
using MediatR;

namespace MarinhoDiscos.Application.Queries.ListAlbumReviews;

public class ListAlbumReviewsHandler : IRequestHandler<ListAlbumReviewsQuery
    , PagedResult<ReviewResponse>>
{
    private readonly IAlbumRepository _albumRepository;
    private readonly IReviewRepository _reviewRepository;

    public ListAlbumReviewsHandler(
        IAlbumRepository albumRepository,
        IReviewRepository reviewRepository)
    {
        _albumRepository = albumRepository;
        _reviewRepository = reviewRepository;
    }

    public async Task<PagedResult<ReviewResponse>> Handle(
        ListAlbumReviewsQuery request,
        CancellationToken ct)
    {
        if (!await _albumRepository.ExistsByIdAsync(request.AlbumId, ct)) 
            throw new NotFoundException(ErrorCodes.AlbumNotFound, 
                $"Album '{request.AlbumId}' was not found");

        var (items, total) = await _reviewRepository.GetPagedByAlbumIdAsync(
            request.AlbumId, request.Page, request.PageSize, ct);

        var responses = items
            .Select(r => new ReviewResponse(
                r.Id, r.Rating.Value, r.Comment, r.CreatedAt)
            )
            .ToList();
        
        return new PagedResult<ReviewResponse>(responses, total, request.Page, request.PageSize);
    } 
}