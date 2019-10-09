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
        }
    }
}