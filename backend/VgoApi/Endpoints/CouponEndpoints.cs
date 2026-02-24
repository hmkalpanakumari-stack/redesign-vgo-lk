using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VgoApi.Data;
using VgoApi.DTOs;

namespace VgoApi.Endpoints;

public static class CouponEndpoints
{
    public static void MapCouponEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1/coupons").WithTags("Coupons");

        // Validate coupon
        group.MapPost("/validate", async (
            [FromBody] ValidateCouponRequest request,
            VgoDbContext db) =>
        {
            var coupon = await db.Coupons
                .Include(c => c.ApplicableCategories)
                .FirstOrDefaultAsync(c => c.Code.ToUpper() == request.Code.ToUpper());

            if (coupon == null)
            {
                return Results.Ok(new ApiResponse<CouponValidationResponse>(true,
                    new CouponValidationResponse(false, null, "Invalid coupon code", null)));
            }

            if (!coupon.IsActive)
            {
                return Results.Ok(new ApiResponse<CouponValidationResponse>(true,
                    new CouponValidationResponse(false, null, "This coupon is no longer active", null)));
            }

            var now = DateTime.UtcNow;
            if (coupon.ValidFrom > now)
            {
                return Results.Ok(new ApiResponse<CouponValidationResponse>(true,
                    new CouponValidationResponse(false, null, "This coupon is not yet valid", null)));
            }

            if (coupon.ValidUntil < now)
            {
                return Results.Ok(new ApiResponse<CouponValidationResponse>(true,
                    new CouponValidationResponse(false, null, "This coupon has expired", null)));
            }

            if (coupon.UsageLimit.HasValue && coupon.UsageCount >= coupon.UsageLimit.Value)
            {
                return Results.Ok(new ApiResponse<CouponValidationResponse>(true,
                    new CouponValidationResponse(false, null, "This coupon has reached its usage limit", null)));
            }

            if (coupon.MinOrderAmount.HasValue && request.CartTotal < coupon.MinOrderAmount.Value)
            {
                return Results.Ok(new ApiResponse<CouponValidationResponse>(true,
                    new CouponValidationResponse(false, null,
                        $"Minimum order amount is Rs. {coupon.MinOrderAmount.Value:N0}", null)));
            }

            // Calculate discount
            decimal discount;
            if (coupon.Type == "percentage")
            {
                discount = Math.Round(request.CartTotal * (coupon.Value / 100), 2);
                if (coupon.MaxDiscount.HasValue)
                {
                    discount = Math.Min(discount, coupon.MaxDiscount.Value);
                }
            }
            else
            {
                discount = coupon.Value;
            }

            var couponDto = new CouponDto(
                coupon.Id,
                coupon.Code,
                coupon.Type,
                coupon.Value,
                coupon.MinOrderAmount,
                coupon.MaxDiscount,
                coupon.Description,
                coupon.ValidUntil
            );

            return Results.Ok(new ApiResponse<CouponValidationResponse>(true,
                new CouponValidationResponse(true, couponDto, null, discount)));
        })
        .WithName("ValidateCoupon")
        .WithOpenApi();

        // Get active coupons
        group.MapGet("/active", async (VgoDbContext db) =>
        {
            var now = DateTime.UtcNow;
            var coupons = await db.Coupons
                .Where(c => c.IsActive
                    && c.ValidFrom <= now
                    && c.ValidUntil >= now
                    && (!c.UsageLimit.HasValue || c.UsageCount < c.UsageLimit.Value))
                .ToListAsync();

            var couponDtos = coupons.Select(c => new CouponDto(
                c.Id, c.Code, c.Type, c.Value, c.MinOrderAmount,
                c.MaxDiscount, c.Description, c.ValidUntil
            )).ToList();

            return Results.Ok(new ApiResponse<List<CouponDto>>(true, couponDtos));
        })
        .WithName("GetActiveCoupons")
        .WithOpenApi();
    }
}
