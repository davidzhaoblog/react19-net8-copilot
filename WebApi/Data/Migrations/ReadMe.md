When working with multiple DbContext classes in Entity Framework Core, you need to manage migrations for each DbContext separately. Here's how you can handle migrations for two DbContext classes:

# 1. Set Up Separate Migrations for Each DbContext
Each DbContext should have its own migrations folder and migration history table in the database. Assume you have two DbContext classes:
•	ApplicationDbContext (for Identity)
•	AdventureWorksLT2019Context (for your application data)

# 2. Create Migrations for Each DbContext
When adding migrations, use the --context option to specify which DbContext the migration applies to.
When you create migrations, specify the output directory and the context type. For example:
Run the following command to add migrations for ApplicationDbContext:
`dotnet ef migrations add InitialIdentitySchema --context ApplicationDbContext --output-dir Data/Migrations/MicrosoftIdentityFramework`
Run the following command to add migrations for AdventureWorksLT2019Context:
`dotnet ef migrations add InitialAdventureWorksSchema --context AdventureWorksLT2019Context --output-dir Data/Migrations/AdventureWorksLT2019`

# 3. Configure Separate Migration History Tables
You can configure separate migration history tables for each DbContext by overriding the OnModelCreating method in each DbContext class.

## ApplicationDbContext
```
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    modelBuilder.HasDefaultSchema("Identity");
    modelBuilder.Entity("__EFMigrationsHistory").ToTable("__IdentityMigrationsHistory");
}
```

## AdventureWorksLT2019Context
```
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    modelBuilder.HasDefaultSchema("Application");
    modelBuilder.Entity("__EFMigrationsHistory").ToTable("__ApplicationMigrationsHistory");
}
```

# 4. Update the Database
When updating the database, specify the context again:	
`dotnet ef database update --context ApplicationDbContext`
`dotnet ef database update --context AdventureWorksLT2019Context`