using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AdminPanel.DTOs;

public class AppLinksDto
{
    [JsonPropertyName("iosAppLink")]
    public string? IosAppLink { get; set; }

    [JsonPropertyName("androidAppLink")]
    public string? AndroidAppLink { get; set; }
}

public class UpdateAppLinksDto
{
    [JsonPropertyName("iosAppLink")]
    [MaxLength(500)]
    public string? IosAppLink { get; set; }

    [JsonPropertyName("androidAppLink")]
    [MaxLength(500)]
    public string? AndroidAppLink { get; set; }
}
