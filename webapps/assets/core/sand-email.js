var sendEmail = {
  DateSand: ko.observable(""),
};
sendEmail.getClient = function () {
  var param = {
    "TradeDate": moment(new Date(sendEmail.DateSand())).format('YYYY-MM-DD'),
  }
  var dataSource = [];
  var url = "/reportpdf/getactiveclientondate";
  $("#DataGridClient").html("");
  $("#DataGridClient").kendoGrid({
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
          if (data.Data.Count == 0) {
            return dataSource;
          } else {
            var newRecords = [];
            var oldRecords = data.Data.Records;
            for (var old in oldRecords) {
              var Destination = oldRecords[old].Destination;
              var Email = "";
              for (var d in Destination) {
                Email = Email + Destination[d].SentType + " :" + Destination[d].Email + ",<br/>"
              }
              newRecords.push({
                "AttachmentCount": oldRecords[old].AttachmentCount,
                "Checked": oldRecords[old].Checked,
                "ClientId": oldRecords[old].ClientId,
                "ClientName": oldRecords[old].ClientName,
                "Id": oldRecords[old].Id,
                "LastError": oldRecords[old].LastError,
                "LastSent": oldRecords[old].LastSent,
                "Status": oldRecords[old].Status,
                "TradeDate": oldRecords[old].TradeDate,
                "Email": Email,
              });
            }
            return newRecords;
          }
        },
        total: "Data.Count",
      },
    },
    height: 500,
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
    },
    columns: [
      {
        title: "Check",
        width: 50,
        template: "<input id='check-value-send-#:Id #' class='rolecheck-value-send' type='checkbox'>",
        headerTemplate: '<label><input type=\'checkbox\' id=\'checkAllSend\'/> Check All</label>'
      },
      {
        field: "ClientId",
        title: "Client Number",
        width: 80
      },
      {
        field: "ClientName",
        title: "Client Name",
        width: 120
      },
      {
        field: "Email",
        title: "Email",
        width: 130,
        template: "#= Email #"
      },
      {
        field: "Status",
        title: "Status",
        width: 50
      },
      {
        field: "LastSent",
        title: "Last Sent",
        width: 100,
        attributes: {"class": "align-center"},
        template: "#if(LastSent=='0001-01-01T00:00:00Z'){''}else{# #: moment(LastSent).format('YYYY-MM-DD HH:mm:ss') # #}#"
      },
    ],
  });
  $("#checkAllSend").change(function () {
    $(".rolecheck-value-send").prop('checked', $(this).prop("checked"));
  });
//  });
}

sendEmail.Search = function () {
  sendEmail.getClient();
}

sendEmail.Reset = function () {
  sendEmail.DateSand(new Date());
  sendEmail.getClient();
}

sendEmail.SandEmailToClient = function () {
  var ListCliettrue = [];
  var DataEmailClient = $("#DataGridClient").data().kendoGrid.dataSource.view();
  for (var i in DataEmailClient) {
    if ($("#check-value-send-" + DataEmailClient[i].Id).is(":checked") != false) {
//      ListCliettrue.push({
//        ClientName: DataEmailClient[i].ClientName,
//        ClientNumber: DataEmailClient[i].ClientNumber,
//        Email: DataEmailClient[i].Email,
////        Id: DataEmailClient[i].Id,
//        sendEmail: $("#check-value-send-" + DataEmailClient[i].ClientNumber).is(":checked"),
//      });
      ListCliettrue.push(DataEmailClient[i].Id);
    }
  }

  var param = {
    "TradeDate": moment(new Date(sendEmail.DateSand())).format('YYYY-MM-DD'),
    "ClientNumber": ListCliettrue
  }
  ajaxPost("/reportpdf/dosendmail", param, function (res) {
    if (res.IsError == true) {
      return swal("Error!", res.Message, "error");
    } else {
      swal({
        title: "Success",
        text: res.Message,
        type: "success",
        showConfirmButton: false,
        timer: 1000
      });
      //RefreshGrid per 3 detik ke /reportpdf/getsendmailstatus param TradeDate
      var refreshIntervalId = setInterval(function () {
        $('#DataGridClient').data('kendoGrid').dataSource.read({"TradeDate": moment(new Date(sendEmail.DateSand())).format('YYYY-MM-DD')});
        var paramInterval = {
          "TradeDate": moment(new Date(sendEmail.DateSand())).format('YYYY-MM-DD')
        }
        //Check is finish /reportpdf/getprocesssendemailisfinish param TradeDate
        ajaxPost("/reportpdf/getprocesssendemailisfinish", paramInterval, function (res) {
          if (res.Data == true) {
            clearInterval(refreshIntervalId);
            swal("Success!", "All email has been sent.", "success");
          }
        });
      }, 3000);
    }
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
          sendEmail.DateSand(data.Data);
          sendEmail.getClient();
      },
      async: false
  });
  
});