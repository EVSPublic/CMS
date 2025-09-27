using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdminPanel.Migrations
{
    /// <inheritdoc />
    public partial class AddStationAndChargerModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Stations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Address = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Latitude = table.Column<decimal>(type: "decimal(10,8)", nullable: false),
                    Longitude = table.Column<decimal>(type: "decimal(11,8)", nullable: false),
                    Status = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Hours = table.Column<string>(type: "json", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Contact = table.Column<string>(type: "json", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Images = table.Column<string>(type: "json", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Amenities = table.Column<string>(type: "json", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BrandVisibility = table.Column<string>(type: "json", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedById = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stations_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Chargers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StationId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Type = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PowerKW = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Status = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ConnectorType = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastMaintenance = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chargers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Chargers_Stations_StationId",
                        column: x => x.StationId,
                        principalTable: "Stations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
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

            migrationBuilder.CreateIndex(
                name: "IX_Chargers_StationId",
                table: "Chargers",
                column: "StationId");

            migrationBuilder.CreateIndex(
                name: "IX_Stations_CreatedById",
                table: "Stations",
                column: "CreatedById");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Chargers");

            migrationBuilder.DropTable(
                name: "Stations");

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 22, 13, 14, 780, DateTimeKind.Utc).AddTicks(3327), new DateTime(2025, 9, 25, 22, 13, 14, 780, DateTimeKind.Utc).AddTicks(3341) });

            migrationBuilder.UpdateData(
                table: "Brands",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 9, 25, 22, 13, 14, 780, DateTimeKind.Utc).AddTicks(5828), new DateTime(2025, 9, 25, 22, 13, 14, 780, DateTimeKind.Utc).AddTicks(5843) });

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
    }
}
