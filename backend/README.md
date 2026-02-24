# VGO API - .NET Core Backend

## Prerequisites

- .NET 10 SDK
- PostgreSQL 14+
- Visual Studio 2022 or VS Code

## Setup Instructions

### 1. Database Setup

Install PostgreSQL and create a database:

```sql
CREATE DATABASE vgo_db;
```

### 2. Update Connection String

Edit `appsettings.Development.json` and update the connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Database=vgo_db;Username=your_username;Password=your_password"
}
```

### 3. Install Entity Framework Tools

```bash
dotnet tool install --global dotnet-ef
```

### 4. Create and Run Migrations

```bash
cd backend/VgoApi
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 5. Run the API

```bash
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7001`
- HTTP: `http://localhost:5000`
- Swagger UI: `https://localhost:7001/swagger`

## API Documentation

Visit `/swagger` when the API is running to see interactive API documentation.

## Project Structure

```
VgoApi/
├── Models/           # Domain models
├── Data/             # DbContext and migrations
├── DTOs/             # Data Transfer Objects
├── Services/         # Business logic services
├── Endpoints/        # Minimal API endpoint definitions
├── Program.cs        # Application entry point
└── appsettings.json  # Configuration
```

## Environment Variables

For production, set these environment variables:

- `ConnectionStrings__DefaultConnection`: PostgreSQL connection string
- `Jwt__Key`: Secret key for JWT tokens (min 32 characters)
- `Jwt__Issuer`: JWT issuer
- `Jwt__Audience`: JWT audience

## Authentication

The API uses JWT Bearer tokens. To authenticate:

1. Register or login via `/api/v1/auth/register` or `/api/v1/auth/login`
2. Include the token in subsequent requests:
   ```
   Authorization: Bearer <your_token>
   ```

## Seeding Data

To seed the database with sample data, you can create a seed script or use the existing mock data from the frontend.

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify connection string is correct
- Check firewall settings

### Migration Issues

```bash
# Reset database
dotnet ef database drop
dotnet ef database update
```

### CORS Issues

Update the CORS policy in `Program.cs` to include your frontend URL.
