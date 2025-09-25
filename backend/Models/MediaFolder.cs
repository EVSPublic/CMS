using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminPanel.Models;

public class MediaFolder
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int BrandId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("BrandId")]
    public virtual Brand Brand { get; set; } = null!;

    public virtual ICollection<MediaItemFolder> MediaItemFolders { get; set; } = new List<MediaItemFolder>();
}

public class MediaItemFolder
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int MediaItemId { get; set; }

    [Required]
    public int MediaFolderId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("MediaItemId")]
    public virtual MediaItem MediaItem { get; set; } = null!;

    [ForeignKey("MediaFolderId")]
    public virtual MediaFolder MediaFolder { get; set; } = null!;
}