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
  TitelFilter : ko.observable(" Hide Filter"),
};

accounts.searchAccountNumber = function(data, event){
  if(model.View() != "false" && accounts.reset() == false){
    if(accounts.FilterAccountNumber().length >=3 == true || accounts.FilterAccountNumber().length == 0){
      accounts.reloadGrid();
    }
  }
}

accounts.searchAccNoMap = function(data, event){
  if(model.View() != "false" && accounts.reset() == false){
    if(accounts.FilterAccNoMap().length >=3 || accounts.FilterAccNoMap().length == 0){
      accounts.reloadGrid()
    }
  } 
}

accounts.searchAcctName = function(data, event){
  if(model.View() != "false" && accounts.reset() == false){
    if(accounts.FilterAccountName().length >=3 || accounts.FilterAccountName().length == 0){
      accounts.reloadGrid()
    }
  }
}

accounts.FilterClientNumber.subscribe(function(value){
  if(model.View() != "false" && accounts.reset() == false){
    accounts.reloadGrid()
  }
});

accounts.FilterStatus = function(){
  if(model.View() != "false"){
    $('#onstatus').on('switchChange.bootstrapSwitch', function(event, state) {
        if(state == false){
            accounts.onstatus(0);
        }else{
            accounts.onstatus(1);
        }
        if(accounts.reset() == false){
          accounts.reloadGrid();
        } 
    });
  }
  
}

accounts.resetData = function(){
  accounts.reset(true);
  $('#onstatus').bootstrapSwitch('state', true);
  accounts.FilterAccountNumber("");
  accounts.FilterClientNumber("");
  accounts.FilterAccountName("");
  accounts.FilterAccNoMap("");
  accounts.getDataGridAccounts();
  accounts.reset(false);
}

accounts.reloadGrid = function(){
  $('#MasterGridAccounts').data('kendoGrid').dataSource.read({
    "Id": accounts.FilterAccountNumber(),
    "Description": accounts.FilterAccountName(),
    "Accnomap": accounts.FilterAccNoMap(),
    "ClientNumber": accounts.FilterClientNumber(),
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

var userid = model.User();
var gc = new GridColumn('role_master', userid, 'MasterGridAccounts');
accounts.getDataGridAccounts = function () {
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
    "ClientNumber": accounts.FilterClientNumber(),
    "Status": accounts.onstatus()
  };
  var dataSource = [];
  var url = "/masteraccount/getdata";
  $("#MasterGridAccounts").html("");
  $("#MasterGridAccounts").kendoGrid({
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
          gc.Init();
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
    columnMenu: false,
    columnHide: function(e) {
      gc.RemoveColumn(e.column.field);
    },
    columnShow: function(e) {
      gc.AddColumn(e.column.field);
    },
    columns: [
      {
        field: "Id", 
        title: "Account", 
        template:  "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:accounts.editAccount(\"#: Id #\")'>#: Id #</a>#}else{#<div>#: Id #</div>#}#", 
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
    ]
  });
  accounts.reset(false);
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
      if(res.IsError != true){
          accounts.cencelData();
          swal("Success!", res.Message, "success");
      }else{
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
      if(res.IsError != true){
          accounts.cencelData();
          swal("Success!", res.Message, "success");
      }else{
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
  accounts.Client_number("");
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
  accounts.Edit(false);
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

accounts.toggleFilter = function(){
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
  accounts.panel_relocated();
    var FilterTitle = accounts.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        accounts.TitelFilter(" Show Filter");
    }else{
        accounts.TitelFilter(" Hide Filter");
    }
}

accounts.panel_relocated = function(){
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
  accounts.FilterStatus();
  $("#dateCreated").kendoDatePicker({
    format: "MMMM dd , yyyy",
  }).data("kendoDatePicker");

  $("#dateUpdated").kendoDatePicker({
    format: "MMMM dd , yyyy",
  }).data("kendoDatePicker");
  accounts.getDataGridAccounts();
  accounts.dropdown();
});