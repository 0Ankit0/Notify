namespace notify.Server.Models
{
    public class MessageModel
    {
        public string? Id { get; set; }
        public string? Receiver { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? Provider { get; set; }
        public string? Status { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
    public class MessageStatusReport
    {
        public DateTime? Date { get; set; }
        public int? SuccessCount { get; set; }
        public int? FailedCount { get; set; }
    }
}
