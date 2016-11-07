var CmmGroupFees = {
  isProcessing: ko.observable(false),
  formcommissionGroupFee: ko.observable(true),
  filterGroupID: ko.observable(""),
  filterContractID: ko.observable(""),
  titlepanel: ko.observable(' Hide Filter'),
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
  if (model.View() != "false" && CmmGroupFees.reset() == false) {
    CmmGroupFees.reloadGrid()
  }
});

CmmGroupFees.filterContractID.subscribe(function (value) {
  if (model.View() != "false" && CmmGroupFees.reset() == false) {
    CmmGroupFees.reloadGrid()
  }
});

CmmGroupFees.reloadGrid = function(){
  var num = clients.Commission_groupid();
  if(num != undefined){
    var str  = num.toString();
  }else{
    var str = "";
  }
  $("#MasterGridCmmGroupFees").data("kendoGrid").dataSource.read({
    Groupid: str,
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
  $("#Contractid").data("kendoDropDownList").readonly();
  CmmGroupFees.Edit(true)
  CmmGroupFees.dropdown();
  CmmGroupFees.formcommissionGroupFee(false);
  ajaxPost("/mastercomissiongroupfee/getdata", {Id: d}, function (res) {
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
  $("#Contractid").data("kendoDropDownList").readonly(false);
  CmmGroupFees.dropdown();
  CmmGroupFees.formcommissionGroupFee(false);
  CmmGroupFees.Groupid(clients.Commission_groupid());
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
  CmmGroupFees.dropdown();
  $("#tab8").hide();
  CmmGroupFees.loading(true);
  var num = clients.Commission_groupid();
  if(num != undefined){
    var str  = num.toString();
  }else{
    var str = "";
  }
  var param = {
    Groupid: str,
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
          CmmGroupFees.loading(false);
          // gc.Init();
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
    // columnMenu: true,
    // columnHide: function(e) {
    //   gc.RemoveColumn(e.column.field);
    // },
    // columnShow: function(e) {
    //   gc.AddColumn(e.column.field);
    // },
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
      },
      {
        field: "",
        title:"",
        width:50,
        template: "<button name='rename' type='button' onclick='CmmGroupFees.deleteData(\"#: Id #\")' class='btn btn-danger btn-xs rename'><span class='fa fa-trash'></span></button>",
        attributes: {"class": "align-center"}
      },
    ]
  });
}

CmmGroupFees.deleteData = function(id){
  var param ={
    Id: id
  }

  var url = "/mastercomissiongroupfee/deletedata";
  swal({
      title: "Are you sure?",
      text: "Are you sure remove this data!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, I am sure!',
      cancelButtonText: "No, cancel it!",
      closeOnConfirm: false,
      closeOnCancel: false
  },
  function(isConfirm) {
      if (isConfirm) {
          ajaxPost(url, param, function(data){
              if (data.IsError == false){
                  CmmGroupFees.getDataGridCmmGroupFees();
                  swal("Success!","Data Success Delete","success");
              }else{
                  swal("Error!",data.Message,"error");
              }
          });
      } else {
          swal("Cancelled", "Cancelled Client Account", "error");
      }
  });

}

CmmGroupFees.Contractid.subscribe(function(value){
  var num = clients.Commission_groupid();
  if(num != undefined){
    var str  = num.toString();
  }else{
    var str = "";
  }
  var param ={
    Groupid: str,
    Contractid: value
  }
  var url = "/mastercomissiongroupfee/getdata";
  if(value == ""){
    CmmGroupFees.Marketfee(0);
    CmmGroupFees.Marketfeecrncy("");
    CmmGroupFees.Clrcommission(0);
    CmmGroupFees.Clrcommcrncy("");
    CmmGroupFees.Nfafee(0);
    CmmGroupFees.Nfafeecrncy("");
    CmmGroupFees.Miscfee(0);
    CmmGroupFees.Miscfeecrncy("");
  }else{
    ajaxPost(url, param, function (res) {
      var data = res.Data.Records;
      if (res.IsError != true && data.length != 0){
        CmmGroupFees.Miscfee(data[0].Misc_fee);
        CmmGroupFees.Miscfeecrncy(data[0].Misc_fee_crncy);
        CmmGroupFees.Nfafee(data[0].Nfa_fee);
        CmmGroupFees.Nfafeecrncy(data[0].Nfa_fee_crncy);
        CmmGroupFees.Clrcommission(data[0].Clr_commission);
        CmmGroupFees.Clrcommcrncy(data[0].Clr_comm_crncy);
        CmmGroupFees.Marketfee(data[0].Market_fee);
        CmmGroupFees.Marketfeecrncy(data[0].Market_fee_crncy);

      }else{
        ajaxPost("/mastercontract/getdata", {Id: parseInt(value)}, function (res) {
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
      
    })
  }
  
});

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

CmmGroupFees.toggleFilter = function(){
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
  CmmGroupFees.panel_relocated();
  if(CmmGroupFees.titlepanel() == ' Show Filter'){
    CmmGroupFees.titlepanel(' Hide Filter');
  }else{
    CmmGroupFees.titlepanel(' Show Filter')
  }
}

CmmGroupFees.panel_relocated = function(){
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
  
});