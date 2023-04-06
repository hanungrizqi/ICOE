using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;

namespace ICOE.Models
{
    public class EventViewModels
    {
        DB_ICT_mOK_KPTDataContext db = new DB_ICT_mOK_KPTDataContext();

        public string event_id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string link { get; set; }
        public DateTime? start_date { get; set; }
        public Nullable<DateTime> end_dates { get; set; }
        public string location_id { get; set; }
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

        private class ClsGroupAttendeeDetail
        {
            public string attendee { get; set; }
            public string groupID { get; set; }
        }

        //INSERT WEEKLY  
        public void insertEvent (string createBy, DateTime createdate, ref string remarks)
        {
            DB_ICT_mOK_KPTDataContext i_ctx_db;
            i_ctx_db = new DB_ICT_mOK_KPTDataContext();

            List<TBL_T_EVENT_ATTENDANCE> tbl = new List<TBL_T_EVENT_ATTENDANCE>();

            List<TBL_T_EVENT_ATTENDANCE> tblEatt = new List<TBL_T_EVENT_ATTENDANCE>();

            List<string> lst_all_attendee = new List<string>();
            List<string> lst_all_temp = new List<string>();
            List<string> lst_group_id = new List<string>();

            Guid i_guid_eventH = System.Guid.NewGuid();
            TimeSpan abcd = Convert.ToDateTime(end_dates) - Convert.ToDateTime(start_date);
            double weeks = abcd.TotalDays / 7;

            var deskripsi = "";

            if (description == null || description == "")
            {
                deskripsi = "-";
            }
            else
            {
                deskripsi = description;
            }

            ////UNTUK TRIM JIKA DUPLIKAT PESERTA
            //if (attendees.Length >= 0)
            //{
            //    foreach (string abc in attendees)
            //    {
            //        lst_all_attendee.Add(abc.Trim().ToUpper());
            //    }
            //}

            //INSERT KE TBL_M_GROUP_ATTENDEE_DETAIL

            var lokasi = 0;
            if (attendees != null)
            {
                if (nama_group == null)
                {
                    //do nothing
                    for (int x = 0; x <= weeks; x++)
                    {
                        DateTime evStartInner = Convert.ToDateTime(start_date).AddDays(7 * x);
                        var hasil_temp = i_ctx_db.cusp_cekLokasi(evStartInner, evStartInner, starttime, endtime, locationid, 1, eventH_id).FirstOrDefault();
                        lokasi = lokasi + Convert.ToInt32(hasil_temp.hasil); // 0 => berhasil 1 => gagal
                    }
                    //do nothing
                    if (lokasi > 0)
                    {
                        remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
                    }
                    else
                    {
                        for (int i = 0; i <= weeks; i++)
                        {
                            List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                            Guid i_guid_event = System.Guid.NewGuid();
                            DateTime evStart = Convert.ToDateTime(start_date).AddDays(7 * i);

                            db.cusp_EventHeader(i_guid_eventH.ToString(), distrik, departement, ulang, evStart, end_dates, evStart,//<-- ini utk enddates
                            starttime, endtime, kategori, iscoe, createdate, createBy, i_guid_event.ToString(), name, is_use_qr_code, is_use_location, deskripsi, link, status, locationid,
                            "", loclong, loclat);

                            foreach (string attends in attendees)
                            {
                                //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                                tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                                {
                                    group_id = null,
                                    attendee = attends,
                                    event_id = i_guid_event.ToString(),
                                    date_create = createdate,
                                    status = 20
                                });
                            }
                            foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                            {
                                //insert disini
                                var query = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                                if (query != null)
                                {
                                    //do nothing
                                }
                                else
                                {
                                    i_ctx_db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                    i_ctx_db.SubmitChanges();
                                }
                            }
                        }
                        db.SubmitChanges();
                        remarks = "Berhasil di Simpan !";
                    }

                }
                else
                {
                    //added by kEVIN SP
                    for (int x = 0; x <= weeks; x++)
                    {
                        DateTime evStartInner = Convert.ToDateTime(start_date).AddDays(7 * x);
                        var hasil_temp = i_ctx_db.cusp_cekLokasi(evStartInner, evStartInner, starttime, endtime, locationid, 1, eventH_id).FirstOrDefault();
                        lokasi = lokasi + Convert.ToInt32(hasil_temp.hasil); // 0 => berhasil 1 => gagal
                    }
                    //do nothing
                    if (lokasi > 0)
                    {
                        remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
                    }
                    else
                    {
                        for (int i = 0; i <= weeks; i++)
                        {
                            List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                            Guid i_guid_event = System.Guid.NewGuid();
                            DateTime evStart = Convert.ToDateTime(start_date).AddDays(7 * i);

                            db.cusp_EventHeader(i_guid_eventH.ToString(), distrik, departement, ulang, evStart, end_dates, evStart,//<-- ini utk enddates
                            starttime, endtime, kategori, iscoe, createdate, createBy, i_guid_event.ToString(), name, is_use_qr_code, is_use_location, deskripsi, link, status, locationid,
                            "", loclong, loclat);

                            foreach (string attends in attendees)
                            {
                                //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                                tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                                {
                                    group_id = null,
                                    attendee = attends,
                                    event_id = i_guid_event.ToString(),
                                    date_create = createdate,
                                    status = 20
                                });
                            }

                            foreach (string arr in nama_group)
                            {
                                //list lengkap group id dan attendee
                                List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                                lst_detail = i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                                foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                                {
                                    TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                                    eventAttendance.attendee = x.attendee;
                                    eventAttendance.event_id = i_guid_event.ToString();
                                    eventAttendance.status = 20;
                                    eventAttendance.group_id = x.group_id;
                                    eventAttendance.date_create = createdate;

                                    tblDetail.Add(eventAttendance);
                                }
                            }

                            foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                            {
                                //insert disini
                                var query = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                                if (query != null)
                                {
                                    //do nothing
                                }
                                else
                                {
                                    i_ctx_db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                    i_ctx_db.SubmitChanges();
                                }
                            }
                        }
                        db.SubmitChanges();
                        remarks = "Berhasil di Simpan !";
                    }
                }
            }
            else
            {
                for (int x = 0; x <= weeks; x++)
                {
                    DateTime evStartInner = Convert.ToDateTime(start_date).AddDays(7 * x);
                    var hasil_temp = i_ctx_db.cusp_cekLokasi(evStartInner, evStartInner, starttime, endtime, locationid, 1, eventH_id).FirstOrDefault();
                    lokasi = lokasi + Convert.ToInt32(hasil_temp.hasil); // 0 => berhasil 1 => gagal
                }
                //do nothing
                if (lokasi > 0)
                {
                    remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
                }
                else
                {
                    for (int i = 0; i <= weeks; i++)
                    {
                        List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                        Guid i_guid_event = System.Guid.NewGuid();
                        DateTime evStart = Convert.ToDateTime(start_date).AddDays(7 * i);

                        db.cusp_EventHeader(i_guid_eventH.ToString(), distrik, departement, ulang, evStart, end_dates, evStart,//<-- ini utk enddates
                        starttime, endtime, kategori, iscoe, createdate, createBy, i_guid_event.ToString(), name, is_use_qr_code, is_use_location, deskripsi, link, status, locationid,
                        "", loclong, loclat);

                        foreach (string arr in nama_group)
                        {
                            //list lengkap group id dan attendee
                            List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                            lst_detail = i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                            foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                            {
                                TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                                eventAttendance.attendee = x.attendee;
                                eventAttendance.event_id = i_guid_event.ToString();
                                eventAttendance.status = 20;
                                eventAttendance.group_id = x.group_id;
                                eventAttendance.date_create = createdate;

                                tblDetail.Add(eventAttendance);
                            }
                        }

                        foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                        {
                            //insert disini
                            var query = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                            if (query != null)
                            {
                                //do nothing
                            }
                            else
                            {
                                i_ctx_db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                i_ctx_db.SubmitChanges();
                            }
                        }
                    }
                    db.SubmitChanges();
                    remarks = "Berhasil di Simpan !";
                }
            }

            db.Dispose();
        }

        //INSERT DAILY
        public void insertEventd (string createBy, DateTime createdate, ref string remarks)
        {
            DB_ICT_mOK_KPTDataContext i_ctx_db;
            i_ctx_db = new DB_ICT_mOK_KPTDataContext();

            List<TBL_T_EVENT_ATTENDANCE> tbl = new List<TBL_T_EVENT_ATTENDANCE>();

            List<TBL_T_EVENT_ATTENDANCE> tblEatt = new List<TBL_T_EVENT_ATTENDANCE>();

            List<string> lst_all_attendee = new List<string>();
            List<string> lst_all_temp = new List<string>();

            Guid i_guid_eventH = System.Guid.NewGuid();
            Guid i_guid_gpid = System.Guid.NewGuid();
            //var createdate = DateTime.Now;
            TimeSpan abcde = Convert.ToDateTime(end_dates) - Convert.ToDateTime(start_date);
            double daily = abcde.TotalDays;

            var deskripsi = "";

            if (description == null || description == "")
            {
                deskripsi = "-";
            }
            else
            {
                deskripsi = description;
            }

            var lokasi = 0;//i_ctx_db.cusp_cekLokasi(start_date, end_dates, starttime, endtime, locationid, 1, eventH_id).FirstOrDefault();

            if (attendees != null)
            {
                if (nama_group == null)
                {
                    for (int x = 0; x <= daily; x++)
                    {
                        DateTime evStartInner = Convert.ToDateTime(start_date).AddDays(x);
                        var hasil_temp = i_ctx_db.cusp_cekLokasi(evStartInner, evStartInner, starttime, endtime, locationid, 1, eventH_id).FirstOrDefault();
                        lokasi = lokasi + Convert.ToInt32(hasil_temp.hasil); // 0 => berhasil 1 => gagal
                    }
                    //do nothing
                    if (lokasi > 0)
                    {
                        remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
                    }
                    else
                    {
                        for (int i = 0; i <= daily; i++)
                        {

                            List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                            Guid i_guid_event = System.Guid.NewGuid();
                            DateTime evStart = Convert.ToDateTime(start_date).AddDays(i);

                            db.cusp_EventHeader(i_guid_eventH.ToString(), distrik, departement, ulang, evStart, end_dates, evStart,//<-- ini utk enddates
                            starttime, endtime, kategori, iscoe, createdate, createBy, i_guid_event.ToString(), name, is_use_qr_code, is_use_location, deskripsi, link, status, locationid,
                            "", loclong, loclat);

                            foreach (string attends in attendees)
                            {
                                //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                                tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                                {
                                    group_id = null,
                                    attendee = attends,
                                    event_id = i_guid_event.ToString(),
                                    date_create = createdate,
                                    status = 20
                                });
                            }
                            foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                            {
                                //insert disini
                                var query = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                                if (query != null)
                                {
                                    //do nothing
                                }
                                else
                                {
                                    i_ctx_db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                    i_ctx_db.SubmitChanges();
                                }
                            }
                        }
                        db.SubmitChanges();
                        remarks = "Berhasil di Simpan !";
                    }

                }
                else
                {
                    //added by kEVIN SP
                    for (int x = 0; x <= daily; x++)
                    {
                        DateTime evStartInner = Convert.ToDateTime(start_date).AddDays(x);
                        var hasil_temp = i_ctx_db.cusp_cekLokasi(evStartInner, evStartInner, starttime, endtime, locationid, 1, eventH_id).FirstOrDefault();
                        lokasi = lokasi + Convert.ToInt32(hasil_temp.hasil); // 0 => berhasil 1 => gagal
                    }
                    //do nothing
                    if (lokasi > 0)
                    {
                        remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
                    }
                    else
                    {
                        for (int i = 0; i <= daily; i++)
                        {
                            List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                            Guid i_guid_event = System.Guid.NewGuid();
                            DateTime evStart = Convert.ToDateTime(start_date).AddDays(i);

                            db.cusp_EventHeader(i_guid_eventH.ToString(), distrik, departement, ulang, evStart, end_dates, evStart,//<-- ini utk enddates
                            starttime, endtime, kategori, iscoe, createdate, createBy, i_guid_event.ToString(), name, is_use_qr_code, is_use_location, deskripsi, link, status, locationid,
                            "", loclong, loclat);

                            foreach (string attends in attendees)
                            {
                                //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                                tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                                {
                                    group_id = null,
                                    attendee = attends,
                                    event_id = i_guid_event.ToString(),
                                    date_create = createdate,
                                    status = 20
                                });
                            }

                            foreach (string arr in nama_group)
                            {
                                //list lengkap group id dan attendee
                                List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                                lst_detail = i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                                foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                                {
                                    TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                                    eventAttendance.attendee = x.attendee;
                                    eventAttendance.event_id = i_guid_event.ToString();
                                    eventAttendance.status = 20;
                                    eventAttendance.group_id = x.group_id;
                                    eventAttendance.date_create = createdate;

                                    tblDetail.Add(eventAttendance);
                                }
                            }

                            foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                            {
                                //insert disini
                                var query = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                                if (query != null)
                                {
                                    //do nothing
                                }
                                else
                                {
                                    i_ctx_db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                    i_ctx_db.SubmitChanges();
                                }
                            }
                        }
                        db.SubmitChanges();
                        remarks = "Berhasil di Simpan !";
                    }
                }
            }
            else
            {
                for (int x = 0; x <= daily; x++)
                {
                    DateTime evStartInner = Convert.ToDateTime(start_date).AddDays(x);
                    var hasil_temp = i_ctx_db.cusp_cekLokasi(evStartInner, evStartInner, starttime, endtime, locationid, 1, eventH_id).FirstOrDefault();
                    lokasi = lokasi + Convert.ToInt32(hasil_temp.hasil); // 0 => berhasil 2,1 => gagal
                }
                //do nothing
                if (lokasi > 0)
                {
                    remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
                }
                else
                {
                    for (int i = 0; i <= daily; i++)
                    {
                        List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                        Guid i_guid_event = System.Guid.NewGuid();
                        DateTime evStart = Convert.ToDateTime(start_date).AddDays(i);

                        db.cusp_EventHeader(i_guid_eventH.ToString(), distrik, departement, ulang, evStart, end_dates, evStart,//<-- ini utk enddates
                        starttime, endtime, kategori, iscoe, createdate, createBy, i_guid_event.ToString(), name, is_use_qr_code, is_use_location, deskripsi, link, status, locationid,
                        "", loclong, loclat);

                        foreach (string arr in nama_group)
                        {
                            //list lengkap group id dan attendee
                            List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                            lst_detail = i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                            foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                            {
                                TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                                eventAttendance.attendee = x.attendee;
                                eventAttendance.event_id = i_guid_event.ToString();
                                eventAttendance.status = 20;
                                eventAttendance.group_id = x.group_id;
                                eventAttendance.date_create = createdate;

                                tblDetail.Add(eventAttendance);
                            }
                        }

                        foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                        {
                            //insert disini
                            var query = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                            if (query != null)
                            {
                                //do nothing
                            }
                            else
                            {
                                i_ctx_db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                i_ctx_db.SubmitChanges();
                            }
                        }
                    }
                    db.SubmitChanges();
                    remarks = "Berhasil di Simpan !";
                }
            }

            //db.SubmitChanges();
            db.Dispose();
        }

        //INSERT ONCE
        public void insertEvento (string createBy, DateTime createdate, ref string remarks)
        {
            DB_ICT_mOK_KPTDataContext i_ctx_db;
            i_ctx_db = new DB_ICT_mOK_KPTDataContext();

            List<TBL_T_EVENT_ATTENDANCE> tbl = new List<TBL_T_EVENT_ATTENDANCE>();

            List<TBL_T_EVENT_ATTENDANCE> tblEatt = new List<TBL_T_EVENT_ATTENDANCE>();

            List<string> lst_all_attendee = new List<string>();
            List<string> lst_all_temp = new List<string>();

            Guid i_guid_eventH = System.Guid.NewGuid();
            Guid i_guid_gpid = System.Guid.NewGuid();

            var deskripsi = "";

            if (description == null || description == "")
            {
                deskripsi = "-";
            }
            else
            {
                deskripsi = description;
            }

            var lokasi = 0; //i_ctx_db.cusp_cekLokasi(start_date, start_date, starttime, endtime, locationid, 1, eventH_id).FirstOrDefault();

            if (attendees != null)
            {
                if (nama_group == null)
                {
                    //do nothing

                    DateTime evStartInner = Convert.ToDateTime(start_date);
                    var hasil_temp = i_ctx_db.cusp_cekLokasi(evStartInner, evStartInner, starttime, endtime, locationid, 1, eventH_id).FirstOrDefault();
                    lokasi = lokasi + Convert.ToInt32(hasil_temp.hasil); // 0 => berhasil 2,1 => gagal

                    if (lokasi > 0)
                    {
                        remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
                    }
                    else
                    {
                        List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                        Guid i_guid_event = System.Guid.NewGuid();
                        DateTime evStart = Convert.ToDateTime(start_date);

                        db.cusp_EventHeader(i_guid_eventH.ToString(), distrik, departement, ulang, evStart, evStart, evStart,//<-- ini utk enddates
                         starttime, endtime, kategori, iscoe, createdate, createBy, i_guid_event.ToString(), name, is_use_qr_code, is_use_location, deskripsi, link, status, locationid,
                         "", loclong, loclat).AsQueryable().FirstOrDefault();

                        foreach (string attends in attendees)
                        {
                            //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                            tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                            {
                                group_id = null,
                                attendee = attends,
                                event_id = i_guid_event.ToString(),
                                date_create = createdate,
                                status = 20
                            });
                        }
                        foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                        {
                            //insert disini
                            var query = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                            if (query != null)
                            {
                                //do nothing
                            }
                            else
                            {
                                i_ctx_db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                i_ctx_db.SubmitChanges();
                            }
                        }
                        db.SubmitChanges();
                        remarks = "Berhasil di Simpan !";
                    }


                }
                else
                {
                    //added by kEVIN SP
                    DateTime evStartInner = Convert.ToDateTime(start_date);
                    var hasil_temp = i_ctx_db.cusp_cekLokasi(evStartInner, evStartInner, starttime, endtime, locationid, 1, eventH_id).FirstOrDefault();
                    lokasi = lokasi + Convert.ToInt32(hasil_temp.hasil); // 0 => berhasil 2,1 => gagal

                    if (lokasi > 0)
                    {
                        remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
                    }
                    else
                    {
                        List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                        Guid i_guid_event = System.Guid.NewGuid();
                        DateTime evStart = Convert.ToDateTime(start_date);

                        var zz1z = db.cusp_EventHeader(i_guid_eventH.ToString(), distrik, departement, ulang, evStart, evStart, evStart,//<-- ini utk enddates
                         starttime, endtime, kategori, iscoe, createdate, createBy, i_guid_event.ToString(), name, is_use_qr_code, is_use_location, deskripsi, link, status, locationid,
                         "", loclong, loclat).AsQueryable().FirstOrDefault();

                        foreach (string attends in attendees)
                        {
                            //Guid i_guid_gpiddetail = System.Guid.NewGuid();
                            tblDetail.Add(new TBL_T_EVENT_ATTENDANCE
                            {
                                group_id = null,
                                attendee = attends,
                                event_id = i_guid_event.ToString(),
                                date_create = createdate,
                                status = 20
                            });
                        }

                        foreach (string arr in nama_group)
                        {
                            //list lengkap group id dan attendee
                            List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                            lst_detail = i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                            foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                            {
                                TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                                eventAttendance.attendee = x.attendee;
                                eventAttendance.event_id = i_guid_event.ToString();
                                eventAttendance.status = 20;
                                eventAttendance.group_id = x.group_id;
                                eventAttendance.date_create = createdate;

                                tblDetail.Add(eventAttendance);
                            }
                        }

                        foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                        {
                            //insert disini
                            var query = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                            if (query != null)
                            {
                                //do nothing
                            }
                            else
                            {
                                i_ctx_db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                                i_ctx_db.SubmitChanges();
                            }
                        }
                        db.SubmitChanges();
                        remarks = "Berhasil di Simpan !";
                    }                   

                }
            }
            else
            {
                DateTime evStartInner = Convert.ToDateTime(start_date);
                var hasil_temp = i_ctx_db.cusp_cekLokasi(evStartInner, evStartInner, starttime, endtime, locationid, 1, eventH_id).FirstOrDefault();
                lokasi = lokasi + Convert.ToInt32(hasil_temp.hasil); // 0 => berhasil 1 => gagal

                if (lokasi > 0)
                {
                    remarks = "Tidak dapat membuat event karena terdapat event pada lokasi tersebut";
                }
                else
                {
                    List<TBL_T_EVENT_ATTENDANCE> tblDetail = new List<TBL_T_EVENT_ATTENDANCE>();

                    Guid i_guid_event = System.Guid.NewGuid();
                    DateTime evStart = Convert.ToDateTime(start_date);

                    db.cusp_EventHeader(i_guid_eventH.ToString(), distrik, departement, ulang, evStart, evStart, evStart,//<-- ini utk enddates
                    starttime, endtime, kategori, iscoe, createdate, createBy, i_guid_event.ToString(), name, is_use_qr_code, is_use_location, deskripsi, link, status, locationid,
                    "", loclong, loclat);

                    foreach (string arr in nama_group)
                    {
                        //list lengkap group id dan attendee
                        List<TBL_M_GROUP_ATTENDEE_DETAIL> lst_detail = new List<TBL_M_GROUP_ATTENDEE_DETAIL>();
                        lst_detail = i_ctx_db.TBL_M_GROUP_ATTENDEE_DETAILs.Where(q => q.group_id == arr).ToList();

                        foreach (TBL_M_GROUP_ATTENDEE_DETAIL x in lst_detail)
                        {
                            TBL_T_EVENT_ATTENDANCE eventAttendance = new TBL_T_EVENT_ATTENDANCE();
                            eventAttendance.attendee = x.attendee;
                            eventAttendance.event_id = i_guid_event.ToString();
                            eventAttendance.status = 20;
                            eventAttendance.group_id = x.group_id;
                            eventAttendance.date_create = createdate;

                            tblDetail.Add(eventAttendance);
                        }
                    }

                    foreach (TBL_T_EVENT_ATTENDANCE evennt in tblDetail)
                    {
                        //insert disini
                        var query = i_ctx_db.TBL_T_EVENT_ATTENDANCEs.Where(z => z.event_id == evennt.event_id && z.attendee == evennt.attendee).FirstOrDefault();
                        if (query != null)
                        {
                            //do nothing
                        }
                        else
                        {
                            i_ctx_db.TBL_T_EVENT_ATTENDANCEs.InsertOnSubmit(evennt);
                            i_ctx_db.SubmitChanges();
                        }
                    }

                    db.SubmitChanges();                   
                    remarks = "Berhasil di Simpan !";
                }
                
            }
            db.Dispose();
        }
    }
}