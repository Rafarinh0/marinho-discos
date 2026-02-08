namespace MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.Exceptions;

public class Genre
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    
    private readonly List<Album> _albums = new();
    public IReadOnlyCollection<Album> Albums => _albums.AsReadOnly();

    protected Genre() { }

    public Genre(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Genre name is required");

        Id = Guid.NewGuid();
        Name = name;
    }
}