model.UploadForm = ko.observable({
  FilterSourceTypes: ko.observableArray([{
      text: "Transaction File",
      value: "TF"
    }, {
      text: "Statement Price",
      value: "SP"
    }, {
      text: "Desk Fee",
      value: "DF"
    }]),
  ListFileType: ko.observableArray([{
      text: "TT",
      id: "TT",
      value: "TF"
    }, {
      text: "Stellar",
      id: "Stellar",
      value: "TF"
    }, {
      text: "ADM",
      id: "ADM",
      value: "TF"
    }, {
      text: "CQG",
      id: "CQG",
      value: "TF"
    }, {
      text: "CQGSFTP",
      id: "CQGSFTP",
      value: "TF"
    }, {
      text: "FCS",
      id: "FCS",
      value: "TF"
    }, {
      text: "Newedge",
      id: "Newedge",
      value: "TF"
    }, {
      text: "SEB",
      id: "SEB",
      value: "TF"
    }, {
      text: "SEB WEBCLEAR",
      id: "SEB WEBCLEAR",
      value: "TF"
    }, {
      text: "Settlement Price",
      id: "SP",
      value: "SP"
    }, {
      text: "Desk Fee",
      id: "DF",
      value: "DF"
    }]),
  PeriodStart: ko.observable(),
  PeriodEnd: ko.observable(),
  UploadType: ko.observable(),
  TransactionType: ko.observable(),
  FileType: ko.observable(),
  TradeDate: ko.observable(),
  Remark: ko.observable(),
  TempFileName: ko.observableArray([]),
  loading: ko.observable(false),
});
model.DetailForm = ko.observable({
  Id: ko.observable(),
  TradeDate: ko.observable(),
  TransactionType: ko.observable(),
  TradeDateStr: ko.observable(),
  UploadType: ko.observable(),
  Remark: ko.observable()
});

function goUpload() {
  var x = model.UploadForm();
  var UploadType = x.UploadType();
  var FileType = x.FileType();
  var TradeDate = x.TradeDate();
  var Remark = x.Remark();

  if (UploadType == "" || UploadType == undefined) {
    return swal("Confirmation!", "Please choose Upload Type.", "error");
  }

  if (FileType == "" || FileType == undefined) {
    return swal("Confirmation!", "Please choose File Type.", "error");
  }

  if (TradeDate == "" || TradeDate == undefined) {
    return swal("Confirmation!", "Please choose Trade Date.", "error");
  }

  if (Remark == "" || Remark == undefined) {
    return swal("Confirmation!", "Please Remark Can't Empty.", "error");
  }

  if ($("#uploadFile")[0].files.length > 0) {

    var listFile = x.TempFileName;
    if (listFile.length == 0) {
      return swal("Confirmation!", "Please choose file to be uploaded.", "error");
    }
    var formData = new FormData();
    formData.append("TradeDate", model.UploadForm().TradeDate());
    formData.append("UploadType", model.UploadForm().UploadType());
    formData.append("Remark", model.UploadForm().Remark());
    formData.append("FileType", model.UploadForm().FileType());
    var j = 0;
    for (i = 0; i < $("#uploadFile")[0].files.length; i++) {
//      formData.append("UploadFile", $("#uploadFile")[0].files[i]);
//      formData.append("Size" + i, $("#uploadFile")[0].files[i].size);
      // console.log("File ",$("#uploadFile")[0].files[i].name);
      for (var cek in listFile) {
        // console.log("===", listFile[cek].name, $("#uploadFile")[0].files[i].name);
        if (listFile[cek].name == $("#uploadFile")[0].files[i].name) {
          // console.log("Cek",listFile[cek].name);
          formData.append("UploadFile", $("#uploadFile")[0].files[j]);
          formData.append("Size" + j, $("#uploadFile")[0].files[j].size);
          j++;
        }
      }
    }
    // console.log(formData);
    $.ajax({
      url: "/uploadfile/do",
      data: formData,
      contentType: false,
      dataType: "json",
      mimeType: 'multipart/form-data',
      processData: false,
      type: 'POST',
      beforeSend: function (jqXHR, settings) {
        model.Processing(true);
      },
      success: function (data) {
        model.Processing(false);
        if (!data.IsError) {
          doProcess(data.Data.processId, model.UploadForm().TradeDate())
          alert(data.Message);
        } else {
          alert(data.Message);
        }
        $("#uploadForm")[0].reset();
        $("#mdlUpload").modal("hide");
        x.UploadType("");
        x.FileType("");
        x.TradeDate("");
        x.Remark("");
        loadGrid();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        model.Processing(false);
      }
    });

  } else {
    return swal("Confirmation!", "Please choose file to be uploaded.", "error");
  }

  // return false;
}

function doProcess(v, dt) {
  ajaxPost("/uploadfile/doprocess", {
    Id: v,
    dateinput: dt
  },
          function (d) {},
          function (d) {
            console.log("invalid response from server")
          }
  );
}

function showUploadModal() {
  var x = model.UploadForm();
  x.TempFileName = [];
  $('#listIcon').html("");
  $('#uploadFile').val('');
  $("#mdlUpload").modal("show");
}

function redirect(source) {
  window.location.href = "/datamaster/entrymanualsp?Transactiondatestring=" + source;
}

function processFile(TransDate) {
  var x = model.UploadForm();
  if (confirm("All Trade transaction within this date wil be replaced, are you sure to continue ?")) {
    x.loading(true);
    var param = {
      "Transactiondatestring": TransDate,
    }
    var url = "/validationprocess/validateprocess";
    ajaxPost(url, param, function (res) {
      var ErrorData = res.IsError;
      var ValidateData = res.Data;
      if (ValidateData == "UploadSettlementPriceFirst") {
        x.loading(false)
        return swal("Confirmation!", "Please Upload Settlement Price First.", "error");
      }

      if (ErrorData == true) {
        loadGridConfirmation(ValidateData);
        x.loading(false)
        $("#mdlDetailView").modal("hide");
        $("#mdlConfirm").modal("show");
      } else {
        ajaxPost("/allreport/tradefeerpt", {
          Transactiondatestring: TransDate
        }, function (res) {
          ajaxPost("/allreport/matchingprocess", {
            Transactiondatestring: TransDate
          }, function (res) {
            ajaxPost("/allreport/opentraderpt", {
              Transactiondatestring: TransDate
            }, function (res) {
              ajaxPost("/allreport/summarybyaccount", {
                Transactiondatestring: TransDate
              }, function (res) {
                x.loading(false);
                swal("Confirmation!", "Data has been processed, please view the report", "success");
                $("#mdlDetailView").modal("hide");
              });
            });
          });
        });
      }
    });

  }
}

function loadGridConfirmation(dataSource) {
  console.log(dataSource);
  $("#GridConfirmation").html("");
  $("#GridConfirmation").kendoGrid({
    dataSource: {
      data: dataSource.Records,
      pageSize: 10
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: [5, 10, 15, 20],
      buttonCount: 5
    },
    columns: [{
        field: "ContractCode",
        title: "Contract Code",
        width: 80,
        attributes: {
          "class": "align-center"
        },
      }, {
        field: "Fullname",
        title: "Full Name",
      }, {
        field: "ContractExpiry",
        title: "Contract Expiry",
        template: "#= moment(ContractExpiry).format('MMM-YY') #",
        attributes: {
          "class": "align-center"
        },
      }, {
        field: "QtyBuy",
        title: "Total Buy",
        width: 120,
        attributes: {
          "class": "align-right"
        },
      }, {
        field: "QtySale",
        title: "Total Sale",
        width: 120,
        attributes: {
          "class": "align-right"
        },
      }
    ]
  });
}


function loadGrid() {
  var params = {
    "TransactionType": model.UploadForm().TransactionType(),
    "StartDateStr": model.UploadForm().PeriodStart(),
    "EndDateStr": model.UploadForm().PeriodEnd(),
  };
  var emptyData = [];
  $("#GridUpload").html("");
  $("#GridUpload").kendoGrid({
    dataSource: {
      transport: {
        read: function (options) {
          params.Take = options.data.take;
          params.Skip = options.data.skip;
          params.Sorts = options.data.sort;
          ajaxPost("/uploadfile/readdata", params, function (result) {
            if (result.IsError) {
              if (result.Data.sessionExpired) {
                window.location.href = "/";
              }
            } else {
              options.success(result);
            }
          }, function (data) {
            options.error(result);
          });
        }
      },
      schema: {
        data: "Data.Records",
        total: "Data.Count"
      },
      pageSize: 15,
      serverPaging: true, // enable server paging
      serverSorting: true,
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      //      pageSizes: true,
      pageSizes: [5, 10, 15, 20],
      buttonCount: 5
    },
    columns: [{
        field: "TradeDate",
        title: "Trade Date",
        template: "<a class='grid-select' href='javascript:viewDetail(\"#: Id #\")'>#: moment(TradeDate).format('YYYY-MM-DD') #</a>",
        attributes: {
          "class": "align-center"
        },
      }, {
        field: "FileType",
        title: "File Type",
      }, {
        field: "Remark",
        title: "Remark",
      }, {
        field: "FileCount",
        title: "File Count",
        format: "{0:n0}",
        attributes: {
          "class": "align-right"
        }
      }, {
        field: "CreateBy",
        title: "Create By",
      }, {
        field: "CreateDate",
        title: "Create Date",
        template: "#= moment(CreateDate).format('YYYY-MM-DD HH:MI:SS') #",
        attributes: {
          "class": "align-center"
        },
      }, ]
  });
}

function resetSearchForm() {
  $("#searchForm")[0].reset();
  loadGrid();
}

function viewDetail(v) {
  ajaxPost("/uploadfile/getsingledata", {
    Id: v
  },
          function (res) {
            var dataForm = res.Data;
            if (dataForm != null) {
              console.log("FileType " + dataForm.FileType)
              var values = {
                Id: dataForm.Id,
                UploadType: dataForm.UploadType === "SP" ? "Settlement Price" : "Transaction File",
                TransactionType: dataForm.FileType,
                TradeDate: moment(dataForm.TradeDate).format("DD-MMM-YYYY"),
                TradeDateStr: moment(dataForm.TradeDate).format("YYYY-MM-DD"),
                Remark: dataForm.Remark
              }
            }
            model.DetailForm(values)
            $("#mdlDetailView").modal("show");
            loadGridDetail(res.Data);
          },
          function (res) {

          }
  )
}

function loadGridDetail(data) {
  var detailDataSource = new kendo.data.DataSource({
    data: data.Details,
    refresh: true,
    pageSize: 10,
  });
  console.log(data);
  $("#DetailGrid").kendoGrid({
    dataSource: detailDataSource,
    sortable: true,
    scrollable: true,
    resizable: true,
    pageable: {
      pageSizes: [5, 10, 20],
      buttonCount: 10
    },
    columns: [{
        field: "FileNumber",
        title: "No.",
        width: 50,
        attributes: {
          "class": "align-right"
        }
      }, {
        field: "FileName",
        title: "Filename",
        width: 200,
      }, {
        field: "FileSize",
        title: "Size",
        format: "{0:n0}",
        attributes: {
          "class": "align-right"
        },
        width: 100,
      }, {
        field: "Remark",
        title: "Remark",
        width: 250,
      }, {
        field: "UploadPercentage",
        title: "Upload Percentage",
        format: "{0:n0}",
        attributes: {
          "class": "align-right"
        },
        width: 160,
      }, {
        field: "ProcessingPercentage",
        title: "Load to DB (%)",
        format: "{0:n0}",
        attributes: {
          "class": "align-right"
        },
        width: 150,
      }, {
        field: "IsValid",
        title: "Valid"
      }, {
        field: "Message",
        title: "Message",
        width: 150,
      }, ]
  });
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

    model.UploadForm().TempFileName = dataFile;
    $('#listIcon').html("");
    $divListIcon = $('#listIcon');
    for (var dw in dataFile) {
      $Icon = $("<div class='file-wrapper' data-bind='value:" + dataFile[dw].id + "'>" +
              "<span class='file-icon " + dataFile[dw].classCSS + "-file'></span>" +
              "<h4 class='file-heading file-name-heading'> Name: " + dataFile[dw].name + "</h4>" +
              "<h4 class='file-heading file-size-heading'> Size: " + dataFile[dw].size + "</h4>" +
              "<span id='btnRemoveFile' class='remove-File fa fa-times' onclick = removeFile(\"" + dataFile[dw].id + "\")></span>" +
              "</div>");
      $Icon.appendTo($divListIcon);
    }
  }
}

function removeFile(e) {
  var x = model.UploadForm();
  var listFile = x.TempFileName;
  var dataFile = [];
  $('#listIcon').html("");
  $divListIcon = $('#listIcon');
  for (var dw in listFile) {
    if (listFile[dw].id != e) {
      $Icon = $("<div class='file-wrapper' data-bind='value:" + listFile[dw].id + "'>" +
              "<span class='file-icon " + listFile[dw].classCSS + "-file'></span>" +
              "<h4 class='file-heading file-name-heading'> Name: " + listFile[dw].name + "</h4>" +
              "<h4 class='file-heading file-size-heading'> Size: " + listFile[dw].size + "</h4>" +
              "<span id='btnRemoveFile' class='remove-File fa fa-times' onclick = removeFile(\"" + listFile[dw].id + "\")></span>" +
              "</div>");
      $Icon.appendTo($divListIcon);
      dataFile.push(listFile[dw]);
    }
  }
  x.TempFileName = [];
  x.TempFileName = dataFile;
}

$(document).ready(function () {
  $("#uploadButton").on("click", goUpload);
  $("#btnRemoveFile").on("click", removeFile);
  $("#FilterPeriodStart").kendoDatePicker({
    format: "yyyy-MM-dd",
  }).data("kendoDatePicker");
  $("#FilterPeriodStart").closest("span.k-datepicker").width(130);
  $("#FilterPeriodEnd").kendoDatePicker({
    format: "yyyy-MM-dd",
  }).data("kendoDatePicker");
  $("#FilterPeriodEnd").closest("span.k-datepicker").width(130);
  $("#tradeDate").kendoDatePicker({
    format: "yyyy-MM-dd",
  }).data("kendoDatePicker");
  $("#tradeDate").closest("span.k-datepicker").width(130);
  loadGrid();
});