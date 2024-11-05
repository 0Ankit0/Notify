using Notify.Server.Data.Providers;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Notify.Server.Data.Users
{
    public class UserToken
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual UserMaster UserMaster { get; set; }

        [Required]
        public int ProviderId { get; set; }

        [ForeignKey("ProviderId")]
        public virtual ProviderMaster Provider { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

    }
}
