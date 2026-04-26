namespace MarinhoDiscos.Application.Common.Exceptions;

public class ConflictException : AppException
{
    public ConflictException(string code, string message)
        : base(code, message)
    {
    }
}
