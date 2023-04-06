using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ICOE.Models
{
    public class timeout
    {
        public class SessionTimeoutAttribute : ActionFilterAttribute
        {
            public override void OnActionExecuting (ActionExecutingContext filterContext)
            {
                HttpContext ctx = HttpContext.Current;
                if (HttpContext.Current.Session["username"] == null)
                {
                    filterContext.Result = new RedirectResult("/Account/Login");
                }
                base.OnActionExecuting(filterContext);
            }
        }
    }
}