using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdventureWorksLT2019.WebApi.Data.Migrations.AdventureWorksLT2019
{
    /// <inheritdoc />
    public partial class AddAssignedToToErrorLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AssignedTo",
                table: "ErrorLog",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ErrorLog_AssignedTo",
                table: "ErrorLog",
                column: "AssignedTo");

            migrationBuilder.AddForeignKey(
                name: "FK_ErrorLog_AspNetUser_AssginedTo",
                table: "ErrorLog",
                column: "AssignedTo",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ErrorLog_AspNetUser_AssginedTo",
                table: "ErrorLog");

            migrationBuilder.DropIndex(
                name: "IX_ErrorLog_AssignedTo",
                table: "ErrorLog");

            migrationBuilder.DropColumn(
                name: "AssignedTo",
                table: "ErrorLog");
        }
    }
}
