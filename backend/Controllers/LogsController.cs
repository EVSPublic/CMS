using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/v1/logs")]
[Authorize]
public class LogsController : ControllerBase
{
    private readonly AdminPanelContext _context;
    private readonly ILogger<LogsController> _logger;

    public LogsController(AdminPanelContext context, ILogger<LogsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreateLog([FromBody] CreateActivityLogDto request)
    {
        try
        {
            // Get current user
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var activityLog = new ActivityLog
            {
                Timestamp = DateTime.UtcNow,
                Action = request.Action,
                Details = request.Details,
                UserId = currentUserId,
                UserName = currentUser.Name,
                ResourceType = request.ResourceType,
                ResourceId = request.ResourceId,
                BrandId = request.BrandId,
                BrandName = request.BrandName,
                Level = request.Level,
                Metadata = request.Metadata
            };

            _context.ActivityLogs.Add(activityLog);
            await _context.SaveChangesAsync();

            var response = new ActivityLogDto
            {
                Id = activityLog.Id,
                Timestamp = activityLog.Timestamp,
                Action = activityLog.Action,
                Details = activityLog.Details,
                UserId = activityLog.UserId,
                UserName = activityLog.UserName,
                ResourceType = activityLog.ResourceType,
                ResourceId = activityLog.ResourceId,
                BrandId = activityLog.BrandId,
                BrandName = activityLog.BrandName,
                Level = activityLog.Level,
                Metadata = activityLog.Metadata
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating activity log");
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while creating log" } });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetLogs([FromQuery] ActivityLogFilterDto filter)
    {
        try
        {
            // Get current user (all users can view logs)
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var query = _context.ActivityLogs
                .Include(l => l.User)
                .Include(l => l.Brand)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(filter.Action))
            {
                query = query.Where(l => l.Action == filter.Action);
            }

            if (!string.IsNullOrEmpty(filter.Level))
            {
                query = query.Where(l => l.Level == filter.Level);
            }

            if (filter.BrandId.HasValue)
            {
                query = query.Where(l => l.BrandId == filter.BrandId);
            }

            if (filter.UserId.HasValue)
            {
                query = query.Where(l => l.UserId == filter.UserId);
            }

            if (filter.StartDate.HasValue)
            {
                query = query.Where(l => l.Timestamp >= filter.StartDate);
            }

            if (filter.EndDate.HasValue)
            {
                query = query.Where(l => l.Timestamp <= filter.EndDate);
            }

            // Get total count
            var total = await query.CountAsync();

            // Apply pagination
            var logs = await query
                .OrderByDescending(l => l.Timestamp)
                .Skip((filter.Page - 1) * filter.Limit)
                .Take(filter.Limit)
                .Select(l => new ActivityLogDto
                {
                    Id = l.Id,
                    Timestamp = l.Timestamp,
                    Action = l.Action,
                    Details = l.Details,
                    UserId = l.UserId,
                    UserName = l.UserName,
                    ResourceType = l.ResourceType,
                    ResourceId = l.ResourceId,
                    BrandId = l.BrandId,
                    BrandName = l.BrandName,
                    Level = l.Level,
                    Metadata = l.Metadata
                })
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)total / filter.Limit);

            var response = new ActivityLogResponseDto
            {
                Logs = logs,
                Total = total,
                Page = filter.Page,
                Limit = filter.Limit,
                TotalPages = totalPages
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving activity logs");
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving logs" } });
        }
    }

    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentLogs([FromQuery] int limit = 5)
    {
        try
        {
            // Get current user
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var logs = await _context.ActivityLogs
                .Include(l => l.User)
                .Include(l => l.Brand)
                .OrderByDescending(l => l.Timestamp)
                .Take(limit)
                .Select(l => new ActivityLogDto
                {
                    Id = l.Id,
                    Timestamp = l.Timestamp,
                    Action = l.Action,
                    Details = l.Details,
                    UserId = l.UserId,
                    UserName = l.UserName,
                    ResourceType = l.ResourceType,
                    ResourceId = l.ResourceId,
                    BrandId = l.BrandId,
                    BrandName = l.BrandName,
                    Level = l.Level,
                    Metadata = l.Metadata
                })
                .ToListAsync();

            return Ok(logs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving recent activity logs");
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving recent logs" } });
        }
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ClearLogs()
    {
        try
        {
            // Get current user
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            // Delete all logs
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM ActivityLogs");

            // Log the clear action
            var clearLog = new ActivityLog
            {
                Timestamp = DateTime.UtcNow,
                Action = "logs_clear",
                Details = "Tüm aktivite logları temizlendi",
                UserId = currentUserId,
                UserName = currentUser.Name,
                Level = "warning"
            };

            _context.ActivityLogs.Add(clearLog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "All logs cleared successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing activity logs");
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while clearing logs" } });
        }
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetLogStats()
    {
        try
        {
            // Get current user
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var totalLogs = await _context.ActivityLogs.CountAsync();
            var todayLogs = await _context.ActivityLogs
                .Where(l => l.Timestamp.Date == DateTime.UtcNow.Date)
                .CountAsync();

            var logsByLevel = await _context.ActivityLogs
                .GroupBy(l => l.Level)
                .Select(g => new { Level = g.Key, Count = g.Count() })
                .ToListAsync();

            var logsByAction = await _context.ActivityLogs
                .GroupBy(l => l.Action)
                .Select(g => new { Action = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .Take(10)
                .ToListAsync();

            return Ok(new
            {
                totalLogs,
                todayLogs,
                logsByLevel,
                logsByAction
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving log statistics");
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving log statistics" } });
        }
    }
}