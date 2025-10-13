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

                // Update station count in Header for StationMap page from Index page hero.count
                if (pageTypeEnum == PageType.StationMap && contentJson.ValueKind == JsonValueKind.Object)
                {
                    contentJson = await UpdateStationMapCountFromIndexPage(contentJson, brandId);
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

            // Extract meta fields from content if available
            string? metaTitle = null;
            string? metaDescription = null;
            string? metaKeywords = null;

            var defaultContentJson = JsonSerializer.Serialize(defaultContent);
            var contentElement = JsonSerializer.Deserialize<JsonElement>(defaultContentJson);

            if (contentElement.ValueKind == JsonValueKind.Object && contentElement.TryGetProperty("Meta", out var metaProperty))
            {
                if (metaProperty.TryGetProperty("Title", out var titleProp))
                    metaTitle = titleProp.GetString();
                if (metaProperty.TryGetProperty("Description", out var descProp))
                    metaDescription = descProp.GetString();
                if (metaProperty.TryGetProperty("Keywords", out var keywordsProp))
                    metaKeywords = keywordsProp.GetString();
            }

            // Return default content as a DTO without persisting
            return Ok(new ContentPageDto
            {
                Id = 0,
                BrandId = brandId,
                PageType = pageTypeEnum.ToString(),
                Content = contentElement,
                MetaTitle = metaTitle,
                MetaDescription = metaDescription,
                MetaKeywords = metaKeywords,
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

            // Get count from ContentPages Index page hero.count field
            var contentPage = await _context.ContentPages
                .Where(c => c.BrandId == brandId && c.PageType == PageType.Index)
                .FirstOrDefaultAsync();

            string formattedCount = "1880+"; // Default fallback

            if (contentPage != null)
            {
                try
                {
                    var contentJson = JsonSerializer.Deserialize<JsonElement>(contentPage.Content);

                    if (contentJson.ValueKind == JsonValueKind.Object &&
                        contentJson.TryGetProperty("hero", out var heroProp) &&
                        heroProp.TryGetProperty("count", out var countProp))
                    {
                        formattedCount = countProp.GetString() ?? "1880+";
                    }
                }
                catch
                {
                    // If parsing fails, use default
                }
            }

            var statistics = new
            {
                chargingStationCount = formattedCount.Replace("+", ""), // Remove + for numeric value
                formattedCount = formattedCount
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
        // Get brand to fetch the charging station count (updated every 30 minutes by background service)
        var brand = await _context.Brands.FindAsync(brandId);
        var chargingStationCount = brand?.ChargingStationCount ?? 1880;

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
                    ListTitle = "Tarife Seçenekleri",
                    AcListTitle = null,
                    DcListTitle = null,
                    TarifelerImage = null
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
            PageType.Tariffs => new TarifelerPageContentDto
            {
                Meta = new TarifelerMetaDto
                {
                    Title = $"Tarifeler - {brandName}",
                    Description = "Elektrikli araç şarj tarifelerimiz hakkında detaylı bilgi edinin.",
                    Keywords = "şarj tarifeleri, elektrikli araç, şarj ücretleri"
                },
                Hero = new TarifelerHeroDto
                {
                    Image = ""
                },
                PageHeader = new TarifelerPageHeaderDto
                {
                    Title = "Tarifeler",
                    Description = "Geniş halka açık şarj istasyonu ağı ile elektrikli aracınız için rekabetçi ve şeffaf tarife seçenekleri."
                },
                Tariffs = new TarifelerTariffsDto
                {
                    IsCampaign = true,
                    CampaignExpireDate = "30-31 ağustos tarihleri arasında geçerlidir",
                    Cards = new List<TariffCardDto>
                    {
                        new()
                        {
                            Badge = "Kampanyalı Tarife",
                            Title = "AC Şarj",
                            OldPrice = "10,00 TL",
                            CurrentPrice = "8,50 TL",
                            Unit = "kWh"
                        },
                        new()
                        {
                            Badge = "Kampanyalı Tarife",
                            Title = "DC Hızlı Şarj",
                            OldPrice = "15,00 TL",
                            CurrentPrice = "12,00 TL",
                            Unit = "kWh"
                        },
                        new()
                        {
                            Badge = "Kampanyalı Tarife",
                            Title = "DC Ultra Hızlı Şarj",
                            OldPrice = "20,00 TL",
                            CurrentPrice = "18,00 TL",
                            Unit = "kWh"
                        }
                    }
                }
            },
            PageType.StationMap => new StationMapPageContentDto
            {
                Meta = new StationMapMetaDto
                {
                    Title = $"İstasyon Haritası - {brandName}",
                    Description = "Elektrikli araç şarj istasyonlarımızın konumlarını harita üzerinde görüntüleyin.",
                    Keywords = "şarj istasyonu, harita, konum, elektrikli araç"
                },
                PageHero = new StationMapPageHeroDto
                {
                    BackgroundImage = "assets/img/istasyon-haritasi-bg.jpg",
                    LogoImage = "assets/img/page-hero-logo.svg",
                    LogoAlt = $"{brandName} Logo"
                },
                Header = new StationMapHeaderDto
                {
                    Title = "İstasyon Haritası",
                    Count = chargingStationCount,
                    CountText = "Şarj İstasyonu",
                    LogoImage = "assets/img/station-map.svg",
                    Description = $"Opet istasyonları başta olmak üzere stratejik lokasyonlarda konumlanan {brandName} şarj istasyonlarıyla, elektrikli aracınız için hızlı, güvenilir ve kolay erişilebilir enerjiye dilediğiniz her an ulaşabilirsiniz."
                },
                Map = new StationMapMapDto
                {
                    Provider = "openstreetmap",
                    Height = 600,
                    Zoom = 6,
                    Latitude = 39.9334,
                    Longitude = 32.8597,
                    GoogleMapsApiKey = null
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

                    // Only add count if missing (don't override user's manual count value)
                    if (!heroDict.ContainsKey("count") || heroDict["count"] == null)
                    {
                        var brand = await _context.Brands.FindAsync(brandId);
                        if (brand != null)
                        {
                            heroDict["count"] = $"{brand.ChargingStationCount}+";
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

    private async Task<JsonElement> UpdateStationCountInHeader(JsonElement contentJson, int brandId)
    {
        try
        {
            // Deserialize to dictionary for manipulation
            var contentDict = JsonSerializer.Deserialize<Dictionary<string, object>>(contentJson.GetRawText());

            if (contentDict != null && contentDict.ContainsKey("Header"))
            {
                var headerJson = JsonSerializer.Serialize(contentDict["Header"]);
                var headerDict = JsonSerializer.Deserialize<Dictionary<string, object>>(headerJson);

                if (headerDict != null)
                {
                    // Get the latest station count from the brand (updated by background service)
                    var brand = await _context.Brands.FindAsync(brandId);
                    if (brand != null)
                    {
                        headerDict["Count"] = brand.ChargingStationCount;
                        contentDict["Header"] = headerDict;

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

    private async Task<JsonElement> UpdateStationMapCountFromIndexPage(JsonElement contentJson, int brandId)
    {
        try
        {
            // Get the count from Index page hero.count
            var indexPage = await _context.ContentPages
                .Where(c => c.BrandId == brandId && c.PageType == PageType.Index)
                .FirstOrDefaultAsync();

            if (indexPage != null)
            {
                var indexContent = JsonSerializer.Deserialize<JsonElement>(indexPage.Content);

                if (indexContent.ValueKind == JsonValueKind.Object &&
                    indexContent.TryGetProperty("hero", out var heroProp) &&
                    heroProp.TryGetProperty("count", out var countProp))
                {
                    var countString = countProp.GetString() ?? "1880";
                    // Remove the '+' sign if present and parse to int
                    var countValue = int.Parse(countString.Replace("+", ""));

                    // Update the StationMap Header.Count
                    var contentDict = JsonSerializer.Deserialize<Dictionary<string, object>>(contentJson.GetRawText());

                    if (contentDict != null && contentDict.ContainsKey("Header"))
                    {
                        var headerJson = JsonSerializer.Serialize(contentDict["Header"]);
                        var headerDict = JsonSerializer.Deserialize<Dictionary<string, object>>(headerJson);

                        if (headerDict != null)
                        {
                            headerDict["Count"] = countValue;
                            contentDict["Header"] = headerDict;

                            // Serialize back to JsonElement
                            return JsonSerializer.Deserialize<JsonElement>(JsonSerializer.Serialize(contentDict));
                        }
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