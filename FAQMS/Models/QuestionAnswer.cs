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
        public int Department { get; set; }
        public int Module { get; set; }
        public long Timespend { get; set; }
    }

}