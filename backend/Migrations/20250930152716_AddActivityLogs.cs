using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdminPanel.Migrations
{
    /// <inheritdoc />
    public partial class AddActivityLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "BrandVisibility",
                table: "Stations",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "json")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ActivityLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Timestamp = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    Action = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Details = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    UserName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResourceType = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResourceId = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BrandId = table.Column<int>(type: "int", nullable: true),
                    BrandName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Level = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false, defaultValue: "info")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Metadata = table.Column<string>(type: "text", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActivityLogs_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActivityLogs_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLogs_Action",
                table: "ActivityLogs",
                column: "Action");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLogs_BrandId_Timestamp",
                table: "ActivityLogs",
                columns: new[] { "BrandId", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLogs_Timestamp",
                table: "ActivityLogs",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLogs_UserId",
                table: "ActivityLogs",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityLogs");

            migrationBuilder.AlterColumn<string>(
                name: "BrandVisibility",
                table: "Stations",
                type: "json",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

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
    }
}
