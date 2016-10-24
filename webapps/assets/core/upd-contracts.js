var updcontracts = {
    isProcessing: ko.observable(false),
    formUpdContract : ko.observable(true),
    Edit : ko.observable(true),
    loading : ko.observable(false),
    onEdit: ko.observable(false),
    reset: ko.observable(false),
    paneltitle: ko.observable(' Hide Filter'),
    //variabel Field
    Id : ko.observable(""),
    fileType   : ko.observable(""),         
    contractMap   : ko.observable(""),       
    updContractMap : ko.observable(""),       
    updDivisor : ko.observable(""),
    //varibale filter
    filterFileType: ko.observableArray([]),
    filterContractMap : ko.observableArray([]),
    filterUpdContractMap : ko.observable(""),
    //variable list
    listFileType : ko.observableArray([
            {text: "TT",value :"TT"},
            {text: "Stellar",value :"Stellar"},
            {text: "ADM",value :"ADM"},
            {text: "CQG",value :"CQG"},
            {text: "CQGSFTP",value :"CQGSFTP"},
            {text: "FCS",value :"FCS"},
            {text: "Newedge",value :"Newedge"},
            {text: "SEB",value :"SEB"},
            {text: "SEB WEBCLEAR",value :"SEB WEBCLEAR"},
            {text: "Settlement Price",value :"SP"},
            {text: "Desk Fee",value :"DF"}
        ]),
    listContractMap : ko.observableArray([]),
    listUpdContractMap : ko.observableArray([]),
};

updcontracts.searchData = function(){
    updcontracts.getDataGridUpdContracts();
}

updcontracts.saveData = function(){
    var contractMap = $("#contractMap").data("kendoDropDownList");
    var param = {
        "FileType": updcontracts.fileType(),
        "ContractMap": updcontracts.contractMap(),
        "UpdContractMap": updcontracts.updContractMap(),
        "UpdDivisor": updcontracts.updDivisor().toString(),
    }
    var url = "/masterupdcontract/savedata";
    var validator = $("#formUpdaContract").data("kendoValidator");
    if(validator==undefined){
       validator= $("#formUpdaContract").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            var IsError = res.IsError;
            if (IsError == false){
                updcontracts.cancelData();
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        });
    }
}

updcontracts.saveEdit = function(){
    var contractMap = $("#contractMap").data("kendoDropDownList");
    var param = {
        "Id": updcontracts.Id(),
        "FileType": updcontracts.fileType(),
        "ContractMap": updcontracts.contractMap(),
        "UpdContractMap": updcontracts.updContractMap(),
        "UpdDivisor": updcontracts.updDivisor().toString(),
    }
    var url = "/masterupdcontract/savedata";
    var validator = $("#formUpdaContract").data("kendoValidator");
    if(validator==undefined){
       validator= $("#formUpdaContract").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            var IsError = res.IsError;
            if (IsError == false){
                updcontracts.cancelData();
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        });
    }
}

updcontracts.cancelData = function(){
    updcontracts.formUpdContract(true);
    updcontracts.Id("");
    updcontracts.resetData();
    $("#UpdctrModal").modal('hide');
    $("#nav-dex").css('z-index', 'none');
}

updcontracts.resetData = function(){
    updcontracts.reset(true);
    updcontracts.filterFileType([]);
    updcontracts.filterContractMap([]);
    updcontracts.filterUpdContractMap("");
    updcontracts.getContract();
    updcontracts.getDataGridUpdContracts();
}

updcontracts.addUpdContract = function(){
    $("#UpdctrModal").modal({
        show : true,
        backdrop: 'static',
        keyboard: false
    });
    $("#nav-dex").css('z-index', '0');
    updcontracts.onEdit(false);
    var ctrMap = $("#contractMap").data("kendoDropDownList");
    var flType = $("#fileType").data("kendoDropDownList");
    ctrMap.readonly(false)
    flType.readonly(false)
    updcontracts.formUpdContract(false);
    updcontracts.Edit(false);
    updcontracts.Id("");
    updcontracts.fileType("");      
    updcontracts.contractMap("");    
    updcontracts.updContractMap("");      
    updcontracts.updDivisor("");
}

updcontracts.editUpdContract = function(IdUpdContract){
    $("#UpdctrModal").modal({
        show : true,
        backdrop: 'static',
        keyboard: false
    });
    $("#nav-dex").css('z-index', '0');
    updcontracts.onEdit(true);
    var ctrMap = $("#contractMap").data("kendoDropDownList");
    var flType = $("#fileType").data("kendoDropDownList");
    ctrMap.readonly()
    flType.readonly()
    var param = {
        "Id": IdUpdContract,
    }
    var url = "/masterupdcontract/getdata";
    ajaxPost(url, param, function(res){
        updcontracts.formUpdContract(false);
        updcontracts.Edit(true);
        updcontracts.Id(IdUpdContract);
        var dataUpdContracts = res.Data.Records[0];
        updcontracts.fileType(dataUpdContracts.Filetype); 
        // var contractMap = $("#contractMap").data("kendoDropDownList"); 
        // contractMap.text(dataUpdContracts.Filetype);
        updcontracts.contractMap(dataUpdContracts.Contract_map);
        updcontracts.updContractMap(dataUpdContracts.Upd_contract_map);      
        updcontracts.updDivisor(dataUpdContracts.Upd_divisor);
    });
}

updcontracts.filterFileType.subscribe(function(value){
  if(model.View() != "false" && updcontracts.reset() != true){
   updcontracts.getDataGridUpdContracts();
  }
});

updcontracts.filterContractMap.subscribe(function(value){
  if(model.View() != "false" && updcontracts.reset() != true){
   updcontracts.getDataGridUpdContracts();
  }
});

updcontracts.search = function(data, event){
  if(model.View() != "false" && updcontracts.reset() != true){
    if(updcontracts.filterUpdContractMap().length >=3 || updcontracts.filterUpdContractMap().length == 0){
       updcontracts.getDataGridUpdContracts();
    }
  }
}

var userid = model.User();
var gcupdcon = new GridColumn('role_updcon', userid, 'MasterGridUpdContracts');
updcontracts.getDataGridUpdContracts = function(){
    updcontracts.loading(true)
    var param =  {
        FileType : updcontracts.filterFileType(),
        ContractMap : updcontracts.filterContractMap(),
        UpdContractMap : updcontracts.filterUpdContractMap()
    };

    var dataSource = [];
    var url = "/masterupdcontract/getdata";
    $("#MasterGridUpdContracts").html("");
    $("#MasterGridUpdContracts").kendoGrid({
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
                            updcontracts.loading(false)
                            updcontracts.reset(false)
                            gcupdcon.Init();
                            if (data.Data.Count == 0) {
                                return dataSource;
                            } else {
                                updcontracts.loading(false)
                                return data.Data.Records;
                            }
                        },
                        total: "Data.Count",
                        model: {
                                    fields: {
                                        Filetype: { type: "string" },
                                        Contract_map: { type: "string" },
                                        Upd_contract_map: { type: "string" },
                                        Upd_divisor: { type: "number" }
                                    }
                                },
                    },
                    pageSize: 15,
                    // serverPaging: false,
                    // serverSorting: false,
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
                    gcupdcon.RemoveColumn(e.column.field);
                },
                columnShow: function(e) {
                    gcupdcon.AddColumn(e.column.field);
                },
                filterable: {
                            mode: "row"
                        },
            columns: [
                {
                    field:"Filetype",
                    title:"File Type",
                    width:100,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:updcontracts.editUpdContract(\"#: Id #\")'>#: Filetype #</a>#}else{#<div>#: Filetype #</div>#}#",
                    filterable: {
                                cell: {
                                    operator: "contains"
                                }
                            }
                },
                {
                    field:"Contract_map",
                    title:"TPRS Contract",         
                    width:100,
                    filterable: {
                                cell: {
                                    operator: "contains"
                                }
                            }
                },
                {
                    field:"Upd_contract_map",
                    title:"Upd Contract Map",
                    width:150,
                    filterable: {
                                cell: {
                                    operator: "contains"
                                }
                            }
                },
                {
                    field:"Upd_divisor",
                    title:"Upd Divisor",
                    width:100,
                    attributes: {"class": "align-right"},
                    filterable: {
                                cell: {
                                    operator: "gte"
                                }
                            }
                }
            ]
    });
}

updcontracts.getContract = function(){
    var payload = {};
    updcontracts.listContractMap([]);
    ajaxPost("/datamaster/getcontract",payload , function (res){
        var sortContract = Enumerable.From(res).OrderBy("$.contract_code").ToArray();
        for (var c in sortContract){
            updcontracts.listContractMap.push({
                "text" : sortContract[c].contract_code,
                "value" : sortContract[c].contract_code
            });
        }
    });
}

updcontracts.fileType.subscribe(function(newValue) {
    var payload = {
        filetype : newValue,
        contractmap : updcontracts.contractMap()

    };
    ajaxPost("/datamaster/getdivisor",payload , function (res){
        updcontracts.updDivisor(res.divisor);
    });
});

updcontracts.contractMap.subscribe(function(newValue) {
    var payload = {
        filetype : updcontracts.fileType(),
        contractmap : newValue,
    };
    ajaxPost("/datamaster/getdivisor",payload , function (res){
       updcontracts.updDivisor(res.divisor);
    });
});

updcontracts.toggleFilter = function(){
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
  updcontracts.panel_relocated();
  if(updcontracts.paneltitle() == ' Show Filter'){
    updcontracts.paneltitle(' Hide Filter')
  }else{
    updcontracts.paneltitle(' Show Filter')
  }
}

updcontracts.panel_relocated = function(){
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
    updcontracts.getContract();
    updcontracts.getDataGridUpdContracts();
});