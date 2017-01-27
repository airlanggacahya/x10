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
		]
	});
}

ms.checkedADSuplier = function(d, uid){
	var index = $('#suplier tr[data-uid="'+uid+'"]').index();
	var Data = $('#suplier').data('kendoGrid').dataSource.data();
	Data[index].UseInAD = $("#AD"+d).is(':checked');
		ms.suplierDataTemp.push({
			Id: Data[index]._id,
			Name: Data[index].Name,
			UseInAD: Data[index].UseInAD,
			FromOmnifin: Data[index].FromOmnifin,
			AddressLine1 : Data[index].AddressLine1,
			BankAccount : Data[index].BankAccount,
			BankBranch_id : Data[index].BankBranch_id,
			BankId : Data[index].BankId,
			BpType : Data[index].BpType,
			Country : Data[index].Country,
			Name : Data[index].Name,
			DealerDesc_1 : Data[index].DealerDesc_1,
			DealerId : Data[index].DealerId,
			District : Data[index].District,
			EmpanelledStatus : Data[index].EmpanelledStatus,
			LastUpdate : Data[index].LastUpdate,
			Pincode : Data[index].RecStatus,
			RecStatus : Data[index].RecStatus,
			State : Data[index].State,
			UseInAD :  Data[index].UseInAD,
			FromOmnifin : Data[index].FromOmnifin
		})

}

ms.saveMasterSuplier = function(){
	ajaxPost("/mastersuplier/savemastersuplier", ms.suplierDataTemp(), function(res){
		ms.suplierDataTemp([])
	});

}

$(document).ready(function(){
	ms.getSuplierData()
	ms.loadGridSuplier()
})