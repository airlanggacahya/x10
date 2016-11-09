var pay = {
  TitelFilter: ko.observable(' Hide Filter'),
  Edit: ko.observable(false),
  loading: ko.observable(false),
  TempFileName: ko.observableArray([]),
  lsitCurrency: ko.observableArray([]),
  paymentsType: ko.observableArray([
    {"text": "Cash", "value": "Cash"},
    {"text": "Cheque", "value": "Cheque"},
    {"text": "Check", "value": "Check"},
    {"text": "Electronic Transfer", "value": "Electronic Transfer"},
  ]),
  // Filter
  filterVendorName: ko.observable(),
  filterInvoiceDate: ko.observable(),
  filterInvoiceNumber: ko.observable(),
  Id: ko.observable(""),
  VendorName: ko.observable(''),
  InvoiceDate: ko.observable(''),
  AttachInvoice: ko.observable(''),
  BusinessPurpose: ko.observable(''),
  PaymentsDetails: ko.observable(''),
  BankDetails: ko.observable(''),
  InvoiceValue: ko.observable(''),
  InvoiceNumber: ko.observable(''),
  Comments: ko.observable(''),
  Status: ko.observable(''),
  Currency: ko.observable(''),
  ExitingFile: ko.observableArray([]),
}

pay.dropdown = function () {
  var payload = {
  };
  pay.lsitCurrency([]);
  ajaxPost("/masterfxrates/getcurrency", payload, function (res) {
    for (var c in res) {
      pay.lsitCurrency.push({
        "text": res[c].currency_code,
        "value": res[c]._id,
      });
    }
  });
}

pay.saveData = function () {
  var validator = $("#formpay").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#formpay").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    var listFile = pay.TempFileName();
    if (listFile.length == 0) {
      return swal("Confirmation!", "Please choose file to be uploaded.", "error");
    }
    var formpay = new FormData();
    formpay.append("Id", pay.Id());
    formpay.append("VendorName", pay.VendorName());
    formpay.append("InvoiceDate", moment(new Date(pay.InvoiceDate())).format("YYYY-MM-DD"));
    formpay.append("InvoiceNumber", pay.InvoiceNumber());
    formpay.append("InvoiceValue", pay.InvoiceValue());
    formpay.append("Currency", pay.Currency());
    formpay.append("BusinessPurpose", pay.BusinessPurpose());
    formpay.append("BankDetails", pay.BankDetails());
    formpay.append("PaymentsDetails", pay.PaymentsDetails());
    formpay.append("Comments", pay.Comments());
    formpay.append("Status", pay.Status());
    if ($("#uploadFile")[0].files.length > 0) {
      var listFile = pay.TempFileName();

      var j = 0;
      for (var i = 0; i < $("#uploadFile")[0].files.length; i++) {
        for (var cek in listFile) {
          if (listFile[cek].name == $("#uploadFile")[0].files[i].name) {
            formpay.append("UploadFile", $("#uploadFile")[0].files[j]);
            formpay.append("Size" + j, $("#uploadFile")[0].files[j].size);
            j++;
          }
        }
      }
    }
    $.ajax({
      url: "/vendorpayments/savepayments",
      data: formpay,
      contentType: false,
      dataType: "json",
      mimeType: "multipart/form-data",
      processData: false,
      type: 'POST',
      beforeSend: function (jqXHR, settings) {
        pay.loading(true);
      },
      success: function (data) {
        pay.loading(false);
        if (!data.isError) {
          pay.resetFilter();
          $("#payModal").modal("hide");
          $("#nav-dex").css('z-index', 'none');
          swal("Success!", "File uploaded successfully.", "success");
          pay.reloadGrid();

        } else {
          swal("Error!", "File uploaded successfully.", "error");
        }
      }
    });

  }
}

pay.saveEdit = function () {
  var validator = $("#formpay").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#formpay").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    // var listFile = pay.TempFileName();
    // if (listFile.length == 0) {
    //   return swal("Confirmation!", "Please choose file to be uploaded.", "error");
    // }
    var formpay = new FormData();
    formpay.append("Id", pay.Id());
    formpay.append("VendorName", pay.VendorName());
    formpay.append("InvoiceDate", moment(new Date(pay.InvoiceDate())).format("YYYY-MM-DD"));
    formpay.append("InvoiceNumber", pay.InvoiceNumber());
    formpay.append("InvoiceValue", pay.InvoiceValue());
    formpay.append("Currency", pay.Currency());
    formpay.append("BusinessPurpose", pay.BusinessPurpose());
    formpay.append("BankDetails", pay.BankDetails());
    formpay.append("PaymentsDetails", pay.PaymentsDetails());
    formpay.append("Comments", pay.Comments());
    formpay.append("Status", pay.Status());
    if ($("#uploadFile")[0].files.length > 0) {
      var listFile = pay.TempFileName();

      var j = 0;
      for (var i = 0; i < $("#uploadFile")[0].files.length; i++) {
        for (var cek in listFile) {
          if (listFile[cek].name == $("#uploadFile")[0].files[i].name) {
            formpay.append("UploadFile", $("#uploadFile")[0].files[j]);
            formpay.append("Size" + j, $("#uploadFile")[0].files[j].size);
            j++;
          }
        }
      }
    }
    $.ajax({
      url: "/vendorpayments/savepayments",
      data: formpay,
      contentType: false,
      dataType: "json",
      mimeType: "multipart/form-data",
      processData: false,
      type: 'POST',
      beforeSend: function (jqXHR, settings) {
        pay.loading(true);
      },
      success: function (data) {
        pay.loading(false);
        if (!data.isError) {
          pay.resetFilter();
          $("#payModal").modal("hide");
          $("#nav-dex").css('z-index', 'none');
          swal("Success!", "File uploaded successfully.", "success");
          pay.reloadGrid();

        } else {
          swal("Error!", "File uploaded successfully.", "error");
        }
      }
    });

  }
}

pay.saveDataandNew = function () {
  var validator = $("#formpay").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#formpay").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    var listFile = pay.TempFileName();
    if (listFile.length == 0) {
      return swal("Confirmation!", "Please choose file to be uploaded.", "error");
    }
    var formpay = new FormData();
    formpay.append("VendorName", pay.VendorName());
    formpay.append("InvoiceDate", moment(new Date(pay.InvoiceDate())).format("YYYY-MM-DD"));
    formpay.append("InvoiceNumber", pay.InvoiceNumber());
    formpay.append("InvoiceValue", pay.InvoiceValue());
    formpay.append("Currency", pay.Currency());
    formpay.append("BusinessPurpose", pay.BusinessPurpose());
    formpay.append("BankDetails", pay.BankDetails());
    formpay.append("PaymentsDetails", pay.PaymentsDetails());
    formpay.append("Comments", pay.Comments());
    formpay.append("Status", pay.Status());
    if ($("#uploadFile")[0].files.length > 0) {
      var listFile = pay.TempFileName();

      var j = 0;
      for (var i = 0; i < $("#uploadFile")[0].files.length; i++) {
        for (var cek in listFile) {
          if (listFile[cek].name == $("#uploadFile")[0].files[i].name) {
            formpay.append("UploadFile", $("#uploadFile")[0].files[j]);
            formpay.append("Size" + j, $("#uploadFile")[0].files[j].size);
            j++;
          }
        }
      }
    }
    $.ajax({
      url: "/vendorpayments/savepayments",
      data: formpay,
      contentType: false,
      dataType: "json",
      mimeType: "multipart/form-data",
      processData: false,
      type: 'POST',
      beforeSend: function (jqXHR, settings) {
        pay.loading(true);
      },
      success: function (data) {
        pay.loading(false);
        if (!data.isError) {
          pay.resetFilter();
          pay.resetForm();
          swal("Success!", "File uploaded successfully.", "success");
          pay.reloadGrid();

        } else {
          swal("Error!", "File uploaded successfully.", "error");
        }
      }
    });

  }
}

pay.saveEditandNew = function () {
  var validator = $("#formpay").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#formpay").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    // var listFile = pay.TempFileName();
    // if (listFile.length == 0) {
    //   return swal("Confirmation!", "Please choose file to be uploaded.", "error");
    // }
    var formpay = new FormData();
    formpay.append("Id", pay.Id());
    formpay.append("VendorName", pay.VendorName());
    formpay.append("InvoiceDate", moment(new Date(pay.InvoiceDate())).format("YYYY-MM-DD"));
    formpay.append("InvoiceNumber", pay.InvoiceNumber());
    formpay.append("InvoiceValue", pay.InvoiceValue());
    formpay.append("Currency", pay.Currency());
    formpay.append("BusinessPurpose", pay.BusinessPurpose());
    formpay.append("BankDetails", pay.BankDetails());
    formpay.append("PaymentsDetails", pay.PaymentsDetails());
    formpay.append("Comments", pay.Comments());
    formpay.append("Status", pay.Status());
    if ($("#uploadFile")[0].files.length > 0) {
      var listFile = pay.TempFileName();

      var j = 0;
      for (var i = 0; i < $("#uploadFile")[0].files.length; i++) {
        for (var cek in listFile) {
          if (listFile[cek].name == $("#uploadFile")[0].files[i].name) {
            formpay.append("UploadFile", $("#uploadFile")[0].files[j]);
            formpay.append("Size" + j, $("#uploadFile")[0].files[j].size);
            j++;
          }
        }
      }
    }
    $.ajax({
      url: "/vendorpayments/savepayments",
      data: formpay,
      contentType: false,
      dataType: "json",
      mimeType: "multipart/form-data",
      processData: false,
      type: 'POST',
      beforeSend: function (jqXHR, settings) {
        pay.loading(true);
      },
      success: function (data) {
        pay.loading(false);
        if (!data.isError) {
          pay.resetFilter();
          pay.resetForm();
          swal("Success!", "File uploaded successfully.", "success");
          pay.reloadGrid();

        } else {
          swal("Error!", "File uploaded successfully.", "error");
        }
      }
    });

  }
}

pay.saveDataandDuplicate = function () {
  var validator = $("#formpay").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#formpay").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    var listFile = pay.TempFileName();
    if (listFile.length == 0) {
      return swal("Confirmation!", "Please choose file to be uploaded.", "error");
    }
    var formpay = new FormData();
    formpay.append("VendorName", pay.VendorName());
    formpay.append("InvoiceDate", moment(new Date(pay.InvoiceDate())).format("YYYY-MM-DD"));
    formpay.append("InvoiceNumber", pay.InvoiceNumber());
    formpay.append("InvoiceValue", pay.InvoiceValue());
    formpay.append("Currency", pay.Currency());
    formpay.append("BusinessPurpose", pay.BusinessPurpose());
    formpay.append("BankDetails", pay.BankDetails());
    formpay.append("PaymentsDetails", pay.PaymentsDetails());
    formpay.append("Comments", pay.Comments());
    formpay.append("Status", pay.Status());
    if ($("#uploadFile")[0].files.length > 0) {
      var listFile = pay.TempFileName();

      var j = 0;
      for (var i = 0; i < $("#uploadFile")[0].files.length; i++) {
        for (var cek in listFile) {
          if (listFile[cek].name == $("#uploadFile")[0].files[i].name) {
            formpay.append("UploadFile", $("#uploadFile")[0].files[j]);
            formpay.append("Size" + j, $("#uploadFile")[0].files[j].size);
            j++;
          }
        }
      }
    }
    $.ajax({
      url: "/vendorpayments/savepayments",
      data: formpay,
      contentType: false,
      dataType: "json",
      mimeType: "multipart/form-data",
      processData: false,
      type: 'POST',
      beforeSend: function (jqXHR, settings) {
        pay.loading(true);
      },
      success: function (data) {
        pay.loading(false);
        if (!data.isError) {
          swal("Success!", "File uploaded successfully.", "success");
          pay.reloadGrid();

        } else {
          swal("Error!", "File uploaded successfully.", "error");
        }
      }
    });

  }
}

pay.saveEditandDuplicate = function () {
  var validator = $("#formpay").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#formpay").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    // var listFile = pay.TempFileName();
    // if (listFile.length == 0) {
    //   return swal("Confirmation!", "Please choose file to be uploaded.", "error");
    // }
    var formpay = new FormData();
    formpay.append("Id", pay.Id());
    formpay.append("VendorName", pay.VendorName());
    formpay.append("InvoiceDate", moment(new Date(pay.InvoiceDate())).format("YYYY-MM-DD"));
    formpay.append("InvoiceNumber", pay.InvoiceNumber());
    formpay.append("InvoiceValue", pay.InvoiceValue());
    formpay.append("Currency", pay.Currency());
    formpay.append("BusinessPurpose", pay.BusinessPurpose());
    formpay.append("BankDetails", pay.BankDetails());
    formpay.append("PaymentsDetails", pay.PaymentsDetails());
    formpay.append("Comments", pay.Comments());
    formpay.append("Status", pay.Status());
    if ($("#uploadFile")[0].files.length > 0) {
      var listFile = pay.TempFileName();

      var j = 0;
      for (var i = 0; i < $("#uploadFile")[0].files.length; i++) {
        for (var cek in listFile) {
          if (listFile[cek].name == $("#uploadFile")[0].files[i].name) {
            formpay.append("UploadFile", $("#uploadFile")[0].files[j]);
            formpay.append("Size" + j, $("#uploadFile")[0].files[j].size);
            j++;
          }
        }
      }
    }
    $.ajax({
      url: "/vendorpayments/savepayments",
      data: formpay,
      contentType: false,
      dataType: "json",
      mimeType: "multipart/form-data",
      processData: false,
      type: 'POST',
      beforeSend: function (jqXHR, settings) {
        pay.loading(true);
      },
      success: function (data) {
        pay.loading(false);
        if (!data.isError) {
          swal("Success!", "File uploaded successfully.", "success");
          pay.reloadGrid();

        } else {
          swal("Error!", "File uploaded successfully.", "error");
        }
      }
    });

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
          id: "keyFile-" + i + "-AD",
          name: files[i].name,
          size: files[i].size,
          type: extension,
          classCSS: typeFile
        });
      }
    }

    pay.TempFileName(dataFile);
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
  var listFile = pay.TempFileName();
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
  pay.TempFileName([]);
  pay.TempFileName(dataFile);
}

pay.reloadGrid = function () {
  $("#PaymentsGrid").data("kendoGrid").dataSource.read();
  $("#PaymentsGrid").data("kendoGrid").refresh();
}

pay.loadDataPayments = function () {
  pay.loading(true)
  var param = {
    "VendorName": pay.filterVendorName(),
    "InvoiceDate": moment(new Date(pay.filterInvoiceDate())).format("YYYY-MM-DD"),
    "InvoiceNumber": pay.filterInvoiceNumber(),
//    "Status": ["Rejected", "Approved", "Pending Payment"],
  };

  var dataSource = [];
  var url = "/vendorpayments/getdata";
  $("#PaymentsGrid").html("");
  $("#PaymentsGrid").kendoGrid({
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
          pay.loading(false);
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
        title: "InvoiceDate",
        template: "#= moment(InvoiceDate).format('YYYY-MM-DD') #",
        attributes: {"class": "align-center"}
      },
      {
        field: "InvoiceValue",
        title: "Invoice Value",
        attributes: {"class": "align-right"}
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
      },
      {
        title: "Action",
        width: 100,
        template: function (d) {
          if (model.Approve() != "true") {
            if (d.Status == "Pending Payment" || d.Status == "Rejected") {
              return[
                "<button data-value='#:Id #' name='edit' type='button' class='btn btn-success btn-xs tooltipster' title='Edit Payments' onclick='pay.EditPayment(\"" + d.Id + "\")'><i class='fa fa fa-pencil-square-o '></i></button>",
                "<button data-value='#:Id #' name='edit' type='button' class='btn btn-warning btn-xs tooltipster' title='Delete Payments' onclick='pay.DeletePayment(\"" + d.Id + "\")'><i class='fa fa-trash-o'></i></button>"
              ].join(" ");
            } else {
              return ""
            }
          } else {
            if (d.Status == "Pending Payment" || d.Status == "Rejected") {
              return[
                "<button data-value='#:Id #' name='edit' type='button' class='btn btn-info btn-xs tooltipster tooltipstered' title='Edit Payments' onclick='pay.EditPayment(\"" + d.Id + "\")'><i class='fa fa fa-pencil-square-o '></i></button>",
                "<button data-value='#:Id #' name='edit' type='button' class='btn btn-success btn-xs tooltipster' title='Approved Payments' onclick='pay.Approved(\"" + d.Id + "\")'><i class='fa fa fa-check '></i></button>",
                "<button data-value='#:Id #' name='edit' type='button' class='btn btn-warning btn-xs tooltipster' title='Delete Payments' onclick='pay.DeletePayment(\"" + d.Id + "\")'><i class='fa fa-trash-o'></i></button>"
              ].join(" ");
            } else {
              return ""
            }
          }
        },
        attributes: {"class": "align-center"}
      }
    ]
  });
}

pay.EditPayment = function (value) {
  pay.Edit(true);
  var param = {
    Id: value
  }
  ajaxPost("/vendorpayments/getdata", param, function (res) {
    pay.TempFileName([]);
    var dataFile = [];
    $('#listIcon').html("");
    $('#uploadFile').val('');
    var validator = $("#formpayment").kendoValidator().data("kendoValidator");
    validator.hideMessages();
    var data = res.Data.Records[0];
    var AttachInvoiceFile = data.AttachInvoice;
    console.log(data);
    pay.Id(data.Id);
    pay.VendorName(data.VendorName);
    pay.InvoiceDate(moment(new Date(data.InvoiceDate)).format("YYYY-MM-DD"));
    pay.InvoiceNumber(data.InvoiceNumber);
    pay.InvoiceValue(parseFloat(data.InvoiceValue));
    pay.Currency(data.CurrencyId);
    pay.BusinessPurpose(data.BusinessPurpose);
    pay.BankDetails(data.BankDetails);
    pay.PaymentsDetails(data.PaymentsDetails);
    pay.Comments(data.Comments);
    pay.Status(data.Status);
    for (var i in AttachInvoiceFile) {
      var fileName = AttachInvoiceFile[i].FileName;
      var fileType = fileName.split(/[\s.]+/);
      var Type = fileType[fileType.length - 1];

      dataFile.push({
        id: "keyFile-" + i + "-UP",
        docId: value,
        fileId: AttachInvoiceFile[i].FileId,
        name: AttachInvoiceFile[i].FileName,
        size: AttachInvoiceFile[i].FileSize,
        type: Type,
        classCSS: Type
      });
    }
    pay.ExitingFile(dataFile);
    pay.GenerateTable(dataFile);
    $("#payModal").modal({
      show: true,
      backdrop: 'static',
      keyboard: false
    });

    $("#nav-dex").css('z-index', '0');
  });
}

pay.DeletePayment = function (value) {
  var param = {
    Id: value,
    Status: "Approved"
  }
  ajaxPost("/vendorpayments/delete", param, function (res) {
    if (!res.isError) {
      swal("Success!", "File Delete successfully.", "success");
    } else {
      swal("Error!", "File Delete Error.", "error");
    }
  });
}
pay.Approved = function (value) {
  swal({
    title: "Are you sure?",
    text: "Are you sure Approve this Data?",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Yes',
    cancelButtonText: "No",
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    if (isConfirm) {
      var param = {
        Id: value,
        Status: "Approved"
      };
      ajaxPost("/vendorpayments/approve", param, function (data) {
        if (data.IsError === false) {
          swal("Success!", "Success Approve", "success");
          pay.reloadGrid();
        } else {
          swal("Error!", data.Message, "error");
        }
      });
    } else {
      swal("Error!", "Cancel Approve", "error");
    }
  });
}
pay.GenerateTable = function (dataFile) {
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
    text: "Are you sure remove this file?<br>this action cannot be undone.",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Yes, I am sure!',
    cancelButtonText: "No, cancel it!",
    closeOnConfirm: false,
    closeOnCancel: false
  },
          function (isConfirm) {
            if (isConfirm) {
              ajaxPost("/vendorpayments/deletedocumentinvoicefile", param, function (res) {
                if (!res.isError) {
                  var dataFile = [];
                  var fileEdit = pay.ExitingFile();
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
                  pay.ExitingFile(dataFile);
                  pay.GenerateTable(dataFile);
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

pay.toggleFilter = function () {
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
  pay.panel_relocated();
  var FilterTitle = pay.TitelFilter();
  if (FilterTitle == " Hide Filter") {
    pay.TitelFilter(" Show Filter");
  } else {
    pay.TitelFilter(" Hide Filter");
  }
}

pay.panel_relocated = function () {
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

pay.resetFilter = function () {
  var param = {}
  ajaxPost("/dashboard/getcurrentdate", param, function (res) {
    var d = new Date(res.Data.CurrentDate);
    var DefaultDate = new Date(res.Data.CurrentDate);
    var day = moment(d).format("ddd");
    if (day != "Mon") {
      DefaultDate.setDate(DefaultDate.getDate() - 1);
    } else {
      DefaultDate.setDate(DefaultDate.getDate() - 3);
    }
    pay.filterInvoiceDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
    pay.filterInvoiceNumber("");
    pay.filterVendorName("");
    pay.loadDataPayments();
  });
}
pay.resetForm = function () {
  pay.Id("");
  pay.VendorName("");
  pay.InvoiceDate("");
  pay.InvoiceNumber("");
  pay.InvoiceValue("");
  pay.Currency("");
  pay.AttachInvoice("");
  pay.BusinessPurpose("");
  pay.PaymentsDetails("");
  pay.BankDetails("");
  pay.Comments("");
  pay.Status("");
  pay.TempFileName([]);
  $('#listIcon').html("");
  $('#uploadFile').val('');
  var validator = $("#formpayment").kendoValidator().data("kendoValidator");
  validator.hideMessages();
};

pay.addPayment = function () {
  $('#Tablefile').html("");
  pay.resetForm();
  pay.TempFileName([]);
  $('#listIcon').html("");
  $('#uploadFile').val('');
  var validator = $("#formpayment").kendoValidator().data("kendoValidator");
  validator.hideMessages();
  pay.Status("Pending Payment");
  $("#payModal").modal({
    show: true,
    backdrop: 'static',
    keyboard: false
  });
  $("#nav-dex").css('z-index', '0');
}

pay.cancel = function () {
  $("#nav-dex").css('z-index', 'none');
}

pay.PaymentsDetails.subscribe(function(value){
  $("#BankDetails").siblings("span.k-tooltip-validation").hide(); 
  if (value == "Check" || value == "Cash"){
    var element = $("#titleBank")
    element.find("span").remove();
    $("#BankDetails").removeAttr('required');
  }else{
    var element = $("#titleBank")
    element.find("span").remove();
    $("#BankDetails").prop('required',true);
    $span = $("<span class='mandatory'>*</span>");
    $span.appendTo($("#titleBank"));
  }
});

$(document).ready(function () {
  pay.dropdown();
  // $("#InvoiceValue").kendoNumericTextBox({
  //   format: "n0",
  //   decimals: 7
  // });
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
    pay.filterInvoiceDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
    pay.loadDataPayments();
  });

});