var uplV2 = {
  UploadType: ko.observable(""),
  TradeDate: ko.observable(""),
  Remark: ko.observable(""),
  TempFileName: ko.observableArray([]),
  loading: ko.observable(false),
  dateColor: ko.observable(""),
  headerLog: ko.observable(false),
  showProsessLog: ko.observable(false),
  DateFxRate: ko.observable(""),
  isChecked: ko.observable(""),
  playControl: ko.observable("back"),
  //list
  lsitFileType: ko.observableArray([{
      text: "Transaction File or Settlement Price",
      value: "TF"
    }, {
      text: "Desk Fee",
      value: "DF"
    }]),
  //btn
  btnUpload: ko.observable(false),
  btnLock: ko.observable(false),
  btnUnlock: ko.observable(false),
  btnCheckSettlementPrice: ko.observable(false),
  btnProcestradingFile: ko.observable(false),
  btnPreprocess: ko.observable(false),
  titleModelCheck: ko.observable(""),
  titleModeFxrate: ko.observable(""),
  LoadingQualityControl: ko.observable(false),
  titleModelQualityControl: ko.observable(""),
  //total Legen
  TotalCutOff: ko.observable(""),
  TotalInsert: ko.observable(""),
  TotalRecord: ko.observable(""),
  TotalRowByAccount: ko.observable(""),
  TotalRowByClearer: ko.observable(""),
  TotalRowByContract: ko.observable(""),
};

uplV2.goUpload = function () {
  var UploadType = uplV2.UploadType();
  var TradeDate = uplV2.TradeDate();
  var Remark = uplV2.Remark();

  if (UploadType == "" || UploadType == undefined) {
    return swal("Confirmation!", "Please choose Upload Type.", "error");
  }

  if (TradeDate == "" || TradeDate == undefined) {
    return swal("Confirmation!", "Please choose Trade Date.", "error");
  }

  if (Remark == "" || Remark == undefined) {
    return swal("Confirmation!", "Please Remark Can't Empty.", "error");
  }

  if ($("#uploadFile")[0].files.length > 0) {

    var listFile = uplV2.TempFileName();
    if (listFile.length == 0) {
      return swal("Confirmation!", "Please choose file to be uploaded.", "error");
    }
    var formData = new FormData();
    formData.append("TradeDate", TradeDate);
    formData.append("UploadType", UploadType);
    formData.append("Remark", Remark);
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

    $.ajax({
      url: "/uploadfile/do",
      data: formData,
      contentType: false,
      dataType: "json",
      mimeType: 'multipart/form-data',
      processData: false,
      type: 'POST',
      beforeSend: function (jqXHR, settings) {
        uplV2.loading(true);
      },
      success: function (data) {
        uplV2.loading(false);
        if (!data.IsError) {
          var paramChack = {
            Id: data.Data.processId,
            dateinput: TradeDate
          }
          ajaxPost("/uploadfile/dochecktradedate", paramChack, function (doCheckTradeDate) {
            if (doCheckTradeDate.IsError != true) {
              ajaxPost("/uploadfile/docheckproductid", paramChack, function (doCheckProduct) {
                if (doCheckProduct.IsError != true) {
                  ajaxPost("/uploadfile/dochecksettlementprices", paramChack, function (doCheckSettle) {
                    if (doCheckSettle.IsError != true) {
                      ajaxPost("/uploadfile/docheckaccountid", paramChack, function (doCheckAccount) {
                        if (doCheckAccount.IsError != true) {
                          uplV2.btnCheckSettlementPrice(false);
                          doProcess(data.Data.processId, TradeDate);
                          reloadGridAfterUpload(data.Data.processId, TradeDate);
                          swal({
                            title: "Success",
                            text: data.Message,
                            type: "success",
                            showConfirmButton: false,
                            timer: 1000
                          });
                          $("#mdlUpload").modal("hide");
                          $("#nav-dex").css('z-index', 'none');
                          $("#uploadForm")[0].reset();
                          uplV2.UploadType("");
                          uplV2.Remark("");
                          $("#tradeDate").val(TradeDate)
                        } else {
                          var DataCheckAcoount = doCheckAccount.Data;
                          uplV2.titleModelCheck(doCheckProduct.Message);
                          return uplV2.ProsesCheckAccount(DataCheckAcoount);
                        }
                      });
                    } else {
                      var DataCheckSettlement = doCheckSettle.Data;
                      uplV2.titleModelCheck(doCheckSettle.Message);
                      return uplV2.ProsesdoCheckSettlement(DataCheckSettlement);
                    }
                  });
                } else {
                  var DataCheckProduct = doCheckProduct.Data;
                  uplV2.titleModelCheck(doCheckProduct.Message);
                  return uplV2.ProsesdoCheckProduct(DataCheckProduct);
                }
              });
            } else {
              var dataCheckTradeDate = doCheckTradeDate.Data;
              uplV2.titleModelCheck(doCheckTradeDate.Message);
              return uplV2.ProsesdoCheckTradeDate(dataCheckTradeDate);
            }
          });
        } else {
          swal({
            title: "Error",
            text: data.Message,
            type: "success",
            showConfirmButton: true,
            //            timer: 3000
          });
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        uplV2.loading(false);
      }
    });

  } else {
    return swal("Confirmation!", "Please choose file to be uploaded.", "error");
  }
}

uplV2.ContinueProcess = function () {
  var UploadType = uplV2.UploadType();
  var TradeDate = uplV2.TradeDate();
  var Remark = uplV2.Remark();

  if (UploadType == "" || UploadType == undefined) {
    return swal("Confirmation!", "Please choose Upload Type.", "error");
  }

  if (TradeDate == "" || TradeDate == undefined) {
    return swal("Confirmation!", "Please choose Trade Date.", "error");
  }

  if (Remark == "" || Remark == undefined) {
    return swal("Confirmation!", "Please Remark Can't Empty.", "error");
  }

  if ($("#uploadFile")[0].files.length > 0) {

    var listFile = uplV2.TempFileName();
    if (listFile.length == 0) {
      return swal("Confirmation!", "Please choose file to be uploaded.", "error");
    }
    var formData = new FormData();
    formData.append("TradeDate", TradeDate);
    formData.append("UploadType", UploadType);
    formData.append("Remark", Remark);
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

    $.ajax({
      url: "/uploadfile/do",
      data: formData,
      contentType: false,
      dataType: "json",
      mimeType: 'multipart/form-data',
      processData: false,
      type: 'POST',
      beforeSend: function (jqXHR, settings) {
        uplV2.loading(true);
      },
      success: function (data) {
        uplV2.loading(false);
        if (!data.IsError) {
          var paramChack = {
            Id: data.Data.processId,
            dateinput: TradeDate
          }
          ajaxPost("/uploadfile/dochecktradedate", paramChack, function (doCheckTradeDate) {
            if (doCheckTradeDate.IsError != true) {
              ajaxPost("/uploadfile/docheckproductid", paramChack, function (doCheckProduct) {
                if (doCheckProduct.IsError != true) {
                  ajaxPost("/uploadfile/docheckaccountid", paramChack, function (doCheckAccount) {
                    if (doCheckAccount.IsError != true) {
                      uplV2.btnCheckSettlementPrice(false);
                      doProcess(data.Data.processId, TradeDate);
                      reloadGridAfterUpload(data.Data.processId, TradeDate);
                      swal({
                        title: "Success",
                        text: data.Message,
                        type: "success",
                        showConfirmButton: false,
                        timer: 1000
                      });
                      $("#mdlUpload").modal("hide");
                      $("#mdCheckBefourDoProcess").modal("hide");
                      $("#nav-dex").css('z-index', 'none');
                      $("#uploadForm")[0].reset();
                      uplV2.UploadType("");
                      uplV2.Remark("");
                      $("#tradeDate").val(TradeDate)
                    } else {
                      var DataCheckAcoount = doCheckAccount.Data;
                      uplV2.titleModelCheck(doCheckProduct.Message);
                      return uplV2.ProsesCheckAccount(DataCheckAcoount);
                    }
                  });
                } else {
                  var DataCheckProduct = doCheckSettle.Data;
                  uplV2.titleModelCheck(doCheckProduct.Message);
                  return uplV2.ProsesdoCheckProduct(DataCheckProduct);
                }
              });
            } else {
              var dataCheckTradeDate = doCheckTradeDate.Data;
              uplV2.titleModelCheck(doCheckTradeDate.Message);
              return uplV2.ProsesdoCheckTradeDate(dataCheckTradeDate);
            }
          });
        } else {
          swal({
            title: "Error",
            text: data.Message,
            type: "success",
            showConfirmButton: true,
            //            timer: 3000
          });
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        uplV2.loading(false);
      }
    });

  } else {
    return swal("Confirmation!", "Please choose file to be uploaded.", "error");
  }
}


uplV2.ClossAllModel = function () {
  $('#ContinueProcess').hide();
  $("#mdCheckBefourDoProcess").modal("hide");
  $("#nav-dex").css('z-index', 'none');
}


uplV2.ProsesdoCheckTradeDate = function (dataSource) {
  $("#mdlUpload").modal("hide");
  $('#ContinueProcess').hide();
  $("#mdCheckBefourDoProcess").modal("show");
  $("#chackBefourdoProsess").html("");
  $("#chackBefourdoProsess").kendoGrid({
    dataSource: {
      data: dataSource,
      pageSize: 15,
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
        field: "Filename",
        title: "Filename",
        width: 200,
      }, {
        field: "TradeDate",
        title: "Trade Date",
        width: 100,
      }, {
        field: "Count",
        title: "Count",
        width: 100,
        attributes: {"class": "align-right"},
//        template: "#= moment(ContractExpiry).format('MMM YYYY') #"
      }]
  });
}

uplV2.ProsesdoCheckSettlement = function (dataSource) {
  $("#mdlUpload").modal("hide");
  $('#ContinueProcess').show();
  $("#mdCheckBefourDoProcess").modal("show");
  $("#chackBefourdoProsess").html("");
  $("#chackBefourdoProsess").kendoGrid({
    dataSource: {
      data: dataSource,
      pageSize: 15,
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
        field: "ContractCode",
        title: "ContractCode",
        width: 100,
      }, {
        field: "ContractExpiry",
        title: "ContractExpiry",
        attributes: {"class": "align-center"},
        template: "#= moment(ContractExpiry).format('MMM YYYY') #"
      }]
  });
}

uplV2.ProsesdoCheckProduct = function (dataSource) {
  $("#mdlUpload").modal("hide");
  $('#ContinueProcess').hide();
  $("#mdCheckBefourDoProcess").modal("show");
  $("#chackBefourdoProsess").html("");
  $("#chackBefourdoProsess").kendoGrid({
    dataSource: {
      data: dataSource,
      pageSize: 15,
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
        field: "FileType",
        title: "FileType",
        width: 200,
      }, {
        field: "ProductId",
        title: "ProductId",
        width: 200,
      }, {
        field: "ContractExpiry",
        title: "ContractExpiry",
        width: 200,
        attributes: {"class": "align-center"},
        template: "#= moment(ContractExpiry).format('MMM YYYY') #"
      }]
  });
}

uplV2.ProsesCheckAccount = function (dataSource) {
  console.log(dataSource);
  $("#mdlUpload").modal("hide");
  $('#ContinueProcess').hide();
  $("#mdCheckBefourDoProcess").modal("show");
  $("#chackBefourdoProsess").html("");
  $("#chackBefourdoProsess").kendoGrid({
    dataSource: {
      data: dataSource,
      pageSize: 15,
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
        field: "FileType",
        title: "FileType",
        width: 200,
      }, {
        field: "AccountId",
        title: "AccountId",
        width: 200,
      }]
  });
}

function doProcess(v, dt) {

  var param = {
    Id: v,
    dateinput: dt
  };

  ajaxPost("/uploadfile/doprocess", param, function (d) {

  },
          function (d) {
            console.log("invalid response from server")
          });
}

function reloadGridAfterUpload(v, dt) {

  $('#GridLog').data('kendoGrid').dataSource.read({"TradeDate": uplV2.TradeDate()});

  var refreshIntervalId = setInterval(function () {
    $('#GridLog').data('kendoGrid').dataSource.read({"TradeDate": uplV2.TradeDate()});

    var paramInterval = {
      Id: v,
      TradeDate: uplV2.TradeDate()
    }
    ajaxPost("/uploadfilev2/isfinishprocess", paramInterval, function (res) {
      if (res.Data == true) {
        clearInterval(refreshIntervalId);
        uplV2.refreshColor();
        var Value = $('.k-nav-fast').html().split(" ");
        var VarMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var MonthsInt = VarMonths.indexOf(Value[0]) + 1;
        var MonthsStr = "";
        if (MonthsInt < 10) {
          MonthsStr = "0" + MonthsInt;
        } else {
          MonthsStr = MonthsInt;
        }
        var DateNavgate = new Date(Value[1] + '-' + MonthsStr + '-' + '01');
        var lastDay = new Date(DateNavgate.getFullYear(), DateNavgate.getMonth() + 1, 0);
        uplV2.dateEvent(moment(new Date(DateNavgate)).format("YYYY-MM-DD"), moment(new Date(lastDay)).format("YYYY-MM-DD"));
        uplV2.btnCheckSettlementPrice(true);
        uplV2.QualityControl(dt);
      }
    });
  }, 3000);

}

uplV2.QualityControl = function (date) {
  var param = {
    TradeDate: date
  }
  uplV2.loading(true);
  uplV2.titleModelQualityControl("Quality Control");
  uplV2.LoadingQualityControl(true);
  ajaxPost("/uploadfilev2/getdataqualitycontrol", param, function (res) {
    var CutOff = res.Data.CutOff;
    var Account = res.Data.DataByAccount;
    var Clearer = res.Data.DataByClearer;
    var Contract = res.Data.DataByContract;
    var Logs = res.Data.DataLogs;
    uplV2.GridLogs(Logs);
    uplV2.GridCutOff(CutOff);
    uplV2.GridAccount(Account);
    uplV2.GridClearer(Clearer);
    uplV2.GridContract(Contract);
    uplV2.TotalCutOff(" Total Cut Of : " + kendo.toString(res.Data.TotalCutOff, 'N0'));
    uplV2.TotalInsert(" Total Insert To DB : " + kendo.toString(res.Data.TotalInsert, 'N0'));
    uplV2.TotalRecord(" Total Record : " + kendo.toString(res.Data.TotalRecord, 'N0'));
    uplV2.TotalRowByAccount(" Total Account : " + kendo.toString(res.Data.TotalRowByAccount, 'N0'));
    uplV2.TotalRowByClearer(" Total Clearer : " + kendo.toString(res.Data.TotalRowByClearer, 'N0'));
    uplV2.TotalRowByContract(" Total Contract : " + kendo.toString(res.Data.TotalRowByContract, 'N0'));
    uplV2.LoadingQualityControl(false);
    uplV2.loading(false);
    $("#mdlQualityControl").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#mdlQualityControl").modal({
        backdrop: 'static',
        keyboard: false
    });
  });
}

uplV2.GridCutOff = function (dataSource) {
  $("#GridCutOff").html("");
  $("#GridCutOff").kendoGrid({
    dataSource: {
      data: dataSource,
      pageSize: 10,
    },
    height: 180,
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
        field: "ContractCode",
        title: "Contract Code",
        width: 100
      }, {
        field: "ContractExpiry",
        title: "Contract Expiry",
        width: 100,
        attributes: {"class": "align-center"},
        template: "#= moment(ContractExpiry).format('MMM-YYYY') #",
      }, {
        field: "Count",
        title: "Count",
        width: 50,
        attributes: {"class": "align-right"},
      }, {
        field: "ProductId",
        title: "Product",
        width: 50,
      }]
  });
}
uplV2.GridAccount = function (dataSource) {
  $("#GridAccount").html("");
  $("#GridAccount").kendoGrid({
    dataSource: {
      data: dataSource,
      pageSize: 10,
    },
    height: 230,
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
        field: "AccountId",
        title: "Account",
        width: 60
      }, {
        field: "AccountName",
        title: "Account Name"
      }, {
        field: "Count",
        title: "Count",
        width: 60,
        attributes: {"class": "align-right"},
      }]
  });
  $("#GridAccount").data("kendoGrid").refresh();

}
uplV2.GridClearer = function (dataSource) {
  $("#GridClearer").html("");
  $("#GridClearer").kendoGrid({
    dataSource: {
      data: dataSource,
      pageSize: 10,
    },
    height: 230,
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
        field: "ClearerName",
        title: "Clearer Name"
      }, {
        field: "Count",
        title: "Count",
        width: 60,
        attributes: {"class": "align-right"},
      }]
  });
  $("#GridClearer").data("kendoGrid").refresh();
}
uplV2.GridContract = function (dataSource) {
  $("#GridContract").html("");
  $("#GridContract").kendoGrid({
    dataSource: {
      data: dataSource,
      pageSize: 10,
    },
    height: 230,
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
        field: "ContractCode",
        title: "Contract Code",
        width: 100,
      }, {
        field: "Fullname",
        title: "Full Name"
      }, {
        field: "Count",
        title: "Count",
        width: 60,
        attributes: {"class": "align-right"},
      }]
  });
  $("#GridContract").data("kendoGrid").refresh();
}
uplV2.GridLogs = function (dataSource) {
  $("#GridLogs").html("");
  $("#GridLogs").kendoGrid({
    dataSource: {
      data: dataSource,
      pageSize: 10,
    },
    height: 180,
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
        field: "FileType",
        title: "File Type",
        width: 60
      }, {
        field: "FileName",
        title: "Full Name"
      }, {
        field: "TotalInserted",
        title: "Row Inserted",
        width: 100,
        attributes: {"class": "align-right"},
      }, {
        field: "IsValid",
        title: "Valid",
        width: 50
      }, {
        field: "Message",
        title: "Message",
        width: 200
      }]
  });
}
uplV2.Cancel = function () {
  $("#mdlUpload").modal("hide");
  $("#nav-dex").css('z-index', 'none');
}

uplV2.CancelMdlInfo = function () {
  $("#mdlinfo").modal("hide");
  $("#nav-dex").css('z-index', 'none');
}

uplV2.CancelMdlFxRate = function () {
  $("#mdlFxRate").modal("hide");
  $("#nav-dex").css('z-index', 'none');
}

uplV2.CancelprosesModal = function () {
  $("#prosesModal").modal("hide");
  $("#nav-dex").css('z-index', 'none');
}

uplV2.cancelmdlQualityControl = function () {
  $("#mdlQualityControl").modal("hide");
  $("#nav-dex").css('z-index', 'none');
}

uplV2.showUploadModal = function () {
  $("#mdlUpload").modal("show");
  $("#nav-dex").css('z-index', '0');
  $("#mdlConfirm").modal({
      backdrop: 'static',
      keyboard: false
  });
  uplV2.UploadType("");
  uplV2.Remark("");
  $('#listIcon').html("");
  $('#uploadFile').val('');
  var datepicker = $("#tradeDate").data("kendoDatePicker");
  datepicker.enable(false);
}

uplV2.locked = function () {

}

uplV2.unlocked = function () {
  uplV2.loading(true);
  var param = {
    "TradeDate": uplV2.TradeDate()
  }
  var url = "/uploadfilev2/unlockdata";
  ajaxPost(url, param, function (res) {

    if (res.IsError == true) {
      uplV2.loading(false);
      swal({
        title: "Error",
        text: res.Message,
        type: "warning",
        showConfirmButton: false
      });
    } else {
      window.location.href = "/uploadfilev2/default?tradeDate=" + uplV2.TradeDate();
      uplV2.loading(false);
    }
  });
}

uplV2.ckeckSettlementPrices = function () {
  uplV2.loading(true);
  var param = {
    "Transactiondatestring": uplV2.TradeDate()
  }
  var url = "/validationprocess/validateprocessv2";
  ajaxPost(url, param, function (res) {
    uplV2.loading(false);
    if (res.IsError == true) {
      if (typeof res.Data === "string") {
        $("#mdlUpload").modal("show");
        $("#nav-dex").css('z-index', '0');
        $("#mdlUpload").modal({
            backdrop: 'static',
            keyboard: false
        });
      } else {
        window.location.href = "/datamaster/entrymanualsp?Transactiondatestring=" + uplV2.TradeDate();
      }
    } else {
      var Value = $('.k-nav-fast').html().split(" ");
      var VarMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var MonthsInt = VarMonths.indexOf(Value[0]) + 1;
      var MonthsStr = "";
      if (MonthsInt < 10) {
        MonthsStr = "0" + MonthsInt;
      } else {
        MonthsStr = MonthsInt;
      }
      var DateNavgate = new Date(Value[1] + '-' + MonthsStr + '-' + '01');
      var lastDay = new Date(DateNavgate.getFullYear(), DateNavgate.getMonth() + 1, 0);
      uplV2.dateEvent(moment(new Date(DateNavgate)).format("YYYY-MM-DD"), moment(new Date(lastDay)).format("YYYY-MM-DD"));
    }

  });
}

uplV2.precesstradingFie = function () {
  var TransDate = uplV2.TradeDate();

  var url = "/uploadfilev2/checkfxrates";
  var paramFx = {
    "TradeDate": uplV2.TradeDate()
  }

  ajaxPost(url, paramFx, function (res) {
    var dataFx = res.Data;
    if (res.IsError == true) {
      uplV2.titleModeFxrate(res.Message);
      if (dataFx.length != 0) {
        return uplV2.FxRate(dataFx)
      } else {
        swal({
          title: "Error",
          text: res.Message,
          type: "warning",
          showConfirmButton: false,
          timer: 1000
        });
      }
    } else {
      swal({
        title: "Are you sure?",
        text: "All Trade transaction within this date wil be replaced, are you sure to continue ?",
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
                  var url = "/uploadfilev2/processtradedata";
                  var param = {
                    "TradeDate": TransDate
                  }
                  ajaxPost(url, param, function (res) {
                    uplV2.headerLog(true);
                    uplV2.showProsessLog(true);
                    uplV2.processingLog(res.Data);
                    swal({
                      title: "Success",
                      text: "Data is processing...",
                      type: "success",
                      showConfirmButton: false,
                      timer: 1000
                    });
                  });
                } else {
                  swal({
                    title: "Error",
                    text: "Cancelled Processed",
                    type: "warning",
                    showConfirmButton: false,
                    timer: 1000
                  });
                }
              });
    }
  });
}

uplV2.NumericTextBox = function (container, options) {
  $('<input data-bind="value:' + options.field + '"/>').appendTo(container)
          .kendoNumericTextBox({
            format: 'n7',
            decimals: 7
          });
}

uplV2.FxRate = function (dataSource) {
  uplV2.DateFxRate(new Date(moment(new Date(uplV2.TradeDate())).format("YYYY-MM-01")));
  $("#DateFxRate").data("kendoDatePicker").enable(false)
  $("#mdlFxRate").modal("show");
  $("#MasterGridCurrencies").html("");
  $("#MasterGridCurrencies").kendoGrid({
    dataSource: {
      data: dataSource,
      pageSize: 15,
    },
    resizable: true,
    sortable: true,
    pageable: false,
    columnMenu: false,
    editable: true,
    columns: [
      {
        field: "CurrencyCode",
        title: "Currency Code",
        width: 100,
      },
      {
        field: "Description",
        title: "Description",
        width: 100
      },
      {
        field: "Rate",
        title: "Rate",
        attributes: {"class": "align-right"},
        width: 100,
        editor: uplV2.NumericTextBox
      },
    ]
  });
}

uplV2.saveFxRate = function () {
  var DateRateYearMonth = moment(new Date(uplV2.DateFxRate())).format("YYYYMM");

  var DataRate = $("#MasterGridCurrencies").data().kendoGrid.dataSource.view();
  var SandDataRate = [];
  for (var r in DataRate) {
    if (DataRate[r].Id != undefined) {
      SandDataRate.push({
        "Id": parseInt(DataRate[r].Id).toString(),
        "Year": DataRate[r].Year.toString(),
        "Month": DataRate[r].Month.toString(),
        "YearMonth": DataRate[r].YearMonth.toString(),
        "CurrencyId": DataRate[r].CurrencyId.toString(),
        "CurrencyCode": DataRate[r].CurrencyCode.toString(),
        "Rate": DataRate[r].Rate.toString()
      });
    }

  }

  var param = {
    "AllFxrates": SandDataRate,
    "Yearmonth": parseInt(DateRateYearMonth)
  }

  var url = "/masterfxrates/savedatafromupload";
  var validator = $("#settRate").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#settRate").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      var IsError = res.IsError;
      if (IsError == false) {
        $("#mdlFxRate").modal("hide");
        $("#nav-dex").css('z-index', 'none');

      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

uplV2.preprocess = function () {
//  $("#tradecont").html("");
//  $("#deskcont").html("");
//  $("#all").html("");
//  var tradecont = document.getElementById("tradecont")
//  $("#prosesModal").modal('show', true);
//  var trade = document.createElement('input');
//  trade.type = "checkbox";
//  trade.id = "tradeProc";
//  tradecont.appendChild(trade);
//  $("#tradeProc").change(function(){
//    if($(this).attr('checked') == false){
//      $(this).val(false);
//    }else{
//      $(this).val(true);
//    }
//  });
//
//  var deskcont = document.getElementById("deskcont");
//  var desk = document.createElement('input');
//  desk.type = "checkbox";
//  desk.id = "deskProc";
//  deskcont.appendChild(desk);
//
//  var allcont = document.getElementById("all");
//  var all = document.createElement('input');
//  all.type = "checkbox";
//  all.id = "allProc";
//  allcont.appendChild(all);
}

uplV2.processingLog = function (IdProcess) {
  var url = "/uploadfilev2/getprocesstradelog";
  var dataSource = [];
  var param = {
    "Id": IdProcess
  }
  $("#GridLogProcess").html("");
  $("#GridLogProcess").kendoGrid({
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
          if (data.Data.length == 0) {
            return dataSource;
          } else {
            var Data = data.Data;
            return Data;
          }
        },
        // total: "Data.Count",
      },
      pageSize: 10,
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    excel: {
      allPages: true,
      fileName: "log.xlsx"
    },
    columnMenu: false,
    dataBound: function (e) {
      var grid = this;
      $(".progress-detail").each(function () {
        var x = $(this);
        $(this).kendoProgressBar({
          value: x.attr("data-percentage"),
          type: "percent",
          animation: true,
          min: 0,
          max: 100,
        });

      });
    },
    columns: [
      {
        field: "SequenceNo",
        title: "Sequence No",
        width: 60,
      },
      {
        field: "ProcessName",
        title: "Process Name",
        width: 130,
      },
      {
        field: "Percentage",
        title: "Percentage",
        width: 130,
        attributes: {"class": "align-right"},
        template: "<div style='width: 100%' data-history='#: SequenceNo#' data-percentage='#: Percentage #' class=\"progress-detail p#: SequenceNo#\"></div>",
      },
      {
        field: "ProcessStartTime",
        title: "Start Time",
        width: 110,
        attributes: {"class": "align-center"},
        template: "#= moment(ProcessStartTime).format('H:mm:ss') #"
      },
      {
        field: "ProcessEndTime",
        title: "End Time",
        width: 110,
        attributes: {"class": "align-center"},
        template: "#= moment(ProcessEndTime).format('H:mm:ss') #"
      },
      {
        field: "Message",
        title: "Message",
        width: 150,
      }
    ]
  });


  $('#GridLogProcess').data('kendoGrid').dataSource.read({"Id": IdProcess});
  var refreshIntervalId = setInterval(function () {
    $('#GridLogProcess').data('kendoGrid').dataSource.read({"Id": IdProcess});

    var paramInterval = {
      "Id": IdProcess,
    }
    ajaxPost("/uploadfilev2/isprocesstradefinish", paramInterval, function (res) {
      if (res.Data == true) {
        clearInterval(refreshIntervalId);
        uplV2.refreshColor();
      }
    });
  }, 3000);

}

uplV2.LastprocessingLog = function (IdProcess) {
  var url = "/processlog/getlastprocessdata";
  var dataSource = [];
  var param = {
    "TradeDate": IdProcess
  }
  $("#GridLogProcess").html("");
  $("#GridLogProcess").kendoGrid({
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
          if (data.Data.Records.length == 0) {
            uplV2.headerLog(false);
            uplV2.showProsessLog(false);
            return dataSource;
          } else {
            uplV2.headerLog(true);
            uplV2.showProsessLog(true);
            var Data = data.Data.Records[0].details;
            return Data;
          }
        },
        // total: "Data.Count",
      },
      pageSize: 10,
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    excel: {
      allPages: true,
      fileName: "log.xlsx"
    },
    columnMenu: true,
    dataBound: function (e) {
      var grid = this;
      $(".progress-detail").each(function () {
        var x = $(this);
        $(this).kendoProgressBar({
          value: x.attr("data-percentage"),
          type: "percent",
          animation: true,
          min: 0,
          max: 100,
        });

      });
    },
    columns: [
      {
        field: "sequenceno",
        title: "Sequence No",
        width: 60,
      },
      {
        field: "processname",
        title: "Process Name",
        width: 130,
      },
      {
        field: "percentage",
        title: "Percentage",
        width: 100,
        attributes: {"class": "align-right"},
        template: "<div style='width: 100%' data-history='#: sequenceno#' data-percentage='#: percentage #' class=\"progress-detail p#: sequenceno  #\"></div>",
      },
      {
        field: "processstarttime",
        title: "Start Time",
        width: 110,
        attributes: {"class": "align-center"},
        template: "#= moment(processstarttime).format('H:mm:ss') #"
      },
      {
        field: "processendtime",
        title: "End Time",
        width: 110,
        attributes: {"class": "align-center"},
        template: "#= moment(processendtime).format('H:mm:ss') #"
      },
      {
        field: "message",
        title: "Message",
        width: 150,
      }
    ]
  });
}

uplV2.onChange = function () {
  uplV2.SetWidth();
  var Value = kendo.toString(this.value(), 'd');
  console.log(Value);
  uplV2.getDataGridLog(new Date(Value));
  uplV2.TradeDate(moment(new Date(Value)).format("YYYY-MM-DD"));

  var Value = $('.k-nav-fast').html().split(" ");
  var VarMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MonthsInt = VarMonths.indexOf(Value[0]) + 1;
  var MonthsStr = "";
  if (MonthsInt < 10) {
    MonthsStr = "0" + MonthsInt;
  } else {
    MonthsStr = MonthsInt;
  }

  var DateNavgate = new Date(Value[1] + '-' + MonthsStr + '-' + '01');
  var lastDay = new Date(DateNavgate.getFullYear(), DateNavgate.getMonth() + 1, 0);
  uplV2.dateEvent(moment(new Date(DateNavgate)).format("YYYY-MM-DD"), moment(new Date(lastDay)).format("YYYY-MM-DD"));
  uplV2.LastprocessingLog(uplV2.TradeDate());
}

uplV2.refreshColor = function () {
  var Value = $('.k-nav-fast').html().split(" ");
  var VarMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MonthsInt = VarMonths.indexOf(Value[0]) + 1;
  var MonthsStr = "";
  if (MonthsInt < 10) {
    MonthsStr = "0" + MonthsInt;
  } else {
    MonthsStr = MonthsInt;
  }

  var DateNavgate = new Date(Value[1] + '-' + MonthsStr + '-' + '01');
  var lastDay = new Date(DateNavgate.getFullYear(), DateNavgate.getMonth() + 1, 0);
  uplV2.dateEvent(moment(new Date(DateNavgate)).format("YYYY-MM-DD"), moment(new Date(lastDay)).format("YYYY-MM-DD"));

}

uplV2.onNavigate = function () {
  uplV2.SetWidth();
  setTimeout(function () {
    uplV2.refreshColor();
  }, 1000);

}

uplV2.getDataGridLog = function (TradeDate) {
  var param = {
    TradeDate: moment(TradeDate).format("YYYY-MM-DD"),
  };
  var dataSource = [];
  var url = "/uploadfilev2/getfileuploaded";
  $("#GridLog").html("");
  $("#GridLog").kendoGrid({
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
          if (data.Data.length == 0) {
            return dataSource;
          } else {
            var Data = data.Data;
            var newData = [];
            for (var i in Data) {
              var Details = Data[i].Details;
              for (var d in Details) {
                newData.push({
                  "Seq": d,
                  "FileName": Details[d].FileName,
                  "FileNumber": Details[d].FileNumber,
                  "FilePath": Details[d].FilePath,
                  "FileSize": Details[d].FileSize,
                  "FileType": Details[d].FileType,
                  "IsValid": Details[d].IsValid,
                  "Message": Details[d].Message,
                  "ProcessingPercentage": Details[d].ProcessingPercentage,
                  "Remark": Details[d].Remark,
                  "SkipRow": Details[d].SkipRow,
                  "Status": Details[d].Status,
                  "TotalInserted": Details[d].TotalInserted,
                  "TotalRowFlatFile": Details[d].TotalRowFlatFile,
                  "UploadPercentage": Details[d].UploadPercentage,
                  "CutOffInfo": Details[d].CutOffInfo,
                });
              }
            }
            return newData;
          }
        },
        // total: "Data.Count",
      },
      pageSize: 10,
      // serverPaging: true,
      // serverSorting: true,
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    excel: {
      allPages: true,
      fileName: "log.xlsx"
    },
    columnMenu: false,
    dataBound: function (e) {
      var grid = this;
      $(".progress-detail").each(function () {
        var x = $(this);
        $(this).kendoProgressBar({
          value: x.attr("data-percentage"),
          type: "percent",
          animation: true,
          min: 0,
          max: 100,
        });

      });
    },
    columns: [
      {
        field: "FileType",
        title: "File Type",
        width: 100,
        template: function (d) {
          if (d.CutOffInfo.length != 0) {
            return "<a href='#' class='grid-select' onclick='uplV2.CutOffInfo( " + JSON.stringify(d.CutOffInfo) + ")'>" + d.FileType + "</a> "
          } else {
            return d.FileType
          }
        }
        // locked: true,
        // lockable: false,
      },
      {
        field: "FileName",
        title: "FileName",
        width: 130,
        // locked: true
      },
      {
        field: "ProcessingPercentage",
        title: "Load to DB (%)",
        width: 120,
        attributes: {"class": "align-right"},
        // locked: true,
        template: "<div style='width: 100%' data-history='#: Seq#' data-percentage='#: ProcessingPercentage #' data-processing='#: IsValid #' class=\"progress-detail p#: Seq#\"></div>",
      },
      {
        field: "TotalInserted",
        title: "Row Inserted",
        width: 120,
        attributes: {"class": "align-right"},
        // locked: true
      },
      {
        field: "IsValid",
        title: "Valid",
        width: 70,
        // locked: true
      },
      {
        field: "Message",
        title: "Message",
        width: 150,
      },
      {
        field: "FileSize",
        title: "FileSize",
        width: 70,
        attributes: {"class": "align-right"}
      },
      {
        field: "UploadPercentage",
        title: "Upload Percentage",
        width: 130,
        attributes: {"class": "align-right"}
      },
      {
        field: "TotalRowFlatFile",
        title: "Total Row File",
        width: 100,
        attributes: {"class": "align-right"}
      },
      {
        field: "Remark",
        title: "Remark",
        width: 150
      }
    ]
  });
}


uplV2.CutOffInfo = function (dataSource) {
  $("#mdlinfo").modal("show");
  $("#nav-dex").css('z-index', '0');
    $("#mdlinfo").modal({
        backdrop: 'static',
        keyboard: false
    });
  $("#GridLogInfo").html("");
  $("#GridLogInfo").kendoGrid({
    dataSource: {
      data: dataSource,
      pageSize: 10,
    },
    resizable: true,
    sortable: true,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    excel: {
      allPages: true,
      fileName: "log.xlsx"
    },
    columnMenu: false,
    columns: [
      {
        field: "ContractCode",
        title: "Contract Code",
        width: 150,
      }, {
        field: "ContractExpiry",
        title: "Contract Expiry",
        width: 150,
        template: "#= moment(ContractExpiry).format('MMMM YYYY') #",
        attributes: {
          "class": "align-center"
        },
      }, {
        field: "Count",
        title: "Total",
        width: 100,
        attributes: {"class": "align-right"},
      }]
  });
}


uplV2.SetWidth = function () {
  $("#calendar").width(screen.width * 0.3);
  $("#calendar").height(screen.height * 0.5);
  $($("#calendar").find('table')).width(screen.width * 0.3);
  $($("#calendar").find('table')).height(screen.height * 0.4);
  $($("#calendar").find('.k-header')).css('background-color', '#fcfcfd').css('font-size', '15px');
  $($("#calendar").find('.k-footer')).css('font-size', '15px');
  $($("#calendar").find('table')).find('th').css('text-align', 'center').css('font-size', '20px')
  $($("#calendar").find('table').find('tbody').find('tr').css('text-align', 'center').css('border', '1px solid #e5e5e5'));
  $($("#calendar").find('table').find('tbody').find('td').css('text-align', 'center').css('border', '1px solid #e5e5e5'));
}

uplV2.dateEvent = function (StartDate, EndDate) {
  var param = {
    "StartDate": StartDate,
    "EndDate": EndDate,
  }
  var url = "/uploadfilev2/getdataformonthly";
  uplV2.loopCalender();
  ajaxPost(url, param, function (res) {
    var SpDate = res.Data;

    for (var i in SpDate) {
      var Colordate = SpDate[i];
      var SpColor = moment(new Date(Colordate.ProcessDate)).format("D-MMMM-YYYY").split("-");
      if (Colordate.FpStatus == true && Colordate.SpLoaded == false && Colordate.MissingSp == false && Colordate.ProcessTrade == false) {
        // console.log("B");
        $("#calendar").find('table').find('tbody').find("td[id=Date" + SpColor[0] + SpColor[1] + SpColor[2] + "]").css('background-color', '#b3afad');
      } else if (Colordate.FpStatus == false && Colordate.SpLoaded == true && Colordate.MissingSp == false && Colordate.ProcessTrade == false) {
        // console.log("C");
        $("#calendar").find('table').find('tbody').find("td[id=Date" + SpColor[0] + SpColor[1] + SpColor[2] + "]").css('background-color', '#b3afad');
      } else if (Colordate.FpStatus == true && Colordate.SpLoaded == true && Colordate.MissingSp == false && Colordate.ProcessTrade == false) {
        // console.log("C");
        $("#calendar").find('table').find('tbody').find("td[id=Date" + SpColor[0] + SpColor[1] + SpColor[2] + "]").css('background-color', '#b3afad');
      } else if (Colordate.FpStatus == true && Colordate.SpLoaded == true && Colordate.MissingSp == true && Colordate.ProcessTrade == false) {
        // console.log("D");
        $("#calendar").find('table').find('tbody').find("td[id=Date" + SpColor[0] + SpColor[1] + SpColor[2] + "]").css('background-color', '#ec981f');
      } else if (Colordate.FpStatus == true && Colordate.SpLoaded == true && Colordate.MissingSp == true && Colordate.ProcessTrade == true) {
        // console.log("E");
        $("#calendar").find('table').find('tbody').find("td[id=Date" + SpColor[0] + SpColor[1] + SpColor[2] + "]").css('background-color', '#469d46');
      }
    }

    var idtd = moment(new Date(uplV2.TradeDate())).format("DMMMMYYYY");
    uplV2.codeRgb(idtd);
  });
}

uplV2.loopCalender = function () {
  var year = $('.k-nav-fast').html().split(" ");
  var VarMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  $.each($("#calendar").find('table').find('td').splice(0, 42), function (index, value) {
    if ($($(value).find('a')[0]).attr("data-value") != undefined) {
      var Iddate = $($(value).find('a')[0]).attr("data-value");
      var ArrGenID = Iddate.split("/");
      $(this).attr('id', "Date" + ArrGenID[2] + VarMonths[ArrGenID[1]] + ArrGenID[0]);
    }
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

    uplV2.TempFileName(dataFile);
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
  var listFile = uplV2.TempFileName();
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
  uplV2.TempFileName([]);
  uplV2.TempFileName(dataFile);
}

uplV2.codeRgb = function (idtd) {
  var rgb = $("#calendar").find('table').find('tbody').find("td[id=Date" + idtd + "]").css('background-color');
  var Day = moment(new Date(uplV2.TradeDate())).format("dddd MMMYYYY").split(" ")[0];
  // console.log(rgb);
  if (model.Approve() == "true") {
    uplV2.btnUpload(false);
    uplV2.btnLock(false);
    uplV2.btnUnlock(true);
    uplV2.btnCheckSettlementPrice(false);
    uplV2.btnProcestradingFile(false);
    uplV2.btnPreprocess(true);

    if (Day == "Sunday" || Day == "Saturday") {
      uplV2.btnUpload(true);
      uplV2.btnLock(false);
      uplV2.btnUnlock(false);
      uplV2.btnCheckSettlementPrice(false);
      uplV2.btnProcestradingFile(false);
      uplV2.btnPreprocess(false);
    } else {
      if (rgb == "rgb(70, 157, 70)") {
        // Green
        uplV2.btnUpload(false);
        uplV2.btnLock(false);
        uplV2.btnUnlock(true);
        uplV2.btnCheckSettlementPrice(false);
        uplV2.btnProcestradingFile(false);
        uplV2.btnPreprocess(true);
      } else if (rgb == "rgb(179, 175, 173)" && (model.Edit() == "true" || model.Create() == "true")) {

        // Brown
        if (model.Process != false) {
          uplV2.btnUpload(true);
          uplV2.btnLock(false);
          uplV2.btnUnlock(false);
          uplV2.btnCheckSettlementPrice(true);
          uplV2.btnProcestradingFile(false);
          uplV2.btnPreprocess(false);
        }
      } else if (rgb == "rgb(236, 152, 31)" && model.Process() == "true") {
        // Orange
        uplV2.btnUpload(false);
        uplV2.btnLock(false);
        uplV2.btnUnlock(false);
        uplV2.btnCheckSettlementPrice(false);
        uplV2.btnProcestradingFile(true);
        uplV2.btnPreprocess(false);
      } else if (model.Edit() == "true" || model.Create() == "true") {
        uplV2.btnUpload(true);
        uplV2.btnLock(false);
        uplV2.btnUnlock(false);
        uplV2.btnCheckSettlementPrice(false);
        uplV2.btnProcestradingFile(false);
        uplV2.btnPreprocess(false);
      }
    }

  }
}

$(document).ready(function () {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  var valTradeDate;
  if (hashes[0].indexOf("default") < 0) {
    valTradeDate = new Date(hashes[0].split("=")[1]);
  } else {
    valTradeDate = new Date(getDefaultDatetimepicker());
  }

  $("#calendar").kendoCalendar({
    value: valTradeDate,
    change: uplV2.onChange,
    navigate: uplV2.onNavigate,
    min: new Date(2016, 4, 2),
    max: new Date()
  });

  uplV2.SetWidth();
  uplV2.getDataGridLog(valTradeDate);
  uplV2.TradeDate(moment(valTradeDate).format("YYYY-MM-DD"));
  uplV2.dateEvent(moment(valTradeDate).format("YYYY-MM-01"), moment(valTradeDate).format("YYYY-MM-DD"));

  $("#mdlFxRate").on('hidden.bs.modal', function () {
    uplV2.precesstradingFie();
  });

  $(".k-nav-prev").click(function () {
    uplV2.playControl("back");
  })

  $(".k-nav-next").click(function () {
    uplV2.playControl("next");
  })
  $("#mdlQualityControl").on("shown.bs.modal", function () {
    $("#GridAccount").data("kendoGrid").refresh();
    $("#GridClearer").data("kendoGrid").refresh();
    $("#GridContract").data("kendoGrid").refresh();
  });
});