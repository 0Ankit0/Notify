using notify.Server.Models;
using Notify.Server.Data.Providers;
using System.Net.Http;

namespace notify.Server.Factory.NotificationFactory
{
    public class NotificationFactory
    {
        private readonly HttpClient _httpClient;

        public NotificationFactory(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public INotification GetNotification(ProviderModel provider)
        {
            switch (provider.Provider)
            {
                case ProviderEnum.Firebase:
                    return new FirebaseNotification();
                case ProviderEnum.OneSignal:
                    return new OneSignalNotification(_httpClient);
                //case ProviderEnum.Custom:
                //    return new CustomNotification();
                default:
                    return null;
            }
        }
    }
}
