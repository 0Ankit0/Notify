using Notify.Server.Data.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Notify.Server.Data.Providers
{
    public class ProviderMaster
    {
        [Key]
        public int ProviderId { get; set; }
        public string? Alias { get; set; }
        public ProviderEnum Provider { get; set; }
        [Required(ErrorMessage = "Please provide a valid secret")]
        public string Secret { get; set; }
        public DateTime CreatedAt { get; set; }

        // Computed property to get the provider name from the enum
        [NotMapped]
        public string ProviderName => GetProviderName();

        private string GetProviderName()
        {
            return Enum.GetName(typeof(ProviderEnum), Provider) ?? "Error";
        }
    }

    public enum ProviderEnum
    {
        OneSignal,
        Firebase,
        Custom
    }
}
