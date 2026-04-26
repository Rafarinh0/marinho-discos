namespace MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Domain.Entities;

public interface IReviewRepository
{
    Task AddAsync(Review review, CancellationToken ct = default);
    Task<Review?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<IReadOnlyList<Review>> GetByAlbumIdAsync(Guid albumId, CancellationToken ct);
}
