using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using WishHeroes.Repository.Adapters;
using WishHeroes.Repository.Interfaces;
using WishHeroes.ViewModels;

namespace WishHeroes.Areas.User.Controllers
{
    public class WishController : Controller
    {
        private IWish _adapter;

        public WishController()
        {
            _adapter = new WishAdapter();
        }

        public ActionResult Index()
        {

            //return View(".../Areas/User/Views/Wish");
            return View();
        }

        [HttpPost]
        public ActionResult CreateWish(AddWishViewModel model)
        {


            _adapter.Add(model);

            return RedirectToAction("Index", "Home");
        }




    }


}