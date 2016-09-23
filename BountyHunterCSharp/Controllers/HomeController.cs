using BountyHunterCSharp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;

namespace BountyHunterCSharp.Controllers
{
    public class HomeController : Controller
    {

       

        public ActionResult Index()
        {
            //List<BountyHunter> specialCharacters = antagonist.addAndReturnList();
            //List<Jedi> basicCharacters = protagonist.addAndReturnList();

            //List<Character> protagonist = ServiceClass.Instance.ReturnList();
            //List<Character> antagonist = ServiceClass.Instance.ReturnNiceList();
            List<Character> allCharacters = ServiceClass.Instance.ReturnAll();
  
            return View(allCharacters);
        }


        public ActionResult BountyHunters()
        {

            List<Character> protagonist = ServiceClass.Instance.ReturnList();

            return View(protagonist);
        }


        public ActionResult Jedis()
        {
            List<Character> antagonist = ServiceClass.Instance.ReturnNiceList();
            //List<Jedi> characters = protagonist.addAndReturnList();

            return View(antagonist);
        }

        [HttpGet]
        public ActionResult CreateHunter()
        {
            return View();
        }

        [HttpGet]
        public ActionResult CreateJedi()
        {
            return View();
        }

        [HttpPost]
        public ActionResult CreateHunter(BountyHunter model) //The button activates this 1st instanciation
        {
            ServiceClass.Instance.AddToCharacters(model); //The button passed model to this method which goes to the instance than adds this.

            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult CreateJedi(Jedi model) //The button activates this 1st instanciation
        {
            ServiceClass.Instance.AddToNiceCharacters(model); //The button passed model to this method which goes to the instance than adds this.

            return RedirectToAction("Index");
        }

        //cOMMENTS IN RAZOR fuck shit up.//Even though there are red squiqly's for lighSaberColor, it worked.
        //My second big problem on this project was getting the form in the view to read the property created in a child class along with 
        //the base class.  mY THIRD MINOR ISSUEAS WAS using ---> new { @class = "Jedi" }) <--- in the form. It still let me build but I didn't need this.

    }
}