using AdminPanel.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AdminPanel.Services;

public class StationCountUpdateService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<StationCountUpdateService> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly TimeSpan _updateInterval = TimeSpan.FromMinutes(30);

    public StationCountUpdateService(
        IServiceProvider serviceProvider,
        ILogger<StationCountUpdateService> logger,
        IHttpClientFactory httpClientFactory)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Station Count Update Service started - will run every {Interval} minutes", _updateInterval.TotalMinutes);

        // Run immediately on startup, then every 30 minutes
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await UpdateStationCounts(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Service is stopping, this is expected
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating station counts, will retry in {Interval}", _updateInterval);
            }

            // Wait for next interval
            await Task.Delay(_updateInterval, stoppingToken);
        }

        _logger.LogInformation("Station Count Update Service stopped");
    }

    private async Task UpdateStationCounts(CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Fetching station list from external API...");

            // Call the external API
            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.PostAsync(
                "https://panel-api.ovolt.com.tr/ServicePoint/StationList",
                new StringContent("{}", System.Text.Encoding.UTF8, "application/json"),
                cancellationToken
            );

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Failed to fetch station list. Status code: {StatusCode}", response.StatusCode);
                return;
            }

            var jsonContent = await response.Content.ReadAsStringAsync(cancellationToken);
            var apiResponse = JsonSerializer.Deserialize<StationListResponse>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (apiResponse?.Result?.Stations == null)
            {
                _logger.LogWarning("API response does not contain station data");
                return;
            }

            var totalStations = apiResponse.Result.Stations.Count;
            _logger.LogInformation("Received {Count} stations from API", totalStations);

            // Filter logic based on the external API:
            // Ovolt is visible when filter has bits for Ovolt (filters with odd numbered bits 1,2)
            // Sharz is visible when filter has bits for Sharz (filters with even numbered bits 2,4)
            // The filter is a bitmask where:
            // - Bit 0 (value 1): Ovolt visible
            // - Bit 1 (value 2): Sharz visible
            // - Bit 6 (value 64): Base visibility
            // Common combinations:
            // 67 = 64+2+1 = Both visible
            // 65 = 64+1 = Only Ovolt visible
            // 66 = 64+2 = Only Sharz visible

            var ovoltCount = apiResponse.Result.Stations.Count(s => (s.Filter & 1) != 0); // Bit 0 set
            var sharzCount = apiResponse.Result.Stations.Count(s => (s.Filter & 2) != 0); // Bit 1 set

            _logger.LogInformation("Station counts - Ovolt: {OvoltCount}, Sharz: {SharzCount}, Total: {Total}",
                ovoltCount, sharzCount, totalStations);

            // Update the database
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AdminPanelContext>();

            // Update Ovolt brand (ID = 1)
            var ovoltBrand = await context.Brands.FindAsync(new object[] { 1 }, cancellationToken);
            if (ovoltBrand != null)
            {
                ovoltBrand.ChargingStationCount = ovoltCount;
                _logger.LogInformation("Updated Ovolt station count to {Count}", ovoltCount);
            }

            // Update Sharz brand (ID = 2)
            var sharzBrand = await context.Brands.FindAsync(new object[] { 2 }, cancellationToken);
            if (sharzBrand != null)
            {
                sharzBrand.ChargingStationCount = sharzCount;
                _logger.LogInformation("Updated Sharz station count to {Count}", sharzCount);
            }

            await context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Station counts updated successfully in database");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in UpdateStationCounts");
            throw;
        }
    }

    private class StationListResponse
    {
        public StationResult? Result { get; set; }
    }

    private class StationResult
    {
        public List<Station>? Stations { get; set; }
    }

    private class Station
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public double Lat { get; set; }
        public double Lon { get; set; }
        public int CompanyId { get; set; }
        public List<int>? Powers { get; set; }
        public int Filter { get; set; }
        public string? MapPinIconCode { get; set; }
    }
}
