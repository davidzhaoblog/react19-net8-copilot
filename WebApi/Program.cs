using AdventureWorksLT2019.WebApi.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore;
using Serilog;
using AdventureWorksLT2019.MSSqlRepositories;
using AdventureWorksLT2019.RepositoriesInterfaces;
using AdventureWorksLT2019.ServiceInterfaces;
using AdventureWorksLT2019.Services;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.DependencyInjection;
using AdventureWorksLT2019.WebApi;

var builder = WebApplication.CreateBuilder(args);

var allowSpecificOrigins = "AllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowSpecificOrigins,
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddRouting();
builder.Services
    // TODO: should have a solution, e.g. an attribute on a controller class/method to Suppress ModalState validation
    .AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true)
    //.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowReadingFromString;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        // options.JsonSerializerOptions.Converters.Add(new NetTopologySuite.IO.Converters.GeoJsonConverterFactory());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault;
    });

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

Log.Information("Application Starting");

// Add services to the container.
var identityConnectionString = builder.Configuration.GetConnectionString("IdentityConnection") ?? throw new InvalidOperationException("Connection string 'IdentityConnection' not found.");
var adventureWorksLT2019ConnectionConnectionString = builder.Configuration.GetConnectionString("AdventureWorksLT2019Connection") ?? throw new InvalidOperationException("Connection string 'AdventureWorksLT2019Connection' not found.");

builder.Services.AddDbContext<AdventureWorksLT2019.EFDbContext.AdventureWorksLT2019Context>(options =>
        options.UseSqlServer(
            adventureWorksLT2019ConnectionConnectionString, 
            x => { 
                x.EnableRetryOnFailure();
                x.MigrationsAssembly("AdventureWorksLT2019.WebApi");
                x.MigrationsHistoryTable("__AdventureWorksLT2019MigrationsHistory", "dbo");
            }), 
            ServiceLifetime.Scoped);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        identityConnectionString,
                x =>
                {
                    x.EnableRetryOnFailure();
                    x.MigrationsAssembly("AdventureWorksLT2019.WebApi");
                    x.MigrationsHistoryTable("__IdentityMigrationsHistory", "dbo");
                }));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddAuthentication()
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, cfg => cfg.SlidingExpiration = true)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, x =>
    {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("keykeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykeykey")),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

builder.Services
    .AddIdentityApiEndpoints<IdentityUser>(options => {
        options.SignIn.RequireConfirmedEmail = true;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register repository and service in the IoC container
builder.Services.AddScoped<IErrorLogRepository, ErrorLogRepository>();
builder.Services.AddScoped<IErrorLogService, ErrorLogService>();

var app = builder.Build();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await SeedData.InitializeAsync(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(allowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapIdentityApi<IdentityUser>();
app.AddCustomAuthenticationApiEndpoints();

app.Run();
