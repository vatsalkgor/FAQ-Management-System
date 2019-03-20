using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FAQMS.Models
{
    public class Admin
    {
        public int Id { get; set; }
        public String a_name { get; set; }
        public String a_pass { get; set; }
        public String a_opass { get; set; }
    }

    public class AdminDBContext : DbContext
    {
        public DbSet<Admin> admin { get; set; }
    }
}