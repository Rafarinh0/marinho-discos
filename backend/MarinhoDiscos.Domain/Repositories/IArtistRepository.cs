namespace MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Domain.Entities;

public interface IArtistRepository
{
    Task<Artist?> GetByIdAsync(Guid id);
}