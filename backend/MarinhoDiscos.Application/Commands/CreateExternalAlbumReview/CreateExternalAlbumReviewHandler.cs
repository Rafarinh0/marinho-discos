using MarinhoDiscos.Application.Commands.ImportExternalAlbum;
using MarinhoDiscos.Application.Commands.Reviews;
using MediatR;

namespace MarinhoDiscos.Application.Commands.CreateExternalAlbumReview;

public class CreateReviewForExternalAlbumHandler
    : IRequestHandler<CreateReviewForExternalAlbumCommand, CreateReviewForExternalAlbumResponse>
{
    private readonly IMediator _mediator;

    public CreateReviewForExternalAlbumHandler(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task<CreateReviewForExternalAlbumResponse> Handle(
        CreateReviewForExternalAlbumCommand request,
        CancellationToken ct)
    {
        var albumId = await _mediator.Send(
            new ImportExternalAlbumCommand(request.ExternalId, request.Source),
            ct);

        var reviewId = await _mediator.Send(
            new CreateReviewCommand(albumId, request.Rating, request.Comment),
            ct);

        return new CreateReviewForExternalAlbumResponse(albumId, reviewId);
    }
}
