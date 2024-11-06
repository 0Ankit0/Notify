using Notify.Server.Data.Providers;

namespace notify.Server.Models
{
    public class ProviderModel
    {
        public int? ProviderId { get; set; }
        public string? Alias { get; set; }
        public ProviderEnum Provider { get; set; }
        public required string Secret { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
