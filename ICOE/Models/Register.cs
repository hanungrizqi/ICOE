using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICOE.Models
{
    public class Register
    {
        DB_ICT_mOK_KPTDataContext db = new DB_ICT_mOK_KPTDataContext();

        public string nrp { get; set; }
        public string nama { get; set; }
        public string profile { get; set; }

        public void RegisterNew (ref string remarks)
        {
            var cek = db.TBL_R_USERs.Where(g => g.EMPLOYEE_ID == nrp && g.EMPLOYEE_NAME == nama && g.PROFILE_PID == profile).FirstOrDefault();

            if ( cek != null)
            {
                remarks = "Tidak Dapat Registrasi, NRP sudah didaftarkan dengan profile tersebut";
            }
            else
            {
                Guid USERPID = System.Guid.NewGuid();
                List<TBL_R_USER> insertnew = new List<TBL_R_USER>();

                insertnew.Add(new TBL_R_USER
                {
                    USER_PID = USERPID.ToString().ToUpper(),
                    PROFILE_PID = profile,
                    EMPLOYEE_ID = nrp,
                    EMPLOYEE_NAME = nama,
                    IS_DEFAULT_PROFILE = true
                });

                db.TBL_R_USERs.InsertAllOnSubmit(insertnew);
                db.SubmitChanges();
                db.Dispose();

                remarks = "Berhasil Menambahkan User !";
            }          

        }

    }
}