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
            var mediaUploadsCount = await _context.MediaFiles.CountAsync();
            
            var process = Process.GetCurrentProcess();
            // Memory usage in MB
            var memoryUsage = process.WorkingSet64 / (1024 * 1024);

            var stats = new
            {
                mediaUploadsCount,
                activeUserSessions = new Random().Next(5, 25), // Mock
                serverResourceUsage = new { 
                    cpu = await AdminPanel.Services.SystemUsage.GetCpuUsageForProcess(),
                    memory = memoryUsage 
                },
                recentActivity = await _context.MediaFiles
                    .OrderByDescending(mf => mf.CreatedAt)
                    .Take(3)
                    .Select(mf => new { 
                        user = mf.Creator != null ? mf.Creator.UserName : "System", 
                        action = $"Uploaded {mf.Filename}", 
                        timestamp = mf.CreatedAt 
                    })
                    .ToListAsync()
            };

            return Ok(stats);
        }


    }
}