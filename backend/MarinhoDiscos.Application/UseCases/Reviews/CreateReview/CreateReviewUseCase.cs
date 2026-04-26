using MarinhoDiscos.Application.Common.Errors;
using MarinhoDiscos.Application.Common.Exceptions;
using MarinhoDiscos.Application.DTOs.Reviews;
using MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.Exceptions;
using MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Domain.ValueObjects;

namespace MarinhoDiscos.Application.UseCases.Reviews.CreateReview;

public class CreateReviewUseCase
{
    private readonly IAlbumRepository _albumRepository;
    private readonly IReviewRepository _reviewRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateReviewUseCase(
        IAlbumRepository albumRepository,
        IReviewRepository reviewRepository,
        IUnitOfWork unitOfWork)
    {
        _albumRepository = albumRepository;
        _reviewRepository = reviewRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> ExecuteAsync(
        Guid albumId,
        CreateReviewRequest request,
        CancellationToken ct)
    {
        if (!await _albumRepository.ExistsByIdAsync(albumId, ct))
            throw new NotFoundException(
                ErrorCodes.AlbumNotFound,
                $"Album '{albumId}' was not found");

        Rating rating;
        try
        {
            rating = new Rating(request.Rating);
        }
        catch (DomainException ex)
        {
            throw new ConflictException(ErrorCodes.InvalidRating, ex.Message);
        }

        var review = new Review(albumId, rating, request.Comment);

        await _reviewRepository.AddAsync(review, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return review.Id;
    }
}
