using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WishHeroes.ViewModels
{
    public class WishViewModel
    {
        public string FullName { get; set; }
        public string Name { get; set; }
    }

    public class AddWishViewModel
    {
        [DisplayName("Receiver First Name")]
        public string ReceiverFirstName { get; set; }

        [DisplayName("Receiver First Name")]
        public string ReceiverLastName { get; set; }

        [DisplayName("Receiver First Name")]
        public string Story { get; set; }

        [DisplayName("Receiver First Name")]
        public string Testimony { get; set; }

        [DisplayName("Receiver First Name")]
        public decimal Cost { get; set; }
    }

    public class DonateViewModel //Adapter is pending
    {
        public int WishId { get; set; }
        public double AmountDonated { get; set; }
        public int ProfileId { get; set; }
    }


}
