dsf = {
  tradeDate: ko.observable(""),
  AccountId: ko.observable([]),
  Client: ko.observable([]),
  ValueClient: ko.observable(""),
  ValueAcc: ko.observable(""),
  loading: ko.observable(false),
  qtyclrcom: ko.observable(),
  qtymarketfee: ko.observable(),
  qtynfafee: ko.observable(),
  qtysumQty: ko.observable(),
  reset: ko.observable(false),
  TitelFilter : ko.observable(" Hide Filter")
}

dsf.resetFilter = function () {
  dsf.reset(true)
  dsf.ValueClient("");
  dsf.ValueAcc("");
  $("#Accountid").data('kendoDropDownList').value("")
  $("#client").data('kendoDropDownList').value("")
  dsf.tradeDate(moment(new Date()).format("YYYY-MM-DD"));
  dsf.loadGridTradeFee();
  dsf.reset(false)
}

dsf.loadFilter = function () {
  dsf.AccountId([]);
  dsf.Client([]);
  ajaxPost("/databrowser/getaccountid", {}, function (res) {
    for (var i = 0; i < res.length; i++) {
      dsf.AccountId().push(res[i]._id.accountid);
    }
    $("#Accountid").kendoDropDownList({
      dataSource: dsf.AccountId().sort(),
      optionLabel: "Select Accountid",
      filter: 'startswith'
    });
  });
  ajaxPost("/databrowser/getclientid", {}, function (res) {
    //console.log(res);

    for (var i = 0; i < res.length; i++) {
      if(res[i]._id.clientnumber != null){
        dsf.Client().push({
          title: res[i]._id.clientnumber,
          value: res[i]._id.clientnumber
        });
      }
    }
    $("#client").kendoDropDownList({
      dataSource: dsf.Client().sort(),
      optionLabel: "Select Client",
      dataTextField: "title",
      dataValueField: "value",
      filter: 'startswith',
    });
  });
  var today =kendo.toString(kendo.parseDate(new Date()), "yyyy-MM-dd");
  //$("#TradeDate").data("kendoDatePicker").value(today);
  dsf.tradeDate(today);

  dsf.tradeDate.subscribe(function (value) {
    if (model.View() != "false" && dsf.reset() == false) {
      dsf.loadGridTradeFee();
    }
  });

  dsf.ValueAcc.subscribe(function (value) {
    if (model.View() != "false" && dsf.reset() == false) {
      dsf.loadGridTradeFee();
    }
  });

  dsf.ValueClient.subscribe(function (value) {
    if (model.View() != "false" && dsf.reset() == false) {
      dsf.loadGridTradeFee();
    }
  });
}



var userid = model.User();
var gctradefee = new GridColumn('role_tradefees', userid, 'TradeFee');
dsf.loadGridTradeFee = function () {
  if (model.View() != "false") {
    $(".k-button").show();
  } else {
    $(".k-button").hide();
  }
  dsf.loading(true);
  var params = {
    rptdateint: dsf.tradeDate(),
    client: dsf.ValueClient(),
    accountid: dsf.ValueAcc()
  };

  ajaxPost("/databrowser/readtradefees", {}, function (res) {
    var d = res.Data.Summary;
    //console.log(d.clrcommission)
    dsf.loading(false);
    dsf.qtyclrcom(d.clrcommission);
    dsf.qtymarketfee(d.marketfee);
    dsf.qtynfafee(d.miscfee);
    dsf.qtysumQty(d.sumQty);
  })

  var emptyData = [];
  $("#TradeFee").html("");
  $("#TradeFee").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "/databrowser/readtradefees",
          data: params,
          dataType: "json",
          type: "POST",
          contentType: "application/json",
        },
        parameterMap: function (data) {
          dsf.loading(false);
          //console.log("------",data)
          return JSON.stringify(data);
        },
      },
      schema: {
        data: function (d) {
          dsf.loading(false);
          gctradefee.Init();
          //console.log("------", d)
          // if (data.Data.Count == 0) {
          //   x.qtyBuy(0);
          //   x.qtySale(0);
          //   x.sumQty(0);
          //   x.trxBuy(0);
          //   x.trxCount(0);
          //   x.trxSale(0);
          //   return emptyData;
          // } else {
          //   var summary = data.Data.Summary
          //   //x.qtyBuy(summary.qtyBuy);
          //   x.qtySale(summary.qtySale);
          //   x.sumQty(summary.sumQty);
          //   x.trxBuy(summary.trxBuy);
          //   x.trxCount(summary.trxCount);
          //   x.trxSale(summary.trxSale);
          //   return data.Data.Records;
          // }
        },
        data: "Data.Records",
        total: "Data.Count",
      },
      pageSize: 15,
      serverPaging: true, // enable server paging
      serverSorting: true,
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: [5, 10, 15, 20],
      buttonCount: 5
    },
    columnMenu: false,
    columnHide: function(e) {
        gctradefee.RemoveColumn(e.column.field);
    },
    columnShow: function(e) {
        gctradefee.AddColumn(e.column.field);
    },
    excel: {
      allPages: true
    },
    excelExport: function (e) {
      console.log(e.workbook);
      //e.AllPages(true);
      //e.workbook.fileName = "daily nlv summary All Dates";
      if ($("#TradeDate").val() != "") {
        e.workbook.fileName = "Trade Fee on " + ($("#TradeDate").val()).toString() + ".xlsx";
      } else {
        e.workbook.fileName = "Trade Fee on All Dates.xlsx";
      }
    },
    columns: [
      {
        field: "Transactiondatestring",
        title: "Trade Date",
        attributes: {"class": "align-center"},
        width: 100
      },
      {
        field: "Accountid",
        title: "Account",
        width: 75
      }, {
        field: "Client",
        title: "Client",
        width: 75
      }, {
        field: "Currency",
        title: "Currency",
        width: 75
      },
      {
        field: "Fullname",
        title: "Fullname",
        width: 250
      },
      {
        field: "Contractexpiry",
        title: "Contract expiry",
        attributes: {"class": "align-center"},
        template:"#= moment(Contractexpiry).format('MMM-YY') #",
         width: 100
      },
      {
        field: "Lots",
        title: "Lots",
        attributes: {"class": "align-right"},
        width: 75
      },
      {
        field: "Marketfee",
        title: "Market Fee",
        format: "{0:n2}",
        attributes: {"class": "align-right"},
        width: 85
      },
      {
        field: "Clrcommission",
        title: "CLR COMM",
        format: "{0:n2}",
        attributes: {"class": "align-right"},
        width: 85
      },
      {
        field: "Nfafee",
        title: "NFA",
        format: "{0:n2}",
        attributes: {"class": "align-right"},
        width: 75
      },
      {
        field: "Miscfee",
        title: "MISCFEE",
        width: 75,
        format: "{0:n2}",
        attributes: {"class": "align-right"}
      }]
  });



}

dsf.toggleFilter = function(){
  var panelFilter = $('.panel-filter');
  var panelContent = $('.panel-content');

  if (panelFilter.is(':visible')) {
    panelFilter.hide();
    panelContent.attr('class', 'col-md-12 col-sm-12 ez panel-content');
    $('.breakdown-filter').removeAttr('style');
  } else {
    panelFilter.show();
    panelContent.attr('class', 'col-md-9 col-sm-9 ez panel-content');
    //panelContent.css('margin-top', '1.3%');
    $('.breakdown-filter').css('width', '60%');
  }

  $('.k-grid').each(function (i, d) {
    try {
      $(d).data('kendoGrid').refresh();
    } catch (err) {}
  });

  $('.k-pivot').each(function (i, d) {
    $(d).data('kendoPivotGrid').refresh();
  });

  $('.k-chart').each(function (i, d) {
    $(d).data('kendoChart').redraw();
  });
  dsf.panel_relocated();
    var FilterTitle = dsf.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        dsf.TitelFilter(" Show Filter");
    }else{
        dsf.TitelFilter(" Hide Filter");
    }
}

dsf.panel_relocated = function(){
  if ($('.panel-yo').size() == 0) {
    return;
  }

  var window_top = $(window).scrollTop();
  var div_top = $('.panel-yo').offset().top;
  if (window_top > div_top) {
    $('.panel-fix').css('width', $('.panel-yo').width());
    $('.panel-fix').addClass('contentfilter');
    $('.panel-yo').height($('.panel-fix').outerHeight());
  } else {
    $('.panel-fix').removeClass('contentfilter');
    $('.panel-yo').height(0);
  }
}

dsf.loadTradeDate = function(){
  var param = {};
  ajaxPost("/dashboard/getcurrentdate", param, function (res) {
      var d = new Date(res.Data.CurrentDate);
      var DefaultDate = new Date(res.Data.CurrentDate);
      var day = moment(d).format("ddd");
      if (day != "Mon"){
          DefaultDate.setDate(DefaultDate.getDate()-1);
      }else{
          DefaultDate.setDate(DefaultDate.getDate()-3);
      }
     $("#TradeDate").data("kendoDatePicker").value(new Date(DefaultDate));
     dsf.loadGridTradeFee();
  });
}

$(document).ready(function () {
  dsf.loadFilter();
  dsf.loadTradeDate();
  $("#TradeDate").kendoDatePicker({
    format: "yyyy-MM-dd",
  }).data("kendoDatePicker");
  
  $("#export").click(function (e) {
    var grid = $("#TradeFee").data("kendoGrid");
    grid.saveAsExcel();
  });
});