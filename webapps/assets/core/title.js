var title = {
	formTitle : ko.observable(true),
	Edit : ko.observable(true),
    loading : ko.observable(false),
    TitelFilter : ko.observable(" Hide Filter"),
	// variable field
	Id : ko.observable(),
	titleName : ko.observable(""),
    titleModal : ko.observable(""),
	//var Filter
	filtertitleName : ko.observable(""),
};

title.Search = function(){
	title.getDataGridTitle();
}

title.Reset = function(){
    title.Id("");
	title.titleName("");
	title.filtertitleName("");
	title.getDataGridTitle();
}

title.AddTitle= function(){
	title.formTitle(false);
	title.Edit(false);
	title.Id("");
    title.titleName("");
    title.titleModal("New Title");
    $("#mdlConfirm").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
        backdrop: 'static',
        keyboard: false
    });
}

title.cancelData = function(){
	title.formTitle(true);
	title.Edit(false);
    $("#titleName").siblings("span.k-tooltip-validation").hide(); 
    $("#nav-dex").css('z-index', 'none');
    $("#mdlConfirm").modal("hide");
}

title.EditformTitle = function(idTittle){
  	
	var param = {
	    "Id": parseInt(idTittle),
	}
	var url = "/mastertitles/getdata";

 	ajaxPost(url, param, function(res){
        var dataTitle = res.Data.Records[0];
        title.formTitle(false);
        title.Edit(true);
        title.Id(dataTitle.Id);
        title.titleName(dataTitle.Title);
        title.titleModal("Update Title");
        $("#mdlConfirm").modal("show");
        $("#nav-dex").css('z-index', '0');
        $("#mdlConfirm").modal({
            backdrop: 'static',
            keyboard: false
        });
 	});
}

title.saveData = function(){
	var param = {
        "Id" : -1,
	    "Title": title.titleName(),
	}
	var url = "/mastertitles/savedata";
	var validator = $("#AddTitle").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddTitle").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
	 		if(res.IsError != true){
                title.formTitle(true);
                title.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 	});
    }
 	
}

title.saveEdit = function(){
	var param = {
		"Id" : title.Id(),
        "Title": title.titleName(),
	}
	var url = "/mastertitles/savedata";
	var validator = $("#AddTitle").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddTitle").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
            if(res.IsError != true){
                title.formTitle(true);
                title.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 		
	 	});
    }
}

title.search = function(data, event){
    if(model.View() != "false"){
        if(title.filtertitleName().length >= 3 ){
           title.getDataGridTitle();
        }
    }
}

title.getDataGridTitle = function(){
    title.loading(true);
    var param =  {
        "Title" : title.filtertitleName(),
    };
    var dataSource = [];
    var url = "/mastertitles/getdata";
    $("#MasterGridTitle").html("");
    $("#MasterGridTitle").kendoGrid({
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
                             title.loading(false);
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
            columns: [
                {
                    field:"Title",
                    title:"Title",
                    width:200,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:title.EditformTitle(\"#: Id #\")'>#: Title #</a>#}else{#<div>#: Title #</div>#}#"

                }]
    });
}

title.toggleFilter = function(){
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
  title.panel_relocated();
    var FilterTitle = title.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        title.TitelFilter(" Show Filter");
    }else{
        title.TitelFilter(" Hide Filter");
    }
}

title.panel_relocated = function(){
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
	title.getDataGridTitle();
});