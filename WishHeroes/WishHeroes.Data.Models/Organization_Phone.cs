using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WishHeroes.Data.Models
{
    public class Organization_Phone
    {
        [Key]
        public int Id { get; set; }
        public int PhoneId { get; set; }
        public int OrganizationId { get; set; }
    }
}
