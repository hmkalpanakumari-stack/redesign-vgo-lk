using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VgoApi.Data;
using VgoApi.DTOs;
using VgoApi.Models;

namespace VgoApi.Endpoints;

public static class ReviewEndpoints
{
    public static void MapReviewEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Reviews");

        // Get product reviews
        group.MapGet("/products/{productId:guid}/reviews", async (
            Guid productId,
            VgoDbContext db,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] string? sort = "newest") =>
        {
            var query = db.Reviews
                .Include(r => r.User)
                .Include(r => r.Images)
                .Where(r => r.ProductId == productId);

            query = sort?.ToLower() switch
            {
                "highest-rating" => query.OrderByDescending(r => r.Rating).ThenByDescending(r => r.CreatedAt),
                "lowest-rating" => query.OrderBy(r => r.Rating).ThenByDescending(r => r.CreatedAt),
                "most-helpful" => query.OrderByDescending(r => r.HelpfulCount).ThenByDescending(r => r.CreatedAt),
                _ => query.OrderByDescending(r => r.CreatedAt)
            };

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)limit);

            var reviews = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            var reviewDtos = reviews.Select(MapToReviewDto).ToList();

            // Get review summary
            var allReviews = await db.Reviews.Where(r => r.ProductId == productId).ToListAsync();
            var summary = new ReviewSummaryDto(
                allReviews.Any() ? (decimal)allReviews.Average(r => r.Rating) : 0,
                allReviews.Count,
                new Dictionary<int, int>
                {
                    { 5, allReviews.Count(r => r.Rating == 5) },
                    { 4, allReviews.Count(r => r.Rating == 4) },
                    { 3, allReviews.Count(r => r.Rating == 3) },
                    { 2, allReviews.Count(r => r.Rating == 2) },
                    { 1, allReviews.Count(r => r.Rating == 1) }
                }
            );

            var response = new
            {
                reviews = new PaginationResponse<ReviewDto>(
                    reviewDtos,
                    total,
                    page,
                    limit,
                    totalPages,
                    page < totalPages,
                    page > 1
                ),
                summary
            };

            return Results.Ok(new ApiResponse<object>(true, response));
        })
        .WithName("GetProductReviews")
        .WithOpenApi();

        // Create review
        group.MapPost("/products/{productId:guid}/reviews", async (
            Guid productId,
            [FromBody] CreateReviewRequest request,
            HttpContext context,
            VgoDbContext db) =>
        {
            var userIdClaim = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Results.Unauthorized();
            }

            // Check if product exists
            var product = await db.Products.FindAsync(productId);
            if (product == null)
            {
                return Results.NotFound(new ApiResponse<object>(false, null, "Product not found"));
            }

            // Check if user already reviewed this product
            var existingReview = await db.Reviews
                .FirstOrDefaultAsync(r => r.ProductId == productId && r.UserId == userId);
            if (existingReview != null)
            {
                return Results.BadRequest(new ApiResponse<object>(false, null, 
                    "You have already reviewed this product"));
            }

            // Create review
            var review = new Review
            {
                Id = Guid.NewGuid(),
                ProductId = productId,
                UserId = userId,
                Rating = request.Rating,
                Title = request.Title,
                Comment = request.Comment,
                IsVerifiedPurchase = false, // Should check if user purchased this product
                HelpfulCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            if (request.Images != null && request.Images.Any())
            {
                var sortOrder = 0;
                foreach (var imageUrl in request.Images)
                {
                    review.Images.Add(new ReviewImage
                    {
                        Id = Guid.NewGuid(),
                        Url = imageUrl,
                        SortOrder = sortOrder++
                    });
                }
            }

            db.Reviews.Add(review);
            await db.SaveChangesAsync();

            // Update product rating
            var allReviews = await db.Reviews.Where(r => r.ProductId == productId).ToListAsync();
            product.Rating = (decimal)allReviews.Average(r => r.Rating);
            product.ReviewCount = allReviews.Count;
            await db.SaveChangesAsync();

            // Load user for response
            await db.Entry(review).Reference(r => r.User).LoadAsync();

            var reviewDto = MapToReviewDto(review);
            return Results.Created($"/api/v1/reviews/{review.Id}", 
                new ApiResponse<ReviewDto>(true, reviewDto));
        })
        .RequireAuthorization()
        .WithName("CreateReview")
        .WithOpenApi();

        // Mark review as helpful
        group.MapPut("/reviews/{reviewId:guid}/helpful", async (
            Guid reviewId,
            VgoDbContext db) =>
        {
            var review = await db.Reviews.FindAsync(reviewId);
            if (review == null)
            {
                return Results.NotFound(new ApiResponse<object>(false, null, "Review not found"));
            }

            review.HelpfulCount++;
            await db.SaveChangesAsync();

            return Results.Ok(new ApiResponse<object>(true, new { helpfulCount = review.HelpfulCount }));
        })
        .RequireAuthorization()
        .WithName("MarkReviewHelpful")
        .WithOpenApi();
    }

    private static ReviewDto MapToReviewDto(Review review)
    {
        return new ReviewDto(
            review.Id,
            review.ProductId,
            review.UserId,
            $"{review.User.FirstName} {review.User.LastName}",
            review.User.AvatarUrl,
            review.Rating,
            review.Title,
            review.Comment,
            review.Images.Select(i => i.Url).ToList(),
            review.IsVerifiedPurchase,
            review.HelpfulCount,
            review.CreatedAt,
            review.UpdatedAt
        );
    }
}
