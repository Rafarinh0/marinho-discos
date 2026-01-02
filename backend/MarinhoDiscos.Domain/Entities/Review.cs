namespace MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.ValueObjects;

public class Review
{
    public Guid Id { get; private set; }
    public Guid AlbumId { get; private set; }
    public Rating Rating { get; private set; }
    public string? Comment { get; private set; }
    public DateTime CreatedAt { get; private set; }

    protected Review() { }

    public Review(Guid albumId, Rating rating, string? comment)
    {
        Id = Guid.NewGuid();
        AlbumId = albumId;
        Rating = rating;
        Comment = comment;
        CreatedAt = DateTime.UtcNow;
    }
}