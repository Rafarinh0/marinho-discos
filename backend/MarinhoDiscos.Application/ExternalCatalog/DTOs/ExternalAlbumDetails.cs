namespace MarinhoDiscos.Application.ExternalCatalog.DTOs;

public record ExternalAlbumDetails(
    string ExternalId,
    string Title,
    DateTime ReleaseDate,
    ExternalArtistInfo Artist,
    IReadOnlyList<ExternalTrackInfo> Tracks,
    IReadOnlyList<string> Genres
);