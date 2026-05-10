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

    public async Task<List<Genre>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.Genres
            .AsNoTracking()
            .OrderBy(g => g.Name)
            .ToListAsync(ct);
    }
    
    public async Task<List<Genre>> GetByNamesAsync(
        IEnumerable<string> names, CancellationToken ct)
    {
        var normalized = names.Select(n => n.ToLowerInvariant()).Distinct().ToList();

        return await _context.Genres
            .Where(g => normalized.Contains(g.Name))
            .ToListAsync(ct);
    }

    public async Task AddAsync(Genre genre, CancellationToken ct)
    {
        await _context.Set<Genre>().AddAsync(genre, ct);
    }
}
