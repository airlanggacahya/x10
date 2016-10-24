var updaccounts = {
  // variable bool
  isProcessing: ko.observable(false),
  formUpdAcc: ko.observable(true),
  Edit: ko.observable(true),
  loading: ko.observable(false),
  reset: ko.observable(false),
  titlepanel: ko.observable(" Hide Filter"),
  // variable field
  Id: ko.observable(""),
  Filetype: ko.observable(""),
  tprsAccountCode: ko.observable(""),
  updAccountCode: ko.observable(""),
  Clearer: ko.observable(""),
  // variable Filter
  filterFiletype: ko.observable(""),
  filterTprsAccountCode: ko.observableArray([]),
  filterUpdAccountCode: ko.observable(""),
  // list
  listFiletype: ko.observableArray([
    {text: "TT", value: "TT"},
    {text: "Stellar", value: "Stellar"},
    {text: "ADM", value: "ADM"},
    {text: "CQG", value: "CQG"},
    {text: "CQGSFTP", value: "CQGSFTP"},
    {text: "FCS", value: "FCS"},
    {text: "Newedge", value: "Newedge"},
    {text: "SEB", value: "SEB"},
    {text: "SEB WEBCLEAR", value: "SEB WEBCLEAR"},
    {text: "Settlement Price", value: "SP"},
    {text: "Desk Fee", value: "DF"}
  ]),
  listAccountCode: ko.observableArray([]),
  listAccountID: ko.observableArray([]),
};

updaccounts.searchData = function () {
  updaccounts.getDataGridUpdAccounts();
}

updaccounts.resetData = function () {
  updaccounts.reset(true);
  updaccounts.filterFiletype("");
  updaccounts.filterTprsAccountCode([]);
  updaccounts.filterUpdAccountCode("");
  updaccounts.getAccount();
  updaccounts.getDataGridUpdAccounts();
}

updaccounts.cancelData = function () {
  updaccounts.formUpdAcc(true);
  updaccounts.resetData();
  $("#UpdAccModal").modal('hide');
  $("#nav-dex").css("z-index", "none");
}

updaccounts.saveData = function () {
  var tprsAccountCode = $("#tprsAccountCode").data("kendoDropDownList");
  var param = {
    "Id": -1,
    "Filetype": updaccounts.Filetype(),
    "tprsAccountCode": tprsAccountCode.text(), //updaccounts.tprsAccountCode(),
    "updAccountCode": updaccounts.updAccountCode(),
    "Clearer": updaccounts.Clearer().toString(),
  }
  var url = "/masterupdaccount/savedata";
  var validator = $("#AddAccFees").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#AddAccFees").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      var IsError = res.IsError;
      if (IsError == false) {
        updaccounts.cancelData();
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

updaccounts.saveEdit = function () {
  var tprsAccountCode = $("#tprsAccountCode").data("kendoDropDownList");
  var param = {
    "Id": updaccounts.Id(),
    "Filetype": updaccounts.Filetype(),
    "tprsAccountCode": tprsAccountCode.text(),
    "updAccountCode": updaccounts.updAccountCode(),
    "Clearer": updaccounts.Clearer().toString(),
  }
  var url = "/masterupdaccount/savedata";
  var validator = $("#AddAccFees").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#AddAccFees").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      var IsError = res.IsError;
      if (IsError == false) {
        updaccounts.cancelData();
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

updaccounts.addUpdAccounts = function () {
  $("#UpdAccModal").modal({
        show : true,
        backdrop: 'static',
        keyboard: false
  });
  $("#nav-dex").css("z-index", "0");
  updaccounts.formUpdAcc(false);
  updaccounts.Edit(false);
  var dpFileType = $("#Filetype").data("kendoDropDownList");
  var dpAccCode = $("#tprsAccountCode").data("kendoDropDownList");
  dpFileType.enable(true);
  dpAccCode.enable(true);

  var tprsAccountCode = $("#tprsAccountCode").data("kendoDropDownList").text("");
  updaccounts.Id("");
  updaccounts.Filetype("");
  updaccounts.tprsAccountCode("");
  updaccounts.updAccountCode("");
  updaccounts.Clearer("");
}

updaccounts.editUpdAccounts = function (IdUpdAcccount) {
  $("#UpdAccModal").modal({
        show : true,
        backdrop: 'static',
        keyboard: false
  });
  $("#nav-dex").css("z-index", "0");
  var url = "/masterupdaccount/getdata";
  var param = {
    "Id": parseInt(IdUpdAcccount),
  }
  ajaxPost(url, param, function (res) {
    var DataUpdAcc = res.Data.Records[0];
    updaccounts.formUpdAcc(false);
    updaccounts.Edit(true);
    var dpFileType = $("#Filetype").data("kendoDropDownList");
    var dpAccCode = $("#tprsAccountCode").data("kendoDropDownList");
    dpFileType.enable(false);
    dpAccCode.enable(false);
    dpAccCode.text(DataUpdAcc.Tprs_account_code);

    updaccounts.Id(parseInt(IdUpdAcccount));
    updaccounts.Filetype(DataUpdAcc.Filetype);
    // updaccounts.tprsAccountCode(DataUpdAcc.Tprs_account_code);
    updaccounts.updAccountCode(DataUpdAcc.Upd_account_code);
    updaccounts.Clearer(DataUpdAcc.Clearer);
  });
}

updaccounts.filterFiletype.subscribe(function(value){
  if(model.View() != "false" && updaccounts.reset() != true){
   updaccounts.getDataGridUpdAccounts();
  }
});

updaccounts.filterTprsAccountCode.subscribe(function(value){
  if(model.View() != "false" && updaccounts.reset() != true){
   updaccounts.getDataGridUpdAccounts();
  }
});

updaccounts.search = function(data, event){
  if(model.View() != "false" && updaccounts.reset() != true){
    if(updaccounts.filterUpdAccountCode().length >=3 || updaccounts.filterUpdAccountCode().length == 0){
       updaccounts.getDataGridUpdAccounts();
    }
  }
}

var userid = model.User();
var gcupdacc = new GridColumn('role_updacc', userid, 'MasterGridUpdAccounts');
updaccounts.getDataGridUpdAccounts = function () {
  updaccounts.loading(true)
  var param = {
    FileType: updaccounts.filterFiletype(),
    TprsAccountCode: updaccounts.filterTprsAccountCode(),
    UpdAccountCode: updaccounts.filterUpdAccountCode()
  };

  var url = "/masterupdaccount/getdata";
  var dataSource = [];
  $("#MasterGridUpdAccounts").html("");
  $("#MasterGridUpdAccounts").kendoGrid({
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
          updaccounts.loading(false)
          updaccounts.reset(false);
          gcupdacc.Init();
          if (data.Data.Count == 0) {
            return dataSource;
          } else {
            return data.Data.Records;
          }
        },
        total: "Data.Count",
      },
      pageSize: 15,
      // serverPaging: false,
      // serverSorting: false,
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    columnMenu: false,
    columnHide: function(e) {
        gcupdacc.RemoveColumn(e.column.field);
    },
    columnShow: function(e) {
        gcupdacc.AddColumn(e.column.field);
    },
    filterable: {
      mode: "row"
    },
    columns: [
      {
        field: "Filetype",
        title: "File Type",
        width: 100,
        template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:updaccounts.editUpdAccounts(\"#: Id #\")'>#: Filetype #</a>#}else{#<div>#: Filetype #</div>#}#",
        filterable: {
          cell: {
            operator: "contains"
          }
        }
      },
      {
        field: "Tprs_account_code",
        title: "Tprs Account Code",
        width: 100,
        attributes: {
          "class": "align-right"
        },
        filterable: {
          cell: {
            operator: "contains"
          }
        }
      },
      {
        field: "Upd_account_code",
        title: "Upd Account Code",
        width: 100,
        attributes: {
          "class": "align-right"
        },
        filterable: {
          cell: {
            operator: "contains"
          }
        }
      },
      {
        field: "Clearer",
        title: "Clearer",
        width: 100,
        attributes: {
          "class": "align-right"
        },
        filterable: {
          cell: {
            operator: "contains"
          }
        }
      }
    ]
  });
}

updaccounts.tprsAccountCode.subscribe(function (newValue) {
  var payload = {
    Id: parseInt(newValue)
  };
  ajaxPost("/datamaster/getclearer", payload, function (res) {
    updaccounts.Clearer(res[0].clearername);
  });
});

updaccounts.getAccount = function () {
  var payload = {};
  updaccounts.listAccountCode([]);
  ajaxPost("/datamaster/getaccount", payload, function (res) {
    var sortAcc = Enumerable.From(res).OrderBy("$._id").ToArray();
    for (var a in sortAcc) {
      updaccounts.listAccountCode.push({
        "text": sortAcc[a]._id,
        "value": sortAcc[a]._id
      });
    }
  });
}

updaccounts.getAccountID = function () {
  var payload = {};
  updaccounts.listAccountID([]);
  ajaxPost("/datamaster/getaccount", payload, function (res) {
    var sortAcc = Enumerable.From(res).OrderBy("$._id").ToArray();
    for (var a in sortAcc) {
      updaccounts.listAccountID.push({
        "text": sortAcc[a]._id,
        "value": sortAcc[a].clearer
      });
    }
  });
}

updaccounts.toggleFilter = function(){
  var panelFilter = $('.panel-filter');
  var panelContent = $('.panel-content');

  if (panelFilter.is(':visible')) {
    panelFilter.hide();
    panelContent.attr('class', 'col-md-12 col-sm-12 ez panel-content');
    $('.breakdown-filter').removeAttr('style');
  } else {
    panelFilter.show();
    panelContent.attr('class', 'col-md-9 col-sm-9 ez panel-content');
    //panelContent.css('margin-top', '1.3%');
    $('.breakdown-filter').css('width', '60%');
  }

  $('.k-grid').each(function (i, d) {
    try {
      $(d).data('kendoGrid').refresh();
    } catch (err) {}
  });

  $('.k-pivot').each(function (i, d) {
    $(d).data('kendoPivotGrid').refresh();
  });

  $('.k-chart').each(function (i, d) {
    $(d).data('kendoChart').redraw();
  });
  updaccounts.panel_relocated();
  if(updaccounts.titlepanel() == ' Show Filter'){
    updaccounts.titlepanel(' Hide Filter');
  }else{
    updaccounts.titlepanel(' Show Filter');
  }
}

updaccounts.panel_relocated = function(){
  if ($('.panel-yo').size() == 0) {
    return;
  }

  var window_top = $(window).scrollTop();
  var div_top = $('.panel-yo').offset().top;
  if (window_top > div_top) {
    $('.panel-fix').css('width', $('.panel-yo').width());
    $('.panel-fix').addClass('contentfilter');
    $('.panel-yo').height($('.panel-fix').outerHeight());
  } else {
    $('.panel-fix').removeClass('contentfilter');
    $('.panel-yo').height(0);
  }
}

$(document).ready(function () {
  updaccounts.getAccount();
  updaccounts.getAccountID();
  updaccounts.getDataGridUpdAccounts();
});