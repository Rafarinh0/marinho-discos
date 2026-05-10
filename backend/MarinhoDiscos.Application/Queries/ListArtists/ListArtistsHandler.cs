using MarinhoDiscos.Application.DTOs.Artists;
using MarinhoDiscos.Domain.Repositories;
using MediatR;

namespace MarinhoDiscos.Application.Queries.ListArtists;

public class ListArtistsHandler : IRequestHandler<ListArtistsQuery, List<GetArtistResponse>>
{
    private readonly IArtistRepository _artistRepository;

    public ListArtistsHandler(IArtistRepository artistRepository)
    {
        _artistRepository = artistRepository;
    }

    public async Task<List<GetArtistResponse>> Handle(ListArtistsQuery request, CancellationToken ct)
    {
        var artists = await _artistRepository.GetAllAsync(ct);
        return artists.Select(a => new GetArtistResponse(a.Id, a.Name, a.ExternalId)).ToList();
    }
}