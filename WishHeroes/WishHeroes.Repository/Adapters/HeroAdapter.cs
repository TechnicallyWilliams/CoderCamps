using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WishHeroes.Data;
using WishHeroes.Data.Models;
using WishHeroes.Repository.Interfaces;
using WishHeroes.ViewModels;

namespace WishHeroes.Repository.Adapters
{
    public class HeroAdapter : IHero
    {
        public List<HeroViewModel> GetHeroes()
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                List<HeroViewModel> model = db.Users
                    .Where(h => h.AmountDonated > 0)
                    .Select(h => new HeroViewModel()
                    {
                        Alias = h.UserName,
                        TimesDonated = h.TimesDonated,
                        TotalDonated = h.AmountDonated,
                        UserLocation = db.Addresses.Where(ad => ad.UserId == h.Id).Select(ad => new HeroLocation()
                        {
                            State = ad.State.StateName,
                            City = ad.City

                        }).FirstOrDefault(),

                        AccomplishmentDetails = db.User_Accomplishment.Where(u_a => u_a.UserId == h.Id).Select(u_a => new AccomplishmentsVM()
                        {
                            AccomplishmentName = db.Accomplishments.Where(a => a.Id == u_a.AccomplishmentId).FirstOrDefault().AccomplishmentName,
                            AccomplishmentLevel = db.Accomplishments.Where(a => a.Id == u_a.AccomplishmentId).FirstOrDefault().AccomplishmentLevel,
                            ImageUrl = db.Accomplishments.Where(a => a.Id == u_a.AccomplishmentId).FirstOrDefault().ImageUrl

                        }).FirstOrDefault(),

                        //StateList = db.States.Where(es => !string.IsNullOrEmpty(es.StateName)).ToList()
                    })
                    .ToList();

                //.OrderBy(w => w.AmountDonated)
                List<HeroViewModel> allStates = db.States.Where(es => !string.IsNullOrEmpty(es.StateName)).Select(es => new HeroViewModel
                    {
                        StateList = es.StateName
                    }).ToList();

                return model.Concat(allStates).ToList(); //This May not simply add a list of states to the object called 'model' like i want it to

                throw new NotImplementedException();

            }
        }

    }
}
