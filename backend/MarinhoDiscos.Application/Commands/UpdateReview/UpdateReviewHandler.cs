using MarinhoDiscos.Application.Common.Errors;
using MarinhoDiscos.Application.Common.Exceptions;
using MarinhoDiscos.Domain.Exceptions;
using MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Domain.ValueObjects;
using MediatR;

namespace MarinhoDiscos.Application.Commands.UpdateReview;

public class UpdateReviewHandler : IRequestHandler<UpdateReviewCommand>
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateReviewHandler(IReviewRepository reviewRepository, IUnitOfWork unitOfWork)
    {
        _reviewRepository = reviewRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(UpdateReviewCommand request, CancellationToken ct)
    {
        var review = await _reviewRepository.GetByIdAsync(request.ReviewId, ct);
        if (review is null)
            throw new NotFoundException(
                "review_not_found",
                $"Review '{request.ReviewId}' was not found");

        Rating rating;
        try
        {
            rating = new Rating(request.Rating);
        }
        catch (DomainException ex)
        {
            throw new ConflictException(ErrorCodes.InvalidRating, ex.Message);
        }

        review.Update(rating, request.Comment);

        await _unitOfWork.SaveChangesAsync(ct);
    }
}