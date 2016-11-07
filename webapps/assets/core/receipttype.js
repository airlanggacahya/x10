var type = {

	ftrdesc : ko.observable(),
	ftrindes : ko.observable(),
    Edit: ko.observable(false),
    loading: ko.observable(false),
    TitelFilter: ko.observable(" Hide Filter"),
    Id: ko.observable(),
    Description: ko.observable(),
    IntDesc: ko.observable()

}

// type.AddData = function(){
// 	$("#rectype").modal('show');
// }

type.searchDescription = function(data, event){
  if(model.View() != "false"){
    if(type.ftrdesc().length >=3 == true || type.ftrdesc().length == 0){
      type.reloadGrid();
    }
  }
}

type.searchIntDescription = function(data, event){
  if(model.View() != "false"){
    if(type.ftrindes().length >=3 == true || type.ftrindes().length == 0){
      type.reloadGrid();
    }
  }
}

type.reloadGrid = function(){
    $('#ReceiptType').data('kendoGrid').dataSource.read({
        description: type.ftrdesc(),
        internaldesc: type.ftrindes()
    });
}

type.getLoadData = function(){
    type.loading(true);
	var param = {
		description: type.ftrdesc(),
		internaldesc: type.ftrindes()
	};
	var url = "/masterpaymentreceipt/getdata";
    var dataSource = [];
	$("#ReceiptType").html("");
    $("#ReceiptType").kendoGrid({
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
                            type.loading(false);
                            if (data.Data.Count == 0) {
                                return dataSource;
                            } else {
                                
                                return data.Data.Records;
                            }
                        },
                        total: "Data.Count",
                    },
                    pageSize: 15,
                    serverPaging: true, // enable server paging
                    serverSorting: true,
                },
                resizable: true,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                filterable: false,
                columnMenu: false,
            columns: [
                    // {
                    //     width: 15,
                    //     title: "",
                    //     template: function(d){
                    //         return "<center><input type='checkbox' id=\"d.Id\" data-bind='click:type.deleteData("+d.Id+")'/><center>"
                    //     }
                    // },
                    {
                        width: 125,
                        field: "Description",
                        title: "Description",
                        template: function(d){
                            if(model.Edit() != 'false'){
                                return "<a class='grid-select'  href='javascript:type.editData("+ d.Id +")'>"+d.Description+"</a>"
                            }else{
                                return "<div>"+ d.Description +"</div>"
                            }
                        }
         
                    },
                    {
                        width: 125,
                        field: "InternalDesc",
                        title: "Internal Description",
                        
                    },
                   

            ]
    });
}

// type.deleteData = function(d){
//     alert("lalalala");
// }

type.addData = function(){
    type.Edit(false)
    type.Description("");
    type.IntDesc("");
    $("#rectype").modal("show");
    $("#nav-dex").css('z-index', '0');
}

type.saveData = function(){
    $("#rectype").css('z-index', 'none');
    var validator = $("#Addpayment").data("kendoValidator");
    //console.log(validator);
    if(validator ==undefined){
        validator = $("#Addpayment").kendoValidator().data("kendoValidator");
    }
    var param = {
        Id: -1,
        Description: type.Description(),
        InternalDesc: type.IntDesc()
    }
    var url = "/masterpaymentreceipt/savedata";
    if(validator.validate()){
        ajaxPost(url, param, function(res){
            swal({
                title: "Data Saved !!",
                text: "Data Accounts Has Been Saved",
                type: "success",
                confirmButtonClass: "btn-success",
                confirmButtonText: "oke",
                closeOnConfirm: true
            },function(isConfirm){
                if(isConfirm){
                    //clients.cencelData();
                    $("#rectype").modal("hide");
                    $("#nav-dex").css('z-index', 'none');
                    type.getLoadData();
                }
            });
        });
    }
}

type.saveEdit = function(){
    $("#rectype").css('z-index', 'none');
    var validator = $("#Addpayment").data("kendoValidator");
    //console.log(validator);
    if(validator ==undefined){
        validator = $("#Addpayment").kendoValidator().data("kendoValidator");
    }
    var param = {
        Id:  type.Id(),
        Description: type.Description(),
        InternalDesc: type.IntDesc()
    }
    var url ="/masterpaymentreceipt/savedata";
    if(validator.validate()){
        ajaxPost(url, param, function(res){
            swal({
                title: "Data Saved !!",
                text: "Data Accounts Has Been Saved",
                type: "success",
                confirmButtonClass: "btn-success",
                confirmButtonText: "oke",
                closeOnConfirm: true
            },function(isConfirm){
                if(isConfirm){
                    //clients.cencelData();
                    $("#rectype").modal("hide");
                    $("#nav-dex").css('z-index', 'none');
                    type.getLoadData();
                }
            });
        });
    }
}

type.toggleFilter = function(){
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
  type.panel_relocated();
    var FilterTitle = type.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        type.TitelFilter(" Show Filter");
    }else{
        type.TitelFilter(" Hide Filter");
    }
}

type.panel_relocated = function(){
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




type.editData = function(d){
    type.Edit(true);
    console.log(d);
    var url  = "/masterpaymentreceipt/getdata";
    var param ={
        Id : d.toString(),
    }
    ajaxPost(url, param, function(res){
        //console.log(res);
        var data = res.Data.Records[0];
        console.log(data.Description)
        type.Id(data.Id);
        type.Description(data.Description);
        type.IntDesc(data.InternalDesc);
        $("#rectype").modal("show");
        $("#nav-dex").css('z-index', '0');
    });
}
 type.closeModal = function(){
    $("#rectype").modal('hide');
    $("#nav-dex").css('z-index', 'none');
 }

type.reset = function(){
    type.ftrdesc("");
    type.ftrindes("");
    type.getLoadData();
}

$(document).ready(function(){
	type.getLoadData();
});