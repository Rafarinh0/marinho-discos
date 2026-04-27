using FluentValidation;

namespace MarinhoDiscos.Application.DTOs.Albums;

public class CreateAlbumRequestValidator : AbstractValidator<CreateAlbumRequest>
{
    public CreateAlbumRequestValidator(IValidator<CreateTrackRequest> trackValidator)
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200);

        RuleFor(x => x.ReleaseDate)
            .NotEmpty()
            .LessThanOrEqualTo(_ => DateTime.UtcNow)
            .WithMessage("Release date cannot be in the future");

        RuleFor(x => x.ArtistId)
            .NotEmpty().WithMessage("ArtistId is required");

        RuleFor(x => x.GenreIds)
            .NotNull()
            .Must(ids => ids.Count >= 1)
            .WithMessage("At least one genre is required")
            .Must(ids => ids.Distinct().Count() == ids.Count)
            .WithMessage("GenreIds must not contain duplicates")
            .ForEach(id => id.NotEmpty().WithMessage("GenreId cannot be empty"));

        RuleFor(x => x.Tracks)
            .NotNull()
            .Must(tracks => tracks.Count >= 1)
            .WithMessage("Album must have at least one track")
            .Must(tracks =>
                tracks.Select(t => t.TrackNumber).Distinct().Count() == tracks.Count)
            .WithMessage("Track numbers must be unique within an album");

        RuleForEach(x => x.Tracks).SetValidator(trackValidator);
    }
}