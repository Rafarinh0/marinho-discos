using MarinhoDiscos.Application.DTOs.Albums;
using MarinhoDiscos.Application.DTOs.Reviews;
using MarinhoDiscos.Application.Queries.GetAlbumById;
using MarinhoDiscos.Application.Queries.ListAlbums;
using MarinhoDiscos.Application.UseCases.Albums.CreateAlbum;
using MarinhoDiscos.Application.UseCases.Reviews.CreateReview;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MarinhoDiscos.API.Controllers;

[ApiController]
[Route("api/albums")]
public class AlbumsController : ControllerBase
{
    private readonly CreateAlbumUseCase _createAlbumUseCase;
    private readonly IMediator _mediator;
    
  public AlbumsController(IMediator mediator, CreateAlbumUseCase createAlbumUseCase)
  {
      _mediator = mediator;
      _createAlbumUseCase = createAlbumUseCase;
  }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAlbumRequest request, CancellationToken ct)
    {
        var id = await _createAlbumUseCase.ExecuteAsync(request, ct);
        return Created($"/api/albums/{id}", new { id });
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