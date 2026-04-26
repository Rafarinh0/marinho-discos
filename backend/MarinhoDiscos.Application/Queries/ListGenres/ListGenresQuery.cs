using MarinhoDiscos.Application.DTOs.Genres;
using MediatR;

namespace MarinhoDiscos.Application.Queries.ListGenres;

public record ListGenresQuery() : IRequest<IReadOnlyList<GenreResponse>>;
