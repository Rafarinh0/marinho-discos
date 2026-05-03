using MediatR;

namespace MarinhoDiscos.Application.Commands.Reviews;

public record CreateReviewCommand(
    Guid AlbumId,
    int Rating,
    string? Comment
) : IRequest<Guid>;