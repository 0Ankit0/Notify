using Notify.Server.Data.Providers;
using Notify.Server.Data.Users;
using notify.Server.Models;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using FirebaseAdmin.Messaging;

namespace Notify.Server.Services
{
    public interface INotificationService
    {
        Task<bool> SendNotification(ProviderMaster provider, MessageModel messageModel);
    }

    public class NotificationService : INotificationService
    {
        private readonly HttpClient _httpClient;

        public NotificationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> SendNotification(ProviderMaster provider, MessageModel messageModel)
        {
            switch (provider.Provider)
            {
                case ProviderEnum.Firebase:
                    return await SendFirebaseNotification(provider, messageModel);
                case ProviderEnum.OneSignal:
                    return await SendOneSignalNotification(provider, messageModel);
                case ProviderEnum.Custom:
                    return await SendCustomNotification(provider, messageModel);
                default:
                    return false;
            }
        }

        private async Task<bool> SendFirebaseNotification(ProviderMaster provider, MessageModel mm)
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

        private async Task<bool> SendMultipleFirebaseNotification(ProviderMaster provider, List<MessageModel> messageModels)
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

        private async Task<bool> SendOneSignalNotification(ProviderMaster provider, MessageModel messageModel)
        {
            var oneSignalMessage = new
            {
                app_id = provider.Secret,
                contents = new { en = messageModel.Content },
                include_player_ids = new[] { messageModel.Receiver }
            };

            var requestContent = new StringContent(JsonSerializer.Serialize(oneSignalMessage), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("https://onesignal.com/api/v1/notifications", requestContent);
            return response.IsSuccessStatusCode;
        }

        private async Task<bool> SendCustomNotification(ProviderMaster provider, MessageModel messageModel)
        {
            // Implement custom notification logic here
            // Use provider.Token and provider.Secret for authentication if needed
            // ...

            return true; // Return true if notification is sent successfully, otherwise false
        }
    }
}