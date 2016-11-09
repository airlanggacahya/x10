var uploadsett = {
    formUpl: ko.observable(false),
    column: ko.observableArray([]),
    TitelFilter: ko.observable(" Hide Filter"),
    DetailColumn : ko.observableArray([]),
    totalcolumn: ko.observable(),
    indexcharacter: ko.observable(),
    startline: ko.observable(),
    filterType: ko.observable(""),
    description: ko.observable(""),
    loading : ko.observable(false),
    field: ko.observableArray([]),
    onField: ko.observableArray([]),
    removed: ko.observableArray([]),
    inField: ko.observableArray([]),
    isChange: ko.observable(false),
    typeColumn: ko.observableArray(["string", "date", "int", "float64"]),
    columnDetails: ko.observableArray([]),
    Edit: ko.observable(false),
    uplDateFormat: ko.observableArray([]),
    tempField : ko.observableArray([]),
    tempInsetField : ko.observableArray([]),
}

uploadsett.UploadSettingTemplate = {
    //uploadtype: "",
    filetype: "",
    description: "",
    contains: "",
    dateformat: "",
    dateposition: "",
    indexcharacter: 0,
    startline: 0,
    splitby: "",
    totalcolumn: 0,
    detailscolumn: [],
    joincolumn: []
};

uploadsett.JoinColumnTemplate = {
    column1: "",
    column2: "",
    condition: "",
    destinationtype: "",
    field: "",
}

// uploadsett.uplDateFormat = [
//     {id: "2Jan2006", title: "2Jan2006"},
//     {id: "Jan06", title: "Jan06"},
//     {id: "Jan-06", title: "Jan-06"},
//     {id: "2-Jan-2006", title: "2-Jan-2006"},
//     {id: "02Jan2006", title: "02Jan2006"},
//     {id: "02 Jan 200615:04:05.999", title: "02 Jan 200615:04:05.999"},
// ];

uploadsett.DatePosition = [
    {value: "start", title: "start"},
    {value: "center", title: "center"},
    {value: "end", title: "end"}
];

uploadsett.uplSplitBy = [
    {value: "tab", title: "tab"},
    {value: "semicolon", title: "semicolon (;)"},
    {value: "space", title: "space"},
    {value: "commas", title: "commas"},
    {value: "underscore", title: "underscore"}
]

uploadsett.uploadFileList = [
    {id : "TF" , title: "Transaction File"},
    {id : "SP" , title: "Statement Price"},
    {id : "DF" , title: "Desk Fee"},
];

uploadsett.uplFileType = [
    {id : "TT", title: "TT"},
    {id : "Stellar", title: "Stellar"},
    {id : "ADM", title: "ADM"},
    {id : "CQG", title: "CQG"},
    {id : "CQGSFTP", title: "CQGSFTP"},
    {id : "FCS", title: "FCS"},
     {id : "Newedge", title: "Newedge"},
    {id : "SEB", title: "SEB"},
    {id : "SEB WEBCLEAR", title: "SEB Webclear"},
    {id : "SP", title: "Settlement Price"},
   

];
uploadsett.UploadSettingConfig = ko.mapping.fromJS(uploadsett.UploadSettingTemplate);
uploadsett.DetailColumnConfig = ko.mapping.fromJS(uploadsett.DetailColumnTemplate);
uploadsett.JoinColumnConfig = ko.mapping.fromJS(uploadsett.JoinColumnTemplate)

uploadsett.filterType.subscribe(function(value){
    if(model.View() != "false"){
        uploadsett.getUploadFile();
    }
});

uploadsett.search = function(data, event){
    if(model.View() != "false"){
        if(uploadsett.description().length >= 3 || uploadsett.description().length == 0){
           uploadsett.getUploadFile();
        }
    }
}

uploadsett.CancelSet = function(){
    $("#colomModal").modal("hide");
    $("#nav-dex").css('z-index', 'none');
}

uploadsett.getUploadFile = function(){
    var url = "/uploadfilesetting/getdata";
    var param = { "filetype": uploadsett.filterType(), "description": uploadsett.description()};
    var cond;
    uploadsett.loading(true);
    if(model.Edit() =="false"){
        cond = false;
    }else{
        cond = true;
    }
    $("#UploadFileSetting").html("");
    var dataSource = [];
    $("#UploadFileSetting").kendoGrid({
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
                            uploadsett.loading(false);
                            if (data.Data.Count == 0) {
                                return dataSource;
                            } else {
                                return data.Data.Records;
                            }
                        },
                        total: "Data.Count",
                    },
                    pageSize: 5,
                    serverPaging: true,
                    serverSorting: true,
                },
                change: function(){
                    uploadsett.edit();
                    $("#nav-dex").css("z-index", "none");

                },
                selectable: cond,
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
                    field:"Filetype",
                    title:"File Type",
                    template: function(d){
                        if(model.Edit() != "false"){
                            return "<div class='grid-select' style='cursor: pointer;color: blue;'>"+ d.Filetype+"</div>"
                        }else{
                            return "<div class='grid-select' style='color: black;'>"+d.Filetype+"</div>"
                        }
                       
                    }
                
                },
                {
                    field:"Description",
                    title:"Description",
                   
                },
                {
                    field:"Contains",
                    title:"Contain",
                   
                },
                {
                    field:"Dateformat",
                    title:"Date format",
                   
                },
                {
                    field:"Dateposition",
                    title:"Date Position",
                    
                }
            ]
    })
}

uploadsett.edit = function(){
    $("#nav-dex").css("z-index", "none");
    uploadsett.Edit(true);
    uploadsett.getField();
    uploadsett.formUpl(true);
    var uplItem = $("#UploadFileSetting").data("kendoGrid");
    var selected = uplItem.dataItem(uplItem.select());
    var char = $("#indexCharacter").data("kendoNumericTextBox");
    var line = $("#startline").data("kendoNumericTextBox");
    var tot = $("#Totalcolumn").data("kendoNumericTextBox");
    //console.log(JSON.stringify(selected.Totalcolumn));
    uploadsett.UploadSettingConfig.filetype(selected.Filetype);
    uploadsett.UploadSettingConfig.description(selected.Description);
    uploadsett.UploadSettingConfig.contains(selected.Contains);
    uploadsett.UploadSettingConfig.dateformat(selected.Dateformat);
    uploadsett.UploadSettingConfig.dateposition(selected.Dateposition);
    uploadsett.UploadSettingConfig.indexcharacter(selected.Indexcharacter);
    uploadsett.UploadSettingConfig.splitby(selected.Splitby);
    uploadsett.UploadSettingConfig.totalcolumn(selected.Totalcolumn);
    uploadsett.UploadSettingConfig.joincolumn(selected.Joincolumn);
    uploadsett.UploadSettingConfig.startline(selected.Startline);
    char.value(selected.Indexcharacter);
    line.value(selected.Startline);
    tot.value(selected.Totalcolumn);
    var det = selected.Detailscolumn;
    var totcol = selected.Totalcolumn;
    if(selected.Joincolumn[0] != undefined){
        uploadsett.JoinColumnConfig.column1(selected.Joincolumn[0].Column1);
        uploadsett.JoinColumnConfig.column2(selected.Joincolumn[0].Column2);
        uploadsett.JoinColumnConfig.destinationtype(selected.Joincolumn[0].Destinationtype);
        uploadsett.JoinColumnConfig.condition(selected.Joincolumn[0].Condition);
        uploadsett.JoinColumnConfig.field(selected.Joincolumn[0].Field);
    
    }
    uploadsett.UploadSettingConfig.detailscolumn([]);
    $.each(selected.Detailscolumn , function(i, items){
        
        uploadsett.UploadSettingConfig.detailscolumn().push({
            "id": items.Id,
            "name": items.Name,
            "type": items.Type,
            "condition": items.Condition,
            "field": items.Field
        }); 
        uploadsett.DetailColumn.push({
            "value": items.Field,
            "title": det[i].Name
        }); 
    });
    uploadsett.columnData();
    for(var i=0; i< totcol; i++){

    }
}

uploadsett.newSetting = function(){
    uploadsett.Edit(false);
    uploadsett.getField();
    $(".k-widget .k-numerictextbox .k-input").css("padding", "0");
    uploadsett.formUpl(true);
    $("#nav-dex").css('z-index', 'none');

    uploadsett.UploadSettingConfig.filetype("");
    uploadsett.UploadSettingConfig.description("");
    uploadsett.UploadSettingConfig.contains("");
    uploadsett.UploadSettingConfig.dateformat("");
    uploadsett.UploadSettingConfig.dateposition("");
    uploadsett.UploadSettingConfig.indexcharacter(0);
    uploadsett.UploadSettingConfig.splitby("");
    uploadsett.UploadSettingConfig.totalcolumn(0);
    uploadsett.UploadSettingConfig.detailscolumn([]);
    uploadsett.UploadSettingConfig.joincolumn([]);
    uploadsett.UploadSettingConfig.startline(0);
    uploadsett.DetailColumn([]);
    uploadsett.columnData();
}

uploadsett.columnsType = [
    {value: "string", title: "string"},
    {value: "date", title: "date"},
    {value: "int", title: "int"},
    {value: "float", title: "float"}
];

uploadsett.getField = function(){
    uploadsett.inField([]);
    $("#nav-dex").css('z-index', '0');
    $("#userModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    var param = {
        filetype: uploadsett.UploadSettingConfig.filetype()
    }
    ajaxPost("/uploadfilesetting/getfield",param , function (res){
        //console.log(res);
        uploadsett.inField([]);
        uploadsett.onField([]);
        uploadsett.removed([]);
        uploadsett.tempInsetField([]);
        $.each(res, function(i, items){
            uploadsett.removed.push(items.Field);
            uploadsett.tempInsetField.push(items.Field);
            uploadsett.onField.push(items.Field);
            uploadsett.inField.push(items.Field);
        });

    });
}

// uploadsett.changeField =function(d){
//     var found = false
//     uploadsett.removed([])
    
//         uploadsett.onField().forEach(function(i,c){   
//             var r =uploadsett.onField().indexOf(d);
//             if(i == d){
//                 found = true;
                
//             }else{
//                 uploadsett.removed.push(i);
//             }

//         });
       
// }
uploadsett.open = function(e){
    var listData = [];
    var realData = uploadsett.removed();
    if (uploadsett.tempField().length != 0){
        var a1 = realData;
        var a2 = uploadsett.tempField();
        var query = Enumerable.From(a1).Except(a2).ToArray();
        listData = query;
    }else{
        listData = uploadsett.removed();
    }

    uploadsett.tempInsetField(listData);

}

uploadsett.onSelect = function(value, index){
    Field[index] = value;
    uploadsett.tempField(Field);
    
}

uploadsett.UploadSettingConfig.filetype.subscribe(function(value){
    uploadsett.inField([]);
    uploadsett.getField();
});
var Field = [];
uploadsett.setColumn = function(){
    uploadsett.tempField([]);
    //uploadsett.UploadSettingConfig.detailscolumn([]);
    uploadsett.columnDetails([]);
    uploadsett.removed([]);

    var d = 0;
    var set = parseInt(uploadsett.UploadSettingConfig.totalcolumn());
    uploadsett.getField();
    for(var i = 0; i<set;i++){
        uploadsett.columnDetails.push({
            "id": ko.observable(""),
            "name": ko.observable(""), 
            "type": ko.observable(""), 
            "condition1": ko.observable(""), 
            "condition2": ko.observable(false),
            "field": ko.observable("")
        });
        
        if(uploadsett.UploadSettingConfig.detailscolumn()[i] != undefined){
            uploadsett.columnDetails()[i].name(uploadsett.UploadSettingConfig.detailscolumn()[i].name);
            uploadsett.columnDetails()[i].type(uploadsett.UploadSettingConfig.detailscolumn()[i].type);
            if(uploadsett.columnDetails()[i].type() == "date"){
                uploadsett.columnDetails()[i].condition1(uploadsett.UploadSettingConfig.detailscolumn()[i].condition);
            }else{
                uploadsett.columnDetails()[i].condition2(uploadsett.UploadSettingConfig.detailscolumn()[i].condition);
            }
            uploadsett.columnDetails()[i].field(uploadsett.UploadSettingConfig.detailscolumn()[i].field);
        }
        uploadsett.getValue(i);
    } 
}

uploadsett.getValue = function(index){
    $("#field"+index).change(function(){
        uploadsett.onSelect($(this).val(), index);
    });
}


// uploadsett.setColumnEdit = function(){
//     uploadsett.UploadSettingConfig.detailscolumn([]);
//     uploadsett.columnDetails([]);
//     uploadsett.removed([]);

//     var d = 0;
//     var set = parseInt(uploadsett.UploadSettingConfig.totalcolumn());
//     // uploadsett.getField();
//     for(var i = 0; i<set;i++){
//         uploadsett.columnDetails.push({
//             "id": ko.observable(""),
//             "name": ko.observable(""), 
//             "type": ko.observable(""), 
//             "condition1": ko.observable(""), 
//             "condition2": ko.observable(false),
//             "field": ko.observable("")
//         });



//         $("#field"+i).change(function(){
//             uploadsett.changeField($(this).val());
//         });
//     } 
// }


uploadsett.joinColumn =function(){
    var set = parseInt(uploadsett.UploadSettingConfig.totalcolumn());
    var leng = uploadsett.UploadSettingConfig.detailscolumn().length;
    //alert("bbbbb");
    var price;
    var string;
    uploadsett.DetailColumn([]);
        for(var i = 0; i< set; i++){
            var setcol = {value: $("#titleColumn"+i).val(), title:  $("#titleColumn"+i).val()};
            var col ={name: $("#titleColumn"+i).val(), type:  $("#typeColumn"+i).val() };
            
            if($("#priceNot"+i).is(":checked")){
                price = "true";
            }else if($("#typeColumn"+i).val() =="string"){
                price = "false";
            }else if($("#typeColumn"+i).val() == "date"){
                price = $("#formatDate"+i).val();
            }

            var con = "";
            if( uploadsett.columnDetails()[i].type() == "integer" || uploadsett.columnDetails()[i].type() == "float"){
                if(uploadsett.columnDetails()[i].condition2() == false){
                    con = "";
                }else{
                    con = "true";
                }
            }else if( uploadsett.columnDetails()[i].type() == "date"){
                con = uploadsett.columnDetails()[i].condition1();
            }else{
                if(uploadsett.columnDetails()[i].type() == "string" && uploadsett.columnDetails()[i].condition2() == false){
                    con = "false";
                }else{
                    con = "true"
                }
            }
            
            uploadsett.UploadSettingConfig.detailscolumn().push({
                "id": uploadsett.columnDetails()[i].id(),
                "name": uploadsett.columnDetails()[i].name(),
                "type":  uploadsett.columnDetails()[i].type(),
                "condition": con,
                "field": uploadsett.columnDetails()[i].field()
            }); 
            uploadsett.DetailColumn.push({
                "value": uploadsett.columnDetails()[i].field(),
                "title": uploadsett.columnDetails()[i].name()
            });  
        }

        uploadsett.columnData();
   
    
}

uploadsett.columnData = function(){
    var data = uploadsett.UploadSettingConfig.detailscolumn();
    $("#colgrid").html("");
    $("#colgrid").kendoGrid({
        dataSource: {
            data : data
        },
        columns: [
          { field: "id",  title: "coloumn", width: 55},
          { field: "name",  title: "name"},
          { field: "type", title: "type" },
          { field: "condition", title: "condition" },
          { field: "field", title: "field" }
        ],
        
    });
    $("#joinCol").html("");
    $("#joinCol").kendoGrid({
        // dataSource: {
        //     data : data
        // },
        columns: [
          { title: "Coloumn 1 :", width: 55},
          { title: "Coloumn 2 :"},
          { title: "Coloumn Type" },
          { field: "condition", title: "condition" },
          { field: "field", title: "field" }
        ],
        
    });

}

uploadsett.makeColumn = function(){
    validator2= $("#detForm").kendoValidator().data("kendoValidator");
   
    if (validator2.validate()) {
        uploadsett.joinColumn();
        $('#colomModal').modal('hide');
        $("#nav-dex").css('z-index', 'none');
    }
}

uploadsett.resetFilter = function(){
    uploadsett.filterType("");
    uploadsett.description("");
    uploadsett.getUploadFile();
}

uploadsett.back = function(){
    uploadsett.formUpl(false);
    uploadsett.getUploadFile();
    $("#nav-dex").css("z-index", "none");
}

uploadsett.saveGroupSetting = function(){
    var validator1 = $("#formuploadsetting").data("kendoValidator");
    if(validator1==undefined){
       validator1= $("#formuploadsetting").kendoValidator().data("kendoValidator");
    }
    uploadsett.UploadSettingConfig.joincolumn([]);
    uploadsett.UploadSettingConfig.joincolumn.push(uploadsett.JoinColumnConfig);
    uploadsett.UploadSettingConfig.totalcolumn(parseInt(uploadsett.UploadSettingConfig.totalcolumn()));
    uploadsett.UploadSettingConfig.indexcharacter(parseInt(uploadsett.UploadSettingConfig.indexcharacter()));
    uploadsett.UploadSettingConfig.startline(parseInt(uploadsett.UploadSettingConfig.startline()));
    var param = ko.mapping.toJS(uploadsett.UploadSettingConfig)
    if(validator1.validate()){
        ajaxPost("/uploadfilesetting/savedata",param , function (res){
            swal({
                title: "Data Saved !!",
                text: "Data Setting Has Been Saved",
                type: "success",
                confirmButtonClass: "btn-success",
                closeOnConfirm: true
            },function(isConfirm){
                if(isConfirm){
                    uploadsett.back();
                }
            });
           
        });
    }
}

uploadsett.dropdown = function(){
    uploadsett.uplDateFormat([])
    ajaxPost("/uploadfilesetting/getdateformat",{} , function (res){
        
        res.map(function(d){
            uploadsett.uplDateFormat.push(
                {
                    id: d.format, 
                    title: d.format
                }
            )
        });
    });
}

uploadsett.toggleFilter = function(){
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
  uploadsett.panel_relocated();
  var FilterTitle = uploadsett.TitelFilter();
  if (FilterTitle == " Hide Filter") {
    uploadsett.TitelFilter(" Show Filter");
  } else {
    uploadsett.TitelFilter(" Hide Filter");
  }
}

uploadsett.panel_relocated = function(){
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
    uploadsett.getUploadFile();
    uploadsett.dropdown();

});