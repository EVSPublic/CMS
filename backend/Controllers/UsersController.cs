using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdminPanel.Data;
using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/v1/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly AdminPanelContext _context;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        UserManager<User> userManager,
        AdminPanelContext context,
        ILogger<UsersController> logger)
    {
        _userManager = userManager;
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers([FromQuery] int? brandId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var query = _context.Users.AsQueryable();

            if (brandId.HasValue)
            {
                query = query.Where(u => u.BrandId == brandId.Value);
            }

            var totalCount = await query.CountAsync();
            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserDto
                {
                    Id = u.Id.ToString(),
                    Name = u.Name,
                    Email = u.Email ?? string.Empty,
                    Role = u.Role.ToString(),
                    Status = u.Status.ToString(),
                    BrandAccess = new List<string>(), // TODO: Calculate brand access
                    Permissions = new Dictionary<string, List<string>>(), // TODO: Calculate permissions
                    LastLogin = u.LastLogin,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                users,
                totalCount,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving users");
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving users" } });
        }
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUser(int id)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new { error = new { code = "USER_NOT_FOUND", message = "User not found" } });
            }

            var userDto = new UserDto
            {
                Id = user.Id.ToString(),
                Name = user.Name,
                Email = user.Email ?? string.Empty,
                Role = user.Role.ToString(),
                Status = user.Status.ToString(),
                BrandAccess = new List<string>(), // TODO: Calculate brand access
                Permissions = new Dictionary<string, List<string>>(), // TODO: Calculate permissions
                LastLogin = user.LastLogin,
                CreatedAt = user.CreatedAt
            };

            return Ok(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user {UserId}", id);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while retrieving user" } });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto request)
    {
        try
        {
            // Validate role
            if (!Enum.TryParse<UserRole>(request.Role, true, out var role))
            {
                return BadRequest(new { error = new { code = "INVALID_ROLE", message = "Invalid role specified" } });
            }

            // Validate brand if specified
            if (request.BrandId.HasValue)
            {
                var brandExists = await _context.Brands.AnyAsync(b => b.Id == request.BrandId.Value);
                if (!brandExists)
                {
                    return BadRequest(new { error = new { code = "INVALID_BRAND", message = "Brand not found" } });
                }
            }

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                UserName = request.Email,
                Role = role,
                BrandId = request.BrandId,
                Status = UserStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { error = new { code = "USER_CREATION_FAILED", message = "User creation failed", details = errors } });
            }

            var userDto = new UserDto
            {
                Id = user.Id.ToString(),
                Name = user.Name,
                Email = user.Email ?? string.Empty,
                Role = user.Role.ToString(),
                Status = user.Status.ToString(),
                BrandAccess = new List<string>(), // TODO: Calculate brand access
                Permissions = new Dictionary<string, List<string>>(), // TODO: Calculate permissions
                LastLogin = user.LastLogin,
                CreatedAt = user.CreatedAt
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while creating user" } });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto request)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new { error = new { code = "USER_NOT_FOUND", message = "User not found" } });
            }

            if (!string.IsNullOrEmpty(request.Name))
            {
                user.Name = request.Name;
            }

            if (!string.IsNullOrEmpty(request.Email))
            {
                user.Email = request.Email;
                user.UserName = request.Email;
            }

            if (!string.IsNullOrEmpty(request.Role))
            {
                if (Enum.TryParse<UserRole>(request.Role, true, out var role))
                {
                    user.Role = role;
                }
                else
                {
                    return BadRequest(new { error = new { code = "INVALID_ROLE", message = "Invalid role specified" } });
                }
            }

            if (!string.IsNullOrEmpty(request.Status))
            {
                if (Enum.TryParse<UserStatus>(request.Status, true, out var status))
                {
                    user.Status = status;
                }
                else
                {
                    return BadRequest(new { error = new { code = "INVALID_STATUS", message = "Invalid status specified" } });
                }
            }

            if (request.BrandId.HasValue)
            {
                var brandExists = await _context.Brands.AnyAsync(b => b.Id == request.BrandId.Value);
                if (!brandExists)
                {
                    return BadRequest(new { error = new { code = "INVALID_BRAND", message = "Brand not found" } });
                }
                user.BrandId = request.BrandId.Value;
            }

            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { error = new { code = "USER_UPDATE_FAILED", message = "User update failed", details = errors } });
            }

            var userDto = new UserDto
            {
                Id = user.Id.ToString(),
                Name = user.Name,
                Email = user.Email ?? string.Empty,
                Role = user.Role.ToString(),
                Status = user.Status.ToString(),
                BrandAccess = new List<string>(), // TODO: Calculate brand access
                Permissions = new Dictionary<string, List<string>>(), // TODO: Calculate permissions
                LastLogin = user.LastLogin,
                CreatedAt = user.CreatedAt
            };

            return Ok(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", id);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while updating user" } });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new { error = new { code = "USER_NOT_FOUND", message = "User not found" } });
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { error = new { code = "USER_DELETION_FAILED", message = "User deletion failed", details = errors } });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}", id);
            return StatusCode(500, new { error = new { code = "INTERNAL_ERROR", message = "An error occurred while deleting user" } });
        }
    }
}