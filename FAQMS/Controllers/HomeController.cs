using FAQMS.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FAQMS.Controllers
{
    public class HomeController : Controller
    {
        private QuestionAnswerDBContext QuestionAnswerContext = new QuestionAnswerDBContext();
        public ActionResult Index()
        {
            return View("Index");
        }

        [HttpGet]
        public JsonResult GetTop()
        {
            List<QuestionAnswer> qa = QuestionAnswerContext.QA.OrderByDescending(t => t.Timespend).Take(5).ToList();
            Debug.WriteLine(qa.Count);
            return Json(qa, JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public JsonResult ModuleQuestion(String m)
        {
            List<QuestionAnswer> qa = QuestionAnswerContext.QA.Where(t => t.Module == m).OrderByDescending(t => t.Timespend).ToList();
            return Json(qa, JsonRequestBehavior.AllowGet);
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


    }
}