using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/admin/v1/stations")]
[Authorize]
public class StationsController : ControllerBase
{
    private readonly AdminPanelContext _context;
    private readonly ILogger<StationsController> _logger;

    public StationsController(AdminPanelContext context, ILogger<StationsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResponse<StationWithDistanceDto>>> GetStations([FromQuery] StationSearchDto searchDto)
    {
        try
        {
            var query = _context.Stations
                .Include(s => s.Chargers)
                .Include(s => s.CreatedBy)
                .AsQueryable();

            // Text search
            if (!string.IsNullOrEmpty(searchDto.Search))
            {
                query = query.Where(s => s.Name.Contains(searchDto.Search) || s.Address.Contains(searchDto.Search));
            }

            // Status filter
            if (!string.IsNullOrEmpty(searchDto.Status))
            {
                query = query.Where(s => s.Status == searchDto.Status);
            }

            // Brand visibility filter
            if (searchDto.BrandVisibility?.Any() == true)
            {
                foreach (var brand in searchDto.BrandVisibility)
                {
                    query = query.Where(s => s.BrandVisibility.Contains($"\"{brand}\""));
                }
            }

            // Location-based filtering
            if (searchDto.Latitude.HasValue && searchDto.Longitude.HasValue && searchDto.RadiusKm.HasValue)
            {
                var lat = (double)searchDto.Latitude.Value;
                var lng = (double)searchDto.Longitude.Value;
                var radius = (double)searchDto.RadiusKm.Value;

                query = query.Where(s =>
                    (6371 * Math.Acos(Math.Cos(Math.PI * lat / 180) * Math.Cos(Math.PI * (double)s.Latitude / 180) *
                    Math.Cos(Math.PI * (double)s.Longitude / 180 - Math.PI * lng / 180) +
                    Math.Sin(Math.PI * lat / 180) * Math.Sin(Math.PI * (double)s.Latitude / 180))) <= radius);
            }

            // Sorting
            query = searchDto.SortBy.ToLower() switch
            {
                "name" => searchDto.SortOrder.ToLower() == "desc" ? query.OrderByDescending(s => s.Name) : query.OrderBy(s => s.Name),
                "status" => searchDto.SortOrder.ToLower() == "desc" ? query.OrderByDescending(s => s.Status) : query.OrderBy(s => s.Status),
                "createdat" => searchDto.SortOrder.ToLower() == "desc" ? query.OrderByDescending(s => s.CreatedAt) : query.OrderBy(s => s.CreatedAt),
                _ => query.OrderBy(s => s.Name)
            };

            // Pagination
            var totalCount = await query.CountAsync();
            var stations = await query
                .Skip((searchDto.Page - 1) * searchDto.PerPage)
                .Take(searchDto.PerPage)
                .ToListAsync();

            var stationDtos = stations.Select(s => new StationWithDistanceDto
            {
                Station = MapToStationDto(s),
                DistanceKm = searchDto.Latitude.HasValue && searchDto.Longitude.HasValue
                    ? (decimal)CalculateDistance((double)searchDto.Latitude.Value, (double)searchDto.Longitude.Value, (double)s.Latitude, (double)s.Longitude)
                    : 0,
                DrivingTimeMinutes = 0, // Would need external service for real driving time
                AvailableConnectors = s.Chargers.Select(c => c.ConnectorType).Distinct().ToList(),
                AvailableChargers = s.Chargers.Count(c => c.Status == "Available")
            }).ToList();

            return Ok(new PagedResponse<StationWithDistanceDto>
            {
                Data = stationDtos,
                Page = searchDto.Page,
                PerPage = searchDto.PerPage,
                Total = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / searchDto.PerPage)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting stations");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StationDto>> GetStation(string id)
    {
        try
        {
            var station = await _context.Stations
                .Include(s => s.Chargers)
                .Include(s => s.CreatedBy)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (station == null)
            {
                return NotFound();
            }

            return Ok(MapToStationDto(station));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting station {StationId}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<StationDto>> CreateStation([FromBody] CreateStationDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var station = new Station
            {
                Id = Guid.NewGuid().ToString(),
                Name = createDto.Name,
                Address = createDto.Address,
                Latitude = createDto.Latitude,
                Longitude = createDto.Longitude,
                Status = createDto.Status,
                Hours = JsonSerializer.Serialize(createDto.Hours ?? new Dictionary<string, string>()),
                Contact = JsonSerializer.Serialize(createDto.Contact ?? new CreateStationContactDto()),
                Images = JsonSerializer.Serialize(createDto.Images ?? new List<string>()),
                Amenities = JsonSerializer.Serialize(createDto.Amenities ?? new List<string>()),
                BrandVisibility = JsonSerializer.Serialize(createDto.BrandVisibility ?? new List<string>()),
                CreatedById = GetCurrentUserId(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Stations.Add(station);

            // Add chargers
            foreach (var chargerDto in createDto.Chargers)
            {
                var charger = new Charger
                {
                    Id = Guid.NewGuid().ToString(),
                    StationId = station.Id,
                    Type = chargerDto.Type,
                    PowerKW = chargerDto.PowerKW,
                    Status = chargerDto.Status,
                    ConnectorType = chargerDto.ConnectorType,
                    LastMaintenance = chargerDto.LastMaintenance,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.Chargers.Add(charger);
            }

            await _context.SaveChangesAsync();

            // Reload with related data
            station = await _context.Stations
                .Include(s => s.Chargers)
                .Include(s => s.CreatedBy)
                .FirstAsync(s => s.Id == station.Id);

            return CreatedAtAction(nameof(GetStation), new { id = station.Id }, MapToStationDto(station));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating station");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<StationDto>> UpdateStation(string id, [FromBody] UpdateStationDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var station = await _context.Stations
                .Include(s => s.Chargers)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (station == null)
            {
                return NotFound();
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(updateDto.Name))
                station.Name = updateDto.Name;
            if (!string.IsNullOrEmpty(updateDto.Address))
                station.Address = updateDto.Address;
            if (updateDto.Latitude.HasValue)
                station.Latitude = updateDto.Latitude.Value;
            if (updateDto.Longitude.HasValue)
                station.Longitude = updateDto.Longitude.Value;
            if (!string.IsNullOrEmpty(updateDto.Status))
                station.Status = updateDto.Status;
            if (updateDto.Hours != null)
                station.Hours = JsonSerializer.Serialize(updateDto.Hours);
            if (updateDto.Contact != null)
                station.Contact = JsonSerializer.Serialize(updateDto.Contact);
            if (updateDto.Images != null)
                station.Images = JsonSerializer.Serialize(updateDto.Images);
            if (updateDto.Amenities != null)
                station.Amenities = JsonSerializer.Serialize(updateDto.Amenities);
            if (updateDto.BrandVisibility != null)
                station.BrandVisibility = JsonSerializer.Serialize(updateDto.BrandVisibility);

            station.UpdatedAt = DateTime.UtcNow;

            // Update chargers if provided
            if (updateDto.Chargers != null)
            {
                // Remove existing chargers
                _context.Chargers.RemoveRange(station.Chargers);

                // Add new chargers
                foreach (var chargerDto in updateDto.Chargers)
                {
                    var charger = new Charger
                    {
                        Id = Guid.NewGuid().ToString(),
                        StationId = station.Id,
                        Type = chargerDto.Type,
                        PowerKW = chargerDto.PowerKW,
                        Status = chargerDto.Status,
                        ConnectorType = chargerDto.ConnectorType,
                        LastMaintenance = chargerDto.LastMaintenance,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Chargers.Add(charger);
                }
            }

            await _context.SaveChangesAsync();

            // Reload with related data
            station = await _context.Stations
                .Include(s => s.Chargers)
                .Include(s => s.CreatedBy)
                .FirstAsync(s => s.Id == station.Id);

            return Ok(MapToStationDto(station));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating station {StationId}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStation(string id)
    {
        try
        {
            var station = await _context.Stations
                .Include(s => s.Chargers)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (station == null)
            {
                return NotFound();
            }

            _context.Chargers.RemoveRange(station.Chargers);
            _context.Stations.Remove(station);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting station {StationId}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("{stationId}/chargers/{chargerId}/status")]
    public async Task<IActionResult> UpdateChargerStatus(string stationId, string chargerId, [FromBody] UpdateChargerStatusDto statusDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var charger = await _context.Chargers
                .FirstOrDefaultAsync(c => c.Id == chargerId && c.StationId == stationId);

            if (charger == null)
            {
                return NotFound();
            }

            charger.Status = statusDto.Status;
            charger.LastMaintenance = statusDto.LastMaintenance;
            charger.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating charger status {ChargerId}", chargerId);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpGet("status-summary")]
    public async Task<ActionResult<StationStatusSummaryDto>> GetStatusSummary()
    {
        try
        {
            var statusCounts = await _context.Stations
                .GroupBy(s => s.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Status, x => x.Count);

            var totalStations = await _context.Stations.CountAsync();
            var totalChargers = await _context.Chargers.CountAsync();
            var availableChargers = await _context.Chargers.CountAsync(c => c.Status == "Available");

            return Ok(new StationStatusSummaryDto
            {
                StatusCounts = statusCounts,
                TotalStations = totalStations,
                TotalChargers = totalChargers,
                AvailableChargers = availableChargers
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting status summary");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    private StationDto MapToStationDto(Station station)
    {
        return new StationDto
        {
            Id = station.Id,
            Name = station.Name,
            Address = station.Address,
            Latitude = station.Latitude,
            Longitude = station.Longitude,
            Status = station.Status,
            Chargers = station.Chargers.Select(c => new ChargerDto
            {
                Id = c.Id,
                Type = c.Type,
                PowerKW = c.PowerKW,
                Status = c.Status,
                ConnectorType = c.ConnectorType,
                LastMaintenance = c.LastMaintenance
            }).ToList(),
            Hours = JsonSerializer.Deserialize<Dictionary<string, string>>(station.Hours) ?? new Dictionary<string, string>(),
            Contact = JsonSerializer.Deserialize<StationContactDto>(station.Contact) ?? new StationContactDto(),
            Images = JsonSerializer.Deserialize<List<string>>(station.Images) ?? new List<string>(),
            Amenities = JsonSerializer.Deserialize<List<string>>(station.Amenities) ?? new List<string>(),
            BrandVisibility = JsonSerializer.Deserialize<List<string>>(station.BrandVisibility) ?? new List<string>(),
            CreatedById = station.CreatedById.ToString(),
            CreatedAt = station.CreatedAt,
            UpdatedAt = station.UpdatedAt,
            TotalChargers = station.Chargers.Count,
            AvailableChargers = station.Chargers.Count(c => c.Status == "Available")
        };
    }

    private static double CalculateDistance(double lat1, double lng1, double lat2, double lng2)
    {
        const double R = 6371; // Earth's radius in kilometers
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLng = (lng2 - lng1) * Math.PI / 180;
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLng / 2) * Math.Sin(dLng / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst("id") ?? User.FindFirst("sub");
        return userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId) ? userId : 1;
    }
}

public class PagedResponse<T>
{
    public List<T> Data { get; set; } = new();
    public int Page { get; set; }
    public int PerPage { get; set; }
    public int Total { get; set; }
    public int TotalPages { get; set; }
}