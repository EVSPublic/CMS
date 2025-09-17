using AdminPanel.Models;
using AdminPanel.Services;

namespace AdminPanel.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AdminPanelDbContext context, IServiceProvider serviceProvider)
    {
        // Ensure database is created
        context.Database.EnsureCreated();

        // Seed admin user if not exists
        if (!context.Users.Any())
        {
            var authService = serviceProvider.GetRequiredService<IAuthService>();

            var adminUser = new User
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Super Admin",
                Email = "admin@admin.com",
                PasswordHash = await authService.HashPasswordAsync("admin123"),
                Role = "SuperAdmin",
                BrandAccess = new List<string> { "Ovolt", "Sharz" },
                Permissions = new Dictionary<string, List<string>>
                {
                    ["global"] = new List<string> { "manage_users", "system_settings" }
                },
                Status = "active",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.Add(adminUser);

            // Add a test editor user
            var editorUser = new User
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Editor User",
                Email = "editor@admin.com",
                PasswordHash = await authService.HashPasswordAsync("editor123"),
                Role = "Editor",
                BrandAccess = new List<string> { "Ovolt" },
                Permissions = new Dictionary<string, List<string>>
                {
                    ["global"] = new List<string> { "content_edit" }
                },
                Status = "active",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.Add(editorUser);
        }

        await context.SaveChangesAsync();
    }
}