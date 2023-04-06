$(document).ready(function () {
   var viewModel = kendo.observable({
        event_id: "",
        name: "",
        District: "",
        departement: "",
        katergori: "",
        startclock_date: "",
        endclock_date: "",
        ulang: "",
        description: "",
        link: "",
        start_date: "",
        end_date: "",
        location_id: "",
        is_use_qr_code: 0,
        is_use_location: 0,
        attendees: [],
        nama_group: "",
        val: true,
       remarksnya: "HELLO",
   });

    var required = $("#ms_karyawan").kendoMultiSelect({
        dataTextField: "NAME",
        dataValueField: "EMPLOYEE_ID",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#hd_path").val() + "/CreateEvent/AjaxReadKaryawan",
                    contentType: "application/json",
                    type: "GET",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        }
        //change: function () {
        //    debugger
        //    viewModel.set("attendees", this.value());
        //}
    }).data("kendoMultiSelect");   

    var req = $("#tx_namaGroup").kendoMultiSelect({
        dataTextField: "group_name",
        dataValueField: "group_id",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#hd_path").val() + "/CreateEvent/AjaxGroup",
                    contentType: "application/json",
                    type: "GET",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        }
        //change: function () {
        //    debugger
        //    viewModel.set("attendees", this.value());
        //}
    }).data("kendoMultiSelect");

    $("#dt_startEvent").kendoDatePicker({
        format: "yyyy-MM-dd",
        value: new Date()
        //change: function (e) {
        //    if ($("#tx_ulangEvent").val() == 3) {
        //        debugger
        //        var start_date = new Date(kendo.parseDate($("#dt_startEvent").val(), "yyyy-MM-dd"));
        //        var end_date = new Date(start_date);
        //        end_date.setDate(end_date.getDate() + 7);
        //        var tanggal = kendo.toString(end_date, "yyyy-MM-dd");
        //        $("#dt_endEvent").val(tanggal);
        //        viewModel.set("val", false);
        //    }
        //}
    });

    //$("#tx_namaGroup").kendoMultiSelect({
    //    dataTextField: "group_name",
    //    dataValueField: "group_id",
    //    dataSource: {
    //        type: "json",
    //        transport: {
    //            read: {
    //                url: $("#hd_path").val() + "/CreateEvent/AjaxGroup",
    //                contentType: "application/json",
    //                type: "GET",
    //                cache: false
    //            }
    //        },
    //        schema: {
    //            data: "Data",
    //            total: "Total"
    //        }
    //    }
    //    //change: function () {
    //    //    debugger
    //    //    viewModel.set("namaG", this.value());
    //    //}
    //}).data("kendoMultiSelect");
    //$("#btn_save").click(function () {
    //    save();
    //    console.log(JSON.stringify(viewModel))
    //});

    $("#tx_ulangEvent").kendoDropDownList({
    optionLabel: "Pilih Pengadaan Event",
    dataSource: [
        { name: "Once", value: "1" },
         { name: "Daily", value: "2" },
         { name: "Weekly", value: "3" },
    ],
    dataTextField: "name",
    dataValueField: "value",
    change: function (e) {

        if ($("#tx_ulangEvent").val() == 1) {
            viewModel.set("val", true);
            $("#tglakhir").hide();
        }
        else if ($("#tx_ulangEvent").val() == 2) {
            viewModel.set("val", false);
            $("#tglakhir").show();
        }
        else if ($("#tx_ulangEvent").val() == 3) {
            viewModel.set("val", false);
            $("#tglakhir").show();
        }
    }
});

    $("#dd_location").kendoDropDownList({
        //filter: "startswith",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#hd_path").val() + "/CreateEvent/AjaxReadLocation",
                    contentType: "application/json",
                    type: "GET",
                    cache: false
                }
            },
            schema: {
                data: "Data",
                total: "Total"
            }
        },
        dataTextField: "location_name",
        dataValueField: "location_id",
        optionLabel: "Pilih...",
    });   

    $("#tx_kategoriEvent").kendoDropDownList({
        optionLabel: "Pilih Kategori",
        dataTextField: "kategori",
        dataValueField: "id_kategori",
        dataSource:
           {
               type: "json",
               transport:
                   {
                       read:
                           {
                               url: "/CreateEvent/AjaxKategori",
                               contentType: "application/json",
                               type: "POST",
                               cache: false
                           }
                   },
               schema:
                   {
                       data: "Data",
                       total: "Total"
                   }
           }
    });

    $("#dt_startclockEvent").kendoTimePicker({
        format: "HH:mm",
        dateInput: true
    });

    $("#dt_endclockEvent").kendoTimePicker({
        format: "HH:mm",
        dateInput: true
    });

    $("#dt_endEvent").kendoDatePicker({
        format: "yyyy-MM-dd",
    });    

    kendo.bind($("#form"), viewModel);

});

function isloc() {
    var checkBox = document.getElementById("chk_loc");
    if (checkBox.checked == true) {
        $("#chk_loc").val(true);
    } else {
        $("#chk_loc").val(false);
    }
}

function isqr() {
    var checkBox = document.getElementById("chk_qr");
    if (checkBox.checked == true) {
        $("#chk_qr").val(true);
    } else {
        $("#chk_qr").val(false);
    }
}

function date() {

    var nilai = true;

    var startDay = new Date(convertDate($("#dt_startEvent").val(), "year"), convertDate($("#dt_startEvent").val(), "month"), convertDate($("#dt_startEvent").val(), "day"));
    var endDay = new Date(convertDate($("#dt_endEvent").val(), "year"), convertDate($("#dt_endEvent").val(), "month"), convertDate($("#dt_endEvent").val(), "day"));

    var millisecondsPerDay = 1000 * 60 * 60 * 24;

    var millisBetween = endDay - startDay;
    var days = millisBetween / millisecondsPerDay;

    var val = (Math.floor(days) % 7);

    if (val != 0) {
        alert("silahkan pilih tanggal pada hari yang sama");
        $("#dt_endEvent").val("");
        nilai = false;
    }
    else {
        nilai = true;
    }
    return nilai;
}

function convertDate(e, s) {
    var date = e;
    var result = "";

    if (s == "day") {
        result = parseInt(date.substring(8, 10));

    } else if (s == "month") {
        result = parseInt(date.substring(5, 7)-1)
       // alert(result);
    } else if (s == "year") {
        result = parseInt(date.substring(0, 4))
    } else {
        result = "";
    }
    return result;
};

function convertTime(el, es) {
    var time = el;
    var results = "";
    
    if (es == "H") {
        results = parseInt(time.substring(0,2));
        alert("ini jam" + " " + results);
    }
    else if (es == "m") {
        results = parseInt(time.substring(3,5) );
        alert("ini menit" + " " + results);
    }
    else {
        results = "";
    }
    return results;
}

function convertMinutes(els, es) {
    var time = els;
    var results = "";

    if (es == "m") {
        results = parseInt(time.substring(3, 5));
        //alert("ini menit" + " " + results);
    }
        else if (es == "m") {
            results = parseInt(time.substring(3,5) );
            //alert("ini menit" + " " + results);
        }
    else {
        results = "";
    }
    return results;
}

function save() {
    //debugger
    if ( ($("#ms_karyawan").val() == "" || $("#ms_karyawan").val() == null) && ($("#tx_namaGroup").val() == "" || $("#tx_namaGroup").val() == null) ) {
        //alert("Mohon isi Nama Group atau Nama Peserta");
        $("#alert").empty();
        $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4> Mohon isi Nama Group atau Nama Peserta </h4></label>');
        popupaction.data("kendoWindow").open();
    }
    else {
        if ($("#tx_ulangEvent").val() == 3) {

            if ($("#tx_namaEvent").val() == "" || $("#tx_namaEvent").val() == null || $("#tx_distrikEvent").val() == "" || $("#tx_distrikEvent").val() == null || $("#tx_kategoriEvent").val() == "" || $("#tx_kategoriEvent").val() == null || $("#tx_ulangEvent").val() == "" || $("#tx_ulangEvent").val() == null ||
                $("#tx_deptEvent").val() == "" || $("#tx_deptEvent").val() == null || $("#dt_startEvent").val() == "" || $("#dt_startEvent").val() == null || $("#dt_endEvent").val() == "" || $("#dt_endEvent").val() == null || $("#dt_startclockEvent").val() == "" || $("#dt_startclockEvent").val() == null ||
                $("#dt_endclockEvent").val() == "" || $("#dt_endclockEvent").val() == null || $("#dt_endclockEvent").val() == "" || $("#dt_endclockEvent").val() == null || $("#dd_location").val() == "" || $("#dd_location").val() == null) {
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4> Mohon isi Field bertanda bintang merah yang masih kosong </h4></label>');
                popupaction.data("kendoWindow").open();
            } else {              
                
                    var abc = new Date();
                    var abcday = abc.getUTCDate();
                    var abcmonth = abc.getUTCMonth() + 1;
                    var abcyear = abc.getUTCFullYear();

                    var time = abc.getTime();
                    var abch = abc.getHours();
                    var abcm = abc.getUTCMinutes();

                    var nilai = true;
                    var startDay = new Date(convertDate($("#dt_startEvent").val(), "year"), convertDate($("#dt_startEvent").val(), "month"), convertDate($("#dt_startEvent").val(), "day"));
                    var endDay = new Date(convertDate($("#dt_endEvent").val(), "year"), convertDate($("#dt_endEvent").val(), "month"), convertDate($("#dt_endEvent").val(), "day"));
                    var NewDate = new Date(abcyear + "," + abcmonth + "," + abcday);
                   

                    var st = ( $("#dt_startclockEvent").val() + ":00" ); //11:30
                    var et = ( $("#dt_endclockEvent").val() + ":00");
                    var sd =  $("#dt_startEvent").val() ; //Mon Mar 09 2020 Indochina GMT+7
                    var ed = $("#dt_endEvent").val();
                    
                    //var stt = new Date("November 13, 2013 " + start_time);
                    var times = new Date(sd + " " + st);
                    var timee = new Date(sd + " " + et);
                    var timestart = times.getTime();
                    var timeend = timee.getTime();
                    var ntime = abc.getTime();

                    var millisecondsPerDay = 1000 * 60 * 60 * 24;
                    var millisBetween = endDay - startDay;
                    var days = millisBetween / millisecondsPerDay;
                    var val = (Math.floor(days) % 7);

                    //validasi utk weekly harus +7 hari
                    if (val != 0) {
                        alert("silahkan pilih tanggal pada hari yang sama");
                        $("#dt_endEvent").val("");
                        nilai = false;
                    }
                    //validasi sd tidk boleh < nd
                    else if (startDay < NewDate) {
                        //debugger
                        //alert(endNewDate);
                        $("#alert").empty();
                        $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center"><h4> Tidak dapat membuat event kurang dari tanggal hari ini </h4></label>');
                        popupaction.data("kendoWindow").open();
                    }
                    //validasi sd tdk boleh > ed
                    else if (startDay > endDay) {
                        //alert(endNewDate);
                        $("#alert").empty();
                        $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center"><h4> Tidak dapat membuat event dengan tanggal lebih besar dari tanggal berakhir event </h4></label>');
                        popupaction.data("kendoWindow").open();
                    }
                    //validasi sd == nd
                    else if (startDay.toString() == NewDate.toString() ) {
                        //debugger
                        if (timestart < ntime|| timestart == ntime ) {
                            $("#alert").empty();
                            $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu Pengadaan Event tidak boleh kurang dari waktu saat ini atau sama dengan waktu saat ini </h4></label>');
                            popupaction.data("kendoWindow").open();
                        }
                        else if (timeend == ntime || timeend < ntime ) {
                            $("#alert").empty();
                            $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu berakhir Event tidak boleh kurang dari waktu saat ini atau sama dengan waktu saat ini </h4></label>');
                            popupaction.data("kendoWindow").open();
                        }
                        else if (timeend == timestart) {
                            $("#alert").empty();
                            $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu berakhir Event tidak boleh sama dengan waktu saat mulai event </h4></label>');
                            popupaction.data("kendoWindow").open();
                        }
                        else if (timestart > timeend) {
                            $("#alert").empty();
                            $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu berakhir Event tidak boleh lebih kecil dari waktu mulai event </h4></label>');
                            popupaction.data("kendoWindow").open();
                        }
                        else {
                            nilai = true;
                            var obj = {
                                name: $("#tx_namaEvent").val(),
                                description: $("#tx_deskEvent").val(),
                                link: $("#tx_addLink").val(),
                                distrik: $("#tx_distrikEvent").val(),
                                departement: $("#tx_deptEvent").val(),
                                ulang: $("#tx_ulangEvent").val(),
                                starttime: $("#dt_startclockEvent").val().toString(),
                                endtime: $("#dt_endclockEvent").val(),
                                kategori: $("#tx_kategoriEvent").val(),
                                //start_date: kendo.parseDate($("#dt_startEvent").val(), "yyyy-dd-MM"),
                                start_date: $("#dt_startEvent").val(),
                                end_dates: $("#dt_endEvent").val(),
                                iscoe: 1,
                                locationid: $("#dd_location").val(),
                                is_use_qr_code: $("#chk_qr").val(),
                                is_use_location: $("#chk_loc").val(),
                                attendees: $("#ms_karyawan").val(),
                                nama_group: $("#tx_namaGroup").val()
                            }
                            $.ajax({
                                type: "POST",
                                url: $("#hd_path").val() + "/CreateEvent/InsertEventNew",
                                contentType: "application/json",
                                data: JSON.stringify(obj),
                                success: function (response) {
                                    if (response.status == true) {
                                        if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                            $("#alert").empty();
                                            $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4>' + response.remark + '</h4></label>');
                                            popupaction.data("kendoWindow").open();
                                        }
                                        else {
                                            $("#alertdone").empty();
                                            $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.remark + '</h4></label>');
                                            popupactiondone.data("kendoWindow").open();
                                        }
                                    } else {
                                        //alert(response.error);
                                        $("#alertdone").empty();
                                        $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.error + '</h4></label>');
                                        popupactiondone.data("kendoWindow").open();

                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                }
                            });
                        }
                    }
                    
                    //validasi waktu
                    else if ($("#dt_startclockEvent").val() == $("#dt_endclockEvent").val() || $("#dt_startclockEvent").val() > $("#dt_endclockEvent").val()) {
                        $("#alert").empty();
                        $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu Pengadaan Event tidak boleh lebih dari waktu berakhir event atau sama dengan berakhir event </h4></label>');
                        popupaction.data("kendoWindow").open();
                    }
                    else {
                        nilai = true;
                        var obj = {
                            name: $("#tx_namaEvent").val(),
                            description: $("#tx_deskEvent").val(),
                            link: $("#tx_addLink").val(),
                            distrik: $("#tx_distrikEvent").val(),
                            departement: $("#tx_deptEvent").val(),
                            ulang: $("#tx_ulangEvent").val(),
                            starttime: $("#dt_startclockEvent").val().toString(),
                            endtime: $("#dt_endclockEvent").val(),
                            kategori: $("#tx_kategoriEvent").val(),
                            //start_date: kendo.parseDate($("#dt_startEvent").val(), "yyyy-dd-MM"),
                            start_date: $("#dt_startEvent").val(),
                            end_dates: $("#dt_endEvent").val(),
                            iscoe: 1,
                            locationid: $("#dd_location").val(),
                            is_use_qr_code: $("#chk_qr").val(),
                            is_use_location: $("#chk_loc").val(),
                            attendees: $("#ms_karyawan").val(),
                            nama_group: $("#tx_namaGroup").val()
                        }
                        $.ajax({
                            type: "POST",
                            url: $("#hd_path").val() + "/CreateEvent/InsertEventNew",
                            contentType: "application/json",
                            data: JSON.stringify(obj),
                            success: function (response) {
                                if (response.status == true) {
                                    if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                        $("#alert").empty();
                                        $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4>' + response.remark + '</h4></label>');
                                        popupaction.data("kendoWindow").open();
                                    }
                                    else {
                                        $("#alertdone").empty();
                                        $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.remark + '</h4></label>');
                                        popupactiondone.data("kendoWindow").open();
                                    }
                                } else {
                                    //alert(response.error);
                                    $("#alertdone").empty();
                                    $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.error + '</h4></label>');
                                    popupactiondone.data("kendoWindow").open();

                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                            }
                        });
                    }               
            }           
        }

        else if ($("#tx_ulangEvent").val() == 2) {
            if ($("#tx_namaEvent").val() == "" || $("#tx_namaEvent").val() == null || $("#tx_distrikEvent").val() == "" || $("#tx_distrikEvent").val() == null || $("#tx_kategoriEvent").val() == "" || $("#tx_kategoriEvent").val() == null || $("#tx_ulangEvent").val() == "" || $("#tx_ulangEvent").val() == null ||
                $("#tx_deptEvent").val() == "" || $("#tx_deptEvent").val() == null || $("#dt_startEvent").val() == "" || $("#dt_startEvent").val() == null || $("#dt_endEvent").val() == "" || $("#dt_endEvent").val() == null || $("#dt_startclockEvent").val() == "" || $("#dt_startclockEvent").val() == null ||
                $("#dt_endclockEvent").val() == "" || $("#dt_endclockEvent").val() == null || $("#dt_endclockEvent").val() == "" || $("#dt_endclockEvent").val() == null || $("#dd_location").val() == "" || $("#dd_location").val() == null) {
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center"><h4> Mohon isi Field bertanda bintang merah yang masih kosong </h4></label>');
                popupaction.data("kendoWindow").open();
            }
            else {
                    var abc = new Date();
                    var abcday = abc.getUTCDate();
                    var abcmonth = abc.getUTCMonth() + 1;
                    var abcyear = abc.getUTCFullYear();

                    var startDay = new Date(convertDate($("#dt_startEvent").val(), "year"), convertDate($("#dt_startEvent").val(), "month"), convertDate($("#dt_startEvent").val(), "day"));
                    var endDay = new Date(convertDate($("#dt_endEvent").val(), "year"), convertDate($("#dt_endEvent").val(), "month"), convertDate($("#dt_endEvent").val(), "day"));
                    var endNewDate = new Date(abcyear + "," + abcmonth + "," + abcday);
                    var NewDate = new Date(abcyear + "," + abcmonth + "," + abcday);


                    var st = ($("#dt_startclockEvent").val() + ":00"); //11:30
                    var et = ($("#dt_endclockEvent").val() + ":00");
                    var sd = $("#dt_startEvent").val(); //Mon Mar 09 2020 Indochina GMT+7
                    var ed = $("#dt_endEvent").val();

                //var stt = new Date("November 13, 2013 " + start_time);
                    var times = new Date(sd + " " + st);
                    var timee = new Date(sd + " " + et);
                    var timestart = times.getTime();
                    var timeend = timee.getTime();
                    var ntime = abc.getTime();


                    var millisecondsPerDay = 1000 * 60 * 60 * 24;
                    var millisBetween = endDay - startDay;
                    var days = millisBetween / millisecondsPerDay;
                    var val = (Math.floor(days));

                    if (val == 0) {
                        alert("silahkan pilih tanggal akhir event minimal 1 hari setelah start date");
                        $("#dt_endEvent").val("");
                    }
                    else if (startDay < NewDate) {
                        // alert(endNewDate);
                        $("#alert").empty();
                        $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4> Tidak dapat membuat event kurang dari tanggal hari ini </h4></label>');
                        popupaction.data("kendoWindow").open();
                    }
                    else if (startDay > endDay) {
                        //alert(endNewDate);
                        $("#alert").empty();
                        $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center"><h4> Tidak dapat membuat event dengan tanggal lebih besar dari tanggal berakhir event </h4></label>');
                        popupaction.data("kendoWindow").open();
                    }
                    else if (startDay.toString() == NewDate.toString()) {
                        //debugger
                        if (timestart < ntime || timestart == ntime) {
                            $("#alert").empty();
                            $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu Pengadaan Event tidak boleh kurang dari waktu saat ini atau sama dengan waktu saat ini </h4></label>');
                            popupaction.data("kendoWindow").open();
                        }
                        else if (timeend == ntime || timeend < ntime) {
                            $("#alert").empty();
                            $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu berakhir Event tidak boleh kurang dari waktu saat ini atau sama dengan waktu saat ini </h4></label>');
                            popupaction.data("kendoWindow").open();
                        }
                        else if (timeend == timestart) {
                            $("#alert").empty();
                            $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu berakhir Event tidak boleh sama dengan waktu saat mulai event </h4></label>');
                            popupaction.data("kendoWindow").open();
                        }
                        else if (timestart > timeend) {
                            $("#alert").empty();
                            $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu berakhir Event tidak boleh lebih kecil dari waktu mulai event </h4></label>');
                            popupaction.data("kendoWindow").open();
                        }
                        else {
                            nilai = true;
                            var obj = {
                                name: $("#tx_namaEvent").val(),
                                description: $("#tx_deskEvent").val(),
                                link: $("#tx_addLink").val(),
                                distrik: $("#tx_distrikEvent").val(),
                                departement: $("#tx_deptEvent").val(),
                                ulang: $("#tx_ulangEvent").val(),
                                starttime: $("#dt_startclockEvent").val().toString(),
                                endtime: $("#dt_endclockEvent").val(),
                                kategori: $("#tx_kategoriEvent").val(),
                                //start_date: kendo.parseDate($("#dt_startEvent").val(), "yyyy-dd-MM"),
                                start_date: $("#dt_startEvent").val(),
                                end_dates: $("#dt_endEvent").val(),
                                iscoe: 1,
                                locationid: $("#dd_location").val(),
                                is_use_qr_code: $("#chk_qr").val(),
                                is_use_location: $("#chk_loc").val(),
                                attendees: $("#ms_karyawan").val(),
                                nama_group: $("#tx_namaGroup").val()
                            }
                            $.ajax({
                                type: "POST",
                                url: $("#hd_path").val() + "/CreateEvent/InsertEventDaily",
                                contentType: "application/json",
                                data: JSON.stringify(obj),
                                success: function (response) {
                                    if (response.status == true) {
                                        if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                            $("#alert").empty();
                                            $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4>' + response.remark + '</h4></label>');
                                            popupaction.data("kendoWindow").open();
                                        }
                                        else {
                                            $("#alertdone").empty();
                                            $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.remark + '</h4></label>');
                                            popupactiondone.data("kendoWindow").open();
                                        }
                                    } else {
                                        //alert(response.error);
                                        $("#alertdone").empty();
                                        $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.error + '</h4></label>');
                                        popupactiondone.data("kendoWindow").open();

                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                }
                            });
                        }
                    }
                    //validasi waktu
                    else if ($("#dt_startclockEvent").val() == $("#dt_endclockEvent").val() || $("#dt_startclockEvent").val() > $("#dt_endclockEvent").val()) {
                        $("#alert").empty();
                        $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu Pengadaan Event tidak boleh lebih dari waktu berakhir event atau sama dengan berakhir event </h4></label>');
                        popupaction.data("kendoWindow").open();
                    }
                    
                    else {
                        nilai = true;
                        var obj = {
                            name: $("#tx_namaEvent").val(),
                            description: $("#tx_deskEvent").val(),
                            link: $("#tx_addLink").val(),
                            distrik: $("#tx_distrikEvent").val(),
                            departement: $("#tx_deptEvent").val(),
                            ulang: $("#tx_ulangEvent").val(),
                            starttime: $("#dt_startclockEvent").val().toString(),
                            endtime: $("#dt_endclockEvent").val(),
                            kategori: $("#tx_kategoriEvent").val(),
                            //start_date: kendo.parseDate($("#dt_startEvent").val(), "yyyy-dd-MM"),
                            start_date: $("#dt_startEvent").val(),
                            end_dates: $("#dt_endEvent").val(),
                            iscoe: 1,
                            locationid: $("#dd_location").val(),
                            is_use_qr_code: $("#chk_qr").val(),
                            is_use_location: $("#chk_loc").val(),
                            attendees: $("#ms_karyawan").val(),
                            nama_group: $("#tx_namaGroup").val()
                        }
                        $.ajax({
                            type: "POST",
                            url: $("#hd_path").val() + "/CreateEvent/InsertEventDaily",
                            contentType: "application/json",
                            data: JSON.stringify(obj),
                            success: function (response) {
                                if (response.status == true) {
                                    if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                        $("#alert").empty();
                                        $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4>' + response.remark + '</h4></label>');
                                        popupaction.data("kendoWindow").open();
                                    }
                                    else {
                                        $("#alertdone").empty();
                                        $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.remark + '</h4></label>');
                                        popupactiondone.data("kendoWindow").open();
                                    }
                                } else {
                                    //alert(response.error);
                                    $("#alertdone").empty();
                                    $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.error + '</h4></label>');
                                    popupactiondone.data("kendoWindow").open();

                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                            }
                        });
                    }
            }            
        }

        else if ($("#tx_ulangEvent").val() == 1) {
            
            var abc = new Date();
            var abcday = abc.getUTCDate();
            var abcmonth = abc.getUTCMonth()+1;
            var abcyear = abc.getUTCFullYear();

            var startDay = new Date(convertDate($("#dt_startEvent").val(), "year"), convertDate($("#dt_startEvent").val(), "month"), convertDate($("#dt_startEvent").val(), "day"));
            var NewDate = new Date(abcyear + "," + abcmonth + "," + abcday);

            var st = ($("#dt_startclockEvent").val() + ":00"); //11:30
            var et = ($("#dt_endclockEvent").val() + ":00");
            var sd = $("#dt_startEvent").val(); //Mon Mar 09 2020 Indochina GMT+7

            //var stt = new Date("November 13, 2013 " + start_time);
            var times = new Date(sd + " " + st);
            var timee = new Date(sd + " " + et);
            var timestart = times.getTime();
            var timeend = timee.getTime();
            var ntime = abc.getTime();

            if ($("#tx_namaEvent").val() == "" || $("#tx_namaEvent").val() == null || $("#tx_distrikEvent").val() == "" || $("#tx_distrikEvent").val() == null || $("#tx_kategoriEvent").val() == "" || $("#tx_kategoriEvent").val() == null || $("#tx_ulangEvent").val() == "" || $("#tx_ulangEvent").val() == null ||
                $("#tx_deptEvent").val() == "" || $("#tx_deptEvent").val() == null || $("#dt_startEvent").val() == "" || $("#dt_startEvent").val() == null || $("#dt_startclockEvent").val() == "" || $("#dt_startclockEvent").val() == null ||
                $("#dt_endclockEvent").val() == "" || $("#dt_endclockEvent").val() == null || $("#dt_endclockEvent").val() == "" || $("#dt_endclockEvent").val() == null || $("#dd_location").val() == "" || $("#dd_location").val() == null) {
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4> Mohon isi Field bertanda bintang merah yang masih kosong </h4></label>');
                popupaction.data("kendoWindow").open();
            }
            else if (startDay < NewDate) {
                // alert(endNewDate);
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4> Tidak dapat membuat event kurang dari tanggal hari ini </h4></label>');
                popupaction.data("kendoWindow").open();
            }
            else if (startDay.toString() == NewDate.toString()) {
                //debugger
                if (timestart < ntime || timestart == ntime) {
                    $("#alert").empty();
                    $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu Pengadaan Event tidak boleh kurang dari waktu saat ini atau sama dengan waktu saat ini </h4></label>');
                    popupaction.data("kendoWindow").open();
                }
                else if (timeend == ntime || timeend < ntime) {
                    $("#alert").empty();
                    $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu berakhir Event tidak boleh kurang dari waktu saat ini atau sama dengan waktu saat ini </h4></label>');
                    popupaction.data("kendoWindow").open();
                }
                else if (timeend == timestart) {
                    $("#alert").empty();
                    $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu berakhir Event tidak boleh sama dengan waktu saat mulai event </h4></label>');
                    popupaction.data("kendoWindow").open();
                }
                else if (timestart > timeend) {
                    $("#alert").empty();
                    $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu berakhir Event tidak boleh lebih kecil dari waktu mulai event </h4></label>');
                    popupaction.data("kendoWindow").open();
                }
                else {
                    var obj = {
                        name: $("#tx_namaEvent").val(),
                        description: $("#tx_deskEvent").val(),
                        link: $("#tx_addLink").val(),
                        distrik: $("#tx_distrikEvent").val(),
                        departement: $("#tx_deptEvent").val(),
                        ulang: $("#tx_ulangEvent").val(),
                        starttime: $("#dt_startclockEvent").val(),
                        endtime: $("#dt_endclockEvent").val(),
                        kategori: $("#tx_kategoriEvent").val(),
                        //start_date: kendo.parseDate($("#dt_startEvent").val(), "yyyy-dd-MM"),
                        start_date: $("#dt_startEvent").val(),
                        end_dates: $("#dt_endEvent").val(),
                        iscoe: 1,
                        locationid: $("#dd_location").val(),
                        is_use_qr_code: $("#chk_qr").val(),
                        is_use_location: $("#chk_loc").val(),
                        attendees: $("#ms_karyawan").val(),
                        nama_group: $("#tx_namaGroup").val()
                    }
                    $.ajax({
                        type: "POST",
                        url: $("#hd_path").val() + "/CreateEvent/InsertEventonce",
                        contentType: "application/json",
                        data: JSON.stringify(obj),
                        success: function (response) {
                            if (response.status == true) {
                                if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                    $("#alert").empty();
                                    $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4>' + response.remark + '</h4></label>');
                                    popupaction.data("kendoWindow").open();
                                }
                                else {
                                    $("#alertdone").empty();
                                    $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.remark + '</h4></label>');
                                    popupactiondone.data("kendoWindow").open();
                                }                               
                            } else {
                                //alert(response.error);
                                $("#alertdone").empty();
                                $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.error + '</h4></label>');
                                popupactiondone.data("kendoWindow").open();

                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                        }
                    });
                }
            }
            else if ($("#dt_startclockEvent").val() == $("#dt_endclockEvent").val() || $("#dt_startclockEvent").val() > $("#dt_endclockEvent").val()) {
                //alert(startDay + " DAN " + endNewDate);
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu Pengadaan Event tidak boleh lebih dari waktu berakhir event atau sama dengan berakhir event </h4></label>');
                popupaction.data("kendoWindow").open();
            }
            
            else {
                var obj = {
                    name: $("#tx_namaEvent").val(),
                    description: $("#tx_deskEvent").val(),
                    link: $("#tx_addLink").val(),
                    distrik: $("#tx_distrikEvent").val(),
                    departement: $("#tx_deptEvent").val(),
                    ulang: $("#tx_ulangEvent").val(),
                    starttime: $("#dt_startclockEvent").val(),
                    endtime: $("#dt_endclockEvent").val(),
                    kategori: $("#tx_kategoriEvent").val(),
                    //start_date: kendo.parseDate($("#dt_startEvent").val(), "yyyy-dd-MM"),
                    start_date: $("#dt_startEvent").val(),
                    end_dates: $("#dt_endEvent").val(),
                    iscoe: 1,
                    locationid: $("#dd_location").val(),
                    is_use_qr_code: $("#chk_qr").val(),
                    is_use_location: $("#chk_loc").val(),
                    attendees: $("#ms_karyawan").val(),
                    nama_group: $("#tx_namaGroup").val()
                }
                $.ajax({
                    type: "POST",
                    url: $("#hd_path").val() + "/CreateEvent/InsertEventonce",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        if (response.status == true) {
                            if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                $("#alert").empty();
                                $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4>' + response.remark + '</h4></label>');
                                popupaction.data("kendoWindow").open();
                            }
                            else {
                                $("#alertdone").empty();
                                $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.remark + '</h4></label>');
                                popupactiondone.data("kendoWindow").open();
                            }
                        } else {
                            //alert(response.error);
                            $("#alertdone").empty();
                            $("#alertdone").append('<label style="margin-left:0%; margin-top:5%; text-align: center"><h4>' + response.error + '</h4></label>');
                            popupactiondone.data("kendoWindow").open();

                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            }          
        }
    }
}

function get_dsk(distrik) {
    //var distrik = viewModel.get("District");

    $("#tx_deptEvent").show();

    $("#tx_deptEvent").kendoDropDownList({
        optionLabel: "Pilih Departement",
        dataTextField: "DEPT_DESC",
        dataValueField: "DEPT_CODE",
        dataSource:
           {
               type: "json",
               transport:
                   {
                       read:
                           {
                               url: "/CreateEvent/AjaxDepartement?distrik=" + distrik,
                               contentType: "application/json",
                               type: "POST",
                               cache: false
                           }
                   },
               schema:
                   {
                       data: "Data",
                       total: "Total"
                   }
           }
    });
}

$("#tx_distrikEvent").kendoDropDownList({
    optionLabel: "Pilih Distrik",
    dataTextField: "DSTRCT_CODE",
    dataValueField: "DSTRCT_CODE",
    dataSource:
       {
           type: "json",
           transport:
               {
                   read:
                       {
                           url: "/CreateEvent/AjaxDistrik",
                           contentType: "application/json",
                           type: "POST",
                           cache: false
                       }
               },
           schema:
               {
                   data: "Data",
                   total: "Total"
               }
       },
    select: function (e) {
        //debugger
        var dataItem = this.dataItem(e.item.index() + 1);        
        get_dsk(dataItem.DSTRCT_CODE);

    }
});

popupaction = $("#window").kendoWindow({
    actions: [],
    draggable: true,
    modal: true,
    pinned: false,
    visible: false,
    scrollable: false,
    position: {
        top: 550,
        left: 500
    },
    close: function (e) {

    },
    height: "210px",
    width: "350px",
    resizable: false,
});

popupactiondone = $("#windowdone").kendoWindow({
    actions: [],
    draggable: true,
    modal: true,
    pinned: false,
    visible: false,
    scrollable: false,
    position: {
        top: 550,
        left: 500
    },
    close: function (e) {

    },
    height: "210px",
    width: "350px",
    resizable: false,
});

function closepop() {
    popupaction.data("kendoWindow").close();
}

function closepopdone() {
    popupactiondone.data("kendoWindow").close();
    window.location = "/CreateEvent/Index";
}

$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); }
});

