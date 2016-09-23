using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WishHeroes.Data.Models;

namespace WishHeroes.ViewModels
{
    public class HeroViewModel
    {
        public string Alias { get; set; }
        public int TimesDonated { get; set; }
        public decimal TotalDonated { get; set; }
        public int ThankYouCount { get; set; }


        public AccomplishmentsVM AccomplishmentDetails { get; set; }
        public HeroLocation UserLocation { get; set; }
        public string StateList { get; set; }
        //Maybe we can give receivers a temporary password so that they can have the chance to send a custom message saying thank you to each or all their donaters/heroes
        //Other non-profit's might view this page to get more information on what type of people in their community donates. (Not good if you are the donater and you dislike solicitors)
    }

    public class HeroLocation
    {
        public string State { get; set; }
        public string City { get; set; }
    }

    public class AccomplishmentsVM
    {
        public string AccomplishmentName { get; set; }
        public int AccomplishmentLevel { get; set; }
        public string ImageUrl { get; set; }
    }

    public class StateVM
    {
        public string State { get; set; }

    }
}
