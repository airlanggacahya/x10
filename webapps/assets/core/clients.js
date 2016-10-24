var clients = {
    isProcessing: ko.observable(false),

    filterClientID: ko.observableArray([]),
    filterFishName : ko.observableArray([]),
    filterLastName : ko.observableArray([]),
    filterCompany: ko.observableArray([]),
    filterStatus : ko.observable(),
    formClients : ko.observable(true),
    filterFname: ko.observableArray([]),
    filterLname:ko.observableArray([]),
    currency: ko.observableArray([]),
    CommGroup: ko.observableArray([]),
    companyidlist: ko.observableArray([]),
    countrylist: ko.observableArray([]),
    Edit: ko.observable(false),
    groupid: ko.observableArray([]),
    basecurrency: ko.observableArray([]),
    loading: ko.observable(false),
    isclr: ko.observable(),
    ftrClient: ko.observableArray([]),
    ftrCompany: ko.observableArray([]),
    dataFname: ko.observableArray([]),
    dataLname: ko.observableArray([]),
    reset: ko.observable(false),
    TitelFilter : ko.observable(" Show Filter"),
    //variable
    Id : ko.observable(),
    Commission_groupid : ko.observable(),
    Companyid : ko.observable(),
    Status : ko.observable(),
    Titleid : ko.observable(),
    Fname : ko.observable(),
    Lname : ko.observable(),
    Phone : ko.observable(),
    TAX_PAN : ko.observable(),
    Mobile : ko.observable(),
    Email : ko.observable(),
    Program : ko.observable(),
    Dob : ko.observable(),
    Address1 : ko.observable(),
    Address2 : ko.observable(),
    City : ko.observable(),
    State : ko.observable(),
    Zip_postal_code : ko.observable(),
    Country : ko.observable(),
    Clients_groupid : ko.observable(),
    Base_currency : ko.observable(),
    Notes1 : ko.observable(),
    Notes2 : ko.observable(),
    Notes3 : ko.observable(),
    Date_created : ko.observable(),
    Date_updated : ko.observable(),
    Update_user : ko.observable(),
    Currency_code1 : ko.observable(),
    Pymt_or_rcpt1 : ko.observable(),
    Desc_note1 : ko.observable(),
    Currency_code2 : ko.observable(),
    Pymt_or_rcpt2 : ko.observable(),
    Desc_note2 : ko.observable(),
    Currency_code3 : ko.observable(),
    Pymt_or_rcpt3 : ko.observable(),
    Desc_note3 : ko.observable(),
    IsClearer: ko.observable(""),
    status: ko.observable(""),
    Edit : ko.observable(false),
    Title : ko.observableArray([]),
};

clients.dropdown = function(){
    clients.currency([]);
    clients.CommGroup([]);
    clients.companyidlist([]);
    clients.countrylist([]);
    $("#Dob").kendoDatePicker({
        format: "yyyy-MM-dd",
    }).data("kendoDatePicker");
    ajaxPost("/datamaster/getcurrency", {}, function(res){
        //console.log(res);
        for(var i=0; i< res.length; i++){
            clients.currency.push({
                title: res[i].currency_code,
                value: res[i].currency_code
            });
        }
        
    });
    ajaxPost("/datamaster/getcurrency", {}, function(res){
        //console.log(res);
        for(var i=0; i< res.length; i++){
            clients.basecurrency.push({
                title: res[i].currency_code,
                value: res[i]._id
            });
        }
        
    });
    ajaxPost("/datamaster/getcommissiongroup", {}, function(res){
        res.map(function(d){
            clients.CommGroup.push({
                title: d.name,
                value: d._id
            });
        })
    });

    ajaxPost("/datamaster/getcompany", {}, function(res){
        //console.log(res);
        res.map(function(d){
            clients.companyidlist.push({
                title: d.companyname,
                value: d._id
            });
        })
        
    });

    ajaxPost("/datamaster/gettitles", {}, function(res){
        //console.log(res);
        res.map(function(d){
            clients.Title.push({
                title: d.title,
                value: d._id
            });
        })
        
    });

    ajaxPost("/datamaster/getcountry", {}, function(res){
        //console.log(res);
        res.map(function(d){
            clients.countrylist.push({
                title: d.countriesname,
                value: d.countriesisocode3
            });
        })
        
    });
    ajaxPost("/datamaster/getgroupclient", {}, function(res){
        //console.log(res);
        res.map(function(d){
            clients.groupid.push({
                title: d.name,
                value: d._id
            });
        })
        
    });

     ajaxPost("/datamaster/getclient", {}, function(res){
        //console.log(res);
        res.map(function(d){
            clients.ftrClient.push({
                title: d._id,
                value: d._id
            });
        })
        
    });

    ajaxPost("/datamaster/getcompany", {}, function(res){
        //console.log(res);
        res.map(function(d){
            clients.ftrCompany.push({
                title: d.companyname,
                value: d._id
            });
        })
        
    });
   
    ajaxPost("/datamaster/getclientfirstname", {}, function(res){
        res.Data.map(function(d){
            clients.dataFname.push({
                title: d.FirstName,
                value: d.FirstName
            });
        })
    });

    ajaxPost("/datamaster/getclientlastname", {}, function(res){
        res.Data.map(function(d){
            clients.dataLname.push({
                title: d.LastName,
                value: d.LastName
            });
        })
    });
}

clients.onStatus = [
    {title: "active", value: "active"},
    {title: "inactive", value: "inactive"},
]

clients.backMenuMaster = function(){
    window.location.href = "/datamaster/default";
}

clients.searchData = function(){
    clients.getDataGridClients();
}

clients.resetData = function(){
    clients.reset(true);
    clients.filterClientID([]);
    clients.filterFname([]);
    clients.filterLname([]);
    clients.filterCompany([]);
    clients.getDataGridClients();
    $('#ftrstatus').bootstrapSwitch('state', true);
    clients.reset(false);
}

clients.filterClientID.subscribe(function(value){
    if(model.View() != "false" && clients.reset() == false){
        clients.reloadGrid();
    }
});

clients.filterFname.subscribe(function(value){
    if(model.View() != "false" && clients.reset() == false){
        clients.reloadGrid();
    }
});

clients.filterCompany.subscribe(function(value){
    if(model.View() != "false" && clients.reset() == false){
        clients.reloadGrid();
    }
});

clients.reloadGrid = function(){
    $("#MasterGridClients").data("kendoGrid").dataSource.read({
        IdArr : clients.filterClientID(),
        Fname : clients.filterFname(),
        Lname : clients.filterLname(),
        Companyid: clients.filterCompany(),
        Status: clients.filterStatus()
    })
}

clients.FilterStatus = function(){
  if(model.View() != "false"){
    $('#ftrstatus').on('switchChange.bootstrapSwitch', function(event, state) {
        if(state == false){
            clients.filterStatus("0");
        }else{
           clients.filterStatus("1");
        }
        if(clients.reset() == false){
            clients.reloadGrid();
        }
        
    });
  }
  
}

var userid = model.User();
clients.loading(true);
var gc = new GridColumn('role_master', userid, 'MasterGridClients');
clients.getDataGridClients = function(){
    var stts = $('#ftrstatus').bootstrapSwitch('state')
    if( stts == false){
        clients.filterStatus("0");
    }else{
        clients.filterStatus("1")
    }
    var param =  {
        IdArr : clients.filterClientID(),
        Fname : clients.filterFname(),
        Lname : clients.filterLname(),
        Companyid: clients.filterCompany(),
        Status: clients.filterStatus()
    };
    var dataSource = [];
    var url = "/masterclient/getdata";
    $("#MasterGridClients").html("");
    $("#MasterGridClients").kendoGrid({
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
                            gc.Init();
                            clients.loading(false);
                            if(data.isError == true){
                                clients.loading(false);
                            }
                            if (data.Data.Count == 0 || data.Data.Count == null) {
                                clients.loading(false);
                                return dataSource;
                            } else {
                                clients.loading(false);
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
                columnMenu: false,
                columnHide: function(e) {
                    gc.RemoveColumn(e.column.field);
                },
                columnShow: function(e) {
                    gc.AddColumn(e.column.field);
                },
            columns: [
                {
                    field:"Id",
                    title:"Clients ID",
                    width:120,
                    template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:clients.editAccount(\"#: Id #\")'>#: Id #</a>#}else{#<div>#: Id #</div>#}#"

                },
                {
                    field:"CompanyDesc",
                    title:"Company",         
                    width:200,
                    // locked: true,
                },
                {
                    // field:"Status",
                    title:"Status",
                    width:100,
                    // locked: true,
                    template: function(d){
                        if(d.Status == "0"){
                            return "inactive";
                        }else{
                            return "active";
                        }
                    }
                },
                {
                    field:"Fname",
                    title:"First Name",
                    width:200,
                    // locked: true,
                },
                {
                    field:"Lname",
                    title:"Last Name",
                    width:200,
                    // locked: true,
                },
                
               
                {
                    field:"Email",
                    title:"Email",
                    width:100
                },
                {
                    field:"Address2",
                    title:"Address 2",
                    width:250
                },
                {
                    field:"City",
                    title:"City",
                    width:100
                },
                {
                    field:"State",
                    title:"State",
                    width:100
                },
                {
                    field:"Zip_postal_code",
                    title:"Zip Postal Code",
                    width:100
                },
                {
                    field:"Country",
                    title:"Country",
                    width:100
                },
                {
                    field:"CommissionGroupDesc",
                    title:"Commission Group",
                    width:100,
                    attributes: {"class": "align-right"}
                },
                {
                    field:"ClientGroupDesc",
                    title:"Clients Groupid",
                    width:120,
                    attributes: {"class": "align-right"}
                },
                {
                    field:"BaseCurrencyDesc",
                    title:"Base Currency",
                    width:100,
                    attributes: {"class": "align-right"}
                },
                {
                    field:"Notes1",
                    title:"Notes 1",
                    width:100
                },
                {
                    field:"Notes2",
                    title:"Notes 2",
                    width:100
                },
                {
                    field:"Notes3",
                    title:"Notes 3",
                    width:100
                },
                {
                    field:"Currency_code1",
                    title:"Currency Code 1",
                    width:100
                },
                {
                    field:"Pymt_or_rcpt1",
                    title:"Pymt Or Rcpt 1",
                    width:100,
                    attributes: {"class": "align-right"}
                },
                {
                    field:"Desc_note1",
                    title:"Desc Note 1",
                    width:100
                },
                {
                    field:"Currency_code2",
                    title:"Currency Code2",
                    width:100
                },
                {
                    field:"Pymt_or_rcpt2",
                    title:"Pymt Or Rcpt 2",
                    width:100,
                    attributes: {"class": "align-right"}
                },
                {
                    field:"Desc_note2",
                    title:"Desc Note 2",
                    width:100
                },
                {
                    field:"Currency_code3",
                    title:"Currency Code 3",
                    width:100
                },
                {
                    field:"Pymt_or_rcpt3",
                    title:"Pymt Or Rcpt3",
                    width:100,
                    attributes: {"class": "align-right"}
                },
                {
                    field:"Desc_note3",
                    title:"Desc Note 3",
                    width:100
                },
                {
                    field:"IsClearer",
                    title:"IsClearer",
                    width:100
                }
            ]
    });
    
    $("#MasterGridClients").data('kendoGrid').bind('error', clients.gridError())
}

clients.gridError = function(){
    clients.loading(false);
}

clients.saveData = function(){
    var validator = $("#clientsForm").data("kendoValidator");
    //console.log(validator);
    if(validator ==undefined){
        validator = $("#clientsForm").kendoValidator().data("kendoValidator");
    }
    var clnumb = "";
    var onclearer = $('#clearer').bootstrapSwitch('state');
    if (onclearer == false){
        clients.IsClearer("0");
        clnumb = clients.Id();
    }else{
        clients.IsClearer("1");
        clnumb = clients.isclr()+" "+clients.Id();
    }

    var stts = $('#instatus').bootstrapSwitch('state');
    if (stts == false){
        clients.status("0");
    }else{
        clients.status("1");
    }
    var param = {
        Id: clnumb,
        Commissiongroupid: parseInt(clients.Commission_groupid()),
        Companyid: parseInt(clients.Companyid()),
        Status: clients.status(),
        Titleid: parseInt(clients.Titleid()),
        Fname: clients.Fname(),
        Lname: clients.Lname(),
        Phone: clients.Phone(),
        TAX_PAN: clients.TAX_PAN(),
        Mobile: clients.Mobile(),
        Email: clients.Email(),
        Dob: clients.Dob(),
        Address1: clients.Address1(),
        Address2: clients.Address2(),
        City: clients.City(),
        State: clients.State(),
        Zippostalcode: parseInt(clients.Zip_postal_code()),
        Country: clients.Country(),
        Clientsgroupid: parseInt(clients.Clients_groupid()),
        Basecurrency: parseInt(clients.Base_currency()),
        Notes1: clients.Notes1(),
        Notes2: clients.Notes2(),
        Notes3: clients.Notes3(),
        // Date_created: clients.Date_created(),
        // Date_updated: clients.Date_updated(),
        //Update_user: clients.Update_user(),
        Currencycode1: clients.Currency_code1(),
        Pymtorrcpt1: parseFloat(clients.Pymt_or_rcpt1()),
        Descnote1: clients.Desc_note1(),
        Currencycode2: clients.Currency_code2(),
        Pymtorrcpt2: parseFloat(clients.Pymt_or_rcpt2()),
        Descnote2: clients.Desc_note2(),
        Currencycode3: clients.Currency_code3(),
        Pymtorrcpt3: parseFloat(clients.Pymt_or_rcpt3()),
        Descnote3: clients.Desc_note3(),
        IsClearer: clients.IsClearer()
        
    }
    var url = "/masterclient/savedata";
    if(validator.validate()){
        ajaxPost(url, param, function(res){
            if(res.IsError != true){
                clients.cencelData();
                clients.getDataGridClients();
              swal("Success!", res.Message, "success");
            }else{
              return swal("Error!", res.Message, "error");
            }
        });
    }
}

clients.saveEdit = function(){
    var validator1 = $("#clientsForm").data("kendoValidator");
    //console.log(validator);
    if(validator1 ==undefined){
        validator1 = $("#clientsForm").kendoValidator().data("kendoValidator");
    }
    var onclearer = $('#clearer').bootstrapSwitch('state');
    if (onclearer == false){
        clients.IsClearer("0");
    }else{
        clients.IsClearer("1");
    }

    var stts = $('#instatus').bootstrapSwitch('state');
    if (stts == false){
        clients.status("0");
    }else{
        clients.status("1");
    }
    var param = {
        Id: clients.Id(),
        Commissiongroupid: parseInt(clients.Commission_groupid()),
        Companyid: parseInt(clients.Companyid()),
        Status: clients.status(),
        Titleid: parseInt(clients.Titleid()),
        Fname: clients.Fname(),
        Lname: clients.Lname(),
        Phone: clients.Phone(),
        TAX_PAN: clients.TAX_PAN(),
        Mobile: clients.Mobile(),
        Email: clients.Email(),
        Dob: clients.Dob(),
        Address1: clients.Address1(),
        Address2: clients.Address2(),
        City: clients.City(),
        State: clients.State(),
        Zippostalcode: parseInt(clients.Zip_postal_code()),
        Country: clients.Country(),
        Clientsgroupid: parseInt(clients.Clients_groupid()),
        Basecurrency: parseInt(clients.Base_currency()),
        Notes1: clients.Notes1(),
        Notes2: clients.Notes2(),
        Notes3: clients.Notes3(),
        // Date_created: clients.Date_created(),
        // Date_updated: clients.Date_updated(),
        //Update_user: clients.Update_user(),
        Currencycode1: clients.Currency_code1(),
        Pymtorrcpt1: parseFloat(clients.Pymt_or_rcpt1()),
        Descnote1: clients.Desc_note1(),
        Currencycode2: clients.Currency_code2(),
        Pymtorrcpt2: parseFloat(clients.Pymt_or_rcpt2()),
        Descnote2: clients.Desc_note2(),
        Currencycode3: clients.Currency_code3(),
        Pymtorrcpt3: parseFloat(clients.Pymt_or_rcpt3()),
        Descnote3: clients.Desc_note3(),
        IsClearer: clients.IsClearer()
    }
   
    if(validator1.validate()){
         var url = "/masterclient/savedata";
        ajaxPost(url, param, function(res){
            //var dataClients = res.Data.Records;
            //console.log(dataClients);
            // swal({
            //     title: "Data Saved !!",
            //     text: "Data Has Been Saved",
            //     type: "success",
            //     confirmButtonClass: "btn-success",
            //     closeOnConfirm: true
            // },function(isConfirm){
            //     if(isConfirm){
            //         clients.cencelData();
            //         clients.getDataGridClients();
            //     }
            // });
            if(res.IsError != true){
                clients.cencelData();
                clients.getDataGridClients();
              swal("Success!", res.Message, "success");
            }else{
              return swal("Error!", res.Message, "error");
            }
        });
    }
}

clients.addClient = function(){
    $("#tab2").removeClass("active");
    $("#tab1").addClass("active");
    $("#li2").removeClass("active");
    $("#li1").addClass("active");
    clients.Edit(false);
    clients.formClients(false);
    clients.Id("")
    clients.Commission_groupid("");
    clients.Companyid("");
    clients.Status("")
    clients.Titleid("");
    clients.Fname("");
    clients.Lname("");
    clients.Phone("");
    clients.TAX_PAN("");
    clients.Mobile("");
    clients.Email("");
    clients.Dob("");
    clients.Address1("");
    clients.Address2("");
    clients.City("");
    clients.State("");
    clients.Zip_postal_code(0);
    clients.Country("");
    clients.Clients_groupid("");
    clients.Base_currency("");
    clients.Notes1("");
    clients.Notes2("");
    clients.Notes3("");
    clients.Currency_code1("");
    clients.Pymt_or_rcpt1(0);
    clients.Desc_note1("");
    clients.Currency_code2("");
    clients.Pymt_or_rcpt2(0);
    clients.Desc_note2("");
    clients.Currency_code3("");
    clients.Pymt_or_rcpt3(0);
    $('#clearer').bootstrapSwitch('state', false);
    $('#clearer').on('switchChange.bootstrapSwitch', function(event, state) {
        if(state == false){
            clients.isclr("");
         
        }else{
     
            clients.isclr("CLR")
        }
    });
    $('#instatus').bootstrapSwitch('state', true);
    $('#instatus').on('switchChange.bootstrapSwitch', function(event, state) {
        if(state == false){
           clients.status("0");
         
        }else{
     
           clients.status("1");
        }
    });
}

clients.editAccount = function(userName){
    $("#tab2").removeClass("active");
    $("#tab1").addClass("active");
    $("#li2").removeClass("active");
    $("#li1").addClass("active");
    clients.Edit(true);
    clients.formClients(false);
    var d;
    var param = {
        "Id": userName,
    }
    var url = "/masterclient/getdata";
    ajaxPost(url, param, function(res){
        d = res.Data.Records[0];
        clients.Id(d.Id)
        clients.status(d.Status);
        clients.Commission_groupid(d.Commission_groupid);
        clients.Companyid(d.Companyid);
        clients.Status(d.Status)
        clients.Titleid(parseInt(d.Titleid));
        clients.Fname(d.Fname);
        clients.Lname(d.Lname);
        clients.Phone(d.Phone);
        clients.TAX_PAN(d.TAX_PAN);
        clients.Mobile(d.Mobile);
        clients.Email(d.Email);
        clients.Dob(d.Dob.substring(0, 10));
        clients.Address1(d.Address1);
        clients.Address2(d.Address2);
        clients.City(d.City);
        clients.State(d.State);
        clients.Zip_postal_code(parseInt(d.Zip_postal_code));
        clients.Country(d.Country);
        clients.Clients_groupid(d.Clients_groupid);
        clients.Base_currency(d.Base_currency);
        clients.Notes1(d.Notes1);
        clients.Notes2(d.Notes2);
        clients.Notes3(d.Notes3);
        clients.Currency_code1(d.Currency_code1);
        clients.Pymt_or_rcpt1(d.Pymt_or_rcpt1);
        clients.Desc_note1(d.Desc_note1);
        clients.Currency_code2(d.Currency_code2);
        clients.Pymt_or_rcpt2(d.Pymt_or_rcpt2);
        clients.Desc_note2(d.Desc_note2);
        clients.Currency_code3(d.Currency_code3);
        clients.Pymt_or_rcpt3(d.Pymt_or_rcpt3);
        clients.Desc_note3(d.Desc_note3);
        if(d.IsClearer == "0"){
            $('#clearer').bootstrapSwitch('state', false);
        }else{
            $('#clearer').bootstrapSwitch('state', true);
        }
        if(d.Status == "0"){
            $('#instatus').bootstrapSwitch('state', false);
        }else{
            $('#instatus').bootstrapSwitch('state', true);
        }
        
        $('#instatus').on('switchChange.bootstrapSwitch', function(event, state) {
            if(state == false){
               clients.status("0");
             
            }else{
         
               clients.status("1");
            }
        });

    });

    // var uplItem = $("#MasterGridClients").data("kendoGrid");
    // var d = uplItem.dataItem(uplItem.select());

    //clients.IsClearer()
}


clients.cencelData = function(){
    clients.formClients(true);
    clients.getDataGridClients();
    var validator = $("#clientsForm").kendoValidator().data("kendoValidator");
    validator.hideMessages();
    clients.resetData();
    clients.dropdown();
}

clients.toggleFilter = function(){
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
  clients.panel_relocated();
    var FilterTitle = clients.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        clients.TitelFilter(" Show Filter");
    }else{
        clients.TitelFilter(" Hide Filter");
    }
}

clients.panel_relocated = function(){
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
    clients.FilterStatus();
    clients.getDataGridClients();
    clients.dropdown();
});