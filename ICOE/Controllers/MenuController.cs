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
    public class MenuController : Controller
    {
        DB_ICT_mOK_KPTDataContext i_ctx_db;
        public string menu_url;

        //get menu

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            string s_str_username = Convert.ToString(Session["username"]);
            string s_str_gpid = Convert.ToString(Session["gpid"]);
            int s_int_gpidcode = Convert.ToInt32(Session["gpidcode"]);
            string s_str_gpiddesc = Convert.ToString(Session["gpiddesc"]);

            ViewBag.myAccount = pb_cust_GetDetailProfile(s_str_username, s_str_gpid, s_int_gpidcode, s_str_gpiddesc);

            base.OnActionExecuting(filterContext);
        }

        public List<cusp_GetProfileMenuResult> BuildMenu(string s_str_gp_id, string s_str_nrp)
        {
            i_ctx_db = new DB_ICT_mOK_KPTDataContext();
            List<cusp_GetProfileMenuResult> a = i_ctx_db.cusp_GetProfileMenu(s_str_gp_id).OrderBy(f => f.SORT_ORDER).ToList();
            i_ctx_db.Dispose();
            return a;
        }

        public LoginViewModel pb_cust_GetDetailProfile(string s_str_username, string s_str_gpid, int? s_int_gpidcode, string s_str_gpiddesc)
        {

            LoginViewModel myAccount = new LoginViewModel();

            i_ctx_db = new DB_ICT_mOK_KPTDataContext();

            cusp_GetDetailProfileResult profile = i_ctx_db.cusp_GetDetailProfile(s_str_username, s_str_gpid, s_int_gpidcode, s_str_gpiddesc).FirstOrDefault();

            if (profile != null)
            {
                myAccount.NRP = profile.EMPLOYEE_ID;
                myAccount.EMPLOYEEID = profile.EMPLOYEE_ID;
                myAccount.NAME = profile.NAME;
                myAccount.GPID = profile.GPID;
                myAccount.GPID_CODE = Convert.ToInt32(profile.GPID_CODE);
                myAccount.GPID_DESC = profile.GPID_DESC;
                //myAccount.WEB_APP_PATH = System.Configuration.ConfigurationManager.AppSettings["WebApp_Path"].ToString();
                //myAccount.REPORT_SERVER_PATH = System.Configuration.ConfigurationManager.AppSettings["report_server_url"].ToString();
                //myAccount.REPORT_URL_PATH = System.Configuration.ConfigurationManager.AppSettings["report_path"].ToString();
                myAccount.POST_DESC = profile.POS_TITLE;
                myAccount.DEPT_DESC = profile.DEPT;
                myAccount.DISTRICT_CODE = profile.DSTRCT_CODE;
                myAccount.MENU = BuildMenu(profile.GPID, profile.EMPLOYEE_ID);
            }
            else
            {

                return null;

            }

            i_ctx_db.Dispose();
            return myAccount;
        }

        //public void pb_cust_resetAccount()
        //{
        //    Session.RemoveAll();
        //}
    }
}