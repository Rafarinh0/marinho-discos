namespace MarinhoDiscos.Application.DTOs.Reviews;

public record CreateReviewRequest(
    int Rating,
    string? Comment
);
