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
    start_date: "",
    end_date: "",
    location_id: "",
    is_use_qr_code: 0,
    is_use_location: 0,
    attendees: [],
    nama_group: [],
    val: true,
});
    //debugger
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
        }
        else if ($("#tx_ulangEvent").val() == 2) {
            viewModel.set("val", false);
        }
        else if ($("#tx_ulangEvent").val() == 3) {
            viewModel.set("val", false);
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

    //UNTUK BIND DATA KETIKA EDIT   
    var arrG = [];
    var arrP = [];
    var bindMS = $("#ms_karyawan").data("kendoMultiSelect");
    var bindMSG = $("#tx_namaGroup").data("kendoMultiSelect");

    $.ajax({
        type: "GET",
        url: $("#hd_path").val() + "/CreateEvent/AjaxReadEvent?id=" + $("#hd_id").val(),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            if (response.status) {
                //console.log(response.data);              
                //debugger
                viewModel.set("event_id", response.data.event_id);
                viewModel.set("name", response.data.name);
                viewModel.set("District", response.data.distrik);
                viewModel.set("departement", response.data.departement);
                viewModel.set("katergori", response.data.kategori)
                viewModel.set("ulang", response.data.ulang);
                viewModel.set("description", response.data.description);
                viewModel.set("start_date", kendo.parseDate(kendo.toString(response.data.start_date, "dd/MM/yyyy")));
                viewModel.set("end_date", kendo.parseDate(kendo.toString(response.data.end_dates, "dd/MM/yyyy")));
                viewModel.set("location_id", response.data.location_id);
                viewModel.set("is_use_qr_code", response.data.is_use_qr_code);
                viewModel.set("is_use_location", response.data.is_use_location);
                viewModel.set("endclock_date", kendo.parseDate(kendo.toString(response.data.endtime, "HH:mm")));
                viewModel.set("startclock_date", kendo.parseDate(kendo.toString(response.data.start_date, "HH:mm")))

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

                //viewModel.set("attendees", response.data.attendees);
                //viewModel.set("nama_group", response.data.nama_group);                

            } else {
                //alert(response.error)
                $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
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

function update() {

    if ($("#ms_karyawan").val() == "" || $("#ms_karyawan").val() == null &&
       $("#tx_namaGroup").val() == "" || $("#tx_namaGroup").val() == null) {
        //alert("Mohon isi Nama Group atau Nama Peserta");
        $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4> Mohon isi nama group atau nama peserta </h4></label>');
        popupaction.data("kendoWindow").open();
    }
    else {
        if ($("#tx_ulangEvent").val() == 3) {
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
                var obj = {
                    name: $("#tx_namaEvent").val(),
                    description: $("#tx_deskEvent").val(),
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
                        if (response.status) {
                            //alert(response.remark)
                            $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                            popupaction.data("kendoWindow").open();
                        } else {
                            //alert(response.error)
                            $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
                            popupaction.data("kendoWindow").open();
                        }
                        //location.reload();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            }
        }
        else if ($("#tx_ulangEvent").val() == 2) {
            var startDay = new Date(convertDate($("#dt_startEvent").val(), "year"), convertDate($("#dt_startEvent").val(), "month"), convertDate($("#dt_startEvent").val(), "day"));
            var endDay = new Date(convertDate($("#dt_endEvent").val(), "year"), convertDate($("#dt_endEvent").val(), "month"), convertDate($("#dt_endEvent").val(), "day"));
            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            var millisBetween = endDay - startDay;
            var days = millisBetween / millisecondsPerDay;
            var val = (Math.floor(days));
            if (val == 0) {
                //alert("silahkan pilih tanggal akhir event minimal 1 hari setelah start date");
                $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4> Silahkan pilih tanggal akhir event minimal 1 hari setelah start date</h4></label>');
                popupaction.data("kendoWindow").open();
                $("#dt_endEvent").val("");
            }
            else {
                nilai = true;
                var obj = {
                    name: $("#tx_namaEvent").val(),
                    description: $("#tx_deskEvent").val(),
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
                        if (response.status) {
                            //alert(response.remark)
                            $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                            popupaction.data("kendoWindow").open();
                        } else {
                            //alert(response.error)
                            $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
                            popupaction.data("kendoWindow").open();
                        }
                        //location.reload();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            }
        }
        else if ($("#tx_ulangEvent").val() == 1) {
            var obj = {
                name: $("#tx_namaEvent").val(),
                description: $("#tx_deskEvent").val(),
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
                url: $("#hd_path").val() + "/CreateEvent/InsertEventonce",
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (response) {
                    if (response.status) {
                        //alert(response.remark)
                        $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                        popupaction.data("kendoWindow").open();
                    } else {
                       // alert(response.error)
                        $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
                        popupaction.data("kendoWindow").open();
                    }
                    location.reload();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        }
    }

    //YANG LAMA
    var obj = {
        event_id: $("#hd_id").val(),
        name: $("#tx_namaEvent").val(),
        description: $("#tx_deskEvent").val(),
        start_date: $("#dt_startEvent").val(),
        end_dates: $("#dt_endEvent").val(),
        location_id: $("#dd_location").val(),
        is_use_qr_code: $("#chqr").val(),
        is_use_location: $("#chloc").val(),
        attendees: $("#ms_karyawan").val(),
    }

    $.ajax({
        type: "POST",
        url: $("#hd_path").val() + "/CreateEvent/AjaxUpdateEvent",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function (response) {
            if (response.status) {
               // alert(response.remark)
                $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
                popupaction.data("kendoWindow").open();
            } else {
               // alert(response.error)
                $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
                popupaction.data("kendoWindow").open();
            }
            location.reload();

        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function isloc() {
    var checkBox = document.getElementById("chloc");
    if (checkBox.checked == true) {
        $("#chloc").val(true);
    } else {
        $("#chloc").val(false);
    }
}

function isqr() {
    var checkBox = document.getElementById("chqr");
    if (checkBox.checked == true) {
        $("#chqr").val(true);
    } else {
        $("#chqr").val(false);
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

$("#tx_kategoriEvent").kendoDropDownList
({
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
                           url: "/CreateEvent/AjaxDepartement",
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
    height: "150px",
    width: "350px",
    resizable: false,
});

function closepop() {
    popupaction.data("kendoWindow").close();
}
