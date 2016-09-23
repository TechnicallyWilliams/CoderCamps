using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WishHeroes.Data;
using WishHeroes.Data.Models;
using WishHeroes.Frameworks.Helpers;
using WishHeroes.Repository.Interfaces;
using WishHeroes.ViewModels;

namespace WishHeroes.Repository.Adapters
{
    public class WishAdapter : IWish
    {
        /// <summary>
        /// Get a single random wish.
        /// </summary>
        /// 
        /// <returns>
        /// Return a single random WishViewModel
        /// </returns>
        public WishViewModel GetRandomWish()
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                return db.Wishes
                    .Where(w => !w.IsGranted && w.IsApproved && w.IsActive && !w.IsDenied)
                    .OrderBy(w => Guid.NewGuid()).ToList()
                    .Select(w => new WishViewModel
                    {
                      FullName = w.GetReceiverName(),
                      Name = w.Name
                    })
                    .Take(1)
                    .FirstOrDefault();
            }
        }

        /// <summary>
        /// Get wish report.
        /// </summary>
        /// 
        /// <param name="id">
        /// The ID for the wish to look for in the database.
        /// </param>
        /// 
        /// <returns>
        /// Returns the a WishReport Model for the wish found.
        /// </returns>
        public WishReport GetWishReport(int id)
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                return db.Wishes.FirstOrDefault(w => w.Id == id).GetReport();
            }
        }

        /// <summary>
        /// Add with to database.
        /// </summary>
        /// 
        /// <param name="model">
        /// ViewModel containing wish data model.
        /// </param>
        public void Add(AddWishViewModel model)
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                db.Wishes.Add(new Wish
                    {
                        UserId = UserProfile.Current.UserId,
                        ReceiverFirstName = model.ReceiverFirstName,
                        ReceiverLastName = model.ReceiverLastName,
                        Story = model.Story,
                        Testimony = model.Testimony,
                        Name = String.Format("{0} {1}", UserProfile.Current.FirstName, UserProfile.Current.LastName),
                        Cost = model.Cost,
                        DateCreated = DateTime.UtcNow,
                        DateUpdated = DateTime.UtcNow,
                    });
                db.SaveChanges();
            }
        }
    }
}
