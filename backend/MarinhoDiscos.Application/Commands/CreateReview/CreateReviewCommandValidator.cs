using FluentValidation;

namespace MarinhoDiscos.Application.Commands.Reviews;

public class CreateReviewCommandValidator : AbstractValidator<CreateReviewCommand>
{
    public CreateReviewCommandValidator()
    {
        RuleFor(x => x.AlbumId).NotEmpty();
        RuleFor(x => x.Rating).InclusiveBetween(1, 10);
    }
}