var databrowser = {};
databrowser.applicantdetailcoll = [
 {
 	title : "Applicant",
 	field : "CA.applicantdetail.CustomerName",
	width : 200,
	headerAttributes: { "class": "sub-bgcolor" },
 },
 {
	field : "CA.applicantdetail.CustomerConstitution",
	title : "Constitution of the Entity",
	hidden : true,
	width : 100,
	headerTemplate : "Constitution of </br> the Entity",
	headerAttributes: { "class": "sub-bgcolor" },
 },
 {
	field : "CA.applicantdetail.CustomerRegistrationNumber",
	title : "Registration Number",
	hidden : false,
	width : 100,
	headerTemplate : "Registration </br> Number",
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "CA.applicantdetail.DateOfIncorporation",
	title : "Date of Incorporation",
	hidden : true,
	template : function(dt){
		if(dt.CA.applicantdetail.DateOfIncorporation == null || dt.CA.applicantdetail.DateOfIncorporation.indexOf("0001") > -1 ||  dt.CA.applicantdetail.DateOfIncorporation.indexOf("date") > -1){
			return "";
		}

		return moment(dt.CA.applicantdetail.DateOfIncorporation).format("DD-MMM-YYYY")
	},
	width : 100,
	headerTemplate : "Date of </br> Incorporation",
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "CA.applicantdetail.CustomerPan",
	title : "PAN",
	hidden : false,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
// {
// 	field : "CA.applicantdetail.CustomerName",
// 	title : "Customer Name",
// 	hidden : true,
// 	width : 100
// },
{
	field : "CA.applicantdetail.TIN",
	title : "TIN",
	hidden : true,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
// {
// 	field : "CA.applicantdetail.TAN",
// 	title : "TAN",
// 	hidden : true,
// 	width : 100,
// 	headerAttributes: { "class": "sub-bgcolor" },
// },
// {
// 	field : "CA.applicantdetail.CIN",
// 	title : "CIN",
// 	hidden : true,
// 	width : 100,
// 	headerAttributes: { "class": "sub-bgcolor" },
// },
{
	field : "",
	title : "Address",
	hidden : true,
	template : function(dt){
		return "<center><a style='cursor: pointer;' onclick='databrowser.GoAddress(\""+ dt.CA._id +"\")'>Show More</a></center>"
	},
	width : 100,
	headerTemplate : "Address",
	headerAttributes: { "class": "sub-bgcolor" },
},{
	field : "CA.applicantdetail.NatureOfBussiness",
	title : "Nature of Business",
	hidden : true,
	// template : function(dt){
	// 	return "<a style='cursor: pointer;' onclick='databrowser.GoAddress(\""+ dt.CA._id +"\")'>Details..</a>"
	// },
	width : 100,
	headerTemplate : "Nature of <br/> Business",
	headerAttributes: { "class": "sub-bgcolor" },
},{
	field : "CA.applicantdetail.UserGroupCompanies",
	title : "User Group Companies",
	hidden : true,
	// template : function(dt){
	// 	return "<a style='cursor: pointer;' onclick='databrowser.GoAddress(\""+ dt.CA._id +"\")'>Details..</a>"
	// },
	width : 200,
	headerTemplate : "User Group <br/> Companies",
	headerAttributes: { "class": "sub-bgcolor" },
},{
	field : "CA.applicantdetail.YearsInBusiness",
	title : "No of years in business",
	hidden : true,
	attributes:{style: "text-align: right"},
	// template : function(dt){
	// 	return "<a style='cursor: pointer;' onclick='databrowser.GoAddress(\""+ dt.CA._id +"\")'>Details..</a>"
	// },
	width : 100,
	headerTemplate : "No of years <br/> in business",
	headerAttributes: { "class": "sub-bgcolor" },
},{
	field : "CA.applicantdetail.NoOfEmployees",
	title : "No of employees",
	hidden : true,
	attributes:{style: "text-align: right"},
	// template : function(dt){
	// 	return "<a style='cursor: pointer;' onclick='databrowser.GoAddress(\""+ dt.CA._id +"\")'>Details..</a>"
	// },
	width : 100,
	headerTemplate : "No of <br/> employees",
	headerAttributes: { "class": "sub-bgcolor" },
},{
	field : "CA.applicantdetail.AmountLoan",
	title : "Requested loan amount",
	hidden : true,
	attributes:{style: "text-align: right"},
	// template : function(dt){
	// 	return "<a style='cursor: pointer;' onclick='databrowser.GoAddress(\""+ dt.CA._id +"\")'>Details..</a>"
	// },
	width : 100,
	headerTemplate : "Requested <br/> loan amount",
	headerAttributes: { "class": "sub-bgcolor" },
	template:function(d){
		return app.formatnum(d.CA.applicantdetail.AmountLoan)
	}
}
]

databrowser.nonrefundcoll = [
{
	field : "CA.nonrefundableprocessingfeesdetails.InstrumentType",
	title : "Instrument Type",
	hidden : true,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "CA.nonrefundableprocessingfeesdetails.InstrumentNo",
	title : "Instrument No",
	hidden : true,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "CA.nonrefundableprocessingfeesdetails.InstrumentDate",
	title : "Instrument Date",
	hidden : true,
	template : function(dt){
		if(dt.CA.nonrefundableprocessingfeesdetails.InstrumentDate == null || dt.CA.nonrefundableprocessingfeesdetails.InstrumentDate.indexOf("0001") > -1 ||  dt.CA.nonrefundableprocessingfeesdetails.InstrumentDate.indexOf("date") > -1){
			return "";
		}
		return moment(dt.CA.nonrefundableprocessingfeesdetails.InstrumentDate).format("DD-MMM-YYYY")
	},
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "CA.nonrefundableprocessingfeesdetails.BankName",
	title : "Bank Name",
	hidden : false,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "CA.nonrefundableprocessingfeesdetails.Amount",
	title : "Amount",
	hidden : false,
	width : 100,
	attributes:{style: "text-align: right"},
	headerAttributes: { "class": "sub-bgcolor" },
	template:function(dt){
		if(dt.CA.nonrefundableprocessingfeesdetails.Amount == null){
			return "";
		}
		return app.formatnum(dt.CA.nonrefundableprocessingfeesdetails.Amount)
	},
},
]

databrowser.accsetupcoll = [
// {
// 	field : "AD.accountsetupdetails.logindate",
// 	title : "Login Date",
// 	hidden : true,
// 	template : function(dt){
// 		if(dt.AD.accountsetupdetails.logindate == null || dt.AD.accountsetupdetails.logindate.indexOf("0001") > -1 ||  dt.AD.accountsetupdetails.logindate.indexOf("date") > -1){
// 			return "";
// 		}

// 		return moment(dt.AD.accountsetupdetails.logindate).format("DD-MMM-YYYY")
// 	},
// 	width : 100,
// 	headerAttributes: { "class": "sub-bgcolor" },
// },
{
	field : "AD.accountsetupdetails.cityname",
	title : "City Name",
	hidden : false,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "AD.accountsetupdetails.dealno",
	title : "Deal No",
	hidden : true,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "AD.accountsetupdetails.rmname",
	title : "RM Name",
	hidden : true,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "AD.accountsetupdetails.creditanalyst",
	title : "Credit Analyst",
	hidden : true,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
// {
// 	field : "AD.accountsetupdetails.brhead",
// 	title : "Branch Head",
// 	hidden : true,
// 	width : 100,
// 	headerAttributes: { "class": "sub-bgcolor" },
// },
{
	field : "AD.accountsetupdetails.leaddistributor",
	title : "Lead Distributor",
	hidden : true,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "AD.accountsetupdetails.product",
	title : "Product",
	hidden : false,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "AD.accountsetupdetails.scheme",
	title : "Scheme",
	hidden : false,
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
},
]


databrowser.loandetailscoll = [
{
	field : "AD.loandetails.proposedloanamount",
	title : "Requested Loan Amount",
	hidden : false,
	width : 100,
	headerTemplate : "Requested Loan </br> Amount",
	headerAttributes: { "class": "sub-bgcolor" },
	attributes:{style: "text-align: right"},
},
{
	field : "AD.loandetails.limittenor",
	title : "Limit Tenor (Months)",
	hidden : true,
	width : 100,
	headerTemplate : "Limit Tenor </br> (Months)",
	headerAttributes: { "class": "sub-bgcolor" },
	attributes:{style: "text-align: right"},
},
{
	field : "AD.loandetails.proposedrateinterest",
	title : "Proposed Rate of Interest (ROI) %",
	hidden : true,
	width : 120,
	headerTemplate : "Proposed Rate of </br> Interest (ROI) %",
	headerAttributes: { "class": "sub-bgcolor" },
	attributes:{style: "text-align: right"},
},
// {
// 	field : "AD.loandetails.interestoutgo",
// 	title : "Proposed X10 Interest Outgo in (Rs. Lacs)",
// 	hidden : true,
// 	width : 130,
// 	headerTemplate : "Proposed X10 Interest </br> Outgo in (Rs. Lacs)",
// 	headerAttributes: { "class": "sub-bgcolor" },
// },
{
	field : "AD.loandetails.requestedlimitamount",
	title : "Proposed Amount of Limit (Rs. Lacs)",
	hidden : false,
	width : 120	,
	headerTemplate : "Proposed Amount of </br> Limit (Rs. Lacs)",
	headerAttributes: { "class": "sub-bgcolor" },
	attributes:{style: "text-align: right"},
},
// {
// 	field : "AD.loandetails.loantenordays",
// 	title : "Loan Tenor (Days)",
// 	hidden : true,
// 	width : 100,
// 	headerTemplate : "Loan Tenor </br> (Days)",
// 	headerAttributes: { "class": "sub-bgcolor" },
// },
// {
// 	field : "AD.loandetails.proposedpfee",
// 	title : "Proposed Processing Fee %",
// 	hidden : true,
// 	width : 130,
// 	headerTemplate : "Proposed Processing </br> Fee %",
// 	headerAttributes: { "class": "sub-bgcolor" },
// },
{
	field : "AD.loandetails.ifexistingcustomer",
	title : "Existing Customer",
	hidden : false,
	width : 100,
	headerTemplate : "Existing </br> Customer",
	template : function(dt){
		if(dt.AD.loandetails.ifexistingcustomer){
			return "Yes"
		}

		return "No"
	},
	headerAttributes: { "class": "sub-bgcolor" },
},
{
	field : "AD.loandetails.ifyeseistinglimitamount",
	title : "If Yes, Existing Limit Amount",
	hidden : true,
	width : 100,
	headerTemplate : "If Yes, Existing <br/> Limit Amount",
	headerAttributes: { "class": "sub-bgcolor" },
	attributes:{style: "text-align: right"},
},
{
	field : "AD.loandetails.existingroi",
	title : "Existing ROI",
	hidden : true,
	width : 100,
	headerTemplate : "Existing ROI",
	headerAttributes: { "class": "sub-bgcolor" },
	attributes:{style: "text-align: right"},
},
{
	field : "AD.loandetails.existingpf",
	title : "Existing PF",
	hidden : true,
	width : 100,
	headerTemplate : "Existing PF",
	headerAttributes: { "class": "sub-bgcolor" },
	attributes:{style: "text-align: right"},
},
{
	field : "AD.loandetails.firstagreementdate",
	title : "First Agreement Date",
	hidden : true,
	width : 100,
	headerTemplate : "First Agreement <br/> Date",
	headerAttributes: { "class": "sub-bgcolor" },
	template: function(d){
		var date =  _.get(d, "AD.LoanDetails.FirstAgreementDate") || _.get(d, "AD.loandetails.firstagreementdate")
		// console.log("------->>>>",date)
		// return ''
		if(date.indexOf("0001-01-01T00:00:00Z") > -1){
			return ""
		}

		return kendo.toString(new Date(date), "dd-MMM-yyyy")
	}
},
{
	field : "AD.loandetails.recenetagreementdate",
	title : "Recent Agreement Date",
	hidden : true,
	width : 120,
	headerTemplate : "Recent Agreement <br/> Date",
	headerAttributes: { "class": "sub-bgcolor" },
	template: function(d){
		// console.log("------->>>>",d)
		var date =  _.get(d, "AD.LoanDetails.RecenetAgreementDate") || _.get(d, "AD.loandetails.recenetagreementdate")
		if(date.indexOf("0001-01-01T00:00:00Z") > -1){
			return ""
		}

		return kendo.toString(new Date(date), "dd-MMM-yyyy")
	}
},
{
	field : "AD.loandetails.vintagewithx10",
	title : "Vintage With X10 (in Months)",
	hidden : true,
	width : 100,
	headerTemplate : "Vintage With X10 <br/> (in Months)",
	headerAttributes: { "class": "sub-bgcolor" },
	attributes:{style: "text-align: right"},
},
];

databrowser.BorrowerDetails = [
{
	field : "AD.borrowerdetails.borrowerconstitution",
	title : "Borrower Constitution",
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
	headerTemplate: "Borrower <br/> Constitution"
}
]

databrowser.fullcoll = [
 {
	field : "CA.applicantdetail.DealNo",
	title : "Deal No",
	hidden : false,
	width : 150,
	headerAttributes: { "class": "sub-bgcolor" },
},
 {
 	title : "Applicant Details",
 	columns : databrowser.applicantdetailcoll,
 	headerTemplate : function(dt){
 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "applicant" +"\")'>Applicant Details <i class='fa fa-forward' aria-hidden='true'></i></a>"
 	},
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
 },
 {
 	title : "Financial Information",
 	columns : [
 	{
 		title : "Existing Relationship Details",
 		template :  function(dt){
 			return "<center><a style='cursor: pointer;' onclick='databrowser.GoExis(\""+ dt.CA._id +"\")'>Show More</a></center>"
 		},
		width : 120,
		headerTemplate : "Existing Relationship </br>Details",
	headerAttributes: { "class": "sub-bgcolor" },
 	},
 	],
	headerAttributes: { "class": "sub-bgcolor" },
 },
 {
 	title : "Non-Refundable Processing Fee Details",
 	columns : databrowser.nonrefundcoll,
 	headerTemplate : function(dt){
 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "nonrefund" +"\")'>Non-Refundable Processing </br>Fee Details <i class='fa fa-forward' aria-hidden='true'></a>"
 	},
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
 }
 ,
 {
 	title : "Details of Promoters/Directors/Guarantors/Management",
 	headerTemplate : "Details of </br>Promoters/Directors/Guarantors/Management",
 	columns : [
 		{
 			title : "Name",
 			template : function(dt){
 				var str = "<table class='intable'>";
 				for(var i in dt.CA.detailofpromoters.biodata){
 					if(dt.CA.detailofpromoters.biodata[i].Name == undefined){
 						break;
 					}

 					if(i==0){
 						str += "<tr>"
 						// str += "<td class='line' role='gridcell' id='"+ dt.CA._id.replace("|").replace("-") + dt.CA.detailofpromoters.biodata[i].Name.split(" ").join("") + i +"'>" + dt.CA.detailofpromoters.biodata[i].Name + "&nbsp; <a onclick='showthis(\""+  dt.CA._id.replace("|").replace("-") + dt.CA.detailofpromoters.biodata[i].Name.split(" ").join("") + i +"\")'><i class='fa fa-plus-square-o' style='font-size: 12px; color: rgb(22, 136, 70);'></i></a></td>"
 						str += "<td class='line' role='gridcell' id='"+ dt.CA._id.replace("|").replace("-") + dt.CA.detailofpromoters.biodata[i].Name.split(" ").join("") + i +"'>" + "<a onclick='showthis(\""+  dt.CA._id.replace("|").replace("-") + dt.CA.detailofpromoters.biodata[i].Name.split(" ").join("") + i +"\")'><i class='fa fa-plus-square-o' style='font-size: 12px; color: rgb(22, 136, 70);'></i></a>&nbsp;&nbsp;&nbsp;"+ dt.CA.detailofpromoters.biodata[i].Name +"</td>"
 						str+="</tr>"
 					}else{
 						str += "<tr class='hiddentd'>"
 						str += "<td class='line' role='gridcell'  id='"+  dt.CA._id.replace("|").replace("-") + dt.CA.detailofpromoters.biodata[i].Name.split(" ").join("") + i +"'>" + dt.CA.detailofpromoters.biodata[i].Name + "</td>"
 						str+="</tr>"
 					}

 				}
 				str += "</table>";
 				return str;
 			},
			width : 150,
	headerAttributes: { "class": "sub-bgcolor" },
 		},
 		{
 			title : "Guarantor",
 			template : function(dt){
 				var str = "<table class='intable'>";
 				for(var i in dt.CA.detailofpromoters.biodata){
 					var elem = "<tr>";

 					if(i != 0){
						elem = "<tr class='hiddentd'>"
 					}

 					if(dt.CA.detailofpromoters.biodata[i].Guarantor === null) {
 						str += elem+"<td></td></tr>"
 					} else if(typeof dt.CA.detailofpromoters.biodata[i].Guarantor === 'undefined'){ 						
 						break;
 					} else {
 						str += elem				
 			
	 					if(typeof dt.CA.detailofpromoters.biodata[i].Guarantor === 'string'){
	 						str += "<td>" + dt.CA.detailofpromoters.biodata[i].Guarantor +"</td>"
	 					} else if (typeof dt.CA.detailofpromoters.biodata[i].Guarantor === 'boolean'){
	 						if(dt.CA.detailofpromoters.biodata[i].Guarantor){
		 						str += "<td class='line'>Yes</td>"
			 				}else{
			 					str += "<td class='line'>No</td>"
			 				}
	 					} 
	 					
	 					str+="</tr>"
 					}
 					
 				}

 				str += "</table>";
 				return str;
 			},
			width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
 		},
 		{
 			title : "Promoter",
 			template : function(dt){
 				var str = "<table class='intable'>";
 				for(var i in dt.CA.detailofpromoters.biodata){
 					var elem = "<tr>";

 					if(i != 0){
						elem = "<tr class='hiddentd'>"
 					}

 					if(dt.CA.detailofpromoters.biodata[i].Promotor === null) {
 						str += elem+"<td></td></tr>"
 					} else if(typeof dt.CA.detailofpromoters.biodata[i].Promotor === 'undefined'){ 						
 						break;
 					} else {
 						str += elem				
 			
	 					if(typeof dt.CA.detailofpromoters.biodata[i].Promotor === 'string'){
	 						str += "<td>"+ dt.CA.detailofpromoters.biodata[i].Promotor +"</td>"
	 					} else if (typeof dt.CA.detailofpromoters.biodata[i].Promotor === 'boolean'){
	 						if(dt.CA.detailofpromoters.biodata[i].Promotor){
		 						str += "<td class='line'>"+"Yes</td>"
			 				}else{
			 					str += "<td class='line'>"+"No</td>"
			 				}
	 					} 
	 					
	 					str+="</tr>"
 					}
 					
 				}
 				str += "</table>";
 				return str;
 			},
			width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
 		},
 		{
 			title : "Director",
 			template : function(dt){
 				var str = "<table class='intable'>";
 				for(var i in dt.CA.detailofpromoters.biodata){
 					var elem = "<tr>";

 					if(i != 0){
						elem = "<tr class='hiddentd'>"
 					}

 					if(dt.CA.detailofpromoters.biodata[i].Director === null) {
 						str += elem+"<td></td></tr>"
 					} else if(typeof dt.CA.detailofpromoters.biodata[i].Director === 'undefined'){ 						
 						break;
 					} else {
 						str += elem				
 			
	 					if(typeof dt.CA.detailofpromoters.biodata[i].Director === 'string'){
	 						str += "<td>"+ dt.CA.detailofpromoters.biodata[i].Director +"</td>"
	 					} else if (typeof dt.CA.detailofpromoters.biodata[i].Director === 'boolean'){
	 						if(dt.CA.detailofpromoters.biodata[i].Director){
		 						str += "<td class='line'>Yes</td>"
			 				}else{
			 					str += "<td class='line'>No</td>"
			 				}
	 					} 
	 					
	 					str+="</tr>"
 					}
 					
 				}
 				str += "</table>";
 				return str;
 			},
			width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
 		},
 		{
 			title : "Details",
 			template : function(dt){ 
 				var str = "<table class='intable'>";


 				for(var i in dt.CA.detailofpromoters.biodata){
 					if(dt.CA.detailofpromoters.biodata[i].Name == undefined){
 						break;
 					}

 					var elem = "<tr>";

 					if(i != 0){
						elem = "<tr class='hiddentd'>"
 					}
 					str += elem

 					
 				str += "<td class='line'><a style='cursor: pointer;' onclick='databrowser.GoProm(\""+ dt.CA._id +"\",\""+ dt.CA.detailofpromoters.biodata[i].Name +"\")'>Show More</a></td>" 
 					str+="</tr>"

 			}
 			str += "</table>";
 				return str;
 			},
			width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
 		},
 	],
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
 },
 {
 	title : "Details of <br/> Reference",
	width : 100,
	template: function(dt){
		return "<center><a onclick='databrowser.GoReference(\""+ dt.CA._id +"\")'>Show More<a></center>"
	},
	headerAttributes: { "class": "sub-bgcolor" },
 },
 {
 	title : "Account Set-up Details",
 	columns : databrowser.accsetupcoll,
 	headerTemplate : function(dt){
 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "accsetup" +"\")'>Account Set-up Details <i class='fa fa-forward' aria-hidden='true'></a>"
 	},
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
 },
 {
 	title : "Borrower Details",
	width : 100,
	columns : databrowser.BorrowerDetails,
	headerTemplate: "Borrower Details",
	headerAttributes: { "class": "sub-bgcolor" },
 },
 {
 	title : "Loan Details",
 	columns : databrowser.loandetailscoll,
 	headerTemplate : function(dt){
 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "loandet" +"\")'>Loan Details <i class='fa fa-forward' aria-hidden='true'></a>"
 	},
	width : 100,
	headerAttributes: { "class": "sub-bgcolor" },
 }
]

databrowser.statusexpand = {
	applicant : false,
	nonrefund : false,
	accsetup : false,
	loandet : false
}

databrowser.expand = function(text){
	
	if (text == "applicant"){
		if(databrowser.statusexpand[text]){
			databrowser.fullcoll[1].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "applicant" +"\")'>Applicant Details <i class='fa fa-forward' aria-hidden='true'></a>"
		 	}
		 	for(var i in databrowser.applicantdetailcoll){
		 		databrowser.applicantdetailcoll[i].hidden = true;
		 	}

		 	databrowser.applicantdetailcoll[0].hidden = false;
		 	databrowser.applicantdetailcoll[1].hidden = false;
		 	databrowser.fullcoll[1].columns = databrowser.applicantdetailcoll;

			//close
		}else{
			databrowser.fullcoll[1].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "applicant" +"\")'>Applicant Details <i class='fa fa-backward' aria-hidden='true'></a>"
		 	}

		 	for(var i in databrowser.applicantdetailcoll){
		 		databrowser.applicantdetailcoll[i].hidden = false;
		 	}
		 	databrowser.fullcoll[1].columns = databrowser.applicantdetailcoll;
			//open
		}
	}else if (text == "nonrefund"){
		if(databrowser.statusexpand[text]){
			databrowser.fullcoll[3].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "nonrefund" +"\")'>Non-Refundable Processing </br> Fee Details <i class='fa fa-forward' aria-hidden='true'></a>"
		 	}

			for(var i in databrowser.nonrefundcoll){
		 		databrowser.nonrefundcoll[i].hidden = true;
		 	}

		 	databrowser.nonrefundcoll[3].hidden = false;
		 	databrowser.nonrefundcoll[4].hidden = false;
		 	databrowser.fullcoll[3].columns = databrowser.nonrefundcoll;

			//close
		}else{
			databrowser.fullcoll[3].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "nonrefund" +"\")'>Non-Refundable Processing </br> Fee Details <i class='fa fa-backward' aria-hidden='true'></a>"
		 	}

		 	for(var i in databrowser.nonrefundcoll){
		 		databrowser.nonrefundcoll[i].hidden = false;
		 	}
		 	databrowser.fullcoll[3].columns = databrowser.nonrefundcoll;
			//open
		}
	}else if (text == "accsetup"){
		if(databrowser.statusexpand[text]){
			databrowser.fullcoll[6].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "accsetup" +"\")'>Account Set-up Details <i class='fa fa-forward' aria-hidden='true'></a>"
		 	}

		 	for(var i in databrowser.accsetupcoll){
		 		databrowser.accsetupcoll[i].hidden = true;
		 	}

		 	databrowser.accsetupcoll[0].hidden = false;
		 	databrowser.accsetupcoll[1].hidden = false;
		 	databrowser.fullcoll[6].columns = databrowser.accsetupcoll;

			//close
		}else{
			databrowser.fullcoll[6].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "accsetup" +"\")'>Account Set-up Details <i class='fa fa-backward' aria-hidden='true'></a>"
		 	}

		 	for(var i in databrowser.accsetupcoll){
		 		databrowser.accsetupcoll[i].hidden = false;
		 	}
		 	databrowser.fullcoll[6].columns = databrowser.accsetupcoll;
			//open
		}
	
	}else if (text == "loandet"){
		if(databrowser.statusexpand[text]){
			databrowser.fullcoll[8].headerTemplate = function(dt){
		 		return "<a id='on1' class='grid-select' href='javascript:databrowser.expand(\""+ "loandet" +"\")'>Loan Details <i class='fa fa-forward' aria-hidden='true'></a>"
		 	}

		 	for(var i in databrowser.loandetailscoll){
		 		databrowser.loandetailscoll[i].hidden = true;
		 	}

		 	databrowser.loandetailscoll[0].hidden = false;
		 	databrowser.loandetailscoll[4].hidden = false;
		 	databrowser.loandetailscoll[7].hidden = false;
		 	databrowser.fullcoll[8].columns = databrowser.loandetailscoll;

			//close
		}else{
			databrowser.fullcoll[8].headerTemplate = function(dt){
		 		return "<a class='grid-select' href='javascript:databrowser.expand(\""+ "loandet" +"\")'>Loan Details <i class='fa fa-backward' aria-hidden='true'></a>"
		 	}

		 	for(var i in databrowser.loandetailscoll){
		 		databrowser.loandetailscoll[i].hidden = false;
		 	}
		 	databrowser.fullcoll[8].columns = databrowser.loandetailscoll;
			//open
		}
	}
	var scr = $('#griddb .k-grid-content').scrollLeft();
	databrowser.statusexpand[text] = !databrowser.statusexpand[text] 
	dbgrid.setOptions({ columns :  databrowser.fullcoll })
	dbgrid.refresh();
		if(databrowser.statusexpand[text])
			$('#griddb .k-grid-content').scrollLeft(scr+100);
		else{
			$('#griddb .k-grid-content').scrollLeft(scr);
	}
}

databrowser.GoPrev = function(id){
	var ids=id.split("|");
	 window.open("/datacapturing/customerprofileinfo?customerid="+ids[0]+"&dealno="+ids[1]+"&scrollto=Previous Loan Details (Non X10 loans)")
}
databrowser.GoDet = function(id){
	var ids=id.split("|");
	 window.open("/datacapturing/customerprofileinfo?customerid="+ids[0]+"&dealno="+ids[1]+"&scrollto=Details Pertaining to Bankers")
}
databrowser.GoExis = function(id){
	var ids=id.split("|");
	 window.open("/datacapturing/customerprofileinfo?customerid="+ids[0]+"&dealno="+ids[1]+"&scrollto=Existing Relationship With X10")
}

databrowser.GoProm = function(id,name){
	var ids=id.split("|");
	 window.open("/datacapturing/customerprofileinfo?customerid="+ids[0]+"&dealno="+ids[1]+"&scrolltoinp="+name)
}

databrowser.GoAddress = function(id,name){
	var ids=id.split("|");
	 window.open("/datacapturing/customerprofileinfo?customerid="+ids[0]+"&dealno="+ids[1]+"&scrollto=Company Address Details")
}

databrowser.GoReference = function(id){
	var ids=id.split("|");
	window.open("/datacapturing/customerprofileinfo?customerid="+ids[0]+"&dealno="+ids[1]+"&scrollto=Details of Reference")
}

var dbgrid = ""

databrowser.GetDataGrid = function(){
	var opr = (filters.dataRating()).split(" ");
	// console.log("------>>>", opr)
	if(opr.length > 2){
		var param = {
			customer : filters.CustomerVal(),
			dealno : filters.DealNoVal(), 
			rating1 : opr[1], 
			ratingopr1 : rangeIR(opr[0]),
			rating2 : opr[3], 
			ratingopr2 : rangeIR(opr[2]),
			loanamount : filters.ddRLARangesVal() != "" ? filters.inputRLARangeVal() : "",
			loanamountopr : filters.ddRLARangesVal() != "" ? filters.ddRLARangesVal() : "", 
			city : filters.CityVal(), 
			product : filters.ProductVal(), 
			brhead : filters.BRHeadVal(), 
			scheme : filters.SchemeVal(), 
			rm : filters.RMVal(), 
			ca : filters.CAVal(),
			logindate: filters.loginDateVal
		}
	}else{
		var param = {
			customer : filters.CustomerVal(),
			dealno : filters.DealNoVal(), 
			rating1 : opr.length != 1 ? opr[1] : "", 
			ratingopr1 : opr.length != 1 ? rangeIR(opr[0]) : "",
			rating2 : "", 
			ratingopr2 : "",
			loanamount : filters.ddRLARangesVal() != "" ? filters.inputRLARangeVal() : "",
			loanamountopr : filters.ddRLARangesVal() != "" ? filters.ddRLARangesVal() : "", 
			city : filters.CityVal(), 
			product : filters.ProductVal(), 
			brhead : filters.BRHeadVal(), 
			scheme : filters.SchemeVal(), 
			rm : filters.RMVal(), 
			ca : filters.CAVal(),
			logindate: filters.loginDateVal
		}
	}
	ajaxPost("/accountdetail/getdatabrowser", param, function(data){
		databrowser.normalisasiAD(data.Data);
		dbgrid = $("#griddb").kendoGrid({
			 dataSource: {
			 	data : data.Data,
			 	pageSize: 10
			 },
			 columns : databrowser.fullcoll,
			 groupable: true,
			 scrollable : true,
			 pageable: true,
			 height:450,
			 dataBinding: function(x) {
			 	setTimeout(function(){
			 		_.each($(".intable").parent(),function(e){
						$(e).css("padding",0)
					})
			 	},10)
			}
		}).data("kendoGrid");
	})
}

databrowser.normalisasiAD = function(dt){
	_.forEach(dt,function(val){
		_.forEach(val.AD,function(x,i){
		val.AD[i.toLowerCase()] = x;
	});
	});
}

$(document).ready(function(){
	databrowser.GetDataGrid();
	$("#panel-filter .filterhide").hide();

})

function showthis(e){
	$("#"+e).closest("table").parent().parent().find(".hiddentd").show();
	var test = $("#"+e).find("a").html();

	if(test.indexOf("plus") > -1){
		$("#"+e).closest("table").parent().parent().find(".hiddentd").show();
		$("#"+e).find("a").html("<i class='fa fa-minus-square-o' style='font-size: 12px; color: rgb(22, 136, 70);'></i>")
		$(".line").css('border-bottom', '')
	}else{
		$("#"+e).closest("table").parent().parent().find(".hiddentd").hide();
		$("#"+e).find("a").html("<i class='fa fa-plus-square-o' style='font-size: 12px; color: rgb(22, 136, 70);'></i>")
	}
}