namespace VgoApi.Models;

public class User
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; } // male, female, other
    public bool IsVerified { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}

public class Address
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public required string Label { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Phone { get; set; }
    public required string AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public required string City { get; set; }
    public required string District { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public bool IsDefault { get; set; }
    public required string Type { get; set; } // home, office, other
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}

public class WishlistItem
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public DateTime AddedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Product Product { get; set; } = null!;
}

public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public required string Title { get; set; }
    public required string Message { get; set; }
    public required string Type { get; set; } // order, promo, system, wishlist
    public bool IsRead { get; set; }
    public string? Link { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}
