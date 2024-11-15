﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using notify.Server.Classes;
using notify.Server.Filters;
using notify.Server.Models;
using Notify.Server.Data;
using Notify.Server.Data.Messages;

namespace notify.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICustomMethods _customMethods;

        public MessagesController(ApplicationDbContext context,ICustomMethods customMethods)
        {
            _context = context;
            _customMethods = customMethods;
        }

        // GET: api/Messages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageModel>>> Get()
        {
            return await _context.Messages.Select(m => new MessageModel
            {
                Id = m.Id,
                Receiver = m.Receiver,
                Content = m.Content,
                Provider = m.Provider.ProviderName,
                Status = m.Status.ToString(),
                CreatedAt = m.CreatedAt
            }).ToListAsync();
        }

        // GET: api/Messages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MessageModel>> Get(string id)
        {
            var message = await _context.Messages.FindAsync(id);

            if (message == null)
            {
                return NotFound();
            }
            MessageModel messageModel = new MessageModel();
            _customMethods.MapProperties(message, messageModel);
            return messageModel;
        }

        // PUT: api/Messages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut()]
        public async Task<IActionResult> Put(MessageModel messageModel)
        {
            string id = messageModel.Id;
            if (String.IsNullOrEmpty(id))
            {
                return BadRequest();
            }
            Message message = new Message();
            message.Status = Enum.Parse<MessageStatus>(messageModel.Status);

            _context.Entry(message).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MessageExists(id))
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

        // POST: api/Messages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [ServiceFilter(typeof(TokenValidationFilter))]
        public async Task<ActionResult<MessageModel>> Post(MessageModel messageModel)
        {
            Message message = new Message();
            _customMethods.MapProperties(messageModel, message);
            message.Status = MessageStatus.Pending;
            _context.Messages.Add(message);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (MessageExists(message.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetMessage", new { id = message.Id }, messageModel);
        }

        // DELETE: api/Messages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MessageExists(string id)
        {
            return _context.Messages.Any(e => e.Id == id);
        }
    }
}
