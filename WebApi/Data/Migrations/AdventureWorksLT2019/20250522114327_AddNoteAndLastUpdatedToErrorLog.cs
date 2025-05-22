using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdventureWorksLT2019.WebApi.Data.Migrations.AdventureWorksLT2019
{
    /// <inheritdoc />
    public partial class AddNoteAndLastUpdatedToErrorLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdated",
                table: "ErrorLog",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "ErrorLog",
                type: "varchar(2000)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastUpdated",
                table: "ErrorLog");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "ErrorLog");
        }
    }
}
