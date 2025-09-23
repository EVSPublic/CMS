var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Admin Panel API",
        Version = "v1",
        Description = "Clean admin panel backend - ready for development"
    });
});

// Add CORS for development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AdminPanelCORS", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Admin Panel API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AdminPanelCORS");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();