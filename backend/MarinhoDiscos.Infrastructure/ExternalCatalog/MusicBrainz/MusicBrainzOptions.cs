namespace MarinhoDiscos.Infrastructure.ExternalCatalog.MusicBrainz;

public class MusicBrainzOptions
{
    public const string SectionName = "MusicBrainz";

    public string BaseUrl { get; set; } = "https://musicbrainz.org/ws/2/";
    
    public string UserAgent { get; set; } = "MarinhoDiscos/1.0 (contact@example.com)";
}