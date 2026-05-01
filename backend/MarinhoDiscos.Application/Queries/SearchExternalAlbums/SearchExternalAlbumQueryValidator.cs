using FluentValidation;

namespace MarinhoDiscos.Application.Queries.SearchExternalAlbums;

public class SearchExternalAlbumsQueryValidator
    : AbstractValidator<SearchExternalAlbumsQuery>
{
    public SearchExternalAlbumsQueryValidator()
    {
        RuleFor(x => x.Query)
            .NotEmpty()
            .MinimumLength(2)
            .WithMessage("Query must have at least 2 characters");

        RuleFor(x => x.Limit)
            .InclusiveBetween(1, 25);
    }
}