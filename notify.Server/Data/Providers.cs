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
        public required string Secret { get; set; }
        public DateTime CreatedAt { get; set; }

        // Computed property to get the provider name from the enum
        [NotMapped]
        public string ProviderName => Provider.ToString();
    }

    public enum ProviderEnum
    {
        OneSignal,
        Firebase,
        Custom
    }
}
