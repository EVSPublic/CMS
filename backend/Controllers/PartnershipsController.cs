using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/v1/partnerships")]
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
    [AllowAnonymous]
    public async Task<IActionResult> GetPartners(int brandId)
    {
        try
        {
            var partners = await _context.Partnerships
                .Include(p => p.Brand)
                .Include(p => p.Creator)
                .Include(p => p.Updater)
                .Where(p => p.BrandId == brandId)
                .OrderBy(p => p.DisplayOrder)
                .ThenBy(p => p.CreatedAt)
                .Select(p => new PartnerDto
                {
                    Id = p.Id,
                    BrandId = p.BrandId,
                    Title = p.Title,
                    Logo = p.Logo,
                    Alt = p.Alt,
                    Status = p.Status.ToString(),
                    DisplayOrder = p.DisplayOrder,
                    CreatedBy = p.CreatedBy,
                    UpdatedBy = p.UpdatedBy,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    BrandName = p.Brand.Name,
                    CreatorName = p.Creator != null ? p.Creator.Name : null,
                    UpdaterName = p.Updater != null ? p.Updater.Name : null
                })
                .ToListAsync();

            return Ok(new { partners });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving partners for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving partners" } });
        }
    }

    [HttpGet("{brandId}/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPartner(int brandId, int id)
    {
        try
        {
            var partnerEntity = await _context.Partnerships
                .Include(p => p.Brand)
                .Include(p => p.Creator)
                .Include(p => p.Updater)
                .Where(p => p.Id == id && p.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (partnerEntity == null)
            {
                return NotFound(new { error = new { code = "PARTNER_NOT_FOUND", message = "Partner not found" } });
            }

            var partner = new PartnerDto
            {
                Id = partnerEntity.Id,
                BrandId = partnerEntity.BrandId,
                Title = partnerEntity.Title,
                Logo = partnerEntity.Logo,
                Alt = partnerEntity.Alt,
                Status = partnerEntity.Status.ToString(),
                DisplayOrder = partnerEntity.DisplayOrder,
                CreatedBy = partnerEntity.CreatedBy,
                UpdatedBy = partnerEntity.UpdatedBy,
                CreatedAt = partnerEntity.CreatedAt,
                UpdatedAt = partnerEntity.UpdatedAt,
                BrandName = partnerEntity.Brand.Name,
                CreatorName = partnerEntity.Creator?.Name,
                UpdaterName = partnerEntity.Updater?.Name
            };

            return Ok(partner);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving partner {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving partner" } });
        }
    }

    [HttpPost("{brandId}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> CreatePartner(int brandId, [FromBody] CreatePartnerDto request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Get the next display order
            var maxDisplayOrder = await _context.Partnerships
                .Where(p => p.BrandId == brandId)
                .MaxAsync(p => (int?)p.DisplayOrder) ?? 0;

            var partner = new Partnership
            {
                BrandId = brandId,
                Title = request.Title,
                Logo = request.Logo,
                Alt = request.Alt,
                Status = PartnershipStatus.Active,
                DisplayOrder = maxDisplayOrder + 1,
                CreatedBy = currentUserId,
                UpdatedBy = currentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Partnerships.Add(partner);
            await _context.SaveChangesAsync();

            // Return the newly created partner
            var createdPartnerEntity = await _context.Partnerships
                .Include(p => p.Brand)
                .Include(p => p.Creator)
                .Include(p => p.Updater)
                .FirstAsync(p => p.Id == partner.Id);

            var createdPartner = new PartnerDto
            {
                Id = createdPartnerEntity.Id,
                BrandId = createdPartnerEntity.BrandId,
                Title = createdPartnerEntity.Title,
                Logo = createdPartnerEntity.Logo,
                Alt = createdPartnerEntity.Alt,
                Status = createdPartnerEntity.Status.ToString(),
                DisplayOrder = createdPartnerEntity.DisplayOrder,
                CreatedBy = createdPartnerEntity.CreatedBy,
                UpdatedBy = createdPartnerEntity.UpdatedBy,
                CreatedAt = createdPartnerEntity.CreatedAt,
                UpdatedAt = createdPartnerEntity.UpdatedAt,
                BrandName = createdPartnerEntity.Brand.Name,
                CreatorName = createdPartnerEntity.Creator?.Name,
                UpdaterName = createdPartnerEntity.Updater?.Name
            };

            return CreatedAtAction(nameof(GetPartner), new { brandId, id = partner.Id }, createdPartner);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating partner for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while creating partner" } });
        }
    }

    [HttpPut("{brandId}/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdatePartner(int brandId, int id, [FromBody] UpdatePartnerDto request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var partner = await _context.Partnerships
                .Where(p => p.Id == id && p.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (partner == null)
            {
                return NotFound(new { error = new { code = "PARTNER_NOT_FOUND", message = "Partner not found" } });
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(request.Title))
                partner.Title = request.Title;
            if (request.Logo != null)
                partner.Logo = request.Logo;
            if (request.Alt != null)
                partner.Alt = request.Alt;

            partner.UpdatedBy = currentUserId;
            partner.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Return updated partner
            var updatedPartnerEntity = await _context.Partnerships
                .Include(p => p.Brand)
                .Include(p => p.Creator)
                .Include(p => p.Updater)
                .FirstAsync(p => p.Id == id);

            var updatedPartner = new PartnerDto
            {
                Id = updatedPartnerEntity.Id,
                BrandId = updatedPartnerEntity.BrandId,
                Title = updatedPartnerEntity.Title,
                Logo = updatedPartnerEntity.Logo,
                Alt = updatedPartnerEntity.Alt,
                Status = updatedPartnerEntity.Status.ToString(),
                DisplayOrder = updatedPartnerEntity.DisplayOrder,
                CreatedBy = updatedPartnerEntity.CreatedBy,
                UpdatedBy = updatedPartnerEntity.UpdatedBy,
                CreatedAt = updatedPartnerEntity.CreatedAt,
                UpdatedAt = updatedPartnerEntity.UpdatedAt,
                BrandName = updatedPartnerEntity.Brand.Name,
                CreatorName = updatedPartnerEntity.Creator?.Name,
                UpdaterName = updatedPartnerEntity.Updater?.Name
            };

            return Ok(updatedPartner);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating partner {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while updating partner" } });
        }
    }

    [HttpDelete("{brandId}/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> DeletePartner(int brandId, int id)
    {
        try
        {
            var partner = await _context.Partnerships
                .Where(p => p.Id == id && p.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (partner == null)
            {
                return NotFound(new { error = new { code = "PARTNER_NOT_FOUND", message = "Partner not found" } });
            }

            _context.Partnerships.Remove(partner);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Partner deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting partner {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while deleting partner" } });
        }
    }

    [HttpPut("{brandId}/reorder")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> ReorderPartners(int brandId, [FromBody] UpdatePartnerOrderDto request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var partners = await _context.Partnerships
                .Where(p => p.BrandId == brandId && request.PartnerIds.Contains(p.Id))
                .ToListAsync();

            if (partners.Count != request.PartnerIds.Count)
            {
                return BadRequest(new { error = new { code = "INVALID_PARTNER_IDS", message = "Some partner IDs are invalid" } });
            }

            // Update display order based on the provided order
            for (int i = 0; i < request.PartnerIds.Count; i++)
            {
                var partner = partners.First(p => p.Id == request.PartnerIds[i]);
                partner.DisplayOrder = i;
                partner.UpdatedBy = currentUserId;
                partner.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Partner order updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reordering partners for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while reordering partners" } });
        }
    }

    [HttpPut("{brandId}/{id}/toggle-status")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> TogglePartnerStatus(int brandId, int id, [FromBody] TogglePartnerStatusDto request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var partner = await _context.Partnerships
                .Where(p => p.Id == id && p.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (partner == null)
            {
                return NotFound(new { error = new { code = "PARTNER_NOT_FOUND", message = "Partner not found" } });
            }

            partner.Status = request.Active ? PartnershipStatus.Active : PartnershipStatus.Inactive;
            partner.UpdatedBy = currentUserId;
            partner.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = request.Active ? "Partner activated successfully" : "Partner deactivated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling partner status {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while toggling partner status" } });
        }
    }

    [HttpGet("{brandId}/slide-settings")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSlideSettings(int brandId)
    {
        try
        {
            var brand = await _context.Brands.FindAsync(brandId);

            if (brand == null)
                return NotFound(new { error = new { code = "BRAND_NOT_FOUND", message = "Brand not found" } });

            return Ok(new PartnershipSettingsDto
            {
                SlideInterval = brand.PartnershipSlideInterval,
                SlideDuration = brand.PartnershipSlideDuration
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting slide settings for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while getting slide settings" } });
        }
    }

    [HttpPut("{brandId}/slide-settings")]
    public async Task<IActionResult> UpdateSlideSettings(int brandId, [FromBody] UpdatePartnershipSettingsDto request)
    {
        try
        {
            var brand = await _context.Brands.FindAsync(brandId);

            if (brand == null)
                return NotFound(new { error = new { code = "BRAND_NOT_FOUND", message = "Brand not found" } });

            brand.PartnershipSlideInterval = request.SlideInterval;
            brand.PartnershipSlideDuration = request.SlideDuration;
            brand.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Slide settings updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating slide settings for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while updating slide settings" } });
        }
    }
}