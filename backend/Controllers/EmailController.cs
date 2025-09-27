using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AdminPanel.DTOs;
using AdminPanel.Services;

namespace AdminPanel.Controllers;

[ApiController]
[Route("api/v1/email")]
[Authorize]
public class EmailController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailController> _logger;

    public EmailController(IEmailService emailService, ILogger<EmailController> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] SendEmailDto request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new EmailResponseDto
                {
                    Success = false,
                    Message = "Invalid request data"
                });
            }

            var success = await _emailService.SendEmailAsync(
                request.BrandId,
                request.ToEmail,
                request.ToName,
                request.Subject,
                request.Message,
                request.ReplyToEmail
            );

            return Ok(new EmailResponseDto
            {
                Success = success,
                Message = success ? "Email sent successfully" : "Failed to send email"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email");
            return StatusCode(500, new EmailResponseDto
            {
                Success = false,
                Message = "Internal server error"
            });
        }
    }

    [HttpPost("test/{brandId}")]
    public async Task<IActionResult> TestEmailConfig(int brandId)
    {
        try
        {
            // Send a test email to the same SMTP username (sender)
            var success = await _emailService.SendEmailAsync(
                brandId,
                "test@example.com", // This will be replaced with actual sender email in service
                "Test Recipient",
                "Email Configuration Test",
                "This is a test email to verify your SMTP configuration is working correctly."
            );

            return Ok(new EmailResponseDto
            {
                Success = success,
                Message = success ? "Test email sent successfully" : "Failed to send test email"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing email configuration for brand {BrandId}", brandId);
            return StatusCode(500, new EmailResponseDto
            {
                Success = false,
                Message = "Internal server error"
            });
        }
    }
}