using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using WishHeroes.Frameworks.Helpers;
using WishHeroes.Repository.Interfaces;
using WishHeroes.Repository.Adapters;
using WishHeroes.ViewModels;
using WishHeroes.Frameworks.Extensions;

namespace WishHeroes.Controllers
{
    public class HomeController : Controller
    {
        private IWish _adapter;

        public HomeController()
        {
            _adapter = new WishAdapter();
        }

        public ActionResult Index()
        {

            string text = "hello world".ToTitleCase();
            

            WishViewModel model = _adapter.GetRandomWish();

            return View(model);
        }

        public ActionResult About()
        {
            if (UserProfile.Current != null)
            {
                string id = UserProfile.Current.UserId;
                bool admin = UserProfile.Current.IsAdmin;
            }

            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }

        public ActionResult Heroes()
        {
            return View();
        }
    }
}