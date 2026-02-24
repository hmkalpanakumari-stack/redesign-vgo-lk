using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VgoApi.Data;
using VgoApi.DTOs;
using VgoApi.Models;

namespace VgoApi.Endpoints;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1").WithTags("Orders");

        // Get user orders
        group.MapGet("/orders", async (
            HttpContext context,
            VgoDbContext db,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] string? status = null) =>
        {
            var userIdClaim = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Results.Unauthorized();
            }

            var query = db.Orders
                .Include(o => o.Items)
                .Include(o => o.ShippingAddress)
                .Include(o => o.ShippingMethod)
                .Include(o => o.PaymentMethod)
                .Include(o => o.StatusHistory)
                .Where(o => o.UserId == userId);

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(o => o.Status == status);
            }

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)limit);

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            var orderDtos = orders.Select(MapToOrderDto).ToList();

            var response = new PaginationResponse<OrderDto>(
                orderDtos,
                total,
                page,
                limit,
                totalPages,
                page < totalPages,
                page > 1
            );

            return Results.Ok(new ApiResponse<PaginationResponse<OrderDto>>(true, response));
        })
        .RequireAuthorization()
        .WithName("GetOrders")
        .WithOpenApi();

        // Get order by ID
        group.MapGet("/orders/{id:guid}", async (Guid id, HttpContext context, VgoDbContext db) =>
        {
            var userIdClaim = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Results.Unauthorized();
            }

            var order = await db.Orders
                .Include(o => o.Items)
                .Include(o => o.ShippingAddress)
                .Include(o => o.BillingAddress)
                .Include(o => o.ShippingMethod)
                .Include(o => o.PaymentMethod)
                .Include(o => o.StatusHistory)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order == null)
            {
                return Results.NotFound(new ApiResponse<object>(false, null, "Order not found"));
            }

            var orderDto = MapToOrderDto(order);
            return Results.Ok(new ApiResponse<OrderDto>(true, orderDto));
        })
        .RequireAuthorization()
        .WithName("GetOrderById")
        .WithOpenApi();

        // Create order
        group.MapPost("/orders", async (
            [FromBody] CreateOrderRequest request,
            HttpContext context,
            VgoDbContext db) =>
        {
            var userIdClaim = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Results.Unauthorized();
            }

            // Create order
            var order = new Order
            {
                Id = Guid.NewGuid(),
                OrderNumber = GenerateOrderNumber(),
                UserId = userId,
                ShippingAddressId = request.ShippingAddressId,
                BillingAddressId = request.BillingAddressId ?? request.ShippingAddressId,
                ShippingMethodId = request.ShippingMethodId,
                PaymentMethodId = request.PaymentMethodId,
                CouponCode = request.CouponCode,
                Notes = request.Notes,
                Status = "pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Calculate totals (simplified - should include proper price calculation)
            decimal subtotal = 0;
            foreach (var item in request.Items)
            {
                var product = await db.Products
                    .Include(p => p.Prices.Where(pr => pr.IsActive))
                    .FirstOrDefaultAsync(p => p.Id == item.ProductId);

                if (product == null) continue;

                var price = product.Prices.FirstOrDefault(p => p.IsActive)?.Amount ?? 0;
                var totalPrice = price * item.Quantity;
                subtotal += totalPrice;

                order.Items.Add(new OrderItem
                {
                    Id = Guid.NewGuid(),
                    ProductId = item.ProductId,
                    ProductName = product.Name,
                    ProductImageUrl = product.Images.FirstOrDefault()?.Url,
                    VariantId = item.VariantId,
                    Quantity = item.Quantity,
                    UnitPrice = price,
                    TotalPrice = totalPrice
                });
            }

            var shippingMethod = await db.ShippingMethods.FindAsync(request.ShippingMethodId);
            order.Subtotal = subtotal;
            order.ShippingCost = shippingMethod?.Price ?? 0;
            order.Discount = 0; // Apply coupon logic here
            order.Tax = 0;
            order.Total = order.Subtotal + order.ShippingCost - order.Discount + order.Tax;

            // Add status history
            order.StatusHistory.Add(new OrderStatusHistory
            {
                Id = Guid.NewGuid(),
                Status = "pending",
                CreatedAt = DateTime.UtcNow
            });

            db.Orders.Add(order);
            await db.SaveChangesAsync();

            // Load related data for response
            await db.Entry(order).Reference(o => o.ShippingAddress).LoadAsync();
            await db.Entry(order).Reference(o => o.ShippingMethod).LoadAsync();
            await db.Entry(order).Reference(o => o.PaymentMethod).LoadAsync();

            var orderDto = MapToOrderDto(order);
            return Results.Created($"/api/v1/orders/{order.Id}", 
                new ApiResponse<OrderDto>(true, orderDto));
        })
        .RequireAuthorization()
        .WithName("CreateOrder")
        .WithOpenApi();

        // Get shipping methods
        group.MapGet("/shipping-methods", async (VgoDbContext db) =>
        {
            var methods = await db.ShippingMethods
                .Where(m => m.IsActive)
                .ToListAsync();

            var methodDtos = methods.Select(m => new ShippingMethodDto(
                m.Id, m.Name, m.Description, m.Price, m.EstimatedDays, m.Icon
            )).ToList();

            return Results.Ok(new ApiResponse<List<ShippingMethodDto>>(true, methodDtos));
        })
        .WithName("GetShippingMethods")
        .WithOpenApi();

        // Get payment methods
        group.MapGet("/payment-methods", async (VgoDbContext db) =>
        {
            var methods = await db.PaymentMethods
                .Where(m => m.IsAvailable)
                .ToListAsync();

            var methodDtos = methods.Select(m => new PaymentMethodDto(
                m.Id, m.Type, m.Name, m.Description, m.Icon, m.IsAvailable
            )).ToList();

            return Results.Ok(new ApiResponse<List<PaymentMethodDto>>(true, methodDtos));
        })
        .WithName("GetPaymentMethods")
        .WithOpenApi();
    }

    private static OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto(
            order.Id,
            order.OrderNumber,
            order.Items.Select(i => new OrderItemDto(
                i.Id, i.ProductId, i.ProductName, i.ProductImageUrl,
                i.VariantId, i.VariantName, i.Quantity, i.UnitPrice, i.TotalPrice
            )).ToList(),
            MapToAddressDto(order.ShippingAddress),
            order.BillingAddress != null ? MapToAddressDto(order.BillingAddress) : null,
            new ShippingMethodDto(order.ShippingMethod.Id, order.ShippingMethod.Name, 
                order.ShippingMethod.Description, order.ShippingMethod.Price, 
                order.ShippingMethod.EstimatedDays, order.ShippingMethod.Icon),
            new PaymentMethodDto(order.PaymentMethod.Id, order.PaymentMethod.Type, 
                order.PaymentMethod.Name, order.PaymentMethod.Description, 
                order.PaymentMethod.Icon, order.PaymentMethod.IsAvailable),
            order.Subtotal,
            order.ShippingCost,
            order.Discount,
            order.Tax,
            order.Total,
            order.CouponCode,
            order.Status,
            order.StatusHistory.Select(h => new OrderStatusHistoryDto(h.Status, h.Note, h.CreatedAt)).ToList(),
            order.TrackingNumber,
            order.Notes,
            order.EstimatedDelivery,
            order.CreatedAt,
            order.UpdatedAt
        );
    }

    private static AddressDto MapToAddressDto(Address address)
    {
        return new AddressDto(
            address.Id, address.Label, address.FirstName, address.LastName,
            address.Phone, address.AddressLine1, address.AddressLine2,
            address.City, address.District, address.PostalCode, address.Country,
            address.IsDefault, address.Type
        );
    }

    private static string GenerateOrderNumber()
    {
        return $"VGO-{DateTime.UtcNow:yyyy}-{Random.Shared.Next(100000, 999999)}";
    }
}
