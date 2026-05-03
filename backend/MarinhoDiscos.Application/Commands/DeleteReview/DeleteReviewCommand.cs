using MediatR;

namespace MarinhoDiscos.Application.Commands.DeleteReview;

public record DeleteReviewCommand(Guid ReviewId) : IRequest;