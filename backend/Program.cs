using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;
using SkiaSharp;
using AdminPanel.Data;
using AdminPanel.Models;
using AdminPanel.Services;

var builder = WebApplication.CreateBuilder(args);

// Add database context with connection resilience
builder.Services.AddDbContext<AdminPanelContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 21)),
        mySqlOptions => {
            mySqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(3),
                errorNumbersToAdd: null);
        }
    ));

// Add Identity
builder.Services.AddIdentity<User, IdentityRole<int>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AdminPanelContext>()
.AddDefaultTokenProviders();

// Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey!)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Add services
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AdminPanel.Services.SystemUsage>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Add HttpClient for external API calls
builder.Services.AddHttpClient();

// Add background services
builder.Services.AddHostedService<DatabaseKeepAliveService>();
// Disabled: Station count is now manually managed
// builder.Services.AddHostedService<StationCountUpdateService>();

// Add controllers with camelCase JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Configure form options to allow larger file uploads (for videos)
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 524288000; // 500 MB
    options.ValueLengthLimit = 524288000;
    options.MemoryBufferThreshold = 524288000;
});

// Configure Kestrel server limits for large uploads
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 524288000; // 500 MB
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Admin Panel API",
        Version = "v1",
        Description = "Admin panel backend with authentication and multi-brand support. " +
                      "This API provides comprehensive endpoints for managing brands, users, content, " +
                      "media, announcements, static pages, partnerships, charging stations, and activity logs.",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Admin Panel Team",
            Email = "info@adminpanel.com"
        }
    });

    // Include XML comments for better Swagger documentation
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }

    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below. Example: 'Bearer eyJhbGc...'",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    // Enable annotations
    c.EnableAnnotations();
});

// Add CORS for development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AdminPanelCORS", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    // Rate limit for email sending: 5 requests per minute per IP
    options.AddFixedWindowLimiter("EmailRateLimit", limiterOptions =>
    {
        limiterOptions.PermitLimit = 5;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 0; // No queue, reject immediately
    });

    // Global rejection response
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = 429; // Too Many Requests
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            success = false,
            message = "Too many requests. Please try again later.",
            retryAfter = context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter)
                ? retryAfter.TotalSeconds
                : 60
        }, cancellationToken: token);
    };
});

var app = builder.Build();

// Seed database
if (app.Environment.IsDevelopment())
{
    await DbSeeder.SeedAsync(app.Services);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Admin Panel API V1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "Admin Panel API Documentation";
    });
}

app.UseCors("AdminPanelCORS");

app.UseStaticFiles(); // Enable serving static files from wwwroot

app.UseRateLimiter(); // Enable rate limiting

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Custom route for media files
app.MapGet("/media/{filename}", (string filename, IWebHostEnvironment env) =>
{
    var filePath = Path.Combine(env.WebRootPath, "uploads", filename);
    if (File.Exists(filePath))
    {
        var extension = Path.GetExtension(filename).ToLowerInvariant();
        var contentType = extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".svg" => "image/svg+xml",
            ".mp4" => "video/mp4",
            ".webm" => "video/webm",
            ".ogg" => "video/ogg",
            ".mov" => "video/quicktime",
            ".avi" => "video/x-msvideo",
            ".mkv" => "video/x-matroska",
            _ => "application/octet-stream"
        };
        return Results.File(filePath, contentType);
    }
    return Results.NotFound();
});

// Custom route for thumbnails with compression
app.MapGet("/thumbnails/{filename}", (string filename, IWebHostEnvironment env) =>
{
    // First try to find actual thumbnail
    var thumbnailPath = Path.Combine(env.WebRootPath, "thumbnails", filename);
    if (File.Exists(thumbnailPath))
    {
        var extension = Path.GetExtension(filename).ToLowerInvariant();
        var contentType = extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".svg" => "image/svg+xml",
            _ => "application/octet-stream"
        };
        return Results.File(thumbnailPath, contentType);
    }

    // Fallback to original image with compression
    var originalPath = Path.Combine(env.WebRootPath, "uploads", filename);
    if (File.Exists(originalPath))
    {
        var extension = Path.GetExtension(filename).ToLowerInvariant();

        // For non-image files (videos, etc.), return as-is
        if (extension is not (".jpg" or ".jpeg" or ".png" or ".gif" or ".webp"))
        {
            var contentType = extension switch
            {
                ".svg" => "image/svg+xml",
                ".mp4" => "video/mp4",
                ".webm" => "video/webm",
                ".ogg" => "video/ogg",
                ".mov" => "video/quicktime",
                ".avi" => "video/x-msvideo",
                ".mkv" => "video/x-matroska",
                _ => "application/octet-stream"
            };
            return Results.File(originalPath, contentType);
        }

        try
        {
            // Load and compress image with SkiaSharp
            using var inputStream = File.OpenRead(originalPath);
            using var originalBitmap = SKBitmap.Decode(inputStream);

            if (originalBitmap == null)
                throw new InvalidOperationException("Could not decode image");

            // Calculate thumbnail size (max 300x300, maintain aspect ratio)
            var maxSize = 300;
            var ratioX = (double)maxSize / originalBitmap.Width;
            var ratioY = (double)maxSize / originalBitmap.Height;
            var ratio = Math.Min(ratioX, ratioY);

            var newWidth = (int)(originalBitmap.Width * ratio);
            var newHeight = (int)(originalBitmap.Height * ratio);

            // Create resized bitmap
            using var resizedBitmap = originalBitmap.Resize(new SKImageInfo(newWidth, newHeight), SKSamplingOptions.Default);
            using var image = SKImage.FromBitmap(resizedBitmap);

            // Encode as JPEG with compression
            using var data = image.Encode(SKEncodedImageFormat.Jpeg, 80); // 80% quality

            return Results.File(data.ToArray(), "image/jpeg");
        }
        catch
        {
            // If compression fails, return original
            var contentType = extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };
            return Results.File(originalPath, contentType);
        }
    }

    return Results.NotFound();
});

app.Run();