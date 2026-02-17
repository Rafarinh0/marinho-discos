namespace MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.Exceptions;

public class Track
{
    public Guid Id { get; private set; }
    public Guid AlbumId { get; private set; }
    public Album Album { get; private set; }
    public int Number { get; private set; }
    public string Title { get; private set; }
    public int DurationSeconds { get; private set; }

    protected Track() { }

    public Track(Guid albumId, int number, string title, int durationSeconds)
    {
        Id = Guid.NewGuid();
        AlbumId = albumId;
        Number = number;
        Title = title;
        DurationSeconds = durationSeconds;
    }
}
