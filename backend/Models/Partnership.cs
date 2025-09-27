using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminPanel.Models;

public class Partnership
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int BrandId { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Logo { get; set; }

    [MaxLength(255)]
    public string? Alt { get; set; }

    [Required]
    public PartnershipStatus Status { get; set; } = PartnershipStatus.Active;

    public int DisplayOrder { get; set; } = 0;

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

public enum PartnershipStatus
{
    Active,
    Inactive
}