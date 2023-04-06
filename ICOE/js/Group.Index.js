var ViewModel;

$(document).ready(function () {   

	$("#btn_tambah").click(function () {
		location.href = "../Group/InsertGroup"
	});

    ViewModel = kendo.observable({
    	group_id: "",
    	group_name: "",
    	attendees: [],
		groupdetail_id: "",

    	ds_namagroup: new kendo.data.DataSource({
            transport: {
                read: {
                	url: $("#hd_path").val() + "/Group/AjaxReadAllGroup",
                    Data: {},
                    contentType: "json",
                    type: "POST",
                    cache: false
                },
                destroy: {
                	dataType: "json",
                	url: "/Group/DeleteDGroup",
                	data: {},
                	contentType: "application/json",
                	cache: false,
                	complete: function (data) {
                		ViewModel.ds_namagroup.read();
                	}
                },
                update: {
                	dataType: "json",
                	url: "/Group/updateGroup",
                	data: {},
                	contentType: "application/json",
                	cache: false,
                	complete: function (data) {
                		ViewModel.ds_namagroup.read();
                	}
                }
            },
            schema: {
                data: "Data",
                total: "Total",
                model: {
                    id: "group_id",
                    fields: {
                    	group_id: { type: "string", editable: true, sortable: false },
                    	group_name: { type: "string", editable: true, sortable: false },
                    }
                }
            },
            pageSize: 20
        }),

        //LOAD AMBIL DATA SEBELUMNYA
        edit: function(e){
            var arrG = [];
            var bindMS = $("#txm_peserta").data("kendoMultiSelect");

            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            var obj = {
                group_id: dataItem.group_id,
                group_name: dataItem.group_name,
                groupdetail_id: dataItem.group_detail_id
            }           

            $.ajax({
            	url: "/Group/get_arr",
            	data: JSON.stringify(obj),
            	type: "post",
            	dataType: "json",
            	contentType: "application/json",
            	cache: false,
            	success: function (response) {

            		if (response.status == true) {
						
						$.each(response.Data, function (key, item) {
							//debugger;
							arrG.push(item.attendee);
						});
						bindMS.value(arrG);
            		}
            	}
            })
            
           
            ViewModel.set("groupdetail_id", dataItem.group_detail_id)
            
            $("#tx_groupdid").val(dataItem.group_detail_id);
			$("#tx_groupid").val(dataItem.group_id);
			$("#tx_namagroup").val(dataItem.group_name);	             

            popupaction.data("kendoWindow").open();
            popupaction.data("kendoWindow").title("Edit Group");
        },
       
    });
    kendo.bind($("#grid_group"), ViewModel);
    initialize();

   
});

function initialize() {
	var element = $("#grid").kendoGrid({
		dataSource: ViewModel.ds_namagroup,
        //height: 550,
        groupable: false,
        sortable: true,
        resizable: true,
        reorderable: false,
        pageable: true,
        filterable: true,
        columnMenu: false,
        //dataBound: function () {
        //    //this.expandRow(this.tbody.find("tr.k-master-row").first());
        //},
        columns: [
            {
            	command: [{ name: 'edit-data', text: 'Edit', class: 'btn btn-default', click: ViewModel.edit }, 'destroy'], title: 'Action', width: 150
            },               
            //{ field: 'group_id', title: 'group_id', width: 150 },
            { field: 'group_name', title: 'Group Name', width: 150 }],
        editable: "inline"
    });
}

popupaction = $("#popupedit").kendoWindow({
	actions: ["Minimize", "Maximize", "Close"],
	draggable: true,
	modal: true,
	pinned: false,
	visible: false,
	scrollable: false,
	position: {
		top: 100,
		left: 100
	},
	close: function (e) {

	},
	height: "400px",
	width: "600px",
	resizable: false,
	title: "Edit Group"
});

//UNTUK MULTISELECT
var required = $("#txm_peserta").kendoMultiSelect({
	dataTextField: "NAME",
	dataValueField: "EMPLOYEE_ID",
	dataSource: {
		type: "json",
		transport: {
			read: {
				url: $("#hd_path").val() + "/Group/AjaxReadKaryawan",
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
	//    viewModel.set("peserta", this.listView.value())
	//}
}).data("kendoMultiSelect");

function save() {

	//console.log(JSON.stringify(viewModel));
	var obj = {
		group_id: $("#tx_groupid").val(),
		list: $('select#txm_peserta').val(),
		nama_group: $("#tx_namagroup").val()
	}

	$.ajax({
		type: "POST",
		url: $("#hd_path").val() + "/Group/UpdateGroupE",
		contentType: "application/json",
		data: JSON.stringify(obj),
		success: function (response) {
			if (response.status) {
			    //alert(response.remark)
			    popupaction.data("kendoWindow").close();
			    $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4>' + response.remark + '</h4></label>');
			    pop.data("kendoWindow").open();
			} else {
			    popupaction.data("kendoWindow").close();
			    //alert(response.error)
			    $("#alert").append('<label style="margin-left:28%; margin-top:5%;"><h4>' + response.error + '</h4></label>');
			    pop.data("kendoWindow").open();
			}			

		},
		error: function (jqXHR, textStatus, errorThrown) {
		}

	});

}

pop = $("#window").kendoWindow({
    actions: [],
    draggable: true,
    modal: true,
    pinned: false,
    visible: false,
    scrollable: false,
    position: {
        top: 250,
        left: 500
    },
    close: function (e) {

    },
    height: "150px",
    width: "350px",
    resizable: false,
});

function closepop() {
    pop.data("kendoWindow").close();
    location.reload();
}