model.Processing = ko.observable(true)

var ratioPdf = {}; var r = ratioPdf;

//all field
//
//ko observable
r.customerId = ko.observable('')
r.isEmptyRatioInputData = ko.observable(true)
r.columnLength = ko.observable(0)
r.customerName = ko.observable("")
r.currentTab = ko.observable("")

r.AOMData = {
   ColumnHeader : ko.observableArray([]),
   Row : ko.observableArray([])
}

r.AAData = {
   ColumnHeader : ko.observableArray([]),
   Row : ko.observableArray([])
}

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
            ratio : ko.observable('Total Outside Borrowings (B)'),
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
            Id : ko.observable('TOLTNW'),
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
            Id : ko.observable('INCR'),
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
//ko observable array
r.data = ko.observableArray([])
r.dates = ko.observableArray([])
r.dataResult = ko.observableArray([])
r.columnList = ko.observableArray([])
r.masterBalanceSheetInput =  ko.observableArray([]);

r.isLoading = function (what) {
    $('.apx-loading')[what ? 'show' : 'hide']()
    $('.app-content')[what ? 'hide' : 'show']()
    if(!what){
        setTimeout(function(){
            //r.addScrollBottom();
        },1000);
    }
}

r.exportPDF = function() {
   $(".hiddenrow").show()

   kendo.drawing.drawDOM($(".print")).then(function(group){
      kendo.drawing.pdf.saveAs(group, r.customerName() + ".pdf");
   });

   $(".hiddenrow").hide()
}

r.refresh = function () {
    if (r.getCustomerId() === false) {
        return
    }

   r.customerName(filter().CustomerSearchText())

   r.data([])
   r.dates([])

   var param = {}
   param.CustomerId = r.customerId().split('|')[0]
   param.DealNo = r.customerId().split('|')[1]

   r.isLoading(true)

   var getRatioData = function(callback){
      app.ajaxPost('/ratio/getreportdata', param, function (res) {
         if (res.Message != '') {
            sweetAlert("Oops...", res.Message, "error");
            r.isLoading(false)
            return
         }

         if(res.Data.AuditStatus.length > 0) {
            r.data(res.Data.FormData)
            columns = res.Data.AuditStatus
            columns = _.filter(columns, function(o){
               return (o.Status == "PROVISION" || o.Status == "AUDITED" || o.Status == "ESTIMATED")
            })

            console.log(columns)

            r.dates(_.orderBy(columns, ['Status','Date'], ['desc','desc']))

            findEstimated = _.find(r.dates(), function(o) {
               return o.Status == "ESTIMATED"
            })

            r.dates.remove(findEstimated)
            r.dates.unshift(findEstimated)

            r.isLoading(false)
            r.render()

            var tab = r.parse()
            r.checkTabs(tab)
         } else {
            sweetAlert("Oops...", "Data Not Found", "error");
            r.isLoading(false)
            return
         }
      })
   }

   getRatioData();
   r.getStockAndDebt();
}

r.getStockAndDebt = function(){
   var customerId = filter().CustomerSearchVal() + "|" + filter().DealNumberSearchVal();
   var param = {CustomerId: filter().CustomerSearchVal(), Dealno: filter().DealNumberSearchVal()}
   app.ajaxPost('/datacapturing/getstockanddebtdetailconfirmed', param, function (res) {
      r.PrepareDataRatioReport(param, res, customerId);
   })
}

r.dataratioreport = ko.observableArray([])
r.datesratioreport = ko.observableArray([])
r.Turnover = ko.observable(0)
r.COG = ko.observable(0)
r.stockanddebt = ko.observable({Id: '', CustomerId : '',Flag : 0,AOM : [],AA : []})
r.AOM = ko.observableArray([]);
r.AA = ko.observableArray([]);
r.Mode = ko.observable(0);

r.PrepareDataRatioReport = function(param, data, customerId){
   r.dataratioreport([])
   r.datesratioreport([])
   app.ajaxPost('/ratio/getreportdata', param, function (res) {
     r.Turnover(0);
     r.COG(0);

     if (res.Message != '') {
       repairtable()

       return
     }

     r.dataratioreport(res.Data.FormData)
     r.datesratioreport(_.orderBy(res.Data.AuditStatus, 'Date', 'desc'))

     if(res.Data.AuditStatus.length > 0){
        $.each(r.constructDataDebt(r.dataratioreport()),function(i,v){

         if(v.Name == "Turnover"){
           // if(v.ColumnData[ 1 ].Value != 0){
           //   Turnover(v.ColumnData[ 1 ].Value);
           // } else if(v.ColumnData[ 2 ].Value != 0){
           //   Turnover(v.ColumnData[ 2 ].Value);
           // } else if(v.ColumnData[ datesratioreport().length - _.filter(datesratioreport(), function(name){return name.Status == "AUDITED" }).length ].Value != 0){
           //   Turnover(v.ColumnData[ datesratioreport().length - _.filter(datesratioreport(), function(name){return name.Status == "AUDITED" }).length ].Value);
           // }
           var max = r.datesratioreport().length - _.filter(r.datesratioreport(), function(name){return name.Status == "AUDITED" }).length;
           $.each(v.ColumnData, function(ii,vv){
             if(ii > 0 && ii <= max && vv.Value != 0){
               r.Turnover(vv.Value);
               return false
             }
           })
         }

         if(v.Name == "Cost of Goods Sold (COGS)"){
           // if(v.ColumnData[ 1 ].Value != 0){
           //   COG(v.ColumnData[ 1 ].Value);
           // } else if(v.ColumnData[ 2 ].Value != 0){
           //   COG(v.ColumnData[ 2 ].Value);
           // } else if(v.ColumnData[ datesratioreport().length - _.filter(datesratioreport(), function(name){return name.Status == "AUDITED" }).length ].Value != 0){
           //   COG(v.ColumnData[ datesratioreport().length - _.filter(datesratioreport(), function(name){return name.Status == "AUDITED" }).length ].Value);
           // }
           var max = r.datesratioreport().length - _.filter(r.datesratioreport(), function(name){return name.Status == "AUDITED" }).length;
           $.each(v.ColumnData, function(ii,vv){
             if(ii > 0 && ii <= max && vv.Value != 0){
               r.COG(vv.Value);
               return false
             }
           })
         }

       })
     }

     r.repairtable(data, customerId)

   })
}

r.constructDataDebt = function(res) {
      var flat = []

      var opSection1 = _.groupBy(res, 'SectionName');
      var opSection2 = _.map(opSection1, function (v, k) {
        return { key: k, data: v, order: _.minBy(v, 'FieldOrder').FieldOrder };
      });
      var opSection3 = _.orderBy(opSection2, 'order');
      var i = 1, j = 1;
      opSection3.forEach(function (section) {
        var sectionId = 'section-' + i;
        flat.push({
          id: sectionId,
          parentId: null,
          Order: _.minBy(section.data, 'FieldOrder').FieldOrder,
          Name: section.key,
          Type: 'Section'
        });
        i++;

        var opSubSection1 = _.groupBy(section.data, 'SubSectionName');
        var opSubSection2 = _.map(opSubSection1, function (v, k) {
          return { key: k, data: v, order: _.minBy(v, 'FieldOrder').FieldOrder };
        });
        var opSubSection3 = _.orderBy(opSubSection2, 'order')
        opSubSection3.forEach(function (subSection) {
          var subSectionId = sectionId

          if (subSection.key != '') {
            subSectionId = 'sub-section-' + j;
            flat.push({
              id: subSectionId,
              parentId: sectionId,
              Order: _.minBy(subSection.data, 'FieldOrder').FieldOrder,
              ParentName: section.key,
              Name: subSection.key,
              Type: 'Sub Section'
            });
          }
          j++

          _.orderBy(subSection.data, 'FieldOrder').forEach(function (field) {
            var isFromFormula = (field.Type === 'Formula')
            var values = _.orderBy(field.Values, 'Date', 'desc')
            values = values.map(function (d, i) {
              d.Growth = 0

              if (i < (values.length - 1)) {
                var previousYearValue = values[i + 1].Value
                var currentYearValue = d.Value

                d.Growth = toolkit.number((currentYearValue - previousYearValue) / previousYearValue * 100)
              }

              return d
            })

            flat.push({
              id: field.Id,
              parentId: subSectionId,
              Order: field.FieldOrder,
              Name: field.FieldName,
              Section: section.key,
              SubSection: subSection.key,
              Type: 'Field',
              ColumnData: values,
              IsFromFormula: isFromFormula,
            });
          });
        });
      });

      return flat;
    }

r.repairtable = function(data, customerId){
      if (data != undefined && data.length > 0){
        $.each(data[0].AOM,function(i,v){

          var ReceivablesDays = 0;
          var InventoryDays = 0;
          var LessPayablesDays = 0;
          var WCDays = 0;

          if(r.Turnover() > 0){
            ReceivablesDays = ( v.ReceivablesAmount / r.Turnover() ) * 365;
            InventoryDays = ( v.InventoryAmount / r.Turnover() ) * 365;
          }

          if(r.COG() > 0){
            LessPayablesDays = ( v.LessPayablesAmount / r.COG() ) * 365;
          }

          WCDays = ReceivablesDays + InventoryDays - LessPayablesDays;

          data[0].AOM[i].ReceivablesDays = ( r.Turnover() == 0 ) ? "NA" : kendo.toString(ReceivablesDays, "N2");
          data[0].AOM[i].InventoryDays = ( r.Turnover() == 0 ) ? "NA" : kendo.toString(InventoryDays, "N2");
          data[0].AOM[i].LessPayablesDays = ( r.COG() == 0 ) ? "NA" : kendo.toString(LessPayablesDays, "N2");
          data[0].AOM[i].WCDays = ( r.COG() == 0 || r.Turnover() == 0 ) ? "NA" : kendo.toString(WCDays, "N2");
        })
      }

      if(data != undefined && data.length > 0){
        data = data[0];
        if(data.Flag == 2){
          $('.form-last-confirmation-info').html('Last confirmed on: '+kendo.toString(new Date(data.DateFlag),"dd-MM-yyyy h:mm:ss tt") )
        } else if(data.Flag == 3){
          $('.form-last-confirmation-info').html('Last verified on: '+kendo.toString(new Date(data.DateFlag),"dd-MM-yyyy h:mm:ss tt") )
        } else{
          $('.form-last-confirmation-info').html('')
        }
        r.stockanddebt({
          Id: data.Id,
          CustomerId : data.CustomerId,
          Flag : data.Flag,
          AOM : data.AOM,
          AA : data.AA
        });
        r.AOM(data.AOM);

        r.formatAOM(r.AOM());

        r.AA(data.AA);

        r.formatAA(r.AA());

      }else{
        r.stockanddebt({Id: '', CustomerId : customerId,Flag : 0,AOM : [],AA : []})
        r.resetmen();
      }
      r.awal();
}

r.formatAOM = function(data) {
   r.AOMData.ColumnHeader([])
   r.AOMData.Row([])

   var row = {
      ReceivablesDays : ko.observableArray([]),
      InventoryDays : ko.observableArray([]),
      LessPayablesDays : ko.observableArray([]),
      WCDays : ko.observableArray([]),
      ReceivablesAmount : ko.observableArray([]),
      InventoryAmount : ko.observableArray([]),
      LessPayablesAmount : ko.observableArray([]),
      WCRequirement : ko.observableArray([])
   }

   r.AOMData.ColumnHeader.push("Operating Ratio")

   _.each(data, function(aom){
      r.AOMData.ColumnHeader.push(aom.OperatingRatioString)

      row.ReceivablesDays.push(aom.ReceivablesDays)
      row.InventoryDays.push(aom.InventoryDays)
      row.LessPayablesDays.push(aom.LessPayablesDays)
      row.WCDays.push(aom.WCDays)
      row.ReceivablesAmount.push(aom.ReceivablesAmount)
      row.InventoryAmount.push(aom.InventoryAmount)
      row.LessPayablesAmount.push(aom.LessPayablesAmount)
      row.WCRequirement.push(aom.WCRequirement)
   })

   _.map(row, function(v,k){
      var row = []
      row.push(k)
      _.each(v(), function(data){
         row.push(data)
      })

      r.AOMData.Row.push({"rowData": row})
   })
}

r.checkTabs = function(id) {
   if(id != "") {
      r.currentTab(id)
      $(".borderon").removeClass("tab-current")
      $("."+id).addClass("tab-current")
      $('html, body').animate({ scrollTop: $("#" + id).offset().top - 60}, 'slow');
      //$(".tabhidden").hide();
      //$("#" + id).show();
   } else {
      r.currentTab("tab1")
      $('html, body').animate({ scrollTop: $("#tab1").offset().top - 60}, 'slow');
      //$(".tabhidden").hide();
      //$("#tab1").show();
   }
   setTimeout(function(){
      if(id != "")
      $('html, body').animate({ scrollTop: $("#" + id).offset().top - 60}, 'slow');
   },500);
}

r.formatAA = function(data) {
    r.AAData.Row([])
   var row = {
      BulanString : ko.observableArray([])
      // InventoryDays : ko.observableArray([]),
      // LessPayablesDays : ko.observableArray([]),
      // WCDays : ko.observableArray([]),
      // ReceivablesAmount : ko.observableArray([]),
      // InventoryAmount : ko.observableArray([]),
      // LessPayablesAmount : ko.observableArray([]),
      // WCRequirement : ko.observableArray([])
   }

   _.each(data, function(aom){
      r.AAData.Row.push({
         col1: aom.BulanString,
         col2: "Receivable",
         col3: aom.ReceivableMin90,
         col4: aom.ReceivableMore90,
         col5: aom.ReceivableMore180
      })
      r.AAData.Row.push({
         col1: "",
         col2: "Inventory",
         col3: aom.InventoryMin90,
         col4: aom.InventoryMore90,
         col5: aom.InventoryMore180
      })

      // row.InventoryDays.push(aom.InventoryDays)
      // row.LessPayablesDays.push(aom.LessPayablesDays)
      // row.WCDays.push(aom.WCDays)
      // row.ReceivablesAmount.push(aom.ReceivablesAmount)
      // row.InventoryAmount.push(aom.InventoryAmount)
      // row.LessPayablesAmount.push(aom.LessPayablesAmount)
      // row.WCRequirement.push(aom.WCRequirement)
   })
}

r.resetmen = function(){
      r.AOM([]);
      r.AA([]);
      var date = kendo.toString(new Date(), 'MMMM yyyy');
      r.AOM.push({Id: "", OperatingRatio: new Date(), OperatingRatioString: date,ReceivablesDays: '',InventoryDays: '',LessPayablesDays: '',WCDays: '',ReceivablesAmount: "",InventoryAmount: "",LessPayablesAmount: "",WCRequirement: ""});
      r.AA.push({Id: "", BulanString: date,Bulan: new Date(),ReceivableMin90: '',ReceivableMore90: '',ReceivableMore180: '',InventoryMin90: '',InventoryMore90: '',InventoryMore180: ''});
      tmp = moment().subtract(1, 'month')._d;
      date = kendo.toString(tmp, 'MMMM yyyy');
      r.AOM.push({Id: "", OperatingRatio: tmp, OperatingRatioString: date,ReceivablesDays: '',InventoryDays: '',LessPayablesDays: '',WCDays: '',ReceivablesAmount: "",InventoryAmount: "",LessPayablesAmount: "",WCRequirement: ""});
      r.AA.push({Id: "", BulanString: date,Bulan: tmp,ReceivableMin90: '',ReceivableMore90: '',ReceivableMore180: '',InventoryMin90: '',InventoryMore90: '',InventoryMore180: ''});
      tmp = moment().subtract(2, 'month')._d;
      date = kendo.toString(tmp, 'MMMM yyyy');
      r.AOM.push({Id: "", OperatingRatio: tmp, OperatingRatioString: date,ReceivablesDays: '',InventoryDays: '',LessPayablesDays: '',WCDays: '',ReceivablesAmount: "",InventoryAmount: "",LessPayablesAmount: "",WCRequirement: ""});
      r.AA.push({Id: "", BulanString: date,Bulan: tmp,ReceivableMin90: '',ReceivableMore90: '',ReceivableMore180: '',InventoryMin90: '',InventoryMore90: '',InventoryMore180: ''});
      r.formatAOM(r.AOM());
      r.formatAA(r.AA());
      r.stockanddebt().AOM = r.AOM();
      r.stockanddebt().AA = r.AA();
    }

    r.awal = function(){
      // $("#").show();
      // $("#").hide();
      $("#btndraft").hide();
      $("#btnconfirm").hide();
      $("#btnceedit").hide();
      $(".filtermen").hide();
      if(r.stockanddebt().Flag == 0){
        $("#btnnewentry").show();
        $("#btnedit").hide();
        $("#btnverify").hide();
        $("#btnupdate").hide();
      } else if(r.stockanddebt().Flag == 1){
        $("#btnnewentry").hide();
        $("#btnedit").show();
        $("#btnverify").hide();
        $("#btnupdate").hide();
      } else if(r.stockanddebt().Flag == 2){
        $("#btnnewentry").hide();
        $("#btnedit").hide();
        $("#btnverify").show();
        $("#btnupdate").show();
      }
      else{
        $("#btnnewentry").hide();
        $("#btnedit").hide();
        $("#btnverify").hide();
        $("#btnupdate").hide();
      }
      r.Mode(0);
      $(".modezero").prop("disabled", true);
    }
r.render = function() {
   var data = r.constructData(r.data())
   r.dataResult(data)
}

r.constructData = function (res) {

   _.map(r.KFI(), function(v, i){
      r.KFI()[i].ColumnHeader([])
      r.KFI()[i].row([])

      //create header
      r.KFI()[i].ColumnHeader.push(v.SectionAlias())
      _.each(r.dates(), function(column){
         if(column.Status == "PROVISION") {
            r.KFI()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Prov.)")
         }else if (column.Status == "ESTIMATED"){
            r.KFI()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Estimated)")
         } else {
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

               _.each(r.dates(), function(column) {
                  var rowSelected = row.Values.find(function(g){return g.Date == column.Date})
                  if(rowSelected!=undefined) {
                     if(column.Na.toLowerCase() == "na") {
                        rowData.push("N/A")
                     } else {
                        if(typeof rowSelected.Value === "number") {
                           if(row.ValueType == "percentage"){
                              rowData.push(kendo.toString(rowSelected.Value, "P2"))
                           } else {
                              rowData.push(rowSelected.Value.toFixed(2))
                           }
                        } else {
                           rowData.push(rowSelected.Value)
                        }
                     }
                  } else {
                     rowData.push("")
                  }
               })

               r.KFI()[i].row.push({"rowData" : rowData})
            }
         })

         //end create row
      })
   })

   lastAuditedYear = (function () {
    let years = r.dates().filter(function (d) { return d.Status == "AUDITED" })
    return years[0].Date
  })()

   _.map(r.FR(), function(v, i){
      r.FR()[i].ColumnHeader([])
      r.FR()[i].row([])
      //create header
      if(i == 0) {
         r.FR()[i].ColumnHeader.push("Name")
         _.each(r.dates(), function(column){
            if(column.Status == "PROVISION") {
               r.FR()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Prov.)")
            } else if(column.Status == "ESTIMATED") {
               r.FR()[i].ColumnHeader.push("FY "+moment(column.Date,"DD-MM-YYYY").format("YY")+" (Estimated)")
            }
            else {
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
            if(v2.Id() == "LEVERAGEINCLX10") {
               console.log(row)
            }
            var rowData = []

            if(row == undefined) {
               rowData.push(v2.alias())
            }else if(row != undefined) {
               v2.alias(row.FieldName)
               rowData.push(v2.alias())
               _.each(r.dates(), function(column) {

                  if(r.FR()[i].Section().toLowerCase() == "key ratios" &&  lastAuditedYear != column.Date){
                           rowData.push("n/a")
                  }
                  else{
                     if(column.Na.toLowerCase() == "na") {
                        rowData.push("N/A")
                     } else {
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
      _.each(r.dates(), function(column){
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
               _.each(r.dates(), function(column) {
                  if(column.Na.toLowerCase() == "na") {
                     rowData.push("N/A")
                  } else {
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

               r.KI()[i].row.push({"rowData" : rowData})
            }
         })

         //end create row
      })
   })
}

var checkSub = function(data){
   if(data.rowData.length == 1) {
      return false
   }

   return true
}


var headerCheckSub = function(data) {
   if(data.ColumnHeader().length > 1) {
      return true
   } else {
      return false
   }
}

r.headerCacahKFI = ko.observable(0)

var headerCheckKFI = function() {
   if(r.headerCacahKFI() == 0) {
      r.headerCacahKFI(1)
      return true
   }

   return false
}

r.headerCacahFR = ko.observable(0)
var headerCheckFR = function() {
   if(r.headerCacahFR() == 0) {
      r.headerCacahFR(1)
      return true
   }

   return false
}

r.headerCacahKI = ko.observable(0)
var headerCheckKI = function() {
   if(r.headerCacahKI() == 0) {
      r.headerCacahKI(1)
      return true
   }

   return false
}

r.getCustomerId = function () {
   var customer = $('.jf-tbl select:eq(0)').data('kendoDropDownList').value()
   var dealNumber = $('.jf-tbl select:eq(1)').data('kendoDropDownList').value()

   if (customer == '') {
      sweetAlert("Oops...", "Customer cannot be empty", "error");
      return false
   }
   if (dealNumber == '') {
      sweetAlert("Oops...", "Deal number cannot be empty", "error");
      return false
   }

   r.customerId([customer, dealNumber].join('|'))

   return [customer, dealNumber].join('|')
}

r.parse = function(){
   var result = "",
   tmp = location.search
            .substr(1)
            .split("=");

   if (tmp.length > 1) result = decodeURIComponent(tmp[1]);

   return result;
}

window.refreshFilter = function () {
   $(".hiddenrow").hide()
   r.checkTabs(r.currentTab())
   r.refresh()
}

window.onscroll = function(){

    if ($(window).scrollTop() >= 100){
      $("table").css("margin-top", "100px")
      $('.tabfixed').show();
      $(".borderon").removeClass("tab-current")
      $(".tab1").addClass("tab-current")
    } else{
      $('.tabfixed').hide()
      $(".borderon").removeClass("tab-current")
      $(".tab1").addClass("tab-current")
      $(".KI").css("margin-top", "")
    }

    if ($(window).scrollTop() >= 607) {
      $("table").css("margin-top", "100px")
      $(".borderon").removeClass("tab-current")
      $(".tab2").addClass("tab-current")
    }

    if ($(window).scrollTop() >= 1618) {
      $("table").css("margin-top", "100px")
      $(".borderon").removeClass("tab-current")
      $(".tab3").addClass("tab-current")
    }

    if ($(window).scrollTop() >= 2816) {
      $("table").css("margin-top", "100px")
      $(".borderon").removeClass("tab-current")
      $(".tab4").addClass("tab-current")
    }
}