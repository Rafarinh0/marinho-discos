using MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MarinhoDiscos.Infrastructure.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly MarinhoDiscosDbContext _context;

    public ReviewRepository(MarinhoDiscosDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Review review, CancellationToken ct = default)
    {
        await _context.Set<Review>().AddAsync(review, ct);
    }

    public async Task<Review?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _context.Set<Review>().FindAsync(new object[] { id }, ct);
    }

    public async Task<IReadOnlyList<Review>> GetByAlbumIdAsync(Guid albumId, CancellationToken ct)
    {
        return await _context.Set<Review>()
            .AsNoTracking()
            .Where(r => r.AlbumId == albumId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(ct);
    }
    
    public async Task<(IReadOnlyList<Review> Items, int Total)> GetPagedByAlbumIdAsync(
        Guid albumId,
        int page,
        int pageSize,
        CancellationToken ct)
    {
        var query = _context.Set<Review>()
            .AsNoTracking()
            .Where(r => r.AlbumId == albumId);

        var total = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
        
        return (items, total);
    }
}
