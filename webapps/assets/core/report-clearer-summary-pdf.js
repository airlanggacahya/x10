var rptClearerSummPdf = {
  process: ko.observable(false),
  visbleAllRptClients: ko.observable(true),
  tradeDate: ko.observable(new Date()),
  listClients: ko.observableArray([]),
  clients: ko.observable(""),
  lenRpt: ko.observableArray([]),
};

rptClearerSummPdf.search = function () {
  var url = "/reportpdf/clientsummary";
  var param = {
    "TradeDate": moment(rptClearerSummPdf.tradeDate()).format('YYYY-MM-DD'),
    "Clients": rptClearerSummPdf.clients()
  }
  ajaxPost(url, param, function (res) {
    $('#ClearerSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });
}

rptClearerSummPdf.Reset = function () {
  rptClearerSummPdf.tradeDate(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
  rptClearerSummPdf.getClients();
  var url = "/reportpdf/clientsummary";
  var param = {
    "TradeDate": moment(rptClearerSummPdf.tradeDate()).format('YYYY-MM-DD'),
    "Clients": rptClearerSummPdf.clients()
  }
  ajaxPost(url, param, function (res) {
    $('#ClearerSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });
}

rptClearerSummPdf.getClients = function () {
  var param = {
  };
  var url = "/reportclient/getclearer";
  ajaxPost(url, param, function (res) {
    listClients = [];
    dataClients = res;
    for (var i in dataClients) {
      listClients.push({
        "text": dataClients[i]._id.clientnumber,
        "value": dataClients[i]._id.clientnumber,
      });
    }

    var SortClients = Enumerable.From(listClients).OrderBy("$.text").ToArray();
    rptClearerSummPdf.listClients(SortClients);
    rptClearerSummPdf.clients(rptClearerSummPdf.listClients()[0].value);
  });
}

$(document).ready(function () {
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
        rptClearerSummPdf.tradeDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
        rptClearerSummPdf.getClients();
        rptClearerSummPdf.search();
    });
});