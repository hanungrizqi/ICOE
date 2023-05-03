using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.ComponentModel;
using ICOE.Models;
using static ICOE.Models.timeout;

namespace ICOE.Controllers
{

    [SessionTimeout]
    public class GroupController : MenuController
    {
        // GET: Group
        DB_ICT_mOK_KPTDataContext i_ctx_db;
        public ActionResult Index ()
        {
            return View();
        }
        public ActionResult InsertGroup ()
        {
            return View();
        }
        [HttpGet]
        public JsonResult AjaxReadKaryawan ()
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                IQueryable<VW_KARYAWAN> vw_karyawan = i_ctx_db.VW_KARYAWANs.OrderBy(f => f.NAME);
                return Json(new { Total = vw_karyawan.Count(), Data = vw_karyawan }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //UNTUK READ DATA GROUP INDEX
        [HttpGet]
        public JsonResult AjaxReadGroup (Guid s_str_id)
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                TBL_M_EVENT tbl_m_event = i_ctx_db.TBL_M_EVENTs.Where(f => f.event_id == s_str_id)
                    .FirstOrDefault();
                TBL_M_ICOE_LINK tbl_m_link = i_ctx_db.TBL_M_ICOE_LINKs.Where(f => f.event_id == (s_str_id))
                    .FirstOrDefault();
                List<TBL_T_EVENT_ATTENDANCE> tbl_t_event_attendance = i_ctx_db.TBL_T_EVENT_ATTENDANCEs
                    .Where(f => f.event_id == s_str_id)
                    .ToList();

                List<string> i_lst_attendee = tbl_t_event_attendance.Select(f => f.attendee).ToList();

                EventViewModels eventViewModels = new EventViewModels();
                eventViewModels.event_id = s_str_id;
                eventViewModels.name = tbl_m_event.name;
                eventViewModels.description = tbl_m_event.description;
                eventViewModels.link = tbl_m_link.link;
                eventViewModels.start_date = tbl_m_event.start_date;
                eventViewModels.end_dates = tbl_m_event.end_date;
                eventViewModels.location_id = tbl_m_event.location_id;
                eventViewModels.is_use_qr_code = tbl_m_event.is_use_qr_code;
                eventViewModels.is_use_location = tbl_m_event.is_use_location;
                eventViewModels.attendees = i_lst_attendee.ToArray();

                return Json(new { status = true, data = eventViewModels }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult InsertEvent (IEnumerable<string> list, string nama_group = "")
        {
            Guid i_guid_gid = System.Guid.NewGuid();

            try
            {
                // INSERT TBL TBL_M_EVENT
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();

                TBL_M_GROUP_ATTENDEE tbl_mg_attendee = new TBL_M_GROUP_ATTENDEE();
                tbl_mg_attendee.group_id = i_guid_gid.ToString();
                tbl_mg_attendee.group_name = nama_group;
                tbl_mg_attendee.create_date = DateTime.Now;
                tbl_mg_attendee.create_by = Session["username"].ToString();

                i_ctx_db.TBL_M_GROUP_ATTENDEEs.InsertOnSubmit(tbl_mg_attendee);
                //i_ctx_db.SubmitChanges();


                List<TBL_M_GROUP_ATTENDEE_DETAIL> tbl_mg_att_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();

                // INSERT TBL TBL_m_att_detail

                var EnumToArray = list.ToArray();


                for (int i = 0; i < list.Count(); i++)
                {
                    TBL_M_GROUP_ATTENDEE_DETAIL tbl_mg_attd_detail = new TBL_M_GROUP_ATTENDEE_DETAIL();
                    Guid g_detailID = System.Guid.NewGuid();

                    tbl_mg_attd_detail.attendee = EnumToArray[i];
                    tbl_mg_attd_detail.group_id = i_guid_gid.ToString();
                    tbl_mg_attd_detail.group_detail_id = g_detailID.ToString();

                    tbl_mg_att_detail.Add(tbl_mg_attd_detail);

                }

                i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.InsertAllOnSubmit(tbl_mg_att_detail);

                i_ctx_db.SubmitChanges();



                return this.Json(new { status = true, remark = "Berhasil Disimpan !" }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult AjaxReadAllGroup (/*string s_str_event_id, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter*/)
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();

                if ( Convert.ToInt32(Session["gpidcode"]) == 1 || Convert.ToInt32(Session["gpidcode"]) == 2)
                {
                    var tbl_m_group_attendee = i_ctx_db.TBL_M_GROUP_ATTENDEEs;
                    return Json(new { show = true, Data = tbl_m_group_attendee, Total = tbl_m_group_attendee.Count() }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var tbl_m_group_attendee = i_ctx_db.TBL_M_GROUP_ATTENDEEs.Where( g => g.create_by == Convert.ToString( Session["username"] ) );
                    return Json(new { show = true, Data = tbl_m_group_attendee, Total = tbl_m_group_attendee.Count() }, JsonRequestBehavior.AllowGet);
                }               

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult updateGroup (GroupViewModels UpdateG)
        {
            try
            {
                UpdateG.UpdateGroup();
                return Json(new { status = true, remarks = "Berhasil Save Data" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult DeleteDGroup (TBL_M_GROUP_ATTENDEE groupnames)
        {
            // Query the database for the rows to be deleted.

            try
            {
                // INSERT TBL TBL_M_EVENT
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();

                var del_gD = i_ctx_db.TBL_M_GROUP_ATTENDEEs.Where(i => i.group_id == groupnames.group_id).SingleOrDefault();
                var delD = i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(i => i.group_id == groupnames.group_id).ToList();

                //TBL_M_GROUP_ATTENDEE tbl_mg_attendee_del = new TBL_M_GROUP_ATTENDEE();
                //tbl_mg_attendee_del.group_id = asd;

                i_ctx_db.TBL_M_GROUP_ATTENDEEs.DeleteOnSubmit(del_gD);

                i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.DeleteAllOnSubmit(delD);
                i_ctx_db.SubmitChanges();
                i_ctx_db.Dispose();

                return this.Json(new { status = true, remark = "Berhasil DiHapus !" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult get_arr (string group_id)
        {

            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                var get_arrs = i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(i => i.group_id == group_id);
                var getF = get_arrs.ToArray();
                return Json(new { status = true, Data = getF, Total = get_arrs.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult UpdateGroupE (IEnumerable<string> list, string group_id = "", string nama_group = "")
        //public JsonResult UpdateGroupE (IEnumerable<string> list, string nama_group = "", string group_id = "", string groupdetail = "")
        {
            try
            {
                var b = "";
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                List<TBL_M_GROUP_ATTENDEE_DETAIL> tbl_mg_att_details = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();

                foreach(string member in list)
                {
                    Guid detail_id = System.Guid.NewGuid();
                    tbl_mg_att_details.Add(new TBL_M_GROUP_ATTENDEE_DETAIL
                    {
                        group_detail_id = detail_id.ToString(),
                        group_id = group_id,
                        attendee = member
                    });
                }
                i_ctx_db.cusp_delinsnewatt(nama_group, group_id);
                i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.InsertAllOnSubmit(tbl_mg_att_details);
                i_ctx_db.SubmitChanges();
               

                return this.Json(new { status = true, remark = "Berhasil Disimpan !" }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }
    }
}