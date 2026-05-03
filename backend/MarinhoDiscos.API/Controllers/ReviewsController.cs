using MarinhoDiscos.Application.Commands.DeleteReview;
using MarinhoDiscos.Application.Commands.UpdateReview;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MarinhoDiscos.API.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReviewsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateReviewBody body,
        CancellationToken ct)
    {
        await _mediator.Send(
            new UpdateReviewCommand(id, body.Rating, body.Comment), ct);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _mediator.Send(new DeleteReviewCommand(id), ct);
        return NoContent();
    }
}

public record UpdateReviewBody(int Rating, string? Comment);