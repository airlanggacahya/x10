var rptOpentradeSummByClientPdf = {
  process: ko.observable(false),
  visbleAllRptClients: ko.observable(true),
  tradeDate: ko.observable(new Date()),
  listClients: ko.observableArray([]),
  listClearers: ko.observableArray([]),
  clients: ko.observableArray([]),
  clearers: ko.observable(""),
  lenRpt: ko.observableArray([]),
};

rptOpentradeSummByClientPdf.search = function () {
  var url = "/reportpdf/opentradebycleareraccount";
  var param = {
    "TradeDate": moment(rptOpentradeSummByClientPdf.tradeDate()).format('YYYY-MM-DD'),
    "Accounts": rptOpentradeSummByClientPdf.clients(),
    "Clearers": rptOpentradeSummByClientPdf.clearers(),
  }

  ajaxPost(url, param, function (res) {
    if (res.Data != null){
      if (res.IsError) {
          $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
          return;
        } else {
          $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
        }
    }else{
      $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
    }
    
  });
}

rptOpentradeSummByClientPdf.refresh = function () {
  rptOpentradeSummByClientPdf.tradeDate(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
  rptOpentradeSummByClientPdf.clients([]);
  rptOpentradeSummByClientPdf.clearers("");
  var url = "/reportpdf/opentradebycleareraccount";
  var param = {
    "TradeDate": moment(rptOpentradeSummByClientPdf.tradeDate()).format('YYYY-MM-DD'),
    "Accounts": rptOpentradeSummByClientPdf.clients(),
  }
  ajaxPost(url, param, function (res) {
    if (res.Data != null){
      $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
    }else{
      $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
    }
  });
}

rptOpentradeSummByClientPdf.getClients = function () {
  var param = {
    Status: 1
  };
  var url = "/masteraccount/getdata";
  ajaxPost(url, param, function (res) {
    listClients = [];
    var dataClients = Enumerable.From(res.Data.Records).OrderBy("$.Id").ToArray();
    for (var i in dataClients) {
      if (dataClients[i].Id.substring(0, 3) !== "CLR")
        listClients.push({
          "text": dataClients[i].Id + " - " + dataClients[i].Description,
          "value": dataClients[i].Id,
        });
    }
    rptOpentradeSummByClientPdf.listClients(_.sortBy(listClients, 'text'));
  });
}

rptOpentradeSummByClientPdf.getClearers = function () {
  var param = {
    Status: "1"
  };
  ajaxPost("/masterclearers/getdata", param, function (res) {
    var listClearers = [];
    var dataClearers = Enumerable.From(res.Data.Records).OrderBy("$.Id").ToArray();
    for (var i in dataClearers) {
      listClearers.push({
        "text": dataClearers[i].ClearerName,
        "value": dataClearers[i].Id,
      });
    }
    rptOpentradeSummByClientPdf.listClearers(_.sortBy(listClearers, 'text'));
  });
}

rptOpentradeSummByClientPdf.clients.subscribe(function (value) {
  if (value.length != 0) {
    rptOpentradeSummByClientPdf.clearers("");
  }

});

rptOpentradeSummByClientPdf.clearers.subscribe(function (value) {
  if (value != "") {
    rptOpentradeSummByClientPdf.clients([]);
  }
});

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
      rptOpentradeSummByClientPdf.tradeDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
      rptOpentradeSummByClientPdf.getClients();
      rptOpentradeSummByClientPdf.getClearers();
      rptOpentradeSummByClientPdf.search();
  });
});
