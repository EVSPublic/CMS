using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace AdminPanel.Models;

public class User : IdentityUser<int>
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; } = UserRole.Viewer;

    [Required]
    public UserStatus Status { get; set; } = UserStatus.Active;

    public int? BrandId { get; set; }

    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("BrandId")]
    public virtual Brand? Brand { get; set; }

    public virtual ICollection<ContentPage> CreatedContentPages { get; set; } = new List<ContentPage>();
    public virtual ICollection<ContentPage> UpdatedContentPages { get; set; } = new List<ContentPage>();
    public virtual ICollection<StaticPage> CreatedStaticPages { get; set; } = new List<StaticPage>();
    public virtual ICollection<StaticPage> UpdatedStaticPages { get; set; } = new List<StaticPage>();
    public virtual ICollection<Announcement> CreatedAnnouncements { get; set; } = new List<Announcement>();
    public virtual ICollection<Announcement> UpdatedAnnouncements { get; set; } = new List<Announcement>();
    public virtual ICollection<Partnership> CreatedPartnerships { get; set; } = new List<Partnership>();
    public virtual ICollection<Partnership> UpdatedPartnerships { get; set; } = new List<Partnership>();
    public virtual ICollection<MediaFile> UploadedMediaFiles { get; set; } = new List<MediaFile>();
}

public enum UserRole
{
    Admin,
    Editor,
    Viewer
}

public enum UserStatus
{
    Active,
    Inactive
}