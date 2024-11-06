namespace notify.Server.Models
{
    public class UserTokenModel
    {
        public int? Id { get; set; }
        public string? Token { get; set; }
        public int? UserId { get; set; }
        public int? ProviderId { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
