using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarinhoDiscos.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixSourceDefaultValue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE ""Albums""  ALTER COLUMN ""Source"" SET DEFAULT 'Manual';
                ALTER TABLE ""Artists"" ALTER COLUMN ""Source"" SET DEFAULT 'Manual';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                ALTER TABLE ""Albums""  ALTER COLUMN ""Source"" SET DEFAULT '';
                ALTER TABLE ""Artists"" ALTER COLUMN ""Source"" SET DEFAULT '';
            ");
        }
    }
}
