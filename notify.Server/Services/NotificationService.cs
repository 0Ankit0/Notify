using Notify.Server.Data.Providers;
using Notify.Server.Data.Users;
using notify.Server.Models;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Notify.Server.Services
{
    public interface INotificationService
    {
        Task<bool> SendNotification(ProviderMaster provider, UserMaster user, MessageModel messageModel, UserToken userToken);
    }

    public class NotificationService : INotificationService
    {
        private readonly HttpClient _httpClient;

        public NotificationService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> SendNotification(ProviderMaster provider, UserMaster user, MessageModel messageModel, UserToken userToken)
        {
            switch (provider.ProviderName.ToLower())
            {
                case "Firebase":
                    return await SendFirebaseNotification(provider, user, messageModel,userToken);
                case "OneSignal":
                    return await SendOneSignalNotification(provider, user, messageModel, userToken);
                case "Custom":
                    return await SendCustomNotification(provider, user, messageModel);
                default:
                    return false;
            }
        }

        private async Task<bool> SendFirebaseNotification(ProviderMaster provider, UserMaster user, MessageModel messageModel,UserToken userToken)
        {
            var firebaseMessage = new
            {
                to = messageModel.Receiver,
                notification = new
                {
                    title = "New Message",
                    body = messageModel.Content
                }
            };

            var requestContent = new StringContent(JsonSerializer.Serialize(firebaseMessage), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage(HttpMethod.Post, "https://fcm.googleapis.com/fcm/send")
            {
                Headers = { { "Authorization", $"key={userToken.Token}" } },
                Content = requestContent
            };

            var response = await _httpClient.SendAsync(request);
            return response.IsSuccessStatusCode;
        }

        private async Task<bool> SendOneSignalNotification(ProviderMaster provider, UserMaster user, MessageModel messageModel, UserToken userToken)
        {
            var oneSignalMessage = new
            {
                app_id = userToken.Token,
                contents = new { en = messageModel.Content },
                include_player_ids = new[] { messageModel.Receiver }
            };

            var requestContent = new StringContent(JsonSerializer.Serialize(oneSignalMessage), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("https://onesignal.com/api/v1/notifications", requestContent);
            return response.IsSuccessStatusCode;
        }

        private async Task<bool> SendCustomNotification(ProviderMaster provider, UserMaster user, MessageModel messageModel)
        {
            // Implement custom notification logic here
            // Use provider.Token and provider.Secret for authentication if needed
            // ...

            return true; // Return true if notification is sent successfully, otherwise false
        }
    }
}