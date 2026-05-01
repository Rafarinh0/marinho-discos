namespace MarinhoDiscos.Application.Common.Exceptions;

public class ValidationException : AppException
{
    public ValidationException(string code, string message)
        : base(code, message)
    {
    }
}