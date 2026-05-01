using MarinhoDiscos.Application.ExternalCatalog.DTOs;
using MediatR;

namespace MarinhoDiscos.Application.Queries.SearchExternalAlbums;

public record SearchExternalAlbumsQuery(string Query, int Limit = 10)
    : IRequest<IReadOnlyList<ExternalAlbumSummary>>;