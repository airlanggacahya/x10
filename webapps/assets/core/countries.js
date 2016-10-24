var countries = {
	formContries : ko.observable(true),
	Edit : ko.observable(true),
    loading : ko.observable(false),
    TitelFilter : ko.observable(" Hide Filter"),
	// variable field
	Id : ko.observable(""),
    Countriesname : ko.observable(""),
    Countriesisocode2 : ko.observable(""),
    Countriesisocode3 : ko.observable(""),
	Addressformatid : ko.observable(""),
    titleModal : ko.observable(""),
	//var Filter
    filterCountriesName : ko.observable(""),
    filterCountriesisocode3 : ko.observable(""),
};

countries.clearInput = function(){
    countries.Id("");
    countries.Countriesname("");
    countries.Countriesisocode2("");
    countries.Countriesisocode3("");
    countries.Addressformatid("");
}

countries.Search = function(){
	countries.getDataGridCountries();
}

countries.Reset = function(){
    countries.filterCountriesName("");
	countries.getDataGridCountries();
}

countries.AddContries = function(){
	countries.formContries(false);
	countries.Edit(false);
    countries.clearInput();
    countries.titleModal("New Countries");
    $("#mdlConfirm").modal("show");
    $("#mdlConfirm").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirm").modal({
        backdrop: 'static',
        keyboard: false
    });
}

countries.cancelData = function(){
	countries.formContries(true);
	countries.Edit(false);
    var validator = $("#AddCountries").kendoValidator().data("kendoValidator");
    validator.hideMessages();
    $("#nav-dex").css('z-index', 'none');
    $("#mdlConfirm").modal("hide");
}

countries.EditCountries = function(idCompany){
	var param = {
	    "Id": parseInt(idCompany),
	}
	var url = "/mastercountries/getdata";

 	ajaxPost(url, param, function(res){
        var dataContries = res.Data.Records[0];
        countries.formContries(false);
        countries.Edit(true);
        countries.Id(dataContries.Id);
        countries.Countriesname(dataContries.Countriesname);
        countries.Countriesisocode2(dataContries.Countriesisocode2);
        countries.Countriesisocode3(dataContries.Countriesisocode3);
        countries.Addressformatid(dataContries.Addressformatid);
        countries.titleModal("Update Countries");
        $("#mdlConfirm").modal("show");
 	});
}

countries.saveData = function(){
	var param = {
        "Id" : -1,
        "Countriesname": countries.Countriesname(), //string
        "Countriesisocode2" : countries.Countriesisocode2(), // string
        "Countriesisocode3" : countries.Countriesisocode3(), //string
        "Addressformatid" : parseInt(countries.Addressformatid()),
	}
	var url = "/mastercountries/savedata";
	var validator = $("#AddCountries").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddCountries").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
	 		if(res.IsError != true){
                countries.formContries(true);
                countries.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 	});
    }
}

countries.saveEdit = function(){
	var param = {
        "Id" : parseInt(countries.Id()),
        "Countriesname": countries.Countriesname(), //string
        "Countriesisocode2" : countries.Countriesisocode2(), // string
        "Countriesisocode3" : countries.Countriesisocode3(), //string
        "Addressformatid" : parseInt(countries.Addressformatid()),
	}
	var url = "/mastercountries/savedata";
	var validator = $("#AddCountries").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddCountries").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
            if(res.IsError != true){
                countries.formContries(true);
                countries.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 		
	 	});
    }
}

countries.search = function(data, event){
    if(model.View() != "false"){
        if(countries.filterCountriesName().length >= 3 || countries.filterCountriesName().length == 0 ){
           countries.getDataGridCountries();
        }
    }
}

var userid = model.User();
var gccutofftime = new GridColumn('role_cutofftime', userid, 'MasterGridCutOffTime');
var userid = model.User();
var gcCountry = new GridColumn('countries_master', userid, 'MasterGridCountries');
countries.getDataGridCountries = function(){
    countries.loading(true);
    var param =  {
        "Countriesname" : countries.filterCountriesName(),
        "Countriesisocode3" : countries.filterCountriesisocode3(),
    };
    var dataSource = [];
    var url = "/mastercountries/getdata";
    $("#MasterGridCountries").html("");
    $("#MasterGridCountries").kendoGrid({
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
                            gcCountry.Init();
                            countries.loading(false);
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
                columnHide: function(e) {
                    gcCountry.RemoveColumn(e.column.field);
                },
                columnShow: function(e) {
                    gcCountry.AddColumn(e.column.field);
                },
            columns: [
                {
                    field:"Countriesname",
                    title:"Countries Name",
                    // width:200,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:countries.EditCountries(\"#: Id #\")'>#: Countriesname #</a>#}else{#<div>#: Countriesname #</div>#}#"
                },{
                    field:"Countriesisocode2",
                    title:"Countries Code 2",
                    // width:130
                },{
                    field:"Countriesisocode3",
                    title:"Countries Code 3",
                    // width:150
                },{
                    field:"Addressformatid",
                    title:"Address Format",
                    // width:170
                }]
    });
}

countries.toggleFilter = function(){
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
  countries.panel_relocated();
    var FilterTitle = countries.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        countries.TitelFilter(" Show Filter");
    }else{
        countries.TitelFilter(" Hide Filter");
    }
  
}

countries.panel_relocated = function(){
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
	countries.getDataGridCountries();
});