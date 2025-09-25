using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public bool RememberMe { get; set; } = false;
}

public class LoginResponseDto
{
    public bool Ok { get; set; } = true;
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
    public UserDto User { get; set; } = null!;
    public Dictionary<string, List<string>> Permissions { get; set; } = new();
}

public class RefreshTokenRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<string> BrandAccess { get; set; } = new();
    public Dictionary<string, List<string>> Permissions { get; set; } = new();
    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateUserDto
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;

    public int? BrandId { get; set; }
}

public class UpdateUserDto
{
    [MaxLength(255)]
    public string? Name { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    public string? Role { get; set; }

    public string? Status { get; set; }

    public int? BrandId { get; set; }
}

public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string NewPassword { get; set; } = string.Empty;
}