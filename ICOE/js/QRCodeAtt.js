let jumlah_peserta = 0;
var event_id = "";

$(document).ready(function () {

    ViewModel = kendo.Observable({
        start_date: "",
        evid: "",
        eacheventid: "",
        people: ""
    });

    kendo.bind($("#toAll"), ViewModel);
   
    $("#h_name").text(getParameterByName("name"));
        
    loadGrid($("#eventid").val());
    loadPeople($("#eventid").val());    
    
        
    });

//setInterval(function () {
//    loadGrid(event_id); //refresh grid tiap 30 detik      
//}, 10000);

//setInterval(function () {
//    loadPeople(event_id); //refresh grid tiap 30 detik      
//}, 10000);

    function qrcode(ev) {
        //UNTUK QR CODE      

        $("#qrcode").html("");
        
        var qrcode = new QRCode("qrcode", {
            text: "KPP",
            width: 300,
            height: 300,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        qrcode.clear(); // clear the code.
        qrcode.makeCode(ev);
    }

    function loadGrid(event_id) {
        debugger
        $("#grid").empty();
        var grid = $("#grid").kendoGrid({
            dataSource: {
                type: "json",
                transport: {
                    read: {
                        url: $("#hd_path").val() + "/QRCodeAtt/AjaxReadsAtt?s_str_event_id=" + event_id,
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

        //jumlah_peserta = grid.dataSource.total();

        //console.log(jumlah_peserta);

       // $("#sp_total_peserta").text(jumlah_peserta);       
    }

    function loadPeople(event_id) {
        debugger
    $.ajax({
    type: "GET",
    url: "/QRCodeAtt/get_atthadir?s_str_event_id=" + event_id,
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
        //debugger
        if (response.status == true) {
            //console.log(response.Data.att_hadir);           
            //jumlah_peserta = response.Data.att_hadir;
            //$("#sp_total_peserta").val(jumlah_peserta);
            //ViewModel.set("people", response.Data.att_hadir);
        }
    }
    })
    }

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

    //function dates() {
    //    //bind datenya
    //    debugger
    //    $.ajax({
    //        type: "GET",
    //        url: "/QRCodeAtt/AjaxReadDate?evH=" + $("#hd_idev").val(),
    //        contentType: "application/json",
    //        dataType: "json",
    //        success: function (response) {
    //            debugger
    //            if (response.status == true) {
    //                console.log(kendo.toString(kendo.parseDate(response.Data, "dd/MM/yyyy"), "dd/MM/yyyy"));
    //            }
    //        }
    //    })
    //}  

    $("#dt_startEvent").kendoDropDownList({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/QRCodeAtt/AjaxReadDate?evH=" + $("#hd_idev").val(),
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
        select: function (e) {
            debugger
            $("#sp_total_peserta").val("");
            var dataItem = this.dataItem(e.item.index() + 1);           
            get_evID(dataItem.event_id);
            qrcode(dataItem.event_id);
            event_id = dataItem.event_id;
            $("#evid_show").val(dataItem.event_id);
            $("#sp_total_peserta").val(dataItem.att_hadir);
            //dt_startEvent_show, dt_endEvent_show
            $("#dt_startEvent_show").val(kendo.toString(kendo.parseDate(dataItem.start_date, "dd/MM/yyyy HH:mm"), "dd/MM/yyyy HH:mm"));
            $("#dt_endEvent_show").val(kendo.toString(kendo.parseDate(dataItem.end_date, "dd/MM/yyyy HH:mm"), "HH:mm"));
            

        },
        dataTextField: "start_date_mod",
        dataValueField: "start_date_mod",
        optionLabel: "Pilih Tanggal Event..",
    });
      
      function get_evID(event_id) {
        //var distrik = viewModel.get("District");
        loadGrid(event_id);
        
      }

      function refreshgrid() {
          var idevent = $("#evid_show").val();
          debugger
          loadGrid(idevent);
          loadPeople(idevent);
      }

function downloadabsen() {
    window.location.href = "http://10.14.101.101:8080/ReportServer_DMSPROD/Pages/ReportViewer.aspx?%2fICOEReport%2fmOk_Report&eventid=" + event_id + "&rs:Command=Render&rs:FORMAT=PDF";
}

  