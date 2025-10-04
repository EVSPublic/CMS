using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

// Main content page DTO
public class ContentPageDto
{
    public int Id { get; set; }
    public int BrandId { get; set; }
    public string PageType { get; set; } = string.Empty;
    public object Content { get; set; } = new { };
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public string Status { get; set; } = string.Empty;
    public int? CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public string? CreatorName { get; set; }
    public string? UpdaterName { get; set; }
}

// Index page content structure
public class IndexPageContentDto
{
    public MetaDto Meta { get; set; } = new();
    public HeroDto Hero { get; set; } = new();
    public ServicesDto Services { get; set; } = new();
    public TariffsDto Tariffs { get; set; } = new();
    public OpetDto Opet { get; set; } = new();
    public SolutionsDto Solutions { get; set; } = new();
    public SustainabilityDto Sustainability { get; set; } = new();
}

public class MetaDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
}

public class HeroDto
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string MediaType { get; set; } = "video"; // 'video' | 'image'
    public string MediaUrl { get; set; } = string.Empty;
    public int Count { get; set; } = 0;
    public string CountText { get; set; } = string.Empty;
}

public class ServicesDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
}

public class TariffsDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ListTitle { get; set; } = string.Empty;
}

public class OpetDto
{
    public string BackgroundImage { get; set; } = string.Empty;
}

public class SolutionsDto
{
    public string IndividualDescription { get; set; } = string.Empty;
    public string CorporateDescription { get; set; } = string.Empty;
    public string SolutionsImage { get; set; } = string.Empty;
}

public class SustainabilityDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BackgroundImage { get; set; } = string.Empty;
}

// Contact page DTOs
public class ContactPageContentDto
{
    public ContactMetaDto Meta { get; set; } = new();
    public ContactHeroDto Hero { get; set; } = new();
    public ContactPageHeroDto PageHero { get; set; } = new();
    public ContactInfoDto ContactInfo { get; set; } = new();
    public ContactFormDto ContactForm { get; set; } = new();
    public List<SocialMediaDto> SocialMedia { get; set; } = new();
}

public class ContactMetaDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
}

public class ContactHeroDto
{
    public string Image { get; set; } = string.Empty;
}

public class ContactPageHeroDto
{
    public string BackgroundImage { get; set; } = string.Empty;
    public string LogoImage { get; set; } = string.Empty;
    public string LogoAlt { get; set; } = string.Empty;
}

public class ContactInfoDto
{
    public string Title { get; set; } = string.Empty;
    public OfficeDto Office { get; set; } = new();
    public EmailDto Email { get; set; } = new();
    public PhoneDto Phone { get; set; } = new();
}

public class OfficeDto
{
    public string Title { get; set; } = string.Empty;
    public List<string> Address { get; set; } = new();
}

public class EmailDto
{
    public string Title { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}

public class PhoneDto
{
    public string Title { get; set; } = string.Empty;
    public string Number { get; set; } = string.Empty;
}

public class ContactFormDto
{
    public string Title { get; set; } = string.Empty;
    public ContactFormTabsDto Tabs { get; set; } = new();
    public ContactFormFieldsDto Fields { get; set; } = new();
    public List<SubjectOptionDto> SubjectOptions { get; set; } = new();
    public EmailConfigDto EmailConfig { get; set; } = new();
    public string SubmitButton { get; set; } = string.Empty;
    public string KvkkText { get; set; } = string.Empty;
    public string KvkkLinkText { get; set; } = string.Empty;
}

public class ContactFormTabsDto
{
    public string Individual { get; set; } = string.Empty;
    public string Corporate { get; set; } = string.Empty;
}

public class ContactFormFieldsDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class SubjectOptionDto
{
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
}

public class EmailConfigDto
{
    public string SmtpHost { get; set; } = string.Empty;
    public string SmtpPort { get; set; } = string.Empty;
    public string SmtpUsername { get; set; } = string.Empty;
    public string SmtpPassword { get; set; } = string.Empty;
    public string ExtraDetails { get; set; } = string.Empty;
}

public class SocialMediaDto
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
}

// Tariffs page content structure
public class TarifelerPageContentDto
{
    public TarifelerMetaDto Meta { get; set; } = new();
    public TarifelerHeroDto Hero { get; set; } = new();
    public TarifelerPageHeaderDto PageHeader { get; set; } = new();
    public TarifelerTariffsDto Tariffs { get; set; } = new();
}

public class TarifelerMetaDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
}

public class TarifelerHeroDto
{
    public string Image { get; set; } = string.Empty;
}

public class TarifelerPageHeaderDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class TarifelerTariffsDto
{
    public List<TariffCardDto> Cards { get; set; } = new();
}

public class TariffCardDto
{
    public bool IsCampaign { get; set; }
    public string Badge { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string OldPrice { get; set; } = string.Empty;
    public string CurrentPrice { get; set; } = string.Empty;
    public string Unit { get; set; } = "kWh";
    public string CampaignExpireDate { get; set; } = "30-31 ağustos tarihleri arasında geçerlidir";
}

public class UpdateContentPageDto
{
    [Required]
    public object Content { get; set; } = new { };

    [MaxLength(255)]
    public string? MetaTitle { get; set; }

    public string? MetaDescription { get; set; }

    public string? MetaKeywords { get; set; }
}

public class PublishContentPageDto
{
    [Required]
    public bool Publish { get; set; } = true;
}

// StationMap page content structure
public class StationMapPageContentDto
{
    public StationMapMetaDto Meta { get; set; } = new();
    public StationMapPageHeroDto PageHero { get; set; } = new();
    public StationMapHeaderDto Header { get; set; } = new();
    public StationMapMapDto Map { get; set; } = new();
}

public class StationMapMetaDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
}

public class StationMapPageHeroDto
{
    public string BackgroundImage { get; set; } = string.Empty;
    public string LogoImage { get; set; } = string.Empty;
    public string LogoAlt { get; set; } = string.Empty;
}

public class StationMapHeaderDto
{
    public string Title { get; set; } = string.Empty;
    public int Count { get; set; }
    public string CountText { get; set; } = string.Empty;
    public string LogoImage { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class StationMapMapDto
{
    public string IframeUrl { get; set; } = string.Empty;
    public int Height { get; set; } = 600;
}