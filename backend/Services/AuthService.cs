using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Services;

public class AuthService : IAuthService
{
    private readonly AdminPanelDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(AdminPanelDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        try
        {
            var user = await GetUserByEmailAsync(request.Email);
            
            if (user == null || !await ValidatePasswordAsync(request.Password, user.PasswordHash))
            {
                return null;
            }

            if (user.Status != "active")
            {
                return null;
            }

            var token = await GenerateJwtTokenAsync(user);
            await UpdateLastLoginAsync(user.Id);

            return new LoginResponse
            {
                AccessToken = token,
                RefreshToken = GenerateRefreshToken(),
                ExpiresIn = int.Parse(_configuration["JwtSettings:ExpirationMinutes"] ?? "60") * 60,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role,
                    BrandAccess = user.BrandAccess,
                    Permissions = user.Permissions,
                    LastLogin = user.LastLogin,
                    Status = user.Status,
                    CreatedAt = user.CreatedAt
                },
                Permissions = user.Permissions
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user {Email}", request.Email);
            return null;
        }
    }

    public async Task<LoginResponse?> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            // In a real implementation, you would validate the refresh token
            // For now, we'll just return null to indicate invalid token
            // You would typically store refresh tokens in database and validate them
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return null;
        }
    }

    public async Task<string> GenerateJwtTokenAsync(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT secret key not configured");
        var key = Encoding.ASCII.GetBytes(secretKey);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role),
            new("brand_access", string.Join(",", user.BrandAccess))
        };

        // Add permission claims
        foreach (var brandPermissions in user.Permissions)
        {
            foreach (var permission in brandPermissions.Value)
            {
                claims.Add(new Claim($"permission", $"{brandPermissions.Key}:{permission}"));
            }
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpirationMinutes"] ?? "60")),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    public async Task<bool> ValidatePasswordAsync(string password, string hash)
    {
        return await Task.FromResult(BCrypt.Net.BCrypt.Verify(password, hash));
    }

    public async Task<string> HashPasswordAsync(string password)
    {
        return await Task.FromResult(BCrypt.Net.BCrypt.HashPassword(password));
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserByIdAsync(string id)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequest request)
    {
        try
        {
            var user = await GetUserByIdAsync(userId);
            if (user == null)
                return false;

            if (!await ValidatePasswordAsync(request.CurrentPassword, user.PasswordHash))
                return false;

            user.PasswordHash = await HashPasswordAsync(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password for user {UserId}", userId);
            return false;
        }
    }

    public async Task<User?> UpdateProfileAsync(string userId, ProfileUpdateRequest request)
    {
        try
        {
            var user = await GetUserByIdAsync(userId);
            if (user == null)
                return null;

            user.Name = request.Name;
            user.Email = request.Email;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile for user {UserId}", userId);
            return null;
        }
    }

    public async Task UpdateLastLoginAsync(string userId)
    {
        try
        {
            var user = await GetUserByIdAsync(userId);
            if (user != null)
            {
                user.LastLogin = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating last login for user {UserId}", userId);
        }
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}