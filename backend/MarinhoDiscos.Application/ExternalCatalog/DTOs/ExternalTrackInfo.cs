namespace MarinhoDiscos.Application.ExternalCatalog.DTOs;

public record ExternalTrackInfo(
    int Number,
    string Title,
    int DurationSeconds
);