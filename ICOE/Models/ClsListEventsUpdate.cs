using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICOE.Models
{
    public class ClsListEventsUpdate
    {
        DB_ICT_mOK_KPTDataContext db = new DB_ICT_mOK_KPTDataContext();
        public Guid event_id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string link { get; set; }
        public DateTime? start_date { get; set; }
        public Nullable<DateTime> end_dates { get; set; }
        // public string location_id { get; set; }
        public bool? is_use_qr_code { get; set; }
        public bool? is_use_location { get; set; }
        public string[] attendees { get; set; }
        public string[] nama_group { get; set; }
        public string eventH_id { get; set; }
        public string distrik { get; set; }
        public string departement { get; set; }
        public string ulang { get; set; }
        public DateTime starttime { get; set; }
        public DateTime endtime { get; set; }
        public string kategori { get; set; }
        public DateTime createdate { get; set; }
        public string createby { get; set; }
        public bool iscoe { get; set; }
        public bool status { get; set; }
        public string locationid { get; set; }
        public string loclong { get; set; }
        public string loclat { get; set; }

        public void updateEV (ref string remarks)
        {

            DB_ICT_mOK_KPTDataContext db;
            db = new DB_ICT_mOK_KPTDataContext();
            List<TBL_T_EVENT_ATTENDANCE> tbl = new List<TBL_T_EVENT_ATTENDANCE>();

            var hasilnya = db.cusp_cektanggal(eventH_id, event_id, start_date, start_date, starttime, endtime).FirstOrDefault() ;
            if (hasilnya.hasil == 0)
            {
                remarks = "tidak dapat melakukan perubahan data, karena terdapat event pada tanggal tersebut";
            }
            else
            {
                var delG = db.TBL_T_EVENT_ATTENDANCEs.Where(o => o.event_id == event_id).AsQueryable();
                db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(delG);
                db.SubmitChanges();

                db.cusp_UpdateEvent(event_id, eventH_id, start_date, start_date, starttime, endtime);

                if (attendees != null)
                {
                    if (nama_group == null)
                    {
                        //att ada, grp ksg                
                        foreach (string att in attendees)
                        {
                            tbl.Add(new TBL_T_EVENT_ATTENDANCE
                            {
                                event_id = event_id,
                                attendee = att,
                                group_id = null,
                                status = 20,
                                date_create = DateTime.Now
                            });
                        }

                        foreach (TBL_T_EVENT_ATTENDANCE evt in tbl)
                        {
                            var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evt.event_id && z.attendee == evt.attendee).FirstOrDefault();
                            if (query != null)
                            {
                                //not
                            }
                            else
                            {
                                db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evt);
                                db.SubmitChanges();
                            }
                        }

                    }
                    else
                    {
                        //att ada, grp ada
                        foreach (string grup in nama_group)
                        {
                            List<TBL_M_GROUP_ATTENDEE_DETAIL> adding = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                            adding = db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(w => w.group_id == grup).ToList();

                            foreach (TBL_M_GROUP_ATTENDEE_DETAIL c in adding)
                            {
                                TBL_T_EVENT_ATTENDANCE h = new TBL_T_EVENT_ATTENDANCE();
                                h.attendee = c.attendee;
                                h.event_id = event_id;
                                h.group_id = c.group_id;
                                h.status = 20;
                                h.date_create = DateTime.Now;

                                tbl.Add(h);
                            }
                        }

                        foreach (string att in attendees)
                        {
                            tbl.Add(new TBL_T_EVENT_ATTENDANCE
                            {
                                event_id = event_id,
                                attendee = att,
                                group_id = null,
                                status = 20,
                                date_create = DateTime.Now
                            });
                        }

                        foreach (TBL_T_EVENT_ATTENDANCE evt in tbl)
                        {
                            var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evt.event_id && z.attendee == evt.attendee).FirstOrDefault();
                            if (query != null)
                            {
                                //not
                            }
                            else
                            {
                                db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evt);
                                db.SubmitChanges();
                            }
                        }

                    }
                }
                else
                {
                    if (nama_group == null)
                    {
                        //att ksg, grp ksg
                    }
                    else
                    {
                        //att ksg, grp ada
                        foreach (string grup in nama_group)
                        {
                            List<TBL_M_GROUP_ATTENDEE_DETAIL> adding = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                            adding = db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(w => w.group_id == grup).ToList();

                            foreach (TBL_M_GROUP_ATTENDEE_DETAIL c in adding)
                            {
                                TBL_T_EVENT_ATTENDANCE h = new TBL_T_EVENT_ATTENDANCE();
                                h.attendee = c.attendee;
                                h.event_id = event_id;
                                h.group_id = c.group_id;
                                h.status = 20;
                                h.date_create = DateTime.Now;

                                tbl.Add(h);
                            }
                        }

                        foreach (TBL_T_EVENT_ATTENDANCE evt in tbl)
                        {
                            var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evt.event_id && z.attendee == evt.attendee).FirstOrDefault();
                            if (query != null)
                            {
                                //not
                            }
                            else
                            {
                                db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evt);
                                db.SubmitChanges();
                            }
                        }
                    }
                }
                remarks = "Berhasil Update Detail Event";
            }           
        }

        //UPDATE ONCE
        public void updateonce (DateTime createdate, ref string remarks)
        {
            DB_ICT_mOK_KPTDataContext db = new DB_ICT_mOK_KPTDataContext();
            List<TBL_T_EVENT_ATTENDANCE> tbl = new List<TBL_T_EVENT_ATTENDANCE>();
            List<TBL_T_EVENT_ATTENDANCE> tblEatt = new List<TBL_T_EVENT_ATTENDANCE>();
            List<string> lst_all_attendee = new List<string>();
            List<string> lst_all_temp = new List<string>();

            var lokasi = db.cusp_cekLokasi(start_date, start_date, starttime, endtime, locationid, 2, eventH_id).FirstOrDefault(); //2,1 gagal, 0 berhasil

            if (lokasi.hasil == 1 || lokasi.hasil == 2)
            {
                remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
            }
            else
            {
                if (attendees != null)
                {
                    if (nama_group != null)
                    {
                        //att ada, grp ada                    
                        List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                        var getEV = db.TBL_M_EVENTs.Where(o => o.header_id == eventH_id).Select(f => f.event_id).FirstOrDefault();
                        var getEVL = db.TBL_M_ICOE_LINKs.Where(o => o.header_id == eventH_id).Select(f => f.event_id).FirstOrDefault();

                        //HAPUS RECENT DATA TO UPDATE
                        var tbl_evH = db.TBL_M_EVENT_HEADERs.Where(y => y.event_header_id == eventH_id);
                        db.TBL_M_EVENT_HEADERs.DeleteAllOnSubmit(tbl_evH);

                        var tbl_ev = db.TBL_M_EVENTs.Where(x => x.header_id == eventH_id);
                        db.TBL_M_EVENTs.DeleteAllOnSubmit(tbl_ev);

                        var tbl_evl = db.TBL_M_ICOE_LINKs.Where(x => x.header_id == eventH_id);
                        db.TBL_M_ICOE_LINKs.DeleteAllOnSubmit(tbl_evl);

                        //var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == getEV.ToString());
                        var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == getEV && i.event_id == getEVL);
                        db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(tbl_at);
                        db.SubmitChanges();

                        Guid i_guid_event = System.Guid.NewGuid();
                        DateTime evStart = Convert.ToDateTime(start_date);

                        //TEMPAT SP
                        db.cusp_UpdateEvent_Header(eventH_id, distrik, departement, ulang, evStart, evStart, evStart,
                            starttime, endtime, kategori, iscoe, createdate, createby, i_guid_event.ToString(), name, is_use_qr_code,
                            is_use_location, description, link, status, locationid);

                        foreach (string attends in attendees)
                        {
                            //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                            tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                            {
                                group_id = null,
                                attendee = attends,
                                event_id = i_guid_event,
                                date_create = createdate,
                                status = 20 //STATUS KEHADIRAN
                            });
                        }

                        foreach (string arr in nama_group)
                        {
                            //list lengkap group id dan attendee
                            List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                            lst_detail = db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                            foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                            {
                                TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                                eventAttendance.attendee = x.attendee;
                                eventAttendance.event_id = i_guid_event;
                                eventAttendance.status = 20;
                                eventAttendance.group_id = x.group_id;
                                eventAttendance.date_create = createdate;

                                tblDetail.Add(eventAttendance);
                            }
                        }

                        foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                        {
                            //insert disini
                            var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                            if (query != null)
                            {
                                //do nothing
                            }
                            else
                            {
                                db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                db.SubmitChanges();
                            }
                        }


                    }
                    else
                    {
                        //pst ada, grp ksg
                        List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                        var getEV = db.TBL_M_EVENTs.Where(o => o.header_id == eventH_id).Select(f => f.event_id).FirstOrDefault();
                        var getEVL = db.TBL_M_ICOE_LINKs.Where(o => o.header_id == eventH_id).Select(f => f.event_id).FirstOrDefault();

                        //HAPUS RECENT DATA TO UPDATE
                        var tbl_evH = db.TBL_M_EVENT_HEADERs.Where(y => y.event_header_id == eventH_id);
                        db.TBL_M_EVENT_HEADERs.DeleteAllOnSubmit(tbl_evH);

                        var tbl_ev = db.TBL_M_EVENTs.Where(x => x.header_id == eventH_id);
                        db.TBL_M_EVENTs.DeleteAllOnSubmit(tbl_ev);

                        var tbl_evl = db.TBL_M_ICOE_LINKs.Where(x => x.header_id == eventH_id);
                        db.TBL_M_ICOE_LINKs.DeleteAllOnSubmit(tbl_evl);

                        //var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == getEV.ToString());
                        var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == getEV && i.event_id == getEVL);
                        db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(tbl_at);
                        db.SubmitChanges();

                        Guid i_guid_event = System.Guid.NewGuid();
                        DateTime evStart = Convert.ToDateTime(start_date);

                        //TEMPAT SP
                        db.cusp_UpdateEvent_Header(eventH_id, distrik, departement, ulang, evStart, evStart, evStart,
                            starttime, endtime, kategori, iscoe, createdate, createby, i_guid_event.ToString(), name, is_use_qr_code,
                            is_use_location, description, link, status, locationid);

                        foreach (string attends in attendees)
                        {
                            //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                            tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                            {
                                group_id = null,
                                attendee = attends,
                                event_id = i_guid_event,
                                date_create = createdate,
                                status = 20 //STATUS KEHADIRAN
                            });
                        }

                        foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                        {
                            //insert disini
                            var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                            if (query != null)
                            {
                                //do nothing
                            }
                            else
                            {
                                db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                db.SubmitChanges();
                            }
                        }
                    }
                }
                else
                {
                    if (nama_group != null)
                    {
                        //pst ksg, grp ada
                        List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                        var getEV = db.TBL_M_EVENTs.Where(o => o.header_id == eventH_id).Select(f => f.event_id).FirstOrDefault();
                        var getEVL = db.TBL_M_ICOE_LINKs.Where(o => o.header_id == eventH_id).Select(f => f.event_id).FirstOrDefault();

                        //HAPUS RECENT DATA TO UPDATE
                        var tbl_evH = db.TBL_M_EVENT_HEADERs.Where(y => y.event_header_id == eventH_id);
                        db.TBL_M_EVENT_HEADERs.DeleteAllOnSubmit(tbl_evH);

                        var tbl_evl = db.TBL_M_ICOE_LINKs.Where(l => l.header_id == eventH_id);
                        db.TBL_M_ICOE_LINKs.DeleteAllOnSubmit(tbl_evl);

                        var tbl_ev = db.TBL_M_EVENTs.Where(x => x.header_id == eventH_id);
                        db.TBL_M_EVENTs.DeleteAllOnSubmit(tbl_ev);

                        //var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == getEV.ToString());
                        var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == getEV && i.event_id == getEVL);
                        db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(tbl_at);
                        db.SubmitChanges();

                        Guid i_guid_event = System.Guid.NewGuid();
                        DateTime evStart = Convert.ToDateTime(start_date);

                        //TEMPAT SP
                        db.cusp_UpdateEvent_Header(eventH_id, distrik, departement, ulang, evStart, evStart, evStart,
                            starttime, endtime, kategori, iscoe, createdate, createby, i_guid_event.ToString(), name, is_use_qr_code,
                            is_use_location, description, link, status, locationid);

                        foreach (string arr in nama_group)
                        {
                            //list lengkap group id dan attendee
                            List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                            lst_detail = db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                            foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                            {
                                TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                                eventAttendance.attendee = x.attendee;
                                eventAttendance.event_id = i_guid_event;
                                eventAttendance.status = 20;
                                eventAttendance.group_id = x.group_id;
                                eventAttendance.date_create = createdate;

                                tblDetail.Add(eventAttendance);
                            }
                        }

                        foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                        {
                            //insert disini
                            var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                            if (query != null)
                            {
                                //do nothing
                            }
                            else
                            {
                                db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                db.SubmitChanges();
                            }
                        }
                    }
                    else
                    {
                        //pst ksg, grp ksg
                    }
                }
                db.Dispose();
                remarks = "Berhasil Edit Events";
            }

        }

        //UPDATE DAILY
        public void updatedaily (DateTime createdate, ref string remarks)
        {
            DB_ICT_mOK_KPTDataContext db = new DB_ICT_mOK_KPTDataContext();
            List<TBL_T_EVENT_ATTENDANCE> tbl = new List<TBL_T_EVENT_ATTENDANCE>();
            List<TBL_T_EVENT_ATTENDANCE> tblEatt = new List<TBL_T_EVENT_ATTENDANCE>();
            List<string> lst_all_attendee = new List<string>();
            List<string> lst_all_temp = new List<string>();
            TimeSpan abcde = Convert.ToDateTime(end_dates) - Convert.ToDateTime(start_date);
            double daily = abcde.TotalDays;

            var lokasi = 0;//db.cusp_cekLokasi(start_date, end_dates, starttime, endtime, locationid, 2, eventH_id).FirstOrDefault();

            for (int x = 0; x <= daily; x++)
            {
                DateTime evStartInner = Convert.ToDateTime(start_date).AddDays(x);
                var hasil_temp = db.cusp_cekLokasi(evStartInner, evStartInner, starttime, endtime, locationid, 2, eventH_id).FirstOrDefault();
                lokasi = lokasi + Convert.ToInt32(hasil_temp.hasil); // 0 => berhasil 2,1 => gagal
            }
            //do nothing
            if (lokasi > 0)
            {
                remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
            }
            else
            {
                if (attendees != null)
                {
                    if (nama_group != null)
                    {
                        //pst ada, grp ada

                        //VAR GET DIBAWAH UNTUK GET EV ID UTK HAPUS EVENT SEBELUMNYA
                        var getEV = db.TBL_M_EVENTs.Where(o => o.header_id == eventH_id).Select(f => f.event_id);
                        var evtid = getEV.ToArray();

                        var tbl_evl = db.TBL_M_ICOE_LINKs.Where(x => x.header_id == eventH_id);
                        db.TBL_M_ICOE_LINKs.DeleteAllOnSubmit(tbl_evl);
                        db.SubmitChanges();

                        var tbl_evH = db.TBL_M_EVENT_HEADERs.Where(x => x.event_header_id == eventH_id);
                        db.TBL_M_EVENT_HEADERs.DeleteAllOnSubmit(tbl_evH);
                        db.SubmitChanges();

                        //HAPUS RECENT DATA TO UPDATE
                        foreach (Guid uniqevid in evtid)
                        {
                            var tbl_ev = db.TBL_M_EVENTs.Where(x => x.header_id == eventH_id);
                            db.TBL_M_EVENTs.DeleteAllOnSubmit(tbl_ev);
                            var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == uniqevid);
                            db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(tbl_at);
                            db.SubmitChanges();
                        }

                        //LOOP UTK INSERT
                        for (int a = 0; a <= daily; a++)
                        {
                            List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                            Guid i_guid_event = System.Guid.NewGuid();
                            DateTime evStart = Convert.ToDateTime(start_date).AddDays(a);

                            //TEMPAT SP
                            db.cusp_UpdateEvent_Header(eventH_id, distrik, departement, ulang, evStart, end_dates, evStart,
                                starttime, endtime, kategori, iscoe, createdate, createby, i_guid_event.ToString(), name, is_use_qr_code,
                                is_use_location, description, link, status, locationid);

                            foreach (string attends in attendees)
                            {
                                //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                                tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                                {
                                    group_id = null,
                                    attendee = attends,
                                    event_id = i_guid_event,
                                    date_create = createdate,
                                    status = 20 //STATUS KEHADIRAN
                                });
                            }

                            foreach (string arr in nama_group)
                            {
                                //list lengkap group id dan attendee
                                List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                                lst_detail = db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                                foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                                {
                                    TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                                    eventAttendance.attendee = x.attendee;
                                    eventAttendance.event_id = i_guid_event;
                                    eventAttendance.status = 20;
                                    eventAttendance.group_id = x.group_id;
                                    eventAttendance.date_create = createdate;

                                    tblDetail.Add(eventAttendance);
                                }
                            }

                            foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                            {
                                //insert disini
                                var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                                if (query != null)
                                {
                                    //do nothing
                                }
                                else
                                {
                                    db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                    db.SubmitChanges();
                                }
                            }                            
                        }
                        db.SubmitChanges();
                        remarks = "Berhasil Edit Events";
                    }
                    else
                    {
                        //pst ada, grp ksg
                        var getEV = db.TBL_M_EVENTs.Where(o => o.header_id == eventH_id).Select(f => f.event_id);
                        var evtid = getEV.ToArray();

                        var tbl_evl = db.TBL_M_ICOE_LINKs.Where(x => x.header_id == eventH_id);
                        db.TBL_M_ICOE_LINKs.DeleteAllOnSubmit(tbl_evl);
                        db.SubmitChanges();

                        var tbl_evH = db.TBL_M_EVENT_HEADERs.Where(x => x.event_header_id == eventH_id);
                        db.TBL_M_EVENT_HEADERs.DeleteAllOnSubmit(tbl_evH);
                        db.SubmitChanges();

                        //HAPUS RECENT DATA TO UPDATE
                        foreach (Guid uniqevid in evtid)
                        {
                            var tbl_ev = db.TBL_M_EVENTs.Where(x => x.header_id == eventH_id);
                            db.TBL_M_EVENTs.DeleteAllOnSubmit(tbl_ev);
                            var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == uniqevid);
                            db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(tbl_at);
                            db.SubmitChanges();
                        }

                        for (int a = 0; a <= daily; a++)
                        {
                            List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                            Guid i_guid_event = System.Guid.NewGuid();
                            DateTime evStart = Convert.ToDateTime(start_date).AddDays(a);

                            //TEMPAT SP
                            db.cusp_UpdateEvent_Header(eventH_id, distrik, departement, ulang, evStart, end_dates, evStart,
                                starttime, endtime, kategori, iscoe, createdate, createby, i_guid_event.ToString(), name, is_use_qr_code,
                                is_use_location, description, link, status, locationid);

                            foreach (string attends in attendees)
                            {
                                //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                                tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                                {
                                    group_id = null,
                                    attendee = attends,
                                    event_id = i_guid_event,
                                    date_create = createdate,
                                    status = 20 //STATUS KEHADIRAN
                                });
                            }

                            foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                            {
                                //insert disini
                                var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                                if (query != null)
                                {
                                    //do nothing
                                }
                                else
                                {
                                    db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                    db.SubmitChanges();
                                }
                            }
                        }

                        db.SubmitChanges();
                        remarks = "Berhasil Edit Events";
                    }

                }
                else
                {
                    if (nama_group != null)
                    {
                        //pst ksg, grp ada
                        var getEV = db.TBL_M_EVENTs.Where(o => o.header_id == eventH_id).Select(f => f.event_id);
                        var evtid = getEV.ToArray();

                        var tbl_evl = db.TBL_M_ICOE_LINKs.Where(x => x.header_id == eventH_id);
                        db.TBL_M_ICOE_LINKs.DeleteAllOnSubmit(tbl_evl);
                        db.SubmitChanges();

                        var tbl_evH = db.TBL_M_EVENT_HEADERs.Where(x => x.event_header_id == eventH_id);
                        db.TBL_M_EVENT_HEADERs.DeleteAllOnSubmit(tbl_evH);
                        db.SubmitChanges();

                        //HAPUS RECENT DATA TO UPDATE
                        foreach (Guid uniqevid in evtid)
                        {
                            var tbl_ev = db.TBL_M_EVENTs.Where(x => x.header_id == eventH_id);
                            db.TBL_M_EVENTs.DeleteAllOnSubmit(tbl_ev);
                            var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == uniqevid);
                            db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(tbl_at);
                            db.SubmitChanges();
                        }

                        for (int b = 0; b <= daily; b++)
                        {
                            List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                            Guid i_guid_event = System.Guid.NewGuid();
                            DateTime evStart = Convert.ToDateTime(start_date).AddDays(b);

                            //TEMPAT SP
                            db.cusp_UpdateEvent_Header(eventH_id, distrik, departement, ulang, evStart, end_dates, evStart,
                                starttime, endtime, kategori, iscoe, createdate, createby, i_guid_event.ToString(), name, is_use_qr_code,
                                is_use_location, description, link, status, locationid);

                            foreach (string arr in nama_group)
                            {
                                //list lengkap group id dan attendee
                                List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                                lst_detail = db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                                foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                                {
                                    TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                                    eventAttendance.attendee = x.attendee;
                                    eventAttendance.event_id = i_guid_event;
                                    eventAttendance.status = 20;
                                    eventAttendance.group_id = x.group_id;
                                    eventAttendance.date_create = createdate;

                                    tblDetail.Add(eventAttendance);
                                }
                            }

                            foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                            {
                                //insert disini
                                var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                                if (query != null)
                                {
                                    //do nothing
                                }
                                else
                                {
                                    db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                    db.SubmitChanges();
                                }
                            }                           
                        }
                        db.SubmitChanges();
                        remarks = "Berhasil Edit Events";
                    }
                    else
                    {
                        //pst ksg, grp ksg
                    }
                }
            }            
            db.Dispose();
            //remarks = "Berhasil Edit Events";
            }

        //UPDATE WEEKLY
        public void updateweekly (DateTime createdate, ref string remarks)
        {
            DB_ICT_mOK_KPTDataContext db = new DB_ICT_mOK_KPTDataContext();
            List<TBL_T_EVENT_ATTENDANCE> tbl = new List<TBL_T_EVENT_ATTENDANCE>();
            List<TBL_T_EVENT_ATTENDANCE> tblEatt = new List<TBL_T_EVENT_ATTENDANCE>();
            List<string> lst_all_attendee = new List<string>();
            List<string> lst_all_temp = new List<string>();
            TimeSpan abcde = Convert.ToDateTime(end_dates) - Convert.ToDateTime(start_date);
            double weeks = abcde.TotalDays / 7;

             var lokasi = 0;//db.cusp_cekLokasi(start_date, end_dates, starttime, endtime, locationid, 2, eventH_id).FirstOrDefault();

            for (int x = 0; x <= weeks; x++)
            {
                DateTime evStartInner = Convert.ToDateTime(start_date).AddDays(7 * x);
                var hasil_temp = db.cusp_cekLokasi(evStartInner, evStartInner, starttime, endtime, locationid, 2, eventH_id).FirstOrDefault();
                lokasi = lokasi + Convert.ToInt32(hasil_temp.hasil); // 0 => berhasil 1 => gagal
            }
            //do nothing
            if (lokasi > 0)
            {
                remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
            }
            else
            {
                if (attendees != null)
                {
                    if (nama_group != null)
                    {
                        //pst ada , grp ada
                        var getEV = db.TBL_M_EVENTs.Where(o => o.header_id == eventH_id).Select(f => f.event_id);
                        var evtid = getEV.ToArray();

                        var tbl_evl = db.TBL_M_ICOE_LINKs.Where(x => x.header_id == eventH_id);
                        db.TBL_M_ICOE_LINKs.DeleteAllOnSubmit(tbl_evl);
                        db.SubmitChanges();

                        var tbl_evH = db.TBL_M_EVENT_HEADERs.Where(x => x.event_header_id == eventH_id);
                        db.TBL_M_EVENT_HEADERs.DeleteAllOnSubmit(tbl_evH);
                        db.SubmitChanges();

                        //HAPUS RECENT DATA TO UPDATE
                        foreach ( Guid uniqevid in evtid )
                        {                            
                            var tbl_ev = db.TBL_M_EVENTs.Where(x => x.header_id == eventH_id);
                            db.TBL_M_EVENTs.DeleteAllOnSubmit(tbl_ev);
                            var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == uniqevid );
                            db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(tbl_at);
                            db.SubmitChanges();
                        }                        

                        for (int c = 0; c <= weeks; c++)
                        {
                            List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                            Guid i_guid_event = System.Guid.NewGuid();
                            DateTime evStart = Convert.ToDateTime(start_date).AddDays(7 * c);

                            //TEMPAT SP
                            db.cusp_UpdateEvent_Header(eventH_id, distrik, departement, ulang, evStart, end_dates, evStart,
                                starttime, endtime, kategori, iscoe, createdate, createby, i_guid_event.ToString(), name, is_use_qr_code,
                                is_use_location, description, link, status, locationid);

                            foreach (string attends in attendees)
                            {
                                //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                                tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                                {
                                    group_id = null,
                                    attendee = attends,
                                    event_id = i_guid_event,
                                    date_create = createdate,
                                    status = 20 //STATUS KEHADIRAN
                                });
                            }

                            foreach (string arr in nama_group)
                            {
                                //list lengkap group id dan attendee
                                List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                                lst_detail = db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                                foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                                {
                                    TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                                    eventAttendance.attendee = x.attendee;
                                    eventAttendance.event_id = i_guid_event;
                                    eventAttendance.status = 20;
                                    eventAttendance.group_id = x.group_id;
                                    eventAttendance.date_create = createdate;

                                    tblDetail.Add(eventAttendance);
                                }
                            }

                            foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                            {
                                //insert disini
                                var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                                if (query != null)
                                {
                                    //do nothing
                                }
                                else
                                {
                                    db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                    db.SubmitChanges();
                                }
                            }
                        }
                        db.SubmitChanges();
                        remarks = "Berhasil Edit Events";
                    }
                    else
                    {
                        //pst ada, grp ksg
                        var getEV = db.TBL_M_EVENTs.Where(o => o.header_id == eventH_id).Select(f => f.event_id);
                        var evtid = getEV.ToArray();

                        var tbl_evl = db.TBL_M_ICOE_LINKs.Where(x => x.header_id == eventH_id);
                        db.TBL_M_ICOE_LINKs.DeleteAllOnSubmit(tbl_evl);
                        db.SubmitChanges();

                        var tbl_evH = db.TBL_M_EVENT_HEADERs.Where(x => x.event_header_id == eventH_id);
                        db.TBL_M_EVENT_HEADERs.DeleteAllOnSubmit(tbl_evH);
                        db.SubmitChanges();

                        //HAPUS RECENT DATA TO UPDATE
                        foreach (Guid uniqevid in evtid)
                        {
                            var tbl_ev = db.TBL_M_EVENTs.Where(x => x.header_id == eventH_id);
                            db.TBL_M_EVENTs.DeleteAllOnSubmit(tbl_ev);
                            var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == uniqevid);
                            db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(tbl_at);
                            db.SubmitChanges();
                        }

                        for (int c = 0; c <= weeks; c++)
                        {
                            List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                            Guid i_guid_event = System.Guid.NewGuid();
                            DateTime evStart = Convert.ToDateTime(start_date).AddDays(7 * c);

                            //TEMPAT SP
                            db.cusp_UpdateEvent_Header(eventH_id, distrik, departement, ulang, evStart, end_dates, evStart,
                                starttime, endtime, kategori, iscoe, createdate, createby, i_guid_event.ToString(), name, is_use_qr_code,
                                is_use_location, description, link, status, locationid);

                            foreach (string attends in attendees)
                            {
                                //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                                tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                                {
                                    group_id = null,
                                    attendee = attends,
                                    event_id = i_guid_event,
                                    date_create = createdate,
                                    status = 20 //STATUS KEHADIRAN
                                });
                            }

                            foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                            {
                                //insert disini
                                var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                                if (query != null)
                                {
                                    //do nothing
                                }
                                else
                                {
                                    db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                    db.SubmitChanges();
                                }
                            }
                        }
                        db.SubmitChanges();
                        remarks = "Berhasil Edit Events";
                    }

                }
                else
                {
                    if (nama_group != null)
                    {
                        //pst ksg, grp ada
                        var getEV = db.TBL_M_EVENTs.Where(o => o.header_id == eventH_id).Select(f => f.event_id);
                        var evtid = getEV.ToArray();

                        var tbl_evl = db.TBL_M_ICOE_LINKs.Where(x => x.header_id == eventH_id);
                        db.TBL_M_ICOE_LINKs.DeleteAllOnSubmit(tbl_evl);
                        db.SubmitChanges();

                        var tbl_evH = db.TBL_M_EVENT_HEADERs.Where(x => x.event_header_id == eventH_id);
                        db.TBL_M_EVENT_HEADERs.DeleteAllOnSubmit(tbl_evH);
                        db.SubmitChanges();

                        //HAPUS RECENT DATA TO UPDATE
                        foreach (Guid uniqevid in evtid)
                        {
                            var tbl_ev = db.TBL_M_EVENTs.Where(x => x.header_id == eventH_id);
                            db.TBL_M_EVENTs.DeleteAllOnSubmit(tbl_ev);
                            var tbl_at = db.TBL_T_EVENT_ATTENDANCEs.Where(i => i.event_id == uniqevid);
                            db.TBL_T_EVENT_ATTENDANCEs.DeleteAllOnSubmit(tbl_at);
                            db.SubmitChanges();
                        }

                        for (int c = 0; c <= weeks; c++)
                        {
                            List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                            Guid i_guid_event = System.Guid.NewGuid();
                            DateTime evStart = Convert.ToDateTime(start_date).AddDays(7 * c);

                            //TEMPAT SP
                            db.cusp_UpdateEvent_Header(eventH_id, distrik, departement, ulang, evStart, end_dates, evStart,
                                starttime, endtime, kategori, iscoe, createdate, createby, i_guid_event.ToString(), name, is_use_qr_code,
                                is_use_location, description, link, status, locationid);

                            foreach (string arr in nama_group)
                            {
                                //list lengkap group id dan attendee
                                List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                                lst_detail = db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                                foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                                {
                                    TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                                    eventAttendance.attendee = x.attendee;
                                    eventAttendance.event_id = i_guid_event;
                                    eventAttendance.status = 20;
                                    eventAttendance.group_id = x.group_id;
                                    eventAttendance.date_create = createdate;

                                    tblDetail.Add(eventAttendance);
                                }
                            }

                            foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                            {
                                //insert disini
                                var query = db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                                if (query != null)
                                {
                                    //do nothing
                                }
                                else
                                {
                                    db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                    db.SubmitChanges();
                                }
                            }
                        }
                        db.SubmitChanges();
                        remarks = "Berhasil Edit Events";

                    }
                    else
                    {
                        for (int c = 0; c <= weeks; c++)
                        {

                        }

                    }
                }
                db.Dispose();
            }            
        }
    }
}
