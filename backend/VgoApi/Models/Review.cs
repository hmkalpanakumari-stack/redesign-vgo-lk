namespace VgoApi.Models;

public class Review
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Guid UserId { get; set; }
    public int Rating { get; set; } // 1-5
    public string? Title { get; set; }
    public required string Comment { get; set; }
    public bool IsVerifiedPurchase { get; set; }
    public int HelpfulCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Product Product { get; set; } = null!;
    public User User { get; set; } = null!;
    public ICollection<ReviewImage> Images { get; set; } = new List<ReviewImage>();
}

public class ReviewImage
{
    public Guid Id { get; set; }
    public Guid ReviewId { get; set; }
    public required string Url { get; set; }
    public int SortOrder { get; set; }

    // Navigation properties
    public Review Review { get; set; } = null!;
}
