using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
            .ForMember(dest => dest.PhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            })
            .ForMember(dest => dest.Age, opt =>
            {
                opt.MapFrom(d => d.DateOfBirth.CalculateAge());
            });

            CreateMap<User, UserForDetailedDto>()
            .ForMember(dest => dest.PhotoUrl, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                CreateMap<Photo, PhotosForDetailedDto>();
            })
            .ForMember(dest => dest.Age, opt =>
            {
                opt.MapFrom(d => d.DateOfBirth.CalculateAge());
            });
            // CreateMap<Source, Destination>();
            CreateMap<UserForUpdateDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<UserForRegisterDto, User>();
            // ReverseMap() maps one object to the other in the opposite direction as well
            CreateMap<MessageForCreationDto, Message>().ReverseMap();

            // Automapper didn't know how to populate the Photo Urls for this Dto, so
            // it had to be configured manually
            CreateMap<Message, MessageToReturnDto>()
            .ForMember(dest => dest.SenderPhotoUrl, opt => {
                opt.MapFrom( u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url);
            })
            .ForMember(dest => dest.RecipientPhotoUrl, opt => {
                opt.MapFrom( u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url);
            });
        }
    }
}