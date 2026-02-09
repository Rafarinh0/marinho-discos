using MarinhoDiscos.Application.DTOs.Artists;
using MarinhoDiscos.Application.UseCases.Artists.CreateArtist;
using Microsoft.AspNetCore.Mvc;

namespace MarinhoDiscos.API.Controllers;

[ApiController]
[Route("api/artists")]
public class ArtistsController : ControllerBase
{
    private readonly CreateArtistUseCase _createArtistUseCase;
    private readonly GetArtistsUseCase _getArtistsUseCase;
    
    public ArtistsController(
        CreateArtistUseCase createArtistUseCase,  
        GetArtistsUseCase getArtistsUseCase)
    {
        _createArtistUseCase = createArtistUseCase;
        _getArtistsUseCase = getArtistsUseCase;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateArtistRequest request, CancellationToken ct)
    {
        var id = await _createArtistUseCase.CreateArtist(request, ct);
        return Created($"/api/artists/{id}", new { id });
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var artists = await _getArtistsUseCase.GetAllArtists(ct);
        return Ok(artists);
    }
}