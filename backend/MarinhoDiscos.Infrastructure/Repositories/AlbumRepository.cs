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

    public async Task<(IReadOnlyList<AlbumListItem> Items, int Total)> GetPagedAsync(
        int page,
        int pageSize,
        Guid? artistId,
        Guid? genreId,
        CancellationToken ct)
    {
        var query = _context.Albums.AsNoTracking();

        if (artistId.HasValue)
            query = query.Where(a => a.ArtistId == artistId.Value);

        if (genreId.HasValue)
            query = query.Where(a => a.Genres.Any(g => g.Id == genreId.Value));

        var total = await query.CountAsync(ct);

        var items = await query
            .OrderBy(a => a.Title)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new AlbumListItem(
                a.Id,
                a.Title,
                a.ReleaseDate,
                a.Artist.Name,
                a.Tracks.Count
            ))
            .ToListAsync(ct);

        return (items, total);
    }
}