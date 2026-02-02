using Microsoft.EntityFrameworkCore;
using MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.ValueObjects;

namespace MarinhoDiscos.Infrastructure.Persistence;

public class MarinhoDiscosDbContext : DbContext
{
	public MarinhoDiscosDbContext(DbContextOptions options)
		: base(options) { }
	
	public DbSet<Album> Albums => Set<Album>();
	public DbSet<Artist> Artists => Set<Artist>();
	public DbSet<Track> Tracks => Set<Track>();
	public DbSet<Genre> Genres => Set<Genre>();
	public DbSet<Review> Reviews => Set<Review>();
	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(MarinhoDiscosDbContext).Assembly);
    }
}