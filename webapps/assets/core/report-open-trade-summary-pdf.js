var rptOpentradeSummPdf = {
  process: ko.observable(false),
  visbleAllRptClients: ko.observable(true),
  tradeDate: ko.observable(new Date()),
  listClientsGroup: ko.observableArray([]),
  listClients: ko.observableArray([]),
  clientsgroup: ko.observable(""),
  clients: ko.observable(""),
  lenRpt: ko.observableArray([]),
};

rptOpentradeSummPdf.search = function () {
  var url = "/reportpdf/opentradebygrouporclient";
  var param = {
    "TradeDate": moment(rptOpentradeSummPdf.tradeDate()).format('YYYY-MM-DD'),
    "ClientsGroup": rptOpentradeSummPdf.clientsgroup(),
    "Clients": rptOpentradeSummPdf.clients()
  }

  if (rptOpentradeSummPdf.clientsgroup() != "") {
    ajaxPost(url, param, function (res) {
      $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
    });
  } else {
    return swal("Error!", "Clinet Group Can't Empty", "error");
  }

}

rptOpentradeSummPdf.refresh = function () {
  rptOpentradeSummPdf.tradeDate(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
  rptOpentradeSummPdf.clientsgroup("");
  rptOpentradeSummPdf.clients("");
  var url = "/reportpdf/opentradebygrouporclient";
  var param = {
    "TradeDate": moment(rptOpentradeSummPdf.tradeDate()).format('YYYY-MM-DD'),
    "ClientsGroup": rptOpentradeSummPdf.clientsgroup(),
    "Clients": rptOpentradeSummPdf.clients()
  }
  ajaxPost(url, param, function (res) {
    $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });
}

rptOpentradeSummPdf.getClientsGroup = function () {
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
    rptOpentradeSummPdf.listClientsGroup(_.sortBy(listClientsGroup, 'text'));
  });
}

rptOpentradeSummPdf.clientsgroup.subscribe(function (IdClientGroup) {
  rptOpentradeSummPdf.getClients(IdClientGroup);
});

rptOpentradeSummPdf.getClients = function (IdClientGroup) {
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
    rptOpentradeSummPdf.listClients(_.sortBy(listClients, 'text'));
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
      rptOpentradeSummPdf.tradeDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
      rptOpentradeSummPdf.getClientsGroup();
  });

});