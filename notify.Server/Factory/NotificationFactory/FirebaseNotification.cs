using FirebaseAdmin.Messaging;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Notify.Server.Data.Providers;
using notify.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace notify.Server.Factory.NotificationFactory
{
    public class FirebaseNotification : INotification
    {
        public async Task<bool> Send(ProviderMaster provider, MessageModel mm)
        {
            FirebaseApp.Create(new AppOptions
            {
                Credential = GoogleCredential.FromJson(provider.Secret)
            });
            var message = new Message
            {
                Token = mm.Receiver,
                Notification = new Notification
                {
                    Title = mm.Title,
                    Body = mm.Content
                }
            };
            try
            {
                string response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
                //return Ok(new { MessageId = response });
                return true;
            }
            catch (Exception ex)
            {
                //return BadRequest(new { Error = ex.Message });
                return false;
            }
        }

        public async Task<bool> SendMultiple(ProviderMaster provider, List<MessageModel> messageModels)
        {
            FirebaseApp.Create(new AppOptions
            {
                Credential = GoogleCredential.FromJson(provider.Secret)
            });

            var messages = messageModels.Select(mm => new Message
            {
                Token = mm.Receiver,
                Notification = new Notification
                {
                    Title = mm.Title,
                    Body = mm.Content
                }
            }).ToList();

            try
            {
                var response = await FirebaseMessaging.DefaultInstance.SendEachAsync(messages);
                // Check the response for any failed messages
                if (response.FailureCount > 0)
                {
                    // Handle failed messages if needed
                    foreach (var error in response.Responses.Where(r => !r.IsSuccess))
                    {
                        Console.WriteLine($"Error sending message: {error.Exception}");
                    }
                }
                return response.FailureCount == 0;
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                Console.WriteLine($"Exception: {ex.Message}");
                return false;
            }
        }
    }
}
