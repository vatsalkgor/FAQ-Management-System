using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FAQMS.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
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

        public ActionResult ForgotPassword()
        {
            return View("ForgotPassword");
        }

    }
}