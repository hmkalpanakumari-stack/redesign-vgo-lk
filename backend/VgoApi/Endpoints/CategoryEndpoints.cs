using Microsoft.EntityFrameworkCore;
using VgoApi.Data;
using VgoApi.DTOs;
using VgoApi.Models;

namespace VgoApi.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1/categories").WithTags("Categories");

        // Get all categories
        group.MapGet("/", async (VgoDbContext db) =>
        {
            var categories = await db.Categories
                .Where(c => c.ParentId == null)
                .Include(c => c.Children)
                .ToListAsync();

            var categoryDtos = categories.Select(c => MapToCategoryDto(c, true)).ToList();
            return Results.Ok(new ApiResponse<List<CategoryDto>>(true, categoryDtos));
        })
        .WithName("GetCategories")
        .WithOpenApi();

        // Get category by ID
        group.MapGet("/{id:guid}", async (Guid id, VgoDbContext db) =>
        {
            var category = await db.Categories
                .Include(c => c.Children)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return Results.NotFound(new ApiResponse<object>(false, null, "Category not found"));
            }

            var categoryDto = MapToCategoryDto(category, true);
            return Results.Ok(new ApiResponse<CategoryDto>(true, categoryDto));
        })
        .WithName("GetCategoryById")
        .WithOpenApi();

        // Get category by slug
        group.MapGet("/slug/{slug}", async (string slug, VgoDbContext db) =>
        {
            var category = await db.Categories
                .Include(c => c.Children)
                .FirstOrDefaultAsync(c => c.Slug == slug);

            if (category == null)
            {
                return Results.NotFound(new ApiResponse<object>(false, null, "Category not found"));
            }

            var categoryDto = MapToCategoryDto(category, true);
            return Results.Ok(new ApiResponse<CategoryDto>(true, categoryDto));
        })
        .WithName("GetCategoryBySlug")
        .WithOpenApi();
    }

    private static CategoryDto MapToCategoryDto(Category category, bool includeChildren = false)
    {
        var children = includeChildren && category.Children.Any()
            ? category.Children.Select(c => MapToCategoryDto(c, false)).ToList()
            : null;

        return new CategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.Description,
            category.ImageUrl,
            category.Icon,
            category.ProductCount,
            children
        );
    }
}
