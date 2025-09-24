using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/brands")]
[Authorize]
public class BrandsController : ControllerBase
{
    private readonly AdminPanelContext _context;
    private readonly ILogger<BrandsController> _logger;

    public BrandsController(AdminPanelContext context, ILogger<BrandsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetBrands()
    {
        try
        {
            var brands = await _context.Brands
                .Select(b => new BrandDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Domain = b.Domain,
                    LogoPath = b.LogoPath,
                    ThemeConfig = b.ThemeConfig,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .ToListAsync();

            return Ok(brands);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving brands");
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving brands" } });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBrand(int id)
    {
        try
        {
            var brand = await _context.Brands
                .Where(b => b.Id == id)
                .Select(b => new BrandDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Domain = b.Domain,
                    LogoPath = b.LogoPath,
                    ThemeConfig = b.ThemeConfig,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (brand == null)
            {
                return NotFound(new { error = new { code = "BRAND_NOT_FOUND", message = "Brand not found" } });
            }

            return Ok(brand);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving brand {BrandId}", id);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving brand" } });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateBrand(int id, [FromBody] UpdateBrandDto request)
    {
        try
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
            {
                return NotFound(new { error = new { code = "BRAND_NOT_FOUND", message = "Brand not found" } });
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(request.Name))
            {
                // Check if name is unique (excluding current brand)
                var nameExists = await _context.Brands
                    .AnyAsync(b => b.Name == request.Name && b.Id != id);

                if (nameExists)
                {
                    return BadRequest(new { error = new { code = "DUPLICATE_BRAND_NAME", message = "A brand with this name already exists" } });
                }

                brand.Name = request.Name;
            }

            if (request.Domain != null)
            {
                brand.Domain = request.Domain;
            }

            if (request.LogoPath != null)
            {
                brand.LogoPath = request.LogoPath;
            }

            if (request.ThemeConfig != null)
            {
                brand.ThemeConfig = request.ThemeConfig;
            }

            brand.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var updatedBrand = new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name,
                Domain = brand.Domain,
                LogoPath = brand.LogoPath,
                ThemeConfig = brand.ThemeConfig,
                CreatedAt = brand.CreatedAt,
                UpdatedAt = brand.UpdatedAt
            };

            return Ok(updatedBrand);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating brand {BrandId}", id);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while updating brand" } });
        }
    }
}