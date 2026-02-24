# VGO E-Commerce Platform - Setup Guide

## Quick Start

### Backend Setup

1. **Install PostgreSQL** (if not already installed)

2. **Configure Database Connection**
   
   Edit `backend/VgoApi/appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=vgo_db;Username=YOUR_USERNAME;Password=YOUR_PASSWORD"
     }
   }
   ```

3. **Start the Backend**
   ```bash
   cd backend/VgoApi
   dotnet run
   ```

   The backend will:
   - ✅ Create the database automatically
   - ✅ Run migrations
   - ✅ Seed sample data
   - ✅ Start on `http://localhost:5000` and `https://localhost:7001`

4. **Access Swagger UI**
   
   Open `https://localhost:7001/swagger` to test the API

### Frontend Setup

1. **Install Dependencies** (if not already done)
   ```bash
   npm install
   ```

2. **Start the Frontend**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## Demo Credentials

- **Email**: `demo@vgo.lk`
- **Password**: `Demo@123`

## Sample Data Included

- 5 categories with subcategories
- 12 products (iPhone, MacBook, and more)
- 3 shipping methods
- 4 payment methods
- 3 active coupons (WELCOME10, SAVE500, ELECTRONICS20)
- 1 demo user with address
- Product reviews

## API Endpoints

All endpoints are documented in Swagger UI at `https://localhost:7001/swagger`

### Key Endpoints

- **Authentication**: `/api/v1/auth/*`
- **Products**: `/api/v1/products/*`
- **Categories**: `/api/v1/categories/*`
- **Orders**: `/api/v1/orders/*`
- **Coupons**: `/api/v1/coupons/*`
- **Reviews**: `/api/v1/products/{id}/reviews`

## Frontend API Integration

The frontend now includes complete API services in `src/services/`:

- `authService.ts` - Authentication
- `productService.ts` - Products
- `categoryService.ts` - Categories
- `orderService.ts` - Orders
- `couponService.ts` - Coupons
- `reviewService.ts` - Reviews

See [Integration Guide](./integration-guide.md) for detailed usage examples.

## Troubleshooting

### Database Connection Failed

1. Ensure PostgreSQL is running
2. Check username and password in `appsettings.Development.json`
3. Verify the database user has permission to create databases

### Port Already in Use

If port 5000 or 7001 is in use, update `backend/VgoApi/Properties/launchSettings.json`

### CORS Errors

The backend is configured to allow requests from `http://localhost:5173`. If you're using a different port, update the CORS policy in `backend/VgoApi/Program.cs`

## Documentation

- [Backend README](../backend/README.md) - Backend setup and API documentation
- [Database Schema](./database-schema.md) - Complete database structure
- [API Documentation](./api-documentation.md) - Detailed API endpoint documentation
- [Integration Guide](./integration-guide.md) - Frontend-backend integration guide
