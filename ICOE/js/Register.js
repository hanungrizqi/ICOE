$(document).ready(function () {
    var viewModel = kendo.observable({

        nrp: "",
        nama: "",

        insert: function(){
            var get = viewModel.get();
            var obj = {
                profile: $("#ddl_profile").val(),
                nrp: get.nrp,
                nama: get.nama
            }
            $.ajax({
                type: "POST",
                url: "/Register/insertTBLUSER",
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (result) {
                    if (result.status == true) {
                        //debugger
                        $("#alert").empty();
                        $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align: center;"><h4>' + result.remark + '</h4></label>');
                        pop.data("kendoWindow").open();
                    }
                    else {
                        $("#alert").empty();
                        $("#alert").append('<label style="margin-left:0%; margin-top:5%; text-align: center;"><h4>' + result.error + '</h4></label>');
                        pop.data("kendoWindow").open();
                    }
                }
            })
        },

    })

    $("#tx_nrp").kendoComboBox({
        //filter: "startswith",
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/Register/sc_nama",
                    contentType: "application/json",
                    dataType: 'json',
                    type: "GET",
                    cache: false
                }
            },
            schema: {
                Data: "Data",
                Total: "Total"
            }
        },
        select: function (e) {
            //debugger
            var dataItem = this.dataItem(e.item.index());
            //console.log(dataItem.EMPLOYEE_ID, dataItem.NAME);
            viewModel.set("nrp", dataItem.EMPLOYEE_ID);
            viewModel.set("nama", dataItem.NAME);

        },
        filter: "contains",
        dataTextField: "NAME",
        dataValueField: "EMPLOYEE_ID",
        optionLabel: "Pilih Nama",
    });          

    kendo.bind($("#place"), viewModel);
    //pop.data("kendoWindow").open();

})

$("#ddl_profile").kendoDropDownList({
    optionLabel: "Pilih Profile",
    dataTextField: "PROFILE_DESC",
    dataValueField: "PROFILE_PID",
    dataSource:
       {
           type: "json",
           transport:
               {
                   read:
                       {
                           url: "/Register/dl_profile",
                           contentType: "application/json",
                           dataType: 'json',
                           type: "GET",
                           cache: false
                       }
               },
           schema:
               {
                   Data: "Data",
                   Total: "Total"
               }
       }
});

pop = $("#windows").kendoWindow({
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
    //content: {
    //    template: '<label style="margin-left:0%; margin-top:5%; text-align: center;"><h4> Tester </h4></label>'
    //},
    height: "200px",
    width: "500px",
    resizable: false,
});

function closepop() {
    pop.data("kendoWindow").close();
}