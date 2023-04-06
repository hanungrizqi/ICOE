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
        nama_group: [],
        val: true,
        createby: "",
    });
    //debugger
    var required = $("#ms_karyawan").kendoMultiSelect({
        dataTextField: "NAME",
        dataValueField: "EMPLOYEE_ID",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#hd_path").val() + "/ListEvents/AjaxReadKaryawan",
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
        change: function () {
            // viewModel.set("attendees",this.value())
        }
    }).data("kendoMultiSelect");

    var req = $("#tx_namaGroup").kendoMultiSelect({
        dataTextField: "group_name",
        dataValueField: "group_id",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#hd_path").val() + "/ListEvents/AjaxGroup",
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
    })

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

    //$("#btn_update").click(function () {
    //    update();
    //    console.log(JSON.stringify(viewModel))
    //});

    $("#dd_location").kendoDropDownList({
        //filter: "startswith",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: $("#hd_path").val() + "/ListEvents/AjaxReadLocation",
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

    //UNTUK BIND DATA KETIKA BUKA HALAMAN   
    var arrG = [];
    var arrP = [];
    var bindMS = $("#ms_karyawan").data("kendoMultiSelect");
    var bindMSG = $("#tx_namaGroup").data("kendoMultiSelect");
    $.ajax({
        type: "GET",
        url: "/ListEvents/ajaxreadevents?idH=" + $("#idHeader").val(),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            if (response.status) {
                //debugger
                    
                $("#idHeader").val(response.data.eventH_id);
                //viewModel.set("event_id", response.data.event_id);
                viewModel.set("name", response.data.name);
                viewModel.set("District", response.data.distrik);
                viewModel.set("departement", response.data.departement);
                viewModel.set("katergori", response.data.kategori)
                viewModel.set("ulang", response.data.ulang);
                viewModel.set("createby", response.data.createby);

                if (response.data.ulang == 1) {
                    viewModel.set("val", true);
                    $("#dt_endEvent").val("");
                }
                else if (response.data.ulang == 2) {
                    viewModel.set("val", false);
                }
                else if (response.data.ulang == 3) {
                    viewModel.set("val", false);
                }

                viewModel.set("description", response.data.description);
                viewModel.set("link", response.data.link);
                viewModel.set("start_date", kendo.parseDate(kendo.toString(response.data.start_date, "dd/MM/yyyy")) );
                viewModel.set("end_date", kendo.parseDate(kendo.toString(response.data.end_dates, "dd/MM/yyyy")));
                viewModel.set("location_id", response.data.locationid);
                viewModel.set("is_use_qr_code", response.data.is_use_qr_code);
                viewModel.set("is_use_location", response.data.is_use_location);

                if (response.data.is_use_location == true) {
                    $("#chk_loc").val(true);
                }
                else{
                    $("#chk_loc").val(false);
                }

                if (response.data.is_use_qr_code == true) {
                    $("#chk_qr").val(true);
                }
                else {
                    $("#chk_qr").val(false);
                }
                
                viewModel.set("startclock_date", kendo.toString(kendo.parseDate(response.data.starttime, "HH:mm"), "HH:mm"))
                viewModel.set("endclock_date", kendo.toString(kendo.parseDate(response.data.endtime, "HH:mm"), "HH:mm"));
               
                $.each(response.data.attendees, function (key, item) {
                    //debugger;
                    arrP.push(item);
                });
                bindMS.value(arrP);

                $.each(response.data.nama_group, function (key, item) {
                    //debugger;
                    arrG.push(item);
                });
                bindMSG.value(arrG);

                //$("#tx_deskEvent").attr('readonly', true);
                //$("#tx_namaEvent").attr('readonly', true);
                //$("#divDistrik").hide();
                //$("#divkategori").hide();
                //$("#divulang").hide();
                //$("#divdept").hide();
                //$("#namagroup").hide();
                //$("#divpeserta").hide();
                //viewModel.set("attendees", response.data.attendees);
                //viewModel.set("nama_group", response.data.nama_group);                

            } else {
                //alert(response.error)
                $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
                popupaction.data("kendoWindow").open();
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
        }

    });

    kendo.bind($("#form"), viewModel);
})

$("#dt_endEvent").kendoDatePicker({
    format: "yyyy-MM-dd",
})

//UNTUK UPDATE DATA
function simpan() {
    //debugger
    if (($("#ms_karyawan").val() == "" || $("#ms_karyawan").val() == null) && ($("#tx_namaGroup").val() == "" || $("#tx_namaGroup").val() == null)) {
        //alert("Mohon isi Nama Group atau Nama Peserta");
        $("#alert").empty();
        $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4> Mohon isi Nama Group atau Nama Peserta </h4></label>');
        popupaction.data("kendoWindow").open();        
    }
    else {
        if ($("#tx_ulangEvent").val() == 3) {

         if ($("#tx_namaEvent").val() == "" || $("#tx_namaEvent").val() == null || $("#tx_distrikEvent").val() == "" || $("#tx_distrikEvent").val() == null || $("#tx_kategoriEvent").val() == "" || $("#tx_kategoriEvent").val() == null || $("#tx_ulangEvent").val() == "" || $("#tx_ulangEvent").val() == null ||
                $("#tx_deptEvent").val() == "" || $("#tx_deptEvent").val() == null || $("#dt_startEvent").val() == "" || $("#dt_startEvent").val() == null || $("#dt_endEvent").val() == "" || $("#dt_endEvent").val() == null || $("#dt_startclockEvent").val() == "" || $("#dt_startclockEvent").val() == null ||
                $("#dt_endclockEvent").val() == "" || $("#dt_endclockEvent").val() == null || $("#dd_location").val() == "" || $("#dd_location").val() == null) {
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4> Mohon isi Field bertanda bintang merah yang masih kosong </h4></label>');
                popupaction.data("kendoWindow").open();
         }
         else {

             var abc = new Date();
             var abcday = abc.getUTCDate();
             var abcmonth = abc.getUTCMonth() + 1;
             var abcyear = abc.getUTCFullYear();
             var NewDate = new Date(abcyear + "," + abcmonth + "," + abcday);

             var nilai = true;
             var startDay = new Date(convertDate($("#dt_startEvent").val(), "year"), convertDate($("#dt_startEvent").val(), "month"), convertDate($("#dt_startEvent").val(), "day"));
             var endDay = new Date(convertDate($("#dt_endEvent").val(), "year"), convertDate($("#dt_endEvent").val(), "month"), convertDate($("#dt_endEvent").val(), "day"));

             var millisecondsPerDay = 1000 * 60 * 60 * 24;
             var millisBetween = endDay - startDay;
             var days = millisBetween / millisecondsPerDay;
             var val = (Math.floor(days) % 7);                   

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

             if (val != 0) {
                 $("#alert").empty();
                 $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4> Silahkan pilih tanggal minimal 7 hari setelah tanggal mulai </h4></label>');
                 popupaction.data("kendoWindow").open();
                 //alert("silahkan pilih tanggal minimal 7 hari setelah tanggal mulai");
                 $("#dt_endEvent").val("");
                 nilai = false;
             }
             else if (startDay < NewDate) {
                 //alert(endNewDate);
                 $("#alert").empty();
                 $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center"><h4> Tidak dapat membuat event kurang dari tanggal hari ini </h4></label>');
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
                         eventH_id: $("#idHeader").val(),
                         createby: $("#cb").val(),
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
                         url: "/ListEvents/updateEventWeekly",
                         contentType: "application/json",
                         data: JSON.stringify(obj),
                         success: function (response) {
                             if (response.status == true) {
                                 if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                     $("#alert").empty();
                                     $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                     popupaction.data("kendoWindow").open();
                                 }
                                 else {
                                     $("#alertdone").empty();
                                     $("#alertdone").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                     popupactiondone.data("kendoWindow").open();
                                 }
                                
                             } else {
                                 //alert(response.error)
                                 $("#alert").empty();
                                 $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
                                 popupaction.data("kendoWindow").open();
                             }
                         },
                         error: function (jqXHR, textStatus, errorThrown) {
                         }
                     });
                 }
             }
             else if ($("#dt_startclockEvent").val() == $("#dt_endclockEvent").val() || $("#dt_startclockEvent").val() > $("#dt_endclockEvent").val()) {
                 $("#alert").empty();
                 $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu Pengadaan Event tidak boleh lebih dari waktu berakhir event atau sama dengan berakhir event </h4></label>');
                 popupaction.data("kendoWindow").open();
             }
             else {
                 nilai = true;
                 var obj = {
                     eventH_id: $("#idHeader").val(),
                     createby: $("#cb").val(),
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
                     url: "/ListEvents/updateEventWeekly",
                     contentType: "application/json",
                     data: JSON.stringify(obj),
                     success: function (response) {
                         if (response.status == true) {
                             if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                 $("#alert").empty();
                                 $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                 popupaction.data("kendoWindow").open();
                             }
                             else {
                                 $("#alertdone").empty();
                                 $("#alertdone").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                 popupactiondone.data("kendoWindow").open();
                             }
                         } else {
                             //alert(response.error)
                             $("#alert").empty();
                             $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
                             popupaction.data("kendoWindow").open();
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
                $("#dt_endclockEvent").val() == "" || $("#dt_endclockEvent").val() == null || $("#dd_location").val() == "" || $("#dd_location").val() == null) {
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4> Mohon isi Field bertanda bintang merah yang masih kosong </h4></label>');
                popupaction.data("kendoWindow").open();
            }            
            else {
                var abc = new Date();
                var abcday = abc.getUTCDate();
                var abcmonth = abc.getUTCMonth() + 1;
                var abcyear = abc.getUTCFullYear();
                var NewDate2 = new Date(abcyear + "," + abcmonth + "," + abcday);

                var startDay = new Date(convertDate($("#dt_startEvent").val(), "year"), convertDate($("#dt_startEvent").val(), "month"), convertDate($("#dt_startEvent").val(), "day"));
                var endDay = new Date(convertDate($("#dt_endEvent").val(), "year"), convertDate($("#dt_endEvent").val(), "month"), convertDate($("#dt_endEvent").val(), "day"));
                var millisecondsPerDay = 1000 * 60 * 60 * 24;
                var millisBetween = endDay - startDay;
                var days = millisBetween / millisecondsPerDay;
                var val = (Math.floor(days));

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

                if (val == 0 || startDay == endDay) {
                    //alert("silahkan pilih tanggal akhir event minimal 1 hari setelah tanggal mulai");
                    $("#alert").empty();
                    $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4> Silahkan pilih tanggal akhir event minimal 1 hari setelah tanggal mulai </h4></label>');
                    popupaction.data("kendoWindow").open();
                    $("#dt_endEvent").val("");
                }
                else if (startDay < NewDate2) {
                    //alert(endNewDate);
                    $("#alert").empty();
                    $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center"><h4> Tidak dapat membuat event kurang dari tanggal hari ini </h4></label>');
                    popupaction.data("kendoWindow").open();
                }
                else if (startDay > endDay) {
                    //alert(endNewDate);
                    $("#alert").empty();
                    $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center"><h4> Tidak dapat membuat event dengan tanggal lebih besar dari tanggal berakhir event </h4></label>');
                    popupaction.data("kendoWindow").open();
                }
                else if (startDay.toString() == NewDate2.toString()) {
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
                            eventH_id: $("#idHeader").val(),
                            createby: $("#cb").val(),
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
                            url: "/ListEvents/updateEventDaily",
                            contentType: "application/json",
                            data: JSON.stringify(obj),
                            success: function (response) {
                                if (response.status == true) {
                                    if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                        $("#alert").empty();
                                        $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                        popupaction.data("kendoWindow").open();
                                    }
                                    else {
                                        $("#alertdone").empty();
                                        $("#alertdone").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                        popupactiondone.data("kendoWindow").open();
                                    }

                                } else {
                                    //alert(response.error)
                                    $("#alert").empty();
                                    $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
                                    popupaction.data("kendoWindow").open();
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                            }
                        });
                    }
                }
                else if ($("#dt_startclockEvent").val() == $("#dt_endclockEvent").val() || $("#dt_startclockEvent").val() > $("#dt_endclockEvent").val() || startDay > endDay) {
                    $("#alert").empty();
                    $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu Pengadaan Event tidak boleh lebih dari waktu berakhir event atau sama dengan berakhir event </h4></label>');
                    popupaction.data("kendoWindow").open();
                }
                else {
                    nilai = true;
                    var obj = {
                        eventH_id: $("#idHeader").val(),
                        createby: $("#cb").val(),
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
                        url: "/ListEvents/updateEventDaily",
                        contentType: "application/json",
                        data: JSON.stringify(obj),
                        success: function (response) {
                            if (response.status == true) {
                                if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                    $("#alert").empty();
                                    $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                    popupaction.data("kendoWindow").open();
                                }
                                else {
                                    $("#alertdone").empty();
                                    $("#alertdone").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                    popupactiondone.data("kendoWindow").open();
                                }
                            } else {
                                //alert(response.error)
                                $("#alert").empty();
                                $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
                                popupaction.data("kendoWindow").open();
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
            var abcmonth = abc.getUTCMonth() + 1;
            var abcyear = abc.getUTCFullYear();
            var NewDate3 = new Date(abcyear + "," + abcmonth + "," + abcday);
            var startDay = new Date(convertDate($("#dt_startEvent").val(), "year"), convertDate($("#dt_startEvent").val(), "month"), convertDate($("#dt_startEvent").val(), "day"));

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

            if ($("#tx_namaEvent").val() == "" || $("#tx_namaEvent").val() == null || $("#tx_distrikEvent").val() == "" || $("#tx_distrikEvent").val() == null || $("#tx_kategoriEvent").val() == "" || $("#tx_kategoriEvent").val() == null || $("#tx_ulangEvent").val() == "" || $("#tx_ulangEvent").val() == null ||
                $("#tx_deptEvent").val() == "" || $("#tx_deptEvent").val() == null || $("#dt_startEvent").val() == "" || $("#dt_startEvent").val() == null || $("#dt_startclockEvent").val() == "" || $("#dt_startclockEvent").val() == null ||
                $("#dt_endclockEvent").val() == "" || $("#dt_endclockEvent").val() == null || $("#dt_endclockEvent").val() == "" || $("#dt_endclockEvent").val() == null || $("#dd_location").val() == "" || $("#dd_location").val() == null) {
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4> Mohon isi Field bertanda bintang merah yang masih kosong </h4></label>');
                popupaction.data("kendoWindow").open();
            }
            else if (startDay < NewDate3) {
                //alert(endNewDate);
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center"><h4> Tidak dapat membuat event kurang dari tanggal hari ini </h4></label>');
                popupaction.data("kendoWindow").open();
            }
            else if (startDay.toString() == NewDate3.toString()) {
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
                        eventH_id: $("#idHeader").val(),
                        createby: $("#cb").val(),
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
                        url: "/ListEvents/updateEventOnce",
                        contentType: "application/json",
                        data: JSON.stringify(obj),
                        success: function (response) {
                            if (response.status == true) {
                                if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                    $("#alert").empty();
                                    $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                    popupaction.data("kendoWindow").open();
                                }
                                else {
                                    $("#alertdone").empty();
                                    $("#alertdone").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                    popupactiondone.data("kendoWindow").open();
                                }

                            } else {
                                //alert(response.error)
                                $("#alert").empty();
                                $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
                                popupaction.data("kendoWindow").open();
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                        }
                    });
                }
            }
            else if ($("#dt_startclockEvent").val() == $("#dt_endclockEvent").val() || $("#dt_startclockEvent").val() > $("#dt_endclockEvent").val()) {
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:2%; text-align:center"><h4> Waktu Pengadaan Event tidak boleh lebih dari waktu berakhir event atau sama dengan berakhir event </h4></label>');
                popupaction.data("kendoWindow").open();
            }
            else {
                var obj = {
                    eventH_id: $("#idHeader").val(),
                    createby: $("#cb").val(),
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
                    url: "/ListEvents/updateEventOnce",
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (response) {
                        debugger
                            if (response.status == true) {
                                if (response.remark == "Tidak dapat membuat event karena terdapat event pada lokasi tersebut") {
                                    $("#alert").empty();
                                    $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                    popupaction.data("kendoWindow").open();
                                }
                                else {
                                    $("#alertdone").empty();
                                    $("#alertdone").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                                    popupactiondone.data("kendoWindow").open();
                                }

                            } else {
                                //alert(response.error)
                                $("#alert").empty();
                                $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
                                popupaction.data("kendoWindow").open();
                            }
                        },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            }          
        }
    }
    //if ($("#ms_karyawan").val() == "" || $("#ms_karyawan").val() == null &&
    //   $("#tx_namaGroup").val() == "" || $("#tx_namaGroup").val() == null) {
    //    alert("Mohon isi Nama Group atau Nama Peserta");
    //}    ////else {
    ////    if ($("#tx_ulangEvent").val() == 3) {
    ////        var nilai = true;
    ////        var startDay = new Date(convertDate($("#dt_startEvent").val(), "year"), convertDate($("#dt_startEvent").val(), "month"), convertDate($("#dt_startEvent").val(), "day"));
    ////        var endDay = new Date(convertDate($("#dt_endEvent").val(), "year"), convertDate($("#dt_endEvent").val(), "month"), convertDate($("#dt_endEvent").val(), "day"));
    ////        var millisecondsPerDay = 1000 * 60 * 60 * 24;
    ////        var millisBetween = endDay - startDay;
    ////        var days = millisBetween / millisecondsPerDay;
    ////        var val = (Math.floor(days) % 7);
    ////        if (val != 0) {
    ////            alert("silahkan pilih tanggal pada hari yang sama");
    ////            $("#dt_endEvent").val("");
    ////            nilai = false;
    ////        }
    ////        else {
    ////            nilai = true;
    ////            var obj = {
    ////                name: $("#tx_namaEvent").val(),
    ////                description: $("#tx_deskEvent").val(),
    ////                distrik: $("#tx_distrikEvent").val(),
    ////                departement: $("#tx_deptEvent").val(),
    ////                ulang: $("#tx_ulangEvent").val(),
    ////                starttime: $("#dt_startclockEvent").val().toString(),
    ////                endtime: $("#dt_endclockEvent").val(),
    ////                kategori: $("#tx_kategoriEvent").val(),
    ////                //start_date: kendo.parseDate($("#dt_startEvent").val(), "yyyy-dd-MM"),
    ////                start_date: $("#dt_startEvent").val(),
    ////                end_dates: $("#dt_endEvent").val(),
    ////                iscoe: 1,
    ////                locationid: $("#dd_location").val(),
    ////                is_use_qr_code: $("#chk_qr").val(),
    ////                is_use_location: $("#chk_loc").val(),
    ////                attendees: $("#ms_karyawan").val(),
    ////                nama_group: $("#tx_namaGroup").val()
    ////            }
    ////            $.ajax({
    ////                type: "POST",
    ////                url: $("#hd_path").val() + "/ListEvents/InsertEventNew",
    ////                contentType: "application/json",
    ////                data: JSON.stringify(obj),
    ////                success: function (response) {
    ////                    if (response.status) {
    ////                        alert(response.remark)
    ////                    } else {
    ////                        alert(response.error)
    ////                    }
    ////                    location.reload();
    ////                },
    ////                error: function (jqXHR, textStatus, errorThrown) {
    ////                }
    ////            });
    ////        }
    ////    }
    ////    else if ($("#tx_ulangEvent").val() == 2) {
    ////        var startDay = new Date(convertDate($("#dt_startEvent").val(), "year"), convertDate($("#dt_startEvent").val(), "month"), convertDate($("#dt_startEvent").val(), "day"));
    ////        var endDay = new Date(convertDate($("#dt_endEvent").val(), "year"), convertDate($("#dt_endEvent").val(), "month"), convertDate($("#dt_endEvent").val(), "day"));
    ////        var millisecondsPerDay = 1000 * 60 * 60 * 24;
    ////        var millisBetween = endDay - startDay;
    ////        var days = millisBetween / millisecondsPerDay;
    ////        var val = (Math.floor(days));
    ////        if (val == 0) {
    ////            alert("silahkan pilih tanggal akhir event minimal 1 hari setelah start date");
    ////            $("#dt_endEvent").val("");
    ////        }
    ////        else {
    ////            nilai = true;
    ////            var obj = {
    ////                name: $("#tx_namaEvent").val(),
    ////                description: $("#tx_deskEvent").val(),
    ////                distrik: $("#tx_distrikEvent").val(),
    ////                departement: $("#tx_deptEvent").val(),
    ////                ulang: $("#tx_ulangEvent").val(),
    ////                starttime: $("#dt_startclockEvent").val().toString(),
    ////                endtime: $("#dt_endclockEvent").val(),
    ////                kategori: $("#tx_kategoriEvent").val(),
    ////                //start_date: kendo.parseDate($("#dt_startEvent").val(), "yyyy-dd-MM"),
    ////                start_date: $("#dt_startEvent").val(),
    ////                end_dates: $("#dt_endEvent").val(),
    ////                iscoe: 1,
    ////                locationid: $("#dd_location").val(),
    ////                is_use_qr_code: $("#chk_qr").val(),
    ////                is_use_location: $("#chk_loc").val(),
    ////                attendees: $("#ms_karyawan").val(),
    ////                nama_group: $("#tx_namaGroup").val()
    ////            }
    ////            $.ajax({
    ////                type: "POST",
    ////                url: $("#hd_path").val() + "/CreateEvent/InsertEventDaily",
    ////                contentType: "application/json",
    ////                data: JSON.stringify(obj),
    ////                success: function (response) {
    ////                    if (response.status) {
    ////                        alert(response.remark)
    ////                    } else {
    ////                        alert(response.error)
    ////                    }
    ////                    location.reload();
    ////                },
    ////                error: function (jqXHR, textStatus, errorThrown) {
    ////                }
    ////            });
    ////        }
    ////    }
    ////    else if ($("#tx_ulangEvent").val() == 1) {
    ////        var obj = {
    ////            name: $("#tx_namaEvent").val(),
    ////            description: $("#tx_deskEvent").val(),
    ////            distrik: $("#tx_distrikEvent").val(),
    ////            departement: $("#tx_deptEvent").val(),
    ////            ulang: $("#tx_ulangEvent").val(),
    ////            starttime: $("#dt_startclockEvent").val().toString(),
    ////            endtime: $("#dt_endclockEvent").val(),
    ////            kategori: $("#tx_kategoriEvent").val(),
    ////            //start_date: kendo.parseDate($("#dt_startEvent").val(), "yyyy-dd-MM"),
    ////            start_date: $("#dt_startEvent").val(),
    ////            end_dates: $("#dt_endEvent").val(),
    ////            iscoe: 1,
    ////            locationid: $("#dd_location").val(),
    ////            is_use_qr_code: $("#chk_qr").val(),
    ////            is_use_location: $("#chk_loc").val(),
    ////            attendees: $("#ms_karyawan").val(),
    ////            nama_group: $("#tx_namaGroup").val()
    ////        }
    ////        $.ajax({
    ////            type: "POST",
    ////            url: $("#hd_path").val() + "/CreateEvent/InsertEventonce",
    ////            contentType: "application/json",
    ////            data: JSON.stringify(obj),
    ////            success: function (response) {
    ////                if (response.status) {
    ////                    alert(response.remark)
    ////                } else {
    ////                    alert(response.error)
    ////                }
    ////                location.reload();
    ////            },
    ////            error: function (jqXHR, textStatus, errorThrown) {
    ////            }
    ////        });
    ////    }
    ////}
    ////YANG LAMA
    //var obj = {
    //    eventH_id: $("#idHeader").val(),
    //    event_id: $("#hd_id").val(),
    //    name: $("#tx_namaEvent").val(),
    //    description: $("#tx_deskEvent").val(),
    //    start_date: $("#dt_startEvent").val(),
    //    end_dates: $("#dt_endEvent").val(),
    //    starttime: $("#dt_startclockEvent").val(),
    //    endtime: $("#dt_endclockEvent").val(),
    //    locationid: $("#dd_location").val(),
    //    is_use_qr_code: $("#chk_qr").val(),
    //    is_use_location: $("#chk_loc").val(),
    //}
    //$.ajax({
    //    type: "POST",
    //    url: $("#hd_path").val() + "/ListEvents/updateEVDetail",
    //    contentType: "application/json",
    //    data: JSON.stringify(obj),
    //    success: function (response) {
    //        if (response.status) {
    //            alert(response.remark);
    //        } else {
    //            alert(response.error);
    //        }
    //        location.reload();
    //    },
    //    error: function (jqXHR, textStatus, errorThrown) {
    //    }
    //});
}

function isloc() {
    //debugger
    var checkBox = document.getElementById("chk_loc");
    if (checkBox.checked == true) {
        $("#chk_loc").val(true);
    } else {
        $("#chk_loc").val(false);
    }
}

function isqr() {
    //debugger
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
        //alert("silahkan pilih tanggal pada hari yang sama");
        $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4> Silahkan pilih tanggal pada hari yang sama </h4></label>');
        popupaction.data("kendoWindow").open();
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
        result = parseInt(date.substring(5, 7) - 1)
        //alert(result);
    } else if (s == "year") {
        result = parseInt(date.substring(0, 4))
    } else {
        result = "";
    }
    return result;
};

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
                           url: "/ListEvents/AjaxKategori",
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
                           url: "/ListEvents/AjaxDepartement",
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
                               url: "/ListEvents/AjaxDepartement?distrik=" + distrik,
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
                           url: "/ListEvents/AjaxDistrik",
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
    height: "150px",
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
    height: "150px",
    width: "350px",
    resizable: false,
});

function closepop() {
    popupaction.data("kendoWindow").close();
}

function closepopdone() {
    popupactiondone.data("kendoWindow").close();
    window.reload();
}

$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); }
});

