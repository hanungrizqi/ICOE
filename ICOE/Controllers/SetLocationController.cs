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
    public class SetLocationController : MenuController
    {
        DB_ICT_mOK_KPTDataContext i_ctx_db;
        // GET: SetLocation

        [Authorize]
        public ActionResult Index()
        {
            return View();
        }

        [Authorize]
        public ActionResult InsertLocation()
        {
            return View();
        }

        [Authorize]
        public ActionResult UpdateLocation()
        {
            return View();
        }

        [HttpPost]
        public JsonResult AjaxReadAllLocation(string s_str_event_id, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                var tbl_m_location = i_ctx_db.TBL_M_LOCATIONs.OrderBy(f=> f.location_name);
                return Json(tbl_m_location.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult AjaxReadLocation(string s_str_location_id)
        {
            try
            {
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                TBL_M_LOCATION tbl_m_location = i_ctx_db.TBL_M_LOCATIONs.Where(f => f.location_id == new Guid(s_str_location_id)).FirstOrDefault();
                List<TBL_R_LOCATION_DETAIL> lst_tbl_r_location_detail = i_ctx_db.TBL_R_LOCATION_DETAILs
                    .Where(f => f.location_id == s_str_location_id).ToList();

                List<LatLngViewModel> lst_latLngViewModel = new List<LatLngViewModel>();

                foreach (TBL_R_LOCATION_DETAIL l in lst_tbl_r_location_detail)
                {
                    LatLngViewModel latLngViewModel = new LatLngViewModel();
                    latLngViewModel.latitude =  l.latitude;
                    latLngViewModel.longtitude = l.longitude;

                    lst_latLngViewModel.Add(latLngViewModel);
                }
                
                LocationViewModel locationViewModel = new LocationViewModel();
                locationViewModel.location_id = tbl_m_location.location_id.ToString();
                locationViewModel.location_name = tbl_m_location.location_name;
                locationViewModel.latLng = lst_latLngViewModel;

                return Json(new { status = true, data = locationViewModel }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AjaxInsertLocation(LocationViewModel locationViewModel)
        {
            Guid i_guid_pid = System.Guid.NewGuid();

            try
            {
                // INSERT TBL TBL_M_LOCATION
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                TBL_M_LOCATION tbl_m_location = new TBL_M_LOCATION();
                tbl_m_location.location_id = i_guid_pid;
                tbl_m_location.location_name = locationViewModel.location_name;

                i_ctx_db.TBL_M_LOCATIONs.InsertOnSubmit(tbl_m_location);

                List<TBL_R_LOCATION_DETAIL> lst_tbl_r_location_detail = new List<TBL_R_LOCATION_DETAIL>();


                foreach (LatLngViewModel l in locationViewModel.latLng)
                {
                    TBL_R_LOCATION_DETAIL tbl_r_location_detail = new TBL_R_LOCATION_DETAIL();

                    tbl_r_location_detail.location_detail_id = System.Guid.NewGuid();
                    tbl_r_location_detail.location_id = i_guid_pid.ToString();
                    tbl_r_location_detail.latitude = l.latitude;
                    tbl_r_location_detail.longitude = l.longtitude;

                    lst_tbl_r_location_detail.Add(tbl_r_location_detail);
                }

                i_ctx_db.TBL_R_LOCATION_DETAILs.InsertAllOnSubmit(lst_tbl_r_location_detail);

                i_ctx_db.SubmitChanges();

                return this.Json(new { status = true, remark = "Berhasil Disimpan !" }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {

                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult AjaxUpdateLocation(LocationViewModel locationViewModel)
        {
            try
            {
                // INSERT TBL TBL_M_LOCATION
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                TBL_M_LOCATION tbl_m_location = i_ctx_db.TBL_M_LOCATIONs
                    .Where(f => f.location_id == new Guid(locationViewModel.location_id)).FirstOrDefault();             
                tbl_m_location.location_name = locationViewModel.location_name;

                List<TBL_R_LOCATION_DETAIL> old_lst_tbl_r_location_detail = i_ctx_db.TBL_R_LOCATION_DETAILs
                    .Where(f => f.location_id == locationViewModel.location_id).ToList();

                //Delete Data TBL_R_LOCATION_DETAIL
                List<TBL_R_LOCATION_DETAIL> del_lst_tbl_r_location_detail = new List<TBL_R_LOCATION_DETAIL>();

                foreach(TBL_R_LOCATION_DETAIL r in old_lst_tbl_r_location_detail)
                {
                   
                    LatLngViewModel temp_latLng = locationViewModel.latLng
                    .Where(f => f.latitude == r.latitude && f.longtitude == f.longtitude).FirstOrDefault();

                    if (temp_latLng == null)
                    {
                        del_lst_tbl_r_location_detail.Add(r);

                    }
                }

                if (del_lst_tbl_r_location_detail.Count > 0)
                {
                    i_ctx_db.TBL_R_LOCATION_DETAILs.DeleteAllOnSubmit(del_lst_tbl_r_location_detail);
                }

                //Insert lokasi baru
                

                List<TBL_R_LOCATION_DETAIL> new_lst_tbl_r_location_detail = new List<TBL_R_LOCATION_DETAIL>();

                foreach (LatLngViewModel l in locationViewModel.latLng)
                {

                    var temp_locationViewModel = old_lst_tbl_r_location_detail
                        .Find(f => f.latitude == l.latitude && f.longitude == l.longtitude);

                    if (temp_locationViewModel == null)
                    {
                        TBL_R_LOCATION_DETAIL temp_tbl_r_location_detail = new TBL_R_LOCATION_DETAIL();

                        temp_tbl_r_location_detail.location_detail_id =  System.Guid.NewGuid();
                        temp_tbl_r_location_detail.location_id = locationViewModel.location_id;
                        temp_tbl_r_location_detail.latitude = l.latitude;
                        temp_tbl_r_location_detail.longitude = l.longtitude;

                        new_lst_tbl_r_location_detail.Add(temp_tbl_r_location_detail);
                    }
                }

                if (new_lst_tbl_r_location_detail.Count > 0)
                {
                    i_ctx_db.TBL_R_LOCATION_DETAILs.InsertAllOnSubmit(new_lst_tbl_r_location_detail);
                }
                
                i_ctx_db.SubmitChanges();

                return this.Json(new { status = true, remark = "Berhasil Disimpan !" }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {

                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult AjaxDeleteLocation(string s_str_location_id)
        {
            try
            {
                // INSERT TBL TBL_M_LOCATION
                i_ctx_db = new DB_ICT_mOK_KPTDataContext();
                TBL_M_LOCATION tbl_m_location = i_ctx_db.TBL_M_LOCATIONs
                    .Where(f => f.location_id == new Guid(s_str_location_id)).FirstOrDefault();

                i_ctx_db.TBL_M_LOCATIONs.DeleteOnSubmit(tbl_m_location);

                List<TBL_R_LOCATION_DETAIL> lst_tbl_r_location_detail = i_ctx_db.TBL_R_LOCATION_DETAILs
                    .Where(f=> f.location_id == s_str_location_id).ToList();

                i_ctx_db.TBL_R_LOCATION_DETAILs.DeleteAllOnSubmit(lst_tbl_r_location_detail);

                i_ctx_db.SubmitChanges();

                return this.Json(new { status = true, remark = "Berhasil Dihapus !" }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {

                return this.Json(new { status = false, error = e.Message }, JsonRequestBehavior.AllowGet);
            }

        }
    }
}