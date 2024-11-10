﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public class UserMastersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICustomMethods _customMethods;

        public UserMastersController(ApplicationDbContext context,ICustomMethods customMethods)
        {
            _context = context;
            _customMethods = customMethods;
        }

        // GET: api/UserMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserModel>>> Get()
        {
            return await _context.UserMasters.Select(u => new UserModel
            {
                UserId = u.UserId,
                UserName = u.UserName,
                UserEmail = u.UserEmail,
                Address = u.Address,
                Phone = u.Phone,
                CreatedAt = u.CreatedAt,
            }).ToListAsync();
        }


        // GET: api/UserMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserModel>> Get(int id)
        {
            var userMaster = await _context.UserMasters.FindAsync(id);

            if (userMaster == null)
            {
                return NotFound();
            }
            UserModel userModel = new UserModel();
            _customMethods.MapProperties(userMaster, userModel);

            return userModel;
        }

        // PUT: api/UserMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> Put(UserModel userModel)
        {
            int id = userModel.UserId ?? 0;
            if (id == 0)
            {
                return BadRequest();
            }
            UserMaster userMaster = new UserMaster();
            userMaster.Address = userModel.Address;
            userMaster.UserName = userModel.UserName;
            userMaster.Password = userModel.Password;
            //_customMethods.MapProperties(userModel, userMaster);

            //_context.UserMasters.Update(userMaster);

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
        public async Task<ActionResult<UserMaster>> Post(UserModel userModel)
        {
            UserMaster userMaster = new UserMaster();
            _customMethods.MapProperties(userModel, userMaster);
            userMaster.GUID = Guid.NewGuid().ToString();
            _context.UserMasters.Add(userMaster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserMaster", new { id = userMaster.UserId }, userMaster);
        }

          [HttpPost]
        public async Task<ActionResult<UserMaster>> Login(LoginModel userModel)
        {
            var user = _context.UserMasters.Where(u => u.UserName == userModel.username).FirstOrDefault();
            return user;
        }

        // DELETE: api/UserMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
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
