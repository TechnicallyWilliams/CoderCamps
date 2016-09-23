using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WishHeroes.Data.Models
{
    public class Phone
    {
        [Key]
        public int Id { get; set; }
        public string PhoneNumber { get; set; }
        public string UserId { get; set; }
        
        public int PhoneTypeId { get; set; }
        [ForeignKey("PhoneTypeId")]
        public virtual PhoneType PhoneType { get; set; }



    }
}
