using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using FAQMS.Models;

namespace FAQMS.Controllers
{
    public class AdminController : Controller
    {
        private Context c = new Context();
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
            Admin[] result = c.AdminContext.Where(table => table.a_name == username && table.a_pass == password).ToArray();
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

        //Method for Dashboard
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
            List<QuestionAnswer> qa = c.QuestionAnswerContext.ToList();
            return Json(qa, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetQuestionsForDepartment(int id)
        {
            return Json(c.QuestionAnswerContext.Where(t => t.Department == id).ToList());
        }

        //Create Question Method
        [HttpPost]
        public bool PutQuestion(String question, String answer, int dept, int mod, String notes, List<int> tags)
        {
            QuestionAnswer qa = new QuestionAnswer() { Question = question, Answer = answer, Status = true, Department = dept, Module = mod, Notes = notes, Timespend = 0 };
            c.QuestionAnswerContext.Add(qa);
            c.SaveChanges();
            var id = qa.Id;
            foreach (int tid in tags)
            {
                QuestionTags qt = new QuestionTags() { QId = id, TagId = tid };
                c.QuestionTagsContext.Add(qt);
                c.SaveChanges();
            }
            return true;
        }

        [HttpPost]
        public bool MakeAllActive(List<int> data, bool new_stat)
        {
            foreach (int d in data)
            {
                var qa = c.QuestionAnswerContext.Where(t => t.Id == d).First();
                qa.Status = new_stat
;
                try
                {
                    c.SaveChanges();
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
                QuestionAnswer q = c.QuestionAnswerContext.Where(t => t.Id == d).First();
                c.QuestionAnswerContext.Remove(q);
                try
                {

                    c.SaveChanges();
                }
                catch (Exception e)
                {
                    Debug.WriteLine(e.StackTrace);
                    return false;
                }
            }
            return true;
        }

        [HttpPost]
        public bool UpdateQueStatus(int id, bool new_status)
        {
            var t = c.QuestionAnswerContext.Where(qa => qa.Id == id).First();
            t.Status = new_status;
            try
            {
                c.SaveChanges();
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
            var qa = c.QuestionAnswerContext.Where(table => table.Id == id).First();
            c.QuestionAnswerContext.Remove(qa);
            try
            {
                c.SaveChanges();
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
            QuestionAnswer qa = c.QuestionAnswerContext.Where(t => t.Id == id).First();
            ViewData["qa"] = qa;
            QuestionTags[] tags = c.QuestionTagsContext.Where(t => t.QId == id).ToArray();
            ViewData["tags"] = Json(tags);
            return View();
        }

        [ValidateInput(false)]
        [HttpPost]
        public int SaveEditedQuestion(String q, String a, String n, List<int> t, int id)
        {
            var qa = c.QuestionAnswerContext.First(qu => qu.Id == id);
            qa.Question = q;
            qa.Answer = a;
            qa.Notes = n;
            try
            {
                c.SaveChanges();
            }catch(DbUpdateException e)
            {
                Debug.WriteLine(e);
                return 0;
            }
            c.QuestionTagsContext.RemoveRange(c.QuestionTagsContext.Where(ta => ta.QId == id));
            try
            {
                c.SaveChanges();
            }
            catch (DbUpdateException e)
            {
                Debug.WriteLine(e);
                return 0;
            }
            foreach (int tid in t)
            {
                QuestionTags qt = new QuestionTags() { QId = id, TagId = tid };
                c.QuestionTagsContext.Add(qt);
                try
                {
                    c.SaveChanges();
                }
                catch(DbUpdateException e)
                {
                    return 0;
                }
            }
            return 1;
        }

        [HttpPost]
        public JsonResult SearchQuestion(String query)
        {
            return Json(c.QuestionAnswerContext.Where(t => t.Question.Contains(query)).ToList());
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
            List<Tags> tags = c.TagsContext.ToList();
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
                c.TagsContext.Add(new Tags() { Tag = tag });
                try
                {
                    c.SaveChanges();
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
            var t = c.TagsContext.Where(table => table.Id == id).First();
            t.Tag = str;
            try
            {
                c.SaveChanges();
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
            var t = c.TagsContext.Where(table => table.Id == id).First();
            c.TagsContext.Remove(t);
            try
            {
                c.SaveChanges();
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
            return Json(c.TagsContext.Where(t => t.Tag.Contains(query)).ToList());
        }

        // Methods for Department Management starts here

        // Default Method
        public ActionResult DepartmentManagement()
        {
            return View("DepartmentMgmt");
        }

        // Add Department
        [HttpPost]
        public int AddDept(String data)
        {
            if (data.Length == 0)
            {
                return 0;
            }
            else
            {
                c.DeptContext.Add(new Departments() { Department = data });
                try
                {
                    c.SaveChanges();
                }
                catch (DbUpdateException db)
                {
                    Debug.WriteLine(db);
                    return 1;
                }
                return 2;
            }
        }

        [HttpGet]
        public JsonResult GetDepts()
        {
            List<Departments> depts = c.DeptContext.ToList();
            return Json(depts, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetDeptsCount()
        {
            var query = from p in c.DeptContext
                        let cc = (from q in c.QuestionAnswerContext
                                  where p.Id == q.Department
                                  select q).Count()
                        select new { id = p.Id, dept = p.Department, count = cc };
            return Json(query.ToList(), JsonRequestBehavior.AllowGet);
        }
        //Add Module
        [HttpPost]
        public int AddMod(String m, int d)
        {
            if (m.Length == 0)
            {
                return 0;
            }
            else
            {
                c.ModContext.Add(new Modules() { Module = m, DId = d });
                try
                {
                    c.SaveChanges();
                }
                catch (DbUpdateException db)
                {
                    Debug.WriteLine(db);
                    return 1;
                }
                return 2;
            }
        }

        [HttpGet]
        public JsonResult GetMods()
        {
            var mods = c.ModContext.Join(c.DeptContext, m => m.DId, d => d.Id, (m, d) => new { m.Id, m.Module, d.Department }).ToList();
            //List < Modules > mods = ModContext.Modules.ToList();
            return Json(mods, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public int UpdateDept(int id, String str)
        {
            var t = c.DeptContext.Where(table => table.Id == id).First();
            t.Department = str;
            try
            {
                c.SaveChanges();
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
        public int DeleteDept(int id)
        {
            var t = c.DeptContext.Where(table => table.Id == id).First();
            c.DeptContext.Remove(t);
            try
            {
                c.SaveChanges();
                return 1;
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.StackTrace);
                return 0;
            }
        }

        [HttpPost]
        public int UpdateMod(int id, String str)
        {
            var t = c.ModContext.Where(table => table.Id == id).First();
            t.Module = str;
            try
            {
                c.SaveChanges();
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
        public int DeleteMod(int id)
        {
            var t = c.ModContext.Where(table => table.Id == id).First();
            c.ModContext.Remove(t);
            try
            {
                c.SaveChanges();
                return 1;
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.StackTrace);
                return 0;
            }
        }

        public JsonResult GetAllModule()
        {
            return Json(c.ModContext.ToList(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SearchDept(String query)
        {
            return Json(c.DeptContext.Where(t => t.Department.Contains(query)).ToList());
        }

        [HttpPost]
        public JsonResult SearchMod(String query)
        {
            return Json(c.ModContext.Join(c.DeptContext, m => m.DId, d => d.Id, (m, d) => new { m.Id, m.Module, d.Department }).Where(m => m.Module.Contains(query)).ToList());
        }

        [HttpPost]
        public JsonResult SearchModById(int id)
        {
            return Json(c.ModContext.Where(ta => ta.DId == id).ToList());
        }
    }

}