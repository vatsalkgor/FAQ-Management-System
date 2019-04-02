using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FAQMS.Models
{
    public class Departments
    {
        public int Id { get; set; }
        public String Department { get; set; }
        //public ICollection<CourseAssignment> CourseAssignments { get; set; }

    }

}