var apcom = {}

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
apcom.dataTempRiskMitigants = ko.observableArray([
	
])
apcom.formCreditAnalyst = ko.mapping.fromJS(apcom.templateCreditAnalys)

apcom.loadCommentData = function(){
	apcom.loadSection();
	apcom.dataTempRiskMitigants([])
	var customerid = r.customerId().split('|')[0]
  	var dealno = r.customerId().split('|')[1]
	var param = {
		DealNo : dealno, 
		CustomerId: customerid,
	}
	ajaxPost("/accountdetail/getaccountdetail", param, function(res){
		
		var data = res.Data;
	    apcom.accountCommentFinancials(data.BorrowerDetails.CommentsonFinancials);
	    // console.log(apcom.accountCommentFinancials())
	})

	var url2 = "/approval/getdcandcreditanalys"
	var param2 ={
		DealNo : dealno, 
		CustomerId: customerid,
	}
	apcom.dataBasisRecommendation([])
	apcom.tempFinalComment([])
	ajaxPost(url2, param2, function(res){
		var data = res;
	    // console.log(data)
	    if(res.success != false){
	    	apcom.dataTempRiskMitigants(data[0].CreditAnalys.CreditAnalysRisks)
	    	if(apcom.dataTempRiskMitigants.length == 0){
	    		apcom.dataTempRiskMitigants({Risks: "", Mitigants: ""})
	    	}
		    ko.mapping.fromJS(data[0].CreditAnalys, apcom.formCreditAnalyst);
		    ko.mapping.fromJS(data[1].DCFinalSanction, apcom.sanction);
		    var arr = [
		    	{title: "Date", value: data[1].DCFinalSanction.Date},
				{title: "Amount", value: data[1].DCFinalSanction.Amount},
				{title: "ROI", value: data[1].DCFinalSanction.ROI},
				{title: "PF", value: data[1].DCFinalSanction.PF},
				{title: "PG", value: data[1].DCFinalSanction.PG},
				{title: "Security", value: data[1].DCFinalSanction.Security},
				{title: "Other Conditions", value: data[1].DCFinalSanction.OtherConditions},
				{title: "Committee Remarks", value: data[1].DCFinalSanction.CommitteeRemarks},
		    ]

		    var arr1 =[
		    	{title: "Amount", value: data[0].CreditAnalys.FinalComment.Amount},
				{title: "RecommendedCondition", value: data[0].CreditAnalys.FinalComment.RecommendedCondition},
				{title: "Recommendations", value: data[0].CreditAnalys.FinalComment.Recommendations}
		    ]
		    var falsedate = moment(arr[0].value).format('DD-MMM-YYYY');
		    // console.log(typeof falsedate); 
		    if( falsedate == "01-Jan-0001"){
		    	arr[0].value = "";
		    }
		    apcom.tempFinalComment(arr1)
		    apcom.dataBasisRecommendation(arr)
		    apcom.loadSection();
	    }else{
	    	// swal("Error", res.message, "error")
	    }
	    
	});
}

apcom.sendCreditAnalyst = function(){
	apcom.formCreditAnalyst.CreditAnalysRisks([]);
	apcom.formCreditAnalyst.DealNo(r.customerId().split('|')[1])
	apcom.formCreditAnalyst.CustomerId(parseInt(r.customerId().split('|')[0]))
	var dataGrid = $("#grid1").data("kendoGrid").dataSource.data();
	var dataGrid1 = $("#grid3").data("kendoGrid").dataSource.data();
	// console.log(dataGrid);
	$.each(dataGrid, function(i, items){
		apcom.formCreditAnalyst.CreditAnalysRisks.push(
			{Risks: items.Risks, Mitigants: items.Mitigants}
		)
	});
	apcom.formCreditAnalyst.FinalComment.Amount(dataGrid1[0].value)
	apcom.formCreditAnalyst.FinalComment.RecommendedCondition(dataGrid1[1].value)
	apcom.formCreditAnalyst.FinalComment.Recommendations(dataGrid1[2].value)
	var param = ko.mapping.toJS(apcom.formCreditAnalyst)
	// console.log(param.FinalComment.Amount)
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
	var dataGrid = $("#grid2").data("kendoGrid").dataSource.data();
	// console.log(dataGrid);
	apcom.sanction.Date(dataGrid[0].value)
	apcom.sanction.Amount(dataGrid[1].value)
	apcom.sanction.ROI(dataGrid[2].value)
	apcom.sanction.PF(dataGrid[3].value)
	apcom.sanction.PG(dataGrid[4].value)
	apcom.sanction.Security(dataGrid[5].value)
	apcom.sanction.OtherConditions(dataGrid[6].value)
	apcom.sanction.CommitteeRemarks(dataGrid[7].value)
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
	var dataGrid = $("#grid2").data("kendoGrid").dataSource.data();
	// console.log(dataGrid);
	apcom.sanction.Date(dataGrid[0].value)
	apcom.sanction.Amount(dataGrid[1].value)
	apcom.sanction.ROI(dataGrid[2].value)
	apcom.sanction.PF(dataGrid[3].value)
	apcom.sanction.PG(dataGrid[4].value)
	apcom.sanction.Security(dataGrid[5].value)
	apcom.sanction.OtherConditions(dataGrid[6].value)
	apcom.sanction.CommitteeRemarks(dataGrid[7].value)
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
	$(".caret1").click(function(){
		if($("#content1").is(':visible')){
			$("#content1").hide()
			if($("#caret1").hasClass('fa-caret-down')){
                $("#caret1").removeClass('fa-caret-down');
                $("#caret1").addClass('fa-caret-right');
             }else{
                $("#caret1").removeClass('fa-caret-right');
                $("#caret1").addClass('fa-caret-down');
            }
		}else{
			$("#content1").show()
			if($("#caret1").hasClass('fa-caret-right')){
                $("#caret1").removeClass('fa-caret-right');
                $("#caret1").addClass('fa-caret-down');
            }else{
                $("#caret1").removeClass('fa-caret-down');
                $("#caret1").addClass('fa-caret-right');
            }
		}
	})

	$(".caret2").click(function(){
		if($("#content2").is(':visible')){
			$("#content2").hide()
			if($("#caret2").hasClass('fa-caret-down')){
                $("#caret2").removeClass('fa-caret-down');
                $("#caret2").addClass('fa-caret-right');
             }else{
                $("#caret2").removeClass('fa-caret-right');
                $("#caret2").addClass('fa-caret-down');
            }
		}else{
			$("#content2").show()
			if($("#caret2").hasClass('fa-caret-right')){
                $("#caret2").removeClass('fa-caret-right');
                $("#caret2").addClass('fa-caret-down');
            }else{
                $("#caret2").removeClass('fa-caret-down');
                $("#caret2").addClass('fa-caret-right');
            }
		}
	});

	$(".caret3").click(function(){
		if($("#content3").is(':visible')){
			$("#content3").hide()
			if($("#caret3").hasClass('fa-caret-down')){
                $("#caret3").removeClass('fa-caret-down');
                $("#caret3").addClass('fa-caret-right');
             }else{
                $("#caret3").removeClass('fa-caret-right');
                $("#caret3").addClass('fa-caret-down');
            }
		}else{
			$("#content3").show()
			if($("#caret3").hasClass('fa-caret-right')){
                $("#caret3").removeClass('fa-caret-right');
                $("#caret3").addClass('fa-caret-down');
            }else{
                $("#caret3").removeClass('fa-caret-down');
                $("#caret3").addClass('fa-caret-right');
            }
		}
	});

	$(".caret4").click(function(){
		if($("#content4").is(':visible')){
			$("#content4").hide()
			if($("#caret4").hasClass('fa-caret-down')){
                $("#caret4").removeClass('fa-caret-down');
                $("#caret4").addClass('fa-caret-right');
             }else{
                $("#caret4").removeClass('fa-caret-right');
                $("#caret4").addClass('fa-caret-down');
            }
		}else{
			$("#content4").show()
			if($("#caret4").hasClass('fa-caret-right')){
                $("#caret4").removeClass('fa-caret-right');
                $("#caret4").addClass('fa-caret-down');
            }else{
                $("#caret4").removeClass('fa-caret-down');
                $("#caret4").addClass('fa-caret-right');
            }
		}
	});

	$("#grid3").html("");
	$("#grid3").kendoGrid({
		dataSource: {
			data:  apcom.tempFinalComment(),
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
		// edit: function (e) {
	 //        var fieldName = e.container.find("input").attr("name");
	 //        if(due.form.Freeze() == true || due.form.Status() == 1){
	 //        	this.closeCell();
	 //        }

		// },
		navigatable: true,
		batch: true,
		columns:[
			{
				field: "title",
				title: "",
				headerAttributes: { "class": "sub-bgcolor" }, 
				width: 75,
			},
			{
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
			}

		],

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
	$("#grid1").html("");
	$("#grid1").kendoGrid({
		dataSource: {
			data:  apcom.dataTempRiskMitigants(),
			schema:{
				model:{
					id: "Risk",
					fields: {
						Risk:{editable: true,},
						Mitigants:{editable: true},
					}
				}
			}
		},

		resizable: true,
		editable: true,
		// edit: function (e) {
	 //        var fieldName = e.container.find("input").attr("name");
	 //        if(due.form.Freeze() == true || due.form.Status() == 1){
	 //        	this.closeCell();
	 //        }

		// },
		dataBound: function(){
			$("#grid1").find(".tooltipster").tooltipster({
                trigger: 'hover',
                theme: 'tooltipster-val',
                animation: 'grow',
                delay: 0,
            });
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
					return '<center><span class="tooltipster inbtn" title="Remove" onclick="apcom.removeRowRiskMitigants(\''+d.uid+'\')"><i class="fa fa-times"></i></span></center>'
				},
				headerTemplate: '<center><span class="tooltipster inbtn" title="Add" onclick="apcom.addRowRiskMitigants()"><i class="fa fa-plus-square-o"></i></span></center>',
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

apcom. removeRowRiskMitigants = function(d){
	swal({
		title: 'Are you sure want to delete?',
		// text: 'You will not be able to recover this imaginary file!',
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
$(function(){
	$('.appComment').collapsible({
      accordion : true
    });
    
    apcom.loadSection();
    // apcom.loadCommentData();
}) 