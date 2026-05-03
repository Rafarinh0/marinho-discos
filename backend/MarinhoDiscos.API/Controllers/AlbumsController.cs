using MarinhoDiscos.Application.DTOs.Reviews;
using MarinhoDiscos.Application.Queries.GetAlbumById;
using MarinhoDiscos.Application.Queries.ListAlbums;
using MarinhoDiscos.Application.UseCases.Reviews.CreateReview;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MarinhoDiscos.API.Controllers;

[ApiController]
[Route("api/albums")]
public class AlbumsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AlbumsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetAlbumByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] Guid? artistId = null,
        [FromQuery] Guid? genreId = null,
        CancellationToken ct = default)
    {
        var result = await _mediator.Send(
            new ListAlbumsQuery(page, pageSize, artistId, genreId),
            ct);
        return Ok(result);
    }

    [HttpPost("{id}/reviews")]
    public async Task<IActionResult> AddReview(
        Guid id,
        [FromBody] CreateReviewRequest request,
        [FromServices] CreateReviewUseCase useCase,
        CancellationToken ct)
    {
        var reviewId = await useCase.ExecuteAsync(id, request, ct);
        return Created($"/api/albums/{id}/reviews/{reviewId}", new { id = reviewId });
    }
}
