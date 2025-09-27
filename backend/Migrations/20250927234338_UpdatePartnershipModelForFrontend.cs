using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdminPanel.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePartnershipModelForFrontend : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactPerson",
                table: "Partnerships");

            migrationBuilder.DropColumn(
                name: "ContractEnd",
                table: "Partnerships");

            migrationBuilder.DropColumn(
                name: "ContractStart",
                table: "Partnerships");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Partnerships");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Partnerships");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Partnerships",
                newName: "Alt");

            migrationBuilder.RenameColumn(
                name: "CompanyName",
                table: "Partnerships",
                newName: "Title");

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "Partnerships",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Logo",
                table: "Partnerships",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 43, 36, 689, DateTimeKind.Utc).AddTicks(2911), new DateTime(2025, 9, 27, 23, 43, 36, 689, DateTimeKind.Utc).AddTicks(2926) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 43, 36, 689, DateTimeKind.Utc).AddTicks(6251), new DateTime(2025, 9, 27, 23, 43, 36, 689, DateTimeKind.Utc).AddTicks(6270) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 43, 36, 690, DateTimeKind.Utc).AddTicks(8699), new DateTime(2025, 9, 27, 23, 43, 36, 690, DateTimeKind.Utc).AddTicks(8708) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1455), new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1470) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1485), new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1499) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1514), new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1528) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1543), new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1557) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1575), new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1589) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1604), new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1618) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1633), new DateTime(2025, 9, 27, 23, 43, 36, 691, DateTimeKind.Utc).AddTicks(1647) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "Partnerships");

            migrationBuilder.DropColumn(
                name: "Logo",
                table: "Partnerships");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Partnerships",
                newName: "CompanyName");

            migrationBuilder.RenameColumn(
                name: "Alt",
                table: "Partnerships",
                newName: "Email");

            migrationBuilder.AddColumn<string>(
                name: "ContactPerson",
                table: "Partnerships",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "ContractEnd",
                table: "Partnerships",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ContractStart",
                table: "Partnerships",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Partnerships",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Partnerships",
                type: "varchar(50)",
                maxLength: 50,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 17, 53, 244, DateTimeKind.Utc).AddTicks(2390), new DateTime(2025, 9, 27, 23, 17, 53, 244, DateTimeKind.Utc).AddTicks(2405) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 17, 53, 244, DateTimeKind.Utc).AddTicks(4981), new DateTime(2025, 9, 27, 23, 17, 53, 244, DateTimeKind.Utc).AddTicks(4995) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(6890), new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(6905) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9336), new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9350) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9369), new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9383) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9398), new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9412) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9426), new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9440) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9455), new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9470) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9484), new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9499) });

            migrationBuilder.UpdateData(
                table: "MediaFolders",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9513), new DateTime(2025, 9, 27, 23, 17, 53, 245, DateTimeKind.Utc).AddTicks(9528) });
        }
    }
}
