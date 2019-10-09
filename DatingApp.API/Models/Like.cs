namespace DatingApp.API.Models
{
    public class Like
    { 
        // The Id of the user that liked another user
        public int LikerId { get; set; }
        // The Id of the user liked by the user with Id LikerId
        public int LikeeId { get; set; }
        // User that likes
        public User Liker { get; set; }
        // User liked
        public User Likee { get; set; }
    }
}