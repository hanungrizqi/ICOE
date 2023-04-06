using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ICOE.Models;
using static ICOE.Models.timeout;

namespace ICOE.Controllers
{
    [SessionTimeout]
    public class ReportController : MenuController
    {
        DB_ICT_mOK_KPTDataContext db = new DB_ICT_mOK_KPTDataContext();

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult read_ev_detail(string evh)
        {
            try
            {
                var Ev_detail = db.cufn_detail_event(evh).OrderBy(f => f.start_date);
                return Json(new { status = true, Data = Ev_detail, Total = Ev_detail.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception z)
            {
                return this.Json(new { status = false, error = z.Message }, JsonRequestBehavior.AllowGet);
            }

        }
    }
}