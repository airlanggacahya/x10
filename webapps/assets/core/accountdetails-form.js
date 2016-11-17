 var adf = {}

// ====== OPTIONS
adf.FirstAgreementDate = ko.observable("")
adf.optionRatingMasters = ko.observableArray([]);
adf.optionRatingMastersCustomerSegment = ko.observableArray([]);
adf.realesttot = ko.observable(0);
adf.optionLeadDistributors = ko.observableArray([]);

adf.optionLeadDistributors(_.map(adf.optionLeadDistributors(),function(x){return toTitleCase(x); }));

adf.optionProducts = ko.observableArray([]);
adf.optionDiversificationCustomers = ko.observableArray([]);
adf.optionSchemeList = ko.observableArray([]);
adf.optionTemporaryData = ko.observable();
adf.optionBorrowerConstitutionList = ko.observableArray([]);
adf.optionDependenceOnSuppliers = ko.observableArray([]);
adf.optionBusinessVintages = ko.observableArray([]);
adf.optionChangeConfirm = ko.observable(" Confirm");
adf.optionSectionAccountConfirm = ko.observable(" Confirm");
adf.optionSectionBorrowerConfirm = ko.observable(" Confirm");
adf.optionSectionPromoterConfirm = ko.observable(" Confirm");
adf.optionSectionVendorConfirm = ko.observable(" Confirm");
adf.optionSectionLoanConfirm = ko.observable(" Confirm");
adf.optionSectionCustomerConfirm = ko.observable(" Confirm");
adf.optionSectionDistributorConfirm = ko.observable(" Confirm");
adf.optionPurchaseOrderBackingConfirm = ko.observable(" Confirm");
adf.optionConfirm = ko.observable(false);
// adf.optionExternalRatings = ko.observableArray([
// 	{ value: "Highest Safety", text: "Highest Safety"},
// 	{ value: "High Safety", text:"High Safety"},
// 	{ value: "Adequate Safety", text: "Adequate Safety"},
// 	{ value: "Moderate Safety", text: "Moderate Safety"},
// 	{ value: "Moderate Risk", text: "Moderate Risk"},
// 	{ value: "High Risk", text: "High Risk"},
// 	{ value: "Very High Risk", text: "Very High Risk"},
// 	{ value: "Very High Risk", text: "Very High Risk"},
// 	{ value: "Default", text: "Default"},
// 	{ value: "No Rating-debt > Rs. 10 Cr", text: "No Rating-debt > Rs. 10 Cr"},
// 	{ value: "No Rating -debt<Rs. 10 Cr", text: "No Rating -debt<Rs. 10 Cr"},
// ])
adf.optionExternalRatings = ko.observableArray([]);
adf.optionSourceList = ko.observableArray([]);
// adf.optionManagements = ko.observableArray(["Single Person", "Board Based"]);
adf.optionManagements = ko.observableArray([]);
adf.optionMarketReferences = ko.observableArray([]);
adf.optionProductNameandDetails = ko.observableArray([""]);
adf.optionPromotors = ko.observableArray([]);
adf.optionExperienceInSameLineOfBusiness = ko.observableArray([]);
adf.optionEducationalQualificationOfMainPromoters = ko.observableArray([]);
adf.optionResiOwnershipStatus = ko.observableArray([]);
adf.optionOfficeOwnershipStatus = ko.observableArray([]);
adf.optionCibilScores = ko.observableArray([]);
adf.optionArrayDelayDays = ko.observableArray([]);
adf.optionAverageDelaysDays = ko.observable(0);
adf.optionYesNo = ko.observableArray([
	{ value: true, text: 'Yes' },
	{ value: false, text: 'No' },
])
adf.optionPositiveNegative = ko.observableArray([
	{ value: true, text: 'Positive' },
	{ value: false, text: 'Negative' },
])

adf.optionTopCustomerNames = ko.observableArray([])
adf.optionPDRemarks = ko.observableArray([
	{value: "Satisfactory", text: "Satisfactory"},
	{value: "Unsatisfactory", text: "Unsatisfactory"},
])
adf.DataTempSecurityDetails = ko.observableArray([
	{
		type : "Property",
		data :[
			{text: "Properti1", value: "Property1"},
			{text: "Properti2", value: "Property2"}
		]
	},
	{
		type : "Hypothecation of Current Assests",
		data :[
			{text: "Hypothecation of Current Assests1", value: "Hypothecation of Current Assests1"},
			{text: "Hypothecation of Current Assests2", value: "Hypothecation of Current Assests2"}
		]
	},
	{
		type : "Bank Guarantee",
		data :[
			{text: "Bank Guarantee1", value: "Bank Guarantee1"},
			{text: "Bank Guarantee2", value: "Bank Guarantee2"}
		]
	},
	{
		type : "Corporate Guarantee",
		data :[
			{text: "Corporate Guarantee1", value: "Corporate Guarantee1"},
			{text: "Corporate Guarantee2", value: "Corporate Guarantee2"}
		]
	},
	{
		type : "ROC Charge",
		data :[
			{text: "ROC Charge1", value: "ROC Charge1"},
			{text: "ROC Charge2", value: "ROC Charge2"}
		]
	},
	{
		type : "Shares Others",
		data :[
			{text: "Shares Others1", value: "Shares Others1"},
			{text: "Shares Others2", value: "Shares Others2"}
		]
	},

]);
adf.dataTypeSecurity = ko.observableArray([]);
adf.dataDetailsSecurity = ko.observableArray([]);
// ====== TEMPLATE
adf.PdDate = ko.observable("")
adf.templatePDInfo = {
	PdDoneBy: '',
	PdDate: '',
	PdPlace: '',
	PersonMet: '',
	CustomerMargin: 0,
	PdRemarks: '',
	PdComments: '',
}
adf.templatePDInfo1 = {
	PdDoneBy: '',
	PdDate: '',
	PdPlace: '',
	PersonMet: '',
	CustomerMargin: '',
	PdRemarks: '',
	PdComments: '',
}
adf.templateAccountSetupDetails = {
	CityName: '',
	LoginDate: (new Date()).toISOString(),
	DealNo: '',
	RmName: '',
	BrHead: '',
	CreditAnalyst: '',
	LeadDistributor: '',
	Product: '',
	Scheme: '',
	PdInfo: adf.templatePDInfo,
	Status: 0,
	


}
adf.templateAccountSetupDetails1 = {
	CityName: '',
	LoginDate: (new Date()).toISOString(),
	DealNo: '',
	RmName: '',
	BrHead: '',
	CreditAnalyst: '',
	LeadDistributor: '',
	Product: '',
	Scheme: '',
	PdInfo: adf.templatePDInfo1,
	Status: 0,

}
adf.templateBorrowerDetails = {
	CustomerSegmentClasification: '',
	DiversificationCustomers: 0,
	DependenceOnSuppliers: 0,
	BusinessVintage: 0,
	ExternalRating: '',
	Management: '',
	MarketReference: '',
	DateBusinessStarted: '',
	BorrowerConstitution: '',
	TopCustomerNames: [""],
	ProductNameandDetails: [""],
	RefrenceCheck: [],
	ExpansionPlans: '',
	SecondLineinBusiness: '',
	OrdersinHand: 0,
	ProjectsCompleted: 0,
	CommentsonFinancials: '',
	Status: 0,
}
adf.templateBorrowerDetails1 = {
	CustomerSegmentClasification: '',
	DiversificationCustomers: 0,
	DependenceOnSuppliers: 0,
	BusinessVintage: 0,
	ExternalRating: '',
	Management: '',
	MarketReference: '',
	DateBusinessStarted: '',
	BorrowerConstitution: '',
	TopCustomerNames: [""],
	ProductNameandDetails: [""],
	RefrenceCheck: [""],
	ExpansionPlans: '',
	SecondLineinBusiness: '',
	OrdersinHand: 0,
	ProjectsCompleted: '',
	CommentsonFinancials: '',
	Status: 0,
}
adf.templatePromotorDetails = {
	PromoterName: '',
	ExperienceInSameLineOfBusiness: 0,
	EducationalQualificationOfMainPromoter: '',
	ResiOwnershipStatus: '',
	OfficeOwnershipStatus: '',
	RealEstatePosition: [], // [0.0]
	CibilScore: 0,
	Status: 0,
}
adf.templatePromotorDetails1 = {
	PromoterName: '',
	ExperienceInSameLineOfBusiness: 0,
	EducationalQualificationOfMainPromoter: '',
	ResiOwnershipStatus: '',
	OfficeOwnershipStatus: '',
	RealEstatePosition: [], // [0.0]
	CibilScore: 0,
	Status: 0,
}
adf.templateVendorDetails = {
	DistributorName: '',
	MaxDelayDays: 0,
	MaxPaymentDays: 0,
	AverageDelayDays: 0,
	StandardDeviation: 0,
	AveragePaymentDays: 0,
	AvgTransactionWeightedPaymentDelayDays: 0,
	DelayDaysStandardDeviation: 0,
	AvgTransactionWeightedPaymentDays: 0,
	DaysStandardDeviation: 0,
	AmountOfBusinessDone: 0,
	Status: 0,
}
adf.templateVendorDetails1 = {
	DistributorName: '',
	MaxDelayDays: 0,
	MaxPaymentDays: 0,
	AverageDelayDays: 0,
	StandardDeviation: 0,
	AveragePaymentDays: 0,
	AvgTransactionWeightedPaymentDelayDays: 0,
	DelayDaysStandardDeviation: 0,
	AvgTransactionWeightedPaymentDays: 0,
	DaysStandardDeviation: 0,
	AmountOfBusinessDone: 0,
	Status: 0,
}
adf.templateLoanDetails = {
	ProposedLoanAmount: 0.0,
	RequestedLimitAmount: 0.0,
	LimitTenor: 0.0,
	LoanTenorDays: 0.0,
	ProposedRateInterest: 0.0,
	ProposedPFee: 0.0,
	IfExistingCustomer: ko.observable(),
	IfYesEistingLimitAmount: 0.0,
	ExistingRoi: 0.0,
	ExistingPf: 0.0,
	FirstAgreementDate: '',
	RecenetAgreementDate: '',
	VintageWithX10: 0.0,
	CommercialCibilReport: ko.observable(),
	InterestOutgo : 0.0,
	IfBackedByPO : ko.observable(),
	POValueforBacktoBack : 0.0,
	ExpectedPayment: 0.0,
	TypeSecurity: '',
	DetailsSecurity: '',
	Status: 0,
}
adf.templateLoanDetails1 = {
	ProposedLoanAmount: 0.0,
	RequestedLimitAmount: 0.0,
	LimitTenor: 0.0,
	LoanTenorDays:0.0,
	ProposedRateInterest: 0.0,
	ProposedPFee: 0.0,
	IfExistingCustomer: ko.observable(),
	IfYesEistingLimitAmount: 0.0,
	ExistingRoi: 0.0,
	ExistingPf: 0.0,
	FirstAgreementDate: '',
	RecenetAgreementDate: '',
	VintageWithX10: 0.0,
	CommercialCibilReport: ko.observable(),
	InterestOutgo : 0.0,
	IfBackedByPO : ko.observable,
	POValueforBacktoBack : 0.0,
	ExpectedPayment: 0.0,
	TypeSecurity: '',
	DetailsSecurity: '',
	Status: 0,
}
adf.templateCustomerBussinesMix = {
	StockSellIn: 0.0,
	B2BGovtIn: 0.0,
	B2BCorporateIn: 0.0,
	Status: 0,
}
adf.templateCustomerBussinesMix1 = {
	StockSellIn: 0.0,
	B2BGovtIn: 0.0,
	B2BCorporateIn: 0.0,
	Status: 0,
}
adf.templateDistributorMix = {
	Data: [
		{
			Label: ko.observable(""), 
			Result : ko.observable(0)
		},
	],
	Status: 0,
}
adf.templateDistributorMix1 = {
	Data: [
		{
			Label: ko.observable(""), 
			Result : ko.observable(0)
		},
	],
	Status: 0,
}


adf.templateForm = {
	Id: '',
	CustomerId: '',
	DealNo: '',
	AccountSetupDetails: adf.templateAccountSetupDetails,
	BorrowerDetails: adf.templateBorrowerDetails,
	PromotorDetails: [],
	VendorDetails: [],
	LoanDetails: adf.templateLoanDetails,
	CustomerBussinesMix: adf.templateCustomerBussinesMix,
	DistributorMix: adf.templateDistributorMix,
	Status: 0,
	Freeze: false,
	DateConfirmed : (new Date()).toISOString(),
	DateFreeze : (new Date()).toISOString(),
	DateSave: '',
}

adf.templateTempForm = {
	Id: '',
	CustomerId: '',
	DealNo: '',
	AccountSetupDetails: adf.templateAccountSetupDetails1,
	BorrowerDetails: adf.templateBorrowerDetails1,
	PromotorDetails: [],
	// PurchaseOrderBacking : adf.templatePurchaseOrderBacking1,
	VendorDetails: [],
	LoanDetails: adf.templateLoanDetails1,
	CustomerBussinesMix: adf.templateCustomerBussinesMix1,
	DistributorMix: adf.templateDistributorMix1,
	Status: 0,
	Freeze: false,
	DateConfirmed : (new Date()).toISOString(),
	DateFreeze : (new Date()).toISOString(),
	DateSave: '',
}

adf.form = ko.mapping.fromJS(toolkit.clone(adf.templateForm))
adf.Tempform = ko.mapping.fromJS(toolkit.clone(adf.templateTempForm))
adf.isLoading = function (what) {
    $('.apx-loading')[what ? 'show' : 'hide']()
    $('.app-content')[what ? 'hide' : 'show']()
}
adf.getForm = function () {
	var data = ko.mapping.toJS(adf.form)
	if (data.AccountSetupDetails.LoginDate instanceof Date) {
		data.AccountSetupDetails.LoginDate = data.AccountSetupDetails.LoginDate.toISOString()
	}

	// if (data.AccountSetupDetails.PdInfo.PdDate instanceof Date) {
	// 	data.AccountSetupDetails.PdInfo.PdDate = data.AccountSetupDetails.PdInfo.PdDate.toISOString()
	// }

	if (data.LoanDetails.FirstAgreementDate instanceof Date) {
		data.LoanDetails.FirstAgreementDate = data.LoanDetails.FirstAgreementDate.toISOString()
	}
	if (data.LoanDetails.RecenetAgreementDate instanceof Date) {
		data.LoanDetails.RecenetAgreementDate = data.LoanDetails.RecenetAgreementDate.toISOString()
	}

	if (typeof data.LoanDetails.IfExistingCustomer === 'string') {
		data.LoanDetails.IfExistingCustomer = (data.LoanDetails.IfExistingCustomer.toLowerCase() == 'true')
	}
	if (typeof data.LoanDetails.IfBackedByPO === 'string') {
		data.LoanDetails.IfBackedByPO = (data.LoanDetails.IfBackedByPO.toLowerCase() == 'true')
	}
	if (typeof data.LoanDetails.CommercialCibilReport === 'string') {
		data.LoanDetails.CommercialCibilReport = (data.LoanDetails.CommercialCibilReport.toLowerCase() == 'true')
	}

	data.PromotorDetails.forEach(function (d) {
		d.RealEstatePosition = d.RealEstatePosition.map(function (d) {
			return d.value;
		}).filter(function (d) {
			return $.trim(d) != '';
		})
	})

	data.VendorDetails = data.VendorDetails.filter(function (d) {
		return d.DistributorName != ''
	})
	
	// console.log("----- 345",data)

	return data
}

adf.setForm = function (data) {

	// console.log("---------->",data)
	if(data != null){
		data.PromotorDetails.forEach(function (d) {
			d.RealEstatePosition = d.RealEstatePosition.map(function (d) {
				return { value: d }
			})
			// adf.Tempform.PromotorDetails.RealEstatePosition(d.RealEstatePosition)
		})
		ko.mapping.fromJS(data, adf.form)
		ko.mapping.fromJS(data, adf.Tempform)

		if (data.PromotorDetails.length == 0) {
			adf.addMorePromotor()
		}

		if (data.VendorDetails.length == 0) {
			adf.addMoreVendor()
		}

	}
	// adf.Tempform.PromotorDetails.RealEstatePosition(data)

	adf.form.PromotorDetails().forEach(function (d) {
		if (d.RealEstatePosition().length == 0) {
			adf.addMoreRealEstatePosition(d)()
		}
	})

	adf.fixMultiSectionCSS()
	ComputedGO();
}
adf.resetForm = function () {
	ko.mapping.fromJS(adf.templateForm, adf.form)
	adf.addMorePromotor()
	adf.addMoreVendor()

	adf.form.PromotorDetails().forEach(function (d) {
		if (d.RealEstatePosition().length == 0) {
			adf.addMoreRealEstatePosition(d)()
		}
	})
}
adf.formVisibility = ko.observable(false)

adf.changePromotorName = function (promotor) {
	return function (e, f, g) {
		var row = adf.optionPromotors().find(function (d) {
			return d.Name == e.sender.value()
		})
		if (typeof row === 'undefined') {
			return
		}

		setTimeout(function(){
			adf.LoadPromotorEducation();
		},500);

		promotor.CibilScore(row.CIBILScore)
	}
}

adf.LoadPromotorEducation = function(){
	$.each(adf.form.PromotorDetails(), function(i, item){
		try{
			$('#edu'+i).tooltipster('destroy');
		}catch(e){
			// console.log(e)
		}


		var row = adf.optionPromotors().find(function (d) {
			return d.Name == item.PromoterName();
		});

		if(row != undefined){
			row.Education = row.Education == ""? "NA" : row.Education;
			$('#edu'+i).tooltipster({content: 'Educational Background : '+ row.Education})
		};
	});
}
// adf.isExistingCustomer = ko.computed(function () {
// 	console.log('--------->>>>>>',adf.form.LoanDetails.IfExistingCustomer())
// 	var value = adf.form.LoanDetails.IfExistingCustomer()
// 	if (typeof value === 'string') {
// 		value = (value.toLowerCase() === 'true');
// 	}

// 	return value
// }, adf.form.LoanDetails.IfExistingCustomer)

adf.save = function () {
	generatemc();
	$('.form-last-confirmation-info').html('');
	$('.form-last-confirmation-info').html('Last Saved on: '+kendo.toString(new Date(),"dd-MM-yyyy h:mm:ss tt") )
	adf.form.BorrowerDetails.RefrenceCheck([])
	var dataGrid = $("#refrence").data().kendoGrid.dataSource.data();
	var date = (new Date()).toISOString();
	adf.form.DateSave(date);
	$.each(dataGrid, function(i, item){
		console.log(item)
		adf.form.BorrowerDetails.RefrenceCheck.push(
			{
				Source : item.Source,
				SourceName : item.SourceName,
				CheckBy : item.CheckBy,
				IsPositive : item.IsPositive,
				FeedBack : item.FeedBack,
			}
		)
	});
	var res1 = adf.form.CustomerBussinesMix.B2BGovtIn() + adf.form.CustomerBussinesMix.StockSellIn() + adf.form.CustomerBussinesMix.B2BCorporateIn();
	var res2 = 0;
	$.each(adf.form.DistributorMix.Data(), function(i, items){
		res2 += items.Result()
	})
	if(res1 > 100){
		swal("Warning", "Customer Business Mix exceeding 100%", "warning");
	}else if(res2 > 100){
		swal("Warning", "Distributor mix exceeding 100%", "warning");
	}else{

			var ondate5= adf.form.AccountSetupDetails.LoginDate()
			if(!adf.blankdate(adf.form.AccountSetupDetails.LoginDate()) ){
				var date5 = kendo.toString(new Date(),"yyyy-MM-dd")+"T00:00:00.000Z";
				if(adf.form.AccountSetupDetails.LoginDate() == date5){
					adf.form.AccountSetupDetails.LoginDate(date5)
				}else{
					var str = ondate5.toString()
					str = kendo.toString(new Date(str),"yyyy-MM-dd");
					// alert(str)
					if(str.indexOf("T00:00:00.000Z") > -1){
						adf.form.AccountSetupDetails.LoginDate("");
						adf.form.AccountSetupDetails.LoginDate(ondate5)
					}else{
						// alert("masuk sisni")
						var da = kendo.toString(str,"yyyy-MM-dd")+"T00:00:00.000Z";;
						adf.form.AccountSetupDetails.LoginDate(da)

					}
				}
				
			}
			if(!adf.blankdate(adf.PdDate())){
				var ondate4 = adf.PdDate();
				// var date4 = (new Date(adf.PdDate()).toISOString());
				var date4 = kendo.toString(new Date(adf.PdDate()),"yyyy-MM-dd")+"T00:00:00.000Z"
				adf.form.AccountSetupDetails.PdInfo.PdDate(date4);
			}else{
				adf.form.AccountSetupDetails.PdInfo.PdDate("1970-01-01T00:00:00.000Z");
			}
			if(!adf.blankdate(adf.form.LoanDetails.FirstAgreementDate())){
				var ondate1 = kendo.toString(new Date(adf.form.LoanDetails.FirstAgreementDate()),"yyyy-MM-dd")+"T00:00:00.000Z"
			// var date1 = (new Date(adf.form.LoanDetails.FirstAgreementDate()).toISOString())
			adf.form.LoanDetails.FirstAgreementDate(ondate1);
			}else{
				adf.form.LoanDetails.FirstAgreementDate("1970-01-01T00:00:00.000Z");

			}

			if(!adf.blankdate(adf.form.BorrowerDetails.DateBusinessStarted())){
				var ondate3 = kendo.toString(new Date(adf.form.BorrowerDetails.DateBusinessStarted()),"yyyy-MM-dd")+"T00:00:00.000Z"
				// var date3 = (new Date(adf.form.BorrowerDetails.DateBusinessStarted()).toISOString())
				adf.form.BorrowerDetails.DateBusinessStarted(ondate3);
			}else{
				adf.form.BorrowerDetails.DateBusinessStarted("1970-01-01T00:00:00.000Z");

			}


			if(!adf.blankdate(adf.form.LoanDetails.RecenetAgreementDate())){

				var ondate2 = kendo.toString(new Date(adf.form.LoanDetails.RecenetAgreementDate()),"yyyy-MM-dd")+"T00:00:00.000Z"
				// var date2 = (new Date(adf.form.LoanDetails.RecenetAgreementDate()).toISOString())
				adf.form.LoanDetails.RecenetAgreementDate(ondate2);
			}else{
				adf.form.LoanDetails.RecenetAgreementDate("1970-01-01T00:00:00.000Z");

			}
		
		if(adf.form.AccountSetupDetails.PdInfo.CustomerMargin() == ""){
			adf.form.AccountSetupDetails.PdInfo.CustomerMargin(0)
		}
		var url = "/accountdetail/saveaccountdetail"
		var param = adf.getForm()
		if(adf.CMISNULL()){
			param.AccountSetupDetails.PdInfo.CustomerMargin = 0;
		}

		param.CMISNULL = adf.CMISNULL();

		// param.AccountSetupDetails.PdInfo.PdDate = kendo.parseDate(adf.PdDate(), "dd-MMM-yyyy");
		adf.isLoading(true)
		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)

			if(adf.PdDate().toString().indexOf("1970") >-1){
				adf.PdDate("")
			}

			if(adf.CMISNULL()){
				adf.form.AccountSetupDetails.PdInfo.CustomerMargin("")
			}

			if(adf.form.LoanDetails.FirstAgreementDate().toString().indexOf("1970") >-1){
				adf.form.LoanDetails.FirstAgreementDate("");
			}else{
				var date1 = kendo.toString(new Date(adf.form.LoanDetails.FirstAgreementDate()),"dd-MMM-yyyy")
				adf.form.LoanDetails.FirstAgreementDate(date1)
			}
			if(adf.form.LoanDetails.RecenetAgreementDate().toString().indexOf("1970") >-1){
				adf.form.LoanDetails.RecenetAgreementDate("");
			}else{
				var date2 = kendo.toString(new Date(adf.form.LoanDetails.RecenetAgreementDate()),"dd-MMM-yyyy");
				adf.form.LoanDetails.RecenetAgreementDate(date2)
			}
			if(adf.form.BorrowerDetails.DateBusinessStarted().toString().indexOf("1970") >-1){
				adf.form.BorrowerDetails.DateBusinessStarted("");
			}else{
				var date3 =  kendo.toString(new Date(adf.form.BorrowerDetails.DateBusinessStarted()),"dd-MMM-yyyy");
				adf.form.BorrowerDetails.DateBusinessStarted(date3)
			}
			
			swal("Successfully Saved", "", "success");
		}, function () {
			adf.isLoading(false)
		});
		

	}

}
s
adf.getSaveAccount = function(){
	adf.optionTemporaryData().AccountSetupDetails.PdInfo.PdDate =moment(adf.PdDate()).toISOString();
	adf.optionTemporaryData().AccountSetupDetails.BrHead = adf.form.AccountSetupDetails.BrHead()
	adf.optionTemporaryData().AccountSetupDetails.CityName =adf.form.AccountSetupDetails.CityName()
	adf.optionTemporaryData().AccountSetupDetails.CreditAnalyst = adf.form.AccountSetupDetails.CreditAnalyst()
	adf.optionTemporaryData().AccountSetupDetails.DealNo = adf.form.AccountSetupDetails.DealNo()
	adf.optionTemporaryData().AccountSetupDetails.LeadDistributor = adf.form.AccountSetupDetails.LeadDistributor()
	adf.optionTemporaryData().AccountSetupDetails.LoginDate = adf.form.AccountSetupDetails.LoginDate()
	// adf.optionTemporaryData().AccountSetupDetails.PdInfo.PdDate moment(adf.PdDate()).toISOString())
	adf.optionTemporaryData().AccountSetupDetails.PdInfo.PdDoneBy = adf.form.AccountSetupDetails.PdInfo.PdDoneBy()
	adf.optionTemporaryData().AccountSetupDetails.PdInfo.PdPlace = adf.form.AccountSetupDetails.PdInfo.PdPlace()
	adf.optionTemporaryData().AccountSetupDetails.PdInfo.CustomerMargin = adf.form.AccountSetupDetails.PdInfo.CustomerMargin()
	adf.optionTemporaryData().AccountSetupDetails.PdInfo.PdRemarks = adf.form.AccountSetupDetails.PdInfo.PdRemarks()
	adf.optionTemporaryData().AccountSetupDetails.PdInfo.PdComments = adf.form.AccountSetupDetails.PdInfo.PdComments()
	adf.optionTemporaryData().AccountSetupDetails.PdInfo.PersonMet = adf.form.AccountSetupDetails.PdInfo.PersonMet()
	adf.optionTemporaryData().AccountSetupDetails.Product = adf.form.AccountSetupDetails.Product()
	adf.optionTemporaryData().AccountSetupDetails.RmName = adf.form.AccountSetupDetails.RmName()
	adf.optionTemporaryData().AccountSetupDetails.Status = adf.form.AccountSetupDetails.Status()
	// adf.Tempform.PromotorDetails.RealEstatePosition = adf.form.AccountSetupDetails.Status()
	var real = []
	$.each(adf.optionTemporaryData().PromotorDetails, function(i, item){
   // console.log(item.RealEstatePosition[i].value)
   real.push(item.RealEstatePosition[i].value)
   item.RealEstatePosition = [];
   item.RealEstatePosition[i] = real;
   // console.log(item.RealEstatePosition)

})
	// console.log(real)
	var data = adf.optionTemporaryData()
	var url = "/accountdetail/saveaccountdetail"
	var param = data;

	adf.isLoading(true)
	app.ajaxPost(url, param, function (res) {
		adf.isLoading(false)
		var data = ko.mapping.toJS(adf.form)
		ko.mapping.fromJS(data, adf.Tempform)
		swal("Success", "Data Account Set-Up Details saved", "success");
	}, function () {
		adf.isLoading(false)
	});
}
adf.getConfirm = function(){
	// if(adf.form.LoanDetails.FirstAgreementDate()== "" || adf.form.BorrowerDetails.DateBusinessStarted() == "" || adf.PdDate() == ""){
	// 	adf.form.AccountSetupDetails.PdInfo.PdDate("1970-01-01T00:00:00.000Z")
	// 	adf.form.LoanDetails.FirstAgreementDate(null);
	// 	adf.form.LoanDetails.RecenetAgreementDate(null);
	// 	adf.form.BorrowerDetails.DateBusinessStarted(null);
	// }
	// adf.isoAllDate()
	generatemc()
	var sts =''
	if(adf.optionChangeConfirm() == " Confirm"){
		adf.optionChangeConfirm(" Re-Enter");
		adf.form.DateConfirmed(new Date())
		setTimeout(function(){
			$('.form-last-confirmation-info').html('');
			$('.form-last-confirmation-info').html('Last Confirmed on: '+kendo.toString(new Date(),"dd-MM-yyyy h:mm:ss tt") )
		},500)
		try{
			$('#tipster').tooltipster('destroy')
		}catch(e){

		}
		if(adf.PdDate() != ""){
			$('#tipster').tooltipster({
				contentAsHTML: true,
		    	interactive: true,
		    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span>"+kendo.toString(new Date(adf.PdDate()),"dd-MMM-yyyy")+"</span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
			})

		}else{
			$('#tipster').tooltipster({
				contentAsHTML: true,
		    	interactive: true,
		    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span>	</span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
			})
		}
		adf.form.Status(1);
		adf.form.AccountSetupDetails.Status(1);
		adf.form.BorrowerDetails.Status(1);
		$.each(adf.form.PromotorDetails(), function(i, item){
			item.Status(1)
		});
		$.each(adf.form.VendorDetails(), function(i, items){
			items.Status(1)
		});
		// $(".btn").prop("disabled", true)
		$("#avg").prop("disabled", true)
		$("#max").prop("disabled", true)
		adf.form.LoanDetails.Status(1);
		adf.form.CustomerBussinesMix.Status(1);
		adf.form.DistributorMix.Status(1);
		adf.EnableAllfieldsOnconfirm(false)
		setTimeout(function(){
			for(var i = 0; i< adf.form.PromotorDetails().length; i++){
				$("#cibil"+i).prop("disabled", "disabled")
				$("#real"+i).prop("disabled", "disabled")
			}
			$("#req").prop("disabled", "disabled")
			$("#mincibil").prop("disabled", "disabled")
		}, 500)
		$("#onreset").prop( "disabled", true );
		$("#LoanAmount").prop( "disabled", true );
		adf.optionChangeConfirm(" Re-Enter")
		adf.optionSectionAccountConfirm(" Re Enter")
		adf.optionSectionDistributorConfirm(" Re Enter")
		adf.optionSectionBorrowerConfirm(" Re Enter")
		adf.optionSectionPromoterConfirm(" Re Enter")
		adf.optionSectionVendorConfirm(" Re Enter")
		adf.optionSectionLoanConfirm(" Re Enter")
		adf.optionSectionCustomerConfirm(" Re Enter")
		adf.optionSectionDistributorConfirm(" Re Enter")
		$("#addpromotor").prop("disabled", true);
		$("#addvendor").prop("disabled", true);
		$("#addvendor1").prop("disabled", true);
		sts = "Confirmed"
		$("#onreset1").prop("disabled", true);
		$("#onreset2").prop("disabled", true);
		$("#onreset3").prop("disabled", true);
		$("#onreset4").prop("disabled", true);
		$("#onreset5").prop("disabled", true);
		$("#onreset6").prop("disabled", true);
		$("#onreset7").prop("disabled", true);
		$("#onreset8").prop("disabled", true);
		adf.sectionDisable("#c-2", false)
	}else{
		sts = "Re Enter";
		$("#LoanAmount").prop( "disabled", true );
		adf.EnableAllfieldsOnconfirm(true)
		// $(".btn").prop("disabled", false)
		adf.form.Status(0);
		adf.form.AccountSetupDetails.Status(0);
		adf.form.BorrowerDetails.Status(0);
		var date = (new Date()).toISOString();
		adf.form.DateConfirmed(date);
		$.each(adf.form.PromotorDetails(), function(i, item){
			item.Status(0)
		});
		$.each(adf.form.VendorDetails(), function(i, items){
			items.Status(0)
		});
		$("#avg").prop("disabled", true)
		$("#max").prop("disabled", true)
		adf.form.LoanDetails.Status(0);
		adf.form.CustomerBussinesMix.Status(0);
		adf.form.DistributorMix.Status(0);
		$("#onreset").prop( "disabled", false );
		$("#onsave").prop( "disabled", false );
		$("#LoanAmount").prop( "disabled", true );
		$("#addpromotor").prop("disabled", false);
		$("#addvendor").prop("disabled", false);
		$("#addvendor1").prop("disabled", false);
		setTimeout(function(){
			adf.optionChangeConfirm(" Confirm");
			adf.sectionDisable("#city", false)
			adf.sectionDisable("#DealNo", false)
			// adf.sectionDisable("#loginDate", false)
		}, 100)

		adf.optionChangeConfirm(" Confirm")
		adf.optionSectionAccountConfirm(" Confirm")
		adf.optionSectionDistributorConfirm(" Confirm")
		adf.optionSectionBorrowerConfirm(" Confirm")
		adf.optionSectionPromoterConfirm(" Confirm")
		adf.optionSectionVendorConfirm(" Confirm")
		adf.optionSectionLoanConfirm(" Confirm")
		adf.optionSectionCustomerConfirm(" Confirm")
		adf.optionSectionDistributorConfirm(" Confirm")
		$("#onreset1").prop("disabled", false);
		$("#onreset2").prop("disabled", false);
		$("#onreset3").prop("disabled", false);
		$("#onreset4").prop("disabled", false);
		$("#onreset5").prop("disabled", false);
		$("#onreset6").prop("disabled", false);
		$("#onreset7").prop("disabled", false);
		$("#onreset8").prop("disabled", false);
	}

		var res1 = adf.form.CustomerBussinesMix.B2BGovtIn() + adf.form.CustomerBussinesMix.StockSellIn() + adf.form.CustomerBussinesMix.B2BCorporateIn();
		var res2 = 0;
		$.each(adf.form.DistributorMix.Data(), function(i, items){
			res2 += items.Result()
		})
		if(res1 > 100){
			swal("Warning", "Customer Business Mix exceeding 100%", "warning");
		}else if(res2 > 100){
			swal("Warning", "Distributor mix exceeding 100%", "warning");

		}else{

			// if(adf.PdDate() != "" || adf.form.LoanDetails.FirstAgreementDate() != "" || adf.form.BorrowerDetails.DateBusinessStarted() != "" || adf.PdDate() != ""){
			// 	var ondate1 = adf.form.LoanDetails.FirstAgreementDate()
			// 	var date1 = (new Date(adf.form.LoanDetails.FirstAgreementDate()).toISOString())
			// 	adf.form.LoanDetails.FirstAgreementDate(date1);

			// 	var ondate2 = adf.form.LoanDetails.RecenetAgreementDate()
			// 	var date2 = (new Date(adf.form.LoanDetails.RecenetAgreementDate()).toISOString())
			// 	adf.form.LoanDetails.RecenetAgreementDate(date2);

			// 	var ondate3 = adf.form.BorrowerDetails.DateBusinessStarted()
			// 	var date3 = (new Date(adf.form.BorrowerDetails.DateBusinessStarted()).toISOString())
			// 	adf.form.BorrowerDetails.DateBusinessStarted(date3);

			// 	var ondate4 = adf.PdDate();
			// 	if(adf.PdDate() != ""){
			// 		var date4 = (new Date(adf.PdDate()).toISOString());
			// 		adf.form.AccountSetupDetails.PdInfo.PdDate(date4);
			// 	}

			var ondate5= adf.form.AccountSetupDetails.LoginDate()
			if(!adf.blankdate(adf.form.AccountSetupDetails.LoginDate()) ){
				var date5 = kendo.toString(new Date(),"yyyy-MM-dd")+"T00:00:00.000Z";
				if(adf.form.AccountSetupDetails.LoginDate() == date5){
					adf.form.AccountSetupDetails.LoginDate(date5)
				}else{
					var str = ondate5.toString()
					str = kendo.toString(new Date(str),"yyyy-MM-dd");
					// alert(str)
					if(str.indexOf("T00:00:00.000Z") > -1){
						adf.form.AccountSetupDetails.LoginDate("");
						adf.form.AccountSetupDetails.LoginDate(ondate5)
					}else{
						// alert("masuk sisni")
						var da = kendo.toString(str,"yyyy-MM-dd")+"T00:00:00.000Z";;
						adf.form.AccountSetupDetails.LoginDate(da)

					}
				}
				
			}
		
			if(!adf.blankdate(adf.PdDate())){
				var ondate4 = adf.PdDate();
				// var date4 = (new Date(adf.PdDate()).toISOString());
				var date4 = kendo.toString(new Date(adf.PdDate()),"yyyy-MM-dd")+"T00:00:00.000Z"
				adf.form.AccountSetupDetails.PdInfo.PdDate(date4);
			}else{
				adf.form.AccountSetupDetails.PdInfo.PdDate("1970-01-01T00:00:00.000Z");
			}
			if(!adf.blankdate(adf.form.LoanDetails.FirstAgreementDate())){
				var ondate1 = kendo.toString(new Date(adf.form.LoanDetails.FirstAgreementDate()),"yyyy-MM-dd")+"T00:00:00.000Z"
			// var date1 = (new Date(adf.form.LoanDetails.FirstAgreementDate()).toISOString())
			adf.form.LoanDetails.FirstAgreementDate(ondate1);
			}else{
				adf.form.LoanDetails.FirstAgreementDate("1970-01-01T00:00:00.000Z");

			}

			if(!adf.blankdate(adf.form.BorrowerDetails.DateBusinessStarted())){
				var ondate3 = kendo.toString(new Date(adf.form.BorrowerDetails.DateBusinessStarted()),"yyyy-MM-dd")+"T00:00:00.000Z"
				// var date3 = (new Date(adf.form.BorrowerDetails.DateBusinessStarted()).toISOString())
				adf.form.BorrowerDetails.DateBusinessStarted(ondate3);
			}else{
				adf.form.BorrowerDetails.DateBusinessStarted("1970-01-01T00:00:00.000Z");

			}


			if(!adf.blankdate(adf.form.LoanDetails.RecenetAgreementDate())){

				var ondate2 = kendo.toString(new Date(adf.form.LoanDetails.RecenetAgreementDate()),"yyyy-MM-dd")+"T00:00:00.000Z"
				// var date2 = (new Date(adf.form.LoanDetails.RecenetAgreementDate()).toISOString())
				adf.form.LoanDetails.RecenetAgreementDate(ondate2);
			}else{
				adf.form.LoanDetails.RecenetAgreementDate("1970-01-01T00:00:00.000Z");

			}

			if(adf.form.AccountSetupDetails.PdInfo.CustomerMargin() == ""){
				adf.form.AccountSetupDetails.PdInfo.CustomerMargin(0)
			}
			var url = "/accountdetail/saveaccountdetail"
			var param = adf.getForm();
			param.CMISNULL = adf.CMISNULL()
			// param.AccountSetupDetails.PdInfo.PdDate = kendo.parseDate(adf.PdDate(), "dd-MMM-yyyy");
			adf.isLoading(true)
			app.ajaxPost(url, param, function (res) {
				adf.isLoading(false)

				if(adf.CMISNULL())
				{
					adf.form.AccountSetupDetails.PdInfo.CustomerMargin("")
				}

				// if(ondate5 != ""){
				// 	adf.form.AccountSetupDetails.PdInfo.PdDate(ondate4)
				// }
				// adf.form.AccountSetupDetails.LoginDate(ondate5)
				// adf.form.LoanDetails.FirstAgreementDate(ondate1);
				// adf.form.LoanDetails.RecenetAgreementDate(ondate2);
				// adf.form.BorrowerDetails.DateBusinessStarted(ondate3);
				// if(adf.PdDate().toString().indexOf("1970") >-1)
				// 		adf.PdDate("")

				// 		if(adf.form.LoanDetails.FirstAgreementDate().toString().indexOf("1970") >-1)
				// 		adf.form.LoanDetails.FirstAgreementDate("");

				// 		if(adf.form.LoanDetails.RecenetAgreementDate().toString().indexOf("1970") >-1)
				// 		adf.form.LoanDetails.RecenetAgreementDate("");

				// 		if(adf.form.BorrowerDetails.DateBusinessStarted().toString().indexOf("1970") >-1)
				// 		adf.form.BorrowerDetails.DateBusinessStarted("");
				if(adf.form.LoanDetails.IfBackedByPO() == false ){
					$("#BackToBack").getKendoNumericTextBox().enable(false)
					$("#Expected").getKendoNumericTextBox().enable(false)
				}

				if(adf.form.LoanDetails.IfExistingCustomer() == false ){
					$("#IfYesEistingLimitAmount").getKendoNumericTextBox().enable(false)
					$("#ExistingRoi").getKendoNumericTextBox().enable(false)
					$("#ExistingPf").getKendoNumericTextBox().enable(false)
					$("#FirstAgreementDate").getKendoDatePicker().enable(false)
					$("#RecenetAgreementDate").getKendoDatePicker().enable(false)
					$("#VintageWithX10").getKendoNumericTextBox().enable(false)
				}

				if(adf.PdDate().toString().indexOf("1970") >-1){
				adf.PdDate("")
				}
				if(adf.form.LoanDetails.FirstAgreementDate().toString().indexOf("1970") >-1){
					adf.form.LoanDetails.FirstAgreementDate("");
				}else{
					var date1 = kendo.toString(new Date(adf.form.LoanDetails.FirstAgreementDate()),"dd-MMM-yyyy")
					adf.form.LoanDetails.FirstAgreementDate(date1)
				}
				if(adf.form.LoanDetails.RecenetAgreementDate().toString().indexOf("1970") >-1){
					adf.form.LoanDetails.RecenetAgreementDate("");
				}else{
					var date2 = kendo.toString(new Date(adf.form.LoanDetails.RecenetAgreementDate()),"dd-MMM-yyyy");
					adf.form.LoanDetails.RecenetAgreementDate(date2)
				}
				if(adf.form.BorrowerDetails.DateBusinessStarted().toString().indexOf("1970") >-1){
					adf.form.BorrowerDetails.DateBusinessStarted("");
				}else{
					var date3 =  kendo.toString(new Date(adf.form.BorrowerDetails.DateBusinessStarted()),"dd-MMM-yyyy");
					adf.form.BorrowerDetails.DateBusinessStarted(date3)
				}

				for(var i = 0; i< adf.form.PromotorDetails().length; i++){
					$("#cibil"+i).prop("disabled", "disabled")
					$("#real"+i).prop("disabled", "disabled")
				}
				$("#req").prop("disabled", "disabled")
				$("#mincibil").prop("disabled", "disabled")

				var data = ko.mapping.toJS(adf.form)
				ko.mapping.fromJS(data, adf.Tempform)
				if(sts.indexOf("Confirmed") != -1){
					swal("Successfully "+sts, "", "success");
				}else{
					swal("Please Edit / Enter Data", "", "success");
				}
				
			}, function () {
				adf.isLoading(false)
			});

		}

	$(".mincibil").prop("disabled", true);

}

adf.blankdate = function(val){
	if(val == undefined)
		return true

	if(val == "")
		return true

	if(val == null){
		return true
	}
}


adf.getVerify = function(){
	if(adf.form.Status() == 0){
		sweetAlert("Warning", "Please Confirm First", "warning");
		return;
	}
	// adf.isoAllDate()
	setTimeout(function(){
		$('.form-last-confirmation-info').html('');
		$('.form-last-confirmation-info').html('Last Freezed on: '+kendo.toString(new Date(),"dd-MM-yyyy h:mm:ss tt") )
	},1000)
	var date = (new Date()).toISOString()
	adf.form.DateFreeze(date)
	var res1 = adf.form.CustomerBussinesMix.B2BGovtIn() + adf.form.CustomerBussinesMix.StockSellIn() + adf.form.CustomerBussinesMix.B2BCorporateIn();
	var res2 = 0;
	$.each(adf.form.DistributorMix.Data(), function(i, items){
		res2 += items.Result()
	})
	if(res1 > 100){
		swal("Warning", "Distributor mix Exceed 100", "warning");
		adf.isLoading(false)

	}else if(res2 > 100){
		swal("Warning", "Customer Business mix Exceed 100", "warning");
		adf.isLoading(false)

	}else{
		adf.form.Freeze(true);
		var url = "/accountdetail/saveaccountdetail"
		var param = adf.getForm()

		adf.isLoading(true)
		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)
			var data = ko.mapping.toJS(adf.form)
			ko.mapping.fromJS(data, adf.Tempform)
			swal("Successfully Freezed", "", "success");
			setTimeout(function(){
				adf.EnableAllfields(false)
				$("#onreset").prop("disabled", true);
				// adf.EnableAllfields(false)
				// adf.optionChangeConfirm(" ")
				$("#avg").prop("disabled", true)
				$("#max").prop("disabled", true)
				adf.optionSectionAccountConfirm(" Confirm")
				adf.optionSectionDistributorConfirm(" Confirm")
				adf.optionSectionBorrowerConfirm(" Confirm")
				adf.optionSectionPromoterConfirm(" Confirm")
				adf.optionSectionVendorConfirm(" Confirm")
				adf.optionSectionLoanConfirm(" Confirm")
				adf.optionSectionCustomerConfirm(" Confirm")
				adf.optionSectionDistributorConfirm(" Confirm")
				$("#onreset1").prop("disabled", true);
				$("#onreset2").prop("disabled", true);
				$("#onreset3").prop("disabled", true);
				$("#onreset4").prop("disabled", true);
				$("#onreset5").prop("disabled", true);
				$("#onreset6").prop("disabled", true);
				$("#onreset7").prop("disabled", true);
				$("#onreset8").prop("disabled", true);
				try{
					$('#tipster').tooltipster('destroy')
				}catch(e){

				}
				$('#tipster').tooltipster({
							contentAsHTML: true,
					    	interactive: true,
					    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span>"+kendo.toString(new Date(adf.PdDate()),"dd-MMM-yyyy")+"</span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
						})
			}, 500)
		}, function () {
			adf.isLoading(false)
		});
	}
}
adf.getAccountConfirm = function(){
	// alert("masuk");
	if(adf.optionSectionAccountConfirm() == " Confirm"){
		adf.optionSectionAccountConfirm(" Re Enter");
		$("#onreset1").prop("disabled", true);
		adf.form.AccountSetupDetails.Status(1)
		adf.sectionDisable("#c-1", false)
		$("#city").prop( "disabled", true);
		$("#DealNo").prop( "disabled", true);
		$("#loginDate").prop( "disabled", true);
		swal("Success", "Data Account Set-up Details confirmed", "success");
	}else{
		adf.optionSectionAccountConfirm(" Confirm");
		$("#onreset1").prop("disabled", false);
		adf.sectionDisable("#c-1", true)
		adf.form.AccountSetupDetails.Status(0)
		$("#city").prop( "disabled", true);
		$("#DealNo").prop( "disabled", true);
		($("#loginDate").data("kendoDatePicker")).readonly();
		$('html, body').animate({ scrollTop: $('#c-1').offset().top }, 'slow')

	}
	// adf.form.AccountSetupDetails.Status(1);
	var url = "/accountdetail/saveaccountdetail"
	var param = adf.getForm()

	adf.isLoading(true)
	app.ajaxPost(url, param, function (res) {
		adf.isLoading(false)
		var data = ko.mapping.toJS(adf.form)
		ko.mapping.fromJS(data, adf.Tempform)

	}, function () {
		adf.isLoading(false)

	});


}

adf.getBorrowerConfirm = function(){
	if(adf.optionSectionBorrowerConfirm() == " Confirm"){
		adf.optionSectionBorrowerConfirm(" Re Enter");
		$("#onreset2").prop("disabled", true);
		adf.form.BorrowerDetails.Status(1)
		adf.sectionDisable("#c-2", false)
		var url = "/accountdetail/saveaccountdetail"
		var param = adf.getForm()

		adf.isLoading(true)
		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)
		swal("Success", "Data Borrower Details confirmed", "success");
			// $("#onreset2").prop("disabled", true);
			var data = ko.mapping.toJS(adf.form)
			ko.mapping.fromJS(data, adf.Tempform)
		}, function () {
			adf.isLoading(false)
		});
	}else{
		adf.optionSectionBorrowerConfirm(" Confirm");
		adf.sectionDisable("#c-2", true)
		$("#onreset2").prop("disabled", false);
		adf.form.BorrowerDetails.Status(0)
		var url = "/accountdetail/saveaccountdetail"
		var param = adf.getForm()
		$('html, body').animate({ scrollTop: $('#c-2').offset().top }, 'slow')

		adf.isLoading(true)
		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)
			var data = ko.mapping.toJS(adf.form)
			ko.mapping.fromJS(data, adf.Tempform)
			// $("#onreset2").prop("disabled", true);
			adf.form.BorrowerDetails.Status(3)
		}, function () {
			adf.isLoading(false)
		});
	}

	// adf.form.BorrowerDetails.Status(1)
}
adf.getPromoterConfirm = function(){

	generatemc()

	if(adf.optionSectionPromoterConfirm() == " Confirm"){
		adf.optionSectionPromoterConfirm(" Re Enter");
		$("#onreset3").prop("disabled", true);
		$.each(adf.form.PromotorDetails(), function(i, item){
			item.Status(1);
		})
		adf.sectionDisable("#c-3", false)
		swal("Success", "Data Management & Promoter Details confirmed", "success");
	}else{
		$("#addpromotor").prop("disabled", false);
		adf.optionSectionPromoterConfirm(" Confirm");
		// adf.EnableAllfields(true)
		$("#onreset3").prop("disabled", false);
		adf.sectionDisable("#c-3", true)
		$.each(adf.form.PromotorDetails(), function(i, item){
			item.Status(0);
		})
		$('html, body').animate({ scrollTop: $('#c-3').offset().top }, 'slow')
	}

	$(".mincibil").prop("disabled", true);

	var url = "/accountdetail/savesectionaccount"
	var param = adf.getForm()

	adf.isLoading(true)
	app.ajaxPost(url, param, function (res) {
		adf.isLoading(false)
		var data = ko.mapping.toJS(adf.form)
		ko.mapping.fromJS(data, adf.Tempform)
	}, function () {
		adf.isLoading(false)
	});

}

adf.SavePersection = function(section){
	if(section == "account"){
		var url = "/accountdetail/savesectionaccount"
		var param =adf.getForm()
		param.AccountSetupDetails.PdInfo.PdDate = kendo.parseDate(adf.PdDate(), "dd-MMM-yyyy");
		adf.isLoading(true)
		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)
			// console.log(res.Status)
			if(res.Status == "NOK"){
				swal("Warning", "Please save all first, for new Account Detail data", "warning");
				return;
			}

			swal("Success", "Successfully Account Set-Up Details", "success");
			// $(".promoter").enable(false)
			// $("#onreset3").prop("disabled", true);
		}, function () {
			adf.isLoading(false)
		});
	}else if(section == "borrower"){
		var dataGrid = $("#refrence").data().kendoGrid.dataSource.data();
		adf.form.BorrowerDetails.Status(0)
		adf.form.LoanDetails.FirstAgreementDate = kendo.parseDate(new Date(adf.FirstAgreementDate()), "dd-MMM-yyyy")
		adf.form.BorrowerDetails.RefrenceCheck([])
		$.each(dataGrid, function(i, item){
			// console.log(item.IsPositive)
			adf.form.BorrowerDetails.RefrenceCheck.push(
				{
					Source : item.Source,
					SourceName : item.SourceName,
					CheckBy : item.CheckBy,
					IsPositive : item.IsPositive,
					FeedBack : item.FeedBack,
				}
			)
		});
		var url = "/accountdetail/savesectionborrower"
		var param =adf.getForm()

		adf.isLoading(true)
		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)
			var data = ko.mapping.toJS(adf.form)
			ko.mapping.fromJS(data, adf.Tempform)
			if(res.Status == "NOK"){
			swal("Warning", "Please save all first, for new Account Detail data", "warning");
				return;
		}


			swal("Success", "Successfully Borrower Details", "success");
			// $(".promoter").enable(false)
			// $("#onreset3").prop("disabled", true);
		}, function () {
			adf.isLoading(false)
		});
	}else if(section == "promotor"){

		generatemc()

		var url = "/accountdetail/savesectionpromotor"
		var param =adf.getForm()

		adf.isLoading(true)
		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)
			var data = ko.mapping.toJS(adf.form)
			ko.mapping.fromJS(data, adf.Tempform)
			if(res.Status == "NOK"){
				swal("Warning", "Please save all first, for new Account Detail data", "warning");
					return;
			}

			swal("Success", "Successfully Management & Promoter Details", "success");
			// $(".promoter").enable(false)
			// $("#onreset3").prop("disabled", true);
		}, function () {
			adf.isLoading(false)
		});
	}else if(section == "vendor"){
		var loop = 0;
		$.each(adf.form.VendorDetails(), function(i, item){
			if(item.DistributorName() == ""){
				// swal("Warning", "Distributor Name on Distributor / Vendor Repayment Track is Empty", "warning");
				loop = loop + 0;
			}else{
				loop= loop + 1;
			}

			// console.log(loop)
		})
		var url = "/accountdetail/savesectionvendor"
		var param =adf.getForm()

		adf.isLoading(true)
		if(loop == adf.form.VendorDetails().length){
			app.ajaxPost(url, param, function (res) {
				adf.isLoading(false)
				var data = ko.mapping.toJS(adf.form)
				ko.mapping.fromJS(data, adf.Tempform)
				if(res.Status == "NOK"){
				swal("Warning", "Please save all first, for new Account Detail data", "warning");
					return;
			}

				swal("Success", "Successfully Distributor / Vendor Repayment Track", "success");
				// $(".promoter").enable(false)
				// $("#onreset3").prop("disabled", true);
			}, function () {
				adf.isLoading(false)
			});
		}

	}else if(section == "loan"){
		ComputedGO();
		var url = "/accountdetail/savesectionloan";
		var param =adf.getForm()

		adf.isLoading(true)
		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)
			var data = ko.mapping.toJS(adf.form)
			ko.mapping.fromJS(data, adf.Tempform)
			if(res.Status == "NOK"){
			swal("Warning", "Please save all first, for new Account Detail data", "warning");
				return;
		}

			swal("Success", "Successfully Save Loan Details", "success");
			// $(".promoter").enable(false)
			// $("#onreset3").prop("disabled", true);
		}, function () {
			adf.isLoading(false)
		});

	}else if(section == "backing"){
		var url = "/accountdetail/savepurchaseorderbacking"
		var param =adf.getForm()

		adf.isLoading(true)
		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)
			var data = ko.mapping.toJS(adf.form)
			ko.mapping.fromJS(data, adf.Tempform)
			if(res.Status == "NOK"){
			swal("Warning", "Please save all first, for new Account Detail data", "warning");
				return;
		}

			swal("Success", "Successfully Save Purchase Order Backing", "success");
			// $(".promoter").enable(false)
			// $("#onreset3").prop("disabled", true);
		}, function () {
			adf.isLoading(false)
		});
	}else if(section == "customer"){
		var url = "/accountdetail/savesectioncustomer"
		var res1 = adf.form.CustomerBussinesMix.B2BGovtIn() + adf.form.CustomerBussinesMix.StockSellIn() + adf.form.CustomerBussinesMix.B2BCorporateIn();
		if(res1 > 100){
			swal("Warning!", "Distributor mix Exceed 100", "warning");

		}else{
			var param =adf.getForm()

			adf.isLoading(true)
			app.ajaxPost(url, param, function (res) {
				adf.isLoading(false)

				if(res.Status == "NOK"){
			swal("Warning", "Please save all first, for new Account Detail data", "warning");
				return;
		}

				swal("Success", "Successfully Customer Business Mix", "success");
				// $(".promoter").enable(false)
				// $("#onreset3").prop("disabled", true);
			}, function () {
				adf.isLoading(false)
			});
		}
	}else if(section == "distributor"){
		var url = "/accountdetail/savesectiondistributor"
		var res2 = 0;
		$.each(adf.form.DistributorMix.Data(), function(i, items){
			res2 += items.Result()
		})
		if(res2 > 100){
			swal("Warning!", "Customer Business mix Exceed 100", "warning");

		}else{
			var param =adf.getForm()

			adf.isLoading(true)
			app.ajaxPost(url, param, function (res) {
				adf.isLoading(false)
				var data = ko.mapping.toJS(adf.form)
				ko.mapping.fromJS(data, adf.Tempform)
				if(res.Status == "NOK"){
			swal("Warning", "Please save all first, for new Account Detail data", "warning");
				return;
		}

				swal("Success", "Successfully Distributor Mix", "success");
				// $(".promoter").enable(false)
				// $("#onreset3").prop("disabled", true);
			}, function () {
				adf.isLoading(false)
			});
		}
	}
}
adf.getDistributorConfirm = function(){
	if(adf.optionSectionVendorConfirm() == " Confirm"){
		adf.optionSectionVendorConfirm(" Re Enter");
		$("#onreset4").prop("disabled", true);
		$("#addvendor").prop("disabled", true);
		$("#avg").prop("disabled", true)
		$("#max").prop("disabled", true)
		$.each(adf.form.VendorDetails(), function(i, item){
			item.Status(1);
		})
		adf.sectionDisable("#c-4", false)
		swal("Success", "Data Distributor / Vendor Repayment Track confirmed", "success");
	}else{
		$("#addvendor").prop("disabled", false);
		adf.optionSectionVendorConfirm(" Confirm");
		adf.sectionDisable("#c-4", true)
		$("#onreset4").prop("disabled", false);
		$.each(adf.form.VendorDetails(), function(i, item){
			item.Status(0);
		})
		$("#avg").prop("disabled", true)
		$("#max").prop("disabled", true)
		$('html, body').animate({ scrollTop: $('#c-4').offset().top },'slow')
	}

	var url = "/accountdetail/saveaccountdetail"
	var param = adf.getForm()

	adf.isLoading(true)
	app.ajaxPost(url, param, function (res) {
		adf.isLoading(false)
		var data = ko.mapping.toJS(adf.form)
		ko.mapping.fromJS(data, adf.Tempform)
	}, function () {
		adf.isLoading(false)
	});


}
adf.getLoanConfirm = function(){
	if(adf.optionSectionLoanConfirm() == " Confirm"){
		adf.optionSectionLoanConfirm(" Re Enter");
		adf.form.LoanDetails.Status(1);
		adf.sectionDisable("#c-5", false)
		$("#onreset5").prop("disabled", true);
		$("#LoanAmount").prop( "disabled", true );
		swal("Success", "Data Loan Details confirmed", "success");
	}else{
		adf.optionSectionLoanConfirm(" Confirm");
		adf.sectionDisable("#c-5", true)
		adf.form.LoanDetails.Status(0)
		$("#onreset5").prop("disabled", false);
		$("#LoanAmount").prop( "disabled", true );
		$('html, body').animate({ scrollTop: $('#c-5').offset().top }, 'slow')
	}
	// adf.form.LoanDetails.Status(1)
	var url = "/accountdetail/saveaccountdetail"
	var param = adf.getForm()

	adf.isLoading(true)
	app.ajaxPost(url, param, function (res) {
		adf.isLoading(false)
		var data = ko.mapping.toJS(adf.form)
		ko.mapping.fromJS(data, adf.Tempform)
	}, function () {
		adf.isLoading(false)
	});




}

// adf.getPurchaseOrderBackingConfirm = function(){
// 	if(adf.optionPurchaseOrderBackingConfirm() == " Confirm"){
// 		adf.optionPurchaseOrderBackingConfirm(" Re Enter");
// 		adf.form.PurchaseOrderBacking.Status(1);
// 		adf.sectionDisable("#c-6", false)
// 		$("#onreset6").prop("disabled", true);
// 		swal("Success", "Successfully Confirm Purchase Order Backing", "success");
// 	}else{
// 		adf.optionPurchaseOrderBackingConfirm(" Confirm");
// 		adf.sectionDisable("#c-6", true)
// 		adf.form.PurchaseOrderBacking.Status(0)
// 		$("#onreset6").prop("disabled", false);
// 		$('html, body').animate({ scrollTop: $('#c-6').offset().top }, 'slow')
// 	}
// 	var url = "/accountdetail/savepurchaseorderbacking"
// 	var param =adf.getForm()

// 	adf.isLoading(true)
// 	app.ajaxPost(url, param, function (res) {
// 		adf.isLoading(false)

// 		if(res.Status == "NOK"){
// 			swal("Warning", "Please save all first, for new Account Detail data", "warning");
// 			return;
// 		}
// 	}, function () {
// 		adf.isLoading(false)

// 	});

// }

adf.getBusinessConfirm = function(){
	var url = "/accountdetail/saveaccountdetail"
	var res1 = adf.form.CustomerBussinesMix.B2BGovtIn() + adf.form.CustomerBussinesMix.StockSellIn() + adf.form.CustomerBussinesMix.B2BCorporateIn();
	if(res1 > 100){
		swal("Warning!", "Distributor mix Exceed 100", "warning");

	}else{
		if(adf.optionSectionCustomerConfirm() == " Confirm"){
			adf.optionSectionCustomerConfirm(" Re Enter");
			adf.form.CustomerBussinesMix.Status(1);
			adf.sectionDisable("#c-7", false)
			$("#onreset6").prop("disabled", true);
			swal("Success", "Successfully Customer Business Mix", "success");
		}else{
			adf.optionSectionCustomerConfirm(" Confirm");
			adf.sectionDisable("#c-7", true)
			adf.form.CustomerBussinesMix.Status(0)
			$("#onreset6").prop("disabled", false);
			$('html, body').animate({ scrollTop: $('#c-7').offset().top }, 'slow')
		}
		var param =adf.getForm()

		adf.isLoading(true)
		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)
			var data = ko.mapping.toJS(adf.form)
			ko.mapping.fromJS(data, adf.Tempform)
			if(res.Status == "NOK"){
				swal("Warning", "Please save all first, for new Account Detail data", "warning");
				return;
			}
		}, function () {
			adf.isLoading(false)

		});
	}


}
adf.getDistributtorMixConfirm = function(){
	if(adf.optionSectionDistributorConfirm() == " Confirm"){
		adf.optionSectionDistributorConfirm(" Re Enter");
		adf.form.DistributorMix.Status(1);
		adf.sectionDisable("#c-8", false)
		$("#onreset8").prop("disabled", true);
		swal("Success", "Data Distributor Mix confirmed", "success");
	}else{
		adf.optionSectionDistributorConfirm(" Confirm");
		adf.sectionDisable("#c-8", true)
		adf.form.DistributorMix.Status(0)
		$("#onreset7").prop("disabled", false);
		$('html, body').animate({ scrollTop: $('#c-7').offset().top }, 'slow')
	}
	// adf.form.DistributorMix.Status(1)
	var url = "/accountdetail/saveaccountdetail"
	var param = adf.getForm();
	adf.isLoading(true)
	var data = ko.mapping.toJS(adf.form)
	ko.mapping.fromJS(data, adf.Tempform)
	app.ajaxPost(url, param, function (res) {
		adf.isLoading(false)

	}, function () {
		adf.isLoading(false)
	});


}
adf.getUnfreeze = function(){
	$('.form-last-confirmation-info').html('');
	$("#LoanAmount").prop( "disabled", true );
	var res1 = adf.form.CustomerBussinesMix.B2BGovtIn() + adf.form.CustomerBussinesMix.StockSellIn() + adf.form.CustomerBussinesMix.B2BCorporateIn();
	var res2 = 0;
	$.each(adf.form.DistributorMix.Data(), function(i, items){
		res2 += items.Result()
	})
	if(res1 > 100){
		swal("Warning", "Distributor mix Exceed 100", "warning");
		adf.isLoading(false)

	}else if(res2 > 100){
		swal("Warning", "Customer Business mix Exceed 100", "warning");
		adf.isLoading(false)

	}else{
		adf.form.Freeze(false);
		var url = "/accountdetail/saveaccountdetail"
		var param = adf.getForm()
		// adf.form.AccountSetupDetails.Status(0)
		adf.isLoading(true)
		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)
			adf.optionSectionAccountConfirm(" Confirm")
			adf.optionSectionDistributorConfirm(" Confirm")
			adf.optionSectionBorrowerConfirm(" Confirm")
			adf.optionSectionPromoterConfirm(" Confirm")
			adf.optionSectionVendorConfirm(" Confirm")
			adf.optionSectionLoanConfirm(" Confirm")
			adf.optionSectionCustomerConfirm(" Confirm")
			adf.optionSectionDistributorConfirm(" Confirm")
			swal("Successfully Unfreezed", "", "success");
			adf.optionConfirm(true)
			if(adf.form.Status() == 1){
				adf.EnableAllfields(false)
				$("#city").prop( "disabled", true);
				$("#DealNo").prop( "disabled", true);
				$("#onconfirm").prop( "disabled", false);
				// ($("#loginDate").data("kendoDatePicker")).readonly();
				$("#LoanAmount").prop( "disabled", true );
				$("#addpromotor").prop( "disabled", true );
			}else{
				adf.EnableAllfields(true)
			}
			setTimeout(function(){
			}, 500)
			// $("#onreset").prop("disabled", false);
			// $("#onreset1").prop("disabled", false);
			// adf.sectionDisable("#c-1", true)
			// adf.form.AccountSetupDetails.Status(0)

			// adf.sectionDisable("#c-2", true)
			// $("#onreset2").prop("disabled", false);
			// adf.form.BorrowerDetails.Status(0)
			// $("#onreset3").prop("disabled", false);

			// adf.sectionDisable("#c-3", true)
			// $.each(adf.form.PromotorDetails(), function(i, item){
			// 	item.Status(0);
			// })

			// adf.sectionDisable("#c-4", true)
			// $("#onreset4").prop("disabled", false);
			// $.each(adf.form.VendorDetails(), function(i, item){
			// 	item.Status(0);
			// })

			// adf.sectionDisable("#c-5", true)
			// adf.form.LoanDetails.Status(0)
			// $("#onreset5").prop("disabled", false);
			// if(adf.loadIfBackedByPO() == false){
			// 	$("#BackToBack").getKendoNumericTextBox().enable(false)
			// 	$("#Expected").getKendoNumericTextBox().enable(false)
			// }

			// adf.sectionDisable("#c-7", true)
			// adf.form.CustomerBussinesMix.Status(0)
			// $("#onreset6").prop("disabled", false);

			// adf.sectionDisable("#c-8", true)
			// adf.form.DistributorMix.Status(0)
			// $("#onreset8").prop("disabled", false);
			// $("#avg").prop("disabled", true)
			// $("#max").prop("disabled", true)
		}, function () {
			adf.isLoading(false)
		});
	}
}
adf.sectionDisable= function(elm, what){
	$(elm+" input").prop( "disabled", !what );
	$(elm+" .noable").prop( "disabled", !what );
	$(elm+" textarea").prop( "disabled", !what );

	$(elm+" .k-widget").each(function(i,e){

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
adf.getReset = function(){
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
		// ko.mapping.fromJS(adf.optionTemporaryData(), adf.form)
		// adf.getRatingMaster(adf.getData);
	}, function(dismiss) {
		if (dismiss === 'cancel') {
			console.log("dismiss");
		}
	});
}

adf.initFreshForm = function (customerId, dealNo) {
	adf.resetForm()
	adf.form.CustomerId(customerId)
	adf.form.DealNo(dealNo)
	adf.form.AccountSetupDetails.DealNo(dealNo)
}

adf.reloadStatus = function(status){
	if(status == 1 && adf.form.Freeze() == true){
		// alert("masuk")
		// $("#onreset").prop("disabled", true);
		// adf.EnableAllfields(false)
		adf.optionSectionAccountConfirm(" Re Enter");
		adf.optionSectionDistributorConfirm(" Re Enter");
		adf.optionSectionBorrowerConfirm(" Re Enter");
		adf.optionSectionVendorConfirm(" Re Enter");
		adf.optionSectionLoanConfirm(" Re Enter");
		adf.optionSectionCustomerConfirm(" Re Enter");
		adf.optionSectionDistributorConfirm(" Re Enter");
		adf.optionChangeConfirm(" Re-Enter");
		// adf.EnableAllfields(false)
		setTimeout(function(){
			adf.optionSectionPromoterConfirm(" Re Enter"); 
			adf.sectionDisable("#c-2", false);
			adf.sectionDisable("#c-1", false);
			adf.sectionDisable("#c-3", false);
			adf.sectionDisable("#c-4", false);
			adf.sectionDisable("#c-5", false);
			adf.sectionDisable("#c-7", false);
			adf.sectionDisable("#c-8", false);
			$("#onconfirm").prop("disabled", true);
			$("#onsave").prop("disabled", true);
			$(".onfreeze").prop("disabled", false);
			$("#onreset").prop("disabled", true );
			
		},500);
		$("#LoanAmount").prop("disabled", true );
		$("#onreset1").prop("disabled", true);
		$("#onreset2").prop("disabled", true);
		$("#onreset3").prop("disabled", true);
		$("#addpromotor").prop("disabled", true);
		$("#addvendor").prop("disabled", true);
		$("#addvendor1").prop("disabled", true);
		$("#onreset4").prop("disabled", true);
		$("#onreset5").prop("disabled", true);
		$("#onreset6").prop("disabled", true);
		$("#onreset7").prop("disabled", true);
		$("#onreset8").prop("disabled", true);
		$("#avg").prop("disabled", true)
		$("#max").prop("disabled", true)
	}else if(status == 1 && adf.form.Freeze() != true){
		adf.optionSectionAccountConfirm(" Re Enter");
		adf.optionSectionDistributorConfirm(" Re Enter");
		adf.optionSectionBorrowerConfirm(" Re Enter");
		adf.optionSectionVendorConfirm(" Re Enter");
		adf.optionSectionLoanConfirm(" Re Enter");
		adf.optionSectionCustomerConfirm(" Re Enter");
		adf.optionSectionDistributorConfirm(" Re Enter");
		adf.optionChangeConfirm(" Re-Enter");
		// adf.EnableAllfields(false)
		setTimeout(function(){
			adf.optionSectionPromoterConfirm(" Re Enter"); 
			adf.sectionDisable("#c-2", false);
			adf.sectionDisable("#c-1", false);
			adf.sectionDisable("#c-3", false);
			adf.sectionDisable("#c-4", false);
			adf.sectionDisable("#c-5", false);
			adf.sectionDisable("#c-7", false);
			adf.sectionDisable("#c-8", false);
			$("#onconfirm").prop("disabled", false);
			$("#onsave").prop("disabled", true);
			$(".onfreeze").prop("disabled", false);
			$("#onreset").prop("disabled", true );
			$("#addpromotor").prop("disabled", true);
			$("#addvendor").prop("disabled", true);
			$("#addvendor1").prop("disabled", true);
			for(var i = 0; i< adf.form.PromotorDetails().length; i++){
				$("#cibil"+i).prop("disabled", "disabled")
				$("#real"+i).prop("disabled", "disabled")
				
			}
			$("#req").prop("disabled", "disabled")
			$("#mincibil").prop("disabled", "disabled")
		},500);
		$("#LoanAmount").prop("disabled", true );
		$("#onreset1").prop("disabled", true);
		$("#onreset2").prop("disabled", true);
		$("#onreset3").prop("disabled", true);
		$("#onreset4").prop("disabled", true);
		$("#onreset5").prop("disabled", true);
		$("#onreset6").prop("disabled", true);
		$("#onreset7").prop("disabled", true);
		$("#onreset8").prop("disabled", true);
		$("#avg").prop("disabled", true)
		$("#max").prop("disabled", true)
	}else if(status == 0) {
		adf.optionSectionAccountConfirm(" Confirm");
		adf.optionSectionDistributorConfirm(" Confirm");
		adf.optionSectionBorrowerConfirm(" Confirm");
		adf.optionSectionPromoterConfirm(" Confirm");
		adf.optionSectionVendorConfirm(" Confirm");
		adf.optionSectionLoanConfirm(" Confirm");
		adf.optionSectionCustomerConfirm(" Confirm");
		adf.optionSectionDistributorConfirm(" Confirm");
		adf.optionChangeConfirm(" Confirm");
		// adf.EnableAllfields(false)
		// $("#LoanAmount").prop( "disabled", true );

		adf.sectionDisable("#c-1", true);
		adf.sectionDisable("#c-2", false);
		setTimeout(function(){
			adf.sectionDisable("#LoanAmount", false)
			adf.sectionDisable("#city", false)
			adf.sectionDisable("#DealNo", false)
			// adf.sectionDisable("#loginDate", false)
			$("#addpromotor").prop("disabled", false);
			$("#addvendor").prop("disabled", false);
			$("#addvendor1").prop("disabled", false);
			for(var i = 0; i< adf.form.PromotorDetails().length; i++){
				$("#cibil"+i).prop("disabled", "disabled");
				$("#real"+i).prop("disabled", "disabled");
			}
			$("#req").prop("disabled", "disabled")
			$("#mincibil").prop("disabled", "disabled")
		},700);
		adf.sectionDisable("#c-3", true);
		adf.sectionDisable("#c-4", true);
		adf.sectionDisable("#c-5", true);
		adf.sectionDisable("#c-7", true);
		adf.sectionDisable("#c-8", true);
		$("#onreset").prop("disabled", false);
		$("#onsave").prop("disabled", false);
		$(".onfreeze").prop("disabled", false);
		$("#LoanAmount").prop("disabled", false);
		$("#onreset1").prop("disabled", false);
		$("#onreset2").prop("disabled", false);
		$("#onreset3").prop("disabled", false);
		$("#onreset4").prop("disabled", false);
		$("#onreset5").prop("disabled", false);
		$("#onreset6").prop("disabled", false);
		$("#onreset7").prop("disabled", false);
		$("#onreset8").prop("disabled", false);
		$("#avg").prop("disabled", true)
		$("#max").prop("disabled", true)
	}
	if(adf.form.AccountSetupDetails.Status() == 0){
		adf.optionSectionBorrowerConfirm(" Confirm");
		$("#onreset1").prop("disabled", false);
		adf.sectionDisable("#c-1", true)
	}
	if(adf.form.BorrowerDetails.Status() == 0){
		adf.optionSectionBorrowerConfirm(" Confirm");
		$("#onreset2").prop("disabled", false);
		adf.sectionDisable("#c-2" , true)

	}
	$.each(adf.form.PromotorDetails(), function(i, item){
		adf.optionSectionPromoterConfirm(" Confirm");
		$("#onreset3").prop("disabled", false);
		$("#addpromotor").prop("disabled", false);
		if(item.Status() == 0){
			// $(".promoter").enable(false)
			adf.sectionDisable("#c-3", true)

		}
	})
	if(adf.form.Status() == 2){
		adf.sectionDisable("#c-4", false)
		$("#addvendor").prop("disabled", true);
		$("#onreset4").prop("disabled", true);
	}
	// $.each(adf.form.VendorDetails(), function(i, item){
	// 	adf.optionSectionVendorConfirm(" Re Enter");
	// 	$("#onreset4").prop("disabled", true);
	// 	if(item.Status() == 1){
	// 		// $(".vendor").enable(false)
	// 		adf.sectionDisable("#c-4", false)

	// 	}
	// })
	// if(adf.form.LoanDetails.Status() == 0){
	// 	setTimeout(function(){
	// 		adf.optionSectionLoanConfirm(" Confirm");
	// 		$("#onreset5").prop("disabled", false);
	// 		adf.sectionDisable("#c-5", true)
	// 	}, 500)


	// }
	if(adf.form.CustomerBussinesMix.Status() == 0){
		adf.optionSectionCustomerConfirm(" Confirm");
		$("#onreset6").prop("disabled", false);
		adf.sectionDisable("#c-7", true)

	}
	if(adf.form.DistributorMix.Status() == 0){
		adf.optionSectionDistributorConfirm(" Confirm");
		$("#onreset7").prop("disabled", false);
		adf.sectionDisable("#c-8", true)

	}

	setTimeout(function(){
		adf.loanDetailEnable()
	}, 500)
}

adf.getData = function () {
	// alert("masuk")
	adf.formVisibility(true)

	var customerId = filter().CustomerSearchVal()
	var dealNo = filter().DealNumberSearchVal()

	adf.isLoading(true)

	var url = "/datacapturing/getcustomerprofiledetailconfirmed"
	var param = {
		CustomerId: customerId,
		DealNo: dealNo
	}
	app.ajaxPost(url, param, function (res) {
		if (typeof res.ApplicantDetail == "undefined" || res.ApplicantDetail.CustomerID == null) {
			res = checkConfirmedOrNot(res.Status, 1, 2, res, [], "Customer Application");

		}
		// console.log("----------->>> data res", res.DetailOfPromoters)
		if (res.Status == 1) {
			res.DetailOfPromoters.Biodata = _.map(res.DetailOfPromoters.Biodata,function(x){ 
				 x.Name = toTitleCase(x.Name)
				 return x  
			})

			setTimeout(function(){
				adf.form.AccountSetupDetails.CityName(res.ApplicantDetail.RegisteredAddress.CityRegistered)
			}, 500);
			setTimeout(function(){
				$.each(res.DetailOfPromoters.Biodata, function(i, item){
					if(adf.form.PromotorDetails()[i] != undefined){
						adf.form.PromotorDetails()[i].CibilScore(item.CIBILScore)
					}
					// console.log(adf.form.PromotorDetails()[i].CibilScore())
					//
				})
				adf.form.LoanDetails.ProposedLoanAmount(res.ApplicantDetail.AmountLoan/100000)
				// console.log(res[0].ApplicantDetail.AmountLoan)
			}, 500);

			adf.optionPromotors(_.sortBy(res.DetailOfPromoters.Biodata, 'Name'));
			var date = moment(adf.form.AccountSetupDetails.PdInfo.PdDate()).format('DD-MMM-YYYY');
			adf.PdDate(date);
		}

		var url = "/accountdetail/getaccountdetail"
		var param = {
			customerId: customerId,
			dealNo: dealNo
		}

		mincibil(0)

		app.ajaxPost(url, param, function (res) {
			adf.isLoading(false)
			
			if (res.Message == "data not found") {
				adf.setForm(res.Data)
				adf.PdDate("")
				adf.CMISNULL(true);
				adf.form.AccountSetupDetails.PdInfo.CustomerMargin("");
				adf.form.LoanDetails.FirstAgreementDate("");
				adf.form.LoanDetails.RecenetAgreementDate("");
				adf.form.BorrowerDetails.DateBusinessStarted("");
				adf.form.LoanDetails.IfBackedByPO("");
				adf.form.LoanDetails.IfExistingCustomer("");
				adf.addRowReffrence();
				adf.initFreshForm(customerId, dealNo)
				adf.reloadStatus(0)
				adf.form.AccountSetupDetails.PdInfo.CustomerMargin("");
				if(adf.form.Freeze() == true){
					adf.EnableAllfields(false)

					if(adf.PdDate() ==""){
						$('#tipster').tooltipster('destroy')
						$('#tipster').tooltipster({
							contentAsHTML: true,
					    	interactive: true,
					    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span></span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
						})
					}else{
						$('#tipster').tooltipster('destroy')
						$('#tipster').tooltipster({
							contentAsHTML: true,
					    	interactive: true,
					    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span>"+kendo.toString(new Date(adf.PdDate()),"dd-MMM-yyyy") +"</span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
						})
					}
				}else if(adf.form.Freeze() == false){
					adf.EnableAllfields(true)
					try{
						$('#tipster').tooltipster('destroy')
					}catch(e){

					}

					if(adf.PdDate() ==""){
						// $('#tipster').tooltipster('destroy')
						$('#tipster').tooltipster({
							contentAsHTML: true,
					    	interactive: true,
					    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span></span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
						})
					}else{
						// $('#tipster').tooltipster('destroy')
						$('#tipster').tooltipster({
							contentAsHTML: true,
					    	interactive: true,
					    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span>"+kendo.toString(new Date(adf.PdDate()),"dd-MMM-yyyy") +"</span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
						})
					}
					
				}
			} else {
				setTimeout(function(){
					console.log(res.Data.AccountSetupDetails.PdInfo.PdDate.indexOf("1970"))
					adf.reloadStatus(res.Data.Status)
					console.log("------>>1856",res.Data.AccountSetupDetails.PdInfo.PdDate.indexOf("1970"))
					adf.CMISNULL(res.Data.CMISNULL);

					if(adf.CMISNULL()){
						adf.form.AccountSetupDetails.PdInfo.CustomerMargin("")
					}

					if(res.Data.AccountSetupDetails.PdInfo.PdDate.indexOf("1970") >-1)
						adf.PdDate("")

						if(res.Data.LoanDetails.FirstAgreementDate.indexOf("1970") >-1)
						adf.form.LoanDetails.FirstAgreementDate("");

						if(res.Data.LoanDetails.RecenetAgreementDate.indexOf("1970") >-1)
						adf.form.LoanDetails.RecenetAgreementDate("");

						if(res.Data.BorrowerDetails.DateBusinessStarted.indexOf("1970") >-1)
						adf.form.BorrowerDetails.DateBusinessStarted("");


						if(adf.PdDate().indexOf("1970") > -1 || adf.PdDate() == ''){
								adf.PdDate("")
								$('#tipster').tooltipster('destroy')
								$('#tipster').tooltipster({
									contentAsHTML: true,
							    	interactive: true,
							    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span></span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
								})
							}else{
								// console.log(adf.PdDate())
								$('#tipster').tooltipster('destroy')
								$('#tipster').tooltipster({
									contentAsHTML: true,
							    	interactive: true,
							    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span>"+kendo.toString(new Date(adf.PdDate()),"dd-MMM-yyyy")+"</span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
								})
						}


					if(res.Data.AccountSetupDetails.PdInfo.PdDate.indexOf("1970") >-1 || res.Data.LoanDetails.FirstAgreementDate.indexOf("1970") >-1 || res.Data.LoanDetails.RecenetAgreementDate.indexOf("1970") >-1){
						
						

						// adf.form.AccountSetupDetails.LoginDate((new Date).toISOString())
						if(adf.form.Freeze() == true || adf.form.Status() == 1){

							adf.EnableAllfields(false)
							$('#tipster').tooltipster({
								contentAsHTML: true,
						    	interactive: true,
						    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span>"+kendo.toString(new Date(adf.PdDate()),"dd-MMM-yyyy")+"</span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
							})
						}else if(adf.form.Freeze() == false){
							adf.EnableAllfields(true)
						}
					}
					
					if(res.Data.DistributorMix.Data == null){
						adf.form.DistributorMix.Data([
							{Label: ko.observable(""), Result: ko.observable(0)}
						]);
					}

				}, 1000)
				adf.form.BorrowerDetails.DateBusinessStarted("");
				adf.form.LoanDetails.IfBackedByPO("");
				
				res.Data.AccountSetupDetails.LeadDistributor = toTitleCase(res.Data.AccountSetupDetails.LeadDistributor); 
				res.Data.PromotorDetails = _.map(res.Data.PromotorDetails,function(x){ 
				 x.PromoterName = toTitleCase(x.PromoterName)
				 return x  
				})

				if(res.Data.Status == 1 && res.Data.Freeze != true){
			        $('.form-last-confirmation-info').html('Last Confirmed on: '+kendo.toString(new Date(res.Data.DateConfirmed),"dd-MM-yyyy h:mm:ss tt") )
			    } else if(res.Data.Status == 1 && res.Data.Freeze == true){
			        $('.form-last-confirmation-info').html('Last Freezed on: '+kendo.toString(new Date(res.Data.DateFreeze),"dd-MM-yyyy h:mm:ss tt") )
			    }else if(res.Data.Status == 0 && res.Data.Freeze == true){
			        $('.form-last-confirmation-info').html('Last Freezed on: '+kendo.toString(new Date(res.Data.DateFreeze),"dd-MM-yyyy h:mm:ss tt") )
			    }else if(res.Data.DateSave != '' && res.Data.Freeze != true){
			    	$('.form-last-confirmation-info').html('Last Saved on: '+kendo.toString(new Date(res.Data.DateSave),"dd-MM-yyyy h:mm:ss tt") )
			    }else{
			    	$('.form-last-confirmation-info').html('');
			    }
				if (!(res.Data.PromotorDetails instanceof Array)) {
					res.Data.PromotorDetails = [res.Data.PromotorDetails]
				}

				// console.log(res.Data)
				adf.FirstAgreementDate(res.Data.LoanDetails.FirstAgreementDate)
				adf.optionTemporaryData(res.Data)
				adf.setForm(res.Data)
				// adf.loanDetailEnable()
				
				setTimeout(function(){
					adf.LoadPromotorEducation();
					$("#refrence").data("kendoGrid").dataSource.data(ko.mapping.toJS(adf.form.BorrowerDetails.RefrenceCheck()));
				}, 500)
				adf.form.BorrowerDetails.ProductNameandDetails([""])
				adf.form.BorrowerDetails.TopCustomerNames([""])
				// console.log(res.Data.BorrowerDetails.ProductNameandDetails)
				setTimeout(function(){
					adf.form.BorrowerDetails.ProductNameandDetails([])
					adf.form.BorrowerDetails.TopCustomerNames([])

					if(res.Data.BorrowerDetails.TopCustomerNames == null || res.Data.BorrowerDetails.TopCustomerNames.length == 0){
						adf.form.BorrowerDetails.TopCustomerNames([""])
					} else{
						$.each(res.Data.BorrowerDetails.ProductNameandDetails, function(i, value){
							// console.log(value);
							adf.form.BorrowerDetails.ProductNameandDetails.push(value)
						});
					}
					if(res.Data.BorrowerDetails.TopCustomerNames == null || res.Data.BorrowerDetails.ProductNameandDetails.length == 0){
						adf.form.BorrowerDetails.ProductNameandDetails([""])
					} else{
						$.each(res.Data.BorrowerDetails.TopCustomerNames, function(i, value){
							// console.log(value);
							adf.form.BorrowerDetails.TopCustomerNames.push(value)
						});
					}
				}, 500)

				

				adf.PdDate(kendo.toString(new Date(adf.form.AccountSetupDetails.PdInfo.PdDate()),"dd-MMM-yyyy"))

				generatemc()

				adf.onclickDismissModal();
			}
		}, function () {
			adf.isLoading(false)

		})
	}, function () {
		adf.isLoading(false)
	})
}
window.refreshFilter = function () {
	adf.FirstAgreementDate("");
	adf.form.BorrowerDetails.RefrenceCheck([])
	adf.getRatingMaster(adf.getData)
	adf.loadRefrenceGrid();
	// if(adf.PdDate() == ""){
	// 	adf.PdDate((new Date()).toISOString())
	// }
	$('.form-last-confirmation-info').html('');
	// setTimeout(function(){
	// 	console.log("--------->>>>1953",adf.PdDate())
	// 	if(adf.PdDate().indexOf("1970") > -1 || adf.PdDate() == ''){
	// 		adf.PdDate("")
	// 		$('#PD').tooltipster('destroy')
	// 		$('#PD').tooltipster({
	// 			contentAsHTML: true,
	// 	    	interactive: true,
	// 	    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span></span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
	// 		})
	// 	}else{
	// 		// adf.PdDate("")
	// 		console.log(adf.PdDate())
	// 		$('#PD').tooltipster('destroy')
	// 		$('#PD').tooltipster({
	// 			contentAsHTML: true,
	// 	    	interactive: true,
	// 	    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span>"+kendo.toString(new Date(adf.PdDate()),"dd-MMM-yyyy")+"</span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
	// 		})
	// 	}
	// }, 1000)
	
	
}
adf.initEvents = function () {
	filter().CustomerSearchVal.subscribe(function () {
		adf.formVisibility(false)
	})
	filter().DealNumberSearchVal.subscribe(function () {
		adf.formVisibility(false)
	})

	//$('#refresh').remove()
}
adf.getRatingMaster = function (callback) {
	adf.isLoading(true)
	app.ajaxPost("/rating/getratingmaster", {}, function (res) {
		adf.optionRatingMasters(res)
		// adf.optionRatingMastersCustomerSegment(res.filter(function (d) {
		// 	return (d.ParametersGroup.toLowerCase().indexOf("Industry & Business Risk Parameters".toLowerCase()) > -1)
		// 		&& (d.Parameters.toLowerCase() == "Customer Segment".toLowerCase())
		// }))
		adf.optionDiversificationCustomers(res.filter(function (d) {
			return (d.ParametersGroup.toLowerCase().indexOf("Industry & Business Risk Parameters".toLowerCase()) > -1)
				&& (d.Parameters.toLowerCase() == "Diversification: no. of clients / customers".toLowerCase())
		}))
		adf.optionDependenceOnSuppliers(res.filter(function (d) {
			return (d.ParametersGroup.toLowerCase().indexOf("Industry & Business Risk Parameters".toLowerCase()) > -1)
				&& (d.Parameters.toLowerCase() == "Dependence on suppliers".toLowerCase())
		}))
		adf.optionBusinessVintages(res.filter(function (d) {
			return (d.ParametersGroup.toLowerCase().indexOf("Industry & Business Risk Parameters".toLowerCase()) > -1)
				&& (d.Parameters.toLowerCase() == "Business Vintage".toLowerCase())
		}))
		// adf.optionMarketReferences(res.filter(function (d) {
		// 	return (d.ParametersGroup.toLowerCase() == "Management / Promoters Risk Parameters".toLowerCase())
		// 		&& (d.Parameters.toLowerCase() == "Market Reference of promoters".toLowerCase())
		// }))
		adf.optionExperienceInSameLineOfBusiness(res.filter(function (d) {
			return (d.ParametersGroup.toLowerCase() == "Management / Promoters Risk Parameters".toLowerCase())
				&& (d.Parameters.toLowerCase() == "Experience in the same line of business".toLowerCase())
		}))
		// adf.optionEducationalQualificationOfMainPromoters(res.filter(function (d) {
		// 	return (d.ParametersGroup.toLowerCase() == "Management / Promoters Risk Parameters".toLowerCase())
		// 		&& (d.Parameters.toLowerCase() == "Educational Qualification of main promoter".toLowerCase())
		// }))
		// adf.optionResiOwnershipStatus(res.filter(function (d) {
		// 	return (d.ParametersGroup.toLowerCase() == "Management / Promoters Risk Parameters".toLowerCase())
		// 		&& (d.Parameters.toLowerCase() == "Resi Ownership Status".toLowerCase())
		// }))
		// adf.optionOfficeOwnershipStatus(res.filter(function (d) {
		// 	return (d.ParametersGroup.toLowerCase() == "Management / Promoters Risk Parameters".toLowerCase())
		// 		&& (d.Parameters.toLowerCase() == "Office Ownership Status".toLowerCase())
		// }))
		adf.optionCibilScores(res.filter(function (d) {
			return (d.ParametersGroup.toLowerCase() == "Management / Promoters Risk Parameters".toLowerCase())
				&& (d.Parameters.toLowerCase() == "CIBIL Scores".toLowerCase())
		}))
		// adf.optionBorrowerConstitutionList(res.filter(function (d) {
		// 	return (d.ParametersGroup.toLowerCase().indexOf("Industry & Business Risk Parameters".toLowerCase()) > -1)
		// 		&& (d.Parameters.toLowerCase() == "Borrower Constitution".toLowerCase())
		// }))

		if (typeof callback == 'function') {
			callback(res)
		}
	})
}

adf.initData = function () {
	adf.getRatingMaster()
}

adf.addMoreRealEstatePosition = function (promotor) {
	$(".bag").addClass("btn btn-sm btn-danger btn-flat")
	// console.log(promotor)
	return function () {
		promotor.RealEstatePosition.push(ko.mapping.fromJS({ value: 0 }))
		adf.fixMultiSectionCSS()
	}
}
adf.removeRealEstate = function (vendor, index) {
	return function () {
		var realEsates = vendor.RealEstatePosition().filter(function (d, i) {
			return i !== index
		})
		vendor.RealEstatePosition(realEsates)
		adf.fixMultiSectionCSS()
	}
}

adf.addMoreVendor = function (o) {
	adf.form.VendorDetails.push(ko.mapping.fromJS(toolkit.clone(adf.templateVendorDetails)))
	adf.fixMultiSectionCSS()
	$(o).closest('[id]').find('.vendor-col-content .wrapper .clear').remove()
	$('<div />').addClass('clear').css('clear', 'both').appendTo($(o).closest('[id]').find('.vendor-col-content .wrapper'))
}
adf.removeVendor = function (data) {
	return function () {
		adf.form.VendorDetails.remove(data)
		if (adf.form.VendorDetails().length == 0) {
			adf.addMoreVendor()
		}
	}
}

adf.addMorePromotor = function (o) {
	// console.log(o)
	var each = ko.mapping.fromJS(toolkit.clone(adf.templatePromotorDetails))
	adf.form.PromotorDetails.push(each)
	adf.addMoreRealEstatePosition(each)()
	adf.fixMultiSectionCSS()
	$(".real").prop("disabled", "disabled")
	$(o).closest('[id]').find('.vendor-col-content .wrapper .clear').remove()
	$('<div />').addClass('clear').css('clear', 'both').appendTo($(o).closest('[id]').find('.vendor-col-content .wrapper'))
}
adf.removePromotor = function (data) {
	return function () {
		adf.form.PromotorDetails.remove(data)
		if (adf.form.PromotorDetails().length == 0) {
			adf.addMorePromotor()
		}
	}
}

adf.fixMultiSectionCSS = function () {
	var width = 200
	var totalWidth = width * _.max([
		adf.form.PromotorDetails().length,
		adf.form.VendorDetails().length
	])
	$('.wrapper').width(totalWidth)

	var maxPromotors = _.max(adf.form.PromotorDetails().map(function (d) {
	    return d.RealEstatePosition().length
	}))
	$('#c-3 .vendor-col-header').css('padding-bottom', maxPromotors * 68)
	$('#c-3 .vendor-col-header1').css('padding-bottom', 10)
}

adf.sumRealEstate = function (promotor) {
	// console.log(promotor);
	return ko.computed(function () {
		var value = 0

		toolkit.try(function () {
			value = toolkit.sum(promotor.RealEstatePosition(), function (d) {
				return d.value()
			})
		})

		return value
	}, promotor.RealEstatePosition)
}

adf.EnableAllfields = function(what){

$("#AD-Container input").prop( "disabled", !what );
// $(elm+" input").prop( "disabled", !what );
$("#AD-Container .noable").prop( "disabled", !what );
$(".ontop").prop( "disabled", !what );

// $("#AD-Container .btn").prop( "disabled", !what );
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

  	for(var i = 0; i< adf.form.PromotorDetails().length; i++){
		$("#cibil"+i).prop("disabled", "disabled")
		$("#real"+i).prop("disabled", "disabled")
	}
	$("#req").prop("disabled", "disabled")
	$("#mincibil").prop("disabled", "disabled")


}

adf.EnableAllfieldsOnconfirm = function(what){

	$("#AD-Container input").prop( "disabled", !what );
	// $(elm+" input").prop( "disabled", !what );
	$("#AD-Container .noable").prop( "disabled", !what );
	// $("#AD-Container .btn").prop( "disabled", !what );
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

	$(".cibilscored").prop("disabled", true);

}

adf.modalPdInfo = function(){
	// alert('masuk');
	// adf.PdDate('');
	if(adf.PdDate() == ""){
		adf.PdDate("")
	}

	if(adf.CMISNULL()){
		adf.form.AccountSetupDetails.PdInfo.CustomerMargin("");
	}

	$("#PDdate").kendoDatePicker({
		format: 'dd-MMM-yyyy',
	});
	$("#PDinfo").modal('show', true);
	// var todayDate = kendo.toString(kendo.parseDate(new Date()), 'dd-MMM-yyyy')
}

adf.addTopCustomerNames = function(index){
	if(adf.form.BorrowerDetails.TopCustomerNames().length >= 5){

		swal("Warning", "Only 5 entries allowed for Top Customers", "warning");
	}else{
		adf.form.BorrowerDetails.TopCustomerNames.push("");
	}

}

adf.removeTopCustomerNames = function(index){
return function(){
	var realEsates = adf.form.BorrowerDetails.TopCustomerNames().filter(function (d, i) {
			return i !== index
		})
		adf.form.BorrowerDetails.TopCustomerNames(realEsates)
	}
}

adf.addProductNameandDetails = function(){
	if(adf.form.BorrowerDetails.ProductNameandDetails().length >= 5){

		swal("Warning", "Only 5 entries allowed for Product Name and Details", "warning");
	}else{
		adf.form.BorrowerDetails.ProductNameandDetails.push("");
	}

}

adf.removeProductNameandDetails = function(index){
	return function(){
	var realEsates = adf.form.BorrowerDetails.ProductNameandDetails().filter(function (d, i) {
			return i !== index
		})
		adf.form.BorrowerDetails.ProductNameandDetails(realEsates)
	}
}
adf.dataSource = ko.observableArray([
	{
		source : "",
		name :"",
		checkBy: "",
		ispositive: "",
		feedBack:"",
	}
])

adf.ispositive = ko.observableArray([
	{
		text : "Positive",
		value: "Positive"
	},
	{
		text : "Negatif",
		value: "Negatif"
	}
])

adf.index = ko.observable(0);
adf.loadIspositif = function(container, options){
	$('<input data-text-field="text" data-value-field="value" data-bind="value:' + options.field + '"/>')
		.appendTo(container)
		.kendoDropDownList({
			dataTextField: 'text',
			dataValueField: 'value',
			dataSource: [{'text': 'Positive', 'value': 'Positive'},{'text': 'Moderate', 'value': 'Moderate'},{'text': 'Negative', 'value': 'Negative'}],
			optionLabel: 'Select one',
		})
}

adf.loadSource = function(container, options){
	// console.log(options)
	$('<input data-bind="value:' + options.field + '"/>')
		.appendTo(container)
		.kendoDropDownList({
			dataSource: adf.optionSourceList(),
			optionLabel: 'Select one',
		})
}
adf.loadRefrenceGrid = function(){
	$("#refrence").html("");
	$("#refrence").kendoGrid({
		dataSource: ko.mapping.toJS(adf.form.BorrowerDetails.RefrenceCheck()),
		dataBound: function(){
			$("#refrence").find(".tooltipster").tooltipster({
                trigger: 'hover',
                theme: 'tooltipster-val',
                animation: 'grow',
                delay: 0,
            });
		},
		columns:[
			{	field:"Source",
				title: 'Source',
				editor: adf.loadSource,

			},
			{	field:"SourceName",
				title: 'Source Name',
				// template: function(d){
				// 	return '<input style="border: none; background-color: transparent;width: 90%; font-weight: normal; padding: 1px 4px;" class="align-left" />'
				// },

			},
			{	field:"CheckBy",
				title: 'Reference Check Taken By',
				// template: function(d){
				// 	return '<input style="border: none; background-color: transparent;width: 90%; font-weight: normal; padding: 1px 4px;" class="align-left" />'
				// },

			},
			{	field:"IsPositive",
				title: 'Positive / Negative',
				editor: adf.loadIspositif,

			},
			{	field:"FeedBack",
				title: 'Feedback',
				// template: function(d){
				// 	return '<input style="border: none; background-color: transparent;width: 90%; font-weight: normal; padding: 1px 4px;" class="align-left" />'
				// },

			},
			{
				title: '',
				template: function(d){
					if (adf.form.Freeze == true && adf.form.BorrowerDetails.Status() == 1) {
			          return '<button class="btn btn-flat btn-sm btn-danger noable" onclick="adf.removeRowReffrence(\''+d.uid+'\')" readonly><i class="fa fa-trash"></i></button>'
			        }else if(adf.form.Freeze != true  && adf.form.BorrowerDetails.Status() == 1){
			        	return '<button class="btn btn-flat btn-sm btn-danger noable" onclick="adf.removeRowReffrence(\''+d.uid+'\')" readonly><i class="fa fa-trash"></i></button>'
			        }else if(adf.form.Freeze == true  && adf.form.BorrowerDetails.Status() == 0){
			        	return '<button class="btn btn-flat btn-sm btn-danger noable" onclick="adf.removeRowReffrence(\''+d.uid+'\')" readonly><i class="fa fa-trash"></i></button>'
			        }else if(adf.form.Status() == 1  && adf.form.BorrowerDetails.Status() == 0){
			        	return '<button class="btn btn-flat btn-sm btn-danger noable" onclick="adf.removeRowReffrence(\''+d.uid+'\')" readonly><i class="fa fa-trash"></i></button>'
			        }else{
			        	return '<button class="btn btn-flat btn-sm btn-danger noable" onclick="adf.removeRowReffrence(\''+d.uid+'\')"><i class="fa fa-trash"></i></button>'
			        }



				},
				width: 50,

			}
		],
		editable: true,
		edit: function (e) {
	        var fieldName = e.container.find("input").attr("name");
	        if (adf.form.Freeze == true && adf.form.BorrowerDetails.Status() == 1) {
	            this.closeCell();
	        // }else if (adf.form.Status() == 2 && adf.form.BorrowerDetails.Status() == 0) {
	        //     this.closeCell();
	        }else if(adf.form.Freeze != true  && adf.form.BorrowerDetails.Status() == 1){
	        	this.closeCell();
	        }else if(adf.form.Freeze == true  && adf.form.BorrowerDetails.Status() == 0){
	        	this.closeCell();
	        }else if(adf.form.Status() == 1  && adf.form.BorrowerDetails.Status() == 0){
	        	this.closeCell();
	        }else if(adf.form.Status() == 0  && adf.form.Freeze() == true){
	        	this.closeCell();
	        }
		}

	})
}



adf.addRowReffrence = function(){
	// adf.index() = adf.index()+1;
	var grid = $('#refrence').data('kendoGrid');
	var allData = $('#refrence').data('kendoGrid').dataSource.data();
	// console.log(allData);
	var newRow = {
		Source : "",
		Name :"",
		CheckBy: "",
		IsPositive: "",
		FeedBack:"",
	}
	allData.push(newRow);
}

adf. removeRowReffrence = function(d){
	var index = $('.formula tr[data-uid="'+d+'"]').index();
	var allData = $('#refrence').data('kendoGrid').dataSource.data();
	// console.log(allData);
	allData.splice(index, 1);
}
adf.loadPdTooltipster = ko.observable("PD Done By : "+ adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+" PD Date : " + kendo.toString(new Date(adf.PdDate()),"dd-MMM-yyyy") +", PD Place : " + adf.form.AccountSetupDetails.PdInfo.PdPlace()+", Person Met : "+adf.form.AccountSetupDetails.PdInfo.PersonMet()+", PD Customer Margin(%)"+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% , PD Remarks: "+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+", PD Comments : "+ adf.form.AccountSetupDetails.PdInfo.PdComments()+" ," )
adf.CMISNULL = ko.observable(false);
adf.onclickDismissModal = function(){
	if((adf.form.AccountSetupDetails.PdInfo.CustomerMargin() == null || adf.form.AccountSetupDetails.PdInfo.CustomerMargin() == "") && parseFloat(adf.form.AccountSetupDetails.PdInfo.CustomerMargin()) != 0 ){
		adf.CMISNULL(true);
		adf.form.AccountSetupDetails.PdInfo.CustomerMargin("");
	}else{
		adf.CMISNULL(false);
	}

	if(adf.PdDate() == ""){
		try{
			$('#tipster').tooltipster('destroy')
		}catch(e){

		}
		
		$('#tipster').tooltipster({
			contentAsHTML: true,
	    	interactive: true,
	    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span></span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
		})
	}else{
		try{
			$('#tipster').tooltipster('destroy')
		}catch(e){
			
		}
		$('#tipster').tooltipster({
			contentAsHTML: true,
	    	interactive: true,
	    	content: $("<p class='info'>PD Done By : <span>"+adf.form.AccountSetupDetails.PdInfo.PdDoneBy()+"</span><br>PD Date : <span>"+kendo.toString(new Date(adf.PdDate()),"dd-MMM-yyyy")+"</span><br>PD Place : <span>"+adf.form.AccountSetupDetails.PdInfo.PdPlace()+"</span><br>Person Met : <span>"+adf.form.AccountSetupDetails.PdInfo.PersonMet()+"</span><br> PD Customer Margin: "+adf.form.AccountSetupDetails.PdInfo.CustomerMargin()+"% </span><br>PD Remarks: <span>"+adf.form.AccountSetupDetails.PdInfo.PdRemarks()+"</span><br> PD Comments : "+adf.form.AccountSetupDetails.PdInfo.PdComments()+"</span></p>")
		})
	}
}

adf.setAccountReset = function(){
	adf.form.AccountSetupDetails.BrHead(adf.Tempform.AccountSetupDetails.BrHead())
	adf.form.AccountSetupDetails.CreditAnalyst(adf.Tempform.AccountSetupDetails.CreditAnalyst())
	adf.form.AccountSetupDetails.Product(adf.Tempform.AccountSetupDetails.Product())
	adf.form.AccountSetupDetails.Scheme(adf.Tempform.AccountSetupDetails.Scheme())
	adf.form.AccountSetupDetails.LoginDate(adf.Tempform.AccountSetupDetails.LoginDate())
	adf.form.AccountSetupDetails.RmName(adf.Tempform.AccountSetupDetails.RmName())
	adf.form.AccountSetupDetails.LeadDistributor(adf.Tempform.AccountSetupDetails.LeadDistributor())
	adf.form.AccountSetupDetails.PdInfo.PdDoneBy(adf.Tempform.AccountSetupDetails.PdInfo.PdDoneBy())
	adf.form.AccountSetupDetails.PdInfo.PdPlace(adf.Tempform.AccountSetupDetails.PdInfo.PdPlace())
	adf.form.AccountSetupDetails.PdInfo.CustomerMargin(adf.Tempform.AccountSetupDetails.PdInfo.CustomerMargin())
	adf.form.AccountSetupDetails.PdInfo.PdRemarks(adf.Tempform.AccountSetupDetails.PdInfo.PdRemarks())
	adf.form.AccountSetupDetails.PdInfo.PdComments(adf.Tempform.AccountSetupDetails.PdInfo.PdComments())
	adf.form.AccountSetupDetails.PdInfo.PersonMet(adf.Tempform.AccountSetupDetails.PdInfo.PersonMet())
	var date = moment(adf.Tempform.AccountSetupDetails.PdInfo.PdDate()).format('DD-MMM-YYYY');
	adf.PdDate(date);

}

adf.setBorrowerReset = function(){
	// alert("lalalal")

	adf.form.BorrowerDetails.CustomerSegmentClasification(adf.Tempform.BorrowerDetails.CustomerSegmentClasification())
	adf.form.BorrowerDetails.DependenceOnSuppliers(adf.Tempform.BorrowerDetails.DependenceOnSuppliers())
	adf.form.BorrowerDetails.ExternalRating(adf.Tempform.BorrowerDetails.ExternalRating())
	adf.form.BorrowerDetails.Management(adf.Tempform.BorrowerDetails.Management())
	adf.form.BorrowerDetails.ExpansionPlans(adf.Tempform.BorrowerDetails.ExpansionPlans())
	adf.form.BorrowerDetails.SecondLineinBusiness(adf.Tempform.BorrowerDetails.SecondLineinBusiness())
	adf.form.BorrowerDetails.OrdersinHand(adf.Tempform.BorrowerDetails.OrdersinHand())
	adf.form.BorrowerDetails.ProjectsCompleted(adf.Tempform.BorrowerDetails.ProjectsCompleted())
	adf.form.BorrowerDetails.BusinessVintage(adf.Tempform.BorrowerDetails.BusinessVintage())
	adf.form.BorrowerDetails.BorrowerConstitution(adf.Tempform.BorrowerDetails.BorrowerConstitution())
	adf.form.BorrowerDetails.ProductNameandDetails(adf.Tempform.BorrowerDetails.ProductNameandDetails())
	adf.form.BorrowerDetails.DateBusinessStarted(adf.Tempform.BorrowerDetails.DateBusinessStarted())
	adf.form.BorrowerDetails.CommentsonFinancials(adf.Tempform.BorrowerDetails.CommentsonFinancials())
	adf.form.BorrowerDetails.MarketReference(adf.Tempform.BorrowerDetails.MarketReference());
	adf.form.BorrowerDetails.TopCustomerNames([]);
	adf.form.BorrowerDetails.ProductNameandDetails([]);
	$.each(adf.Tempform.BorrowerDetails.TopCustomerNames(), function(i, item){
		adf.form.BorrowerDetails.TopCustomerNames.push(item)
	})
	$.each(adf.Tempform.BorrowerDetails.ProductNameandDetails(), function(i, item){
		adf.form.BorrowerDetails.ProductNameandDetails.push(item)
	})
}

adf.setLoanReset = function(){
	adf.form.LoanDetails.ProposedLoanAmount(adf.Tempform.LoanDetails.ProposedLoanAmount());
	adf.form.LoanDetails.LimitTenor(adf.Tempform.LoanDetails.LimitTenor());
	adf.form.LoanDetails.LoanTenorDays(adf.Tempform.LoanDetails.LoanTenorDays());
	adf.form.LoanDetails.ProposedPFee(adf.Tempform.LoanDetails.ProposedPFee());
	adf.form.LoanDetails.RequestedLimitAmount(adf.Tempform.LoanDetails.RequestedLimitAmount());
	adf.form.LoanDetails.ProposedRateInterest(adf.Tempform.LoanDetails.ProposedRateInterest());
	adf.form.LoanDetails.IfExistingCustomer(adf.Tempform.LoanDetails.IfExistingCustomer());
	adf.form.LoanDetails.ExistingRoi(adf.Tempform.LoanDetails.ExistingRoi());
	adf.form.LoanDetails.FirstAgreementDate(adf.Tempform.LoanDetails.FirstAgreementDate());
	adf.form.LoanDetails.VintageWithX10(adf.Tempform.LoanDetails.VintageWithX10());
	adf.form.LoanDetails.IfYesEistingLimitAmount(adf.Tempform.LoanDetails.IfYesEistingLimitAmount());
	adf.form.LoanDetails.ExistingPf(adf.Tempform.LoanDetails.ExistingPf());
	adf.form.LoanDetails.RecenetAgreementDate(adf.Tempform.LoanDetails.RecenetAgreementDate());
	adf.form.LoanDetails.CommercialCibilReport(adf.Tempform.LoanDetails.CommercialCibilReport());
	adf.form.LoanDetails.InterestOutgo(adf.Tempform.LoanDetails.InterestOutgo());
	adf.form.LoanDetails.IfBackedByPO(adf.Tempform.LoanDetails.IfBackedByPO());
	adf.form.LoanDetails.POValueforBacktoBack(adf.Tempform.LoanDetails.POValueforBacktoBack());
	adf.form.LoanDetails.ExpectedPayment(adf.Tempform.LoanDetails.ExpectedPayment());
	adf.form.LoanDetails.TypeSecurity(adf.Tempform.LoanDetails.TypeSecurity());
	adf.form.LoanDetails.DetailsSecurity(adf.Tempform.LoanDetails.DetailsSecurity());
}

adf.setCustomerBusinessReset = function(){
	adf.form.CustomerBussinesMix.StockSellIn(adf.Tempform.CustomerBussinesMix.StockSellIn());
	adf.form.CustomerBussinesMix.B2BCorporateIn(adf.Tempform.CustomerBussinesMix.B2BCorporateIn());
	adf.form.CustomerBussinesMix.B2BGovtIn(adf.Tempform.CustomerBussinesMix.B2BGovtIn());
}

adf.setDistributorMixReset = function(){
	adf.form.DistributorMix.IrisComputersLimitedIn(adf.Tempform.DistributorMix.IrisComputersLimitedIn());
	adf.form.DistributorMix.RashiIn(adf.Tempform.DistributorMix.RashiIn());
	adf.form.DistributorMix.CompuageIn(adf.Tempform.DistributorMix.CompuageIn());
	adf.form.DistributorMix.SavexIn(adf.Tempform.DistributorMix.SavexIn());
	adf.form.DistributorMix.SupertronIn(adf.Tempform.DistributorMix.SupertronIn());
	adf.form.DistributorMix.AvnetIn(adf.Tempform.DistributorMix.AvnetIn());
}

adf.setPromoterReset = function(){
	adf.form.PromotorDetails([])

	$.each(adf.Tempform.PromotorDetails(), function(i, item){
		// alert(i)
		var each = ko.mapping.fromJS(toolkit.clone(adf.templatePromotorDetails))
		adf.form.PromotorDetails.push(each)
		// console.log(item.PromoterName())
		adf.form.PromotorDetails()[i].PromoterName(item.PromoterName());
		adf.form.PromotorDetails()[i].ExperienceInSameLineOfBusiness(item.ExperienceInSameLineOfBusiness());
		adf.form.PromotorDetails()[i].EducationalQualificationOfMainPromoter(item.EducationalQualificationOfMainPromoter());
		adf.form.PromotorDetails()[i].ResiOwnershipStatus(item.ResiOwnershipStatus());
		adf.form.PromotorDetails()[i].OfficeOwnershipStatus(item.OfficeOwnershipStatus());
		adf.form.PromotorDetails()[i].CibilScore(item.CibilScore());
		adf.form.PromotorDetails()[i].RealEstatePosition([]);
		for(var w = 0; w< item.RealEstatePosition().length; w++){
			adf.form.PromotorDetails()[i].RealEstatePosition.push({value: item.RealEstatePosition()[w].value()})
		}

		adf.sumRealEstate(adf.form.PromotorDetails()[i])

	});
}

adf.setPurchaseOrderBackingReset = function(){
	adf.form.PurchaseOrderBacking.IfBackedByPO(adf.Tempform.PurchaseOrderBacking.IfBackedByPO())
	adf.form.PurchaseOrderBacking.POValueforBacktoBack(adf.Tempform.PurchaseOrderBacking.POValueforBacktoBack())
	adf.form.PurchaseOrderBacking.ExpectedPayment(adf.Tempform.PurchaseOrderBacking.ExpectedPayment())
}

adf.setVendorReset = function(){
	adf.form.VendorDetails([]);
	var each = ko.mapping.fromJS(adf.templateVendorDetails)
	adf.form.VendorDetails.push(each)
	if( adf.Tempform.VendorDetails().length > 0){
		$.each(adf.Tempform.VendorDetails(), function(i, item){
			// alert(i)
			adf.form.VendorDetails()[i].AmountOfBusinessDone(item.AmountOfBusinessDone())
			adf.form.VendorDetails()[i].AverageDelayDays(item.AverageDelayDays())
			adf.form.VendorDetails()[i].AveragePaymentDays(item.AveragePaymentDays())
			adf.form.VendorDetails()[i].AvgTransactionWeightedPaymentDays(item.AvgTransactionWeightedPaymentDays())
			adf.form.VendorDetails()[i].AvgTransactionWeightedPaymentDelayDays(item.AvgTransactionWeightedPaymentDelayDays())
			adf.form.VendorDetails()[i].DaysStandardDeviation(item.DaysStandardDeviation())
			adf.form.VendorDetails()[i].DaysStandardDeviation(item.DaysStandardDeviation())
			adf.form.VendorDetails()[i].DelayDaysStandardDeviation(item.DelayDaysStandardDeviation())
			adf.form.VendorDetails()[i].DistributorName(item.DistributorName())
			adf.form.VendorDetails()[i].MaxDelayDays(item.MaxDelayDays())
			adf.form.VendorDetails()[i].MaxPaymentDays(item.MaxPaymentDays())
			adf.form.VendorDetails()[i].StandardDeviation(item.StandardDeviation())
		});
	}

}

adf.loadInterestOutGo = ko.computed(function(){
	return  adf.form.LoanDetails.InterestOutgo(ComputedGO());
})

function ComputedGO(){
	var val = kendo.toString(adf.form.LoanDetails.RequestedLimitAmount() * (adf.form.LoanDetails.ProposedRateInterest()/100) * adf.form.LoanDetails.LimitTenor()/12,"N2");
	adf.form.LoanDetails.InterestOutgo( parseFloat(val));
	return parseFloat(val);
}
adf.isExistingCustomer = ko.computed(function () {
	var value = adf.form.LoanDetails.IfExistingCustomer()
	if(typeof value === "undefined"){
		value = "";
	}else if (typeof value === 'string') {
		value = (value.toLowerCase() === 'true')
	}

	return value
}, adf.form.LoanDetails.IfExistingCustomer)

adf.loadIfBackedByPO = ko.computed(function(){
	var value = adf.form.LoanDetails.IfBackedByPO()
	if(typeof value === "undefined"){
		value = "";
	}else if (typeof value === 'string') {
		value = (value.toLowerCase() === 'true')
	}

	return value
}, adf.form.LoanDetails.IfBackedByPO)

adf.loanDetailEnable = function(){
	if(adf.form.LoanDetails.IfBackedByPO() == false){
		$("#BackToBack").data("kendoNumericTextBox").enable(false)
		$("#Expected").data("kendoNumericTextBox").enable(false)
	}

	if(adf.form.LoanDetails.IfExistingCustomer() == false){
		$("#IfYesEistingLimitAmount").data("kendoNumericTextBox").enable(false);
		$("#ExistingRoi").data("kendoNumericTextBox").enable(false);
		$("#ExistingPf").data("kendoNumericTextBox").enable(false);
		$("#FirstAgreementDate").data("kendoDatePicker").enable(false);
		$("#RecenetAgreementDate").data("kendoDatePicker").enable(false);
		$("#VintageWithX10").data("kendoNumericTextBox").enable(false);
		// $("#CommercialCibilReport").data("kendoDropDownList").enable(false);
	}

}

adf.form.LoanDetails.IfBackedByPO.subscribe(function(value){
	
})

adf.form.LoanDetails.CommercialCibilReport.subscribe(function(value){
	if(typeof value == ""){
		adf.form.LoanDetails.CommercialCibilReport(null)
	}
})

adf.form.LoanDetails.IfExistingCustomer.subscribe(function(value){
	if(typeof value == ""){
		adf.form.LoanDetails.IfExistingCustomer(null)
	}
})

adf.form.LoanDetails.TypeSecurity.subscribe(function(value){
	// alert(value);
	adf.dataDetailsSecurity([]);
	$.each(adf.DataTempSecurityDetails(), function(i, items){
		if(value == items.type){
			$.each(items.data, function(w, data){
				adf.dataDetailsSecurity.push(data);
			})
		}
	})

})

adf.valueAverageDelaysDays = ko.computed(function(){
	var value = 0
	$.each(adf.form.VendorDetails(), function(i, items){
		value = (value+items.AverageDelayDays())
	});

	return value/adf.form.VendorDetails().length
},adf.form.VendorDetails());

adf.valueMaxAverageDelaysDays = ko.computed(function(){
	adf.optionArrayDelayDays([]);
	value = 0
	$.each(adf.form.VendorDetails(), function(i, items){
		adf.optionArrayDelayDays.push(items.AverageDelayDays())
	});

	value = adf.optionArrayDelayDays()
	return Math.max.apply(Math, value)
},adf.form.VendorDetails())

function generatemc(){
	var mc = 0;
	_.each(adf.form.PromotorDetails(), function(v,i){
		if(mc == 0){
		  mc = v.CibilScore();
		} else if(v.CibilScore() < mc){
		  mc = v.CibilScore();
		}
	})
	mincibil(mc)
}

adf.loadAccountDetailMaster = function(){
	ajaxPost("/accountdetail/getmasteraccountdetail", {}, function (res) {
		var master = {}
		res.Data.forEach(function (each) {
			master[each.Field] = each.Items.map(function (d) { return d.name })
		})

		adf.optionLeadDistributors(_.sortBy(master.LeadDistributors));
		$.each(master.Scheme, function(i, items){
			adf.optionSchemeList.push(
				{text: items, value: items}
			)
		});
		adf.optionProducts(_.sortBy(master.Products));
		$.each(master.ExternalRatings, function(i, ex){
			adf.optionExternalRatings.push(
				{text: ex, value: ex}
			);
		});
		adf.optionManagements(master.Managements);
		adf.optionRatingMastersCustomerSegment(master.RatingMastersCustomerSegment);
		adf.optionBorrowerConstitutionList(master.BorrowerConstitutionList);
		adf.optionMarketReferences(master.MarketReferences);
		adf.optionSourceList(master.Source);
		adf.optionEducationalQualificationOfMainPromoters(master.EducationalQualificationOfMainPromoters);
		adf.optionResiOwnershipStatus(master.ResiOwnershipStatus);
		adf.optionOfficeOwnershipStatus(master.OfficeOwnershipStatus);
		adf.dataTypeSecurity(master.TypeSecurity)
	})
}

adf.addDistributorMix = function(){
	adf.form.DistributorMix.Data.push(
		{Label: ko.observable(""), Result : ko.observable(0)}
	);
}

adf.removeDistributorMix = function(index){
return function(){
	var distributor = adf.form.DistributorMix.Data().filter(function (d, i) {
			return i !== index
		})
		adf.form.DistributorMix.Data(distributor)
	}
}

adf.scroll = function(){
	var elementPosition = $('.btnFixed').offset();
	$(window).scroll(function(){
	    if($(window).scrollTop() > elementPosition.top){
	          $('.btnFixed').removeClass('static');
	          $('.btnFixed').addClass('fixed');
	    } else {
	        $('.btnFixed').removeClass('fixed');
	       	$('.btnFixed').addClass('static');
	    }    
	});
}

adf.isoAllDate = function(){
	var date1 = (new Date(adf.form.LoanDetails.FirstAgreementDate()).toISOString())
	adf.form.LoanDetails.FirstAgreementDate(date1);

	var date2 = (new Date(adf.form.LoanDetails.RecenetAgreementDate()).toISOString())
	adf.form.LoanDetails.RecenetAgreementDate(date2);

	var date3 = (new Date(adf.form.BorrowerDetails.DateBusinessStarted()).toISOString())
	adf.form.BorrowerDetails.DateBusinessStarted(date3);
	if(adf.PdDate() != ""){
		var date4 = (new Date(adf.PdDate()).toISOString());
		adf.form.AccountSetupDetails.PdInfo.PdDate(date4);
	}

	if(adf.form.AccountSetupDetails.LoginDate() == ""){
		var date4 = (new Date().toISOString());
		adf.form.AccountSetupDetails.LoginDate(date4)
	}
}

$(function () {
	adf.loadAccountDetailMaster()
	adf.scroll()
	adf.initEvents()
	adf.initData()
	adf.resetForm()
	$("#PDinfo").appendTo('body')
	// adf.loadsValidation()
	$('.collapsibleAcct').collapsible({
      accordion : true
    });

    $('#PD').tooltipster('destroy')
	$('#PD').tooltipster({
		contentAsHTML: true,
    	interactive: true,
    	content: $("<p class='info'>PD Done By : <span>&nbsp;</span><br>PD Date : <span>&nbsp;</span><br>PD Place : <span>&nbsp;</span><br>Person Met : <span>&nbsp;</span><br>PD Remarks: <span>&nbsp;</span></p>")
	})

	
})