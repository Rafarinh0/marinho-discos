namespace MarinhoDiscos.Domain.ValueObjects;
using MarinhoDiscos.Domain.Exceptions;

public sealed class Rating
{
    public int Value { get; }
    
    protected Rating() { }

    public Rating(int value)
    {
        if (value < 0 || value > 10)
            throw new DomainException("Rating must be between 0 and 10");

        Value = value;
    }

    public override bool Equals(object? obj)
        => obj is Rating other && Value == other.Value;

    public override int GetHashCode()
        => Value.GetHashCode();
}