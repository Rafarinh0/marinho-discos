using MarinhoDiscos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarinhoDiscos.Infrastructure.Persistence.Configurations;

public class GenreConfiguration
{
    public void Configure(EntityTypeBuilder<Genre> builder)
    {
        builder.ToTable("Genres");
        builder.HasKey(g => g.Id);

        builder.Property(g => g.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasMany(g => g.Albums)
            .WithMany(a => a.Genres)
            .UsingEntity<Dictionary<string, object>>(
                "AlbumGenres",
                j => j.HasOne<Album>().WithMany().HasForeignKey("AlbumId"),
                j => j.HasOne<Genre>().WithMany().HasForeignKey("GenreId")
            );
    }
}