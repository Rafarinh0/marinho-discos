# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copies csproj first for better layer caching
COPY MarinhoDiscos.API/MarinhoDiscos.API.csproj MarinhoDiscos.API/
COPY MarinhoDiscos.Application/MarinhoDiscos.Application.csproj MarinhoDiscos.Application/
COPY MarinhoDiscos.Domain/MarinhoDiscos.Domain.csproj MarinhoDiscos.Domain/
COPY MarinhoDiscos.Infrastructure/MarinhoDiscos.Infrastructure.csproj MarinhoDiscos.Infrastructure/

RUN dotnet restore MarinhoDiscos.API/MarinhoDiscos.API.csproj

# Copies the rest and then publishes
COPY . .
RUN dotnet publish MarinhoDiscos.API/MarinhoDiscos.API.csproj \
    -c Release -o /app/publish --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# curl is used by the docker healthcheck
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# Run as non-root
RUN adduser --disabled-password --gecos "" --uid 1001 appuser \
    && chown -R appuser:appuser /app
USER appuser

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MarinhoDiscos.API.dll"]
