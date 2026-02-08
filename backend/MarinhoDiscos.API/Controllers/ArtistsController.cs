using MarinhoDiscos.Application.DTOs.Artists;
using MarinhoDiscos.Application.UseCases.Artists.CreateArtist;
using Microsoft.AspNetCore.Mvc;

namespace MarinhoDiscos.API.Controllers;

[ApiController]
[Route("api/artists")]
public class ArtistsController : ControllerBase
{
    private readonly CreateArtistUseCase _useCase;
    
    public ArtistsController(CreateArtistUseCase useCase)
    {
        _useCase = useCase;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateArtistRequest request, CancellationToken ct)
    {
        var id = await _useCase.CreateArtist(request, ct);
        return Created($"/api/artists/{id}", new { id });
    }
}