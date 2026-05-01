using MarinhoDiscos.Application.ExternalCatalog.DTOs;

namespace MarinhoDiscos.Application.ExternalCatalog;

public interface IMusicCatalogClient
{
    Task<IReadOnlyList<ExternalAlbumSummary>> SearchAlbumsAsync(
        string query,
        int limit,
        CancellationToken ct
    );
    
    Task<ExternalAlbumDetails> GetAlbumDetailsAsync(
        string externalId,
        CancellationToken ct
    );
}