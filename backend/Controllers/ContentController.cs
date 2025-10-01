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
    [AllowAnonymous]
    public async Task<IActionResult> GetContentPage(int brandId, string pageType)
    {
        try
        {
            // Validate page type
            if (!Enum.TryParse<PageType>(pageType, true, out var pageTypeEnum))
            {
                return BadRequest(new { error = new { code = "INVALID_PAGE_TYPE", message = "Invalid page type specified" } });
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
                var contentJson = JsonSerializer.Deserialize<JsonElement>(contentPageEntity.Content);

                // Add mediaType and count to hero if missing (for Index page)
                if (pageTypeEnum == PageType.Index && contentJson.ValueKind == JsonValueKind.Object)
                {
                    contentJson = await EnsureMediaTypeAndCountInHero(contentJson, brandId);
                }

                contentPage = new ContentPageDto
                {
                    Id = contentPageEntity.Id,
                    BrandId = contentPageEntity.BrandId,
                    PageType = contentPageEntity.PageType.ToString(),
                    Content = contentJson,
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

                return Ok(contentPage);
            }

            // If no content page exists, return default content without saving to database
            var brand = await _context.Brands.FindAsync(brandId);
            if (brand == null)
            {
                return NotFound(new { error = new { code = "BRAND_NOT_FOUND", message = "Brand not found" } });
            }

            var defaultContent = await GetDefaultContentForPageType(pageTypeEnum, brand.Name, brandId);

            // Return default content as a DTO without persisting
            return Ok(new ContentPageDto
            {
                Id = 0,
                BrandId = brandId,
                PageType = pageTypeEnum.ToString(),
                Content = JsonSerializer.Deserialize<JsonElement>(JsonSerializer.Serialize(defaultContent)),
                MetaTitle = null,
                MetaDescription = null,
                MetaKeywords = null,
                Status = "Draft",
                CreatedBy = 0,
                UpdatedBy = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                BrandName = brand.Name,
                CreatorName = null,
                UpdaterName = null
            });
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
    [AllowAnonymous]
    public async Task<IActionResult> GetBrandStatistics(int brandId)
    {
        try
        {
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
                chargingStationCount = finalCount
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
                    Subtitle = "Electric Vehicle Charging Solutions",
                    MediaType = "video",
                    MediaUrl = "assets/video/hero-video.mp4",
                    Count = chargingStationCount,
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

    private async Task<JsonElement> EnsureMediaTypeAndCountInHero(JsonElement contentJson, int brandId)
    {
        try
        {
            // Deserialize to dictionary for manipulation
            var contentDict = JsonSerializer.Deserialize<Dictionary<string, object>>(contentJson.GetRawText());

            if (contentDict != null && contentDict.ContainsKey("hero"))
            {
                var heroJson = JsonSerializer.Serialize(contentDict["hero"]);
                var heroDict = JsonSerializer.Deserialize<Dictionary<string, object>>(heroJson);

                if (heroDict != null)
                {
                    bool modified = false;

                    // Add mediaType if missing
                    if (!heroDict.ContainsKey("mediaType"))
                    {
                        // Determine mediaType based on mediaUrl extension
                        string mediaType = "image"; // default

                        if (heroDict.ContainsKey("mediaUrl"))
                        {
                            var mediaUrl = heroDict["mediaUrl"]?.ToString() ?? "";
                            var extension = Path.GetExtension(mediaUrl).ToLowerInvariant();

                            if (extension == ".mp4" || extension == ".webm" || extension == ".ogg" || extension == ".mov")
                            {
                                mediaType = "video";
                            }
                        }

                        heroDict["mediaType"] = mediaType;
                        modified = true;
                    }

                    // Add or convert count to int
                    if (heroDict.ContainsKey("count"))
                    {
                        var countValue = heroDict["count"];
                        if (countValue is JsonElement countElement && countElement.ValueKind == JsonValueKind.String)
                        {
                            var countStr = countElement.GetString() ?? "0";
                            // Remove '+' and parse to int
                            countStr = countStr.Replace("+", "");
                            if (int.TryParse(countStr, out int count))
                            {
                                heroDict["count"] = count;
                                modified = true;
                            }
                        }
                        else if (countValue is string countString)
                        {
                            var countStr = countString.Replace("+", "");
                            if (int.TryParse(countStr, out int count))
                            {
                                heroDict["count"] = count;
                                modified = true;
                            }
                        }
                    }
                    else
                    {
                        // If count is missing, fetch it from database
                        var brand = await _context.Brands.FindAsync(brandId);
                        if (brand != null)
                        {
                            var brandName = brand.Name.ToLower();
                            var actualStationCount = await _context.Database.SqlQueryRaw<int>(
                                "SELECT COUNT(*) as Value FROM Stations WHERE BrandVisibility LIKE {0}",
                                $"%{brandName}%"
                            ).FirstAsync();

                            var finalCount = actualStationCount > 0 ? actualStationCount : brand.ChargingStationCount;
                            heroDict["count"] = finalCount;
                            modified = true;
                        }
                    }

                    if (modified)
                    {
                        contentDict["hero"] = heroDict;
                        // Serialize back to JsonElement
                        return JsonSerializer.Deserialize<JsonElement>(JsonSerializer.Serialize(contentDict));
                    }
                }
            }

            return contentJson;
        }
        catch
        {
            // If any error occurs, return original content
            return contentJson;
        }
    }
}