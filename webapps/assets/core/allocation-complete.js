var AllocationComplete = {
	Edit : ko.observable(true),
    loading : ko.observable(false),
    titleModal : ko.observable("Pending Allocation Complete"),
    TitelFilter : ko.observable(" Hide Filter"),
    //List 
    listClearer : ko.observableArray([]),
    lsitCurrency : ko.observableArray([]),
    listpaytype : ko.observableArray([]),
	// variable field
    Id : ko.observable(""),
	paymentDate : ko.observable(""),
    valueDate : ko.observable(""),
    paymentValue : ko.observable(""),
    currency : ko.observable(""),
    Ctrlaccount : ko.observable(""),
    paymentOrReceiptType : ko.observable(""),
    comments : ko.observable(""),
	//var Filter
    filterVendorName : ko.observable(""),
    filterInvoiceDate : ko.observable(""),
	filterInvoiceNumber : ko.observable(""),
};

AllocationComplete.Search = function(){
    AllocationComplete.getDataGridAllocationComplete();
}

AllocationComplete.Reset = function(){
	AllocationComplete.filterVendorName("");
	AllocationComplete.filterInvoiceDate("");
	AllocationComplete.filterInvoiceNumber("");
    AllocationComplete.getDataGridAllocationComplete();
}

AllocationComplete.Panding= function(IdAllcation, Status){
    if (Status == "Allocation Complete"){
        return swal("Error!", "Data Is Complete", "error");
    }

    var payload = {
        Id : IdAllcation
    };
    ajaxPost("/vendorpayments/getdata", payload, function (res) {
        InfoCompalte = res.Data.Records[0].Allocation[0];
        AllocationComplete.Id(IdAllcation);
        AllocationComplete.Edit(true);
        AllocationComplete.paymentDate(moment(new Date(InfoCompalte.PaymentDate)).format('YYYY-MM-DD'));
        AllocationComplete.valueDate(moment(new Date(InfoCompalte.ValueDate)).format('YYYY-MM-DD'))
        AllocationComplete.paymentValue(parseFloat(InfoCompalte.PaymentValue));
        AllocationComplete.currency(parseInt(InfoCompalte.Currency))
        // $("#currency").data("kendoDropDownList").text(InfoCompalte.CurrencyCode);

        $("#paymentDate").data("kendoDatePicker").enable();
        $("#valueDate").data("kendoDatePicker").enable();
        $("#currency").data("kendoDropDownList").enable();
        $("#paymentValue").data("kendoNumericTextBox").enable();
        $("#Ctrlaccount").data("kendoDropDownList").enable();
        $("#paymentOrReceiptType").data("kendoDropDownList").enable();
        document.getElementById("btnSave").disabled = false;
        document.getElementById("paymentDate").disabled = false;
        document.getElementById("valueDate").disabled = false;
        document.getElementById("comments").disabled = false;
        document.getElementById("btnSave").disabled = false;

        AllocationComplete.Edit(false);
        AllocationComplete.Id(IdAllcation);;
        AllocationComplete.Ctrlaccount("");
        AllocationComplete.paymentOrReceiptType("");
        AllocationComplete.comments("");
        AllocationComplete.titleModal("Pending Allocation Complete");
        $("#mdlConfirm").modal("show");
        $("#nav-dex").css('z-index', '0');
        $("#mdlConfirm").modal({
            backdrop: 'static',
            keyboard: false
        });
    });
}

AllocationComplete.Rejected = function(IdAllcation, Status){
    if (Status == "Allocation Complete"){
        return swal("Error!", "Data Can't Rejected", "error");
    }
    $("#paymentDate").data("kendoDatePicker").enable();
    $("#valueDate").data("kendoDatePicker").enable();
    $("#currency").data("kendoDropDownList").enable();
    $("#paymentValue").data("kendoNumericTextBox").enable();
    $("#Ctrlaccount").data("kendoDropDownList").enable();
    $("#paymentOrReceiptType").data("kendoDropDownList").enable();
    document.getElementById("btnSave").disabled = false;
    document.getElementById("paymentDate").disabled = false;
    document.getElementById("valueDate").disabled = false;
    document.getElementById("comments").disabled = false;
    document.getElementById("btnSave").disabled = false;

    AllocationComplete.Id(IdAllcation);
    AllocationComplete.Edit(true);
    AllocationComplete.paymentDate("");
    AllocationComplete.valueDate("");
    AllocationComplete.paymentValue("");
    AllocationComplete.currency("");
    AllocationComplete.currency("");
    AllocationComplete.Ctrlaccount("");
    AllocationComplete.paymentOrReceiptType("");
    AllocationComplete.comments("");
    AllocationComplete.titleModal("Rejected Allocation Complete");
    $("#mdlConfirmRejected").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlConfirmRejected").modal({
        backdrop: 'static',
        keyboard: false
    });
}

AllocationComplete.cancelData = function(){
	AllocationComplete.Edit(false);
    $("#titleName").siblings("span.k-tooltip-validation").hide(); 
    $("#nav-dex").css('z-index', 'none');
    $("#mdlConfirm").modal("hide");
}

AllocationComplete.cancelDataRejected  = function(){
    AllocationComplete.Edit(false);
    $("#titleName").siblings("span.k-tooltip-validation").hide(); 
    $("#nav-dex").css('z-index', 'none');
    $("#mdlConfirmRejected").modal("hide");
}


AllocationComplete.saveData = function(){
    var Status = "Allocation Complete";
    var Curr = $("#currency").data("kendoDropDownList").text();
    var Ctrlaccount = $("#Ctrlaccount").data("kendoDropDownList").text();
    var ReceiptTypeName = $("#paymentOrReceiptType").data("kendoDropDownList").text();
	var param = {
        "Id" : AllocationComplete.Id(),
        "PaymentDate": AllocationComplete.paymentDate(),
        "ValueDate": AllocationComplete.valueDate(),
        "PaymentValue": AllocationComplete.paymentValue().toString(),
        "Currency": Curr,
        "IdCurr" : AllocationComplete.currency(),
        "Clearer" : Ctrlaccount,
        "IdClearer" : AllocationComplete.Ctrlaccount(),
        "Comments": AllocationComplete.comments(),
        "ReceiptTypeId"  : AllocationComplete.paymentOrReceiptType(),
        "ReceiptTypeName" : ReceiptTypeName,
	    "Status": Status,
	}
	var url = "/vendorpayments/savedataallocationcomplate";
	var validator = $("#AllocationCompleteForm").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AllocationCompleteForm").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
    	ajaxPost(url, param, function(res){
	 		if(res.IsError != true){
                AllocationComplete.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirm").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
	 	});
    }	
}

AllocationComplete.saveEdit = function(){
    var Status = "Rejected";
    var param = {
        "Id" : AllocationComplete.Id(),
        "Comments": AllocationComplete.comments(),
        "Status": Status,
    }
    var url = "/vendorpayments/savedatarejectedallocation";
    var validator = $("#AllocationRejected").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AllocationRejected").kendoValidator().data("kendoValidator");
    }
    if (validator.validate()) {
        ajaxPost(url, param, function(res){
            if(res.IsError != true){
                AllocationComplete.Reset();
                $("#nav-dex").css('z-index', 'none');
                $("#mdlConfirmRejected").modal("hide");
                swal("Success!", res.Message, "success");
            }else{
                return swal("Error!", res.Message, "error");
            }
        });
    }   
}

AllocationComplete.getDataGridAllocationComplete = function(){
    AllocationComplete.loading(true);
    var param =  {
        "VendorName" : AllocationComplete.filterVendorName(),
        "InvoiceDate" : AllocationComplete.filterInvoiceDate(),
        "InvoiceNumber" : AllocationComplete.filterInvoiceNumber(),
        "Status" : ["Pending Allocation","Allocation Complete"],
    };
    var dataSource = [];
    var url = "/vendorpayments/getdata";
    $("#MasterGridAllocationComplete").html("");
    $("#MasterGridAllocationComplete").kendoGrid({
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
                             AllocationComplete.loading(false);
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
                    field: "VendorName",
                    title: "Vendor Name",
                },
                {
                    field: "InvoiceNumber",
                    title: "Invoice Number",
                },
                {
                    field: "InvoiceDate",
                    title: "Invoice Date",
                    template: "#= moment(InvoiceDate).format('YYYY-MM-DD') #",
                    attributes: {"class": "align-center"}
                },
                {
                    field: "BusinessPurpose",
                    title: "Business Purpose",
                },
                {
                    field: "PaymentsDetails",
                    title: "Invoice Number",
                },
                {
                    field: "BankDetails",
                    title: "Bank Details",
                },
                {
                    field: "Status",
                    title: "Status",
                    attributes: {"class": "Satus"},
                },
                {
                    title:"Approve",
                    width:100,
                    attributes: {"class": "align-center"},
                    template: function (d) {
                    if (model.Approve() == "true"){
                        if (d.Status != "Allocation Complete"){
                            return [
                                "<button class='btn btn-xs btn-success btn-text-success btn-start tooltipster' onclick='AllocationComplete.Panding(\"" + d.Id + "\", \"" + d.Status + "\")' title='Send To Pending Allocation Complete'><span class='fa fa fa-check'></span></button>",
                                "<button class='btn btn-xs btn-danger btn-text-danger btn-stop tooltipster' onclick='AllocationComplete.Rejected(\"" + d.Id + "\", \"" + d.Status + "\")' title='Send To Rejected'><span class='fa fa-reply'></span></button>",
                            ].join(" ");
                        }else{
                            return "<button class='btn btn-xs btn-info btn-text-danger btn-stop tooltipster' onclick='AllocationComplete.Detail(\"" + d.Id + "\", \"" + d.Status + "\")' title='Details'><span class='fa fa-eye'></span></button>";
                        }
                    }else{
                        if (d.Status != "Allocation Complete"){
                            return [
                                "<button class='btn btn-xs btn-danger btn-text-danger btn-stop tooltipster' onclick='AllocationComplete.Rejected(\"" + d.Id + "\", \"" + d.Status + "\")' title='Send To Rejected'><span class='fa fa-reply'></span></button>",
                            ].join(" ");
                        }else{
                            return "<button class='btn btn-xs btn-info btn-text-danger btn-stop tooltipster' onclick='AllocationComplete.Detail(\"" + d.Id + "\", \"" + d.Status + "\")' title='Details><span class='fa fa-eye'></span></button>";
                        }
                    }
                    },
                }
            ]
    });
}

AllocationComplete.Detail = function(IdComplate, status){

    var payload = {
        Id : IdComplate
    };
    ajaxPost("/vendorpayments/getdata", payload, function (res) {
        InfoCompalte = res.Data.Records[0].Complete[0];
        $("#paymentDate").data("kendoDatePicker").readonly();
        $("#valueDate").data("kendoDatePicker").readonly();
        $("#currency").data("kendoDropDownList").readonly();
        $("#paymentValue").data("kendoNumericTextBox").readonly();
        $("#Ctrlaccount").data("kendoDropDownList").readonly();
        $("#paymentOrReceiptType").data("kendoDropDownList").readonly();
        document.getElementById("btnSave").disabled = true;
        document.getElementById("paymentDate").disabled = true;
        document.getElementById("valueDate").disabled = true;
        document.getElementById("comments").disabled = true;
        document.getElementById("Ctrlaccount").disabled = true;

        AllocationComplete.Id(IdComplate);
        AllocationComplete.Edit(true);
        AllocationComplete.paymentDate(moment(new Date(InfoCompalte.PaymentDate)).format('YYYY-MM-DD'));
        AllocationComplete.valueDate(moment(new Date(InfoCompalte.ValueDate)).format('YYYY-MM-DD'))
        AllocationComplete.paymentValue(parseFloat(InfoCompalte.PaymentValue));
        AllocationComplete.currency(parseInt(InfoCompalte.Currency));
        // $("#currency").data("kendoDropDownList").text(InfoCompalte.CurrencyCode);
        $("#Ctrlaccount").data("kendoDropDownList").text(InfoCompalte.ClearerName);
        AllocationComplete.paymentOrReceiptType(InfoCompalte.ReceiptTypeId);
        AllocationComplete.comments(InfoCompalte.Comments);
        AllocationComplete.titleModal("Detail Allocation Complete");
        $("#mdlConfirm").modal("show");
        $("#nav-dex").css('z-index', '0');
        $("#mdlConfirm").modal({
            backdrop: 'static',
            keyboard: false
        });
    });
}

AllocationComplete.getClearer = function () {
  var payload = {};
  ajaxPost("/manualpaymentreceipt/getclearer", payload, function (res) {
    var sortPayType = Enumerable.From(res.Data).ToArray();
    for (var c in sortPayType) {
      AllocationComplete.listClearer.push({
        "text": sortPayType[c].ClearerName,
        "value": sortPayType[c].Id
      });
    }
  });
}

AllocationComplete.getCurrencyData = function(){
    var payload = {
    };
    AllocationComplete.lsitCurrency([]);
    ajaxPost("/masterfxrates/getcurrency",payload , function (res){
        for (var c in res){
            AllocationComplete.lsitCurrency.push({
                "text" :res[c].currency_code,
                "value" :res[c]._id,
            });
        }
    });
}

AllocationComplete.toggleFilter = function(){
  var panelFilter = $('.panel-filter');
  var panelContent = $('.panel-content');

  if (panelFilter.is(':visible')) {
    panelFilter.hide();
    panelContent.attr('class', 'col-md-12 col-sm-12 ez panel-content');
    $('.breakdown-filter').removeAttr('style');
  } else {
    panelFilter.show();
    panelContent.attr('class', 'col-md-9 col-sm-9 ez panel-content');
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
  AllocationComplete.panel_relocated();
    var FilterTitle = AllocationComplete.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        AllocationComplete.TitelFilter(" Show Filter");
    }else{
        AllocationComplete.TitelFilter(" Hide Filter");
    }
}

AllocationComplete.panel_relocated = function(){
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

AllocationComplete.getPaytype = function () {
  var payload = {};
  AllocationComplete.listpaytype([]);
  ajaxPost("/manualpaymentreceipt/getpaymentreceipttype", payload, function (res) {
    var sortPayType = Enumerable.From(res.Data).OrderBy("$.Description").ToArray();
    for (var c in sortPayType) {
      AllocationComplete.listpaytype.push({
        "text": sortPayType[c].Description + " - " + sortPayType[c].InternalDesc,
        "value": sortPayType[c].Id
      });
    }
  });
}

$(document).ready(function () { 
    $("#filterInvoiceDate").kendoDatePicker({
        format: 'yyyy-MM-dd',
        depth: 'year'
    });
    $("#paymentDate").kendoDatePicker({
        format: 'yyyy-MM-dd',
        depth: 'year'
    });
    $("#valueDate").kendoDatePicker({
        format: 'yyyy-MM-dd',
        depth: 'year'
    });

    var param = {};
    ajaxPost("/dashboard/getcurrentdate", param, function (res) {
        var d = new Date(res.Data.CurrentDate);
        var DefaultDate = new Date(res.Data.CurrentDate);
        var day = moment(d).format("ddd");
        if (day != "Mon"){
            DefaultDate.setDate(DefaultDate.getDate()-1);
        }else{
            DefaultDate.setDate(DefaultDate.getDate()-3);
        }
        AllocationComplete.filterInvoiceDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
        AllocationComplete.getClearer();
        AllocationComplete.getCurrencyData();
        AllocationComplete.getPaytype();
        AllocationComplete.getDataGridAllocationComplete();
    });

    
});