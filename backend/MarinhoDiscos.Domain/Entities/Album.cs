namespace MarinhoDiscos.Domain.Entities;
using System;
using System.Collections.Generic;

public class Album
{
    public Guid Id { get; private set; }
    public string Title { get; private set; }
    public DateTime ReleaseDate { get; private set; }

    public Guid ArtistId { get; private set; }
    public Artist Artist { get; private set; }

    private readonly List<Genre> _genres = new();
    public IReadOnlyCollection<Genre> Genres => _genres.AsReadOnly();

    private readonly List<Track> _tracks = new();
    public IReadOnlyCollection<Track> Tracks => _tracks.AsReadOnly();

    protected Album() { }

    public Album(
        string title,
        DateTime releaseDate,
        Guid artistId,
        IEnumerable<Genre> genres,
        IEnumerable<Track> tracks)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Album title is required");

        if (releaseDate > DateTime.UtcNow)
            throw new DomainException("Release date cannot be in the future");

        Id = Guid.NewGuid();
        Title = title;
        ReleaseDate = releaseDate;
        ArtistId = artistId;
        _genres.AddRange(genres);
        _tracks.AddRange(tracks);
    }
}