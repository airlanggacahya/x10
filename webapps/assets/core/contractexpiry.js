var expiry = {
  dataContract: ko.observableArray(),
  dataFilter: ko.observableArray([]),
  filterContractCode: ko.observable(),
  Edit: ko.observable(false),
  Id: ko.observable(),
  reset: ko.observable(false),
  loading: ko.observable(false),
  TitelFilter : ko.observable(" Hide Filter"),
}

expiry.formTemplate = {
  Id: 0,
  Contractid: "",
  Fullname: "",
  Description: "",
  Contractexpiry: "",
  Lasttradingdate: "",
  Firstnoticedate: ""
}

expiry.formConfig = ko.mapping.fromJS(expiry.formTemplate);

expiry.filterContractCode.subscribe(function(value){
    if(model.View() != "false" && expiry.reset() == false){
        expiry.reloadGrid();
    }
});

var userid = model.User();
var gcExpiry = new GridColumn('contract_expry', userid, 'expryGrid');
expiry.loadDataGrid = function () {
  expiry.loading(true)
  var dataSource = [];
  var url = "/contractexpiry/getdata";
  var param = {Contractid: expiry.filterContractCode()};
  $("#expryGrid").html("");
  $("#expryGrid").kendoGrid({
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
          expiry.loading(false)
          gcExpiry.Init();
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
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    columnMenu: false,
    columnHide: function(e) {
      gcExpiry.RemoveColumn(e.column.field);
    },
    columnShow: function(e) {
      gcExpiry.AddColumn(e.column.field);
    },
    columns: [
      {
        field: "Contractcode",
        title: "Contract Code",
        width: 100,
        template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:expiry.editContractExpiry(\"#: Id #\")'>#: Contractcode #</a>#}else{#<div>#: Contractcode #</div>#}#",
      },
      {
        field: "Fullname",
        title: "Full Name",
        // width: 150,
        
      },
      {
        field: "Contractexpiry",
        title: "contract expiry",
        // width: 40,
        attributes: { "class": "align-center"},
        template: "#= moment(Contractexpiry).format('YYYY-MM-DD') #"
      },
      {
        field: "Description",
        title: "Description",
        //width: 140,
        attributes: { "class": "align-center"},
      },
      {
        title: "First Notice Date",
        field: "Firstnoticedate",
        //width: 40,
        attributes: { "class": "align-center"},
        template: "#= moment(Firstnoticedate).format('YYYY-MM-DD') #"
      },
      {
        field: "Lasttradingdate",
        title: "Last Trading Date",
        //width: 40,
        attributes: { "class": "align-center"},
        template: "#= moment(Lasttradingdate).format('YYYY-MM-DD') #"
      },
      //template: "#= moment(ContractExpiry).format('MMMM YYYY') #"
    ]
  });
}

expiry.dropdown = function () {
  expiry.dataContract([]);
  ajaxPost("/datamaster/getcontract", {}, function (res) {
    res.map(function (d) {
      expiry.dataContract.push(
        {
          title: d.contract_code,
          value: d._id +"~"+ d.fullname

        }
      );
      expiry.dataFilter.push({
        title: d.contract_code,
        value: d._id
      });
    })
  });
}

expiry.editContractExpiry = function (d) {
  $("#nav-dex").css('z-index', '0');
  expiry.Edit(true);
  $('#ctrexp').kendoDatePicker({
        format: "yyyy-MM-dd",
    }).data("kendoDatePicker");
  $('#firstnote').kendoDatePicker({
        format: "yyyy-MM-dd",
    }).data("kendoDatePicker");
  $('#lasttrade').kendoDatePicker({
        format: "yyyy-MM-dd",
    }).data("kendoDatePicker");
  //$("#expiryModal").modal("show");
  $("#expiryModal").modal({
    show: true,
    backdrop: 'static',
    keyboard: false
  });
  expiry.Id.subscribe(function(val){
    var res = val.split("~");
    expiry.formConfig.Id(res[0]);
    expiry.formConfig.Fullname(res[1]);

  });
  ajaxPost("/contractexpiry/getdata", {Id : d}, function (res) {
    var dt = res.Data.Records[0];
    var select = $("#ctrcode").data("kendoDropDownList");
    select.text(dt.Contractcode); 
    expiry.formConfig.Id(dt.Id)
    expiry.formConfig.Fullname(dt.Fullname)
    expiry.formConfig.Contractid(dt.Contractid)
    expiry.formConfig.Description(dt.Description)
    expiry.formConfig.Contractexpiry(dt.Contractexpiry)
    expiry.formConfig.Lasttradingdate(dt.Lasttradingdate)
    expiry.formConfig.Firstnoticedate(dt.Firstnoticedate)
    
  })

}

expiry.resetData = function(){
  expiry.reset(true);
  expiry.filterContractCode([]);
  expiry.loadDataGrid();
  expiry.reset(false);
}

expiry.reloadGrid = function(){
  $("#expryGrid").data("kendoGrid").dataSource.read({
    Contractid: expiry.filterContractCode()
  });
}

expiry.addData = function(){
  //$("#expiryModal").modal("show");
  $("#expiryModal").modal({
    show : true, 
    backdrop: 'static',
    keyboard: false
  });
  $("#nav-dex").css('z-index', '0');
  expiry.formConfig.Id("");
  expiry.Id("");
  expiry.formConfig.Contractid("");
  expiry.formConfig.Description("");
  expiry.formConfig.Contractexpiry("");
  expiry.formConfig.Lasttradingdate("");
  expiry.formConfig.Firstnoticedate("");
  expiry.Edit(false);
  $(ctrexp).kendoDatePicker({
        format: "yyyy-MM-dd",
    }).data("kendoDatePicker");
  $('#firstnote').kendoDatePicker({
        format: "yyyy-MM-dd",
    }).data("kendoDatePicker");
  $('#lasttrade').kendoDatePicker({
        format: "yyyy-MM-dd",
    }).data("kendoDatePicker");
  expiry.Id.subscribe(function(val){
    var res = val.split("~");
    expiry.formConfig.Id(res[0]);
    expiry.formConfig.Fullname(res[1]);

  });
}

expiry.saveEdit = function(){
  $("#nav-dex").css('z-index', 'none');
  var validator = $("#expr").data("kendoValidator");
  //console.log(validator);
  if (validator == undefined) {
    validator = $("#expr").kendoValidator().data("kendoValidator");
  }
  var param = {
    Id: -1,
    Contractid: parseInt(expiry.formConfig.Id()),
    Description: expiry.formConfig.Description(),
    Contractexpiry: expiry.formConfig.Contractexpiry(),
    Lasttradingdate: expiry.formConfig.Lasttradingdate(),
    Firstnoticedate: expiry.formConfig.Firstnoticedate()
  }

  var url = "/contractexpiry/savedata";
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      // swal({
      //   title: "Data Saved !!",
      //   text: "Data Has Been Saved",
      //   type: "success",
      //   confirmButtonClass: "btn-success",
      //   closeOnConfirm: true
      // }, function (isConfirm) {
      //   if (isConfirm) {
      //     expiry.cancelData();
      //   }
      // });
      if(res.IsError != true){
        expiry.cancelData();
        swal("Success!", res.Message, "success");
      }else{
        return swal("Error!", res.Message, "error");
      }
    });
  }

}

expiry.saveAdd = function(){
  $("#nav-dex").css('z-index', 'none');
  var validator = $("#expr").data("kendoValidator");
  //console.log(validator);
  if (validator == undefined) {
    validator = $("#expr").kendoValidator().data("kendoValidator");
  }
  var param = {
    Id: -1,
    Contractid: parseInt(expiry.formConfig.Id()),
    Description: expiry.formConfig.Description(),
    Contractexpiry: expiry.formConfig.Contractexpiry(),
    Lasttradingdate: expiry.formConfig.Lasttradingdate(),
    Firstnoticedate: expiry.formConfig.Firstnoticedate()
  }

  var url = "/contractexpiry/savedata";
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      // swal({
      //   title: "Data Saved !!",
      //   text: "Data Has Been Saved",
      //   type: "success",
      //   confirmButtonClass: "btn-success",
      //   closeOnConfirm: true
      // }, function (isConfirm) {
      //   if (isConfirm) {
      //     expiry.cancelData();
      //   }
      // });
      if(res.IsError != true){
        expiry.cancelData();
        swal("Success!", res.Message, "success");
      }else{
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

expiry.toggleFilter = function(){
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
  expiry.panel_relocated();
    var FilterTitle = expiry.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        expiry.TitelFilter(" Show Filter");
    }else{
        expiry.TitelFilter(" Hide Filter");
    }
}

expiry.panel_relocated = function(){
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


expiry.cancelData = function(){
  $("#expiryModal").modal("hide");
  $("#nav-dex").css('z-index', 'none');
  expiry.loadDataGrid();
}

$(document).ready(function () {
  expiry.loadDataGrid();
  expiry.dropdown();
});