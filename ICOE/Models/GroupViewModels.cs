using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICOE.Models
{
    public class GroupViewModels
    {
        public string nama_group { get; set; }
        public string[] attendee { get; set; }
        public string group_id { get; set; }
        public string group_name { get; set; }
        public string groupdetailid { get; set; }

        DB_ICT_mOK_KPTDataContext db = new DB_ICT_mOK_KPTDataContext();
        List<TBL_M_GROUP_ATTENDEE_DETAIL> tbl = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();

        public void UpdateGroup ()
        {
            db.cusp_UpdateGroup(group_id, group_name);
            db.SubmitChanges();
            db.Dispose();
        }

    //    public void updateGroupDetail (string group_id)
    //    {
    //        foreach (string att in attendee)
    //        {
    //            Guid groupdetailid = System.Guid.NewGuid();
    //            db.cusp_delinsnewatt(groupdetailid.ToString(), group_name, group_id, att);              
    //        }

    //        db.SubmitChanges();
    //        db.Dispose();

    //}

}
}