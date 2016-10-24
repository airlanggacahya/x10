opt = {
  tradeDate: ko.observable(""),
  AccountId: ko.observable([]),
  Client: ko.observable([]),
  ValueClient: ko.observable(""),
  ValueAcc: ko.observable(""),
  loading: ko.observable(false),
  reset: ko.observable(false),
  TitelFilter : ko.observable(" Hide Filter")
}

opt.resetFilter = function () {
  opt.reset(true);
  opt.ValueClient("");
  opt.ValueAcc("");
  $("#Accountid").data('kendoDropDownList').value("")
  $("#client").data('kendoDropDownList').value("")
  opt.ValueAcc("");
  opt.tradeDate(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
  opt.loadGridOpenTrade();
  opt.reset(false);
}

opt.loadFilter = function () {
  if (model.View() != "false") {
    $(".k-button").show();
  } else {
    $(".k-button").hide();
  }
  opt.AccountId([]);
  opt.Client([]);

  ajaxPost("/databrowser/getaccountid", {}, function (res) {
    for (var i = 0; i < res.length; i++) {
      opt.AccountId().push(res[i]._id.accountid);
    }
    $("#Accountid").kendoDropDownList({
      dataSource: opt.AccountId().sort(),
      optionLabel: "Select Accountid",
      filter: 'startswith',
    });
  });

  ajaxPost("/databrowser/getclientid", {}, function (res) {
    var list = [];
    for (var i = 0; i < res.length; i++) {
      if(res[i]._id.clientnumber != null){
        opt.Client().push({
          title: res[i]._id.clientnumber,
          value:res[i]._id.clientnumber
        });
      }
    }

    $("#client").kendoDropDownList({
      dataSource: opt.Client().sort(),
      optionLabel: "Select Client",
      dataTextField: "title",
      dataValueField: "value",
      filter: 'startswith',
    });
  });
}

  // opt.tradeDate.subscribe(function (value) {
  //   if (model.View() != "false" && opt.reset() == false && opt.tradeDate() != "") {
  //     opt.loadGridOpenTrade();
  //   }
  // });

  opt.ValueAcc.subscribe(function (value) {
    if (model.View() != "false" && opt.reset() == false && opt.ValueAcc() != "") {
      opt.loadGridOpenTrade();
    }
  });

  opt.ValueClient.subscribe(function (value) {
    if (model.View() != "false" && opt.reset() == false && opt.ValueClient() != "") {
      opt.loadGridOpenTrade();
    }
  });

var userid = model.User();
var gcopentrade = new GridColumn('role_opentrade', userid, 'OpenTrade');
opt.loadGridOpenTrade = function () {
  opt.loading(true);
  var params = {
    rptdateint: opt.tradeDate(),
    client: opt.ValueClient(),
    accountid: opt.ValueAcc(),
  };

  var emptyData = [];
  $("#OpenTrade").html("");
  $("#OpenTrade").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "/databrowser/readopentrade",
          data: params,
          dataType: "json",
          type: "POST",
          contentType: "application/json",
        },
        parameterMap: function (data) {
          return JSON.stringify(data);
          opt.loading(false);
        },
      },
      schema: {
        data: function(data) {
            opt.loading(false);
            if (data.Data.Count == 0) {
                return emptyData;
            } else {
                return data.Data.Records;
            }
        },
        // data: "Data.Records",
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
        gcopentrade.RemoveColumn(e.column.field);
    },
    columnShow: function(e) {
        gcopentrade.AddColumn(e.column.field);
    },
    excel: {
      allPages: true
    },
    excelExport: function (e) {
      console.log(e.workbook);
      //e.AllPages(true);
      //e.workbook.fileName = "daily nlv summary All Dates";
      if ($("#TradeDate").val() != "") {
        e.workbook.fileName = "Open Trade on " + ($("#TradeDate").val()).toString() + ".xlsx";
      } else {
        e.workbook.fileName = "Open Trade on All Dates.xlsx";
      }
    },
    columns: [{
        field: "Tradedate",
        title: "Trade Date",
        attributes: {"class": "align-center"},
        width: 70
      }, 
      {
        field: "Client",
        title: "Client",
        width: 100
      }, 
      {
        field: "Accountid",
        title: "Account",
        width: 100
      },
      {
        field: "Fullname",
        title: "Full Name",
        width: 130
      },
      {
        field: "Contractexpiry",
        title: "Contract Expiry",
        attributes: {"class": "align-center"},
        template:"#= moment(Contractexpiry).format('MMM-YY') #",
        width: 80
      },
      {
        field: "TradePrice",
        title: "Trade Price",
        width: 60,
        attributes: {"class": "align-right"},
        template: "#= kendo.toString(TradePrice, 'n4')#"
      },
      {
        field: "SettlementPrice",
        title: "Settlement Price",
        width: 80,
        attributes: {"class": "align-right"},
        template: "#= kendo.toString(SettlementPrice, 'n4')#"
      },
      {
        field: "TransactionType",
        title: "B/S",
        width: 25 
      },
      {
        field: "Qty",
        title: "Qty",
        attributes: {"class": "align-right"},
        width: 25
      },
      {
        field: "NationalValue",
        title: "Notional Value",
        width: 80,
        attributes: {"class": "align-right"},
        template: "#= kendo.toString(NationalValue, 'n2')#"
      }]
  });
}

opt.toggleFilter = function(){
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
  opt.panel_relocated();
    var FilterTitle = opt.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        opt.TitelFilter(" Show Filter");
    }else{
        opt.TitelFilter(" Hide Filter");
    }
}

opt.panel_relocated = function(){
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
$(document).ready(function () {
  $("#TradeDate").kendoDatePicker({
    format: "yyyy-MM-dd",
  }).data("kendoDatePicker");

  opt.loadFilter();
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
     opt.tradeDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
     opt.loadGridOpenTrade();
  });

  $("#TradeDate").on("change",function (){
    opt.loadGridOpenTrade();
  });

  $("#export").click(function (e) {
    var grid = $("#OpenTrade").data("kendoGrid");
    grid.saveAsExcel();
  });
});