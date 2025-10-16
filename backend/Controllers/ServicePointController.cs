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
    private readonly IHttpClientFactory _httpClientFactory;

    public ServicePointController(AdminPanelContext context, ILogger<ServicePointController> logger, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("StationList")]
    public async Task<ActionResult> GetStationList([FromBody] StationListRequest? request)
    {
        try
        {
            _logger.LogInformation("Proxying station list request to external API");

            var httpClient = _httpClientFactory.CreateClient();

            // Forward the request to the external API
            var externalApiUrl = "https://panel-api.ovolt.com.tr/ServicePoint/StationList";

            var requestContent = new StringContent(
                JsonSerializer.Serialize(request ?? new StationListRequest()),
                System.Text.Encoding.UTF8,
                "application/json"
            );

            var response = await httpClient.PostAsync(externalApiUrl, requestContent);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("External API returned error: {StatusCode}", response.StatusCode);
                return StatusCode((int)response.StatusCode, new { message = "External API error" });
            }

            var content = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<JsonElement>(content);

            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error proxying station list request");
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
