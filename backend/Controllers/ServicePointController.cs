using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using AdminPanel.Data;
using AdminPanel.Models;

namespace AdminPanel.Controllers;

[ApiController]
[Route("[controller]")]
public class ServicePointController : ControllerBase
{
    private readonly AdminPanelContext _context;
    private readonly ILogger<ServicePointController> _logger;

    public ServicePointController(AdminPanelContext context, ILogger<ServicePointController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("StationList")]
    public async Task<ActionResult> GetStationList([FromBody] StationListRequest? request)
    {
        try
        {
            var brandId = request?.BrandId ?? 1; // Default to brand 1 if not specified

            _logger.LogInformation("Getting station list for brand {BrandId}", brandId);

            var query = _context.Stations
                .Include(s => s.Chargers)
                .AsQueryable();

            // Filter by brand visibility
            query = query.Where(s => s.BrandVisibility.Contains(brandId.ToString()));

            // Only return active stations
            query = query.Where(s => s.Status == "Active" || s.Status == "Operational");

            var stations = await query.ToListAsync();

            var response = stations.Select(s => new
            {
                id = s.Id,
                name = s.Name,
                address = s.Address,
                latitude = s.Latitude,
                longitude = s.Longitude,
                status = s.Status,
                chargers = s.Chargers.Select(c => new
                {
                    id = c.Id,
                    type = c.Type,
                    powerKW = c.PowerKW,
                    status = c.Status,
                    connectorType = c.ConnectorType
                }).ToList(),
                hours = JsonSerializer.Deserialize<Dictionary<string, string>>(s.Hours) ?? new Dictionary<string, string>(),
                contact = JsonSerializer.Deserialize<object>(s.Contact) ?? new {},
                images = JsonSerializer.Deserialize<List<string>>(s.Images) ?? new List<string>(),
                amenities = JsonSerializer.Deserialize<List<string>>(s.Amenities) ?? new List<string>(),
                totalChargers = s.Chargers.Count,
                availableChargers = s.Chargers.Count(c => c.Status == "Available")
            }).ToList();

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting station list");
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }
}

public class StationListRequest
{
    public int? BrandId { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public decimal? RadiusKm { get; set; }
}
