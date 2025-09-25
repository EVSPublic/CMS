using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/v1/media")]
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
                .Include(m => m.MediaItemFolders)
                    .ThenInclude(mif => mif.MediaFolder)
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
                    Id = m.Id.ToString(),
                    BrandId = m.BrandId,
                    Filename = m.FileName,
                    Url = $"/media/{m.FilePath.Replace("uploads/", "")}",
                    Thumbnail = $"/thumbnails/{m.FilePath.Replace("uploads/", "")}",
                    Size = m.FileSize,
                    Type = m.FileType,
                    Alt = m.AltText ?? "",
                    Tags = new List<string>(), // TODO: Implement tags system
                    Category = "general", // TODO: Implement categories
                    Folders = m.MediaItemFolders.Select(mif => new MediaFolderDto
                    {
                        Id = mif.MediaFolder.Id,
                        Name = mif.MediaFolder.Name,
                        Description = mif.MediaFolder.Description,
                        ItemCount = 0 // Will be calculated separately if needed
                    }).ToList(),
                    UploadDate = m.CreatedAt,
                    Status = m.Status.ToString(),
                    CreatedBy = m.CreatedBy,
                    UpdatedBy = m.UpdatedBy,
                    CreatedAt = m.CreatedAt,
                    UpdatedAt = m.UpdatedAt,
                    BrandName = m.Brand.Name,
                    CreatorName = m.Creator != null ? m.Creator.Name : null,
                    UpdaterName = m.Updater != null ? m.Updater.Name : null
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
                Id = mediaItemEntity.Id.ToString(),
                BrandId = mediaItemEntity.BrandId,
                Filename = mediaItemEntity.FileName,
                Url = $"/media/{mediaItemEntity.FilePath.Replace("uploads/", "")}",
                Thumbnail = $"thumbnails/{mediaItemEntity.FilePath.Replace("uploads/", "")}",
                Size = mediaItemEntity.FileSize,
                Type = mediaItemEntity.FileType,
                Alt = mediaItemEntity.AltText ?? "",
                Tags = new List<string>(),
                Category = "general",
                UploadDate = mediaItemEntity.CreatedAt,
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
                Id = createdMediaItemEntity!.Id.ToString(),
                BrandId = createdMediaItemEntity.BrandId,
                Filename = createdMediaItemEntity.FileName,
                Url = $"/media/{createdMediaItemEntity.FilePath.Replace("uploads/", "")}",
                Thumbnail = $"thumbnails/{createdMediaItemEntity.FilePath.Replace("uploads/", "")}",
                Size = createdMediaItemEntity.FileSize,
                Type = createdMediaItemEntity.FileType,
                Alt = createdMediaItemEntity.AltText ?? "",
                Tags = new List<string>(), // TODO: Implement tags system
                Category = "general", // TODO: Implement categories
                UploadDate = createdMediaItemEntity.CreatedAt,
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
                Id = updatedMediaItemEntity!.Id.ToString(),
                BrandId = updatedMediaItemEntity.BrandId,
                Filename = updatedMediaItemEntity.FileName,
                Url = $"/media/{updatedMediaItemEntity.FilePath.Replace("uploads/", "")}",
                Thumbnail = $"thumbnails/{updatedMediaItemEntity.FilePath.Replace("uploads/", "")}",
                Size = updatedMediaItemEntity.FileSize,
                Type = updatedMediaItemEntity.FileType,
                Alt = updatedMediaItemEntity.AltText ?? "",
                Tags = new List<string>(),
                Category = "general",
                UploadDate = updatedMediaItemEntity.CreatedAt,
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
                Id = createdMediaItemEntity!.Id.ToString(),
                BrandId = createdMediaItemEntity.BrandId,
                Filename = createdMediaItemEntity.FileName,
                Url = $"/media/{createdMediaItemEntity.FilePath.Replace("uploads/", "")}",
                Thumbnail = $"thumbnails/{createdMediaItemEntity.FilePath.Replace("uploads/", "")}",
                Size = createdMediaItemEntity.FileSize,
                Type = createdMediaItemEntity.FileType,
                Alt = createdMediaItemEntity.AltText ?? "",
                Tags = new List<string>(), // TODO: Implement tags system
                Category = "general", // TODO: Implement categories
                UploadDate = createdMediaItemEntity.CreatedAt,
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

    // FOLDER ENDPOINTS

    [HttpGet("{brandId}/folders")]
    public async Task<IActionResult> GetMediaFolders(int brandId)
    {
        try
        {
            var folders = await _context.MediaFolders
                .Where(f => f.BrandId == brandId)
                .Select(f => new MediaFolderDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Description = f.Description,
                    ItemCount = f.MediaItemFolders.Count(),
                    CreatedAt = f.CreatedAt,
                    UpdatedAt = f.UpdatedAt
                })
                .OrderBy(f => f.Name)
                .ToListAsync();

            return Ok(folders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving media folders for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving media folders" } });
        }
    }

    [HttpPost("{brandId}/folders")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> CreateMediaFolder(int brandId, [FromBody] CreateMediaFolderDto request)
    {
        try
        {
            var existingFolder = await _context.MediaFolders
                .Where(f => f.BrandId == brandId && f.Name == request.Name)
                .FirstOrDefaultAsync();

            if (existingFolder != null)
            {
                return BadRequest(new { error = new { code = "FOLDER_NAME_EXISTS", message = "A folder with this name already exists" } });
            }

            var folder = new MediaFolder
            {
                BrandId = brandId,
                Name = request.Name,
                Description = request.Description
            };

            _context.MediaFolders.Add(folder);
            await _context.SaveChangesAsync();

            var folderDto = new MediaFolderDto
            {
                Id = folder.Id,
                Name = folder.Name,
                Description = folder.Description,
                ItemCount = 0,
                CreatedAt = folder.CreatedAt,
                UpdatedAt = folder.UpdatedAt
            };

            return Ok(folderDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating media folder for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while creating media folder" } });
        }
    }

    [HttpPut("{brandId}/folders/{folderId}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdateMediaFolder(int brandId, int folderId, [FromBody] UpdateMediaFolderDto request)
    {
        try
        {
            var folder = await _context.MediaFolders
                .Where(f => f.Id == folderId && f.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (folder == null)
            {
                return NotFound(new { error = new { code = "FOLDER_NOT_FOUND", message = "Media folder not found" } });
            }

            if (!string.IsNullOrEmpty(request.Name))
            {
                var existingFolder = await _context.MediaFolders
                    .Where(f => f.BrandId == brandId && f.Name == request.Name && f.Id != folderId)
                    .FirstOrDefaultAsync();

                if (existingFolder != null)
                {
                    return BadRequest(new { error = new { code = "FOLDER_NAME_EXISTS", message = "A folder with this name already exists" } });
                }

                folder.Name = request.Name;
            }

            if (request.Description != null)
            {
                folder.Description = request.Description;
            }

            folder.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var folderDto = new MediaFolderDto
            {
                Id = folder.Id,
                Name = folder.Name,
                Description = folder.Description,
                ItemCount = await _context.MediaItemFolders.CountAsync(mif => mif.MediaFolderId == folderId),
                CreatedAt = folder.CreatedAt,
                UpdatedAt = folder.UpdatedAt
            };

            return Ok(folderDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating media folder {FolderId} for brand {BrandId}", folderId, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while updating media folder" } });
        }
    }

    [HttpDelete("{brandId}/folders/{folderId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteMediaFolder(int brandId, int folderId)
    {
        try
        {
            var folder = await _context.MediaFolders
                .Where(f => f.Id == folderId && f.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (folder == null)
            {
                return NotFound(new { error = new { code = "FOLDER_NOT_FOUND", message = "Media folder not found" } });
            }

            _context.MediaFolders.Remove(folder);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Media folder deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting media folder {FolderId} for brand {BrandId}", folderId, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while deleting media folder" } });
        }
    }

    [HttpPut("{brandId}/{mediaItemId}/folders")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdateMediaItemFolders(int brandId, int mediaItemId, [FromBody] UpdateMediaItemFoldersDto request)
    {
        try
        {
            var mediaItem = await _context.MediaItems
                .Where(m => m.Id == mediaItemId && m.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (mediaItem == null)
            {
                return NotFound(new { error = new { code = "MEDIA_ITEM_NOT_FOUND", message = "Media item not found" } });
            }

            // Verify all folders exist and belong to the brand
            var folders = await _context.MediaFolders
                .Where(f => request.FolderIds.Contains(f.Id) && f.BrandId == brandId)
                .ToListAsync();

            if (folders.Count != request.FolderIds.Count)
            {
                return BadRequest(new { error = new { code = "INVALID_FOLDER_IDS", message = "One or more folder IDs are invalid" } });
            }

            // Remove existing folder relationships
            var existingRelationships = await _context.MediaItemFolders
                .Where(mif => mif.MediaItemId == mediaItemId)
                .ToListAsync();

            _context.MediaItemFolders.RemoveRange(existingRelationships);

            // Add new folder relationships
            foreach (var folderId in request.FolderIds)
            {
                _context.MediaItemFolders.Add(new MediaItemFolder
                {
                    MediaItemId = mediaItemId,
                    MediaFolderId = folderId
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Media item folders updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating folders for media item {MediaItemId} in brand {BrandId}", mediaItemId, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while updating media item folders" } });
        }
    }
}