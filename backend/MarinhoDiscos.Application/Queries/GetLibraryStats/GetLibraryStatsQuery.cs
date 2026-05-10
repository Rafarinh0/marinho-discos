using MarinhoDiscos.Application.DTOs.Stats;
using MediatR;

namespace MarinhoDiscos.Application.Queries.GetLibraryStats;

public record GetLibraryStatsQuery() : IRequest<LibraryStatsResponse>;
