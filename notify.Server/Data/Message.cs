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
        [Required(ErrorMessage ="Please provide a valid receiver")]
        public string Receiver { get; set; }
        [Required(ErrorMessage ="Please provide a valid message")]
        public string Content { get; set; }
        public string Title { get; set; }
        [Required]
        public ProviderMaster Provider { get; set; }
        public MessageStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public enum MessageStatus
    {
        Sent,
        Failed,
        Pending
    }
}

