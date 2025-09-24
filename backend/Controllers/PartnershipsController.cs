using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/partnerships")]
[Authorize]
public class PartnershipsController : ControllerBase
{
    private readonly AdminPanelContext _context;
    private readonly ILogger<PartnershipsController> _logger;

    public PartnershipsController(AdminPanelContext context, ILogger<PartnershipsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("{brandId}")]
    public async Task<IActionResult> GetPartnerships(int brandId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? status = null)
    {
        try
        {
            var query = _context.Partnerships
                .Include(p => p.Brand)
                .Include(p => p.Creator)
                .Include(p => p.Updater)
                .Where(p => p.BrandId == brandId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.CompanyName.Contains(search) || (p.Description != null && p.Description.Contains(search)));
            }

            if (!string.IsNullOrEmpty(status) && Enum.TryParse<PartnershipStatus>(status, true, out var statusEnum))
            {
                query = query.Where(p => p.Status == statusEnum);
            }

            var totalCount = await query.CountAsync();
            var partnerships = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PartnershipDto
                {
                    Id = p.Id,
                    BrandId = p.BrandId,
                    Name = p.CompanyName,
                    LogoUrl = null,
                    WebsiteUrl = null,
                    Description = p.Description,
                    ContactEmail = p.Email,
                    ContactPhone = p.Phone,
                    Status = p.Status.ToString(),
                    CreatedBy = p.CreatedBy,
                    UpdatedBy = p.UpdatedBy,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    BrandName = p.Brand.Name,
                    CreatorName = p.Creator!.Name,
                    UpdaterName = p.Updater!.Name
                })
                .ToListAsync();

            return Ok(new { partnerships, totalCount, page, pageSize });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving partnerships for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving partnerships" } });
        }
    }

    [HttpGet("{brandId}/{id}")]
    public async Task<IActionResult> GetPartnership(int brandId, int id)
    {
        try
        {
            var partnershipEntity = await _context.Partnerships
                .Include(p => p.Brand)
                .Include(p => p.Creator)
                .Include(p => p.Updater)
                .Where(p => p.Id == id && p.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (partnershipEntity == null)
            {
                return NotFound(new { error = new { code = "PARTNERSHIP_NOT_FOUND", message = "Partnership not found" } });
            }

            var partnership = new PartnershipDto
            {
                Id = partnershipEntity.Id,
                BrandId = partnershipEntity.BrandId,
                Name = partnershipEntity.CompanyName,
                LogoUrl = null,
                WebsiteUrl = null,
                Description = partnershipEntity.Description,
                ContactEmail = partnershipEntity.Email,
                ContactPhone = partnershipEntity.Phone,
                Status = partnershipEntity.Status.ToString(),
                CreatedBy = partnershipEntity.CreatedBy,
                UpdatedBy = partnershipEntity.UpdatedBy,
                CreatedAt = partnershipEntity.CreatedAt,
                UpdatedAt = partnershipEntity.UpdatedAt,
                BrandName = partnershipEntity.Brand.Name,
                CreatorName = partnershipEntity.Creator?.Name,
                UpdaterName = partnershipEntity.Updater?.Name
            };

            return Ok(partnership);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving partnership {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving partnership" } });
        }
    }

    [HttpPost("{brandId}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> CreatePartnership(int brandId, [FromBody] CreatePartnershipDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            // Check if partnership name is unique within the brand
            var nameExists = await _context.Partnerships
                .AnyAsync(p => p.BrandId == brandId && p.CompanyName == request.Name);

            if (nameExists)
            {
                return BadRequest(new { error = new { code = "DUPLICATE_PARTNERSHIP_NAME", message = "A partnership with this name already exists for this brand" } });
            }

            var partnership = new Partnership
            {
                BrandId = brandId,
                CompanyName = request.Name,
                Email = request.ContactEmail,
                Phone = request.ContactPhone,
                Description = request.Description,
                Status = PartnershipStatus.Pending,
                CreatedBy = currentUserId,
                UpdatedBy = currentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Partnerships.Add(partnership);
            await _context.SaveChangesAsync();

            // Return the newly created partnership
            var createdPartnershipEntity = await _context.Partnerships
                .Include(p => p.Brand)
                .Include(p => p.Creator)
                .Include(p => p.Updater)
                .Where(p => p.Id == partnership.Id)
                .FirstOrDefaultAsync();

            var createdPartnership = new PartnershipDto
            {
                Id = createdPartnershipEntity!.Id,
                BrandId = createdPartnershipEntity.BrandId,
                Name = createdPartnershipEntity.CompanyName,
                LogoUrl = null,
                WebsiteUrl = null,
                Description = createdPartnershipEntity.Description,
                ContactEmail = createdPartnershipEntity.Email,
                ContactPhone = createdPartnershipEntity.Phone,
                Status = createdPartnershipEntity.Status.ToString(),
                CreatedBy = createdPartnershipEntity.CreatedBy,
                UpdatedBy = createdPartnershipEntity.UpdatedBy,
                CreatedAt = createdPartnershipEntity.CreatedAt,
                UpdatedAt = createdPartnershipEntity.UpdatedAt,
                BrandName = createdPartnershipEntity.Brand.Name,
                CreatorName = createdPartnershipEntity.Creator?.Name,
                UpdaterName = createdPartnershipEntity.Updater?.Name
            };

            return Ok(createdPartnership);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating partnership for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while creating partnership" } });
        }
    }

    [HttpPut("{brandId}/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdatePartnership(int brandId, int id, [FromBody] UpdatePartnershipDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var partnership = await _context.Partnerships
                .Where(p => p.Id == id && p.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (partnership == null)
            {
                return NotFound(new { error = new { code = "PARTNERSHIP_NOT_FOUND", message = "Partnership not found" } });
            }

            // Check if partnership name is unique within the brand (excluding current partnership)
            if (!string.IsNullOrEmpty(request.Name))
            {
                var nameExists = await _context.Partnerships
                    .AnyAsync(p => p.BrandId == brandId && p.CompanyName == request.Name && p.Id != id);

                if (nameExists)
                {
                    return BadRequest(new { error = new { code = "DUPLICATE_PARTNERSHIP_NAME", message = "A partnership with this name already exists for this brand" } });
                }
            }

            // Update fields if provided
            partnership.CompanyName = request.Name ?? partnership.CompanyName;
            partnership.Description = request.Description ?? partnership.Description;
            partnership.Email = request.ContactEmail ?? partnership.Email;
            partnership.Phone = request.ContactPhone ?? partnership.Phone;
            partnership.UpdatedBy = currentUserId;
            partnership.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Return updated partnership
            var updatedPartnershipEntity = await _context.Partnerships
                .Include(p => p.Brand)
                .Include(p => p.Creator)
                .Include(p => p.Updater)
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();

            var updatedPartnership = new PartnershipDto
            {
                Id = updatedPartnershipEntity!.Id,
                BrandId = updatedPartnershipEntity.BrandId,
                Name = updatedPartnershipEntity.CompanyName,
                LogoUrl = null,
                WebsiteUrl = null,
                Description = updatedPartnershipEntity.Description,
                ContactEmail = updatedPartnershipEntity.Email,
                ContactPhone = updatedPartnershipEntity.Phone,
                Status = updatedPartnershipEntity.Status.ToString(),
                CreatedBy = updatedPartnershipEntity.CreatedBy,
                UpdatedBy = updatedPartnershipEntity.UpdatedBy,
                CreatedAt = updatedPartnershipEntity.CreatedAt,
                UpdatedAt = updatedPartnershipEntity.UpdatedAt,
                BrandName = updatedPartnershipEntity.Brand.Name,
                CreatorName = updatedPartnershipEntity.Creator?.Name,
                UpdaterName = updatedPartnershipEntity.Updater?.Name
            };

            return Ok(updatedPartnership);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating partnership {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while updating partnership" } });
        }
    }

    [HttpDelete("{brandId}/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> DeletePartnership(int brandId, int id)
    {
        try
        {
            var partnership = await _context.Partnerships
                .Where(p => p.Id == id && p.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (partnership == null)
            {
                return NotFound(new { error = new { code = "PARTNERSHIP_NOT_FOUND", message = "Partnership not found" } });
            }

            _context.Partnerships.Remove(partnership);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Partnership deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting partnership {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while deleting partnership" } });
        }
    }

    [HttpPost("{brandId}/{id}/publish")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> PublishPartnership(int brandId, int id, [FromBody] PublishPartnershipDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var partnership = await _context.Partnerships
                .Where(p => p.Id == id && p.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (partnership == null)
            {
                return NotFound(new { error = new { code = "PARTNERSHIP_NOT_FOUND", message = "Partnership not found" } });
            }

            partnership.Status = request.Publish ? PartnershipStatus.Active : PartnershipStatus.Inactive;
            partnership.UpdatedBy = currentUserId;
            partnership.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = request.Publish ? "Partnership published successfully" : "Partnership unpublished successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing partnership {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while publishing partnership" } });
        }
    }
}