using Notify.Server.Data.Users;
using Notify.Server.Data.Providers;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Notify.Server.Data.Messages
{
    public class Message
    {
        [Key]
        public string Id { get; set; }
        public required string Receiver { get; set; }
        public required string Content { get; set; }
        public required ProviderMaster Provider { get; set; }
        public MessageStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }

        // Foreign key for UserMaster
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual UserMaster UserMaster { get; set; }
    }

    public enum MessageStatus
    {
        Sent,
        Failed,
        Pending
    }
}

