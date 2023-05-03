var ViewModel;
let jumlah_peserta = 0;

$(document).ready(function () {
    ViewModel = kendo.observable({

        event_id: "",
        start_date: "",
        end_date: "",
        evid: "",

        tahun: "",
        site: "",
        dept: "",
        kategori: "",

        people: "",

        ds_list: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/AbsensiEvent/AjaxRead",
                    contentType: "application/json",
                    type: "POST",
                    data: {},
                    cache: false
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "event_id",
                    fields: {
                        start_date: { type: "string" }
                    }
                }

            },
            pageSize: 24,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true
            //,
            //filter: { field: "DISTRICT", operator: "startswith", value: $("#txt_SITE").val() }

        }),

        ds_allEvent: new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/AbsensiEvent/AjaxReadHeadFilter",
                    //contentType: "application/json",
                    type: "POST",
                    dataType: "json",
                    data: [{
                        tahun: "",
                        site: "",
                        dept: "",
                        kategori: ""
                    }],
                    cache: false,
                    complete: function (response) {
                        //debugger                       
                    }
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "event_header_id",
                    fields: {
                        start_date: { type: "string" }
                    }
                }

            },
            pageSize: 24,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true
            //,
            //filter: { field: "DISTRICT", operator: "startswith", value: $("#txt_SITE").val() }

        }),

        searchingFilter: function () {
            // debugger
            var model = viewModel.get();
            var obj = {
                tahun: model.tahun,
                site: model.site,
                dept: model.dept,
                kategori: model.kategori
            }

            $.ajax({
                url: "/AbsensiEvent/AjaxReadHeadFilter",
                //contentType: "application/json",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(obj),
                cache: false,
                success: function (response) {
                    //debugger
                    if (response.status == true) {

                        $.each(response.Data, function (key, item) {
                            //debugger;
                            $("#resultFilter").append('<div class="col-sm-4">' +
                                ' <div class="card card-price"> ' +
                                '  <div class="card-img">   ' +
                                '  <img src="../Content/img/meeting.PNG" class="img-responsive"> ' +
                                '  <div class="card-caption"> ' +
                                '  <span class="h5">' + response.Data.name + '</span> ' +
                                '   <p>Open</p> ' +
                                '  </div> ' +
                                ' </div> ' +
                                '  <div class="card-body"> ' +
                                '  <div class="lead">Deskripsi</div> ' +
                                '  <ul class="details"> ' +
                                '<li>' + response.Data.description + '</li>' +
                                '<li>' + response.Data.status_ulang + '</li>' +
                                '</ul>' +
                                '  <table class="table"> ' +
                                '<tr><td>Mulai</td><td class="price"></td><td class="note">' + response.Data.start_date_mod + ' ' + response.Data.start_time_mode + '</td></tr>' +
                                '<tr><td>Selesai</td><td class="price"></td><td class="note">' + response.Data.end_date_mod + ' ' + response.Data.end_time_mode + '</td></tr>' +
                                '<tr><td>Lokasi</td><td class="price"></td><td class="note">' + response.Data.location_name + '</td></tr>' +
                                ' </table>' +
                                ' <a :href="\'../QRCodeAtt/Index?evH=\'' + response.Data.event_header_id + '\'&name=\'' + response.Data.name + '\'" class="btn btn-primary btn-lg btn-block buy-now">ENTER <span class="glyphicon glyphicon-triangle-right"></span>' +
                                ' </a>' +
                                '</div>' +
                                '</div>' +
                                ' </div>'

                            );
                        });
                    }
                }
            })

        }
    })
    kendo.bind($("#toAll"), ViewModel);
    debugger

    $("#defaultOpen").click();

    loadPeople(getParameterByName("event_id"));
    loadGrid(getParameterByName("event_id"));

    loadPeople2(getParameterByName("event_id"));
    loadGrid2(getParameterByName("event_id"));

    //loadPeople3(getParameterByName("event_id"));
    //loadGrid3(getParameterByName("event_id"));

    var qrcode = new QRCode("qrcode", {
        text: "KPP",
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    qrcode.clear(); // clear the code.
    qrcode.makeCode(getParameterByName("event_id"));

    dates();

    $("#h_name").text(getParameterByName("name"));

    $("#listView").kendoListView({
        dataSource: ViewModel.ds_list,

        template: kendo.template($("#templatelist").html())
    });

    $("#pager").kendoPager({
        //dataSource: dataSource
    });

});

//setInterval(function () {
//    loadGrid(); //refresh grid tiap 30 detik      
//}, 10000);

//setInterval(function () {
//    loadPeople(getParameterByName("event_id")); //refresh grid tiap 30 detik      
//}, 10000);

$("#tabstrip").kendoTabStrip({
    animation: {
        open: {
            effects: "fadeIn"
        }
    }
});

function loadGrid() {
    $("#grid").empty();
    var grid = $("#grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/AbsensiEvent/AjaxReadsAtt?event_id=" + $("#hd_idev").val(),
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
                    id: "NRP",
                    fields: {
                        NRP: { type: "string", filterable: true, sortable: true, editable: false },
                        NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        DEPT: { type: "string", filterable: true, sortable: true, editable: false },
                        time_create: { type: "string", filterable: true, sortable: true, editable: false },
                        date_create_mod: { type: "string", filterable: true, sortable: true, editable: false },
                    }

                }
            }
        },
        height: 800,
        filterable: true,
        sortable: true,
        pageable: true,
        resizable: true,
        // groupable: true,
        pageable: {
            refresh: false,
            buttonCount: 10,
            input: true,
            pageSizes: [100, 1000, 100000],
            info: true,
            messages: {
            }
        },
        //  editable: "inline",
        //toolbar: [
        //  {
        //      name: "excel",
        //      imageClass: '<button type="button" button id="btn_export" class="btn btn-info"><span class="glyphicon glyphicon-export"></span> Export</button>'
        //  }, ],
        //excel: {
        //    fileName: "upload_absen_failed.xlsx",
        //    AllPages: true
        //    // filterable: true
        //},

        columns: [
            //{
            //    title: "No",
            //    width: "20px",
            //    template: "#= ++rowNo #",
            //    filterable: false,

            //},
            { field: "NRP", title: "NRP", width: "50px" },
            { field: "NAME", title: "Nama", width: "100px" },
            { field: "DEPT", title: "Dept", width: "50px" },
            { field: "time_create", title: "Jam", width: "50px" },
            { field: "date_create_mod", title: "Tanggal", width: "50px" },


        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });


    var grid = $("#grid").data("kendoGrid");
    grid.dataSource;

    debugger

    jumlah_peserta = grid.dataSource.total();

    //console.log(jumlah_peserta);

    $("#sp_total_peserta").val(jumlah_peserta);
}

function loadGrid2() {
    $("#grid2").empty();
    var grid2 = $("#grid2").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/AbsensiEvent/AjaxReadsDef?event_id=" + $("#hd_idev").val(),
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
                    id: "NRP",
                    fields: {
                        NRP: { type: "string", filterable: true, sortable: true, editable: false },
                        NAME: { type: "string", filterable: true, sortable: true, editable: false },
                        DEPT: { type: "string", filterable: true, sortable: true, editable: false },
                        time_create: { type: "string", filterable: true, sortable: true, editable: false },
                        date_create_mod: { type: "string", filterable: true, sortable: true, editable: false },
                    }

                }
            }
        },
        height: 800,
        filterable: true,
        sortable: true,
        pageable: true,
        resizable: true,
        // groupable: true,
        pageable: {
            refresh: false,
            buttonCount: 10,
            input: true,
            pageSizes: [100, 1000, 100000],
            info: true,
            messages: {
            }
        },
        //  editable: "inline",
        //toolbar: [
        //  {
        //      name: "excel",
        //      imageClass: '<button type="button" button id="btn_export" class="btn btn-info"><span class="glyphicon glyphicon-export"></span> Export</button>'
        //  }, ],
        //excel: {
        //    fileName: "upload_absen_failed.xlsx",
        //    AllPages: true
        //    // filterable: true
        //},

        columns: [
            //{
            //    title: "No",
            //    width: "20px",
            //    template: "#= ++rowNo #",
            //    filterable: false,

            //},
            { field: "NRP", title: "NRP", width: "50px" },
            { field: "NAME", title: "Nama", width: "100px" },
            { field: "DEPT", title: "Dept", width: "50px" },
            { field: "time_create", title: "Jam", width: "50px" },
            { field: "date_create_mod", title: "Tanggal", width: "50px" },


        ],
        dataBinding: function () {
            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
    });


    var grid2 = $("#grid2").data("kendoGrid");
    grid2.dataSource;

    debugger

    jumlah_peserta = grid2.dataSource.total();

    //console.log(jumlah_peserta);

    $("#sp_total_peserta2").val(jumlah_peserta);
}

//function loadGrid3() {
//    $("#grid3").empty();
//    var grid2 = $("#grid3").kendoGrid({
//        dataSource: {
//            type: "json",
//            transport: {
//                read: {
//                    url: "/AbsensiEvent/AjaxReadsTent?event_id=" + $("#hd_idev").val(),
//                    contentType: "application/json",
//                    type: "POST",
//                    cache: false,
//                },

//                parameterMap: function (data, operation) {

//                    return kendo.stringify(data)

//                }
//            },
//            pageSize: 100,
//            serverPaging: true,
//            serverFiltering: true,
//            serverSorting: true,
//            schema: {
//                data: "Data",
//                total: "Total",
//                model: {
//                    id: "NRP",
//                    fields: {
//                        NRP: { type: "string", filterable: true, sortable: true, editable: false },
//                        NAME: { type: "string", filterable: true, sortable: true, editable: false },
//                        DEPT: { type: "string", filterable: true, sortable: true, editable: false },
//                        time_create: { type: "string", filterable: true, sortable: true, editable: false },
//                        date_create_mod: { type: "string", filterable: true, sortable: true, editable: false },
//                    }

//                }
//            }
//        },
//        height: 800,
//        filterable: true,
//        sortable: true,
//        pageable: true,
//        resizable: true,
//        // groupable: true,
//        pageable: {
//            refresh: false,
//            buttonCount: 10,
//            input: true,
//            pageSizes: [100, 1000, 100000],
//            info: true,
//            messages: {
//            }
//        },
//        //  editable: "inline",
//        //toolbar: [
//        //  {
//        //      name: "excel",
//        //      imageClass: '<button type="button" button id="btn_export" class="btn btn-info"><span class="glyphicon glyphicon-export"></span> Export</button>'
//        //  }, ],
//        //excel: {
//        //    fileName: "upload_absen_failed.xlsx",
//        //    AllPages: true
//        //    // filterable: true
//        //},

//        columns: [
//            //{
//            //    title: "No",
//            //    width: "20px",
//            //    template: "#= ++rowNo #",
//            //    filterable: false,

//            //},
//            { field: "NRP", title: "NRP", width: "50px" },
//            { field: "NAME", title: "Nama", width: "100px" },
//            { field: "DEPT", title: "Dept", width: "50px" },
//            { field: "time_create", title: "Jam", width: "50px" },
//            { field: "date_create_mod", title: "Tanggal", width: "50px" },


//        ],
//        dataBinding: function () {
//            window.rowNo = (this.dataSource.page() - 1) * this.dataSource.pageSize();
//        }
//    });


//    var grid3 = $("#grid3").data("kendoGrid");
//    grid2.dataSource;

//    debugger

//    jumlah_peserta = grid3.dataSource.total();

//    //console.log(jumlah_peserta);

//    $("#sp_total_peserta3").val(jumlah_peserta);
//}

function loadPeople(event_id) {
    $.ajax({
        type: "GET",
        url: "/QRCodeAtt/get_atthadir?s_str_event_id=" + event_id,
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            //debugger
            if (response.status == true) {
                $("#sp_total_peserta").val("");
                //console.log(response.Data.att_hadir);
                //jumlah_peserta = response.Data.att_hadir;
                //$("#sp_total_peserta").val(jumlah_peserta);
                if (response && response.Data && response.Data.att_hadir) {
                    jumlah_peserta = response.Data.att_hadir;
                    $("#sp_total_peserta").val(jumlah_peserta);
                }
            }
        }
    })
}

function loadPeople2(event_id) {
    $.ajax({
        type: "GET",
        url: "/QRCodeAtt/get_atttdkhadir?s_str_event_id=" + event_id,
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            //debugger
            if (response.status == true) {
                $("#sp_total_peserta2").val("");
                //console.log(response.Data.att_hadir);
                //jumlah_peserta = response.Data.att_hadir;
                //$("#sp_total_peserta2").val(jumlah_peserta);
                if (response && response.Data && response.Data.att_hadir) {
                    jumlah_peserta = response.Data.att_hadir;
                    $("#sp_total_peserta2").val(jumlah_peserta);
                }
            }
        }
    })
}

//function loadPeople3(event_id) {
//    $.ajax({
//        type: "GET",
//        url: "/QRCodeAtt/get_atttent?s_str_event_id=" + event_id,
//        contentType: "application/json",
//        dataType: "json",
//        success: function (response) {
//            //debugger
//            if (response.status == true) {
//                $("#sp_total_peserta3").val("");
//                //console.log(response.Data.att_hadir);
//                //jumlah_peserta = response.Data.att_hadir;
//                //$("#sp_total_peserta3").val(jumlah_peserta);
//                if (response && response.Data && response.Data.att_hadir) {
//                    jumlah_peserta = response.Data.att_hadir;
//                    $("#sp_total_peserta3").val(jumlah_peserta);
//                }
//            }
//        }
//    })
//}

function getParameterByName(name, url) {
    //debugger
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function dates() {
    //bind datenya
    //debugger
    $.ajax({
        type: "GET",
        url: "/AbsensiEvent/AjaxReadDate?evid=" + $("#hd_idev").val(),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            //debugger
            if (response.status == true) {
                //console.log(kendo.toString(kendo.parseDate(response.Data.start_date, "dd/MM/yyyy"), "dd/MM/yyyy"));
                $("#dt_startEvent").val(kendo.toString(kendo.parseDate(response.Data.start_date, "dd/MM/yyyy"), "dd/MM/yyyy"));
                $("#dt_startEvent_show").val(kendo.toString(kendo.parseDate(response.Data.start_date, "dd/MM/yyyy HH:mm"), "dd/MM/yyyy HH:mm"));
                $("#dt_endEvent_show").val(kendo.toString(kendo.parseDate(response.Data.end_date, "dd/MM/yyyy HH:mm"), "HH:mm"));
            }
        }
    })
}

$("#dt_startEvent").kendoDatePicker({
    format: "dd/MM/yyyy"
});


$("#ddl_tahun").kendoDropDownList({
    optionLabel: "Pilih Tahun Event",
    dataSource: {
        type: "json",
        transport: {
            read: {
                url: "/AbsensiEvent/getYear",
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
    dataTextField: "Tahun",
    dataValueField: "Tahun",
    select: function (e) {
        //debugger
        var dataItem = this.dataItem(e.item.index() + 1);
        ViewModel.set("tahun", dataItem.Tahun);
    }
});

$("#ddl_site").kendoDropDownList({
    optionLabel: "Pilih Event Site",
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

        if (dataItem.DSTRCT_CODE == "ALL") {
            ViewModel.set("site", "");
        }
        else {
            ViewModel.set("site", dataItem.DSTRCT_CODE);
        }
    }
});

$("#ddl_dept").kendoDropDownList({
    optionLabel: "Pilih Event Departement",
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
                url: "/AbsensiEvent/AjaxDepartement",
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
        var dataItem = this.dataItem(e.item.index() + 1);
        ViewModel.set("dept", dataItem.DEPT_CODE);
    }
});

$("#ddl_kategori").kendoDropDownList({
    optionLabel: "Pilih Kategori Event",
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
    },
    select: function (e) {
        var dataItem = this.dataItem(e.item.index() + 1);
        ViewModel.set("kategori", dataItem.id_kategori);
    }
});

function search() {
    //debugger
    var model = ViewModel.get();
    var obj = {
        tahun: model.tahun,
        site: model.site,
        dept: model.dept,
        kategori: model.kategori
    }

    $.ajax({
        url: "/AbsensiEvent/AjaxReadHeadFilter",
        contentType: "application/json",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(obj),
        cache: false,
        success: function (response) {
            //debugger
            if (response.status == true) {

                $("#resultFilter").empty();
                if (response.Data == null || response.Data == "" || response.Data == 0 || response.Data == "0") {
                    $("#resultFilter").empty();
                    $("#resultFilter").append('<p style="margin-left:42%;"> TIDAK ADA EVENT YANG ANDA CARI </p>');
                }
                else {
                    $.each(response.Data, function (key, item) {
                        //debugger;
                        $("#resultFilter").append('<div class="col-sm-4">' +
                            ' <div class="card card-price"> ' +
                            '  <div class="card-img">   ' +
                            '  <img src="../Content/img/meeting.PNG" class="img-responsive"> ' +
                            '  <div class="card-caption"> ' +
                            '  <span class="h5">' + item.name + '</span> ' +
                            '   <p>Open</p> ' +
                            '  </div> ' +
                            ' </div> ' +
                            '  <div class="card-body"> ' +
                            '  <div class="lead">Deskripsi</div> ' +
                            '  <ul class="details"> ' +
                            '<li>' + item.description + '</li>' +
                            '<li>' + item.status_ulang + '</li>' +
                            '</ul>' +
                            '  <table class="table"> ' +
                            '<tr><td>Mulai</td><td class="price"></td><td class="note">' + item.start_date_mod + ' ' + item.start_time_mod + '</td></tr>' +
                            '<tr><td>Selesai</td><td class="price"></td><td class="note">' + item.end_date_mod + ' ' + item.end_time_mod + '</td></tr>' +
                            '<tr><td>Lokasi</td><td class="price"></td><td class="note">' + item.location_name + '</td></tr>' +
                            ' </table>' +
                            ' <a href="/QRCodeAtt/Index?evH=' + item.event_header_id + '&name=' + item.name + '" class="btn btn-primary btn-lg btn-block buy-now">ENTER <span class="glyphicon glyphicon-triangle-right"></span>' +
                            ' </a>' +
                            '</div>' +
                            '</div>' +
                            ' </div>'

                        );
                    });
                }
            }
        }
    })
}

function refreshgrid() {
    var idevent = $("#hd_idev").val();
    debugger
    loadGrid();
    loadPeople(idevent);
    loadGrid2();
    loadPeople2(idevent);
    //loadGrid3();
    /*loadPeople3(idevent);*/
}

function downloadabsen() {
    window.location.href = "http://10.14.101.101:8080/ReportServer_DMSPROD/Pages/ReportViewer.aspx?%2fICOEReport%2fmOk_Report&eventid=" + $("#hd_idev").val() + "&rs:Command=Render&rs:FORMAT=PDF";
}

function downloadabsenInstruktur() {
    window.location.href = "http://10.14.101.101:8080/ReportServer_DMSPROD/Pages/ReportViewer.aspx?%2fICOEReport%2fmOk_Instruktur_Report&eventid=" + $("#hd_idev").val() + "&rs:Command=Render&rs:FORMAT=excel";
}

$body = $("body");
$(document).on({
    ajaxStart: function () { $body.addClass("loading"); },
    ajaxStop: function () { $body.removeClass("loading"); }
});