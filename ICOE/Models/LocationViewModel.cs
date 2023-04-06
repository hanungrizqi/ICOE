using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICOE.Models
{
    public class LocationViewModel
    {
        public string location_id { get; set; }
        public string location_name { get; set; }
        public List<LatLngViewModel> latLng { get; set; }

    }

    public class LatLngViewModel
    {
        public decimal? latitude { get; set; }
        public decimal? longtitude { get; set; }
    }

     
}