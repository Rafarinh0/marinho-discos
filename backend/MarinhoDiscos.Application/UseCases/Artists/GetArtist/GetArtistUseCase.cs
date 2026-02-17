using MarinhoDiscos.Application.DTOs.Artists;
using MarinhoDiscos.Domain.Repositories;

namespace MarinhoDiscos.Application.UseCases.Artists.CreateArtist;

//won't use unit of work as it doesn't change any state
public class GetArtistsUseCase
{
    private readonly IArtistRepository _artistRepository;

    public GetArtistsUseCase(IArtistRepository artistRepository)
    {
        _artistRepository = artistRepository;
    }

    public async Task<List<GetArtistResponse>> GetAllArtists(CancellationToken ct = default)
    {
        var artists = await _artistRepository.GetAllAsync(ct);

        return artists
            .Select(a => new GetArtistResponse(a.Id, a.Name))
            .ToList();
    }
}