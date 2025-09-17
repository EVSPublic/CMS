using Microsoft.EntityFrameworkCore;
using AdminPanel.Models;
using System.Text.Json;

namespace AdminPanel.Data;

public class AdminPanelDbContext : DbContext
{
    public AdminPanelDbContext(DbContextOptions<AdminPanelDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.BrandAccess)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                )
                .HasColumnType("json");

            entity.Property(e => e.Permissions)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<Dictionary<string, List<string>>>(v, (JsonSerializerOptions?)null) ?? new Dictionary<string, List<string>>()
                )
                .HasColumnType("json");

            entity.HasIndex(e => e.Email).IsUnique();
        });
    }
}