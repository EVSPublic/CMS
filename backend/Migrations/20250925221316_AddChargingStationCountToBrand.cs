using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdminPanel.Migrations
{
    /// <inheritdoc />
    public partial class AddChargingStationCountToBrand : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ChargingStationCount",
                table: "Brands",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ChargingStationCount", "CreatedAt", "UpdatedAt" },
                values: new object[] { 1880, new DateTime(2025, 9, 25, 22, 13, 14, 780, DateTimeKind.Utc).AddTicks(3327), new DateTime(2025, 9, 25, 22, 13, 14, 780, DateTimeKind.Utc).AddTicks(3341) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ChargingStationCount", "CreatedAt", "UpdatedAt" },
                values: new object[] { 1880, new DateTime(2025, 9, 25, 22, 13, 14, 780, DateTimeKind.Utc).AddTicks(5828), new DateTime(2025, 9, 25, 22, 13, 14, 780, DateTimeKind.Utc).AddTicks(5843) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 22, 13, 14, 781, DateTimeKind.Utc).AddTicks(9190), new DateTime(2025, 9, 25, 22, 13, 14, 781, DateTimeKind.Utc).AddTicks(9204) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2171), new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2185) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2204), new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2219) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2234), new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2248) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2268), new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2282) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2296), new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2310) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2324), new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2338) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2357), new DateTime(2025, 9, 25, 22, 13, 14, 782, DateTimeKind.Utc).AddTicks(2371) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChargingStationCount",
                table: "Brands");

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

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(746), new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(780) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3553), new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3587) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3620), new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3654) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3692), new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3707) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3721), new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3736) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3755), new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3768) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3782), new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3801) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3816), new DateTime(2025, 9, 25, 11, 17, 25, 4, DateTimeKind.Utc).AddTicks(3830) });
        }
    }
}
