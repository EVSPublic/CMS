using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdminPanel.Data;
using AdminPanel.DTOs;

namespace AdminPanel.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/app-links")]
public class AppLinksController : ControllerBase
{
    private readonly AdminPanelContext _context;
    private readonly ILogger<AppLinksController> _logger;

    public AppLinksController(AdminPanelContext context, ILogger<AppLinksController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/v1/app-links/{brandId}
    [AllowAnonymous]
    [HttpGet("{brandId}")]
    public async Task<ActionResult<AppLinksDto>> GetAppLinks(int brandId)
    {
        var brand = await _context.Brands.FindAsync(brandId);

        if (brand == null)
        {
            return NotFound(new { message = "Brand not found" });
        }

        var appLinks = new AppLinksDto
        {
            IosAppLink = brand.IosAppLink,
            AndroidAppLink = brand.AndroidAppLink
        };

        return Ok(appLinks);
    }

    // PUT: api/v1/app-links/{brandId}
    [HttpPut("{brandId}")]
    public async Task<IActionResult> UpdateAppLinks(int brandId, [FromBody] UpdateAppLinksDto dto)
    {
        var brand = await _context.Brands.FindAsync(brandId);

        if (brand == null)
        {
            return NotFound(new { message = "Brand not found" });
        }

        brand.IosAppLink = dto.IosAppLink;
        brand.AndroidAppLink = dto.AndroidAppLink;
        brand.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
            _logger.LogInformation("App links updated for brand {BrandId}", brandId);
            return Ok(new { message = "App links updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating app links for brand {BrandId}", brandId);
            return StatusCode(500, new { message = "Error updating app links" });
        }
    }
}
