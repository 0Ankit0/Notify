using Notify.Server.Data.Providers;
using System.ComponentModel.DataAnnotations;

namespace notify.Server.Models
{
    public class ProviderModel
    {
        public int? ProviderId { get; set; }
        public string? Alias { get; set; }
        public ProviderEnum Provider { get; set; }
        [Required(ErrorMessage = "Please provide a valid secret")]
        public string Secret { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
