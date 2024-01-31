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
    public class CreateEventController : MenuController
    {
        DB_ICT_mOK_KPTDataContext i_ctx_db;
        // GET: CreateEvent
        [Authorize]
        public ActionResult Index ()
        {
            return View();
        }

        [Authorize]
        public ActionResult UpdateEvent (string id)
        {
            ViewData["id"] = Request.QueryString["id"];

            return View();
        }

        [HttpGet]
        public JsonResult AjaxReadKaryawan ()
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                //IQueryable<VW_KARYAWAN> vw_karyawan = i_ctx_db.VW_KARYAWANs.OrderBy(f => f.NAME); //Take(7368);
                var vw_karyawan = i_ctx_db.VW_KARYAWANs
                    .OrderBy(f => f.NAME)
                    .Select(a => new
                    {
                        NAME = a.NAME,
                        EMPLOYEE_ID = a.EMPLOYEE_ID
                    });

                return Json(new { Total = vw_karyawan.Count(), Data = vw_karyawan }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult AjaxReadLocation ()
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                IQueryable<TBL_M_LOCATION> tbl_m_location = i_ctx_db.TBL_M_LOCATIONs.OrderBy(f => f.location_name);
                return Json(new { Total = tbl_m_location.Count(), Data = tbl_m_location }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult AjaxReadEvent (Guid id)
        {
            try
            {

                i_ctx_db = new DB_ICT_mOK_KPTDataContext();

                TBL_M_EVENT tbl_m_event = i_ctx_db.TBL_M_EVENTs.Where(f => f.event_id == (id)).FirstOrDefault();
                TBL_M_ICOE_LINK tbl_m_icoe_link = i_ctx_db.TBL_M_ICOE_LINKs.Where(f => f.event_id == (id)).FirstOrDefault();
                List<TBL_T_EVENT_ATTENDANCE> tbl_t_event_attendance = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(f => f.event_id == id).ToList();
                List<string> i_lst_attendee = tbl_t_event_attendance.Select(f => f.attendee).ToList();
                List<string> groups = tbl_t_event_attendance.Select(f => f.group_id).ToList();

                var getDistrik = i_ctx_db.TBL_M_EVENTs.Where(g => g.event_id == id).FirstOrDefault();
                var getgroup = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(h => h.event_id == id);
                var getED = getDistrik.header_id;
                var getsg = i_ctx_db.TBL_M_EVENTs.Where(cc => cc.header_id == getED).OrderBy(sdd => sdd.start_date).FirstOrDefault();
                var getsg1 = i_ctx_db.TBL_M_EVENTs.Where(cc => cc.header_id == getED).OrderByDescending(sdd => sdd.start_date).FirstOrDefault();
                var TBL_M_EVENT_HEADER = i_ctx_db.TBL_M_EVENT_HEADERs.Where(z => z.event_header_id == getDistrik.header_id).FirstOrDefault();
                var nG = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(g => g.event_id == id).FirstOrDefault();
                var get_arrs = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == id);
                var getF = get_arrs.ToArray();
                string[] attend = new string[200];
                var u = 0;

                foreach (string now in i_lst_attendee )
                {
                    var cek = i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(xy => xy.attendee == now).FirstOrDefault();

                    if ( cek == null )
                    {
                        attend[u] = now;
                        u++;
                    }
                }

                EventViewModels eventViewModels = new EventViewModels();
                eventViewModels.event_id = id;
                eventViewModels.name = tbl_m_event.name;
                eventViewModels.distrik = TBL_M_EVENT_HEADER.dstrct_code;
                eventViewModels.departement = TBL_M_EVENT_HEADER.departemen;
                eventViewModels.ulang = TBL_M_EVENT_HEADER.ulang.ToString();
                eventViewModels.kategori = TBL_M_EVENT_HEADER.kategori;
                eventViewModels.description = tbl_m_event.description;
                eventViewModels.link = tbl_m_icoe_link.link;
                eventViewModels.start_date = getsg.start_date;
                eventViewModels.end_dates = getsg1.start_date;
                eventViewModels.endtime = Convert.ToDateTime(getsg.end_date);
                eventViewModels.location_id = tbl_m_event.location_id;
                eventViewModels.is_use_qr_code = tbl_m_event.is_use_qr_code;
                eventViewModels.is_use_location = tbl_m_event.is_use_location;
                eventViewModels.attendees = attend;
                eventViewModels.nama_group = groups.ToArray();

                return Json(new { status = true, data = eventViewModels }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //gk dipake
        public JsonResult InsertEvent (EventViewModels sEvent)
        {
            Guid i_guid_pid = System.Guid.NewGuid();
            string i_str_username = Session["username"].ToString();
            string i_str_nrp = i_str_username.Substring(1, 7);

            try
            {
                // INSERT TBL TBL_M_EVENT
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();

                TBL_M_EVENT tbl_m_event = new TBL_M_EVENT();
                tbl_m_event.event_id = i_guid_pid;
                tbl_m_event.name = sEvent.name;
                tbl_m_event.start_date = sEvent.start_date;
                tbl_m_event.end_date = sEvent.end_dates;
                tbl_m_event.status = 1;
                tbl_m_event.location_id = sEvent.location_id;
                tbl_m_event.description = sEvent.description;
                //tbl_m_event.link = sEvent.link;
                tbl_m_event.is_use_qr_code = sEvent.is_use_qr_code;
                tbl_m_event.is_use_location = sEvent.is_use_location;
                tbl_m_event.created_by = i_str_nrp;
                tbl_m_event.created_date = DateTime.Now;

               // i_ctx_db.TBL_M_EVENTs.InsertOnSubmit(tbl_m_event);


                List<TBL_T_EVENT_ATTENDANCE> lst_tbl_t_event_attendance = new List<TBL_T_EVENT_ATTENDANCE>();

                // INSERT TBL TBL_T_EVENT_ATTENDANCE

                for (int i = 0; i < sEvent.attendees.Length; i++)
                {
                    TBL_T_EVENT_ATTENDANCE tbl_t_event_attendance = new TBL_T_EVENT_ATTENDANCE();

                    tbl_t_event_attendance.attendee = sEvent.attendees[i];
                    tbl_t_event_attendance.event_id = i_guid_pid;
                    tbl_t_event_attendance.status = 20;
                    tbl_t_event_attendance.date_create = null;
                    tbl_t_event_attendance.location_long = null;
                    tbl_t_event_attendance.location_lat = null;

                    lst_tbl_t_event_attendance.Add(tbl_t_event_attendance);

                }

             //   i_ctx_db.TBL_T_EVENT_ATTENDANCEs.InsertAllOnSubmit(lst_tbl_t_event_attendance);

               // i_ctx_db.SubmitChanges();



                return this.Json(new { status = true, remark = "Berhasil Disimpan !" }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AjaxUpdateEvent (EventViewModels sEvent)
        {
            try
            {
                // INSERT TBL TBL_M_EVENT
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();

                TBL_M_EVENT i_tbl_m_event = new TBL_M_EVENT();
                //i_tbl_m_event.event_id = new Guid(sEvent.event_id);
                i_tbl_m_event.name = sEvent.name;
                i_tbl_m_event.start_date = sEvent.start_date;
                i_tbl_m_event.end_date = sEvent.end_dates;
                i_tbl_m_event.status = 1;
                i_tbl_m_event.location_id = sEvent.location_id;
                i_tbl_m_event.description = sEvent.description;
                //i_tbl_m_event.link = sEvent.link;
                i_tbl_m_event.is_use_qr_code = sEvent.is_use_qr_code;
                i_tbl_m_event.is_use_location = sEvent.is_use_location;

                TBL_M_EVENT tbl_m_event = i_ctx_db.TBL_M_EVENTs.Where(f => f.event_id == sEvent.event_id).FirstOrDefault();
                tbl_m_event.name = sEvent.name;
                tbl_m_event.start_date = sEvent.start_date;
                tbl_m_event.end_date = sEvent.end_dates;
                tbl_m_event.location_id = sEvent.location_id;
                tbl_m_event.description = sEvent.description;
                //tbl_m_event.link = sEvent.link;
                tbl_m_event.is_use_qr_code = sEvent.is_use_qr_code;
                tbl_m_event.is_use_location = sEvent.is_use_location;

                List<TBL_T_EVENT_ATTENDANCE> old_lst_tbl_t_event_attendance = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(f => f.event_id == sEvent.event_id).ToList();

                // Delete Attendee lama
                List<TBL_T_EVENT_ATTENDANCE> del_lst_tbl_t_event_attendance = new List<TBL_T_EVENT_ATTENDANCE>();
                foreach (TBL_T_EVENT_ATTENDANCE ev in old_lst_tbl_t_event_attendance)
                {
                    string i_str_attendee = Array.Find(sEvent.attendees, e => e.StartsWith(ev.attendee));

                    if (i_str_attendee == null)
                    {
                        del_lst_tbl_t_event_attendance.Add(ev);
                    }
                }

                i_ctx_db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(del_lst_tbl_t_event_attendance);


                // Tambah attendee baru

                List<TBL_T_EVENT_ATTENDANCE> lst_tbl_t_event_attendance = new List<TBL_T_EVENT_ATTENDANCE>();

                for (int i = 0; i < sEvent.attendees.Length; i++)
                {
                    TBL_T_EVENT_ATTENDANCE tbl_t_event_attendance = new TBL_T_EVENT_ATTENDANCE();

                    var i_str_attendee = old_lst_tbl_t_event_attendance
                                                .Find(f => f.attendee == sEvent.attendees[i].ToString());

                    if (i_str_attendee == null) // kalau ada peserta baru tambah ke list
                    {
                        tbl_t_event_attendance.attendee = sEvent.attendees[i];
                        tbl_t_event_attendance.event_id = sEvent.event_id;
                        tbl_t_event_attendance.status = 20;
                        tbl_t_event_attendance.date_create = null;
                        tbl_t_event_attendance.location_long = null;
                        tbl_t_event_attendance.location_lat = null;

                        lst_tbl_t_event_attendance.Add(tbl_t_event_attendance);
                    }

                }


                i_ctx_db.TBL_T_EVENT_ATTENDANCEs.InsertAllOnSubmit(lst_tbl_t_event_attendance);

                i_ctx_db.SubmitChanges();

                return this.Json(new { status = true, remark = "Berhasil Disimpan !" }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AjaxDistrik ()
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                var dis = i_ctx_db.VW_DISTRIKs;
                return Json(new { Total = dis.Count(), Data = dis });
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AjaxDepartement (string distrik = "" )
        {
            try
            {
                if ( distrik == "" || distrik == null || distrik == "ALL")
                {
                    i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                    var dis = i_ctx_db.VW_DEPARTEMENTs;                   
                    return Json(new { Total = dis.Count(), Data = dis });
                }
                else
                {
                    i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                    var dis = i_ctx_db.VW_DEPARTEMENTs.Where(x => x.DSTRCT_CODE.Contains(distrik));
                    return Json(new { Total = dis.Count(), Data = dis });
                }        
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AjaxKategori ()
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                var dis = i_ctx_db.TBL_M_KATEGORIs;
                return Json(new { Total = dis.Count(), Data = dis });
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //UNTUK DD GROUPNAME
        public JsonResult AjaxGroup ()
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                IQueryable<TBL_M_GROUP_ATTENDEE> tbl_group = i_ctx_db.TBL_M_GROUP_ATTENDEEs;
                return Json(new { Total = tbl_group.Count(), Data = tbl_group }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //InsertWeekly
        public JsonResult InsertEventNew (EventViewModels sEventNew)
        {
            try
            {
                var createdate = DateTime.Now;
                string remarks = "";
                sEventNew.insertEvent(Session["username"].ToString(), createdate, ref remarks);
                return this.Json(new { status = true, remark = remarks }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //InsertDaily
        public JsonResult InsertEventDaily (EventViewModels sEventNewD)
        {
            try
            {
                var createdate = DateTime.Now;
                string remarks = "";
                sEventNewD.insertEventd(Session["username"].ToString(), createdate, ref remarks);
                return this.Json(new { status = true, remark = remarks }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //INSERT ONCE
        public JsonResult InsertEventonce (EventViewModels sEventNewO)
        {
            try
            {               
                var createdate = DateTime.Now;
                string remarks = "";
                sEventNewO.insertEvento(Session["username"].ToString(), createdate, ref remarks);
                return this.Json(new { status = true, remark = remarks }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }      


    }
}
