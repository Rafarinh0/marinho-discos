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
}
