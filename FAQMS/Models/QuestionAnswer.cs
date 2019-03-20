using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace FAQMS.Models
{
    public class QuestionAnswer
    {
        public int Id { get; set; }
        public String Question { get; set; }
        public String Answer { get; set; }
        public bool Status { get; set; }
        public String Notes { get; set; }
        public String Department { get; set; }
        public String Module { get; set; }
        public long Timespend { get; set; }
    }

    public class QuestionAnswerDBContext : DbContext
    {
        public DbSet<QuestionAnswer> QA { get; set; }
    }
}