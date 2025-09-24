using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

public class StaticPageDto
{
    public int Id { get; set; }
    public int BrandId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
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

public class CreateStaticPageDto
{
    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? MetaTitle { get; set; }

    public string? MetaDescription { get; set; }

    public string? MetaKeywords { get; set; }

}

public class UpdateStaticPageDto
{
    [MaxLength(255)]
    public string? Title { get; set; }

    [MaxLength(255)]
    public string? Slug { get; set; }

    public string? Content { get; set; }

    [MaxLength(255)]
    public string? MetaTitle { get; set; }

    public string? MetaDescription { get; set; }

    public string? MetaKeywords { get; set; }
}

public class PublishStaticPageDto
{
    [Required]
    public bool Publish { get; set; } = true;
}