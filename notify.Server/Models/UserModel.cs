﻿namespace notify.Server.Models
{
    public class UserModel
    {
        public int? UserId { get; set; }
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? Password { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
    public class LoginModel
    {
        public required string username { get; set; }
        public required string password { get; set; }
    }
}
