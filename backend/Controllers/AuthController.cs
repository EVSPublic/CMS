using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;
using AdminPanel.Services;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly JwtService _jwtService;
    private readonly AdminPanelContext _context;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        JwtService jwtService,
        AdminPanelContext context,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _context = context;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return Unauthorized(new { error = new { code = "INVALID_CREDENTIALS", message = "Invalid email or password" } });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
            {
                return Unauthorized(new { error = new { code = "INVALID_CREDENTIALS", message = "Invalid email or password" } });
            }

            if (user.Status != UserStatus.Active)
            {
                return Unauthorized(new { error = new { code = "ACCOUNT_INACTIVE", message = "Account is inactive" } });
            }

            // Update last login
            user.LastLogin = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            var token = _jwtService.GenerateToken(user);

            // Get user's brand access and permissions
            var brandAccess = new List<string>();
            var permissions = new Dictionary<string, List<string>>();

            if (user.Role == UserRole.Admin)
            {
                // Admin has access to all brands
                var allBrands = await _context.Brands.Select(b => b.Name).ToListAsync();
                brandAccess = allBrands;
                foreach (var brand in allBrands)
                {
                    permissions[brand] = new List<string> { "read", "write", "delete" };
                }
            }
            else if (user.BrandId.HasValue)
            {
                // User has access to specific brand
                var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Id == user.BrandId.Value);
                if (brand != null)
                {
                    brandAccess.Add(brand.Name);
                    var userPermissions = user.Role == UserRole.Editor
                        ? new List<string> { "read", "write" }
                        : new List<string> { "read" };
                    permissions[brand.Name] = userPermissions;
                }
            }

            var response = new LoginResponseDto
            {
                Ok = true,
                AccessToken = token,
                RefreshToken = "", // TODO: Implement refresh tokens
                ExpiresIn = 3600, // 1 hour in seconds
                User = new UserDto
                {
                    Id = user.Id.ToString(),
                    Name = user.Name,
                    Email = user.Email ?? string.Empty,
                    Role = user.Role.ToString(),
                    Status = user.Status.ToString(),
                    BrandAccess = brandAccess,
                    Permissions = permissions,
                    LastLogin = user.LastLogin,
                    CreatedAt = user.CreatedAt
                },
                Permissions = permissions
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", request.Email);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred during login" } });
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        // For JWT, logout is handled client-side by removing the token
        // In a production app, you might want to maintain a blacklist of tokens
        await _signInManager.SignOutAsync();
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            // Get user's brand access and permissions
            var brandAccess = new List<string>();
            var permissions = new Dictionary<string, List<string>>();

            if (user.Role == UserRole.Admin)
            {
                // Admin has access to all brands
                var allBrands = await _context.Brands.Select(b => b.Name).ToListAsync();
                brandAccess = allBrands;
                foreach (var brand in allBrands)
                {
                    permissions[brand] = new List<string> { "read", "write", "delete" };
                }
            }
            else if (user.BrandId.HasValue)
            {
                // User has access to specific brand
                var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Id == user.BrandId.Value);
                if (brand != null)
                {
                    brandAccess.Add(brand.Name);
                    var userPermissions = user.Role == UserRole.Editor
                        ? new List<string> { "read", "write" }
                        : new List<string> { "read" };
                    permissions[brand.Name] = userPermissions;
                }
            }

            var userDto = new UserDto
            {
                Id = user.Id.ToString(),
                Name = user.Name,
                Email = user.Email ?? string.Empty,
                Role = user.Role.ToString(),
                Status = user.Status.ToString(),
                BrandAccess = brandAccess,
                Permissions = permissions,
                LastLogin = user.LastLogin,
                CreatedAt = user.CreatedAt
            };

            return Ok(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving current user");
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving user information" } });
        }
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
    {
        try
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { error = new { code = "PASSWORD_CHANGE_FAILED", message = "Password change failed", details = errors } });
            }

            return Ok(new { message = "Password changed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password for user");
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while changing password" } });
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
    {
        // For now, return unauthorized as refresh tokens are not fully implemented
        // TODO: Implement proper refresh token logic
        return Unauthorized(new { error = new { code = "REFRESH_TOKEN_INVALID", message = "Refresh token is invalid" } });
    }
}