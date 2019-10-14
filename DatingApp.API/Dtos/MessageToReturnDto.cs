using System;
using DatingApp.API.Models;

namespace DatingApp.API.Dtos
{
    public class MessageToReturnDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        // Instead of returning a Sender [User] is returned its KnownAs property
        // this is the type of convention Automapper can work with
        public string SenderKnownAs { get; set; }
        public string  SenderPhotoUrl { get; set; }
        public int RecipientId { get; set; }
        // Instead of returning a Recipient [User] is returned its KnownAs property
        // this is the type of convention Automapper can work with
        public string RecipientKnownAs { get; set; }
        public string RecipientPhotoUrl { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        // DateRead will be null if the recipient has not read the message
        public DateTime? DateRead { get; set; }
        public DateTime? MessageSentDate { get; set; }
    }
}