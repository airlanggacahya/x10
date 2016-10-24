var exchange = {
	formExchange : ko.observable(true),
	Edit : ko.observable(true),
    loading : ko.observable(false),
    titleModal : ko.observable(""),
    reset: ko.observable(false),
    TitelFilter: ko.observable(" Hide Filter"),
	// variable field
	Id : ko.observable(),
	exchangeName : ko.observable(""),
	description : ko.observable(""),
	//var Filter
	filterExchangeName : ko.observableArray([]),
	filterDescription : ko.observable(""),
	// var list 
	listExchangeName : ko.observableArray([]),
};

exchange.Search = function(){
	exchange.getDataGridExchange();
}

exchange.Reset = function(){
    exchange.reset(true)
	exchange.Id("");
	exchange.filterExchangeName([]);
	exchange.filterDescription("");
	exchange.getDataGridExchange();
	exchange.reloadGrid();
    exchange.reset(false)
}

exchange.AddExchange = function(){
	exchange.formExchange(false);
	exchange.Edit(false);
	exchange.Id("");
	exchange.exchangeName("");
	exchange.description("");
    exchange.titleModal("New Exchange");
    $("#mdlConfirm").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
        backdrop: 'static',
        keyboard: false
    });
}

exchange.cancelData = function(){
	exchange.formExchange(true);
	exchange.Edit(false);
    $("#exchangeName").siblings("span.k-tooltip-validation").hide(); 
    $("#description").siblings("span.k-tooltip-validation").hide(); 
    $("#mdlConfirm").modal("hide");
    $("#nav-dex").css('z-index', 'none');
    
}

exchange.EditExchange = function(idExchange){
  	exchange.formExchange(false);
  	exchange.Edit(true);
	var param = {
	    "Id": parseInt(idExchange),
	}
	var url = "/masterexchange/getdata";

 	ajaxPost(url, param, function(res){
        var dataChannge = res.Data.Records[0];
        $("#nav-dex").css('z-index', '0');
        $("#mdlConfirm").modal({
            backdrop: 'static',
            keyboard: false
        });
        exchange.Edit(true);
        exchange.Id(dataChannge.Id);
        exchange.exchangeName(dataChannge.ExchangeName);
		exchange.description(dataChannge.ExchangeDescription);
        exchange.titleModal("Update Exchange");
        $("#mdlConfirm").modal("show");
 	});
}

exchange.saveData = function(){
	var param = {
        "Id" : -1,
	    "Exchangename": exchange.exchangeName(),
  		"Exchangedescription"  : exchange.description()
	}
	var url = "/masterexchange/savedata";
	var validator = $("#AddExchange").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddExchange").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
            if(res.IsError != true){
                exchange.formExchange(true);
                exchange.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 	});
    }
 	
}

exchange.saveEdit = function(){
	var param = {
		"Id" : exchange.Id(),
	    "Exchangename": exchange.exchangeName(),
  		"Exchangedescription"  : exchange.description()
	}
	var url = "/masterexchange/savedata";
	var validator = $("#AddExchange").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddExchange").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
	 		if(res.IsError != true){
                exchange.formExchange(true);
                exchange.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 	});
    }
}

exchange.filterExchangeName.subscribe(function(value){
  if(model.View() != "false" && exchange.reset() == false){
    exchange.reloadGrid();
  }
});

exchange.reloadGrid = function(){
    $("#MasterGridExchange").data("kendoGrid").dataSource.read({
        "ExchangeName" : exchange.filterExchangeName(),
        "Description" : exchange.filterDescription()
    })
}

var userid = model.User();
var gcexchange = new GridColumn('role_exchange', userid, 'MasterGridExchange');
exchange.getDataGridExchange = function(){
    exchange.loading(true);
    var param =  {
        "ExchangeName" : exchange.filterExchangeName(),
        "Description" : exchange.filterDescription()
    };
    var dataSource = [];
    var url = "/masterexchange/getdata";
    $("#MasterGridExchange").html("");
    $("#MasterGridExchange").kendoGrid({
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
                            exchange.loading(false);
                            gcexchange.Init();
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
                  gcexchange.RemoveColumn(e.column.field);
                },
                columnShow: function(e) {
                  gcexchange.AddColumn(e.column.field);
                },
            columns: [
                {
                    field:"ExchangeName",
                    title:"Name",
                    width:100,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:exchange.EditExchange(\"#: Id #\")'>#: ExchangeName #</a>#}else{#<div>#: ExchangeName #</div>#}#"

                },
                {
                    field:"ExchangeDescription",
                    title:"Description",         
                    width:200,
                }
            ]
    });
}

exchange.getExchange = function(){
	var param = {
	}
	var url = "/datamaster/getexchange";
	exchange.listExchangeName([]);
 	ajaxPost(url, param, function(res){
 		var dataChannge = Enumerable.From(res).OrderBy("$.exchangename").ToArray();
 		for (var c in dataChannge){
 			exchange.listExchangeName.push({
 				"text" : dataChannge[c].exchangename,
 				"value" : dataChannge[c].exchangename,
 			});
 		}

 	});
}

exchange.toggleFilter = function(){
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
  exchange.panel_relocated();
    var FilterTitle = exchange.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        exchange.TitelFilter(" Show Filter");
    }else{
        exchange.TitelFilter(" Hide Filter");
    }
}

exchange.panel_relocated = function(){
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
	exchange.getDataGridExchange();
	exchange.getExchange ();
});