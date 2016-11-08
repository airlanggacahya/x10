model.totalStandard = ko.observable(0);
model.totalCurrentBalance = ko.observable(0);
model.All = ko.observable('cibil');
model.costomerProfileku = ko.observable('');
//detail report summary
model.detailreportsummary = ko.observableArray([])
var cibil = {
	custid: ko.observable(""),
	custname: ko.observable(""),
	location: ko.observable(""),
	brmanager: ko.observable(""),
	brmanager: ko.observable(""),
	regionalmanager: ko.observable(""),
	creditanalist: ko.observable(""),

	// office
	compname: ko.observable(""),
	pan: ko.observable(""),
	address: ko.observable(""),
	duns: ko.observable(""),
	city: ko.observable(""),
	tlp: ko.observable(""),
	state: ko.observable(""),
	pin: ko.observable(""),
	country: ko.observable(""),
	fileopendate: ko.observable(""),

	// report summary
	creditgrantor: ko.observable(0),
	creditfacilities: ko.observable(0),
	closecreditfacilitis: ko.observable(0),
	creditguaranteothers: ko.observable(0),
	latestopendate: ko.observable("-"),
	firstopendate: ko.observable("-"),
	fileNamePdf : ko.observable(""),

	// Credit Facilities As Borrower

	standartaccountBor: ko.observable(""),
	balanceinstandartBor: ko.observable(""),
	otherthanstandartBor: ko.observable(""),
	balanceotherBor: ko.observable(""),
	lawsuitsBor: ko.observable(""),
	wifulBor: ko.observable(""),

	// Credit Facilities As Guarantor

	standartaccountGua: ko.observable(""),
	balanceinstandartGua: ko.observable(""),
	otherthanstandartGua: ko.observable(""),
	balanceotherGua: ko.observable(""),
	lawsuitsGua: ko.observable(""),
	wifulGua: ko.observable(""),

	// Credit Type Summary
	// creditborower: ko.observable(""),
	// credittype: ko.observable(""),
	// currency: ko.observable(""),
	// totalcurrent: ko.observable(""),

	CreditTypeSummary : ko.observableArray([]),

	// Asset Classification IN AMOUNT
	// standart: ko.observable(""),
	// substandart: ko.observable(""),
	// Doubtful: ko.observable(""),
	// loss: ko.observable(""),
	// spacialmention: ko.observable(""),

	assetClassificationAmount: ko.observableArray([]),

	// Enquiry Summary
	threemonth: ko.observable(0),
	sixmonth: ko.observable(0),
	ninemonth: ko.observable(0),
	twelvemonth: ko.observable(0),
	duaempatmonth: ko.observable(0),
	thanduaempatmonth: ko.observable(0),
	lessduaempatmonth: ko.observable(0),
	recent: ko.observable("-"),
	totalenquiries: ko.observable(0),

	// Individual / Consumer CIBIL
	consname: ko.observable(""),
	birth: ko.observable(""),
	gender: ko.observable(""),
	datereport: ko.observable(""),
	timereport: ko.observable(""),
	transunion: ko.observable(""),
	factors: ko.observable(""),
	pan: ko.observable(""),
	passport: ko.observable(""),
	tlptype: ko.observable(""),
	email: ko.observable(""),
	address: ko.observable(""),
	email: ko.observable(""),
	address: ko.observable(""),
	addressdatereport: ko.observable(""),
	addresscategory: ko.observable(""),
	totalnoaccount: ko.observable(""),
	nozeroaccount: ko.observable(""),
	highcredit: ko.observable(""),
	currentbalances: ko.observable(""),
	overdueamount: ko.observable(""),
	totaloverdue: ko.observable(""),
	tlpnumber: ko.observable(""),
	otherthanstandart: ko.observable(""),
	promotorConfirmText: ko.observable("Confirm Details"),

	reportDraft: ko.observable(),
	individuaCibil: ko.observableArray([]),

	// Date Opened
	daterecent: ko.observable(""),
	Oldestdate: ko.observable(""),
	textButtonDetail: ko.observable(" Confirm"),

	// filter customerList
	statusAccept: ko.observable(""),
	promotorParam: ko.observableArray([]),
	custnamelist: ko.observableArray([]),
	custtemplist: ko.observableArray([]),
	custdeallist: ko.observableArray([]),
	filtercustid: ko.observable(''),
	filtercustdeal: ko.observable(''),
	custprofiledetail: ko.observableArray([]),
	reportCibilList : ko.observableArray([]),
	dummyCompany :ko.observableArray([]),
	selectedCustomer:ko.observableArray([]),
	promotorsList: ko.observableArray([]),
	promotorsOnList: ko.observableArray([]),
	creditSummary:ko.observableArray([{credittype:"",currencycode:"",doubtful:"",loss:"", nocreditfacilitiesborrower:"",
	specialmention:"", standard:"", substandard:"", totalcurrentbalance:""}]),
	cibilShowDetail: ko.observable(false),
	cibilShowAllDetail: ko.observable(false),
	cibilShowAllDetail1: ko.observable(false),
	entry: ko.observable(false),
};

// cibil.panelMore = function(){
// 	console.log($(this))
// 	cibil.cibilShowAllDetail(true);
// 	for(var i=0; i < cibil.custtemplist().DetailOfPromoters.Biodata.length; i++){
// 		$("#panel"+i).click(function(){

// 		})
// 	}
// }

cibil.showAllDetail = function(){

	$("#promotors1").removeClass("active")
	$("#promotors2").removeClass("active")
	$("#companyCibil .collapsible-body").css("display", "block")
	$('html, body').animate({ scrollTop: $('#header-detail').offset().top }, 'slow');
	cibil.cibilShowAllDetail(false);
	cibil.cibilShowAllDetail1(false);
	// $.each(cibil.custtemplist().DetailOfPromoters.Biodata, function(index, itemData){
	// 	cibil.promotorsOnList(itemData)
	// })
	if(cibil.custtemplist().length != 0){
		// cibil.individuaCibil([])
		cibil.onChangeCustomer()
		cibil.showDetail()
		// for(var i=0; i < cibil.custtemplist().DetailOfPromoters.Biodata.length; i++){
		// 	cibil.showDetail()
		// 	var item = cibil.custtemplist().DetailOfPromoters.Biodata[i]
		// 	cibil.individuaCibil.push(
		// 		{
		// 			consname: item.Name,
		// 			birth: moment(new Date(item.DateOfBirth)).format('dd-MMM-yyyy'),
		// 			gender: item.Gender,
		// 			datereport: "",
		// 			timereport: "",
		// 			transunion: "",
		// 			factors: "",
		// 			pan: item.PAN,
		// 			passport: "",
		// 			tlptype: "",
		// 			email: item.Email,
		// 			address: item.Address,
		// 			addressdatereport: "",
		// 			addresscategory: "",
		// 			totalnoaccount: "",
		// 			nozeroaccount: "",
		// 			highcredit: "",
		// 			currentbalances: "",
		// 			totaloverdue: "",
		// 			tlpnumber: item.Phone,
		// 			otherthanstandart: "",
		// 			cibilscore: item.CIBILScore,

		// 		}
		// 	)


		// }
		// $.each(cibil.custtemplist().DetailOfPromoters.Biodata, function(i, items){
		// 	cibil.individuaCibil.push(items)
		// })
		cibil.cibilShowAllDetail1(true);
	}else{
		swal("Warning", "No Customer Selected", "warning");
	}

}

cibil.showDetail = function(){

	cibil.cibilShowDetail(false);
	cibil.cibilShowAllDetail(false);
	cibil.cibilShowAllDetail1(false);

	if(filter().CustomerSearchVal() != ""){
		//cibil.CreditTypeSummary([]);
		cibil.assetClassificationAmount([]);
		cibil.cibilShowDetail(true);
		for(var i=0; i < cibil.reportCibilList().length; i++){
			if(filter().CustomerSearchVal() == cibil.reportCibilList()[i].Profile.CustomerId){
				var data = cibil.reportCibilList()[i]
				//office
				cibil.compname(data.Profile.CompanyName);
				cibil.pan(data.Profile.Pan);
				cibil.address(data.Profile.Address);
				cibil.duns(data.Profile.DunsNumber);
				cibil.city(data.Profile.CityTown);
				cibil.tlp(data.Profile.Telephone);
				cibil.state(data.Profile.StateUnion);
				cibil.pin(data.Profile.PinCode);
				cibil.fileopendate((data.Profile.FileOpenDate).replace(/\s/g,''));
				cibil.country(data.Profile.Country);

				//report summary
				cibil.creditgrantor((parseInt(data.ReportSummary.Grantors)));
				cibil.creditfacilities(data.ReportSummary.Facilities);
				cibil.closecreditfacilitis(data.ReportSummary.CreditFacilities);
				cibil.creditguaranteothers(data.ReportSummary.FacilitiesGuaranteed);
				cibil.latestopendate((data.ReportSummary.LatestCreditFacilityOpenDate).replace(/\s/g,''));
				cibil.firstopendate((data.ReportSummary.FirstCreditFacilityOpenDate).replace(/\s/g,''));

				// Credit Facilities As Borrower
				// cibil.standartaccountBor(data.CreditFacilityBorrower.NoStandard);
				// cibil.balanceinstandartBor(data.CreditFacilityBorrower.CurrentBalanceStandard);
				// cibil.otherthanstandartBor(data.CreditFacilityBorrower.NoOtherThanStandard);
				// cibil.balanceotherBor(data.CreditFacilityBorrower.CurrentBalanceOtherThanStandard);
				// cibil.lawsuitsBor(data.CreditFacilityBorrower.NoLawSuits);
				// cibil.wifulBor(data.CreditFacilityBorrower.NoWilfulDefaults);

				// Credit Facilities As Guarantor
				// cibil.standartaccountGua(data.CreditFacilityGuarantor.NoStandard);
				// cibil.balanceinstandartGua(data.CreditFacilityGuarantor.CurrentBalanceOtherThanStandard);
				// cibil.otherthanstandartGua(data.CreditFacilityGuarantor.NoOtherThanStandard);
				// cibil.balanceotherGua(data.CreditFacilityGuarantor.CurrentBalanceOtherThanStandard);
				// cibil.lawsuitsGua(data.CreditFacilityGuarantor.NoLawSuits);
				// cibil.wifulBor(data.CreditFacilityGuarantor.NoWilfulDefaults);
				//cibil.wifulBor(data.CreditFacilityGuarantor.nowilfuldefaults);
				for(var i=0; i < data.CreditTypeSummary.length; i++){
					var item =  data.CreditTypeSummary;
					// cibil.CreditTypeSummary1.push(
					// 	{
					// 		creditborower: item[i].NoCreditFacilitiesBorrower,
					// 		credittype:  item[i].CreditType,
					// 		currency: item[i].CurrencyCode,
					// 		totalcurrent: item[i].TotalCurrentBalance

					// 	}
					// );

					//console.log(item[i].Standard)

					cibil.assetClassificationAmount.push(
						{
							standart: cibil.formatnum(item[i].Standard.split(",").join("")),
							substandart: item[i].Substandard,
							Doubtful: item[i].Doubtful,
							Loss: item[i].loss,
							spacialmention: item[i].SpecialMention,
						}
					);
				}

				cibil.threemonth(data.EnquirySummary.Enquiries3Month);
				cibil.sixmonth(data.EnquirySummary.Enquiries6Month);
				cibil.ninemonth(data.EnquirySummary.Enquiries9Month);
				cibil.twelvemonth(data.EnquirySummary.Enquiries12Month);
				cibil.duaempatmonth(data.EnquirySummary.Enquiries24Month);
				cibil.totalenquiries(data.EnquirySummary.TotalEnquiries);
				cibil.recent((data.EnquirySummary.MostRecentDate).replace(/\s/g,''));

			}
		}
		$('html, body').animate({ scrollTop: $('#header-detail').offset().top }, 'slow');
	}else{
		swal("Warning", "No Customer Selected", "warning");
	}

}

cibil.promotorsscore = ko.observableArray([]);

var setData = function(){
	cibil.entry(false);
		cibil.cibilShowDetail(false);
		cibil.cibilShowAllDetail(false);
		cibil.cibilShowAllDetail1(false);
		cibil.cibilShowAllDetail(false);

	var param = {CustomerId: filter().CustomerSearchVal()}
	param["DealNo"] = filter().DealNumberSearchVal()
   var url = "/datacapturing/getcustomerprofiledetailbycustid";
	cibil.statusAccept("");
	$("#title-cibil").html(($("#customer").getKendoDropDownList().text().split("-")[1].trim() + " - Report Summary").toLowerCase());
   ajaxPost(url, param, function(data) {
   	model.detailreportsummary([])

   	zzz = checkConfirmedOrNot(data[0].CustomerProfile.Status, 1, 2, data[0].CustomerProfile, null, "Customer Application");

   	if(data.success != false) {
   		// if (data[0].CustomerProfile != null){
   			cibil.filtercustid(data[0].CustomerProfile.Id)
	   		cibil.custtemplist(data[0].CustomerProfile);
   		// }
	   	cibil.reportCibilList(data[1].CibilReport);
	   	cibil.reportDraft(data[2].CibilDraft);
   		cibil.reportDraft(data[2].CibilDraft);
   		cibil.promotorsscore(data[3].Promotors);

	   	if (cibil.reportCibilList().length !== 0){
	   		model.costomerProfileku(cibil.reportCibilList()[0].Profile)
	   		model.detailreportsummary(cibil.reportCibilList()[0].DetailReportSummary)
	   	} else {
	   		model.costomerProfileku([]);
	   	}

	   	if(cibil.reportDraft.DetailReportSummary != null) {
	   		model.detailreportsummary(cibil.reportDraft.DetailReportSummary)
	   	}

	   	model.setDataEntry(cibil.reportDraft());

		  if (cibil.reportCibilList().length != 0){
		  	cibil.fileNamePdf(cibil.reportCibilList()[0].FileName);
		  }
	   	cibil.onChangeCustomer();
	   }
   })

   return false;
}

function refreshFilter(){
		setData();
}

cibil.onChangeCustomer = function(){
	cibil.cibilShowDetail(false);
	cibil.cibilShowAllDetail(false);
	//office
	cibil.individuaCibil([]);
	cibil.compname("");
	cibil.pan("");
	cibil.address("");
	cibil.duns("");
	cibil.city("");
	cibil.tlp("");
	cibil.state("");
	cibil.pin("");
	cibil.fileopendate("");
	cibil.country("");

	//report summary
	cibil.creditgrantor(0);
	cibil.creditfacilities("");
	cibil.closecreditfacilitis("");
	cibil.creditguaranteothers("");
	cibil.latestopendate("");
	cibil.firstopendate("");

	// Credit Facilities As Borrower
	cibil.standartaccountBor("");
	cibil.balanceinstandartBor("");
	cibil.otherthanstandartBor("");
	cibil.balanceotherBor("");
	cibil.lawsuitsBor("");
	cibil.wifulBor("");

	// Credit Facilities As Guarantor
	cibil.standartaccountGua("");
	cibil.balanceinstandartGua("");
	cibil.otherthanstandartGua("");
	cibil.balanceotherGua("");
	cibil.lawsuitsGua("");
	cibil.wifulBor("");
	var id = filter().CustomerSearchVal()


	cibil.threemonth(0)
	cibil.sixmonth(0)
	cibil.ninemonth(0)
	cibil.twelvemonth(0)
	cibil.duaempatmonth(0)
	// cibil.lessduaempatmonth(0].EnquirySummary.)
	cibil.recent("")
	cibil.totalenquiries(0)

	cibil.custdeallist([]);
	cibil.promotorsList([]);
	cibil.promotorsOnList([]);
	cibil.passportnum = ko.observable("");

	   	model.totalStandard(0);
		  	model.totalCurrentBalance(0);

		if(id == cibil.custtemplist().Id.split("|")[0]){

			$.each(cibil.custtemplist().DetailOfPromoters.Biodata, function(index, itemData){
				var text =""
				if(itemData.Director) {
					text += "Director"
				}

				if(itemData.Guarantor) {
					if(text != "") {
						text += " & Guarantor"
					} else {
						text += "Guarantor"
					}
				}
				if(itemData.Promotor) {
					if(text != "") {
						text += " & Promotor"
					} else {
						text += "Promotor"
					}
				}

				itemData.textButtonDetail = ko.observable(" Confirm")
				itemData.promotorText = text
				itemData.hasEnabledScoring = ko.observable(true)
				itemData.cibilscore = ko.observable(itemData.CIBILScore)
				var prom = _.find( cibil.promotorsscore(),function(x){ return x.IncomeTaxIdNumber.toLowerCase() == itemData.PAN.toLowerCase() } );

				if(itemData.cibilscore()==0 && prom!=undefined){
					itemData.cibilscore(prom.CibilScore);
					cibil.promotorParam.push({CustomerId: cibil.filtercustid(),DealNo:filter().DealNumberSearchVal() , Name: itemData.Name, FatherName: itemData.FatherName, Scors: ""+itemData.cibilscore()})
						savePromotors();
				}
				if (prom!=undefined){
					if (prom.EmailAddress.length > 0){
						if (prom.EmailAddress[0] == ""){
							//console.log("-----4445",prom.EmailAddress)
							var mail ="";
							$.each(prom.EmailAddress, function(d, email){
								if(email != ""){
									mail += email+"\n"
								}

							});
							itemData.Email =mail;
						}
					}
					// console.log(prom.ScoringFactor);
					itemData.Name = prom.ConsumerInfo.ConsumerName;
					itemData.Dob = moment(prom.ConsumerInfo.DateOfBirth).format("DD-MM-YYYY");//prom.ConsumerInfo.DateOfBirth;
					itemData.Phone = prom.Telephones[0].Number;
					itemData.Address = prom.AddressData[0].AddressPinCode;
					itemData.Score = itemData.cibilscore() <= 0 ? prom.CibilScore : itemData.cibilscore();
					itemData.Passport = prom.PassportNumber;
					itemData.Dates = moment(prom.DateOfReport).format("DD-MM-YYYY");
					itemData.Times = moment(prom.TimeOfReport).add(-7,'h').format("HH:mm:ss");
					itemData.AddDateReport = moment(prom.AddressData[0].DateReported).format("DD-MM-YYYY");
					itemData.Category = prom.AddressData[0].Category;
					itemData.TotalAcc = prom.TotalAccount;
					itemData.TotalOverdue = prom.TotalOverdues;
					itemData.TotalZeroBalanceAcc = prom.TotalZeroBalanceAcc;
					itemData.HighCreditSanctionAmount = cibil.formatnum(prom.HighCreditSanctionAmount)//prom.HighCreditSanctionAmount;
					itemData.CurrentBalance = prom.CurrentBalance;
					itemData.OverdueBalance = prom.OverdueBalance;
					itemData.TelephoneType = prom.Telephones[0].Type;
					itemData.Gender = prom.ConsumerInfo.Gender;
					itemData.Addresses = ko.observableArray([]);

					$.each(prom.AddressData, function(w, item){
						item.DateReportedText = moment(item.DateReported).format("DD-MM-YYYY");
						itemData.Addresses.push(item)
					});

					var str ="";
					$.each(prom.ScoringFactor, function(w, item){
						str +=w+1+". "+item+"\n"
					});
					itemData.ScoringFactor = str;

					var strTelephones ="";
					$.each(prom.Telephones, function(w, item){
						strTelephones +=w+1+". "+item.Type+ " - "+item.Number+"\n"
					});
					itemData.Telephone = strTelephones;

				}else{
					itemData.Mail = "";
					// itemData.Name = "";
					itemData.Dob = "";
					itemData.Phone = "";
					itemData.Address = "";
					itemData.Score = itemData.cibilscore();
					itemData.Passport = "";
					itemData.Dates = "";
					itemData.Times = "";
					itemData.AddDateReport = "";
					itemData.Category = "";
					itemData.TotalAcc = "";
					itemData.TotalOverdue = "";
					itemData.TotalZeroBalanceAcc = "";
					itemData.HighCreditSanctionAmount = "";
					itemData.CurrentBalance = "";
					itemData.OverdueBalance = "";
					itemData.TelephoneType = "";
					itemData.ScoringFactor = "";
					itemData.Gender = "";
					itemData.Telephone = "";
					itemData.Addresses = ko.observableArray([]);
				}

				itemData.changeEnabledScoring = function(i,e){
					cibil.promotorParam([])
					itemData.hasEnabledScoring(!itemData.hasEnabledScoring())
					if($(e.toElement).html() == " Confirm") {
						cibil.promotorParam.push({CustomerId: cibil.filtercustid(),DealNo:filter().DealNumberSearchVal() , Name: itemData.Name, FatherName: itemData.FatherName, Scors: ""+itemData.Score })
						savePromotors();
						$(e.toElement).removeClass('btn-confirm').addClass('btn-reenter').html(" Re Enter");
						$(e.toElement).closest(".col-md-12").prev().find("#custname").attr("disabled",true);
					} else if($(e.toElement).html() == " Re Enter") {
						$(e.toElement).removeClass('btn-reenter').addClass('btn-confirm').html(" Confirm");
						$(e.toElement).closest(".col-md-12").prev().find("#custname").attr("disabled",false);
					}
					cibil.confirmedStatusCompany();
				}

				itemData["CurrentBalanceText"] = cibil.formatnum(itemData.CurrentBalance)
				itemData["OverdueBalanceText"] = cibil.formatnum(itemData.OverdueBalance)
				//console.log(itemData)

				cibil.promotorsList.push(itemData)
				cibil.promotorsOnList.push(itemData);
				cibil.individuaCibil.push(itemData);

				$("#panel"+index).click(function(){
					// console.log(data);
					$("#promotors1").addClass("active")
					$("#promotors2").addClass("active")
					$(".collapsible-body").css("display", "block")
					cibil.cibilShowDetail(false);
					cibil.cibilShowAllDetail(false);
					cibil.cibilShowAllDetail1(false);
					cibil.promotorsOnList([]);
					cibil.promotorsOnList.push(itemData);
					cibil.cibilShowAllDetail(true);
					$('html, body').animate({ scrollTop: $('#promotors2').offset().top }, 'slow');
				})
			})

			//cibil.promotorsList(item.detailofpromoters.biodata)
		}

	cibil.selectedCustomer([]);
	cibil.CreditTypeSummary([]);
	cibil.confirmedStatus();

	if(cibil.reportCibilList().length > 1) {
		if(cibil.reportDraft().Status == 1 || cibil.reportDraft().Status == 2|| cibil.reportDraft().Status == 3|| cibil.reportDraft().Status == -3) {
			cibil.selectedCustomer.push(cibil.reportDraft());
			model.detailreportsummary(cibil.reportDraft().DetailReportSummary)

			if (cibil.reportDraft().Profile.CustomerId == id){
				// cibil.creditSummary.push(val.CreditTypeSummary);
				$.each(cibil.reportDraft().CreditTypeSummary, function(key2, val2){
					val2.Doubtful =  kendo.toString(parseInt(val2.Doubtful),"N0")
					val2.Loss =  kendo.toString(parseInt(val2.Loss),"N0")
					val2.Substandard =  kendo.toString(parseInt(val2.Substandard),"N0")
					val2.Standard =  kendo.toString(parseInt(val2.Standard),"N0")
					val2.SpecialMention =  kendo.toString(parseInt(val2.SpecialMention),"N0")
					val2.TotalCurrentBalance =  kendo.toString(parseInt(val2.TotalCurrentBalance),"N0")

					cibil.CreditTypeSummary.push(val2);
				});
			}
			addDataReport();
		}

	}  else if(cibil.reportCibilList().length != 0){
		cibil.selectedCustomer(cibil.reportCibilList());
		addDataReport();
		$.each(cibil.reportCibilList(), function(key, val){
			// console.log(val);
			if (val.Profile.CustomerId == id){
				// cibil.creditSummary.push(val.CreditTypeSummary);
				$.each(val.CreditTypeSummary, function(key2, val2){
					// console.log(val2);
					cibil.CreditTypeSummary.push(val2);
				})
			}
		});

	} else {
		model.detailreportsummary([])
		model.totalStandard(0);
	  	model.totalCurrentBalance(0);

		cibil.creditgrantor(0);
		cibil.creditfacilities(0);
		cibil.closecreditfacilitis(0);
		cibil.creditguaranteothers(0);
		cibil.latestopendate("");
		cibil.firstopendate("");

		// ============

		cibil.standartaccountBor(0)
		cibil.balanceinstandartBor(0)
		cibil.otherthanstandartBor(0)
		cibil.balanceotherBor(0)
		cibil.lawsuitsBor(0)
		cibil.wifulBor(0)

		cibil.standartaccountGua(0)
		cibil.balanceinstandartGua(0)
		cibil.otherthanstandartGua(0)
		cibil.balanceotherGua(0)
		cibil.lawsuitsGua(0)
		cibil.wifulGua(0)
		// ============


		cibil.threemonth(0)
		cibil.sixmonth(0)
		cibil.ninemonth(0)
		cibil.twelvemonth(0)
		cibil.duaempatmonth(0)
		// cibil.lessduaempatmonth(0].EnquirySummary.)
		cibil.recent("")
		cibil.totalenquiries(0)

			   	model.totalStandard(0);
		  	model.totalCurrentBalance(0);
	}

	function addDataReport() {
			setTimeout(function(){
				var totalSt = 0;
		   var totalCur = 0;

		   for (var i = 0; i<cibil.CreditTypeSummary().length; i++ ){
		   		totalSt = totalSt + parseInt(cibil.CreditTypeSummary()[i].Standard.split(",").join("")  );
		   		totalCur = totalCur + parseInt(cibil.CreditTypeSummary()[i].TotalCurrentBalance.split(",").join(""));
		   		cibil.CreditTypeSummary()[i].Standard =  kendo.toString(parseInt(cibil.CreditTypeSummary()[i].Standard.split(",").join("")),"n0");
		   }

		   	model.totalStandard(cibil.formatnum(totalSt));
		  	model.totalCurrentBalance(cibil.formatnum(totalCur));

			},3000);



			cibil.creditgrantor(kendo.toString(parseInt(cibil.selectedCustomer()[0].ReportSummary.Grantors),"n0"));
			cibil.creditfacilities(kendo.toString(parseInt(cibil.selectedCustomer()[0].ReportSummary.Facilities),"n0"));
		   cibil.closecreditfacilitis(kendo.toString(parseInt(cibil.selectedCustomer()[0].ReportSummary.CreditFacilities),"n0"));
		   cibil.creditguaranteothers(kendo.toString(parseInt(cibil.selectedCustomer()[0].ReportSummary.FacilitiesGuaranteed),"n0"));

		   var last = cibil.selectedCustomer()[0].ReportSummary.LatestCreditFacilityOpenDate.split(" ").join("")
		   	last = moment(last).format("DD-MMM-YYYY");
		   	cibil.latestopendate(last);


		   	var first = cibil.selectedCustomer()[0].ReportSummary.FirstCreditFacilityOpenDate.split(" ").join("")
  			first =  moment(first).format("DD-MMM-YYYY");
  			cibil.firstopendate(first);


		   // ============

		   // cibil.standartaccountBor(kendo.toString(parseInt(cibil.selectedCustomer()[0].CreditFacilityBorrower.NoStandard),"n0"));
		   // cibil.balanceinstandartBor(cibil.selectedCustomer()[0].CreditFacilityBorrower.CurrentBalanceStandard);
		   // cibil.otherthanstandartBor(cibil.selectedCustomer()[0].CreditFacilityBorrower.NoOtherThanStandard);
		   // cibil.balanceotherBor(cibil.selectedCustomer()[0].CreditFacilityBorrower.CurrentBalanceOtherThanStandard);
		   // cibil.lawsuitsBor(kendo.toString(parseInt(cibil.selectedCustomer()[0].CreditFacilityBorrower.NoLawSuits),"n0"));
		   // cibil.wifulBor(kendo.toString(parseInt(cibil.selectedCustomer()[0].CreditFacilityBorrower.NoWilfulDefaults),"n0"));

		   // cibil.standartaccountGua(kendo.toString(parseInt(cibil.selectedCustomer()[0].CreditFacilityGuarantor.NoStandard),"n0"));
		   // cibil.balanceinstandartGua(kendo.toString(parseInt(cibil.selectedCustomer()[0].CreditFacilityGuarantor.CurrentBalanceStandard),"n0"));
		   // cibil.otherthanstandartGua(kendo.toString(parseInt(cibil.selectedCustomer()[0].CreditFacilityGuarantor.CurrentBalanceOtherThanStandard),"n0"));
		   // cibil.balanceotherGua(kendo.toString(parseInt(cibil.selectedCustomer()[0].CreditFacilityGuarantor.CurrentBalanceStandard),"n0"));
		   // cibil.lawsuitsGua(kendo.toString(parseInt(cibil.selectedCustomer()[0].CreditFacilityGuarantor.NoLawSuits),"n0"));
		   // cibil.wifulGua(kendo.toString(parseInt(cibil.selectedCustomer()[0].CreditFacilityGuarantor.NoWilfulDefaults),"n0"));
		   // ============

		   cibil.threemonth(kendo.toString(parseInt(cibil.selectedCustomer()[0].EnquirySummary.Enquiries3Month),"n0"));
		   cibil.sixmonth(kendo.toString(parseInt(cibil.selectedCustomer()[0].EnquirySummary.Enquiries6Month  ),"n0"));
		   cibil.ninemonth(kendo.toString(parseInt(cibil.selectedCustomer()[0].EnquirySummary.Enquiries9Month),"n0"));
		   cibil.twelvemonth(kendo.toString(parseInt(cibil.selectedCustomer()[0].EnquirySummary.Enquiries12Month),"n0"));
		   cibil.duaempatmonth(kendo.toString(parseInt(cibil.selectedCustomer()[0].EnquirySummary.Enquiries24Month),"n0"));
		   cibil.thanduaempatmonth(kendo.toString(parseInt(cibil.selectedCustomer()[0].EnquirySummary.EnquiriesThan24Month),"n0"));
		   // cibil.lessduaempatmonth(cibil.selectedCustomer()[0].EnquirySummary.)
		   	var recent = cibil.selectedCustomer()[0].EnquirySummary.MostRecentDate.split(" ").join("")
  			recent =  moment(recent).format("DD-MMM-YYYY");
		   cibil.recent(recent)

		   cibil.totalenquiries(kendo.toString(parseInt(cibil.selectedCustomer()[0].EnquirySummary.TotalEnquiries),"n0"));
	}
	if(cibil.reportCibilList().length == 0) {
		// swal({
		// 	title: "Warning",
		// 	text: "Data Report Not Found",
		// 	type: "warning",
		// 	showCloseButton: true,
		// })
	}

	if (cibil.reportCibilList().length > 1){
		if(cibil.reportDraft().Status == 0) {
			swal({
				title: "Multiple reports available",
				text: "",
				type: 'warning',
				showCancelButton: true,
				customClass: 'swal-custom',
				// confirmButtonColor: '#3085d6',
				// cancelButtonColor: '#d33',
				showCloseButton: true,
				confirmButtonText: "Enter data",
				cancelButtonText: "View reports",
				confirmButtonClass: 'btn btn-primary',
				cancelButtonClass: 'btn btn-success',
				buttonsStyling: false
			}).then(function() {
				$(".swal-custom").prev().attr("style","");
				cibil.entry(true);
				cibil.openreports();
			}, function(dismiss) {
				if (dismiss === 'cancel') {
					cibil.openreports();
				}
				$(".swal-custom").prev().attr("style","");
			})
		}

		$(".swal-custom").prev().css("opacity","1").css("display","block").css("width",$("#cibilgrid-container").width()+10).css("height",$("#cibilgrid-container").height()+10).css("left","22px").css("top", screen.height *((105-$("#cibilgrid-container").parent().position().top)/100) +"px");
		// $(".swal-custom").css("left", "35%").css("top", "32%")
		$(".swal-custom h2").css("font-size","22px")

		$(window).scroll(function() {
			$('.swal-custom').prev().css('position', 'absolute');
		});
		$(".swal2-close").bind("click",function(){
				$(".swal-custom").prev().attr("style","");
		});
	}

	try{
		cibil.SetLabel(cibil.reportCibilList()[0].AllConfirmTime);
		cibil.SetLabel(cibil.reportCibilList()[0].AcceptRejectTime);
	}catch(e){
		console.log(e)
	}
	return false
}

cibil.entry.subscribe(function(val){
		if(val && model.dataEntryCibilReport().CreditTypeSummary().length ==0 ){
		model.addCreditTypeSummary();
	}
});

var savePromotors = function() {
 	if(cibil.promotorParam().length > 0) {
 		param = cibil.promotorParam()
 	}

 	ajaxPost("/datacapturing/updatepromotor", param, function (res){
   var data = res;
    	return false
   });

	return false
}

var changePromotorsStatus = function() {
	cibil.promotorParam([]);
	if(cibil.promotorsList().length > 0) {
		var elms = $("[title='confirm detail']");

		_.each(elms,function(e,i){
			if($(e).html().indexOf("Confirm") > -1)
			$(e).simulateClick("click");
		})

		// if(cibil.textButtonDetail() == " Confirm") {
		// 	cibil.textButtonDetail(" Enter Data")
		// 	$.each(cibil.promotorsList(), function(key, val){
		// 		val.textButtonDetail(" Enter Data")
		// 		cibil.promotorsList()[key].hasEnabledScoring(true)
		// 	})
		// } else if(cibil.textButtonDetail() == " Enter Data") {
		// 	$.each(cibil.promotorsList(), function(key, val){
		// 		cibil.promotorParam.push({CustomerId: cibil.filtercustid(), Name: val.Name, FatherName: val.FatherName, Scors: val.cibilscore()})
		// 		cibil.promotorsList()[key].hasEnabledScoring(false)
		// 	})
		// 	savePromotors()
		// 	cibil.textButtonDetail(" Re Enter")
		// 	$.each(cibil.promotorsList(), function(key, val){
		// 		val.textButtonDetail(" Re Enter")
		// 	})
		// } else if(cibil.textButtonDetail() == " Re Enter") {
		// 	cibil.textButtonDetail(" Enter Data")
		// 	$.each(cibil.promotorsList(), function(key, val){
		// 		cibil.promotorsList()[key].hasEnabledScoring(true)
		// 		val.textButtonDetail(" Enter Data")
		// 	})
		// }
	}
}

cibil.reportList = function(){
	var param = {}
	ajaxPost("/datacapturing/getcibilreport", param, function (res){
    	var data = res;
    	cibil.reportCibilList(data);
			$.each(data, function(key, val){
				cibil.dummyCompany.push(val.Profile);
			});
    });
}

cibil.filtercustdeal.subscribe(function(value){
	// console.log(value);
	var text = $("#filtercustdeal").data("kendoDropDownList");
	var param = {CustomerId: value, Dealno: text.text()};
	ajaxPost("/datacapturing/getcustomerprofiledetail", param, function (res){
    	var data = res[0];
    	// console.log(data);
    	cibil.custprofiledetail(data);
    	// cibil.custid(data.customer_id);
    });
})



cibil.genderlist = ko.observableArray([
	{text: "Male", value: "M"},
	{text: "Female", value: "F"},
])

cibil.urls = ko.observableArray([]);

cibil.preopenreports = function(){
	cibil.urls([])
	for(var i=0; i < cibil.reportCibilList().length; i++){
		if(filter().CustomerSearchVal() == cibil.reportCibilList()[i].Profile.CustomerId){
			var data = cibil.reportCibilList()[i]
			cibil.urls.push("/static/pdf/"+data.FileName);
		}
	}
	if(cibil.reportDraft().length != 0 && cibil.reportDraft().FileName != "") {
		cibil.urls.push("/static/pdf/"+cibil.reportDraft().FileName);
	}
	if(cibil.urls().length==0) return;
	var evalstring = "function myFunction() {"
	for(var i=0; i < cibil.urls().length; i++){
		evalstring+="setTimeout(function(){ window.open('"+cibil.urls()[i]+"');},1500);"
	}
	evalstring+="};myFunction();"
	eval(evalstring);
}

cibil.acceptcibil = function(){
	// swal("Success","Data accepted","success");
	swal('Success','Data accepted','success')

}

cibil.rejectcibil = function(){
	// swal("Success","Data rejected","success");
	swal('Success','Data rejected','success')
}

cibil.openreports = function(){
	cibil.preopenreports();

}

$(document).ready(function(){
	$('.collapsiblecibil').collapsible({
      accordion : true
    });
    //cibil.reportList();

 //  $(".calculateMonth").change( function(){
 //  	model.dataEntryCibilReport().EnquirySummary().TotalEnquiries(parseInt(model.dataEntryCibilReport().EnquirySummary().Enquiries3Month) + parseInt(model.dataEntryCibilReport().EnquirySummary().Enquiries6Month) + parseInt(model.dataEntryCibilReport().EnquirySummary().Enquiries9Month) + parseInt(model.dataEntryCibilReport().EnquirySummary().Enquiries12Month) + parseInt(model.dataEntryCibilReport().EnquirySummary().Enquiries24Month));
	// });

  // $(".btn-confirmasi").addClass("disabled");
  $(".btn-confirmasi").attr("disabled",true);

});

function backToMain(){
	cibil.entry(false);
}

cibil.confirmCompany = function(){
	if(cibil.reportCibilList().length>1 && model.dataEntryCibilReport().Status ==0 || cibil.CreditTypeSummary().length == 0){
		// swal("Error","Data is not complete !","error");
		swal('Error','Data is not complete','error');
		return;
	}

	 var url = "/datacapturing/confirmreportcibil";
	 var param = {};
          param.status = 2;
          param.customerid = filter().CustomerSearchVal();
          param.dealno = filter().DealNumberSearchVal();
          ajaxPost(url, param, function(data) {
            if (data) {
            	model.dataEntryCibilReport().Status = 2;
            	if(cibil.reportCibilList().length>0 ){
					statusconf = cibil.reportCibilList()[0].Status = 2;
				}
              swal("Data Confirmed", "", "success");
    			cibil.confirmedStatusCompany();
            }
          }, undefined);
}

cibil.confirmAll = function(){
	var prom = $("[name='custname']");
	var promotorvalid = true;
	_.each(prom,function(e,i){
		if($(e).val() == 0){
			promotorvalid = false;
		}
	});
	if(!promotorvalid){
		swal("Warning","Please entry promotors/directors/guarantors score","warning")
		return;
	}

	cibil.SetConfirmAll();
	changePromotorsStatus();
	cibil.confirmCompany();
	cibil.confirmedStatus();
}

cibil.confirmedStatus = function(){

	var statusconf = 0;
	if(cibil.reportCibilList().length>0 ){
		statusconf = cibil.reportCibilList()[0].Status;
	}

  	$(".btn-confirmasi").attr("disabled",true);
  	$("#btnconfirmall").attr("disabled",false);
	$("#btnconfirm").attr("disabled",false);
	cibil.textButtonDetail(" Confirm");
	$("#btnconfirmall").html("Confirm All");
	$("[name='custname']").attr("disabled", false)
	$(".btn-confirmasi:eq(0)").html("Accept");
	$(".btn-confirmasi:eq(1)").html("Reject");
	$("[title='confirm detail']").attr("disabled",false);

	var prom = $("[name='custname']");
	var promotorvalid = true;
	_.each(prom,function(e,i){
		if($(e).val() == 0){
			promotorvalid = false;
		}else{
			$(e).attr("disabled", true)
			$("[title='confirm detail']:eq("+i+")").addClass('btn-reenter').html(" Re Enter");
		}
	});

	// if(promotorvalid){
	// 	$("[name='custname']").attr("disabled", true)
	// 	$("[title='confirm detail']").html(" Re Enter");
	// }

	if(statusconf==2){
  		$(".btn-confirmasi").attr("disabled",false);
	}

	if(statusconf >= 2 || statusconf == -3){
		$("#btnconfirm").attr("disabled",true);
		cibil.textButtonDetail(" Company CIBIL Confirmed");
	}

	if(promotorvalid && (statusconf >= 2 || statusconf == -3)){
		// $("#btnconfirmall").html("All Confirmed");
		// $("#btnconfirmall").attr("disabled",true);
	}

	setTimeout(function(){
		if(cibil.statusAccept().indexOf("confirmed") > -1 ){
			$("#btnconfirmall").html("All CIBILs Confirmed");
			$("#btnconfirmall").attr("disabled",true);
		}
	},500);


	if(statusconf == 3 || statusconf == -3){
		$("[title='confirm detail']").attr("disabled",true);
		$("#btnconfirmall").html("All CIBILs Confirmed");
		$("#btnconfirmall").attr("disabled",true);

		if(statusconf==3){
              $(".btn-confirmasi:eq(0)").html("Accepted");
              $(".btn-confirmasi:eq(0)").attr("disabled", true)
              $(".btn-confirmasi:eq(1)").attr("disabled", false)
          } 	else{
          		$(".btn-confirmasi:eq(0)").attr("disabled", false)
              $(".btn-confirmasi:eq(1)").attr("disabled", true)
              $(".btn-confirmasi:eq(1)").html("Rejected");
          }
	}
}

cibil.confirmedStatusCompany = function(){
	var statusconf = 0;
	$(".btn-confirmasi").attr("disabled",true);
	$("#btnconfirm").attr("disabled",false);
	cibil.textButtonDetail(" Confirm");
	$("#btnconfirmall").attr("disabled",false);
	$("#btnconfirmall").html("Confirm All");


	if(cibil.reportCibilList().length>0 ){
		statusconf = cibil.reportCibilList()[0].Status;

	}

	var prom = $("[name='custname']");
	var promotorvalid = true;
	_.each(prom,function(e,i){
		if($(e).val() == 0){
			promotorvalid = false;
		}
	});

	var promBtn = $("[name='btn-guarantor']");
	var promotorBtnValid = true;
	_.each(promBtn,function(e,i){
		if($(e).text() == " Confirm"){
			promotorBtnValid = false;
		}
	});

	if(statusconf == 2) {
		$("#btnconfirm").attr("disabled",true);
		cibil.textButtonDetail(" Company CIBIL Confirmed");
	}

	if(promotorvalid && promotorBtnValid) {
		$(".btn-confirmasi").attr("disabled",false);
		// $("#btnconfirmall").attr("disabled",true);
		// $("#btnconfirmall").html("All Confirmed");
	}
}

cibil.AccpetOrReject = function(status){
 var url = "/datacapturing/acceptrejectreportcibil";
	 var param = {};
          param.status = status;
          param.customerid = filter().CustomerSearchVal();
          param.dealno = filter().DealNumberSearchVal();
          ajaxPost(url, param, function(data) {
            if (data.length > 0) {
            model.dataEntryCibilReport().Status = status;
        	if(cibil.reportCibilList().length>0 ){
				cibil.reportCibilList()[0].Status = status;
			}
			cibil.SetLabel(data[0].AcceptRejectTime);

			if(status==3) {
              swal("Data Accepted", "", "success");
			}
          	else {
              swal("Data Rejected", "", "success");
          	}
          	cibil.confirmedStatus();
            }
    }, undefined);
}

cibil.SetConfirmAll = function(){
 var url = "/datacapturing/setconfirmall";
	 var param = {};
          // param.status = status;
          param.customerid = filter().CustomerSearchVal();
          param.dealno = filter().DealNumberSearchVal();
          ajaxPost(url, param, function(data) {
            if (data.length>0) {
            	cibil.reportCibilList()[0].Status = 2;
				cibil.SetLabel(data[0].AllConfirmTime);
            }
    }, undefined);
}

cibil.SetLabel = function(label){
	var statusconf = 0;
	if(cibil.reportCibilList().length>0 ){
		statusconf = cibil.reportCibilList()[0].Status;
	}

	if(statusconf==3) {
		cibil.statusAccept("Data accepted on " + moment(label).format("DD-MM-YYYY HH:mm A"));
	}
    else if(statusconf == -3){
        cibil.statusAccept("Data Rejected on " + moment(label).format("DD-MM-YYYY HH:mm A"));
    }else if(statusconf == 2){
    	if(parseInt(moment(label).format("YYYY"))>1){
			cibil.statusAccept("Data confirmed on " + moment(label).format("DD-MM-YYYY HH:mm A"));
		}
    }else{
		cibil.statusAccept("");
    }
}



cibil.formatnum =  function(number, decimalPlace) {
   decimalPlace = (typeof decimalPlace === "undefined" ? 0 : decimalPlace);

   var suffix = ((String(number).indexOf(".") > -1) ? String(number).split(".")[1].substring(0, decimalPlace) : "");
   var prefix = ((String(number).indexOf(".") > -1) ? String(number).split(".")[0] : String(number)).split("").reverse().join("");

   var result = "";
  	for (var i = 0; i < prefix.length; i++) {
      result += prefix[i];
      if (i == 2)
          result += ",";
      else if (i > 2 && ((i - 2) % 2 == 0))
          result += ",";
  	}

  	result = result.split("").reverse().join("")

  	if (suffix.length > 0) if (parseInt(suffix, 10) != 0) result = result + "." + suffix;
  	result = result.replace(/- /g, "-");

  	if(String(number).length % 2 != 0) {
  		var res = result.split('')
  		var remove = res.splice(0,1,'')
  		result = res.join('')
  	}

  	result = result.replace(/\s+/g, '')

  	return result;
}


