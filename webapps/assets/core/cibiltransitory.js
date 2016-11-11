var trans = {};
trans.AllData = ko.observableArray([]);
trans.CurrentData = ko.observable(null);
trans.GetDataGrid = function(){
	var url = "/cibiltransitory/getdatacibilpromotor"
	var param = {};
	trans.AllData([]);
	 ajaxPost(url, param, function(data) {
	 	data.Data.forEach(function(x){
	 		var fi = _.find(filter().CustomerSearchAll(),function(xi){
	 			return xi.customer_id == x.ConsumersInfos.CustomerId
	 		})
	 		x.CustomerName = "";
	 		if(fi !=undefined){
	 			x.CustomerName = fi.customer_name;
	 		}

	 	})
	 	trans.AllData(data.Data);
		trans.RenderGrid(data.Data);
	})
}


trans.RenderGrid = function(datas){
	$("#transgrid").html("");
	$("#transgrid").kendoGrid({
		 dataSource : datas,
		 scrollable:true,
		 pageable : false,
		 height : 400,
		 columns :[
		 {
		 	field : "FileName", 
		 	title : "File Name",
		 	     headerAttributes: {class: 'k-header header-bgcolor'},
		 },
		 {
		 	field : "ConsumersInfos.ConsumerName", 
		 	title : "Promotor Name",
		 	     headerAttributes: {class: 'k-header header-bgcolor'},
		 },
		  {
		 	field : "CustomerName", 
		 	title : "Customer Name",
		 	     headerAttributes: {class: 'k-header header-bgcolor'},
		 },
		 {
		 	field : "ConsumersInfos.DateOfBirth", 
		 	title : "Date Of Birth",
		 	template : function(x){
		 		return moment(x.ConsumersInfos.DateOfBirth).format("DD-MMM-YYYY")
		 	},
		 	attributes : { "style" : "text-align:center"  },
		 	headerAttributes: {class: 'k-header header-bgcolor'},
		 },
		 {
		 	field : "CibilScore", 
		 	title : "Cibil Score",
		 	attributes : { "style" : "text-align:right"  },
		 	     headerAttributes: {class: 'k-header header-bgcolor'},
		 },
		 {
		 	field : "IncomeTaxIdNumber", 
		 	title : "Income Tax Id",
		 	     headerAttributes: {class: 'k-header header-bgcolor'},
		 },
		 {
		 	field : "PassportNumber", 
		 	title : "Passport Number",
		 	     headerAttributes: {class: 'k-header header-bgcolor'},
		 },
		 {
		 	template : function(x){
		 		return "<button class='btn btn-xs btn-primary tooltipster' onclick='trans.showProm(\""+ x.Id + "\")'><i class='fa fa-edit'></i></button>"
		 	},
		 	width : 50,
		 	     headerAttributes: {class: 'k-header header-bgcolor'},
		 }
		 ]
	})
}

trans.showProm = function(Id){
	var cur = _.find(trans.AllData(),function(x){
		return x.Id == Id;
	})

	if(cur !=undefined){
		trans.CurrentData(ko.mapping.fromJS(cur));

		dateOfBirth = moment(trans.CurrentData().ConsumersInfos.DateOfBirth()).format("DD-MMM-YYYY");
		trans.CurrentData().ConsumersInfos.DateOfBirth(dateOfBirth)

		DateOfReport = moment(trans.CurrentData().DateOfReport()).format("DD-MMM-YYYY");
		trans.CurrentData().DateOfReport(DateOfReport)

		TimeOfReport = moment(trans.CurrentData().TimeOfReport()).format("hh:mm:ss");
		trans.CurrentData().TimeOfReport(TimeOfReport)

		email = _.filter(trans.CurrentData().EmailAddress(),function(x){ return x != "" });
		email = email.join("\n")
		trans.CurrentData().EmailAddress(email)

		$(".modal-edit-bro").modal("show");

		if($("#dateofreport").getKendoDatePicker() == undefined){
			$("#dateofreport").kendoDatePicker({ format : "dd-MMM-yyyy" });
			$("#dateofbirth").kendoDatePicker({ format : "dd-MMM-yyyy" });
		}

	}
}

// trans.UpdateGrid = function(datas){
// 	var url = "/cibiltransitory/updatecibilpromotor"
// 	var param = {};
// 	param = datas;
// 	 ajaxPost(url, param, function(data) {
// 		trans.RenderGrid(data.Data);
// 	})
// }

trans.SaveCibil = function(){
	var url = "/cibiltransitory/updatecibilpromotor"
	var param = {};
	
	var info = ko.mapping.toJS(trans.CurrentData)
	param = info;
	param.EmailAddress = param.EmailAddress.split("\n");
	param.ConsumersInfos.DateOfBirth = moment(trans.CurrentData().ConsumersInfos.DateOfBirth()).toDate().toISOString()
	param.DateOfReport = moment(trans.CurrentData().DateOfReport()).toDate().toISOString()
	param.TimeOfReport = moment(trans.CurrentData().TimeOfReport(),"hh:mm:ss").toDate().toISOString()
	 ajaxPost(url, param, function(data) {
	    if(data.Message!=""){
	    	swal("Error",data.Message,"error");
	    	return;
	    }
	    $(".modal-edit-bro").modal("hide");
	    trans.GetDataGrid();
	})
}

$(document).ready(function(){
	trans.GetDataGrid();

	$("#filter").keydown(function(){
		setTimeout(function(){
			var fil = $("#filter").val();
				var data = _.filter(trans.AllData(),function(x){ 
					return x.FileName.indexOf(fil) > -1 || x.ConsumersInfos.ConsumerName.indexOf(fil) > -1 || x.CustomerName.indexOf(fil) > -1
				});
			if(fil==""){
				data = trans.AllData();
			}
			trans.RenderGrid(data);
		},500);  
	})
})


