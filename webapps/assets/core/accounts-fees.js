var accFees = {
	formAccFees : ko.observable(true),
    loading : ko.observable(false),
	id : ko.observable(),
  	AccountId: ko.observable(),
  	ContractId: ko.observable(),
  	MarketFee: ko.observable(),
  	MarketFeeCnry: ko.observable(),
  	ClrCommission: ko.observable(),
  	ClrCommissionCnry: ko.observable(),
  	NfaFee: ko.observable(),
  	NfaFeeCnry: ko.observable(),
  	MiscFee: ko.observable(),
  	MiscFeeCnry: ko.observable(),
  	DateCreated: ko.observable(),
  	DateUpdated: ko.observable(),
  	UpdateUser: ko.observable(),
    Edit : ko.observable(true),
    reset: ko.observable(false),
    titleModal : ko.observable(""),
    TitelFilter : ko.observable(" Hide Filter"),
    //list
    listCurrency : ko.observableArray([]),
    listContract : ko.observableArray([]),
    listAccount : ko.observableArray([]),
    //varible filter
    filterAccountId : ko.observableArray([]),
    filterCountractId : ko.observableArray([]),
};

accFees.searchData = function(){
    accFees.getDataGridFxrate();
}

accFees.resetData = function(){
    accFees.reset(true);
    accFees.id("");
    accFees.AccountId("");
    accFees.ContractId("");
    accFees.MarketFee("");
    accFees.MarketFeeCnry("");
    accFees.ClrCommission("");
    accFees.ClrCommissionCnry("");
    accFees.NfaFee("");
    accFees.NfaFeeCnry("");
    accFees.MiscFee("");
    accFees.MiscFeeCnry("");
    accFees.DateCreated("");
    accFees.DateUpdated("");
    accFees.UpdateUser("");

    accFees.filterAccountId([]);
    accFees.filterCountractId([]);
    accFees.getCurrency(); 
    accFees.getContract();
    accFees.getAccount();
    accFees.getDataGridFxrate();
    accFees.reset(false);
}

accFees.saveData = function(){
     var param = {
            "AccountId" : accFees.AccountId(),
            "ContractId" : parseInt(accFees.ContractId()),
            "MarketFee" : parseFloat(accFees.MarketFee()),
            "MarketFeeCnry" : parseInt(accFees.MarketFeeCnry()),
            "ClrCommission" : parseFloat(accFees.ClrCommission()),
            "ClrCommissionCnry" : parseInt(accFees.ClrCommissionCnry()),
            "NfaFee" : parseFloat(accFees.NfaFee()),
            "NfaFeeCnry" : parseInt(accFees.NfaFeeCnry()),
            "MiscFee" : parseFloat(accFees.MiscFee()),
            "MiscFeeCnry" : parseInt(accFees.MiscFeeCnry()),
        }
    var url = "/masteraccountfees/savedata";
    var validator = $("#AddAccFees").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddAccFees").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            var IsError = res.IsError;
            if (IsError == false){
                accFees.cancelData();
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        });
    }   
}

accFees.saveEdit = function(){
    var param = {
        "Id" : accFees.id(),
        "AccountId" : accFees.AccountId(),
        "ContractId" : parseInt(accFees.ContractId()),
        "MarketFee" : parseFloat(accFees.MarketFee()),
        "MarketFeeCnry" : parseInt(accFees.MarketFeeCnry()),
        "ClrCommission" : parseFloat(accFees.ClrCommission()),
        "ClrCommissionCnry" : parseInt(accFees.ClrCommissionCnry()),
        "NfaFee" : parseFloat(accFees.NfaFee()),
        "NfaFeeCnry" : parseInt(accFees.NfaFeeCnry()),
        "MiscFee" : parseFloat(accFees.MiscFee()),
        "MiscFeeCnry" : parseInt(accFees.MiscFeeCnry()),
    }
    var url = "/masteraccountfees/savedata";
    var validator = $("#AddAccFees").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddAccFees").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            var IsError = res.IsError;
            if (IsError == false){
                accFees.cancelData();
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        });
    }
}

accFees.addAccountFees = function(idAccFees){
    accFees.formAccFees(false);
    accFees.Edit(false);
    accFees.titleModal("New Account Fee");
    $("#mdlConfirm").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
        backdrop: 'static',
        keyboard: false
    });
}

accFees.editAccountFees = function(idAccFees){
  var param = {
    "Id": idAccFees,
  }
  var url = "/masteraccountfees/getdata";
  ajaxPost(url, param, function(res){
    accFees.titleModal("Update Account Fee");
    $("#mdlConfirm").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
        backdrop: 'static',
        keyboard: false
    });
    var dataaccFees = res.Data.Records[0];
    //console.log(dataaccFees.clrcommcrncy.toString());
    accFees.formAccFees(false);
    accFees.Edit(true);
    var MarketFeeCnry = dataaccFees.marketfeecrncy;
    var ClrCommissionCnry = dataaccFees.clrcommcrncy;
    var NfaFeeCnry = dataaccFees.nfafeecrncy;
    // console.log(NfaFeeCnry.toString());
    var MiscFeeCnry = dataaccFees.miscfeecrncy;
    accFees.id(dataaccFees._id);
    accFees.AccountId(dataaccFees.AccountId);
    accFees.ContractId(dataaccFees.ContractId);
    accFees.MarketFee(dataaccFees.MarketFee);
    accFees.MarketFeeCnry(MarketFeeCnry);
    accFees.ClrCommission(dataaccFees.ClrCommission);
    accFees.ClrCommissionCnry(ClrCommissionCnry);
    accFees.NfaFee(dataaccFees.NfaFee);
    accFees.NfaFeeCnry(NfaFeeCnry);
    accFees.MiscFee(dataaccFees.MiscFee);
    accFees.MiscFeeCnry(MiscFeeCnry);
  });
}

accFees.cancelData = function(){
  accFees.formAccFees(true);
  accFees.resetData();
  $("#mdlConfirm").modal("hide");
  $("#nav-dex").css('z-index', 'none');
  var validator = $("#AddAccFees").kendoValidator().data("kendoValidator");
  validator.hideMessages()
}

accFees.filterAccountId.subscribe(function(value){
  if(model.View() != "false" && accFees.reset() == false){
    accFees.reloadGrid();
  }
});

accFees.filterCountractId.subscribe(function(value){
  if(model.View() != "false" && accFees.reset() == false){
    accFees.reloadGrid();
  }
});

accFees.reloadGrid = function(){
    $("#MasterGridaccFees").data("kendoGrid").dataSource.read({
        AccountId : accFees.filterAccountId(),
        CountractId : accFees.filterCountractId()        
    });
}

var userid = model.User();
var gcaccFees = new GridColumn('role_accFees', userid, 'MasterGridaccFees');
accFees.getDataGridFxrate = function(){
    accFees.loading(true);
    var param =  {
        AccountId : accFees.filterAccountId(),
        CountractId : accFees.filterCountractId(),
    };
    var dataSource = [];
    var url = "/masteraccountfees/getdata";
    $("#MasterGridaccFees").html("");
    $("#MasterGridaccFees").kendoGrid({
            dataSource: {
                    transport: {
                        read: {
                            url: url,
                            data: param,
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json",
                        },
                        parameterMap: function(data) {                                 
                           return JSON.stringify(data);                                 
                        },
                    },
                    schema: {
                        data: function(data) {
                            gcaccFees.Init();
                            accFees.loading(false);
                            if (data.Data.Count == 0) {
                                return dataSource;
                            } else {
                                return data.Data.Records;
                            }
                        },
                        total: "Data.Count",
                    },
                    pageSize: 15,
                    serverPaging: true,
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
                  gcaccFees.RemoveColumn(e.column.field);
                },
                columnShow: function(e) {
                  gcaccFees.AddColumn(e.column.field);
                },
            columns: [
                {
                    field:"AccountId",
                    title:"Account",
                    width:150,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:accFees.editAccountFees(\"#: _id #\")'>#: AccountId #</a>#}else{#<div>#: AccountId #</div>#}#"

                },
                {
                    field:"ContractDesc",
                    title:"Contract",         
                    width:130,
                },
                {
                    field:"MarketFee",
                    title:"Market Fee",
                    width:130,
                    attributes: {"class": "align-right"},
                },
                {
                    field:"MarketFeeDesc",
                    title:"Market Fee Cnry",
                    width:120,
                },
                {
                    field:"ClrCommissionDesc",
                    title:"Clr Commission Cnry",
                    width:150,
                },
                {
                    field:"NfaFee",
                    title:"Nfa Fee",
                    width:100,
                    attributes: {"class": "align-right"},
                },
                {
                    field:"NfaFeeDesc",
                    title:"Nfa Fee Cnry",
                    width:130,
                },
                {
                    field:"MiscFee",
                    title:"Misc Fee",
                    width:130,
                    attributes: {"class": "align-right"},
                },
                {
                    field:"MiscFeeDesc",
                    title:"Misc Fee Cnry",
                    width:150,
                }
            ]
    });
}

accFees.getCurrency = function(){
    var payload = {};
    accFees.listCurrency([]);
    ajaxPost("/datamaster/getcurrency",payload , function (res){
        var sortCurr = Enumerable.From(res).OrderBy("$.currency_code").ToArray();
        for (var c in sortCurr){
            accFees.listCurrency.push({
                "text" : sortCurr[c].currency_code,
                "value" : sortCurr[c]._id
            });
        }
    });
}

accFees.getContract = function(){
    var payload = {};
    accFees.listContract([]);
    ajaxPost("/datamaster/getcontract",payload , function (res){
        var sortCurr = Enumerable.From(res).OrderBy("$.contract_code").ToArray();
        for (var c in sortCurr){
            accFees.listContract.push({
                "text" : sortCurr[c].contract_code,
                "value" : sortCurr[c]._id
            });
        }
    });
}

accFees.getAccount = function(){
    var payload = {};
    accFees.listAccount([]);
    ajaxPost("/datamaster/getaccount",payload , function (res){
        var sortCurr = Enumerable.From(res).OrderBy("$._id").ToArray();
        for (var c in sortCurr){
            accFees.listAccount.push({
                "text" : sortCurr[c]._id,
                "value" : sortCurr[c]._id
            });
        }
    });
}

accFees.toggleFilter = function(){
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
  accFees.panel_relocated();
    var FilterTitle = accFees.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        accFees.TitelFilter(" Show Filter");
    }else{
        accFees.TitelFilter(" Hide Filter");
    }
}

accFees.panel_relocated = function(){
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
    accFees.getCurrency(); 
    accFees.getContract();
    accFees.getAccount();
	accFees.getDataGridFxrate();
});