using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System;
using Microsoft.Extensions.Options;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Http;
using CloudinaryDotNet.Actions;
using DatingApp.API.Models;
using System.Linq;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;

        private Cloudinary _cloudinary;
        public PhotosController(IDatingRepository repo,
                                IMapper mapper,
                                IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _mapper = mapper;
            _repo = repo;
            _cloudinaryConfig = cloudinaryConfig;

            Account account = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret 
            );

            _cloudinary = new Cloudinary(account);
        }

        [HttpGet("{id}", Name="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }        

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId,
                            [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            // Check if the user is authenticated
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }
            // Only if the claim is valid the user is retrieved
            var userFromRepo = await _repo.GetUser(userId);

            var file = photoForCreationDto.File;

            var uploadResults = new ImageUploadResult();

            if(file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams(){
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                            .Width("500").Height("500").Crop("fill").Gravity("face")
                    };
                    uploadResults = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreationDto.Url = uploadResults.Uri.ToString();
            photoForCreationDto.PublicId = uploadResults.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if(!userFromRepo.Photos.Any(u => u.IsMain))
                photo.IsMain = true;
            
            userFromRepo.Photos.Add(photo);

            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.PublicId } , photoToReturn );
            }

            return BadRequest("Could not add the photo");
        }

        // Set main photo using id as the photo id
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMain(int userId, int id)
        {
            // Checks if the user is authorized
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            // Checks if the picture belongs to the user
            var user = await _repo.GetUser(userId);
            if(!user.Photos.Any(p => p.Id == id))
                return Unauthorized();
             
            // Retrieve photo to be set as main
            var photoFromRepo = await _repo.GetPhoto(id);
            if(photoFromRepo.IsMain)
                return BadRequest("This is already the main photo");
            
            // Retrieve current main photo
            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
            
            // Set main photo a
            currentMainPhoto.IsMain = false;
            photoFromRepo.IsMain = true;

            if(await _repo.SaveAll())
                return NoContent();

            return BadRequest("Could not set photo to main");
        }

        // Delete photo using id as the photo id
        [HttpPost("{id}/Delete")]
        public async Task<IActionResult> Delete(int userId, int id)
        {
            // Checks if the user is authorized
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                return Unauthorized();
            }

            // Checks if the picture belongs to the user
            var user = await _repo.GetUser(userId);
            if(!user.Photos.Any(p => p.Id == id))
                return Unauthorized();
             
            // Check if photo is set as main, don't delete if that is true
            var photoFromRepo = await _repo.GetPhoto(id);
            if(photoFromRepo.IsMain)
                return BadRequest("Cannot delete the main photo");
            
            _repo.Delete(photoFromRepo);

            if(await _repo.SaveAll())
                return NoContent();

            return BadRequest("Could not delete the photo");
        }
    }
}