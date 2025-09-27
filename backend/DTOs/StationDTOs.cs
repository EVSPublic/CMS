using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

// Main station DTO
public class StationDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<ChargerDto> Chargers { get; set; } = new();
    public Dictionary<string, string> Hours { get; set; } = new();
    public StationContactDto Contact { get; set; } = new();
    public List<string> Images { get; set; } = new();
    public List<string> Amenities { get; set; } = new();
    public List<string> BrandVisibility { get; set; } = new();
    public string CreatedById { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int TotalChargers { get; set; }
    public int AvailableChargers { get; set; }
}

public class ChargerDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal PowerKW { get; set; }
    public string Status { get; set; } = string.Empty;
    public string ConnectorType { get; set; } = string.Empty;
    public DateTime? LastMaintenance { get; set; }
}

public class StationContactDto
{
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Dictionary<string, string> SocialLinks { get; set; } = new();
}

// Request DTOs
public class CreateStationDto
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [Range(-90, 90)]
    public decimal Latitude { get; set; }

    [Required]
    [Range(-180, 180)]
    public decimal Longitude { get; set; }

    [MaxLength(50)]
    public string Status { get; set; } = "Active";

    public List<CreateChargerDto> Chargers { get; set; } = new();
    public Dictionary<string, string>? Hours { get; set; }
    public CreateStationContactDto? Contact { get; set; }
    public List<string>? Images { get; set; }
    public List<string>? Amenities { get; set; }
    public List<string>? BrandVisibility { get; set; }
}

public class CreateChargerDto
{
    [Required]
    [MaxLength(100)]
    public string Type { get; set; } = string.Empty;

    [Required]
    [Range(0.1, 1000)]
    public decimal PowerKW { get; set; }

    [MaxLength(50)]
    public string Status { get; set; } = "Available";

    [Required]
    [MaxLength(100)]
    public string ConnectorType { get; set; } = string.Empty;

    public DateTime? LastMaintenance { get; set; }
}

public class CreateStationContactDto
{
    [Phone]
    public string? Phone { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    public Dictionary<string, string>? SocialLinks { get; set; }
}

public class UpdateStationDto
{
    [MaxLength(255)]
    public string? Name { get; set; }

    [MaxLength(500)]
    public string? Address { get; set; }

    [Range(-90, 90)]
    public decimal? Latitude { get; set; }

    [Range(-180, 180)]
    public decimal? Longitude { get; set; }

    [MaxLength(50)]
    public string? Status { get; set; }

    public List<CreateChargerDto>? Chargers { get; set; }
    public Dictionary<string, string>? Hours { get; set; }
    public CreateStationContactDto? Contact { get; set; }
    public List<string>? Images { get; set; }
    public List<string>? Amenities { get; set; }
    public List<string>? BrandVisibility { get; set; }
}

public class UpdateChargerStatusDto
{
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = string.Empty;

    public DateTime? LastMaintenance { get; set; }
}

public class StationSearchDto
{
    public string? Search { get; set; }
    public string? Status { get; set; }
    public List<string>? BrandVisibility { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? RadiusKm { get; set; }
    public int Page { get; set; } = 1;
    public int PerPage { get; set; } = 50;
    public string SortBy { get; set; } = "name";
    public string SortOrder { get; set; } = "asc";
}

public class StationWithDistanceDto
{
    public StationDto Station { get; set; } = new();
    public decimal DistanceKm { get; set; }
    public int DrivingTimeMinutes { get; set; }
    public List<string> AvailableConnectors { get; set; } = new();
    public int AvailableChargers { get; set; }
}

public class StationStatusSummaryDto
{
    public Dictionary<string, int> StatusCounts { get; set; } = new();
    public int TotalStations { get; set; }
    public int TotalChargers { get; set; }
    public int AvailableChargers { get; set; }
}