using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdminPanel.Migrations
{
    /// <inheritdoc />
    public partial class AddAnnouncementsPageContentToBrand : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AnnouncementsPageContent",
                table: "Brands",
                type: "json",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "AnnouncementsPageContent", "CreatedAt", "UpdatedAt" },
                values: new object[] { null, new DateTime(2025, 10, 5, 21, 43, 32, 18, DateTimeKind.Utc).AddTicks(7742), new DateTime(2025, 10, 5, 21, 43, 32, 18, DateTimeKind.Utc).AddTicks(7756) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "AnnouncementsPageContent", "CreatedAt", "UpdatedAt" },
                values: new object[] { null, new DateTime(2025, 10, 5, 21, 43, 32, 19, DateTimeKind.Utc).AddTicks(114), new DateTime(2025, 10, 5, 21, 43, 32, 19, DateTimeKind.Utc).AddTicks(129) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(1236), new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(1250) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4078), new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4098) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4112), new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4127) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4141), new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4156) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4175), new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4190) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4205), new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4218) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4233), new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4248) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4262), new DateTime(2025, 10, 5, 21, 43, 32, 20, DateTimeKind.Utc).AddTicks(4276) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnnouncementsPageContent",
                table: "Brands");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 426, DateTimeKind.Utc).AddTicks(1206), new DateTime(2025, 10, 2, 23, 20, 27, 426, DateTimeKind.Utc).AddTicks(1221) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 426, DateTimeKind.Utc).AddTicks(3560), new DateTime(2025, 10, 2, 23, 20, 27, 426, DateTimeKind.Utc).AddTicks(3579) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(5220), new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(5238) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7709), new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7723) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7742), new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7756) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7774), new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7789) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7803), new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7817) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7831), new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7846) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7865), new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7878) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7892), new DateTime(2025, 10, 2, 23, 20, 27, 427, DateTimeKind.Utc).AddTicks(7907) });
        }
    }
}
