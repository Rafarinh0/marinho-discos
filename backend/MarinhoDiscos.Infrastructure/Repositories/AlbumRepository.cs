using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Infrastructure.Persistence;

namespace MarinhoDiscos.Infrastructure.Repositories;

public class AlbumRepository : IAlbumRepository
{
    private readonly MarinhoDiscosDbContext _context;

    public AlbumRepository(MarinhoDiscosDbContext context)
    {
        _context = context;
    }

    public async Task<Album?> GetByIdAsync(Guid id)
    {
        return await _context.Set<Album>().FindAsync(id);
    }

    public async Task AddAsync(Album album, CancellationToken ct = default)
    {
        await _context.Set<Album>().AddAsync(album, ct);
    }
    
    public async Task<Album?> GetDetailsByIdAsync(Guid id, CancellationToken ct)
    {
        return await _context.Albums
            .AsNoTracking()
            .Include(a => a.Artist)
            .Include(a => a.Genres)
            .Include(a => a.Tracks.OrderBy(t => t.Number))
            .Include(a => a.Reviews)
            .FirstOrDefaultAsync(a => a.Id == id, ct);
    }

}