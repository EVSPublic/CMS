using System.ComponentModel.DataAnnotations;

namespace AdminPanel.DTOs;

public class SendEmailDto
{
    [Required]
    [EmailAddress]
    public string ToEmail { get; set; } = string.Empty;

    [Required]
    public string ToName { get; set; } = string.Empty;

    [Required]
    public string Subject { get; set; } = string.Empty;

    [Required]
    public string Message { get; set; } = string.Empty;

    [EmailAddress]
    public string? ReplyToEmail { get; set; }

    [Required]
    public int BrandId { get; set; }
}

public class EmailResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}