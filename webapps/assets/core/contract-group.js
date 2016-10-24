var contactGrp = {
  Edit: ko.observable(true),
  FormGroup: ko.observable(true),
  loading: ko.observable(false),
  TitelFilter: ko.observable(" Hide Filter"),
  // variable field
  Id: ko.observable(),
  ContractGrpName: ko.observable(""),
  ContractMap : ko.observable(""),
  titleModal: ko.observable(""),
  // lsit data
  listFiterStatus: ko.observableArray([
    {"text": "All", "value": -9999},
    {"text": "Active", "value": 1},
    {"text": "InActive", "value": 0}
  ]),
  listContractMap : ko.observableArray([]),
  //varibale Sub field
  tempName: ko.observable(""),
  temId: ko.observable(""),
  subGroup: ko.observable(""),
  ContractMapSub : ko.observable(""),
  subId: ko.observable(""),
  //var Filter
  filterContractGrpName: ko.observable(""),
  filterstaus: ko.observable(-9999),
};

contactGrp.Search = function () {
  contactGrp.getDataGridContractGroup();
}

contactGrp.Reset = function () {
  $('#ftrstatus').bootstrapSwitch('state', true);
  contactGrp.filterstaus(-9999);
  contactGrp.Id("");
  contactGrp.ContractGrpName("");
  contactGrp.filterContractGrpName("");
  contactGrp.getDataGridContractGroup();
}

contactGrp.AddTitle = function () {
  contactGrp.Edit(false);
  $('#ftrstatus').bootstrapSwitch('state', true);
  contactGrp.Id("");
  contactGrp.ContractGrpName("");
  contactGrp.ContractMap("");
  contactGrp.titleModal("New Contract Group");
  $("#mdlConfirm").modal("show");
  $("#nav-dex").css('z-index', '0');
  $("#mdlConfirm").modal({
    backdrop: 'static',
    keyboard: false
  });
}

contactGrp.cancelData = function () {
  contactGrp.Edit(false);
  $("#ContractGrpName").siblings("span.k-tooltip-validation").hide();
  $("#nav-dex").css('z-index', 'none');
  $("#mdlConfirm").modal("hide");
}

contactGrp.EditformContractGroup = function (idTittle) {
  var param = {
    "Id": parseInt(idTittle),
  }
  var url = "/mastercontractgroup/getdata";

  ajaxPost(url, param, function (res) {
    var dataContractGroup = res.Data.Records[0];
    if (dataContractGroup.Status = 1) {
      $('#inputstatus').bootstrapSwitch('state', true);
    } else {
      $('#inputstatus').bootstrapSwitch('state', false);
    }
    contactGrp.Edit(true);
    contactGrp.Id(dataContractGroup.Id);
    contactGrp.ContractGrpName(dataContractGroup.Name);
    contactGrp.titleModal("Update Contract Group");
    $("#mdlConfirm").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
      backdrop: 'static',
      keyboard: false
    });
  });
}

contactGrp.saveData = function () {
  var stts = $('#inputstatus').bootstrapSwitch('state');
  var statsu = 0;
  if (stts == true) {
    statsu = 1;
  }

  var param = {
    "Id": 0,
    "Name": contactGrp.ContractGrpName(),
    "Contract": contactGrp.ContractMap(),
    "Status": statsu,
  }
  var url = "/mastercontractgroup/savedata";
  var validator = $("#ContractGrp").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#ContractGrp").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        contactGrp.Reset();
        $("#nav-dex").css('z-index', 'none');
        $("#mdlConfirm").modal("hide");
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

contactGrp.saveEdit = function () {
  var stts = $('#inputstatus').bootstrapSwitch('state');
  var statsu = 0;
  if (stts == true) {
    statsu = 1;
  }

  var param = {
    "Id": contactGrp.Id(),
    "Name": contactGrp.ContractGrpName(),
    "Contract": contactGrp.ContractMap(),
    "Status": statsu,
  }
  var url = "/mastercontractgroup/savedata";
  var validator = $("#ContractGrp").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#ContractGrp").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        contactGrp.Reset();
        $("#nav-dex").css('z-index', 'none');
        $("#mdlConfirm").modal("hide");
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }

    });
  }
}

contactGrp.search = function (data, event) {
  if (model.View() != "false") {
    if (contactGrp.filterContractGrpName().length >= 3) {
      contactGrp.getDataGridContractGroup();
    }
  }
}

contactGrp.getDataGridContractGroup = function () {
  contactGrp.loading(true);
  var param = {
    "Name": contactGrp.filterContractGrpName(),
    "Status": parseInt(contactGrp.filterstaus())
  };
  var dataSource = [];
  var url = "/mastercontractgroup/getdata";
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
        parameterMap: function (data) {
          return JSON.stringify(data);
        },
      },
      schema: {
        data: function (data) {
          contactGrp.loading(false);
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
    detailInit: detailInit,
    dataBound: function () {
      this.expandRow(this.tbody.find("tr.k-master-row").first());
    },
    detailExpand: function (e) {
        var grd = "#MasterGridTitle";
        $(grd + " tr.k-detail-row").hide();
        $(grd + " tr.k-master-row").find(".highlightrow").removeClass("activerow");
        $(grd + " td.k-hierarchy-cell").find("a").removeClass("k-minus").addClass("k-plus");
        $(e.masterRow).find(".highlightrow").addClass("activerow");
        $(e.masterRow).find("td.k-hierarchy-cell").find("a").removeClass("k-plus").addClass("k-minus");
    },
    detailCollapse: function (e) {
        $(e.masterRow).find(".highlightrow").removeClass("activerow");
    },
    columns: [
      {
        field: "Name",
        title: "Contract Group",
        width: 200,
        template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:contactGrp.EditformContractGroup(\"#: Id #\")'>#: Name #</a>#}else{#<div>#: Name #</div>#}#"
      },
      {
        field: "Status",
        title: "Status",
        width: 100,
        template: "#if(Status==1){# #: 'Active' # #}else{# #: 'InActive' # #}#"
      },

      
      {
        template: function (d) {
          return[
            "<button type='button' class='btn btn-xs btn-success btn-flat tooltipster title='Edit Pending Allocation' onclick='contactGrp.AddNewSub(\"" + d.Id + "\", \"" + d.Name + "\")'><i class='fa fa fa-pencil-square-o'> Add New Sub</i></button>"
          ].join(" ");
        },
        attributes: {"class": "align-right"}
      }
    ]
  });
}

function detailInit(e) {
  var detailRow = e.detailRow;
  var payload = {
    ContractGroupId: parseInt(e.data.Id),
    ContractGroupName: e.data.Name,
    "Status": parseInt(contactGrp.filterstaus())
  };
  var dataSource = [];
  var url = "/mastercontractsubgroup/getdata";
  $("<div/>").appendTo(e.detailCell).kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: url,
          data: payload,
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
    scrollable: false,
    sortable: true,
    pageable: true,
    columns: [
      {
        field: "Name",
        title: "Name",
        template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:contactGrp.EditformContractGroupSub(\"#: Id #\",\"#: Name #\",\"#: ContractGroupName #\",\"#: ContractGroupId #\",\"#: Status #\")'>#: Name #</a>#}else{#<div>#: Name #</div>#}#"

      },
      {
        field: "ContractGroupName",
        title: "Contract Group",
      },
      {
        field: "Status",
        title: "Status",
        template: "#if(Status==1){# #: 'Active' # #}else{# #: 'InActive' # #}#"
      }
    ]
  });
}

contactGrp.AddNewSub = function (IdContract, NameContract) {
  contactGrp.Edit(false);
  $('#inputSubstatus').bootstrapSwitch('state', true);
  contactGrp.tempName(NameContract);
  contactGrp.temId(IdContract);
  contactGrp.subGroup("");
  contactGrp.ContractMapSub("");
  contactGrp.subId("");
  $("#mdlConfirmSub").modal("show");
  $("#nav-dex").css('z-index', '0');
  $("#mdlConfirmSub").modal({
    backdrop: 'static',
    keyboard: false
  });
};

contactGrp.EditformContractGroupSub = function (idSub, NameSub, IdContract, NameContract, statsu) {
  contactGrp.Edit(true);
  contactGrp.tempName(NameContract);
  contactGrp.temId(IdContract);
  contactGrp.subGroup(NameSub);
  contactGrp.subId(idSub);
  if (parseInt(Status) == 1) {
    $('#inputSubstatus').bootstrapSwitch('state', true);
  } else {
    $('#inputSubstatus').bootstrapSwitch('state', false);
  }
  $("#mdlConfirmSub").modal("show");
  $("#nav-dex").css('z-index', '0');
  $("#mdlConfirmSub").modal({
    backdrop: 'static',
    keyboard: false
  });
}
contactGrp.CancelSub = function () {
  $("#ContractGrpName").siblings("span.k-tooltip-validation").hide();
  $("#nav-dex").css('z-index', 'none');
  $("#mdlConfirmSub").modal("hide");
}

contactGrp.saveDataSub = function () {
  var stts = $('#inputSubstatus').bootstrapSwitch('state');
  var statsu = 0;
  if (stts == true) {
    statsu = 1;
  }

  var param = {
    "Id": 0,
    "Name": contactGrp.subGroup(),
    "ContractGroupId": parseInt(contactGrp.temId()),
    "ContractGroupName": contactGrp.tempName(),
    "Contract": contactGrp.ContractMapSub(),
    "Status": statsu
  }
  var url = "/mastercontractsubgroup/savedata";
  var validator = $("#ContractGrpSub").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#ContractGrpSub").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        contactGrp.Reset();
        $("#nav-dex").css('z-index', 'none');
        $("#mdlConfirmSub").modal("hide");
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

contactGrp.saveEditSub = function () {
  var stts = $('#inputSubstatus').bootstrapSwitch('state');
  var statsu = 0;
  if (stts == true) {
    statsu = 1;
  }
  var param = {
    "Id": contactGrp.subId(),
    "Name": contactGrp.subGroup(),
    "ContractGroupId": parseInt(contactGrp.temId()),
    "ContractGroupName": contactGrp.tempName(),
    "Contract": contactGrp.ContractMapSub(),
    "Status": statsu
  }
  var url = "/mastercontractsubgroup/savedata";
  var validator = $("#ContractGrpSub").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#ContractGrpSub").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        contactGrp.Reset();
        $("#nav-dex").css('z-index', 'none');
        $("#mdlConfirmSub").modal("hide");
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }

    });
  }
}

contactGrp.toggleFilter = function () {
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
    } catch (err) {
    }
  });

  $('.k-pivot').each(function (i, d) {
    $(d).data('kendoPivotGrid').refresh();
  });

  $('.k-chart').each(function (i, d) {
    $(d).data('kendoChart').redraw();
  });
  contactGrp.panel_relocated();
  var FilterTitle = contactGrp.TitelFilter();
  if (FilterTitle == " Hide Filter") {
    contactGrp.TitelFilter(" Show Filter");
  } else {
    contactGrp.TitelFilter(" Hide Filter");
  }
}

contactGrp.panel_relocated = function () {
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

contactGrp.getContract = function(){
    var payload = {};
    contactGrp.listContractMap([]);
    ajaxPost("/datamaster/getcontract",payload , function (res){
        var sortContract = Enumerable.From(res).OrderBy("$.contract_code").ToArray();
        for (var c in sortContract){
            contactGrp.listContractMap.push({
                "text" : sortContract[c].contract_code,
                "value" : sortContract[c].contract_code
            });
        }
    });
}

$(document).ready(function () {
    contactGrp.getContract();
    contactGrp.getDataGridContractGroup();
    // $(".k-hierarchy-cell" ).find("a").find(".k-icon").click(function() {
    //     console.log("oke");
    // });
    
});