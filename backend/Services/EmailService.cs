using MailKit.Net.Smtp;
using MimeKit;
using System.Text.Json;
using AdminPanel.Data;
using AdminPanel.Models;
using Microsoft.EntityFrameworkCore;

namespace AdminPanel.Services;

public interface IEmailService
{
    Task<bool> SendEmailAsync(int brandId, string toEmail, string toName, string subject, string message, string? replyToEmail = null);
}

public class EmailService : IEmailService
{
    private readonly AdminPanelContext _context;
    private readonly ILogger<EmailService> _logger;

    public EmailService(AdminPanelContext context, ILogger<EmailService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<bool> SendEmailAsync(int brandId, string toEmail, string toName, string subject, string message, string? replyToEmail = null)
    {
        try
        {
            // Get email configuration from contact page content
            var contactPage = await _context.ContentPages
                .Where(c => c.BrandId == brandId && c.PageType == PageType.Contact)
                .FirstOrDefaultAsync();

            if (contactPage == null)
            {
                _logger.LogError("Contact page not found for brand {BrandId}", brandId);
                return false;
            }

            // Parse the content to get email config
            var content = JsonSerializer.Deserialize<JsonElement>(contactPage.Content);

            if (!content.TryGetProperty("contactForm", out var contactForm) ||
                !contactForm.TryGetProperty("emailConfig", out var emailConfig))
            {
                _logger.LogError("Email configuration not found in contact page for brand {BrandId}", brandId);
                return false;
            }

            // Extract SMTP settings
            var smtpHost = emailConfig.GetProperty("smtpHost").GetString();
            var smtpPortStr = emailConfig.GetProperty("smtpPort").GetString();
            var smtpUsername = emailConfig.GetProperty("smtpUsername").GetString();
            var smtpPassword = emailConfig.GetProperty("smtpPassword").GetString();
            var smtpSecurityType = emailConfig.TryGetProperty("smtpSecurityType", out var secType)
                ? secType.GetString()
                : "StartTls"; // Default to StartTls for backward compatibility

            if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword))
            {
                _logger.LogError("SMTP configuration is incomplete for brand {BrandId}", brandId);
                return false;
            }

            if (!int.TryParse(smtpPortStr, out var smtpPort))
            {
                smtpPort = 587; // Default SMTP port
            }

            // Parse security type
            var secureSocketOptions = smtpSecurityType switch
            {
                "None" => MailKit.Security.SecureSocketOptions.None,
                "Auto" => MailKit.Security.SecureSocketOptions.Auto,
                "SslOnConnect" => MailKit.Security.SecureSocketOptions.SslOnConnect,
                "StartTls" => MailKit.Security.SecureSocketOptions.StartTls,
                "StartTlsWhenAvailable" => MailKit.Security.SecureSocketOptions.StartTlsWhenAvailable,
                _ => MailKit.Security.SecureSocketOptions.StartTls // Default
            };

            // Get brand name for from address
            var brand = await _context.Brands.FindAsync(brandId);
            var fromName = brand?.Name ?? "Admin Panel";

            // Create email message
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(fromName, smtpUsername));
            email.To.Add(new MailboxAddress(toName, toEmail));
            email.Subject = subject;

            // Set reply-to if provided
            if (!string.IsNullOrEmpty(replyToEmail))
            {
                email.ReplyTo.Add(new MailboxAddress("", replyToEmail));
            }

            // Create email body
            var bodyBuilder = new BodyBuilder
            {
                TextBody = message,
                HtmlBody = $"<div style='font-family: Arial, sans-serif;'>{message.Replace("\n", "<br>")}</div>"
            };
            email.Body = bodyBuilder.ToMessageBody();

            // Send email
            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(smtpHost, smtpPort, secureSocketOptions);
            await smtp.AuthenticateAsync(smtpUsername, smtpPassword);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

            _logger.LogInformation("Email sent successfully to {ToEmail} for brand {BrandId}", toEmail, brandId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {ToEmail} for brand {BrandId}", toEmail, brandId);
            return false;
        }
    }
}