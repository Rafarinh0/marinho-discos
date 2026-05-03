using FluentValidation;

namespace MarinhoDiscos.Application.Queries.ListAlbumReviews;

public class ListAlbumReviewsQueryValidator : AbstractValidator<ListAlbumReviewsQuery>
{
    public ListAlbumReviewsQueryValidator()
    {
        RuleFor(x => x.AlbumId).NotEmpty();
        RuleFor(x => x.Page).GreaterThanOrEqualTo(1);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 50);
    }
}