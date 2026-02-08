namespace MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Domain.Entities;

public interface IArtistRepository
{
    Task<Artist?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(Artist artist, CancellationToken ct = default);
    Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default);
}