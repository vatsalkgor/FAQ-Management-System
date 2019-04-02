using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FAQMS.Models
{
    public class QuestionTags
    {
        public int Id { get; set; }
        public int QId { get; set; }
        public int TagId { get; set; }
    }
}