var fxMdl = {
  form: ko.observable(true),
  edit: ko.observable(true),
  loading: ko.observable(false),
  listClient: ko.observableArray([]),
  lsitCurrency: ko.observableArray([]),
  listAccount: ko.observableArray([]),
  listacMap: ko.observableArray([]),
  listDataSource: ko.observableArray([
    {"text": "MANUAL", "value": "MANUAL"},
    {"text": "UPLOAD", "value": "UPLOAD"}
  ]),
  fxtradeform: ko.observable(true),
  // field Filter
  filterClient: ko.observable(""),
  filterAccounts: ko.observable(""),
  filtertradeDate: ko.observable(""),
  filterCurrencyBuy: ko.observable(0),
  filterCurrencySell: ko.observable(0),
  filterDataSource: ko.observable(""),
  // field Data
  id: ko.observable(),
  tradeDate: ko.observable(new Date()),
  accountId: ko.observable(),
  clientNumber: ko.observable(),
  currencyId1: ko.observable(),
  currencyCode1: ko.observable(),
  amount1: ko.observable(),
  currencyId2: ko.observable(),
  currencyCode2: ko.observable(),
  amount2: ko.observable(),
  rate: ko.observable(),
  description: ko.observable(),
  sourceData: ko.observable(),
  reffId: ko.observable(),
  TitelFilter: ko.observable(" Hide Filter"),
  titleModal: ko.observable(""),
  copyToClearer: ko.observable(),
  listClearer: ko.observableArray([]),
};

fxMdl.Search = function () {
  fxMdl.getDataGridFxtrade();
}

fxMdl.Reset = function () {
  fxMdl.filterClient("");
  fxMdl.filterAccounts("");
  fxMdl.filtertradeDate("");
  fxMdl.filterCurrencyBuy(0);
  fxMdl.filterCurrencySell(0);
  fxMdl.filterDataSource("");
  fxMdl.getDataGridFxtrade();
}
fxMdl.ResetForm = function () {
  fxMdl.id("");
  fxMdl.tradeDate(new Date());
  fxMdl.accountId("");
  fxMdl.clientNumber("");
  fxMdl.currencyId1("");
  fxMdl.currencyCode1("");
  fxMdl.amount1("");
  fxMdl.currencyId2("");
  fxMdl.currencyCode2("");
  fxMdl.amount2("");
  fxMdl.rate("");
  fxMdl.description("");
  fxMdl.reffId("");
  fxMdl.copyToClearer(0);
}

fxMdl.Addfxtrade = function () {
  fxMdl.id("");
  fxMdl.tradeDate(new Date());
  fxMdl.accountId("");
  fxMdl.clientNumber("");
  fxMdl.currencyId1("");
  fxMdl.currencyCode1("");
  fxMdl.amount1("");
  fxMdl.currencyId2("");
  fxMdl.currencyCode2("");
  fxMdl.amount2("");
  fxMdl.rate("");
  fxMdl.description("");
  fxMdl.reffId("");
  fxMdl.copyToClearer(0);
  fxMdl.titleModal("New FX Trade");
  $("#mdlConfirm").modal("show");
  $("#nav-dex").css('z-index', '0');
  $("#mdlConfirm").modal({
    backdrop: 'static',
    keyboard: false
  });
  validator = $("#fxtrade").kendoValidator().data("kendoValidator");
  validator.hideMessages();
  fxMdl.fxtradeform(false);
  fxMdl.edit(false);
}

fxMdl.saveData = function () {
  var FeeDate = $("#Date").val() + "T00:00:00.000Z";
  if (fxMdl.tradeDate() != "") {
    FeeDate = toUTC(new Date());
  }
  var param = {
    "Id": "",
    "TradeDateString": $("#Date").val(),
    "TradeDateInt": parseInt($("#Date").val().replace(/-/g, '')),
    "TradeDate": FeeDate,
    "AccountId": fxMdl.accountId().split("~")[0],
    "AccountNumber": fxMdl.accountId().split("~")[2],
    "AccountName": fxMdl.accountId().split("~")[1],
    "ClientNumber": $("#client").val(),
    "currencyId1": parseInt(fxMdl.currencyId1()),
    "currencyCode1": $("#currency1").data("kendoDropDownList").text(),
    "amount1": parseFloat($("#Buy").val()),
    "currencyId2": parseInt(fxMdl.currencyId2()),
    "currencyCode2": $("#currency2").data("kendoDropDownList").text(),
    "amount2": parseFloat($("#Sell").val()),
    "rate": parseFloat(fxMdl.rate()),
    "description": fxMdl.description(),
    "reffId": fxMdl.reffId(),
    "SourceData": "MANUAL",
    "CopyToClearer": parseInt(fxMdl.copyToClearer()),
  }
  var url = "/fxtradeform/savedata";
  var validator = $("#fxtrade").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#fxtrade").kendoValidator().data("kendoValidator");
  }

  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        fxMdl.fxtradeform(true);
        fxMdl.getDataGridFxtrade();
        $("#nav-dex").css('z-index', 'none');
        $("#mdlConfirm").modal("hide");
        swal("Success!", res.Message, "success");
        fxMdl.ResetForm();
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

fxMdl.saveEdit = function () {
  var FeeDate = $("#Date").val() + "T00:00:00.000Z";
  if (fxMdl.tradeDate() != "") {
    FeeDate = toUTC(new Date());
  }
  var param = {
    "Id": fxMdl.id(),
    "TradeDateString": $("#Date").val(),
    "TradeDateInt": parseInt($("#Date").val().replace(/-/g, '')),
    "TradeDate": FeeDate,
    "AccountId": fxMdl.accountId().split("~")[0],
    "AccountNumber": fxMdl.accountId().split("~")[2],
    "AccountName": fxMdl.accountId().split("~")[1],
    "ClientNumber": $("#client").val(),
    "currencyId1": parseInt(fxMdl.currencyId1()),
    "currencyCode1": $("#currency1").data("kendoDropDownList").text(),
    "amount1": parseFloat($("#Buy").val()),
    "currencyId2": parseInt(fxMdl.currencyId2()),
    "currencyCode2": $("#currency2").data("kendoDropDownList").text(),
    "amount2": parseFloat($("#Sell").val()),
    "rate": parseFloat(fxMdl.rate()),
    "description": fxMdl.description(),
    "SourceData": fxMdl.sourceData(),
    "reffId": fxMdl.reffId(),
    "CopyToClearer": parseInt(fxMdl.copyToClearer()),
  }
  var url = "/fxtradeform/savedata";
  var validator = $("#fxtrade").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#fxtrade").kendoValidator().data("kendoValidator");
  }

  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        fxMdl.fxtradeform(true);
        $("#nav-dex").css('z-index', 'none');
        $("#mdlConfirm").modal("hide");
        fxMdl.getDataGridFxtrade();
        swal("Success!", res.Message, "success");
        fxMdl.ResetForm();
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

fxMdl.EditFxTrade = function (id) {
  var param = {
    "Id": id,
  }
  var url = "/fxtradeform/getdataforedit";
  ajaxPost(url, param, function (res) {
//    var dataFxtrade = res.Data.Records[0];
    var dataFxtrade = res.Data;
    load = true;
    fxMdl.fxtradeform(false);
    fxMdl.edit(true);
    fxMdl.titleModal("Update FX Trade");
    $("#mdlConfirm").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
      backdrop: 'static',
      keyboard: false
    });
    fxMdl.id(dataFxtrade.Id);
    fxMdl.tradeDate(dataFxtrade.TradeDateString);
    fxMdl.accountId(dataFxtrade.AccountId + "~" + dataFxtrade.AccountName + "~" + dataFxtrade.AccountNumber);
    fxMdl.clientNumber(dataFxtrade.ClientNumber);
    fxMdl.currencyId1(dataFxtrade.CurrencyId1);
    fxMdl.amount1(dataFxtrade.Amount1);
    fxMdl.currencyId2(dataFxtrade.CurrencyId2);
    fxMdl.amount2(dataFxtrade.Amount2);
    fxMdl.rate(dataFxtrade.Rate);
    fxMdl.description(dataFxtrade.Description);
    fxMdl.sourceData(dataFxtrade.SourceData);
    fxMdl.reffId(dataFxtrade.ReffId);
    fxMdl.copyToClearer(dataFxtrade.CopyToClearer);
  });
}

fxMdl.deleteData = function (Id) {
  var param = {
    Id: Id
  }

  var url = "/fxtradeform/deletedata";
  swal({
    title: "Are you sure ?",
    text: "Are you sure remove this data !",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Yes, I am sure!',
    cancelButtonText: "No, cancel it!",
    closeOnConfirm: false,
    closeOnCancel: false
  },
          function (isConfirm) {
            if (isConfirm) {
              ajaxPost(url, param, function (rest) {
                if (rest.IsError == false) {
                  fxMdl.getDataGridFxtrade();
                  swal("Success!", "Data Success Delete", "success");
                } else {
                  swal("Error!", rest.Message, "error");
                }
              });
            } else {
              swal("Cancelled", "Cancelled", "error");
            }
          });
}

fxMdl.cancelData = function () {
  fxMdl.fxtradeform(true);
  $("#nav-dex").css('z-index', 'none');
  $("#mdlConfirm").modal("hide");
}

fxMdl.getDataGridFxtrade = function () {
  fxMdl.loading(true);
  var param = {
    "ClientId": fxMdl.filterClient(),
    "AccountId": fxMdl.filterAccounts(),
    "TradeDate": fxMdl.filtertradeDate(),
    "CurrencyBuy": parseInt(fxMdl.filterCurrencyBuy()),
    "CurrencySell": parseInt(fxMdl.filterCurrencySell()),
    "SourceData": fxMdl.filterDataSource(),
  };
  var dataSource = [];
  var url = "/fxtradeform/getdata";
  $("#MasterGridFxTrade").html("");
  $("#MasterGridFxTrade").kendoGrid({
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
          fxMdl.loading(false);
          if (data.Data.Count == 0) {
            return dataSource;
          } else {
            return data.Data.Records;
          }
        },
        total: "Data.Count",
      },
      pageSize: 15,
      serverPaging: true,
      serverSorting: true,
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    columnMenu: false,
    columns: [
      {
        field: "SourceData",
        title: "Source Data",
        attributes: {"class": "align-center"},
        width: 100,
        template: "#if(data.TransType=='B'){#<a class='grid-select' href='javascript:fxMdl.EditFxTrade(\"#: Id #\")'>#: SourceData  #</a>#}else{#<div>#: SourceData #</div>#}#",
      },
      {
        field: "TradeDateString",
        title: "Trade Date",
        attributes: {"class": "align-center"},
        width: 100
      },
      {
        field: "ClientNumber",
        title: "Client Number",
        width: 100
      },
      {
        field: "AccountId",
        title: "Account",
        width: 100
      },
      {
        field: "AccountName",
        title: "Account Name",
        width: 100
      },
      {
        field: "TransType",
        title: "B/S",
        width: 40
      },
      {
        field: "CurrencyCode",
        title: "Currency",
        width: 100
      },
      {
        field: "Amount",
        title: "Amount",
        width: 100,
        template: "#= kendo.toString(Amount, 'N2') #",
        attributes: {"class": "align-right"},
      },
      {
        field: "Note",
        title: "Note",
        width: 150,
      },
      {
        field: "",
        title: "",
        width: 50,
        template: "<button data-value='#:Id #' onclick='fxMdl.deleteData(\"#: Id #\")' name='rename' type='button' class='btn btn-danger btn-xs rename'><span class='fa fa-trash'></span></button>",
        attributes: {"class": "align-center"}
      }
    ]
  });
}

fxMdl.totalRate = function (data, event) {
  var buy = parseFloat($("#Buy").val());
  var sell = parseFloat($("#Sell").val());
  var totalrate = buy / sell;
  fxMdl.rate(0);
  if (totalrate != "NaN") {
    fxMdl.rate(totalrate.toFixed(5));
  }
}

fxMdl.getAccount = function () {
  var payload = {};
  fxMdl.listacMap([]);
  ajaxPost("/datamaster/getaccountall ", payload, function (res) {
    for (var c in res) {
      fxMdl.listacMap.push({
        "text": res[c].acc_no_map,
        "value": res[c].acc_no_map
      });
    }
  });
}

fxMdl.getClient = function () {
  fxMdl.listClient([]);
  ajaxPost("/fxtradeform/getclient ", {}, function (res) {
    var sortCl = Enumerable.From(res.Data).OrderBy("$.Id").ToArray();
    for (var c in sortCl) {
      fxMdl.listClient.push({
        "text": sortCl[c].Id + " - " + sortCl[c].Fname + " " + sortCl[c].Lname,
        "value": sortCl[c].Id
      });
    }
    fxMdl.clientNumber(fxMdl.listClient()[0].value);
  });
};

fxMdl.getClearer = function () {
  var payload = {};
  ajaxPost("/manualpaymentreceipt/getclearer", payload, function (res) {
    var sortPayType = Enumerable.From(res.Data).ToArray();
    for (var c in sortPayType) {
      fxMdl.listClearer.push({
        "text": sortPayType[c].ClearerName,
        "value": sortPayType[c].Id
      });
    }
  });
}

var load = true;
fxMdl.clientNumber.subscribe(function (ClientId) {
  $("#account").siblings("span.k-tooltip-validation").hide();
  var payload = {
    "ClientId": ClientId
  };
  fxMdl.listAccount([]);
  ajaxPost("/fxtradeform/getaccountbyclientid", payload, function (res) {
    var sortAcc = Enumerable.From(res.Data).OrderBy("$._id").ToArray();
    for (var c in sortAcc) {
      fxMdl.listAccount.push({
        "text": sortAcc[c].Id + " - " + sortAcc[c].Description,
        "value": sortAcc[c].Id + "~" + sortAcc[c].Description + "~" + sortAcc[c].Acc_no_map
      });

    }
    if (fxMdl.edit() != true) {
      if (fxMdl.listAccount().length != 0) {
        fxMdl.accountId(fxMdl.listAccount()[0].value);
      }
    } else {
      if (load == true) {
        load = false;
      } else {
        fxMdl.accountId(fxMdl.listAccount()[0].value);
      }
    }
  });
});

fxMdl.getCurrency = function () {
  fxMdl.lsitCurrency([]);
  ajaxPost("/fxtradeform/getcurrency ", {}, function (res) {
    var sortCurr = Enumerable.From(res.Data).OrderBy("$.Id").ToArray();
    for (var c in sortCurr) {
      fxMdl.lsitCurrency.push({
        "text": sortCurr[c].Currency_code,
        "value": sortCurr[c].Id
      });
    }
    fxMdl.currencyId1(fxMdl.lsitCurrency()[0].value);
    fxMdl.currencyId2(fxMdl.lsitCurrency()[0].value);
  });
};

fxMdl.toggleFilter = function () {
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
  fxMdl.panel_relocated();
  var FilterTitle = fxMdl.TitelFilter();
  if (FilterTitle == " Hide Filter") {
    fxMdl.TitelFilter(" Show Filter");
  } else {
    fxMdl.TitelFilter(" Hide Filter");
  }
}

fxMdl.panel_relocated = function () {
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
  fxMdl.getAccount();
  fxMdl.getClient();
  fxMdl.getCurrency();
  fxMdl.getClearer();
  fxMdl.getDataGridFxtrade();
});