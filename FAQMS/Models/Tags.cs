using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FAQMS.Models
{
    public class Tags
    {
        public int Id { get; set; }
        public String Tag { get; set; } 
    }
    public class TagsDBContext : DbContext
    {
        public DbSet<Tags> Tags { get; set; }
    }

}