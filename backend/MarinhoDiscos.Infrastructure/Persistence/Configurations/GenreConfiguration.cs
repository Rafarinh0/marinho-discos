using MarinhoDiscos.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MarinhoDiscos.Infrastructure.Persistence.Configurations;

public class GenreConfiguration
{
    public void Configure(EntityTypeBuilder<Genre> builder)
    {
        builder.HasKey(g => g.Id);

        builder.Property(g => g.Name)
            .IsRequired()
            .HasMaxLength(100);
    }
}