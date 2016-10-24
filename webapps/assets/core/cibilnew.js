var cibil = {}; var r = cibil;

r.statusAccept = ko.observable("")
r.customerName = ko.observable("")
r.titleCibil = ko.observable("")
r.filtercustid = ko.observable("")
r.customerProfile = ko.observable("")
r.totalStandard = ko.observable("")
r.totalCurrentBalance = ko.observable("")
r.creditgrantor = ko.observable("")
r.creditfacilities = ko.observable("")
r.closecreditfacilitis = ko.observable("")
r.creditguaranteothers = ko.observable("")
r.latestopendate = ko.observable("")
r.firstopendate = ko.observable("")
r.threemonth = ko.observable(0)
r.sixmonth = ko.observable(0)
r.ninemonth = ko.observable(0)
r.twelvemonth = ko.observable(0)
r.duaempatmonth = ko.observable(0)
r.thanduaempatmonth = ko.observable(0)
r.recent = ko.observable("")
r.totalenquiries = ko.observable(0)
r.minScore = ko.observable(0)

r.reportCibilList = ko.observableArray([])
r.reportDraft = ko.observableArray([])
r.promotorsscore = ko.observableArray([])
r.promotorsList = ko.observableArray([])
r.promotorParam = ko.observableArray([])
r.CreditTypeSummary = ko.observableArray([])
r.detailreportsummary = ko.observableArray([])
r.assetClassificationAmount = ko.observableArray([])
r.promotorsOnList = ko.observableArray([])
r.urls = ko.observableArray([])
r.ratingList = ko.observableArray(["Positive", "Negative", "Referred"])
r.rating = ko.observable("")
r.rating.subscribe(function(val) {
  var param = {CustomerId: filter().CustomerSearchVal()}
  param["DealNo"] = filter().DealNumberSearchVal()
  param["Rating"] = val
  var url = "/datacapturing/updaterating"

  ajaxPost(url, param, function(data) {

  })
})

//cibil details
r.CibilDetails = {
    Office : {
      compname : ko.observable(""),
      pan : ko.observable(""),
      address : ko.observable(""),
      duns : ko.observable(""),
      city : ko.observable(""),
      tlp : ko.observable(""),
      state : ko.observable(""),
      pin : ko.observable(""),
      fileopendate : ko.observable(""),
      country : ko.observable("")
    },
    ReportSummary : {
      creditgrantor : ko.observable(""),
      creditfacilities : ko.observable(""),
      closecreditfacilitis : ko.observable(""),
      creditguaranteothers : ko.observable(""),
      latestopendate : ko.observable(""),
      firstopendate : ko.observable("")
    }
}

r.dataEntryCibilReport = ko.observable({
    Id:'',
    Profile : ko.observable({
      CompanyName: ko.observable(''),
      CustomerId: ko.observable(''),
      DealNo: ko.observable(''),
      DunsNumber: ko.observable(''),
      Pan: ko.observable(''),
      Address: ko.observable(''),
      CityTown: ko.observable(''),
      Telephone: ko.observable(''),
      StateUnion: ko.observable(''),
      PinCode: ko.observable(''),
      Country: ko.observable(''),
      FileOpenDate: ko.observable(''),
    }),

    ReportSummary: ko.observable({
      Grantors: ko.observable(''),
      Facilities: ko.observable(''),
      CreditFacilities: ko.observable(''),
      FacilitiesGuaranteed: ko.observable(''),
      LatestCreditFacilityOpenDate: ko.observable(''),
      FirstCreditFacilityOpenDate: ko.observable('')
    }),

    CreditFacilityBorrower: ko.observable({
      NoStandard:ko.observable(''),
      CurrentBalanceStandard:ko.observable(''),
      NoOtherThanStandard:ko.observable(''),
      CurrentBalanceOtherThanStandard:ko.observable(''),
      NoLawSuits:ko.observable(''),
      NoWilfulDefaults:ko.observable('')
    }),

    CreditFacilityGuarantor: ko.observable({
      NoStandard:ko.observable(''),
      CurrentBalanceStandard:ko.observable(''),
      NoOtherThanStandard:ko.observable(''),
      CurrentBalanceOtherThanStandard:ko.observable(''),
      NoLawSuits:ko.observable(''),
      NoWilfulDefaults:ko.observable('')
    }),

    DetailReportSummary: ko.observableArray([]),
    CreditTypeSummary: ko.observableArray([]),

    EnquirySummary : ko.observable({
      Enquiries3Month: ko.observable(0),
      Enquiries6Month: ko.observable(0),
      Enquiries9Month: ko.observable(0),
      Enquiries12Month: ko.observable(0),
      Enquiries24Month: ko.observable(0),
      EnquiriesThan24Month: ko.observable(0),
      TotalEnquiries: ko.observable(''),
      MostRecentDate: ko.observable('')
    }),

    Status: 0
});

r.getData = function() {

  var param = {CustomerId: filter().CustomerSearchVal()}
  param["DealNo"] = filter().DealNumberSearchVal()
  var url = "/datacapturing/getcustomerprofiledetailbycustid"
  r.statusAccept("")

  r.customerName(filter().CustomerSearchText())
  var Name = r.customerName().split("-").splice(1);

  r.titleCibil(toTitleCase(Name.join(" ") +" - Company Summary"));

  ajaxPost(url, param, function(data) {
    checkConfirmedOrNot(data[0].CustomerProfile.Status, 1, 2, data[0].CustomerProfile, null, "Customer Application");
    if(data.success != false) {

      r.filtercustid(data[0].CustomerProfile.Id)
      r.customerProfile(data[0].CustomerProfile);

      r.reportCibilList(data[1].CibilReport);

      r.reportDraft(data[2].CibilDraft);
      r.promotorsscore(data[3].Promotors);

      r.setData();
      r.setDataEntry(r.reportDraft());
    }
  })
}

r.setData = function() {
  r.promotorsList([])
  r.promotorsOnList([])
  r.CreditTypeSummary([])
  r.detailreportsummary([])
  r.assetClassificationAmount([])

  r.totalStandard("")
  r.totalCurrentBalance("")
  r.creditgrantor("")
  r.creditfacilities("")
  r.closecreditfacilitis("")
  r.creditguaranteothers("")
  r.latestopendate("")
  r.firstopendate("")
  r.threemonth(0)
  r.sixmonth(0)
  r.ninemonth(0)
  r.twelvemonth(0)
  r.duaempatmonth(0)
  r.thanduaempatmonth(0)
  r.recent("")
  r.totalenquiries(0)
  r.minScore(0)

  $(".confirmdate").text("")
  checkConfirmPromotors(r.customerProfile(), r.promotorsscore())

  $.each(r.customerProfile().DetailOfPromoters.Biodata, function(index, itemData){
    //define model
    //
    r.promotorParam([])

    var promotorsStatusString =""
    if(itemData.Director) {
      promotorsStatusString += "Director"
    }

    if(itemData.Guarantor) {
      if(promotorsStatusString != "") {
        promotorsStatusString += " & Guarantor"
      } else {
        promotorsStatusString += "Guarantor"
      }
    }
    if(itemData.Promotor) {
      if(promotorsStatusString != "") {
        promotorsStatusString += " & Promotor"
      } else {
        promotorsStatusString += "Promotor"
      }
    }

    itemData.promotorText = promotorsStatusString
    itemData.cibilscore = ko.observable(itemData.CIBILScore)

    var prom = _.find(r.promotorsscore(),function(x){ return x.IncomeTaxIdNumber.toLowerCase() == itemData.PAN.toLowerCase() } );

    if(itemData.cibilscore()==0 && prom!=undefined){
      itemData.cibilscore(prom.CibilScore);
      r.promotorParam.push({CustomerId: r.filtercustid(),DealNo:filter().DealNumberSearchVal() , Name: itemData.Name, FatherName: itemData.FatherName, Scors: ""+itemData.cibilscore()})
      savePromotors();
    }

    if (prom!=undefined){
      if (prom.EmailAddress.length > 0){
        if (prom.EmailAddress[0] == ""){
          var mail ="";
          $.each(prom.EmailAddress, function(d, email){
            if(email != ""){
              mail += email+"\n"
            }

          });
          itemData.Email =mail;
        }
      }

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
      itemData.FileName = prom.FileName;

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
    } else {
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
      itemData.FileName = "";
      itemData.Addresses = ko.observableArray([]);
    }

    if(r.minScore() == 0 || r.minScore() > itemData.Score) {
      r.minScore(itemData.Score)
    }

    itemData["CurrentBalanceText"] = cibil.formatnum(itemData.CurrentBalance)
    itemData["OverdueBalanceText"] = cibil.formatnum(itemData.OverdueBalance)

    r.promotorsList.push(itemData)
    r.promotorsOnList.push(itemData);
  })

  if(r.reportCibilList().length > 1) {
    if(cibil.reportDraft().Status == 1 || cibil.reportDraft().Status == 2|| cibil.reportDraft().Status == 3|| cibil.reportDraft().Status == -3) {
        $.each(cibil.reportDraft().CreditTypeSummary, function(key2, val2){
          val2.Doubtful =  kendo.toString(parseInt(val2.Doubtful),"N0")
          val2.Loss =  kendo.toString(parseInt(val2.Loss),"N0")
          val2.Substandard =  kendo.toString(parseInt(val2.Substandard),"N0")
          val2.Standard =  kendo.toString(parseInt(val2.Standard),"N0")
          val2.SpecialMention =  kendo.toString(parseInt(val2.SpecialMention),"N0")
          val2.TotalCurrentBalance =  kendo.toString(parseInt(val2.TotalCurrentBalance),"N0")

          cibil.CreditTypeSummary.push(val2);
        });
      r.addDataReport(cibil.reportDraft());
    } else {
      // r.addDataReport(cibil.reportCibilList()[0]);
    }

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
        checkEntryCibilReport()
        //openreports();
      }, function(dismiss) {
        if (dismiss === 'cancel') {
          openreports();
        }
        $(".swal-custom").prev().attr("style","");
      })

      $(".swal-custom").prev().css("opacity","1").css("display","block").css("width",$(".width-container").width()).css("height", $(".width-container").height()-30).css("left","34px").css("top", "33%");
      $(".swal-custom h2").css("font-size","22px")

      var clientHeight = document.getElementById('test').clientHeight;
      var clientWidth = document.getElementById('test').clientWidth;

      var offset = $("#test").offset();
      console.log(offset.top)

      $(".swal2-overlay").css("opacity", "1").css("display", "block").css("width", (clientWidth-18)+"px").css("height", clientHeight+"px").css("top", (offset.top+35) + "px").css("left", (offset.left+9)+"px")

      $(window).scroll(function() {
        $('.swal-custom').prev().css('position', 'absolute');
      });
      $(".swal2-close").bind("click",function(){
          $(".swal-custom").prev().attr("style","height:100%");
      });
    }
  } else if(r.reportCibilList().length != 0) {

    $.each(r.reportCibilList()[0].CreditTypeSummary, function(key2, val2){
      r.CreditTypeSummary.push(val2);

      r.assetClassificationAmount.push(
        {
          standart: r.formatnum(val2.Standard.split(",").join("")),
          substandart: val2.Substandard,
          Doubtful: val2.Doubtful,
          Loss: (val2.loss != undefined) ? val2.loss:"",
          spacialmention: val2.SpecialMention
        }
      );
    })

    r.addDataReport(r.reportCibilList()[0])
    r.setDataCibilDetails(r.reportCibilList()[0])
  }

  if(r.reportCibilList().length > 0 ) {
    setRatingForCibil(r.reportCibilList()[0].Rating)
    checkConfirmCibil(r.reportCibilList()[0])

    if(r.reportCibilList()[0].IsConfirm != 1) {
      cibil.unfreeze(!r.reportCibilList()[0].IsFreeze, 0);
    }
  }
  else
    cibil.unfreeze(true, 0);

   $(".tooltipster-prom").tooltipster({
                trigger: 'hover',
                theme: 'tooltipster-val',
                animation: 'grow',
                delay: 0,
                position:"top",
                interactive: true,
    });

     $(".tooltipster-sd").tooltipster({
                trigger: 'hover',
                theme: 'tooltipster-val',
                animation: 'grow',
                delay: 0,
                position:"bottom",
                interactive: true,
    });
}

r.setDataCibilDetails = function(data) {
  //office
  r.CibilDetails.Office.compname(data.Profile.CompanyName);
  r.CibilDetails.Office.pan(data.Profile.Pan);
  r.CibilDetails.Office.address(data.Profile.Address);
  r.CibilDetails.Office.duns(data.Profile.DunsNumber);
  r.CibilDetails.Office.city(data.Profile.CityTown);
  r.CibilDetails.Office.tlp(data.Profile.Telephone);
  r.CibilDetails.Office.state(data.Profile.StateUnion);
  r.CibilDetails.Office.pin(data.Profile.PinCode);
  r.CibilDetails.Office.fileopendate((data.Profile.FileOpenDate).replace(/\s/g,''));
  r.CibilDetails.Office.country(data.Profile.Country);

  //report summary
  r.CibilDetails.ReportSummary.creditgrantor((parseInt(data.ReportSummary.Grantors)));
  r.CibilDetails.ReportSummary.creditfacilities(data.ReportSummary.Facilities);
  r.CibilDetails.ReportSummary.closecreditfacilitis(data.ReportSummary.CreditFacilities);
  r.CibilDetails.ReportSummary.creditguaranteothers(data.ReportSummary.FacilitiesGuaranteed);
  r.CibilDetails.ReportSummary.latestopendate((data.ReportSummary.LatestCreditFacilityOpenDate).replace(/\s/g,''));
  r.CibilDetails.ReportSummary.firstopendate((data.ReportSummary.FirstCreditFacilityOpenDate).replace(/\s/g,''));
}

r.setDataEntry = function(data) {
  r.dataEntryCibilReport().Id = data.Id
  r.dataEntryCibilReport().Profile().CompanyName(data.Profile.CompanyName)
  r.dataEntryCibilReport().Profile().CustomerId(data.Profile.CustomerId)
  r.dataEntryCibilReport().Profile().DealNo(data.Profile.DealNo)
  r.dataEntryCibilReport().Profile().DunsNumber(data.Profile.DunsNumber)
  r.dataEntryCibilReport().Profile().Pan(data.Profile.Pan)
  r.dataEntryCibilReport().Profile().Address(data.Profile.Address)
  r.dataEntryCibilReport().Profile().CityTown(data.Profile.CityTown)
  r.dataEntryCibilReport().Profile().Telephone(data.Profile.Telephone)
  r.dataEntryCibilReport().Profile().StateUnion(data.Profile.StateUnion)
  r.dataEntryCibilReport().Profile().PinCode(data.Profile.PinCode)
  r.dataEntryCibilReport().Profile().Country(data.Profile.Country)
  r.dataEntryCibilReport().Profile().FileOpenDate(data.Profile.FileOpenDate)

  r.dataEntryCibilReport().ReportSummary().Grantors(data.ReportSummary.Grantors)
  r.dataEntryCibilReport().ReportSummary().Facilities(data.ReportSummary.Facilities)
  r.dataEntryCibilReport().ReportSummary().CreditFacilities(data.ReportSummary.CreditFacilities)
  r.dataEntryCibilReport().ReportSummary().FacilitiesGuaranteed(data.ReportSummary.FacilitiesGuaranteed)
  r.dataEntryCibilReport().ReportSummary().LatestCreditFacilityOpenDate(data.ReportSummary.LatestCreditFacilityOpenDate)
  r.dataEntryCibilReport().ReportSummary().FirstCreditFacilityOpenDate(data.ReportSummary.FirstCreditFacilityOpenDate)

  r.dataEntryCibilReport().EnquirySummary().Enquiries3Month(data.EnquirySummary.Enquiries3Month);
  r.dataEntryCibilReport().EnquirySummary().Enquiries6Month(data.EnquirySummary.Enquiries6Month);
  r.dataEntryCibilReport().EnquirySummary().Enquiries9Month(data.EnquirySummary.Enquiries9Month);
  r.dataEntryCibilReport().EnquirySummary().Enquiries12Month(data.EnquirySummary.Enquiries12Month);
  r.dataEntryCibilReport().EnquirySummary().Enquiries24Month(data.EnquirySummary.Enquiries24Month);
  r.dataEntryCibilReport().EnquirySummary().EnquiriesThan24Month(data.EnquirySummary.EnquiriesThan24Month);
  r.dataEntryCibilReport().EnquirySummary().MostRecentDate(data.EnquirySummary.MostRecentDate);
  r.dataEntryCibilReport().EnquirySummary().TotalEnquiries(data.EnquirySummary.TotalEnquiries);

  r.dataEntryCibilReport().CreditTypeSummary([]);
  if (data.CreditTypeSummary != null){
    r.dataEntryCibilReport().CreditTypeSummary(data.CreditTypeSummary);
  } else {
    r.addCreditTypeSummary();
  }

  r.dataEntryCibilReport().DetailReportSummary([])

  if(data.DetailReportSummary == null) {
    $.each(r.detailreportsummary(), function(k, v){
      temp = {}
      $.each(v, function(ki, vi){
        if(ki != "CreditFacilities")
          temp[ki] = ""
        else
          temp[ki] = vi
      })

      r.dataEntryCibilReport().DetailReportSummary.push(temp)
    })
  } else {
    r.dataEntryCibilReport().DetailReportSummary(data.DetailReportSummary)
  }

  r.dataEntryCibilReport().Status = data.Status
}

r.addCreditTypeSummary = function (){
  r.dataEntryCibilReport().CreditTypeSummary.push({
    CreditType: ko.observable(''),
    NoCreditFacilitiesBorrower: ko.observable(''),
    CurrencyCode: ko.observable(''),
    Standard: ko.observable(''),
    Substandard: ko.observable(''),
    Doubtful: ko.observable(''),
    Loss: ko.observable(''),
    SpecialMention: ko.observable(''),
    TotalCurrentBalance: ko.observable('')
  });
  //model.dataEntryCibilReport().CreditTypeSummary(model.dataEntryCibilReport().CreditTypeSummary());
}

r.removeCreditTypeSummary = function (){
  r.dataEntryCibilReport().CreditTypeSummary.remove(this);
}

r.addDataReport = function(data) {
  var totalSt = 0;
  var totalCur = 0;

  for (var i = 0; i<r.CreditTypeSummary().length; i++ ){
    totalSt += parseInt(r.CreditTypeSummary()[i].Standard.split(",").join("")  );
    totalCur += parseInt(r.CreditTypeSummary()[i].TotalCurrentBalance.split(",").join(""));
    r.CreditTypeSummary()[i].Standard =  kendo.toString(parseInt(r.CreditTypeSummary()[i].Standard.split(",").join("")),"n0");
  }

  r.totalStandard(cibil.formatnum(totalSt));
  r.totalCurrentBalance(cibil.formatnum(totalCur));

  r.creditgrantor(kendo.toString(parseInt(data.ReportSummary.Grantors),"n0"));
  r.creditfacilities(kendo.toString(parseInt(data.ReportSummary.Facilities),"n0"));
  r.closecreditfacilitis(kendo.toString(parseInt(data.ReportSummary.CreditFacilities),"n0"));
  r.creditguaranteothers(kendo.toString(parseInt(data.ReportSummary.FacilitiesGuaranteed),"n0"));

  var last = data.ReportSummary.LatestCreditFacilityOpenDate.split(" ").join("")
  last = moment(last).format("DD-MMM-YYYY");
  r.latestopendate(last);

  var first = data.ReportSummary.FirstCreditFacilityOpenDate.split(" ").join("")
  first =  moment(first).format("DD-MMM-YYYY");
  r.firstopendate(first);

  r.detailreportsummary(data.DetailReportSummary);

  r.threemonth(kendo.toString(parseInt(data.EnquirySummary.Enquiries3Month),"n0"));
  r.sixmonth(kendo.toString(parseInt(data.EnquirySummary.Enquiries6Month  ),"n0"));
  r.ninemonth(kendo.toString(parseInt(data.EnquirySummary.Enquiries9Month),"n0"));
  r.twelvemonth(kendo.toString(parseInt(data.EnquirySummary.Enquiries12Month),"n0"));
  r.duaempatmonth(kendo.toString(parseInt(data.EnquirySummary.Enquiries24Month),"n0"));
  r.thanduaempatmonth(kendo.toString(parseInt(data.EnquirySummary.EnquiriesThan24Month),"n0"));
  var recent = data.EnquirySummary.MostRecentDate.split(" ").join("")
  recent =  moment(recent).format("DD-MMM-YYYY");
  r.recent(recent)

  r.totalenquiries(kendo.toString(parseInt(data.EnquirySummary.TotalEnquiries),"n0"));
}

var savePromotors = function() {
  if(r.promotorParam().length > 0) {
    param = r.promotorParam()
  }

  ajaxPost("/datacapturing/updatepromotor", param, function (res){
    var data = res;
      return false
    });

  return false
}

var saveCibilReport = function(status){
  r.addProfileCompanyData(r.reportCibilList()[0]);

  var url = "/datacapturing/savingreportcibil";

  if(!ValidateCibil()){
    swal("Warning","Please complete all fields","warning");
    return false;
  }

  r.dataEntryCibilReport().Profile().CustomerId(parseInt(filter().CustomerSearchVal()));
  r.dataEntryCibilReport().Profile().DealNo( filter().DealNumberSearchVal());

  if (status == "save"){
    r.dataEntryCibilReport().Status = 0;
    param = r.dataEntryCibilReport();
    ajaxPost(url, param, function(data) {
      if (data) {
        swal("Data Saved", "Data have been saved", "success");
        r.dataEntryCibilReport().Id = data.Id;

        $(".collapsiblecibil").hide()
        $(".collapsibleguarantor").hide()
        $(".guarantorhide").hide()

        $(".reportSummary").show()
        $(".promoters").show()
        $(".entryreportCibil").hide()
      }
    }, undefined);
  }else {
    r.dataEntryCibilReport().Status = 1

    swal({
        title: "Are you sure",
        text: "Submit this data?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        cancelButtonClass: "btn-success",
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        closeOnConfirm: true,
        closeOnCancel: false
      }).then(function() {
        setTimeout(function() {
          r.dataEntryCibilReport().Status = 1

          var url = "/datacapturing/submitreportcibil";
          param = r.dataEntryCibilReport();
          ajaxPost(url, param, function(data) {
            if (data) {
              swal("Data Submited", "Data have been submited", "success");
              refreshFilter();
            }
          }, undefined);

          $(".collapsiblecibil").hide()
          $(".collapsibleguarantor").hide()
          $(".guarantorhide").hide()

          $(".reportSummary").show()
          $(".promoters").show()
          $(".entryreportCibil").hide()

        }, 1000);
      }, function(dismiss) {
        if (dismiss === 'cancel') {
          swal("Cancelled!", "Data didn't submit", "error");
        }
      })


  }
}

var updateConfirmPromotors = function(status){
  var param = {CustomerId: filter().CustomerSearchVal()}
  param["DealNo"] = filter().DealNumberSearchVal()
  param["StatusPromotor"] = status
  var url = "/datacapturing/updateconfirmguarantor"

  ajaxPost(url, param, function(data) {
    if(data.success) {
      refreshFilter();
    }
  })
}

var updateConfirmCibil = function(status){
  var param = {CustomerId: filter().CustomerSearchVal()}
  param["DealNo"] = filter().DealNumberSearchVal()
  param["IsConfirm"] = status
  var url = "/datacapturing/updateconfirmcibil"


  ajaxPost(url, param, function(data) {
    if(data.success) {
      updateConfirmPromotors(status)
    }
  })
}

var setRatingForCibil = function(rating) {
  r.rating(rating)
}

r.addProfileCompanyData = function(data){
  r.dataEntryCibilReport().Profile().CompanyName(data.Profile.CompanyName)
  r.dataEntryCibilReport().Profile().CustomerId(data.Profile.CustomerId)
  r.dataEntryCibilReport().Profile().DunsNumber(data.Profile.DunsNumber)
  r.dataEntryCibilReport().Profile().Pan(data.Profile.Pan)
  r.dataEntryCibilReport().Profile().Address(data.Profile.Address)
  r.dataEntryCibilReport().Profile().CityTown(data.Profile.CityTown)
  r.dataEntryCibilReport().Profile().Telephone(data.Profile.Telephone)
  r.dataEntryCibilReport().Profile().StateUnion(data.Profile.StateUnion)
  r.dataEntryCibilReport().Profile().PinCode(data.Profile.PinCode)
  r.dataEntryCibilReport().Profile().Country(data.Profile.Country)
  r.dataEntryCibilReport().Profile().FileOpenDate(data.Profile.FileOpenDate)
}

function checkShowHide(index) {
  return function() {
    if(index == 1) {
      $(".collapsiblecibil").show()
      $(".collapsibleguarantor").hide()

      $('html, body').animate({ scrollTop: $('.collapsiblecibil').offset().top }, 'slow');
    } else if(index == 2) {
      $(".collapsiblecibil").hide()
      $(".collapsibleguarantor").show()
      $(".guarantorhide").show()

      $('html, body').animate({ scrollTop: $('.collapsibleguarantor').offset().top }, 'slow');
    }
  }
}

function checkShowHideGuarantor(index) {
  return function() {
    $(".collapsiblecibil").hide()
    $(".collapsibleguarantor").show()
    $(".guarantorhide").hide()
    $("#guarantor"+index).show()

    $('html, body').animate({ scrollTop: $("#guarantor"+index).offset().top }, 'slow');
  }
}

function checkEntryCibilReport() {
  $(".collapsiblecibil").hide()
  $(".collapsibleguarantor").hide()
  $(".guarantorhide").hide()

  $(".comment-container").hide()
  $(".reportSummary").hide()
  $(".promoters").hide()
  $(".entryreportCibil").show()
}

var checkConfirmPromotors = function(customerProfile, promotorFinal) {
  var statusCustomer, statusPromotor = 0

  if(customerProfile != null) {
    statusCustomer = customerProfile.StatusCibil
  }

  if(promotorFinal.length > 0) {
    statusPromotor = promotorFinal[0].StatusCibil
  }

  if(statusCustomer == 1 && statusPromotor == 1) {
    $(".confirmPromotor").hide()
    $(".unConfirmPromotor").show()
  } else {
    $(".confirmPromotor").show()
    $(".unConfirmPromotor").hide()
  }
}

var checkConfirmCibil = function(cibilList) {
  var statusCibil = 0

  if(cibilList != null) {
    statusCibil = cibilList.IsConfirm
  }

  if(statusCibil == 1) {
    $(".btn-freeze").attr('disabled', true)
    $(".btn-unfreeze").attr('disabled', true)
    $(".btn-confirm").hide()
    $(".btn-unconfirm").show()
    cibil.unfreeze(false, 1)
    if(cibilList != null) {
      if(cibilList.IsFreeze) {
        $(".btn-freeze").hide();
        $(".btn-unfreeze").show();
      }else {
        $(".btn-freeze").show()
        $(".btn-unfreeze").hide()
      }

      $(".confirmdate").text("Last Confirmed at " + moment(cibilList.AcceptRejectTime).format("DD-MM-YYYY HH:mm A"));
    }

  } else {
    $(".btn-freeze").removeAttr('disabled')
    $(".btn-unfreeze").removeAttr('disabled')
    $(".btn-confirm").show()
    $(".btn-unconfirm").hide()

    if(cibilList != null) {
      // $(".confirmdate").text("Data Rejected on " + moment(cibilList.AcceptRejectTime).format("DD-MM-YYYY HH:mm A"));
    }
  }
}

preopenreports = function(){
  r.urls([])
  for(var i=0; i < r.reportCibilList().length; i++){
    if(filter().CustomerSearchVal() == r.reportCibilList()[i].Profile.CustomerId){
      var data = r.reportCibilList()[i]
      r.urls.push("/static/pdf/"+data.FileName);
    }
  }
  if(r.reportDraft().length != 0 && r.reportDraft().FileName != "") {
    r.urls.push("/static/pdf/"+r.reportDraft().FileName);
  }

  if(r.urls().length==0) return;
  var evalstring = "function myFunction() {"
  for(var i=0; i < r.urls().length; i++){
    evalstring+="setTimeout(function(){ window.open('"+r.urls()[i]+"');},1500);"
  }
  evalstring+="};myFunction();"
  eval(evalstring);
}

openreports = function(){
  preopenreports();
}

openreportsGuarantor = function(fileName) {
  return function(){
    if(fileName != "") {
      var urlFull = "/static/pdf/promotor/"+fileName;
      window.open(urlFull)
    }else{
      swal("Warning","CIBIL file not found","warning");
    }
  }
}

function FilterInput(event) {
  var keyCode = ('which' in event) ? event.which : event.keyCode;

  isNotWanted = (keyCode == 69 || keyCode == 101);
  return !isNotWanted;
};

function handlePaste (e) {
    var clipboardData, pastedData;

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text').toUpperCase();

    if(pastedData.indexOf('E')>-1) {
        //alert('found an E');
        e.stopPropagation();
        e.preventDefault();
    }
};

function ValidateCibil()
{
  var repsum = r.dataEntryCibilReport().ReportSummary();
  var detailsummary = r.dataEntryCibilReport().DetailReportSummary();
  var enquiry = r.dataEntryCibilReport().EnquirySummary()
  var credtype = r.dataEntryCibilReport().CreditTypeSummary();

  var Valid = true;
  var dt = repsum;
    _.each(dt,function(e,i){
        if(e() == "" && parseInt(e()) != 0){
         Valid = false;
        }
    });

  if(!Valid){
    return false;
  }

  var Valid = true;
  var dt = detailsummary;
  _.each(dt,function(e,i){
    _.each(e,function(v,k){
      if(v == "" && parseInt(v) != 0){
        Valid = false;
      }
    });
  });

  if(!Valid){
    return false;
  }

  var Valid = true;
  var dt = enquiry;
  _.each(dt,function(e,i){
    if(e() == "" && parseInt(e()) != 0){
     Valid = false;
    }
  });

  if(!Valid){
    return false;
  }

  var Valid = true;
  var dt = credtype;
  _.each(dt,function(e,i){
    _.each(e,function(ex,ix){
      if(typeof ex === "function") {
        if(ex() == "" && parseInt(ex()) != 0){
          Valid = false;
        }else{
          if(ex == "" && parseInt(ex) != 0){
            Valid = false;
          }
        }
      }
    });
  });

  if(!Valid){
    return false;
  }

  return true;
}

function backToMain(){
  checkConfirmCibil(null)

  $(".collapsiblecibil").hide()
  $(".collapsibleguarantor").hide()
  $(".guarantorhide").hide()

  $(".reportSummary").show()
  $(".promoters").show()
  $(".entryreportCibil").hide()
}

function refreshFilter(){
   backToMain();
   r.getData();
   refreshcomment();
}

$(document).ready(function () {
  r.rating("")
  checkConfirmPromotors(r.customerProfile(), r.promotorsscore())
  checkConfirmCibil(null)

  $('.reportSummary').collapsible({
    accordion : true
  });

  $('.creditTypeSummary').collapsible({
    accordion : true
  });

  $('.promoters').collapsible({
    accordion : true
  });

  $('.collapsiblecibil').collapsible({
    accordion : true
  });

  $('.collapsibleguarantor').collapsible({
    accordion : true
  });

  $('.entryreportCibil').collapsible({
    accordion : true
  });

  $(".collapsiblecibil").hide()
  $(".collapsibleguarantor").hide()
  $(".guarantorhide").hide()

  $(".reportSummary").show()
  $(".promoters").show()
  $(".entryreportCibil").hide()
});

cibil.ShowComment = function(){
  $("#CBComment").appendTo('body');
    refreshcomment();
  $("#CBComment").modal("show");
}

cibil.lastcomment = ko.observable("");

cibil.unfreeze = function(what, cibil){
  if(cibil == 0) {
    $(".container-all button").prop( "disabled", !what );

    $(".container-all .k-widget").each(function(i,e){

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

   if(!what) {
      $(".btn-freeze").hide();
      $(".btn-unfreeze").show();
    }else {
      $(".btn-freeze").show()
      $(".btn-unfreeze").hide()
    }
  } else {
    $(".container-all button").prop( "disabled", !what );

    $(".container-all .k-widget").each(function(i,e){

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
}

cibil.SendFreeze = function(what){
     var param = {};
      param.custid = filter().CustomerSearchVal();
      param.dealno = filter().DealNumberSearchVal();
      param.status = what;
      ajaxPost("/datacapturing/updatefreeze", param, function (res){
          var data = res;
          if(data.success){
            cibil.unfreeze(!what,0);
            if(what)
            swal("Success","Data Freezed","success");
            else
            swal("Success","Data Unfreezed","success");

          }else{
            swal("Warning","Freezing failed","warning");
          }
        return false
    });
}

cibil.eventfreeze = function (){
   cibil.SendFreeze(true);
}

cibil.eventunfreeze = function(){
   cibil.SendFreeze(false);
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