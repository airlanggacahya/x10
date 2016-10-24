var cutofftime = {
	formCutOffTime : ko.observable(true),
	Edit : ko.observable(true),
    loading : ko.observable(false),
    titleModal : ko.observable(""),
    TitelFilter : ko.observable(" Hide Filter"),
	// variable field
	Id : ko.observable(),
	exchangeName : ko.observable(""),
    fileType : ko.observable(""),
    time : ko.observable(""),
    minutes : ko.observable(""),
    second : ko.observable(""),
	milliSeconds : ko.observable(""),
	//var Filter
    filterExchangeName : ko.observableArray([]),
	filterfileType : ko.observableArray([]),
	// var list 
	listExchangeName : ko.observableArray([]),
    ListFileType: ko.observableArray([{
      text: "TT",
      value: "TT"
    }, {
      text: "Stellar",
      value: "Stellar"
    }, {
      text: "ADM",
      value: "ADM"
    }, {
      text: "CQG",
      value: "CQG"
    }, {
      text: "CQGSFTP",
      value: "CQGSFTP",
    }, {
      text: "FCS",
      value: "FCS"
    }, {
      text: "Newedge",
      value: "Newedge"
    }, {
      text: "SEB",
      value: "SEB"
    }, {
      text: "SEB WEBCLEAR",
      value: "SEB WEBCLEAR"
    }, {
      text: "Settlement Price",
      value: "SP"
    }, {
      text: "Desk Fee",
      value: "DF"
    }]),
};

cutofftime.Search = function(){
	cutofftime.getDataGridCutOfftime();
}

cutofftime.Reset = function(){
	cutofftime.Id("");
	cutofftime.filterExchangeName([]);
    cutofftime.filterfileType([]);
	cutofftime.getExchange ();
    cutofftime.getDataGridCutOfftime();
}

cutofftime.AddCutOffTime = function(){
	cutofftime.formCutOffTime(false);
	cutofftime.Edit(false);
    var dpExchange = $("#exchangeName").data("kendoDropDownList");
    dpExchange.enable(true);
    var dpFileType = $("#fileType").data("kendoDropDownList");
    dpFileType.enable(true);

	cutofftime.Id("");
    cutofftime.exchangeName("");
    cutofftime.fileType("");
    cutofftime.time("");
    cutofftime.minutes("");
    cutofftime.second("");
	cutofftime.milliSeconds("");
    cutofftime.titleModal("New Cut Off Time");
    $("#mdlConfirm").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
        backdrop: 'static',
        keyboard: false
    });
}

cutofftime.cancelData = function(){
	cutofftime.formCutOffTime(true);
	cutofftime.Edit(false); 
    var validator = $("#AddCutOffTime").kendoValidator().data("kendoValidator");
    validator.hideMessages()
    $("#nav-dex").css('z-index', 'none');
    $("#mdlConfirm").modal("hide");
}

cutofftime.EditCutOffTime = function(idCutOffTime){
  	cutofftime.formCutOffTime(false);
  	cutofftime.Edit(true);
	var param = {
	    "Id": idCutOffTime,
	}
	var url = "/masterflatfilecutoff/getdata";

 	ajaxPost(url, param, function(res){
        var dataCutOffTime = res.Data.Records[0];
        cutofftime.Edit(true);
        $("#nav-dex").css('z-index', '0');
        $("#mdlConfirm").modal({
            backdrop: 'static',
            keyboard: false
        });
        cutofftime.Id(dataCutOffTime.Id);
        cutofftime.exchangeName(dataCutOffTime.ExchangeName);
        cutofftime.fileType(dataCutOffTime.Filetype);
        cutofftime.time(dataCutOffTime.Itime);
        cutofftime.minutes(dataCutOffTime.Imin);
        cutofftime.second(dataCutOffTime.Isec);
		cutofftime.milliSeconds(dataCutOffTime.Imicro);
        var dpExchange = $("#exchangeName").data("kendoDropDownList");
        dpExchange.enable(false);
        var dpFileType = $("#fileType").data("kendoDropDownList");
        dpFileType.enable(false);
        cutofftime.titleModal("Update Cut Off Time");
        $("#mdlConfirm").modal("show");
 	});
}

cutofftime.saveData = function(){
	var param = {
        "Exchangename": cutofftime.exchangeName(),
	    "Filetype": cutofftime.fileType(),
        "Itime"  : cutofftime.time().toString(),
        "Imin"  : cutofftime.minutes().toString(),
        "Isec" : cutofftime.second().toString(),
        "Imicro" : cutofftime.milliSeconds().toString(),
        "Paramtime" :  parseInt(cutofftime.time() + "" + cutofftime.minutes())
	}
	var url = "/masterflatfilecutoff/savedata";
	var validator = $("#AddCutOffTime").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddCutOffTime").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
	 		if(res.IsError != true){
                cutofftime.formCutOffTime(true);
                cutofftime.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 	});
    }
 	
}

cutofftime.saveEdit = function(){
	var param = {
		"Id" : cutofftime.Id(),
	    "Exchangename": cutofftime.exchangeName(),
        "Filetype": cutofftime.fileType(),
  		"Itime"  : cutofftime.time().toString(),
        "Imin"  : cutofftime.minutes().toString(),
        "Isec" : cutofftime.second().toString(),
        "Imicro" : cutofftime.milliSeconds().toString(),
        "Paramtime" :  parseInt(cutofftime.time() + "" + cutofftime.minutes())
	}
	var url = "/masterflatfilecutoff/savedata";
	var validator = $("#AddCutOffTime").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddCutOffTime").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
            if(res.IsError != true){
                cutofftime.formCutOffTime(true);
                cutofftime.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 		
	 	});
    }
}

cutofftime.filterExchangeName.subscribe(function(value){
  if(model.View() != "false" && cutofftime.filterExchangeName().length != 0){
    cutofftime.getDataGridCutOfftime();
  }
});

cutofftime.filterfileType.subscribe(function(value){
  if(model.View() != "false" && cutofftime.filterfileType().length != 0 ){
    cutofftime.getDataGridCutOfftime();
  }
});

var userid = model.User();
var gccutofftime = new GridColumn('role_cutofftime', userid, 'MasterGridCutOffTime');
cutofftime.getDataGridCutOfftime = function(){
    cutofftime.loading(true);
    var param =  {
        "ExchangeName" : cutofftime.filterExchangeName(),
        "Filetype" : cutofftime.filterfileType(),
    };
    var dataSource = [];
    var url = "/masterflatfilecutoff/getdata";
    $("#MasterGridCutOffTime").html("");
    $("#MasterGridCutOffTime").kendoGrid({
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
                            cutofftime.loading(false);
                            gccutofftime.Init();
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
                  gccutofftime.RemoveColumn(e.column.field);
                },
                columnShow: function(e) {
                  gccutofftime.AddColumn(e.column.field);
                },
            columns: [
                {
                    field:"ExchangeName",
                    title:"Name",
                    // width:200,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:cutofftime.EditCutOffTime(\"#: Id #\")'>#: ExchangeName #</a>#}else{#<div>#: ExchangeName #</div>#}#"

                },
                {
                    field:"Filetype",
                    title:"File type",         
                    // width:100,
                },
                {
                    field:"Itime",
                    title:"Time",         
                    // width:50,
                    attributes: {"class": "align-right"}
                },
                {
                    field:"Imin",
                    title:"Minutes",         
                    // width:50,
                    attributes: {"class": "align-right"}
                },
                {
                    field:"Isec",
                    title:"Second",         
                    // width:50,
                    attributes: {"class": "align-right"}
                },
                {
                    field:"Imicro",
                    title:"Milliseconds",         
                    // width:50,
                    attributes: {"class": "align-right"}
                }]
    });
}

cutofftime.getExchange = function(){
	var param = {
	}
	var url = "/datamaster/getexchange";
	cutofftime.listExchangeName([]);
 	ajaxPost(url, param, function(res){
 		var dataChannge = Enumerable.From(res).OrderBy("$.exchangename").ToArray();
 		for (var c in dataChannge){
 			cutofftime.listExchangeName.push({
 				"text" : dataChannge[c].exchangename,
 				"value" : dataChannge[c].exchangename,
 			});
 		}
        cutofftime.exchangeName(cutofftime.listExchangeName()[0].value);
 	});
}

cutofftime.toggleFilter = function(){
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
  cutofftime.panel_relocated();
    var FilterTitle = cutofftime.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        cutofftime.TitelFilter(" Show Filter");
    }else{
        cutofftime.TitelFilter(" Hide Filter");
    }
}

cutofftime.panel_relocated = function(){
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
	cutofftime.getDataGridCutOfftime();
	cutofftime.getExchange();
});