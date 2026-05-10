using FluentValidation;
using MarinhoDiscos.Application;
using MarinhoDiscos.Application.Common.Behaviors;
using Microsoft.EntityFrameworkCore;
using MarinhoDiscos.Infrastructure.Persistence;
using MarinhoDiscos.Infrastructure.Repositories;
using MarinhoDiscos.Domain.Repositories;
using MediatR;

try
{
    var builder = WebApplication.CreateBuilder(args);

    var connectionString = builder.Configuration.GetConnectionString("Default")
        ?? throw new InvalidOperationException("Connection string 'Default' não foi encontrada.");

    builder.Services.AddDbContext<MarinhoDiscosDbContext>(opt =>
        opt.UseNpgsql(connectionString));
    
    builder.Services.AddMediatR(cfg =>
        cfg.RegisterServicesFromAssembly(typeof(ApplicationAssemblyReference).Assembly));

    builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();
    builder.Services.AddScoped<IArtistRepository, ArtistRepository>();
    builder.Services.AddScoped<IGenreRepository, GenreRepository>();
    builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
    builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
    
    //MusicBrainz
    builder.Services.Configure<MarinhoDiscos.Infrastructure.ExternalCatalog.MusicBrainz.MusicBrainzOptions>(
        builder.Configuration.GetSection(
            MarinhoDiscos.Infrastructure.ExternalCatalog.MusicBrainz.MusicBrainzOptions.SectionName));

    builder.Services
        .AddHttpClient<
            MarinhoDiscos.Application.ExternalCatalog.IMusicCatalogClient,
            MarinhoDiscos.Infrastructure.ExternalCatalog.MusicBrainz.MusicBrainzClient>(
            (sp, http) =>
            {
                var opts = sp.GetRequiredService<
                    Microsoft.Extensions.Options.IOptions<
                        MarinhoDiscos.Infrastructure.ExternalCatalog.MusicBrainz.MusicBrainzOptions>>().Value;

                http.BaseAddress = new Uri(opts.BaseUrl);
                http.DefaultRequestHeaders.UserAgent.ParseAdd(opts.UserAgent);
            });
    builder.Services.AddValidatorsFromAssembly(typeof(ApplicationAssemblyReference).Assembly);
    builder.Services.AddTransient(
        typeof(IPipelineBehavior<,>),
        typeof(ValidationBehavior<,>));
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddHealthChecks();

    var app = builder.Build();
    
    //apply pending migrations, can be separated in a pipeline later
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider
            .GetRequiredService<MarinhoDiscosDbContext>();
        await db.Database.MigrateAsync();
    }

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseMiddleware<ExceptionMiddleware>();
    app.MapControllers();
    app.MapHealthChecks("/health");
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine("Erro durante a inicialização:");
    Console.WriteLine(ex.ToString());
    Console.WriteLine("Pressione Enter para sair...");
    Console.ReadLine();
    throw;
}

namespace MarinhoDiscos.API
{
    public partial class Program { }
}