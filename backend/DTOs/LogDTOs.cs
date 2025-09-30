using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

public class ActivityLogDto
{
    public int Id { get; set; }
    public DateTime Timestamp { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? ResourceType { get; set; }
    public string? ResourceId { get; set; }
    public int? BrandId { get; set; }
    public string? BrandName { get; set; }
    public string Level { get; set; } = "info";
    public string? Metadata { get; set; }
}

public class CreateActivityLogDto
{
    [Required]
    [StringLength(50)]
    public string Action { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Details { get; set; } = string.Empty;

    [StringLength(50)]
    public string? ResourceType { get; set; }

    [StringLength(100)]
    public string? ResourceId { get; set; }

    public int? BrandId { get; set; }

    [StringLength(50)]
    public string? BrandName { get; set; }

    [Required]
    [StringLength(20)]
    public string Level { get; set; } = "info";

    public string? Metadata { get; set; }
}

public class ActivityLogFilterDto
{
    public string? Action { get; set; }
    public string? Level { get; set; }
    public int? BrandId { get; set; }
    public int? UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 20;
}

public class ActivityLogResponseDto
{
    public List<ActivityLogDto> Logs { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
    public int TotalPages { get; set; }
}