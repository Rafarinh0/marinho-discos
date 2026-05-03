namespace MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Domain.Entities;

public interface IReviewRepository
{
    Task AddAsync(Review review, CancellationToken ct = default);
    Task<Review?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<(IReadOnlyList<Review> Items, int Total)> GetPagedByAlbumIdAsync(
        Guid albumId,
        int page,
        int pageSize,
        CancellationToken ct);
    void Remove(Review review);
}
