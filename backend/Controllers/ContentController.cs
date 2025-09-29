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
[Route("api/v1/content")]
[Authorize]
public class ContentController : ControllerBase
{
    private readonly AdminPanelContext _context;
    private readonly ILogger<ContentController> _logger;

    public ContentController(AdminPanelContext context, ILogger<ContentController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("{brandId}/{pageType}")]
    public async Task<IActionResult> GetContentPage(int brandId, string pageType)
    {
        try
        {
            // Validate page type
            if (!Enum.TryParse<PageType>(pageType, true, out var pageTypeEnum))
            {
                return BadRequest(new { error = new { code = "INVALID_PAGE_TYPE", message = "Invalid page type specified" } });
            }

            // Get current user (all users can manage all brands/projects)
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var contentPageEntity = await _context.ContentPages
                .Include(c => c.Brand)
                .Include(c => c.Creator)
                .Include(c => c.Updater)
                .Where(c => c.BrandId == brandId && c.PageType == pageTypeEnum)
                .FirstOrDefaultAsync();

            ContentPageDto? contentPage = null;
            if (contentPageEntity != null)
            {
                contentPage = new ContentPageDto
                {
                    Id = contentPageEntity.Id,
                    BrandId = contentPageEntity.BrandId,
                    PageType = contentPageEntity.PageType.ToString(),
                    Content = JsonSerializer.Deserialize<JsonElement>(contentPageEntity.Content),
                    MetaTitle = contentPageEntity.MetaTitle,
                    MetaDescription = contentPageEntity.MetaDescription,
                    MetaKeywords = contentPageEntity.MetaKeywords,
                    Status = contentPageEntity.Status.ToString(),
                    CreatedBy = contentPageEntity.CreatedBy,
                    UpdatedBy = contentPageEntity.UpdatedBy,
                    CreatedAt = contentPageEntity.CreatedAt,
                    UpdatedAt = contentPageEntity.UpdatedAt,
                    BrandName = contentPageEntity.Brand.Name,
                    CreatorName = contentPageEntity.Creator?.Name,
                    UpdaterName = contentPageEntity.Updater?.Name
                };
            }

            if (contentPage == null)
            {
                // Get brand info for default content
                var brand = await _context.Brands.FindAsync(brandId);
                var defaultContent = await GetDefaultContentForPageType(pageTypeEnum, brand?.Name ?? "", brandId);

                // Create a default content page if it doesn't exist
                var newContentPage = new ContentPage
                {
                    BrandId = brandId,
                    PageType = pageTypeEnum,
                    Content = JsonSerializer.Serialize(defaultContent),
                    Status = ContentStatus.Draft,
                    CreatedBy = currentUserId,
                    UpdatedBy = currentUserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ContentPages.Add(newContentPage);
                await _context.SaveChangesAsync();

                // Return the newly created page
                return Ok(new ContentPageDto
                {
                    Id = newContentPage.Id,
                    BrandId = newContentPage.BrandId,
                    PageType = newContentPage.PageType.ToString(),
                    Content = defaultContent,
                    MetaTitle = newContentPage.MetaTitle,
                    MetaDescription = newContentPage.MetaDescription,
                    MetaKeywords = newContentPage.MetaKeywords,
                    Status = newContentPage.Status.ToString(),
                    CreatedBy = newContentPage.CreatedBy,
                    UpdatedBy = newContentPage.UpdatedBy,
                    CreatedAt = newContentPage.CreatedAt,
                    UpdatedAt = newContentPage.UpdatedAt,
                    BrandName = brand?.Name ?? "",
                    CreatorName = currentUser.Name,
                    UpdaterName = currentUser.Name
                });
            }

            return Ok(contentPage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving content page for brand {BrandId} and page type {PageType}", brandId, pageType);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving content page" } });
        }
    }

    [HttpPut("{brandId}/{pageType}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdateContentPage(int brandId, string pageType, [FromBody] UpdateContentPageDto request)
    {
        try
        {
            // Validate page type
            if (!Enum.TryParse<PageType>(pageType, true, out var pageTypeEnum))
            {
                return BadRequest(new { error = new { code = "INVALID_PAGE_TYPE", message = "Invalid page type specified" } });
            }

            // Get current user (all users can manage all brands/projects)
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var contentPage = await _context.ContentPages
                .Where(c => c.BrandId == brandId && c.PageType == pageTypeEnum)
                .FirstOrDefaultAsync();

            if (contentPage == null)
            {
                // Create new content page if it doesn't exist
                contentPage = new ContentPage
                {
                    BrandId = brandId,
                    PageType = pageTypeEnum,
                    Content = JsonSerializer.Serialize(request.Content),
                    MetaTitle = request.MetaTitle,
                    MetaDescription = request.MetaDescription,
                    MetaKeywords = request.MetaKeywords,
                    Status = ContentStatus.Draft,
                    CreatedBy = currentUserId,
                    UpdatedBy = currentUserId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.ContentPages.Add(contentPage);
            }
            else
            {
                // Update existing content page
                contentPage.Content = JsonSerializer.Serialize(request.Content);
                contentPage.MetaTitle = request.MetaTitle ?? contentPage.MetaTitle;
                contentPage.MetaDescription = request.MetaDescription ?? contentPage.MetaDescription;
                contentPage.MetaKeywords = request.MetaKeywords ?? contentPage.MetaKeywords;
                contentPage.UpdatedBy = currentUserId;
                contentPage.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            // Return updated content page
            var updatedPageEntity = await _context.ContentPages
                .Include(c => c.Brand)
                .Include(c => c.Creator)
                .Include(c => c.Updater)
                .Where(c => c.Id == contentPage.Id)
                .FirstOrDefaultAsync();

            var updatedPage = new ContentPageDto
            {
                Id = updatedPageEntity!.Id,
                BrandId = updatedPageEntity.BrandId,
                PageType = updatedPageEntity.PageType.ToString(),
                Content = JsonSerializer.Deserialize<JsonElement>(updatedPageEntity.Content),
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
            _logger.LogError(ex, "Error updating content page for brand {BrandId} and page type {PageType}", brandId, pageType);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while updating content page" } });
        }
    }

    [HttpPost("{brandId}/{pageType}/publish")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> PublishContentPage(int brandId, string pageType, [FromBody] PublishContentPageDto request)
    {
        try
        {
            // Validate page type
            if (!Enum.TryParse<PageType>(pageType, true, out var pageTypeEnum))
            {
                return BadRequest(new { error = new { code = "INVALID_PAGE_TYPE", message = "Invalid page type specified" } });
            }

            // Get current user (all users can manage all brands/projects)
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var contentPage = await _context.ContentPages
                .Where(c => c.BrandId == brandId && c.PageType == pageTypeEnum)
                .FirstOrDefaultAsync();

            if (contentPage == null)
            {
                return NotFound(new { error = new { code = "CONTENT_PAGE_NOT_FOUND", message = "Content page not found" } });
            }

            contentPage.Status = request.Publish ? ContentStatus.Published : ContentStatus.Draft;
            contentPage.UpdatedBy = currentUserId;
            contentPage.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = request.Publish ? "Content page published successfully" : "Content page unpublished successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing content page for brand {BrandId} and page type {PageType}", brandId, pageType);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while publishing content page" } });
        }
    }

    [HttpGet("{brandId}/statistics")]
    [Authorize]
    public async Task<IActionResult> GetBrandStatistics(int brandId)
    {
        try
        {
            // Get current user (all users can access statistics)
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUser = await _context.Users.FindAsync(currentUserId);

            if (currentUser == null)
            {
                return Unauthorized();
            }

            var brand = await _context.Brands.FindAsync(brandId);

            if (brand == null)
            {
                return NotFound(new { error = new { code = "BRAND_NOT_FOUND", message = "Brand not found" } });
            }

            // Calculate actual station count from database based on brand visibility
            var brandName = brand.Name.ToLower();
            var actualStationCount = await _context.Database.SqlQueryRaw<int>(
                "SELECT COUNT(*) as Value FROM Stations WHERE BrandVisibility LIKE {0}",
                $"%{brandName}%"
            ).FirstAsync();

            // If no stations found, fall back to brand's default count
            var finalCount = actualStationCount > 0 ? actualStationCount : brand.ChargingStationCount;

            var statistics = new
            {
                chargingStationCount = finalCount,
                formattedCount = $"{finalCount}+"
            };

            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting brand statistics for brand {BrandId}", brandId);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while getting brand statistics" } });
        }
    }

    private async Task<object> GetDefaultContentForPageType(PageType pageType, string brandName, int brandId)
    {
        // Get brand to fetch the charging station count
        var brand = await _context.Brands.FindAsync(brandId);

        // Calculate actual station count from database based on brand visibility
        var actualStationCount = await _context.Database.SqlQueryRaw<int>(
            "SELECT COUNT(*) as Value FROM Stations WHERE BrandVisibility LIKE {0}",
            $"%{brandName.ToLower()}%"
        ).FirstAsync();

        // If no stations found, fall back to brand's default count
        var chargingStationCount = actualStationCount > 0 ? actualStationCount : (brand?.ChargingStationCount ?? 1880);

        return pageType switch
        {
            PageType.Index => new IndexPageContentDto
            {
                Meta = new MetaDto
                {
                    Title = $"{brandName} - Elektrikli Araç Şarj İstasyonu",
                    Description = "",
                    Keywords = ""
                },
                Hero = new HeroDto
                {
                    Title = "Her Yolculukta\nYanınızda",
                    MediaType = "video",
                    MediaUrl = "assets/video/hero-video.mp4",
                    Count = $"{chargingStationCount}+",
                    CountText = "Şarj İstasyonu ile Kesintisiz Enerji"
                },
                Services = new ServicesDto
                {
                    Title = "Hizmet Noktaları",
                    Content = "Opet istasyonları başta olmak üzere stratejik noktalarda konumlanan halka açık şarj istasyonlarıyla, elektrikli aracınız için hızlı, güvenilir ve kolay erişilebilir enerjiye her an ulaşabilirsiniz.",
                    Subtitle = "Hizmet Noktaları"
                },
                Tariffs = new TariffsDto
                {
                    Title = "Tarifeler",
                    Description = "Geniş halka açık şarj istasyonu ağı ile elektrikli aracınız için rekabetçi ve şeffaf tarife seçenekleri sunar.",
                    ListTitle = "Tarife Seçenekleri"
                },
                Opet = new OpetDto
                {
                    BackgroundImage = ""
                },
                Solutions = new SolutionsDto
                {
                    IndividualDescription = "Elektrikli araç sahiplerine hızlı, güvenilir ve kolay erişilebilir şarj çözümleri sunar.",
                    CorporateDescription = "İşletmeler ve filolar için hibrit enerji çözümleri sunar.",
                    SolutionsImage = ""
                },
                Sustainability = new SustainabilityDto
                {
                    Title = "Sürdürülebilirlik",
                    Description = "Çevre dostu enerji çözümleri ile geleceğe yatırım yapıyoruz.",
                    BackgroundImage = ""
                }
            },
            PageType.Contact => new ContactPageContentDto
            {
                Meta = new ContactMetaDto
                {
                    Title = $"İletişim - {brandName}",
                    Description = "",
                    Keywords = ""
                },
                Hero = new ContactHeroDto
                {
                    Image = ""
                },
                PageHero = new ContactPageHeroDto
                {
                    BackgroundImage = "assets/img/iletisim-bg.jpg",
                    LogoImage = "assets/img/page-hero-logo.svg",
                    LogoAlt = $"{brandName} Logo"
                },
                ContactInfo = new ContactInfoDto
                {
                    Title = "İletişim",
                    Office = new OfficeDto
                    {
                        Title = "Merkez Ofis",
                        Address = new List<string>
                        {
                            "Kısıklı Alemdağ Caddesi No:60",
                            "34000 Üsküdar / İstanbul"
                        }
                    },
                    Email = new EmailDto
                    {
                        Title = "E-Mail",
                        Address = $"info@{brandName.ToLower()}.com"
                    },
                    Phone = new PhoneDto
                    {
                        Title = "Telefon",
                        Number = "+90 850 474 60 11"
                    }
                },
                ContactForm = new ContactFormDto
                {
                    Title = "İletişim Formu",
                    Tabs = new ContactFormTabsDto
                    {
                        Individual = "Bireysel",
                        Corporate = "Kurumsal"
                    },
                    Fields = new ContactFormFieldsDto
                    {
                        FirstName = "Ad",
                        LastName = "Soyad",
                        Email = "E-Mail",
                        Phone = "Telefon",
                        Company = "Şirket",
                        Title = "Ünvan",
                        Subject = "Konu",
                        Message = "Mesajınız"
                    },
                    SubjectOptions = new List<SubjectOptionDto>
                    {
                        new() { Value = "tarifeler", Label = "Tarifeler Hakkında Bilgilendirme" },
                        new() { Value = "teknik", Label = "Teknik Destek" },
                        new() { Value = "genel", Label = "Genel Bilgi" },
                        new() { Value = "sikayet", Label = "Şikayet" },
                        new() { Value = "oneriler", Label = "Öneriler" }
                    },
                    EmailConfig = new EmailConfigDto
                    {
                        SmtpHost = "",
                        SmtpPort = "",
                        SmtpUsername = "",
                        SmtpPassword = "",
                        ExtraDetails = ""
                    },
                    SubmitButton = "Gönder",
                    KvkkText = "Formu doldurarak, kişisel verilerinizin 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında işlenmesine örtülü şekilde onay vermiş oluyorsunuz.",
                    KvkkLinkText = "KVKK Aydınlatma Metni için lütfen tıklayın."
                },
                SocialMedia = new List<SocialMediaDto>
                {
                    new() { Name = "LinkedIn", Url = "#", Icon = "linkedin" },
                    new() { Name = "Instagram", Url = "#", Icon = "instagram" }
                }
            },
            _ => new { message = "Default content not implemented for this page type" }
        };
    }
}