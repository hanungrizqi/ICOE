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
    public class ListEventController : MenuController
    {
        DB_ICT_mOK_KPTDataContext i_ctx_db;
        // GET: ListEvent

        [Authorize]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult AjaxRead()
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                var vw_event = i_ctx_db.VW_EVENTs.Where(f => f.status == 1).OrderByDescending(f => f.start_date);
                return Json(vw_event, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }

            
        }

        [HttpGet]
        public JsonResult AjaxReadHead ()
        {
            try
            {
                var nrp = Session["username"].ToString();
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                var vw_eventH = i_ctx_db.VW_HEADER_DETAILs.Where(f => f.status == 1 && f.create_by == nrp).OrderByDescending(f => f.start_date);
                return Json(vw_eventH, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }


        }

        [HttpPost]
        public JsonResult AjaxDeleteEvent(Guid s_str_id)
        {
         
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();

                TBL_M_EVENT tbl_m_event = i_ctx_db.TBL_M_EVENTs.Where(f => f.event_id == (s_str_id)).FirstOrDefault();
                IQueryable<TBL_T_EVENT_ATTENDANCE> tbl_t_event_attendance = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.
                    Where(f => f.event_id == s_str_id);


                i_ctx_db.TBL_M_EVENTs.DeleteOnSubmit(tbl_m_event);
                i_ctx_db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(tbl_t_event_attendance);
                i_ctx_db.SubmitChanges();

                return this.Json(new { status = true, remark = "Berhasil Disimpan !" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {

                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        // GET: ListEvent/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ListEvent/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ListEvent/Create
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

        // GET: ListEvent/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ListEvent/Edit/5
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

        // GET: ListEvent/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ListEvent/Delete/5
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
    }
}
