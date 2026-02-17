using MarinhoDiscos.Application.DTOs.Albums;
using MarinhoDiscos.Application.UseCases.Albums.CreateAlbum;
using Microsoft.AspNetCore.Mvc;

namespace MarinhoDiscos.API.Controllers;

[ApiController]
[Route("api/albums")]
public class AlbumsController : ControllerBase
{
    private readonly CreateAlbumUseCase _createAlbumUseCase;
    
    public AlbumsController(CreateAlbumUseCase createAlbumUseCase)
    {
        _createAlbumUseCase = createAlbumUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateAlbumRequest request, CancellationToken ct)
    {
        var id = await _createAlbumUseCase.ExecuteAsync(request, ct);
        return Created($"/api/albums/{id}", new { id });
    }
}