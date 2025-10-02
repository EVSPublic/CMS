using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdminPanel.Migrations
{
    /// <inheritdoc />
    public partial class AddPartnershipSlideSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PartnershipSlideDuration",
                table: "Brands",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PartnershipSlideInterval",
                table: "Brands",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PartnershipSlideDuration", "PartnershipSlideInterval", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 426, DateTimeKind.Utc).AddTicks(1206), 500, 3000, new DateTime(2025, 10, 2, 23, 20, 27, 426, DateTimeKind.Utc).AddTicks(1221) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "PartnershipSlideDuration", "PartnershipSlideInterval", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 2, 23, 20, 27, 426, DateTimeKind.Utc).AddTicks(3560), 500, 3000, new DateTime(2025, 10, 2, 23, 20, 27, 426, DateTimeKind.Utc).AddTicks(3579) });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PartnershipSlideDuration",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "PartnershipSlideInterval",
                table: "Brands");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 30, 15, 27, 14, 507, DateTimeKind.Utc).AddTicks(2955), new DateTime(2025, 9, 30, 15, 27, 14, 507, DateTimeKind.Utc).AddTicks(2969) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 30, 15, 27, 14, 507, DateTimeKind.Utc).AddTicks(5526), new DateTime(2025, 9, 30, 15, 27, 14, 507, DateTimeKind.Utc).AddTicks(5541) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 30, 15, 27, 14, 508, DateTimeKind.Utc).AddTicks(8485), new DateTime(2025, 9, 30, 15, 27, 14, 508, DateTimeKind.Utc).AddTicks(8518) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1482), new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1496) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1516), new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1530) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1544), new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1558) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1572), new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1586) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1605), new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1620) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1634), new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1648) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1663), new DateTime(2025, 9, 30, 15, 27, 14, 509, DateTimeKind.Utc).AddTicks(1677) });
        }
    }
}
