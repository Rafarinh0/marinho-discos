namespace MarinhoDiscos.Application.Common.Errors;

public static class ErrorCodes
{
    public const string AlbumNotFound = "album_not_found";
    public const string ArtistNotFound = "artist_not_found";
    public const string GenreNotFound = "genre_not_found";

    public const string DuplicateArtist = "duplicate_artist";
    public const string InvalidRating = "invalid_rating";
    public const string ExternalAlbumNotFound  = "external_album_not_found";
    public const string ExternalArtistInvalid  = "external_artist_invalid";
    public const string ReviewNotFound = "review_not_found";
}