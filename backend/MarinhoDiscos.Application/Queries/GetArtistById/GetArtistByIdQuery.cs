using MarinhoDiscos.Application.DTOs.Artists;
using MediatR;

namespace MarinhoDiscos.Application.Queries.GetArtistById;

public record GetArtistByIdQuery(Guid ArtistId) : IRequest<GetArtistResponse>;
