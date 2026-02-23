namespace MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Domain.Entities;

public interface IAlbumRepository
{
    Task<Album?> GetByIdAsync(Guid id);
    Task AddAsync(Album album, CancellationToken ct = default);
    Task<Album?> GetDetailsByIdAsync(Guid id, CancellationToken ct);
}