using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

public class AppLinksDto
{
    public string? IosAppLink { get; set; }
    public string? AndroidAppLink { get; set; }
}

public class UpdateAppLinksDto
{
    [MaxLength(500)]
    public string? IosAppLink { get; set; }

    [MaxLength(500)]
    public string? AndroidAppLink { get; set; }
}
