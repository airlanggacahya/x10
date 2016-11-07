var apcom = {
	Date: ko.observable(),
	Amount: ko.observable(),
	ROI: ko.observable(),
	PF: ko.observable(),
	PG: ko.observable(),
	Security: ko.observable(),
	OtherConditions: ko.observable(),
	CommitteeRemarks: ko.observable(),
	RecommendedCondition: ko.observable(),
	Recommendations: ko.observable(),
	LeftAmount: ko.observable(),
	Status: ko.observable()
}

apcom.dataBasisRecommendation = ko.observableArray([
	{title: "Date", value: ""},
	{title: "Amount", value: ""},
	{title: "ROI", value: ""},
	{title: "PF", value: ""},
	{title: "PG", value: ""},
	{title: "Security", value: ""},
	{title: "Other Conditions", value: ""},
	{title: "Committee Remarks", value: ""},
])

apcom.templateSanction ={
	Id: "",
	CustomerId :0,
	DealNo:"",
	Date: "",
	Amount: "",
	ROI: "",
	PF: "",
	PG: "",
	Security: "",
	OtherConditions: "",
	CommitteeRemarks: "",
	Status: false,
}
apcom.sanction = ko.mapping.fromJS(apcom.templateSanction)
apcom.accountCommentFinancials = ko.observable('');
apcom.tempFinalComment = ko.observableArray([
	{title: "Amount", value: 0},
	{title: "RecommendedCondition", value: ''},
	{title: "Recommendations", value: ''}
])
apcom.templateFinalComment = {
	Amount: 0,
	RecommendedCondition: '',
	Recommendations: '',
}
apcom.templateCreditAnalys = {
	Id:"",
	DealNo: '',
	CustomerId: '',
	CreditAnalysRisks : [],
	FinalComment: apcom.templateFinalComment,
}
apcom.dataTempRiskMitigants = ko.observableArray([])
apcom.formCreditAnalyst = ko.mapping.fromJS(apcom.templateCreditAnalys)

apcom.loadCommentData = function(){
	apcom.loadSection();
	apcom.dataTempRiskMitigants([])
	apcom.accountCommentFinancials([])

	var param = {
		DealNo : "", 
		CustomerId: ""
	}
	
	try{
		param.CustomerId = r.customerId().split('|')[0]
	  	param.DealNo = r.customerId().split('|')[1]
	} catch(e){}

	if(param.CustomerId == "" || param.DealNo == ""){
		param.CustomerId = filter().CustomerSearchVal()
		param.DealNo = filter().DealNumberSearchVal() 
	}

	ajaxPost("/accountdetail/getaccountdetailconfirmed", param, function(res){
		var data = res.Data;
	    apcom.accountCommentFinancials(data.BorrowerDetails.CommentsonFinancials);
	})

	apcom.dataBasisRecommendation([])
	apcom.tempFinalComment([])

	ajaxPost("/approval/getdcandcreditanalys", param, function(res){
		var data = res;
	    if(res.success != false){
	    	apcom.dataTempRiskMitigants(data[0].CreditAnalys.CreditAnalysRisks)
	    	if(apcom.dataTempRiskMitigants.length == 0){
	    		apcom.dataTempRiskMitigants({Risks: "", Mitigants: ""})
	    	}
		    ko.mapping.fromJS(data[0].CreditAnalys, apcom.formCreditAnalyst);
		    ko.mapping.fromJS(data[1].DCFinalSanction, apcom.sanction);

		    apcom.Date("")
			apcom.LeftAmount("")
			apcom.ROI("")
			apcom.PF("")
			apcom.PG("")
			apcom.Security("")
			apcom.OtherConditions("")
			apcom.CommitteeRemarks("")
			apcom.Amount("")
			apcom.RecommendedCondition("")
			apcom.Recommendations("")
			apcom.Status("")

			// apcom.plainDate(data[1].DCFinalSanction.Date)
		    apcom.Date(moment(data[1].DCFinalSanction.Date).format('DD-MMM-YYYY') == "01-Jan-0001" ? "" : moment(data[1].DCFinalSanction.Date).format('DD-MMM-YYYY'));
		    apcom.LeftAmount(data[1].DCFinalSanction.Amount);
		    apcom.ROI(data[1].DCFinalSanction.ROI);
		    apcom.PF(data[1].DCFinalSanction.PF);
		    apcom.PG(data[1].DCFinalSanction.PG);
		    apcom.Security(data[1].DCFinalSanction.Security);
		    apcom.OtherConditions(data[1].DCFinalSanction.OtherConditions);
		    apcom.CommitteeRemarks(data[1].DCFinalSanction.CommitteeRemarks);
		    apcom.Status(data[1].DCFinalSanction.Status)

		    apcom.Amount(data[0].CreditAnalys.FinalComment.Amount)
			apcom.RecommendedCondition(data[0].CreditAnalys.FinalComment.RecommendedCondition)
			apcom.Recommendations(data[0].CreditAnalys.FinalComment.Recommendations)
	    }
	});
}

apcom.sendCreditAnalyst = function(){
	apcom.formCreditAnalyst.CreditAnalysRisks([]);
	apcom.formCreditAnalyst.DealNo(r.customerId().split('|')[1])
	apcom.formCreditAnalyst.CustomerId(parseInt(r.customerId().split('|')[0]))
	var dataGrid = $("#grid1").data("kendoGrid").dataSource.data();
	var dataGrid1 = $("#grid3").data("kendoGrid").dataSource.data();

	$.each(dataGrid, function(i, items){
		apcom.formCreditAnalyst.CreditAnalysRisks.push(
			{Risks: items.Risks, Mitigants: items.Mitigants}
		)
	});

	apcom.formCreditAnalyst.FinalComment.Amount(dataGrid1[0].value)
	apcom.formCreditAnalyst.FinalComment.RecommendedCondition(dataGrid1[1].value)
	apcom.formCreditAnalyst.FinalComment.Recommendations(dataGrid1[2].value)
	var param = ko.mapping.toJS(apcom.formCreditAnalyst)
	
	var url = "/approval/savecreditanalys";
	if(r.customerId().split('|')[0] != "" && r.customerId().split('|')[1] != ""){
		ajaxPost(url, param , function(res){
			// console.log(res);
			if(res.success != true){
				swal("Error", res.message, "error")
			}else{
				swal("Success", "Data Successfully Send", "success");
			}
		})
	}else{
		swal("Warning", "Select Customer Id and Deal Number First", "warning");
	}
	
}

apcom.saveSanction = function(){
	apcom.sanction.Date(kendo.toString(new Date(apcom.Date()),"yyyy-MM-dd")+"T00:00:00.000Z")
	apcom.sanction.Amount(parseFloat(apcom.LeftAmount()))
	apcom.sanction.ROI(parseFloat(apcom.ROI()))
	apcom.sanction.PF(apcom.PF())
	apcom.sanction.PG(apcom.PG())
	apcom.sanction.Security(apcom.Security())
	apcom.sanction.OtherConditions(apcom.OtherConditions())
	apcom.sanction.CommitteeRemarks(apcom.CommitteeRemarks())
	apcom.sanction.Status(true)
	apcom.sanction.CustomerId(parseInt(r.customerId().split('|')[0]))
	apcom.sanction.DealNo(r.customerId().split('|')[1])
	var param = ko.mapping.toJS(apcom.sanction)
	if(r.customerId().split('|')[0] != "" && r.customerId().split('|')[1] != ""){
		ajaxPost("/approval/savedcfinalsanction", param, function(res){
			if(res.success != true){
				swal("Error", res.message, "error")
			}else{
				swal("Success", "Data Successfully Sanction", "success");
			}
		})
	}else{
		swal("Warning", "Select Customer Id and Deal Number First", "warning");
	}
	
}

apcom.saveHold = function(){
	apcom.sanction.Date(kendo.toString(new Date(apcom.Date()),"yyyy-MM-dd")+"T00:00:00.000Z")
	apcom.sanction.Amount(parseFloat(apcom.LeftAmount()))
	apcom.sanction.ROI(parseFloat(apcom.ROI()))
	apcom.sanction.PF(apcom.PF())
	apcom.sanction.PG(apcom.PG())
	apcom.sanction.Security(apcom.Security())
	apcom.sanction.OtherConditions(apcom.OtherConditions())
	apcom.sanction.CommitteeRemarks(apcom.CommitteeRemarks())
	apcom.sanction.Status(false)
	apcom.sanction.CustomerId(parseInt(r.customerId().split('|')[0]))
	apcom.sanction.DealNo(r.customerId().split('|')[1])
	var param = ko.mapping.toJS(apcom.sanction)
	if(r.customerId().split('|')[0] != "" && r.customerId().split('|')[1] != ""){
		ajaxPost("/approval/savedcfinalsanction", param, function(res){
			if(res.success != true){
				swal("Error", res.message, "error")
			}else{
				swal("Success", "Data Successfully Hold", "success");
			}
		})
	}else{
		swal("Warning", "Select Customer Id and Deal Number First", "warning");
	}
	
}

apcom.editorFieldInput = function(container, options){
	var index = container.parent().index()
	if(index == 0){
		$('<input data-bind="value:' + options.field + '"/>')
			.appendTo(container)
			.kendoDatePicker({
				format: 'dd-MMM-yyyy',
			})
	}else if(index == 1 || index == 2){
		$('<input data-bind="value:' + options.field + '"/>')
	        .appendTo(container)
	        .kendoNumericTextBox({
	            spinners : false,
	            min: 0,
        	});	
	}else if(index == 5 || index == 6 || index == 7){
		$('<textarea style="width: 98%" data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"></textarea>')
				.appendTo(container);
	}else{
		$('<input data-bind="value:' + options.field + '" style="width: 98%;"/>')
			.appendTo(container)
	}
}

apcom.editorField = function(container, options){
	var index = container.parent().index();
	// console.log(index)
	if(index == 0){
		$('<input data-bind="value:' + options.field + '"/>')
	        .appendTo(container)
	        .kendoNumericTextBox({
	            spinners : false,
	            min: 0,
        	});	
    }else if(index == 1){
    	$('<textarea style="width: 98%" rows="5" data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"></textarea>')
			.appendTo(container);
    }else{
    	$('<input data-bind="value:' + options.field + '" style="width: 98%;"/>')
			.appendTo(container)
    }

}
apcom.loadSection = function(){
	$('#commentdate').kendoDatePicker({format: 'dd-MMM-yyyy'});

	for (let i = 1; i <= 3; i++) {
		$(".caret"+i).click(function(){
			if($("#content"+i).is(':visible')){
				$("#content"+i).hide()
				if($("#caret"+i).hasClass('fa-caret-down')){
					$("#caret"+i).removeClass('fa-caret-down');
					$("#caret"+i).addClass('fa-caret-right');
				}else{
	                $("#caret"+i).removeClass('fa-caret-right');
	                $("#caret"+i).addClass('fa-caret-down');
	            }
			}else{
				$("#content"+i).show()
				if($("#caret"+i).hasClass('fa-caret-right')){
	                $("#caret"+i).removeClass('fa-caret-right');
	                $("#caret"+i).addClass('fa-caret-down');
	            }else{
	                $("#caret"+i).removeClass('fa-caret-down');
	                $("#caret"+i).addClass('fa-caret-right');
	            }
			}
		})
	}

	$("#grid3").html("");
	$("#grid3").kendoGrid({
		dataSource: {
			data: apcom.tempFinalComment(),
			schema: {
				model: {
					id: "title",
					fields: {
						title: { editable: false },
						value: { editable: true },
					}
				}
			}
		},
		resizable: true,
		editable: true,
		navigatable: true,
		batch: true,
		columns:[{
			field: "title",
			title: "",
			headerAttributes: { "class": "sub-bgcolor" }, 
			width: 75,
		}, {
			field: "value",
			title: "",
			headerAttributes: { "class": "sub-bgcolor" }, 
			width: 100,
			editor: apcom.editorField,
			template: function(d){
				if(d.title == "Date" && d.value != ""){
					return moment(d.value).format('DD-MMM-YYYY')
				}else{
					return d.value
				}
				return ""
			}
		}],

	});


	$("#grid2").html("");
	$("#grid2").kendoGrid({
		dataSource: {
			data: apcom.dataBasisRecommendation(),
			schema:{
				model:{
					id: "title",
					fields: {
						title:{editable: false,},
						value:{editable: true},
					}
				}
			}
		},

		resizable: true,
		editable: true,
		navigatable: true,
		batch: true,
		columns:[
			{
				field: "title",
				title: "",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 85,
			},
			{
				field: "value",
				title: "",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 100,
				editor: apcom.editorFieldInput,
				template: function(d){
					if(d.title == "Date" && d.value != ""){
						return moment(d.value).format('DD-MMM-YYYY')
					}else{
						return d.value
					}
					return ""
				}
			}

		],

	});

	var grid1Data = apcom.dataTempRiskMitigants()
	if (grid1Data.length == 0) {
		grid1Data = [{ Risks: "", Mitigants: "" }]
	}

	$("#grid1").html("");
	$("#grid1").kendoGrid({
		dataSource: {
			data: grid1Data,
			schema:{
				model:{
					id: "Risks",
					fields: {
						Risks:{editable: true,},
						Mitigants:{editable: true},
					}
				}
			}
		},
    	scrollable: false,
		resizable: true,
		editable: true,
		dataBound: function(){
			$("#grid1").find(".tooltipster").tooltipster({
                trigger: 'hover',
                theme: 'tooltipster-val',
                animation: 'grow',
                delay: 0,
            });

            $('#grid1 .k-grid-content tr:gt(0)').each(function (i, e) {
            	$(e).find('td:last button:first').css('visibility', 'hidden')
            })
		},
		navigatable: true,
		batch: true,
		columns:[
			{
				field: "Risks",
				title: "Risk / Concerns",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 100,
				editor: apcom.LoadRiskInput,
				template: function(d){

					return d.Risks
				}
			},
			{
				field: "Mitigants",
				title: "Mitigants",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 100,
				editor: apcom.LoadMitigantInput,
				template: function(d){

					return d.Mitigants
				}
			},
			{
				// title: '<input type="radio" name="gender" value="male">',
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 30,
				template: function(d){
					return [
						'<center>',
							'<button class="btn btn-xs btn-primary tooltipster inbtn" title="Add" onclick="apcom.addRowRiskMitigants()"><i class="fa fa-plus"></i></button>',
							'&nbsp;',
							'<button class="btn btn-xs btn-danger tooltipster inbtn" title="Remove" onclick="apcom.removeRowRiskMitigants(\''+d.uid+'\')"><i class="fa fa-trash"></i></button>',
						'</center>'
					].join('')
				}
			}

		],

	});
}

apcom.addRowRiskMitigants = function(){
	var allData = $("#grid1").data("kendoGrid").dataSource.data();
	var data = {
		Risks: "", 
		Mitigants: ""
	};
	allData.push(data)
}

apcom.showComments= function(){
	$('.chartscroll').animate({ scrollTop: $('.appComment').offset().top - 250 }, 'slow')
}

apcom.removeRowRiskMitigants = function(d){
	swal({
		title: 'Are you sure want to delete?',
		type: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Yes',
		cancelButtonText: 'No',
	}).then(function() {
		var index = $('#grid1 tr[data-uid="'+d+'"]').index();
		var allData = $('#grid1').data('kendoGrid').dataSource.data();
		allData.splice(index, 1);
	}, function(dismiss) {

		if (dismiss === 'cancel') {
			// console.log("dismiss");
		}
	});
}

apcom.LoadMitigantInput = function(container, options){
	$('<textarea style="width: 96%;" data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"></textarea>')
		.appendTo(container);
}

apcom.LoadRiskInput = function(container, options){
	$('<textarea style="width: 96%;" data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"></textarea>')
		.appendTo(container);
}

function getComments(){
	setTimeout(apcom.loadCommentData(), 200)
}