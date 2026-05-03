using MarinhoDiscos.Application.DTOs.Artists;
using MediatR;

namespace MarinhoDiscos.Application.Queries.ListArtists;

public record ListArtistsQuery() : IRequest<List<GetArtistResponse>>;