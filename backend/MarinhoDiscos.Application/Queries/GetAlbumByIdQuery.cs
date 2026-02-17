using MarinhoDiscos.Application.DTOs.Albums;
using MediatR;

namespace MarinhoDiscos.Application.Queries;

public record GetAlbumByIdQuery(Guid AlbumId)
    : IRequest<AlbumDetailsResponse>;
    