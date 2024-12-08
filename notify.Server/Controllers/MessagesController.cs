using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using notify.Server.Classes;
using notify.Server.Filters;
using notify.Server.Models;
using Notify.Server.Data;
using Notify.Server.Data.Messages;
using Notify.Server.Data.Providers;
using Notify.Server.Services;

namespace notify.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICustomMethods _customMethods;
        private readonly INotificationService _notificationService;

        public MessagesController(ApplicationDbContext context, ICustomMethods customMethods, INotificationService notificationService)
        {
            _context = context;
            _customMethods = customMethods;
            _notificationService = notificationService;
        }

        // GET: api/Messages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageModel>>> Get()
        {
            return await _context.Messages.Select(m => new MessageModel
            {
                Id = m.Id,
                Receiver = m.Receiver,
                Title=m.Title,
                Content = m.Content,
                Provider = m.Provider.Alias,
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
        // POST: api/Messages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [AllowAnonymous]
        [ServiceFilter(typeof(TokenValidationFilter))]
        public async Task<ActionResult<MessageModel>> Post([FromBody] MessageModel messageModel)
        {
            if (HttpContext.Items["Provider"] is not ProviderMaster provider)
            {
                return Unauthorized();
            }
            Message message = new Message();
            message.Content = messageModel.Content;
            message.Receiver = messageModel.Receiver;
            message.Title = messageModel.Title;
            message.CreatedAt = DateTime.Now;

            message.Status = MessageStatus.Pending;
            message.Provider = provider;
            _context.Messages.Add(message);
            try
            {
                //await _context.SaveChangesAsync();
                var sendMessage = await SendMessage(messageModel, provider);
                if (sendMessage is BadRequestObjectResult)
                {
                    message.Status = MessageStatus.Failed;
                    await _context.SaveChangesAsync();
                    return BadRequest("Failed to send notification");
                }
                message.Status = MessageStatus.Sent;
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

            return CreatedAtAction("Get", new { id = message.Id }, messageModel);
        }

        private async Task<IActionResult> SendMessage(MessageModel messageModel, ProviderMaster provider)
        {
            try
            {

                var result = await _notificationService.SendNotification(provider, messageModel);
                if (!result)
                {
                    return BadRequest("Failed to send notification");
                }

                return Ok("Notification sent successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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
