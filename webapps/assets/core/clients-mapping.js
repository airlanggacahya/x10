var map = {
	fileType: ko.observable(""),
	listAccountCode: ko.observableArray([]),
	listAccountID: ko.observableArray([]),
	Edit: ko.observable(false),
	loading: ko.observable(false),

	Id: ko.observable(""),
	Filetype: ko.observable(""),
	tprsAccountCode: ko.observable(""),
	updAccountCode: ko.observable(""),
	Clearer: ko.observable(""),

	listAccountCode: ko.observableArray([]),
	listAccountID: ko.observableArray([]),

	getFileType: ko.observableArray([
	    {text: "TT", value: "TT"},
	    {text: "Stellar", value: "Stellar"},
	    {text: "ADM", value: "ADM"},
	    {text: "CQG", value: "CQG"},
	    {text: "CQGSFTP", value: "CQGSFTP"},
	    {text: "FCS", value: "FCS"},
	    {text: "Newedge", value: "Newedge"},
	    {text: "SEB", value: "SEB"},
	    {text: "SEB WEBCLEAR", value: "SEB WEBCLEAR"},
	    {text: "Settlement Price", value: "SP"},
	    {text: "Desk Fee", value: "DF"}

	]),

}

map.saveData = function () {
	var tprsAccountCode = $("#tprsAccountCode").data("kendoDropDownList");
		var param = {
		"Id": -1,
		"Filetype": map.Filetype(),
		"tprsAccountCode": tprsAccountCode.text(), //updaccounts.tprsAccountCode(),
		"updAccountCode": map.updAccountCode(),
		"Clearer": map.Clearer().toString(),
	}
	var url = "/masterupdaccount/savedata";
	var validator = $("#AddAccFees").data("kendoValidator");
	if (validator == undefined) {
		validator = $("#AddAccFees").kendoValidator().data("kendoValidator");
	}
	if (validator.validate()) {
		ajaxPost(url, param, function (res) {
			var IsError = res.IsError;
			if (IsError == false) {
					swal("Success!", res.Message, "success");
					map.getMapGrid();
					$("#mapModal").modal("hide");
					$('#nav-dex').css('z-index', 'none');
				} else {
					return swal("Error!", res.Message, "error");
			}
		});
	}
}

map.editUpdAccounts = function (IdUpdAcccount) {
	var validator = $("#AddAccFees").kendoValidator().data("kendoValidator");
    validator.hideMessages();
	var url = "/masterupdaccount/getdata";
	var param = {
		"Id": parseInt(IdUpdAcccount),
	}
	ajaxPost(url, param, function (res) {
		var DataUpdAcc = res.Data.Records[0];
		$("#mapModal").modal({
			show:  true,
			backdrop: 'static',
			keyboard: false
		});
		$('#nav-dex').css('z-index', '0');
		map.Edit(true);
		var dpFileType = $("#Filetype").data("kendoDropDownList");
		var dpAccCode = $("#tprsAccountCode").data("kendoDropDownList");
		dpFileType.enable(false);
		dpAccCode.enable(false);
		dpAccCode.text(DataUpdAcc.Tprs_account_code);

		map.Id(parseInt(IdUpdAcccount));
		map.Filetype(DataUpdAcc.Filetype);
		// updaccounts.tprsAccountCode(DataUpdAcc.Tprs_account_code);
		map.updAccountCode(DataUpdAcc.Upd_account_code);
		map.Clearer(DataUpdAcc.Clearer);
	});
}

map.saveEdit = function () {
	var tprsAccountCode = $("#tprsAccountCode").data("kendoDropDownList");
	var param = {
		"Id": map.Id(),
		"Filetype": map.Filetype(),
		"tprsAccountCode": tprsAccountCode.text(),
		"updAccountCode": map.updAccountCode(),
		"Clearer": map.Clearer().toString(),
	}
	var url = "/masterupdaccount/savedata";
	var validator = $("#AddAccFees").data("kendoValidator");
	if (validator == undefined) {
		validator = $("#AddAccFees").kendoValidator().data("kendoValidator");
	}
	if (validator.validate()) {
		ajaxPost(url, param, function (res) {
			var IsError = res.IsError;
			if (IsError == false) {
				swal("Success!", res.Message, "success");
				map.getMapGrid();
				$("#mapModal").modal("hide");
				$('#nav-dex').css('z-index', 'none');
			} else {
				return swal("Error!", res.Message, "error");
			}
		});
	}
}

map.addNew = function(){
	var validator = $("#AddAccFees").kendoValidator().data("kendoValidator");
    validator.hideMessages();
	map.Edit(false);
	$("#mapModal").modal({
		show:  true,
		backdrop: 'static',
		keyboard: false
	});
	$('#nav-dex').css('z-index', '0');

	var dpFileType = $("#Filetype").data("kendoDropDownList");
	var dpAccCode = $("#tprsAccountCode").data("kendoDropDownList");
	dpFileType.enable(true);
	dpAccCode.enable(true);
	var tprsAccountCode = $("#tprsAccountCode").data("kendoDropDownList").text("");
	map.Id("");
	map.Filetype("");
	map.tprsAccountCode("");
	map.updAccountCode("");
	map.Clearer("");
}

var userid = model.User();
var gcupdacc = new GridColumn('role_updacc', userid, 'MasterGridMapping');

map.getMapGrid = function(){
	$("#tab8").hide();
	map.loading(true)
	//console.log(accounts.accnomap());
	var param = {
	    FileType: "",
	    TprsAccountCode: accounts.accnomap(),
	    UpdAccountCode: ""
	}

	var url = "/masterupdaccount/getdatabyclient";
	var dataSource = [];
	$("#MasterGridMapping").html("");
	$("#MasterGridMapping").kendoGrid({
	dataSource: {
		transport: {
			read: {
			  url: url,
			  data: param,
			  dataType: "json",
			  type: "POST",
			  contentType: "application/json",
			},
			parameterMap: function (data) {
			  return JSON.stringify(data);
			},
		},
		schema: {
			data: function (data) {
				map.loading(false)
				//gcupdacc.Init();
				if (data.Data.Count == 0) {
					return dataSource;
				} else {
					return data.Data.Records;
				}
			},
			total: function(data){
				return data["Data.Count"];
			},
		},
		pageSize: 15,
		// serverPaging: false,
		// serverSorting: false,
		},
		resizable: true,
		sortable: true,
		pageable: {
			refresh: true,
			pageSizes: true,
			buttonCount: 5
		},
		// columnMenu: true,
		// columnHide: function(e) {
		// 	gcupdacc.RemoveColumn(e.column.field);
		// },
		// columnShow: function(e) {
		// 	gcupdacc.AddColumn(e.column.field);
		// },
		filterable: {
			mode: "row"
		},
		columns: [
		{
			field: "Filetype",
			title: "File Type",
			width: 100,
			template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:map.editUpdAccounts(\"#: Id #\")'>#: Filetype #</a>#}else{#<div>#: Filetype #</div>#}#",
				filterable: {
					cell: {
					operator: "contains"
				}
			}
		},
		{
			field: "Tprs_account_code",
			title: "Tprs Account Code",
			width: 100,
			attributes: {
				"class": "align-right"
			},
			filterable: {
				cell: {
					operator: "contains"
				}
			}
		},
		{
			field: "Upd_account_code",
			title: "Upd Account Code",
			width: 100,
			attributes: {
			"	class": "align-right"
			},
			filterable: {
				cell: {
					operator: "contains"
				}
			}
		},
		{
			field: "Clearer",
			title: "Clearer",
			width: 100,
			attributes: {
				"class": "align-right"
			},
			filterable: {
				cell: {
					operator: "contains"
				}
			}
		}, 
		{
			field:"",
			title:"",
			width:50,
			template: "<button data-value='#:Id #' onclick='map.deleteData(\"#: Id #\")' name='rename' type='button' class='btn btn-danger btn-xs rename'><span class='fa fa-trash'></span></button>",
			attributes: {"class": "align-center"}
		}
		]
	});
}

map.deleteData = function(id){
	var param ={
		Id : parseInt(id)
	}

	var url = "/masterupdaccount/deletedata";
	swal({
		title: "Are you sure ?",
		text: "Are you sure remove this data !",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm){
    	if(isConfirm){
    		ajaxPost(url, param, function(rest){
    			if(rest.IsError == false){
    				map.getMapGrid();
    				swal("Success!","Data Success Delete","success");
    			}else{
    				swal("Error!",rest.Message,"error");
    			}
    		});
    	}else{
    		swal("Cancelled", "Cancelled", "error");
    	}
    });
}

map.tprsAccountCode.subscribe(function (newValue) {
	$.each(accounts.dataList(), function(i, a){
		if(newValue == a.text){
			map.Clearer(a.clearer);
		}
	});
});

map.getAccountID = function () {
	var payload = {};
	map.listAccountID([]);
	ajaxPost("/datamaster/getaccount", payload, function (res) {
		var sortAcc = Enumerable.From(res).OrderBy("$._id").ToArray();
		for (var a in sortAcc) {
			map.listAccountID.push({
				"text": sortAcc[a]._id,
				"value": sortAcc[a].clearer
			});
		}
	});
}

map.close = function(){
	$('#nav-dex').css('z-index', 'none');
}

$(document).ready(function(){
	$('#li3').click(function(){
		map.getAccountID();
	})
	//map.getMapGrid();
	
});