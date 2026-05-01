using MarinhoDiscos.Application.Commands.ImportExternalAlbum;
using MarinhoDiscos.Application.DTOs.Reviews;
using MarinhoDiscos.Application.UseCases.Reviews.CreateReview;
using MediatR;

namespace MarinhoDiscos.Application.Commands.CreateReviewForExternalAlbum;

public class CreateReviewForExternalAlbumHandler
    : IRequestHandler<CreateReviewForExternalAlbumCommand, CreateReviewForExternalAlbumResponse>
{
    private readonly IMediator _mediator;
    private readonly CreateReviewUseCase _createReview;

    public CreateReviewForExternalAlbumHandler(
        IMediator mediator,
        CreateReviewUseCase createReview)
    {
        _mediator = mediator;
        _createReview = createReview;
    }

    public async Task<CreateReviewForExternalAlbumResponse> Handle(
        CreateReviewForExternalAlbumCommand request,
        CancellationToken ct)
    {
       var albumId = await _mediator.Send(
            new ImportExternalAlbumCommand(request.ExternalId, request.Source),
            ct);

        //create review using existing use case
        var reviewRequest = new CreateReviewRequest(request.Rating, request.Comment);
        var reviewId = await _createReview.ExecuteAsync(albumId, reviewRequest, ct);

        return new CreateReviewForExternalAlbumResponse(albumId, reviewId);
    }
}