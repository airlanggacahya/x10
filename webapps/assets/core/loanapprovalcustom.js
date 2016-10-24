loanapproval = {
    companyname : ko.observable(""),
    logindate : ko.observable(""),
    businessaddress : ko.observable(""),
    product : ko.observable(""),
    location : ko.observable(""),
    internalrating : ko.observable(""),
    businesssince : ko.observable(""),
    businesssegment : ko.observable(""),
    leaddistributor : ko.observable(""),
    creditanalyst : ko.observable(""),
    comercialcibilreport : ko.observable(""),
    averageutilization : ko.observable(""),
    maxdpd : ko.observable(""),
    numberdelay : ko.observable(""),
    numberearly : ko.observable(""),
    numberpayment : ko.observable(""),
    promotorbio : ko.observableArray([]),
    pddone : ko.observable(""),
    pddate : ko.observable(""),
    pdplace : ko.observable(""),
    personmet : ko.observable(""),
    pdremarks : ko.observable(""),
    topCustomersName : ko.observableArray([]),
    topproducts : ko.observableArray([]),
    expansionplan : ko.observable(""),
    commentfinance : ko.observable(""),
    referencecheck : ko.observableArray([]),
    marketref : ko.observable(""),
    detailpromoters : ko.observableArray([]),
    officeaddress : ko.observable(""),
    officeownership : ko.observable(""),
    officeactivity : ko.observable(""),
    officelandarea : ko.observable(""),
    officebuiltuparea : ko.observable(""),
    officemarketvalue : ko.observable(""),
    promotersarr : ko.observableArray([]),

    valueregistered : ko.observable(""),
    brhead : ko.observable(""),
    rmname : ko.observable(""),
    propertyowned : ko.observable([]),
    companybackground : ko.observableArray([]),
    pdCustomerMargin: ko.observable(""),
    pdComments: ko.observable("")
}

loanApproval = {
    companyBackgroundData: ko.observable(""),
    promoterBackgroundData: ko.observable(""),
    propertyOwnershipData: ko.observable(""),
    ourstandings: ko.observableArray(""),
    data: ko.observableArray([]),
    creditScoreData : ko.observableArray([]),
    refresh: function() {
      setTimeout(function(){
        loanApproval.data(r.AllData().Data)
        loanApproval.creditScoreData(r.AllData3())
        loanApproval.setData(loanApproval.data())
      }, 100)
    },
    isFirstLoad: ko.observable(true),
    isLoading: ko.observable(true),
    loading: function (what) {
      $('.apx-loading')[what ? 'show' : 'hide']()
      $('.panel-content')[what ? 'hide' : 'show']()

      if (loanApproval.isFirstLoad() && what == true)
          loanApproval.isFirstLoad(false);

      loanApproval.isLoading(what);
    },
    loanDetail: {
      proposedLimitAmount: ko.observable(),
      proposedROI: ko.observable(),
      proposedProFee: ko.observable(),
      limitTenor: ko.observable(),
      ifExistingCustomer: ko.observable(),
      ifYesExistingLimitAmount: ko.observable(),
      existingROI: ko.observable(),
      existingProcessingFee: ko.observable(),
      firstAgreementDate: ko.observable(),
      vintageWithX10: ko.observable(),
      recentAgreementDate: ko.observable(),
      poBacked: ko.observable(),
      projectPOValue: ko.observable(),
      expectedPayment: ko.observable(),
      x10Obligo: ko.observable()
    },
    paymentTrack: {
      maxdelaydays : ko.observable(""),
      averagetransactionpaymentdelay : ko.observable(""),
      maxpaymentdays : ko.observable(""),
      delaystandarddeviation : ko.observable(""),
      averagedelaydays : ko.observable(""),
      averagetransactionpayment : ko.observable(""),
      standarddeviation : ko.observable(""),
      daystandarddeviation : ko.observable(""),
      averagepaymentdays : ko.observable(""),
      amountofbusiness : ko.observable("0"),
      highestAverageDelay: ko.observable(0)
    },
    borrowerDetails : {
      customersegmentclasification : ko.observable(""),
      diversificationcustomers : ko.observable(""),
      externalrating : ko.observable(""),
      dependeceonsuppliers : ko.observable(""),
      datebusinessstarted : ko.observable(""),
      management : ko.observable(""),
      businessMix : {
        stocksell : ko.observable(""),
        iriscomp : ko.observable(""),
        supertron : ko.observable(""),
        govt : ko.observable(""),
        savex : ko.observable(""),
        compuage : ko.observable(""),
        corporate : ko.observable(""),
        rashi : ko.observable(""),
        avnet : ko.observable(""),
        distributorMix : {
          data : ko.observableArray([{Label:"", Result:""}])
        }
      },
    },
    ratingRef : {
      IndustryAndBusiness : ko.observable(""),
      ManagementPromotorsRisk : ko.observable(""),
      FinancialRisk : ko.observable(""),
      BankingRisk : ko.observable(""),
      OverallScore : ko.observable(""),
      InternalRating : ko.observable(""),
      AD : {
        ExternalRating : ko.observable("")
      },
      Cibil : {
        Rating : ko.observable("")
      }
    },
};

loanApproval.setData = function(data){
    // Loan Detail
    loanApproval.loanDetail.proposedLimitAmount(numberWithCommas( data.AD[0].loandetails.requestedlimitamount));
    loanApproval.loanDetail.ifExistingCustomer((data.AD[0].loandetails.ifExistingCustomer) ? "Yes" : "No");
    loanApproval.loanDetail.proposedROI(data.AD[0].loandetails.proposedrateinterest + "%");
    loanApproval.loanDetail.ifYesExistingLimitAmount(numberWithCommas(data.AD[0].loandetails.ifyeseistinglimitamount));
    loanApproval.loanDetail.proposedProFee(data.AD[0].loandetails.proposedpfee + "%");
    loanApproval.loanDetail.existingROI(data.AD[0].loandetails.existingroi + "%");
    loanApproval.loanDetail.limitTenor(data.AD[0].loandetails.limittenor);
    loanApproval.loanDetail.existingProcessingFee(data.AD[0].loandetails.existingpf + "%");
    loanApproval.loanDetail.firstAgreementDate(moment(new Date(data.AD[0].loandetails.firstagreementdate)).format("DD/MM/YYYY"));
    loanApproval.loanDetail.vintageWithX10(data.AD[0].loandetails.vintagewithx10);
    loanApproval.loanDetail.recentAgreementDate(moment(new Date(data.AD[0].loandetails.recenetagreementdate)).format("DD/MM/YYYY"));
    loanApproval.loanDetail.poBacked((data.AD[0].loandetails.ifbackedbypo) ? "Yes" : "No"),
    loanApproval.loanDetail.projectPOValue(data.AD[0].loandetails.povalueforbacktoback),
    loanApproval.loanDetail.expectedPayment(data.AD[0].loandetails.expectedpayment)
    loanApproval.loanDetail.x10Obligo(data.AD[0].loandetails.interestoutgo)

    //repayment
    if (data.AD[0].vendordetails.length > 0 ){
        loanApproval.paymentTrack.maxdelaydays (data.AD[0].vendordetails[0].maxdelaydays);
        loanApproval.paymentTrack.maxpaymentdays (data.AD[0].vendordetails[0].maxpaymentdays)
        loanApproval.paymentTrack.averagedelaydays (data.AD[0].vendordetails[0].averagedelaydays);
        loanApproval.paymentTrack.standarddeviation (data.AD[0].vendordetails[0].delaydaysstandarddeviation)
        loanApproval.paymentTrack.averagepaymentdays (data.AD[0].vendordetails[0].averagepaymentdays)
        loanApproval.paymentTrack.averagetransactionpaymentdelay (data.AD[0].vendordetails[0].avgtransactionweightedpaymentdelaydays);
        loanApproval.paymentTrack.delaystandarddeviation (data.AD[0].vendordetails[0].delaydaysstandarddeviation);
        loanApproval.paymentTrack.averagetransactionpayment (data.AD[0].vendordetails[0].avgtransactionweightedpaymentdays);
        loanApproval.paymentTrack.daystandarddeviation (data.AD[0].vendordetails[0].standarddeviation);
    }else{
        loanApproval.paymentTrack.maxdelaydays("-");
        loanApproval.paymentTrack.maxpaymentdays ("-");
        loanApproval.paymentTrack.averagedelaydays ("-");
        loanApproval.paymentTrack.standarddeviation ("-");
        loanApproval.paymentTrack.averagepaymentdays ("-");
        loanApproval.paymentTrack.averagetransactionpaymentdelay ("-");
        loanApproval.paymentTrack.delaystandarddeviation ("-");
        loanApproval.paymentTrack.averagetransactionpayment ("-");
        loanApproval.paymentTrack.daystandarddeviation ("-");
    }

    //borrower details
    loanApproval.borrowerDetails.customersegmentclasification(data.AD[0].borrowerdetails.customersegmentclasification);
    loanApproval.borrowerDetails.diversificationcustomers(data.AD[0].borrowerdetails.diversificationcustomers);
    loanApproval.borrowerDetails.externalrating(data.AD[0].borrowerdetails.externalrating);
    loanApproval.borrowerDetails.dependeceonsuppliers(data.AD[0].borrowerdetails.dependenceonsuppliers);
    loanApproval.borrowerDetails.datebusinessstarted(data.AD[0].borrowerdetails.datebusinessstarted);
    loanApproval.borrowerDetails.management(data.AD[0].borrowerdetails.management);

    //borrower details - businessMix
    loanApproval.borrowerDetails.businessMix.stocksell(data.AD[0].customerbussinesmix.stocksellin + "%");
    loanApproval.borrowerDetails.businessMix.govt(data.AD[0].customerbussinesmix.b2bgovtin + "%");
    loanApproval.borrowerDetails.businessMix.corporate(data.AD[0].customerbussinesmix.b2bcorporatein + "%");
    loanApproval.borrowerDetails.businessMix.iriscomp(data.AD[0].distributormix.iriscomputerslimitedin + "%");
    loanApproval.borrowerDetails.businessMix.savex(data.AD[0].distributormix.savexin + "%");
    loanApproval.borrowerDetails.businessMix.rashi(data.AD[0].distributormix.rashiin + "%");
    loanApproval.borrowerDetails.businessMix.supertron(data.AD[0].distributormix.supertronin + "%");
    loanApproval.borrowerDetails.businessMix.compuage(data.AD[0].distributormix.compuagein + "%");
    loanApproval.borrowerDetails.businessMix.avnet(data.AD[0].distributormix.avnetin + "%");

    if(data.AD[0].distributormix.Data)
      if(data.AD[0].distributormix.Data[0].Label != undefined){
        loanApproval.borrowerDetails.businessMix.distributorMix.data(data.AD[0].distributormix.Data)
      } else {
        loanApproval.borrowerDetails.businessMix.distributorMix.data([{Label : "", Result: ""}])
      }

    setDataCreditScoreCard(loanApproval.creditScoreData())

    loanApproval.ratingRef.AD.ExternalRating(data.AD[0].borrowerdetails.externalrating)

    if(data.CIBIL.length > 0) {
      loanApproval.ratingRef.Cibil.Rating(data.CIBIL[0].Rating)
    }

    _.each(data.AD[0].vendordetails, function(vd){
      var highestAD = loanApproval.paymentTrack.highestAverageDelay;
      highestAD(vd.averagedelaydays > highestAD() ? vd.averagedelaydays : highestAD());
    });
}

var setDataCreditScoreCard = function(data) {
  if(data != null || data != "") {

    loanApproval.ratingRef.OverallScore(data.FinalScore)
    loanApproval.ratingRef.InternalRating(data.FinalRating)

    if(data.Data.length > 0) {
      var header = _.filter(data.Data, function(o){
        return o.IsHeader
      })

      if(header.length > 0) {
        loanApproval.ratingRef.IndustryAndBusiness(header[0].Score)
        loanApproval.ratingRef.ManagementPromotorsRisk(header[1].Score)
        loanApproval.ratingRef.FinancialRisk(header[2].Score)
        loanApproval.ratingRef.BankingRisk(header[3].Score)
      }
    }
  }
}
