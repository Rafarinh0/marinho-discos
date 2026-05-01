using MarinhoDiscos.Application.ExternalCatalog;
using MarinhoDiscos.Application.ExternalCatalog.DTOs;
using MediatR;

namespace MarinhoDiscos.Application.Queries.SearchExternalAlbums;

public class SearchExternalAlbumsHandler
    : IRequestHandler<SearchExternalAlbumsQuery, IReadOnlyList<ExternalAlbumSummary>>
{
    private readonly IMusicCatalogClient _catalog;

    public SearchExternalAlbumsHandler(IMusicCatalogClient catalog)
    {
        _catalog = catalog;
    }

    public Task<IReadOnlyList<ExternalAlbumSummary>> Handle(
        SearchExternalAlbumsQuery request,
        CancellationToken ct)
    {
        return _catalog.SearchAlbumsAsync(request.Query, request.Limit, ct);
    }
}