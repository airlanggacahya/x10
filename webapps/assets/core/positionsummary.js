var ps = {
  loading: ko.observable(false),
  TitelFilter: ko.observable(" Hide Filter"),
  // variable field
  Id: ko.observable(),
  //list
  listClient: ko.observableArray([]),
  //var Filter
  filterTradeDate: ko.observable(""),
  filterClient: ko.observableArray([]),
  filterStatus: ko.observable(1),
};

ps.Search = function () {
  ps.getDataGridPositionSummary();
}

ps.Reset = function () {
  ps.filterTradeDate(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
  ps.filterStatus(1);
  $('#ftrstatus').bootstrapSwitch('state', true);
  ps.getDataGridPositionSummary();
}

ps.getDataGridPositionSummary = function () {
  ps.loading(true);
  var stts = $('#ftrstatus').bootstrapSwitch('state')
  if (stts == false) {
    ps.filterStatus("2");
  } else {
    ps.filterStatus("1")
  }
  var param = {
    "TradeDate": ps.filterTradeDate(), //"2016-07-08",
    "ClientNumber": ps.filterClient(),
    "Status": ps.filterStatus().toString(),
  };
  var dataSource = [];
  var url = "/reconsummary/dailypositionsummary";
  $("#GridPositionSummary").html("");
  $("#GridPositionSummary").kendoGrid({
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
          ps.loading(false);
          if (data.Data.length == 0) {
            return dataSource;
          } else {
            return data.Data;
          }
        },
        total: function (data) {
          return data.Data.length;
        },
      },
      pageSize: 15,
      // serverPaging: false,
      // serverSorting: false,
    },
    selectable: true,
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    columnMenu: false,
    excel: {
      allPages: true
    },
    excelExport: function (e) {
      if ($("#filterTradeDate").val() != "") {
        e.workbook.fileName = "Position Summary on " + ($("#filterTradeDate").val()).toString() + ".xlsx";
      } else {
        e.workbook.fileName = "Position Summary on All Dates.xlsx";
      }
    },
    columns: [
      {
        field: "ClientNumber",
        title: "Client",
        width: 70,
      }, {
        field: "AccountId",
        title: "Account",
        width: 70,
      }, {
        field: "ContractCode",
        title: "Contract",
        width: 70,
      }, {
        field: "ContractExpiry",
        title: "Expiry",
        template: "#= moment(ContractExpiry).format('MMM-YYYY') #",
        attributes: {"class": "align-right"},
        width: 100,
      }, {
        field: "QtyPrior",
        title: "Prior Trading Day",
        width: 100,
        attributes: {class: "align-center ColorPrior"},
      },
      {
        title: "Today",
        attributes: {
          class: "text-center"
        },
        columns: [{
            width: 50,
            field: "QtyBuy",
            title: "Buys",
            template: "#= kendo.toString(QtyBuy, 'N2') #",
            attributes: {
              class: "text-right ColerBuys"
            }
          }, {
            width: 50,
            field: "QtySell",
            title: "Sells",
            template: "#= kendo.toString(QtySell, 'N2') #",
            attributes: {
              class: "text-right ColerSells"
            }
          }]
      },
      {
        field: "QtyPos",
        title: "Net Position",
        attributes: {"class": "align-center ColerPosition"},
        width: 100,
      }, {
        field: "Remark",
        title: "Settlement Price Required?",
        width: 150,
        attributes: {"class": "align-center"},
      }]
  });
}

ps.toggleFilter = function () {
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
    } catch (err) {
    }
  });

  $('.k-pivot').each(function (i, d) {
    $(d).data('kendoPivotGrid').refresh();
  });

  $('.k-chart').each(function (i, d) {
    $(d).data('kendoChart').redraw();
  });
  ps.panel_relocated();
  var Filterps = ps.TitelFilter();
  if (Filterps == " Hide Filter") {
    ps.TitelFilter(" Show Filter");
  } else {
    ps.TitelFilter(" Hide Filter");
  }
}

ps.panel_relocated = function () {
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

ps.getClient = function () {
  var payload = {};
  ps.listClient([]);
  ajaxPost("/reconsummary/getclient ", payload, function (res) {
    var sortCl = Enumerable.From(res.Data).OrderBy("$.Id").ToArray();
    for (var c in sortCl) {
      ps.listClient.push({
        "text": sortCl[c].Id + " - " + sortCl[c].Fname + " " + sortCl[c].Lname,
        "value": sortCl[c].Id
      });
    }
  });
}


$(document).ready(function () {
  $("#filterTradeDate").kendoDatePicker({
    format: 'yyyy-MM-dd',
    open: function() {
      $('.k-weekend a').bind('click', function() {
        return false; 
      }); 
    }
  });

  var param = {};
  ajaxPost("/dashboard/getcurrentdate", param, function (res) {
    var d = new Date(res.Data.CurrentDate);
    var DefaultDate = new Date(res.Data.CurrentDate);
    var day = moment(d).format("ddd");
    if (day != "Mon") {
      DefaultDate.setDate(DefaultDate.getDate() - 1);
    } else {
      DefaultDate.setDate(DefaultDate.getDate() - 3);
    }
    ps.filterTradeDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
    ps.getClient();
    ps.getDataGridPositionSummary();
  });
  $("#export").click(function (e) {
    var grid = $("#GridPositionSummary").data("kendoGrid");
    grid.saveAsExcel();
  });
});