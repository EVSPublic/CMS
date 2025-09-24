using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

public class MediaItemDto
{
    public int Id { get; set; }
    public int BrandId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? AltText { get; set; }
    public string? Caption { get; set; }
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