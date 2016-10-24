var rptConsolidateOpenPdf = {
  process: ko.observable(false),
  visbleAllRptClients: ko.observable(true),
  tradeDate: ko.observable(""),
  listClientsGroup: ko.observableArray([]),
  listClients: ko.observableArray([]),
  clientsgroup: ko.observable(""),
  lenRpt: ko.observableArray([]),
};

rptConsolidateOpenPdf.search = function () {
  var url = "/reportpdf/consolidateriskreportpdf";
  var param = {
    "TradeDate": moment(rptConsolidateOpenPdf.tradeDate()).format('YYYY-MM-DD'),
    "ClientsGroup": rptConsolidateOpenPdf.clientsgroup()
  }
  ajaxPost(url, param, function (res) {
    $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });
}

rptConsolidateOpenPdf.refresh = function () {
  rptConsolidateOpenPdf.tradeDate(model.CurrentDate());
  rptConsolidateOpenPdf.clientsgroup("");
  var url = "/reportpdf/consolidateriskreportpdf";
  var param = {
    "TradeDate": moment(rptConsolidateOpenPdf.tradeDate()).format('YYYY-MM-DD'),
    "ClientsGroup": rptConsolidateOpenPdf.clientsgroup()
  }
  ajaxPost(url, param, function (res) {
    $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
  });
}

rptConsolidateOpenPdf.getClientsGroup = function () {
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
    rptConsolidateOpenPdf.listClientsGroup(_.sortBy(listClientsGroup, 'text'));
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
      rptConsolidateOpenPdf.tradeDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
      rptConsolidateOpenPdf.getClientsGroup();
      rptConsolidateOpenPdf.search();
  });

});