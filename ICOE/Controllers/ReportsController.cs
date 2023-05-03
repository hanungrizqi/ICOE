using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Collections.Generic;
using ICOE.Models;
using System;
//using System.Text.Json;

namespace ICOE.Controllers
{
    [Authorize]
    public class ReportsController : MenuController
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;
        DB_ICT_mOK_KPTDataContext dB_ICT = new DB_ICT_mOK_KPTDataContext();

        public ReportsController()
        {
        }

        public ReportsController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ActionResult Index()
        {
            return View();
        }

        //api mok get list
        [AllowAnonymous]
        public JsonResult list_icoe(string nrp)
        {
            try
            {
                // var Ev_header = db.cusp_readHeader_event(starteventdate, endeventdate).OrderByDescending(f => f.start_date).ToList();
                //var listicoe = dB_ICT.VW_LIST_EVENT_DETAILs.ToList();
                var listicoe = dB_ICT.cufn_getEventDetails_ICOE_byNRP(nrp).OrderByDescending(f => f.start_date).ToList();
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
                var detailicoe = dB_ICT.cufn_getEventDetails_ICOE(evh, nrp).OrderBy(f => f.start_date);
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

        //api total
        [AllowAnonymous]
        public JsonResult total_respon(string nrp)
        {
            try
            {
                var listicoe = dB_ICT.cufn_getEventDetails_ICOE_byNRP(nrp).ToList().Count();
                var udahrespon = dB_ICT.cufn_getEventResponse(nrp).ToList().Count();
                var notyet = listicoe - udahrespon;
                return Json(new { status = true, Data = notyet, Total = notyet }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception z)
            {
                return this.Json(new { status = false, error = z.Message }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult read_ev_detail(string evh)
        {
            try
            {
                var Ev_detail = dB_ICT.cufn_detail_event(evh).OrderBy(f => f.start_date);
                return Json(new { status = true, Data = Ev_detail, Total = Ev_detail.Count() }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception z)
            {
                return this.Json(new { status = false, error = z.Message }, JsonRequestBehavior.AllowGet);
            }

        }
    }
}