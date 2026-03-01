using ParkingLot.Api.Domain.Interfaces;
using ParkingLot.Api.Infrastructure.InMemory;
using ParkingLot.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// ✅ CORS for React (Vite)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});

// Swagger UI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Dependency Injection
builder.Services.AddSingleton<IParkingRepository, InMemoryParkingRepository>();
builder.Services.AddSingleton<PricingService>();
builder.Services.AddSingleton<ParkingAllocatorService>();
builder.Services.AddSingleton<TicketService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

// ✅ Use CORS BEFORE MapControllers
app.UseCors("AllowReact");

app.MapControllers();

app.Run();