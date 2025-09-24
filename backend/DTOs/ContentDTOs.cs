using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

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