namespace MarinhoDiscos.Application.DTOs.Albums;

public record CreateAlbumRequest(
    string Title,
    DateTime ReleaseDate,
    Guid ArtistId,
    List<Guid> GenreIds,
    List<CreateTrackRequest> Tracks
    
);

public record CreateTrackRequest(
    string Title,
    int DurationSeconds,
    int TrackNumber
);