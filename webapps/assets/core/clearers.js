var clearers = {
    //varible Field
	formClearers : ko.observable(true),
	id : ko.observable(),
  	clearerName: ko.observable(),
  	clearerDescription: ko.observable(),
    Edit : ko.observable(true),
    filterStatus: ko.observable(),
    reset: ko.observable(false),
    TitelFilter : ko.observable(" Hide Filter"),
    //varible filter
    filterClearerName: ko.observableArray([]),
    filterClearerDescription: ko.observable(),
    // list
    listClearName : ko.observableArray([]),
    loading: ko.observable(false),
    titleModal : ko.observable(""),
};


clearers.backMenuMaster = function () {
  window.location.href = "/datamaster/default";
}

clearers.searchData = function(){
    clearers.getDataGridClearers();
}

clearers.resetData = function(){
    clearers.reset(true);
    $('#filterStatus').bootstrapSwitch('state',true);
    clearers.id("");
    clearers.clearerName("");
    clearers.filterClearerName([]);
    clearers.filterClearerDescription("");
    console.log(clearers.reset())
    clearers.reset(false);

    

}

clearers.saveData = function(){
    $("#nav-dex").css('z-index', 'none');
    var statusBool = $('#Status').bootstrapSwitch('state');
    var statusStr = "1"
    if (statusBool != true){
        statusStr = "0"
    }

    var param = {
        "Id" : -1,
        "ClearerName": clearers.clearerName(),
        "ClearerDescription": clearers.clearerDescription(),
        "Status": statusStr.toString(),
    }
    var url = "/masterclearers/savedata";
    var validator = $("#AddClearer").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddClearer").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            var IsError = res.IsError;
            if (IsError == false){
                clearers.cancelData();
                $("#clrModal").modal('hide');
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        });
    }
}

clearers.saveEdit = function(){
    $("#nav-dex").css('z-index', 'none');
    var statusBool = $('#Status').bootstrapSwitch('state');
    var statusStr = "1"
    if (statusBool != true){
        statusStr = "0"
    }

    var param = {
        "Id": clearers.id(),
        "ClearerName": clearers.clearerName(),
        "ClearerDescription": clearers.clearerDescription(),
        "Status": statusStr.toString(),
    }
    var url = "/masterclearers/savedata";
    var validator = $("#AddClearer").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddClearer").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            var IsError = res.IsError;
            if (IsError == false){
                clearers.cancelData();
                $("#clrModal").modal('hide');
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        });
    }

}

clearers.addClearer = function(){
    $("#clrModal").modal('show');
    $("#nav-dex").css('z-index', '0');
    clearers.titleModal("New Clearer");
    $('#Status').bootstrapSwitch('state', true);
    //clearers.formClearers(false);
    clearers.Edit(false);
}

clearers.editClearers = function(idClearers){
  var param = {
    "Id": idClearers,
  }
  var url = "/masterclearers/getdata";
  ajaxPost(url, param, function(res){
    $("#clrModal").modal('show');
    $("#nav-dex").css('z-index', '0');
    clearers.titleModal("New Clearer");
    var dataClearers = res.Data.Records[0];
    //clearers.formClearers(false);
    clearers.Edit(true);
    clearers.id(dataClearers.Id);
    clearers.clearerName(dataClearers.ClearerName);
    clearers.clearerDescription(dataClearers.ClearerDescription);
    $('#Status').bootstrapSwitch('state', true);
    if (dataClearers.Status != "1"){
        $('#Status').bootstrapSwitch('state', false);
    }
    
  });
}

clearers.cancelData = function(){
    $("#nav-dex").css('z-index', 'none');
    clearers.resetData()
    clearers.formClearers(true);
    clearers.id("");
    $("#clearerName").siblings("span.k-tooltip-validation").hide(); 
    $("#clearerDescription").siblings("span.k-tooltip-validation").hide();
}

clearers.filterClearerName.subscribe(function(value){
    if(model.View() != "false"){
        clearers.reloadGrid();
    }
});

clearers.FilterStatus = function(){
  if(model.View() != "false"){
    $('#filterStatus').on('switchChange.bootstrapSwitch', function(event, state) {
        if(state == false){
            clearers.filterStatus("0");
        }else{
           clearers.filterStatus("1");
        }
        if(clearers.reset() == false){
            clearers.reloadGrid();
        }
    });
  }
  
}

clearers.search = function(data, event){
    if(model.View() != "false" && clearers.reset() == false){
        if(clearers.filterClearerDescription().length >= 3 || clearers.filterClearerDescription().length == 0){
           clearers.reloadGrid();
        }
    }
}

clearers.reloadGrid = function(){
    $("#MasterGridClearers").data("kendoGrid").dataSource.read({
        ClearerName : clearers.filterClearerName(),
        Description : clearers.filterClearerDescription(),
        Status : clearers.filterStatus()
    })
}

var userid = model.User();
var gcCleares = new GridColumn('role_clearers', userid, 'MasterGridClearers');
clearers.getDataGridClearers = function(){
    clearers.loading(true)
    // var statusBool = $('#filterStatus').bootstrapSwitch('state');
    // var statusStr = "1"
    // if (statusBool != true){filterClearerName
    //     statusStr = "0"
    // }
    var param =  {
        ClearerName : clearers.filterClearerName(),
        Description : clearers.filterClearerDescription(),
        Status : clearers.filterStatus()
    };
    var dataSource = [];
    var url = "/masterclearers/getdata";
    $("#MasterGridClearers").html("");
    $("#MasterGridClearers").kendoGrid({
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
                            gcCleares.Init();
                            clearers.loading(false)
                            if (data.Data.Count == 0) {
                                return dataSource;
                            } else {

                                var Records = data.Data.Records;
                                var newRecords = [];
                                for (var r in Records){
                                    var StatusStr = "Active";
                                    if (Records[r].Status != "1"){
                                        StatusStr = "Inactive";
                                    }
                                    newRecords.push({
                                       "Id" : Records[r].Id,
                                       "ClearerName" : Records[r].ClearerName,
                                       "ClearerDescription" : Records[r].ClearerDescription,
                                       "Status" : StatusStr,
                                    });
                                    
                                }
                                return newRecords;
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
                  gcCleares.RemoveColumn(e.column.field);
                },
                columnShow: function(e) {
                  gcCleares.AddColumn(e.column.field);
                },
            columns: [
                {
                    field:"ClearerName",
                    title:"Clearer Name",
                    //width:120,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:clearers.editClearers(\"#: Id #\")'>#: ClearerName #</a>#}else{#<div>#: ClearerName #</div>#}#"

                },
                {
                    field:"Status",
                    title:"Status",         
                    width:100,
                },
                {
                    field:"ClearerDescription",
                    title:"Description",         
                    //width:200,
                }
            ]
    });
}

clearers.getClearerName = function(){
    var payload = {};
    clearers.listClearName([]);
    ajaxPost("/datamaster/getclearer",payload , function (res){
        var sortClerer = Enumerable.From(res).OrderBy("$.clearername").ToArray();
        for (var c in sortClerer){
            clearers.listClearName.push({
                "text" : sortClerer[c].clearername,
                "value" : sortClerer[c]._id
            });
        }
    });
}

clearers.toggleFilter = function(){
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
  clearers.panel_relocated();
    var FilterTitle = clearers.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        clearers.TitelFilter(" Show Filter");
    }else{
        clearers.TitelFilter(" Hide Filter");
    }
}

clearers.panel_relocated = function(){
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
    clearers.FilterStatus(); 
    //$('#filterStatus').bootstrapSwitch('state',true)
    clearers.getClearerName();
	clearers.getDataGridClearers();
});