var ms = {}

ms.suplierData = ko.observableArray([]);

ms.suplierTemplate = {
	Id:"",
	Name: "",
	UseInAD: false,
	FromOmnifin: false,
}



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
					return "<center><input type='checkbox' onclick='ms.checkedADSuplier(\""+d._id+"\", \""+d.uid+"\")' id='AD"+ d._id+"' name='AD'><center>"
				},
				width: 25,
			},
			{
				field: "FromOmnifin",
				title: "From Omnifin",
				headerAttributes: {"class" : "sub-bgcolor"},
				template: function(d){
					return "<center><input type='checkbox' id='Om"+d._id+"' name='Omnifin' disabled /></center>"
				},
				width: 25,
				headerTemplate: "From <br/> Omnifin"
			},
		]
	});
}

ms.checkedADSuplier = function(d, uid){
	var index = $('#background0 tr[data-uid="'+uid+'"]').index();
	var Data = $('#suplier').data('kendoGrid').dataSource.data();
	Data[index] = $("#AD"+d).is(':checked');

}

$(document).ready(function(){
	ms.getSuplierData()
	ms.loadGridSuplier()
})