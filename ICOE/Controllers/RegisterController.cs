using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ICOE.Models;

namespace ICOE.Controllers
{    
    public class RegisterController : MenuController
    {
        // GET: Register
        DB_ICT_mOK_KPTDataContext idx_db = new DB_ICT_mOK_KPTDataContext();
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult dl_profile ()
        {
            var profile = idx_db.TBL_R_PROFILEs.AsQueryable();
            return Json(profile, JsonRequestBehavior.AllowGet);
        }


        public JsonResult sc_nama ()
        {
            var nama = idx_db.VW_KARYAWANs;
            return Json(nama, JsonRequestBehavior.AllowGet);
        }

        public JsonResult insertTBLUSER ( Register reg )
        {
            try
            {
                string remarks = "";
                reg.RegisterNew(ref remarks);
                return Json(new { status = true, remark = remarks }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception b)
            {
                return this.Json(new { status = false, error = b.Message }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}