using MarinhoDiscos.Domain.Entities;
using MediatR;

namespace MarinhoDiscos.Application.Commands.ImportExternalAlbum;

public record ImportExternalAlbumCommand(
    string ExternalId,
    ExternalSource Source = ExternalSource.MusicBrainz
) : IRequest<Guid>;