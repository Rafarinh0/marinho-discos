using MediatR;

namespace MarinhoDiscos.Application.Commands.UpdateReview;

public record UpdateReviewCommand(
    Guid ReviewId,
    int Rating,
    string? Comment
) : IRequest;