des ={

  tradeDate: ko.observable(""),
  AccountId: ko.observable([]),
  Client: ko.observable([]),
  ValueClient: ko.observable(""),
  ValueAcc: ko.observable("")
}

des.resetFilter = function(){
  des.tradeDate("");
  des.ValueClient("");
  des.ValueAcc("");
}

des.loadFilter = function(){
  ajaxPost("/databrowser/getaccountid", {}, function (res){
    for(var i=0; i< res.length;i++){
      des.AccountId().push(res[i]._id.accountid);
    }
    $("#Accountid").kendoDropDownList({
      dataSource: des.AccountId().sort(),
      optionLabel: "Select Accountid",
      filter: 'startswith'
    });
  });
  ajaxPost("/databrowser/getclientid",{} , function (res){
    console.log(res);
    for(var i=0; i< res.length;i++){
      des.Client().push(res[i]._id.client);
    }
    $("#client").kendoDropDownList({
      dataSource: des.Client().sort(),
      optionLabel: "Select Client",
      filter: 'startswith'
    });
  });
}

des.loadGridTradeFee= function() {
  var params = {
    rptdateint: des.tradeDate(),
    client: des.ValueClient(),
    accountid: des.ValueAcc()
  };
  
  var emptyData = [];
  $("#DeskFee").html("");
  $("#DeskFee").kendoGrid({
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
          return JSON.stringify(data);
        },
      },
      schema: {
        //data: function (data) {
        //   if (data.Data.Count == 0) {
        //     x.qtyBuy(0);
        //     x.qtySale(0);
        //     x.sumQty(0);
        //     x.trxBuy(0);
        //     x.trxCount(0);
        //     x.trxSale(0);
        //     return emptyData;
        //   } else {
        //     var summary = data.Data.Summary
        //     //x.qtyBuy(summary.qtyBuy);
        //     x.qtySale(summary.qtySale);
        //     x.sumQty(summary.sumQty);
        //     x.trxBuy(summary.trxBuy);
        //     x.trxCount(summary.trxCount);
        //     x.trxSale(summary.trxSale);
        //     return data.Data.Records;
        //   }
        //},
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
    excel: {
      allPages: true
    },
    columns: [ {
        field: "Client",
        title: "Client",
        //width: 120
      }, {
        field: "Fullname",
        title: "Fullname",
        //width: 120
      },{
        field: "Tradedate",
        title: "Tade Date",
        //width: 120
      },
       {
        field: "TradePrice",
        title: "Trade Price",
        //width: 120
      },
       {
        field: "SettlementPrice",
        title: "Settlement Price",
        //width: 120
      },
       {
        field: "TransactionType",
        title: "Transaction Type",
        //width: 120
      },
       {
        field: "NationalValue",
        title: "National Value",
        //width: 120
      }]
  });
}

$(document).ready(function () {
  des.loadFilter();
  $("#TradeDate").kendoDatePicker({
    format: "yyyy-MM-dd",
  }).data("kendoDatePicker");
  des.loadGridTradeFee();
  $("#export").click(function (e) {
    var grid = $("#DeskFee").data("kendoGrid");
    grid.saveAsExcel();
  });
});