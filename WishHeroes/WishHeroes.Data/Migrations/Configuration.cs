namespace WishHeroes.Data.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using WishHeroes.Data.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ApplicationDbContext db)
        {
            bool seedRoles = true;
            bool seedUsers = true;
            bool seedStates = true;
            bool seedPhoneType = true;
            bool seedPhones = true;
            bool seedAddressTypes = true;
            bool seedAdresses = true;
            bool seedWishes = true;
            bool seedAccomplishments = true;
            bool updateAccomplishment = false;
            bool seedAccomplishmentsLookUp = true;

            if (seedRoles) CreateRoles(db);
            if (seedUsers) CreateUsers(db);
            if (seedStates) CreateStates(db);
            if (seedPhoneType) CreatePhoneType(db);
            if (seedPhones) CreatePhones(db);
            if (seedAddressTypes) CreateAddressTypes(db);
            if (seedAdresses) CreateAddresses(db);
            if (seedWishes) CreateWishes(db);
            if (seedAccomplishments) CreateAccomplishments(db);
            if (updateAccomplishment) UpdateAccomplishments(db);
            if (seedAccomplishmentsLookUp) CreateAccomplishmentsLookUp(db);
        }



        private void CreatePhoneType(ApplicationDbContext db)
        {
            db.PhoneTypes.AddOrUpdate(
                new PhoneType { Type = "Home" },
                new PhoneType { Type = "Mobile" },
                new PhoneType { Type = "Work" },
                new PhoneType { Type = "Fax" },
                new PhoneType { Type = "Company" }
            );
            db.SaveChanges();
        }
        private void CreateRoles(ApplicationDbContext db)
        {
            RoleManager<IdentityRole> roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(db));

            if (!roleManager.RoleExists("Admin")) roleManager.Create(new IdentityRole { Name = "Admin" });
            if (!roleManager.RoleExists("User")) roleManager.Create(new IdentityRole { Name = "User" });
            if (!roleManager.RoleExists("Organization")) roleManager.Create(new IdentityRole { Name = "Organization" });
            if (!roleManager.RoleExists("Partner")) roleManager.Create(new IdentityRole { Name = "Partner" });
            if (!roleManager.RoleExists("Staff")) roleManager.Create(new IdentityRole { Name = "Staff" });
            if (!roleManager.RoleExists("Sponsor")) roleManager.Create(new IdentityRole { Name = "Sponsor" });
        }

        private void CreateUsers(ApplicationDbContext db)
        {
            UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db)) {  };
           // UserManager<UserValidator> = new UserValidator<ApplicationUser>(UserManager) { AllowOnlyAlphanumericUserNames = false };

            // Seeding Admins
            if (!db.Users.Any(u => u.UserName == "dexterwilliams@hotmail.com"))
            {
                ApplicationUser User = new ApplicationUser
                {
                    UserName = "dexterwilliams@hotmail.com",
                    Email = "dexterwilliams@hotmail.com",
                    PhoneNumber = "281-908-0313",
                    FirstName = "Dexter",
                    LastName = "Williams",
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = DateTime.UtcNow
                };
                userManager.Create(User, "123123");
                userManager.AddToRole(User.Id, "Admin");
            }

            if (!db.Users.Any(u => u.UserName == "docodo19@gmail.com"))
            {
                ApplicationUser User = new ApplicationUser
                {
                    UserName = "docodo19@gmail.com",
                    Email = "docodo19@gmail.com",

                    FirstName = "Daniel",
                    LastName = "Do",
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = DateTime.UtcNow
                };
                userManager.Create(User, "123123");
                userManager.AddToRole(User.Id, "Admin");
            }

            if (!db.Users.Any(u => u.UserName == "twenty40@gmail.com"))
            {
                ApplicationUser User = new ApplicationUser
                {
                    UserName = "twenty40@gmail.com",
                    Email = "twenty40@gmail.com",
                    PhoneNumber = "401-559-4143",
                    FirstName = "Christian",
                    LastName = "Soler",
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = DateTime.UtcNow
                };
                userManager.Create(User, "123123");
                userManager.AddToRole(User.Id, "Admin");
            }


            // Seeding Users
            if (!db.Users.Any(u => u.UserName == "user@email.com"))
            {
                ApplicationUser User = new ApplicationUser
                {
                    UserName = "user@email.com",
                    Email = "user@email.com",
                    PhoneNumber = "555-555-555",
                    FirstName = "Joe",
                    LastName = "Doe",
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = DateTime.UtcNow
                };
                userManager.Create(User, "123123");
                userManager.AddToRole(User.Id, "User");
            }

            if (!db.Users.Any(u => u.UserName == "Donater@email.com"))
            {
                ApplicationUser User = new ApplicationUser
                {
                    UserName = "Donater@email.com",
                    Email = "Donater@email.com",
                    PhoneNumber = "555-555-555",
                    FirstName = "Bill",
                    LastName = "Gates",
                    AmountDonated = 100,
                    TimesDonated = 5,
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = DateTime.UtcNow
                };
                userManager.Create(User, "123123");
                userManager.AddToRole(User.Id, "User");
            }

            if (!db.Users.Any(u => u.UserName == "DonaterTwo@email.com"))
            {
                ApplicationUser User = new ApplicationUser
                {
                    UserName = "DonaterTwo@email.com",
                    Email = "DonaterTwo@email.com",
                    PhoneNumber = "555-555-555",
                    FirstName = "Elon",
                    LastName = "Musk",
                    AmountDonated = 500,
                    TimesDonated = 10,
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = DateTime.UtcNow
                };
                userManager.Create(User, "123123");
                userManager.AddToRole(User.Id, "User");
            }
        }



        private void CreateStates(ApplicationDbContext db)
        {
            db.States.AddOrUpdate(s => s.StateName,
                new State { StateName = "Alabama", StateAbbreviation = "AL" }, new State { StateName = "Alaska", StateAbbreviation = "AK" }, new State { StateName = "Arizona", StateAbbreviation = "AR" },
                new State { StateName = "California", StateAbbreviation = "CA" }, new State { StateName = "Colorado", StateAbbreviation = "CO" }, new State { StateName = "Connecticut", StateAbbreviation = "CT" },
                new State { StateName = "Delaware", StateAbbreviation = "DE" }, new State { StateName = "District of Columbia", StateAbbreviation = "DC" }, new State { StateName = "Florida", StateAbbreviation = "FL" },
                new State { StateName = "Georgia", StateAbbreviation = "GA" }, new State { StateName = "Hawaii", StateAbbreviation = "HI" }, new State { StateName = "Idaho", StateAbbreviation = "ID" },
                new State { StateName = "Illinois", StateAbbreviation = "IL" }, new State { StateName = "Indiana", StateAbbreviation = "IN" }, new State { StateName = "Iowa", StateAbbreviation = "IA" },
                new State { StateName = "Kansas", StateAbbreviation = "KS" }, new State { StateName = "Arkansas", StateAbbreviation = "AK" }, new State { StateName = "Kentucky", StateAbbreviation = "KY" },
                new State { StateName = "Louisiana", StateAbbreviation = "LA" }, new State { StateName = "Maine", StateAbbreviation = "ME" }, new State { StateName = "MaryLand", StateAbbreviation = "MD" },
                new State { StateName = "Massachusetts", StateAbbreviation = "MA" }, new State { StateName = "Michigan", StateAbbreviation = "MI" }, new State { StateName = "Minnesota", StateAbbreviation = "MN" },
                new State { StateName = "Mississippi", StateAbbreviation = "MS" }, new State { StateName = "Missouri", StateAbbreviation = "MO" }, new State { StateName = "Montana", StateAbbreviation = "MT" },
                new State { StateName = "Nebraska", StateAbbreviation = "NE" }, new State { StateName = "Nevada", StateAbbreviation = "NV" }, new State { StateName = "New Hampshire", StateAbbreviation = "NH" },
                new State { StateName = "New Jersey", StateAbbreviation = "NJ" }, new State { StateName = "New Mexico", StateAbbreviation = "NM" }, new State { StateName = "New York", StateAbbreviation = "NY" },
                new State { StateName = "North Carolina", StateAbbreviation = "NC" }, new State { StateName = "North Dakota", StateAbbreviation = "ND" }, new State { StateName = "Ohio", StateAbbreviation = "OH" },
                new State { StateName = "Oklahoma", StateAbbreviation = "OK" }, new State { StateName = "Oregon", StateAbbreviation = "OR" }, new State { StateName = "Pennsylvania", StateAbbreviation = "PA" },
                new State { StateName = "Rhode Island", StateAbbreviation = "RI" }, new State { StateName = "South Carolina", StateAbbreviation = "SC" }, new State { StateName = "South Dakota", StateAbbreviation = "SD" },
                new State { StateName = "Tennessee", StateAbbreviation = "TN" }, new State { StateName = "Texas", StateAbbreviation = "TX" }, new State { StateName = "Utah", StateAbbreviation = "UT" },
                new State { StateName = "Vermont", StateAbbreviation = "VT" }, new State { StateName = "Virgina", StateAbbreviation = "VA" }, new State { StateName = "Washington", StateAbbreviation = "WA" },
                new State { StateName = "West Virginia", StateAbbreviation = "WV" }, new State { StateName = "Wisconsin", StateAbbreviation = "WI" }, new State { StateName = "Wyoming", StateAbbreviation = "WY" });
            db.SaveChanges();
        }

        private void CreateWishes(ApplicationDbContext db)
        {
            db.Wishes.AddOrUpdate(w => w.Name,
                new Wish
                {
                    UserId = db.Users.FirstOrDefault(u => u.UserName == "user@email.com").Id,
                    ReceiverFirstName = "Peanut",
                    ReceiverLastName = "Man",
                    Name = "Jar of Peanutbutter",
                    Testimony = "I can't believe everyone did this for me. I am soo grateful",
                    Story = "Peanutbutter Man can't get enough peanubutter",
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = DateTime.UtcNow,
                    Cost = 10,
                    AmountCollected = 0,
                    IsActive = true,
                    IsGranted = false,
                    IsApproved = true,
                    IsDenied = false
                },

                new Wish
                {
                    UserId = db.Users.FirstOrDefault(u => u.UserName == "user@email.com").Id,
                    ReceiverFirstName = "Jelly",
                    ReceiverLastName = "Man",
                    Name = "Jar of Jelly",
                    Testimony = "Just Wow!",
                    Story = "Jelly Man can't get enough Jelly",
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = DateTime.UtcNow,
                    Cost = 10,
                    AmountCollected = 0,
                    IsActive = true,
                    IsGranted = false,
                    IsApproved = true,
                    IsDenied = false
                },

                new Wish
                {
                    UserId = db.Users.FirstOrDefault(u => u.UserName == "user@email.com").Id,
                    ReceiverFirstName = "Chocolate",
                    ReceiverLastName = "Man",
                    Name = "Nutella Man",
                    Testimony = "Not bad!",
                    Story = "Chocolate Man can't get enough Chocolate",
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = DateTime.UtcNow,
                    Cost = 10,
                    AmountCollected = 0,
                    IsActive = true,
                    IsGranted = false,
                    IsApproved = true,
                    IsDenied = false
                });

            db.SaveChanges();
        }

        private void CreateAddressTypes(ApplicationDbContext db)
        {
            db.AddressTypes.AddOrUpdate(a => a.Type,
                new AddressType { Type = "Home" },
                new AddressType { Type = "Work" },
                new AddressType { Type = "P.O. Box" });
            db.SaveChanges();
        }

        private void CreateAddresses(ApplicationDbContext db)
        {
            db.Addresses.AddOrUpdate(a => new { a.Address1, a.City, a.StateId },
                new Address
                {
                    Address1 = "1337 Peanutbutter St suite 777",
                    City = "Pearland",
                    StateId = db.States.FirstOrDefault(s => s.StateAbbreviation == "TX").Id,
                    ZipCode = 77584,
                    AddressTypeId = db.AddressTypes.FirstOrDefault(p => p.Type == "Work").Id,
                    UserId = db.Users.Where(u => u.Email == "user@email.com").FirstOrDefault().Id,
                },
                new Address
                {
                    Address1 = "21054 Carmel Valley Drive",
                    City = "Katy",
                    StateId = db.States.FirstOrDefault(s => s.StateAbbreviation == "TX").Id,
                    ZipCode = 77449,
                    AddressTypeId = db.AddressTypes.FirstOrDefault(p => p.Type == "Home").Id,
                    UserId = db.Users.Where(u => u.Email == "twenty40@gmail.com").FirstOrDefault().Id,
                },
                new Address
                {
                    Address1 = "90210 Donation Ln.",
                    City = "San Francisco",
                    StateId = db.States.FirstOrDefault(s => s.StateAbbreviation == "CA").Id,
                    ZipCode = 94102,
                    AddressTypeId = db.AddressTypes.FirstOrDefault(p => p.Type == "Home").Id,
                    UserId = db.Users.Where(u => u.Email == "Donater@email.com").FirstOrDefault().Id,
                },
                new Address
                {
                    Address1 = "90210 DonationTwo Ln.",
                    City = "Palo Alto",
                    StateId = db.States.FirstOrDefault(s => s.StateAbbreviation == "CA").Id,
                    ZipCode = 94301,
                    AddressTypeId = db.AddressTypes.FirstOrDefault(p => p.Type == "Home").Id,
                    UserId = db.Users.Where(u => u.Email == "DonaterTwo@email.com").FirstOrDefault().Id,
                });
            db.SaveChanges();
        }

        private void CreatePhones(ApplicationDbContext db)
        {
            db.Phones.AddOrUpdate(p => p.PhoneNumber,
                new Phone { PhoneNumber = "2067659109", PhoneTypeId = db.PhoneTypes.FirstOrDefault(pt => pt.Type == "Mobile").Id, UserId = db.Users.Where(u => u.Email == "docodo19@gmail.com").FirstOrDefault().Id },
                new Phone { PhoneNumber = "5555555555", PhoneTypeId = db.PhoneTypes.FirstOrDefault(pt => pt.Type == "Mobile").Id, UserId = db.Users.Where(u => u.Email == "user@email.com").FirstOrDefault().Id },
                new Phone { PhoneNumber = "4015594143", PhoneTypeId = db.PhoneTypes.FirstOrDefault(pt => pt.Type == "Mobile").Id, UserId = db.Users.Where(u => u.Email == "twenty40@gmail.com").FirstOrDefault().Id },
                new Phone { PhoneNumber = "5555555555", PhoneTypeId = db.PhoneTypes.FirstOrDefault(pt => pt.Type == "Mobile").Id, UserId = db.Users.Where(u => u.Email == "Donater@email.com").FirstOrDefault().Id },
                new Phone { PhoneNumber = "5555555555", PhoneTypeId = db.PhoneTypes.FirstOrDefault(pt => pt.Type == "Mobile").Id, UserId = db.Users.Where(u => u.Email == "DonaterTwo@email.com").FirstOrDefault().Id });
            db.SaveChanges();
        }

        private void CreateAccomplishments(ApplicationDbContext db)
        {
            db.Accomplishments.AddOrUpdate(a => a.AccomplishmentName,
                new Accomplishment { AccomplishmentName = "Kick Starter", AccomplishmentLevel = 1, ImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBrVY2lJzAiQ-GB6H7DG_vklegEqDlpQXLygEOSSLMqCmVTWdD" },
                new Accomplishment { AccomplishmentName = "Second Fiddler", AccomplishmentLevel = 2, ImageUrl = "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRoocn_npLF7UfDHjw6cVF530k3Gum7eSq23KVgIcUb6tR-sibN" });
            db.SaveChanges();
        }

        private void UpdateAccomplishments(ApplicationDbContext db)
        {
            db.Accomplishments.Select(a => a.AccomplishmentName == null).Select(a => new Accomplishment
            {
                AccomplishmentName = "Kick Starter",
                AccomplishmentLevel = 1,
                ImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBrVY2lJzAiQ-GB6H7DG_vklegEqDlpQXLygEOSSLMqCmVTWdD"

            }).FirstOrDefault();

            db.SaveChanges();

            db.Accomplishments.Select(a => a.AccomplishmentName == null).Select(a => new Accomplishment
            {
                AccomplishmentName = "Second Fiddler",
                AccomplishmentLevel = 2,
                ImageUrl = "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRoocn_npLF7UfDHjw6cVF530k3Gum7eSq23KVgIcUb6tR-sibN"
            }).FirstOrDefault();

            db.SaveChanges();
        }

        private void CreateAccomplishmentsLookUp(ApplicationDbContext db)
        {
            db.User_Accomplishment.AddOrUpdate(u_a => u_a.AccomplishmentId,
                new User_Accomplishment { AccomplishmentId = db.Accomplishments.Where(a => a.AccomplishmentLevel == 1).FirstOrDefault().Id, UserId = db.Users.Where(u => u.UserName == "Donater@email.com").FirstOrDefault().Id },
                new User_Accomplishment { AccomplishmentId = db.Accomplishments.Where(a => a.AccomplishmentLevel == 2).FirstOrDefault().Id, UserId = db.Users.Where(u => u.UserName == "DonaterTwo@email.com").FirstOrDefault().Id });
            db.SaveChanges();
        }

    }
}