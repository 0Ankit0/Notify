using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace notify.Server.Migrations
{
    /// <inheritdoc />
    public partial class MessageTblUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_UserMasters_UserId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_UserId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Messages");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Messages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UserMasterUserId",
                table: "Messages",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_UserMasterUserId",
                table: "Messages",
                column: "UserMasterUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_UserMasters_UserMasterUserId",
                table: "Messages",
                column: "UserMasterUserId",
                principalTable: "UserMasters",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_UserMasters_UserMasterUserId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_UserMasterUserId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "UserMasterUserId",
                table: "Messages");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Messages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_UserId",
                table: "Messages",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_UserMasters_UserId",
                table: "Messages",
                column: "UserId",
                principalTable: "UserMasters",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
