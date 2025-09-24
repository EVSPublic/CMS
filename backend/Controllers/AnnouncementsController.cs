using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/announcements")]
[Authorize]
public class AnnouncementsController : ControllerBase
{
    private readonly AdminPanelContext _context;
    private readonly ILogger<AnnouncementsController> _logger;

    public AnnouncementsController(AdminPanelContext context, ILogger<AnnouncementsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("{brandId}")]
    public async Task<IActionResult> GetAnnouncements(int brandId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? type = null, [FromQuery] string? status = null)
    {
        try
        {
            var query = _context.Announcements
                .Include(a => a.Brand)
                .Include(a => a.Creator)
                .Include(a => a.Updater)
                .Where(a => a.BrandId == brandId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(a => a.Title.Contains(search) || a.Content.Contains(search));
            }


            if (!string.IsNullOrEmpty(status) && Enum.TryParse<AnnouncementStatus>(status, true, out var statusEnum))
            {
                query = query.Where(a => a.Status == statusEnum);
            }

            var totalCount = await query.CountAsync();
            var announcements = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new AnnouncementDto
                {
                    Id = a.Id,
                    BrandId = a.BrandId,
                    Title = a.Title,
                    Content = a.Content,
                    ImageUrl = a.ImageUrl,
                    StartDate = a.StartDate,
                    EndDate = a.EndDate,
                    Status = a.Status.ToString(),
                    CreatedBy = a.CreatedBy,
                    UpdatedBy = a.UpdatedBy,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt,
                    BrandName = a.Brand.Name,
                    CreatorName = a.Creator!.Name,
                    UpdaterName = a.Updater!.Name
                })
                .ToListAsync();

            return Ok(new { announcements, totalCount, page, pageSize });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving announcements for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving announcements" } });
        }
    }

    [HttpGet("{brandId}/{id}")]
    public async Task<IActionResult> GetAnnouncement(int brandId, int id)
    {
        try
        {
            var announcementEntity = await _context.Announcements
                .Include(a => a.Brand)
                .Include(a => a.Creator)
                .Include(a => a.Updater)
                .Where(a => a.Id == id && a.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (announcementEntity == null)
            {
                return NotFound(new { error = new { code = "ANNOUNCEMENT_NOT_FOUND", message = "Announcement not found" } });
            }

            var announcement = new AnnouncementDto
            {
                Id = announcementEntity.Id,
                BrandId = announcementEntity.BrandId,
                Title = announcementEntity.Title,
                Content = announcementEntity.Content,
                ImageUrl = announcementEntity.ImageUrl,
                StartDate = announcementEntity.StartDate,
                EndDate = announcementEntity.EndDate,
                Status = announcementEntity.Status.ToString(),
                CreatedBy = announcementEntity.CreatedBy,
                UpdatedBy = announcementEntity.UpdatedBy,
                CreatedAt = announcementEntity.CreatedAt,
                UpdatedAt = announcementEntity.UpdatedAt,
                BrandName = announcementEntity.Brand.Name,
                CreatorName = announcementEntity.Creator?.Name,
                UpdaterName = announcementEntity.Updater?.Name
            };

            return Ok(announcement);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving announcement {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving announcement" } });
        }
    }

    [HttpPost("{brandId}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> CreateAnnouncement(int brandId, [FromBody] CreateAnnouncementDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }


            // Validate date range if provided
            if (request.StartDate.HasValue && request.EndDate.HasValue && request.StartDate > request.EndDate)
            {
                return BadRequest(new { error = new { code = "INVALID_DATE_RANGE", message = "Start date cannot be later than end date" } });
            }

            var announcement = new Announcement
            {
                BrandId = brandId,
                Title = request.Title,
                Content = request.Content,
                ImageUrl = request.ImageUrl,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = AnnouncementStatus.Draft,
                CreatedBy = currentUserId,
                UpdatedBy = currentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();

            // Return the newly created announcement
            var createdAnnouncementEntity = await _context.Announcements
                .Include(a => a.Brand)
                .Include(a => a.Creator)
                .Include(a => a.Updater)
                .Where(a => a.Id == announcement.Id)
                .FirstOrDefaultAsync();

            var createdAnnouncement = new AnnouncementDto
            {
                Id = createdAnnouncementEntity!.Id,
                BrandId = createdAnnouncementEntity.BrandId,
                Title = createdAnnouncementEntity.Title,
                Content = createdAnnouncementEntity.Content,
                ImageUrl = createdAnnouncementEntity.ImageUrl,
                StartDate = createdAnnouncementEntity.StartDate,
                EndDate = createdAnnouncementEntity.EndDate,
                Status = createdAnnouncementEntity.Status.ToString(),
                CreatedBy = createdAnnouncementEntity.CreatedBy,
                UpdatedBy = createdAnnouncementEntity.UpdatedBy,
                CreatedAt = createdAnnouncementEntity.CreatedAt,
                UpdatedAt = createdAnnouncementEntity.UpdatedAt,
                BrandName = createdAnnouncementEntity.Brand.Name,
                CreatorName = createdAnnouncementEntity.Creator?.Name,
                UpdaterName = createdAnnouncementEntity.Updater?.Name
            };

            return Ok(createdAnnouncement);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating announcement for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while creating announcement" } });
        }
    }

    [HttpPut("{brandId}/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdateAnnouncement(int brandId, int id, [FromBody] UpdateAnnouncementDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var announcement = await _context.Announcements
                .Where(a => a.Id == id && a.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (announcement == null)
            {
                return NotFound(new { error = new { code = "ANNOUNCEMENT_NOT_FOUND", message = "Announcement not found" } });
            }


            // Update fields if provided
            announcement.Title = request.Title ?? announcement.Title;
            announcement.Content = request.Content ?? announcement.Content;

            announcement.ImageUrl = request.ImageUrl ?? announcement.ImageUrl;

            if (request.StartDate.HasValue)
            {
                announcement.StartDate = request.StartDate;
            }

            if (request.EndDate.HasValue)
            {
                announcement.EndDate = request.EndDate;
            }

            // Validate date range
            if (announcement.StartDate.HasValue && announcement.EndDate.HasValue && announcement.StartDate > announcement.EndDate)
            {
                return BadRequest(new { error = new { code = "INVALID_DATE_RANGE", message = "Start date cannot be later than end date" } });
            }

            announcement.UpdatedBy = currentUserId;
            announcement.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Return updated announcement
            var updatedAnnouncementEntity = await _context.Announcements
                .Include(a => a.Brand)
                .Include(a => a.Creator)
                .Include(a => a.Updater)
                .Where(a => a.Id == id)
                .FirstOrDefaultAsync();

            var updatedAnnouncement = new AnnouncementDto
            {
                Id = updatedAnnouncementEntity!.Id,
                BrandId = updatedAnnouncementEntity.BrandId,
                Title = updatedAnnouncementEntity.Title,
                Content = updatedAnnouncementEntity.Content,
                ImageUrl = updatedAnnouncementEntity.ImageUrl,
                StartDate = updatedAnnouncementEntity.StartDate,
                EndDate = updatedAnnouncementEntity.EndDate,
                Status = updatedAnnouncementEntity.Status.ToString(),
                CreatedBy = updatedAnnouncementEntity.CreatedBy,
                UpdatedBy = updatedAnnouncementEntity.UpdatedBy,
                CreatedAt = updatedAnnouncementEntity.CreatedAt,
                UpdatedAt = updatedAnnouncementEntity.UpdatedAt,
                BrandName = updatedAnnouncementEntity.Brand.Name,
                CreatorName = updatedAnnouncementEntity.Creator?.Name,
                UpdaterName = updatedAnnouncementEntity.Updater?.Name
            };

            return Ok(updatedAnnouncement);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating announcement {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while updating announcement" } });
        }
    }

    [HttpDelete("{brandId}/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> DeleteAnnouncement(int brandId, int id)
    {
        try
        {
            var announcement = await _context.Announcements
                .Where(a => a.Id == id && a.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (announcement == null)
            {
                return NotFound(new { error = new { code = "ANNOUNCEMENT_NOT_FOUND", message = "Announcement not found" } });
            }

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Announcement deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting announcement {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while deleting announcement" } });
        }
    }

    [HttpPost("{brandId}/{id}/publish")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> PublishAnnouncement(int brandId, int id, [FromBody] PublishAnnouncementDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var announcement = await _context.Announcements
                .Where(a => a.Id == id && a.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (announcement == null)
            {
                return NotFound(new { error = new { code = "ANNOUNCEMENT_NOT_FOUND", message = "Announcement not found" } });
            }

            announcement.Status = request.Publish ? AnnouncementStatus.Published : AnnouncementStatus.Draft;
            announcement.UpdatedBy = currentUserId;
            announcement.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = request.Publish ? "Announcement published successfully" : "Announcement unpublished successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing announcement {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while publishing announcement" } });
        }
    }
}