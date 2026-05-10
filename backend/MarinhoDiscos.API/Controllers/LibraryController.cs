using MarinhoDiscos.Application.Queries.GetLibraryStats;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MarinhoDiscos.API.Controllers;

[ApiController]
[Route("api/library")]
public class LibraryController : ControllerBase
{
    private readonly IMediator _mediator;

    public LibraryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> Stats(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetLibraryStatsQuery(), ct);
        return Ok(result);
    }
}
