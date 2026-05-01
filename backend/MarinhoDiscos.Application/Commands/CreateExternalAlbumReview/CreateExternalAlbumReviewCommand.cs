using MarinhoDiscos.Domain.Entities;
using MediatR;

namespace MarinhoDiscos.Application.Commands;

public record CreateReviewForExternalAlbumCommand(
    string ExternalId,
    int Rating,
    string? Comment,
    ExternalSource Source = ExternalSource.MusicBrainz
) : IRequest<CreateReviewForExternalAlbumResponse>;

public record CreateReviewForExternalAlbumResponse(
    Guid AlbumId,
    Guid ReviewId
);