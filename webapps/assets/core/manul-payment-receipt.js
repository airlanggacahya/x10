var payReceip = {
  formPayRecp: ko.observable(true),
  Edit: ko.observable(true),
  loading: ko.observable(false),
  // variable field
  Id: ko.observable(),
  Date: ko.observable(),
  valueDate: ko.observable(),
  account: ko.observable(),
  currency: ko.observable(),
  paymentOrReceipt: ko.observable(0.00),
  paymentOrReceiptType: ko.observable(),
  paymentOrReceiptDescription: ko.observable(),
  internalNote: ko.observable(),
  fileLocation: ko.observable(),
  copyToClearer: ko.observable(),
  flow: ko.observable("In-Flow/Out-Flow"),
  cleant: ko.observable(),
  filePath: ko.observable(""),
  fileName: ko.observable(""), // string
  sourceData: ko.observable(""),
  //var Filter
  filterClient: ko.observable(""),
  filterAccounts: ko.observable(""),
  filtertradeDate: ko.observable(""),
  filterPaymentReceipt: ko.observable(""),
  filterCurrency: ko.observable(""),
  filterDataSource: ko.observable(""),
  // var list
  listCleant: ko.observableArray([]),
  lsitCurrency: ko.observableArray([]),
  listAccount: ko.observableArray([]),
  listpaytype: ko.observableArray([]),
  listacMap: ko.observableArray([]),
  listClearer: ko.observableArray([]),
  listDataSource: ko.observableArray([
    {"text": "MANUAL", "value": "MANUAL"},
    {"text": "UPLOAD", "value": "UPLOAD"}
  ]),
  TitelFilter: ko.observable(" Show Filter"),
  titleModal: ko.observable(""),
};

payReceip.Search = function () {
  payReceip.getDataGridPayReceip();
}
payReceip.RefreshGrid = function () {
  $("#MasterGridpayReceip").data("kendoGrid").dataSource.read();
  $("#MasterGridpayReceip").data("kendoGrid").refresh();
}
payReceip.Reset = function () {
  payReceip.Id("");
  payReceip.filterClient("");
  payReceip.filterAccounts("");
  payReceip.filtertradeDate("");
  payReceip.filterPaymentReceipt("");
  payReceip.filterCurrency("");
  payReceip.filterDataSource("");
  payReceip.copyToClearer(0);
//  $('#copyToClearer').bootstrapSwitch('state', false);
  payReceip.getCleant();
  payReceip.getCurrencyData();
  payReceip.getPaytype();
  payReceip.getDataGridPayReceip();
}

payReceip.ClearNewPayment = function () {
  console.log("===========================================")
  $("#Date").val("");
  $("#valueDate").val("");
  $("#valueDate").data("kendoDatePicker").enable();
  $("#Date").data("kendoDatePicker").enable();
  $("#cleant").data("kendoDropDownList").enable();
  $("#account").data("kendoDropDownList").enable();
  $("#currency").data("kendoDropDownList").enable();
  $("#currency").prop("readonly", false);
  $("#paymentOrReceipt").data("kendoNumericTextBox").enable();
  $("#paymentOrReceiptType").data("kendoDropDownList").enable();
  $("#paymentOrReceiptDescription").prop("readonly", false);
  $("#internalNote").prop("readonly", false);
  payReceip.copyToClearer(0);
  payReceip.getCleant();
  payReceip.getCurrencyData();
  payReceip.getPaytype();
  payReceip.getAccount();
  var url = "/processlog/getpaymentreceiptmindate";
  ajaxPost(url, "", function (res) {
    minDate = new Date(res.Data);
    $("#Date").kendoDatePicker({
      min: minDate,
      format: 'yyyy-MM-dd'
    });
    $("#valueDate").kendoDatePicker({
      min: minDate,
      format: 'yyyy-MM-dd'
    });
    load = false;
    payReceip.formPayRecp(false);
    payReceip.Edit(false);
    payReceip.Id("");
    payReceip.Date("");
    payReceip.valueDate("");
    payReceip.paymentOrReceipt("");
    payReceip.paymentOrReceiptDescription("");
    payReceip.internalNote("");
    $("#saveForm").show(2000);
  });
}

payReceip.AddPayRecp = function () {
  $("#valueDate").data("kendoDatePicker").enable();
  $("#Date").data("kendoDatePicker").enable();
  $("#cleant").data("kendoDropDownList").enable();
  $("#account").data("kendoDropDownList").enable();
  $("#currency").data("kendoDropDownList").enable();
  $("#currency").prop("readonly", false);
  $("#paymentOrReceipt").data("kendoNumericTextBox").enable();
  $("#paymentOrReceiptType").data("kendoDropDownList").enable();
  $("#paymentOrReceiptDescription").prop("readonly", false);
  $("#internalNote").prop("readonly", false);
  payReceip.copyToClearer(0);
  payReceip.getCleant();
  payReceip.getCurrencyData();
  payReceip.getPaytype();
  payReceip.getAccount();

  load = false;
  payReceip.formPayRecp(false);
  payReceip.Edit(false);
  payReceip.Id("");
  payReceip.Date("");
  payReceip.valueDate("");
  payReceip.paymentOrReceipt("");
  payReceip.paymentOrReceiptDescription("");
  payReceip.internalNote("");
  $("#saveForm").show(2000);

  payReceip.titleModal("New Payment / Receipt (desk fee)");
  $("#mdlConfirm").modal("show");
  $("#nav-dex").css('z-index', '0');
  $("#mdlConfirm").modal({
    backdrop: 'static',
    keyboard: false
  });
}

payReceip.CopyToClearer = function () {
  $('#copyToClearer').on('switchChange.bootstrapSwitch', function (event, state) {
    console.log(state);
    if (state == false) {
      payReceip.copyToClearer("0");
    } else {
      payReceip.copyToClearer("1");
    }
  });

}

payReceip.cancelData = function () {
  payReceip.formPayRecp(true);
  payReceip.Edit(false);
  var validator = $("#paymentReceip").kendoValidator().data("kendoValidator");
  validator.hideMessages();
  $("#nav-dex").css('z-index', 'none');
  $("#mdlConfirm").modal("hide");
}

var load = true;
payReceip.EditPayReceip = function (idExchange) {
  payReceip.formPayRecp(false);
  payReceip.Edit(true);
  var param = {
    "Id": idExchange,
  }
  var url = "/manualpaymentreceipt/getdata";
  ajaxPost(url, param, function (res) {
    var dataPayRecp = res.Data.Records[0];
    url = "/processlog/getpaymentreceiptmindate";
    ajaxPost(url, "", function (res1) {
      checkDate = new Date(res1.Data)
      load = true;
      payReceip.Edit(true);
      payReceip.titleModal("Update Payment / Receipt (desk fee)");
      $("#mdlConfirm").modal("show");
      $("#nav-dex").css('z-index', '0');
      $("#mdlConfirm").modal({
        backdrop: 'static',
        keyboard: false
      });
      dataDate = new Date(dataPayRecp.FeeDate);
      if (checkDate >= dataDate) {
        //Disable Control
        $("#valueDate").data("kendoDatePicker").readonly();
        $("#Date").data("kendoDatePicker").readonly();
        $("#cleant").data("kendoDropDownList").readonly();
        $("#account").data("kendoDropDownList").readonly();
        $("#currency").data("kendoDropDownList").readonly();
        $("#currency").prop("readonly", true);
        $("#paymentOrReceipt").data("kendoNumericTextBox").readonly();
        $("#paymentOrReceiptType").data("kendoDropDownList").readonly();
        $("#paymentOrReceiptDescription").prop("readonly", true);
        $("#internalNote").prop("readonly", true);
        $("#saveForm").hide();
      } else {
        $("#valueDate").data("kendoDatePicker").enable();
        $("#Date").data("kendoDatePicker").enable();
        $("#cleant").data("kendoDropDownList").enable();
        $("#account").data("kendoDropDownList").enable();
        $("#currency").data("kendoDropDownList").enable();
        $("#currency").prop("readonly", false);
        $("#paymentOrReceipt").data("kendoNumericTextBox").enable();
        $("#paymentOrReceiptType").data("kendoDropDownList").enable();
        $("#paymentOrReceiptDescription").prop("readonly", false);
        $("#internalNote").prop("readonly", false);
        $("#saveForm").show();
      }
      payReceip.Id(dataPayRecp.Id);
      payReceip.Date(moment(new Date(dataPayRecp.TradeDateString)).format('YYYY-MM-DD'));
      payReceip.valueDate(moment(new Date(dataPayRecp.FeeDate)).format('YYYY-MM-DD'));
      payReceip.cleant(dataPayRecp.ClientNumber);
      payReceip.account(dataPayRecp.AccountId + "~" + dataPayRecp.AccountName + "~" + dataPayRecp.AccountNumber);
      payReceip.currency(dataPayRecp.CurrencyId);
      payReceip.paymentOrReceipt(dataPayRecp.FeeAmount);
      payReceip.paymentOrReceiptType(dataPayRecp.FxCode1);
      payReceip.paymentOrReceiptDescription(dataPayRecp.FeeDescription1);
      payReceip.filePath(dataPayRecp.FilePath);
      payReceip.fileName(dataPayRecp.FileName);
      payReceip.internalNote(dataPayRecp.InternalNote);
      payReceip.sourceData(dataPayRecp.SourceData);
      if (dataPayRecp.FeeAmount > 0) {
        payReceip.flow("In-Flow");
      } else {
        payReceip.flow("Out-Flow");
      }
    })
  });
}

payReceip.saveData = function () {
  var FeeDate = $("#Date").val() + "T00:00:00.000Z";
  if (payReceip.valueDate() != "") {
    FeeDate = toUTC(new Date(payReceip.valueDate()));
  }
  var DateSouce = toUTC(new Date($("#Date").val())).substring(2, 10).split("-");
  var FeeDateSource = DateSouce[2] + "." + DateSouce[1] + "." + DateSouce[0];

  var param = {
    "Id": "",
    "TradeDateString": $('#Date').val(), // string
    // "ValueDateString" :"",// string
    "FeeDateSource": FeeDateSource, // string
    "FeeDate": FeeDate, // time.Time
    "AccountId": $("#account").val().split("~")[0], // string
    "AccountNumber": $("#account").val().split("~")[2], // string
    "AccountName": $("#account").val().split("~")[1], // string
    "ClientNumber": payReceip.cleant(), // string
    "FxCode1": parseInt(payReceip.paymentOrReceiptType()), // int
    "CurrencyId": parseInt(payReceip.currency()), // int
    "CopyToClearer": parseInt(payReceip.copyToClearer()), // int
    "CurrencyCode": $("#currency").data("kendoDropDownList").text(), // string
    "FeeAmount": payReceip.paymentOrReceipt(), // float64
    "FeeDescription1": payReceip.paymentOrReceiptDescription(), // string
    "FeeDescription2": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[0], // string
    "FeeDescription3": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[1], // string
    "FilePath": "", // string
    "FileName": "", // string
    "InternalNote": payReceip.internalNote(),
    "SourceData": "MANUAL"
  }
  var url = "/manualpaymentreceipt/savedata";
  var validator = $("#paymentReceip").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#paymentReceip").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        payReceip.formPayRecp(true);
        $("#MasterGridpayReceip").data("kendoGrid").dataSource.read();
        $("#MasterGridpayReceip").data("kendoGrid").refresh();
        $("#nav-dex").css('z-index', 'none');
        $("#mdlConfirm").modal("hide");
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

payReceip.saveDataandNew = function () {
  var FeeDate = $("#Date").val() + "T00:00:00.000Z";
  if (payReceip.valueDate() != "") {
    FeeDate = toUTC(new Date(payReceip.valueDate()));
  }

  var DateSouce = toUTC(new Date($("#Date").val())).substring(2, 10).split("-");
  var FeeDateSource = DateSouce[2] + "." + DateSouce[1] + "." + DateSouce[0];

  var param = {
    "Id": "",
    "TradeDateString": $('#Date').val(), // string
    "FeeDateSource": FeeDateSource, // string
    "FeeDate": FeeDate, // time.Time
    "AccountId": $("#account").val().split("~")[0], // string
    "AccountNumber": $("#account").val().split("~")[2], // string
    "AccountName": $("#account").val().split("~")[1], // string
    "ClientNumber": payReceip.cleant(), // string
    "FxCode1": parseInt(payReceip.paymentOrReceiptType()), // int
    "CurrencyId": parseInt(payReceip.currency()), // int
    "CopyToClearer": parseInt(payReceip.copyToClearer()), // int
    "CurrencyCode": $("#currency").data("kendoDropDownList").text(), // string
    "FeeAmount": payReceip.paymentOrReceipt(), // float64
    "FeeDescription1": payReceip.paymentOrReceiptDescription(), // string
    "FeeDescription2": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[0], // string
    "FeeDescription3": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[1], // string
    "FilePath": "", // string
    "FileName": "", // string
    "InternalNote": payReceip.internalNote(),
    "SourceData": "MANUAL"
  }
  var url = "/manualpaymentreceipt/savedata";
  var validator = $("#paymentReceip").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#paymentReceip").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        $("#MasterGridpayReceip").data("kendoGrid").dataSource.read();
        $("#MasterGridpayReceip").data("kendoGrid").refresh();
        payReceip.ClearNewPayment();
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

payReceip.saveDataandDuplicate = function () {
  var FeeDate = $("#Date").val() + "T00:00:00.000Z";
  if (payReceip.valueDate() != "") {
    FeeDate = toUTC(new Date(payReceip.valueDate()));
  }
  var DateSouce = toUTC(new Date($("#Date").val())).substring(2, 10).split("-");
  var FeeDateSource = DateSouce[2] + "." + DateSouce[1] + "." + DateSouce[0];

  var param = {
    "Id": "",
    "TradeDateString": $('#Date').val(), // string
    "FeeDateSource": FeeDateSource, // string
    "FeeDate": FeeDate, // time.Time
    "AccountId": $("#account").val().split("~")[0], // string
    "AccountNumber": $("#account").val().split("~")[2], // string
    "AccountName": $("#account").val().split("~")[1], // string
    "ClientNumber": payReceip.cleant(), // string
    "FxCode1": parseInt(payReceip.paymentOrReceiptType()), // int
    "CurrencyId": parseInt(payReceip.currency()), // int
    "CopyToClearer": parseInt(payReceip.copyToClearer()), // int
    "CurrencyCode": $("#currency").data("kendoDropDownList").text(), // string
    "FeeAmount": payReceip.paymentOrReceipt(), // float64
    "FeeDescription1": payReceip.paymentOrReceiptDescription(), // string
    "FeeDescription2": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[0], // string
    "FeeDescription3": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[1], // string
    "FilePath": "", // string
    "FileName": "", // string
    "InternalNote": payReceip.internalNote(),
    "SourceData": "MANUAL"
  }
  var url = "/manualpaymentreceipt/savedata";
  var validator = $("#paymentReceip").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#paymentReceip").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        $("#MasterGridpayReceip").data("kendoGrid").dataSource.read();
        $("#MasterGridpayReceip").data("kendoGrid").refresh();
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

payReceip.saveEdit = function () {
  var FeeDate = $("#Date").val() + "T00:00:00.000Z"
  if (payReceip.valueDate() != "") {
    FeeDate = $("#valueDate").val() + "T00:00:00.000Z"
  }
  var DateSouce = toUTC(new Date($("#Date").val())).substring(2, 10).split("-");
  var FeeDateSource = DateSouce[2] + "." + DateSouce[1] + "." + DateSouce[0];

  var param = {
    "Id": payReceip.Id(),
    "TradeDateString": $('#Date').val(), // string
    // "ValueDateString" :"",// string
    "FeeDateSource": FeeDateSource, // string
    "FeeDate": FeeDate, // time.Time
    "AccountId": $("#account").val().split("~")[0], // string
    "AccountNumber": $("#account").val().split("~")[2], // string
    "AccountName": $("#account").val().split("~")[1], // string
    "ClientNumber": payReceip.cleant(), // string
    "FxCode1": parseInt(payReceip.paymentOrReceiptType()), // int
    "CurrencyId": parseInt(payReceip.currency()), // int
    "CurrencyCode": $("#currency").data("kendoDropDownList").text(), // string
    "FeeAmount": payReceip.paymentOrReceipt(), // float64
    "CopyToClearer": 0,
    "FeeDescription1": payReceip.paymentOrReceiptDescription(), // string
    "FeeDescription2": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[0], // string
    "FeeDescription3": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[1], // string
    "FilePath": payReceip.filePath(), // string
    "FileName": payReceip.fileName(), // string
    "InternalNote": payReceip.internalNote(),
    "SourceData": payReceip.sourceData(),
  }
  var url = "/manualpaymentreceipt/savedata";
  var validator = $("#paymentReceip").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#paymentReceip").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        payReceip.formPayRecp(true);
        $("#MasterGridpayReceip").data("kendoGrid").dataSource.read();
        $("#MasterGridpayReceip").data("kendoGrid").refresh();
        $("#nav-dex").css('z-index', 'none');
        $("#mdlConfirm").modal("hide");
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

payReceip.saveEditandNew = function () {
  var FeeDate = $("#Date").val() + "T00:00:00.000Z"
  if (payReceip.valueDate() != "") {
    FeeDate = $("#valueDate").val() + "T00:00:00.000Z"
  }
  var DateSouce = toUTC(new Date($("#Date").val())).substring(2, 10).split("-");
  var FeeDateSource = DateSouce[2] + "." + DateSouce[1] + "." + DateSouce[0];

  var param = {
    "Id": payReceip.Id(),
    "TradeDateString": $('#Date').val(), // string
    "FeeDateSource": FeeDateSource, // string
    "FeeDate": FeeDate, // time.Time
    "AccountId": $("#account").val().split("~")[0], // string
    "AccountNumber": $("#account").val().split("~")[2], // string
    "AccountName": $("#account").val().split("~")[1], // string
    "ClientNumber": payReceip.cleant(), // string
    "FxCode1": parseInt(payReceip.paymentOrReceiptType()), // int
    "CurrencyId": parseInt(payReceip.currency()), // int
    "CurrencyCode": $("#currency").data("kendoDropDownList").text(), // string
    "FeeAmount": payReceip.paymentOrReceipt(), // float64
    "CopyToClearer": 0,
    "FeeDescription1": payReceip.paymentOrReceiptDescription(), // string
    "FeeDescription2": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[0], // string
    "FeeDescription3": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[1], // string
    "FilePath": payReceip.filePath(), // string
    "FileName": payReceip.fileName(), // string
    "InternalNote": payReceip.internalNote(),
    "SourceData": payReceip.sourceData(),
  }
  var url = "/manualpaymentreceipt/savedata";
  var validator = $("#paymentReceip").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#paymentReceip").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        payReceip.formPayRecp(true);
        $("#MasterGridpayReceip").data("kendoGrid").dataSource.read();
        $("#MasterGridpayReceip").data("kendoGrid").refresh();
        swal("Success!", res.Message, "success");
        payReceip.Edit(false);
        payReceip.titleModal("New Payment / Receipt (desk fee)");
        payReceip.ClearNewPayment();
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

payReceip.saveEditandDuplicate = function () {
  var FeeDate = $("#Date").val() + "T00:00:00.000Z"
  if (payReceip.valueDate() != "") {
    FeeDate = $("#valueDate").val() + "T00:00:00.000Z"
  }
  var DateSouce = toUTC(new Date($("#Date").val())).substring(2, 10).split("-");
  var FeeDateSource = DateSouce[2] + "." + DateSouce[1] + "." + DateSouce[0];

  var param = {
    "Id": payReceip.Id(),
    "TradeDateString": $('#Date').val(), // string
    "FeeDateSource": FeeDateSource, // string
    "FeeDate": FeeDate, // time.Time
    "AccountId": $("#account").val().split("~")[0], // string
    "AccountNumber": $("#account").val().split("~")[2], // string
    "AccountName": $("#account").val().split("~")[1], // string
    "ClientNumber": payReceip.cleant(), // string
    "FxCode1": parseInt(payReceip.paymentOrReceiptType()), // int
    "CurrencyId": parseInt(payReceip.currency()), // int
    "CurrencyCode": $("#currency").data("kendoDropDownList").text(), // string
    "FeeAmount": payReceip.paymentOrReceipt(), // float64
    "CopyToClearer": 0,
    "FeeDescription1": payReceip.paymentOrReceiptDescription(), // string
    "FeeDescription2": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[0], // string
    "FeeDescription3": $("#paymentOrReceiptType").data("kendoDropDownList").text().split(" - ")[1], // string
    "FilePath": payReceip.filePath(), // string
    "FileName": payReceip.fileName(), // string
    "InternalNote": payReceip.internalNote(),
    "SourceData": payReceip.sourceData(),
  }
  var url = "/manualpaymentreceipt/savedata";
  var validator = $("#paymentReceip").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#paymentReceip").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        payReceip.formPayRecp(true);
        $("#MasterGridpayReceip").data("kendoGrid").dataSource.read();
        $("#MasterGridpayReceip").data("kendoGrid").refresh();
        payReceip.Edit(false);
        payReceip.titleModal("New Payment / Receipt (desk fee)");
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

payReceip.filterClient.subscribe(function (value) {
  if (model.View() != "false" && payReceip.filterClient() != "") {
    payReceip.getDataGridPayReceip();
  }
});

payReceip.filterAccounts.subscribe(function (value) {
  if (model.View() != "false" && payReceip.filterAccounts() != "") {
    payReceip.getDataGridPayReceip();
  }
});

payReceip.filtertradeDate.subscribe(function (value) {
  if (model.View() != "false" && payReceip.filtertradeDate() != "") {
    payReceip.getDataGridPayReceip();
  }
});

payReceip.filterPaymentReceipt.subscribe(function (value) {
  if (model.View() != "false" && payReceip.filterPaymentReceipt() != "") {
    payReceip.getDataGridPayReceip();
  }
});

payReceip.filterCurrency.subscribe(function (value) {
  if (model.View() != "false" && payReceip.filterCurrency() != "") {
    payReceip.getDataGridPayReceip();
  }
});

payReceip.filterDataSource.subscribe(function (value) {
  if (model.View() != "false" && payReceip.filterDataSource() != "") {
    payReceip.getDataGridPayReceip();
  }
});

// var userid = model.User();
// var gcpay = new GridColumn('role_payment', userid, 'MasterGridpayReceip');
payReceip.getDataGridPayReceip = function () {
  payReceip.loading(true);
  // var TradeDate = "";
  // if ($("#filtertradeDate").data("kendoDatePicker")._oldText != "") {
  //   var DateSouce = $("#filtertradeDate").data("kendoDatePicker")._oldText.split("-");
  //   TradeDate = DateSouce[0] + "-" + DateSouce[1] + "-" + DateSouce[2];
  // }

  var param = {
    "ClientId": payReceip.filterClient(),
    "AccountId": payReceip.filterAccounts(),
    "TradeDate": payReceip.filtertradeDate(),
    "PaymentReceiptType": parseInt(payReceip.filterPaymentReceipt()),
    "CurrencyId": parseInt(payReceip.filterCurrency()),
    "SourceData": payReceip.filterDataSource(),
  };
  var dataSource = [];
  var url = "/manualpaymentreceipt/getdata";
  $("#MasterGridpayReceip").html("");
  $("#MasterGridpayReceip").kendoGrid({
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
          payReceip.loading(false);
          $("#filtertradeDate").kendoDatePicker({
            format: 'yyyy-MM-dd',
            depth: 'year',
            min: moment(new Date(data.Data.LastDate)).format('YYYY-MM-DD')
          });

          $("#Date").kendoDatePicker({
            format: 'yyyy-MM-dd',
            depth: 'year',
            min: moment(new Date(data.Data.LastDate)).format('YYYY-MM-DD')
          });

          $("#valueDate").kendoDatePicker({
            format: 'yyyy-MM-dd',
            depth: 'year',
            min: moment(new Date(data.Data.LastDate)).format('YYYY-MM-DD')
          });

          // gcpay.Init();
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
    // columnHide: function(e) {
    //     gcpay.RemoveColumn(e.column.field);
    // },
    // columnShow: function(e) {
    //     gcpay.AddColumn(e.column.field);
    // },
    columns: [
      {
        field: "SourceData",
        title: "Source Data",
        attributes: {"class": "align-center"},
        width: 100,
        template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:payReceip.EditPayReceip(\"#: Id #\")'>#: SourceData  #</a>#}else{#<div>#: SourceData #</div>#}#",
      },
      {
        field: "FeeDate",
        title: "Fee Date",
        width: 100,
        attributes: {"class": "align-center"},
        template: "#= moment(FeeDate).format('YYYY-MM-DD') #",
      },
      {
        field: "FeeDateSource",
        title: "Fee Date Source",
        attributes: {"class": "align-center"},
        width: 100,
      },
      {
        field: "ClientNumber",
        title: "Client Number",
        width: 100,
      },
      {
        field: "AccountId",
        title: "Account",
        width: 100,
      },
//      {
//        field: "AccountNumber",
//        title: "Account Number",
//        width: 100,
//      },
      {
        field: "AccountName",
        title: "Account Name",
        width: 150,
      },
      {
        field: "CurrencyCode",
        title: "Currency",
        width: 60,
      },
      {
        field: "FeeAmount",
        title: "Fee Amount",
        width: 100,
        template: "#= kendo.toString(FeeAmount, 'N2') #",
        attributes: {"class": "align-right"},
      },
      {
        field: "FeeDescription1",
        title: "Fee Desc 1",
        width: 100,
      },
      {
        field: "FeeDescription2",
        title: "Fee Desc 2",
        width: 100,
      },
      {
        field: "",
        title: "",
        width: 50,
        template: "<button data-value='#:Id #' onclick='payReceip.deleteData(\"#: Id #\")' name='rename' type='button' class='btn btn-danger btn-xs rename'><span class='fa fa-trash'></span></button>",
        attributes: {"class": "align-center"}
      }
    ]
  });
}
payReceip.deleteData = function (id) {
  var param = {
    Id: id
  }

  var url = "/manualpaymentreceipt/deletedata";
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
//                  payReceip.getDataGridPayReceip();
                  payReceip.loading(true);
                  $("#MasterGridpayReceip").data("kendoGrid").dataSource.read();
                  $("#MasterGridpayReceip").data("kendoGrid").refresh();
                  payReceip.loading(false);
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
payReceip.getCurrencyData = function () {
  var payload = {
  };
  payReceip.lsitCurrency([]);
  ajaxPost("/masterfxrates/getcurrency", payload, function (res) {
    var sortCurr = Enumerable.From(res).OrderBy("$.currency_code").ToArray();
    for (var c in sortCurr) {
      payReceip.lsitCurrency.push({
        "text": sortCurr[c].currency_code,
        "value": sortCurr[c]._id,
      });
    }
    payReceip.currency(payReceip.lsitCurrency()[0].value);
  });
}

payReceip.getCleant = function () {
  var payload = {};
  payReceip.listCleant([]);
  ajaxPost("/manualpaymentreceipt/getclient ", payload, function (res) {
    var sortCl = Enumerable.From(res.Data).OrderBy("$.Id").ToArray();
    for (var c in sortCl) {
      payReceip.listCleant.push({
        "text": sortCl[c].Id + " - " + sortCl[c].Fname + " " + sortCl[c].Lname,
        "value": sortCl[c].Id
      });
    }
    payReceip.cleant(payReceip.listCleant()[0].value);
  });
}

payReceip.getAccount = function () {
  var payload = {};
  payReceip.listacMap([]);
  ajaxPost("/datamaster/getaccountall ", payload, function (res) {
    for (var c in res) {
      payReceip.listacMap.push({
        "text": res[c].acc_no_map,
        "value": res[c].acc_no_map
      });
    }
  });
}

payReceip.getPaytype = function () {
  var payload = {};
  payReceip.listpaytype([]);
  ajaxPost("/manualpaymentreceipt/getpaymentreceipttype", payload, function (res) {
    var sortPayType = Enumerable.From(res.Data).OrderBy("$.Description").ToArray();
    for (var c in sortPayType) {
      payReceip.listpaytype.push({
        "text": sortPayType[c].Description + " - " + sortPayType[c].InternalDesc,
        "value": sortPayType[c].Id
      });
    }

    payReceip.paymentOrReceiptType(payReceip.listpaytype()[0].value);
  });
}


payReceip.getClearer = function () {
  var payload = {};
  payReceip.listpaytype([]);
  ajaxPost("/manualpaymentreceipt/getclearer", payload, function (res) {
    var sortPayType = Enumerable.From(res.Data).ToArray();
    for (var c in sortPayType) {
      payReceip.listClearer.push({
        "text": sortPayType[c].ClearerName,
        "value": sortPayType[c].Id
      });
    }
  });
}


payReceip.cleant.subscribe(function (ClientId) {
  var payload = {
    "ClientId": ClientId
  };
  payReceip.listAccount([]);
  ajaxPost("/manualpaymentreceipt/getaccountbyclientid", payload, function (res) {
    var sortAcc = Enumerable.From(res.Data).OrderBy("$._id").ToArray();
    for (var c in sortAcc) {
      payReceip.listAccount.push({
        "text": sortAcc[c].Id + " - " + sortAcc[c].Description,
        "value": sortAcc[c].Id + "~" + sortAcc[c].Description + "~" + sortAcc[c].Acc_no_map
      });

    }
    if (payReceip.Edit() != true) {
      if (payReceip.listAccount().length != 0) {
        payReceip.account(payReceip.listAccount()[0].value);
      }
    } else {
      if (load == true) {
        load = false;
      } else {
        payReceip.account(payReceip.listAccount()[0].value);
      }
    }
    // payReceip.account(payReceip.listAccount()[0].value);
  });
});

// payReceip.paymentOrReceiptType.subscribe(function (ClientId) {
//   var dropdownlist = $("#paymentOrReceiptType").data("kendoDropDownList");
//   payReceip.paymentOrReceiptDescription(dropdownlist.text());
// });
payReceip.checkInOutFlow = function (data, event) {
  if (parseFloat($("#paymentOrReceipt").val()) > 0) {
    payReceip.flow("In-Flow");
  } else {
    payReceip.flow("Out-Flow");
  }
}

payReceip.toggleFilter = function () {
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
  payReceip.panel_relocated();
  var FilterTitle = payReceip.TitelFilter();
  if (FilterTitle == " Hide Filter") {
    payReceip.TitelFilter(" Show Filter");
  } else {
    payReceip.TitelFilter(" Hide Filter");
  }
}

payReceip.panel_relocated = function () {
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
//  $('#copyToClearer').bootstrapSwitch('state', false);
//  payReceip.CopyToClearer();
  payReceip.getClearer();
  payReceip.getCleant();
  payReceip.getCurrencyData();
  payReceip.getPaytype();
  payReceip.getAccount();
  payReceip.getDataGridPayReceip();
});