using MarinhoDiscos.Domain.Entities;

namespace MarinhoDiscos.Domain.Repositories;

public interface IGenreRepository
{
    Task<List<Genre>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken ct = default);
}