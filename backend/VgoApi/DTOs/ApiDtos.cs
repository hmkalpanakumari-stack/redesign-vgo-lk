namespace VgoApi.DTOs;

// Common DTOs
public record ApiResponse<T>(bool Success, T? Data, string? Error = null);

public record PaginationResponse<T>(
    IEnumerable<T> Data,
    int Total,
    int Page,
    int Limit,
    int TotalPages,
    bool HasNext,
    bool HasPrev
);

// Auth DTOs
public record LoginRequest(string Email, string Password, bool RememberMe = false);
public record RegisterRequest(
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    string Password,
    string ConfirmPassword
);

public record AuthResponse(UserDto User, string Token);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    string? AvatarUrl,
    DateTime? DateOfBirth,
    string? Gender,
    bool IsVerified,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

// Product DTOs
public record ProductDto(
    Guid Id,
    string Name,
    string Slug,
    string Description,
    string? ShortDescription,
    PriceDto Price,
    List<ProductImageDto> Images,
    CategoryDto Category,
    string? SubCategory,
    string? Brand,
    List<ProductVariantDto>? Variants,
    List<ProductSpecificationDto>? Specifications,
    List<BulkPriceDto>? BulkPrices,
    int Stock,
    string Sku,
    decimal Rating,
    int ReviewCount,
    bool IsFeatured,
    bool IsNew,
    bool IsOnSale,
    bool IsBestSeller,
    string? Warranty,
    string? DeliveryInfo,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record PriceDto(
    decimal Amount,
    decimal? OriginalAmount,
    string Currency,
    int? DiscountPercentage
);

public record ProductImageDto(
    Guid Id,
    string Url,
    string AltText,
    bool IsPrimary
);

public record ProductVariantDto(
    Guid Id,
    string Name,
    string Type,
    string Value,
    string? ColorCode,
    decimal PriceModifier,
    int Stock,
    string Sku
);

public record ProductSpecificationDto(
    string Label,
    string Value,
    string? GroupName
);

public record BulkPriceDto(
    int MinQuantity,
    int? MaxQuantity,
    decimal PricePerUnit
);

// Category DTOs
public record CategoryDto(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    string? ImageUrl,
    string? Icon,
    int ProductCount,
    List<CategoryDto>? Children = null
);

// Order DTOs
public record CreateOrderRequest(
    List<OrderItemRequest> Items,
    Guid ShippingAddressId,
    Guid? BillingAddressId,
    Guid ShippingMethodId,
    Guid PaymentMethodId,
    string? CouponCode,
    string? Notes
);

public record OrderItemRequest(
    Guid ProductId,
    Guid? VariantId,
    int Quantity
);

public record OrderDto(
    Guid Id,
    string OrderNumber,
    List<OrderItemDto> Items,
    AddressDto ShippingAddress,
    AddressDto? BillingAddress,
    ShippingMethodDto ShippingMethod,
    PaymentMethodDto PaymentMethod,
    decimal Subtotal,
    decimal ShippingCost,
    decimal Discount,
    decimal Tax,
    decimal Total,
    string? CouponCode,
    string Status,
    List<OrderStatusHistoryDto> StatusHistory,
    string? TrackingNumber,
    string? Notes,
    DateTime? EstimatedDelivery,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record OrderItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    string? ProductImageUrl,
    Guid? VariantId,
    string? VariantName,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice
);

public record OrderStatusHistoryDto(
    string Status,
    string? Note,
    DateTime CreatedAt
);

public record AddressDto(
    Guid Id,
    string Label,
    string FirstName,
    string LastName,
    string Phone,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string District,
    string PostalCode,
    string Country,
    bool IsDefault,
    string Type
);

public record CreateAddressRequest(
    string Label,
    string FirstName,
    string LastName,
    string Phone,
    string AddressLine1,
    string? AddressLine2,
    string City,
    string District,
    string PostalCode,
    string Country,
    bool IsDefault,
    string Type
);

public record ShippingMethodDto(
    Guid Id,
    string Name,
    string? Description,
    decimal Price,
    string EstimatedDays,
    string? Icon
);

public record PaymentMethodDto(
    Guid Id,
    string Type,
    string Name,
    string? Description,
    string? Icon,
    bool IsAvailable
);

// Coupon DTOs
public record ValidateCouponRequest(
    string Code,
    decimal CartTotal,
    string? CategorySlug = null
);

public record CouponValidationResponse(
    bool IsValid,
    CouponDto? Coupon,
    string? Error,
    decimal? Discount
);

public record CouponDto(
    Guid Id,
    string Code,
    string Type,
    decimal Value,
    decimal? MinOrderAmount,
    decimal? MaxDiscount,
    string? Description,
    DateTime ValidUntil
);

// Review DTOs
public record CreateReviewRequest(
    int Rating,
    string? Title,
    string Comment,
    List<string>? Images
);

public record ReviewDto(
    Guid Id,
    Guid ProductId,
    Guid UserId,
    string UserName,
    string? UserAvatar,
    int Rating,
    string? Title,
    string Comment,
    List<string>? Images,
    bool IsVerifiedPurchase,
    int HelpfulCount,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record ReviewSummaryDto(
    decimal AverageRating,
    int TotalReviews,
    Dictionary<int, int> Distribution
);
