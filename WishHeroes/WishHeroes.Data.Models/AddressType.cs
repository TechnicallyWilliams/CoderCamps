using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WishHeroes.Data.Models
{
    public class AddressType
    {
        [Key]
        public int Id { get; set; }
        public string Type { get; set; }
    }
}
