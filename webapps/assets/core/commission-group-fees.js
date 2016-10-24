var CmmGroupFees = {
  isProcessing: ko.observable(false),
  formcommissionGroupFee: ko.observable(true),
  filterGroupID: ko.observable(""),
  filterContractID: ko.observable(""),
  Edit: ko.observable(true),
  currency: ko.observableArray([]),
  group: ko.observableArray([]),
  contract: ko.observableArray([]),
  loading: ko.observable(false),
  Id: ko.observable(),
  Groupid: ko.observable(),
  Contractid: ko.observable(),
  Marketfee: ko.observable(),
  Marketfeecrncy: ko.observable(),
  Clrcommission: ko.observable(),
  Clrcommcrncy: ko.observable(),
  Nfafee: ko.observable(),
  Nfafeecrncy: ko.observable(),
  Miscfee: ko.observable(),
  Miscfeecrncy: ko.observable(),
  reset: ko.observable(false),
}
CmmGroupFees.backMenuMaster = function () {
  window.location.href = "/datamaster/default";
}
CmmGroupFees.searchData = function () {
  CmmGroupFees.getDataGridCmmGroupFees();
}
CmmGroupFees.resetData = function () {
  CmmGroupFees.reset(true)
  CmmGroupFees.filterGroupID("");
  CmmGroupFees.filterContractID("");
  CmmGroupFees.getDataGridCmmGroupFees()
  CmmGroupFees.reset(false)
}
CmmGroupFees.cancelData = function () {
  CmmGroupFees.formcommissionGroupFee(true);
  CmmGroupFees.getDataGridCmmGroupFees();
  CmmGroupFees.dropdown();
}
CmmGroupFees.filterGroupID.subscribe(function (value) {
  if (model.View() != "false" && CmmGroupFees.filterGroupID() != "") {
    CmmGroupFees.getDataGridCmmGroupFees()
  }
});
CmmGroupFees.filterContractID.subscribe(function (value) {
  if (model.View() != "false" && CmmGroupFees.filterContractID() != "") {
    CmmGroupFees.getDataGridCmmGroupFees();
  }
});
CmmGroupFees.Clearfield = function(){
    CmmGroupFees.Marketfee(0);
    CmmGroupFees.Marketfeecrncy("");
    CmmGroupFees.Clrcommission(0);
    CmmGroupFees.Clrcommcrncy("");
    CmmGroupFees.Nfafee(0);
    CmmGroupFees.Nfafeecrncy("");
    CmmGroupFees.Miscfee(0);
    CmmGroupFees.Miscfeecrncy("");
}
CmmGroupFees.Groupid.subscribe(function (Groupid) {
    if (CmmGroupFees.Edit() == true){
      return "";
    }
    if (CmmGroupFees.Contractid() != "" && CmmGroupFees.Groupid() != ""){
        var param = {
          "Groupid" : Groupid,
          "Contractid" : CmmGroupFees.Contractid()
        } 
        ajaxPost("/mastercomissiongroupfee/getdata", param, function (res) {
          if (res.Data.Count != 0){
            var data = res.Data.Records[0];
            CmmGroupFees.Marketfee(data.Market_fee);
            CmmGroupFees.Marketfeecrncy(data.Market_fee_crncy);
            CmmGroupFees.Clrcommission(data.Clr_commission);
            CmmGroupFees.Clrcommcrncy(data.Clr_comm_crncy);
            CmmGroupFees.Nfafee(data.Nfa_fee);
            CmmGroupFees.Nfafeecrncy(data.Nfa_fee_crncy);
            CmmGroupFees.Miscfee(data.Misc_fee);
            CmmGroupFees.Miscfeecrncy(data.Misc_fee_crncy);
          }else{
            CmmGroupFees.Clearfield(); 
          }
        });
    }else{
        CmmGroupFees.Clearfield(); 
    }
});
CmmGroupFees.Contractid.subscribe(function (Contractid) {
    if (CmmGroupFees.Edit() == true){
      return "";
    }
    if (CmmGroupFees.Contractid() != "" && CmmGroupFees.Groupid() != ""){
        var param = {
          "Groupid" : CmmGroupFees.Groupid(),
          "Contractid" : Contractid
        } 
        ajaxPost("/mastercomissiongroupfee/getdata", param, function (res) {
          var data = res.Data.Records;
          if (res.Data.Count != 0 && data.length != 0){
            CmmGroupFees.Marketfee(data[0].Market_fee);
            CmmGroupFees.Marketfeecrncy(data[0].Market_fee_crncy);
            CmmGroupFees.Clrcommission(data[0].Clr_commission);
            CmmGroupFees.Clrcommcrncy(data[0].Clr_comm_crncy);
            CmmGroupFees.Nfafee(data[0].Nfa_fee);
            CmmGroupFees.Nfafeecrncy(data[0].Nfa_fee_crncy);
            CmmGroupFees.Miscfee(data[0].Misc_fee);
            CmmGroupFees.Miscfeecrncy(data[0].Misc_fee_crncy);
          }else{
            CmmGroupFees.Clearfield();
            ajaxPost("/mastercontract/getdata", {Id: parseInt(Contractid)}, function (res) {
              var data1 = res.Data.Records[0];
              if (res.IsError != true){
                CmmGroupFees.Miscfee((data1.Def_misc_fee).toString());
                CmmGroupFees.Miscfeecrncy((data1.Misc_fee_crncy).toString());
                CmmGroupFees.Nfafee((data1.Def_nfa_fee).toString());
                CmmGroupFees.Nfafeecrncy((data1.Nfa_fee_crncy).toString());
                CmmGroupFees.Clrcommission((data1.Def_clr_commission).toString());
                CmmGroupFees.Clrcommcrncy((data1.Clr_comm_crncy).toString());
                CmmGroupFees.Marketfee((data1.Def_market_fee).toString());
                CmmGroupFees.Marketfeecrncy((data1.Market_fee_crncy).toString());
              }
            })
          }
        });
      }else{
        CmmGroupFees.Clearfield();
      }
});
CmmGroupFees.reloadGrid = function(){
  $("#MasterGridCmmGroupFees").data("kendoGrid").dataSource.read({
    Groupid: CmmGroupFees.filterGroupID(),
    Contractid: CmmGroupFees.filterContractID()
  })
}
CmmGroupFees.saveData = function () {
  var validator = $("#commfee").data("kendoValidator");
  //console.log(validator);
  if (validator == undefined) {
    validator = $("#commfee").kendoValidator().data("kendoValidator");
  }
  clrCom = CmmGroupFees.Clrcommission().toString()
  var param = {
    Groupid: parseInt(CmmGroupFees.Groupid()),
    Contractid: parseInt(CmmGroupFees.Contractid()),
    Marketfee: parseFloat(CmmGroupFees.Marketfee()),
    Marketfeecrncy: CmmGroupFees.Marketfeecrncy(),
    Clrcommission: clrCom,
    Clrcommcrncy: CmmGroupFees.Clrcommcrncy(),
    Nfafee: parseFloat(CmmGroupFees.Nfafee()),
    Nfafeecrncy: CmmGroupFees.Nfafeecrncy(),
    Miscfee: parseFloat(CmmGroupFees.Miscfee()),
    Miscfeecrncy: CmmGroupFees.Miscfeecrncy(),
  }
  var url = "/mastercomissiongroupfee/savedata";
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      // swal({
      //   title: "Data Saved !!",
      //   text: res.Message,
      //   type: "success",
      //   confirmButtonClass: "btn-success",
      //   confirmButtonText: "oke",
      //   closeOnConfirm: true
      // }, function (isConfirm) {
      //   if (isConfirm) {
      //     CmmGroupFees.cancelData();
      //   }
      // });
      if(res.IsError != true){
          CmmGroupFees.cancelData();
          swal("Success!", res.Message, "success");
      }else{
          return swal("Error!", res.Message, "error");
      }
    });
  }
}
CmmGroupFees.saveEdit = function () {
  var validator = $("#commfee").data("kendoValidator");
  //console.log(validator);
  if (validator == undefined) {
    validator = $("#commfee").kendoValidator().data("kendoValidator");
  }
  var param = {
    Id: CmmGroupFees.Id(),
    Groupid: parseInt(CmmGroupFees.Groupid()),
    Contractid: parseInt(CmmGroupFees.Contractid()),
    Marketfee: parseFloat(CmmGroupFees.Marketfee()),
    Marketfeecrncy: CmmGroupFees.Marketfeecrncy(),
    Clrcommission: CmmGroupFees.Clrcommission().toString(),
    Clrcommcrncy: CmmGroupFees.Clrcommcrncy(),
    Nfafee: parseFloat(CmmGroupFees.Nfafee()),
    Nfafeecrncy: CmmGroupFees.Nfafeecrncy(),
    Miscfee: parseFloat(CmmGroupFees.Miscfee()),
    Miscfeecrncy: CmmGroupFees.Miscfeecrncy(),
  }
  var url = "/mastercomissiongroupfee/savedata";
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      // swal({
      //   title: "Data Saved !!",
      //   text: res.Message,
      //   type: "success",
      //   confirmButtonClass: "btn-success",
      //   confirmButtonText: "oke",
      //   closeOnConfirm: true
      // }, function (isConfirm) {
      //   if (isConfirm) {
      //     CmmGroupFees.cancelData();
      //   }
      // });
      if(res.IsError != true){
          CmmGroupFees.cancelData();
          swal("Success!", res.Message, "success");
      }else{
          return swal("Error!", res.Message, "error");
      }
    });
  }
}
CmmGroupFees.editCmmGroupfees = function (d) {
  CmmGroupFees.Edit(true)
  CmmGroupFees.formcommissionGroupFee(false);
  ajaxPost("/mastercomissiongroupfee/getdata", {Id: d}, function (res) {
    $("#fieldcmmgroupid").data("kendoDropDownList").readonly();
    $("#fieldContractid").data("kendoDropDownList").readonly();
    var data = res.Data.Records[0];
    CmmGroupFees.Id(data.Id);
    CmmGroupFees.Groupid(data.Groupid);
    CmmGroupFees.Contractid(data.Contractid);
    CmmGroupFees.Marketfee(data.Market_fee);
    CmmGroupFees.Marketfeecrncy(data.Market_fee_crncy);
    CmmGroupFees.Clrcommission(data.Clr_commission);
    CmmGroupFees.Clrcommcrncy(data.Clr_comm_crncy);
    CmmGroupFees.Nfafee(data.Nfa_fee);
    CmmGroupFees.Nfafeecrncy(data.Nfa_fee_crncy);
    CmmGroupFees.Miscfee(data.Misc_fee);
    CmmGroupFees.Miscfeecrncy(data.Misc_fee_crncy);
  })
}
CmmGroupFees.addNew = function () {
  CmmGroupFees.Edit(false);
  $("#fieldcmmgroupid").data("kendoDropDownList").enable();
  $("#fieldContractid").data("kendoDropDownList").enable();
  CmmGroupFees.formcommissionGroupFee(false);
  CmmGroupFees.Groupid("");
  CmmGroupFees.Contractid("");
  CmmGroupFees.Marketfee(0);
  CmmGroupFees.Marketfeecrncy("");
  CmmGroupFees.Clrcommission(0);
  CmmGroupFees.Clrcommcrncy("");
  CmmGroupFees.Nfafee(0);
  CmmGroupFees.Nfafeecrncy("");
  CmmGroupFees.Miscfee(0);
  CmmGroupFees.Miscfeecrncy("");
}
var userid = model.User();
var gc = new GridColumn('cmm_group_fee_master', userid, 'MasterGridCmmGroupFees');
CmmGroupFees.getDataGridCmmGroupFees = function () {
  CmmGroupFees.loading(true);
  var param = {
    Groupid: CmmGroupFees.filterGroupID(),
    Contractid: CmmGroupFees.filterContractID()
  };

  var dataSource = [];
  var url = "/mastercomissiongroupfee/getdata";
  $("#MasterGridCmmGroupFees").html("");
  $("#MasterGridCmmGroupFees").kendoGrid({
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
          CmmGroupFees.loading(false);
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
        field: "GroupDesc",
        title: "Commission Group",
        // width: 120,
        template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:CmmGroupFees.editCmmGroupfees(\"#: Id #\")'>#: GroupDesc #</a>#}else{#<div>#: GroupDesc #</div>#}#"
      },
      {
        field: "ContractDesc",
        title: "Commission Contract",
        // width: 150
      },
      {
        field: "Market_fee",
        title: "Market Fee",
        // width: 100,
        attributes: {"class": "align-right"}
      },
      {
        field: "Market_fee_desc",
        title: "Market Fee Currency",
        // width: 150
      },
      {
        field: "Clr_commission",
        title: "Clr Commission",
        // width: 110,
        attributes: {"class": "align-right"}
      },
      {
        field: "Clr_commission_desc",
        title: "Clr Comm Currency",
        // width: 150
      },
      {
        field: "Nfa_fee",
        title: "Nfa Fee",
        // width: 100,
        attributes: {"class": "align-right"}
      },
      {
        field: "Nfa_fee_desc",
        title: "Nfa Fee Currency",
        // width: 100
      },
      {
        field: "Misc_fee",
        title: "Misc Fee",
        // width: 80,
        attributes: {"class": "align-right"}
      },
      {
        field: "Misc_fee_desc",
        title: "Misc Fee Currency",
        // width: 130
      }
    ]
  });
}

CmmGroupFees.dropdown = function () {
  ajaxPost("/datamaster/getcurrency", {}, function (res) {
    //console.log(res);
    CmmGroupFees.currency([]);
    for (var i = 0; i < res.length; i++) {
      CmmGroupFees.currency.push({
        title: res[i].currency_code,
        value: res[i]._id
      });
    }

  });
  ajaxPost("/datamaster/getcommissiongroup", {}, function (res) {
    CmmGroupFees.group([]);
    res.map(function (d) {
      CmmGroupFees.group.push({
        title: d.name,
        value: d._id
      });
    })
  });
  ajaxPost("/datamaster/getcontract", {}, function (data) {
    CmmGroupFees.contract([]);
    data.map(function (m) {
      CmmGroupFees.contract.push({
        title: m.contract_code,
        value: m._id
      });
    })
  });
}

$(document).ready(function () {
  CmmGroupFees.getDataGridCmmGroupFees();
  CmmGroupFees.dropdown();
});