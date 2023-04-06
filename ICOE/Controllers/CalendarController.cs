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
    public class CalendarController : MenuController
    {
        // GET: Calendar
        DB_ICT_mOK_KPTDataContext db = new DB_ICT_mOK_KPTDataContext();
        public ActionResult IndexCal()
        {
            return View();
        }

        public JsonResult getDataEv ()
        {
            try
            {
                var nrp = Session["username"].ToString();
                var ev = db.VW_EVENTs.Where(f => f.attendee == nrp).Select(o => new CalendarViewModel( o )).ToList();
                return Json(new { status = true, Data = ev, Total = ev, remarks = "Berhasil Ambil Data" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception h)
            {
              return Json (new { status = false, error = h.Message}, JsonRequestBehavior.AllowGet);
            }
        }

    }
}