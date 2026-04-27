using FluentValidation;

namespace MarinhoDiscos.Application.DTOs.Reviews;

public class CreateReviewRequestValidator : AbstractValidator<CreateReviewRequest>
{
    public CreateReviewRequestValidator()
    {
        RuleFor(x => x.Rating)
            .InclusiveBetween(0, 10)
            .WithMessage("Rating must be between 0 and 10");

        RuleFor(x => x.Comment)
            .MaximumLength(1000).WithMessage("Comment must be at most 1000 characters")
            .When(x => x.Comment is not null);
    }
}