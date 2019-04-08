using FAQMS.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FAQMS.Controllers
{
    public class HomeController : Controller
    {
        private Context c = new Context();
        public ActionResult Index()
        {
            return View("Index");
        }

        [HttpGet]
        public JsonResult GetTop()
        {
            List<QuestionAnswer> qa = c.QuestionAnswerContext.Where(t => t.Status == true).OrderByDescending(t => t.Timespend).Take(5).ToList();
            return Json(qa, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public long UpdateTimespend(int id)
        {
            var qa = c.QuestionAnswerContext.Where(t => t.Id == id).First();
            qa.Timespend = qa.Timespend + 1;
            c.SaveChanges();
            return qa.Timespend;
        }

        [HttpPost]
        public JsonResult ModuleQuestion(int mod)
        {
            List<QuestionAnswer> qa = c.QuestionAnswerContext.Where(t => t.Module == mod && t.Status == true).OrderByDescending(t => t.Timespend).ToList();
            return Json(qa, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SearchQuestion(String query)
        {
            return Json(c.QuestionAnswerContext.Where(t => t.Question.Contains(query) && t.Status == true).ToList());
        }

        [HttpPost]
        public JsonResult FindRelatedQuestion(int id)
        {
            var qa = c.QuestionAnswerContext.SqlQuery("SELECT * FROM dbo.QuestionAnswers WHERE Id IN (SELECT QId FROM dbo.QuestionTags WHERE TagId IN (Select TagId from dbo.QuestionTags where QId=@QId)) AND Id != @QId AND Status='"+true+"' ORDER BY Timespend DESC",new SqlParameter("@QId",id));
            return Json(qa.ToList());
        }

        [HttpGet]
        public JsonResult GetDeptMod()
        {
            return Json(c.ModContext.Join(c.DeptContext, m => m.DId, d => d.Id, (m, d) => new { m.Id, m.Module, d.Department }).GroupBy(d => d.Department).ToList(),JsonRequestBehavior.AllowGet);

        }
    }
}