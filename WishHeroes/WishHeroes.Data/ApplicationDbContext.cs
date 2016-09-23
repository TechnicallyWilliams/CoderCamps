using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WishHeroes.Data.Models;

namespace WishHeroes.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Accomplishment> Accomplishments { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<AddressType> AddressTypes { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Organization_Address> Organization_Address { get; set; }
        public DbSet<OrganizationType> OrganizationTypes { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<User_Organization> User_Organization { get; set; }
        public DbSet<Wish> Wishes { get; set; }
        public DbSet<Phone> Phones { get; set; }
        public DbSet<PhoneType> PhoneTypes { get; set; }
        public DbSet<Organization_Phone> Organization_Phone { get; set; }

        public DbSet<User_Accomplishment> User_Accomplishment { get; set; }

        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}
