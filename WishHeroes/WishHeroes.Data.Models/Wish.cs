using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WishHeroes.Data.Models
{
    public class Wish : AuditObject
    {
        [Key]
        public int Id { get; set; }
        public string ReceiverFirstName { get; set; }
        public string ReceiverLastName { get; set; }
        public string Name { get; set; }
        public string Story { get; set; }
        public string Testimony { get; set; }
        public decimal Cost { get; set; }
        public decimal AmountCollected { get; set; }
        public bool IsApproved { get; set; }
        public bool IsGranted { get; set; }
        public bool IsDenied { get; set; }

        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser ApplicationUser { get; set; }

        public string GetReceiverName()
        {
            return String.Format("{0} {1}", ReceiverFirstName, ReceiverLastName);
        }

        public decimal GetRemainingAmount()
        {
            return (AmountCollected < Cost) ? (Cost - AmountCollected) : 0;
        }

        public WishReport GetReport()
        {
            WishReport data = new WishReport();
            
            data.ReceiverFullname = GetReceiverName();
            data.AmountFullfilled = (AmountCollected >= Cost);
            data.RemainingAmount = (Cost - AmountCollected);
            data.OverageAmount = (AmountCollected - Cost);
            data.TimeSinceCreated = (DateTime.UtcNow - DateCreated);
            data.TimeSinceUpdated = (DateTime.UtcNow - DateUpdated);

            if (IsDenied)
            {
                data.ApprovalStatus = "Rejected";
            }
            else if (IsGranted)
            {
                data.ApprovalStatus = "Granted";
            }
            else if (IsApproved)
            {
                data.ApprovalStatus = "Approved";
            }
            else
            {
                data.ApprovalStatus = "In review";
            }

            return data;
        }
    }

    public class WishReport
    {
        public decimal RemainingAmount { get; set; }
        public decimal OverageAmount { get; set; }
        public bool AmountFullfilled { get; set; }
        public string ApprovalStatus { get; set; }
        public string ReceiverFullname { get; set; }
        public TimeSpan TimeSinceCreated { get; set; }
        public TimeSpan TimeSinceUpdated { get; set; }
    }
}