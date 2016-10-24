var r = {};
var mincibilscore = ko.observable()
var above700 = []
var beetween600700 = []
var below600 = []
var redflags = ko.observableArray([])
var totalrealestate = ko.observable()
r.rootdata = ko.observableArray([])
r.rootdates = ko.observableArray([])

r.customerId = ko.observable('')
r.AllData = ko.observable('')
r.AccountDetail = ko.observable('')
r.AllData2 = ko.observable('')
r.AllData3 = ko.observable('')

r.bankingODCC = ko.observable(0)
r.bankingABB = ko.observable(0)
schemeAD = ko.observable('')

r.sAD = function(ad, asd){
  loanapproval.companyname(ad.CustomerName);
  loanapproval.logindate(moment(new Date(asd.logindate)).format("DD/MM/YYYY HH:mm:ss"));
  loanapproval.businessaddress(ad.registeredaddress.AddressRegistered);
  loanapproval.location(asd.cityname);
  loanapproval.product(asd.product);
  schemeAD(asd.scheme);
  loanapproval.leaddistributor(asd.leaddistributor);
  loanapproval.creditanalyst(asd.creditanalyst);
  loanapproval.brhead(asd.brhead);
  loanapproval.rmname(asd.rmname);
}

r.scrollTo = function(param){
  return function () {
    var top = $("#"+ param)[0].offsetTop

    $('.chartscroll').animate({
      scrollTop: top
    })
  }
};

r.showDetails = function(param){
  var top = $("#"+ param).offset().top
  $('body').animate({
    scrollTop: top - 130
  })
};

refreshFilter = function(){
  if (r.getCustomerId() === false) {
      return
  }

  var param = {}
  param.customerid = r.customerId().split('|')[0]
  param.dealno = r.customerId().split('|')[1]
  URLRender()
  r.AllData('')
  r.isLoading(true)
  app.ajaxPost('/loanapproval/getalldata', param, function (res) {
    if (res.Message != '') {
      sweetAlert("Oops...", res.Message, "error");
      r.isLoading(false)
      return
    }
    r.AllData(res)

    r.sAD(
      res.Data.CP[0].applicantdetail,
      res.Data.AD[0].accountsetupdetails
      );

    createKeyParametersandIndicators(res.Data.NORM)
    createMainPromotorDetails(res.Data.AD[0].promotordetails)
    createCibilDetails(r.AllData().Data.CP[0].detailofpromoters.biodata)
    schemeAD(r.AllData().Data.AD[0].accountsetupdetails.scheme);
    r.AccountDetail( r.AllData().Data.AD[0] )
    r.isLoading(false)
    r.getNormData(param)
    r.getCreditScoreCard(param)

    r.setLD(r.AccountDetail())
    apcom.loadCommentData();
    //Cibil Donut
    above700 = []
    below600 = []
    beetween600700 = []
    var promoter = res.Data.CP[0].detailofpromoters.biodata
    mincibilscore ( _.minBy(promoter, 'CIBILScore').CIBILScore)
    for (var i=0 ; i < promoter.length; i++){
        if (promoter[i].CIBILScore > 700){
            above700.push(promoter[i].CIBILScore)
        }else if(promoter[i].CIBILScore < 600){
            below600.push(promoter[i].CIBILScore)
        }else{
            beetween600700.push(promoter[i].CIBILScore)
        }
    }
    createcibildonut();
    //Real Estate
    if (res.Data.AD.length != 0){
        var promoterAD = res.Data.AD[0].promotordetails
        var totalre = 0
        for (var i = 0 ; i < promoterAD.length ; i++){
            for (var j = 0 ; j < promoterAD[i].realestateposition.length ; j++){
                totalre = totalre + promoterAD[i].realestateposition[j]
            }
        }
        totalrealestate(totalre)
    }else{
        swal("Warning", "Red Flags Data Not Found", "warning");
    }
    getBankAsik();
    startme();
    loanapproval.marketref(res.Data.AD[0].borrowerdetails.marketreference);
    createreferencecheckgrid(res.Data.AD[0].borrowerdetails.refrencecheck);

    loanapproval.expansionplan(res.Data.AD[0].borrowerdetails.expansionplans);
    loanapproval.commentfinance(res.Data.AD[0].borrowerdetails.commentsonfinancials);
    if(res.Data.AD[0] != undefined)
      loanApproval.companyBackgroundData(
        new companyBackground(res.Data.AD[0])
      );
  })
    getredflag()
    getreportdata()

    loanApproval.loading(true)
    loanApproval.loading(false)
    promoters = [];
    //resetpromoters();
    //loanApproval.refresh();
    // createreferencecheckgrid(loanapproval.referencecheck());
  loanApproval.ourstandings([]);
        //loanApproval.getReport(getSearchVal());
        due.getCostumerData();
        due.getData();
}

r.getCustomerId = function () {
  var customer = $('.jf-tbl select:eq(0)').data('kendoDropDownList').value()
  var dealNumber = $('.jf-tbl select:eq(1)').data('kendoDropDownList').value()

  if (customer == '') {
      // sweetAlert("Oops...", "Customer cannot be empty", "error");
      return false
  }
  if (dealNumber == '') {
      // sweetAlert("Oops...", "Deal number cannot be empty", "error");
      return false
  }

  r.customerId([customer, dealNumber].join('|'))

  return [customer, dealNumber].join('|')
}

r.getNormData = function (param) {
  app.ajaxPost('/normmaster/getnormdata', param, function (res) {
    if (res.Message != '') {
      sweetAlert("Oops...", res.Message, "error");
      r.isLoading(false)
      return
    }
    r.isLoading(false)

    var persentageAsik = 20
    var data = res.Data.filter(function (d) {
      return (['min', 'max'].indexOf(d.Operator) > -1)
    }).map(function (d) {
        var o = {}
        o.operator = d.Operator
        o.title = d.Criteria
        o.subtitle = d.NormLabel
        o.measures = [d.CalculatedValue.Value] // actual
        o.markers = [d.Value1] // norm
        o.ranges = [
            (d.Value1 - (d.Value1 * persentageAsik / 100)) / 2,
            d.Value1 - (d.Value1 * persentageAsik / 100),
            d.Value1 + (d.Value1 * persentageAsik / 100)
        ]

        return o
    })

      r.AllData2(data)
      renderVerticalBulletChart('.bullet-vertical', data)

      var addClass = function (o, klass) {
        $(o).attr('class', $(o).attr('class') + ' ' + klass)
      }

      data.forEach(function (d, i) {
        var rects = $('.bullet-vertical-wrapper svg:eq(' + i + ') .wrap .range')
        switch (d.operator) {
          case 'min': {
            addClass(rects[0], 'color-high')
            addClass(rects[1], 'color-normal')
            addClass(rects[2], 'color-low')
          } break;
          case 'max': {
            addClass(rects[0], 'color-low')
            addClass(rects[1], 'color-normal')
            addClass(rects[2], 'color-high')
          } break;
        }
      })

        var summary = _.map(_.groupBy(res.Data.map(function (d) {
            switch (d.Operator) {
                case 'min': { return d.CalculatedValue.Value > d.Value1 } break;
                case 'max': { return d.CalculatedValue.Value < d.Value1 } break;
                case 'greater than or equal': { return d.CalculatedValue.Value >= d.Value1 } break;
                case 'lower than or equal': { return d.CalculatedValue.Value <= d.Value1 } break;
                case 'equal': { return d.CalculatedValue.Value == d.Value1 } break;
                case 'between': { return (d.CalculatedValue.Value >= d.Value1) && (d.CalculatedValue.Value <= d.Value2) } break;
            }
        })), function (value, key) {
            var category = (key == 'true') ? 'Met' : 'Not Met'
            return { category: category, value: value.length }
        })

        $('.bulley-summary').kendoChart({
            dataSource: {
                data: summary
            },
            chartArea:{
                background:"transparent",
            },
            seriesDefaults: {
                holeSize: 30,
            },
            legend: {
                position: "bottom"
            },
            series: [{
                type: "donut",
                field: 'value',
                color: function (d) {
                  if (d.category == "Met") {
                    return threecolors[0]
                  } else {
                    return threecolors[2]
                  }
                }
            }],
            categoryAxis: {
                field: 'category'
            },
            tooltip : {
                visible: true,
                template: "#=category # : #=value #"
            }
        });
  })
}

r.getCreditScoreCard = function(param, callback) {
  app.ajaxPost('/creditscorecard/getcscdatav1', param, function (res) {
    if(status == "") {
      r.AllData3(res.Data[0])
    }

    loanApproval.refresh()
  })
}

r.isLoading = function (what) {
  $('.apx-loading')[what ? 'show' : 'hide']()
  $('.app-content')[what ? 'hide' : 'show']()
}

var createcibildonut = function(){
  $('#cibilchart').kendoChart({
      chartArea:{
          background:"transparent",
      },
      legend: {
        position: "right"
      },
        seriesDefaults: {
         holeSize: 45,
     },
      seriesColors : threecolors,
      series: [{
          type: "donut",
          data: [{
              category: "Above 700",
              value: above700.length,
              // color: "#42f47d"
          }, {
              category: "600 - 700",
              value: beetween600700.length,
              // color: "#f4f442"
          }, {
              category: "Below 600",
              value: below600.length,
              // color: "#f44b42"
          }]
      }],
      tooltip : {
            visible: true,
            template: "#=category # : #=value #"
        }
  });
}

var getBankAsik = function () {
  r.bankingABB(0)
  r.bankingODCC(0)

    var customerId = filter().CustomerSearchVal();
  var dealNo = filter().DealNumberSearchVal();
  var param = {
    CustomerId : parseInt(customerId, 10),
    DealNo : dealNo
  }

  ajaxPost("/bankanalysis/getdatabankv2", param, function (res) {
    if (res.message != "") {
     swal("Warning", "Bank Analysis Data Not Found", "warning");
     return
    }

     var amls = [];
    var odccs = [];
    var maxodcc = 0.0;
    var details = res.data.Detail;
    createBankingandOsSnapshot(res.data.Summary);

    _.each(details, function(detail){
        _.each(detail.DataBank[0].BankDetails, function(bankDetail){
            if(bankDetail.OdCcLimit > 0.01){
                odccs.push(bankDetail.AvgBalon / bankDetail.OdCcLimit);
            } else {
                odccs.push(0);
            }
        });
    });

    _.each(details, function(detail){
        var aml = {};
        var eachDataBank = detail.DataBank[0];

        aml.Bank        = eachDataBank.BankAccount.BankName;
        aml.SancLimit   = eachDataBank.BankAccount.FundBased.SancLimit;

        aml.OdCcUtilization = 0;
        aml.InterestPerMonth = 0;
        aml.abb = 0;
        aml.util = 0;

        // var utilarr = _.map(eachDataBank.BankDetails, function (bd) {
        //         return toolkit.number(bd.AvgBalon / bd. OdCcLimit);
        //     });
        // aml.util =  _.reduce(utilarr, function(memo, num){ return memo + num; }, 0)/ _.filter(utilarr, function(x){ return x > 0; }).length ;
        // aml.util = isFinite(aml.util) ? aml.util : 0;

        if (eachDataBank.BankAccount.FundBased.AccountType.toLowerCase().indexOf('od') > -1) {

            aml.OdCcUtilization = _.max(_.map(eachDataBank.BankDetails, function (bd) {
                return toolkit.number(bd.AvgBalon / bd. OdCcLimit);
            }))

            var interestPerMonth    = eachDataBank.BankAccount.FundBased.InterestPerMonth;
            var actualInterestPaids = _.map(eachDataBank.BankDetails, function(bd) {
                return bd.ActualInterestPaid;
            })

            var actualInterestPaidValue = toolkit.number(_.sum(actualInterestPaids) / actualInterestPaids.length)
            aml.InterestPerMonth = _.max([interestPerMonth, actualInterestPaidValue])
        }else{
            aml.abb = _.reduce(eachDataBank.BankDetails, function(memo, num){ return memo + num.AvgBalon; }, 0)/_.filter(eachDataBank.BankDetails, function(x){ return x.AvgBalon > 0; }).length ;
        }

        amls.push(aml);
    });

    var abbavg = _.reduce(amls, function(memo, num){ return memo + num.abb; }, 0) /  _.filter(amls, function(x){ return x.abb > 0; }).length ;
    var odccavg = _.reduce(amls, function(memo, num){ return memo + num.SancLimit; }, 0) ;

    r.bankingABB(abbavg)
    r.bankingODCC(odccavg)
    r.generateAML(res.data)
  })
}

r.generateAML = function(data){
  var detail = data.Detail;
  var res = [];
  _.each(detail,function(e,i){
      var db = e.DataBank[0].BankDetails;
      _.each(db,function(ex,ix){
          var dt = _.find(res,function(x){ return x.Month == ex.Month ;});
          if(dt==undefined){
              res.push({ Month : ex.Month , CreditCash : ex.CreditCash, DebitCash : ex.DebitCash});
          }else{
              dt.CreditCash += ex.CreditCash;
              dt.DebitCash += ex.DebitCash;
          }
      })
  });

  summaryRes = []
  for(var i in data.Summary){
    summaryRes.push({Month: moment(data.Summary[i]["Month"].split("T")[0]).format("MMM-YY"), TotalCredit: data.Summary[i]["TotalCredit"], TotalDebit: data.Summary[i]["TotalDebit"]})
  }

  _.each(res,function(e,i){
      e.Month = moment(e.Month.split("T")[0]).format("MMM-YY");
      var dt = _.find(summaryRes,function(x){ return x.Month == e.Month ;});
      e.CreditCash = parseInt(e.CreditCash / dt.TotalCredit*100);
      e.CreditCash = isFinite(e.CreditCash) ? e.CreditCash : 0;
      e.DebitCash = parseInt(e.DebitCash / dt.TotalDebit*100);
      e.DebitCash = isFinite(e.DebitCash) ? e.DebitCash : 0;
  });

  r.CreateChartAMLAsik(res);
}

r.CreateChartAMLAsik = function(data) {
  category = []
  data1 = [
    {
      name: "CreditCash",
      data: []
    },
    {
      name: "DebitCash",
      data: []
    },
  ]
  _.map(data, function(k, v){

    category.push(k.Month)
    data1[0].data.push(k.CreditCash)
    data1[1].data.push(k.DebitCash)
  })

  category.reverse();
  data1[0].data.reverse();
  data1[1].data.reverse();

  $("#amlChart").kendoChart({
                // title: {
                //     text: "test"
                // },
                  chartArea: {
                  height: 150,
                  background:"transparent"
                },
                legend: {
                    position: "bottom"
                },
                seriesDefaults: {
                    type: "column"
                },
                series: data1,
                seriesColors : ecisColors,
                valueAxis: {
                    labels: {
                        format: "{0}%",
                        skip:2,
                        step:2
                    },
                    line: {
                        visible: false
                    },
                    axisCrossingValue: 0,
                },
                categoryAxis: {
                    categories: category,
                    line: {
                        visible: false
                    },
                    labels : {
                        // rotation : { angle : 35 }
                    }
                },
                tooltip: {
                    visible: true,
                    format: "{0}%",
                    template: "#= series.name #: #= value #%"
                }
            });
}

var getredflag = function(){
    var customerId = filter().CustomerSearchVal();
	var dealNo = filter().DealNumberSearchVal();
	var param = {
		CustomerId : customerId,
		DealNo : dealNo
	}

	ajaxPost("/duediligence/getduediligenceinputdata", param, function(res){
        if (res.Data.length != 0){
            var data = res.Data[0];
            redflags(data.Background)
            createRedFlags();
        }else{
             swal("Warning", "Red Flags Data Not Found", "warning");
            return
        }
    });
}

var hovername = function(){
    return function(){
        try{
          $(".redflag").tooltipster('destroy');
        }catch(e){

        }

        $(".redflag").tooltipster({
              trigger: 'hover',
                theme: 'tooltipster-val',
                animation: 'grow',
                delay: 0,
                position:"top",
                interactive: true,
        })
        $(".redflag").tooltipster('show');
    }
}

var getreportdata = function(){
  var customerId = filter().CustomerSearchVal();
  var dealNo = filter().DealNumberSearchVal();
  var param = {
    CustomerId : customerId,
    DealNo : dealNo,
    ForModule : "ratio report"
  }

  ajaxPost("/ratio/getreportdata", param, function(res){
        r.rootdata([])
        r.rootdates([])
        if (res.Data.AuditStatus.length != 0){
            r.rootdata(res.Data.FormData)
            r.rootdates(_.orderBy(res.Data.AuditStatus, 'Date', 'asc'))
            r.ConstructDataRatioPDF( r.rootdata(), r.rootdates() )
            left.loadRatioData()
            left.panelVisible(true)
        }else{
             swal("Warning", "Report Data Not Found", "warning");
            return
        }
    });

}

var threecolors = ["#2E933C","#F0A202","#b71d1d"];

var setHeight = function() {
  // if(screen.height > 670)
    var colHeight = $(window).height() - 131 - $("#submenu-top li").height();
    $(".divided-col.col-full").css("height", colHeight + "px" )
    $(".col-full").css("min-height", colHeight + "px" )
    $(".divided-col.col-full .content-container").css("max-height", (colHeight - 33) + "px" )
}

$( document ).ready(function(){
  setHeight()
})

$(window).resize(function() {
  setHeight()
});

r.KFI = ko.observableArray([
   {
      Section : ko.observable('PROFIT & LOSS ACCOUNT'),
      SectionAlias: ko.observable('PROFIT & LOSS A/C EXTRACT'),
      ColumnHeader: ko.observableArray([]),
      Data : [
         {
            Id : ko.observable('TO'),
            subsection: "",
            alias : ko.observable('Turnover'),
            ratio : ko.observable('Turnover'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('COGS'),
            subsection: "",
            alias : ko.observable('Cost of Sales'),
            ratio : ko.observable('Cost of Good Sold (COGS)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('GPROF'),
            subsection: "",
            alias : ko.observable('Gross Profits'),
            ratio : ko.observable('GROSS  PROFIT (as per books)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('SALADMINEXP'),
            subsection: "",
            alias : ko.observable('Salary & Admin Exp.'),
            ratio : ko.observable('Salary & Admin Exp.'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('EBITDA'),
            subsection: "",
            alias : ko.observable('EBITDA'),
            ratio : ko.observable('EBITDA'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('IFIB'),
            subsection: "",
            alias : ko.observable('Interest to FI and Banks'),
            ratio : ko.observable('Interest to FI/Banks'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('DEPR'),
            subsection: "",
            alias : ko.observable('Depreciation'),
            ratio : ko.observable('Depreciation'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('PBTNBI'),
            subsection: "",
            alias : ko.observable('Profit Before Tax'),
            ratio : ko.observable('PROFIT BEFORE TAX (Excl Non Business Inc)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('TAX'),
            subsection: "",
            alias : ko.observable('Income Tax'),
            ratio : ko.observable('Tax'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('PAT'),
            subsection: "",
            alias : ko.observable('Profit After Tax'),
            ratio : ko.observable('PAT'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('ACTCASHP'),
            subsection: "",
            alias : ko.observable('Cash Profit'),
            ratio : ko.observable('Actual Cash Profit Including Salary & Interest (Excl Non Business Income)'),
            row : ko.observableArray([])
         }
      ],
      row : ko.observableArray([])
   },
   {
      Section : ko.observable('BALANCE SHEET'),
      SectionAlias: ko.observable('BALANCE SHEET EXTRACT'),
      ColumnHeader: ko.observableArray([]),
      Data : [
         {
            Id : ko.observable('RECEIV'),
            subsection: "Assets",
            alias : ko.observable('Debtors (closing)'),
            ratio : ko.observable('Receivables / Debtors'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('INV'),
            subsection: "Assets",
            alias : ko.observable('Closing Stock'),
            ratio : ko.observable('Inventories'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('SCRE'),
            subsection: "Assets",
            alias : ko.observable('Less Creditors (closing)'),
            ratio : ko.observable('Sundry Creditors'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('WCASSETS'),
            subsection: "Assets",
            alias : ko.observable('Working Capital Assets'),
            ratio : ko.observable('Working Capital Assets'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('NETFIXASSETSLESSREVRES'),
            subsection: "Assets",
            alias : ko.observable('Fixed Assets'),
            ratio : ko.observable('Net Fixed Assets (Less Reval. Reserve)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('NETFIXEDASSE'),
            subsection: "Assets",
            alias : ko.observable('Fixed Assets'),
            ratio : ko.observable('Net Fixed Assets (Gross Fixed Assets - Accum. Dep)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('CNB'),
            subsection: "Assets",
            alias : ko.observable('Cash & Bank Balance'),
            ratio : ko.observable('Cash & Bank Balance'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('LOANSADVOCA'),
            subsection: "Assets",
            alias : ko.observable('Loans, Adv. & Other Current Assets'),
            ratio : ko.observable('Loans, Adv. & Other Current Assets'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('TOTASSETS2'),
            subsection: "Assets",
            alias : ko.observable('TOTAL ASSETS II'),
            ratio : ko.observable('Adjusted Total Assets'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('SCA'),
            subsection: "Liabilities",
            alias : ko.observable('Share Capital'),
            ratio : ko.observable('Share Capital'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('RESUR'),
            subsection: "Liabilities",
            alias : ko.observable('Reserves & Surplus'),
            ratio : ko.observable('Reserves & Surplus(excluding revaluation reserve)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('ULPAR'),
            subsection: "Liabilities",
            alias : ko.observable('Loan from Promoters/family'),
            ratio : ko.observable('Unsecured loans from partners/shareholders (ICDs incl.)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('TNW'),
            subsection: "Liabilities",
            alias : ko.observable('NET WORTH'),
            ratio : ko.observable('Total Net worth'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('ADJUSTEDNW'),
            subsection: "Liabilities",
            alias : ko.observable('ADJUSTED NET WORTH II'),
            ratio : ko.observable('Adjusted Net Worth II'),
            row : ko.observableArray([])
         },
         {
             Id : ko.observable('WCAP'),
            subsection: "Liabilities",
            alias : ko.observable('Working Capital Limits from Banks/FI\'s (OD / CC)'),
            ratio : ko.observable('Working Capital Limits from Banks/FI\'s (OD / CC)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('LOANSFROMB&Fls'),
            subsection: "Liabilities",
            alias : ko.observable('Loan from Bank & FI\'s'),
            ratio : ko.observable('Loan from Bank & FI\'s'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('TOTOBW'),
            subsection: "Liabilities",
            alias : ko.observable('Total Outside Debts'),
            ratio : ko.observable('TOTAL Outside borrowings (B)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('OLI'),
            subsection: "Liabilities",
            alias : ko.observable('Other Liabilities'),
            ratio : ko.observable('Other Liabilities'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('TOTLIAB2'),
            subsection: "Liabilities",
            alias : ko.observable('TOTAL LIABILITIES II'),
            ratio : ko.observable('Adjusted Total Liabilities'),
            row : ko.observableArray([])
         }
      ],
      row : ko.observableArray([])
   }
])

r.FR = ko.observableArray([
   {
      Section : ko.observable('Name'),
      SectionAlias: ko.observable('Name'),
      ColumnHeader: ko.observableArray([]),
      Data : [
      ],
      row : ko.observableArray([])
   },
   {
      Section : ko.observable('RATIO'),
      SectionAlias: ko.observable(toTitleCase('PROFITABILITY RATIO')),
      ColumnHeader: ko.observableArray([]),
      Data : [
         {
            Id : ko.observable('GPMARGIN'),
            subsection: '',
            alias : ko.observable('Gross Profit Margin %'),
            ratio : ko.observable('Gross Profit Margin %'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('EBITDAMARGIN'),
            subsection: '',
            alias : ko.observable('EBITDA Margin %'),
            ratio : ko.observable('EBITDA Margin %'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('PBTMARGIN'),
            subsection: '',
            alias : ko.observable('PBT Margin %'),
            ratio : ko.observable('PBT Margin %'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('PATMARGIN'),
            subsection: '',
            alias : ko.observable('PAT margin %'),
            ratio : ko.observable('PAT margin %'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('ROCE'),
            subsection: '',
            alias : ko.observable('ROCE %'),
            ratio : ko.observable('ROCE %'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('CASHPROFIT'),
            subsection: '',
            alias : ko.observable('Cash Profit Ratio %'),
            ratio : ko.observable('Cash Profit Ratio %'),
            row : ko.observableArray([])
         }
      ],
      row : ko.observableArray([])
   },
   {
      Section : ko.observable('LEVERAGE RATIO'),
      SectionAlias : ko.observable(toTitleCase('LEVERAGE RATIO')),
      ColumnHeader: ko.observableArray([]),
      Data : [
         {
            Id : ko.observable('DERATIO'),
            subsection: '',
            alias : ko.observable('Debt / Equity (D/E) (Adj. NW)'),
            ratio : ko.observable('Debt to Equity'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('NETDERATIO'),
            subsection: '',
            alias : ko.observable('Net Debt / Equity (Adj. NW)'),
            ratio : ko.observable('Net Debt to Equity'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('LEVERAGEINCLX10'),
            subsection: '',
            alias : ko.observable('TOL / TNW (Adj. NW)'),
            ratio : ko.observable('TOL/TNW'),
            row : ko.observableArray([])
         }
      ],
      row : ko.observableArray([])
   },
   {
      Section : ko.observable('COVERAGE RATIO'),
      SectionAlias : ko.observable(toTitleCase('COVERAGE RATIO')),
      ColumnHeader: ko.observableArray([]),
      Data : [
         {
            Id : ko.observable('ISCRWITHX10'),
            subsection: '',
            alias : ko.observable('ISCR'),
            ratio : ko.observable('Interest Coverage Ratio'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('DSCR'),
            subsection: '',
            alias : ko.observable('DSCR'),
            ratio : ko.observable('DSCR'),
            row : ko.observableArray([])
         }
      ],
      row : ko.observableArray([])
   },
   {
      Section : ko.observable('LIQUIDITY RATIO'),
      SectionAlias : ko.observable(toTitleCase('LIQUIDITY RATIO')),
      ColumnHeader: ko.observableArray([]),
      Data : [
         {
            Id : ko.observable('CURATIO'),
            subsection: '',
            alias : ko.observable('Current Ratio'),
            ratio : ko.observable('Current Ratio'),
            row : ko.observableArray([])
         }
      ],
      row : ko.observableArray([])
   },
   {
      Section : ko.observable('OPERATING RATIO'),
      SectionAlias : ko.observable(toTitleCase('OPERATING RATIO')),
      ColumnHeader: ko.observableArray([]),
      Data : [
         {
            Id : ko.observable('WORKACI'),
            subsection: '',
            alias : ko.observable('Debtor Days'),
            ratio : ko.observable('Working Capital Cycle :- Debtor Days'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('CREDAY'),
            subsection: '',
            alias : ko.observable('Creditor Days'),
            ratio : ko.observable('Creditor Days'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('STOCKDAY'),
            subsection: '',
            alias : ko.observable('Stock Days'),
            ratio : ko.observable('Stock Days'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('NETWORCAP'),
            subsection: '',
            alias : ko.observable('Working Capital Cycle'),
            ratio : ko.observable('Net Working Capital Cycle'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('WCREQ'),
            subsection: '',
            alias : ko.observable('W C Requirement ( Lacs)'),
            ratio : ko.observable('W C Requirement ( Lacs)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('WCGAPMPBF'),
            subsection: '',
            alias : ko.observable('W C Gap ( Lacs) (MPBF Method)'),
            ratio : ko.observable('W C Gap ( Lacs) (MPBF Method)'),
            row : ko.observableArray([])
         },
         // {
         //    Id : ko.observable('LEVERAGEINCLX10'),
         //    subsection: '',
         //    alias : ko.observable('Leverage Including X10 (TOL/TNW)'),
         //    ratio : ko.observable('Leverage Including X10 (TOL/TNW)'),
         //    row : ko.observableArray([])
         // },
         // {
         //    Id : ko.observable('GEARING'),
         //    subsection: '',
         //    alias : ko.observable('Gearing (times) including X10 Loan'),
         //    ratio : ko.observable('Gearing (times) including X10 Loan'),
         //    row : ko.observableArray([])
         // },
         // {
         //    Id : ko.observable('ISCRWITHX10'),
         //    subsection: '',
         //    alias : ko.observable('Int.Coverage Ratio (ISCR) with X10 Loan'),
         //    ratio : ko.observable('Interest Coverage Ratio (Incl. X10 Int.)'),
         //    row : ko.observableArray([])
         // },
         // {
         //    Id : ko.observable('BTO'),
         //    subsection: '',
         //    alias : ko.observable('BTO% against FY 14 TO'),
         //    ratio : ko.observable('BTO% against FY 14 TO'),
         //    row : ko.observableArray([])
         // },
      ],
      row : ko.observableArray([])
   },
   {
      Section : ko.observable('KEY RATIOS'),
      SectionAlias : ko.observable(toTitleCase('KEY RATIOS')),
      ColumnHeader: ko.observableArray([]),
      Data : [
         {
            Id : ko.observable('LEVERAGEINCLX10'),
            subsection: '',
            alias : ko.observable('Leverage Including X10 (TOL/TNW)'),
            ratio : ko.observable('Leverage Including X10 (TOL/TNW)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('GEARING'),
            subsection: '',
            alias : ko.observable('Gearing (times) including X10 Loan'),
            ratio : ko.observable('Gearing (times) including X10 Loan'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('ISCRWITHX10'),
            subsection: '',
            alias : ko.observable('Int.Coverage Ratio (ISCR) with X10 Loan'),
            ratio : ko.observable('Interest Coverage Ratio (Incl. X10 Int.)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('DSCRPL'),
            subsection: '',
            alias : ko.observable('Post B/S DSCR Incl. X10 Loan'),
            ratio : ko.observable('Post B/S DSCR Including X10'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('SURPDEFLONGTERM'),
            subsection: '',
            alias : ko.observable('Surplus/Deficit in Long term Sources vr. Appli.'),
            ratio : ko.observable('Surplus/Deficit in Long term Sources vr. Appli.'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('BTO'),
            subsection: '',
            alias : ko.observable('BTO% against FY 14 TO'),
            ratio : ko.observable('BTO% against FY 14 TO'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable(''),
            subsection: '',
            alias : ko.observable('Margin Taken'),
            ratio : ko.observable('Margin Taken'),
            row : ko.observableArray([])
         }
      ],
      row : ko.observableArray([])
   },
])

r.KI = ko.observableArray([
   {
      Section : ko.observable('Name'),
      SectionAlias: ko.observable('Name'),
      ColumnHeader: ko.observableArray([]),
      Data : [
         {
            Id : ko.observable('TO'),
            subsection: "",
            alias : ko.observable('Turnover'),
            ratio : ko.observable('Turnover'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('EBITDA'),
            subsection: "",
            alias : ko.observable('EBITDA'),
            ratio : ko.observable('EBITDA'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('PAT'),
            subsection: "",
            alias : ko.observable('PAT'),
            ratio : ko.observable('Profit After Tax'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('GPMARGIN'),
            subsection: '',
            alias : ko.observable('Gross Profit Margin %'),
            ratio : ko.observable('Gross Profit Margin %'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('EBITDAMARGIN'),
            subsection: '',
            alias : ko.observable('EBITDA Margin %'),
            ratio : ko.observable('EBITDA Margin %'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('WORKINGCAPITALASSETS'),
            subsection: '',
            alias : ko.observable('NWC'),
            ratio : ko.observable('Working Capital Assets'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('NETWORCAP'),
            subsection: '',
            alias : ko.observable('WC Days'),
            ratio : ko.observable('Working Capital Cycle'),
            row : ko.observableArray([])
         },
         {
             Id : ko.observable('WCAP'),
            subsection: "",
            alias : ko.observable('WC Fund from Bank WC Loan'),
            ratio : ko.observable('Working Capital Limits from Banks/FI\'s (OD / CC)'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('NWLESSFA'),
            subsection: "",
            alias : ko.observable('Net Worth less Fixed assets'),
            ratio : ko.observable('Net Worth less Fixed assets'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('WCGAP'),
            subsection: "",
            alias : ko.observable('WC GAP'),
            ratio : ko.observable('WC Gap'),
            row : ko.observableArray([])
         },
         {
            Id : ko.observable('WCGAPMPBF'),
            subsection: "",
            alias : ko.observable('WC GAP (MPBF Method)'),
            ratio : ko.observable('W C Gap ( Lacs) (MPBF Method)'),
            row : ko.observableArray([])
         },
      ],
      row : ko.observableArray([])
   }
])

r.ConstructDataRatioPDF = function(res,ress){
  _.map(r.KFI(), function(v, i){
    r.KFI()[i].ColumnHeader([])
    r.KFI()[i].row([])

    //create header
    r.KFI()[i].ColumnHeader.push(v.SectionAlias())
    _.each(ress, function(column){
       if(column.Status == "PROVISION") {
          // r.KFI()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Prov.)")
       }else if (column.Status == "ESTIMATED"){
          // r.KFI()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Estimated)")
       } else if(column.Status == "AUDITED"){
          r.KFI()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Audited)")
       }
    })
    //end create header

    var dataSection = _.groupBy(v.Data, 'subsection');

    _.map(dataSection, function(v1, i1){
       //create row
       //
       if(i1 != "") {
          r.KFI()[i].row.push({"rowData" : [i1]})
       }

       _.map(v1, function(v2, i2){
          var row = _.find(res, {'FieldAlias':v2.Id()})
          var rowData = []
          if(row == undefined) {
             rowData.push(v2.alias())
          } else if(row != undefined) {
             v2.alias(row.FieldName)
             rowData.push(v2.alias())

             _.each(ress, function(column) {
              if(column.Status == "AUDITED"){
                var rowSelected = row.Values.find(function(g){return g.Date == column.Date})
                if(rowSelected!=undefined) {
                   if(typeof rowSelected.Value === "number") {
                      if(row.ValueType == "percentage"){
                         rowData.push(kendo.toString(rowSelected.Value, "P2"))
                      } else {
                         rowData.push(rowSelected.Value.toFixed(2))
                      }
                   } else {
                      rowData.push(rowSelected.Value)
                   }
                } else {
                   rowData.push("")
                }
              }
             })

             r.KFI()[i].row.push({"rowData" : rowData})
          }
       })

       //end create row
    })
  })

  _.map(r.FR(), function(v, i){
    r.FR()[i].ColumnHeader([])
    r.FR()[i].row([])
    //create header
    if(i == 0) {
       r.FR()[i].ColumnHeader.push("Name")
       _.each(ress, function(column){
          if(column.Status == "PROVISION") {
             // r.FR()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Prov.)")
          } else if(column.Status == "ESTIMATED") {
             // r.FR()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Estimated)")
          }
          else if(column.Status == "AUDITED"){
             r.FR()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Audited)")
          }
       })
    } else {
       r.FR()[i].ColumnHeader.push(v.SectionAlias())
    }

    //end create header
    //
    var dataSection = _.groupBy(v.Data, 'subsection');
    _.map(dataSection, function(v1, i1){
       //create row
       //
       if(i1 != "") {
          r.FR()[i].row.push({"rowData" : [i1]})
       }

       _.map(v1, function(v2, i2){
          var row = _.find(res, {'FieldAlias':v2.Id()})
          var rowData = []

          if(row == undefined) {
             rowData.push(v2.alias())
          }else if(row != undefined) {
            // v2.alias(row.FieldName)
            rowData.push(v2.alias())
            _.each(ress, function(column) {
              if(column.Status == "AUDITED"){
                var rowSelected = row.Values.find(function(g){return g.Date == column.Date})
                if(rowSelected!=undefined) {
                   if(typeof rowSelected.Value === "number") {
                      if(row.ValueType == "percentage"){
                         rowData.push(kendo.toString(rowSelected.Value, "P2"))
                      } else {
                         rowData.push(rowSelected.Value.toFixed(2))
                      }
                   } else {
                      rowData.push(rowSelected.Value)
                   }
                } else {
                   rowData.push("")
                }
              }
            })

            r.FR()[i].row.push({"rowData" : rowData})
          }
       })

       //end create row
    })
  })

  _.map(r.KI(), function(v, i){
    r.KI()[i].ColumnHeader([])
    r.KI()[i].row([])
    //create header
    r.KI()[i].ColumnHeader.push(v.SectionAlias())
    _.each(res, function(column){
       if(column.Status == "PROVISION") {
          r.KI()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Prov.)")
       } else if(column.Status == "ESTIMATED") {
          r.KI()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Estimated)")
       }
       else {
          r.KI()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Audited)")
       }
    })
    //end create header
    //
    var dataSection = _.groupBy(v.Data, 'subsection');

    _.map(dataSection, function(v1, i1){
       //create row
       //
       if(i1 != "") {
          r.KI()[i].row.push({"rowData" : [i1]})
       }

       _.map(v1, function(v2, i2){
          var row = _.find(res, {'FieldAlias':v2.Id()})
          var rowData = []

          if(row == undefined) {
             rowData.push(v2.alias())
          } else if(row != undefined) {
             v2.alias(row.FieldName)
             rowData.push(v2.alias())
             _.each(res, function(column) {
                var rowSelected = row.Values.find(function(g){return g.Date == column.Date})
                if(rowSelected!=undefined) {
                   if(typeof rowSelected.Value === "number") {
                      if(row.ValueType == "percentage"){
                         rowData.push(kendo.toString(rowSelected.Value, "P2"))
                      } else {
                         rowData.push(rowSelected.Value.toFixed(2))
                      }
                   } else {
                      rowData.push(rowSelected.Value)
                   }
                } else {
                   rowData.push("")
                }
             })

             r.KI()[i].row.push({"rowData" : rowData})
          }
       })

       //end create row
    })
  })

  r.constructDataKeyFinancialRatios( res,ress )
  createKeyFinancialRatios()
  createKeyFinancialParameters()
}

$(function () {
  var space = 100 / $('.left-scroller a').length
  $('.left-scroller a').each(function (i, e) {
    $(e).css('top', (i * space) + '%')
    $(e).tooltipster({
      theme: 'tooltipster-left-scroller',
      animation: 'grow',
      delay: 0,
      touchDevices: false,
      trigger: 'hover',
      position: 'right'
    })
  })
})