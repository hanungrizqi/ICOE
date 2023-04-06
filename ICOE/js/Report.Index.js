var startdateevent;
var enddateevent;

$("#fm_grid").hide();

$(window).on('popstate', function (event) {
    //alert("pop");
});

$(document).ready(function () {

    ViewModel = kendo.observable({
        event_id: "",
        name: "",
        District: "",
        departement: "",
        katergori: "",
        startclock_dates: "",
        endclock_dates: "",
        ulang: "",
        description: "",
        start_date: "",
        end_date: "",
        location_id: "",
        location_name: "",
        is_use_qr_code: 0,
        is_use_location: 0,
        attendees: [],
        group_name: "",
        status: "",
        create_date: "",
        val: true,



        //ds_listEH: new kendo.data.DataSource({
        //    transport: {
        //        read: {
        //            url: "/ListEvents/read_ev_header",
        //            Data: {},
        //            contentType: "json",
        //            type: "POST",
        //            cache: false
        //        },
        //    },
        //    schema: {
        //        data: "Data",
        //        total: "Total",
        //        model: {
        //            id: "event_header_id",
        //            fields: {
        //                //event_id: { type: "string", editable: false, sortable: false },
        //                name: { type: "string", editable: true, sortable: false },
        //                location_name: { type: "string", editable: true, sortable: false },
        //                status: { type: "string", editable: false, sortable: false },
        //                start_date: { type: "string", editable: false, sortable: false },
        //                ulang: { type: "string", editable: false, sortable: false },
        //            }
        //        }
        //    },
        //    pageSize: 20
        //}),

        ddl_lokasi: function (container, options) { // options.field
            $('<input data-bind="value:' + options.field + '" />').appendTo(container).kendoDropDownList({
                valuePrimitive: true,
                dataSource: {
                    type: "json",
                    transport: {
                        read: {
                            url: "/ListEvents/AjaxReadLocation",
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
                optionLabel: "Pilih Lokasi",
            });
        },

        EditDetail: function (e) {           
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            //console.log( Date.parse( (kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-ddTHH:mm:sszzz"), "yyyy-MM-ddTHH:mm:sszzz"))) );

            if ((kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-ddTHH:mm:sszzz"), "yyyy-MM-ddTHH:mm:sszzz") > kendo.toString(kendo.parseDate(dataItem.start_date, "yyyy-MM-ddTHH:mm:sszzz"), "yyyy-MM-ddTHH:mm:sszzz")) || (kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-ddTHH:mm:sszzz"), "yyyy-MM-ddTHH:mm:sszzz") == kendo.toString(kendo.parseDate(dataItem.start_date, "yyyy-MM-ddTHH:mm:sszzz"), "yyyy-MM-ddTHH:mm:sszzz"))) {
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align: center;"><h4> anda tidak dapat melakukan perubahan event, karena event sedang berjalan atau event telah berakhir </h4></label>');
                pop.data("kendoWindow").open();
            }

            else {
                //debugger
                var arrP = [];
                var bindMS = $("#txm_peserta").data("kendoMultiSelect");
                var arrG = [];
                var bindMSG = $("#tx_namagroup").data("kendoMultiSelect");

                //bind pakai closest tr
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                $.ajax({
                    url: "/ListEvents/getEventData?id=" + dataItem.event_id,
                    Data: {},
                    dataType: "json",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    success: function (result) {
                        if (result.status == true) {
                            //debugger

                            //console.log(kendo.toString(kendo.parseDate(result.Data.start_date, "yyyy-MM-dd"), "yyyy-MM-dd"));
                            $("#evHeader").val(dataItem.event_header_id);
                            $("#event_id").val(result.Data.event_id);
                            $("#dt_startDate").val(kendo.toString(kendo.parseDate(result.Data.start_date, "yyyy-MM-dd"), "yyyy-MM-dd"));
                            $("#dt_endDate").val(kendo.toString(kendo.parseDate(result.Data.end_date, "yyyy-MM-dd"), "yyyy-MM-dd"));
                            $("#dt_startTime").val(kendo.toString(kendo.parseDate(result.Data.start_date, "HH:mm"), "HH:mm"));
                            $("#dt_endTime").val(kendo.toString(kendo.parseDate(result.Data.end_date, "HH:mm"), "HH:mm"));
                        }
                    }
                })

                //UNTUK MULTISELECT
                $.ajax({
                    url: "/ListEvents/getatt_Data?id=" + dataItem.event_id,
                    Data: {},
                    contentType: "json",
                    type: "POST",
                    cache: false,
                    success: function (result) {

                        if (result.status == true) {
                            //debugger
                            //console.log(result.Data);
                            $.each(result.Data.attendees, function (key, item) {
                                //debugger;
                                arrP.push(item);
                            });
                            bindMS.value(arrP);

                            $.each(result.Data.nama_group, function (key, item) {
                                //debugger;
                                arrG.push(item);
                            });
                            bindMSG.value(arrG);

                        }
                    }
                })        

                popupaction.data("kendoWindow").open();
                popupaction.data("kendoWindow").title("Edit Event Detail");
            }            
        },        

        EditEV: function (e) {
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            //console.log(kendo.toString(kendo.parseDate(dataItem.start_date, "yyyy-MM-dd"), "yyyy-MM-dd"));
            //console.log(kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd"));

            if ( ( kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd") > kendo.toString(kendo.parseDate(dataItem.start_date, "yyyy-MM-dd"), "yyyy-MM-dd") ) || ( kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd") == kendo.toString(kendo.parseDate(dataItem.start_date, "yyyy-MM-dd"), "yyyy-MM-dd") ) ) {
                //alert("anda tidak dapat melakukan perubahan event, karena event sedang berjalan atau event telah berakhir");
                 $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center;"><h4> anda tidak dapat melakukan perubahan event, karena event sedang berjalan atau event telah berakhir </h4></label>');
                pop.data("kendoWindow").open();
            } else {
                window.location = "/ListEvents/EditEvent?idH=" + dataItem.event_header_id;
            }          
        },

        DetailEvent: function (el) {
            //debugger
            var dataItem = this.dataItem($(el.currentTarget).closest("tr"));
            var obj = {
                event_id: dataItem.event_id,
                name: dataItem.name
            }
            window.location = "/AbsensiEvent/IndexQR?event_id=" + dataItem.event_id + "&name=" + dataItem.name;
        },

        deleted: function (elem) {
            //debugger
            var dataItem2 = this.dataItem($(elem.currentTarget).closest("tr"));

            if ((kendo.toString(kendo.parseDate(dataItem2.start_date, "yyyy-MM-dd"), "yyyy-MM-dd") < kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd") &&
                  kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd") < kendo.toString(kendo.parseDate(dataItem2.end_date, "yyyy-MM-dd"), "yyyy-MM-dd")) ||

                (kendo.toString(kendo.parseDate(dataItem2.start_date, "yyyy-MM-dd"), "yyyy-MM-dd") < kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd") &&
                  kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd") == kendo.toString(kendo.parseDate(dataItem2.end_date, "yyyy-MM-dd"), "yyyy-MM-dd")) ||

                (kendo.toString(kendo.parseDate(dataItem2.start_date, "yyyy-MM-dd"), "yyyy-MM-dd") == kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd") &&
                  kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd") < kendo.toString(kendo.parseDate(dataItem2.end_date, "yyyy-MM-dd"), "yyyy-MM-dd")) ||

                (kendo.toString(kendo.parseDate(dataItem2.start_date, "yyyy-MM-dd"), "yyyy-MM-dd") == kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd") &&
                  kendo.toString(kendo.parseDate(new Date(), "yyyy-MM-dd"), "yyyy-MM-dd") == kendo.toString(kendo.parseDate(dataItem2.end_date, "yyyy-MM-dd"), "yyyy-MM-dd"))
            ) {
                $("#alert").empty();
                $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align: center;"><h4> anda tidak dapat menghapus event, karena event sedang berjalan </h4></label>');
                pop.data("kendoWindow").open();
            }

            else {
                if (confirm("Apakah anda yakin ingin menghapus seluruh event?")) {
                    var dataItem = this.dataItem($(elem.currentTarget).closest("tr"));
                    var obj = {
                        event_header_id: dataItem.event_header_id
                    }
                    $.ajax({
                        url: "/ListEvents/deleteHeader?&evH=" + dataItem.event_header_id,
                        Data: JSON.stringify(obj),
                        contentType: "json",
                        type: "POST",
                        cache: false,
                        success: function (result) {
                            if (result.status == true) {
                                //alert(result.remarks);
                                $("#alert").empty();
                                $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center;"><h4> Event Berhasil dihapus Seluruhnya </h4></label>');
                                pop.data("kendoWindow").open();
                                ViewModel.ds_listEH.read();
                            }
                        }
                    })
                }
            }             
         },
    })

    kendo.bind($("#fm_grid"), ViewModel);

    search()

    //initialize();
})

//grid header
function initialize() {
    //debugger
    var element = $("#grid").kendoGrid({
        dataSource: ViewModel.ds_listEH,
        //height: 550,
        groupable: false,
        sortable: true,
        resizable: true,
        reorderable: false,
        pageable: true,
        filterable: true,
        columnMenu: false,
        detailTemplate: kendo.template($("#template").html()),
        detailInit: detailInit,
        //dataBound: function () {
        //    //this.expandRow(this.tbody.find("tr.k-master-row").first());
        //},
        columns: [
            //{
            //    //command: [{ name: 'edit-data', text: 'Edit' }], title: 'Action', width: 125 { name: 'edit-data', text: 'Edit', class: 'btn btn-default', click: ViewModel.EditEV }
            //    command: [
            //        { name: 'edit-data', text: 'Edit', class: 'btn btn-default', click: ViewModel.EditEV },
            //        { text: 'Delete', class: 'btn btn-default', click: ViewModel.deleted }
            //    ],
            //    title: 'Action', width: 150
            //},
            //{ field: 'event_id', title: 'EventID', width: 150 },
            {
                command: [
                    //{
                    //    name: 'Detail',
                    //    text: 'Detail',
                    //    class: 'btn btn-default',
                    //    onclick:
                            
                    //}
                ],
                title: 'Attendance',
                width: 150
            },
            { field: 'name', title: 'Event', width: 150 },
            {
                field: 'location_name',
                title: 'Lokasi',
                width: 150,
                editor: ViewModel.ddl_lokasi
            },
            {
                field: 'status',
                title: 'Status Event',
                width: 150,
                template: kendo.template($("#templateStatusHead").html())

            },
            {
                field: 'start_date',
                title: 'Start Date',
                width: 150,
                template: "#=kendo.toString(kendo.parseDate(start_date, 'yyyy-MM-dd'), 'yyyy-MM-dd')#"
            },
            {
                field: 'ulang',
                title: 'Ulang',
                width: 150,
                template: kendo.template($("#templateulang").html())
            },
        ],
        editable: "inline"
    });
}

//grid detail
function detailInit(elem) {
    var detailRow = elem.detailRow;

    detailRow.find(".tabstrip").kendoTabStrip({
        animation: {
            open: { effects: "fadeIn" }
        }
    });

    detailRow.find(".orders").kendoGrid({
        dataSource: {
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "event_id",
                    fields: {
                        name: { type: "string", editable: false, sortable: false },
                        location_name: { type: "string", editable: false, sortable: false },
                        description: { type: "string", editable: false, sortable: false },
                        start_date: { type: "string", editable: false, sortable: false },
                        end_date: { type: "string", editable: false, sortable: false },
                        status: { type: "string", editable: false, sortable: false },
                        count_attendee: { type: "string", editable: false, sortable: false },
                        att_hadir: { type: "string", editable: false, sortable: false }
                    }
                }
            },
            transport: {
                read: {
                    url: "/ListEvents/read_ev_detail?evh=" + elem.data.event_header_id,
                    data: {},
                    contentType: "json/application",
                    dataTyoe: "json",
                    type: "POST",
                    cache: false
                },
            },
            pageSize: 20
        },
        //height: 550,
        groupable: false,
        sortable: true,
        resizable: true,
        reorderable: false,
        pageable: true,
        filterable: true,
        columnMenu: false,
        columns: [
            {
                command: [
                    { name: 'Detail', text: 'Detail', class: 'btn btn-default', click: ViewModel.DetailEvent },
                    { name: 'Edit', text: 'Edit', class: 'btn btn-default', click: ViewModel.EditDetail }
                ],
                title: 'Action',
                width: 150
            },
            //{ field: "event_id", title: "Event ID", width: 150 },
            { field: 'name', title: 'Event', width: 150 },
            { field: 'location_name', title: 'Lokasi', width: 150 },
            {
                field: 'status',
                title: 'Status',
                width: 150,
                template: kendo.template($("#templateStatus").html())

            },
             { field: "description", title: "Deskripsi", width: 150 },
            {
                field: 'start_date',
                title: 'Start Date',
                width: 150,
                template: "#=kendo.toString(kendo.parseDate(start_date, 'yyyy-MM-dd'), 'yyyy-MM-dd')#"
            },
            {
                field: 'end_date',
                title: 'End Date',
                width: 150,
                template: "#=kendo.toString(kendo.parseDate(end_date, 'yyyy-MM-dd'), 'yyyy-MM-dd')#"
            },
            {
                field: 'ulang',
                title: 'Ulang',
                width: 150,
                template: kendo.template($("#templateulang").html())
            },
            { field: 'count_attendee', title: 'Jumlah Undangan', width: 150 },
            {
                field: 'att_hadir',
                title: 'Jumlah Hadir',
                width: 150,
                template: kendo.template($("#templateatt").html())
            },
        ],
        editable: "inline"
    }).data("kendoGrid");
}

popupaction = $("#popupedit").kendoWindow({
    actions: ["Minimize", "Maximize", "Close"],
    draggable: true,
    modal: true,
    pinned: false,
    visible: false,
    scrollable: true,
    position: {
        top: 100,
        left: 300
    },
    close: function (e) {

    },
    height: "500px",
    width: "800px",
    resizable: false,
    title: "Edit Event Detail"
});

$("#dt_startDate").kendoDatePicker({
    format: "yyyy-MM-dd",
    //value: new Date()
});
$("#dt_endDate").kendoDatePicker({
    format: "yyyy-MM-dd",
    //value: new Date()
});
$("#dt_startTime").kendoTimePicker({
    format: "HH:mm",
    dateInput: true,
    //value: new Date()
});
$("#dt_endTime").kendoTimePicker({
    format: "HH:mm",
    dateInput: true,
});
var required = $("#txm_peserta").kendoMultiSelect({
    dataTextField: "NAME",
    dataValueField: "EMPLOYEE_ID",
    dataSource: {
        type: "json",
        transport: {
            read: {
                url: "/ListEvents/AjaxReadKaryawan",
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
var req = $("#tx_namagroup").kendoMultiSelect({
    dataTextField: "group_name",
    dataValueField: "group_id",
    dataSource: {
        type: "json",
        transport: {
            read: {
                url: "/ListEvents/AjaxGroup",
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

function save() {

    var nilai = true;
    var abc = new Date();
    var abcday = abc.getUTCDate();
    var abcmonth = abc.getUTCMonth() + 1;
    var abcyear = abc.getUTCFullYear();
    var NewDate = new Date(abcyear + "," + abcmonth + "," + abcday);

    var startDay = new Date(convertDate($("#dt_startDate").val(), "year"), convertDate($("#dt_startDate").val(), "month"), convertDate($("#dt_startDate").val(), "day"));
    //var endDay = new Date(convertDate($("#dt_endDate").val(), "year"), convertDate($("#dt_endDate").val(), "month"), convertDate($("#dt_endDate").val(), "day")); 

    var st = ($("#dt_startTime").val() + ":00"); //11:30
    var et = ($("#dt_endTime").val() + ":00");
    var sd = $("#dt_startDate").val(); //Mon Mar 09 2020 Indochina GMT+7
    //var ed = $("#dt_endDate").val();

    //var stt = new Date("November 13, 2013 " + start_time);
    var times = new Date(sd + " " + st);
    var timee = new Date(sd + " " + et);
    var timestart = times.getTime();
    var timeend = timee.getTime();
    var ntime = abc.getTime();

    if (startDay < NewDate) {
        alert("tidak dapat mengubah event pada tanggal sebelum tanggal hari ini");
    }
    else if (startDay.toString() == NewDate.toString())
    {
        if (timestart < ntime || timestart == ntime) {            
            alert("Waktu Pengadaan Event tidak boleh kurang dari waktu saat ini atau sama dengan waktu saat ini");
        }
        else if (timeend == ntime || timeend < ntime) {
            alert("Waktu berakhir Event tidak boleh kurang dari waktu saat ini atau sama dengan waktu saat ini");
        }
        else if (timeend == timestart) {
            alert("Waktu berakhir Event tidak boleh sama dengan waktu saat mulai event");
        }
        else if (timestart > timeend) {
            alert("Waktu berakhir Event tidak boleh lebih kecil dari waktu mulai event");
        }
        else if ( ($("#tx_namagroup").val() == null || $("#tx_namagroup").val() == "") && ($("#txm_peserta").val() == null || $("#txm_peserta").val() == "") ) {
            alert("Mohon isi group atau peserta");
        }
        else {
            var obj = {
                eventH_id: $("#evHeader").val(),
                event_id: $("#event_id").val(),
                start_date: $("#dt_startDate").val(),
                starttime: $("#dt_startTime").val(),
                endtime: $("#dt_endTime").val(),
                nama_group: $('select#tx_namagroup').val(),
                attendees: $('select#txm_peserta').val()
            }
            //console.log(obj);
            $.ajax({
                url: "/ListEvents/updateEVDetail",
                data: JSON.stringify(obj),
                dataType: "json",
                contentType: "application/json",
                type: "POST",
                cache: false,
                success: function (result) {
                    if (result.status == true) {
                        popupaction.data("kendoWindow").close();
                        //alert(result.remark);
                       alert(result.remark);
                       ViewModel.ds_listEH.read();
                    }
                    else {
                        alert(result.error);
                    }
                }
            });
        }
    }
    else if (($("#tx_namagroup").val() == null || $("#tx_namagroup").val() == "") && ($("#txm_peserta").val() == null || $("#txm_peserta").val() == "")) {
        $("#alert").empty();
        $("#alert").append('<label style="margin-left:0%; margin-top:5%;"><h4> Mohon isi group atau peserta </h4></label>');
        popupaction.data("kendoWindow").open();
    }
    else if ($("#dt_startTime").val() > $("#dt_endTime").val() || $("#dt_startTime").val() == $("#dt_endTime").val()) {
        alert("Waktu Mulai event tidak boleh lebih besar atau sama dengan waktu berakhir event");
    }
    else {
        var obj = {
            eventH_id: $("#evHeader").val(),
            event_id: $("#event_id").val(),
            start_date: $("#dt_startDate").val(),
            starttime: $("#dt_startTime").val(),
            endtime: $("#dt_endTime").val(),
            nama_group: $('select#tx_namagroup').val(),
            attendees: $('select#txm_peserta').val()
        }
        //console.log(obj);
        $.ajax({
            url: "/ListEvents/updateEVDetail",
            data: JSON.stringify(obj),
            dataType: "json",
            contentType: "application/json",
            type: "POST",
            cache: false,
            success: function (result) {
                if (result.status == true) {
                    popupaction.data("kendoWindow").close();
                    //alert(result.remark);
                    $("#alert").empty();
                    $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center;"><h3>' + result.remark + '</h3></label>');
                    pop.data("kendoWindow").open();
                    //location.reload(true);
                    ViewModel.ds_listEH.read();
                }
                else {
                    //alert(result.remark);
                    $("#alert").empty();
                    $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align:center;"><h3>' + result.error + '</h3></label>');
                    pop.data("kendoWindow").open();
                }
            }
        });
    }
}

pop = $("#window").kendoWindow({
    actions: [],
    draggable: true,
    modal: true,
    pinned: false,
    visible: false,
    scrollable: false,
    position: {
        top: 200,
        left: 420
    },
    close: function (e) {

    },
    height: "200px",
    width: "500px",
    resizable: false,
});

function closepop() {
    pop.data("kendoWindow").close();;
}

$("#ddl_tahunstart").kendoDatePicker({
    format: "dd-MM-yyyy"
});

$("#ddl_tahunend").kendoDatePicker({
    format: "dd-MM-yyyy"
});

function search() {
   /* debugger*/
    $("#fm_grid").show();
    $("#grid").empty();
    var grid = $("#grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    //url: "/ListEvents/read_ev_header?starteventdate=" + $("#ddl_tahunstart").val() + "&endeventdate=" + $("#ddl_tahunend").val(),
                    url: "/ListEvents/read_ev_header",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data)
                }
            },
            pageSize: 100,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "event_header_id",
                    fields: {
                        name: { type: "string", editable: true, sortable: false },
                        location_name: { type: "string", editable: true, sortable: false },
                        status: { type: "string", editable: false, sortable: false },
                        start_date: { type: "string", editable: false, sortable: false },
                        ulang: { type: "string", editable: false, sortable: false },
                    }
                }
            }
        },
        groupable: false,
        sortable: true,
        resizable: true,
        reorderable: false,
        pageable: true,
        filterable: true,
        columnMenu: false,
        detailTemplate: kendo.template($("#template").html()),
        detailInit: detailInit,
        height: 800,
        filterable: true,
        sortable: true,
        resizable: true,
        pageable: {
            refresh: false,
            buttonCount: 10,
            input: true,
            pageSizes: [100, 1000, 100000],
            info: true,
            messages: {
            }
        },
        noRecords: true,
        columns: [
            //{
            //    //command: [{ name: 'edit-data', text: 'Edit' }], title: 'Action', width: 125 { name: 'edit-data', text: 'Edit', class: 'btn btn-default', click: ViewModel.EditEV }
            //    command: [
            //        { name: 'edit-data', text: 'Edit', class: 'btn btn-default', click: ViewModel.EditEV },
            //        { text: 'Delete', class: 'btn btn-default', click: ViewModel.deleted }
            //    ],
            //    title: 'Action', width: 150
            //},
            //{ field: 'event_id', title: 'EventID', width: 150 },
            {
                command: [
                    //{
                    //    name: 'Detail',
                    //    text: 'Detail',
                    //    class: 'btn btn-default',
                    //    onclick: function (e) {
                    //      var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                    //         // panggil function lain disini dengan menggunakan dataItem
                    //}
                            
                    //}
                ],
                title: 'Attendance',
                width: 150
            },
            { field: 'name', title: 'Event', width: 150 },
            {
                field: 'location_name',
                title: 'Lokasi',
                width: 150,
                editor: ViewModel.ddl_lokasi
            },
            {
                field: 'status',
                title: 'Status Event',
                width: 150,
                template: kendo.template($("#templateStatusHead").html())

            },
            {
                field: 'start_date',
                title: 'Start Date',
                width: 150,
                template: "#=kendo.toString(kendo.parseDate(start_date, 'yyyy-MM-dd'), 'yyyy-MM-dd')#"
            },
            {
                field: 'ulang',
                title: 'Ulang',
                width: 150,
                template: kendo.template($("#templateulang").html())
            },
        ],
        editable: "inline",
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });
    //var grid = $("#grid").data("kendoGrid").dataSource.read();
    //grid.dataSource;

    $("#ddl_tahunstart").val('');
    $("#ddl_tahunend").val('');

}



