var contracts = {
  isProcessing: ko.observable(false),
  Edit: ko.observable(false),
  form: ko.observable(false),
  currency: ko.observableArray([]),
  isFractional: ko.observable(false),
  Edit: ko.observable(false),
  ftrCtrType: ko.observableArray([]), //contract filter
  contractType: ko.observableArray(), //when save
  enable: ko.observable(false),
  filterContractCode: ko.observableArray(),
  filterContractName: ko.observableArray(),
  filterExcahnge: ko.observableArray(),
  filterFullName: ko.observableArray(),
  loading: ko.observable(false),
  Id: ko.observable(),
  Contractcode: ko.observable(),
  Contractmap: ko.observable(),
  ClearerCode: ko.observable(),
  Fullname: ko.observable(),
  Multiplier: ko.observable(),
  Divisor: ko.observable(),
  Noofdigits: ko.observable(),
  Fractional: ko.observable(),
  Fractionalval: ko.observable(),
  Currency: ko.observable(),
  Exchange: ko.observable(),
  Defmarketfee: ko.observable(),
  Marketfeecrncy: ko.observable(),
  Defclrcommission: ko.observable(),
  Clrcommcrncy: ko.observable(),
  Defnfafee: ko.observable(),
  Nfafeecrncy: ko.observable(),
  Defmiscfee: ko.observable(),
  Miscfeecrncy: ko.observable(),
  Settlemethod: ko.observable(),
  reset: ko.observable(false),
  TitelFilter : ko.observable(" Hide Filter"),
  contractsGroup : ko.observable(""),
  contractsSubGroup : ko.observable(""),
  //list Data
  listContractCode: ko.observableArray([]),
  listContractName: ko.observableArray([]),
  listExchange: ko.observableArray([]),
  listFullName: ko.observableArray([]),
  listContractType: ko.observableArray([]),
  lsitContractGroup : ko.observableArray(),
  lsitContractSubGroup : ko.observableArray(),
};

contracts.backMenuMaster = function () {
  window.location.href = "/datamaster/default";
}

contracts.searchData = function () {
  contracts.getDataGridContracts();
}

contracts.resetData = function () {
  contracts.reset(true);
  contracts.filterContractCode([]);
  contracts.filterContractName([]);
  contracts.filterExcahnge([]);
  contracts.filterFullName([]);
  contracts.ftrCtrType([]);
  contracts.getDataGridContracts();
  contracts.reset(false);
}

contracts.filterContractCode.subscribe(function (value) {
  if (model.View() != "false" && contracts.reset() == false) {
    contracts.reloadGrid();
  }
});

contracts.filterExcahnge.subscribe(function (value) {
  if (model.View() != "false" && contracts.reset() == false) {
    contracts.reloadGrid();
  }
});

contracts.filterFullName.subscribe(function (value) {
  if (model.View() != "false" && contracts.reset() == false) {
    contracts.reloadGrid();
  }
});

contracts.reloadGrid = function () {
  $("#MasterGridContracts").data("kendoGrid").dataSource.read({
    ContractCode: contracts.filterContractCode(),
    Exchange: contracts.filterExcahnge(),
    FullName: contracts.filterFullName(),
    Contracttype: contracts.ftrCtrType()
  });
}

contracts.ftrCtrType.subscribe(function (value) {
  if (model.View() != "false" && contracts.reset() == false) {
    contracts.reloadGrid();
  }
});

contracts.getDataGridContracts = function () {
  contracts.loading(true)
  var param = {
    ContractCode: contracts.filterContractCode(),
    Exchange: contracts.filterExcahnge(),
    FullName: contracts.filterFullName(),
    Contracttype: contracts.ftrCtrType()
  };

  var dataSource = [];
  var url = "/mastercontract/getdata";
  $("#MasterGridContracts").html("");
  $("#MasterGridContracts").kendoGrid({
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
          contracts.loading(false);
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
    excel: {
      allPages: true
    },
    excelExport: function (e) {
      //e.AllPages(true);
      //e.workbook.fileName = "daily nlv summary All Dates";
      var now = new Date();
      var dd = now.getDate();
      var mm = now.getMonth()+1;
      var yyyy= now.getFullYear();
      e.workbook.fileName = "Master Contracts " + dd+"/"+mm+"/"+yyyy+ ".xlsx";
    },
    columns: [{
        width: 125,
        field: "Contract_code",
        title: "Contract Code",
        template: function (d) {
          if (model.Edit() != 'false') {
            return "<a class='grid-select'  href='javascript:contracts.editContract(" + d.Id + ")'>" + d.Contract_code + "</a>"
          } else {
            return "<div>" + d.Contract_code + "</div>"
          }
        }
      },
      {
        width: 250,
        field: "Fullname",
        title: "Full Name",
      },
      {
        width: 100,
        field: "Exchange",
        title: "Exchange"
      }

    ]
  });
}

contracts.settle = [
  {title: "CASH", value: "CASH"},
  {title: "PHYSICAL", value: "PHYSICAL"},
];



contracts.editContract = function (d) {
  $("#tab2").removeClass("active");
  $("#tab1").addClass("active");
  $("#li2").removeClass("active");
  $("#li1").addClass("active");
  contracts.enable(false);
  ajaxPost("/mastercontract/getdata", {Id: d}, function (res) {
    var w = res.Data.Records[0];
    contracts.Id(w.Id);
    var onid = w.Id.toString();
    // expiry.formConfig.Contractid(w.Id);
    expiry.Id(onid+"~"+w.Fullname);
    expiry.formConfig.Fullname(w.Fullname);
    expiry.filterContractCode([w.Id])
    CmmGroupFees.filterContractID(onid.toString())
    contracts.Contractcode(w.Contract_code);
    contracts.Contractmap(w.Contract_map);
    contracts.ClearerCode(w.Clearer_Code);
    contracts.Fullname(w.Fullname);
    contracts.Multiplier(w.Multiplier);
    contracts.Divisor(w.Divisor);
    contracts.Noofdigits(w.No_of_digits);
    contracts.Fractional(w.Fractional);
    contracts.Fractionalval(w.Fractional_val);
    contracts.Currency(w.Currency);
    contracts.Exchange(w.Exchange);
    contracts.Defmarketfee(w.Def_market_fee);
    contracts.Marketfeecrncy(w.Market_fee_crncy);
    contracts.Defclrcommission(w.Def_clr_commission);
    contracts.Clrcommcrncy(w.Clr_comm_crncy);
    contracts.Defnfafee(w.Def_nfa_fee);
    contracts.Nfafeecrncy(w.Nfa_fee_crncy);
    contracts.Defmiscfee(w.Def_misc_fee);
    contracts.Miscfeecrncy(w.Misc_fee_crncy);
    contracts.Settlemethod(w.Settlemethod);
    contracts.contractType(w.Contracttype);
    contracts.contractType("");
    contracts.contractsGroup("");
    if (contracts.Fractional() == "Y") {
      $('#isfrak').bootstrapSwitch('state', true);
    } else {
      $('#isfrak').bootstrapSwitch('state', false);
    }

  });
  contracts.Edit(true)
  contracts.form(true);
  $("#frak").prop('readonly', true);
  $('#isfrak').on('switchChange.bootstrapSwitch', function (event, state) {
    contracts.enable(state);
    console.log(state)
    if (state == false) {
      $("#frak").prop('readonly', true);
      contracts.Fractionalval(0);
    } else {
      $("#frak").prop('readonly', false);
    }
  });
  if ($('#isfrak').bootstrapSwitch('state') == false) {
    contracts.Fractional("N");
    contracts.Fractionalval("");
  } else {
    contracts.Fractional("Y");
  }
}

contracts.addContract = function () {
  $("#tab2").removeClass("active");
  $("#tab1").addClass("active");
  $("#li2").removeClass("active");
  $("#li1").addClass("active");
  contracts.form(true);
  contracts.Edit(false);
  contracts.Contractcode("");
  contracts.Contractmap("");
  contracts.ClearerCode("");
  contracts.Fullname("");
  contracts.Multiplier(0);
  contracts.Divisor(0);
  contracts.Noofdigits(0);
  contracts.Fractional("N");
  contracts.Fractionalval(0);
  contracts.Currency("");
  contracts.Exchange("");
  contracts.Defmarketfee(0);
  contracts.Marketfeecrncy("");
  contracts.Defclrcommission(0);
  contracts.Clrcommcrncy("");
  contracts.Defnfafee(0);
  contracts.Nfafeecrncy("");
  contracts.Defmiscfee(0);
  contracts.Miscfeecrncy("");
  contracts.Settlemethod("");
  contracts.contractType("");
  contracts.contractsGroup("");
  contracts.contractsSubGroup("");
  $("#frak").prop('readonly', true);
  $('#isfrak').on('switchChange.bootstrapSwitch', function (event, state) {
    console.log(state)
    contracts.enable(state);
    if (state == false) {
      contracts.Fractional("N");
      $("#frak").prop('readonly', true);
      contracts.Fractionalval(0);
    } else {
      contracts.Fractional("Y");
      $("#frak").prop('readonly', false);
    }
  });
  // if( $('#isfrak').bootstrapSwitch('state') == false){
  //     contracts.Fractional("N");
  //     contracts.Fractionalval("");
  // }else{
  //     contracts.Fractional("Y");
  // }
}

contracts.dropdown = function () {
  contracts.currency([])
  ajaxPost("/datamaster/getcurrency", {}, function (res) {
    //console.log(res);
    for (var i = 0; i < res.length; i++) {
      contracts.currency.push({
        title: res[i].currency_code,
        value: res[i]._id
      });
    }

  });
}

contracts.typeContract = [
  {value: "FUTURE", title: "FUTURE"},
  {value: "OPTIONS", title: "OPTIONS"},
  {value: "EQUITY", title: "EQUITY"},
]

contracts.saveData = function () {
  var validator = $("#contract").data("kendoValidator");
  //console.log(validator);
  if (validator == undefined) {
    validator = $("#contract").kendoValidator().data("kendoValidator");
  }

  var Enable = "N";
  if ($('#isfrak').bootstrapSwitch('state') == true) {
    Enable = "Y"
  }
  var selectGrup = $("#contractsGroup").data("kendoDropDownList");
  var selectSubGrup = $("#contractsSubGroup").data("kendoDropDownList");

  var param = {
    Id: -1,
    Contractcode: contracts.Contractcode(),
    Contractmap: contracts.Contractmap(),
    ClearerCode: contracts.ClearerCode(),
    Fullname: contracts.Fullname(),
    Multiplier: parseFloat(contracts.Multiplier()),
    Divisor: parseFloat(contracts.Divisor()),
    Noofdigits: parseInt(contracts.Noofdigits()),
    Fractional: Enable,
    Fractionalval: parseInt(contracts.Fractionalval()),
    Currency: parseInt(contracts.Currency()),
    Exchange: contracts.Exchange(),
    Defmarketfee: parseFloat(contracts.Defmarketfee()),
    Marketfeecrncy: parseInt(contracts.Marketfeecrncy()),
    Defclrcommission: parseFloat(contracts.Defclrcommission()),
    Clrcommcrncy: parseInt(contracts.Clrcommcrncy()),
    Defnfafee: parseFloat(contracts.Defnfafee()),
    Nfafeecrncy: parseInt(contracts.Nfafeecrncy()),
    Defmiscfee: parseFloat(contracts.Defmiscfee()),
    Miscfeecrncy: parseInt(contracts.Miscfeecrncy()),
    Settlemethod: contracts.Settlemethod(),
    Contracttype: contracts.contractType(),
    ContractGroupId: parseInt(contracts.contractsGroup()),
    ContractSubGroupId: parseInt(contracts.contractsSubGroup()),
    ContractGroupName: selectGrup.text(),
    ContractSubGroupName: selectSubGrup.text(),
  }

  var url = "/mastercontract/savedata";
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      // swal({
      //   title: "Data Saved !!",
      //   text: "Data Accounts Has Been Saved",
      //   type: "success",
      //   confirmButtonClass: "btn-success",
      //   confirmButtonText: "oke",
      //   closeOnConfirm: true
      // }, function (isConfirm) {
      //   if (isConfirm) {
      //     contracts.cancelData();
      //   }
      // });
      if (res.IsError != true) {
        contracts.cancelData();
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

contracts.saveEdit = function () {
  var validator = $("#contract").data("kendoValidator");
  //console.log(validator);
  if (validator == undefined) {
    validator = $("#contract").kendoValidator().data("kendoValidator");
  }
  var Enable = "N";
  if ($('#isfrak').bootstrapSwitch('state') == true) {
    Enable = "Y"
  }

  var selectGrup = $("#contractsGroup").data("kendoDropDownList");
  var selectSubGrup = $("#contractsSubGroup").data("kendoDropDownList");

  var param = {
    Id: contracts.Id(),
    Contractcode: contracts.Contractcode(),
    Contractmap: contracts.Contractmap(),
    ClearerCode: contracts.ClearerCode(),
    Fullname: contracts.Fullname(),
    Multiplier: parseFloat(contracts.Multiplier()),
    Divisor: parseFloat(contracts.Divisor()),
    Noofdigits: parseInt(contracts.Noofdigits()),
    Fractional: Enable,
    Fractionalval: parseInt(contracts.Fractionalval()),
    Currency: parseInt(contracts.Currency()),
    Exchange: contracts.Exchange(),
    Defmarketfee: parseFloat(contracts.Defmarketfee()),
    Marketfeecrncy: parseInt(contracts.Marketfeecrncy()),
    Defclrcommission: parseFloat(contracts.Defclrcommission()),
    Clrcommcrncy: parseInt(contracts.Clrcommcrncy()),
    Defnfafee: parseFloat(contracts.Defnfafee()),
    Nfafeecrncy: parseInt(contracts.Nfafeecrncy()),
    Defmiscfee: parseFloat(contracts.Defmiscfee()),
    Miscfeecrncy: parseInt(contracts.Miscfeecrncy()),
    Settlemethod: contracts.Settlemethod(),
    Contracttype: contracts.contractType(),
    ContractGroupId: parseInt(contracts.contractsGroup()),
    ContractSubGroupId: parseInt(contracts.contractsSubGroup()),
    ContractGroupName: selectGrup.text(),
    ContractSubGroupName: selectSubGrup.text(),
  }

  var url = "/mastercontract/savedata";
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      // swal({
      //   title: "Data Saved !!",
      //   text: "Data Accounts Has Been Saved",
      //   type: "success",
      //   confirmButtonClass: "btn-success",
      //   confirmButtonText: "oke",
      //   closeOnConfirm: true
      // }, function (isConfirm) {
      //   if (isConfirm) {
      //     contracts.cancelData();
      //   }
      // });
      if (res.IsError != true) {
        contracts.cancelData();
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }

}

contracts.cancelData = function () {
  $("#tab4").removeClass("active");
  $("#tab3").removeClass("active");
  $("#tab2").removeClass("active");
  $("#tab1").addClass("active");
  $("#li4").removeClass("active");
  $("#li3").removeClass("active");
  $("#li2").removeClass("active");
  $("#li1").addClass("active");
  contracts.form(false);
  contracts.getDataGridContracts();
}

contracts.getContractCode = function () {
  var param = {};
  contracts.listContractCode([]);
  contracts.listExchange([]);
  contracts.listFullName([]);
  ajaxPost("/datamaster/getcontract", param, function (res) {
    for (var i = 0; i < res.length; i++) {
      contracts.listContractCode.push({
        title: res[i].contract_code,
        value: res[i].contract_code
      });
    }

  });
}

contracts.getExchange = function () {
  var param = {};
  ajaxPost("/datamaster/getexchange", param, function (res) {
    for (var i = 0; i < res.length; i++) {
      contracts.listExchange.push({
        title: res[i].exchangename,
        value: res[i].exchangename
      });
    }

  });
}

contracts.getFullName = function () {
  var param = {};
  ajaxPost("/datamaster/getcontractall", param, function (res) {
    for (var i = 0; i < res.Data.length; i++) {
      contracts.listFullName.push({
        title: res.Data[i].Fullname,
        value: res.Data[i].Fullname
      });
    }

  });
}

contracts.getContractGroup = function(){
    var payload = {};
    contracts.lsitContractGroup([]);
    ajaxPost("/mastercontractgroup/getlist",payload , function (res){
      var contractGroup = res.Data;
      for (var c in contractGroup){
          contracts.lsitContractGroup.push({
              "text" : contractGroup[c].Name,
              "value" : contractGroup[c].Id
          });
      }
    });
}

contracts.contractsGroup.subscribe(function(value){
  var param = {"ContractGroupId":parseInt(value)};
  contracts.lsitContractSubGroup([]);
  ajaxPost("/mastercontractsubgroup/getlist",param , function (res){
    var subgroup = res.Data;
    for (var c in subgroup){
        contracts.lsitContractSubGroup.push({
            "text" : subgroup[c].Name,
            "value" : subgroup[c].Id
        });
    }
  });
});

contracts.toggleFilter = function(){
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
  contracts.panel_relocated();
    var FilterTitle = contracts.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        contracts.TitelFilter(" Show Filter");
    }else{
        contracts.TitelFilter(" Hide Filter");
    }
}

contracts.panel_relocated = function(){
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
  contracts.getContractCode();
  contracts.getExchange();
  contracts.getFullName();
  contracts.getDataGridContracts();
  contracts.dropdown();
  contracts.getContractGroup();
  $("#export").click(function (e) {
    var grid = $("#MasterGridContracts").data("kendoGrid");
    grid.saveAsExcel();
  });
});