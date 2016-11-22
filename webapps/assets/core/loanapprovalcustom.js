
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
    proposedlimitamount : ko.observable(""),
    firstagreementdate : ko.observable("-"),
    limittenor : ko.observable(""),
    existinglimitamount : ko.observable(""),
    recentagreementdate : ko.observable(""),
    roi : ko.observable(""),
    existingroi : ko.observable(""),
    vintagex10 : ko.observable(""),
    proposedfee : ko.observable(""),
    existingpf : ko.observable(""),
    comercialcibilreport : ko.observable(""),
    maxdelaydays : ko.observable(""),
    maxpaymentdays : ko.observable(""),
    averagedelaydays : ko.observable(""),
    standarddeviation : ko.observable(""),
    averagepaymentdays : ko.observable(""),
    existingcustomer : ko.observable(""),
    valueregistered : ko.observable(""),
    brhead : ko.observable(""),
    rmname : ko.observable(""),
    propertyowned : ko.observable([]),
    companybackground : ko.observableArray([]),
    pdCustomerMargin: ko.observable(""),
    pdComments: ko.observable(""),
    averagetransactionpaymentdelay: ko.observable(""),
    delaystandarddeviation: ko.observable(""),
    averagetransactionpayment: ko.observable(""),
    daystandarddeviation: ko.observable(""),
    averageutilization: ko.observable(""),
    maxdpd: ko.observable(""),
    numberdelay: ko.observable(""),
    numberearly: ko.observable(""),
    numberpayment: ko.observable(""),
    stocksell: ko.observable(""),
    govt: ko.observable(""),
    corporate: ko.observable(""),
    iriscomp: ko.observable(""),
    savex: ko.observable(""),
    rashi: ko.observable(""),
    supertron: ko.observable(""),
    compuage: ko.observable(""),
    avnet: ko.observable(""),
    promotorbio: ko.observableArray([]),
    pddone: ko.observable(""),
    pddate: ko.observable(""),
    pdplace: ko.observable(""),
    personmet: ko.observable(""),
    pdremarks: ko.observable(""),
    topCustomersName: ko.observableArray([]),
    topproducts: ko.observableArray([]),
    expansionplan: ko.observable(""),
    commentfinance: ko.observable(""),
    referencecheck: ko.observableArray([]),
    marketref: ko.observable(""),
    detailpromoters: ko.observableArray([]),
    officeaddress: ko.observable(""),
    officeownership: ko.observable(""),
    officeactivity: ko.observable(""),
    officelandarea: ko.observable(""),
    officebuiltuparea: ko.observable(""),
    officemarketvalue: ko.observable(""),
    promotersarr: ko.observableArray([]),
    amountofbusiness: ko.observable(""),
    valueregistered: ko.observable(""),
    propertyowned: ko.observableArray([]),
    companybackground: ko.observableArray([]),
    pdCustomerMargin: ko.observable(""),
    pdComments: ko.observable(""),
    distributorList: ko.observableArray([{Label : "", Result: ""}]),

    topcustomerfinal: ko.observable(""),
    topproductsfinal: ko.observable("")
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
    loanSummary : {
      scheme : ko.observable("")
    },
    commercialCibil: {
      assessment: ko.observable(),
      comments: ko.observableArray([])
    },
    outstandingData: ko.observable("")
};

loanApproval.reset = function(){
    due.dataVerifications("");
    due.dataDefaulterList("");
    due.dataTemp("");
    due.Name("");
    due.dataCustomer("")
    due.templateForm = {
        Id: "",
        CustomerId: "",
        DealNo: "",
        Verification: [],
        Defaulter: [],
        Background: [],
        Status: 0,
        Freeze: false,
        LastConfirmed : (new Date()).toISOString(),
    };
    due.formVisible(false);
    due.form = ko.mapping.fromJS(due.templateForm);

    loanapproval.companyname("")
    loanapproval.logindate("")
    loanapproval.businessaddress("")
    loanapproval.product("")
    loanapproval.location("")
    loanapproval.internalrating("")
    loanapproval.businesssince("")
    loanapproval.businesssegment("")
    loanapproval.leaddistributor("")
    loanapproval.creditanalyst("")
    loanapproval.proposedlimitamount("")
    loanapproval.existingcustomer("")
    loanapproval.firstagreementdate("-")
    loanapproval.limittenor("")
    loanapproval.existinglimitamount("")
    loanapproval.recentagreementdate("")
    loanapproval.roi("")
    loanapproval.existingroi("")
    loanapproval.vintagex10("")
    loanapproval.proposedfee("")
    loanapproval.existingpf("")
    loanapproval.comercialcibilreport("")
    loanapproval.maxdelaydays("")
    loanapproval.maxpaymentdays("")
    loanapproval.averagedelaydays("")
    loanapproval.standarddeviation("")
    loanapproval.averagepaymentdays("")
    loanapproval.averagetransactionpaymentdelay("")
    loanapproval.delaystandarddeviation("")
    loanapproval.averagetransactionpayment("")
    loanapproval.daystandarddeviation("")
    loanapproval.averageutilization("")
    loanapproval.maxdpd("")
    loanapproval.numberdelay("")
    loanapproval.numberearly("")
    loanapproval.numberpayment("")
    loanapproval.stocksell("")
    loanapproval.govt("")
    loanapproval.corporate("")
    loanapproval.iriscomp("")
    loanapproval.savex("")
    loanapproval.rashi("")
    loanapproval.supertron("")
    loanapproval.compuage("")
    loanapproval.avnet("")
    loanapproval.promotorbio([])
    loanapproval.pddone("")
    loanapproval.pddate("")
    loanapproval.pdplace("")
    loanapproval.personmet("")
    loanapproval.pdremarks("")
    loanapproval.topCustomersName([])
    loanapproval.topproducts([])
    loanapproval.expansionplan("")
    loanapproval.commentfinance("")
    loanapproval.referencecheck([])
    loanapproval.marketref("")
    loanapproval.detailpromoters([])
    loanapproval.officeaddress("")
    loanapproval.officeownership("")
    loanapproval.officeactivity("")
    loanapproval.officelandarea("")
    loanapproval.officebuiltuparea("")
    loanapproval.officemarketvalue("")
    loanapproval.promotersarr([])
    loanapproval.amountofbusiness("")
    loanapproval.valueregistered("")
    loanapproval.propertyowned([])
    loanapproval.companybackground([])
    loanapproval.pdCustomerMargin("")
    loanapproval.pdComments("")
    loanapproval.distributorList([{Label : "", Result: ""}])

    loanapproval.topcustomerfinal("");
    loanapproval.topproductsfinal("");

    promoter.Name(""),
    promoter.Address(""),
    promoter.Ownership(""),
    promoter.NoOfYears(""),
    promoter.NetWorth(""),
    promoter.PropertyType(""),
    promoter.PropertyAddress(""),
    promoter.PropertyMarket(""),

    promoters = [];

    loanApproval.loanSummary.scheme("")
    loanApproval.loanDetail.proposedLimitAmount(),
    loanApproval.loanDetail.proposedROI(),
    loanApproval.loanDetail.proposedProFee(),
    loanApproval.loanDetail.limitTenor(),
    loanApproval.loanDetail.ifExistingCustomer(),
    loanApproval.loanDetail.ifYesExistingLimitAmount(),
    loanApproval.loanDetail.existingROI(),
    loanApproval.loanDetail.existingProcessingFee(),
    loanApproval.loanDetail.firstAgreementDate("-"),
    loanApproval.loanDetail.vintageWithX10(),
    loanApproval.loanDetail.recentAgreementDate(),
    loanApproval.loanDetail.poBacked(),
    loanApproval.loanDetail.projectPOValue(),
    loanApproval.loanDetail.expectedPayment()

    loanApproval.paymentTrack.highestAverageDelay(0)
    loanApproval.commercialCibil.assessment()
    loanApproval.commercialCibil.comments([])
    loanApproval.companyBackgroundData("")
    loanApproval.promoterBackgroundData("")
    loanApproval.propertyOwnershipData("")
    loanApproval.outstandingData("")
}

loanApproval.setData = function(data){
    // Loan Detail
    if(data.AD.length > 0) {
        loanApproval.loanDetail.proposedLimitAmount(numberWithCommas( data.AD[0].loandetails.requestedlimitamount));
        loanApproval.loanDetail.ifExistingCustomer((data.AD[0].loandetails.ifexistingcustomer) ? "Yes" : "No");
        loanApproval.loanDetail.proposedROI(data.AD[0].loandetails.proposedrateinterest + "%");
        loanApproval.loanDetail.ifYesExistingLimitAmount(numberWithCommas(data.AD[0].loandetails.ifyeseistinglimitamount));
        loanApproval.loanDetail.proposedProFee(data.AD[0].loandetails.proposedpfee + "%");
        loanApproval.loanDetail.existingROI(data.AD[0].loandetails.existingroi + "%");
        loanApproval.loanDetail.limitTenor(data.AD[0].loandetails.limittenor);
        loanApproval.loanDetail.existingProcessingFee(data.AD[0].loandetails.existingpf + "%");

        if(moment(new Date(data.AD[0].loandetails.firstagreementdate)).format("DD/MM/YYYY") == "01/01/1970") {
            loanApproval.loanDetail.firstAgreementDate("-")
        } else {
            loanApproval.loanDetail.firstAgreementDate(moment(new Date(data.AD[0].loandetails.firstagreementdate)).format("DD/MM/YYYY"))
        }

        loanApproval.loanDetail.vintageWithX10(data.AD[0].loandetails.vintagewithx10);

        if(moment(new Date(data.AD[0].loandetails.recenetagreementdate)).format("DD/MM/YYYY") == "01/01/1970") {
            loanApproval.loanDetail.recentAgreementDate("-")
        } else {
            loanApproval.loanDetail.recentAgreementDate(moment(new Date(data.AD[0].loandetails.recenetagreementdate)).format("DD/MM/YYYY"))
        }

        loanApproval.loanDetail.poBacked((data.AD[0].loandetails.ifbackedbypo) ? "Yes" : "No"),
        loanApproval.loanDetail.projectPOValue(data.AD[0].loandetails.povalueforbacktoback),
        loanApproval.loanDetail.expectedPayment(data.AD[0].loandetails.expectedpayment)
        loanApproval.loanDetail.x10Obligo(data.AD[0].loandetails.interestoutgo)

        //repayment
        if (data.AD[0].vendordetails.length > 0 ){
              var lead =  _.find(data.AD[0].vendordetails, function(xx){ return  xx.distributorname ==  data.AD[0].accountsetupdetails.leaddistributor});
                console.log(lead,"----lead")
            if(lead == undefined){
                lead = data.AD[0].vendordetails[0];
            }

            loanApproval.paymentTrack.maxdelaydays (lead.maxdelaydays);
            loanApproval.paymentTrack.maxpaymentdays (lead.maxpaymentdays)
            loanApproval.paymentTrack.averagedelaydays (lead.averagedelaydays);
            loanApproval.paymentTrack.standarddeviation (lead.standarddeviation)
            loanApproval.paymentTrack.averagepaymentdays (lead.averagepaymentdays)
            loanApproval.paymentTrack.averagetransactionpaymentdelay (lead.avgtransactionweightedpaymentdelaydays);
            loanApproval.paymentTrack.delaystandarddeviation (lead.delaydaysstandarddeviation);
            loanApproval.paymentTrack.averagetransactionpayment (lead.avgtransactionweightedpaymentdays);
            loanApproval.paymentTrack.daystandarddeviation (lead.daysstandarddeviation);
            loanApproval.paymentTrack.amountofbusiness(lead.amountofbusinessdone);

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
            loanApproval.paymentTrack.amountofbusiness("-");
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

        if(data.AD[0].distributormix.Data) {
          if(data.AD[0].distributormix.Data[0].Label != undefined){
            loanApproval.borrowerDetails.businessMix.distributorMix.data(data.AD[0].distributormix.Data)
          } else {
            loanApproval.borrowerDetails.businessMix.distributorMix.data([{Label : "", Result: ""}])
          }
        }
    }

    setDataCreditScoreCard(loanApproval.creditScoreData())

    if(data.AD.length > 0)
        loanApproval.ratingRef.AD.ExternalRating(data.AD[0].borrowerdetails.externalrating)

    if(data.CIBIL.length > 0) {
      loanApproval.ratingRef.Cibil.Rating(data.CIBIL[0].Rating)
    }

    if(data.AD.length > 0)
        _.each(data.AD[0].vendordetails, function(vd){
          var highestAD = loanApproval.paymentTrack.highestAverageDelay;
          highestAD(vd.averagedelaydays > highestAD() ? vd.averagedelaydays : highestAD());
        });
}

var setDataCreditScoreCard = function(data) {
  if(data != null || data != "") {

    loanApproval.ratingRef.OverallScore(data.FinalScore)
    loanApproval.ratingRef.InternalRating(data.FinalRating)

    if(data.Data != undefined &&  data.Data.length > 0) {
      var header = _.filter(data.Data, function(o){
        return o.IsHeader
      })

      var industri = _.find(header,function(x){ return x.Name.toLowerCase().indexOf("industry") > -1});
      var management = _.find(header,function(x){ return x.Name.toLowerCase().indexOf("management") > -1});
      var financial = _.find(header,function(x){ return x.Name.toLowerCase().indexOf("financial") > -1});
      var banking = _.find(header,function(x){ return x.Name.toLowerCase().indexOf("banking") > -1});

      if(header.length > 0) {
        loanApproval.ratingRef.IndustryAndBusiness(industri.Score)
        loanApproval.ratingRef.ManagementPromotorsRisk(management.Score)
        loanApproval.ratingRef.FinancialRisk(financial.Score)
        loanApproval.ratingRef.BankingRisk(banking.Score)
      }
    }
  }
}

