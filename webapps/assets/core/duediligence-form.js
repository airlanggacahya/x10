var due={}

due.dataVerifications = ko.observableArray();
due.dataDefaulterList = ko.observableArray();
due.dataTemp = ko.observableArray();
due.Name = ko.observableArray();
due.dataCustomer = ko.observableArray()
due.templateForm = {
	Id: "",
	CustomerId: "",
	DealNo: "",
	Verification: [],
	Defaulter: [],
	Background: [],
	Status: 0,
	Freeze: false,
	LastConfirmed : (new Date()).toISOString(),
};
due.formVisible = ko.observable(false);
due.form = ko.mapping.fromJS(due.templateForm);
due.getForm = function(){
	due.form.Background([]);
	due.form.Verification([]);
	due.form.Defaulter([]);
	var customerId = filter().CustomerSearchVal();
	var dealNo = filter().DealNumberSearchVal();
	due.form.CustomerId(customerId);
	due.form.DealNo(dealNo);
	if(due.form.Status == "" || due.form.Status() != 1){
		due.form.Status(0)
	}
	
	// if(due.form.Status() == ""){
	// 	due.form.Status(0)
	// }

	if(due.form.Freeze() == ""){
		due.form.Freeze(false)
	}
	var dataVerification = $("#gridverification0").data("kendoGrid").dataSource.data()
	$.each(dataVerification, function(i, ver){
		due.form.Verification.push({Particulars : ver.Particulars,Result: ver.Result,Mitigants : ver.Mitigants,});
	});
	var dataDefaulters = $("#gridDefaulterList0").data("kendoGrid").dataSource.data()
	$.each(dataDefaulters, function(i, App){
		due.form.Defaulter.push({Source : App.Source,Applicable: App.Applicable,BankName : App.BankName,Amount: App.Amount, Status: App.Status});
	});
	var dataBackground = $("#background0").data("kendoGrid").dataSource.data()
	$.each(dataBackground, function(i, Back){
		// console.log("----->",Back.CIBILScore)
		due.form.Background.push({Name : Back.Name,Designation: Back.Designation,CIBILScore: Back.CIBILScore, ShareHolding: Back.ShareHolding,RedFlags: Back.RedFlags});
	});
}

due.LoadGrid = function(){
	// due.getData();
	$("#gridDefaulterList0").html("");
	$("#gridDefaulterList0").kendoGrid({
		dataSource: {
			data:  due.form.Defaulter(),
			schema:{
				model:{
					id: "Source",
					fields: {
						Source:{editable: false, nullable: true},
						Applicable:{editable: true},
						BankName:{editable: true},
						Amount:{type: "number", editable: true, min: 1},
						Status:{editable: true},
					}
				}
			}
		},

		resizable: true,
		editable: true,
		edit: function (e) {
	        var fieldName = e.container.find("input").attr("name");
	        if(due.form.Freeze() == true || due.form.Status() == 1){
	        	this.closeCell();
	        }

		},
		navigatable: true,
		batch: true,
		columns:[
			{
				field: "Source",
				title: "Source",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 60,
			},
			{
				field: "Applicable",
				title: "Applicable",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 25,
				editor: due.LoadApplicable,
			},
			{
				field: "BankName",
				title: "Bank Name",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 100,
				// editor: due.LoadMitigantInput,
			},
			{
				field: "Amount",
				title: "Amount (in CR)",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 30,
				editor: due.amountInput,
			},
			{
				field: "Status",
				title: "Current Status",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 30,
				editor: due.loadCurrentStatus,
			},

		],

	});

   	$("#gridverification0").html("");
	$("#gridverification0").kendoGrid({
		dataSource: {
			data: due.form.Verification(),
			schema:{
				model:{
					id: "Particulars",
					fields: {
						Particulars:{editable: false, nullable: true},
						Result:{editable: true},
						Mitigants:{editable: true},
					}
				}
			}
		},

		resizable: true,
		editable: true,
		edit: function (e) {
	        var fieldName = e.container.find("input").attr("name");
	        if(due.form.Freeze() == true || due.form.Status() == 1){
	        	this.closeCell();
	        }

		},
		navigatable: true,
		batch: true,
		columns:[
			{
				field: "Particulars",
				title: "Check Particulars",
				headerAttributes: { "class": "sub-bgcolor" },
				width: 75,
			},
			{
				field: "Result",
				title: "Result",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 35,
				editor: due.LoadResultDropDown,
			},
			{
				field: "Mitigants",
				title: "Mitigants in Case of Negative Result",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 200,
				editor: due.LoadMitigantInput,
			},

		],

	});


	$("#background0").html("");
	$("#background0").kendoGrid({
		dataSource: {
			data:  due.form.Background(),
			schema:{
				model:{
					id: "Name",
					fields: {
						Name:{editable: true,},
						Designation:{editable: true},
						ShareHolding:{type: "number", editable: true, min: 1, spinner: false},
						CIBILScore:{type: "number", editable: true, min: 1},
						RedFlags:{editable: true},
					}
				}
			}
		},

		resizable: true,
		editable: true,
		edit: function (e) {
	        var fieldName = e.container.find("input").attr("name");
	        if(due.form.Freeze() == true || due.form.Status() == 1){
	        	this.closeCell();
	        }

		},
		navigatable: true,
		batch: true,
		columns:[
			{
				field: "Name",
				title: "Name",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 50,
				editor: due.LoadNameDropDown,
				template: function(d){

					return d.Name
				}
			},
			// {
			// 	field: "Designation",
			// 	title: "Designation",
			// 	width: 100,
			// 	// editor: due.LoadResultDropDown,
			// },
			// {
			// 	field: "ShareHolding",
			// 	title: "% of Share Holding",
			// 	width: 50,
			// 	 editor: due.shareHoldingInput,
			// },
			// {
			// 	field: "CIBILScore",
			// 	title: "Cibil Score",
			// 	width: 50,
			// 	editor: due.CibilScoreInput,
			// },
			{
				field: "RedFlags",
				title: "Red Flags",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 100,
				// editor: due.LoadMitigantInput,
			},
			{
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 20,
				template: function(d){
					return '<center><button class="btn btn-flat btn-sm btn-danger noable" onclick="due.removeRowBackground(\''+d.uid+'\')"><i class="fa fa-trash"></i></button></center>'
				}
			}

		],

	});
}

due.shareHoldingInput = function(container, options){
	$('<input data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            spinners : false
        });
}

due.CibilScoreInput = function(container, options){
	$('<input data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            spinners : false
        });
}

due.amountInput = function(container, options){
	$('<input data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            spinners : false
        });
}

due.loadCircleChart = function(){
	var myCircle = Circles.create({
		id:                  'circlesPositif',
		radius:              75,
		value:               59,
		maxValue:            100,
		width:               15,
		text:                function(value){return value + '% positive';},
		colors:              ['#c5ceca', '#1fbf76'],
		duration:            300,
		wrpClass:            'circles-wrp',
		textClass:           'circles-text',
		valueStrokeClass:    'circles-valueStroke',
		maxValueStrokeClass: 'circles-maxValueStroke',
		styleWrapper:        true,
		styleText:           true
	});

	var myCircle = Circles.create({
		id:                  'circlesNetral',
		radius:              75,
		value:               27,
		maxValue:            100,
		width:               15,
		text:                function(value){return value + '% neutral';},
		colors:              ['#c5ceca', '#238ac5'],
		duration:            300,
		wrpClass:            'circles-wrp',
		textClass:           'circles-text',
		valueStrokeClass:    'circles-valueStroke',
		maxValueStrokeClass: 'circles-maxValueStroke',
		styleWrapper:        true,
		styleText:           true
	});

	var myCircle = Circles.create({
		id:                  'circlesNegatif',
		radius:              75,
		value:               14,
		maxValue:            100,
		width:               15,
		text:                function(value){return value + '% negative';},
		colors:              ['#c5ceca', '#d62422'],
		duration:            300,
		wrpClass:            'circles-wrp',
		textClass:           'circles-text',
		valueStrokeClass:    'circles-valueStroke',
		maxValueStrokeClass: 'circles-maxValueStroke',
		styleWrapper:        true,
		styleText:           true
	});
}

due.LoadMitigantInput = function(container, options){
	$('<textarea style="width: 100%" data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"></textarea>')
		.appendTo(container);
}

due.LoadResultDropDown = function(container, options){
	$('<input data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"/>')
		.appendTo(container)
		.kendoDropDownList({
			dataTextField: 'text',
			dataValueField: 'value',
			dataSource: [{'text': 'Positive', 'value': 'Positive'},{'text': 'Moderate', 'value': 'Moderate'}, {'text': 'Negative', 'value': 'Negative'}],
			optionLabel: 'Select one',
		});
}

due.loadCurrentStatus = function(container, options){
	$('<input data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"/>')
		.appendTo(container)
		.kendoDropDownList({
			dataTextField: 'text',
			dataValueField: 'value',
			dataSource: [{'text': 'CLEAR', 'value': 'CLEAR'},{'text': 'NOT CLEAR', 'value': 'NOT CLEAR'}],
			optionLabel: 'Select one',
		});
}

due.LoadApplicable = function(container, options){
	$('<input data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"/>')
		.appendTo(container)
		.kendoDropDownList({
			dataTextField: 'text',
			dataValueField: 'value',
			dataSource: [{'text': 'Yes', 'value': 'Yes'},{'text': 'No', 'value': 'No'}],
			optionLabel: 'Select one',
		});
}

due.isLoading = function (what) {
	$('.apx-loading')[what ? 'show' : 'hide']()
	$('.app-content')[what ? 'hide' : 'show']()
}


due.getCostumerData = function(){
	var customerId = filter().CustomerSearchVal();
	var dealNo = filter().DealNumberSearchVal();

	var url = "/datacapturing/getcustomerprofiledetail"
	var param = {
		CustomerId: customerId,
		DealNo: dealNo
	}
	due.formVisible(false);
	app.ajaxPost(url, param, function (res) {
		if (res.length > 0)
		res = checkConfirmedOrNot(res[0].Status, 1, 2, res, [], "Customer Application");

		if(due.form.Freeze() == true){
			due.EnableAllfields(false)
		}

		due.formVisible(true);
		due.Name([]);
		due.dataCustomer([]);
		if(res.length > 0){
			$.each(res[0].DetailOfPromoters.Biodata, function(i, items){
				due.Name.push(
					{text: items.Name, value: items.Name}
				)
			});
			due.dataCustomer(res[0].DetailOfPromoters.Biodata)
		}

	}, function(){
		due.isLoading(false);
	});
}

due.LoadNameDropDown = function(container, options){
	$('<input data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"/>')
		.appendTo(container)
		.kendoDropDownList({
			dataTextField: 'text',
			dataValueField: 'value',
			dataSource: due.Name(),
			optionLabel: 'Select one',
			// select: function(d){
			// 	var dataItem = this.dataItem(d.item);
   //              $.each(due.dataCustomer(), function(i, item){
   //              	if(dataItem.value == item.Name){
   //              		($('#background0 tr[data-uid="'+options.model.uid+'"]').find("td").eq(3)).text(item.CIBILScore);
   //              		options.model.CIBILScore = item.CIBILScore;
   //              		($('#background0 tr[data-uid="'+options.model.uid+'"]').find("td").eq(2)).text(item.ShareHoldingPercentage);
   //              		options.model.ShareHolding = item.ShareHoldingPercentage;
   //              		($('#background0 tr[data-uid="'+options.model.uid+'"]').find("td").eq(1)).text(item.Designation);
   //              		options.model.Designation = item.Designation;
   //              	}
   //              })

			// }
		});
}

due.addRowBackground = function(){
	var allData = $("#background0").data("kendoGrid").dataSource.data();
	var data = {
		Name: "",
		Designation:"",
		ShareHolding: 0,
		CIBILScore: 0,
		RedFlags: "",
	};
	allData.push(data)
}

window.refreshFilter = function () {
	due.getCostumerData();
	due.getData();
	if(due.form.Status() == "" || due.form.Status() == 0){
			$('.form-last-confirmation-info').html('' );
		}
}

due.selctedCustmer = function(){

}

due.initEvents = function () {
	filter().CustomerSearchVal.subscribe(function () {
		due.formVisible(false)
	})
	filter().DealNumberSearchVal.subscribe(function () {
		due.formVisible(false)
	})

	//$('#refresh').remove()
}

due.saveAll = function(){
	// due.isLoading(true);
	due.form.Status(0);
	due.form.Freeze(false);
	due.getForm();
	var param = ko.mapping.toJS(due.form);
	ajaxPost("/duediligence/duediligenceformsaveinput", param, function(res){
		due.isLoading(false)
		// console.log(res)
		swal("Success", "Data saved", "success");
	}, function(){
		due.isLoading(false);
	});
}

due.enableConfirm = function(what){
	$("#AD-Container .btn").prop( "disabled", !what );
}

due.getData = function(){
	due.form.Verification([])
	due.form.Defaulter([])
	due.form.Background([])
	due.form.CustomerId("")
	due.form.DealNo("")
	due.form.Freeze("")
	due.form.Id("")
	due.form.Status("")
	due.dataTemp([])
	var customerId = filter().CustomerSearchVal();
	var dealNo = filter().DealNumberSearchVal();
	var param = {
		CustomerId : customerId,
		DealNo : dealNo
	}

	ajaxPost("/duediligence/getduediligenceinputdata", param, function(res){
		var data = res.Data[0];
		if(res.Data.length > 0){
			console.log("------>",data.Background)
			due.form.Background(data.Background)
			due.form.CustomerId(data.CustomerId)
			due.form.DealNo(data.DealNo)
			due.form.Defaulter(data.Defaulter)
			due.form.Freeze(data.Freeze)
			due.form.Id(data.Id)
			due.form.Status(data.Status)
			due.form.Verification(data.Verification)
			due.dataTemp(data)
			due.LoadGrid();
			if(data.Status == 1){
				$('.form-last-confirmation-info').html('Last confirmed on: '+kendo.toString(new Date(data.LastConfirmed),"dd-MM-yyyy h:mm:ss tt") );
				due.enableConfirm(false);
			}
		}else{
			ajaxPost("/duediligence/getverificationcheck", {}, function(res){
			   console.log(res)
			   	$.each(res.Data, function(w, data){
			   		due.form.Verification.push(
			   			{Particulars : data.Field, Result: "", Mitigants: "",}
			   		)
			   	});
				due.LoadGrid();
			});

			ajaxPost("/duediligence/getdefaultcheck", {}, function(res){
			   	console.log(res)
			   	if(res.IsError != true){
			   		$.each(res.Data, function(i, item){
			   			due.form.Defaulter.push(
				   			{Source:item.Field ,Applicable : "",BankName: "",Amount: 0,Status: "",}
				   		)
			   		});

				due.LoadGrid();
			   	}
			});

			due.form.Background.push(
				{
					Name: "",
					Designation:"",
					ShareHolding: 0,
					CIBILScore: 0,
					RedFlags: "",
				}
			)
		}
	});
}

due.getReset = function(){
	// alert("reset")
	due.form.Background(due.dataTemp().Background)
	due.form.CustomerId(due.dataTemp().CustomerId)
	due.form.DealNo(due.dataTemp().DealNo)
	due.form.Defaulter(due.dataTemp().Defaulter)
	// due.form.Freeze(due.dataTemp().Freeze)
	due.form.Id(due.dataTemp().Id)
	// due.form.Status(due.dataTemp().Status)
	due.form.Verification(due.dataTemp().Verification)
	due.LoadGrid();
}

// due.setConfirm = function(){
// 	var customerId = filter().CustomerSearchVal();
// 	var dealNo = filter().DealNumberSearchVal();
// 	var param = {
// 		CustomerId : customerId,
// 		DealNo : dealNo,
// 		Status : 1,
// 	}

// 	ajaxPost("/duediligence/getconfirmduediligenceform", param, function(){
// 		due.enableConfirm(false);
// 	})
// }

due. removeRowBackground = function(d){
	swal({
		title: 'Are you sure want to delete?',
		// text: 'You will not be able to recover this imaginary file!',
		type: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Yes',
		cancelButtonText: 'No',
	}).then(function() {
		var index = $('#background0 tr[data-uid="'+d+'"]').index();
		var allData = $('#background0').data('kendoGrid').dataSource.data();
		allData.splice(index, 1);
	}, function(dismiss) {

		if (dismiss === 'cancel') {
			console.log("dismiss");
		}
	});

}

due.setConfirm = function(){
	// due.isLoading(true)
	// due.form.Freeze(true);
	due.getForm();
	due.form.Status(1);
	due.form.LastConfirmed(new Date());
	var param = ko.mapping.toJS(due.form)
	ajaxPost("/duediligence/duediligenceformsaveinput", param, function(res){
		due.isLoading(false)
		due.enableConfirm(false);

		// console.log(res)
		swal("Success", "Data Confirmed", "success");
		$('.form-last-confirmation-info').show()
		$('.form-last-confirmation-info').html('Last confirmed on: '+kendo.toString(new Date(due.form.LastConfirmed()),"dd-MM-yyyy h:mm:ss tt") );
	}, function(){
		due.isLoading(false);
	});
}

due.setReEnter = function(){
	// due.isLoading(true)
	due.getForm();
	due.form.Status(0);
	// due.form.Freeze(false);
	var param = ko.mapping.toJS(due.form)
	ajaxPost("/duediligence/duediligenceformsaveinput", param, function(res){
		due.isLoading(false);
		// $('.form-last-confirmation-info').hide()
		$('.form-last-confirmation-info').hide();
		due.enableConfirm(true);
	}, function(){
		due.isLoading(false);
	});
}

due.setFreeze = function(){
	// due.isLoading(true)
	// due.form.Status(1);
	
	due.getForm();
	due.form.Freeze(true);
	var param = ko.mapping.toJS(due.form)
	ajaxPost("/duediligence/duediligenceformsaveinput", param, function(res){
		due.LoadGrid();
		due.isLoading(false)
		// due.EnableAllfields(true);
		swal("Success", "Form Freeze", "success");
		due.EnableAllfields(false)
	}, function(){
		due.isLoading(false);
	});
}
due.setUnFreeze = function(){
	// due.isLoading(true)
	// due.form.Status(1);
	
	due.getForm();
	due.form.Freeze(false);
	var param = ko.mapping.toJS(due.form)
	ajaxPost("/duediligence/duediligenceformsaveinput", param, function(res){
		due.isLoading(false)
		// console.log(res)
		due.EnableAllfields(true);
		swal("Success", "Form UnFreeze", "success");
	}, function(){
		due.isLoading(false);
	});
}
due.EnableAllfields = function(what){

	$("#AD-Container input").prop( "disabled", !what );
	// $(elm+" input").prop( "disabled", !what );
	$("#AD-Container .noable").prop( "disabled", !what );

	$(".ontop").prop( "disabled", !what );

	$("#AD-Container .btn").prop( "disabled", !what );
	
	if(due.form.Status()==1)
	$("#AD-Container .btn").prop( "disabled", true );


	$("#AD-Container textarea").prop( "disabled", !what );

	$("#AD-Container .k-widget").each(function(i,e){

		var $ddl = $(e).find("select").getKendoDropDownList();

		if($ddl == undefined)
		var $ddl = $(e).find("input").getKendoDropDownList();

		var $dtm = $(e).find("input").getKendoDatePicker();
		var $txt = $(e).find("input").eq(1).getKendoNumericTextBox();

		if($ddl != undefined)
		{
			$ddl.enable(what);
		}else if($dtm != undefined){
			$dtm.enable(what);
		}else if ($txt != undefined){
			$txt.enable(what);
		}

	});

}

due.dateNow = function(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	today = mm+'/'+dd+'/'+yyyy;
	return today;
}

$(function(){
	
	due.LoadGrid();
	due.getData();
	due.initEvents();
	setTimeout(function(){
		// due.loadCircleChart()
		// if(due.form.Freeze() == true){
		// 	due.EnableAllfields(false)
		// }

		if(due.form.Status() == "" || due.form.Status() == 0){
			$('.form-last-confirmation-info').html('' );
		}
	}, 1000);

	$('.collapsibleDue').collapsible({
      accordion : true
    });
})