namespace MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.Exceptions;

public class Track
{
    public Guid Id { get; private set; }
    public string Title { get; private set; }
    public int TrackNumber { get; private set; }
    public TimeSpan Duration { get; private set; }

    public Guid AlbumId { get; private set; }
    public Album Album { get; private set; }

    protected Track() { }

    public Track(string title, int trackNumber, TimeSpan duration, Guid albumId)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Track title is required");

        if (trackNumber <= 0)
            throw new DomainException("Invalid track number");

        Id = Guid.NewGuid();
        Title = title;
        TrackNumber = trackNumber;
        Duration = duration;
        AlbumId = albumId;
    }
}
