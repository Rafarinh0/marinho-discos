using MarinhoDiscos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarinhoDiscos.Infrastructure.Persistence.Configurations;

public class TrackConfiguration : IEntityTypeConfiguration<Track>
{
    public void Configure(EntityTypeBuilder<Track> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(t => t.DurationSeconds)
            .IsRequired();

        builder.HasOne(t => t.Album)
            .WithMany(a => a.Tracks)
            .HasForeignKey(t => t.AlbumId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}