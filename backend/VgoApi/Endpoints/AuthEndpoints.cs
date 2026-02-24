using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VgoApi.Data;
using VgoApi.DTOs;
using VgoApi.Models;
using VgoApi.Services;

namespace VgoApi.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/v1/auth").WithTags("Authentication");

        // Register
        group.MapPost("/register", async (
            [FromBody] RegisterRequest request,
            VgoDbContext db,
            IJwtService jwtService) =>
        {
            // Validate request
            if (request.Password != request.ConfirmPassword)
            {
                return Results.BadRequest(new ApiResponse<object>(false, null, "Passwords do not match"));
            }

            // Check if user exists
            if (await db.Users.AnyAsync(u => u.Email == request.Email))
            {
                return Results.Conflict(new ApiResponse<object>(false, null, "Email already registered"));
            }

            // Create user
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Phone = request.Phone,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                IsVerified = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.Users.Add(user);
            await db.SaveChangesAsync();

            // Generate token
            var token = jwtService.GenerateToken(user);

            var userDto = new UserDto(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Phone,
                user.AvatarUrl,
                user.DateOfBirth,
                user.Gender,
                user.IsVerified,
                user.CreatedAt,
                user.UpdatedAt
            );

            return Results.Created($"/api/v1/users/{user.Id}",
                new ApiResponse<AuthResponse>(true, new AuthResponse(userDto, token)));
        })
        .WithName("Register")
        .WithOpenApi();

        // Login
        group.MapPost("/login", async (
            [FromBody] LoginRequest request,
            VgoDbContext db,
            IJwtService jwtService) =>
        {
            // Find user
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return Results.Unauthorized();
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Results.Unauthorized();
            }

            // Generate token
            var token = jwtService.GenerateToken(user);

            var userDto = new UserDto(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Phone,
                user.AvatarUrl,
                user.DateOfBirth,
                user.Gender,
                user.IsVerified,
                user.CreatedAt,
                user.UpdatedAt
            );

            return Results.Ok(new ApiResponse<AuthResponse>(true, new AuthResponse(userDto, token)));
        })
        .WithName("Login")
        .WithOpenApi();

        // Get current user
        group.MapGet("/me", async (
            HttpContext context,
            VgoDbContext db) =>
        {
            var userIdClaim = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Results.Unauthorized();
            }

            var user = await db.Users.FindAsync(userId);
            if (user == null)
            {
                return Results.NotFound(new ApiResponse<object>(false, null, "User not found"));
            }

            var userDto = new UserDto(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Phone,
                user.AvatarUrl,
                user.DateOfBirth,
                user.Gender,
                user.IsVerified,
                user.CreatedAt,
                user.UpdatedAt
            );

            return Results.Ok(new ApiResponse<UserDto>(true, userDto));
        })
        .RequireAuthorization()
        .WithName("GetCurrentUser")
        .WithOpenApi();

        // Logout
        group.MapPost("/logout", () =>
        {
            // In a stateless JWT setup, logout is handled client-side by removing the token
            return Results.Ok(new ApiResponse<object>(true, new { message = "Logged out successfully" }));
        })
        .RequireAuthorization()
        .WithName("Logout")
        .WithOpenApi();
    }
}
