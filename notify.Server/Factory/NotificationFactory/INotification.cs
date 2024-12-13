using Notify.Server.Data.Providers;
using notify.Server.Models;

namespace notify.Server.Factory.NotificationFactory
{
    public interface INotification
    {
        Task<bool> Send(ProviderMaster provider, MessageModel messageModel);
        Task<bool> SendMultiple(ProviderMaster provider, List<MessageModel> messageModels);
    }
}
