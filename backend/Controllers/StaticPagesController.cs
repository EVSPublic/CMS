using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/v1/static-pages")]
[Authorize]
public class StaticPagesController : ControllerBase
{
    private readonly AdminPanelContext _context;
    private readonly ILogger<StaticPagesController> _logger;

    public StaticPagesController(AdminPanelContext context, ILogger<StaticPagesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("{brandId}")]
    public async Task<IActionResult> GetStaticPages(int brandId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
    {
        try
        {
            var query = _context.StaticPages
                .Include(s => s.Brand)
                .Include(s => s.Creator)
                .Include(s => s.Updater)
                .Where(s => s.BrandId == brandId);

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(s => s.Title.Contains(search) || s.Content.Contains(search));
            }

            var totalCount = await query.CountAsync();
            var staticPages = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(s => new StaticPageDto
                {
                    Id = s.Id,
                    BrandId = s.BrandId,
                    Title = s.Title,
                    Slug = s.Slug,
                    Content = s.Content,
                    MetaTitle = s.MetaTitle,
                    MetaDescription = s.MetaDescription,
                    MetaKeywords = s.MetaKeywords,
                    Status = s.Status.ToString(),
                    CreatedBy = s.CreatedBy,
                    UpdatedBy = s.UpdatedBy,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt,
                    BrandName = s.Brand.Name,
                    CreatorName = s.Creator!.Name,
                    UpdaterName = s.Updater!.Name
                })
                .ToListAsync();

            return Ok(new { staticPages, totalCount, page, pageSize });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving static pages for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving static pages" } });
        }
    }

    [HttpGet("{brandId}/{id}")]
    public async Task<IActionResult> GetStaticPage(int brandId, int id)
    {
        try
        {
            var staticPageEntity = await _context.StaticPages
                .Include(s => s.Brand)
                .Include(s => s.Creator)
                .Include(s => s.Updater)
                .Where(s => s.Id == id && s.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (staticPageEntity == null)
            {
                return NotFound(new { error = new { code = "STATIC_PAGE_NOT_FOUND", message = "Static page not found" } });
            }

            var staticPage = new StaticPageDto
            {
                Id = staticPageEntity.Id,
                BrandId = staticPageEntity.BrandId,
                Title = staticPageEntity.Title,
                Slug = staticPageEntity.Slug,
                Content = staticPageEntity.Content,
                MetaTitle = staticPageEntity.MetaTitle,
                MetaDescription = staticPageEntity.MetaDescription,
                MetaKeywords = staticPageEntity.MetaKeywords,
                Status = staticPageEntity.Status.ToString(),
                CreatedBy = staticPageEntity.CreatedBy,
                UpdatedBy = staticPageEntity.UpdatedBy,
                CreatedAt = staticPageEntity.CreatedAt,
                UpdatedAt = staticPageEntity.UpdatedAt,
                BrandName = staticPageEntity.Brand.Name,
                CreatorName = staticPageEntity.Creator?.Name,
                UpdaterName = staticPageEntity.Updater?.Name
            };

            return Ok(staticPage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving static page {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving static page" } });
        }
    }

    [HttpPost("{brandId}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> CreateStaticPage(int brandId, [FromBody] CreateStaticPageDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            // Check if slug is unique within the brand
            var slugExists = await _context.StaticPages
                .AnyAsync(s => s.BrandId == brandId && s.Slug == request.Slug);

            if (slugExists)
            {
                return BadRequest(new { error = new { code = "DUPLICATE_SLUG", message = "A page with this slug already exists for this brand" } });
            }

            var staticPage = new StaticPage
            {
                BrandId = brandId,
                Title = request.Title,
                Slug = request.Slug,
                Content = request.Content,
                MetaTitle = request.MetaTitle,
                MetaDescription = request.MetaDescription,
                MetaKeywords = request.MetaKeywords,
                Status = ContentStatus.Draft,
                CreatedBy = currentUserId,
                UpdatedBy = currentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.StaticPages.Add(staticPage);
            await _context.SaveChangesAsync();

            // Return the newly created page
            var createdPageEntity = await _context.StaticPages
                .Include(s => s.Brand)
                .Include(s => s.Creator)
                .Include(s => s.Updater)
                .Where(s => s.Id == staticPage.Id)
                .FirstOrDefaultAsync();

            var createdPage = new StaticPageDto
            {
                Id = createdPageEntity!.Id,
                BrandId = createdPageEntity.BrandId,
                Title = createdPageEntity.Title,
                Slug = createdPageEntity.Slug,
                Content = createdPageEntity.Content,
                MetaTitle = createdPageEntity.MetaTitle,
                MetaDescription = createdPageEntity.MetaDescription,
                MetaKeywords = createdPageEntity.MetaKeywords,
                Status = createdPageEntity.Status.ToString(),
                CreatedBy = createdPageEntity.CreatedBy,
                UpdatedBy = createdPageEntity.UpdatedBy,
                CreatedAt = createdPageEntity.CreatedAt,
                UpdatedAt = createdPageEntity.UpdatedAt,
                BrandName = createdPageEntity.Brand.Name,
                CreatorName = createdPageEntity.Creator?.Name,
                UpdaterName = createdPageEntity.Updater?.Name
            };

            return Ok(createdPage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating static page for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while creating static page" } });
        }
    }

    [HttpPut("{brandId}/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdateStaticPage(int brandId, int id, [FromBody] UpdateStaticPageDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var staticPage = await _context.StaticPages
                .Where(s => s.Id == id && s.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (staticPage == null)
            {
                return NotFound(new { error = new { code = "STATIC_PAGE_NOT_FOUND", message = "Static page not found" } });
            }

            // Check if slug is unique within the brand (excluding current page)
            if (!string.IsNullOrEmpty(request.Slug))
            {
                var slugExists = await _context.StaticPages
                    .AnyAsync(s => s.BrandId == brandId && s.Slug == request.Slug && s.Id != id);

                if (slugExists)
                {
                    return BadRequest(new { error = new { code = "DUPLICATE_SLUG", message = "A page with this slug already exists for this brand" } });
                }
            }

            // Update fields if provided
            staticPage.Title = request.Title ?? staticPage.Title;
            staticPage.Slug = request.Slug ?? staticPage.Slug;
            staticPage.Content = request.Content ?? staticPage.Content;
            staticPage.MetaTitle = request.MetaTitle ?? staticPage.MetaTitle;
            staticPage.MetaDescription = request.MetaDescription ?? staticPage.MetaDescription;
            staticPage.MetaKeywords = request.MetaKeywords ?? staticPage.MetaKeywords;
            staticPage.UpdatedBy = currentUserId;
            staticPage.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Return updated static page
            var updatedPageEntity = await _context.StaticPages
                .Include(s => s.Brand)
                .Include(s => s.Creator)
                .Include(s => s.Updater)
                .Where(s => s.Id == id)
                .FirstOrDefaultAsync();

            var updatedPage = new StaticPageDto
            {
                Id = updatedPageEntity!.Id,
                BrandId = updatedPageEntity.BrandId,
                Title = updatedPageEntity.Title,
                Slug = updatedPageEntity.Slug,
                Content = updatedPageEntity.Content,
                MetaTitle = updatedPageEntity.MetaTitle,
                MetaDescription = updatedPageEntity.MetaDescription,
                MetaKeywords = updatedPageEntity.MetaKeywords,
                Status = updatedPageEntity.Status.ToString(),
                CreatedBy = updatedPageEntity.CreatedBy,
                UpdatedBy = updatedPageEntity.UpdatedBy,
                CreatedAt = updatedPageEntity.CreatedAt,
                UpdatedAt = updatedPageEntity.UpdatedAt,
                BrandName = updatedPageEntity.Brand.Name,
                CreatorName = updatedPageEntity.Creator?.Name,
                UpdaterName = updatedPageEntity.Updater?.Name
            };

            return Ok(updatedPage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating static page {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while updating static page" } });
        }
    }

    [HttpDelete("{brandId}/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> DeleteStaticPage(int brandId, int id)
    {
        try
        {
            var staticPage = await _context.StaticPages
                .Where(s => s.Id == id && s.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (staticPage == null)
            {
                return NotFound(new { error = new { code = "STATIC_PAGE_NOT_FOUND", message = "Static page not found" } });
            }

            _context.StaticPages.Remove(staticPage);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Static page deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting static page {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while deleting static page" } });
        }
    }

    [HttpPost("{brandId}/{id}/publish")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> PublishStaticPage(int brandId, int id, [FromBody] PublishStaticPageDto request)
    {
        try
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var staticPage = await _context.StaticPages
                .Where(s => s.Id == id && s.BrandId == brandId)
                .FirstOrDefaultAsync();

            if (staticPage == null)
            {
                return NotFound(new { error = new { code = "STATIC_PAGE_NOT_FOUND", message = "Static page not found" } });
            }

            staticPage.Status = request.Publish ? ContentStatus.Published : ContentStatus.Draft;
            staticPage.UpdatedBy = currentUserId;
            staticPage.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = request.Publish ? "Static page published successfully" : "Static page unpublished successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing static page {Id} for brand {BrandId}", id, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while publishing static page" } });
        }
    }

    // Public endpoints for client consumption
    [HttpGet("public/{brandId}/published")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublishedPages(int brandId)
    {
        try
        {
            var pages = await _context.StaticPages
                .Where(s => s.BrandId == brandId && s.Status == ContentStatus.Published)
                .OrderBy(s => s.Title)
                .Select(s => new
                {
                    s.Id,
                    s.Title,
                    s.Slug,
                    s.MetaTitle,
                    s.MetaDescription,
                    s.UpdatedAt
                })
                .ToListAsync();

            return Ok(new { pages });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving published pages for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving published pages" } });
        }
    }

    [HttpGet("public/{brandId}/slug/{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPageBySlug(int brandId, string slug)
    {
        try
        {
            var page = await _context.StaticPages
                .Where(s => s.BrandId == brandId && s.Slug == slug && s.Status == ContentStatus.Published)
                .Select(s => new
                {
                    s.Id,
                    s.Title,
                    s.Slug,
                    s.Content,
                    s.MetaTitle,
                    s.MetaDescription,
                    s.MetaKeywords,
                    s.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (page == null)
            {
                return NotFound(new { error = new { code = "PAGE_NOT_FOUND", message = "Page not found or not published" } });
            }

            return Ok(page);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving page by slug {Slug} for brand {BrandId}", slug, brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving the page" } });
        }
    }
}