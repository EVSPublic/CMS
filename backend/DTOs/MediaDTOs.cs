using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

public class MediaItemDto
{
    public string Id { get; set; } = string.Empty;
    public int BrandId { get; set; }
    public string Filename { get; set; } = string.Empty; // Changed to match frontend
    public string Url { get; set; } = string.Empty; // Frontend expects 'url'
    public string Thumbnail { get; set; } = string.Empty; // Frontend expects 'thumbnail'
    public long Size { get; set; } // Changed to match frontend
    public string Type { get; set; } = string.Empty; // Changed to match frontend
    public string Alt { get; set; } = string.Empty; // Frontend expects 'alt' not 'AltText'
    public List<string> Tags { get; set; } = new(); // Frontend expects tags array
    public string Category { get; set; } = string.Empty; // Frontend expects category
    public DateTime UploadDate { get; set; } // Frontend expects 'uploadDate'
    public string Status { get; set; } = string.Empty;
    public int? CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public string? CreatorName { get; set; }
    public string? UpdaterName { get; set; }
}

public class CreateMediaItemDto
{
    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string FilePath { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string FileType { get; set; } = string.Empty;

    [Required]
    public long FileSize { get; set; }

    [MaxLength(255)]
    public string? AltText { get; set; }

    public string? Caption { get; set; }

}

public class UpdateMediaItemDto
{
    [MaxLength(255)]
    public string? FileName { get; set; }

    [MaxLength(255)]
    public string? AltText { get; set; }

    public string? Caption { get; set; }
}

public class PublishMediaItemDto
{
    [Required]
    public bool Publish { get; set; } = true;
}