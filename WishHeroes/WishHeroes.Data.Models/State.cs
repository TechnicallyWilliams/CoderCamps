using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WishHeroes.Data.Models
{
    public class State
    {
        [Key]
        public int Id { get; set; }
        public string StateName { get; set; }
        public string StateAbbreviation { get; set; }

        public string GetStateName()
        {
            return String.Format("{0} - {1}", StateAbbreviation, StateName);
        }
    }
}
