using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AdminPanel.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaFolders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MediaItems_AspNetUsers_CreatedBy",
                table: "MediaItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MediaItems_AspNetUsers_UpdatedBy",
                table: "MediaItems");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Announcements");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "MediaItems",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "MediaItems",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "MediaItems",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Announcements",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MediaFolders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BrandId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaFolders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MediaFolders_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MediaItemFolders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    MediaItemId = table.Column<int>(type: "int", nullable: false),
                    MediaFolderId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaItemFolders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MediaItemFolders_MediaFolders_MediaFolderId",
                        column: x => x.MediaFolderId,
                        principalTable: "MediaFolders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MediaItemFolders_MediaItems_MediaItemId",
                        column: x => x.MediaItemId,
                        principalTable: "MediaItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 11, 17, 25, 2, DateTimeKind.Utc).AddTicks(5742), new DateTime(2025, 9, 25, 11, 17, 25, 2, DateTimeKind.Utc).AddTicks(5757) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 11, 17, 25, 2, DateTimeKind.Utc).AddTicks(8113), new DateTime(2025, 9, 25, 11, 17, 25, 2, DateTimeKind.Utc).AddTicks(8127) });

            migrationBuilder.InsertData(
                table: "MediaFolders",
                columns: new[] { "Id", "BrandId", "CreatedAt", "Description", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(746), "Brand logos and variations", "Logos", new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(780) },
                    { 2, 1, new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3553), "Background images and textures", "Backgrounds", new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3587) },
                    { 3, 1, new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3620), "Icons and small graphics", "Icons", new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3654) },
                    { 4, 1, new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3692), "General content images", "Content Images", new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3707) },
                    { 5, 2, new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3721), "Brand logos and variations", "Logos", new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3736) },
                    { 6, 2, new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3755), "Background images and textures", "Backgrounds", new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3768) },
                    { 7, 2, new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3782), "Icons and small graphics", "Icons", new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3801) },
                    { 8, 2, new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3816), "General content images", "Content Images", new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3830) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MediaFolders_BrandId_Name",
                table: "MediaFolders",
                columns: new[] { "BrandId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MediaItemFolders_MediaFolderId",
                table: "MediaItemFolders",
                column: "MediaFolderId");

            migrationBuilder.CreateIndex(
                name: "IX_MediaItemFolders_MediaItemId_MediaFolderId",
                table: "MediaItemFolders",
                columns: new[] { "MediaItemId", "MediaFolderId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MediaItems_AspNetUsers_CreatedBy",
                table: "MediaItems",
                column: "CreatedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_MediaItems_AspNetUsers_UpdatedBy",
                table: "MediaItems",
                column: "UpdatedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MediaItems_AspNetUsers_CreatedBy",
                table: "MediaItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MediaItems_AspNetUsers_UpdatedBy",
                table: "MediaItems");

            migrationBuilder.DropTable(
                name: "MediaItemFolders");

            migrationBuilder.DropTable(
                name: "MediaFolders");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Announcements");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "MediaItems",
                type: "datetime(6)",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValueSql: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "MediaItems",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "MediaItems",
                type: "datetime(6)",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Announcements",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 24, 22, 57, 27, 130, DateTimeKind.Utc).AddTicks(7194), new DateTime(2025, 9, 24, 22, 57, 27, 130, DateTimeKind.Utc).AddTicks(7209) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 24, 22, 57, 27, 130, DateTimeKind.Utc).AddTicks(9614), new DateTime(2025, 9, 24, 22, 57, 27, 130, DateTimeKind.Utc).AddTicks(9628) });

            migrationBuilder.AddForeignKey(
                name: "FK_MediaItems_AspNetUsers_CreatedBy",
                table: "MediaItems",
                column: "CreatedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MediaItems_AspNetUsers_UpdatedBy",
                table: "MediaItems",
                column: "UpdatedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
