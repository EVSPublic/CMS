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
        public async Task<IActionResult> GetDashboardStats()
        {
            // Count all media items across all brands
            var mediaUploadsCount = await _context.MediaItems.CountAsync();

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

            // Content counts by type
            var announcementsCount = await _context.Announcements.CountAsync();
            var partnersCount = await _context.Partnerships.CountAsync();
            var staticPagesCount = await _context.StaticPages.CountAsync();

            // Ovolt (BrandId = 1) specific counts
            var ovoltAnnouncementsCount = await _context.Announcements
                .Where(a => a.BrandId == 1)
                .CountAsync();

            // Sharz.net (BrandId = 2) specific counts - Products would go here
            // var sharzProductsCount = await _context.Products.Where(p => p.BrandId == 2).CountAsync();

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
                    ovoltAnnouncements = ovoltAnnouncementsCount,
                    partners = partnersCount,
                    staticPages = staticPagesCount,
                    // sharzProducts = sharzProductsCount // When Product model is added
                },
                recentActivity = await _context.MediaItems
                    .Include(mi => mi.Creator)
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