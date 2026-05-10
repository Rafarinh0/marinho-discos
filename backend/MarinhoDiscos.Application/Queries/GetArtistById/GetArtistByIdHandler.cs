using MarinhoDiscos.Application.Common.Errors;
using MarinhoDiscos.Application.Common.Exceptions;
using MarinhoDiscos.Application.DTOs.Artists;
using MarinhoDiscos.Domain.Repositories;
using MediatR;

namespace MarinhoDiscos.Application.Queries.GetArtistById;

public class GetArtistByIdHandler
    : IRequestHandler<GetArtistByIdQuery, GetArtistResponse>
{
    private readonly IArtistRepository _artistRepository;

    public GetArtistByIdHandler(IArtistRepository artistRepository)
    {
        _artistRepository = artistRepository;
    }

    public async Task<GetArtistResponse> Handle(
        GetArtistByIdQuery request,
        CancellationToken ct)
    {
        var artist = await _artistRepository.GetByIdAsync(request.ArtistId, ct);
        if (artist is null)
            throw new NotFoundException(
                ErrorCodes.ArtistNotFound,
                $"Artist '{request.ArtistId}' was not found");

        return new GetArtistResponse(artist.Id, artist.Name, artist.ExternalId);
    }
}
