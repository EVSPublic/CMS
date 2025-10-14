using AdminPanel.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace AdminPanel.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AdminPanelContext _context;

        public DashboardController(AdminPanelContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats([FromQuery] int? brandId = null)
        {
            // If no brandId provided, return error
            if (!brandId.HasValue)
            {
                return BadRequest(new { error = "BrandId is required" });
            }

            // Count media items for the selected brand only
            var mediaUploadsCount = await _context.MediaItems
                .Where(mi => mi.BrandId == brandId.Value)
                .CountAsync();

            var process = Process.GetCurrentProcess();
            // Memory usage in MB
            var memoryUsage = process.WorkingSet64 / (1024 * 1024);

            // Get CPU usage with error handling
            float cpuUsage = 0;
            try
            {
                cpuUsage = await AdminPanel.Services.SystemUsage.GetCpuUsageForProcess(100); // Reduced delay
            }
            catch (Exception ex)
            {
                // Log the error but continue - CPU will show as 0
                Console.WriteLine($"Error getting CPU usage: {ex.Message}");
            }

            // Content counts filtered by brand
            var announcementsCount = await _context.Announcements
                .Where(a => a.BrandId == brandId.Value)
                .CountAsync();

            var partnersCount = await _context.Partnerships
                .Where(p => p.BrandId == brandId.Value)
                .CountAsync();

            var staticPagesCount = await _context.StaticPages
                .Where(sp => sp.BrandId == brandId.Value)
                .CountAsync();

            // Products count - extract from IndividualSolutions ContentPage JSON
            var productsCount = 0;
            var individualSolutionsPage = await _context.ContentPages
                .Where(cp => cp.BrandId == brandId.Value && cp.PageType == Models.PageType.IndividualSolutions)
                .FirstOrDefaultAsync();

            if (individualSolutionsPage != null && !string.IsNullOrEmpty(individualSolutionsPage.Content))
            {
                try
                {
                    var contentJson = System.Text.Json.JsonDocument.Parse(individualSolutionsPage.Content);
                    if (contentJson.RootElement.TryGetProperty("products", out var productsElement))
                    {
                        productsCount = productsElement.GetArrayLength();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error parsing products from content: {ex.Message}");
                }
            }

            var stats = new
            {
                mediaUploadsCount,
                activeUserSessions = new Random().Next(15, 35), // Mock - more realistic range
                serverResourceUsage = new {
                    cpu = cpuUsage,
                    memory = memoryUsage
                },
                contentCounts = new {
                    announcements = announcementsCount,
                    partners = partnersCount,
                    staticPages = staticPagesCount,
                    products = productsCount,
                    brandId = brandId.Value
                },
                recentActivity = await _context.MediaItems
                    .Include(mi => mi.Creator)
                    .Where(mi => mi.BrandId == brandId.Value)
                    .OrderByDescending(mi => mi.CreatedAt)
                    .Take(3)
                    .Select(mi => new {
                        user = mi.Creator != null ? mi.Creator.UserName : "System",
                        action = $"Uploaded {mi.FileName}",
                        timestamp = mi.CreatedAt
                    })
                    .ToListAsync()
            };

            return Ok(stats);
        }


    }
}