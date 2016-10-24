var Allocation = {
  Edit: ko.observable(true),
  loading: ko.observable(false),
  titleModal: ko.observable("Pending Allocation"),
  TitelFilter: ko.observable(" Hide Filter"),
  ExitingFile: ko.observableArray([]),
  //list
  lsitCurrency: ko.observableArray([]),
  TempFileName: ko.observableArray([]),
  // variable field
  Id: ko.observable(""),
  bankNameandAccount: ko.observable(""),
  paymentDate: ko.observable(""),
  valueDate: ko.observable(""),
  paymentValue: ko.observable(""),
  currency: ko.observable(""),
  attachBank: ko.observable(""),
  comments: ko.observable(""),
  //var Filter
  filterVendorName: ko.observable(""),
  filterInvoiceDate: ko.observable(""),
  filterInvoiceNumber: ko.observable(""),
};

Allocation.Search = function () {
  Allocation.getDataGridAllocation();
}

Allocation.Reset = function () {
  Allocation.filterVendorName("");
  Allocation.filterInvoiceDate(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
  Allocation.filterInvoiceNumber("");
  Allocation.getDataGridAllocation();
}

Allocation.Approved = function (IdPayment) {
  Allocation.Id(IdPayment);
  Allocation.Edit(false);
  Allocation.bankNameandAccount("");
  Allocation.paymentDate("");
  Allocation.valueDate("");
  Allocation.paymentValue("");
  Allocation.currency("");
  Allocation.attachBank("");
  Allocation.comments("");
  Allocation.TempFileName([]);
  $('#Tablefile').html("");
  $('#listIcon').html("");
  $('#uploadFile').val('');
  var validator = $("#AllocationForm").kendoValidator().data("kendoValidator");
  validator.hideMessages();
  Allocation.titleModal("Pending Allocation");
  $("#mdlConfirm").modal("show");
  $("#nav-dex").css('z-index', '0');
  $("#mdlConfirm").modal({
    backdrop: 'static',
    keyboard: false
  });
  var param = {
    Id: IdPayment
  }
  ajaxPost("/vendorpayments/getdata", param, function (res) {
    var data1 = res.Data.Records[0].Allocation[0];
    var data2 = res.Data.Records[0];
    var dataFile = [];
    if (data2.Status == "Approved") {
      Allocation.bankNameandAccount(data2.BankDetails);
      Allocation.paymentDate(moment(new Date(data2.InvoiceDate)).format("YYYY-MM-DD"));
      Allocation.valueDate(moment(new Date(data2.InvoiceDate)).format("YYYY-MM-DD"));
      Allocation.paymentValue(parseFloat(data2.InvoiceValue));
      Allocation.currency(data2.CurrencyId);
    }

  });
}

Allocation.Rejected = function (IdPayment) {
  Allocation.Id(IdPayment);
  Allocation.Edit(true);
  Allocation.bankNameandAccount("");
  Allocation.paymentDate("");
  Allocation.valueDate("");
  Allocation.paymentValue("");
  Allocation.currency("");
  Allocation.attachBank("");
  Allocation.comments("");
  Allocation.titleModal("Rejected Allocation");
  $("#mdlConfirmRejected").modal("show");
  $("#nav-dex").css('z-index', '0');
  $("#mdlConfirmRejected").modal({
    backdrop: 'static',
    keyboard: false
  });
}

Allocation.cancelData = function () {
  Allocation.Edit(false);
  $("#titleName").siblings("span.k-tooltip-validation").hide();
  $("#nav-dex").css('z-index', 'none');
  $("#mdlConfirm").modal("hide");
}

Allocation.cancelDataRejected = function () {
  Allocation.Edit(false);
  $("#nav-dex").css('z-index', 'none');
  $("#mdlConfirmRejected").modal("hide");
}

Allocation.saveData = function () {
  //var Curr = $("#currency").data("kendoDropDownList").text()
  var listFile = Allocation.TempFileName();
  var formData = new FormData();
  formData.append("Id", Allocation.Id());
  formData.append("BankAcountName", Allocation.bankNameandAccount());
  formData.append("PaymentDate", Allocation.paymentDate());
  formData.append("ValueDate", Allocation.valueDate());
  formData.append("PaymentValue", Allocation.paymentValue());
  //formData.append("Currency", Curr);
  formData.append("Currency", Allocation.currency());
  formData.append("Comments", Allocation.comments());
  formData.append("Status", "Pending Allocation");
  var j = 0;
  for (i = 0; i < $("#uploadFile")[0].files.length; i++) {
    for (var cek in listFile) {
      if (listFile[cek].name == $("#uploadFile")[0].files[i].name) {
        formData.append("UploadFile", $("#uploadFile")[0].files[j]);
        formData.append("Size" + j, $("#uploadFile")[0].files[j].size);
        j++;
      }
    }
  }
  var validator = $("#AllocationForm").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#AllocationForm").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    $.ajax({
      url: "/vendorpayments/savedataallocation",
      data: formData,
      contentType: false,
      dataType: "json",
      mimeType: 'multipart/form-data',
      processData: false,
      type: 'POST',
      beforeSend: function (jqXHR, settings) {
        Allocation.loading(true);
      },
      success: function (data) {
        Allocation.loading(false);
        if (data.IsError == false) {
          Allocation.Reset();
          $("#nav-dex").css('z-index', 'none');
          $("#mdlConfirm").modal("hide");
          swal("Success!", data.Message, "success");
        } else {
          return swal("Error!", data.Message, "error");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        swal("Error!", errorThrown, "error");
      }
    });
  }
}

Allocation.saveEdit = function () {
  var Status = "Rejected";
  var param = {
    "Id": Allocation.Id(),
    "Comments": Allocation.comments(),
    "Status": Status,
  }
  var url = "/vendorpayments/savedatarejectedallocation";
  var validator = $("#AllocationRejected").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#AllocationRejected").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        Allocation.Reset();
        $("#nav-dex").css('z-index', 'none');
        $("#mdlConfirmRejected").modal("hide");
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

Allocation.getDataGridAllocation = function () {
  Allocation.loading(true);
  var param = {
    "VendorName": Allocation.filterVendorName(),
    "InvoiceDate": Allocation.filterInvoiceDate(),
    "InvoiceNumber": Allocation.filterInvoiceNumber(),
    "Status": ["Approved", "Pending Allocation"],
  };
  var dataSource = [];
  var url = "/vendorpayments/getdata";
  $("#MasterGridAllocation").html("");
  $("#MasterGridAllocation").kendoGrid({
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
          Allocation.loading(false);
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
        attributes: {"class": "align-right"},
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
        field: "InvoiceValue",
        title: "Invoice Value",
        attributes: {"class": "align-right"},
      },
      {
        field: "PaymentsDetails",
        title: "Payment Details",
      },
      {
        field: "BankDetails",
        title: "Bank Details",
      },
      {
        field: "Status",
        title: "Status",
      },
      {
        field: "",
        title: "Approve Status",
        width: 100,
        template: function (d) {
          if (model.Approve() != "true") {
            if (d.Status == "Approved" || d.Status == "Pending Allocation") {
              return[
                "<button class='btn btn-sm btn-danger btn-text-danger btn-stop tooltipster' onclick='Allocation.Rejected(\"" + d.Id + "\")' title='Send To Rejected'><span class='fa fa-reply'></span></button>",
              ].join(" ");
            }
          } else {
            if (d.Status == "Approved") {
              return[
                "<button class='btn btn-sm btn-success btn-text-success btn-xs tooltipster' onclick='Allocation.Approved(\"" + d.Id + "\")' title='Send To Pending Allocation'><span class='fa fa fa-check'></span></button>",
                "<button class='btn btn-sm btn-danger btn-text-danger btn-xs tooltipster' onclick='Allocation.Rejected(\"" + d.Id + "\")' title='Send To Rejected'><span class='fa fa-reply'></span></button>",
              ].join(" ");
            }

            if (d.Status == "Pending Allocation") {
              return[
                "<button data-value='#:Id #' name='edit' type='button' class='btn btn-warning btn-xs tooltipster' title='Edit Pending Allocation' onclick='Allocation.EditPendingAllocation(\"" + d.Id + "\")'><i class='fa fa fa-pencil-square-o'></i></button>",
                "<button class='btn btn-sm btn-danger btn-text-danger btn-xs tooltipster' onclick='Allocation.Rejected(\"" + d.Id + "\")' title='Send To Rejected'><span class='fa fa-reply'></span></button>",
              ].join(" ");
            }
          }
        },
        attributes: {"class": "align-center"}
      }
    ]
  });
}

Allocation.EditPendingAllocation = function (value) {
  Allocation.Edit(false);
  Allocation.TempFileName([]);
  var dataFile = [];
  $('#listIcon').html("");
  $('#uploadFile').val('');
  var validator = $("#AllocationForm").kendoValidator().data("kendoValidator");
  validator.hideMessages();
  Allocation.titleModal("Edit Pending Allocation");
  $("#mdlConfirm").modal("show");
  $("#nav-dex").css('z-index', '0');
  $("#mdlConfirm").modal({
    backdrop: 'static',
    keyboard: false
  });
  // pay.Edit(true);
  var param = {
    Id: value
  }
  ajaxPost("/vendorpayments/getdata", param, function (res) {
    var data1 = res.Data.Records[0].Allocation[0];
    var data2 = res.Data.Records[0];
    //console.log(data);
    var dataFile = [];
    if (data2.Status != "Approved") {
      Allocation.Id(data2.Id);
      Allocation.bankNameandAccount(data1.BankAcountName);
      Allocation.paymentDate(moment(new Date(data1.PaymentDate)).format("YYYY-MM-DD"));
      Allocation.valueDate(moment(new Date(data1.ValueDate)).format("YYYY-MM-DD"));
      Allocation.paymentValue(parseFloat(data1.PaymentValue));
      Allocation.currency(data1.Currency);
      //Allocation.attachBank();
      Allocation.comments(data1.Comments);
      var BankConf = data1.BankConfirmation;
      for (var i in BankConf) {
        var fileName = BankConf[i].FileName;
        var fileType = fileName.split(/[\s.]+/);
        var Type = fileType[fileType.length - 1];

        dataFile.push({
          id: "keyFile-" + i + "-UP",
          docId: value,
          fileId: BankConf[i].FileId,
          fileNumb: BankConf[i].FileNumber,
          filePath: BankConf[i].FilePath,
          name: BankConf[i].FileName,
          size: BankConf[i].FileSize,
          type: Type,
          classCSS: Type
        });

      }
      Allocation.GenerateTable(dataFile);
      Allocation.ExitingFile(dataFile);
    }

  });

}

Allocation.getCurrencyData = function () {
  var payload = {
  };
  Allocation.lsitCurrency([]);
  ajaxPost("/masterfxrates/getcurrency", payload, function (res) {
    for (var c in res) {
      Allocation.lsitCurrency.push({
        "text": res[c].currency_code,
        "value": res[c]._id,
      });
    }
  });
}

Allocation.toggleFilter = function () {
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
    } catch (err) {
    }
  });

  $('.k-pivot').each(function (i, d) {
    $(d).data('kendoPivotGrid').refresh();
  });

  $('.k-chart').each(function (i, d) {
    $(d).data('kendoChart').redraw();
  });
  Allocation.panel_relocated();
  var FilterTitle = Allocation.TitelFilter();
  if (FilterTitle == " Hide Filter") {
    Allocation.TitelFilter(" Show Filter");
  } else {
    Allocation.TitelFilter(" Hide Filter");
  }
}

Allocation.panel_relocated = function () {
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

function handleFiles(input) {
  var dataFile = [];
  $('#listIcon').html("");
  if ($("#uploadFile")[0].files.length > 0) {
    var files = $("#uploadFile")[0].files;
    var typeExtension = ["jpg", "png", "doc", "pdf", "xls", "zip", "txt", "csv", "unknown"];
    var typeFile = "default";

    for (var i in files) {
      if (files[i].size != undefined) {
        var Filename = files[i].name;
        var extension = Filename.substring(Filename.lastIndexOf('.') + 1);
        var indexExtension = typeExtension.indexOf(extension);
        if (indexExtension > 0) {
          typeFile = extension;
        }

        dataFile.push({
          id: "keyFile" + i,
          name: files[i].name,
          size: files[i].size,
          type: extension,
          classCSS: typeFile
        });
      }
    }

    Allocation.TempFileName(dataFile);
    $('#listIcon').html("");
    $divListIcon = $('#listIcon');
    for (var dw in dataFile) {
      $Icon = $("<div class= 'col-md-6'><div class='file-wrapper' data-bind='value:" + dataFile[dw].id + "'>" +
              "<span class='file-icon " + dataFile[dw].classCSS + "-file'></span>" +
              "<h4 class='file-heading file-name-heading'> Name: " + dataFile[dw].name + "</h4>" +
              "<h4 class='file-heading file-size-heading'> Size: " + dataFile[dw].size + "</h4>" +
              "<span id='btnRemoveFile' class='remove-File fa fa-times' onclick = removeFile(\"" + dataFile[dw].id + "\")></span>" +
              "</div></div>");
      $Icon.appendTo($divListIcon);
    }
  }
}

function removeFile(e) {
  var listFile = Allocation.TempFileName();
  var dataFile = [];
  $('#listIcon').html("");
  $divListIcon = $('#listIcon');
  for (var dw in listFile) {
    if (listFile[dw].id != e) {
      $Icon = $("<div class= 'col-md-6'><div class='file-wrapper' data-bind='value:" + listFile[dw].id + "'>" +
              "<span class='file-icon " + listFile[dw].classCSS + "-file'></span>" +
              "<h4 class='file-heading file-name-heading'> Name: " + listFile[dw].name + "</h4>" +
              "<h4 class='file-heading file-size-heading'> Size: " + listFile[dw].size + "</h4>" +
              "<span id='btnRemoveFile' class='remove-File fa fa-times' onclick = removeFile(\"" + listFile[dw].id + "\")></span>" +
              "</div></div>");
      $Icon.appendTo($divListIcon);
      dataFile.push(listFile[dw]);
    }
  }
  Allocation.TempFileName([]);
  Allocation.TempFileName(dataFile);
}

Allocation.GenerateTable = function (dataFile) {
  $('#Tablefile').html("");
  $divTable = $('#Tablefile');
  $title = $('<h5 class="box-title"><span class=""><span class="glyphicon glyphicon-align-justify"></span>&nbsp;Existing File(s)</span></h5>');
  $title.appendTo($divTable);
  $table = $("<table class='table table-hover'></table");
  $table.appendTo($divTable);
  $thead = $("<thead><tr><th>File Name</th><th>Size</th><th>Delete</th></tr></thead>");
  $thead.appendTo($table);
  $tbody = $("<tbody></tbody>");
  $tbody.appendTo($table);
  for (var dw in dataFile) {
    $tr = $("<tr><td>" + dataFile[dw].name +
            "</td><td>" + dataFile[dw].size +
            "</td><td><button type='button' class='btn btn-xs btn-danger btn-flat' onclick = removeOldFile(\"" + dataFile[dw].id + "\",\"" + dataFile[dw].docId + "\",\"" + dataFile[dw].fileId + "\")><i class='fa fa-trash-o'></i></button></td></tr>");
    $tr.appendTo($tbody);
  }
}

function removeOldFile(Id, docId, fileId) {
  var param = {
    DocId: docId,
    FileId: fileId,
  }

  swal({
    title: "Are you sure?",
    text: "Are you sure remove this file?\nthis action cannot be undone!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Yes',
    cancelButtonText: "No!",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    if (isConfirm) {
      ajaxPost("/vendorpayments/deletedocumentallocationfile", param, function (res) {
        if (!res.isError) {
          var dataFile = [];
          var fileEdit = Allocation.ExitingFile();
          for (var f in fileEdit) {
            var idUpdate = fileEdit[f].id.split("-")[1];
            var fileName = fileEdit[f].name;
            var fileType = fileName.split(/[\s.]+/);
            var Type = fileType[fileType.length - 1];
            if (fileEdit[f].id != Id) {
              dataFile.push({
                id: fileEdit[f].id,
                docId: fileEdit[f].docId,
                fileId: fileEdit[f].fileId,
                name: fileEdit[f].name,
                size: fileEdit[f].size,
                type: Type,
                classCSS: Type
              });
            }
          }
          Allocation.ExitingFile(dataFile);
          Allocation.GenerateTable(dataFile);
          swal("Success!", "File removed successfully.", "success");
        } else {
          swal("Error!", "Error while removing file.", "error");
        }
      });
    } else {
      swal("Error!", "Cancel removing file.", "error");
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
  $("#paymentValue").kendoNumericTextBox({
    format: "n0",
    decimals: 7
  });

  var param = {};
  ajaxPost("/dashboard/getcurrentdate", param, function (res) {
    var d = new Date(res.Data.CurrentDate);
    var DefaultDate = new Date(res.Data.CurrentDate);
    var day = moment(d).format("ddd");
    if (day != "Mon") {
      DefaultDate.setDate(DefaultDate.getDate() - 1);
    } else {
      DefaultDate.setDate(DefaultDate.getDate() - 3);
    }
    Allocation.filterInvoiceDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
    Allocation.getCurrencyData();
    Allocation.getDataGridAllocation();
  });


});