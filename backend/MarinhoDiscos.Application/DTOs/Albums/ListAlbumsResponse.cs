namespace MarinhoDiscos.Application.DTOs.Albums;

public record AlbumListItemResponse(
    Guid Id,
    string? ExternalId,
    string Title,
    DateTime? ReleaseDate,
    string ArtistName,
    int TrackCount
);