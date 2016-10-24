var currencies = {
    isProcessing: ko.observable(false),
    formCurrencies : ko.observable(true),
    Edit : ko.observable(true),
    reset: ko.observable(false),
    TitelFilter: ko.observable(" Hide Filter"),
    //variable field
    Id : ko.observable(""),
    CurrencyCode : ko.observable(""),
    Description : ko.observable(""),
    //varible Filter
    filterCurrencyCode : ko.observableArray([]),
    filterDescription : ko.observable(""),
    //variable list 
    listCurrencies : ko.observableArray([]),
    loading: ko.observable(false),
};

currencies.searchData = function(){
    currencies.reloadGrid();
}

currencies.filterCurrencyCode.subscribe(function(value){
    if(model.View() != "false" && currencies.reset() == false){
        currencies.reloadGrid();
    }
});

currencies.search = function(data, event){
    if(model.View() != "false" && currencies.reset() == false){
        if(currencies.filterDescription().length >= 3 && currencies.reset() == false){
           currencies.reloadGrid();
        }
    }
}

currencies.resetData = function(){
    currencies.reset(true);
    currencies.filterCurrencyCode([]);
    currencies.filterDescription("");
    currencies.getCurrencies();
    currencies.getDataGridCurrencies();
    currencies.CurrencyCode("");
    currencies.Description("");
    currencies.reloadGrid();
    currencies.reset(false);
}

currencies.reloadGrid = function(){
    $("#MasterGridCurrencies").data("kendoGrid").dataSource.read({
        CurrencyCode :currencies.filterCurrencyCode(),
        Description : currencies.filterDescription()
    });
}

currencies.saveData = function(){
    $("#nav-dex").css('z-index', 'none');
    var validator = $("#AddCurrencies").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddCurrencies").kendoValidator().data("kendoValidator");
    }
    var param = {
        "Id" : -1,
        "CurrencyCode":currencies.CurrencyCode,
        "Description": currencies.Description,
    }
    var url = "/mastercurrency/savedata";
    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            var IsError = res.IsError;
            if (IsError == false){
                currencies.formCurrencies(true);
                currencies.resetData();
                currencies.getDataGridCurrencies();
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        });
    }
}

currencies.saveEdit = function(){
    $("#nav-dex").css('z-index', 'none');
    var param = {
        "Id" : currencies.Id(),
        "CurrencyCode":currencies.CurrencyCode,
        "Description": currencies.Description,
    }
    var url = "/mastercurrency/savedata";
    var validator = $("#AddCurrencies").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddCurrencies").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            var IsError = res.IsError;
            if (IsError == false){
                currencies.formCurrencies(true);
                currencies.resetData();
                currencies.getDataGridCurrencies();
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        });
    }
}

currencies.addCurrancies = function(){
    $("#crcyModal").modal('show');
    $("#crcyModal").modal({
        show : true,
        backdrop: 'static',
        keyboard: false
    });
    $("#nav-dex").css('z-index', '0');
    //currencies.formCurrencies(false);
    currencies.Edit(false);
}

currencies.editCurrencies = function(idCurr){
    $("#crcyModal").modal('show');
  //currencies.formCurrencies(false);
  currencies.Edit(true);
  var param = {
    "Id":parseInt(idCurr),
  }
  var url = "/mastercurrency/getdata";
  ajaxPost(url, param, function(res){
        var dataCurrencies = res.Data.Records[0];
        currencies.Id(dataCurrencies.Id);
        currencies.CurrencyCode(dataCurrencies.Currency_code);
        currencies.Description(dataCurrencies.Description);
  });
}

currencies.cancelData = function(){
  currencies.formCurrencies(false);
  $("#nav-dex").css('z-index', 'none');
  currencies.resetData();
  $("#CurrencyCode").siblings("span.k-tooltip-validation").hide(); 
  $("#Description").siblings("span.k-tooltip-validation").hide();
}

currencies.getDataGridCurrencies = function(){
    currencies.loading(true)
    var param =  {
        CurrencyCode :currencies.filterCurrencyCode(),
        Description : currencies.filterDescription()
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
                            currencies.loading(false);
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
            columns: [
                {
                    field:"Currency_code",
                    title:"Currency Code",
                    width:100,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:currencies.editCurrencies(\"#: Id #\")'>#: Currency_code #</a>#}else{#<div>#: Currency_code #</div>#}#"
                },
                {
                    field:"Description",
                    title:"Description",
                    width:100
                },
            ]
    });
}

currencies.getCurrencies = function(idCurr){
    currencies.formCurrencies(true);
    currencies.Edit(true);
    var param = {
        "Id":parseInt(idCurr),
    }
    var url = "/datamaster/getcurrency";
    currencies.listCurrencies([]);
    ajaxPost(url, param, function(res){
        for (var cur in res){
            currencies.listCurrencies.push({
                "text" : res[cur].currency_code,
                "value" : res[cur].currency_code,
            });
        }
    });
}

currencies.toggleFilter = function(){
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
  currencies.panel_relocated();
    var FilterTitle = currencies.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        currencies.TitelFilter(" Show Filter");
    }else{
        currencies.TitelFilter(" Hide Filter");
    }
}

currencies.panel_relocated = function(){
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



$(document).ready(function() {
    currencies.getCurrencies();
    currencies.getDataGridCurrencies();
});