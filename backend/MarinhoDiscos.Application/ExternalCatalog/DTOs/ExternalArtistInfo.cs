namespace MarinhoDiscos.Application.ExternalCatalog.DTOs;

public record ExternalArtistInfo(
    string ExternalId,
    string Name,
    string? Country
);