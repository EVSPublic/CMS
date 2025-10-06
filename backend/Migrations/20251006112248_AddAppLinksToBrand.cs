using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdminPanel.Migrations
{
    /// <inheritdoc />
    public partial class AddAppLinksToBrand : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AndroidAppLink",
                table: "Brands",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "IosAppLink",
                table: "Brands",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "AndroidAppLink", "CreatedAt", "IosAppLink", "UpdatedAt" },
                values: new object[] { null, new DateTime(2025, 10, 6, 11, 22, 47, 416, DateTimeKind.Utc).AddTicks(5054), null, new DateTime(2025, 10, 6, 11, 22, 47, 416, DateTimeKind.Utc).AddTicks(5073) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "AndroidAppLink", "CreatedAt", "IosAppLink", "UpdatedAt" },
                values: new object[] { null, new DateTime(2025, 10, 6, 11, 22, 47, 416, DateTimeKind.Utc).AddTicks(7417), null, new DateTime(2025, 10, 6, 11, 22, 47, 416, DateTimeKind.Utc).AddTicks(7431) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 6, 11, 22, 47, 417, DateTimeKind.Utc).AddTicks(8602), new DateTime(2025, 10, 6, 11, 22, 47, 417, DateTimeKind.Utc).AddTicks(8617) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1500), new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1514) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1533), new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1548) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1562), new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1576) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1594), new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1609) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1623), new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1637) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1652), new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1666) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1685), new DateTime(2025, 10, 6, 11, 22, 47, 418, DateTimeKind.Utc).AddTicks(1699) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AndroidAppLink",
                table: "Brands");

            migrationBuilder.DropColumn(
                name: "IosAppLink",
                table: "Brands");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 43, 32, 18, DateTimeKind.Utc).AddTicks(7742), new DateTime(2025, 10, 5, 21, 43, 32, 18, DateTimeKind.Utc).AddTicks(7756) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 5, 21, 43, 32, 19, DateTimeKind.Utc).AddTicks(114), new DateTime(2025, 10, 5, 21, 43, 32, 19, DateTimeKind.Utc).AddTicks(129) });

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
    }
}
