var rptClientsSummPdf = {
  process: ko.observable(false),
  visbleAllRptClients: ko.observable(true),
  tradeDate: ko.observable(new Date()),
  listClients: ko.observableArray([]),
  clients: ko.observable(""),
  lenRpt: ko.observableArray([]),
};

rptClientsSummPdf.Search = function () {
  var url = "/reportpdf/clientsummary";
  var param = {
    "TradeDate": moment(rptClientsSummPdf.tradeDate()).format('YYYY-MM-DD'),
    "Clients": rptClientsSummPdf.clients()
  }
  ajaxPost(url, param, function (res) {
    $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });
}

rptClientsSummPdf.Reset = function () {
  rptClientsSummPdf.tradeDate(model.CurrentDate());
  rptClientsSummPdf.getClients();
  var url = "/reportpdf/clientsummary";
  var param = {
    "TradeDate": moment(model.CurrentDate()).format('YYYY-MM-DD'),
    "Clients": rptClientsSummPdf.clients()
  }
  ajaxPost(url, param, function (res) {
    $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });
}

rptClientsSummPdf.getClients = function () {
  var param = {
  };
  var url = "/reportclient/getclient";
  ajaxPost(url, param, function (res) {
    listClients = [];
    dataClients = res;
    for (var i in dataClients) {
      listClients.push({
        "text": dataClients[i]._id.clientnumber,
        "value": dataClients[i]._id.clientnumber,
      });
    }
    rptClientsSummPdf.listClients(_.sortBy(listClients, 'text'));
    rptClientsSummPdf.clients(rptClientsSummPdf.listClients()[0].value);
  });
}

$(document).ready(function () {
  rptClientsSummPdf.getClients();
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
      rptClientsSummPdf.tradeDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
      rptClientsSummPdf.Search();
  });
  
});