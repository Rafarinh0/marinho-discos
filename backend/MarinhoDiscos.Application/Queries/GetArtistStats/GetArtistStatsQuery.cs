using MarinhoDiscos.Application.DTOs.Stats;
using MediatR;

namespace MarinhoDiscos.Application.Queries.GetArtistStats;

public record GetArtistStatsQuery(Guid ArtistId) : IRequest<ArtistStatsResponse>;
