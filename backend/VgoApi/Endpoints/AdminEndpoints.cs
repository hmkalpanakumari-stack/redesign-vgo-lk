using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VgoApi.Data;
using VgoApi.DTOs;
using VgoApi.Models;
using VgoApi.Services;

namespace VgoApi.Endpoints;

public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1/admin").WithTags("Admin");

        // Admin login
        group.MapPost("/login", (
            [FromBody] AdminLoginRequest request,
            IConfiguration config,
            IJwtService jwtService) =>
        {
            var adminEmail = config["Admin:Email"] ?? "admin@vgo.lk";
            var adminPassword = config["Admin:Password"] ?? "Admin@123";

            if (request.Email != adminEmail || request.Password != adminPassword)
                return Results.Unauthorized();

            var token = jwtService.GenerateAdminToken(adminEmail, "Admin");
            return Results.Ok(new ApiResponse<AuthResponse>(true,
                new AuthResponse(
                    new UserDto(Guid.Empty, adminEmail, "Admin", "Panel", null, null, null, null, true, DateTime.UtcNow, DateTime.UtcNow),
                    token
                )));
        })
        .WithName("AdminLogin")
        .WithOpenApi();

        // Dashboard stats
        group.MapGet("/stats", async (VgoDbContext db) =>
        {
            var totalOrders = await db.Orders.CountAsync();
            var totalUsers = await db.Users.CountAsync();
            var totalProducts = await db.Products.CountAsync();
            var totalRevenue = await db.Orders
                .Where(o => o.Status != "cancelled")
                .SumAsync(o => (decimal?)o.Total) ?? 0;
            var pendingOrders = await db.Orders.CountAsync(o => o.Status == "pending");
            var processingOrders = await db.Orders.CountAsync(o => o.Status == "processing");

            var stats = new AdminStatsDto(totalOrders, totalUsers, totalProducts, totalRevenue, pendingOrders, processingOrders);
            return Results.Ok(new ApiResponse<AdminStatsDto>(true, stats));
        })
        .RequireAuthorization("Admin")
        .WithName("AdminStats")
        .WithOpenApi();

        // List all orders
        group.MapGet("/orders", async (
            VgoDbContext db,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 20,
            [FromQuery] string? status = null,
            [FromQuery] string? search = null) =>
        {
            var query = db.Orders
                .Include(o => o.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(o => o.Status == status);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(o => o.OrderNumber.Contains(search) ||
                    o.User.Email.Contains(search) ||
                    (o.User.FirstName + " " + o.User.LastName).Contains(search));

            var total = await query.CountAsync();
            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(o => new AdminOrderDto(
                    o.Id, o.OrderNumber,
                    o.User.FirstName + " " + o.User.LastName,
                    o.User.Email, o.Total, o.Status,
                    o.Items.Count, o.CreatedAt))
                .ToListAsync();

            var response = new PaginationResponse<AdminOrderDto>(orders, total, page, limit,
                (int)Math.Ceiling(total / (double)limit), page * limit < total, page > 1);

            return Results.Ok(new ApiResponse<PaginationResponse<AdminOrderDto>>(true, response));
        })
        .RequireAuthorization("Admin")
        .WithName("AdminGetOrders")
        .WithOpenApi();

        // Get single order detail
        group.MapGet("/orders/{id:guid}", async (Guid id, VgoDbContext db) =>
        {
            var order = await db.Orders
                .Include(o => o.Items)
                .Include(o => o.ShippingAddress)
                .Include(o => o.ShippingMethod)
                .Include(o => o.PaymentMethod)
                .Include(o => o.StatusHistory)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return Results.NotFound(new ApiResponse<object>(false, null, "Order not found"));

            return Results.Ok(new ApiResponse<OrderDto>(true, MapOrderDetail(order)));
        })
        .RequireAuthorization("Admin")
        .WithName("AdminGetOrderById")
        .WithOpenApi();

        // Update order status
        group.MapPatch("/orders/{id:guid}/status", async (
            Guid id,
            [FromBody] UpdateOrderStatusRequest request,
            VgoDbContext db) =>
        {
            var exists = await db.Orders.AnyAsync(o => o.Id == id);
            if (!exists)
                return Results.NotFound(new ApiResponse<object>(false, null, "Order not found"));

            var now = DateTime.UtcNow;
            var status = request.Status;

            await db.Database.ExecuteSqlInterpolatedAsync(
                $@"UPDATE ""Orders"" SET ""Status"" = {status}, ""UpdatedAt"" = {now} WHERE ""Id"" = {id}");

            var historyId = Guid.NewGuid();
            var note = request.Note;
            await db.Database.ExecuteSqlInterpolatedAsync(
                $@"INSERT INTO ""OrderStatusHistories"" (""Id"", ""OrderId"", ""Status"", ""Note"", ""CreatedAt"")
                   VALUES ({historyId}, {id}, {status}, {note}, {now})");

            return Results.Ok(new ApiResponse<object>(true, new { status }));
        })
        .RequireAuthorization("Admin")
        .WithName("AdminUpdateOrderStatus")
        .WithOpenApi();

        // Update product status/flags
        group.MapPatch("/products/{id:guid}/status", async (
            Guid id,
            [FromBody] UpdateProductStatusRequest request,
            VgoDbContext db) =>
        {
            var exists = await db.Products.AnyAsync(p => p.Id == id);
            if (!exists)
                return Results.NotFound(new ApiResponse<object>(false, null, "Product not found"));

            var now = DateTime.UtcNow;
            var isFeatured = request.IsFeatured;
            var isNew = request.IsNew;
            var isOnSale = request.IsOnSale;
            var isBestSeller = request.IsBestSeller;

            if (request.Stock.HasValue)
            {
                var stock = request.Stock.Value;
                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"UPDATE ""Products"" SET ""IsFeatured"" = {isFeatured}, ""IsNew"" = {isNew},
                       ""IsOnSale"" = {isOnSale}, ""IsBestSeller"" = {isBestSeller},
                       ""Stock"" = {stock}, ""UpdatedAt"" = {now} WHERE ""Id"" = {id}");
            }
            else
            {
                await db.Database.ExecuteSqlInterpolatedAsync(
                    $@"UPDATE ""Products"" SET ""IsFeatured"" = {isFeatured}, ""IsNew"" = {isNew},
                       ""IsOnSale"" = {isOnSale}, ""IsBestSeller"" = {isBestSeller},
                       ""UpdatedAt"" = {now} WHERE ""Id"" = {id}");
            }

            return Results.Ok(new ApiResponse<object>(true, new { id }));
        })
        .RequireAuthorization("Admin")
        .WithName("AdminUpdateProductStatus")
        .WithOpenApi();

        // List products (admin)
        group.MapGet("/products", async (
            VgoDbContext db,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 20,
            [FromQuery] string? search = null,
            [FromQuery] string? category = null) =>
        {
            var query = db.Products
                .Include(p => p.Category)
                .Include(p => p.Prices.Where(pr => pr.IsActive))
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                var s = search.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(s) || p.Sku.ToLower().Contains(s));
            }

            if (!string.IsNullOrEmpty(category))
                query = query.Where(p => p.Category.Slug == category);

            var total = await query.CountAsync();
            var products = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(p => new AdminProductListDto(
                    p.Id, p.Name, p.Slug, p.Brand, p.Category.Name, p.Stock,
                    p.Prices.FirstOrDefault(pr => pr.IsActive) != null
                        ? p.Prices.FirstOrDefault(pr => pr.IsActive)!.Amount : 0,
                    p.IsOnSale, p.IsFeatured, p.IsNew, p.IsBestSeller, p.CreatedAt))
                .ToListAsync();

            var response = new PaginationResponse<AdminProductListDto>(products, total, page, limit,
                (int)Math.Ceiling(total / (double)limit), page * limit < total, page > 1);

            return Results.Ok(new ApiResponse<PaginationResponse<AdminProductListDto>>(true, response));
        })
        .RequireAuthorization("Admin")
        .WithName("AdminGetProducts")
        .WithOpenApi();

        // Create product
        group.MapPost("/products", async (
            [FromBody] CreateProductRequest request,
            VgoDbContext db) =>
        {
            var category = await db.Categories.FindAsync(request.CategoryId);
            if (category == null)
                return Results.BadRequest(new ApiResponse<object>(false, null, "Category not found"));

            if (await db.Products.AnyAsync(p => p.Slug == request.Slug))
                return Results.Conflict(new ApiResponse<object>(false, null, "Slug already exists"));

            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Slug = request.Slug,
                Description = request.Description,
                ShortDescription = request.ShortDescription,
                CategoryId = request.CategoryId,
                SubCategory = request.SubCategory,
                Brand = request.Brand,
                Sku = request.Sku,
                Stock = request.Stock,
                IsFeatured = request.IsFeatured,
                IsNew = request.IsNew,
                IsOnSale = request.IsOnSale,
                IsBestSeller = request.IsBestSeller,
                Warranty = request.Warranty,
                DeliveryInfo = request.DeliveryInfo,
                Rating = 0,
                ReviewCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            product.Prices.Add(new ProductPrice
            {
                Id = Guid.NewGuid(),
                Amount = request.Price,
                OriginalAmount = request.OriginalPrice,
                Currency = "LKR",
                DiscountPercentage = request.OriginalPrice.HasValue && request.OriginalPrice > 0
                    ? (int)Math.Round((1 - request.Price / request.OriginalPrice.Value) * 100)
                    : null,
                IsActive = true,
                ValidFrom = DateTime.UtcNow
            });

            if (!string.IsNullOrEmpty(request.ImageUrl))
            {
                product.Images.Add(new ProductImage
                {
                    Id = Guid.NewGuid(),
                    Url = request.ImageUrl,
                    AltText = request.Name,
                    IsPrimary = true,
                    SortOrder = 0,
                    CreatedAt = DateTime.UtcNow
                });
            }

            db.Products.Add(product);
            await db.SaveChangesAsync();

            return Results.Created($"/api/v1/products/{product.Id}",
                new ApiResponse<object>(true, new { id = product.Id, slug = product.Slug }));
        })
        .RequireAuthorization("Admin")
        .WithName("AdminCreateProduct")
        .WithOpenApi();

        // List users
        group.MapGet("/users", async (
            VgoDbContext db,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 20,
            [FromQuery] string? search = null) =>
        {
            var query = db.Users.AsQueryable();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(u => u.Email.Contains(search) ||
                    (u.FirstName + " " + u.LastName).Contains(search));

            var total = await query.CountAsync();
            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(u => new AdminUserDto(
                    u.Id, u.Email, u.FirstName, u.LastName, u.Phone,
                    u.IsVerified, u.Orders.Count(), u.CreatedAt))
                .ToListAsync();

            var response = new PaginationResponse<AdminUserDto>(users, total, page, limit,
                (int)Math.Ceiling(total / (double)limit), page * limit < total, page > 1);

            return Results.Ok(new ApiResponse<PaginationResponse<AdminUserDto>>(true, response));
        })
        .RequireAuthorization("Admin")
        .WithName("AdminGetUsers")
        .WithOpenApi();

        // Get user detail
        group.MapGet("/users/{id:guid}", async (Guid id, VgoDbContext db) =>
        {
            var user = await db.Users
                .Include(u => u.Orders)
                    .ThenInclude(o => o.Items)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return Results.NotFound(new ApiResponse<object>(false, null, "User not found"));

            var userDto = new UserDto(user.Id, user.Email, user.FirstName, user.LastName,
                user.Phone, user.AvatarUrl, user.DateOfBirth, user.Gender,
                user.IsVerified, user.CreatedAt, user.UpdatedAt);

            var orderDtos = user.Orders
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new AdminOrderDto(
                    o.Id, o.OrderNumber,
                    user.FirstName + " " + user.LastName,
                    user.Email, o.Total, o.Status,
                    o.Items.Count, o.CreatedAt))
                .ToList();

            var totalSpent = user.Orders
                .Where(o => o.Status != "cancelled")
                .Sum(o => o.Total);

            var detail = new AdminUserDetailDto(userDto, orderDtos, orderDtos.Count, totalSpent);
            return Results.Ok(new ApiResponse<AdminUserDetailDto>(true, detail));
        })
        .RequireAuthorization("Admin")
        .WithName("AdminGetUserDetail")
        .WithOpenApi();
    }

    private static OrderDto MapOrderDetail(Order order)
    {
        static AddressDto MapAddr(Address a) => new(
            a.Id, a.Label, a.FirstName, a.LastName, a.Phone,
            a.AddressLine1, a.AddressLine2, a.City, a.District,
            a.PostalCode, a.Country, a.IsDefault, a.Type);

        return new OrderDto(
            order.Id, order.OrderNumber,
            order.Items.Select(i => new OrderItemDto(
                i.Id, i.ProductId, i.ProductName, i.ProductImageUrl,
                i.VariantId, i.VariantName, i.Quantity, i.UnitPrice, i.TotalPrice)).ToList(),
            MapAddr(order.ShippingAddress),
            order.BillingAddress != null ? MapAddr(order.BillingAddress) : null,
            new ShippingMethodDto(order.ShippingMethod.Id, order.ShippingMethod.Name,
                order.ShippingMethod.Description, order.ShippingMethod.Price,
                order.ShippingMethod.EstimatedDays, order.ShippingMethod.Icon),
            new PaymentMethodDto(order.PaymentMethod.Id, order.PaymentMethod.Type,
                order.PaymentMethod.Name, order.PaymentMethod.Description,
                order.PaymentMethod.Icon, order.PaymentMethod.IsAvailable),
            order.Subtotal, order.ShippingCost, order.Discount, order.Tax, order.Total,
            order.CouponCode, order.Status,
            order.StatusHistory.Select(h => new OrderStatusHistoryDto(h.Status, h.Note, h.CreatedAt)).ToList(),
            order.TrackingNumber, order.Notes, order.EstimatedDelivery,
            order.CreatedAt, order.UpdatedAt
        );
    }
}
