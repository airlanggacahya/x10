TRN = {

  FilterSourceTypes: ko.observableArray([
    {text: "Transaction File", value: "TF"},
    {text: "Desk Fee", value: "DF"}
  ]),


  ListFileType: ko.observableArray([
    {text: "TT", id: "TT", value: "TF"},
    {
      text: "Stellar",
      id: "Stellar",
      value: "TF"
    }, {
      text: "ADM",
      id: "ADM",
      value: "TF"
    }, {
      text: "CQG",
      id: "CQG",
      value: "TF"
    }, {
      text: "CQGSFTP",
      id: "CQGSFTP",
      value: "TF"
    }, {
      text: "FCS",
      id: "FCS",
      value: "TF"
    }, {
      text: "Newedge",
      id: "Newedge",
      value: "TF"
    }, {
      text: "SEB",
      id: "SEB",
      value: "TF"
    }, {
      text: "SEB WEBCLEAR",
      id: "SEB WEBCLEAR",
      value: "TF"
    }, {
      text: "Settlement Price",
      id: "SP",
      value: "SP"
    },
    {text: "Desk Fee", id: "DF", value: "DF"}
  ]),

  UploadType: ko.observable("TF"),
  FileType: ko.observable("TT"),
  AccountId: ko.observable(""),
  TradeDate: ko.observable(""),
  ProductId: ko.observable(""),
  visbleTotal: ko.observable(true),

  //Sub Total Transaction File
  qtyBuy: ko.observable(0),
  qtySale: ko.observable(0),
  sumQty: ko.observable(0),
  trxBuy: ko.observable(0),
  trxCount: ko.observable(0),
  trxSale: ko.observable(0),
  loading: ko.observable(true),
  TitelFilter : ko.observable(" Hide Filter"),
}

TRN.UploadType.subscribe(function (value) {
  if (value != "") {
    loadGridTF();
  }
});

TRN.FileType.subscribe(function (value) {
  if (value != "") {
    loadGridTF();
  }
});

// model.searchProductId = function (data, event) {
//   if (model.View() != "false") {
//     if (TRN.ProductId().length >= 3 || TRN.ProductId().length == 0) {
//       loadGridTF();
//     }
//   }
// }

// model.searchAccountId = function (data, event) {
//   if (model.View() != "false") {
//     if (TRN.AccountId().length >= 3 || TRN.AccountId().length == 0) {
//       loadGridTF();
//     }
//   }
// }

function loadGrid() {
  if (TRN.UploadType() == "TF") {
    TRN.visbleTotal(true);
    loadGridTF();
  } else if (TRN.UploadType() == "SP") {
    TRN.visbleTotal(false);
    loadGridSP();
  } else {
    TRN.visbleTotal(false);
    loadGridDF();
  }
}

function resetSearch() {
  var x = TRN;
  x.UploadType("TF");
  x.FileType("TT");
  x.AccountId("");
  x.TradeDate(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
  x.ProductId("");
  loadGrid();
}

var userid = model.User();
var gcbrowser = new GridColumn('role_browser', userid, 'MasterDataBrowser');
function loadGridTF() {
  $(".k-button").show();

  var x = TRN;
  x.loading(true);
  var params = {
    FileType: TRN.FileType(),
    AccountId: TRN.AccountId(),
    TradeDate: $('#TradeDate').data('kendoDatePicker')._oldText,
    ProductId: TRN.ProductId()
  };
  var emptyData = [];
  $("#MasterDataBrowser").html("");
  $("#MasterDataBrowser").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "/databrowser/readdatatf",
          data: params,
          dataType: "json",
          type: "POST",
          contentType: "application/json",
        },
        parameterMap: function (data) {
          return JSON.stringify(data);
        },
      },
      schema: {
        data: function (data) {
          x.loading(false);
          gcbrowser.Init();
          if (data.Data.Count == 0) {
            x.qtyBuy(0);
            x.qtySale(0);
            x.sumQty(0);
            x.trxBuy(0);
            x.trxCount(0);
            x.trxSale(0);
            return emptyData;
          } else {
            var summary = data.Data.Summary
            x.qtyBuy(summary.qtyBuy);
            x.qtySale(summary.qtySale);
            x.sumQty(summary.sumQty);
            x.trxBuy(summary.trxBuy);
            x.trxCount(summary.trxCount);
            x.trxSale(summary.trxSale);
            return data.Data.Records;
          }
        },
        total: "Data.Count",
      },
      pageSize: 15,
      serverPaging: true, // enable server paging
      serverSorting: true,
    },
    columnMenu: false,
    columnHide: function(e) {
        gcbrowser.RemoveColumn(e.column.field);
    },
    columnShow: function(e) {
        gcbrowser.AddColumn(e.column.field);
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: [5, 10, 15, 20],
      buttonCount: 5
    },
    excel: {
      allPages: true
    },
    excelExport: function (e) {
      console.log(e.workbook);
      if ($("#TradeDate").val() != "") {
        e.workbook.fileName = "Data Browser on " + ($("#TradeDate").val()).toString() + ".xlsx";
      } else {
        e.workbook.fileName = "Data Browser on All Dates.xlsx";
      }
    },
    columns: [{
        field: "FileType",
        title: "Source File",
        width: 100
      },
      {
        field: "gw",
        title: "Order GW",
        width: 120
      },
      {
        field: "productid",
        title: "Product",
        width: 80
      },
      {
        field: "Fullname",
        title: "Product Name",
        width: 200
      },
      {
        field: "contractexpiry",
        title: "Contract",
        type: "date",
        format: "{0:MMM-yyyy}",
        width: 150,
        attributes: {
          "class": "align-center"
        }
      },
      {
        field: "accountnumber",
        title: "Account No",
        width: 120
      },
      {
        field: "Clientnumber",
        title: "Client",
        width: 90
      },
      {
        field: "transactiontype",
        title: "B/S",
        width: 50,
        attributes: {
          "class": "align-center"
        }
      },
      {
        field: "Currency",
        title: "Currency",
        width: 100
      }, {
        field: "qty",
        title: "Qty",
        width: 80,
        format: "{0:n0}",
        attributes: {
          "class": "align-right"
        }
      },
      {
        field: "price",
        title: "Price",
        width: 150,
        format: "{0:n4}",
        attributes: {
          "class": "align-right"
        }
      },
      {
        field: "transactiondate",
        title: "Exch. Date",
        width: 220,
        // type: "date",
        // format: "{0:yyyy-MM-dd HH:mm:ss}",
        template: function (d) {
          // moment(toUTC(getUTCDateFull(d.transactiondate)).format("dddd, DD-MMMM-YYYY")
          // return moment(new Date(toUTC(d.transactiondate))).format("dddd, DD-MMMM-YYYY HH:mm:ss");
          return moment(new Date(getUTCDateFull(d.transactiondate))).format("YYYY-MM-DD HH:mm:ss");
        },
        attributes: {
          "class": "align-center"
        }
      }, {
        field: "transactiondatestring",
        title: "Trade Date",
        width: 120,
        attributes: {
          "class": "align-center"
        }
      }, {
        field: "IsCutOff",
        title: "Cut Off",
        width: 120
      }]
  });
}

function loadGridSP() {
  var params = {
    TradeDate: $('#TradeDate').data('kendoDatePicker')._oldText,
  };
  var emptyData = [];
  var emptyData = [];
  $("#MasterDataBrowser").html("");
  $("#MasterDataBrowser").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "/databrowser/readdatasp",
          data: params,
          dataType: "json",
          type: "POST",
          contentType: "application/json",
        },
        parameterMap: function (data) {
          return JSON.stringify(data);
        },
      },
      schema: {
        data: function (data) {
          if (data.Data.Count == 0) {
            return emptyData;
          } else {
            return data.Data.Records;
          }
        },
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
    columns: [{
        field: "Tradedate",
        title: "Trade Date",
        width: 150,
        attributes: {
          "class": "align-center"
        }
      }, {
        field: "Contract",
        title: "Contract",
        width: 150,
      }, {
        field: "ExpDate",
        title: "Expiry",
        type: "date",
        format: "{0:MMM-yyyy}",
        attributes: {
          "class": "align-center"
        },
        width: 80
      }, {
        field: "Settle",
        title: "Settlement Price",
        width: 150,
        format: "{0:n4}",
        attributes: {
          "class": "align-right"
        }
      }, ]
  });
}

function loadGridDF() {
  var params = {
    TradeDate: TRN.TradeDate()
  };
  var emptyData = [];
  var emptyData = [];
  $("#MasterDataBrowser").html("");
  $("#MasterDataBrowser").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "/databrowser/readdatadeskfee",
          data: params,
          dataType: "json",
          type: "POST",
          contentType: "application/json",
        },
        parameterMap: function (data) {
          return JSON.stringify(data);
        },
      },
      schema: {
        data: function (data) {
          if (data.Data.Count == 0) {
            return emptyData;
          } else {
            return data.Data.Records;
          }
        },
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
    columns: [
      {field: "TradeDateString", title: "Upload Date", width: 150, attributes: {"class": "align-center"}},
      {field: "FeeDate", title: "Value Date", width: 150, type: "date", format: "{0:MMM-yyyy}", attributes: {"class": "align-center"}},
      {field: "AccountId", title: "Account ID"},
      {field: "AccountNumber", title: "Account Number"},
      {field: "AccountName", title: "Account Name"},
      {field: "ClientNumber", title: "Client Number"},
      {field: "FxCode1", title: "FX Code"},
      {field: "FxCode2", title: "FX Code"},
      {field: "FeeAmount", title: "Amount", format: "{0:n2}", attributes: {"class": "align-right"}},
      {field: "FeeDescription1", title: "Description"},
      {field: "FeeDescription2", title: "Description"},
    ]
  });
}

function panel_relocated(){
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

function toggleFilter(){
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
  panel_relocated();

    var FilterTitle = TRN.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        TRN.TitelFilter(" Show Filter");
    }else{
        TRN.TitelFilter(" Hide Filter");
    }
}

$(document).ready(function () {
  // $("#TradeDate").kendoDatePicker({
  //   value : new Date(),
  //   format: "yyyy-MM-dd",
  // }).data("kendoDatePicker");
  // var param = {};
  // ajaxPost("/dashboard/getcurrentdate", param, function (res) {
  //     var d = new Date(res.Data.CurrentDate);
  //     var DefaultDate = new Date(res.Data.CurrentDate);
  //     var day = moment(d).format("ddd");
  //     if (day != "Mon"){
  //         DefaultDate.setDate(DefaultDate.getDate()-1);
  //     }else{
  //         DefaultDate.setDate(DefaultDate.getDate()-3);
  //     }
  //    TRN.TradeDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
  //    loadGrid();
  // });

  // $("#TradeDate").on("change",function (){
  //   loadGrid();
  // });

  $("#export").click(function (e) {
    var grid = $("#MasterDataBrowser").data("kendoGrid");
    grid.saveAsExcel();
  });
});