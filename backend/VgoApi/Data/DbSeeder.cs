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
        var coupons = SeedCoupons(context);
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
                Description = "Latest gadgets, smartphones, laptops, and electronic accessories",
                ImageUrl = "/products/categories/electronics.jpg",
                Icon = "Cpu",
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Fashion",
                Slug = "fashion",
                Description = "Trendy clothing, shoes, and accessories for men and women",
                ImageUrl = "/products/categories/fashion.jpg",
                Icon = "Shirt",
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Home & Living",
                Slug = "home-living",
                Description = "Furniture, home decor, kitchen appliances, and bedding",
                ImageUrl = "/products/categories/home-living.jpg",
                Icon = "Home",
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "Sports & Outdoors",
                Slug = "sports-outdoors",
                Description = "Sports equipment, fitness gear, and outdoor adventure essentials",
                ImageUrl = "/products/categories/sports.jpg",
                Icon = "Dumbbell",
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "Beauty & Health",
                Slug = "beauty-health",
                Description = "Skincare, makeup, healthcare products, and personal care items",
                ImageUrl = "/products/categories/beauty.jpg",
                Icon = "Heart",
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                Name = "Toys & Games",
                Slug = "toys-games",
                Description = "Toys, board games, puzzles, and entertainment for all ages",
                ImageUrl = "/products/categories/toys.jpg",
                Icon = "Gamepad2",
                ProductCount = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        // Add subcategories
        var subcategories = new List<Category>
        {
            // Electronics subcategories
            new Category { Id = Guid.NewGuid(), Name = "Smartphones", Slug = "smartphones", ParentId = categories[0].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Category { Id = Guid.NewGuid(), Name = "Laptops", Slug = "laptops", ParentId = categories[0].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Category { Id = Guid.NewGuid(), Name = "Audio", Slug = "audio", ParentId = categories[0].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Category { Id = Guid.NewGuid(), Name = "Wearables", Slug = "wearables", ParentId = categories[0].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            // Fashion subcategories
            new Category { Id = Guid.NewGuid(), Name = "Men's Clothing", Slug = "mens-clothing", ParentId = categories[1].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Category { Id = Guid.NewGuid(), Name = "Women's Clothing", Slug = "womens-clothing", ParentId = categories[1].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Category { Id = Guid.NewGuid(), Name = "Shoes", Slug = "shoes", ParentId = categories[1].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Category { Id = Guid.NewGuid(), Name = "Watches", Slug = "watches", ParentId = categories[1].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            // Home subcategories
            new Category { Id = Guid.NewGuid(), Name = "Furniture", Slug = "furniture", ParentId = categories[2].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Category { Id = Guid.NewGuid(), Name = "Kitchen", Slug = "kitchen", ParentId = categories[2].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            // Sports subcategories
            new Category { Id = Guid.NewGuid(), Name = "Fitness", Slug = "fitness", ParentId = categories[3].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new Category { Id = Guid.NewGuid(), Name = "Outdoor Gear", Slug = "outdoor-gear", ParentId = categories[3].Id, ProductCount = 0, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
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
                Icon = "Package",
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
                Icon = "Truck",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new ShippingMethod
            {
                Id = Guid.NewGuid(),
                Name = "Same Day Delivery",
                Description = "Delivery within 24 hours (Colombo only)",
                Price = 1200,
                EstimatedDays = "Same day",
                Icon = "Zap",
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
                Description = "Pay securely with Visa, Mastercard, or Amex",
                Icon = "CreditCard",
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
                Icon = "Banknote",
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new PaymentMethod
            {
                Id = Guid.NewGuid(),
                Type = "bank",
                Name = "Bank Transfer",
                Description = "Direct bank transfer to our account",
                Icon = "Building2",
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new PaymentMethod
            {
                Id = Guid.NewGuid(),
                Type = "wallet",
                Name = "Digital Wallet",
                Description = "Pay using FriMi, eZ Cash, or other wallets",
                Icon = "Wallet",
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
        var electronics = categories.First(c => c.Slug == "electronics");
        var fashion = categories.First(c => c.Slug == "fashion");
        var homeLiving = categories.First(c => c.Slug == "home-living");
        var sports = categories.First(c => c.Slug == "sports-outdoors");
        var beauty = categories.First(c => c.Slug == "beauty-health");
        var toys = categories.First(c => c.Slug == "toys-games");

        var products = new List<Product>();

        // ==================== ELECTRONICS (15 products) ====================

        // 1. iPhone 15 Pro Max
        products.Add(CreateProduct(
            "iPhone 15 Pro Max 256GB", "iphone-15-pro-max", electronics.Id, "Smartphones", "Apple",
            "The most powerful iPhone ever with A17 Pro chip, titanium design, 48MP camera system, and USB-C connectivity.",
            "A17 Pro chip, 6.7\" Super Retina XDR, 48MP Camera",
            489900, 529900, 8, 50, "iphone-15-pro-max.jpg",
            new[] { ("Natural Titanium", "#8B8B8B"), ("Blue Titanium", "#4A5568"), ("White Titanium", "#E5E5E5"), ("Black Titanium", "#1C1C1E") },
            new[] { ("Display", "6.7-inch Super Retina XDR"), ("Chip", "A17 Pro"), ("Camera", "48MP + 12MP + 12MP"), ("Battery", "Up to 29 hours video") },
            true, true, true, true, 4.9m));

        // 2. Samsung Galaxy S24 Ultra
        products.Add(CreateProduct(
            "Samsung Galaxy S24 Ultra 512GB", "samsung-galaxy-s24-ultra", electronics.Id, "Smartphones", "Samsung",
            "Ultimate Galaxy experience with Galaxy AI, 200MP camera, S Pen, and titanium frame.",
            "Snapdragon 8 Gen 3, 6.8\" QHD+ AMOLED, 200MP Camera",
            459900, 489900, 6, 40, "samsung-s24-ultra.jpg",
            new[] { ("Titanium Gray", "#6B6B6B"), ("Titanium Black", "#1A1A1A"), ("Titanium Violet", "#9B8AA5") },
            new[] { ("Display", "6.8-inch Dynamic AMOLED 2X"), ("Processor", "Snapdragon 8 Gen 3"), ("Camera", "200MP + 50MP + 12MP + 10MP") },
            true, true, true, false, 4.8m));

        // 3. MacBook Pro 14"
        products.Add(CreateProduct(
            "MacBook Pro 14\" M3 Pro 18GB", "macbook-pro-14-m3-pro", electronics.Id, "Laptops", "Apple",
            "Supercharged by M3 Pro chip with 18-core GPU. Stunning Liquid Retina XDR display and up to 18 hours battery.",
            "M3 Pro chip, 14.2\" Liquid Retina XDR, 18GB RAM",
            749900, null, null, 25, "macbook-pro-14.jpg",
            new[] { ("Space Black", "#1D1D1F"), ("Silver", "#E3E4E5") },
            new[] { ("Chip", "Apple M3 Pro"), ("Memory", "18GB Unified"), ("Storage", "512GB SSD"), ("Display", "14.2-inch Liquid Retina XDR") },
            true, true, false, true, 4.9m));

        // 4. Dell XPS 15
        products.Add(CreateProduct(
            "Dell XPS 15 9530 Core i7", "dell-xps-15-9530", electronics.Id, "Laptops", "Dell",
            "Premium Windows laptop with 13th Gen Intel Core i7, NVIDIA RTX 4050, and stunning OLED display.",
            "Intel Core i7-13700H, RTX 4050, 16GB RAM, 512GB SSD",
            524900, 574900, 9, 30, "dell-xps-15.jpg",
            new[] { ("Platinum Silver", "#C0C0C0") },
            new[] { ("Processor", "Intel Core i7-13700H"), ("Graphics", "NVIDIA RTX 4050"), ("Display", "15.6\" 3.5K OLED") },
            true, false, true, false, 4.7m));

        // 5. Sony WH-1000XM5
        products.Add(CreateProduct(
            "Sony WH-1000XM5 Wireless Headphones", "sony-wh-1000xm5", electronics.Id, "Audio", "Sony",
            "Industry-leading noise cancellation with exceptional sound quality and 30-hour battery life.",
            "Best-in-class ANC, 30-hour battery, Hi-Res Audio",
            89900, 99900, 10, 60, "sony-wh1000xm5.jpg",
            new[] { ("Black", "#000000"), ("Silver", "#C0C0C0"), ("Midnight Blue", "#191970") },
            new[] { ("Driver", "30mm"), ("Battery", "30 hours"), ("Bluetooth", "5.2"), ("Weight", "250g") },
            true, false, true, true, 4.8m));

        // 6. Apple AirPods Pro 2
        products.Add(CreateProduct(
            "Apple AirPods Pro 2nd Gen", "airpods-pro-2", electronics.Id, "Audio", "Apple",
            "Active Noise Cancellation, Adaptive Audio, and USB-C charging case for magical listening experience.",
            "H2 chip, Active Noise Cancellation, USB-C",
            74900, 79900, 6, 80, "airpods-pro-2.jpg",
            new[] { ("White", "#FFFFFF") },
            new[] { ("Chip", "Apple H2"), ("ANC", "Active Noise Cancellation"), ("Battery", "6 hours (30 with case)") },
            true, true, true, true, 4.9m));

        // 7. Apple Watch Ultra 2
        products.Add(CreateProduct(
            "Apple Watch Ultra 2 49mm", "apple-watch-ultra-2", electronics.Id, "Wearables", "Apple",
            "The most rugged Apple Watch with precision GPS, 36-hour battery, and titanium case.",
            "49mm Titanium, GPS + Cellular, Action Button",
            289900, null, null, 35, "apple-watch-ultra-2.jpg",
            new[] { ("Natural Titanium", "#8B8B8B") },
            new[] { ("Case", "49mm Titanium"), ("Display", "Always-On Retina LTPO OLED"), ("Water Resistance", "100m") },
            true, true, false, false, 4.8m));

        // 8. Samsung Galaxy Watch 6
        products.Add(CreateProduct(
            "Samsung Galaxy Watch 6 Classic 47mm", "galaxy-watch-6-classic", electronics.Id, "Wearables", "Samsung",
            "Classic design with rotating bezel, comprehensive health monitoring, and Wear OS.",
            "47mm, Rotating Bezel, BioActive Sensor",
            124900, 139900, 11, 45, "galaxy-watch-6.jpg",
            new[] { ("Black", "#000000"), ("Silver", "#C0C0C0") },
            new[] { ("Display", "1.5\" Super AMOLED"), ("Battery", "425mAh"), ("OS", "Wear OS 4") },
            false, true, true, false, 4.6m));

        // 9. iPad Pro 12.9"
        products.Add(CreateProduct(
            "iPad Pro 12.9\" M2 256GB WiFi", "ipad-pro-12-9-m2", electronics.Id, "Tablets", "Apple",
            "The ultimate iPad with M2 chip, Liquid Retina XDR display, and Apple Pencil hover.",
            "M2 chip, 12.9\" Liquid Retina XDR, 256GB",
            389900, 419900, 7, 30, "ipad-pro-12.jpg",
            new[] { ("Space Gray", "#4A4A4A"), ("Silver", "#E3E4E5") },
            new[] { ("Chip", "Apple M2"), ("Display", "12.9\" Liquid Retina XDR"), ("Storage", "256GB") },
            true, false, true, false, 4.8m));

        // 10. PlayStation 5 Slim
        products.Add(CreateProduct(
            "PlayStation 5 Slim Digital Edition", "ps5-slim-digital", electronics.Id, "Gaming", "Sony",
            "Next-gen gaming with ultra-high speed SSD, haptic feedback, and stunning 4K graphics.",
            "825GB SSD, 4K Gaming, DualSense Controller",
            189900, null, null, 25, "ps5-slim.jpg",
            new[] { ("White", "#FFFFFF") },
            new[] { ("Storage", "825GB SSD"), ("Resolution", "Up to 4K 120Hz"), ("Ray Tracing", "Hardware-based") },
            true, true, false, true, 4.9m));

        // 11. Nintendo Switch OLED
        products.Add(CreateProduct(
            "Nintendo Switch OLED Model", "nintendo-switch-oled", electronics.Id, "Gaming", "Nintendo",
            "Vibrant 7-inch OLED screen, enhanced audio, and wide adjustable stand.",
            "7\" OLED Screen, 64GB Storage, Enhanced Audio",
            114900, 124900, 8, 40, "nintendo-switch-oled.jpg",
            new[] { ("White", "#FFFFFF"), ("Neon Red/Blue", "#FF4655") },
            new[] { ("Screen", "7-inch OLED"), ("Storage", "64GB"), ("Battery", "4.5-9 hours") },
            true, false, true, true, 4.7m));

        // 12. Canon EOS R6 Mark II
        products.Add(CreateProduct(
            "Canon EOS R6 Mark II Body", "canon-eos-r6-mark-ii", electronics.Id, "Cameras", "Canon",
            "Full-frame mirrorless camera with 24.2MP sensor, 6K video, and advanced AF system.",
            "24.2MP Full-Frame, 6K Video, DIGIC X",
            799900, 849900, 6, 15, "canon-eos-r6.jpg",
            new[] { ("Black", "#000000") },
            new[] { ("Sensor", "24.2MP Full-Frame CMOS"), ("ISO", "100-102400"), ("Video", "6K 60p RAW") },
            true, true, true, false, 4.8m));

        // 13. DJI Mini 4 Pro
        products.Add(CreateProduct(
            "DJI Mini 4 Pro Fly More Combo", "dji-mini-4-pro", electronics.Id, "Drones", "DJI",
            "Sub-249g drone with 4K/60fps HDR video, omnidirectional obstacle sensing.",
            "4K/60fps HDR, 34min Flight, Obstacle Sensing",
            349900, 379900, 8, 20, "dji-mini-4-pro.jpg",
            new[] { ("Gray", "#808080") },
            new[] { ("Weight", "Under 249g"), ("Video", "4K/60fps HDR"), ("Flight Time", "34 minutes") },
            true, true, true, false, 4.7m));

        // 14. Bose QuietComfort Ultra
        products.Add(CreateProduct(
            "Bose QuietComfort Ultra Earbuds", "bose-qc-ultra-earbuds", electronics.Id, "Audio", "Bose",
            "Immersive Audio with world-class noise cancellation and CustomTune technology.",
            "Immersive Audio, World-class ANC, 6hr Battery",
            84900, 89900, 6, 50, "bose-qc-ultra.jpg",
            new[] { ("Black", "#000000"), ("White Smoke", "#F5F5F5"), ("Moonstone Blue", "#738CA6") },
            new[] { ("ANC", "World-class Noise Cancellation"), ("Battery", "6 hours"), ("Bluetooth", "5.3") },
            false, true, true, false, 4.6m));

        // 15. Google Pixel 8 Pro
        products.Add(CreateProduct(
            "Google Pixel 8 Pro 256GB", "google-pixel-8-pro", electronics.Id, "Smartphones", "Google",
            "Google's most advanced phone with Tensor G3, 50MP camera, and 7 years of updates.",
            "Tensor G3, 50MP Camera, 7 Years Updates",
            349900, 379900, 8, 35, "pixel-8-pro.jpg",
            new[] { ("Obsidian", "#1C1C1E"), ("Porcelain", "#E8DFD6"), ("Bay", "#8DB4C4") },
            new[] { ("Processor", "Google Tensor G3"), ("Camera", "50MP + 48MP + 48MP"), ("Display", "6.7\" LTPO OLED") },
            true, true, true, false, 4.7m));

        // ==================== FASHION (12 products) ====================

        // 16. Nike Air Jordan 1
        products.Add(CreateProduct(
            "Nike Air Jordan 1 Retro High OG", "nike-air-jordan-1-retro", fashion.Id, "Shoes", "Nike",
            "The iconic sneaker that started it all. Premium leather upper with Air-Sole cushioning.",
            "Leather Upper, Air-Sole Unit, Rubber Outsole",
            42900, 47900, 10, 60, "nike-jordan-1.jpg",
            new[] { ("Chicago", "#CD1A1C"), ("Royal Blue", "#0057B8"), ("Shadow", "#555555") },
            new[] { ("Upper", "Full-grain Leather"), ("Sole", "Rubber"), ("Cushioning", "Air-Sole") },
            true, false, true, true, 4.8m));

        // 17. Adidas Ultraboost 24
        products.Add(CreateProduct(
            "Adidas Ultraboost Light Running Shoes", "adidas-ultraboost-light", fashion.Id, "Shoes", "Adidas",
            "Our lightest Ultraboost ever with responsive BOOST midsole and Primeknit+ upper.",
            "Primeknit+ Upper, BOOST Midsole, Continental Outsole",
            38900, 42900, 9, 55, "adidas-ultraboost.jpg",
            new[] { ("Core Black", "#000000"), ("Cloud White", "#FFFFFF"), ("Solar Red", "#FF4136") },
            new[] { ("Upper", "Primeknit+"), ("Midsole", "BOOST"), ("Outsole", "Continental Rubber") },
            true, true, true, false, 4.7m));

        // 18. Ray-Ban Aviator
        products.Add(CreateProduct(
            "Ray-Ban Aviator Classic Sunglasses", "ray-ban-aviator-classic", fashion.Id, "Accessories", "Ray-Ban",
            "Timeless aviator design with crystal green G-15 lenses and gold metal frame.",
            "G-15 Crystal Lenses, Gold Frame, 100% UV Protection",
            32900, null, null, 70, "ray-ban-aviator.jpg",
            new[] { ("Gold/Green", "#FFD700"), ("Silver/Blue", "#C0C0C0"), ("Black/Gray", "#000000") },
            new[] { ("Frame", "Metal"), ("Lens", "Crystal G-15"), ("UV Protection", "100%") },
            true, false, false, true, 4.6m));

        // 19. Levi's 501 Original
        products.Add(CreateProduct(
            "Levi's 501 Original Fit Jeans", "levis-501-original", fashion.Id, "Men's Clothing", "Levi's",
            "The original blue jean since 1873. Straight leg, button fly, iconic fit.",
            "100% Cotton, Button Fly, Straight Leg",
            15900, 18900, 16, 100, "levis-501.jpg",
            new[] { ("Medium Indigo", "#3F5277"), ("Dark Wash", "#1C2541"), ("Light Stonewash", "#8DA9C4") },
            new[] { ("Material", "100% Cotton Denim"), ("Fit", "Straight Leg"), ("Rise", "Regular") },
            false, false, true, true, 4.5m));

        // 20. Tommy Hilfiger Polo
        products.Add(CreateProduct(
            "Tommy Hilfiger Classic Fit Polo Shirt", "tommy-hilfiger-polo", fashion.Id, "Men's Clothing", "Tommy Hilfiger",
            "Classic American style polo with signature flag logo. Soft cotton pique fabric.",
            "100% Cotton Pique, Classic Fit, Signature Logo",
            12900, 14900, 13, 120, "tommy-polo.jpg",
            new[] { ("Navy", "#000080"), ("White", "#FFFFFF"), ("Red", "#FF0000") },
            new[] { ("Material", "100% Cotton Pique"), ("Fit", "Classic"), ("Collar", "Ribbed") },
            false, false, true, false, 4.4m));

        // 21. Michael Kors Handbag
        products.Add(CreateProduct(
            "Michael Kors Jet Set Travel Tote", "michael-kors-jet-set-tote", fashion.Id, "Women's Accessories", "Michael Kors",
            "Sophisticated saffiano leather tote with signature logo hardware and multiple pockets.",
            "Saffiano Leather, Zip-top Closure, Multiple Pockets",
            54900, 64900, 15, 40, "michael-kors-tote.jpg",
            new[] { ("Black", "#000000"), ("Brown", "#8B4513"), ("Navy", "#000080") },
            new[] { ("Material", "Saffiano Leather"), ("Closure", "Zip-top"), ("Dimensions", "15\"W x 10\"H x 5\"D") },
            true, false, true, false, 4.5m));

        // 22. Casio G-Shock
        products.Add(CreateProduct(
            "Casio G-Shock GA-2100 CasiOak", "casio-g-shock-ga2100", fashion.Id, "Watches", "Casio",
            "Iconic octagonal bezel design with carbon core guard structure. Shock and water resistant.",
            "Carbon Core Guard, 200m Water Resistant, World Time",
            29900, 34900, 14, 65, "casio-gshock.jpg",
            new[] { ("All Black", "#000000"), ("White", "#FFFFFF"), ("Navy", "#000080") },
            new[] { ("Water Resistance", "200 meters"), ("Battery", "3 years"), ("Features", "World Time, Stopwatch, Timer") },
            true, true, true, true, 4.7m));

        // 23. H&M Oversized Hoodie
        products.Add(CreateProduct(
            "H&M Oversized Cotton Hoodie", "hm-oversized-hoodie", fashion.Id, "Unisex", "H&M",
            "Relaxed fit hoodie in soft cotton blend with kangaroo pocket and ribbed trims.",
            "Cotton Blend, Oversized Fit, Kangaroo Pocket",
            7900, 9900, 20, 150, "hm-hoodie.jpg",
            new[] { ("Black", "#000000"), ("Gray Melange", "#808080"), ("Sage Green", "#9CAF88") },
            new[] { ("Material", "80% Cotton, 20% Polyester"), ("Fit", "Oversized"), ("Care", "Machine Washable") },
            false, true, true, false, 4.3m));

        // 24. Zara Blazer
        products.Add(CreateProduct(
            "Zara Slim Fit Blazer", "zara-slim-fit-blazer", fashion.Id, "Men's Clothing", "Zara",
            "Modern slim-fit blazer in stretch fabric with notched lapels and flap pockets.",
            "Stretch Fabric, Slim Fit, Notched Lapels",
            18900, 22900, 17, 50, "zara-blazer.jpg",
            new[] { ("Navy Blue", "#000080"), ("Black", "#000000"), ("Gray", "#808080") },
            new[] { ("Material", "Polyester Blend with Stretch"), ("Fit", "Slim"), ("Pockets", "Flap") },
            false, true, true, false, 4.4m));

        // 25. Fossil Watch
        products.Add(CreateProduct(
            "Fossil Grant Chronograph Watch", "fossil-grant-chronograph", fashion.Id, "Watches", "Fossil",
            "Classic chronograph with Roman numeral dial, genuine leather strap, and 24-hour subdial.",
            "Chronograph, Leather Strap, 44mm Case",
            32900, 38900, 15, 45, "fossil-watch.jpg",
            new[] { ("Brown/Blue", "#8B4513"), ("Black/Silver", "#000000") },
            new[] { ("Case Size", "44mm"), ("Movement", "Quartz Chronograph"), ("Water Resistance", "50m") },
            false, false, true, false, 4.5m));

        // 26. Converse Chuck Taylor
        products.Add(CreateProduct(
            "Converse Chuck Taylor All Star High", "converse-chuck-taylor-high", fashion.Id, "Shoes", "Converse",
            "The iconic high-top canvas sneaker that's been a style staple since 1917.",
            "Canvas Upper, Rubber Toe Cap, Vulcanized Sole",
            14900, 17900, 17, 100, "converse-chuck.jpg",
            new[] { ("Black", "#000000"), ("White", "#FFFFFF"), ("Red", "#FF0000"), ("Navy", "#000080") },
            new[] { ("Upper", "Canvas"), ("Sole", "Vulcanized Rubber"), ("Style", "High Top") },
            false, false, true, true, 4.6m));

        // 27. Under Armour Sports Bra
        products.Add(CreateProduct(
            "Under Armour Infinity High Sports Bra", "ua-infinity-sports-bra", fashion.Id, "Women's Clothing", "Under Armour",
            "High-support sports bra with HeatGear fabric and molded cups for maximum comfort.",
            "HeatGear Fabric, High Support, Molded Cups",
            8900, 10900, 18, 80, "ua-sports-bra.jpg",
            new[] { ("Black", "#000000"), ("White", "#FFFFFF"), ("Pink", "#FF69B4") },
            new[] { ("Support", "High"), ("Material", "HeatGear"), ("Closure", "Back Hook-and-eye") },
            false, true, true, false, 4.5m));

        // ==================== HOME & LIVING (10 products) ====================

        // 28. Dyson V15 Detect
        products.Add(CreateProduct(
            "Dyson V15 Detect Absolute Vacuum", "dyson-v15-detect", homeLiving.Id, "Appliances", "Dyson",
            "Intelligently adapts suction power. Laser reveals microscopic dust. LCD screen shows proof.",
            "Laser Dust Detection, 60min Runtime, HEPA Filtration",
            249900, 279900, 11, 25, "dyson-v15.jpg",
            new[] { ("Yellow/Nickel", "#FFD700") },
            new[] { ("Runtime", "Up to 60 minutes"), ("Bin Volume", "0.76L"), ("Filtration", "Whole-machine HEPA") },
            true, true, true, false, 4.8m));

        // 29. Instant Pot Duo
        products.Add(CreateProduct(
            "Instant Pot Duo 7-in-1 Electric Cooker", "instant-pot-duo-7in1", homeLiving.Id, "Kitchen", "Instant Pot",
            "7 appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, and more.",
            "7-in-1 Functionality, 6 Quart, Stainless Steel",
            24900, 29900, 17, 60, "instant-pot.jpg",
            new[] { ("Stainless Steel", "#C0C0C0") },
            new[] { ("Capacity", "6 Quart"), ("Functions", "7-in-1"), ("Material", "Stainless Steel Inner Pot") },
            true, false, true, true, 4.7m));

        // 30. KitchenAid Stand Mixer
        products.Add(CreateProduct(
            "KitchenAid Artisan Stand Mixer 5Qt", "kitchenaid-artisan-mixer", homeLiving.Id, "Kitchen", "KitchenAid",
            "Iconic stand mixer with 10 speeds, tilt-head design, and over 10 attachments available.",
            "5 Quart Bowl, 10 Speeds, Tilt-Head Design",
            129900, 149900, 13, 30, "kitchenaid-mixer.jpg",
            new[] { ("Empire Red", "#BF0A30"), ("Onyx Black", "#353839"), ("White", "#FFFFFF") },
            new[] { ("Bowl Size", "5 Quart"), ("Speeds", "10"), ("Power", "325 Watts") },
            true, false, true, false, 4.8m));

        // 31. Philips Air Fryer XXL
        products.Add(CreateProduct(
            "Philips Premium Airfryer XXL", "philips-airfryer-xxl", homeLiving.Id, "Kitchen", "Philips",
            "Family-size air fryer with Fat Removal technology and Smart Sensing for perfect results.",
            "XXL Capacity, Smart Sensing, Fat Removal Technology",
            64900, 74900, 13, 40, "philips-airfryer.jpg",
            new[] { ("Black", "#000000") },
            new[] { ("Capacity", "1.4kg / 7L"), ("Power", "2225W"), ("Technology", "Rapid Air") },
            true, true, true, true, 4.6m));

        // 32. IKEA MALM Bed Frame
        products.Add(CreateProduct(
            "IKEA MALM Queen Bed Frame", "ikea-malm-bed-frame", homeLiving.Id, "Furniture", "IKEA",
            "Clean modern design bed frame with 4 storage drawers and adjustable bed sides.",
            "Queen Size, 4 Storage Drawers, Adjustable Sides",
            79900, 89900, 11, 20, "ikea-malm-bed.jpg",
            new[] { ("White", "#FFFFFF"), ("Black-Brown", "#3C3C3C"), ("Oak Veneer", "#C19A6B") },
            new[] { ("Size", "Queen (160x200cm)"), ("Storage", "4 Drawers"), ("Material", "Particleboard") },
            false, false, true, false, 4.4m));

        // 33. Nespresso Vertuo
        products.Add(CreateProduct(
            "Nespresso Vertuo Next Coffee Machine", "nespresso-vertuo-next", homeLiving.Id, "Kitchen", "Nespresso",
            "Centrifusion technology brews perfect coffee and espresso at the touch of a button.",
            "Centrifusion Technology, 5 Cup Sizes, WiFi Connected",
            44900, 54900, 18, 35, "nespresso-vertuo.jpg",
            new[] { ("Matte Black", "#1C1C1E"), ("Chrome", "#C0C0C0"), ("White", "#FFFFFF") },
            new[] { ("Technology", "Centrifusion"), ("Cup Sizes", "5"), ("Water Tank", "1.1L") },
            true, true, true, false, 4.5m));

        // 34. iRobot Roomba j7+
        products.Add(CreateProduct(
            "iRobot Roomba j7+ Robot Vacuum", "irobot-roomba-j7-plus", homeLiving.Id, "Appliances", "iRobot",
            "Smart robot vacuum that identifies and avoids obstacles. Self-emptying Clean Base included.",
            "PrecisionVision Navigation, Self-Emptying, Smart Mapping",
            199900, 229900, 13, 20, "roomba-j7.jpg",
            new[] { ("Graphite", "#4A4A4A") },
            new[] { ("Navigation", "PrecisionVision"), ("Battery", "Up to 75 minutes"), ("Dustbin", "Self-emptying") },
            true, true, true, false, 4.6m));

        // 35. LG 55" OLED TV
        products.Add(CreateProduct(
            "LG 55\" OLED evo C3 4K Smart TV", "lg-oled-c3-55", homeLiving.Id, "Electronics", "LG",
            "Self-lit OLED pixels for perfect blacks and infinite contrast. a9 Gen6 AI Processor.",
            "55\" OLED evo, a9 Gen6 AI, Dolby Vision IQ",
            449900, 499900, 10, 20, "lg-oled-c3.jpg",
            new[] { ("Black", "#000000") },
            new[] { ("Display", "55\" OLED evo"), ("Resolution", "4K UHD"), ("HDR", "Dolby Vision IQ") },
            true, false, true, false, 4.8m));

        // 36. Tempur-Pedic Pillow
        products.Add(CreateProduct(
            "Tempur-Pedic TEMPUR-Cloud Pillow", "tempur-cloud-pillow", homeLiving.Id, "Bedding", "Tempur-Pedic",
            "Extra-soft TEMPUR material adapts to your head and neck for personalized support.",
            "TEMPUR Material, Extra Soft Feel, Washable Cover",
            19900, 24900, 20, 80, "tempur-pillow.jpg",
            new[] { ("White", "#FFFFFF") },
            new[] { ("Material", "TEMPUR"), ("Feel", "Extra Soft"), ("Cover", "Machine Washable") },
            false, false, true, false, 4.5m));

        // 37. Ninja Blender
        products.Add(CreateProduct(
            "Ninja Professional Plus Blender", "ninja-professional-blender", homeLiving.Id, "Kitchen", "Ninja",
            "1400-peak-watt motor crushes ice and frozen ingredients. Auto-iQ programs for one-touch blending.",
            "1400W Motor, 72oz Pitcher, Auto-iQ Programs",
            29900, 34900, 14, 45, "ninja-blender.jpg",
            new[] { ("Black/Silver", "#000000") },
            new[] { ("Power", "1400 Peak Watts"), ("Capacity", "72oz"), ("Programs", "Auto-iQ") },
            false, true, true, false, 4.6m));

        // ==================== SPORTS & OUTDOORS (8 products) ====================

        // 38. Garmin Forerunner 265
        products.Add(CreateProduct(
            "Garmin Forerunner 265 GPS Watch", "garmin-forerunner-265", sports.Id, "Fitness", "Garmin",
            "Advanced GPS running watch with AMOLED display, training readiness, and race predictor.",
            "AMOLED Display, Training Readiness, 13-day Battery",
            134900, 149900, 10, 30, "garmin-forerunner-265.jpg",
            new[] { ("Black", "#000000"), ("Whitestone", "#E8E4DE"), ("Aqua", "#00CED1") },
            new[] { ("Display", "1.3\" AMOLED"), ("Battery", "Up to 13 days"), ("GPS", "Multi-band") },
            true, true, true, false, 4.7m));

        // 39. Yeti Rambler Bottle
        products.Add(CreateProduct(
            "YETI Rambler 26oz Bottle", "yeti-rambler-26oz", sports.Id, "Outdoor Gear", "YETI",
            "Double-wall vacuum insulated stainless steel keeps drinks cold or hot for hours.",
            "26oz Capacity, Vacuum Insulated, Dishwasher Safe",
            12900, null, null, 100, "yeti-rambler.jpg",
            new[] { ("Navy", "#000080"), ("Black", "#000000"), ("White", "#FFFFFF"), ("Seafoam", "#71D9B2") },
            new[] { ("Capacity", "26oz"), ("Material", "18/8 Stainless Steel"), ("Insulation", "Double-wall Vacuum") },
            false, false, false, true, 4.8m));

        // 40. Peloton Bike+
        products.Add(CreateProduct(
            "Peloton Bike+ Indoor Exercise Bike", "peloton-bike-plus", sports.Id, "Fitness", "Peloton",
            "Premium indoor bike with 24\" rotating HD touchscreen and Auto Follow resistance.",
            "24\" Rotating Screen, Auto Follow, Apple GymKit",
            649900, 749900, 13, 10, "peloton-bike.jpg",
            new[] { ("Black", "#000000") },
            new[] { ("Screen", "24\" HD Touchscreen"), ("Resistance", "Auto Follow"), ("Connectivity", "Apple GymKit") },
            true, false, true, false, 4.6m));

        // 41. The North Face Backpack
        products.Add(CreateProduct(
            "The North Face Borealis Backpack", "north-face-borealis", sports.Id, "Outdoor Gear", "The North Face",
            "Classic 28L daypack with laptop sleeve, FlexVent suspension, and water bottle pockets.",
            "28L Capacity, FlexVent Suspension, Laptop Sleeve",
            24900, 28900, 14, 60, "north-face-backpack.jpg",
            new[] { ("TNF Black", "#000000"), ("Summit Navy", "#003366"), ("Vintage White", "#F5F5DC") },
            new[] { ("Capacity", "28L"), ("Laptop", "15\" Sleeve"), ("Suspension", "FlexVent") },
            false, true, true, true, 4.6m));

        // 42. Fitbit Charge 6
        products.Add(CreateProduct(
            "Fitbit Charge 6 Fitness Tracker", "fitbit-charge-6", sports.Id, "Fitness", "Fitbit",
            "Advanced fitness tracker with built-in GPS, heart rate monitoring, and Google integration.",
            "Built-in GPS, Heart Rate, 7-day Battery",
            44900, 49900, 10, 70, "fitbit-charge-6.jpg",
            new[] { ("Black", "#000000"), ("Coral", "#FF7F50"), ("Porcelain", "#ECE4DB") },
            new[] { ("Display", "AMOLED Touchscreen"), ("Battery", "7 days"), ("GPS", "Built-in") },
            true, true, true, true, 4.5m));

        // 43. Coleman Camping Tent
        products.Add(CreateProduct(
            "Coleman Sundome 4-Person Tent", "coleman-sundome-tent", sports.Id, "Camping", "Coleman",
            "Easy-setup dome tent with WeatherTec system and large windows for ventilation.",
            "4-Person, WeatherTec System, 10-minute Setup",
            19900, 24900, 20, 35, "coleman-tent.jpg",
            new[] { ("Green", "#228B22"), ("Navy", "#000080") },
            new[] { ("Capacity", "4 Person"), ("Setup", "10 minutes"), ("Floor", "9' x 7'") },
            false, false, true, false, 4.4m));

        // 44. Manduka Yoga Mat
        products.Add(CreateProduct(
            "Manduka PRO Yoga Mat 6mm", "manduka-pro-yoga-mat", sports.Id, "Fitness", "Manduka",
            "Professional-grade yoga mat with lifetime guarantee. Dense cushioning and closed-cell surface.",
            "6mm Thick, Closed-Cell Surface, Lifetime Guarantee",
            34900, 39900, 13, 50, "manduka-yoga-mat.jpg",
            new[] { ("Black", "#000000"), ("Midnight", "#191970"), ("Purple", "#800080") },
            new[] { ("Thickness", "6mm"), ("Length", "71\""), ("Material", "PVC") },
            false, true, true, false, 4.7m));

        // 45. Hydro Flask Bottle
        products.Add(CreateProduct(
            "Hydro Flask 32oz Wide Mouth", "hydro-flask-32oz", sports.Id, "Outdoor Gear", "Hydro Flask",
            "Pro-grade stainless steel bottle keeps drinks cold 24 hours or hot 12 hours.",
            "32oz, TempShield Insulation, Flex Cap",
            9900, 11900, 17, 120, "hydro-flask.jpg",
            new[] { ("Pacific", "#4169E1"), ("Black", "#000000"), ("White", "#FFFFFF"), ("Hibiscus", "#B6316C") },
            new[] { ("Capacity", "32oz"), ("Cold", "24 hours"), ("Hot", "12 hours") },
            false, false, true, true, 4.7m));

        // ==================== BEAUTY & HEALTH (8 products) ====================

        // 46. Dyson Airwrap
        products.Add(CreateProduct(
            "Dyson Airwrap Multi-Styler Complete", "dyson-airwrap-complete", beauty.Id, "Hair Care", "Dyson",
            "Style, smooth, and hide flyaways with no extreme heat. Coanda airflow technology.",
            "Coanda Airflow, Multiple Attachments, No Extreme Heat",
            189900, 199900, 5, 25, "dyson-airwrap.jpg",
            new[] { ("Nickel/Copper", "#B87333") },
            new[] { ("Technology", "Coanda Airflow"), ("Attachments", "6 included"), ("Heat", "No extreme heat") },
            true, true, true, true, 4.7m));

        // 47. Foreo Luna 4
        products.Add(CreateProduct(
            "FOREO LUNA 4 Facial Cleansing Device", "foreo-luna-4", beauty.Id, "Skincare", "FOREO",
            "Smart facial cleansing device with T-Sonic pulsations for 99.5% cleaner skin.",
            "T-Sonic Pulsations, App Connected, Waterproof",
            64900, 74900, 13, 40, "foreo-luna-4.jpg",
            new[] { ("Lavender", "#E6E6FA"), ("Mint", "#98FF98"), ("Fuchsia", "#FF00FF") },
            new[] { ("Technology", "T-Sonic"), ("Battery", "Up to 600 uses"), ("Material", "Medical-grade Silicone") },
            true, true, true, false, 4.6m));

        // 48. The Ordinary Set
        products.Add(CreateProduct(
            "The Ordinary The Balance Set", "the-ordinary-balance-set", beauty.Id, "Skincare", "The Ordinary",
            "Complete skincare regimen for oily and blemish-prone skin. Niacinamide and Salicylic Acid.",
            "5-Piece Set, For Oily Skin, Clinical Formulations",
            8900, 10900, 18, 80, "the-ordinary-set.jpg",
            new[] { ("Standard", "#FFFFFF") },
            new[] { ("Pieces", "5"), ("Skin Type", "Oily/Blemish-prone"), ("Key Ingredients", "Niacinamide, Salicylic Acid") },
            false, true, true, true, 4.5m));

        // 49. Oral-B iO Series 9
        products.Add(CreateProduct(
            "Oral-B iO Series 9 Electric Toothbrush", "oral-b-io-series-9", beauty.Id, "Dental Care", "Oral-B",
            "Revolutionary magnetic drive with AI-powered brushing recognition and 3D tracking.",
            "Magnetic Drive, AI Recognition, 7 Smart Modes",
            74900, 89900, 17, 35, "oral-b-io-9.jpg",
            new[] { ("Black Onyx", "#353935"), ("Rose Quartz", "#AA98A9"), ("White Alabaster", "#EDEAE0") },
            new[] { ("Technology", "Magnetic iO Drive"), ("Modes", "7 Smart Modes"), ("Battery", "Up to 2 weeks") },
            true, true, true, false, 4.7m));

        // 50. Theragun PRO
        products.Add(CreateProduct(
            "Theragun PRO Massage Device", "theragun-pro", beauty.Id, "Wellness", "Therabody",
            "Professional-grade percussive therapy device with adjustable arm and smart app integration.",
            "Smart App, Adjustable Arm, 5 Attachments",
            189900, 209900, 10, 20, "theragun-pro.jpg",
            new[] { ("Black", "#000000") },
            new[] { ("Speed Range", "1750-2400 PPM"), ("Amplitude", "16mm"), ("Battery", "150 minutes") },
            true, false, true, false, 4.8m));

        // 51. Philips Sonicare
        products.Add(CreateProduct(
            "Philips Sonicare DiamondClean 9000", "philips-sonicare-9000", beauty.Id, "Dental Care", "Philips",
            "Smart electric toothbrush with pressure sensor and 4 brushing modes.",
            "Sonic Technology, Pressure Sensor, 4 Modes",
            49900, 59900, 17, 45, "philips-sonicare.jpg",
            new[] { ("White", "#FFFFFF"), ("Black", "#000000"), ("Pink", "#FFC0CB") },
            new[] { ("Technology", "Sonic"), ("Modes", "4"), ("Battery", "Up to 2 weeks") },
            false, true, true, false, 4.6m));

        // 52. CeraVe Skincare Set
        products.Add(CreateProduct(
            "CeraVe Daily Skincare Set", "cerave-daily-skincare-set", beauty.Id, "Skincare", "CeraVe",
            "Complete daily routine with Hydrating Cleanser, AM/PM Moisturizers with SPF.",
            "3-Piece Set, Essential Ceramides, Dermatologist Recommended",
            7900, 9900, 20, 100, "cerave-set.jpg",
            new[] { ("Standard", "#FFFFFF") },
            new[] { ("Pieces", "3"), ("Key Ingredients", "Ceramides, Hyaluronic Acid"), ("Skin Type", "All") },
            false, false, true, true, 4.5m));

        // 53. NuFace Trinity
        products.Add(CreateProduct(
            "NuFACE Trinity+ Facial Toning Device", "nuface-trinity-plus", beauty.Id, "Skincare", "NuFACE",
            "Professional at-home microcurrent facial toning device with smart app connectivity.",
            "Microcurrent Technology, App Connected, FDA Cleared",
            124900, 139900, 11, 25, "nuface-trinity.jpg",
            new[] { ("White", "#FFFFFF") },
            new[] { ("Technology", "Microcurrent"), ("Treatment Time", "5-20 minutes"), ("FDA", "Cleared") },
            true, true, true, false, 4.5m));

        // ==================== TOYS & GAMES (5 products) ====================

        // 54. LEGO Technic
        products.Add(CreateProduct(
            "LEGO Technic Ferrari Daytona SP3", "lego-technic-ferrari-daytona", toys.Id, "Building Sets", "LEGO",
            "Ultimate collector's building set with 3778 pieces. Authentic V12 engine details.",
            "3778 Pieces, V12 Engine, 1:8 Scale",
            124900, null, null, 15, "lego-ferrari.jpg",
            new[] { ("Red/Black", "#FF0000") },
            new[] { ("Pieces", "3778"), ("Scale", "1:8"), ("Age", "18+") },
            true, true, false, false, 4.9m));

        // 55. DJI Mini Drone for Kids
        products.Add(CreateProduct(
            "DJI Tello EDU Programmable Drone", "dji-tello-edu", toys.Id, "Drones", "DJI",
            "Educational drone that teaches programming with Scratch, Python, and Swift.",
            "720p HD Camera, 13min Flight, Programmable",
            34900, 39900, 13, 40, "dji-tello.jpg",
            new[] { ("White", "#FFFFFF") },
            new[] { ("Camera", "720p HD"), ("Flight Time", "13 minutes"), ("Programming", "Scratch, Python, Swift") },
            false, true, true, false, 4.4m));

        // 56. Board Game Catan
        products.Add(CreateProduct(
            "CATAN Board Game", "catan-board-game", toys.Id, "Board Games", "Catan Studio",
            "The classic strategy game of trading and building. Perfect for 3-4 players.",
            "3-4 Players, 60-120 min, Ages 10+",
            12900, 14900, 13, 60, "catan-game.jpg",
            new[] { ("Standard", "#CD853F") },
            new[] { ("Players", "3-4"), ("Play Time", "60-120 minutes"), ("Age", "10+") },
            false, false, true, true, 4.7m));

        // 57. Hot Wheels Ultimate Garage
        products.Add(CreateProduct(
            "Hot Wheels Ultimate Garage Playset", "hot-wheels-ultimate-garage", toys.Id, "Vehicles", "Hot Wheels",
            "Massive garage tower stores 100+ cars with motorized gorilla and racing track.",
            "100+ Car Storage, Motorized, Multi-level Track",
            29900, 34900, 14, 30, "hot-wheels-garage.jpg",
            new[] { ("Multi", "#FF4500") },
            new[] { ("Storage", "100+ Cars"), ("Levels", "3 feet tall"), ("Features", "Motorized Gorilla") },
            false, true, true, false, 4.5m));

        // 58. Monopoly Classic
        products.Add(CreateProduct(
            "Monopoly Classic Board Game", "monopoly-classic", toys.Id, "Board Games", "Hasbro",
            "The world's favorite family board game. Buy, sell, and trade properties.",
            "2-8 Players, Classic Gameplay, All Ages",
            7900, 9900, 20, 80, "monopoly-classic.jpg",
            new[] { ("Standard", "#00A86B") },
            new[] { ("Players", "2-8"), ("Age", "8+"), ("Contents", "Board, cards, tokens, houses, hotels") },
            false, false, true, true, 4.4m));

        context.Products.AddRange(products);
        return products;
    }

    private static Product CreateProduct(
        string name, string slug, Guid categoryId, string subCategory, string brand,
        string description, string shortDescription,
        decimal price, decimal? originalPrice, int? discount,
        int stock, string imageFile,
        (string Name, string Color)[] variants,
        (string Label, string Value)[] specs,
        bool isFeatured, bool isNew, bool isOnSale, bool isBestSeller, decimal rating)
    {
        var productId = Guid.NewGuid();
        var baseSku = slug.ToUpper().Replace("-", "");

        var product = new Product
        {
            Id = productId,
            Name = name,
            Slug = slug,
            Description = description,
            ShortDescription = shortDescription,
            CategoryId = categoryId,
            SubCategory = subCategory,
            Brand = brand,
            Stock = stock,
            Sku = $"{baseSku.Substring(0, Math.Min(8, baseSku.Length))}{productId.ToString().Substring(0, 4).ToUpper()}",
            Rating = rating,
            ReviewCount = Random.Shared.Next(10, 500),
            IsFeatured = isFeatured,
            IsNew = isNew,
            IsOnSale = isOnSale,
            IsBestSeller = isBestSeller,
            Warranty = "1 year manufacturer warranty",
            DeliveryInfo = price > 50000 ? "Free delivery" : "Free delivery on orders over Rs. 5,000",
            CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 90)),
            UpdatedAt = DateTime.UtcNow
        };

        product.Prices.Add(new ProductPrice
        {
            Id = Guid.NewGuid(),
            Amount = price,
            OriginalAmount = originalPrice,
            Currency = "Rs.",
            DiscountPercentage = discount,
            IsActive = true,
            ValidFrom = DateTime.UtcNow.AddDays(-30),
            ValidUntil = discount.HasValue ? DateTime.UtcNow.AddDays(30) : null
        });

        product.Images.Add(new ProductImage
        {
            Id = Guid.NewGuid(),
            Url = $"/products/{imageFile}",
            AltText = name,
            IsPrimary = true,
            SortOrder = 0,
            CreatedAt = DateTime.UtcNow
        });

        int variantIndex = 0;
        foreach (var (variantName, colorCode) in variants)
        {
            var variantId = Guid.NewGuid();
            product.Variants.Add(new ProductVariant
            {
                Id = variantId,
                Name = variantName,
                Type = "color",
                Value = variantName,
                ColorCode = colorCode,
                PriceModifier = 0,
                Stock = stock / variants.Length,
                Sku = $"{product.Sku}-V{variantIndex++}",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        int sortOrder = 0;
        foreach (var (label, value) in specs)
        {
            product.Specifications.Add(new ProductSpecification
            {
                Id = Guid.NewGuid(),
                Label = label,
                Value = value,
                GroupName = "Specifications",
                SortOrder = sortOrder++
            });
        }

        return product;
    }

    private static List<Coupon> SeedCoupons(VgoDbContext context)
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
                Code = "TECH20",
                Type = "percentage",
                Value = 20,
                MinOrderAmount = 10000,
                MaxDiscount = 15000,
                ValidFrom = DateTime.UtcNow.AddDays(-7),
                ValidUntil = DateTime.UtcNow.AddDays(23),
                IsActive = true,
                Description = "20% off on electronics (max Rs. 15,000 discount)",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Coupon
            {
                Id = Guid.NewGuid(),
                Code = "FREESHIP",
                Type = "fixed",
                Value = 350,
                MinOrderAmount = 3000,
                ValidFrom = DateTime.UtcNow,
                ValidUntil = DateTime.UtcNow.AddDays(30),
                IsActive = true,
                Description = "Free standard shipping on orders above Rs. 3,000",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Coupon
            {
                Id = Guid.NewGuid(),
                Code = "MEGA25",
                Type = "percentage",
                Value = 25,
                MinOrderAmount = 25000,
                MaxDiscount = 25000,
                ValidFrom = DateTime.UtcNow,
                ValidUntil = DateTime.UtcNow.AddDays(14),
                IsActive = true,
                Description = "25% off on orders above Rs. 25,000 (max Rs. 25,000 discount)",
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
            AvatarUrl = "/products/avatars/demo-user.jpg",
            DateOfBirth = new DateTime(1990, 5, 15, 0, 0, 0, DateTimeKind.Utc),
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
            AddressLine1 = "123 Galle Road",
            AddressLine2 = "Apartment 4B",
            City = "Colombo 03",
            District = "Colombo",
            PostalCode = "00300",
            Country = "Sri Lanka",
            IsDefault = true,
            Type = "home",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        user.Addresses.Add(new Address
        {
            Id = Guid.NewGuid(),
            Label = "Office",
            FirstName = "Demo",
            LastName = "User",
            Phone = "+94771234567",
            AddressLine1 = "456 Duplication Road",
            AddressLine2 = "5th Floor, Tech Park",
            City = "Colombo 04",
            District = "Colombo",
            PostalCode = "00400",
            Country = "Sri Lanka",
            IsDefault = false,
            Type = "work",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });

        context.Users.Add(user);
        return user;
    }

    private static List<Review> SeedReviews(VgoDbContext context, List<Product> products, User user)
    {
        var reviews = new List<Review>();
        var reviewTexts = new[]
        {
            ("Excellent product!", "Absolutely love this product. Exceeded my expectations in every way. Highly recommended for anyone looking for quality."),
            ("Great value for money", "This product delivers exactly what it promises. Great build quality and excellent performance. Worth every penny."),
            ("Perfect purchase", "Couldn't be happier with this purchase. Fast delivery and the product works flawlessly."),
            ("Highly recommended", "Been using this for a few weeks now and I'm very impressed. Quality is top-notch."),
            ("Amazing quality", "The quality of this product is outstanding. It's clear that a lot of thought went into the design.")
        };

        for (int i = 0; i < Math.Min(20, products.Count); i++)
        {
            var (title, comment) = reviewTexts[i % reviewTexts.Length];
            var review = new Review
            {
                Id = Guid.NewGuid(),
                ProductId = products[i].Id,
                UserId = user.Id,
                Rating = Random.Shared.Next(4, 6),
                Title = title,
                Comment = comment,
                IsVerifiedPurchase = true,
                HelpfulCount = Random.Shared.Next(0, 50),
                CreatedAt = DateTime.UtcNow.AddDays(-Random.Shared.Next(1, 60)),
                UpdatedAt = DateTime.UtcNow
            };

            reviews.Add(review);
        }

        context.Reviews.AddRange(reviews);
        return reviews;
    }
}
