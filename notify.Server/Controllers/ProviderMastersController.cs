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

namespace notify.Server.Controllers
{
    [Route("api/Providers/[action]")]
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
        public async Task<ActionResult<IEnumerable<ProviderModel>>> Get()
        {
            return await _context.ProviderMasters.Select(p => new ProviderModel
            {
                ProviderId = p.ProviderId,
                Alias = p.Alias,
                Provider = p.Provider,
                Secret = p.Secret,
                CreatedAt = p.CreatedAt
            }).ToListAsync();
            
        }

        // GET: api/ProviderMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProviderModel>> Get(int id)
        {
            var providerMaster = await _context.ProviderMasters.FindAsync(id);

            if (providerMaster == null)
            {
                return NotFound();
            }
            ProviderModel providerModel = new ProviderModel();
            _customMethods.MapProperties(providerMaster, providerModel);

            return providerModel;
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
            ProviderMaster providerMaster = new ProviderMaster();
            providerMaster.Alias = providerModel.Alias;
            providerMaster.Provider = providerModel.Provider;
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

            return NoContent();
        }
        
        // POST: api/ProviderMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProviderModel>> Post([FromBody] ProviderModel providerModel)
        {
            ProviderMaster providerMaster = new ProviderMaster();
            providerMaster.Provider = providerModel.Provider;
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
