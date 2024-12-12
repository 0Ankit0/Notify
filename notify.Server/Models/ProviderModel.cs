using Notify.Server.Data.Providers;
using System.ComponentModel.DataAnnotations;

namespace notify.Server.Models
{
    public class ProviderModel
    {
        public int? ProviderId { get; set; }
        public string? Alias { get; set; }
        public ProviderEnum? Provider { get; set; }
        public string? ProviderName { get; set; }
        public string? Token { get; set; }
        [Required(ErrorMessage = "Please provide a valid secret")]
        public string? Secret { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
    public class ProviderResponseModel
    {
        public int? Id { get; set; }
        public string? Alias { get; set; }
        public string? Provider { get; set; }
        public string? ProviderId { get; set; }
        public string? Token { get; set; }
        public string Secret { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    //public class ProviderTokenModel : ProviderModel
    //{
    //    public string? Token { get; set; }
    //}
}
