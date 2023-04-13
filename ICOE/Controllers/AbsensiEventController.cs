using System;
using System.Collections.Generic;
using System.Linq;
using Kendo.DynamicLinq;
using System.Web;
using System.Web.Mvc;
using ICOE.Models;
using static ICOE.Models.timeout;

namespace ICOE.Controllers
{
    [SessionTimeout]
    public class AbsensiEventController : MenuController
    {
        DB_ICT_mOK_KPTDataContext i_db = new DB_ICT_mOK_KPTDataContext();
        // GET: AbsensiEvent
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult IndexQR (string event_id, string name)
        {
            ViewBag.evID = event_id;
            return View();
        }

        [HttpGet]
        public JsonResult AjaxRead ()
        {
            try
            {
                i_db = new DB_ICT_mOK_KPTDataContext();
                var vw_event = i_db.VW_EVENTs.FirstOrDefault();/*.Where(f => f.status == 1).OrderByDescending(f => f.start_date)*/
                return Json(new { status = true, Data = vw_event, Total = vw_event }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }


        }

        [HttpGet]
        public JsonResult AjaxReadheadToday ()
        {
            try
            {
                var nrpby = Session["username"].ToString();
                var vw_eventH = i_db.VW_EVENT_TODAY_TABs.Where(g => g.create_by == nrpby && g.name != "Masuk Kerja" && g.name != "Pulang Kerja").OrderByDescending(f => f.start_date).ToList();
                return Json(vw_eventH, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }


        }

        //UNTUK KENDO GRID
        //UNTUK KENDO GRID
        [HttpPost]
        public JsonResult AjaxReadsAtt(string event_id)
        {
            try
            {
                i_db = new DB_ICT_mOK_KPTDataContext();
                var tbl_temp_elis = i_db.VW_T_EVENT_ATTENDANCEs
                    .Where(f => f.event_id == event_id && f.status == 21)
                    .OrderByDescending(f => f.date_create);
                return Json(new { status = true, Data = tbl_temp_elis, Total = tbl_temp_elis.Count() }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //UNTUK KENDO GRID
        [HttpPost]
        public JsonResult AjaxReadsDef(string event_id)
        {
            try
            {
                i_db = new DB_ICT_mOK_KPTDataContext();
                var tbl_temp_elis = i_db.VW_T_EVENT_ATTENDANCEs
                    .Where(f => f.event_id == event_id && f.status == 20)
                    .OrderByDescending(f => f.date_create);
                return Json(new { status = true, Data = tbl_temp_elis, Total = tbl_temp_elis.Count() }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //UNTUK KENDO GRID
        [HttpPost]
        public JsonResult AjaxReadsTent(string event_id)
        {
            try
            {
                i_db = new DB_ICT_mOK_KPTDataContext();
                var tbl_temp_elis = i_db.VW_T_EVENT_ATTENDANCEs
                    .Where(f => f.event_id == event_id)
                    .OrderByDescending(f => f.date_create);
                return Json(new { status = true, Data = tbl_temp_elis, Total = tbl_temp_elis.Count() }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AjaxReadDate (string evid)
        {
            try
            {
                var abc = i_db.VW_DETAIL_ACARAs.Where(g => g.event_id.ToString() == evid).FirstOrDefault();
                return Json(new { status = true, Data = abc, Total = abc }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception b)
            {
                return this.Json(new { status = false, error = b.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult getYear ()
        {
            try
            {
                var year = i_db.VW_EVENT_YEARs;
                return Json(new { status = true, Data = year, Total = year.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception b)
            {
                return this.Json(new { error = b.ToString() }, JsonRequestBehavior.AllowGet);
            }
           
        }

        [HttpPost]
        public JsonResult AjaxReadHeadFilter (string tahun = "", string site = "", string dept = "", string kategori = "")
        {
            try
            {
                var nrp = Session["username"].ToString();               
                var vw_eventH = i_db.cufn_FILTER_EVENT(tahun, site, kategori, dept, nrp).OrderByDescending(f => f.start_date).ToList();

                //var vw_eventH = i_db.VW_HEADER_DETAILs.Where(f => f.status == 1 && f.create_by == nrp).OrderByDescending(f => f.start_date);
                return Json(new { status = true, Data = vw_eventH, Total = vw_eventH.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AjaxDepartement (/*string distrik = ""*/)
        {
            var dis = i_db.VW_DEPARTEMENTs;
            return Json(new { Total = dis.Count(), Data = dis });
        }
    }
}