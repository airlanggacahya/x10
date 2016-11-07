var accounts = {
  isProcessing: ko.observable(false),
  isFirstLoad: ko.observable(true),
  FilterAccountNumber: ko.observable(""),
  FilterAccNoMap: ko.observable(""),
  FilterClientNumber: ko.observable(""),
  FilterAccountName: ko.observable(""),
  FilterTTMember: ko.observable(),
  FilterTTGroup: ko.observable(),
  FilterTTtreder: ko.observable(),
  formAccounts: ko.observable(true),
  clienNumbList: ko.observableArray([]),
  clearelist: ko.observableArray([]),
  loading: ko.observable(false),
  onstatus: ko.observable(1),
  reset: ko.observable(false),
  action: ko.observable(""),
  accnomap: ko.observableArray([]),
  AccNoMap: ko.observable(""),
  dataList: ko.observableArray([]),
  //variable
  Id: ko.observable(),
  Acc_no_map: ko.observable(),
  Client_number: ko.observable(),
  Description: ko.observable(),
  Clearer: ko.observable(),
  Date_created: ko.observable(),
  Date_updated: ko.observable(),
  Update_user: ko.observable(),
  Tt_member: ko.observable(),
  Tt_group: ko.observable(),
  Tt_trader: ko.observable(),
  Program: ko.observable(),
  Auto_launch_login: ko.observable(),
  Auto_launch_password: ko.observable(),
  status: ko.observable(),
  Edit: ko.observable(false),
  EnableId: ko.observable(true),
};

accounts.searchAccountNumber = function (data, event) {
  if (model.View() != "false" && accounts.reset() == false) {
    if (accounts.FilterAccountNumber().length >= 3 == true || accounts.FilterAccountNumber().length == 0) {
      accounts.reloadGrid();
    }
  }
}

accounts.searchAccNoMap = function (data, event) {
  if (model.View() != "false" && accounts.reset() == false) {
    if (accounts.FilterAccNoMap().length >= 3 || accounts.FilterAccNoMap().length == 0) {
      accounts.reloadGrid()
    }
  }
}

accounts.searchAcctName = function (data, event) {
  if (model.View() != "false" && accounts.reset() == false) {
    if (accounts.FilterAccountName().length >= 3 || accounts.FilterAccountName().length == 0) {
      accounts.reloadGrid()
    }
  }
}

accounts.FilterClientNumber.subscribe(function (value) {
  if (model.View() != "false" && accounts.reset() == false) {
    accounts.reloadGrid()
  }
});

accounts.FilterStatus = function () {
  if (model.View() != "false") {
    $('#onstatus').on('switchChange.bootstrapSwitch', function (event, state) {
      if (state == false) {
        accounts.onstatus(0);
      } else {
        accounts.onstatus(1);
      }
      if (accounts.reset() == false) {
        accounts.reloadGrid();
      }
    });
  }

}

accounts.resetData = function () {
  accounts.reset(true);
  $('#onstatus').bootstrapSwitch('state', true);
  accounts.FilterAccountNumber("");
  //accounts.FilterClientNumber("");
  accounts.FilterAccountName("");
  accounts.FilterAccNoMap("");
  accounts.getDataGridAccounts();
  accounts.reset(false);
}

accounts.reloadGrid = function () {
  $('#MasterGridAccounts').data('kendoGrid').dataSource.read({
    "Id": accounts.FilterAccountNumber(),
    "Description": accounts.FilterAccountName(),
    "Accnomap": accounts.FilterAccNoMap(),
    "ClientNumber": clients.pickClient(),
    "Status": accounts.onstatus()
  });
}

accounts.dropdown = function () {
  accounts.clienNumbList([]);
  accounts.clearelist([])
  ajaxPost("/datamaster/getclient", {}, function (res) {
    res.map(function (d) {
      accounts.clienNumbList.push({
        title: d._id,
        value: d._id
      });
      // accounts.clienNumbList().sort();
    });
  });
  ajaxPost("/datamaster/getclearer", {}, function (res) {
    res.map(function (d) {
      accounts.clearelist.push({
        title: d.clearername,
        value: d._id
      });
    });
  });
}

accounts.backMenuMaster = function () {
  window.location.href = "/datamaster/default";
}

// var userid = model.User();
// var gc = new GridColumn('role_master', userid, 'MasterGridAccounts-v2');
accounts.getDataGridAccounts = function () {
  $("#tab8").hide();
  accounts.AccNoMap("");
  accounts.accnomap([]);
  accounts.dataList([])
  accounts.loading(true);
  // if ($('#onstatus').bootstrapSwitch('state') == false) {
  //   accounts.onstatus(0);
  // } else {
  //   accounts.onstatus(1);
  // }
  var param = {
    "Id": accounts.FilterAccountNumber(),
    "Description": accounts.FilterAccountName(),
    "Accnomap": accounts.FilterAccNoMap(),
    "ClientNumber": clients.pickClient(),
    "Status": -99
  };
  var dataSource = [];
  var url = "/masteraccount/getdata";
  $("#MasterGridAccounts-v2").html("");
  $("#MasterGridAccounts-v2").kendoGrid({
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
          // gc.Init();
          var rest = data.Data.Records;
          if (rest.length != 0) {
            $.each(rest, function (i, e) {
              accounts.accnomap.push(rest[i].Id);
              accounts.AccNoMap(rest[i].Id);
              accounts.dataList.push({
                text: rest[i].Id,
                value: rest[i].Id,
                clearer: rest[i].ClearerDesc
              })
            })
          } else {
            accounts.accnomap([" "]);
          }
          accounts.loading(false)
          if (data.Data.Count == 0) {
            return dataSource;
          } else {
            return data.Data.Records;
          }
        },
        total: "Data.Count",
      },
      pageSize: 15,
      serverPaging: true, // enable server paging
      serverSorting: true,
    },
    change: function () {
      accounts.userEdit();
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    // columnMenu: true,
    // columnHide: function(e) {
    //   gc.RemoveColumn(e.column.field);
    // },
    // columnShow: function(e) {
    //   gc.AddColumn(e.column.field);
    // },
    columns: [
      {
        field: "Id",
        title: "Account",
        template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:accounts.editAccount(\"#: Id #\")'>#: Id #</a>#}else{#<div>#: Id #</div>#}#",
      },
      {
        field: "Acc_no_map",
        title: "Account No. Map",
      },
      {
        field: "Client_number",
        title: "Client Number",
      },
      {
        field: "Description",
        title: "Description"
      },
      {
        field: "ClearerDesc",
        title: "Clearer",
      },
      {
        field: "Status",
        title: "Status",
        template: "#if(Status==1){#<span>Active </span>#}else{#<span>Inactive</span>#}#",
      },
      {
        title: "",
        width: 50,
        template: "<button data-value='#:Id #' onclick='accounts.deleteData(\"#: Id #\")' name='rename' type='button' class='btn btn-danger btn-xs rename'><span class='fa fa-trash'></span></button>",
        attributes: {"class": "align-center"}
      }
    ]
  });
  accounts.reset(false);

}
accounts.deleteData = function (id) {
  var param = {
    Id: id
  }
  var url = "/masteraccount/deletedata";
  swal({
    title: "Are you sure?",
    text: "Are you sure remove this client account!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Yes, I am sure!',
    cancelButtonText: "No, cancel it!",
    closeOnConfirm: false,
    closeOnCancel: false
  },
          function (isConfirm) {
            if (isConfirm) {
              ajaxPost(url, param, function (data) {
                if (data.IsError == false) {
                  accounts.getDataGridAccounts();
                  swal("Success!", "Menu Success Delete", "success");
                } else {
                  swal("Error!", data.Message, "error");
                }
              });
            } else {
              swal("Cancelled", "Cancelled Client Account", "error");
            }
          });
}

accounts.saveData = function () {
  var validator = $("#accountsForm").data("kendoValidator");
  //console.log(validator);
  if (validator == undefined) {
    validator = $("#accountsForm").kendoValidator().data("kendoValidator");
  }
  if ($('#status').bootstrapSwitch('state') == false) {
    accounts.status(0);
  } else {
    accounts.status(1);
  }
  var param = {
    id: accounts.Id(),
    acc_no_map: accounts.Acc_no_map(),
    client_number: accounts.Client_number(),
    description: accounts.Description(),
    clearer: parseInt(accounts.Clearer()),
    status: accounts.status(),
    tt_group: accounts.Tt_group(),
    tt_member: accounts.Tt_member(),
    tt_trader: accounts.Tt_trader(),
    program: accounts.Program(),
    auto_launch_login: accounts.Auto_launch_login(),
    auto_launch_password: accounts.Auto_launch_password(),
    Action: "new"
  }
  var url = "/masteraccount/savedata";
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        accounts.cencelData();
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

accounts.saveEdit = function () {
  var validator = $("#accountsForm").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#accountsForm").kendoValidator().data("kendoValidator");
  }
  if ($('#status').bootstrapSwitch('state') == false) {
    accounts.status(0);
  } else {
    accounts.status(1);
  }
  var param = {
    id: accounts.Id(),
    acc_no_map: accounts.Acc_no_map(),
    client_number: accounts.Client_number(),
    description: accounts.Description(),
    clearer: parseInt(accounts.Clearer()),
    status: accounts.status(),
    update_user: accounts.Update_user(),
    tt_group: accounts.Tt_group(),
    tt_member: accounts.Tt_member(),
    tt_trader: accounts.Tt_trader(),
    program: accounts.Program(),
    auto_launch_login: accounts.Auto_launch_login(),
    auto_launch_password: accounts.Auto_launch_password(),
    Action: "edit"
  }
  var url = "/masteraccount/savedata";
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        accounts.cencelData();
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}
var subscription;
accounts.ClientSubscription = function () {
  subscription = accounts.Client_number.subscribe(function (newValue) {
    // console.log(newValue);
    if (newValue.length > 4) {
//      accounts.Id();
      var plAccountId = newValue.substring(0, 4) + "1";
      $("#Accid").attr("placeholder", "e.g " + plAccountId)
    }
//    var payload = {
//        filetype : newValue,
//        contractmap : updcontracts.contractMap()
//
//    };
//    ajaxPost("/datamaster/getdivisor",payload , function (res){
//        updcontracts.updDivisor(res.divisor);
//    });
  });
}

accounts.addAccount = function () {
//  accounts.dropdown();
  //alert("masuk");
//  $("#accountsForm")[0].reset();
  accounts.formAccounts(false);
  accounts.Id("");
  accounts.Acc_no_map("");
  accounts.Client_number(clients.pickClient());
  accounts.Description("");
  accounts.Clearer("");
  accounts.Date_created("");
  accounts.Date_updated("");
  accounts.Update_user("");
  accounts.Tt_member("");
  accounts.Tt_group("");
  accounts.Tt_trader("");
  accounts.Program("");
  accounts.Auto_launch_login("");
  accounts.Auto_launch_password("");
  accounts.EnableId(true);
  accounts.ClientSubscription();
}

accounts.editAccount = function (userName) {
  var param = {
    "Id": userName,
  }
  var url = "/masteraccount/getdata";
  ajaxPost(url, param, function (res) {
    var dataAccounts = res.Data.Records[0];
//    $("#accountsForm")[0].reset();
    // console.log(dataAccounts);

    accounts.formAccounts(false);
    accounts.Edit(true);
    accounts.EnableId(false);

    accounts.Id(dataAccounts.Id);
    accounts.Acc_no_map(dataAccounts.Acc_no_map);
    accounts.Client_number(dataAccounts.Client_number)
    accounts.Description(dataAccounts.Description);
    accounts.Clearer(dataAccounts.Clearer);
    accounts.Date_created(moment(getUTCDate(new Date(dataAccounts.Date_created))).format("MMMM DD , YYYY"));
    accounts.Date_updated(moment(getUTCDate(new Date(dataAccounts.Date_updated))).format("MMMM DD , YYYY"));
    accounts.Update_user(dataAccounts.Update_user);
    accounts.Tt_member(dataAccounts.Tt_member);
    accounts.Tt_group(dataAccounts.Tt_group);
    accounts.Tt_trader(dataAccounts.Tt_trader);
    accounts.Program(dataAccounts.Program);
    accounts.Auto_launch_login(dataAccounts.Auto_launch_login);
    accounts.Auto_launch_password(dataAccounts.Auto_launch_password);
  });
  if (subscription != undefined)
    subscription.dispose();
}


accounts.cencelData = function () {
  var validator = $("#accountsForm").data("kendoValidator");
  //console.log(validator);
  if (validator == undefined) {
    validator = $("#accountsForm").kendoValidator().data("kendoValidator");
  }
  validator.hideMessages();
  accounts.formAccounts(true);
  accounts.getDataGridAccounts();
  if (subscription != undefined)
    subscription.dispose();

}

$(document).ready(function () {
  $('#li2').click(function () {
    $("#dateCreated").kendoDatePicker({
      format: "MMMM dd , yyyy",
    }).data("kendoDatePicker");

    $("#dateUpdated").kendoDatePicker({
      format: "MMMM dd , yyyy",
    }).data("kendoDatePicker");
    //accounts.getDataGridAccounts();
    accounts.dropdown();
  })
  //accounts.FilterStatus();

});