using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

public class BrandDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Domain { get; set; }
    public string? LogoPath { get; set; }
    public string? ThemeConfig { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UpdateBrandDto
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(255)]
    public string? Domain { get; set; }

    [MaxLength(500)]
    public string? LogoPath { get; set; }

    public string? ThemeConfig { get; set; }
}