using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminPanel.Models;

public class ContentPage
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int BrandId { get; set; }

    [Required]
    public PageType PageType { get; set; }

    [Required]
    [Column(TypeName = "json")]
    public string Content { get; set; } = "{}";

    [MaxLength(255)]
    public string? MetaTitle { get; set; }

    public string? MetaDescription { get; set; }

    public string? MetaKeywords { get; set; }

    [Required]
    public ContentStatus Status { get; set; } = ContentStatus.Draft;

    public int? CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("BrandId")]
    public virtual Brand Brand { get; set; } = null!;

    [ForeignKey("CreatedBy")]
    public virtual User? Creator { get; set; }

    [ForeignKey("UpdatedBy")]
    public virtual User? Updater { get; set; }
}

public enum PageType
{
    Index,
    About,
    IndividualSolutions,
    CorporateSolutions,
    Tariffs,
    Contact,
    StationMap
}

public enum ContentStatus
{
    Draft,
    Published
}