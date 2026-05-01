namespace MarinhoDiscos.Application.ExternalCatalog.DTOs;

public record ExternalAlbumSummary
(
    string ExternalId,
    string Title,
    string ArtistName,
    string? ArtistExternalId,
    int? ReleaseYear
);