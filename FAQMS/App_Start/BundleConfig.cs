﻿using System.Web;
using System.Web.Optimization;

namespace FAQMS
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/blankscript").Include(
                        "~/Scripts/jquery.min.js",
                        "~/Scripts/bootstrap.min.js",
                        "~/Scripts/jquery.slimscroll.js",
                        "~/Scripts/waves.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/themescript").Include(
                        "~/Scripts/admin.js"));

            bundles.Add(new StyleBundle("~/Content/blankcss").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/waves.min.css",
                      "~/Content/animate.min.css"));

            bundles.Add(new StyleBundle("~/Content/customthemecss").Include(
                      "~/Content/style.min.css",
                      "~/Content/dataTables.bootstrap.css",
                      "~/Content/theme-red.css"));

        }
    }
}
