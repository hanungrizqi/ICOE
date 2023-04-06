using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;

namespace ICOE.Models
{
    public class CalendarViewModel
    {
        public string title { get; set; }
        public string date { get; set; }

        public CalendarViewModel (VW_EVENT view_event)
        {
            this.title = view_event.name;
            this.date = view_event.start_date?.ToString("yyyy-MM-ddTHH:mm");

        //new DateTime(view_event.start_date).ToString("MM/dd/yyyy H:mm");
    }
    }
}