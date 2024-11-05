using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Notify.Server.Data;
using Notify.Server.Data.Providers;

namespace notify.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProviderMastersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProviderMastersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProviderMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProviderMaster>>> GetProviderMasters()
        {
            return await _context.ProviderMasters.ToListAsync();
        }

        // GET: api/ProviderMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProviderMaster>> GetProviderMaster(int id)
        {
            var providerMaster = await _context.ProviderMasters.FindAsync(id);

            if (providerMaster == null)
            {
                return NotFound();
            }

            return providerMaster;
        }

        // PUT: api/ProviderMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProviderMaster(int id, ProviderMaster providerMaster)
        {
            if (id != providerMaster.ProviderId)
            {
                return BadRequest();
            }

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
        public async Task<ActionResult<ProviderMaster>> PostProviderMaster(ProviderMaster providerMaster)
        {
            _context.ProviderMasters.Add(providerMaster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProviderMaster", new { id = providerMaster.ProviderId }, providerMaster);
        }

        // DELETE: api/ProviderMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProviderMaster(int id)
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
