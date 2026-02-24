namespace VgoApi.Models;

public class Order
{
    public Guid Id { get; set; }
    public required string OrderNumber { get; set; }
    public Guid UserId { get; set; }
    public Guid ShippingAddressId { get; set; }
    public Guid? BillingAddressId { get; set; }
    public Guid ShippingMethodId { get; set; }
    public Guid PaymentMethodId { get; set; }
    public decimal Subtotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Discount { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
    public string? CouponCode { get; set; }
    public required string Status { get; set; } // pending, confirmed, processing, shipped, out_for_delivery, delivered, cancelled, returned, refunded
    public string? TrackingNumber { get; set; }
    public string? Notes { get; set; }
    public DateTime? EstimatedDelivery { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Address ShippingAddress { get; set; } = null!;
    public Address? BillingAddress { get; set; }
    public ShippingMethod ShippingMethod { get; set; } = null!;
    public PaymentMethod PaymentMethod { get; set; } = null!;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
}

public class OrderItem
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public required string ProductName { get; set; }
    public string? ProductImageUrl { get; set; }
    public Guid? VariantId { get; set; }
    public string? VariantName { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }

    // Navigation properties
    public Order Order { get; set; } = null!;
    public Product Product { get; set; } = null!;
    public ProductVariant? Variant { get; set; }
}

public class OrderStatusHistory
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public required string Status { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public Order Order { get; set; } = null!;
}

public class ShippingMethod
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public required string EstimatedDays { get; set; }
    public string? Icon { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}

public class PaymentMethod
{
    public Guid Id { get; set; }
    public required string Type { get; set; } // card, cod, bank, wallet
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public bool IsAvailable { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
