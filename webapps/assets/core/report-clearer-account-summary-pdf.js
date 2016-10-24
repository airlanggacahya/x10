var rptClearerAccSummPdf = {
  process: ko.observable(false),
  visbleAllRptClients: ko.observable(true),
  tradeDate: ko.observable(""),
  listClients: ko.observableArray([]),
  clients: ko.observable(""),
  lenRpt: ko.observableArray([]),
};

rptClearerAccSummPdf.search = function () {
  var url = "/reportpdf/accountsummary";
  var param = {
    "TradeDate": moment(rptClearerAccSummPdf.tradeDate()).format('YYYY-MM-DD'),
    "Clients": rptClearerAccSummPdf.clients()
  }
  ajaxPost(url, param, function (res) {
    $('#ClearersAccountSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });
}

rptClearerAccSummPdf.refresh = function () {
//  rptClearerAccSummPdf.tradeDate(new Date());
  rptClearerAccSummPdf.getClients();

  var url = "/reportpdf/accountsummary";
  var param = {
    "TradeDate": moment(rptClearerAccSummPdf.tradeDate()).format('YYYY-MM-DD'),
    "Clients": rptClearerAccSummPdf.clients()
  }
  ajaxPost(url, param, function (res) {
    $('#ClearersAccountSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });

}

rptClearerAccSummPdf.getClients = function () {
  var param = {
    "TradeDate": moment(rptClearerAccSummPdf.tradeDate()).format('YYYY-MM-DD')
  };
  var url = "/reportpdf/getclearer";
  ajaxPost(url, param, function (res) {
    listClients = [];
    dataClients = res;
    for (var i in dataClients) {
      listClients.push({
        "text": dataClients[i]._id.clientnumber,
        "value": dataClients[i]._id.clientnumber,
      });
    }
    rptClearerAccSummPdf.listClients(_.sortBy(listClients, 'text'));
    rptClearerAccSummPdf.clients(listClients[1].text);
  });
}

rptClearerAccSummPdf.clients.subscribe(function (value) {
  rptClearerAccSummPdf.search();
});
rptClearerAccSummPdf.tradeDate.subscribe(function (value) {
//  if (model.View() != "false") {
  rptClearerAccSummPdf.refresh();
//  rptClientsAccSummPdf.search();
//  }
});
$(document).ready(function () {
  var url = "/processlog/getpaymentreceiptmindate";
  $.ajax({
      url: url,
      type: 'POST',
      data: ko.mapping.toJSON({}),
      contentType: "application/json; charset=utf-8",
      success: function (data) {
          rptClearerAccSummPdf.tradeDate(data.Data);
          rptClearerAccSummPdf.refresh();
      },
      async: false
  });
  
});