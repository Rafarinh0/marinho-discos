using MarinhoDiscos.Application.Queries.GetArtistById;
using MarinhoDiscos.Application.Queries.ListArtists;
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
    public async Task<IActionResult> List(CancellationToken ct)
    {
        var result = await _mediator.Send(new ListArtistsQuery(), ct);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new GetArtistByIdQuery(id), ct);
        return Ok(result);
    }
}
