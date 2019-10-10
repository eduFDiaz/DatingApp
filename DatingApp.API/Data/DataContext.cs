using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // make key a combination of both keys to ensure
            // that a user is only liked once by another user
            builder.Entity<Like>()
                .HasKey(k => new {k.LikerId, k.LikeeId});

            // A user can like many users part of the relationship
            builder.Entity<Like>()
                .HasOne(u => u.Likee)
                .WithMany(u => u.Likers)
                .HasForeignKey(u => u.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // A user can be liked by many users part of the relationship
            builder.Entity<Like>()
                .HasOne(u => u.Liker)
                .WithMany(u => u.Likeers)
                .HasForeignKey(u => u.LikerId)
                .OnDelete(DeleteBehavior.Restrict);

            ////////////////////////////////////////////////////////////////////////////////
            //////////// Defining Messages relationships using fluent API //////////////////
            ////////////////////////////////////////////////////////////////////////////////
            // A sender can have many MessagesSent (A message has a sender and can send many messages)
            builder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            // A Recipient can have many MessagesReceived (A message has a recipient and can send many messages)
            builder.Entity<Message>()
                .HasOne(m => m.Recipient)
                .WithMany(m => m.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}