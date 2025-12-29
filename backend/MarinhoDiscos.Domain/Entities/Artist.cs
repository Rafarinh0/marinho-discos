namespace MarinhoDiscos.Domain.Entities;

public class Artist
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public LocalDate debutYear { get; private set; }
    public string Country { get; private set; }

    private readonly List<Genre> _genres = new();
    public IReadOnlyCollection<Genre> Genres => _genres.AsReadOnly();

    private readonly List<Album> _albums = new();
    public IReadOnlyCollection<Album> Albums => _albums.AsReadOnly();

    protected Artist() { }

    public Artist(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Artist name is required");

        Id = Guid.NewGuid();
        Name = name;
    }
}