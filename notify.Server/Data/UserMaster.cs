using Notify.Server.Data.Messages;
using Notify.Server.Data.Providers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Notify.Server.Data.Users
{
    public class UserMaster
    {
        public UserMaster()
        {
            UserTokens = new HashSet<UserToken>();
            Messages = new HashSet<Message>();
            ProviderUserTokens = new HashSet<ProviderUserToken>();
        }

        [Key]
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string Password { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string GUID { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool Active { get; set; }

        // Navigation properties
        public virtual ICollection<UserToken> UserTokens { get; set; }
        public virtual ICollection<Message> Messages { get; set; }
        public virtual ICollection<ProviderUserToken> ProviderUserTokens { get; set; }
    }
}
