namespace MarinhoDiscos.Application.UseCases.Albums.CreateAlbum;

using MarinhoDiscos.Application.Common.Errors;
using MarinhoDiscos.Application.Common.Exceptions;
using MarinhoDiscos.Application.DTOs.Albums;
using MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.Repositories;

public class CreateAlbumUseCase
{
    private readonly IAlbumRepository _albumRepository;
    private readonly IArtistRepository _artistRepository;
    private readonly IGenreRepository _genreRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateAlbumUseCase(
        IAlbumRepository albumRepository,
        IArtistRepository artistRepository,
        IGenreRepository genreRepository,
        IUnitOfWork unitOfWork)
    {
        _albumRepository = albumRepository;
        _artistRepository = artistRepository;
        _genreRepository = genreRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> ExecuteAsync(CreateAlbumRequest request, CancellationToken ct = default)
    {
        if (!await _artistRepository.ExistsByIdAsync(request.ArtistId, ct))
            throw new NotFoundException(
                ErrorCodes.ArtistNotFound,
                $"Artist '{request.ArtistId}' was not found");

        var genres = await _genreRepository.GetByIdsAsync(request.GenreIds, ct);

        if (genres.Count != request.GenreIds.Count)
            throw new NotFoundException(
                ErrorCodes.GenreNotFound,
                "One or more genres were not found");

        //create aggregate root
        var album = new Album(
            request.Title,
            request.ReleaseDate,
            request.ArtistId
        );

        //add genres and tracks
        foreach (var genre in genres)
            album.AddGenre(genre);

        foreach (var track in request.Tracks)
            album.AddTrack(track.TrackNumber, track.Title, track.DurationSeconds);

        await _albumRepository.AddAsync(album, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return album.Id;
    }
}
