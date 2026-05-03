using MarinhoDiscos.Application.Common.Errors;
using MarinhoDiscos.Application.Common.Exceptions;
using MarinhoDiscos.Domain.Repositories;
using MediatR;

namespace MarinhoDiscos.Application.Commands.DeleteReview;

public class DeleteReviewHandler : IRequestHandler<DeleteReviewCommand>
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteReviewHandler(IReviewRepository reviewRepository, IUnitOfWork unitOfWork)
    {
        _reviewRepository = reviewRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(DeleteReviewCommand request, CancellationToken ct)
    {
        var review = await _reviewRepository.GetByIdAsync(request.ReviewId, ct);
        if (review is null)
            throw new NotFoundException(
                ErrorCodes.ReviewNotFound,
                $"Review '{request.ReviewId}' was not found");

        _reviewRepository.Remove(review);
        await _unitOfWork.SaveChangesAsync(ct);
    }
}