using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using FAQMS.Models;

namespace FAQMS.Controllers
{
    public class AdminController : Controller
    {
        private AdminDBContext AdminContext = new AdminDBContext();
        private QuestionAnswerDBContext QuestionAnswerContext = new QuestionAnswerDBContext();
        private QuestionTagsDBContext QuestionTagsContext = new QuestionTagsDBContext();
        private TagsDBContext TagsContext = new TagsDBContext();
        private static string CreateMD5(string input)
        {
            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert the byte array to hexadecimal string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString();
            }
        }

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
            password = CreateMD5(password);
            Admin[] result = AdminContext.admin.Where(table => table.a_name == username && table.a_pass == password).ToArray();
            //post request from angular and then varify it here. now static verification
            if (result.Length == 1)
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
            return View();
        }

        public ActionResult CreateQuestion()
        {
            if (Session["username"] == null)
            {
                return RedirectToAction("Index");
            }
            return View("CreateQuestion");
        }

        [HttpGet]
        public JsonResult GetQuestions()
        {
            List<QuestionAnswer> qa = QuestionAnswerContext.QA.ToList();
            return Json(qa, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public bool PutQuestion(String question, String answer, String dept, String mod, String notes, List<int> tags)
        {   
            QuestionAnswer qa = new QuestionAnswer() { Question = question, Answer = answer, Status = true, Department = dept, Module = mod, Notes = notes, Timespend = 0 };
            QuestionAnswerContext.QA.Add(qa);
            QuestionAnswerContext.SaveChanges();
            var id = qa.Id;
            foreach(int tid in tags)
            {
                QuestionTags qt = new QuestionTags(){ QId = id,TagId = tid};
                QuestionTagsContext.QT.Add(qt);
                QuestionTagsContext.SaveChanges();
            }
            return true;
        }

        [HttpPost]
        public bool MakeAllActive(List<int> data, bool new_stat)
        {
            foreach (int d in data)
            {
                var qa = QuestionAnswerContext.QA.Where(t => t.Id == d).First();
                qa.Status = new_stat
;
                try
                {
                    QuestionAnswerContext.SaveChanges();
                }
                catch (Exception e)
                {
                    Debug.WriteLine(e);
                    return false;
                }
            }
            return true;
        }

        [HttpPost]
        public bool DeleteSelected(List<int> data)
        {
            foreach (int d in data)
            {
                QuestionAnswer q = QuestionAnswerContext.QA.Where(t => t.Id == d).First();
                QuestionAnswerContext.QA.Remove(q);
                try
                {

                    QuestionAnswerContext.SaveChanges();
                }
                catch (Exception e)
                {
                    return false;
                }
            }
            return true;
        }

        [HttpPost]
        public bool UpdateQueStatus(int id, bool new_status)
        {
            var t = QuestionAnswerContext.QA.Where(qa => qa.Id == id).First();
            t.Status = new_status;
            try
            {
                QuestionAnswerContext.SaveChanges();
                return true;
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.StackTrace);
                return false;
            }
        }

        [HttpPost]
        public bool DelQue(int id)
        {
            var qa = QuestionAnswerContext.QA.Where(table => table.Id == id).First();
            QuestionAnswerContext.QA.Remove(qa);
            try
            {
                QuestionAnswerContext.SaveChanges();
                return true;
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.StackTrace);
                return false;
            }
        }

        public ActionResult EditQuestion(int id)
        {
            QuestionAnswer qa = QuestionAnswerContext.QA.Where(t => t.Id == id).First();
            ViewData["qa"] = qa;
            return View();
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


        //Starting methods for Tags Management
        public ActionResult TagsManagement()
        {
            if (Session["username"] == null)
            {
                return RedirectToAction("Index");
            }
            return View("TagsMgmt");
        }

        [HttpGet]
        public JsonResult GetTags()
        {
            List<Tags> tags = TagsContext.Tags.ToList();
            return Json(tags, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public int AddTag(String tag)
        {
            if (tag.Length == 0)
            {
                return 0;
            }
            else
            {
                TagsContext.Tags.Add(new Tags() { Tag = tag });
                try
                {
                    TagsContext.SaveChanges();
                }
                catch (DbUpdateException db)
                {
                    Debug.WriteLine(db);
                    return 1;
                }
                return 2;
            }
        }

        [HttpPost]
        public int UpdateTag(int id, String str)
        {
            var t = TagsContext.Tags.Where(table => table.Id == id).First();
            t.Tag = str;
            try
            {
                TagsContext.SaveChanges();
                return 1;
            }
            catch (DbUpdateException e)
            {
                Debug.WriteLine(e.StackTrace);
                return 0;
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.StackTrace);
                return -1;
            }
        }

        [HttpPost]
        public int DeleteTag(int id)
        {
            var t = TagsContext.Tags.Where(table => table.Id == id).First();
            TagsContext.Tags.Remove(t);
            try
            {
                TagsContext.SaveChanges();
                return 1;
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.StackTrace);
                return 0;
            }
        }

        [HttpPost]
        public JsonResult SearchTag(String query)
        {
            return Json(TagsContext.Tags.Where(t => t.Tag.Contains(query)).ToList());
        }
    }

}