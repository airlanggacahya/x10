var intrtr ={}

window.refreshFilter = function () {
	intrtr.getData();
	setTimeout(function(){
		intrtr.loadGrid();
	}, 500)
	
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
	$("#topgrid").html("");
	$("#topgrid").kendoGrid({
		dataSource:  {
			data : data.DataTop
		},
		scrollable:true,
		columns:[
			{
				title: "Internal RTR Snapshot",
				columns:[
					{	
                		field:"ActiveLoans",
                		title: "No. of Active Loans",
                		width: 100,
                		attributes: { style: 'background: rgb(238, 238, 238);' },
                	},
                	{
			        	field:"Accrued",
			        	title: "Amt Ounstanding (Accrued)",
			        	width:  100,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"Deliquent",
			        	title: "Amt Ounstanding (Deliquent)",
			        	width: 100,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },	
			        {
			        	field:"Outstand",
			        	title: "Total Amt Outstanding (Accrued and Deliquent)",
			        	width: 150,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"Delay",
			        	title: "No.Of Principal Repayment Delays",
			        	width: 125,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"Early",
			        	title: "No. Of Principal Repayment Early Closures",
			        	width: 145,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"DueDate",
			        	title: "Number of Payment on due date",
			        	width: 125,
			        	attributes: { style: 'background: rgb(238, 238, 238)' },
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
			        	field:"Max",
			        	title: "Maximum",
			        	width: 65,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			      	{
			        	field:"Min",
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
                		field:"Loan",
                		title: "Max. DPD in Closed Loan in Days",
                		width: 125,
                		attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
                	},
			        {
			        	field:"Amount",
			        	title: "Max. DPD in Closed Loan in Amount",
			        	width: 125,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"AverageDPD",
			        	title: "Avg DPD Days",
			        	width: 70,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
				]
			}
		]
	});

	$("#unselect").html("");
    $("#unselect").kendoGrid({
        dataSource : data.DataFilter,
        columns:[
        		{
        	 	title:"Deal List",
                headerAttributes: { class: "header-bgcolor" },
                columns:[
                	{
			        	title: "",
			        	width: 100,
			        	template: function(d){
			        		var a ='';
			        		if(intrtr.showDetails() == false){
			        			a = "<button class='btn btn-sm btn-flat btn-primary' onclick='intrtr.getDetails()'>Show Details</button>"
			        		}else{
			        			a = "<button class='btn btn-sm btn-flat btn-primary' onclick='intrtr.getHideDetails()'>Hide Details</button>"
			        		}
			        		return a
			        	}
			        },
                	{	
                		field:"dealno",
                		title: "Deal No",
                		attributes: { style: 'background: rgb(238, 238, 238)' },
                	},
			        {
			        	field:"product",
			        	title: "Product",
			        	attributes: { style: 'background: rgb(238, 238, 238)' },
			        },
			        {
			        	field:"scheme",
			        	title: "Scheme",
			        	attributes: { style: 'background: rgb(238, 238, 238)' },
			        },
			        {
			        	field:"approval",
			        	title: "Deal Approval Date",
			        	attributes: { style: 'background: rgb(238, 238, 238)' },
			        },
			        {
			        	field:"validiy",
			        	title: "Deal Validity Date",
			        	attributes: { style: 'background: rgb(238, 238, 238)' },
			        },
			        {
			        	field:"amount",
			        	title: "Loan Amount",
			        	attributes: { style: 'background: rgb(238, 238, 238)' },
			        },
			        	
                ]
	        }
	        	
        ]
    });

	$("#bottomgrid").html("");
	$("#bottomgrid").kendoGrid({
		dataSource:  {
			data : data.DataBottom
		},
		columns:[
			{
				title: "Details",
				columns:[
					{	
                		field:"ActiveLoans",
                		title: "No. of Active Loans",
                		width: 100,
                		attributes: { style: 'background: rgb(238, 238, 238);' },
                	},
                	{
			        	field:"Accrued",
			        	title: "Amt Ounstanding (Accrued)",
			        	width:  100,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"Deliquent",
			        	title: "Amt Ounstanding (Deliquent)",
			        	width: 100,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },	
			        {
			        	field:"Outstand",
			        	title: "Total Amt Outstanding (Accrued and Deliquent)",
			        	width: 150,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"Delay",
			        	title: "No.Of Principal Repayment Delays",
			        	width: 125,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"Early",
			        	title: "No. Of Principal Repayment Early Closures",
			        	width: 145,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"DueDate",
			        	title: "Number of Payment on due date",
			        	width: 125,
			        	attributes: { style: 'background: rgb(238, 238, 238)' },
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
			        	field:"Max",
			        	title: "Maximum",
			        	width: 65,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			      	{
			        	field:"Min",
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
                		field:"Loan",
                		title: "Max. DPD in Closed Loan in Days",
                		width: 125,
                		attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
                	},
			        {
			        	field:"Amount",
			        	title: "Max. DPD in Closed Loan in Amount",
			        	width: 125,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
			        {
			        	field:"AverageDPD",
			        	title: "Avg DPD Days",
			        	width: 70,
			        	attributes: { style: 'background: rgb(238, 238, 238);text-align: right;' },
			        },
				]
			}
		]
	});
}



$(function(){
	setTimeout(function(){
		intrtr.loadGrid();
	}, 500)
	$('.collapsibleDue').collapsible({
      accordion : true
    });
	
});