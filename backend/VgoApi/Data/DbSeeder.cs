using VgoApi.Data;
using VgoApi.Models;

namespace VgoApi.Data;

public static class DbSeeder
{
    public static async Task SeedDatabase(VgoDbContext context)
    {
        // Check if database is already seeded
        if (context.Products.Any())
        {
            Console.WriteLine("Database already seeded.");
            return;
        }

        Console.WriteLine("Starting database seeding...");

        // Seed Categories
        var categories = SeedCategories(context);
        await context.SaveChangesAsync();
        Console.WriteLine($"Seeded {categories.Count} categories");

        // Seed Shipping Methods
        var shippingMethods = SeedShippingMethods(context);
        await context.SaveChangesAsync();
        Console.WriteLine($"Seeded {shippingMethods.Count} shipping methods");

        // Seed Payment Methods
        var paymentMethods = SeedPaymentMethods(context);
        await context.SaveChangesAsync();
        Console.WriteLine($"Seeded {paymentMethods.Count} payment methods");

        // Seed Products
        var products = SeedProducts(context, categories);
        await context.SaveChangesAsync();
        Console.WriteLine($"Seeded {products.Count} products");

        // Seed Coupons
        var coupons = SeedCoupons(context, categories, products);
        await context.SaveChangesAsync();
        Console.WriteLine($"Seeded {coupons.Count} coupons");

        // Seed Sample User
        var user = SeedSampleUser(context);
        await context.SaveChangesAsync();
        Console.WriteLine("Seeded sample user");

        // Seed Reviews
        var reviews = SeedReviews(context, products, user);
        await context.SaveChangesAsync();
        Console.WriteLine($"Seeded {reviews.Count} reviews");

        Console.WriteLine("Database seeding completed successfully!");
    }

    private static List<Category> SeedCategories(VgoDbContext context)
    {
        var categories = new List<Category>
        {
            new Category
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Electronics",
                Slug = "electronics",
                Description = "Latest gadgets and electronics",
                ImageUrl = "https://picsum.photos/seed/electronics/400/300",
                Icon = "📱",
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Fashion",
                Slug = "fashion",
                Description = "Trendy clothing and accessories",
                ImageUrl = "https://picsum.photos/seed/fashion/400/300",
                Icon = "👔",
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Home & Living",
                Slug = "home-living",
                Description = "Furniture and home decor",
                ImageUrl = "https://picsum.photos/seed/home/400/300",
                Icon = "🏠",
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "Sports & Outdoors",
                Slug = "sports-outdoors",
                Description = "Sports equipment and outdoor gear",
                ImageUrl = "https://picsum.photos/seed/sports/400/300",
                Icon = "⚽",
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "Books & Media",
                Slug = "books-media",
                Description = "Books, movies, and music",
                ImageUrl = "https://picsum.photos/seed/books/400/300",
                Icon = "📚",
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        // Add subcategories
        var subcategories = new List<Category>
        {
            new Category
            {
                Id = Guid.NewGuid(),
                Name = "Smartphones",
                Slug = "smartphones",
                ParentId = categories[0].Id,
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.NewGuid(),
                Name = "Laptops",
                Slug = "laptops",
                ParentId = categories[0].Id,
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.NewGuid(),
                Name = "Men's Clothing",
                Slug = "mens-clothing",
                ParentId = categories[1].Id,
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.NewGuid(),
                Name = "Women's Clothing",
                Slug = "womens-clothing",
                ParentId = categories[1].Id,
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        categories.AddRange(subcategories);
        context.Categories.AddRange(categories);
        return categories;
    }

    private static List<ShippingMethod> SeedShippingMethods(VgoDbContext context)
    {
        var methods = new List<ShippingMethod>
        {
            new ShippingMethod
            {
                Id = Guid.NewGuid(),
                Name = "Standard Delivery",
                Description = "Delivery within 3-5 business days",
                Price = 350,
                EstimatedDays = "3-5 days",
                Icon = "📦",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new ShippingMethod
            {
                Id = Guid.NewGuid(),
                Name = "Express Delivery",
                Description = "Delivery within 1-2 business days",
                Price = 650,
                EstimatedDays = "1-2 days",
                Icon = "🚀",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new ShippingMethod
            {
                Id = Guid.NewGuid(),
                Name = "Same Day Delivery",
                Description = "Delivery within 24 hours",
                Price = 1200,
                EstimatedDays = "Same day",
                Icon = "⚡",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.ShippingMethods.AddRange(methods);
        return methods;
    }

    private static List<PaymentMethod> SeedPaymentMethods(VgoDbContext context)
    {
        var methods = new List<PaymentMethod>
        {
            new PaymentMethod
            {
                Id = Guid.NewGuid(),
                Type = "card",
                Name = "Credit/Debit Card",
                Description = "Pay securely with your credit or debit card",
                Icon = "💳",
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new PaymentMethod
            {
                Id = Guid.NewGuid(),
                Type = "cod",
                Name = "Cash on Delivery",
                Description = "Pay when you receive your order",
                Icon = "💵",
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new PaymentMethod
            {
                Id = Guid.NewGuid(),
                Type = "bank",
                Name = "Bank Transfer",
                Description = "Direct bank transfer",
                Icon = "🏦",
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new PaymentMethod
            {
                Id = Guid.NewGuid(),
                Type = "wallet",
                Name = "Digital Wallet",
                Description = "Pay using your digital wallet",
                Icon = "📱",
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.PaymentMethods.AddRange(methods);
        return methods;
    }

    private static List<Product> SeedProducts(VgoDbContext context, List<Category> categories)
    {
        var electronicsCategory = categories.First(c => c.Slug == "electronics");
        var fashionCategory = categories.First(c => c.Slug == "fashion");

        var products = new List<Product>();

        // iPhone 15 Pro Max
        var iphone = new Product
        {
            Id = Guid.NewGuid(),
            Name = "iPhone 15 Pro Max 256GB",
            Slug = "iphone-15-pro-max-256gb",
            Description = "The most powerful iPhone ever. Featuring the A17 Pro chip, titanium design, and an advanced camera system.",
            ShortDescription = "A17 Pro chip, 6.7\" display, 48MP camera",
            CategoryId = electronicsCategory.Id,
            SubCategory = "Smartphones",
            Brand = "Apple",
            Stock = 50,
            Sku = "IPH15PM256",
            Rating = 4.8m,
            ReviewCount = 0,
            IsFeatured = true,
            IsNew = true,
            IsOnSale = true,
            IsBestSeller = true,
            Warranty = "1 year manufacturer warranty",
            DeliveryInfo = "Free delivery on orders over Rs. 50,000",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        iphone.Prices.Add(new ProductPrice
        {
            Id = Guid.NewGuid(),
            Amount = 489900,
            OriginalAmount = 529900,
            Currency = "Rs.",
            DiscountPercentage = 8,
            IsActive = true,
            ValidFrom = DateTime.UtcNow.AddDays(-30),
            ValidUntil = DateTime.UtcNow.AddDays(30)
        });

        iphone.Images.Add(new ProductImage
        {
            Id = Guid.NewGuid(),
            Url = "https://picsum.photos/seed/iphone1/800/800",
            AltText = "iPhone 15 Pro Max Front View",
            IsPrimary = true,
            SortOrder = 0,
            CreatedAt = DateTime.UtcNow
        });

        iphone.Images.Add(new ProductImage
        {
            Id = Guid.NewGuid(),
            Url = "https://picsum.photos/seed/iphone2/800/800",
            AltText = "iPhone 15 Pro Max Back View",
            IsPrimary = false,
            SortOrder = 1,
            CreatedAt = DateTime.UtcNow
        });

        iphone.Variants.Add(new ProductVariant
        {
            Id = Guid.NewGuid(),
            Name = "Natural Titanium",
            Type = "color",
            Value = "Natural Titanium",
            ColorCode = "#8B8B8B",
            PriceModifier = 0,
            Stock = 20,
            Sku = "IPH15PM256-NT",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        iphone.Variants.Add(new ProductVariant
        {
            Id = Guid.NewGuid(),
            Name = "Blue Titanium",
            Type = "color",
            Value = "Blue Titanium",
            ColorCode = "#4A5568",
            PriceModifier = 0,
            Stock = 15,
            Sku = "IPH15PM256-BT",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        iphone.Specifications.Add(new ProductSpecification
        {
            Id = Guid.NewGuid(),
            Label = "Display",
            Value = "6.7-inch Super Retina XDR display",
            GroupName = "Display",
            SortOrder = 0
        });

        iphone.Specifications.Add(new ProductSpecification
        {
            Id = Guid.NewGuid(),
            Label = "Chip",
            Value = "A17 Pro chip",
            GroupName = "Performance",
            SortOrder = 1
        });

        iphone.Specifications.Add(new ProductSpecification
        {
            Id = Guid.NewGuid(),
            Label = "Camera",
            Value = "48MP Main | 12MP Ultra Wide | 12MP Telephoto",
            GroupName = "Camera",
            SortOrder = 2
        });

        products.Add(iphone);

        // MacBook Pro
        var macbook = new Product
        {
            Id = Guid.NewGuid(),
            Name = "MacBook Pro 14\" M3 Pro",
            Slug = "macbook-pro-14-m3-pro",
            Description = "Supercharged by M3 Pro chip. Up to 18 hours of battery life. Stunning Liquid Retina XDR display.",
            ShortDescription = "M3 Pro chip, 14\" Liquid Retina XDR, 18GB RAM",
            CategoryId = electronicsCategory.Id,
            SubCategory = "Laptops",
            Brand = "Apple",
            Stock = 25,
            Sku = "MBP14M3P",
            Rating = 4.9m,
            ReviewCount = 0,
            IsFeatured = true,
            IsNew = true,
            IsOnSale = false,
            IsBestSeller = true,
            Warranty = "1 year manufacturer warranty",
            DeliveryInfo = "Free delivery",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        macbook.Prices.Add(new ProductPrice
        {
            Id = Guid.NewGuid(),
            Amount = 749900,
            Currency = "Rs.",
            IsActive = true,
            ValidFrom = DateTime.UtcNow.AddDays(-30)
        });

        macbook.Images.Add(new ProductImage
        {
            Id = Guid.NewGuid(),
            Url = "https://picsum.photos/seed/macbook1/800/800",
            AltText = "MacBook Pro 14 inch",
            IsPrimary = true,
            SortOrder = 0,
            CreatedAt = DateTime.UtcNow
        });

        macbook.Variants.Add(new ProductVariant
        {
            Id = Guid.NewGuid(),
            Name = "Space Black",
            Type = "color",
            Value = "Space Black",
            ColorCode = "#1a1a1a",
            PriceModifier = 0,
            Stock = 15,
            Sku = "MBP14M3P-SB",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        macbook.Specifications.Add(new ProductSpecification
        {
            Id = Guid.NewGuid(),
            Label = "Display",
            Value = "14.2-inch Liquid Retina XDR display",
            GroupName = "Display",
            SortOrder = 0
        });

        products.Add(macbook);

        // Add more products (simplified for brevity)
        for (int i = 3; i <= 10; i++)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = $"Sample Product {i}",
                Slug = $"sample-product-{i}",
                Description = $"This is a sample product description for product {i}",
                ShortDescription = $"Sample product {i}",
                CategoryId = i % 2 == 0 ? electronicsCategory.Id : fashionCategory.Id,
                Brand = "Generic Brand",
                Stock = 100,
                Sku = $"SAMPLE{i:D3}",
                Rating = 4.0m + (i % 10) * 0.1m,
                ReviewCount = 0,
                IsFeatured = i % 3 == 0,
                IsNew = i % 4 == 0,
                IsOnSale = i % 5 == 0,
                IsBestSeller = i % 6 == 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            product.Prices.Add(new ProductPrice
            {
                Id = Guid.NewGuid(),
                Amount = 10000 + (i * 5000),
                OriginalAmount = i % 5 == 0 ? 10000 + (i * 6000) : null,
                Currency = "Rs.",
                DiscountPercentage = i % 5 == 0 ? 15 : null,
                IsActive = true,
                ValidFrom = DateTime.UtcNow.AddDays(-30)
            });

            product.Images.Add(new ProductImage
            {
                Id = Guid.NewGuid(),
                Url = $"https://picsum.photos/seed/product{i}/800/800",
                AltText = $"Sample Product {i}",
                IsPrimary = true,
                SortOrder = 0,
                CreatedAt = DateTime.UtcNow
            });

            products.Add(product);
        }

        context.Products.AddRange(products);
        return products;
    }

    private static List<Coupon> SeedCoupons(VgoDbContext context, List<Category> categories, List<Product> products)
    {
        var coupons = new List<Coupon>
        {
            new Coupon
            {
                Id = Guid.NewGuid(),
                Code = "WELCOME10",
                Type = "percentage",
                Value = 10,
                MinOrderAmount = 2000,
                MaxDiscount = 5000,
                ValidFrom = DateTime.UtcNow.AddDays(-30),
                ValidUntil = DateTime.UtcNow.AddDays(60),
                UsageLimit = 1,
                UsageCount = 0,
                IsActive = true,
                Description = "10% off on your first order (max Rs. 5,000 discount)",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Coupon
            {
                Id = Guid.NewGuid(),
                Code = "SAVE500",
                Type = "fixed",
                Value = 500,
                MinOrderAmount = 5000,
                ValidFrom = DateTime.UtcNow.AddDays(-15),
                ValidUntil = DateTime.UtcNow.AddDays(45),
                IsActive = true,
                Description = "Rs. 500 off on orders above Rs. 5,000",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Coupon
            {
                Id = Guid.NewGuid(),
                Code = "ELECTRONICS20",
                Type = "percentage",
                Value = 20,
                MinOrderAmount = 10000,
                MaxDiscount = 10000,
                ValidFrom = DateTime.UtcNow.AddDays(-7),
                ValidUntil = DateTime.UtcNow.AddDays(23),
                IsActive = true,
                Description = "20% off on electronics (max Rs. 10,000 discount)",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Coupons.AddRange(coupons);
        return coupons;
    }

    private static User SeedSampleUser(VgoDbContext context)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "demo@vgo.lk",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo@123"),
            FirstName = "Demo",
            LastName = "User",
            Phone = "+94771234567",
            AvatarUrl = "https://picsum.photos/seed/avatar1/150/150",
            DateOfBirth = new DateTime(1990, 5, 15),
            Gender = "male",
            IsVerified = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        user.Addresses.Add(new Address
        {
            Id = Guid.NewGuid(),
            Label = "Home",
            FirstName = "Demo",
            LastName = "User",
            Phone = "+94771234567",
            AddressLine1 = "123 Main Street",
            AddressLine2 = "Apartment 4B",
            City = "Colombo",
            District = "Colombo",
            PostalCode = "00100",
            Country = "Sri Lanka",
            IsDefault = true,
            Type = "home",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        context.Users.Add(user);
        return user;
    }

    private static List<Review> SeedReviews(VgoDbContext context, List<Product> products, User user)
    {
        var reviews = new List<Review>();

        if (products.Count > 0)
        {
            var review1 = new Review
            {
                Id = Guid.NewGuid(),
                ProductId = products[0].Id,
                UserId = user.Id,
                Rating = 5,
                Title = "Excellent product!",
                Comment = "Absolutely love this product. Exceeded my expectations in every way. Highly recommended!",
                IsVerifiedPurchase = true,
                HelpfulCount = 12,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-10)
            };

            review1.Images.Add(new ReviewImage
            {
                Id = Guid.NewGuid(),
                Url = "https://picsum.photos/seed/review1/200/200",
                SortOrder = 0
            });

            reviews.Add(review1);

            // Update product rating
            products[0].ReviewCount = 1;
            products[0].Rating = 5.0m;
        }

        if (products.Count > 1)
        {
            var review2 = new Review
            {
                Id = Guid.NewGuid(),
                ProductId = products[1].Id,
                UserId = user.Id,
                Rating = 5,
                Title = "Best purchase ever!",
                Comment = "Outstanding quality and performance. Worth every penny!",
                IsVerifiedPurchase = true,
                HelpfulCount = 8,
                CreatedAt = DateTime.UtcNow.AddDays(-5),
                UpdatedAt = DateTime.UtcNow.AddDays(-5)
            };

            reviews.Add(review2);

            // Update product rating
            products[1].ReviewCount = 1;
            products[1].Rating = 5.0m;
        }

        context.Reviews.AddRange(reviews);
        return reviews;
    }
}
