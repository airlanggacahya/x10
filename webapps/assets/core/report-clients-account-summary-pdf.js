var rptClientsAccSummPdf = {
  process: ko.observable(false),
  visbleAllRptClients: ko.observable(true),
  tradeDate: ko.observable(),
  listClients: ko.observableArray([]),
  clients: ko.observable(""),
  lenRpt: ko.observableArray([]),
};

rptClientsAccSummPdf.search = function () {
  var url = "/reportpdf/accountsummary";
  var param = {
    "TradeDate": moment(rptClientsAccSummPdf.tradeDate()).format('YYYY-MM-DD'),
    "Clients": rptClientsAccSummPdf.clients()
  }
  ajaxPost(url, param, function (res) {
    $('#ClientsAccountSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });
}

rptClientsAccSummPdf.refresh = function () {
  rptClientsAccSummPdf.getClients();
  var url = "/reportpdf/accountsummary";
  var param = {
    "TradeDate": moment(rptClientsAccSummPdf.tradeDate()).format('YYYY-MM-DD'),
    "Clients": rptClientsAccSummPdf.clients()
  }
  ajaxPost(url, param, function (res) {
    $('#ClientsAccountSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });

}

rptClientsAccSummPdf.getClients = function () {
  var param = {
    "TradeDate": moment(rptClientsAccSummPdf.tradeDate()).format('YYYY-MM-DD')
  };
  var url = "/reportpdf/getclient";
  ajaxPost(url, param, function (res) {
    listClients = [];
    dataClients = res;
    for (var i in dataClients) {
      listClients.push({
        "text": dataClients[i]._id.clientnumber,
        "value": dataClients[i]._id.clientnumber,
      });
    }
    rptClientsAccSummPdf.listClients(_.sortBy(listClients, 'text'));
    if (rptClientsAccSummPdf.listClients().length != 0){
      rptClientsAccSummPdf.clients(listClients[1].text);
    }else{
      rptClientsAccSummPdf.clients("");
    }
    
  });
}
rptClientsAccSummPdf.clients.subscribe(function (value) {
  rptClientsAccSummPdf.search();
});
rptClientsAccSummPdf.tradeDate.subscribe(function (value) {
//  if (model.View() != "false") {
  rptClientsAccSummPdf.refresh();
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
          rptClientsAccSummPdf.tradeDate(data.Data);
          rptClientsAccSummPdf.refresh();
      },
      async: false
  });
});