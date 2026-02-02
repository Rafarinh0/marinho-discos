using System;
using System.Threading;
using System.Threading.Tasks;
using MarinhoDiscos.Domain.Repositories;
using MarinhoDiscos.Infrastructure.Persistence;

namespace MarinhoDiscos.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly MarinhoDiscosDbContext _context;
    private bool _disposed;

    public UnitOfWork(MarinhoDiscosDbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_disposed) return;

        if (disposing)
        {
            _context?.Dispose();
        }

        _disposed = true;
    }
}