using Microsoft.EntityFrameworkCore;
using VgoApi.Models;

namespace VgoApi.Data;

public class VgoDbContext : DbContext
{
    public VgoDbContext(DbContextOptions<VgoDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<User> Users { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductPrice> ProductPrices { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }
    public DbSet<ProductVariant> ProductVariants { get; set; }
    public DbSet<ProductSpecification> ProductSpecifications { get; set; }
    public DbSet<BulkPrice> BulkPrices { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }
    public DbSet<ShippingMethod> ShippingMethods { get; set; }
    public DbSet<PaymentMethod> PaymentMethods { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
    public DbSet<CouponCategory> CouponCategories { get; set; }
    public DbSet<CouponProduct> CouponProducts { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<ReviewImage> ReviewImages { get; set; }
    public DbSet<WishlistItem> WishlistItems { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Address configuration
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasOne(e => e.Parent)
                .WithMany(c => c.Children)
                .HasForeignKey(e => e.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Product configuration
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasIndex(e => e.Sku).IsUnique();
            entity.HasOne(e => e.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.Property(e => e.Rating).HasPrecision(3, 2);
        });

        // ProductPrice configuration
        modelBuilder.Entity<ProductPrice>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Product)
                .WithMany(p => p.Prices)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.OriginalAmount).HasPrecision(10, 2);
        });

        // ProductImage configuration
        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ProductVariant configuration
        modelBuilder.Entity<ProductVariant>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Sku).IsUnique();
            entity.HasOne(e => e.Product)
                .WithMany(p => p.Variants)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.PriceModifier).HasPrecision(10, 2);
        });

        // ProductSpecification configuration
        modelBuilder.Entity<ProductSpecification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Product)
                .WithMany(p => p.Specifications)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // BulkPrice configuration
        modelBuilder.Entity<BulkPrice>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Product)
                .WithMany(p => p.BulkPrices)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.PricePerUnit).HasPrecision(10, 2);
        });

        // Order configuration
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.OrderNumber).IsUnique();
            entity.HasOne(e => e.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.ShippingAddress)
                .WithMany()
                .HasForeignKey(e => e.ShippingAddressId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.BillingAddress)
                .WithMany()
                .HasForeignKey(e => e.BillingAddressId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.Property(e => e.Subtotal).HasPrecision(10, 2);
            entity.Property(e => e.ShippingCost).HasPrecision(10, 2);
            entity.Property(e => e.Discount).HasPrecision(10, 2);
            entity.Property(e => e.Tax).HasPrecision(10, 2);
            entity.Property(e => e.Total).HasPrecision(10, 2);
        });

        // OrderItem configuration
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.UnitPrice).HasPrecision(10, 2);
            entity.Property(e => e.TotalPrice).HasPrecision(10, 2);
        });

        // OrderStatusHistory configuration
        modelBuilder.Entity<OrderStatusHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Order)
                .WithMany(o => o.StatusHistory)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ShippingMethod configuration
        modelBuilder.Entity<ShippingMethod>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Price).HasPrecision(10, 2);
        });

        // PaymentMethod configuration
        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        // Coupon configuration
        modelBuilder.Entity<Coupon>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.Value).HasPrecision(10, 2);
            entity.Property(e => e.MinOrderAmount).HasPrecision(10, 2);
            entity.Property(e => e.MaxDiscount).HasPrecision(10, 2);
        });

        // CouponCategory configuration
        modelBuilder.Entity<CouponCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Coupon)
                .WithMany(c => c.ApplicableCategories)
                .HasForeignKey(e => e.CouponId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // CouponProduct configuration
        modelBuilder.Entity<CouponProduct>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Coupon)
                .WithMany(c => c.ApplicableProducts)
                .HasForeignKey(e => e.CouponId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Review configuration
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Product)
                .WithMany(p => p.Reviews)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ReviewImage configuration
        modelBuilder.Entity<ReviewImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Review)
                .WithMany(r => r.Images)
                .HasForeignKey(e => e.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // WishlistItem configuration
        modelBuilder.Entity<WishlistItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.ProductId }).IsUnique();
            entity.HasOne(e => e.User)
                .WithMany(u => u.WishlistItems)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Product)
                .WithMany(p => p.WishlistItems)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Notification configuration
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
