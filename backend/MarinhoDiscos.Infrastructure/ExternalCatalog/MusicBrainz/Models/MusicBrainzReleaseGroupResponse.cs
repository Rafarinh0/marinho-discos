using System.Text.Json.Serialization;

namespace MarinhoDiscos.Infrastructure.ExternalCatalog.MusicBrainz.Models;

internal record MusicBrainzReleaseGroupResponse(
    [property: JsonPropertyName("id")]     string Id,
    [property: JsonPropertyName("genres")] List<MusicBrainzGenre>? Genres
);