using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            
            var userFromRepo = await _repo.GetUser(currentUserId);

            userParams.UserId = currentUserId;

            if(string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }
            // users is of type PagedList<User> (see repo method)
            var users = await _repo.GetUsers(userParams);

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            // the pagination information is added as header to the returned response
            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            // finally only a users.PageSize number of users are returned
            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name = "GetUser")] 
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userToUpdate)
        {
            // User id is matched to the id of the token that was sent to avoid
            // people from modifying a different user with their token
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }
            // Then the user is retrieved
            var userFromRepo = await _repo.GetUser(id);
            _mapper.Map(userToUpdate, userFromRepo);

            // The user is saved and returned in the response in case its needed
            if (await _repo.SaveAll()){
                return Ok(userFromRepo);
            }

            throw new Exception($"Updating user with id={id} failed on save");
        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> likeUser(int id, int recipientId)
        {
            // User id is matched to the id of the token that was sent to avoid
            // people from liking an user impersonation another user
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            var recipientFromRepo = await _repo.GetUser(recipientId);
            if(recipientFromRepo == null)
            {
                return NotFound();
            }

            var likeFromRepo = await _repo.GetLike(id, recipientId);
            
            if (likeFromRepo!=null) {
                var name = recipientFromRepo.KnownAs;
                _repo.Delete(likeFromRepo);
                
                if(await _repo.SaveAll()){
                    // pass object storing unlike state to the SPA
                    return Ok(new {result="unlike"});
                }
            }

            var newLike = new Like{
                LikerId = id,
                LikeeId = recipientId
            };

            _repo.Add<Like>(newLike);
            if (await _repo.SaveAll()){
                // pass object storing like state to the SPA to 
                // alertify to print a message then reload the 
                return Ok(new {result="like"});
            } 

            return BadRequest($"Failed to like/unlike {recipientFromRepo.KnownAs}");
        }
    }
}