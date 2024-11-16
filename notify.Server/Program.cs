using API_TEMPLATE.Configuration;
using Microsoft.EntityFrameworkCore;
using notify.Server.Classes;
using notify.Server.Filters;
using Notify.Server.Data;
using Notify.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register CustomMethods as a service
builder.Services.AddScoped<ICustomMethods, CustomMethods>();

// Add the TokenValidationFilter as a service
builder.Services.AddScoped<TokenValidationFilter>();

// Register the notification service in the dependency injection container.
builder.Services.AddHttpClient<INotificationService, NotificationService>();

// Configure the DbContext with a connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS services and define a policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Instantiate the JWT configuration class
var jwtConfig = new JwtConfiguration(builder.Configuration);

// Configure services using the instance
jwtConfig.ConfigureServices(builder.Services);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Apply the CORS policy
app.UseCors("AllowSpecificOrigins");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
