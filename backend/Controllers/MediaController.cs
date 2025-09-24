using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/media")]
[Authorize]
public class MediaController : ControllerBase
{
    private readonly AdminPanelContext _context;
    private readonly ILogger<MediaController> _logger;

    public MediaController(AdminPanelContext context, ILogger<MediaController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("{brandId}")]
    public async Task<IActionResult> GetMediaItems(int brandId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? fileType = null, [FromQuery] string? status = null)
    {
        try
        {
            var query = _context.MediaItems
                .Include(m => m.Brand)
                .Include(m => m.Creator)
                .Include(m => m.Updater)
                .Where(m => m.BrandId == brandId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m => m.FileName.Contains(search) || (m.AltText != null && m.AltText.Contains(search)) || (m.Caption != null && m.Caption.Contains(search)));
            }

            if (!string.IsNullOrEmpty(fileType))
            {
                query = query.Where(m => m.FileType.Contains(fileType));
            }

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<ContentStatus>(status, true, out var statusEnum))
            {
                query = query.Where(m => m.Status == statusEnum);
            }

            var totalCount = await query.CountAsync();
            var mediaItems = await query
                .OrderByDescending(m => m.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MediaItemDto
                {
                    Id = m.Id,
                    BrandId = m.BrandId,
                    FileName = m.FileName,
                    FilePath = m.FilePath,
                    FileType = m.FileType,
                    FileSize = m.FileSize,
                    AltText = m.AltText,
                    Caption = m.Caption,
                    Status = m.Status.ToString(),
                    CreatedBy = m.CreatedBy,
                    UpdatedBy = m.UpdatedBy,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt,
                    BrandName = m.Brand.Name,
                    CreatorName = m.Creator!.Name,
                    UpdaterName = m.Updater!.Name
                })
                .ToListAsync();

            return Ok(new { mediaItems, totalCount, page, pageSize });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving media items for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving media items" } });
        }
    }

    [HttpGet("{brandId}/{id}")]
    public async Task<IActionResult> GetMediaItem(int brandId, int id)
    {
        try
        {
            var mediaItemEntity = await _context.MediaItems
                .Include(m => m.Brand)
                .Include(m => m.Creator)
                .Include(m => m.Updater)
                .Where(m => m.Id == id && m.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (mediaItemEntity == null)
            {
                return NotFound(new { error = new { code = "MEDIA_ITEM_NOT_FOUND", message = "Media item not found" } });
            }

            var mediaItem = new MediaItemDto
            {
                Id = mediaItemEntity.Id,
                BrandId = mediaItemEntity.BrandId,
                FileName = mediaItemEntity.FileName,
                FilePath = mediaItemEntity.FilePath,
                FileType = mediaItemEntity.FileType,
                FileSize = mediaItemEntity.FileSize,
                AltText = mediaItemEntity.AltText,
                Caption = mediaItemEntity.Caption,
                Status = mediaItemEntity.Status.ToString(),
                CreatedBy = mediaItemEntity.CreatedBy,
                UpdatedBy = mediaItemEntity.UpdatedBy,
                CreatedAt = mediaItemEntity.CreatedAt,
                UpdatedAt = mediaItemEntity.UpdatedAt,
                BrandName = mediaItemEntity.Brand.Name,
                CreatorName = mediaItemEntity.Creator?.Name,
                UpdaterName = mediaItemEntity.Updater?.Name
            };

            return Ok(mediaItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving media item {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving media item" } });
        }
    }

    [HttpPost("{brandId}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> CreateMediaItem(int brandId, [FromBody] CreateMediaItemDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var mediaItem = new MediaItem
            {
                BrandId = brandId,
                FileName = request.FileName,
                FilePath = request.FilePath,
                FileType = request.FileType,
                FileSize = request.FileSize,
                AltText = request.AltText,
                Caption = request.Caption,
                Status = ContentStatus.Draft,
                CreatedBy = currentUserId,
                UpdatedBy = currentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.MediaItems.Add(mediaItem);
            await _context.SaveChangesAsync();

            // Return the newly created media item
            var createdMediaItemEntity = await _context.MediaItems
                .Include(m => m.Brand)
                .Include(m => m.Creator)
                .Include(m => m.Updater)
                .Where(m => m.Id == mediaItem.Id)
                .FirstOrDefaultAsync();

            var createdMediaItem = new MediaItemDto
            {
                Id = createdMediaItemEntity!.Id,
                BrandId = createdMediaItemEntity.BrandId,
                FileName = createdMediaItemEntity.FileName,
                FilePath = createdMediaItemEntity.FilePath,
                FileType = createdMediaItemEntity.FileType,
                FileSize = createdMediaItemEntity.FileSize,
                AltText = createdMediaItemEntity.AltText,
                Caption = createdMediaItemEntity.Caption,
                Status = createdMediaItemEntity.Status.ToString(),
                CreatedBy = createdMediaItemEntity.CreatedBy,
                UpdatedBy = createdMediaItemEntity.UpdatedBy,
                CreatedAt = createdMediaItemEntity.CreatedAt,
                UpdatedAt = createdMediaItemEntity.UpdatedAt,
                BrandName = createdMediaItemEntity.Brand.Name,
                CreatorName = createdMediaItemEntity.Creator?.Name,
                UpdaterName = createdMediaItemEntity.Updater?.Name
            };

            return Ok(createdMediaItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating media item for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while creating media item" } });
        }
    }

    [HttpPut("{brandId}/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdateMediaItem(int brandId, int id, [FromBody] UpdateMediaItemDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var mediaItem = await _context.MediaItems
                .Where(m => m.Id == id && m.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (mediaItem == null)
            {
                return NotFound(new { error = new { code = "MEDIA_ITEM_NOT_FOUND", message = "Media item not found" } });
            }

            // Update fields if provided
            mediaItem.FileName = request.FileName ?? mediaItem.FileName;
            mediaItem.AltText = request.AltText ?? mediaItem.AltText;
            mediaItem.Caption = request.Caption ?? mediaItem.Caption;
            mediaItem.UpdatedBy = currentUserId;
            mediaItem.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Return updated media item
            var updatedMediaItemEntity = await _context.MediaItems
                .Include(m => m.Brand)
                .Include(m => m.Creator)
                .Include(m => m.Updater)
                .Where(m => m.Id == id)
                .FirstOrDefaultAsync();

            var updatedMediaItem = new MediaItemDto
            {
                Id = updatedMediaItemEntity!.Id,
                BrandId = updatedMediaItemEntity.BrandId,
                FileName = updatedMediaItemEntity.FileName,
                FilePath = updatedMediaItemEntity.FilePath,
                FileType = updatedMediaItemEntity.FileType,
                FileSize = updatedMediaItemEntity.FileSize,
                AltText = updatedMediaItemEntity.AltText,
                Caption = updatedMediaItemEntity.Caption,
                Status = updatedMediaItemEntity.Status.ToString(),
                CreatedBy = updatedMediaItemEntity.CreatedBy,
                UpdatedBy = updatedMediaItemEntity.UpdatedBy,
                CreatedAt = updatedMediaItemEntity.CreatedAt,
                UpdatedAt = updatedMediaItemEntity.UpdatedAt,
                BrandName = updatedMediaItemEntity.Brand.Name,
                CreatorName = updatedMediaItemEntity.Creator?.Name,
                UpdaterName = updatedMediaItemEntity.Updater?.Name
            };

            return Ok(updatedMediaItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating media item {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while updating media item" } });
        }
    }

    [HttpDelete("{brandId}/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> DeleteMediaItem(int brandId, int id)
    {
        try
        {
            var mediaItem = await _context.MediaItems
                .Where(m => m.Id == id && m.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (mediaItem == null)
            {
                return NotFound(new { error = new { code = "MEDIA_ITEM_NOT_FOUND", message = "Media item not found" } });
            }

            _context.MediaItems.Remove(mediaItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Media item deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting media item {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while deleting media item" } });
        }
    }

    [HttpPost("{brandId}/{id}/publish")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> PublishMediaItem(int brandId, int id, [FromBody] PublishMediaItemDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var mediaItem = await _context.MediaItems
                .Where(m => m.Id == id && m.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (mediaItem == null)
            {
                return NotFound(new { error = new { code = "MEDIA_ITEM_NOT_FOUND", message = "Media item not found" } });
            }

            mediaItem.Status = request.Publish ? ContentStatus.Published : ContentStatus.Draft;
            mediaItem.UpdatedBy = currentUserId;
            mediaItem.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = request.Publish ? "Media item published successfully" : "Media item unpublished successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing media item {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while publishing media item" } });
        }
    }

    [HttpPost("{brandId}/upload")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UploadFile(int brandId, IFormFile file, [FromForm] string? altText = null, [FromForm] string? caption = null)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { error = new { code = "NO_FILE_PROVIDED", message = "No file was provided" } });
            }

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            // Generate a unique file name
            var fileExtension = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var uploadPath = Path.Combine("uploads", brandId.ToString());
            var fullUploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", uploadPath);

            // Create directory if it doesn't exist
            if (!Directory.Exists(fullUploadPath))
            {
                Directory.CreateDirectory(fullUploadPath);
            }

            var filePath = Path.Combine(fullUploadPath, uniqueFileName);
            var relativePath = Path.Combine(uploadPath, uniqueFileName).Replace("\\", "/");

            // Save the file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Create media item record
            var mediaItem = new MediaItem
            {
                BrandId = brandId,
                FileName = file.FileName,
                FilePath = relativePath,
                FileType = file.ContentType,
                FileSize = file.Length,
                AltText = altText,
                Caption = caption,
                Status = ContentStatus.Draft,
                CreatedBy = currentUserId,
                UpdatedBy = currentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.MediaItems.Add(mediaItem);
            await _context.SaveChangesAsync();

            // Return the newly created media item
            var createdMediaItemEntity = await _context.MediaItems
                .Include(m => m.Brand)
                .Include(m => m.Creator)
                .Include(m => m.Updater)
                .Where(m => m.Id == mediaItem.Id)
                .FirstOrDefaultAsync();

            var createdMediaItem = new MediaItemDto
            {
                Id = createdMediaItemEntity!.Id,
                BrandId = createdMediaItemEntity.BrandId,
                FileName = createdMediaItemEntity.FileName,
                FilePath = createdMediaItemEntity.FilePath,
                FileType = createdMediaItemEntity.FileType,
                FileSize = createdMediaItemEntity.FileSize,
                AltText = createdMediaItemEntity.AltText,
                Caption = createdMediaItemEntity.Caption,
                Status = createdMediaItemEntity.Status.ToString(),
                CreatedBy = createdMediaItemEntity.CreatedBy,
                UpdatedBy = createdMediaItemEntity.UpdatedBy,
                CreatedAt = createdMediaItemEntity.CreatedAt,
                UpdatedAt = createdMediaItemEntity.UpdatedAt,
                BrandName = createdMediaItemEntity.Brand.Name,
                CreatorName = createdMediaItemEntity.Creator?.Name,
                UpdaterName = createdMediaItemEntity.Updater?.Name
            };

            return Ok(createdMediaItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while uploading file" } });
        }
    }
}