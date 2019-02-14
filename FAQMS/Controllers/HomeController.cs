using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FAQMS.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            if (Session["username"] != null)
            {
                return RedirectToAction("Dashboard");
            }
            return View();

        }

        [HttpPost]
        public ActionResult Index(string username, string password)
        {
            //post request from angular and then varify it here. now static verification
            if (username == "vatsal" && password == "vatsal123")
            {
                Session["username"] = username;
                return RedirectToAction("Dashboard");
            }
            else
            {
                ViewBag.failMsg = "Username or password is wrong.";
                return View("Index");
            }


        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Dashboard()
        {
            if (Session["username"] == null)
            {
                return RedirectToAction("Index");
            }
            return View("Dashboard");
        }

        public ActionResult CreateQuestion()
        {
            if (Session["username"] == null)
            {
                return RedirectToAction("Index");
            }
            return View("CreateQuestion");
        }

        public ActionResult Logout()
        {
            Session.Abandon();
            return RedirectToAction("Index");
        }
    }
}