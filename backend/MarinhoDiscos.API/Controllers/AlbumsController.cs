using MarinhoDiscos.Application.DTOs.Albums;
using MarinhoDiscos.Application.UseCases.Albums.CreateAlbum;
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
        mediator = _mediator;
        _createAlbumUseCase = createAlbumUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAlbumRequest request, CancellationToken ct)
    {
        var id = await _createAlbumUseCase.ExecuteAsync(request, ct);
        return Created($"/api/albums/{id}", new { id });
    }
}