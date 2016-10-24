var sP = {
	formSp : ko.observable(true),
	id : ko.observable(),
  	contract: ko.observable(),
  	settle: ko.observable(),
  	expdate: ko.observable(),
  	gateway: ko.observable(),
    productid: ko.observable(),
    contractexpiry: ko.observable(),
    tradedate: ko.observable(),
    loading : ko.observable(false),
    titleModal : ko.observable(""),
    //Filter 
    fileterProductId : ko.observableArray([]),
    fileterContractCode : ko.observableArray([]),
    fileterContractExpiry : ko.observable(moment(new Date()).format("YYYY-MM-DD")),
    fileterContractTradeDate : ko.observable(moment(new Date()).format("YYYY-MM-DD")),
    filterSource : ko.observable(""),

    //list
    listproductID : ko.observableArray([]),
    listcontractCode : ko.observableArray([]),
    listSource : ko.observable([
        {"text":"File","value":"File"},
        {"text":"Manual","value":"Manual"}
        ]),

    filename: ko.observable(),
    filetype: ko.observable(),
    filepath: ko.observable(),
    fractional: ko.observable(),
    digit: ko.observable(),
    divisor: ko.observable(),
  	settleori: ko.observable(),
    Edit : ko.observable(true),
    TitelFilter: ko.observable(" Hide Filter"),
};

sP.searchData = function(){
    sP.getDataGridSettle();
}

sP.resetData = function(){
    sP.fileterProductId([]);
    sP.fileterContractCode([]);
    sP.fileterContractExpiry(moment(new Date()).format("YYYY-MM-DD"));
    sP.fileterContractTradeDate(moment(new Date()).format("YYYY-MM-DD"));
    sP.id("");
    sP.contract("");
    sP.settle("");
    sP.expdate("");
    sP.gateway("");
    sP.productid("");
    sP.contractexpiry("");
    sP.filename("");
    sP.filetype("");
    sP.filepath("");
    sP.tradedate("");
    sP.fractional("");
    sP.digit("");
    sP.divisor("");
    sP.settleori("");
    sP.getDataGridSettle();
}

sP.saveData = function(){
    var expdate = sP.expdate();
    var contractexpiry =  sP.contractexpiry();
    var tradedate = sP.tradedate();

    var param = {
        "gateway"   :  sP.gateway(),
        "productid" :  sP.productid(),
        "expdate"   :   moment(expdate).format("YYYY-MM-DD"),
        "contractexpiry" :  moment(contractexpiry).format("YYYY-MM-DD"),
        "tradedate" :  moment(tradedate).format("YYYY-MM-DD"),
        "settle"    :  sP.settle().toString(),
    }
    var url = "/updsettlementprice/savesettlementprice";
    var validator = $("#formSp").data("kendoValidator");
    if(validator==undefined){
       validator= $("#formSp").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
        ajaxPost(url, param, function (data) {
            if (data.IsError == false){
                sP.formSp(true);
                sP.resetData();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", data.Message, "success");
            }else{
                return swal("Error!", data.Message, "error");
            }
        });
     }
}

sP.saveEdit = function(){
    var expdate = sP.expdate();
    var contractexpiry =  sP.contractexpiry();
    var tradedate = sP.tradedate();
    var param = {
        "gateway"   :  sP.gateway(),
        "productid" :  sP.productid(),
        "expdate"   :   moment(expdate).format("YYYY-MM-DD"),
        "contractexpiry" :  moment(contractexpiry).format("YYYY-MM-DD"),
        "tradedate" :  moment(tradedate).format("YYYY-MM-DD"),
        "settle"    :  sP.settle().toString(),
    }
    var url = "/updsettlementprice/savesettlementprice";
    var validator = $("#formSp").data("kendoValidator");
    if(validator==undefined){
       validator= $("#formSp").kendoValidator().data("kendoValidator");
    }

    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            if (res.IsError == false){
                sP.formSp(true);
                sP.resetData();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        }); 
    }
    
}

sP.addSettle = function(){
    sP.formSp(false);
    sP.Edit(false);
    sP.titleModal("New Upd Settle Price");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
        backdrop: 'static',
        keyboard: false
    });
    $("#gateway").prop("readonly", false);
    $("#product").data("kendoDropDownList").enable(true);   
    $("#expdate").data("kendoDatePicker").enable(true);   
    $("#ContractExpiryField").data("kendoDatePicker").enable(true);   
    $("#TradeDateField").data("kendoDatePicker").enable(true);   
    $("#settle").data("kendoNumericTextBox").enable(true); 
    $("#btnsave").show();
}

sP.editSettlement= function(idSp){
  var param = {
    "Id": idSp,
  }
  var url = "/updsettlementprice/getdata";
  ajaxPost(url, param, function(res){
    sP.titleModal("Update Upd Settle Price");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
        backdrop: 'static',
        keyboard: false
    });
    var dataClients = res.Data.Records[0];
    $('#fractional').bootstrapSwitch('state', true)
    sP.id(dataClients.Id);
    sP.contract(dataClients.Contract);
    sP.settle(dataClients.SettleOri);
    sP.expdate(dataClients.ExpDate);
    sP.gateway(dataClients.Gateway);
    sP.productid(dataClients.ProductId);
    sP.contractexpiry(dataClients.ContractExpiry);
    sP.filename(dataClients.FileName);
    sP.filetype(dataClients.FileType);
    sP.filepath(dataClients.FilePath);
    sP.tradedate(dataClients.Tradedate);
    sP.fractional(dataClients.Fractional);
    if (dataClients.Fractional == "N"){
        $('#fractional').bootstrapSwitch('state', false)
    }
    sP.digit(dataClients.Digit);
    sP.divisor(dataClients.Divisor);
    sP.settleori(dataClients.SettleOri);

    var urlChack = "/processlog/getpaymentreceiptmindate";
    ajaxPost(urlChack, {}, function(res){
        if (new Date(res.Data) >= new Date(dataClients.Tradedate) ){
            $("#gateway").prop("readonly", true);
            $("#product").data("kendoDropDownList").enable(false);   
            $("#expdate").data("kendoDatePicker").enable(false);   
            $("#ContractExpiryField").data("kendoDatePicker").enable(false);   
            $("#TradeDateField").data("kendoDatePicker").enable(false);   
            $("#settle").data("kendoNumericTextBox").enable(false);   
            $("#btnsave").hide();
            swal("Confirmation!", "Data is Locked", "error");
        }else{
            $("#gateway").prop("readonly", false);
            $("#product").data("kendoDropDownList").enable(true);   
            $("#expdate").data("kendoDatePicker").enable(true);   
            $("#ContractExpiryField").data("kendoDatePicker").enable(true);   
            $("#TradeDateField").data("kendoDatePicker").enable(true);   
            $("#settle").data("kendoNumericTextBox").enable(true); 
            $("#btnsave").show(); 
            sP.formSp(false);
        }
    });
  });
}

sP.cancelData = function(){
    sP.formSp(true);
    var validator = $("#formSp").kendoValidator().data("kendoValidator");
    validator.hideMessages()
    $("#nav-dex").css('z-index', 'none');
    $("#mdlConfirm").modal("hide");
    sP.resetData();
}

sP.getProductID = function(){
    var param = {};
    var ArrProduct = [];
    var url = "/updsettlementprice/getproduct";
    ajaxPost(url, param, function(res){
        for (var p in res){
            ArrProduct.push({
                "text" : res[p].Description,
                "value" : res[p].ProductID
            })
        }
        var dataReport = Enumerable.From(ArrProduct).OrderBy("$.text").ToArray();
        sP.listproductID(dataReport)
    });
}

sP.getContractCode = function(){
    var param = {};
    var ArrContractCode = [];
    ajaxPost("/datamaster/getcontract", param, function (res) {
        for (var i = 0; i < res.length; i++) {
          ArrContractCode.push({
            "text": res[i].contract_code + " - " + res[i].fullname,
            "value": res[i].contract_code
          });
        }
        var dataReport = Enumerable.From(ArrContractCode).OrderBy("$.text").ToArray();
        sP.listcontractCode(dataReport)
    });
}

sP.fileterProductId.subscribe(function(value){
    if(model.View() != "false" && sP.fileterProductId() != ""){
        sP.getDataGridSettle();
    }
});

sP.fileterContractCode.subscribe(function(value){
    if(model.View() != "false" && sP.fileterContractCode() != ""){
        sP.getDataGridSettle();
    }
});

sP.fileterContractTradeDate.subscribe(function(value){
    if(model.View() != "false" && sP.fileterContractTradeDate() != ""){
        sP.getDataGridSettle();
    }
});

sP.fileterContractExpiry.subscribe(function(value){
    if(model.View() != "false" && sP.fileterContractExpiry() != ""){
        sP.getDataGridSettle();
    }
});


// var userid = model.User();
// var gcsettle = new GridColumn('role_settle', userid, 'MasterGridSettle');
sP.getDataGridSettle = function(){
    var ContractExpiry = "";
    var TradeDate = "";
    if (sP.fileterContractExpiry() != ""){
        ContractExpiry = moment(sP.fileterContractExpiry()).format("YYYY-MM-DD");
    }
    if (sP.fileterContractTradeDate() != ""){
        TradeDate = moment(sP.fileterContractTradeDate()).format("YYYY-MM-DD");
    }
    var param =  {
        ProductId : sP.fileterProductId(),
        ContractExpiry : ContractExpiry,
        TradeDate : TradeDate,
        ContractCode : sP.fileterContractCode(),
        SourceData : sP.filterSource(),
    };
    sP.loading(true);
    var dataSource = [];
    var url = "/updsettlementprice/getdata";
    $("#MasterGridSettle").html("");
    $("#MasterGridSettle").kendoGrid({
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
                            sP.loading(false);
                            // gcsettle.Init();
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
                    gcsettle.RemoveColumn(e.column.field);
                },
                columnShow: function(e) {
                    gcsettle.AddColumn(e.column.field);
                },
            columns: [
                {
                    field:"Contract",
                    title:"Contract",
                    width:100,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:sP.editSettlement(\"#: Id #\")'>#: Contract #</a>#}else{#<div>#: Contract #</div>#}#"
                },
                {
                    field:"SourceData",
                    title:"Source",
                    width:100,
                },
                {
                    field:"ContractCode",
                    title:"Contract Code",
                    width:100,
                },
                {
                    field:"Settle",
                    title:"Settlement Price",
                    width:100,
                    attributes: {"class": "align-right"},
                },
                {
                    field:"ExpDate",
                    title:"Upload Date",         
                    width:100,
                    attributes: {"class": "align-center"},
                    template:"#= moment(ExpDate).format('MMMM DD , YYYY') #"
                },
                {
                    field:"ProductId",
                    title:"TPRS Contract",
                    width:100,
                    
                },
                {
                    field:"ContractExpiry",
                    title:"Contract Expiry",
                    width:100,
                    attributes: {"class": "align-center"},
                    template:"#= moment(ContractExpiry).format('MMMM DD , YYYY') #"
                },
                {
                    field:"Tradedate",
                    title:"Trade date",
                    width:100,
                    attributes: {"class": "align-center"},
                }
            ]
    });
}

sP.toggleFilter = function(){
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
  sP.panel_relocated();
    var FilterTitle = sP.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        sP.TitelFilter(" Show Filter");
    }else{
        sP.TitelFilter(" Hide Filter");
    }
}

sP.panel_relocated = function(){
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

sP.loadTradeDate = function(){
  var param = {};
  ajaxPost("/dashboard/getcurrentdate", param, function (res) {
      var d = new Date(res.Data.CurrentDate);
      var DefaultDate = new Date(res.Data.CurrentDate);
      var day = moment(d).format("ddd");
      if (day != "Mon"){
          DefaultDate.setDate(DefaultDate.getDate()-1);
      }else{
          DefaultDate.setDate(DefaultDate.getDate()-3);
      }
     //sP.tradedate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
     //var date = )
     $("#tradeDate").data("kendoDatePicker").value(new Date(DefaultDate));
     $("#ContractExpiry").data("kendoDatePicker").value(new Date(DefaultDate));
  });
}

$(document).ready(function () { 
    $("#export").click(function (e) {
        var grid = $("#MasterGridSettle").data("kendoGrid");
        grid.saveAsExcel();
     });
    sP.loadTradeDate();
    $("#tradeDate").kendoDatePicker({
        format: "yyyy-MM-dd",
      }).data("kendoDatePicker");
    $("#ContractExpiry").kendoDatePicker({
        format: "yyyy-MM-dd",
      }).data("kendoDatePicker");
    $("#expdate").kendoDatePicker({
        format: "yyyy-MM-dd",
      }).data("kendoDatePicker");
    $("#ContractExpiryField").kendoDatePicker({
        format: "yyyy-MM-dd",
      }).data("kendoDatePicker");
    $("#TradeDateField").kendoDatePicker({
        format: "yyyy-MM-dd",
      }).data("kendoDatePicker");
	//sP.getDataGridSettle();
    sP.getProductID();
    sP.getContractCode();
    $("#settle").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    
    $("#settleori").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });   
});