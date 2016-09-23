using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using WishHeroes.Data;
using WishHeroes.Data.Models;

namespace WishHeroes.Frameworks.Helpers
{
    
    public class UserProfile
    {
        private static UserProfile Profile;
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserId { get; set; }
        public int? OrganizationId { get; set; }
        public string Email { get; set; }
        public int TimesDonated { get; set; }
        public decimal AmountDonated { get; set; }
        public bool IsActive { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public List<Address> Addresses { get; set; }
        public List<Phone> Phones { get; set; }

        /// <summary>
        /// Get Current UserProfile.
        /// </summary>
        public static UserProfile Current
        {
            get
            {
                using (ApplicationDbContext db = new ApplicationDbContext())
                {
                    if (!HttpContext.Current.User.Identity.IsAuthenticated) return null;

                    if (Profile != null) return Profile;

                    return InitializeUser(); 
                }
            }
        }


        public bool IsAdmin
        {
            get
            {
                return HttpContext.Current.User.IsInRole("Admin");
            }
        }

        public bool IsStaff
        {
            get
            {
                return HttpContext.Current.User.IsInRole("Staff");
            }
        }

        public bool IsUser
        {
            get
            {
                return HttpContext.Current.User.IsInRole("User");
            }
        }

        /// <summary>
        /// Convert ApplicationUser to UserProfile
        /// </summary>
        /// 
        /// <returns>
        /// Returns Current UserProfile
        /// </returns>
        private static UserProfile InitializeUser()
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                if (!HttpContext.Current.User.Identity.IsAuthenticated || String.IsNullOrEmpty(HttpContext.Current.User.Identity.Name))
                {
                    return null;
                }

                string userId = HttpContext.Current.User.Identity.GetUserId();

                ApplicationUser user = db.Users.Where(u => u.Id == userId).First();

                UserProfile profile = new UserProfile();
                profile.UserId = user.Id;
                profile.OrganizationId = user.OrganizationId;
                profile.Username = user.UserName;
                profile.FirstName = user.FirstName;
                profile.LastName = user.LastName;
                profile.IsActive = user.IsActive;
                profile.TimesDonated = user.TimesDonated;
                profile.Email = user.Email;
                profile.IsEmailConfirmed = user.EmailConfirmed;
                profile.AmountDonated = user.AmountDonated;
                profile.Phones = db.Phones.Where(p => p.UserId == userId).ToList();
                profile.Addresses = db.Addresses.Where(a => a.UserId == userId).ToList();

                return profile;
            }
        }
    }
}
