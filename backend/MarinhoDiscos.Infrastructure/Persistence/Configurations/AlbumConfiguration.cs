using MarinhoDiscos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarinhoDiscos.Infrastructure.Persistence.Configurations;

public class AlbumConfiguration : IEntityTypeConfiguration<Album>
{
    public void Configure(EntityTypeBuilder<Album> builder)
    {
        builder.ToTable("Albums");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.ReleaseDate)
            .IsRequired();

        builder.HasOne(a => a.Artist)
            .WithMany(ar => ar.Albums)
            .HasForeignKey(a => a.ArtistId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(a => a.Tracks)
            .WithOne(t => t.Album)
            .HasForeignKey(t => t.AlbumId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(a => a.Reviews)
            .WithOne(r => r.Album)
            .HasForeignKey(r => r.AlbumId);
        
        builder
            .HasMany(a => a.Genres)
            .WithMany(g => g.Albums)
            .UsingEntity<Dictionary<string, object>>(
                "AlbumGenres",
                j => j
                    .HasOne<Genre>()
                    .WithMany()
                    .HasForeignKey("GenreId"),
                j => j
                    .HasOne<Album>()
                    .WithMany()
                    .HasForeignKey("AlbumId"),
                j =>
                {
                    j.HasKey("AlbumId", "GenreId");
                });
        
    }
}