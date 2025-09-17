using AdminPanel.DTOs;
using AdminPanel.Models;

namespace AdminPanel.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<LoginResponse?> RefreshTokenAsync(string refreshToken);
    Task<string> GenerateJwtTokenAsync(User user);
    Task<bool> ValidatePasswordAsync(string password, string hash);
    Task<string> HashPasswordAsync(string password);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByIdAsync(string id);
    Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequest request);
    Task<User?> UpdateProfileAsync(string userId, ProfileUpdateRequest request);
    Task UpdateLastLoginAsync(string userId);
}