namespace VgoApi.Models;

public class Coupon
{
    public Guid Id { get; set; }
    public required string Code { get; set; }
    public required string Type { get; set; } // percentage, fixed
    public decimal Value { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public decimal? MaxDiscount { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
    public int? UsageLimit { get; set; }
    public int UsageCount { get; set; }
    public bool IsActive { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<CouponCategory> ApplicableCategories { get; set; } = new List<CouponCategory>();
    public ICollection<CouponProduct> ApplicableProducts { get; set; } = new List<CouponProduct>();
}

public class CouponCategory
{
    public Guid Id { get; set; }
    public Guid CouponId { get; set; }
    public Guid CategoryId { get; set; }

    // Navigation properties
    public Coupon Coupon { get; set; } = null!;
    public Category Category { get; set; } = null!;
}

public class CouponProduct
{
    public Guid Id { get; set; }
    public Guid CouponId { get; set; }
    public Guid ProductId { get; set; }

    // Navigation properties
    public Coupon Coupon { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
