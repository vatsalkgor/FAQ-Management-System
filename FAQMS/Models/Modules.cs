using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FAQMS.Models
{
    public class Modules
    {
        public int Id { get; set; }
        public string Module { get; set; }
        public int DId { get; set; }
    }
}