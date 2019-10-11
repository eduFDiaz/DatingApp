using System;

namespace DatingApp.API.Dtos
{
    public class MessageForCreationDto
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; }
        public DateTime? MessageSentDate { get; set; }
        public MessageForCreationDto()
        {
            this.MessageSentDate = DateTime.Now;
        }
    }
}