using System.Web;
using System.Web.Optimization;

namespace FAQMS
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //            "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/script").Include(
                        "~/Scripts/jquery.min.js",
                        "~/Scripts/bootstrap.min.js",
                        "~/Scripts/bootstrap-select.min.js",
                        "~/Scripts/jquery.slimscroll.js",
                        "~/Scripts/waves.min.js",
                        "~/Scripts/admin.js",
                        "~/Scripts/demo.js"));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/waves.min.css",
                      "~/Content/animate.min.css",
                      "~/Content/style.min.css",
                      "~/Content/all-themes.min.css"));
        }
    }
}
