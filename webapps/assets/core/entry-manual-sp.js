var entrySp = {
  loading: ko.observable(false),
  Transactiondatestring: ko.observable(""),
  TempEntrySp: ko.observableArray([]),
  SandEntry: ko.observableArray([]),
};

entrySp.getDataGridInputSP = function (Trndate) {
  entrySp.loading(true);
  var param = {
    "Transactiondatestring": Trndate,
  };
  var dataSource = [];
  var url = "/validationprocess/validateprocessv2";
  $("#MasterGridInputSP").html("");
  $("#MasterGridInputSP").kendoGrid({
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
          entrySp.loading(false);
          if (data.Data.Count == 0) {
            return dataSource;
          } else {
            var Records = data.Data.Records;
            var NewData = [];
            for (var i in Records) {
              NewData.push({
                "Seq": i,
                "ContractCode": Records[i].ContractCode,
                "ContractExpiry": Records[i].ContractExpiry,
                "Filetype": Records[i].Filetype,
                "Fullname": Records[i].Fullname,
                "ProductID": Records[i].ProductID,
                "Settle": "",
                "ExpDate": new Date(),
              });
            }
            return NewData;
          }
        },
        total: "Data.Count",
        model: {
          fields: {
            Fullname: {editable: false},
            ContractExpiry: {editable: false},
            Settle: {editable: true, type: "number", validation: {min: "0"}},
            ExpDate: {editable: true},
          }
        },
      },
      pageSize: 20,
//      serverPaging: true,
//      serverSorting: true,
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    columnMenu: false,
    editable: true,
    columns: [
      {
        field: "Fullname",
        title: "Full Name",
        width: 200

      },
      {
        field: "ContractExpiry",
        title: "Contract Expiry",
        attributes: {"class": "align-center"},
        width: 150,
        template: "#= moment(ContractExpiry).format('MMMM YYYY') #"
      },
      {
        field: "Settle",
        title: "Settle",
        attributes: {"class": "align-right"},
        width: 100,
      },
//      {
//        field: "ExpDate",
//        title: "Exp Date",
//        attributes: {"class": "align-center"},
//        width: 100,
//        template: "#= moment(ExpDate).format('DD MMMM YYYY') #",
//        editor: entrySp.dateTimeEditor
//      },
      {
        title: "<a class='k-link' href='#'></a>",
        attributes: {"class": "align-center"},
        width: 25,
        template: "<button id='btn-edit-#:ProductID #' data-value='#:ProductID #' onclick='entrySp.grabSp(\"#:Seq #\",\"#:ContractCode #\", \"#:moment(ContractExpiry).format('MMM YY') #\")' name='edit' type='button' class='btn btn-success btn-flat btn-xs edit' ><span class='fa fa-eye'></span></button>"
      }
    ]
  });
}

entrySp.grabSp = function (index, Id, ExpiryDate) {
  var param = {
    "code": "GSP",
    "Contractexpiry": ExpiryDate,
    "Tradedate": moment(new Date(entrySp.Transactiondatestring())).format('DD MMM YYYY'),
    "Productid": Id,
    // code: "GSP",
    // Contractexpiry : "Sep 16",
    // Tradedate : "14 Jun 2016",
    // Productid : "EBM"
  }
  entrySp.loading(true);
  var firstItem = $('#MasterGridInputSP').data().kendoGrid.dataSource.data()[index];
  ajaxPost("/webgrabber/getdata", param, function (res) {
    entrySp.loading(false);
    if (res.Data == null) {
      firstItem.set('Settle', "");
      return swal("Error!", res.Message, "error");
    } else {
      firstItem.set('Settle', res.Data.SettlementPrice);
    }

  });

}

entrySp.dateTimeEditor = function (container, options) {
  $('<input data-bind="value:' + options.field + '"/>').appendTo(container)
          .kendoDateTimePicker({
            culture: "de-DE",
            format: 'dd MMM yyyy'
          });
  $('.k-i-clock').hide();
}

entrySp.saveData = function () {
  var Records = [];
  var displayedData = $("#MasterGridInputSP").data().kendoGrid.dataSource.view()
  for (var d in displayedData) {
    if (displayedData[d].ContractExpiry != undefined) {
      var Settle = 0;
      if (displayedData[d].Settle != null) {
        Settle = displayedData[d].Settle;

      } else {
        swal({
          title: "Please check again !!",
          text: "Some Datas on Settle column are blank",
          type: "warning",
          confirmButtonClass: "btn-success",
          confirmButtonText: "oke",
        });
        return;
      }
      Records.push({
        "TradeDate": entrySp.Transactiondatestring(),
        "ProductId": displayedData[d].ProductID,
        "ContractExpiry": moment(new Date(displayedData[d].ContractExpiry)).format("YYYY-MM-DD"),
        "Settle": Settle.toString(),
        "Expdate": moment(new Date(displayedData[d].ExpDate)).format("YYYY-MM-DD"),
      });
    }
  }

  var param = {
    "Datauploadsp": Records
  }
  var url = "/validationprocess/saveentrymanual";
  ajaxPost(url, param, function (res) {
    var ErrorData = res.IsError;
    var ValidateData = res.Data;
    if (ErrorData == true) {
      return swal("Error!", res.Message, "error");
    } else {
      window.location.href = "/uploadfilev2/default?tradeDate=" + entrySp.Transactiondatestring();
    }
  });
}

entrySp.cencelData = function () {
  window.location.href = "/uploadfilev2/default?tradeDate=" + entrySp.Transactiondatestring();
}

$(document).ready(function () {
  $.extend({
    getUrlVars: function () {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++)
      {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },
    getUrlVar: function (name) {
      return $.getUrlVars()[name];
    }
  });
  var Trndate = $.getUrlVar('Transactiondatestring');
  entrySp.Transactiondatestring(Trndate);
  entrySp.getDataGridInputSP(Trndate);

});