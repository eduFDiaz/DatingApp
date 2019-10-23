using System;
using System.Collections.Generic;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class SeedData
    {
        private readonly DataContext _context;
        public SeedData(DataContext context)
        {
            _context = context;
        }
        public void SeedUsers(){
            var usersData = System.IO.File.ReadAllText("Data/UserDataSeed.json");
            var users = JsonConvert.DeserializeObject<List<User>>(usersData);

            foreach (var user in users)
            {
                byte[] passwordHash, passwordSalt;
                this.CreatePasswordHash("password123", out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.Username = user.Username.ToLower();
                user.LastActive = DateTime.Now;

                _context.Users.Add(user);
            }
            _context.SaveChanges();
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}