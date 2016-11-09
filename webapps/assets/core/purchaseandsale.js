pcs ={

  tradeDate: ko.observable(moment(new Date).format("YYYY-MM-DD")),
  AccountId: ko.observable([]),
  Client: ko.observable([]),
  ValueClient: ko.observable(""),
  ValueAcc: ko.observable(""),
  loading: ko.observable(false),
  getDatawithBtn : ko.observable(true),
  TitelFilter : ko.observable(" Hide Filter")
}

pcs.resetFilter = function(){
  pcs.tradeDate(moment(new Date).format("YYYY-MM-DD"));
  pcs.ValueClient("");
  pcs.ValueAcc("");
  pcs.loadFilter();
  pcs.getDatawithBtn(true);
  // pcs.loadGridPurchaseSale();
}

pcs.loadFilter = function(){
  pcs.AccountId([]);
  pcs.Client([]);
  ajaxPost("/databrowser/getaccountid", {}, function (res){
    
    for(var a in res){
      pcs.AccountId().push({
        "text" : res[a]._id.accountid,
        "value" : res[a]._id.accountid
      });
    }
    $("#Accountid").html("");
    $("#Accountid").kendoDropDownList({
      dataSource: Enumerable.From(pcs.AccountId()).OrderBy("$.text").ToArray(),
      optionLabel: "Select Account",
      dataValueField : "value",
      dataTextField : "text",
      filter: 'startswith'
    });
  });

  ajaxPost("/databrowser/getclientid",{} , function (res){
    for (var c in res){
      if (res[c]._id.clientnumber != null){
        pcs.Client().push({
          "text" : res[c]._id.clientnumber,
          "value" : res[c]._id.clientnumber
         });
      }
    }
    $("#client").html("");
    $("#client").kendoDropDownList({
      dataSource: Enumerable.From(pcs.Client()).OrderBy("$.text").ToArray(),
      optionLabel: "Select Client",
      dataValueField : "value",
      dataTextField : "text",
      filter: 'startswith'
    });
  });
}

  pcs.tradeDate.subscribe(function(value){
      if(model.View() != "false"){
          pcs.loadGridPurchaseSale();
          }
  });

  pcs.ValueAcc.subscribe(function(value){
      if(model.View() != "false" && value != ""){
          pcs.loadGridPurchaseSale();
        }
  });

  pcs.ValueClient.subscribe(function(value){
      if(model.View() != "false" && value != ""){
        pcs.loadGridPurchaseSale();
      }
  });

pcs.loadGridPurchaseSale= function() {
  if(model.View() != "false"){
    $(".k-button").show();
  }else{
    $(".k-button").hide();
  }
  pcs.loading(true)
  var params = {
    rptdateint: pcs.tradeDate(),
    client: pcs.ValueClient(),
    accountid: pcs.ValueAcc()
  };
  pcs.loading(true);
  var emptyData = [];
  $("#purchaseandsale").html("");
  $("#purchaseandsale").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "/databrowser/readpurchaseandsales",
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
          pcs.loading(false);
          pcs.getDatawithBtn(false);
          if (data.Data.Count == 0){
            return emptyData;
          }else{
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
    excel: {
      allPages: true,
      fileName : "Purchases and Sales.xlsx"
    },
    columns: [ {
        field: "TransactionDate",
        title: "Trade Date",
        width: 80,
        template: "#= moment(TransactionDate).format('YYYY-MM-DD') #",
        attributes: {
          "class": "align-center"
        }
      },{
        field: "Clientnumber",
        title: "Client Number",
        width: 100
      },{
        field: "AccountID",
        title: "Account",
        width: 70
      },{
        field: "Fullname",
        title: "Full Name",
        width: 230
      },{
        field: "ProductID",
        title: "Product ID",
        width: 90
      },{
        field: "ContractExpiry",
        title: "Contract Expiry",
        width: 100,
        template: "#= moment(ContractExpiry).format('MMM-YY') #",
        attributes: {
          "class": "align-center"
        }
      },{
        field: "TransactionID",
        title: "Transaction ID",
        width: 100
      },{
        field: "Currency",
        title: "Currency",
        width: 70
      },{
        field: "TransactionType",
        title: "B/S",
        width: 50,
      },{
        field: "Qty",
        title: "Qty",
        width: 50,
        attributes: {
          "class": "align-right"
        }
      },{
        field: "PriceReport",
        title: "Price",
        width: 80,
        template: "#= kendo.toString(PriceReport, 'N4') #",
        attributes: {
          "class": "align-right"
        }
      },{
        field: "ContractValue",
        title: "Contract Value",
        width: 80,
        template: "#= kendo.toString(ContractValue, 'N2') #",
        attributes: {
        "class": "align-right"
        }
      }]
  });
}
pcs.toggleFilter = function(){
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
  pcs.panel_relocated();
    var FilterTitle = pcs.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        pcs.TitelFilter(" Show Filter");
    }else{
        pcs.TitelFilter(" Hide Filter");
    }
}

pcs.panel_relocated = function(){
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

pcs.loadTradeDate = function(){
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
     pcs.loadGridPurchaseSale();
  });
}

$(document).ready(function () {
  pcs.loadFilter();
  $("#TradeDate").kendoDatePicker({
    value : moment(new Date).format("YYYY-MM-DD"),
    format: "yyyy-MM-dd",
  }).data("kendoDatePicker");
  pcs.loadTradeDate();
  $("#export").click(function (e) {
    var grid = $("#purchaseandsale").data("kendoGrid");
    grid.saveAsExcel();
  });
});