using MarinhoDiscos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarinhoDiscos.Infrastructure.Persistence.Configurations;

public class ArtistConfiguration : IEntityTypeConfiguration<Artist>
{
    public void Configure(EntityTypeBuilder<Artist> builder)
    {
        builder.ToTable("Artists");
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);
        
        builder.Property(e => e.Country)
            .HasMaxLength(100)
            .IsRequired(false);
        
        builder.HasMany(a => a.Albums)
            .WithOne(a => a.Artist)
            .HasForeignKey(a => a.ArtistId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.Property(a => a.ExternalId)
            .HasMaxLength(100);

        builder.Property(a => a.Source)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasIndex(a => new { a.ExternalId, a.Source })
            .IsUnique()
            .HasFilter("\"ExternalId\" IS NOT NULL");
    }
}