# Builds stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

#Copies csproj first
COPY MarinhoDiscos.API/MarinhoDiscos.API.csproj MarinhoDiscos.API/
COPY MarinhoDiscos.Application/MarinhoDiscos.Application.csproj MarinhoDiscos.Application/
COPY MarinhoDiscos.Domain/MarinhoDiscos.Domain.csproj MarinhoDiscos.Domain/
COPY MarinhoDiscos.Infrastructure/MarinhoDiscos.Infrastructure.csproj MarinhoDiscos.Infrastructure/

RUN dotnet restore MarinhoDiscos.API/MarinhoDiscos.API.csproj

#Copies the rest and then publishes
COPY . .
RUN dotnet publish MarinhoDiscos.API/MarinhoDiscos.API.csproj \
    -c Release -o /app/publish --no-restore

#Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "MarinhoDiscos.API.dll"]