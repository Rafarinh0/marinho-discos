using MarinhoDiscos.Domain.Entities;

namespace MarinhoDiscos.Domain.Repositories;

public interface IGenreRepository
{
    Task<List<Genre>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken ct = default);
    Task<List<Genre>> GetAllAsync(CancellationToken ct = default);
    Task<List<Genre>> GetByNamesAsync(IEnumerable<string> names, CancellationToken ct);
    Task AddAsync(Genre genre, CancellationToken ct);
}