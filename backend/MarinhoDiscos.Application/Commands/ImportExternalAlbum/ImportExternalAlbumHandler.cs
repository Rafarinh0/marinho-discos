using MarinhoDiscos.Application.Common.Errors;
using MarinhoDiscos.Application.Common.Exceptions;
using MarinhoDiscos.Application.ExternalCatalog;
using MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.Repositories;
using MediatR;

namespace MarinhoDiscos.Application.Commands.ImportExternalAlbum;

public class ImportAlbumFromExternalHandler
    : IRequestHandler<ImportExternalAlbumCommand, Guid>
{
    private readonly IMusicCatalogClient _catalog;
    private readonly IAlbumRepository _albumRepo;
    private readonly IArtistRepository _artistRepo;
    private readonly IGenreRepository _genreRepo;
    private readonly IUnitOfWork _uow;

    public ImportAlbumFromExternalHandler(
        IMusicCatalogClient catalog,
        IAlbumRepository albumRepo,
        IArtistRepository artistRepo,
        IGenreRepository genreRepo,
        IUnitOfWork uow)
    {
        _catalog = catalog;
        _albumRepo = albumRepo;
        _artistRepo = artistRepo;
        _genreRepo = genreRepo;
        _uow = uow;
    }

    public async Task<Guid> Handle(
        ImportExternalAlbumCommand request,
        CancellationToken ct)
    {
        //idempotence
        var existing = await _albumRepo.GetByExternalIdAsync(
            request.ExternalId, request.Source, ct);
        if (existing is not null)
            return existing.Id;

        //search external data
        var details = await _catalog.GetAlbumDetailsAsync(request.ExternalId, ct);
        if (details is null)
            throw new NotFoundException(
                ErrorCodes.ExternalAlbumNotFound,
                $"Album '{request.ExternalId}' not found in external source");

        if (string.IsNullOrEmpty(details.Artist.ExternalId))
            throw new ValidationException(
                ErrorCodes.ExternalArtistInvalid,
                "External album has no associable artist (missing external id)");

        var artist = await _artistRepo.GetByExternalIdAsync(
            details.Artist.ExternalId, request.Source, ct);

        if (artist is null)
        {
            artist = Artist.FromExternal(
                details.Artist.Name,
                details.Artist.ExternalId,
                request.Source,
                details.Artist.Country);
            await _artistRepo.AddAsync(artist, ct);
        }

        //create album and add tracks
        var album = Album.FromExternal(
            title:       details.Title,
            releaseDate: details.ReleaseDate,
            artistId:    artist.Id,
            externalId:  details.ExternalId,
            source:      request.Source);

        foreach (var t in details.Tracks)
            album.AddTrack(t.Number, t.Title, t.DurationSeconds);
        
        //resolve genres in batch
        if (details.Genres.Count > 0)
        {
            var existingGenres = await _genreRepo.GetByNamesAsync(details.Genres, ct);
            var existingNames  = existingGenres.Select(g => g.Name).ToHashSet();

            var newGenres = details.Genres
                .Where(name => !existingNames.Contains(name))
                .Select(name => new Genre(name))
                .ToList();

            foreach (var newGenre in newGenres)
                await _genreRepo.AddAsync(newGenre, ct);

            foreach (var genre in existingGenres.Concat(newGenres))
                album.AddGenre(genre);
        }

        await _albumRepo.AddAsync(album, ct);
        await _uow.SaveChangesAsync(ct);

        return album.Id;
    }
}