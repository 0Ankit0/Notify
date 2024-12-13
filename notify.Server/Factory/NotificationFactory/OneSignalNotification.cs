using notify.Server.Models;
using Notify.Server.Data.Providers;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace notify.Server.Factory.NotificationFactory
{
    public class OneSignalNotification : INotification
    {
        private readonly HttpClient _httpClient;

        public OneSignalNotification(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> Send(ProviderMaster provider, MessageModel messageModel)
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

        public async Task<bool> SendMultiple(ProviderMaster provider, List<MessageModel> messageModels)
        {
            var oneSignalMessages = messageModels.Select(mm => new
            {
                app_id = provider.Secret,
                contents = new { en = mm.Content },
                include_player_ids = new[] { mm.Receiver }
            }).ToList();

            var tasks = oneSignalMessages.Select(async message =>
            {
                var requestContent = new StringContent(JsonSerializer.Serialize(message), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("https://onesignal.com/api/v1/notifications", requestContent);
                return response.IsSuccessStatusCode;
            });

            var results = await Task.WhenAll(tasks);

            return results.All(r => r);
        }
    }
}
