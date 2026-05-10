using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarinhoDiscos.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeReleaseDateNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "ReleaseDate",
                table: "Albums",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            // Limpa valores antigos de -infinity (vinham de DateTime.MinValue
            // quando o MusicBrainz não retornava data). Vira NULL — semanticamente correto.
            migrationBuilder.Sql(@"
                UPDATE ""Albums""
                SET ""ReleaseDate"" = NULL
                WHERE ""ReleaseDate"" = '-infinity'
                   OR ""ReleaseDate"" = '0001-01-01 00:00:00+00';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "ReleaseDate",
                table: "Albums",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);
        }
    }
}
