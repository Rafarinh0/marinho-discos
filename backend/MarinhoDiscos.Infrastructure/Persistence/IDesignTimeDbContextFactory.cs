using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.EnvironmentVariables;

namespace MarinhoDiscos.Infrastructure.Persistence;

public class MarinhoDiscosDbContextFactory
    : IDesignTimeDbContextFactory<MarinhoDiscosDbContext>
{
    public MarinhoDiscosDbContext CreateDbContext(string[] args)
    {
        var basePath = Directory.GetCurrentDirectory();

        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<MarinhoDiscosDbContext>();

        optionsBuilder.UseNpgsql(
            configuration.GetConnectionString("Default"),
            npgsql =>
            {
                npgsql.MigrationsAssembly("MarinhoDiscos.Infrastructure");
            });

        return new MarinhoDiscosDbContext(optionsBuilder.Options);
    }
}
