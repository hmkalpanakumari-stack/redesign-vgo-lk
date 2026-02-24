namespace VgoApi.Models;

public class Product
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public required string Description { get; set; }
    public string? ShortDescription { get; set; }
    public Guid CategoryId { get; set; }
    public string? SubCategory { get; set; }
    public string? Brand { get; set; }
    public int Stock { get; set; }
    public required string Sku { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsNew { get; set; }
    public bool IsOnSale { get; set; }
    public bool IsBestSeller { get; set; }
    public string? Warranty { get; set; }
    public string? DeliveryInfo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Category Category { get; set; } = null!;
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    public ICollection<ProductSpecification> Specifications { get; set; } = new List<ProductSpecification>();
    public ICollection<ProductPrice> Prices { get; set; } = new List<ProductPrice>();
    public ICollection<BulkPrice> BulkPrices { get; set; } = new List<BulkPrice>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
}

public class ProductPrice
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public decimal Amount { get; set; }
    public decimal? OriginalAmount { get; set; }
    public required string Currency { get; set; }
    public int? DiscountPercentage { get; set; }
    public bool IsActive { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime? ValidUntil { get; set; }

    // Navigation properties
    public Product Product { get; set; } = null!;
}

public class ProductImage
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public required string Url { get; set; }
    public required string AltText { get; set; }
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Product Product { get; set; } = null!;
}

public class ProductVariant
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public required string Name { get; set; }
    public required string Type { get; set; } // color, size, storage, material, other
    public required string Value { get; set; }
    public string? ColorCode { get; set; }
    public decimal PriceModifier { get; set; }
    public int Stock { get; set; }
    public required string Sku { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Product Product { get; set; } = null!;
}

public class ProductSpecification
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public required string Label { get; set; }
    public required string Value { get; set; }
    public string? GroupName { get; set; }
    public int SortOrder { get; set; }

    // Navigation properties
    public Product Product { get; set; } = null!;
}

public class BulkPrice
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public int MinQuantity { get; set; }
    public int? MaxQuantity { get; set; }
    public decimal PricePerUnit { get; set; }

    // Navigation properties
    public Product Product { get; set; } = null!;
}
