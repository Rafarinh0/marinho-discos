using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarinhoDiscos.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddExternalIdToAlbumAndArtist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Tracks");

            migrationBuilder.RenameColumn(
                name: "TrackNumber",
                table: "Tracks",
                newName: "Number");

            migrationBuilder.AddColumn<int>(
                name: "DurationSeconds",
                table: "Tracks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Genres",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "ExternalId",
                table: "Artists",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "Artists",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Manual");

            migrationBuilder.AddColumn<string>(
                name: "ExternalId",
                table: "Albums",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "Albums",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Manual");

            migrationBuilder.CreateIndex(
                name: "IX_Artists_ExternalId_Source",
                table: "Artists",
                columns: new[] { "ExternalId", "Source" },
                unique: true,
                filter: "\"ExternalId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Albums_ExternalId_Source",
                table: "Albums",
                columns: new[] { "ExternalId", "Source" },
                unique: true,
                filter: "\"ExternalId\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Artists_ExternalId_Source",
                table: "Artists");

            migrationBuilder.DropIndex(
                name: "IX_Albums_ExternalId_Source",
                table: "Albums");

            migrationBuilder.DropColumn(
                name: "DurationSeconds",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Artists");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "Artists");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Albums");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "Albums");

            migrationBuilder.RenameColumn(
                name: "Number",
                table: "Tracks",
                newName: "TrackNumber");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Duration",
                table: "Tracks",
                type: "interval",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Genres",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);
        }
    }
}
