using System;
using System.Collections.Generic;
using System.Linq;
using Kendo.DynamicLinq;
using System.Web;
using System.Web.Mvc;
using ICOE.Models;
using System.Globalization;
using static ICOE.Models.timeout;

namespace ICOE.Controllers
{

    [SessionTimeout]
    public class QRCodeAttController : MenuController
    {
        DB_ICT_mOK_KPTDataContext i_ctx_db = new DB_ICT_mOK_KPTDataContext();
        private Guid p_str_event_id = Guid.Empty;

        // GET: QRCodeAtt
        public ActionResult Index(string evH, string name)
        {
            ViewBag.evID = evH;
            return View();
        }

        //DIBAWAH INI UNTUK GRID
        //[HttpPost]
        //public JsonResult AjaxReadHead (string evH, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        //{
        //    try
        //    {
        //        i_ctx_db = new DB_ICT_mOK_KPTDataContext();
        //        var tbl_temp_elis = i_ctx_db.VW_HEADER_DETAILs
        //            .Where(f => f.event_header_id == evH)
        //            .OrderByDescending(f => f.create_date);
        //        return Json(tbl_temp_elis.ToDataSourceResult(take, skip, sort, filter));

        //    }
        //    catch (Exception e)
        //    {
        //        return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //DIBAWAH INI UNTUK GRID
        [HttpPost]
        public JsonResult AjaxReadsAtt(string s_str_event_id)
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                var tbl_temp_elis = i_ctx_db.VW_T_EVENT_ATTENDANCEs
                     .Where(f => f.event_id == s_str_event_id && f.status == 21)
                     .OrderByDescending(f => f.date_create);
                return Json(new { status = true, Data = tbl_temp_elis, Total = tbl_temp_elis.Count() }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        // GET: QRCodeAtt/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: QRCodeAtt/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: QRCodeAtt/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: QRCodeAtt/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: QRCodeAtt/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: QRCodeAtt/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: QRCodeAtt/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public JsonResult AjaxReadDate (string evH)
        {
            try
            {
                var abc = i_ctx_db.VW_DETAIL_ACARAs.Where(g => g.event_header_id == evH).OrderBy(f => f.start_date).ToList();
                return Json(new { status = true, Data = abc, Total = abc.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception b)
            {
                return this.Json(new { status = false, error = b.Message }, JsonRequestBehavior.AllowGet);
            }
            
        }

        public JsonResult getonlyEvid (string evH, string name)
        {
            try
            {
                var abc = i_ctx_db.cufn_datetoday(evH, name).ToList().FirstOrDefault();
                return Json(new { status = true, Data = abc, Total = abc }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult get_atthadir(string s_str_event_id)
        {
            try
            {
                var jumlah = i_ctx_db.VW_ATTENDEE_HADIRs.Where(f => f.event_id == s_str_event_id).FirstOrDefault();
                return Json(new { status = true, Data = jumlah, Total = jumlah }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult get_atttdkhadir(string s_str_event_id)
        {
            try
            {
                var jumlah = i_ctx_db.VW_ATTENDEE_TIDAK_HADIRs.Where(f => f.event_id == s_str_event_id).FirstOrDefault();
                return Json(new { status = true, Data = jumlah, Total = jumlah }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult get_atttent(string s_str_event_id)
        {
            try
            {
                var jumlah = i_ctx_db.VW_ATTENDEE_TENTATIVEs.Where(f => f.event_id == s_str_event_id).FirstOrDefault();
                return Json(new { status = true, Data = jumlah, Total = jumlah }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
