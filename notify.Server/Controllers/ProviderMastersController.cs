using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using notify.Server.Classes;
using notify.Server.Models;
using Notify.Server.Data;
using Notify.Server.Data.Providers;
using Notify.Server.Data.Users;
using Notify.Server.Models;

namespace notify.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProviderMastersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICustomMethods _customMethods;

        public ProviderMastersController(ApplicationDbContext context,ICustomMethods customMethods)
        {
            _context = context;
            _customMethods = customMethods;
        }

        // GET: api/ProviderMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProviderResponseModel>>> Get()
        {
            return await _context.ProviderMasters
                 .GroupJoin(_context.UserTokens,
                            provider => provider.ProviderId,
                            token => token.ProviderId,
                            (provider, tokens) => new { provider, tokens })
                 .SelectMany(
                     pt => pt.tokens.DefaultIfEmpty(),
                     (pt, token) => new ProviderResponseModel
                     {
                         Id = pt.provider.ProviderId,
                         Alias = pt.provider.Alias,
                         Token = token != null ? token.Token : null,
                         Provider = pt.provider.Provider.ToString(),
                         ProviderId = pt.provider.ProviderId.ToString(),
                         Secret = pt.provider.Secret,
                         CreatedAt = pt.provider.CreatedAt
                     })
                 .ToListAsync();



        }

        // GET: api/ProviderMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProviderResponseModel>> Get(int id)
        {
            var provider = await _context.ProviderMasters
                .Where(p => p.ProviderId == id)
                .GroupJoin(_context.UserTokens,
                           provider => provider.ProviderId,
                           token => token.ProviderId,
                           (provider, tokens) => new { provider, tokens })
                .SelectMany(
                    pt => pt.tokens.DefaultIfEmpty(),
                    (pt, token) => new ProviderResponseModel
                    {
                        Id = pt.provider.ProviderId,
                        Alias = pt.provider.Alias,
                        Token = token != null ? token.Token : null,
                        Provider = pt.provider.ProviderId.ToString(),
                        Secret = pt.provider.Secret,
                        CreatedAt = pt.provider.CreatedAt
                    })
                .FirstOrDefaultAsync();

            if (provider == null)
            {
                return NotFound();
            }

            return provider;
        }


        // PUT: api/ProviderMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] ProviderModel providerModel)
        {

            int id = providerModel.ProviderId ?? 0;
            if (id ==0)
            {
                return BadRequest();
            }
            var providerMaster = await _context.ProviderMasters.FindAsync(id);
            if (providerMaster == null)
            {
                return NotFound();
            }
            var user = HttpContext.Items["User"] as AuthenticatedUser;
            var userToken = await _context.UserTokens.FirstOrDefaultAsync(ut => ut.ProviderId == id);
            if (userToken is not null){
                userToken.Token = providerModel.Token;
                _context.Entry(userToken).State = EntityState.Modified;
            }
            else
            {
                userToken = new UserToken
                {
                    ProviderId = id,
                    Token = providerModel.Token,
                    UserId = int.Parse(user.UserId),
                    CreatedAt = DateTime.Now
                };
                _context.UserTokens.Add(userToken);
            }
            providerMaster.Alias = providerModel.Alias;
            providerMaster.Provider = (ProviderEnum)providerModel.Provider;
            providerMaster.Secret = providerModel.Secret;
            _context.Entry(providerMaster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProviderMasterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(StatusCodes.Status200OK, providerModel);
        }
        
        // POST: api/ProviderMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProviderModel>> Post([FromBody] ProviderModel providerModel)
        {
            ProviderMaster providerMaster = new ProviderMaster();
            providerMaster.Provider = (ProviderEnum)providerModel.Provider;
            providerMaster.Secret = providerModel.Secret;
            providerMaster.Alias = providerModel.Alias;
            providerMaster.CreatedAt = DateTime.Now;
            //_customMethods.MapProperties(providerModel, providerMaster);

            _context.ProviderMasters.Add(providerMaster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Get", new { id = providerMaster.ProviderId }, providerModel);
        }

        // DELETE: api/ProviderMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var providerMaster = await _context.ProviderMasters.FindAsync(id);
            if (providerMaster == null)
            {
                return NotFound();
            }

            _context.ProviderMasters.Remove(providerMaster);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProviderMasterExists(int id)
        {
            return _context.ProviderMasters.Any(e => e.ProviderId == id);
        }
    }
}
