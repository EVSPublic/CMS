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
    public DbSet<MediaFolder> MediaFolders { get; set; }
    public DbSet<MediaItemFolder> MediaItemFolders { get; set; }
    public DbSet<Station> Stations { get; set; }
    public DbSet<Charger> Chargers { get; set; }

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
            // entity.Property(e => e.Type).HasConversion<string>(); // Type property doesn't exist in Announcement model
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

        // Configure MediaItem entity
        builder.Entity<MediaItem>(entity =>
        {
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Brand)
                .WithMany()
                .HasForeignKey(e => e.BrandId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Creator)
                .WithMany()
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Updater)
                .WithMany()
                .HasForeignKey(e => e.UpdatedBy)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure MediaFolder entity
        builder.Entity<MediaFolder>(entity =>
        {
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
            entity.HasIndex(e => new { e.BrandId, e.Name }).IsUnique();

            entity.HasOne(e => e.Brand)
                .WithMany()
                .HasForeignKey(e => e.BrandId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure MediaItemFolder entity (Many-to-Many relationship)
        builder.Entity<MediaItemFolder>(entity =>
        {
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasIndex(e => new { e.MediaItemId, e.MediaFolderId }).IsUnique();

            entity.HasOne(e => e.MediaItem)
                .WithMany(e => e.MediaItemFolders)
                .HasForeignKey(e => e.MediaItemId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.MediaFolder)
                .WithMany(e => e.MediaItemFolders)
                .HasForeignKey(e => e.MediaFolderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Station entity
        builder.Entity<Station>(entity =>
        {
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
        });

        // Configure Charger entity
        builder.Entity<Charger>(entity =>
        {
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Station)
                .WithMany(e => e.Chargers)
                .HasForeignKey(e => e.StationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed initial data
        builder.Entity<Brand>().HasData(
            new Brand { Id = 1, Name = "Ovolt", Domain = "ovolt.com" },
            new Brand { Id = 2, Name = "Sharz.net", Domain = "sharz.net" }
        );

        // Seed default media folders for each brand
        builder.Entity<MediaFolder>().HasData(
            // Ovolt folders
            new MediaFolder { Id = 1, BrandId = 1, Name = "Logos", Description = "Brand logos and variations" },
            new MediaFolder { Id = 2, BrandId = 1, Name = "Backgrounds", Description = "Background images and textures" },
            new MediaFolder { Id = 3, BrandId = 1, Name = "Icons", Description = "Icons and small graphics" },
            new MediaFolder { Id = 4, BrandId = 1, Name = "Content Images", Description = "General content images" },
            // Sharz.net folders
            new MediaFolder { Id = 5, BrandId = 2, Name = "Logos", Description = "Brand logos and variations" },
            new MediaFolder { Id = 6, BrandId = 2, Name = "Backgrounds", Description = "Background images and textures" },
            new MediaFolder { Id = 7, BrandId = 2, Name = "Icons", Description = "Icons and small graphics" },
            new MediaFolder { Id = 8, BrandId = 2, Name = "Content Images", Description = "General content images" }
        );
    }
}