using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Notify.Server.Data;
using Notify.Server.Data.Users;

namespace notify.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMastersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserMastersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/UserMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserMaster>>> GetUserMasters()
        {
            return await _context.UserMasters.ToListAsync();
        }

        // GET: api/UserMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserMaster>> GetUserMaster(int id)
        {
            var userMaster = await _context.UserMasters.FindAsync(id);

            if (userMaster == null)
            {
                return NotFound();
            }

            return userMaster;
        }

        // PUT: api/UserMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserMaster(int id, UserMaster userMaster)
        {
            if (id != userMaster.UserId)
            {
                return BadRequest();
            }

            _context.Entry(userMaster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserMasterExists(id))
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

        // POST: api/UserMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserMaster>> PostUserMaster(UserMaster userMaster)
        {
            _context.UserMasters.Add(userMaster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserMaster", new { id = userMaster.UserId }, userMaster);
        }

        // DELETE: api/UserMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserMaster(int id)
        {
            var userMaster = await _context.UserMasters.FindAsync(id);
            if (userMaster == null)
            {
                return NotFound();
            }

            _context.UserMasters.Remove(userMaster);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserMasterExists(int id)
        {
            return _context.UserMasters.Any(e => e.UserId == id);
        }
    }
}
