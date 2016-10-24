var clientsGroup = {
	formClientsGroup : ko.observable(true),
	Edit : ko.observable(true),
    loading : ko.observable(false),
    titleModal : ko.observable(""),
    TitelFilter : ko.observable(" Hide Filter"),
	// variable field
	Id : ko.observable(),
	groupClients : ko.observable(""),
	//var Filter
	filterGroupClients : ko.observable(""),
};

clientsGroup.Search = function(){
	clientsGroup.getDataGridClientsGroup();
}

clientsGroup.Reset = function(){
	clientsGroup.Id("");
	clientsGroup.filterGroupClients("");
	clientsGroup.getDataGridClientsGroup();
}

clientsGroup.AddClientGroup = function(){
	clientsGroup.formClientsGroup(false);
	clientsGroup.Edit(false);
	clientsGroup.Id("");
	clientsGroup.groupClients("");
    clientsGroup.titleModal("New Clients Group");
    $("#mdlConfirm").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
        backdrop: 'static',
        keyboard: false
    });
}

clientsGroup.cancelData = function(){
	clientsGroup.formClientsGroup(true);
	clientsGroup.Edit(false);
    clientsGroup.groupClients();
    $("#groupClients").siblings("span.k-tooltip-validation").hide();
    $("#mdlConfirm").modal("hide");
    $("#nav-dex").css('z-index', 'none');
}

clientsGroup.EditGroupClient = function(idGroupClients){
	var param = {
	    "Id": parseInt(idGroupClients),
	}
	var url = "/masterclientgroup/getdata";

 	ajaxPost(url, param, function(res){
        var DataclientsGroup = res.Data.Records[0];
        clientsGroup.formClientsGroup(false);
        clientsGroup.Edit(true);
        clientsGroup.Id(DataclientsGroup.Id);
        clientsGroup.groupClients(DataclientsGroup.Name);
        clientsGroup.titleModal("Update Clients Group");
        $("#mdlConfirm").modal("show");
        $("#nav-dex").css('z-index', '0');
        $("#mdlConfirm").modal({
            backdrop: 'static',
            keyboard: false
        });
 	});
}

clientsGroup.saveData = function(){
	var param = {
        "Id" : -1,
	    "Groupname": clientsGroup.groupClients(),
	}
	var url = "/masterclientgroup/savedata";
	var validator = $("#AddClientGroup").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddClientGroup").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
	 		if(res.IsError != true){
                clientsGroup.formClientsGroup(true);
                clientsGroup.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 	});
    }
 	
}

clientsGroup.saveEdit = function(){
	var param = {
		"Id" : clientsGroup.Id(),
	    "Groupname": clientsGroup.groupClients(),
	}
	var url = "/masterclientgroup/savedata";
	var validator = $("#AddClientGroup").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddClientGroup").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
            if(res.IsError != true){
                clientsGroup.formClientsGroup(true);
                clientsGroup.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 		
	 	});
    }
}

clientsGroup.search = function(data, event){
    if(model.View() != "false"){
        if(clientsGroup.filterGroupClients().length >= 3 || clientsGroup.filterGroupClients().length == 0){
           clientsGroup.getDataGridClientsGroup();
        }
    }
}

clientsGroup.getDataGridClientsGroup = function(){
    clientsGroup.loading(true);
    var param =  {
        "Groupname" : clientsGroup.filterGroupClients(),
    };
    var dataSource = [];
    var url = "/masterclientgroup/getdata";
    $("#MasterGridClientsGroup").html("");
    $("#MasterGridClientsGroup").kendoGrid({
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
                            clientsGroup.loading(false);
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
                    field:"Name",
                    title:"Group Name",
                    width:200,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:clientsGroup.EditGroupClient(\"#: Id #\")'>#: Name #</a>#}else{#<div>#: Name #</div>#}#"
                }]
    });
}

clientsGroup.toggleFilter = function(){
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
  clientsGroup.panel_relocated();
    var FilterTitle = clientsGroup.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        clientsGroup.TitelFilter(" Show Filter");
    }else{
        clientsGroup.TitelFilter(" Hide Filter");
    }
}

clientsGroup.panel_relocated = function(){
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
	clientsGroup.getDataGridClientsGroup();
});