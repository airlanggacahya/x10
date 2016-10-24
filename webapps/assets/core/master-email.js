var email = {
	Edit : ko.observable(true),
    loading : ko.observable(false),
    TitelFilter : ko.observable(" Hide Filter"),
	// variable field
	Id : ko.observable(),
    Email : ko.observable(""),
    FirstName : ko.observable(""),
	LastName : ko.observable(""),
    titleModal : ko.observable(""),
	//var Filter
	filterEmail : ko.observable(""),
    filterFirstName: ko.observable(""),
    filterLastName: ko.observable(""),
};

email.Search = function(){
	email.getDataGridEmail();
}

email.Reset = function(){
    email.Id("");
    email.filterEmail("");
    email.filterFirstName("");
	email.filterLastName("");
	email.getDataGridEmail();
}

email.AddEmail= function(){
	email.Edit(false);
	email.Id("");
    email.Email("");
    email.FirstName("");
    email.LastName("");
    email.titleModal("New Email");
    $("#mdlConfirm").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
        backdrop: 'static',
        keyboard: false
    });
    
}

email.cancelData = function(){
	email.Edit(false);
    $("#nav-dex").css('z-index', 'none');
    $("#Email").siblings("span.k-tooltip-validation").hide(); 
    $("#mdlConfirm").modal("hide");
}

email.EditformTitle = function(idTittle){
  	
	var param = {
	    "Id": parseInt(idTittle),
	}
	var url = "/masteremail/getdata";

 	ajaxPost(url, param, function(res){
        $("#nav-dex").css('z-index', '0');
        $("#mdlConfirm").modal({
            backdrop: 'static',
            keyboard: false
        });
        var dataTitle = res.Data.Records[0];
        email.Edit(true);
        email.Id(dataTitle.Id);
        email.Email(dataTitle.Email);
        email.FirstName(dataTitle.FirstName);
        email.LastName(dataTitle.LastName);
        email.titleModal("Update Email");
        $("#mdlConfirm").modal("show");
 	});
}

email.saveData = function(){
	var param = {
        "Id" : 0,
        "Email": email.Email(),
        "FirstName": email.FirstName(),
	    "LastName": email.LastName(),
	}
	var url = "/masteremail/savedata";
	var validator = $("#AddEmail").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddEmail").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
	 		if(res.IsError != true){
                email.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 	});
    }
 	
}

email.saveEdit = function(){
	var param = {
		"Id" : email.Id(),
        "Email": email.Email(),
        "FirstName": email.FirstName(),
        "LastName": email.LastName(),
	}
	var url = "/masteremail/savedata";
	var validator = $("#AddEmail").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddEmail").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
            if(res.IsError != true){
                email.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 		
	 	});
    }
}

email.getDataGridEmail = function(){
    email.loading(true);
    var param =  {
        "Email" : email.filterEmail(),
        "FirstName" : email.filterFirstName(),
        "LastName" : email.filterLastName(),
    };
    var dataSource = [];
    var url = "/masteremail/getdata";
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
                             email.loading(false);
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
                    field:"Email",
                    title:"Email",
                    width:100,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:email.EditformTitle(\"#: Id #\")'>#: Email #</a>#}else{#<div>#: Email #</div>#}#"

                },{
                    field:"FirstName",
                    title:"First Name",
                    width:100
                },{
                    field:"LastName",
                    title:"Last Name",
                    width:100
                }]
    });
}

email.toggleFilter = function(){
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
  email.panel_relocated();
    var FilterTitle = email.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        email.TitelFilter(" Show Filter");
    }else{
        email.TitelFilter(" Hide Filter");
    }

}

email.panel_relocated = function(){
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
	email.getDataGridEmail();
});