using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace VgoApi.Data;

public class VgoDbContextFactory : IDesignTimeDbContextFactory<VgoDbContext>
{
    public VgoDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<VgoDbContext>();
        
        // Use a default connection string for migrations
        var connectionString = "Host=localhost;Port=5432;Database=vgo_db;Username=postgres;Password=Icbt1234";
        optionsBuilder.UseNpgsql(connectionString);

        return new VgoDbContext(optionsBuilder.Options);
    }
}
