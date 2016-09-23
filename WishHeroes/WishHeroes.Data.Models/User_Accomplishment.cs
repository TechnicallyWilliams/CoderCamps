using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WishHeroes.Data.Models
{
    public class User_Accomplishment
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public int AccomplishmentId { get; set; }
    }
}
