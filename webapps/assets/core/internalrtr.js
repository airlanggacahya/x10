var intrtr ={}

intrtr.formVisibility = ko.observable(false)

window.refreshFilter = function () {
	intrtr.getData();
	// setTimeout(function(){
		// intrtr.loadGrid();
	// }, 500)

}

intrtr.templatetopData = {
	ActiveLoans: 0,
	Accrued: 0,
	Deliquent: 0,
	Outstand: 0,
	Delay: 0,
	Early: 0,
	DueDate: "29-9-2016",
	Average: 0,
	Max: 0,
	Min: 0,
	Loan: 0,
	Amount: 0,
	AverageDPD: 0,
}

intrtr.templatebottomData = {
	ActiveLoans: 0,
	Accrued: 0,
	Deliquent: 0,
	Outstand: 0,
	Delay: 0,
	Early: 0,
	DueDate: "29-9-2016",
	Average: 0,
	Max: 0,
	Min: 0,
	Loan: 0,
	Amount: 0,
	AverageDPD: 0,
}

intrtr.templateForm = {
	Id:"",
	CustomerId: "",
	DealNo: "",
	Product: "",
	Scheme: "",
	DataTop: [intrtr.templatetopData],
	DataBottom: [intrtr.templatebottomData],
	DataFilter: [],
	Status: 0,
	Freeze: false,
}

intrtr.form = ko.mapping.fromJS(intrtr.templateForm);

intrtr.optionDataAccountDetail = ko.observableArray([]);
intrtr.optionDataSnapshot = ko.observableArray([
	{noloans: "14572213887", accrued: "66", deliquent: "55",ounstand: "33", delay: "34", early: "66", duedate: "29-9-2016"}
]);
intrtr.optionDataUtilization = ko.observableArray([
	{average: "333333", max: "88888", min: "1111"}
]);

intrtr.optionDataDPD = ko.observableArray([
	{loan: "575758586", amount: "64657575", average: "7575758"}
]);

intrtr.showDetails = ko.observable(false);

intrtr.dataTemp = ko.observableArray([]);
intrtr.dataInternalSnapshot = ko.observableArray([]);
intrtr.dataInternalDealist = ko.observableArray([]);
intrtr.isFreeze = ko.observable();
intrtr.status = ko.observable();

intrtr.getData = function(){
	intrtr.optionDataAccountDetail([])
	var customerId = filter().CustomerSearchVal();
	var dealNo = filter().DealNumberSearchVal();
	var param = {
		CustomerId : customerId,
		DealNo : dealNo
	}
	ajaxPost("/accountdetail/getaccountdetailconfirmed", param, function(res){
		var data = res.Data;
		if(res.Message != ""){
			swal("Warning", res.Message, "warning");
		}
		// console.log(res)
		if(data != null){
			intrtr.formVisibility(true)
			intrtr.form.Product(data.AccountSetupDetails.Product);
			intrtr.form.Scheme(data.AccountSetupDetails.Scheme);

		}

	});
	intrtr.form.DataFilter([])
	$.each(filter().DealNumberSearchList(), function(i, items){

		if(items != filter().DealNumberSearchVal()){
			console.log(items)
			var par = {
				CustomerId : customerId,
				DealNo : items,
			}
			ajaxPost("/accountdetail/getaccountdetailconfirmed", par, function(res){
				var ondata = res.Data;
				console.log(res.Data)
				if(res.Data !== null){
					console.log(res.Data)
					intrtr.form.DataFilter.push({
						dealno: ondata.DealNo,
						product: ondata.AccountSetupDetails.Product,
						scheme: ondata.AccountSetupDetails.Scheme,
						approval: "21-9-2016",
						validiy	: "22-10-2016",
						amount: ondata.LoanDetails.RequestedLimitAmount
					})
				}else{
					intrtr.form.DataFilter.push({
						dealno: items,
						product: "",
						scheme: "",
						approval: "",
						validiy	: "",
						amount: "",
					})
				}

			})
		}
	});

	intrtr.getDataIntRTR(dealNo, customerId);

}

intrtr.getDataIntRTR = function(dealNo, customerId){
	var id = customerId +"|"+dealNo;
	var param = {
		Id : id
	}

	intrtr.dataTemp([])
	intrtr.dataInternalSnapshot([])
	intrtr.dataInternalDealist([])

	ajaxPost("/internalrtr/getdatainternalrtr", param, function(res){
		intrtr.status(0)
		if (res.Data != null && res.Data.length > 0 ){
			intrtr.dataTemp(res.Data[0]);
			intrtr.dataInternalSnapshot(res.Data[0].Snapshot);
			intrtr.dataInternalDealist(res.Data[0].Dealist);
			intrtr.isFreeze(res.Data[0].Isfreeze);
			intrtr.status(res.Data[0].Status);
			if(res.Data[0].Isfreeze == true){
				intrtr.isFreeze(true);
				$(".btn-confirm").prop("disabled", true);
			}else{
				intrtr.isFreeze(false);
				$(".btn-confirm").prop("disabled", false);
			}
		}

		intrtr.loadGrid();

	})
}

intrtr.getDetails = function(){
	intrtr.showDetails(true);
	intrtr.loadGrid()
}

intrtr.getHideDetails = function(){
	intrtr.showDetails(false);
	intrtr.loadGrid()
}


intrtr.loadGrid = function(){
	var data =  ko.mapping.toJS(intrtr.form);
	var data1 =  ko.mapping.toJS(intrtr.dataInternalSnapshot);
	var data2 =  ko.mapping.toJS(intrtr.dataInternalDealist);
	$("#topgrid").html("");
	$("#topgrid").kendoGrid({
		dataSource:  {
			data : data1
		},
		scrollable:true,
		columns:[
			{
				title: "Internal RTR Snapshot",
				columns:[
					{
                		field:"NoActiveLoan",
                		title: "No. of Active Loans",
                		width: 100,
                		attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
                	},
                	{
			        	field:"AmountOutstandingAccured",
			        	title: "Amt Ounstanding (Accured)",
			        	width:  100,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"AmountOutstandingDelinquent",
			        	title: "Amt Ounstanding (Deliquent)",
			        	width: 100,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"TotalAmount",
			        	title: "Total Amt Outstanding (Accrued and Deliquent)",
			        	width: 150,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"NPRDelays",
			        	title: "No.Of Principal Repayment Delays",
			        	width: 125,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"NPREarlyClosures",
			        	title: "No. Of Principal Repayment Early Closures",
			        	width: 145,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"NoOfPaymentDueDate",
			        	title: "Number of Payment on due date",
			        	width: 125,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
				],
			},
			{
				title: "Utilization",
				columns:[
					{
                		field:"Average",
                		title: "Average",
                		width: 65,
                		attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
                	},
			        {
			        	field:"Maximum",
			        	title: "Maximum",
			        	width: 65,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			      	{
			        	field:"Minimum",
			        	title: "Minimum",
			        	width: 65,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
				]
			},
			{
				title: "DPD Track",
				columns:[
					{
                		field:"MaxDPDDays",
                		title: "Max. DPD in Closed Loan in Days",
                		width: 125,
                		attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
                	},
			        {
			        	field:"MaxDPDDAmount",
			        	title: "Max. DPD in Closed Loan in Amount",
			        	width: 125,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"AVGDPDDays",
			        	title: "Avg DPD Days",
			        	width: 70,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
				]
			}
		],
		dataBound: intrtr.dataTopGridScroll  

	});
  


    $("#unselect").kendoGrid({
        dataSource : data2,
        columns:[
        		{
        	 	title:"Deal List",
                headerAttributes: { class: "header-bgcolor" },
                columns:[
           //      	{
			        // 	title: "",
			        // 	width: 100,
			        // 	template: function(d){
			        // 		var a ='';
			        // 		if(intrtr.showDetails() == false){
			        // 			a = "<button class='btn btn-sm btn-flat btn-primary' onclick='intrtr.getDetails()'>Show Details</button>"
			        // 		}else{
			        // 			a = "<button class='btn btn-sm btn-flat btn-primary' onclick='intrtr.getHideDetails()'>Hide Details</button>"
			        // 		}
			        // 		return "<button class='btn btn-sm btn-flat btn-primary' onclick='intrtr.getDetails()'>Show Details</button>"
			        // 	}
			        // },
                	{
                		field:"DealNo",
                		title: "Deal No",
                		attributes: { style: 'background: rgb(238, 238, 238)' },
                	},
			        {
			        	field:"Product",
			        	title: "Product",
			        	attributes: { style: 'background: rgb(238, 238, 238)' },
			        },
			        {
			        	field:"Scheme",
			        	title: "Scheme",
			        	attributes: { style: 'background: rgb(238, 238, 238)' },
			        },
			        {
			        	field:"AgreementDate",
			        	title: "Deal Approval Date",
			        	attributes: { style: 'background: rgb(238, 238, 238)' },
			        	template:function(e){ return kendo.toString(new Date(e.AgreementDate), "dd-MMM-yyyy");}
			        },
			        {
			        	field:"DealSanctionTillValidate",
			        	title: "Deal Validity Date",
			        	attributes: { style: 'background: rgb(238, 238, 238)' },
			        	template:function(e){ return kendo.toString(new Date(e.DealSanctionTillValidate), "dd-MMM-yyyy");}
			        },
			        {
			        	field:"TotalLoanAmount",
			        	title: "Loan Amount",
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        	template: function(e){
			        		return app.formatnum(e.TotalLoanAmount)
			        	}
			        },

                ]
	        }

        ],
        dataBound: intrtr.dataUnselectScroll  

    });

	// $("#bottomgrid").html("");
	// $("#bottomgrid").kendoGrid({
	// 	dataSource:  {
	// 		data : data2
	// 	},
	// 	columns:[
	// 		{
	// 			title: "Details",
	// 			columns:[
	// 				{
 //                		field:"ActiveLoans",
 //                		title: "No. of Active Loans",
 //                		width: 100,
 //                		attributes: { style: 'background: rgb(238, 238, 238);' },
 //                	},
 //                	{
	// 		        	field:"Accrued",
	// 		        	title: "Amt Ounstanding (Accrued)",
	// 		        	width:  100,
	// 		        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
	// 		        },
	// 		        {
	// 		        	field:"Deliquent",
	// 		        	title: "Amt Ounstanding (Deliquent)",
	// 		        	width: 100,
	// 		        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
	// 		        },
	// 		        {
	// 		        	field:"Outstand",
	// 		        	title: "Total Amt Outstanding (Accrued and Deliquent)",
	// 		        	width: 150,
	// 		        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
	// 		        },
	// 		        {
	// 		        	field:"Delay",
	// 		        	title: "No.Of Principal Repayment Delays",
	// 		        	width: 125,
	// 		        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
	// 		        },
	// 		        {
	// 		        	field:"Early",
	// 		        	title: "No. Of Principal Repayment Early Closures",
	// 		        	width: 145,
	// 		        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
	// 		        },
	// 		        {
	// 		        	field:"DueDate",
	// 		        	title: "Number of Payment on due date",
	// 		        	width: 125,
	// 		        	attributes: { style: 'background: rgb(238, 238, 238)' },
	// 		        },
	// 			],
	// 		},
	// 		{
	// 			title: "Utilization",
	// 			columns:[
	// 				{
 //                		field:"Average",
 //                		title: "Average",
 //                		width: 65,
 //                		attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
 //                	},
	// 		        {
	// 		        	field:"Max",
	// 		        	title: "Maximum",
	// 		        	width: 65,
	// 		        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
	// 		        },
	// 		      	{
	// 		        	field:"Min",
	// 		        	title: "Minimum",
	// 		        	width: 65,
	// 		        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
	// 		        },
	// 			]
	// 		},
	// 		{
	// 			title: "DPD Track",
	// 			columns:[
	// 				{
 //                		field:"Loan",
 //                		title: "Max. DPD in Closed Loan in Days",
 //                		width: 125,
 //                		attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
 //                	},
	// 		        {
	// 		        	field:"Amount",
	// 		        	title: "Max. DPD in Closed Loan in Amount",
	// 		        	width: 125,
	// 		        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
	// 		        },
	// 		        {
	// 		        	field:"AverageDPD",
	// 		        	title: "Avg DPD Days",
	// 		        	width: 70,
	// 		        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
	// 		        },
	// 			]
	// 		}
	// 	]
	// });
}

intrtr.dataTopGridScroll = function(){	
	var colspan = $("#topgrid thead").find("th").length;
	console.log(colspan);
	$("#topgrid[data-role='grid'] tbody").html("<tr><td colspan='" + colspan + "'></td></tr>");
    var grid = $("#topgrid").data("kendoGrid");
    grid.thead.closest(".k-grid-header-wrap").scrollLeft(0);
    grid.table.width(2000);          
    $(".k-grid-content").height(2 * kendo.support.scrollbar());
}

intrtr.dataUnselectScroll = function(){	
	var colspan2 = $("#unselect thead").find("th").length;
	$("#unselect[data-role='grid'] tbody").html("<tr><td colspan='" + colspan2 + "'></td></tr>");
    var grid2 = $("#unselect").data("kendoGrid");
    grid2.thead.closest(".k-grid-header-wrap").scrollLeft(0);
    grid2.table.width(2000);          
    $(".k-grid-content").height(2 * kendo.support.scrollbar());
}

intrtr.getConfirmed = function(status, isfreeze){
	if(intrtr.dataInternalSnapshot().length == 0 ){
		swal("Warning", "Data not found","warning")
		return
	}


	intrtr.dataTemp().Status = status;
	intrtr.dataTemp().Isfreeze = isfreeze;
	ajaxPost("/internalrtr/internalrtrconfirmed", intrtr.dataTemp(), function(res){
		if(res.IsError != true){
			intrtr.status(status)
			if(status == 1){
				swal("Confirm Data Success", "", "success");
			}else{
				swal("Re enter Data Success","","success");
			}
		}else{
			swal(res.Message, "","error");
		}
	});
}

intrtr.getFreeze = function(status, isfreeze){
	if(intrtr.dataInternalSnapshot().length == 0 ){
		swal("Warning", "Data not found","warning")
		return
	}

	intrtr.dataTemp().Status = status;
	intrtr.dataTemp().Isfreeze = isfreeze;
	intrtr.dataTemp().CustomerId = filter().CustomerSearchVal();
	intrtr.dataTemp().DealNo = filter().DealNumberSearchVal();
	if(intrtr.status() == 1){
		ajaxPost("/internalrtr/internalrtrconfirmed", intrtr.dataTemp(), function(res){
			if(res.IsError != true){
				if(isfreeze == true){
					intrtr.isFreeze(true);
					$(".btn-confirm").prop("disabled", true);
					swal("Freeze Data Success", "", "success");
				}else{
					intrtr.isFreeze(false);
					$(".btn-confirm").prop("disabled", false);
					swal("Unfreeze Data Success", "", "success");
				}
			}else{
				swal(res.Message, "","error");
			}
		});
	}else{
		swal("Please Confirm First", "", "warning");
	}
}


$(function(){
	// setTimeout(function(){
		// intrtr.loadGrid();
	// }, 500)
	$('.collapsibleDue').collapsible({
      accordion : true
    });

});