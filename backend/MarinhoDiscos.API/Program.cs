using MarinhoDiscos.Application.UseCases.Artists.CreateArtist;
using Microsoft.EntityFrameworkCore;
using MarinhoDiscos.Infrastructure.Persistence;
using MarinhoDiscos.Infrastructure.Repositories;
using MarinhoDiscos.Domain.Repositories;

try
{
    var builder = WebApplication.CreateBuilder(args);

    var connectionString = builder.Configuration.GetConnectionString("Default")
        ?? throw new InvalidOperationException("Connection string 'Default' não foi encontrada.");

    builder.Services.AddDbContext<MarinhoDiscosDbContext>(opt =>
        opt.UseNpgsql(connectionString));
    

    builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();
    builder.Services.AddScoped<IArtistRepository, ArtistRepository>();
    builder.Services.AddScoped<IGenreRepository, GenreRepository>();
    builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
    
    builder.Services.AddScoped<CreateArtistUseCase>();
    builder.Services.AddScoped<GetArtistsUseCase>();

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.MapControllers();
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