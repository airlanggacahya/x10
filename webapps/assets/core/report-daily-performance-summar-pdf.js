var rptPerformanceSummPdf = {
  process: ko.observable(false),
  visbleAllRptClients: ko.observable(true),
  tradeDate: ko.observable(""),
  listClientsGroup: ko.observableArray([]),
  listClients: ko.observableArray([]),
  clientsgroup: ko.observable(""),
  clients: ko.observable(""),
  lenRpt: ko.observableArray([]),
};

rptPerformanceSummPdf.search = function () {
  var url = "/reportpdf/dailyperformancerpt";
  var param = {
    "TradeDate": moment(rptPerformanceSummPdf.tradeDate()).format('YYYY-MM-DD'),
    "ClientsGroup": rptPerformanceSummPdf.clientsgroup(),
    "Clients": rptPerformanceSummPdf.clients()
  }
  ajaxPost(url, param, function (res) {
    $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });
}

rptPerformanceSummPdf.refresh = function () {
  rptPerformanceSummPdf.tradeDate(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
  rptPerformanceSummPdf.clientsgroup("");
  rptPerformanceSummPdf.clients("");
  var url = "/reportpdf/dailyperformancerpt";
  var param = {
    "TradeDate": moment(rptPerformanceSummPdf.tradeDate()).format('YYYY-MM-DD'),
    "ClientsGroup": rptPerformanceSummPdf.clientsgroup(),
    "Clients": rptPerformanceSummPdf.clients()
  }
  ajaxPost(url, param, function (res) {
    $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });
}

rptPerformanceSummPdf.getClientsGroup = function () {
  var param = {
  };
  var url = "/reportpdf/getclientgroup";
  ajaxPost(url, param, function (res) {
    listClientsGroup = [];
    var dataClientsGroup = Enumerable.From(res.Data).OrderBy("$.Id").ToArray();
    for (var i in dataClientsGroup) {
      listClientsGroup.push({
        "text": dataClientsGroup[i].Name,
        "value": dataClientsGroup[i].Id,
      });
    }
    rptPerformanceSummPdf.listClientsGroup(_.sortBy(listClientsGroup, 'text'));
  });
}

rptPerformanceSummPdf.clientsgroup.subscribe(function (IdClientGroup) {
  rptPerformanceSummPdf.getClients(IdClientGroup);
});

rptPerformanceSummPdf.getClients = function (IdClientGroup) {
  var param = {
    IdClientGroup: parseInt(IdClientGroup)
  };
  var url = "/reportpdf/getallclient";
  ajaxPost(url, param, function (res) {
    listClients = [];
    var dataClients = Enumerable.From(res.Data).OrderBy("$.Id").ToArray();
    for (var i in dataClients) {
      listClients.push({
        "text": dataClients[i].Id + " - " + dataClients[i].Fname + " " + dataClients[i].Lname,
        "value": dataClients[i].Id,
      });
    }
    rptPerformanceSummPdf.listClients(_.sortBy(listClients, 'text'));
  });
}

$(document).ready(function () {
  var url = "/processlog/getpaymentreceiptmindate";
  $.ajax({
      url: url,
      type: 'POST',
      data: ko.mapping.toJSON({}),
      contentType: "application/json; charset=utf-8",
      success: function (data) {
          rptPerformanceSummPdf.tradeDate(data.Data);
          rptPerformanceSummPdf.getClientsGroup();
      },
      async: false
  });

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
      rptPerformanceSummPdf.tradeDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
      rptPerformanceSummPdf.getClientsGroup();
      rptPerformanceSummPdf.search();
  });

});