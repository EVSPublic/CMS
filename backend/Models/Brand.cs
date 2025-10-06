using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminPanel.Models;

public class Brand
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Domain { get; set; }

    [MaxLength(500)]
    public string? LogoPath { get; set; }

    [Column(TypeName = "json")]
    public string? ThemeConfig { get; set; }

    public int ChargingStationCount { get; set; } = 1880;

    // Partnership slider settings (in milliseconds)
    public int PartnershipSlideInterval { get; set; } = 3000; // 3 seconds
    public int PartnershipSlideDuration { get; set; } = 500;  // 0.5 seconds

    // Announcements page content (meta + hero)
    [Column(TypeName = "json")]
    public string? AnnouncementsPageContent { get; set; }

    // Mobile app links
    [MaxLength(500)]
    public string? IosAppLink { get; set; }

    [MaxLength(500)]
    public string? AndroidAppLink { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<User> Users { get; set; } = new List<User>();
    public virtual ICollection<ContentPage> ContentPages { get; set; } = new List<ContentPage>();
    public virtual ICollection<StaticPage> StaticPages { get; set; } = new List<StaticPage>();
    public virtual ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();
    public virtual ICollection<Partnership> Partnerships { get; set; } = new List<Partnership>();
    public virtual ICollection<MediaFile> MediaFiles { get; set; } = new List<MediaFile>();
}