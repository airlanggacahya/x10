var fxrate = {
    // varible field
	formFxrate : ko.observable(true),
    DateFxRate : ko.observable(""),
	id : ko.observable(),
  	CurrencyId: ko.observable(),
  	CurrencyCode: ko.observable(""),
    titleModal : ko.observable(""),
  	Rate: ko.observable(0),
    Edit : ko.observable(true),
    loading : ko.observable(false),
    reset: ko.observable(false),
    TitelFilter : ko.observable(" Hide Filter"),
    // filter 
    ArrCurrencyCode : ko.observableArray([]),
    filterDateRate : ko.observable(""),
    //lsit 
    lsitCurrency : ko.observableArray([]),
};

fxrate.searchData = function(){
    fxrate.getDataGridFxrate();
}

fxrate.resetData = function(){
    fxrate.reset(true);
    fxrate.ArrCurrencyCode([]);
    fxrate.filterDateRate("");
    fxrate.getCurrencyData();
    fxrate.getDataGridFxrate();
    var validator = $("#AddRate").kendoValidator().data("kendoValidator");
    validator.hideMessages();
    fxrate.reset(false);
}

fxrate.saveData = function(){
    $("#nav-dex").css('z-index', 'none');
    var DateRateYear = moment(new Date(fxrate.DateFxRate())).format("YYYY");
    var DateRateMonth = moment(new Date(fxrate.DateFxRate())).format("MM");
    var DateRateYearMonth = moment(new Date(fxrate.DateFxRate())).format("YYYYMM");
    var CurrencyCode = $("#Currency").data("kendoDropDownList");

    var DataRate = $("#MasterGridCurrencies").data().kendoGrid.dataSource.view();
    var SandDataRate = [];
    for (var r in DataRate){
        if (DataRate[r].Id != undefined){
            SandDataRate.push({
                "Year": DateRateYear.toString(),
                "Month": DateRateMonth.toString(),
                "YearMonth": DateRateYearMonth.toString(),
                "CurrencyId": DataRate[r].Id.toString(),
                "CurrencyCode": DataRate[r].Currency_code.toString(),
                "Rate": DataRate[r].Rate.toString()
            });
        }
        
    }

    var param = {
        "AllFxrates" : SandDataRate,
        "Yearmonth" : parseInt(DateRateYearMonth)
    }
    
    var url = "/masterfxrates/savedata";
    var validator = $("#AddRateNew").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddRateNew").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            var IsError = res.IsError;
            if (IsError == false){
                fxrate.formFxrate(true);
                fxrate.resetData();
                $("#mdlConfirmSave").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        });
    }
}

fxrate.saveEdit = function(){
    $("#nav-dex").css('z-index', 'none');
    var DateRateYear = moment(new Date(fxrate.DateFxRate())).format("YYYY");
    var DateRateMonth = moment(new Date(fxrate.DateFxRate())).format("MM");
    var DateRateYearMonth = moment(new Date(fxrate.DateFxRate())).format("YYYYMM");
    var param = {
        "Id" : fxrate.id(),
        "Year": parseInt(DateRateYear),
        "Month": DateRateMonth,
        "YearMonth": parseInt(DateRateYearMonth),
        "CurrencyId": parseInt(fxrate.CurrencyId()),
        "CurrencyCode": fxrate.CurrencyCode(),
        "Rate": parseFloat(fxrate.Rate()),
    }
    var url = "/masterfxrates/editdata";
    var validator = $("#AddRate").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddRate").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            var IsError = res.IsError;
            if (IsError == false){
                fxrate.formFxrate(true);
                fxrate.resetData();
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        });
    }
}

fxrate.addFxRate = function(){
    fxrate.formFxrate(false);
    fxrate.Edit(false);
    fxrate.id("");
    fxrate.DateFxRate("");
    fxrate.CurrencyId("");
    fxrate.CurrencyCode("");
    fxrate.Rate("");
    fxrate.titleModal("New Fxrate");
    fxrate.getDataGridCurrencies();
    $("#mdlConfirmSave").modal("show");
    $("#nav-dex").css('z-index', '0');
}

fxrate.editFxRate = function(idFxRate){
  
  var param = {
    "Id": idFxRate,
  }
  var url = "/masterfxrates/getdata";
  ajaxPost(url, param, function(res){
        $("#DateFxRate").data("kendoDatePicker").enable(false);
        var dataFxRate = res.Data.Records[0];
        fxrate.formFxrate(false);
        fxrate.Edit(true);
        fxrate.id(dataFxRate.Id);
        fxrate.DateFxRate(new Date(dataFxRate.Year +"-"+dataFxRate.Month));
        fxrate.CurrencyId(dataFxRate.currencyid);
        fxrate.CurrencyCode(dataFxRate.currencycode);
        fxrate.Rate(dataFxRate.Rate);
        fxrate.titleModal("Update Fxrate");
        $("#mdlConfirm").modal("show");
        $("#nav-dex").css('z-index', '0');
  });
}

fxrate.cancelData = function(){
  fxrate.formFxrate(true);
  fxrate.resetData();
  $("#DateRate").siblings("span.k-tooltip-validation").hide(); 
  $("#Currency").siblings("span.k-tooltip-validation").hide(); 
  $("#Rate").siblings("span.k-tooltip-validation").hide(); 
  $("#mdlConfirm").modal("hide");
  $("#mdlConfirmSave").modal("hide");
  $("#nav-dex").css('z-index', 'none');
}

fxrate.ArrCurrencyCode.subscribe(function(value){
  if(model.View() != "false" && fxrate.reset() == false){
    fxrate.reloadGrid();
  }
});

fxrate.filterDateRate.subscribe(function(value){
  if(model.View() != "false" && fxrate.reset() == false){
    fxrate.reloadGrid();
  }
});

fxrate.reloadGrid = function(){
    var DateRateYearMonth = "";
    if (fxrate.filterDateRate() != ""){
        DateRateYearMonth = moment(new Date(fxrate.filterDateRate())).format("YYYYMM");
    }
    $("#MasterGridFxrate").data("kendoGrid").dataSource.read({
        CurrencyCode : fxrate.ArrCurrencyCode(),
        DateRate : DateRateYearMonth
    })
}

var userid = model.User();
var gcFxrate = new GridColumn('role_fxrate', userid, 'MasterGridFxrate');

fxrate.getDataGridFxrate = function(){

    var DateRateYearMonth = "";
    if (fxrate.filterDateRate() != ""){
        DateRateYearMonth = moment(new Date(fxrate.filterDateRate())).format("YYYYMM");
    }
    
    var param =  {
        CurrencyCode : fxrate.ArrCurrencyCode(),
        DateRate : DateRateYearMonth
    };
    var dataSource = [];
    var url = "/masterfxrates/getdata";
    $("#MasterGridFxrate").html("");
    $("#MasterGridFxrate").kendoGrid({
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
                            gcFxrate.Init();
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
                  gcFxrate.RemoveColumn(e.column.field);
                },
                columnShow: function(e) {
                  gcFxrate.AddColumn(e.column.field);
                },
            columns: [
                {
                    field:"Year",
                    title:"Year",
                    width: 100,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:fxrate.editFxRate(\"#: _id #\")'>#: Year #</a>#}else{#<div>#: Year #</div>#}#"

                },
                {
                    field:"Month",
                    title:"Month",         
                    //width:50,
                },
                {
                    field:"currencycode",
                    title:"Currency Code",
                    //width:100,
                },
                {
                    field:"Rate",
                    title:"Rate",
                    width: 100,
                    attributes: {"class": "align-right"}
                }
            ]
    });
}

fxrate.NumericTextBox = function (container, options){
    $('<input data-bind="value:' + options.field + '"/>').appendTo(container)
        .kendoNumericTextBox({
            decimals: 7
        });
}

fxrate.onDataBound = function(e) {
    var grid = $("#MasterGridCurrencies").data("kendoGrid");
    $("#MasterGridCurrencies").on("focus", "td", function (e) {
        $("input").on("keydown", function (event) {
            var row = $(this).closest("tr");
            var rowIdx = $("tr", grid.tbody).index(row);
            console.log(rowIdx);
        });
    });
}

fxrate.getDataGridCurrencies = function(){
    var param =  {
    };
    
    var dataSource = [];
    var url = "/mastercurrency/getdata";
    $("#MasterGridCurrencies").html("");
    $("#MasterGridCurrencies").kendoGrid({
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
                            if (data.Data.Count == 0) {
                                return dataSource;
                            } else {
                                var Records = data.Data.Records;
                                var NewData = [];
                                for (var i in Records) {
                                  NewData.push({
                                    "Id": Records[i].Id,
                                    "Currency_code": Records[i].Currency_code,
                                    "Description": Records[i].Description,
                                    "Rate" : 0.0
                                  });
                                }
                                return NewData;
                            }
                        },
                        total: "Data.Count",
                    },
                    pageSize: 15,
                    serverPaging: false, // enable server paging
                    serverSorting: false,
                },
                resizable: true,
                sortable: true,
                pageable: false,
                columnMenu: false,
                editable: true,
                dataBound: fxrate.onDataBound,
            columns: [
                {
                    field:"Currency_code",
                    title:"Currency Code",
                    width:100,
                },
                {
                    field:"Description",
                    title:"Description",
                    width:100
                },
                {
                    field: "Rate",
                    title: "Rate",
                    attributes: {"class": "align-right"},
                    width: 100,
                    editor: fxrate.NumericTextBox,
                    custom: function(input) {
                        return input.val().length > 4;
                    }
                },
            ]
    });
}

fxrate.getCurrencyData = function(){
    var payload = {
    };
    fxrate.lsitCurrency([]);
    ajaxPost("/masterfxrates/getcurrency",payload , function (res){
        for (var c in res){
            fxrate.lsitCurrency.push({
                "text" :res[c].currency_code,
                "value" :res[c]._id,
            });
        }
    });

}

fxrate.toggleFilter = function(){
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
  fxrate.panel_relocated();
    var FilterTitle = fxrate.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        fxrate.TitelFilter(" Show Filter");
    }else{
        fxrate.TitelFilter(" Hide Filter");
    }
}

fxrate.panel_relocated = function(){
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
    fxrate.getCurrencyData();
	fxrate.getDataGridFxrate();
});