using MarinhoDiscos.Application.Common.Errors;
using MarinhoDiscos.Application.Common.Exceptions;
using MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.Exceptions;
using MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Domain.ValueObjects;
using MediatR;

namespace MarinhoDiscos.Application.Commands.Reviews;

public class CreateReviewHandler : IRequestHandler<CreateReviewCommand, Guid>
{
    private readonly IAlbumRepository _albumRepository;
    private readonly IReviewRepository _reviewRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateReviewHandler(
        IAlbumRepository albumRepository,
        IReviewRepository reviewRepository,
        IUnitOfWork unitOfWork)
    {
        _albumRepository = albumRepository;
        _reviewRepository = reviewRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateReviewCommand request, CancellationToken ct)
    {
        if (!await _albumRepository.ExistsByIdAsync(request.AlbumId, ct))
            throw new NotFoundException(
                ErrorCodes.AlbumNotFound,
                $"Album '{request.AlbumId}' was not found");

        Rating rating;
        try
        {
            rating = new Rating(request.Rating);
        }
        catch (DomainException ex)
        {
            throw new ConflictException(ErrorCodes.InvalidRating, ex.Message);
        }

        var review = new Review(request.AlbumId, rating, request.Comment);

        await _reviewRepository.AddAsync(review, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return review.Id;
    }
}
