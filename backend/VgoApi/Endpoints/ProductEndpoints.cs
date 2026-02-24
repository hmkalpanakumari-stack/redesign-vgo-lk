using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VgoApi.Data;
using VgoApi.DTOs;
using VgoApi.Models;

namespace VgoApi.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1/products").WithTags("Products");

        // Get all products with filtering and pagination
        group.MapGet("/", async (
            VgoDbContext db,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 20,
            [FromQuery] string? sort = "newest",
            [FromQuery] string? category = null,
            [FromQuery] string? brand = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] bool? inStock = null,
            [FromQuery] bool? onSale = null,
            [FromQuery] string? search = null) =>
        {
            var query = db.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Prices.Where(pr => pr.IsActive))
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(p => p.Category.Slug == category);
            }

            if (!string.IsNullOrEmpty(brand))
            {
                query = query.Where(p => p.Brand == brand);
            }

            if (inStock == true)
            {
                query = query.Where(p => p.Stock > 0);
            }

            if (onSale == true)
            {
                query = query.Where(p => p.IsOnSale);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));
            }

            // Apply sorting
            query = sort?.ToLower() switch
            {
                "price-low-high" => query.OrderBy(p => p.Prices.FirstOrDefault(pr => pr.IsActive)!.Amount),
                "price-high-low" => query.OrderByDescending(p => p.Prices.FirstOrDefault(pr => pr.IsActive)!.Amount),
                "rating" => query.OrderByDescending(p => p.Rating),
                "best-selling" => query.OrderByDescending(p => p.IsBestSeller).ThenByDescending(p => p.ReviewCount),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)limit);

            var products = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            var productDtos = products.Select(p => MapToProductDto(p)).ToList();

            var response = new PaginationResponse<ProductDto>(
                productDtos,
                total,
                page,
                limit,
                totalPages,
                page < totalPages,
                page > 1
            );

            return Results.Ok(new ApiResponse<PaginationResponse<ProductDto>>(true, response));
        })
        .WithName("GetProducts")
        .WithOpenApi();

        // Get product by ID
        group.MapGet("/{id:guid}", async (Guid id, VgoDbContext db) =>
        {
            var product = await db.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .Include(p => p.Specifications)
                .Include(p => p.BulkPrices)
                .Include(p => p.Prices.Where(pr => pr.IsActive))
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return Results.NotFound(new ApiResponse<object>(false, null, "Product not found"));
            }

            var productDto = MapToProductDto(product);
            return Results.Ok(new ApiResponse<ProductDto>(true, productDto));
        })
        .WithName("GetProductById")
        .WithOpenApi();

        // Get product by slug
        group.MapGet("/slug/{slug}", async (string slug, VgoDbContext db) =>
        {
            var product = await db.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Variants)
                .Include(p => p.Specifications)
                .Include(p => p.BulkPrices)
                .Include(p => p.Prices.Where(pr => pr.IsActive))
                .FirstOrDefaultAsync(p => p.Slug == slug);

            if (product == null)
            {
                return Results.NotFound(new ApiResponse<object>(false, null, "Product not found"));
            }

            var productDto = MapToProductDto(product);
            return Results.Ok(new ApiResponse<ProductDto>(true, productDto));
        })
        .WithName("GetProductBySlug")
        .WithOpenApi();

        // Get featured products
        group.MapGet("/featured", async (VgoDbContext db, [FromQuery] int limit = 10) =>
        {
            var products = await db.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Prices.Where(pr => pr.IsActive))
                .Where(p => p.IsFeatured)
                .OrderByDescending(p => p.CreatedAt)
                .Take(limit)
                .ToListAsync();

            var productDtos = products.Select(p => MapToProductDto(p)).ToList();
            return Results.Ok(new ApiResponse<List<ProductDto>>(true, productDtos));
        })
        .WithName("GetFeaturedProducts")
        .WithOpenApi();
    }

    private static ProductDto MapToProductDto(Product product)
    {
        var activePrice = product.Prices.FirstOrDefault(p => p.IsActive);
        var priceDto = activePrice != null
            ? new PriceDto(
                activePrice.Amount,
                activePrice.OriginalAmount,
                activePrice.Currency,
                activePrice.DiscountPercentage
            )
            : new PriceDto(0, null, "Rs.", null);

        return new ProductDto(
            product.Id,
            product.Name,
            product.Slug,
            product.Description,
            product.ShortDescription,
            priceDto,
            product.Images.Select(i => new ProductImageDto(i.Id, i.Url, i.AltText, i.IsPrimary)).ToList(),
            new CategoryDto(product.Category.Id, product.Category.Name, product.Category.Slug, 
                product.Category.Description, product.Category.ImageUrl, product.Category.Icon, 
                product.Category.ProductCount),
            product.SubCategory,
            product.Brand,
            product.Variants.Select(v => new ProductVariantDto(v.Id, v.Name, v.Type, v.Value, 
                v.ColorCode, v.PriceModifier, v.Stock, v.Sku)).ToList(),
            product.Specifications.Select(s => new ProductSpecificationDto(s.Label, s.Value, s.GroupName)).ToList(),
            product.BulkPrices.Select(b => new BulkPriceDto(b.MinQuantity, b.MaxQuantity, b.PricePerUnit)).ToList(),
            product.Stock,
            product.Sku,
            product.Rating,
            product.ReviewCount,
            product.IsFeatured,
            product.IsNew,
            product.IsOnSale,
            product.IsBestSeller,
            product.Warranty,
            product.DeliveryInfo,
            product.CreatedAt,
            product.UpdatedAt
        );
    }
}
