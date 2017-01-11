var databrowser = {};
databrowser.applicantdetailcoll = [{
	field : "CA.applicantdetail.CustomerRegistrationNumber",
	title : "Registration Number",
	hidden : false
},
{
	field : "CA.applicantdetail.CustomerPan",
	title : "PAN",
	hidden : false
},
{
	field : "CA.applicantdetail.CustomerName",
	title : "Customer Name",
	hidden : true
},
{
	field : "CA.applicantdetail.DateOfIncorporation",
	title : "Date of Incorporation",
	hidden : true
},
{
	field : "CA.applicantdetail.CustomerConstitution",
	title : "Constitution of the Entity",
	hidden : true
},
{
	field : "CA.applicantdetail.TIN",
	title : "TIN",
	hidden : true
},
{
	field : "CA.applicantdetail.TAN",
	title : "TAN",
	hidden : true
},
{
	field : "CA.applicantdetail.CIN",
	title : "CIN",
	hidden : true
},
]

databrowser.nonrefundcoll = [
{
	field : "CA.nonrefundableprocessingfeesdetails.InstrumentType",
	title : "Instrument Type",
	hidden : true
},
{
	field : "CA.nonrefundableprocessingfeesdetails.InstrumentNo",
	title : "Instrument No",
	hidden : true
},
{
	field : "CA.nonrefundableprocessingfeesdetails.InstrumentDate",
	title : "Instrument Date",
	hidden : true
},
{
	field : "CA.nonrefundableprocessingfeesdetails.BankName",
	title : "Bank Name",
	hidden : false
},
{
	field : "CA.nonrefundableprocessingfeesdetails.Amount",
	title : "Amount",
	hidden : false
},
]

databrowser.accsetupcoll = [
{
	field : "AD.accountsetupdetails.cityname",
	title : "City Name",
	hidden : false
},
{
	field : "AD.accountsetupdetails.logindate",
	title : "Login Date",
	hidden : false
},
{
	field : "AD.accountsetupdetails.rmname",
	title : "RM Name",
	hidden : true
},
{
	field : "AD.accountsetupdetails.brhead",
	title : "Branch Head",
	hidden : true
},
{
	field : "AD.accountsetupdetails.creditanalyst",
	title : "Credit Analyst",
	hidden : true
},
{
	field : "AD.accountsetupdetails.leaddistributor",
	title : "Lead Distributor",
	hidden : true
},
{
	field : "AD.accountsetupdetails.product",
	title : "Product",
	hidden : true
},
{
	field : "AD.accountsetupdetails.scheme",
	title : "Scheme",
	hidden : true
},
{
	field : "AD.accountsetupdetails.dealno",
	title : "Deal No",
	hidden : true
},
]


databrowser.loandetailscoll = [
{
	field : "AD.loandetails.proposedloanamount",
	title : "Requested Loan Amount",
	hidden : false
},
{
	field : "AD.loandetails.limittenor",
	title : "Limit Tenor (Months)",
	hidden : true
},
{
	field : "AD.loandetails.proposedrateinterest",
	title : "Proposed Rate of Interest (ROI) %",
	hidden : true
},
{
	field : "AD.loandetails.interestoutgo",
	title : "Proposed X10 Interest Outgo in (Rs. Lacs)",
	hidden : true
},
{
	field : "AD.loandetails.requestedlimitamount",
	title : "Proposed Amount of Limit (Rs. Lacs)",
	hidden : false
},
{
	field : "AD.loandetails.loantenordays",
	title : "Loan Tenor (Days)",
	hidden : true
},
{
	field : "AD.loandetails.proposedpfee",
	title : "Proposed Processing Fee %",
	hidden : true
},
{
	field : "AD.loandetails.ifexistingcustomer",
	title : "Existing Customer",
	hidden : false
},
];

databrowser.fullcoll = [
 {
 	title : "Sr. No",
 	field : ""
 },
 {
 	title : "Name of the Customer",
 	field : "CA.applicantdetail.CustomerName"
 },
 {
 	title : "Applicant Details",
 	columns : databrowser.applicantdetailcoll,
 	headerTemplate : function(dt){
 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "applicant" +"\")'>Applicant Details >></a>"
 	}
 },
 {
 	title : "Financial Information",
 	columns : [
 	{
 		title : "Previous Loan Details",
 		template :  function(dt){
 			return "<button onclick='databrowser.GoPrev(\""+ dt.CA._id +"\")'> Click to view details</button>"
 		} 
 	},
 	{
 		title : "Details Pertaining to Bankers / FIs",
 		template :  function(dt){
 			return "<button onclick='databrowser.GoDet(\""+ dt.CA._id +"\")'> Click to view details</button>"
 		} 
 	},
 	{
 		title : "Existing Relationship With X10 Financial Services Limited",
 		template :  function(dt){
 			return "<button onclick='databrowser.GoExis(\""+ dt.CA._id +"\")'> Click to view details</button>"
 		} 
 	},
 	]
 },
 {
 	title : "Non-Refundable Processing Fee Details",
 	columns : databrowser.nonrefundcoll,
 	headerTemplate : function(dt){
 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "nonrefund" +"\")'>Non-Refundable Processing Fee Details >></a>"
 	}
 }
 ,
 {
 	title : "Account Set-up Details",
 	columns : databrowser.accsetupcoll,
 	headerTemplate : function(dt){
 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "accsetup" +"\")'>Account Set-up Details >></a>"
 	}
 },
 {
 	title : "Loan Details",
 	columns : databrowser.loandetailscoll,
 	headerTemplate : function(dt){
 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "loandet" +"\")'>Loan Details >></a>"
 	}
 }
]

databrowser.statusexpand = {
	applicant : false,
	nonrefund : false,
	accsetup : false,
	loandet : false
}

databrowser.expand = function(text){
	if(text == "applicant"){
		if(databrowser.statusexpand[text]){
			databrowser.fullcoll[2].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "applicant" +"\")'>Applicant Details >></a>"
		 	}
			//close
		}else{
			databrowser.fullcoll[2].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "applicant" +"\")'>Applicant Details <<</a>"
		 	}
			//open
		}
	}else if (text == "nonrefund"){
		if(databrowser.statusexpand[text]){
			databrowser.fullcoll[4].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "nonrefund" +"\")'>Non-Refundable Processing Fee Details >></a>"
		 	}
			//close
		}else{
			databrowser.fullcoll[4].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "nonrefund" +"\")'>Non-Refundable Processing Fee Details <<</a>"
		 	}
			//open
		}
	}else if (text == "accsetup"){
		if(databrowser.statusexpand[text]){
			databrowser.fullcoll[5].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "accsetup" +"\")'>Account Set-up Details >></a>"
		 	}
			//close
		}else{
			databrowser.fullcoll[5].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "accsetup" +"\")'>Account Set-up Details <<</a>"
		 	}
			//open
		}
	}else if (text == "loandet"){
		if(databrowser.statusexpand[text]){
			databrowser.fullcoll[6].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "loandet" +"\")'>Loan Details >></a>"
		 	}
			//close
		}else{
			databrowser.fullcoll[6].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "loandet" +"\")'>Loan Details <<</a>"
		 	}
			//open
		}
	}
	databrowser.statusexpand[text] = !databrowser.statusexpand[text] 
	dbgrid.setOptions({ columns :  databrowser.fullcoll })
	dbgrid.refresh();
}

databrowser.GoPrev = function(id){
	console.log(id);
}
databrowser.GoDet = function(id){
	console.log(id);
}
databrowser.GoExis = function(id){
	console.log(id);
}

var dbgrid = ""

databrowser.GetDataGrid = function(){
	ajaxPost("/accountdetail/getdatabrowser",{ city : [], product : [], brhead : [], scheme : [], rm : ["Niranjan Gupta"], ca : [] }, function(data){
		dbgrid = $("#griddb").kendoGrid({
			 dataSource: {
			 	data : data.Data
			 },
			 columns : databrowser.fullcoll
		}).data("kendoGrid");
	})
}

$(document).ready(function(){
	databrowser.GetDataGrid();
})