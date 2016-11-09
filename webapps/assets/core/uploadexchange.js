var updxchange= {
	form: ko.observable(false),
	Edit: ko.observable(false),
    loading : ko.observable(false),
	exchnamelist: ko.observableArray([]),
    Reset: ko.observable(false),
    paneltitle: ko.observable(' Hide Filter'),

	FilterFiletype: ko.observable(),
	FilterExchangeName: ko.observable([]),


	Id: ko.observable(), // int
	Filetype: ko.observable(), //string
	ExchangeName: ko.observable(), //string
	Updexchangename: ko.observable(),//string
    titleModal : ko.observable(""),
}

updxchange.FilterFiletype.subscribe(function(value){
  if(model.View() != "false" && updxchange.Reset() != true){
   updxchange.GetDataGrid();
  }
});

var userid = model.User();
var gcupdexc = new GridColumn('role_updexc', userid, 'MasterUpdExchange');
updxchange.FilterExchangeName.subscribe(function(value){
  if(model.View() != "false" && updxchange.Reset() != true){
   updxchange.GetDataGrid();
  }
});

var url = "/masterupdaccount/getdata";
var dataSource = [];
updxchange.GetDataGrid = function(){
    updxchange.loading(true);
    var param={
    	ExchangeName: updxchange.FilterExchangeName(),
    	filetype: updxchange.FilterFiletype()
    };
    var dataSource = [];
    var url = "/masterupdexchange/getdata";
    $("#MasterUpdExchange").html("");
    $("#MasterUpdExchange").kendoGrid({
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
                            updxchange.loading(false);
                            updxchange.Reset(false);
                            gcupdexc.Init();
                            if (data.Data.Count == 0) {
                                return dataSource;
                            } else {
                                return data.Data.Records;
                            }
                        },
                        total: "Data.Count",
                    },
                    pageSize: 15,
                    // serverPaging: false, 
                    // serverSorting: false,
                },
                selectable: true,
                resizable: true,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columnMenu: false,
                columnHide: function(e) {
                    gcupdexc.RemoveColumn(e.column.field);
                },
                columnShow: function(e) {
                    gcupdexc.AddColumn(e.column.field);
                },
                // reorderable: true,
                // filterable: true,
                // groupable: true,
                filterable: {
                            mode: "row"
                        },
            columns: [
                {
                    field:"FileType",
                    title:"File Type",         
                    width:100,
                    template:  function(d){
                        if(model.Edit() != 'false'){
                            return "<a class='grid-select'  href='javascript:updxchange.editData("+ d.Id +")'>"+d.FileType+"</a>"
                        }else{
                            return "<div>"+d.FileType+"</div>"
                        }
                    },
                    filterable: {
                                cell: {
                                    operator: "contains"
                                }
                            } 
                },
                {
                    field:"ExchangeName",
                    title:"TPRS Exchange Name",
                    width:100,
                    filterable: {
                                cell: {
                                    operator: "contains"
                                }
                            }
                },
                {
                    field:"UpdExchangeName",
                    title:"File Exchange Name",
                    width:100,
                    filterable: {
                                cell: {
                                    operator: "contains"
                                }
                            }
                }
                
            ]
    });

}

updxchange.addNew = function(){
     $("#UpdExcModal").modal({
        show : true,
        backdrop: 'static',
        keyboard: false
    });
    $("#nav-dex").css('z-index', '0');
	updxchange.form(true);
	updxchange.Filetype("");
	updxchange.ExchangeName([]);
	updxchange.Updexchangename("");
    updxchange.titleModal("New Upd Exchange");
    $("#mdlConfirm").modal("show");
}

updxchange.editData = function(d){
    $("#UpdExcModal").modal({
        show : true,
        backdrop: 'static',
        keyboard: false
    });
    $("#nav-dex").css('z-index', '0');
	updxchange.form(true);
	updxchange.Edit(true);
	var param = {
		Id: d
	}
	ajaxPost("/masterupdexchange/getdata", param, function (res){
		var data = res.Data.Records[0];
		updxchange.Id(data.Id);
		updxchange.Filetype(data.FileType);
		updxchange.ExchangeName(data.ExchangeName);
		updxchange.Updexchangename(data.UpdExchangeName);
        updxchange.titleModal("Update Upd Exchange");
        $("#mdlConfirm").modal("show");
	});
	
}
updxchange.cancelData = function(){
	updxchange.form(false);
	updxchange.GetDataGrid();
    var validator = $("#updexc").kendoValidator().data("kendoValidator");
    validator.hideMessages()
    $("#mdlConfirm").modal("hide");
    $("#UpdExcModal").modal('hide');
    $("#nav-dex").css('z-index', 'none');
}

updxchange.dropdown = function(){
    updxchange.exchnamelist([])
	ajaxPost("/datamaster/getexchange", {}, function (res){
		res.map(function(d){
			updxchange.exchnamelist.push({
				title: d.exchangename,
				value: d.ExchangeName
			}); 
		})
		
	});
}

updxchange.saveData = function(){
	var validator = $("#updexc").data("kendoValidator");
    //console.log(validator);
    if(validator ==undefined){
        validator = $("#updexc").kendoValidator().data("kendoValidator");
    }
	var param = {
		Filetype: updxchange.Filetype(),
		ExchangeName: updxchange.ExchangeName(), //string
		Updexchangename: updxchange.Updexchangename()//string
	}
	if(validator.validate()){
		ajaxPost("/masterupdexchange/savedata", param, function (res){
			swal({
	            title: "Data Saved !!",
	            text: "Data Accounts Has Been Saved",
	            type: "success",
	            confirmButtonClass: "btn-success",
	            confirmButtonText: "oke",
	            closeOnConfirm: true
	        },function(isConfirm){
	            if(isConfirm){
	                updxchange.cancelData();
	            }
	        }); 
			
		});
	}
}

updxchange.saveEdit = function(d){
	var validator = $("#updexc").data("kendoValidator");
    if(validator ==undefined){
        validator = $("#updexc").kendoValidator().data("kendoValidator");
    }
	var param = {
		id:updxchange.Id(),
		Filetype: updxchange.Filetype(),
		ExchangeName: updxchange.ExchangeName(), //string
		Updexchangename: updxchange.Updexchangename()//string
	}
	if(validator.validate()){
		ajaxPost("/masterupdexchange/savedata", param, function (res){
			swal({
                title: "Data Saved !!",
                text: "Data Accounts Has Been Saved",
                type: "success",
                confirmButtonClass: "btn-success",
                confirmButtonText: "oke",
                closeOnConfirm: true
            },function(isConfirm){
                if(isConfirm){
                    updxchange.cancelData();
                }
            }); 
			
		});
	}	
}

updxchange.FileTypeList = [
    {id : "TT", title: "TT"},
    {id : "Stellar", title: "Stellar"},
    {id : "ADM", title: "ADM"},
    {id : "CQG", title: "CQG"},
    {id : "CQGSFTP", title: "CQGSFTP"},
    {id : "FCS", title: "FCS"},
     {id : "Newedge", title: "Newedge"},
    {id : "SEB", title: "SEB"},
    {id : "SEB WEBCLEAR", title: "SEB WEBCLEAR"},
    {id : "Settlement Price", title: "Settlement Price"},
    {id : "Desk Fee", title: "Desk Fee"}
   

];

updxchange.reset = function(){
    updxchange.Reset(true);
	updxchange.FilterExchangeName([]);
   	updxchange.FilterFiletype("");
   	updxchange.GetDataGrid();
}

updxchange.toggleFilter = function(){
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
  updxchange.panel_relocated();
  if(updxchange.paneltitle() ==' Show Filter'){
    updxchange.paneltitle(' Hide Filter')
  }else{
    updxchange.paneltitle(' Show Filter')
  }
}

updxchange.panel_relocated = function(){
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


$(document).ready(function(){
	updxchange.GetDataGrid();
	updxchange.dropdown();

});