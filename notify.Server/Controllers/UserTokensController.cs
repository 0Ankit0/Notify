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
using Notify.Server.Data.Users;

namespace notify.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserTokensController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICustomMethods _customMethods;

        public UserTokensController(ApplicationDbContext context,ICustomMethods customMethods)
        {
            _context = context;
            _customMethods = customMethods;
        }

        // GET: api/UserTokens
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserTokenModel>>> Get()
        {
            return await _context.UserTokens.Select(ut => new UserTokenModel
            {
                Id = ut.Id,
                UserId = ut.UserId,
                ProviderId = ut.ProviderId,
                Token = ut.Token,
                CreatedAt = ut.CreatedAt
            }).ToListAsync();
        }

        // GET: api/UserTokens/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserTokenModel>> Get(int id)
        {
            var userToken = await _context.UserTokens.FindAsync(id);

            if (userToken == null)
            {
                return NotFound();
            }
            UserTokenModel userTokenModel = new UserTokenModel();
            _customMethods.MapProperties(userToken, userTokenModel);

            return userTokenModel;
        }

        // PUT: api/UserTokens/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut()]
        public async Task<IActionResult> Put(UserTokenModel userTokenModel)
        {
            int id = userTokenModel.Id ?? 0;
            if (id ==0 || string.IsNullOrEmpty(userTokenModel.Token))
            {
                return BadRequest();
            }
            UserToken userToken = new UserToken();
            userToken.Token = userTokenModel.Token;
            _context.Entry(userToken).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserTokenExists(id))
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

        // POST: api/UserTokens
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserTokenModel>> Post(UserTokenModel userTokenModel)
        {
            UserToken userToken = new UserToken();
            _customMethods.MapProperties(userTokenModel, userToken);
            _context.UserTokens.Add(userToken);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserToken", new { id = userToken.Id }, userTokenModel);
        }

        // DELETE: api/UserTokens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userToken = await _context.UserTokens.FindAsync(id);
            if (userToken == null)
            {
                return NotFound();
            }

            _context.UserTokens.Remove(userToken);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserTokenExists(int id)
        {
            return _context.UserTokens.Any(e => e.Id == id);
        }
    }
}
