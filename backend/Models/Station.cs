using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminPanel.Models;

public class Station
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "decimal(10,8)")]
    public decimal Latitude { get; set; }

    [Required]
    [Column(TypeName = "decimal(11,8)")]
    public decimal Longitude { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Active"; // Active, Inactive, Maintenance, Planned

    // Operating hours stored as JSON
    [Column(TypeName = "json")]
    public string Hours { get; set; } = "{}";

    // Contact information stored as JSON
    [Column(TypeName = "json")]
    public string Contact { get; set; } = "{}";

    // Images URLs stored as JSON array
    [Column(TypeName = "json")]
    public string Images { get; set; } = "[]";

    // Amenities stored as JSON array
    [Column(TypeName = "json")]
    public string Amenities { get; set; } = "[]";

    // Brand visibility stored as JSON array
    [Column(TypeName = "json")]
    public string BrandVisibility { get; set; } = "[]";

    public int? CreatedById { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("CreatedById")]
    public virtual User? CreatedBy { get; set; }

    public virtual ICollection<Charger> Chargers { get; set; } = new List<Charger>();

    // Computed properties
    [NotMapped]
    public int TotalChargers => Chargers.Count;

    [NotMapped]
    public int AvailableChargers => Chargers.Count(c => c.Status == "Available");
}

public class Charger
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StationId { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Type { get; set; } = string.Empty; // AC, DC, Tesla

    [Required]
    public decimal PowerKW { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Available"; // Available, Occupied, OutOfOrder, Maintenance

    [Required]
    [MaxLength(100)]
    public string ConnectorType { get; set; } = string.Empty; // CCS, CHAdeMO, Type2, Tesla

    public DateTime? LastMaintenance { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("StationId")]
    public virtual Station Station { get; set; } = null!;
}

// Enums for better type safety
public enum StationStatus
{
    Active,
    Inactive,
    Maintenance,
    Planned
}

public enum ChargerStatus
{
    Available,
    Occupied,
    OutOfOrder,
    Maintenance
}

public enum ChargerType
{
    AC,
    DC,
    Tesla
}

public enum ConnectorType
{
    CCS,
    CHAdeMO,
    Type2,
    Tesla,
    CCS2
}