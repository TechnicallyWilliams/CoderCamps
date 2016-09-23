using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WishHeroes.Data.Models
{
    public class Address
    {
        [Key]
        public int Id { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public int ZipCode { get; set; }
        public string UserId { get; set; }

        public int StateId { get; set; }
        [ForeignKey("StateId")]
        public virtual State State { get; set; }

        public int AddressTypeId { get; set; }
        [ForeignKey("AddressTypeId")]
        public virtual AddressType AddressType { get; set; }




    }
}
