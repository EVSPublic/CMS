using AdminPanel.Data;
using Microsoft.EntityFrameworkCore;

namespace AdminPanel.Services;

public class DatabaseKeepAliveService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DatabaseKeepAliveService> _logger;
    private readonly TimeSpan _pingInterval = TimeSpan.FromMinutes(5);

    public DatabaseKeepAliveService(
        IServiceProvider serviceProvider,
        ILogger<DatabaseKeepAliveService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Database Keep-Alive Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await Task.Delay(_pingInterval, stoppingToken);

                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AdminPanelContext>();

                // Simple query to keep connection alive
                await context.Database.ExecuteSqlRawAsync("SELECT 1", stoppingToken);

                _logger.LogDebug("Database connection keep-alive ping successful");
            }
            catch (OperationCanceledException)
            {
                // Service is stopping, this is expected
                break;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Database keep-alive ping failed, will retry in {Interval}", _pingInterval);
            }
        }

        _logger.LogInformation("Database Keep-Alive Service stopped");
    }
}
