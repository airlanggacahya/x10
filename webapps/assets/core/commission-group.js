var CmmGroup = {
  isProcessing: ko.observable(false),
  formcommissionGroup: ko.observable(true),
  filterCommisionGroupID: ko.observable(""),
  filterName: ko.observable(""),
  Name: ko.observable(),
  Note: ko.observable(),
  filterStatus: ko.observable(),
  id: ko.observable(),
  Edit: ko.observable(true),
  CommGroup: ko.observableArray([]),
  loading: ko.observable(false),
  titleModal: ko.observable(""),
  reset: ko.observable(false),
  TitelFilter : ko.observable(" Hide Filter"),
};

CmmGroup.searchData = function () {
  CmmGroup.getDataGridCmmGroup();
}

CmmGroup.resetData = function () {
  CmmGroup.reset(true);
  CmmGroup.filterCommisionGroupID("");
  CmmGroup.filterName("");
  $('#filterStatus').bootstrapSwitch('state', true)
  CmmGroup.getDataGridCmmGroup();
  CmmGroup.reset(false);
}

CmmGroup.cancelData = function () {
  $("#cmmgrp").modal('hide');
  CmmGroup.filterCommisionGroupID("");
  CmmGroup.formcommissionGroup(true);
  CmmGroup.getDataGridCmmGroup();
  CmmGroup.dropdown();
}

CmmGroup.dropdown = function () {
   CmmGroup.CommGroup([]);
  ajaxPost("/datamaster/getcommissiongroup", {}, function (res) {
    res.map(function (d){
      CmmGroup.CommGroup.push({
        title: d.name,
        value: d._id
      });
    })
  });
}

CmmGroup.saveData = function () {
  var validator = $("#comm").data("kendoValidator");
  $("#nav-dex").css('z-index', 'none');
  //console.log(validator);
  if (validator == undefined) {
    validator = $("#comm").kendoValidator().data("kendoValidator");
  }
  var statusBool = $('#Status').bootstrapSwitch('state');
  var statusStr = "1"
  if (statusBool != true) {
    statusStr = "0"
  }

  var param = {
    "Id": -1,
    "Name": CmmGroup.Name(),
    "Note": CmmGroup.Note(),
    "Status": statusStr
  }
  var url = "/mastercomissiongroup/savedata";
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      var dataClients = res.Data.Records;
      if(res.IsError != true){
          CmmGroup.cancelData();
          swal("Success!", res.Message, "success");
      }else{
          return swal("Error!", res.Message, "error");
      }
    });
  }

}

CmmGroup.saveEdit = function () {
  var validator = $("#comm").data("kendoValidator");
  $("#nav-dex").css('z-index', 'none');
  //console.log(validator);
  if (validator == undefined) {
    validator = $("#comm").kendoValidator().data("kendoValidator");
  }
  var statusBool = $('#Status').bootstrapSwitch('state');
  var statusStr = "1"
  if (statusBool != true) {
    statusStr = "0"
  }
  var param = {
    "Id": parseInt(CmmGroup.id()),
    "Name": CmmGroup.Name(),
    "Note": CmmGroup.Note(),
    "Status": statusStr
  }

  var url = "/mastercomissiongroup/savedata";
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      //var dataClients = res.Data.Records;
      //onsole.log(dataClients);
      if(res.IsError != true){
          CmmGroup.cancelData();
          swal("Success!", res.Message, "success");
      }else{
          return swal("Error!", res.Message, "error");
      }
    });
  }

}
CmmGroup.editCmmGroup = function (d) {
  CmmGroup.formcommissionGroup(false);
  var param = {
    Id: d
  }
  CmmGroup.id(d);
  var url = "/mastercomissiongroup/getdata";
  ajaxPost(url, param, function (res) {
    $("#cmmgrp").modal('show');
    $("#cmmgrp").modal({
        backdrop: 'static',
        keyboard: false
  });
  $("#nav-dex").css('z-index', '0');
    CmmGroup.titleModal("Update Commision Group");
    CmmGroup.Edit(true);
    CmmGroup.Name(res.Data.Records[0].Name);
    CmmGroup.Note(res.Data.Records[0].Note);
    $('#Status').bootstrapSwitch('state', true);
    if (res.Data.Records[0].Status != "1") {
      $('#Status').bootstrapSwitch('state', false);
    }
  });
}

CmmGroup.addNew = function () {
  $("#cmmgrp").modal('show');
  $("#cmmgrp").modal({
        backdrop: 'static',
        keyboard: false
  });
  $("#nav-dex").css('z-index', '0');
  $('#Status').bootstrapSwitch('state', true);
  CmmGroup.titleModal("New Commision Group");
  CmmGroup.formcommissionGroup(false);
  CmmGroup.Edit(false);
  CmmGroup.Name("");
  CmmGroup.Note("");
}

CmmGroup.cancel = function(){
  //CmmGroup.formcommissionGroup(true);
  $("#nav-dex").css('z-index', 'none');
} 

CmmGroup.filterCommisionGroupID.subscribe(function(value){
  if(model.View() != "false" && CmmGroup.reset() == false){
    CmmGroup.reloadGrid()
  }
});

CmmGroup.FilterStatus = function(){
  if(model.View() != "false"){
    $('#filterStatus').on('switchChange.bootstrapSwitch', function(event, state) {
        if(state == false){
            CmmGroup.filterStatus("0");
        }else{
           CmmGroup.filterStatus("1");
        }
        if(CmmGroup.reset() == false){
          CmmGroup.reloadGrid();
        }
    });
  }
  
}

CmmGroup.reloadGrid = function(){
  $("#MasterGridCmmGroup").data("kendoGrid").dataSource.read({
    Id: CmmGroup.filterCommisionGroupID(),
    Name: CmmGroup.filterName(),
    Status: CmmGroup.filterStatus()
  })
}

var userid = model.User();
var gc = new GridColumn('cmm_group_master', userid, 'MasterGridCmmGroup');
CmmGroup.getDataGridCmmGroup = function () {
  var statusBool = $('#filterStatus').bootstrapSwitch('state');
  var statusStr = "1"
  if (statusBool != true) {
    statusStr = "0"
  }

  CmmGroup.loading(true);
  var param = {
    Id: CmmGroup.filterCommisionGroupID(),
    Name: CmmGroup.filterName(),
    Status: CmmGroup.filterStatus()
  };
  var dataSource = [];
  var url = "/mastercomissiongroup/getdata";
  $("#MasterGridCmmGroup").html("");
  $("#MasterGridCmmGroup").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: url,
          data: param,
          dataType: "json",
          type: "POST",
          contentType: "application/json",
        },
        parameterMap: function (data) {
          return JSON.stringify(data);
        },
      },
      schema: {
        data: function (data) {
          
          CmmGroup.loading(false);
          if (data.Data.Count == 0) {
            gc.Init();
            return dataSource;
          } else {
            var Records = data.Data.Records;
            var newRecords = [];
            for (var r in Records) {
              var StatusStr = "Active";
              if (Records[r].Status != "1") {
                StatusStr = "Inactive";
              }
              newRecords.push({
                "Id": Records[r].Id,
                "Name": Records[r].Name,
                "Count_member": Records[r].Count_member,
                "Note": Records[r].Note,
                "Status": StatusStr,
              });

            }
            gc.Init();
            return newRecords;
          }
        },
        total: "Data.Count",
      },
      pageSize: 15,
      // serverPaging: true,
      // serverSorting: true,
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
      gc.RemoveColumn(e.column.field);
    },
    columnShow: function(e) {
      gc.AddColumn(e.column.field);
    },
    columns: [
      {
        field: "Name",
        title: "Name",
        // width: 100,
        template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:CmmGroup.editCmmGroup(\"#: Id #\")'>#: Name #</a>#}else{#<div>#: Name #</div>#}#"
      },
      {
        field: "Count_member",
        title: "Count Member",
        // width: 100,
        attributes: {
          "class": "align-right"
        },
      },
      {
        field: "Status",
        title: "Status",
        // width: 50,
      },
      {
        field: "Note",
        title: "Notes",
        // width: 200,
      }

    ]
  });
}

CmmGroup.toggleFilter = function(){
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
  CmmGroup.panel_relocated();
    var FilterTitle = CmmGroup.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        CmmGroup.TitelFilter(" Show Filter");
    }else{
        CmmGroup.TitelFilter(" Hide Filter");
    }
}

CmmGroup.panel_relocated = function(){
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
  CmmGroup.FilterStatus();
  $('#filterStatus').bootstrapSwitch('state', true)
  CmmGroup.getDataGridCmmGroup();
  CmmGroup.dropdown();
});