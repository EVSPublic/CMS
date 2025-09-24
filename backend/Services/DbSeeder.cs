using Microsoft.AspNetCore.Identity;
using AdminPanel.Data;
using AdminPanel.Models;

namespace AdminPanel.Services;

public class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var context = scope.ServiceProvider.GetRequiredService<AdminPanelContext>();

        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Create admin user if it doesn't exist
        var adminEmail = "admin@ovolt.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new User
            {
                Name = "Admin User",
                Email = adminEmail,
                UserName = adminEmail,
                Role = UserRole.Admin,
                Status = UserStatus.Active,
                BrandId = 1, // Ovolt brand
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                Console.WriteLine($"Admin user created: {adminEmail}");
            }
            else
            {
                Console.WriteLine($"Failed to create admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        // Create editor user if it doesn't exist
        var editorEmail = "editor@ovolt.com";
        var editorUser = await userManager.FindByEmailAsync(editorEmail);

        if (editorUser == null)
        {
            editorUser = new User
            {
                Name = "Editor User",
                Email = editorEmail,
                UserName = editorEmail,
                Role = UserRole.Editor,
                Status = UserStatus.Active,
                BrandId = 1, // Ovolt brand
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(editorUser, "Editor123!");
            if (result.Succeeded)
            {
                Console.WriteLine($"Editor user created: {editorEmail}");
            }
            else
            {
                Console.WriteLine($"Failed to create editor user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        // Create Sharz admin user if it doesn't exist
        var sharzAdminEmail = "admin@sharz.net";
        var sharzAdminUser = await userManager.FindByEmailAsync(sharzAdminEmail);

        if (sharzAdminUser == null)
        {
            sharzAdminUser = new User
            {
                Name = "Sharz Admin",
                Email = sharzAdminEmail,
                UserName = sharzAdminEmail,
                Role = UserRole.Admin,
                Status = UserStatus.Active,
                BrandId = 2, // Sharz brand
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(sharzAdminUser, "SharzAdmin123!");
            if (result.Succeeded)
            {
                Console.WriteLine($"Sharz admin user created: {sharzAdminEmail}");
            }
            else
            {
                Console.WriteLine($"Failed to create Sharz admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        // Create test user with simple password for testing
        var testEmail = "test@test.com";
        var testUser = await userManager.FindByEmailAsync(testEmail);

        if (testUser == null)
        {
            testUser = new User
            {
                Name = "Test User",
                Email = testEmail,
                UserName = testEmail,
                Role = UserRole.Admin,
                Status = UserStatus.Active,
                BrandId = 1, // Ovolt brand
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var testResult = await userManager.CreateAsync(testUser, "Test1234");
            if (testResult.Succeeded)
            {
                Console.WriteLine($"Test user created: {testEmail}");
            }
            else
            {
                Console.WriteLine($"Failed to create test user: {string.Join(", ", testResult.Errors.Select(e => e.Description))}");
            }
        }
    }
}