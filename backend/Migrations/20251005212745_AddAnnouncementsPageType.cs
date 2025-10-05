using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdminPanel.Migrations
{
    /// <inheritdoc />
    public partial class AddAnnouncementsPageType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 27, 44, 51, DateTimeKind.Utc).AddTicks(5641), new DateTime(2025, 10, 5, 21, 27, 44, 51, DateTimeKind.Utc).AddTicks(5675) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 27, 44, 51, DateTimeKind.Utc).AddTicks(7850), new DateTime(2025, 10, 5, 21, 27, 44, 51, DateTimeKind.Utc).AddTicks(7864) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 27, 44, 52, DateTimeKind.Utc).AddTicks(9230), new DateTime(2025, 10, 5, 21, 27, 44, 52, DateTimeKind.Utc).AddTicks(9244) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2157), new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2176) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2190), new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2204) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2219), new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2233) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2248), new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2262) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2282), new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2297) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2311), new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2325) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2338), new DateTime(2025, 10, 5, 21, 27, 44, 53, DateTimeKind.Utc).AddTicks(2353) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
