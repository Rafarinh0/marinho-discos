namespace MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Domain.Entities;

public interface IAlbumRepository
{
    Task<Album?> GetByIdAsync(Guid id);
    Task AddAsync(Album album, CancellationToken ct = default);
    Task<Album?> GetDetailsByIdAsync(Guid id, CancellationToken ct);
    Task<bool> ExistsByIdAsync(Guid id, CancellationToken ct);
    Task<(IReadOnlyList<AlbumListItem> Items, int Total)> GetPagedAsync(
        int page,
        int pageSize,
        Guid? artistId,
        Guid? genreId,
        CancellationToken ct);
    Task<Album?> GetByExternalIdAsync(string externalId, ExternalSource source, CancellationToken ct);
}

public record AlbumListItem(
    Guid Id,
    string? ExternalId,
    string Title,
    DateTime? ReleaseDate,
    string ArtistName,
    int TrackCount);