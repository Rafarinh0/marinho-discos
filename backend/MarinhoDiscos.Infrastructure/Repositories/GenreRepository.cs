using MarinhoDiscos.Infrastructure.Persistence;

namespace MarinhoDiscos.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.Repositories;

public class GenreRepository : IGenreRepository
{
    private readonly MarinhoDiscosDbContext _context;

    public GenreRepository(MarinhoDiscosDbContext context)
    {
        _context = context;
    }

    public async Task<List<Genre>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken ct = default)
    {
        return await _context.Genres
            .Where(g => ids.Contains(g.Id))
            .ToListAsync(ct);
    }
}
