namespace MarinhoDiscos.Domain.Entities;
using NodaTime;
using MarinhoDiscos.Domain.Exceptions;

public class Artist
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public DateOnly? debutYear { get; private set; }
    public string? Country { get; private set; }

    public string? ExternalId { get; private set; }
    public ExternalSource Source { get; private set; }

    private readonly List<Album> _albums = new();
    public IReadOnlyCollection<Album> Albums => _albums.AsReadOnly();

    protected Artist() { }

    public Artist(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Artist name is required");

        Id = Guid.NewGuid();
        Name = name;
        Source = ExternalSource.Manual;
    }

    public static Artist FromExternal(
        string name,
        string externalId,
        ExternalSource source,
        string? country = null)
    {
        if (string.IsNullOrWhiteSpace(externalId))
            throw new DomainException("ExternalId is required when importing from external source");

        if (source == ExternalSource.Manual)
            throw new DomainException("FromExternal cannot be used with Manual source");

        var artist = new Artist(name)
        {
            ExternalId = externalId,
            Source = source,
            Country = country
        };

        return artist;
    }
}