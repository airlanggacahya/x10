var companies = {
	formCompany : ko.observable(true),
	Edit : ko.observable(true),
    loading : ko.observable(false),
    TitelFilter : ko.observable(" Hide Filter"),
	// variable field
	Id : ko.observable(""),
    companyName : ko.observable(""),
    accountCode : ko.observable(""),
    contactTitle : ko.observable(""),
    contactFirstName : ko.observable(""),
    contactLastName : ko.observable(""),
    phone : ko.observable(""),
    address1 : ko.observable(""),
    city : ko.observable(""),
    state : ko.observable(""),
    zip : ko.observable(""),
	country : ko.observable(""),
	//var Filter
    filterCompany : ko.observable(""),
    filterCountry : ko.observableArray([]),
    filterTitile : ko.observableArray([]),

    //var list
    listTitle : ko.observableArray([]),
    listContry : ko.observableArray([]),
};

companies.clearInput = function(){
    companies.Id("");
    companies.companyName("");
    companies.accountCode("");
    companies.contactTitle("");
    companies.contactFirstName("");
    companies.contactLastName("");
    companies.phone("");
    companies.address1("");
    companies.city("");
    companies.state("");
    companies.zip("");
    companies.country("");
}

companies.Search = function(){
	companies.getDataGridCompany();
}

companies.Reset = function(){
    companies.filterCompany("");
	companies.getDataGridCompany();
}

companies.AddCompany = function(){
	companies.formCompany(false);
	companies.Edit(false);
    companies.clearInput();
}

companies.cancelData = function(){
	companies.formCompany(true);
	companies.Edit(false);
    $("#companyName").siblings("span.k-tooltip-validation").hide(); 
    $("#accountCode").siblings("span.k-tooltip-validation").hide(); 
    $("#contactFirstName").siblings("span.k-tooltip-validation").hide(); 
    $("#contactLastName").siblings("span.k-tooltip-validation").hide(); 

    $("#phone").siblings("span.k-tooltip-validation").hide(); 
    $("#address1").siblings("span.k-tooltip-validation").hide(); 
    $("#city").siblings("span.k-tooltip-validation").hide(); 
    $("#state").siblings("span.k-tooltip-validation").hide(); 
    $("#zip").siblings("span.k-tooltip-validation").hide(); 
    $("#country").siblings("span.k-tooltip-validation").hide(); 
}

companies.EditCompany = function(idCompany){
	var param = {
	    "Id": parseInt(idCompany),
	}
	var url = "/mastercompany/getdata";

 	ajaxPost(url, param, function(res){
        var dataCompany = res.Data.Records[0];
        companies.formCompany(false);
        companies.Edit(true);
        companies.Id(dataCompany.Id);
        companies.companyName(dataCompany.Companyname);
        companies.accountCode(dataCompany.Acctcode);
        companies.contactTitle(dataCompany.Contacttitle);
        companies.contactFirstName(dataCompany.Contactfname);
        companies.contactLastName(dataCompany.Contactlname);
        companies.phone(dataCompany.Phone);
        companies.address1(dataCompany.Address1);
        companies.city(dataCompany.City);
        companies.state(dataCompany.State);
        companies.zip(dataCompany.Zippostalcode);
        companies.country(dataCompany.Country);

 	});
}

companies.saveData = function(){
	var param = {
        "Id" : -1,
        "Companyname": companies.companyName(), //string
        "Acctcode" : companies.accountCode(), // string
        "Contactfname" : companies.contactFirstName(), //string
        "Contactlname" : companies.contactLastName(), //string
        "Contacttitle" : parseInt(companies.contactTitle()), //int
        "Phone" : companies.phone(), //string
        "Address1" : companies.address1(), //string
        "City" : companies.city(), //string
        "State" : companies.state(), //string
        "Zippostalcode" : companies.zip(), //string
        "Country" : companies.country(), //string
	}
	var url = "/mastercompany/savedata";
	var validator = $("#AddCompany").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddCompany").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
	 		if(res.IsError != true){
                companies.formCompany(true);
                companies.Reset();
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 	});
    }
 	
}

companies.saveEdit = function(){
	var param = {
        "Id" : companies.Id(),
        "Companyname": companies.companyName(), //string
        "Acctcode" : companies.accountCode(), // string
        "Contactfname" : companies.contactFirstName(), //string
        "Contactlname" : companies.contactLastName(), //string
        "Contacttitle" : parseInt(companies.contactTitle()), //int
        "Phone" : companies.phone(), //string
        "Address1" : companies.address1(), //string
        "City" : companies.city(), //string
        "State" : companies.state(), //string
        "Zippostalcode" : companies.zip(), //string
        "Country" : companies.country(), //string
	}
	var url = "/mastercompany/savedata";
	var validator = $("#AddCompany").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AddCompany").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
            if(res.IsError != true){
                companies.formCompany(true);
                companies.Reset();
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 		
	 	});
    }
}

companies.search = function(data, event){
    if(model.View() != "false"){
        if(companies.filterCompany().length >= 3 || companies.filterCompany().length == 0 ){
           companies.getDataGridCompany();
        }
    }
}

var userid = model.User();
var gcCompany = new GridColumn('company_master', userid, 'MasterGridCompany');
companies.getDataGridCompany = function(){
    companies.loading(true);
    var param =  {
        "Companyname" : companies.filterCompany(),
    };
    var dataSource = [];
    var url = "/mastercompany/getdata";
    $("#MasterGridCompany").html("");
    $("#MasterGridCompany").kendoGrid({
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
                            gcCompany.Init();
                            companies.loading(false);
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
                    gcCompany.RemoveColumn(e.column.field);
                  },
                  columnShow: function(e) {
                    gcCompany.AddColumn(e.column.field);
                  },
            columns: [
                {
                    field:"Companyname",
                    title:"Company Name",
                    width:200,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:companies.EditCompany(\"#: Id #\")'>#: Companyname #</a>#}else{#<div>#: Companyname #</div>#}#"
                },
                {
                    field:"Acctcode",
                    title:"Account code",
                    width:130
                },
                {
                    field:"TitleDesc",
                    title:"Contact Title",
                    width:150
                },
                {
                    field:"Contactfname",
                    title:"Contact First Name",
                    width:170
                },{
                    field:"Contactlname",
                    title:"Contact Last Name",
                    width:170
                },{
                    field:"Phone",
                    title:"Phone",
                    width:150
                },{
                    field:"Group_name",
                    title:"Fax",
                    width:100
                },{
                    field:"Address1",
                    title:"Address",
                    width:200
                }
                ]
    });
}

companies.getTitle = function(){
    var param = {
    }
    var url = "/datamaster/gettitles";
    companies.listTitle([]);
    ajaxPost(url, param, function(res){
        var dataTitle = Enumerable.From(res).OrderBy("$.Titles").ToArray();
        for (var c in dataTitle){
            companies.listTitle.push({
                "text" : dataTitle[c].title,
                "value" : dataTitle[c]._id,
            });
        }

    });
}

companies.getCountry = function(){
    var param = {
    }
    var url = "/datamaster/getcountry";
    companies.listContry([]);
    ajaxPost(url, param, function(res){
        var dataCountry = Enumerable.From(res).OrderBy("$.countriesname").ToArray();
        for (var c in dataCountry){
            companies.listContry.push({
                "text" : dataCountry[c].countriesname,
                "value" : dataCountry[c].countriesisocode3,
            });
        }

    });
}

companies.toggleFilter = function(){
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
  companies.panel_relocated();
    var FilterTitle = companies.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        companies.TitelFilter(" Show Filter");
    }else{
        companies.TitelFilter(" Hide Filter");
    }

}

companies.panel_relocated = function(){
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
    companies.getTitle();
    companies.getCountry();
	companies.getDataGridCompany();
});