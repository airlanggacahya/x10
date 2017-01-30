var ms = {}

ms.suplierData = ko.observableArray([]);
ms.suplierDataTemp = ko.observableArray([]);

ms.getSuplierData = function(){
	ms.suplierData([])
	ajaxPost("/mastersuplier/getmastersuplier", {}, function(res){
		if(res.Data != null){
			ms.suplierData(res.Data)
			ms.loadGridSuplier()
			
		}
	});
}

ms.loadGridSuplier = function(){
	console.log(ms.suplierData())
	$("#suplier").html("");
	$("#suplier").kendoGrid({
		dataSource: ms.suplierData(),
		navigatable: true,
		scrolable: true,
		height: 300,
		columns : [
			{
				field: "Name",
				title: "Name",
				headerAttributes: {"class" : "sub-bgcolor"},
				width: 200,
				template: function(d){
					if(d.Name == ""){
						return "<input type='text' id='"+d.uid+"'' style='width: 98%;' />"
					}
					return d.Name
				},
			},
			{
				field: "UseInAD",
				title: "Use in AD",
				headerAttributes: {"class" : "sub-bgcolor"},
				template: function(d){
					if(d.UseInAD == true){
						return "<center><input type='checkbox' onclick='ms.checkedADSuplier(\""+d._id+"\", \""+d.uid+"\")' id='AD"+ d._id+"' name='AD' checked><center>"
					}
					return "<center><input type='checkbox' onclick='ms.checkedADSuplier(\""+d._id+"\", \""+d.uid+"\")' id='AD"+ d._id+"' name='AD'><center>"
				},
				width: 25,
			},
			{
				field: "FromOmnifin",
				title: "From Omnifin",
				headerAttributes: {"class" : "sub-bgcolor"},
				template: function(d){
					if(d.FromOmnifin == true){
						return "<center><input type='checkbox' id='Om"+d._id+"' name='Omnifin' disabled checked/></center>"
					}
					return "<center><input type='checkbox' id='Om"+d._id+"' name='Omnifin' disabled /></center>"
				},
				width: 25,
				headerTemplate: "From <br/> Omnifin"
			},
			{
				title: "",
				headerAttributes: {"class" : "sub-bgcolor"},
				template: function(d){
					if(d.FromOmnifin == false && d.Name == ""){
						return "<center><button class='btn btn-xs btn-flat btn-danger' onclick = 'ms.removeData1(\""+d.uid+"\")'><i class='fa fa-trash'></i></button></center>"
					}else if(d.FromOmnifin == false && d.Name != ""){
						return "<center><button class='btn btn-xs btn-flat btn-danger' onclick='ms.removeData2(\""+d.uid+"\")'><i class='fa fa-trash' onclick = 'ms.removeData2(\""+1+"\")'></i></button></center>"
					}
					return ""
				},
				width: 25,
			},
		]
	});
}

ms.checkedADSuplier = function(d, uid){
	var index = $('#suplier tr[data-uid="'+uid+'"]').index();
	var Data = $('#suplier').data('kendoGrid').dataSource.data();
	Data[index].UseInAD = $("#AD"+d).is(':checked');
}

ms.saveMasterSuplier = function(){
	ms.suplierDataTemp([])
	var Data = $('#suplier').data('kendoGrid').dataSource.data();
	$.each(Data, function(i, item){
		if(Data[i].Name == ""){
			Data[i].Name = $("#"+item.uid).val();
		} 
		ms.suplierDataTemp.push({
			Id: item._id,
			Name: item.Name,
			UseInAD: item.UseInAD,
			FromOmnifin: item.FromOmnifin,
			AddressLine1 : item.AddressLine1,
			BankAccount : item.BankAccount,
			BankBranch_id : item.BankBranch_id,
			BankId : item.BankId,
			BpType : item.BpType,
			Country : item.Country,
			Name : item.Name,
			DealerDesc_1 : item.DealerDesc_1,
			DealerId : item.DealerId,
			District : item.District,
			EmpanelledStatus : item.EmpanelledStatus,
			LastUpdate : item.LastUpdate,
			Pincode : item.RecStatus,
			RecStatus : item.RecStatus,
			State : item.State,
			UseInAD :  item.UseInAD,
			FromOmnifin : item.FromOmnifin
		});
	});
	
	ajaxPost("/mastersuplier/savemastersuplier", ms.suplierDataTemp(), function(res){
		if(res.IsError != true){
			swal("Data Saved Successfully", "", "success");
			ms.getSuplierData()
			ms.loadGridSuplier()
		}else{
			swal("", res.Message, "error")
		}
	});

}

ms.addMasterSuplier = function(){
	var allData = $("#suplier").data("kendoGrid").dataSource.data()
	var data = {
		_id: "",
		Name: "",
		UseInAD: "",
		FromOmnifin: "",
		AddressLine1 : "",
		BankAccount : "",
		BankBranch_id : "",
		BankId : "",
		BpType : "",
		Country : "",
		Name : "",
		DealerDesc_1 : "",
		DealerId : "",
		District : "",
		EmpanelledStatus : "",
		LastUpdate : "",
		Pincode : "",
		RecStatus : "",
		State : "",
		UseInAD :  false,
		FromOmnifin : false,
	}

	allData.unshift(data);

	ms.scrollKendoGrid("#suplier", "tr:first")
}

ms.scrollKendoGrid = function(id, row){
	$(id+ " div.k-grid-content").scrollTop($(id + " " + row).position().top);
}

ms.removeData1 = function(d){
	var index = $('#suplier tr[data-uid="'+d+'"]').index();
	var allData = $('#suplier').data('kendoGrid').dataSource.data();
	allData.splice(index, 1);

}

ms.removeData2 = function(uid){
	ms.suplierDataTemp([]);
	var index = $('#suplier tr[data-uid="'+uid+'"]').index();
	var data = $('#suplier').data('kendoGrid').dataSource.data();
	console.log(data[index]._id)
	$.each(data, function(i, item){
		ms.suplierDataTemp.push({
			Id: item._id,
			Name: item.Name,
			UseInAD: item.UseInAD,
			FromOmnifin: item.FromOmnifin,
			AddressLine1 : item.AddressLine1,
			BankAccount : item.BankAccount,
			BankBranch_id : item.BankBranch_id,
			BankId : item.BankId,
			BpType : item.BpType,
			Country : item.Country,
			Name : item.Name,
			DealerDesc_1 : item.DealerDesc_1,
			DealerId : item.DealerId,
			District : item.District,
			EmpanelledStatus : item.EmpanelledStatus,
			LastUpdate : item.LastUpdate,
			Pincode : item.RecStatus,
			RecStatus : item.RecStatus,
			State : item.State,
			UseInAD :  item.UseInAD,
			FromOmnifin : item.FromOmnifin
		});
	});
	var param ={
		alldata : ms.suplierDataTemp(),
		Id : data[index]._id
	}

	ajaxPost("/mastersuplier/deletemastersuplier", param, function(res){
		if(res.IsError != true ){
			swal("Data Deleted Successfully", "", "success")
			ms.getSuplierData()
			ms.loadGridSuplier()
		}else{
			swal(res.Message, "", "error")
		}
	})

}

$(document).ready(function(){
	ms.getSuplierData()
	ms.loadGridSuplier()
})