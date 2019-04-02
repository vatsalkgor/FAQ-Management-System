using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FAQMS.Models
{
    public class Context:DbContext
    {
        public DbSet<Admin> AdminContext { get; set; }
        public DbSet<Departments> DeptContext { get; set; }
        public DbSet<Modules> ModContext { get; set; }
        public DbSet<QuestionAnswer> QuestionAnswerContext { get; set; }
        public DbSet<QuestionTags> QuestionTagsContext { get; set; }
        public DbSet<Tags> TagsContext { get; set; }
    }
}