using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminPanel.Models;

public class MediaItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int BrandId { get; set; }

    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string FilePath { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string FileType { get; set; } = string.Empty;

    [Required]
    public long FileSize { get; set; }

    [MaxLength(255)]
    public string? AltText { get; set; }

    public string? Caption { get; set; }

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

    public virtual ICollection<MediaItemFolder> MediaItemFolders { get; set; } = new List<MediaItemFolder>();
}