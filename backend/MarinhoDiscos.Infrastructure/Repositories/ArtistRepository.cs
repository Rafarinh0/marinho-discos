using MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MarinhoDiscos.Infrastructure.Repositories;

public class ArtistRepository : IArtistRepository
{
    private readonly MarinhoDiscosDbContext _context;

    public ArtistRepository(MarinhoDiscosDbContext context)
    {
        _context = context;
    }

    public async Task<Artist?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var artist = await _context.Artists
            .FirstOrDefaultAsync(a => a.Id == id, ct);

        return artist;
    }
    
    public async Task AddAsync(Artist artist, CancellationToken ct = default)
    {
        await _context.Artists.AddAsync(artist, ct);
    }

    public async Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default)
    {
        return await _context.Artists
            .AnyAsync(a => a.Name.ToLower() == name.ToLower(), ct);
    }

    public async Task<List<Artist>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.Artists.AsNoTracking().OrderBy(a => a.Name).ToListAsync(ct);
    }
    
    public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Artists.AnyAsync(a => a.Id == id, ct);
    }
}