using FluentValidation;

namespace MarinhoDiscos.Application.DTOs.Albums;

public class CreateTrackRequestValidator : AbstractValidator<CreateTrackRequest>
{
    public CreateTrackRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Track title is required")
            .MaximumLength(200);

        RuleFor(x => x.DurationSeconds)
            .GreaterThan(0).WithMessage("Track duration must be greater than zero");

        RuleFor(x => x.TrackNumber)
            .GreaterThan(0).WithMessage("Track number must be greater than zero");
    }
}