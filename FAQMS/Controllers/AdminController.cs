using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FAQMS.Models;

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

        public ActionResult TagsManagement()
        {
            if (Session["username"] == null)
            {
                return RedirectToAction("Index");
            }
            return View("TagsMgmt");
        }

        [HttpGet]
        public JsonResult GetQuestions()
        {
            List<QuestionAnswer> qa = new List<QuestionAnswer> {
                new QuestionAnswer(){Question = "What is performance matrix?",Answer = "A performance metric measures a recruiter's behavior, activities, and performance. It assesses how well recruiter is doing his/her respective tasks and how he/she is accomplishing his/her objectives."},
                new QuestionAnswer(){Question = "What does Recs stand for?",Answer = "Recs stands for requirements."},
                new QuestionAnswer(){Question = "How do I see requirements assigned to me?",Answer = "On the dashboard you can see the Recs assigned row and you can see all the requirements that are assigned to you today or yesterday or in last 7 days or in last month."},
                new QuestionAnswer(){Question = "How do I see previous submissions by me?",Answer = "On the dashboard you can see the Submissions row and you can see all the submissions done by you on  today or yesterday or in last 7 days or in last month."},
                new QuestionAnswer(){Question = "How do I see the CO submitted by me?",Answer = "On the dashboard you can see the Cos Count row and you can see all the Cos submitted by you on  today or yesterday or in last 7 days or in last month."},
                new QuestionAnswer(){Question = "How do I see interviews that were previously scheduled by me?",Answer = "On the dashboard you can see the Interview row and you can see all the interviews scheduled by you on  today or yesterday or in last 7 days or in last month."},
                new QuestionAnswer(){Question = "What is the meaning of bad delivery?",Answer = "A bad delivery happens when the client rejects a candidate that is recruited by a recruiter."},
                new QuestionAnswer(){Question = "What does the different rations indicate on dashboard?",Answer = "The different ratios shows the performance of the recruiter on different stages like how many candidates selected by the recruiter are hired. "},
            };

            return Json(qa,JsonRequestBehavior.AllowGet);

        }

    }
}