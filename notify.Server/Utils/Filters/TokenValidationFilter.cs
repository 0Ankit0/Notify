using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Notify.Server.Data;
using System.Linq;
using System.Threading.Tasks;

namespace notify.Server.Filters
{
    public class TokenValidationFilter : IAsyncActionFilter
    {
        private readonly ApplicationDbContext _dbContext;

        public TokenValidationFilter(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!context.HttpContext.Request.Headers.TryGetValue("ApiToken", out var token))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var userToken = await _dbContext.UserTokens
                .Include(ut => ut.UserMaster)
                .FirstOrDefaultAsync(ut => ut.Token == token);

            if (userToken == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // Attach user information to the context
            context.HttpContext.Items["User"] = userToken.UserMaster;

            await next();
        }
    }
}
