using System.Text.Json;
using MarinhoDiscos.Application.Common.Exceptions;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (FluentValidation.ValidationException ex) //order matters
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status400BadRequest;

            var response = new
            {
                code = "validation_failed",
                message = "One or more validation errors occurred",
                errors = ex.Errors.Select(e => new
                {
                    property = e.PropertyName,
                    error = e.ErrorMessage
                })
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
        catch (AppException ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = MapStatusCode(ex);

            var response = new
            {
                code = ex.Code,
                message = ex.Message
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception for {Method} {Path}",
                context.Request.Method, context.Request.Path);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var response = new
            {
                code = "internal_error",
                message = "An unexpected error occurred"
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }

    private static int MapStatusCode(AppException ex) =>
        ex switch
        {
            NotFoundException => StatusCodes.Status404NotFound,
            ConflictException => StatusCodes.Status409Conflict,
            _ => StatusCodes.Status400BadRequest
        };
}
