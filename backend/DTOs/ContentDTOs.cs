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
    public string MediaType { get; set; } = "video"; // 'video' | 'image'
    public string MediaUrl { get; set; } = string.Empty;
    public string Count { get; set; } = string.Empty;
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