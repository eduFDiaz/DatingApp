using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Helpers
{
    public class PagedList<T> : List<T>
    {
        public int CurrentPage { get; set; }
        public int TotalPages  { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public PagedList(List<T> items, int count, int pageNumber, int pageSize )
        {
            this.TotalCount = count;
            this.CurrentPage = pageNumber;
            this.PageSize = pageSize;
            // Make sure the total of pages is an integer and not a floating number
            this.TotalPages = (int) Math.Ceiling(count/(double)PageSize);
            // We add items to the end of parent class List<T>
            this.AddRange(items);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();
            // Next line you skip items not needed for a certain page number and take only those that belong to the current page
            var items = await source.Skip( (pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            // Then return a PagedList containing only those items needed
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
         
    }
}