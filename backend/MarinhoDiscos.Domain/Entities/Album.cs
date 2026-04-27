namespace MarinhoDiscos.Domain.Entities;
using System;
using System.Collections.Generic;
using MarinhoDiscos.Domain.Exceptions;

public class Album
{
    public Guid Id { get; private set; }
    public string Title { get; private set; }
    public DateTime ReleaseDate { get; private set; }

    public string? ExternalId { get; private set; }
    public ExternalSource Source { get; private set; }

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
        Source = ExternalSource.Manual;
    }

    public static Album FromExternal(
        string title,
        DateTime releaseDate,
        Guid artistId,
        string externalId,
        ExternalSource source)
    {
        if (string.IsNullOrWhiteSpace(externalId))
            throw new DomainException("ExternalId is required when importing from external source");

        if (source == ExternalSource.Manual)
            throw new DomainException("FromExternal cannot be used with Manual source");

        var album = new Album(title, releaseDate, artistId)
        {
            ExternalId = externalId,
            Source = source
        };

        return album;
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
