using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminPanel.Models;

public class ActivityLog
{
    [Key]
    public int Id { get; set; }

    [Required]
    public DateTime Timestamp { get; set; }

    [Required]
    [StringLength(50)]
    public string Action { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Details { get; set; } = string.Empty;

    [Required]
    public int UserId { get; set; }

    [Required]
    [StringLength(100)]
    public string UserName { get; set; } = string.Empty;

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

    [Column(TypeName = "text")]
    public string? Metadata { get; set; }

    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }

    [ForeignKey("BrandId")]
    public virtual Brand? Brand { get; set; }
}

public enum LogLevel
{
    Info,
    Success,
    Warning,
    Error
}

public enum LogAction
{
    UserLogin,
    UserLogout,
    ContentSave,
    ContentPublish,
    ContentUnpublish,
    ImageUpload,
    ImageDelete,
    BrandSwitch,
    UserCreate,
    UserUpdate,
    UserDelete,
    PageView,
    ExportData,
    SettingsChange
}