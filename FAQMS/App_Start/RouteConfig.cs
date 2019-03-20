using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace FAQMS
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

            routes.MapRoute(
                "Admin", // Route name
                "{controller}/{action}/{id}/{str}", // URL with parameters
                new { controller = "Admin", action = "Index", id = UrlParameter.Optional,str=UrlParameter.Optional } // Parameter defaults
            );
        }
    }
}
