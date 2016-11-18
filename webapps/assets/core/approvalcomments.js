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
	Status: ko.observable(),
	CaStatus: {
		val: ko.observable(),
		SEND: 1,
		SAVE: 0
	}
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

apcom.loadCommentData = function(tayp){
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

	ajaxPost("/approval/getdcandcreditanalys" + (tayp != undefined ? tayp : ""), param, function(res){
		var data = res;
	    if(res.success != false){
			apcom.dataTempRiskMitigants([])
	    	if(data[0].CreditAnalys.CreditAnalysRisks == null){
	    		apcom.dataTempRiskMitigants( {Risks: "", Mitigants: ""} )
	    	} else {
	    		apcom.dataTempRiskMitigants(data[0].CreditAnalys.CreditAnalysRisks)
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
			apcom.CaStatus.val("")

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
		    apcom.CaStatus.val(data[0].CreditAnalys.Status)
	    }
	    apcom.loadSection();
	});
}

apcom.sendCreditAnalyst = function(a, event){
	apcom.formCreditAnalyst.CreditAnalysRisks([]);
	apcom.formCreditAnalyst.DealNo(r.customerId().split('|')[1])
	apcom.formCreditAnalyst.CustomerId(parseInt(r.customerId().split('|')[0]))
	var dataGrid = $("#grid1").data("kendoGrid").dataSource.data();

	_.each(dataGrid, function(items){
		apcom.formCreditAnalyst.CreditAnalysRisks.push(
			{ Risks: items.Risks, Mitigants: items.Mitigants }
		)
	});

	apcom.formCreditAnalyst.FinalComment.Amount(parseFloat(apcom.Amount()))
	apcom.formCreditAnalyst.FinalComment.RecommendedCondition(apcom.RecommendedCondition)
	apcom.formCreditAnalyst.FinalComment.Recommendations(apcom.Recommendations)
	
	var param = {
		Ca: ko.mapping.toJS(apcom.formCreditAnalyst),
		Status: _.find($(".btn-save.save"), function(btn){
			return btn == $(event.target)[0]
		}) != undefined ? apcom.CaStatus.SAVE : apcom.CaStatus.SEND
	}
	
	if(r.customerId().split('|')[0] != "" && r.customerId().split('|')[1] != ""){
		ajaxPost("/approval/savecreditanalys", param , function(res){
			if(res.success != true){
				swal("Error", res.message, "error")
			}else{
				if (param.Status == apcom.CaStatus.SAVE) {
					swal("Success", "Data Successfully Saved", "success");
				} else if (param.Status == apcom.CaStatus.SEND) {
					swal("Success", "Data Successfully Sent", "success");
				}
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

apcom.resetCreditAnalyst = function(){
	swal({
		title: "Are you sure you want to Reset?",
		text: "Reset will clear all the data entered",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: "Reset",
	}).then(function() {
		refreshFilter();
	}, function(dismiss) {
		if (dismiss === 'cancel') {
			console.log("dismiss");
		}
	});
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

	$("#grid1").html("");
	$("#grid1").kendoGrid({
		dataSource: {
			data: apcom.formCreditAnalyst.CreditAnalysRisks() != null && apcom.formCreditAnalyst.CreditAnalysRisks().length > 0 ? apcom.formCreditAnalyst.CreditAnalysRisks() : { Risks: "", Mitigants: "" },
			schema: {
				model: {
					id: "Risks",
					fields: {
						Risks: { editable: true },
						Mitigants: { editable: true },
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
		columns:[{
			field: "Risks",
			title: "Risk / Concerns",
			headerAttributes: { "class": "sub-bgcolor" }, 
			width: 100,
			editor: apcom.LoadRiskInput,
			template: function(d){
				try {
					return d.Risks()
				} catch(e){
					return d.Risks
				}
            }
        }, {
            field: "Mitigants",
            title: "Mitigants",
            headerAttributes: { "class": "sub-bgcolor" }, 
            width: 100,
            editor: apcom.LoadMitigantInput,
            template: function(d){
				try {
					return d.Mitigants()
				} catch(e){
					return d.Mitigants
				}
            }
		}, {
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
		}]
	});

	$("#gridriskconcersnmitigants").html("");
    $("#gridriskconcersnmitigants").kendoGrid({
        dataSource: {
            data: apcom.formCreditAnalyst.CreditAnalysRisks() != null && apcom.formCreditAnalyst.CreditAnalysRisks().length > 0 ? apcom.formCreditAnalyst.CreditAnalysRisks() : { Risks: "", Mitigants: "" }
        },
        scrollable: false,
        dataBound: function(){
            $("#gridriskconcersnmitigants").find(".tooltipster").tooltipster({
                trigger: 'hover',
                theme: 'tooltipster-val',
                animation: 'grow',
                delay: 0,
            });

            $('#gridriskconcersnmitigants .k-grid-content tr:gt(0)').each(function (i, e) {
                $(e).find('td:last button:first').css('visibility', 'hidden')
            })
        },
        batch: true,
        columns:[{
            field: "Risks",
            title: "Risk / Concerns",
            headerAttributes: { "class": "sub-bgcolor" }, 
            width: 100,
            editor: apcom.LoadRiskInput,
            template: function(d){
                return d.Risks == "" ? d.Risks : d.Risks()
            }
        }, {
            field: "Mitigants",
            title: "Mitigants",
            headerAttributes: { "class": "sub-bgcolor" }, 
            width: 100,
            editor: apcom.LoadMitigantInput,
            template: function(d){
                return d.Mitigants == "" ? d.Mitigants : d.Mitigants()
            }
        }]
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

function getComments(tayp){
	setTimeout(apcom.loadCommentData(tayp), 200)
}