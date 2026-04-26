using MarinhoDiscos.Application.DTOs.Genres;
using MarinhoDiscos.Domain.Repositories;
using MediatR;

namespace MarinhoDiscos.Application.Queries.ListGenres;

public class ListGenresHandler
    : IRequestHandler<ListGenresQuery, IReadOnlyList<GenreResponse>>
{
    private readonly IGenreRepository _genreRepository;

    public ListGenresHandler(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    public async Task<IReadOnlyList<GenreResponse>> Handle(
        ListGenresQuery request,
        CancellationToken ct)
    {
        var genres = await _genreRepository.GetAllAsync(ct);
        return genres
            .Select(g => new GenreResponse(g.Id, g.Name))
            .ToList();
    }
}
