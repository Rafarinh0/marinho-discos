using MarinhoDiscos.Application.DTOs.Artists;
using MarinhoDiscos.Application.Queries.GetArtistById;
using MarinhoDiscos.Application.UseCases.Artists.CreateArtist;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MarinhoDiscos.API.Controllers;

[ApiController]
[Route("api/artists")]
public class ArtistsController : ControllerBase
{
    private readonly CreateArtistUseCase _createArtistUseCase;
    private readonly GetArtistsUseCase _getArtistsUseCase;
    private readonly IMediator _mediator;

    public ArtistsController(
        CreateArtistUseCase createArtistUseCase,
        GetArtistsUseCase getArtistsUseCase,
        IMediator mediator)
    {
        _createArtistUseCase = createArtistUseCase;
        _getArtistsUseCase = getArtistsUseCase;
        _mediator = mediator;
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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetArtistByIdQuery(id), ct);
        return Ok(result);
    }
}
