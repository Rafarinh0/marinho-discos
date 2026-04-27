using FluentValidation;

namespace MarinhoDiscos.Application.Queries.ListAlbums;

public class ListAlbumsQueryValidator : AbstractValidator<ListAlbumsQuery>
{
    public ListAlbumsQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1).WithMessage("Page must be >= 1");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("PageSize must be between 1 and 100");
    }
}