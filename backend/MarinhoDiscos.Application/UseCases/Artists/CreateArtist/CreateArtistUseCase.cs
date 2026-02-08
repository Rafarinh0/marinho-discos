using MarinhoDiscos.Application.DTOs.Artists;
using MarinhoDiscos.Domain.Entities;
using MarinhoDiscos.Domain.Repositories;

namespace MarinhoDiscos.Application.UseCases.Artists.CreateArtist;

public class CreateArtistUseCase
{
    private readonly IArtistRepository _artistRepository;
    private readonly IUnitOfWork _unitOfWork;
    
    public CreateArtistUseCase(IArtistRepository artistRepository, IUnitOfWork unitOfWork)
    {
        _artistRepository = artistRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> CreateArtist(CreateArtistRequest request, CancellationToken ct = default)
    {
        if (await _artistRepository.ExistsByNameAsync(request.Name, ct))
            throw new InvalidOperationException("Artist already exists");

        var artist = new Artist(request.Name);

        await _artistRepository.AddAsync(artist, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return artist.Id;
    }
}