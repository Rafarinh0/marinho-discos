using System.Text.Json.Serialization;

namespace MarinhoDiscos.Infrastructure.ExternalCatalog.MusicBrainz.Models;

internal record MusicBrainzSearchResponse(
    [property: JsonPropertyName("releases")] List<MusicBrainzSearchRelease> Releases
);

internal record MusicBrainzSearchRelease(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("date")] string? Date,
    [property: JsonPropertyName("artist-credit")] List<MusicBrainzArtistCredit>? ArtistCredit
);

internal record MusicBrainzArtistCredit(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("artist")] MusicBrainzArtistRef? Artist
);

internal record MusicBrainzArtistRef(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("country")] string? Country
);