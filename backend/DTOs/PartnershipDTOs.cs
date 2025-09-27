using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

public class PartnerDto
{
    public int Id { get; set; }
    public int BrandId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public string? Alt { get; set; }
    public string Status { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public int? CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public string? CreatorName { get; set; }
    public string? UpdaterName { get; set; }
}

public class CreatePartnerDto
{
    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Logo { get; set; }

    [MaxLength(255)]
    public string? Alt { get; set; }
}

public class UpdatePartnerDto
{
    [MaxLength(255)]
    public string? Title { get; set; }

    [MaxLength(500)]
    public string? Logo { get; set; }

    [MaxLength(255)]
    public string? Alt { get; set; }
}

public class UpdatePartnerOrderDto
{
    [Required]
    public List<int> PartnerIds { get; set; } = new();
}

public class TogglePartnerStatusDto
{
    [Required]
    public bool Active { get; set; } = true;
}