using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using AdminPanel.Data;
using AdminPanel.Models;
using AdminPanel.Services;

var builder = WebApplication.CreateBuilder(args);

// Add database context
builder.Services.AddDbContext<AdminPanelContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 21))
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

// Add controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Admin Panel API",
        Version = "v1",
        Description = "Admin panel backend with authentication and multi-brand support"
    });

    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
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
    });
}

app.UseCors("AdminPanelCORS");

app.UseStaticFiles(); // Enable serving static files from wwwroot

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Custom route for media files
app.MapGet("/media/{brandId}/{filename}", (string brandId, string filename, IWebHostEnvironment env) =>
{
    var filePath = Path.Combine(env.WebRootPath, "uploads", brandId, filename);
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
            _ => "application/octet-stream"
        };
        return Results.File(filePath, contentType);
    }
    return Results.NotFound();
});

// Custom route for thumbnails with compression
app.MapGet("/thumbnails/{brandId}/{filename}", (string brandId, string filename, IWebHostEnvironment env) =>
{
    // First try to find actual thumbnail
    var thumbnailPath = Path.Combine(env.WebRootPath, "thumbnails", brandId, filename);
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
    var originalPath = Path.Combine(env.WebRootPath, "uploads", brandId, filename);
    if (File.Exists(originalPath))
    {
        var extension = Path.GetExtension(filename).ToLowerInvariant();

        // For non-image files, return as-is
        if (extension is not (".jpg" or ".jpeg" or ".png" or ".gif" or ".webp"))
        {
            var contentType = extension switch
            {
                ".svg" => "image/svg+xml",
                _ => "application/octet-stream"
            };
            return Results.File(originalPath, contentType);
        }

        try
        {
            // Compress and resize image
            using var originalImage = Image.FromFile(originalPath);

            // Calculate thumbnail size (max 300x300, maintain aspect ratio)
            var maxSize = 300;
            var ratioX = (double)maxSize / originalImage.Width;
            var ratioY = (double)maxSize / originalImage.Height;
            var ratio = Math.Min(ratioX, ratioY);

            var newWidth = (int)(originalImage.Width * ratio);
            var newHeight = (int)(originalImage.Height * ratio);

            using var thumbnail = new Bitmap(newWidth, newHeight);
            using var graphics = Graphics.FromImage(thumbnail);

            // High quality resize
            graphics.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
            graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;

            graphics.DrawImage(originalImage, 0, 0, newWidth, newHeight);

            // Save to memory stream with compression
            using var memoryStream = new MemoryStream();
            var encoder = ImageCodecInfo.GetImageEncoders().FirstOrDefault(c => c.FormatID == ImageFormat.Jpeg.Guid);
            if (encoder != null)
            {
                var encoderParams = new EncoderParameters(1);
                encoderParams.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 80L); // 80% quality
                thumbnail.Save(memoryStream, encoder, encoderParams);
            }
            else
            {
                thumbnail.Save(memoryStream, ImageFormat.Jpeg);
            }
            memoryStream.Position = 0;

            var compressedData = memoryStream.ToArray();
            return Results.File(compressedData, "image/jpeg");
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