namespace MarinhoDiscos.Application.DTOs.Stats;

public record LibraryStatsResponse(
    int TotalAlbums,
    int ReviewedAlbums,
    int TotalReviews,
    int TotalTracks,
    int TotalDurationSeconds,
    decimal? AverageRating
);

public record ArtistStatsResponse(
    int TotalAlbums,
    int TotalReviews,
    int TotalTracks,
    int TotalDurationSeconds,
    decimal? AverageRating
);
