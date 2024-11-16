namespace notify.Server.Models
{
    public class MessageModel
    {
        public string? Id { get; set; }
        public string? Receiver { get; set; }
        public string? Content { get; set; }
        public string? Provider { get; set; }
        public string? Status { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
