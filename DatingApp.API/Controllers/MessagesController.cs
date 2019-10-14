using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using System;
using System.Collections.Generic;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            this._mapper = mapper;
            this._repo = repo;
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId,[FromBody]MessageForCreationDto messageForCreationDto)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            messageForCreationDto.SenderId = userId;

            var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);

            if(recipient == null)
            {
                return NotFound();
            }
            
            var messageToCreate = _mapper.Map<Message>(messageForCreationDto);

            _repo.Add(messageToCreate);

            var messageToReturn = _mapper.Map<MessageForCreationDto>(messageToCreate);

            if(await _repo.SaveAll())
            {
                return CreatedAtRoute("GetMessage", new {id = messageToCreate.Id}, messageToReturn);
            }

            throw new Exception("Failed to sent message");
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }
            
            var messageFromRepo = await _repo.GetMessage(id);

            if( messageFromRepo == null )
            {
                return NotFound();
            }
            return Ok(messageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages(int userId,[FromQuery]MessageParams messageParams)
         {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }
            
            messageParams.UserId = userId;
            
            var messagesFromRepo = await _repo.GetMessagesForUser(messageParams);

            var messagesToReturn = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);

            Response.AddPagination(messagesFromRepo.CurrentPage, messagesFromRepo.PageSize, messagesFromRepo.TotalCount, messagesFromRepo.TotalPages);

            if( messagesFromRepo == null )
            {
                return NotFound();
            }
            return Ok(messagesToReturn);
        }
    }
}