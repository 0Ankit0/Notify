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
        public ProviderEnum Provider { get; set; }
        public string ApiKey { get; set; }
        public string Secret { get; set; }
        public DateTime CreatedAt { get; set; }

        // Computed property to get the provider name from the enum
        [NotMapped]
        public string ProviderName => Provider.ToString();

        // Navigation properties
        public virtual ICollection<ProviderUserToken> ProviderUserTokens { get; set; }
    }

    public enum ProviderEnum
    {
        OneSignal,
        Firebase,
        Custom
    }
}
