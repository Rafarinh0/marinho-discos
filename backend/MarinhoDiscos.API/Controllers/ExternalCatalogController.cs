using MarinhoDiscos.Application.Commands.ImportExternalAlbum;
using MarinhoDiscos.Application.Queries.SearchExternalAlbums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MarinhoDiscos.API.Controllers;

[ApiController]
[Route("api/external-catalog")]
public class ExternalCatalogController : ControllerBase
{
    private readonly IMediator _mediator;

    public ExternalCatalogController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("albums")]
    public async Task<IActionResult> SearchAlbums(
        [FromQuery] string query,
        [FromQuery] int limit = 10,
        CancellationToken ct = default)
    {
        var results = await _mediator.Send(new SearchExternalAlbumsQuery(query, limit), ct);
        return Ok(results);
    }
    
    [HttpPost("albums/{externalId}/import")]
    public async Task<IActionResult> ImportAlbum(
        string externalId,
        CancellationToken ct)
    {
        var albumId = await _mediator.Send(
            new ImportExternalAlbumCommand(externalId), ct);
        return Created($"/api/albums/{albumId}", new { id = albumId });
    }
}