﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ICOE
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Account", action = "Login", id = UrlParameter.Optional }
                //defaults: new { controller = "Calendar", action = "IndexCal", id = UrlParameter.Optional }
            );

            //routes.MapRoute(
            //    name: "Default2",
            //    url: "{controller}/{action}/{id}",
            //    defaults: new { id = UrlParameter.Optional }
            //);
        }
    }
}
