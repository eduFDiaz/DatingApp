using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static void AddPagination(this HttpResponse response,
        int currentPage, int itemsPerPage, int totalItems, int totalPages)
        // Will add a paginationHeader class to the headers of the response returned
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
            // Convert our paginationHeader to string values
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader));
            // Expose the pagination header to cors errors associated with this
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
        public static int CalculateAge(this DateTime theDateTime){
            int age = DateTime.Today.Year - theDateTime.Year;
            
            if(theDateTime.AddYears(age) > DateTime.Today)
                age--;

            return age;
        }  
    }
}