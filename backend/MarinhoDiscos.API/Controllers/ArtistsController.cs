using MarinhoDiscos.Application.Queries.GetArtistById;
using MarinhoDiscos.Application.UseCases.Artists.CreateArtist;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MarinhoDiscos.API.Controllers;

[ApiController]
[Route("api/artists")]
public class ArtistsController : ControllerBase
{
    private readonly GetArtistsUseCase _getArtistsUseCase;
    private readonly IMediator _mediator;

    public ArtistsController(
        GetArtistsUseCase getArtistsUseCase,
        IMediator mediator)
    {
        _getArtistsUseCase = getArtistsUseCase;
        _mediator = mediator;
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
