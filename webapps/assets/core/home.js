var dashboard = {
  // varible field
  filterTradeDatedaily: ko.observable(""),
  filterTradeDateTotal: ko.observable(""),
  filterDateMenu : ko.observable(""),
  tempDateServer : ko.observable(""),
};

dashboard.searchData = function () {
  dashboard.getDataGridDailynlv();
}

dashboard.resetData = function () {
  $('#statusnvl').bootstrapSwitch('state', true)
  dashboard.filterTradeDatedaily("");
  dashboard.filterDateMenu(moment(new Date(dashboard.tempDateServer())).format("YYYY-MM-DD"));
  dashboard.getDataGridDailynlv();
}

dashboard.searchDataSum = function () {
  dashboard.getDataGriddDailyTotal();
}

dashboard.resetDataSum = function () {
  $('#statusaccTotal').bootstrapSwitch('state', true)
  dashboard.filterTradeDateTotal("");
  dashboard.filterDateMenu(moment(new Date(dashboard.tempDateServer())).format("YYYY-MM-DD"));
  dashboard.getDataGriddDailyTotal();
}

dashboard.getDataGridDailynlv = function () {
  var TradeDate = "";
  var statusNlv = 1;
  tnlv = $('#statusnvl').bootstrapSwitch('state');
  if (!tnlv)
    statusNlv = 0
  if (dashboard.filterDateMenu() != "") {
    TradeDate = moment(new Date(dashboard.filterDateMenu())).format("YYYY-MM-DD");
  } else {
    return swal("Confirmation!", "Please choose Trade Date.", "error");
  }

  var param = {
    TradeDate: $("#datePickerMenu").val(),
    Status: statusNlv
  };

  // if ($("#datePickerMenu").val() != "") {
  //   var ondate = ($("#datePickerMenu").val()).toString();
  // } else {
  //   var ondate = "All Date";
  // }
  var dataSource = [];
  var url = "/reconsummary/dailynlvsummary";
  $("#MasterGridDaily").html("");
  $("#MasterGridDaily").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: url,
          data: param,
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
            return dataSource;
          } else {
            return data.Data.Records;
          }
        },
        total: "Data.Count",
      },
      pageSize: 10,
      // serverPaging: true,
      // serverSorting: true,
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    excel: {
      allPages: true
    },
    excelExport: function (e) {
      console.log(e);
      //e.workbook.fileName = "daily nlv summary All Dates";
      if ($("#datePickerMenu").val()) {
        e.workbook.fileName = "daily nlv summary " + ($("#datePickerMenu").val()).toString() + ".xlsx";
      } else {
        e.workbook.fileName = "daily nlv summary All Dates.xlsx";
      }
    },
    columnMenu: false,
    columns: [
      {
        field: "AccountId",
        title: "Account ID",
        width: 150,
        locked: true,
        lockable: false,
      },
      {
        field: "AccountName",
        title: "Account Name",
        width: 200,
        locked: true,
      },
      {
        field: "Cad",
        title: "CAD",
        width: 100,
        template: "#= kendo.toString(Cad, 'N2') #",
        attributes: {"class": "align-right"}
      },
      {
        field: "Chf",
        title: "CHF",
        width: 100,
        template: "#= kendo.toString(Chf, 'N2') #",
        attributes: {"class": "align-right"}
      },
      {
        field: "Eur",
        title: "EUR",
        width: 100,
        template: "#= kendo.toString(Eur, 'N2') #",
        attributes: {"class": "align-right"}
      },
      {
        field: "Gbp",
        title: "GBP",
        width: 100,
        template: "#= kendo.toString(Gbp, 'N2') #",
        attributes: {"class": "align-right"}
      },
      {
        field: "Jpy",
        title: "JPY",
        width: 100,
        template: "#= kendo.toString(Jpy, 'N2') #",
        attributes: {"class": "align-right"}
      },
      {
        field: "Usd",
        title: "USD",
        width: 100,
        template: "#= kendo.toString(Usd, 'N2') #",
        attributes: {"class": "align-right"}
      },
    ]
  });
}

dashboard.getDataGriddDailyTotal = function () {
  var TradeDate = "";
  var statusNlv = 1;
  tnlv = $('#statusaccTotal').bootstrapSwitch('state');
  if (!tnlv)
    statusNlv = 0
  if (dashboard.filterDateMenu() != "") {
    TradeDate = moment(new Date(dashboard.filterDateMenu())).format("YYYY-MM-DD");
  } else {
    return swal("Confirmation!", "Please choose Trade Date.", "error");
  }

  var param = {
    TradeDate: $("#datePickerMenu").val(),
    Status: statusNlv
  };
  //var ondate = ($('#datePickerMenu').val()).toString();
  var dataSource = [];
  var url = "/reconsummary/dailytotalfeesummary";
  $("#MasterGridDailyTotal").html("");
  $("#MasterGridDailyTotal").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: url,
          data: param,
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
            return dataSource;
          } else {
            return data.Data.Records;
          }
        },
        total: "Data.Count",
      },
      pageSize: 10,
      // serverPaging: true,
      // serverSorting: true,
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    }, excel: {
      allPages: true
    },
    excelExport: function (e) {
      if ($("#TradeDatedel").val()) {
        e.workbook.fileName = "daily total summary " + ($("#datePickerMenu").val()).toString() + ".xlsx";
      } else {
        e.workbook.fileName = "daily total summary All Dates.xlsx";
      }
    },
    columnMenu: false,
    columns: [
      {
        field: "AccountId",
        title: "Account ID",
        width: 150,
        locked: true,
        lockable: false,
      },
      {
        field: "AccountName",
        title: "Account Name",
        width: 200,
        locked: true,
      },
      {
        field: "Cad",
        title: "CAD",
        width: 100,
        template: "#= kendo.toString(Cad, 'N2') #",
        attributes: {"class": "align-right"}
      },
      {
        field: "Chf",
        title: "CHF",
        width: 100,
        template: "#= kendo.toString(Chf, 'N2') #",
        attributes: {"class": "align-right"}
      },
      {
        field: "Eur",
        title: "EUR",
        width: 100,
        template: "#= kendo.toString(Eur, 'N2') #",
        attributes: {"class": "align-right"}
      },
      {
        field: "Gbp",
        title: "GBP",
        width: 100,
        template: "#= kendo.toString(Gbp, 'N2') #",
        attributes: {"class": "align-right"}
      },
      {
        field: "Jpy",
        title: "JPY",
        width: 100,
        template: "#= kendo.toString(Jpy, 'N2') #",
        attributes: {"class": "align-right"}
      },
      {
        field: "Usd",
        title: "USD",
        width: 100,
        template: "#= kendo.toString(Usd, 'N2') #",
        attributes: {"class": "align-right"}
      },
    ]
  });
}

dashboard.menu = ko.observableArray([
  { to: '/reconsummary/summaryaccountnlv', title: 'NLV Summary', icon: 'fa fa-money', color: 'rgb(10, 114, 183)' }, 
  { to: '/reconsummary/summarytotalfee', title: 'Total Fee', icon: 'fa fa-money', nope: true, color: 'rgb(17, 134, 212)' },
  { to: '/reconsummary/positionsummary', title: 'Position Summarry', icon: 'fa fa-money', nope: true, color: '#3498DB' }, 
  // { to: '/uploadfilev2/default', title: 'Upload File', icon: 'fa fa-cloud-upload', nope: true, color: 'rgb(23, 142, 73)' },
  // { to: '/manualpaymentreceipt/default', title: 'Manual Payment Receipt', icon: 'fa fa-pencil', color: 'rgb(32, 162, 87)' }, 
  // { to: '/fxtradeform/default', title: 'FX Trade', nope: true, icon: 'fa fa-pencil', color: '#28B463' }, 
  // { to: 'Vendor Payment', title: 'Account Statement', icon: 'fa-bar-chart', color: 'rgb(212, 130, 0)' }, 
  // { to: 'Manual Entries', title: 'Clearer Account Statement', icon: 'fa-home', color: 'rgb(234, 144, 0)' }, 
  // { to: '/reportpdf/default', title: 'Report', icon: 'fa fa-file-pdf-o', color: '#F39C12' }
  ]);



$(document).ready(function () {
    $("#datePickerMenu").kendoDatePicker({
      format: "yyyy-MM-dd",
    }).data("kendoDatePicker");
    
    var url = "/processlog/getpaymentreceiptmindate";
    $.ajax({
        url: url,
        type: 'POST',
        data: ko.mapping.toJSON({}),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            dashboard.filterDateMenu(data.Data);
        },
        async: false
    });
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

          dashboard.filterTradeDatedaily(new Date(moment(DefaultDate).format("YYYY-MM-DD")));
          dashboard.filterTradeDateTotal(new Date(moment(DefaultDate).format("YYYY-MM-DD")));
          dashboard.filterDateMenu(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
          dashboard.tempDateServer(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
          dashboard.getDataGridDailynlv();
          dashboard.getDataGriddDailyTotal();
          $("#export-daily-nlv").click(function (e) {
            var grid = $("#MasterGridDaily").data("kendoGrid");
            grid.saveAsExcel();
          });
          $("#export-deily-summary").click(function (e) {
            var grid = $("#MasterGridDailyTotal").data("kendoGrid");
            grid.saveAsExcel();
          });
      });
});