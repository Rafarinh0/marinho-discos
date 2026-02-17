namespace MarinhoDiscos.Application.DTOs.Albums;

public record AlbumDetailsResponse(
    Guid Id,
    string Title,
    DateTime ReleaseDate,
    int DurationSeconds,
    ArtistSummary Artist,
    List<GenreSummary> Genres,
    List<TrackResponse> Tracks,
    List<ReviewResponse> Reviews
);

public record ArtistSummary(Guid Id, string Name);

public record GenreSummary(Guid Id, string Name);

public record TrackResponse(
    Guid Id,
    string Title,
    int DurationSeconds,
    int TrackNumber
);

public record ReviewResponse(
    Guid Id,
    int Rating,
    string? Comment,
    DateTime CreatedAt
);