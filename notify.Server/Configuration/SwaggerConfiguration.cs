//dotnet add package Swashbuckle.AspNetCore.Annotations
//to add data annotations for the api endpoint
using Microsoft.OpenApi.Models;

namespace API_TEMPLATE.Configuration
{
    public class SwaggerConfiguration
    {
        private readonly IConfiguration _configuration;

        public SwaggerConfiguration(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Configure API versioning
          

            // Add Swagger and configure SwaggerGen
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                // Use the IServiceProvider to resolve IApiVersionDescriptionProvider
                var serviceProvider = services.BuildServiceProvider();
                
                // Add Bearer Token Authentication support
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter JWT token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "bearer"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });
        }

       
    }
}