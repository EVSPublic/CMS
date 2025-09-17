using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AdminPanel.DTOs;
using AdminPanel.Services;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/admin/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<LoginResponse>.Failure(
                    "INVALID_INPUT", 
                    "Invalid input data",
                    ModelState));
            }

            var loginResponse = await _authService.LoginAsync(request);
            
            if (loginResponse == null)
            {
                return Unauthorized(ApiResponse<LoginResponse>.Failure(
                    "INVALID_CREDENTIALS", 
                    "Invalid email or password"));
            }

            return Ok(ApiResponse<LoginResponse>.Success(loginResponse));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email {Email}", request.Email);
            return StatusCode(500, ApiResponse<LoginResponse>.Failure(
                "INTERNAL_ERROR", 
                "An error occurred during login"));
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public ActionResult<ApiResponse<object>> Logout()
    {
        // In a real implementation, you would invalidate the token
        // For now, we'll just return success
        return Ok(ApiResponse<object>.Success(new { message = "Logged out successfully" }));
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<LoginResponse>.Failure(
                    "INVALID_INPUT", 
                    "Invalid input data",
                    ModelState));
            }

            var loginResponse = await _authService.RefreshTokenAsync(request.RefreshToken);
            
            if (loginResponse == null)
            {
                return Unauthorized(ApiResponse<LoginResponse>.Failure(
                    "INVALID_REFRESH_TOKEN", 
                    "Invalid or expired refresh token"));
            }

            return Ok(ApiResponse<LoginResponse>.Success(loginResponse));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return StatusCode(500, ApiResponse<LoginResponse>.Failure(
                "INTERNAL_ERROR", 
                "An error occurred during token refresh"));
        }
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetProfile()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<UserDto>.Failure(
                    "AUTH_REQUIRED", 
                    "Authentication required"));
            }

            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(ApiResponse<UserDto>.Failure(
                    "USER_NOT_FOUND", 
                    "User not found"));
            }

            var userDto = new UserDto
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
            };

            return Ok(ApiResponse<UserDto>.Success(userDto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting profile for user");
            return StatusCode(500, ApiResponse<UserDto>.Failure(
                "INTERNAL_ERROR", 
                "An error occurred while getting profile"));
        }
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserDto>>> UpdateProfile([FromBody] ProfileUpdateRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<UserDto>.Failure(
                    "INVALID_INPUT", 
                    "Invalid input data",
                    ModelState));
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<UserDto>.Failure(
                    "AUTH_REQUIRED", 
                    "Authentication required"));
            }

            var user = await _authService.UpdateProfileAsync(userId, request);
            if (user == null)
            {
                return NotFound(ApiResponse<UserDto>.Failure(
                    "USER_NOT_FOUND", 
                    "User not found"));
            }

            var userDto = new UserDto
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
            };

            return Ok(ApiResponse<UserDto>.Success(userDto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile");
            return StatusCode(500, ApiResponse<UserDto>.Failure(
                "INTERNAL_ERROR", 
                "An error occurred while updating profile"));
        }
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<object>.Failure(
                    "INVALID_INPUT", 
                    "Invalid input data",
                    ModelState));
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<object>.Failure(
                    "AUTH_REQUIRED", 
                    "Authentication required"));
            }

            var success = await _authService.ChangePasswordAsync(userId, request);
            if (!success)
            {
                return BadRequest(ApiResponse<object>.Failure(
                    "INVALID_PASSWORD", 
                    "Current password is incorrect"));
            }

            return Ok(ApiResponse<object>.Success(new { message = "Password changed successfully" }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing password");
            return StatusCode(500, ApiResponse<object>.Failure(
                "INTERNAL_ERROR", 
                "An error occurred while changing password"));
        }
    }
}