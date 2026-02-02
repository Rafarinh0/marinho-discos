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

    public async Task AddAsync(Album album)
    {
        await _context.Set<Album>().AddAsync(album);
    }
}