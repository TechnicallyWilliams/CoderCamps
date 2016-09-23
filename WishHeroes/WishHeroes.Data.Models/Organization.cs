using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WishHeroes.Data.Models
{
    public class Organization : AuditObject
    {
        [Key]
        public int Id { get; set; }
        public Guid OrganizationCode { get; set; }
        public string OrganizationName { get; set; }
        public decimal AmountDonated { get; set; }
        public bool IsVerified { get; set; }
        public bool IsApproved { get; set; }

        public int WishId { get; set; }
        [ForeignKey("WishId")]
        public virtual Wish Wish { get; set; }
    }
}
