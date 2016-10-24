var ps = {
    loading : ko.observable(false),
    TitelFilter : ko.observable(" Hide Filter"),
	// variable field
	Id : ko.observable(),
	//var Filter
    filterTradeDate : ko.observable(""),
	filterStatus : ko.observable(1),
};

ps.Search = function(){
	ps.getDataGridDailyNlvSummary();
}

ps.Reset = function(){
    ps.filterTradeDate(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
    ps.filterStatus(1);
    $('#ftrstatus').bootstrapSwitch('state', true);
	ps.getDataGridDailyNlvSummary();
}

ps.getDataGridDailyNlvSummary = function(){
    ps.loading(true);
    var stts = $('#ftrstatus').bootstrapSwitch('state')
    if( stts == false){
        ps.filterStatus(0);
    }else{
        ps.filterStatus(1)
    }
    var param =  {
        "TradeDate" : ps.filterTradeDate(), //"2016-07-08", 
        "Status" : parseInt(ps.filterStatus()),
    };
    var dataSource = [];
    var url = "/reconsummary/dailynlvsummary";
    $("#GridDailyNlvSummary").html("");
    $("#GridDailyNlvSummary").kendoGrid({
            dataSource: {
                    transport: {
                        read: {
                            url: url,
                            data: param,
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json",
                        },
                        parameterMap: function(data) {                                 
                           return JSON.stringify(data);                                 
                        },
                    },
                    schema: {
                        data: function(data) {
                            ps.loading(false);
                            if (data.Data.Count == 0) {
                                return dataSource;
                            } else {
                                return data.Data.Records;
                            }
                        },
                        total: function(data) {
                            return data.Data.Count;
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
                    e.workbook.fileName = "Summary Account NLV on " + ($("#filterTradeDate").val()).toString() + ".xlsx";
                  } else {
                    e.workbook.fileName = "Summary Account NLV on All Dates.xlsx";
                  }
                },
        columns: [
          {
            field: "AccountId",
            title: "Account ID",
            width: 150,
            // locked: true,
            // lockable: false,
          },
          {
            field: "AccountName",
            title: "Account Name",
            width: 200,
            // locked: true,
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

ps.toggleFilter = function(){
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
  ps.panel_relocated();
    var Filterps = ps.TitelFilter();
    if (Filterps == " Hide Filter"){
        ps.TitelFilter(" Show Filter");
    }else{
        ps.TitelFilter(" Hide Filter");
    }
}

ps.panel_relocated = function(){
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
    var start = $("#filterTradeDate").kendoDatePicker({
      format: 'yyyy-MM-dd',
    }).data("kendoDatePicker");
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
    });
	ps.getDataGridDailyNlvSummary();
    $("#export").click(function (e) {
        var grid = $("#GridDailyNlvSummary").data("kendoGrid");
        grid.saveAsExcel();
    });
});