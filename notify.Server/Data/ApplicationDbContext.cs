using Microsoft.EntityFrameworkCore;
using Notify.Server.Data.Messages;
using Notify.Server.Data.Providers;
using Notify.Server.Data.Users;

namespace Notify.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<ProviderMaster> ProviderMasters { get; set; }
        public DbSet<ProviderUserToken> ProviderUserTokens { get; set; }
        public DbSet<UserMaster> UserMasters { get; set; }
        public DbSet<UserToken> UserTokens { get; set; }
        public DbSet<Message> Messages { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships and keys if necessary
            modelBuilder.Entity<ProviderMaster>()
                .HasMany(p => p.ProviderUserTokens)
                .WithOne(put => put.Provider)
                .HasForeignKey(put => put.ProviderId);

            modelBuilder.Entity<UserMaster>()
                .HasMany(u => u.ProviderUserTokens)
                .WithOne(put => put.UserMaster)
                .HasForeignKey(put => put.UserId);

            modelBuilder.Entity<UserMaster>()
                .HasMany(u => u.UserTokens)
                .WithOne(ut => ut.UserMaster)
                .HasForeignKey(ut => ut.UserId);

            modelBuilder.Entity<UserMaster>()
                .HasMany(u => u.Messages)
                .WithOne(m => m.UserMaster)
                .HasForeignKey(m => m.UserId);

           
        }
    }
}
