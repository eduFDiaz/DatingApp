using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            // FirstOrDefaultAsync is used in case of like doesn't exist
            // null will be returned to the controller and that can be tested there
            var like = await _context.Likes.FirstOrDefaultAsync(
                u => u.LikerId == userId && u.LikeeId == recipientId
            );
            return like;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            var photo = await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
            return photo;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(x => x.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {  
            var users = _context.Users.Include(p => p.Photos).AsQueryable();
            users = users.Where( user => user.Id != userParams.UserId);
            users = users.Where( user => user.Gender == userParams.Gender);
            
            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                // Return users that the current user liked (Likees)
                users = users.Where( user => userLikees.Contains(user.Id));
            }

            if(userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                // Return users that like (Likers) the current user
                users = users.Where( user => userLikers.Contains(user.Id));
            }

            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

            users = users.Where( user => user.DateOfBirth >= minDob && user.DateOfBirth <= maxDob);

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(user => user.Created );
                        break;
                    default:
                        users = users.OrderByDescending(user => user.LastActive );
                        break;
                }
            }
            
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            // Return all records that contain the user id as liker or as likee
            var user = await _context.Users
                .Include(u => u.Likers)
                .Include(u => u.Likeers)
                .FirstOrDefaultAsync(u => u.Id == id);

            // Return Liker Ids or Likees id depending on the value of the boolean likers
            if (likers==true)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else
            {
                return user.Likeers.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }  
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int messageId)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == messageId);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
                .Include(user => user.Sender).ThenInclude(p => p.Photos)
                .Include(user => user.Recipient).ThenInclude(p => p.Photos)
                .AsQueryable();
            
            switch (messageParams.MessageContainer)
            {
                case "Inbox" : { // Messages sent to the user
                    messages = messages.Where(user => user.RecipientId == messageParams.UserId && user.hasRecipientDelete == false);
                    break;
                }
                case "Outbox" :  { // Messages the user sent
                    messages = messages.Where(user => user.SenderId == messageParams.UserId  && user.hasSenderDelete == false);
                    break;
                }
                default: { // Unread messages
                    messages = messages.Where(user => user.RecipientId == messageParams.UserId && user.hasRecipientDelete == false && user.IsRead == false);
                    break;
                }
            }
            
            // Here the messages are ordered by the Date they were sent
            messages = messages.OrderByDescending(m => m.MessageSentDate);

            // Finally a PagedList of type Message with our messages is returned
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            // This will return the conversation between two users, you get messages sent and received to the two users
            // it will also return the two users and the messages will be ordered by MessageSentDate
            var messages = await _context.Messages
                .Include(user => user.Sender).ThenInclude(p => p.Photos)
                .Include(user => user.Recipient).ThenInclude(p => p.Photos)
                .Where(message => 
                        message.RecipientId == userId && message.SenderId == recipientId
                           && message.hasRecipientDelete == false
                        || message.RecipientId == recipientId && message.SenderId == userId
                           && message.hasSenderDelete == false)
                .OrderByDescending(message => message.MessageSentDate)
                .ToListAsync();;

            return messages;
        }
    }
}