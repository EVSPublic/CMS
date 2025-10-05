using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

public class AnnouncementDto
{
    public int Id { get; set; }
    public int BrandId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public int? CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public string? CreatorName { get; set; }
    public string? UpdaterName { get; set; }
}

public class CreateAnnouncementDto
{
    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

}

public class UpdateAnnouncementDto
{
    [MaxLength(255)]
    public string? Title { get; set; }

    public string? Content { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}

public class PublishAnnouncementDto
{
    [Required]
    public bool Publish { get; set; } = true;
}

public class UpdateAnnouncementsPageContentDto
{
    [Required]
    public object Content { get; set; } = new { };
}