namespace MarinhoDiscos.Application.Common.Exceptions;

public class NotFoundException : AppException
{
    public NotFoundException(string code, string message)
        : base(code, message)
    {
    }
}