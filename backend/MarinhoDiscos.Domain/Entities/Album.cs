namespace MarinhoDiscos.Domain.Entities;
using System;
using System.Collections.Generic;
using MarinhoDiscos.Domain.Exceptions;

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
    
    private readonly List<Review> _reviews = new();
    public IReadOnlyCollection<Review> Reviews => _reviews.AsReadOnly();
    
    public int DurationSeconds => _tracks.Sum(t => t.DurationSeconds);

    protected Album() { }

    public Album(string title, DateTime releaseDate, Guid artistId)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Album title is required");

        if (releaseDate > DateTime.UtcNow)
            throw new DomainException("Release date cannot be in the future");

        Id = Guid.NewGuid();
        Title = title;
        ReleaseDate = releaseDate;
        ArtistId = artistId;
    }

    public void AddGenre(Genre genre)
    {
        _genres.Add(genre);
    }

    public void AddTrack(int number, string title, int durationSeconds)
    {
        _tracks.Add(new Track(Id, number, title, durationSeconds));
    }
}
