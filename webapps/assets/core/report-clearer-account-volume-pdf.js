var rptClearerAccountValue = {
  process: ko.observable(false),
  visbleAllRptClients: ko.observable(true),
  DateStart: ko.observable(""),
  DateEnd: ko.observable(""),
  listClients: ko.observableArray([]),
  listClearers: ko.observableArray([]),
  clients: ko.observableArray([]),
  clearers: ko.observableArray([]),
  lenRpt: ko.observableArray([]),
};

rptClearerAccountValue.search = function () {
  var url = "/reportpdf/volumebycleareraccountadvme";
  var param = {
    "DateStart": moment(rptClearerAccountValue.DateStart()).format('YYYY-MM-DD'),
    "DateEnd": moment(rptClearerAccountValue.DateEnd()).format('YYYY-MM-DD'),
    "Accounts": rptClearerAccountValue.clients(),
    "Clearers": rptClearerAccountValue.clearers(),
  }

  ajaxPost(url, param, function (res) {
    if (res.Data != null) {
      if (res.IsError) {
        $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
        return;
      } else {
        $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
      }
    } else {
      $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
    }

  });
}

rptClearerAccountValue.refresh = function () {
  rptClearerAccountValue.DateStart(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
  rptClearerAccountValue.DateEnd(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
  rptClearerAccountValue.clients([]);
  rptClearerAccountValue.clearers([]);
  var url = "/reportpdf/volumebycleareraccountadvme";
  var param = {
    "DateStart": moment(rptClearerAccountValue.DateStart()).format('YYYY-MM-DD'),
    "DateEnd": moment(rptClearerAccountValue.DateEnd()).format('YYYY-MM-DD'),
    "Accounts": rptClearerAccountValue.clients(),
    "Clearers": rptClearerAccountValue.clearers(),
  }
  ajaxPost(url, param, function (res) {
    if (res.Data != null) {
      $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
    } else {
      $('#ClientsSummary').find('iframe').attr('src', '/static/reportpdf/' + res.Data);
    }
  });
}

rptClearerAccountValue.getClients = function () {
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
    rptClearerAccountValue.listClients(_.sortBy(listClients, 'text'));
  });
}

rptClearerAccountValue.getClearers = function () {
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
    rptClearerAccountValue.listClearers(_.sortBy(listClearers, 'text'));
  });
}

rptClearerAccountValue.clients.subscribe(function (value) {
  if (value.length != 0) {
    rptClearerAccountValue.clearers([]);
  }

});

rptClearerAccountValue.clearers.subscribe(function (value) {
  if (value != "") {
    rptClearerAccountValue.clients([]);
  }
});

$(document).ready(function () {
  var param = {};
  ajaxPost("/dashboard/getcurrentdate", param, function (res) {
    var d = new Date(res.Data.CurrentDate);
    var DefaultDate = new Date(res.Data.CurrentDate);
    var day = moment(d).format("ddd");
    if (day != "Mon") {
      DefaultDate.setDate(DefaultDate.getDate() - 1);
    } else {
      DefaultDate.setDate(DefaultDate.getDate() - 3);
    }

    function startChange() {
      var startDate = start.value(),
              endDate = end.value();

      if (startDate) {
        startDate = new Date(startDate);
        startDate.setDate(startDate.getDate());
        end.min(startDate);
      } else if (endDate) {
        start.max(new Date(endDate));
      } else {
        endDate = new Date();
        start.max(endDate);
        end.min(endDate);
      }
    }

    function endChange() {
      var endDate = end.value(),
              startDate = start.value();

      if (endDate) {
        endDate = new Date(endDate);
        endDate.setDate(endDate.getDate());
        start.max(endDate);
      } else if (startDate) {
        end.min(new Date(startDate));
      } else {
        endDate = new Date();
        start.max(endDate);
        end.min(endDate);
      }
    }

    var start = $("#DateStart").kendoDatePicker({
      format: 'yyyy-MM-dd',
      change: startChange
    }).data("kendoDatePicker");

    var end = $("#DateEnd").kendoDatePicker({
      format: 'yyyy-MM-dd',
      change: endChange
    }).data("kendoDatePicker");

    rptClearerAccountValue.DateStart(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
    rptClearerAccountValue.DateEnd(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
    rptClearerAccountValue.getClients();
    rptClearerAccountValue.getClearers();
    rptClearerAccountValue.search();
  });
});
