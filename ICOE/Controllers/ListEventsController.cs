using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ICOE.Models;
using static ICOE.Models.timeout;
using System.Globalization;

namespace ICOE.Controllers
{

    [SessionTimeout]
    public class ListEventsController : MenuController
    {
        // GET: ListEvents
        DB_ICT_mOK_KPTDataContext db = new DB_ICT_mOK_KPTDataContext();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult EditEvent (string idH)
        {
            Session["event_header_id"] = idH;
            ViewBag.header = Session["event_header_id"];
            return View();
        }

        public JsonResult getdetailevent (string starteventdate = "", string endeventdate = "")
        {
            try
            {
                DateTime dtstart = DateTime.ParseExact(starteventdate, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                DateTime dtend = DateTime.ParseExact(endeventdate, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                var Ev_detail = db.VW_DETAIL_ACARAs.Where(x => x.start_date >= dtstart && x.end_date <= dtend).ToList();
                return Json(new { status = true, Data = Ev_detail, Total = Ev_detail.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }           

        }

        public JsonResult read_ev_header()
        {
            try
            {
                // var Ev_header = db.cusp_readHeader_event(starteventdate, endeventdate).OrderByDescending(f => f.start_date).ToList();
                var Ev_header = db.VW_HEADER_DETAILs.Where(
                    x => x.name != "Masuk Kerja"
                    && x.name != "Pulang Kerja"
                    && x.start_date.Value.Year == DateTime.Today.Year)
                    .OrderByDescending(f=> f.start_date);
                return Json(new { status = true, Data = Ev_header, Total = Ev_header.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch ( Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }           
        }

        [AllowAnonymous]
        public JsonResult read_ev_detail (string evh)
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

        //api mok get list
        [AllowAnonymous]
        public JsonResult list_icoe()
        {
            try
            {
                // var Ev_header = db.cusp_readHeader_event(starteventdate, endeventdate).OrderByDescending(f => f.start_date).ToList();
                var listicoe = db.VW_LIST_EVENT_DETAILs.OrderByDescending(f => f.start_date).Select(f => new { f.event_id, f.name, f.start_date, f.status, f.location }).ToList();
                return Json(new { status = true, Data = listicoe, Total = listicoe.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //api mok get detail list
        [AllowAnonymous]
        public JsonResult detail_list_icoe(string evh, string nrp)
        {
            try
            {
                var detailicoe = db.cufn_getEventDetails_ICOE(evh, nrp).OrderBy(f => f.start_date);
                return Json(new { status = true, Data = detailicoe, Total = detailicoe.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception z)
            {
                return this.Json(new { status = false, error = z.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        //api post response
        public JsonResult input_respon(EventViewModels eventViewModels)
        {
            try
            {
                eventViewModels.input_respon();

                return this.Json(new { status = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult getYearEvents()
        {
            try
            {
                var year = db.VW_EVENTs;
                return Json(new { status = true, Data = year, Total = year.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception b)
            {
                return this.Json(new { error = b.ToString() }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult deleteHeader (string evH)
        {
            try
            {
                var ck = db.TBL_M_EVENTs.Where(i => i.header_id == evH).Select(e => e.event_id).Count();

                for (int i = 0; i<ck; i++)
                {
                    var get_arr = db.TBL_M_EVENTs.Where(v => v.header_id == evH).Select(w => w.event_id).FirstOrDefault();
                    var att = db.TBL_T_EVENT_ATTENDANCEs.Where(b => b.event_id == get_arr);

                    var delmEv = db.TBL_M_EVENTs.Where(z => z.header_id == evH).FirstOrDefault();

                    db.TBL_M_EVENTs.DeleteOnSubmit(delmEv);
                    db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(att);
                    db.SubmitChanges();
                }

                var delh = db.TBL_M_EVENT_HEADERs.Where(x => x.event_header_id == evH);
                
                db.TBL_M_EVENT_HEADERs.DeleteAllOnSubmit(delh);
                db.SubmitChanges();
                db.Dispose();


                return Json(new { status = true, remarks = "Berhasil Dihapus" },JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ajaxreadevents ( string idH )
        {
            try
            {
                db = new DB_ICT_mOK_KPTDataContext();

                //List<TBL_M_ICOE_LINK> getEVli = db.TBL_M_ICOE_LINKs.Where(l => l.header_id == idH).ToList();
                //List<string> eventli = getEVli.Select(l => l.link.ToString()).ToList();

                List<TBL_M_EVENT> getEVid = db.TBL_M_EVENTs.Where(i => i.header_id == idH).ToList();
                List<Guid> eventid = getEVid.Select(f => f.event_id).ToList();

                //List<TBL_M_ICOE_LINK> getEVli = db.TBL_M_ICOE_LINKs.Where(i => i.header_id == idH).ToList();
                //List<string> eventli = getEVli.Select(f => f.link.ToString()).ToList();

                string[] attend = new string[500];
                var u = 0;

                EventViewModels evm = new EventViewModels();

                //UNTUK LOAD PESERTA DAN GROUP
                foreach (Guid evid in eventid)
                {


                    List<TBL_T_EVENT_ATTENDANCE> ev_att = db.TBL_T_EVENT_ATTENDANCEs.Where(f => f.event_id == evid).ToList();
                    List<string> i_lst_attendee = ev_att.Select(f => f.attendee).ToList();
                    List<string> groups = ev_att.Select(f => f.group_id).ToList();                   

                    foreach (string now in i_lst_attendee)
                    {
                        var cek = db.TBL_T_EVENT_ATTENDANCEs.Where(xy => xy.attendee == now && xy.event_id == evid).FirstOrDefault();

                        if (cek.group_id == null || cek.group_id == "")
                        {
                            attend[u] = now;
                            u++;
                        }
                    }
                    var getcb = db.TBL_M_EVENT_HEADERs.Where(o => o.event_header_id == idH).Select(f => f.create_by).FirstOrDefault();
                    var getevent = db.VW_HEADER_DETAILs.Where(k => k.event_header_id == idH).FirstOrDefault();
                    var getDeV = db.VW_DETAIL_ACARAs.Where(k => k.event_header_id == idH).OrderBy(g => g.start_date).Select(h => h.start_date).FirstOrDefault();

                    evm.attendees = attend;
                    evm.createby = getcb;
                    evm.eventH_id = idH;
                    evm.nama_group = groups.ToArray();
                    evm.name = getevent.name;
                    evm.description = getevent.description;
                    evm.link = getevent.link;
                    evm.distrik = getevent.dstrct_code;
                    evm.kategori = getevent.kategori;
                    evm.ulang = getevent.ulang.ToString();
                    evm.departement = getevent.departemen;
                    //evm.start_date = getDeV;
                    //evm.start_date = getevent.start_date;
                    evm.start_date = getevent.start_date;
                    evm.end_dates = getevent.end_date;
                    evm.starttime = Convert.ToDateTime(getevent.start_time);
                    evm.endtime = Convert.ToDateTime(getevent.end_time);
                    evm.locationid = getevent.location_id.ToString();
                    evm.is_use_location = getevent.is_use_location;
                    evm.is_use_qr_code = getevent.is_use_qr_code;
                }             


                return Json(new { status = true, data = evm }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception z)
            {
                return this.Json(new { status = false, error = z.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult AjaxReadEvent (Guid id)
        {
            try
            {

                db = new DB_ICT_mOK_KPTDataContext();

                TBL_M_EVENT tbl_m_event = db.TBL_M_EVENTs.Where(f => f.event_id == (id)).FirstOrDefault();
                TBL_M_ICOE_LINK tbl_m_icoe_link = db.TBL_M_ICOE_LINKs.Where(f => f.event_id == (id)).FirstOrDefault();

                List<TBL_T_EVENT_ATTENDANCE> tbl_t_event_attendance = db.TBL_T_EVENT_ATTENDANCEs.Where(f => f.event_id == id).ToList();
                List<string> i_lst_attendee = tbl_t_event_attendance.Select(f => f.attendee).ToList();
                List<string> groups = tbl_t_event_attendance.Select(f => f.group_id).ToList();

                var getDistrik = db.TBL_M_EVENTs.Where(g => g.event_id == id).FirstOrDefault();
                var getgroup = db.TBL_T_EVENT_ATTENDANCEs.Where(h => h.event_id == id);
                var getED = getDistrik.header_id;
                var getsg = db.TBL_M_EVENTs.Where(cc => cc.header_id == getED).OrderBy(sdd => sdd.start_date).FirstOrDefault();
                var getsg1 = db.TBL_M_EVENTs.Where(cc => cc.header_id == getED).OrderByDescending(sdd => sdd.start_date).FirstOrDefault();
                var TBL_M_EVENT_HEADER = db.TBL_M_EVENT_HEADERs.Where(z => z.event_header_id == getDistrik.header_id).FirstOrDefault();
                var nG = db.TBL_T_EVENT_ATTENDANCEs.Where(g => g.event_id == id).FirstOrDefault();
                var get_arrs = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == id);
                var getF = get_arrs.ToArray();
                string[] attend = new string[200];
                var u = 0;

                foreach (string now in i_lst_attendee)
                {
                    var cek = db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(xy => xy.attendee == now).FirstOrDefault();

                    if (cek == null)
                    {
                        attend[u] = now;
                        u++;
                    }
                }

                EventViewModels eventViewModels = new EventViewModels();
                eventViewModels.eventH_id = tbl_m_event.header_id;
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

        public JsonResult AjaxDistrik ()
        {
            try
            {
                db = new DB_ICT_mOK_KPTDataContext();
                var dis = db.VW_DISTRIKs;
                return Json(new { Total = dis.Count(), Data = dis });
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AjaxDepartement (string distrik = "")
        {
            try
            {
                if (distrik == "" || distrik == null || distrik == "ALL")
                {
                    db = new DB_ICT_mOK_KPTDataContext();
                    var dis = db.VW_DEPARTEMENTs;
                    return Json(new { Total = dis.Count(), Data = dis });
                }
                else
                {
                    db = new DB_ICT_mOK_KPTDataContext();
                    var dis = db.VW_DEPARTEMENTs.Where(x => x.DSTRCT_CODE.Contains(distrik));
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
                db = new DB_ICT_mOK_KPTDataContext();
                var dis = db.TBL_M_KATEGORIs;
                return Json(new { Total = dis.Count(), Data = dis });
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult AjaxReadKaryawan ()
        {
            try
            {
                db = new DB_ICT_mOK_KPTDataContext();
                IQueryable<VW_KARYAWAN> vw_karyawan = db.VW_KARYAWANs.OrderBy(f => f.NAME);
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
                db = new DB_ICT_mOK_KPTDataContext();
                IQueryable<TBL_M_LOCATION> tbl_m_location = db.TBL_M_LOCATIONs.OrderBy(f => f.location_name);
                return Json(new { Total = tbl_m_location.Count(), Data = tbl_m_location }, JsonRequestBehavior.AllowGet);
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
                db = new DB_ICT_mOK_KPTDataContext();
                IQueryable<TBL_M_GROUP_ATTENDEE> tbl_group = db.TBL_M_GROUP_ATTENDEEs;
                return Json(new { Total = tbl_group.Count(), Data = tbl_group }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //updateEVDetail
        public JsonResult updateEVDetail (ClsListEventsUpdate updateEVs)
        {
            try
            {
                string remarks = "";
                updateEVs.updateEV(ref remarks);
                return this.Json(new { status = true, remark = remarks }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception r)
            {
                return this.Json(new { status = false, error = r.Message }, JsonRequestBehavior.AllowGet);
            }
            
        }

        public JsonResult getEventData(string id)
        {
            var Link = db.TBL_M_ICOE_LINKs.Where(o => o.event_id.ToString() == id).FirstOrDefault();
            var Event = db.TBL_M_EVENTs.Where(o => o.event_id.ToString() == id).FirstOrDefault();
            return Json(new { status = true, Total = Event, Totall = Link, Data = Event }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult getatt_Data (Guid id)
        {
            try
            {
                List<TBL_T_EVENT_ATTENDANCE> tbl_t_event_attendance = db.TBL_T_EVENT_ATTENDANCEs.Where(f => f.event_id == id).ToList();
                List<string> i_lst_attendee = tbl_t_event_attendance.Select(f => f.attendee).ToList();
                List<string> group = tbl_t_event_attendance.Select(f => f.group_id).ToList();
                string[] grup = new string[200];
                var y = 0;

                string[] attende = new string[200];
                var u = 0;

                foreach (string now in i_lst_attendee)
                {
                    var cek = db.TBL_T_EVENT_ATTENDANCEs.Where(xy => xy.attendee == now && xy.event_id == id).FirstOrDefault();

                    if (cek.group_id == null)
                    {
                        attende[u] = now;
                        u++;
                    }
                }

                foreach (string nowG in group)
                {
                    grup[y] = nowG;
                    y++;
                }

                EventViewModels get = new EventViewModels();
                get.attendees = attende;
                get.nama_group = grup;

                return Json(new { status = true, Total = get, Data = get }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception b)
            {
                return this.Json(new { status = false, error = b.Message }, JsonRequestBehavior.AllowGet);
            }
            //var att = db.TBL_T_EVENT_ATTENDANCEs.Where(o => o.event_id.ToString() == id);
           
        }

        //UPDATE FREK ONCE
        public JsonResult updateEventOnce (ClsListEventsUpdate sUpdateEv)
        {
            try
            {
                var createdate = DateTime.Now;
                string remarks = "";
                sUpdateEv.updateonce(createdate, ref remarks);
                return Json(new { status = true, remark = remarks }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //UPDATE FREK DAILY
        public JsonResult updateEventDaily (ClsListEventsUpdate sUpdateEvD)
        {
            try
            {
                var createdate = DateTime.Now;
                string remarks = "";
                sUpdateEvD.updatedaily(createdate, ref remarks);
                return Json(new { status = true, remark = remarks }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //UPDATE FREK WEEKLY
        public JsonResult updateEventWeekly (ClsListEventsUpdate sUpdateEvW)
        {
            try
            {
                var createdate = DateTime.Now;
                string remarks = "";
                sUpdateEvW.updateweekly(createdate, ref remarks);
                return Json(new { status = true, remark = remarks }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}