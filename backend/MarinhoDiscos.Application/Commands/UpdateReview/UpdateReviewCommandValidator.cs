using FluentValidation;

namespace MarinhoDiscos.Application.Commands.UpdateReview;

public class UpdateReviewCommandValidator : AbstractValidator<UpdateReviewCommand>
{
    public UpdateReviewCommandValidator()
    {
        RuleFor(x => x.ReviewId).NotEmpty();
        RuleFor(x => x.Rating).InclusiveBetween(1, 10);
    }
}