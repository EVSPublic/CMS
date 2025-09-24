using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AdminPanel.Models;

namespace AdminPanel.Data;

public class AdminPanelContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public AdminPanelContext(DbContextOptions<AdminPanelContext> options) : base(options)
    {
    }

    public DbSet<Brand> Brands { get; set; }
    public DbSet<ContentPage> ContentPages { get; set; }
    public DbSet<StaticPage> StaticPages { get; set; }
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<Partnership> Partnerships { get; set; }
    public DbSet<MediaFile> MediaFiles { get; set; }
    public DbSet<MediaItem> MediaItems { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Brand entity
        builder.Entity<Brand>(entity =>
        {
            entity.HasIndex(e => e.Name).IsUnique();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
        });

        // Configure User entity
        builder.Entity<User>(entity =>
        {
            entity.Property(e => e.Role).HasConversion<string>();
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Brand)
                .WithMany(e => e.Users)
                .HasForeignKey(e => e.BrandId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure ContentPage entity
        builder.Entity<ContentPage>(entity =>
        {
            entity.HasIndex(e => new { e.BrandId, e.PageType }).IsUnique();
            entity.Property(e => e.PageType).HasConversion<string>();
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Brand)
                .WithMany(e => e.ContentPages)
                .HasForeignKey(e => e.BrandId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Creator)
                .WithMany(e => e.CreatedContentPages)
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Updater)
                .WithMany(e => e.UpdatedContentPages)
                .HasForeignKey(e => e.UpdatedBy)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure StaticPage entity
        builder.Entity<StaticPage>(entity =>
        {
            entity.HasIndex(e => new { e.BrandId, e.Slug }).IsUnique();
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Brand)
                .WithMany(e => e.StaticPages)
                .HasForeignKey(e => e.BrandId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Creator)
                .WithMany(e => e.CreatedStaticPages)
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Updater)
                .WithMany(e => e.UpdatedStaticPages)
                .HasForeignKey(e => e.UpdatedBy)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure Announcement entity
        builder.Entity<Announcement>(entity =>
        {
            entity.Property(e => e.Type).HasConversion<string>();
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Brand)
                .WithMany(e => e.Announcements)
                .HasForeignKey(e => e.BrandId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Creator)
                .WithMany(e => e.CreatedAnnouncements)
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Updater)
                .WithMany(e => e.UpdatedAnnouncements)
                .HasForeignKey(e => e.UpdatedBy)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure Partnership entity
        builder.Entity<Partnership>(entity =>
        {
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Brand)
                .WithMany(e => e.Partnerships)
                .HasForeignKey(e => e.BrandId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Creator)
                .WithMany(e => e.CreatedPartnerships)
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Updater)
                .WithMany(e => e.UpdatedPartnerships)
                .HasForeignKey(e => e.UpdatedBy)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure MediaFile entity
        builder.Entity<MediaFile>(entity =>
        {
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Brand)
                .WithMany(e => e.MediaFiles)
                .HasForeignKey(e => e.BrandId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Creator)
                .WithMany(e => e.UploadedMediaFiles)
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Seed initial data
        builder.Entity<Brand>().HasData(
            new Brand { Id = 1, Name = "Ovolt", Domain = "ovolt.com" },
            new Brand { Id = 2, Name = "Sharz.net", Domain = "sharz.net" }
        );
    }
}