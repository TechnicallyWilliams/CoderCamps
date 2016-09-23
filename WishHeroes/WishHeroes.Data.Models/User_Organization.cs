using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WishHeroes.Data.Models
{
    public class User_Organization
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public int OrganizationId { get; set; }
    }
}
