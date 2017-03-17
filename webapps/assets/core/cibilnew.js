var cibil = {}; var r = cibil;

r.cibilFileNameList = ko.observableArray([])
r.cibilFileNameSelected = ko.observable("")

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

r.cibilStatus = ko.observable(1)
r.cibilStatusDraft = ko.observable(1)

r.isConfirm = ko.observable(0)
r.isFreeze = ko.observable(0)
r.ConfirmText = ko.observable("Confirm")
r.FreezeText = ko.observable("Freeze")

r.cibilFileNameSelected.subscribe(function(value){
  if(value != "") {
    cibilSelected = _.filter(r.reportCibilList(), function(row){
      return value === row.FileName
    })

    r.setDataEntry(cibilSelected[0])  
  }
  
});

r.resetData = function(){
  r.CibilDetails.Office.compname("");
  r.CibilDetails.Office.pan("");
  r.CibilDetails.Office.address("");
  r.CibilDetails.Office.duns("");
  r.CibilDetails.Office.city("");
  r.CibilDetails.Office.tlp("");
  r.CibilDetails.Office.state("");
  r.CibilDetails.Office.pin("");
  r.CibilDetails.Office.fileopendate("");
  r.CibilDetails.Office.country("");
  r.CibilDetails.ReportSummary.creditgrantor("");
  r.CibilDetails.ReportSummary.creditfacilities("");
  r.CibilDetails.ReportSummary.closecreditfacilitis("");
  r.CibilDetails.ReportSummary.creditguaranteothers("");
  r.CibilDetails.ReportSummary.latestopendate("");
  r.CibilDetails.ReportSummary.firstopendate("");
}
  
r.cibilDraftTemp = ko.observableArray();

r.getData = function() {

  r.cibilFileNameList([])
  r.ConfirmText("Confirm")
  $(".btn-disabled-confirm").prop("disabled", false);
  $(".btn-disabled").prop( "disabled", false );

  $(".container-all .k-widget").each(function(i,e){

    var $ddl = $(e).find("select").getKendoDropDownList();

    if($ddl == undefined)
      var $ddl = $(e).find("input").getKendoDropDownList();

    var $dtm = $(e).find("input").getKendoDatePicker();
    var $txt = $(e).find("input").eq(1).getKendoNumericTextBox();

    if($ddl != undefined)
    {
      $ddl.enable(true);
    }else if($dtm != undefined){
      $dtm.enable(true);
    }else if ($txt != undefined){
      $txt.enable(true);
    }
  });

  var param = {CustomerId: filter().CustomerSearchVal()}
  param["DealNo"] = filter().DealNumberSearchVal()
  var url = "/datacapturing/getcustomerprofiledetailbycustid"
  r.statusAccept("")

  r.customerName(filter().CustomerSearchText())
  var Name = r.customerName().split("-").splice(1);

  r.resetData()
  r.titleCibil(toTitleCase(Name.join(" ") +" - Company Summary"));

  ajaxPost(url, param, function(data) {
    r.cibilDraftTemp(data[2].CibilDraft)

    // checkConfirmedOrNot(data[0].CustomerProfile.Status, 1, 2, data[0].CustomerProfile, null, "Customer Application");
    if(data.success != false) {

      r.filtercustid(data[0].CustomerProfile.Id)
      r.customerProfile(data[0].CustomerProfile);

      r.reportCibilList(data[1].CibilReport);

      r.reportDraft(data[2].CibilDraft);
      r.promotorsscore(data[3].Promotors);

      r.setDataEntry(JSON.parse( JSON.stringify(r.reportDraft())));

      r.setData();

      r.cibilStatus(1)
       if(data[1].CibilReport.length > 1 || data[1].CibilReport.length ==0) {
        r.cibilStatusDraft(0)
      }else{
        r.cibilStatusDraft(1)
      }

      // Data on backend is not always have IsConfirm and IsFreeze
      // Try to setup it here to prevent js errors
      try{
      r.reportCibilList()[0].IsConfirm = _.get(r.reportCibilList()[0], "IsConfirm", 0)
      r.reportCibilList()[0].IsFreeze = _.get(r.reportCibilList()[0], "IsFreeze", 0)

      if(r.reportCibilList()[0].IsConfirm == 1) {
        $(".btn-disabled-confirm").prop("disabled", true);
        $(".btn-disabled").prop( "disabled", true );

        $(".container-all .k-widget").each(function(i,e){

          var $ddl = $(e).find("select").getKendoDropDownList();

          if($ddl == undefined)
            var $ddl = $(e).find("input").getKendoDropDownList();

          var $dtm = $(e).find("input").getKendoDatePicker();
          var $txt = $(e).find("input").eq(1).getKendoNumericTextBox();

          if($ddl != undefined)
          {
            $ddl.enable(false);
          }else if($dtm != undefined){
            $dtm.enable(false);
          }else if ($txt != undefined){
            $txt.enable(false);
          }
        });
      }

      if(r.reportCibilList()[0].IsConfirm == 0 && r.reportCibilList()[0].IsFreeze) {
       $(".btn-disabled-confirm").prop("disabled", true);
       $(".btn-disabled").prop( "disabled", true ); 
      
       $(".container-all .k-widget").each(function(i,e){

          var $ddl = $(e).find("select").getKendoDropDownList();

          if($ddl == undefined)
            var $ddl = $(e).find("input").getKendoDropDownList();

          var $dtm = $(e).find("input").getKendoDatePicker();
          var $txt = $(e).find("input").eq(1).getKendoNumericTextBox();

          if($ddl != undefined)
          {
            $ddl.enable(false);
          }else if($dtm != undefined){
            $dtm.enable(false);
          }else if ($txt != undefined){
            $txt.enable(false);
          }
        });
      }
    }catch(e){
      console.log(e)
    }

      if(data[1].CibilReport.length > 1) {
        r.cibilStatusDraft(data[2].CibilDraft.Status)
        if(data[2].CibilDraft.Status == 0 && data[1].CibilReport[0].Status != undefined) {
          r.cibilStatus(data[1].CibilReport[0].Status)
        }
      }

      if(data[1].CibilReport.length > 0 && data[1].CibilReport[0].IsConfirm != undefined) {
        r.isConfirm = ko.observable(data[1].CibilReport[0].IsConfirm)
        if(data[1].CibilReport[0].IsConfirm == 1) {
          r.ConfirmText("Re-Enter")
        } else {
          r.ConfirmText("Confirm")
        }
      }

      if(data[1].CibilReport.length > 0 && data[1].CibilReport[0].IsFreeze != undefined) {
        r.isFreeze = ko.observable(data[1].CibilReport[0].IsFreeze)
        if(data[1].CibilReport[0].IsFreeze == 1) {
          r.FreezeText("Unfreeze")
          cibil.unfreeze(false,0);
        } else {
          r.FreezeText("Freeze")
          cibil.unfreeze(true,0);
        }
      }

      if(r.reportCibilList().length == 0){
         r.ConfirmText("Confirm");
      }
      r.CibilAccess();
    }
  })
}

r.CibilAccess = function(){
  if(!model.IsGranted("confirm")){
    $("button:contains('Confirm')").addClass("no-grant");
    $("button:contains('Update')").addClass("no-grant");
  }else{
    $("button:contains('Confirm')").removeClass("no-grant");
    $("button:contains('Update')").removeClass("no-grant");
  }

   if(!model.IsGranted("edit")){
    $("button:contains('Edit')").addClass("no-grant");
  }else{
    $("button:contains('Edit')").removeClass("no-grant");
  }

   if(!model.IsGranted("reenter")){
    $("button:contains('Re-Enter')").addClass("no-grant");
  }else{
    $("button:contains('Re-Enter')").removeClass("no-grant");
  }

   if(!model.IsGranted("freeze")){
    $("button:contains('Freeze')").addClass("no-grant");
  }else{
    $("button:contains('Freeze')").removeClass("no-grant");
  }

  if(!model.IsGranted("unfreeze")){
    $("button:contains('Unfreeze')").addClass("no-grant");
  }else{
    $("button:contains('Unfreeze')").removeClass("no-grant");
  }
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

    r.promotorParam([])

  $.each(r.customerProfile().DetailOfPromoters.Biodata, function(index, itemData){
    //define model
    //

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

     if(prom == undefined){
        prom  = _.find(r.promotorsscore(),function(x){ return x.ConsumerInfo.ConsumerName == itemData.Name } );
    }

    if(prom == undefined){
        prom  = _.find(r.promotorsscore(),function(x){ return moment(x.ConsumerInfo.DateOfBirth).format("DD-MM-YYYY") == moment(itemData.DateOfBirth).format("DD-MM-YYYY") } );
    }
    // if(itemData.cibilscore()==0 && prom!=undefined){
    //   itemData.cibilscore(prom.CibilScore);
    //   r.promotorParam.push({CustomerId: r.filtercustid(),DealNo:filter().DealNumberSearchVal() , Name: itemData.Name, FatherName: itemData.FatherName, Scors: ""+itemData.cibilscore()})
    //   savePromotors();
    // }
      if(prom!=undefined){
        itemData.cibilscore(prom.CibilScore);
      // if(itemData.cibilscore() !=  prom.CibilScore){
         r.promotorParam.push({CustomerId: r.filtercustid(),DealNo:filter().DealNumberSearchVal() , Name: itemData.Name, FatherName: itemData.FatherName, Scors: ""+itemData.cibilscore()})
         // savePromotors();
       // }
      }else{
         r.promotorParam.push({CustomerId: r.filtercustid(),DealNo:filter().DealNumberSearchVal() , Name: itemData.Name, FatherName: itemData.FatherName, Scors: ""+0})
      }                 

    if (prom!=undefined){
      // if (prom.EmailAddress.length > 0){
      //   if (prom.EmailAddress[0] == ""){
      //     var mail ="";
      //     $.each(prom.EmailAddress, function(d, email){
      //       if(email != ""){
      //         mail += email+"\n"
      //       }

      //     });
      //     itemData.Email =mail;
      //   }
      // }
      itemData.Name = prom.ConsumerInfo.ConsumerName;
      itemData.Dob = moment(prom.ConsumerInfo.DateOfBirth).format("DD-MM-YYYY");//prom.ConsumerInfo.DateOfBirth;
      // itemData.Phone = prom.Telephones[0].Number;
      // itemData.Address = prom.AddressData[0].AddressPinCode;
      itemData.Score = prom.CibilScore; //itemData.cibilscore() <= 0 ? prom.CibilScore : itemData.cibilscore();
      itemData.CIBILScore = prom.CibilScore; //itemData.cibilscore() <= 0 ? prom.CibilScore : itemData.cibilscore();
      itemData.Passport = prom.PassportNumber;
      itemData.Dates = moment(prom.DateOfReport).format("DD-MM-YYYY");
      itemData.Times = moment(prom.TimeOfReport).format("HH:mm:ss");
      itemData.AddDateReport = moment(prom.AddressData[0].DateReported).format("DD-MM-YYYY");
      // itemData.Category = prom.AddressData[0].Category;
      itemData.TotalAcc = prom.TotalAccount;
      itemData.TotalOverdue = prom.TotalOverdues;
      itemData.TotalZeroBalanceAcc = prom.TotalZeroBalanceAcc;
      itemData.HighCreditSanctionAmount = cibil.formatnum(prom.HighCreditSanctionAmount)//prom.HighCreditSanctionAmount;
      itemData.CurrentBalance = prom.CurrentBalance;
      itemData.OverdueBalance = prom.OverdueBalance;
      // itemData.TelephoneType = prom.Telephones[0].Type;
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
      itemData.Email = prom.EmailAddress.join("\n")

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
      itemData.Score = 0;//itemData.cibilscore();
      itemData.CIBILScore = 0; //itemData.cibilscore() <= 0 ? prom.CibilScore : itemData.cibilscore();
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

   if( (r.minScore() > itemData.Score &&  itemData.Score != 0) || r.minScore() == 0 ) {
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
          if(val2.Doubtful != ""){
            val2.Doubtful =  app.formatnum(parseInt(val2.Doubtful))
          }else{
            val2.Doubtful = "";
          }
          
          if(val2.Loss != ""){
             val2.Loss =  app.formatnum(parseInt(val2.Loss))
          }else{
            val2.Loss = "";
          }
         
          if(val2.Substandard != ""){
            val2.Substandard =  app.formatnum(parseInt(val2.Substandard))
          }else{
            val2.Substandard = "";
          }
          
          if(val2.Standard != ""){
            val2.Standard =  app.formatnum(parseInt(val2.Standard))
          }else{
            val2.Standard = "";
          }
          
          if(val2.SpecialMention != ""){
            val2.SpecialMention =  app.formatnum(parseInt(val2.SpecialMention))
          }else{
            val2.SpecialMention = "";
          }
          
          if(val2.TotalCurrentBalance != ""){
            val2.TotalCurrentBalance =  app.formatnum(parseInt(val2.TotalCurrentBalance))
          }else{
            val2.TotalCurrentBalance = "";
          }
        
          cibil.CreditTypeSummary.push(val2);
        });
      r.addDataReport(cibil.reportDraft());
      // cibil.reportDraft().Profile =  {
      //   CompanyName : "",
      //   Pan : "",
      //   Address : "",
      //   DunsNumber : "",
      //   CityTown : "",
      //   Telephone : "",
      //   StateUnion : "",
      //   PinCode : "",
      //   FileOpenDate : "",
      //   Country : ""
      // };
       r.setDataCibilDetails(cibil.reportDraft());
    } else {

      // r.addDataReport(cibil.reportCibilList()[0]);
    }

    //$(".swa").show()

    if(cibil.reportDraft().Status == 0) {
      setTimeout(function(){
          cibil.unfreeze(false, 0);
      },300);
      if(model.IsGranted("edit")){
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
        openreports();
      }, function(dismiss) {
        if (dismiss === 'cancel') {
          openreports();
        }
        $(".swal-custom").prev().attr("style","");
      })
    }

      $(".swal-custom").prev().css("opacity","1").css("display","block").css("width",$(".width-container").width()).css("height", $(".width-container").height()-30).css("left","34px").css("top", "33%");
      $(".swal-custom h2").css("font-size","22px")

      var clientHeight = document.getElementById('test').clientHeight;
      var clientWidth = document.getElementById('test').clientWidth;

      var offset = $("#test").offset();
      
      $(".swal2-overlay").css("opacity", "1").css("display", "block").css("width", (clientWidth-18)+"px").css("height", clientHeight+"px").css("top", (offset.top+35) + "px").css("left", (offset.left+9)+"px")

      $(window).scroll(function() {
        $('.swal-custom').prev().css('position', 'absolute');
      });
      $(".swal2-close").bind("click",function(){
          $(".swal-custom").prev().attr("style","height:100%");
      });
    }else{
      if(r.reportCibilList()[0].IsConfirm != 1) {
        cibil.unfreeze(!r.reportCibilList()[0].IsFreeze, 0);
      }
    }
  } else if(r.reportCibilList().length != 0) {
    $.each(r.reportCibilList()[0].CreditTypeSummary, function(key2, val2){
      var str = val2.TotalCurrentBalance;
      if(str.indexOf(",") > -1){
        r.CreditTypeSummary.push({
          NoCreditFacilitiesBorrower  : val2.NoCreditFacilitiesBorrower,
          CreditType  : val2.CreditType,
          CurrencyCode  : val2.CurrencyCode,
          TotalCurrentBalance  : val2.TotalCurrentBalance,
          Standard: app.formatnum(val2.Standard.split(",").join("")),
          Substandard: app.formatnum(val2.Substandard.split(",").join("")),
          Doubtful:  app.formatnum(val2.Doubtful.split(",").join("")),
          Loss: (val2.Loss != undefined) ? app.formatnum(val2.Loss.split(",").join("")):"", 
          SpecialMention: app.formatnum(val2.SpecialMention.split(",").join("")),
        });
      }else{
        r.CreditTypeSummary.push({
          NoCreditFacilitiesBorrower  : val2.NoCreditFacilitiesBorrower,
          CreditType  : val2.CreditType,
          CurrencyCode  : val2.CurrencyCode,
          TotalCurrentBalance  : app.formatnum(val2.TotalCurrentBalance),
          Standard: app.formatnum(val2.Standard.split(",").join("")),
          Substandard: app.formatnum(val2.Substandard.split(",").join("")),
          Doubtful:  app.formatnum(val2.Doubtful.split(",").join("")),
          Loss: (val2.Loss != undefined) ? app.formatnum(val2.Loss.split(",").join("")):"", 
          SpecialMention: app.formatnum(val2.SpecialMention.split(",").join("")),
        });
      }
      

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
  }else{
    cibil.unfreeze(false, 0);
  }

  if(r.reportCibilList().length > 0 ) {
    setRatingForCibil(r.reportCibilList()[0].Rating)
    checkConfirmCibil(r.reportCibilList()[0])
  }
  

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

    _.each(r.reportCibilList(), function(row){
      r.cibilFileNameList.push(row.FileName)  
    })
    
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

  r.dataEntryCibilReport().Id = r.reportDraft().Id
  r.dataEntryCibilReport().Profile().CompanyName(data.Profile.CompanyName)
  r.dataEntryCibilReport().Profile().CustomerId(parseInt(filter().CustomerSearchVal()));
  r.dataEntryCibilReport().Profile().DealNo( filter().DealNumberSearchVal());
  r.dataEntryCibilReport().Profile().DunsNumber(data.Profile.DunsNumber)
  r.dataEntryCibilReport().Profile().Pan(data.Profile.Pan)
  r.dataEntryCibilReport().Profile().Address(data.Profile.Address)
  r.dataEntryCibilReport().Profile().CityTown(data.Profile.CityTown)
  r.dataEntryCibilReport().Profile().Telephone(data.Profile.Telephone)
  r.dataEntryCibilReport().Profile().StateUnion(data.Profile.StateUnion)
  r.dataEntryCibilReport().Profile().PinCode(data.Profile.PinCode)
  r.dataEntryCibilReport().Profile().Country(data.Profile.Country)
  
  var temp = data.Profile.FileOpenDate.split(" ").join("")
  temp = moment(temp).format("DD-MMM-YYYY");
  r.dataEntryCibilReport().Profile().FileOpenDate(temp);

  
  r.dataEntryCibilReport().ReportSummary().Grantors(data.ReportSummary.Grantors)
  r.dataEntryCibilReport().ReportSummary().Facilities(data.ReportSummary.Facilities)
  r.dataEntryCibilReport().ReportSummary().CreditFacilities(data.ReportSummary.CreditFacilities)
  r.dataEntryCibilReport().ReportSummary().FacilitiesGuaranteed(data.ReportSummary.FacilitiesGuaranteed)
  
  temp = data.ReportSummary.LatestCreditFacilityOpenDate.split(" ").join("")
  temp = moment(temp).format("DD-MMM-YYYY");
  r.dataEntryCibilReport().ReportSummary().LatestCreditFacilityOpenDate(temp);

  temp = data.ReportSummary.FirstCreditFacilityOpenDate.split(" ").join("")
  temp = moment(temp).format("DD-MMM-YYYY");
  r.dataEntryCibilReport().ReportSummary().FirstCreditFacilityOpenDate(temp);

  r.dataEntryCibilReport().EnquirySummary().Enquiries3Month(data.EnquirySummary.Enquiries3Month);
  r.dataEntryCibilReport().EnquirySummary().Enquiries6Month(data.EnquirySummary.Enquiries6Month);
  r.dataEntryCibilReport().EnquirySummary().Enquiries9Month(data.EnquirySummary.Enquiries9Month);
  r.dataEntryCibilReport().EnquirySummary().Enquiries12Month(data.EnquirySummary.Enquiries12Month);
  r.dataEntryCibilReport().EnquirySummary().Enquiries24Month(data.EnquirySummary.Enquiries24Month);
  r.dataEntryCibilReport().EnquirySummary().EnquiriesThan24Month(data.EnquirySummary.EnquiriesThan24Month);
  r.dataEntryCibilReport().EnquirySummary().MostRecentDate(data.EnquirySummary.MostRecentDate);
  r.dataEntryCibilReport().EnquirySummary().TotalEnquiries(data.EnquirySummary.TotalEnquiries);

  temp = data.EnquirySummary.MostRecentDate.split(" ").join("")
  temp = moment(temp).format("DD-MMM-YYYY");
  r.dataEntryCibilReport().EnquirySummary().MostRecentDate(temp);

  r.dataEntryCibilReport().CreditTypeSummary([]);
  if (data.CreditTypeSummary != null){

    
    for (var i=0; i < data.CreditTypeSummary.length; i++) {
      var temp = {}
      temp.CreditType = data.CreditTypeSummary[i].CreditType
      temp.CurrencyCode = data.CreditTypeSummary[i].CurrencyCode
      temp.NoCreditFacilitiesBorrower = data.CreditTypeSummary[i].NoCreditFacilitiesBorrower
      temp.SpecialMention = data.CreditTypeSummary[i].SpecialMention.split(",").join("")
      temp.Standard = data.CreditTypeSummary[i].Standard.split(",").join("")
      temp.Substandard = data.CreditTypeSummary[i].Substandard.split(",").join("")
      temp.Doubtful = data.CreditTypeSummary[i].Doubtful.split(",").join("")
      temp.Loss = data.CreditTypeSummary[i].Loss.split(",").join("")
      temp.TotalCurrentBalance = data.CreditTypeSummary[i].TotalCurrentBalance.split(",").join("")
      
      r.dataEntryCibilReport().CreditTypeSummary.push(temp)
    }
    // _.each(r.dataEntryCibilReport().CreditTypeSummary(), function(o){
    //   o.Standard = (o.Standard.split(",").join(""));
    //   o.Substandard = (o.Substandard.split(",").join(""));
    //   o.Doubtful = (o.Doubtful.split(",").join(""));
    //   o.Loss = (o.Loss.split(",").join(""));
    //   o.SpecialMention = (o.SpecialMention.split(",").join(""));
    //   o.TotalCurrentBalance = (o.TotalCurrentBalance.split(",").join(""));

    //   // r.dataEntryCibilReport().CreditTypeSummary.push([{
    //   //   Standard : ko.observable((o.Standard.split(",").join(""))),
    //   //   Substandard : ko.observable((o.Substandard.split(",").join(""))),
    //   //   Doubtful : ko.observable((o.Doubtful.split(",").join(""))),
    //   //   Loss : ko.observable((o.Loss.split(",").join(""))),
    //   //   SpecialMention : ko.observable((o.SpecialMention.split(",").join(""))),
    //   //   TotalCurrentBalance : ko.observable((o.TotalCurrentBalance.split(",").join("")))
    //   // }])
    // })

  } else {
    r.addCreditTypeSummary();
  }

  r.dataEntryCibilReport().DetailReportSummary.removeAll()

  if(data.DetailReportSummary == null) {
    r.addDetailReportSummary()
  } else {
    var tempResult = []
    
    for(var i=0; i<data.DetailReportSummary.length; i++) {
      var temp = {}
      temp.CreditFacilities = data.DetailReportSummary[i].CreditFacilities
      temp.CurrentBalanceOtherThanStandard = data.DetailReportSummary[i].CurrentBalanceOtherThanStandard.split(",").join("")
      temp.CurrentBalanceStandard = data.DetailReportSummary[i].CurrentBalanceStandard.split(",").join("")
      temp.NoOfLawSuits = data.DetailReportSummary[i].NoOfLawSuits.split(",").join("")
      temp.NoOfOtherThanStandard = data.DetailReportSummary[i].NoOfOtherThanStandard.split(",").join("")
      temp.NoOfStandard = data.DetailReportSummary[i].NoOfStandard.split(",").join("")
      temp.NoOfWilfulDefaults = data.DetailReportSummary[i].NoOfWilfulDefaults.split(",").join("")

      r.dataEntryCibilReport().DetailReportSummary.push(temp)
      // r.dataEntryCibilReport().DetailReportSummary.push(temp)
    }
  }

  r.dataEntryCibilReport().Status = data.Status

  setDataOffice();
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

r.editCibilGrid = function(){
  checkEntryCibilReport();
}

r.checkShowEdit = function(){
  if(r.reportDraft.length > 0 && r.reportDraft()[0].status == 1) {
    return true
  } else {
    return false
  }
}

r.addDetailReportSummary = function(){
  r.dataEntryCibilReport().DetailReportSummary.push({
    CreditFacilities: ko.observable(''),
    CurrentBalanceOtherThanStandard: ko.observable(''),
    CurrentBalanceStandard: ko.observable(''),
    NoOfLawSuits: ko.observable(''),
    NoOfOtherThanStandard: ko.observable(''),
    NoOfStandard: ko.observable(''),
    NoOfWilfulDefaults: ko.observable('')
  })
}

r.removeCreditTypeSummary = function (){
  r.dataEntryCibilReport().CreditTypeSummary.remove(this);
}

r.removeDetailReportSummary = function (){
  r.dataEntryCibilReport().DetailReportSummary.remove(this);
}

r.addDataReport = function(data) {
  var totalSt = 0;
  var totalCur = 0;

  for (var i = 0; i<r.CreditTypeSummary().length; i++ ){
    if(r.CreditTypeSummary()[i].Standard != ""){
      r.CreditTypeSummary()[i].Standard =  app.formatnum(parseInt(r.CreditTypeSummary()[i].Standard.split(",").join("")));
      totalSt += parseInt(r.CreditTypeSummary()[i].Standard.split(",").join("")  );
    }else{
      r.CreditTypeSummary()[i].Standard = ""
      totalSt = ""
    }
    
    if(r.CreditTypeSummary()[i].Substandard != ""){
      r.CreditTypeSummary()[i].Substandard =  app.formatnum(parseInt(r.CreditTypeSummary()[i].Substandard.split(",").join("")));
    }else{
      r.CreditTypeSummary()[i].Substandard = ""
    }
    
    if(r.CreditTypeSummary()[i].Doubtful != ""){
      r.CreditTypeSummary()[i].Doubtful =  app.formatnum(parseInt(r.CreditTypeSummary()[i].Doubtful.split(",").join("")));
    }else{
       r.CreditTypeSummary()[i].Doubtful = "";
    }
    
    if(r.CreditTypeSummary()[i].Loss != ""){
      r.CreditTypeSummary()[i].Loss =  app.formatnum(parseInt(r.CreditTypeSummary()[i].Loss.split(",").join("")));
    }else{
      r.CreditTypeSummary()[i].Loss = ""
    }
    
    if(r.CreditTypeSummary()[i].SpecialMention != ""){
      r.CreditTypeSummary()[i].SpecialMention =  app.formatnum(parseInt(r.CreditTypeSummary()[i].SpecialMention.split(",").join("")));
    }else{
      r.CreditTypeSummary()[i].Loss = ""
    }

    if(r.CreditTypeSummary()[i].TotalCurrentBalance != ""){
      r.CreditTypeSummary()[i].TotalCurrentBalance =  app.formatnum(parseInt(r.CreditTypeSummary()[i].TotalCurrentBalance.split(",").join("")));
      totalCur += parseInt(r.CreditTypeSummary()[i].TotalCurrentBalance.split(",").join(""));
    }else{
      r.CreditTypeSummary()[i].TotalCurrentBalance = "";
      totalCur = "";
    }
    
  }


  if(totalSt != ""){
    r.totalStandard(app.formatnum(totalSt));
  }else{
    totalSt = ""
  }
  
  if(totalCur != ""){
    r.totalCurrentBalance(app.formatnum(totalCur));
  }else{
    totalCur = "";
  }
  

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

  temp = []

  _.each(data.DetailReportSummary, function(row){
    if(row.CurrentBalanceOtherThanStandard != ""){
      row.CurrentBalanceOtherThanStandard = app.formatnum(parseInt(row.CurrentBalanceOtherThanStandard.split(",").join("")));
    }else{
      row.CurrentBalanceOtherThanStandard = ""
    }

    if(row.CurrentBalanceStandard != ""){
      row.CurrentBalanceStandard = app.formatnum(parseInt(row.CurrentBalanceStandard.split(",").join("")));
    }else{
      row.CurrentBalanceStandard = "";
    }
    
    if(row.NoOfLawSuits != ""){
      row.NoOfLawSuits = app.formatnum(parseInt(row.NoOfLawSuits.split(",").join("")));
    }else{
      row.NoOfLawSuits ="";
    }

    if(row.NoOfOtherThanStandard != ""){
      row.NoOfOtherThanStandard = app.formatnum(parseInt(row.NoOfOtherThanStandard.split(",").join("")));
    }else{
      row.NoOfOtherThanStandard = "";
    }

    if(row.NoOfStandard != ""){
      row.NoOfStandard = app.formatnum(parseInt(row.NoOfStandard.split(",").join("")));
    }else{
      row.NoOfStandard = "";
    }
    
    if(row.NoOfWilfulDefaults != ""){
      row.NoOfWilfulDefaults = app.formatnum(parseInt(row.NoOfWilfulDefaults.split(",").join("")));
    }else{
      row.NoOfWilfulDefaults = "";
    }
    
    
    temp.push(row)
  })

  r.detailreportsummary(temp);

  if(data.EnquirySummary.Enquiries3Month != ""){
    r.threemonth(kendo.toString(parseInt(data.EnquirySummary.Enquiries3Month),"n0"));
  }else{
    r.threemonth("")
  }
  
  if(data.EnquirySummary.Enquiries6Month != ""){
    r.sixmonth(kendo.toString(parseInt(data.EnquirySummary.Enquiries6Month  ),"n0"));
  }else{
    r.sixmonth("")
  }
  
  if(data.EnquirySummary.Enquiries9Month != ""){
    r.ninemonth(kendo.toString(parseInt(data.EnquirySummary.Enquiries9Month),"n0"));
  }else{
    r.ninemonth("")
  }
  
  if(data.EnquirySummary.Enquiries12Month != ""){
    r.twelvemonth(kendo.toString(parseInt(data.EnquirySummary.Enquiries12Month),"n0"));
  }else{
    r.twelvemonth("")
  }
  
  if(data.EnquirySummary.Enquiries24Month != ""){
    r.duaempatmonth(kendo.toString(parseInt(data.EnquirySummary.Enquiries24Month),"n0"));
  }else{
    r.duaempatmonth("")
  }
  
  if(data.EnquirySummary.EnquiriesThan24Month != ""){
    r.thanduaempatmonth(kendo.toString(parseInt(data.EnquirySummary.EnquiriesThan24Month),"n0"));
  }else{
    r.thanduaempatmonth("")
  }
  
  var recent = data.EnquirySummary.MostRecentDate.split(" ").join("")
  recent =  moment(recent).format("DD-MMM-YYYY");
  r.recent(recent)
  if(data.EnquirySummary.TotalEnquiries != ""){
    r.totalenquiries(kendo.toString(parseInt(data.EnquirySummary.TotalEnquiries),"n0"));
  }else{
    r.totalenquiries("")
  }
  
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

var loadDateString = function(rr){
  var FirstopenDate = kendo.toString(new Date(rr.ReportSummary().FirstCreditFacilityOpenDate()), "dd-MMM-yyyy");
  rr.ReportSummary().FirstCreditFacilityOpenDate(FirstopenDate);

  var LatestopenDate = kendo.toString(new Date(rr.ReportSummary().LatestCreditFacilityOpenDate()), "dd-MMM-yyyy");
  rr.ReportSummary().LatestCreditFacilityOpenDate(LatestopenDate);

  var MostRecentDate = kendo.toString(new Date(rr.EnquirySummary().MostRecentDate()), "dd-MMM-yyyy");
  rr.EnquirySummary().MostRecentDate(MostRecentDate);

  var fileOpenDate = kendo.toString(new Date(rr.Profile().FileOpenDate()), "dd-MMM-yyyy");
  rr.Profile().FileOpenDate(fileOpenDate);  

return rr
}

var setDataOffice = function(){
  if(r.dataEntryCibilReport().Status === 1) {
    r.CibilDetails.Office.compname(r.dataEntryCibilReport().Profile().CompanyName())
    r.CibilDetails.Office.pan(r.dataEntryCibilReport().Profile().Pan())
    r.CibilDetails.Office.address(r.dataEntryCibilReport().Profile().Address())
    r.CibilDetails.Office.duns(r.dataEntryCibilReport().Profile().DunsNumber())
    r.CibilDetails.Office.city(r.dataEntryCibilReport().Profile().CityTown())
    r.CibilDetails.Office.tlp(r.dataEntryCibilReport().Profile().Telephone())
    r.CibilDetails.Office.state(r.dataEntryCibilReport().Profile().StateUnion())
    r.CibilDetails.Office.pin(r.dataEntryCibilReport().Profile().PinCode())
    r.CibilDetails.Office.fileopendate(r.dataEntryCibilReport().Profile().FileOpenDate())
    r.CibilDetails.Office.country(r.dataEntryCibilReport().Profile().Country())
      
  }
}
var saveCibilReport = function(status){
  var sample = r.dataEntryCibilReport();
  
  if (!app.isFormValid("#entryCR") && status == 'submit') {
    swal("Warning","Please complete all fields","warning");
    return;
  }

  if(status == 'submit'){
    var validator = $("#entryCR").data("kendoValidator")
  }
  // r.addProfileCompanyData(r.reportCibilList()[0]);

  var url = "/datacapturing/savingreportcibil";

  r.dataEntryCibilReport().Profile().CustomerId(parseInt(filter().CustomerSearchVal()));
  r.dataEntryCibilReport().Profile().DealNo( filter().DealNumberSearchVal());
  
  if (status == "save"){
    $(".k-widget.k-tooltip-validation").hide()  
    r.dataEntryCibilReport().Status = 0;
    param = r.dataEntryCibilReport();
    param = loadDateString(param)

    ajaxPost(url, param, function(data) {
      if (data) {
        swal("Data Saved", "Data have been saved", "success");
        r.dataEntryCibilReport().Id = data.Id;

        $(".collapsiblecibil").hide()
        $(".collapsibleguarantor").hide()
        $(".guarantorhide").hide()
        $(".comment-container").show()

        $(".reportSummary").show()
        $(".promoters").show()
        $(".entryreportCibil").hide()
      }
    }, undefined);
  }else {
    if (validator.validate()) {
      r.dataEntryCibilReport().Status = 1

      swal({
          title: "",
          text: "Are you sure want to submit this data?",
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
            param = loadDateString(param)

            ajaxPost(url, param, function(data) {
              if (data) {
                swal("Data Submitted", "", "success");
                refreshFilter();
              }
            }, undefined);

            $(".collapsiblecibil").hide()
            $(".collapsibleguarantor").hide()
            $(".guarantorhide").hide()

            $(".comment-container").show()
            $(".reportSummary").show()
            $(".promoters").show()
            $(".entryreportCibil").hide()

          }, 1000);
        }, function(dismiss) {
          if (dismiss === 'cancel') {
            // swal("Cancelled!", "Data didn't submit", "error");
          }
        })
    }


  }
  
}

var updateConfirmPromotors = function(status){
  var param = {CustomerId: filter().CustomerSearchVal()}
  param["DealNo"] = filter().DealNumberSearchVal()
  param["StatusPromotor"] = status
  var url = "/datacapturing/updateconfirmguarantor";

    

  ajaxPost(url, param, function(data) {
    if(data.success) {
        if(status == 1){
        savePromotors();
       }
      refreshFilter();
    }
  })
}

var updateConfirmCibil = function(){
    if(r.reportCibilList().length == 0) {
      swal("Warning","CIBIL Data not found","warning");
    } else {
      var status = 1
      if(r.isConfirm() == 1) {
        status = 0
      }
      var param = {CustomerId: filter().CustomerSearchVal()}
      param["DealNo"] = filter().DealNumberSearchVal()
      param["IsConfirm"] = status
      var url = "/datacapturing/updateconfirmcibil"


      ajaxPost(url, param, function(data) {
        if(data.success) {
          if(status == 0){
            swal("Please Edit / Enter Data", "", "success");
            $(".btn-disabled-confirm").prop("disabled", false);
            $(".btn-disabled").prop( "disabled", false );

            $(".container-all .k-widget").each(function(i,e){

              var $ddl = $(e).find("select").getKendoDropDownList();

              if($ddl == undefined)
                var $ddl = $(e).find("input").getKendoDropDownList();

              var $dtm = $(e).find("input").getKendoDatePicker();
              var $txt = $(e).find("input").eq(1).getKendoNumericTextBox();

              if($ddl != undefined)
              {
                $ddl.enable(true);
              }else if($dtm != undefined){
                $dtm.enable(true);
              }else if ($txt != undefined){
                $txt.enable(true);
              }
            });

          } else {
            $(".btn-disabled-confirm").prop("disabled", true);
            $(".btn-disabled").prop( "disabled", true );
            $(".container-all .k-widget").each(function(i,e){

              var $ddl = $(e).find("select").getKendoDropDownList();

              if($ddl == undefined)
                var $ddl = $(e).find("input").getKendoDropDownList();

              var $dtm = $(e).find("input").getKendoDatePicker();
              var $txt = $(e).find("input").eq(1).getKendoNumericTextBox();

              if($ddl != undefined)
              {
                $ddl.enable(false);
              }else if($dtm != undefined){
                $dtm.enable(false);
              }else if ($txt != undefined){
                $txt.enable(false);
              }
            });

            swal("Successfully Confirmed", "", "success");
          }

          updateConfirmPromotors(status)
        }
      })
    }
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
  $(".k-widget.k-tooltip-validation").hide()  
  $("#entryCR").data("kendoValidator");
  $(".collapsiblecibil").hide()
  $(".collapsibleguarantor").hide()
  $(".guarantorhide").hide()

  $(".comment-container").hide()
  $(".reportSummary").hide()
  $(".promoters").hide()
  $(".entryreportCibil").show()
  r.setDataEntry(JSON.parse( JSON.stringify(r.reportDraft())));
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
    // $(".btn-freeze").attr('disabled', true)
    // $(".btn-unfreeze").attr('disabled', true)
    cibil.unfreeze(false, 1)
    if(cibilList != null) {
      $(".confirmdate").text("Last Confirmed at " + moment(cibilList.AcceptRejectTime).format("DD-MM-YYYY HH:mm A"));
    }

  } else {
    // $(".btn-freeze").removeAttr('disabled')
    // $(".btn-unfreeze").removeAttr('disabled')

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
    _.each(e,function(ex,ix){
      if(typeof ex === "function") {
        if(ex() == "" && parseInt(ex()) != 0){
          Valid = false;
        }
      }else{
          if(ex == "" && parseInt(ex) != 0){
            Valid = false;
          }
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
        }
      }else{
          if(ex == "" && parseInt(ex) != 0){
            Valid = false;
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
  $(".comment-container").show()
  $(".reportSummary").show()
  $(".promoters").show()
  $(".entryreportCibil").hide()
}

function refreshFilter(){
  $(".swal-custom").hide()
  $(".swal2-overlay").hide()
  backToMain();
  r.getData();
  refreshcomment();
  $(".toast").html("");
}

r.checkConfirm = function(){
    if(r.isConfirm()==1) {
      return true
    } else {
      return false
    }
}

$(document).ready(function () {
  r.rating("")
  checkConfirmPromotors(r.customerProfile(), r.promotorsscore())
  checkConfirmCibil(null)

  // $('.reportSummary').collapsible({
  //   accordion : true
  // });

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
  r.CibilAccess();
});

cibil.ShowComment = function(){
  $("#CBComment").appendTo('body');
    refreshcomment();
  $("#CBComment").modal("show");
}

cibil.lastcomment = ko.observable("");

cibil.unfreeze = function(what, cibil){
  if(cibil == 0) {

    //$(".container-all button").prop( "disabled", !what );
    $(".btn-disabled1").prop( "disabled", !what );


  } else {
    //$(".container-all button").prop( "disabled", !what );
    $(".btn-disabled").prop( "disabled", !what );

    // $(".container-all .k-widget").each(function(i,e){

    //   var $ddl = $(e).find("select").getKendoDropDownList();

    //   if($ddl == undefined)
    //     var $ddl = $(e).find("input").getKendoDropDownList();

    //   var $dtm = $(e).find("input").getKendoDatePicker();
    //   var $txt = $(e).find("input").eq(1).getKendoNumericTextBox();

    //   if($ddl != undefined)
    //   {
    //     $ddl.enable(what);
    //   }else if($dtm != undefined){
    //     $dtm.enable(what);
    //   }else if ($txt != undefined){
    //     $txt.enable(what);
    //   }
    // });
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
            r.isFreeze(what)

            if(what) {
              if(r.reportCibilList()[0].IsConfirm == 0) {
                $(".btn-disabled-confirm").prop("disabled", true);
                $(".btn-disabled").prop( "disabled", true );

                $(".container-all .k-widget").each(function(i,e){

                  var $ddl = $(e).find("select").getKendoDropDownList();

                  if($ddl == undefined)
                    var $ddl = $(e).find("input").getKendoDropDownList();

                  var $dtm = $(e).find("input").getKendoDatePicker();
                  var $txt = $(e).find("input").eq(1).getKendoNumericTextBox();

                  if($ddl != undefined)
                  {
                    $ddl.enable(false);
                  }else if($dtm != undefined){
                    $dtm.enable(false);
                  }else if ($txt != undefined){
                    $txt.enable(false);
                  }
                });
              }

              swal("Success","Data Freezed","success");
              r.FreezeText("Unfreeze")
            } else {
              if(r.reportCibilList()[0].IsConfirm == 0) {
                $(".btn-disabled-confirm").prop("disabled", false);
                $(".btn-disabled").prop( "disabled", false );

                $(".container-all .k-widget").each(function(i,e){

                  var $ddl = $(e).find("select").getKendoDropDownList();

                  if($ddl == undefined)
                    var $ddl = $(e).find("input").getKendoDropDownList();

                    var $dtm = $(e).find("input").getKendoDatePicker();
                    var $txt = $(e).find("input").eq(1).getKendoNumericTextBox();

                    if($ddl != undefined)
                    {
                      $ddl.enable(true);
                    }else if($dtm != undefined){
                      $dtm.enable(true);
                    }else if ($txt != undefined){
                      $txt.enable(true);
                    }
                });
              }

              swal("Success","Data Unfreezed","success");
              r.FreezeText("Freeze")
            }

          }else{
            swal("Warning","Freezing failed","warning");
          }
        return false
    });
}

cibil.eventfreeze = function (){
   if(r.reportCibilList().length == 0) {
      swal("Warning","CIBIL Data not found","warning");
      return;
    }

    if(!r.isConfirm()) {
      swal("Warning", "Please Confirm Data First", "warning");
      return;
    }

    cibil.SendFreeze(!r.isFreeze());
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