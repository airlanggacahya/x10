var rptClearerSumm = {
  process: ko.observable(false),
  visbleAllRptClients: ko.observable(true),
  tradeDate: ko.observable(new Date()),
  listClients: ko.observableArray([]),
  listReportType: ko.observableArray([
    {"text": "All", "value": "All"},
    {"text": "New Trade", "value": "NewTrade"},
    {"text": "Purchase & Sale", "value": "PurchaseAndSales"},
    {"text": "Trade Fees", "value": "TradeFees"},
    {"text": "Open Trade", "value": "OpenTrade"}
  ]),
  reportType: ko.observable("All"),
  clients: ko.observable(""),
  lenRpt: ko.observableArray([]),
};

rptClearerSumm.tradeDate.subscribe(function(value){
    if(model.View() != "false"){
        rptClearerSumm.search();
    }
});

rptClearerSumm.clients.subscribe(function(value){
    if(model.View() != "false"){
        rptClearerSumm.search();
    }
});

rptClearerSumm.reportType.subscribe(function(value){
    if(model.View() != "false"){
        rptClearerSumm.search();
    }
});

rptClearerSumm.search = function () {
  var typeReport = rptClearerSumm.reportType();
  switch (typeReport) {
    case "All":
      rptClearerSumm.ClientSummary();
      break;
    default:
      break;
  }
}

rptClearerSumm.refresh = function () {
  rptClearerSumm.tradeDate(new Date());
  rptClearerSumm.getClients();
  rptClearerSumm.ClientSummary();
}

rptClearerSumm.exportReport = function () {
  rptClearerSumm.search();
  var TextHtml = "";
  var htmlTable = document.getElementsByClassName("reportZep");
  if (htmlTable != undefined){
    var Report = $("<div />").append($(htmlTable)).html();
    Report = Report.replace("/static/img/logo-ecdoc.png", "../../img/logo-ecdoc.png");
    TextHtml = TextHtml + Report.toString();
  }
  
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "/allreport/writefilehtml");

  var hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "TextHtml");
  hiddenField.setAttribute("value", TextHtml);
  form.appendChild(hiddenField);
  hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "TradeDate");
  hiddenField.setAttribute("value", moment(rptClearerSumm.tradeDate()).format("YYYY-MM-DD"));
  form.appendChild(hiddenField);
  hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "Account");
  hiddenField.setAttribute("value", rptClearerSumm.clients());
  form.appendChild(hiddenField);
  document.body.appendChild(form);
  setTimeout(function () {
    form.submit();
  }, 2500);
}

rptClearerSumm.ClientSummary = function (){
    var param = {
      TradeDate: moment(rptClearerSumm.tradeDate()).format("YYYY-MM-DD"),
      Clients: rptClearerSumm.clients
    };
    var url = "/reportclient/clientsummary";
    ajaxPost(url, param, function (res) {
      var SummaryClient = res.SummaryClient;
      $('#allClientReport').html("");
      $divAllReport = $('#allClientReport');
      $tableMain = $("<table width='100%' class='reportZep' style='font-family: 'Courier New''></table>");
      $tableMain.appendTo($divAllReport);
      $theadMain = $("<thead>" +
              "<tr>" +
              "<th style='text-align: left; width: 15%'>Trade Date</th>" +
              "<th style='text-align: left; width: 1%'>:</th>" +
              "<th style='text-align: left; width: 20%'>"+ moment(rptClearerSumm.tradeDate()).format("dddd, DD-MMMM-YYYY") +"</th>" +
              "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
              "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
              "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
              "</tr>" +
              "<tr>" +
              "<th style='text-align: left'>Client</th>" +
              "<th style='text-align: left'>:</th>" +
              "<th style='text-align: left'>"+rptClearerSumm.clients()+"</th>" +
              "<th>&nbsp;</th>" +
              "<th>&nbsp;</th>" +
              "</tr>" +
              "<tr>" +
              "</tr>" +
              "</thead>");
      $theadMain.appendTo($tableMain);

      if (SummaryClient.length != 0){
        $tbodySummaryClient = $("<tbody></tbody>");
        $tbodySummaryClient.appendTo($tableMain);

        $trSummaryClient = $("<tr>" +
                "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Summary Clearer</td>" +
                "</tr>");
        $trSummaryClient.appendTo($tbodySummaryClient);

        $trSummaryClient = $("<tr></tr>");
        $trSummaryClient.appendTo($tbodySummaryClient);

        $tdSummaryClient = $("<td colspan='6'></td>");
        $tdSummaryClient.appendTo($trSummaryClient);

        $subSummaryClient = $("<table style='width:100%; border:0'></table>");
        $subSummaryClient.appendTo($tdSummaryClient);

        $tr = $("<tr>" +
                "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align: left; font-weight: bold; font-size: 10px' colspan='7'>Clients Summary : " + rptClearerSumm.clients() +"</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='text-align: left; font-size: 10px; font-weight: bold' colspan='7'>Comsolidate Financial Statement as of : " + moment(rptClearerSumm.tradeDate()).format("dddd, DD-MMMM-YYYY") + " </td>" +
                "</tr>");
        $tr.appendTo($subSummaryClient);
        

        $tbodySummaryClientValue = $("<tbody></tbody>");
        $tbodySummaryClientValue.appendTo($tableMain);
        $trHederClientCode = $("<tr></tr>");
        $trHederClientCode.appendTo($tbodySummaryClientValue);
        $tdClientSummary = $("<td colspan='6' style='text-align: left; width: 12%;  font-size: 10px'></td>");
        $tdClientSummary.appendTo($trHederClientCode);

        $subSummaryClientvalue = $("<table style='border:0'></table>");
        $subSummaryClientvalue.appendTo($tdClientSummary);

        var borderPx = (SummaryClient.length - 1);
        var px = 1;
        var colspanHeader = (SummaryClient.length);
        var lastvalue = (SummaryClient.length-1);

        $trHederCurrCodeValue = $("<tr></tr>");
        $trHederCurrCodeValue.appendTo($subSummaryClientvalue);
        $tdCurrCode = $("<td style='text-align: left; width: 12%;  font-size: 10px'></td>");
        $tdCurrCode.appendTo($trHederCurrCodeValue);
        for (var SumIndex in SummaryClient){
            $tdCurrCode = $("<td style='text-align: center; font-weight: bold;  width: 12%; font-size: 10px;text-align: right; padding-right:20px'>"+SummaryClient[SumIndex].CurrencyCode+"</td>");
            $tdCurrCode.appendTo($trHederCurrCodeValue);
        }

        $trFXSPORTRATE = $("<tr></tr>");
        $trFXSPORTRATE.appendTo($subSummaryClientvalue);
        $tdFXSPORTRATE = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px; padding-right:20px'>FX SPOT RATE</td>");
        $tdFXSPORTRATE.appendTo($trFXSPORTRATE);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdFXSPORTRATE = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].SpotRate, "n4")+"</td>");
            $tdFXSPORTRATE.appendTo($trFXSPORTRATE);
        }
        px = 1;
        $trACCOUNTCASHBAL = $("<tr></tr>");
        $trACCOUNTCASHBAL.appendTo($subSummaryClientvalue);
        $tdACCOUNTCASHBAL = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>ACCOUNT CASH BAL</td>");
        $tdACCOUNTCASHBAL.appendTo($trACCOUNTCASHBAL);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdACCOUNTCASHBAL = $("<td style='border-right: "+px+"px solid; text-align: right;  font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].AccountCashBalance, "n2")+"</td>");
            $tdACCOUNTCASHBAL.appendTo($trACCOUNTCASHBAL);
        }

        px = 1;
        $trPAYRECEIPTS = $("<tr></tr>");
        $trPAYRECEIPTS.appendTo($subSummaryClientvalue);
        $tdPAYRECEIPTS = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>PAYMENTS/RECEIPTS</td>");
        $tdPAYRECEIPTS.appendTo($trPAYRECEIPTS);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdPAYRECEIPTS = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].PaymentReceipt, "n2")+"</td>");
            $tdPAYRECEIPTS.appendTo($trPAYRECEIPTS);
        }

        px = 1;
        $trFXTRADES = $("<tr></tr>");
        $trFXTRADES.appendTo($subSummaryClientvalue);
        $tdFXTRADES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>FX TRADES</td>");
        $tdFXTRADES.appendTo($trFXTRADES);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdFXTRADES = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>0</td>");
            $tdFXTRADES.appendTo($trFXTRADES);
        }

        px = 1;
        $trREALIZEDPL = $("<tr></tr>");
        $trREALIZEDPL.appendTo($subSummaryClientvalue);
        $tdREALIZEDPL = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>REALIZED P/L</td>");
        $tdREALIZEDPL.appendTo($trREALIZEDPL);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdREALIZEDPL = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].RealizeProfitLoss, "n2")+"</td>");
            $tdREALIZEDPL.appendTo($trREALIZEDPL);
        }

        px = 1;
        $trMARKETFEES = $("<tr></tr>");
        $trMARKETFEES.appendTo($subSummaryClientvalue);
        $MARKETFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MARKET FEES</td>");
        $MARKETFEES.appendTo($trMARKETFEES);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $MARKETFEES = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].MarketFee, "n2")+"</td>");
            $MARKETFEES.appendTo($trMARKETFEES);
        }

        px = 1;
        $trCLRCOMMISSION = $("<tr></tr>");
        $trCLRCOMMISSION.appendTo($subSummaryClientvalue);
        $tdCLRCOMMISSION = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;CLR COMMISSION</td>");
        $tdCLRCOMMISSION.appendTo($trCLRCOMMISSION);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdCLRCOMMISSION = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].ClrCommission, "n2")+"</td>");
            $tdCLRCOMMISSION.appendTo($trCLRCOMMISSION);
        }

        px = 1;
        $trNFAFEES = $("<tr></tr>");
        $trNFAFEES.appendTo($subSummaryClientvalue);
        $tdNFAFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;NFA FEES</td>");
        $tdNFAFEES.appendTo($trNFAFEES);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdNFAFEES = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].NfaFee, "n2")+"</td>");
            $tdNFAFEES.appendTo($trNFAFEES);
        }

        px = 1;
        $trMISCFEES = $("<tr></tr>");
        $trMISCFEES.appendTo($subSummaryClientvalue);
        $MISCFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MISC FEES</td>");
        $MISCFEES.appendTo($trMISCFEES);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $MISCFEES = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].MiscFee, "n2")+"</td>");
            $MISCFEES.appendTo($trMISCFEES);
        }

        px = 1;
        $trTOTALFEES = $("<tr></tr>");
        $trTOTALFEES.appendTo($subSummaryClientvalue);
        $tdTOTALFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>TOTAL FEES</td>");
        $tdTOTALFEES.appendTo($trTOTALFEES);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdTOTALFEES = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].TotalFee, "n2")+"</td>");
            $tdTOTALFEES.appendTo($trTOTALFEES);
        }

        px = 1;
        $trNEWCASHBALANCE = $("<tr></tr>");
        $trNEWCASHBALANCE.appendTo($subSummaryClientvalue);
        $tdNEWCASHBALANCE = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>NEW CASH BALANCE</td>");
        $tdNEWCASHBALANCE.appendTo($trNEWCASHBALANCE);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdNEWCASHBALANCE = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].NewCashBalance, "n2")+"</td>");
            $tdNEWCASHBALANCE.appendTo($trNEWCASHBALANCE);
        }

        px = 1;
        $trOPENTRADEEQUITY = $("<tr></tr>");
        $trOPENTRADEEQUITY.appendTo($subSummaryClientvalue);
        $tdOPENTRADEEQUITY = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>OPEN TRADE EQUITY</td>");
        $tdOPENTRADEEQUITY.appendTo($trOPENTRADEEQUITY);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdOPENTRADEEQUITY = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].OpenTradeEquity, "n2")+"</td>");
            $tdOPENTRADEEQUITY.appendTo($trOPENTRADEEQUITY);
        }

        px = 1;
        $trTOTALEQUITY = $("<tr></tr>");
        $trTOTALEQUITY.appendTo($subSummaryClientvalue);
        $tdTOTALEQUITY = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>TOTAL EQUITY</td>");
        $tdTOTALEQUITY.appendTo($trTOTALEQUITY);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdTOTALEQUITY = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].TotalEquity, "n2")+"</td>");
            $tdTOTALEQUITY.appendTo($trTOTALEQUITY);
        }

        px = 1;
        $trNETLIQUIDVALUE = $("<tr></tr>");
        $trNETLIQUIDVALUE.appendTo($subSummaryClientvalue);
        $tdNETLIQUIDVALUE = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>NET LIQUID. VALUE</td>");
        $tdNETLIQUIDVALUE.appendTo($trNETLIQUIDVALUE);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdNETLIQUIDVALUE = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].NewLiquidValue, "n2")+"</td>");
            $tdNETLIQUIDVALUE.appendTo($trNETLIQUIDVALUE);
        }

        px = 1;
        $trMARGDEFEXCESS = $("<tr></tr>");
        $trMARGDEFEXCESS.appendTo($subSummaryClientvalue);
        $tdMARGDEFEXCESS = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 10px'>MARG. DEF/EXCESS</td>");
        $tdMARGDEFEXCESS.appendTo($trMARGDEFEXCESS);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdMARGDEFEXCESS = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>0</td>");
            $tdMARGDEFEXCESS.appendTo($trMARGDEFEXCESS);
        }

        px = 1;
        $trMtdPaymentReceipt = $("<tr></tr>");
        $trMtdPaymentReceipt.appendTo($subSummaryClientvalue);
        $tdMtdPaymentReceipt = $("<td style='border-right: 1px solid; font-weight: bold; text-align: left; font-size: 10px'>MTD PAY./RCPTS</td>");
        $tdMtdPaymentReceipt.appendTo($trMtdPaymentReceipt);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdMtdPaymentReceipt = $("<td style='border-right: "+px+"px solid;text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].MtdPaymentReceipt, "n2")+"</td>");
            $tdMtdPaymentReceipt.appendTo($trMtdPaymentReceipt);
        }

        px = 1;
        $trMtdRealizedPl = $("<tr></tr>");
        $trMtdRealizedPl.appendTo($subSummaryClientvalue);
        $tdMtdRealizedPl = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>MTD REALIZED</td>");
        $tdMtdRealizedPl.appendTo($trMtdRealizedPl);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdMtdRealizedPl = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].MtdRealizedPl, "n2")+"</td>");
            $tdMtdRealizedPl.appendTo($trMtdRealizedPl);
        }

        px = 1;
        $trMTDMARKET = $("<tr></tr>");
        $trMTDMARKET.appendTo($subSummaryClientvalue);
        $tdMTDMARKET = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD MARKET</td>");
        $tdMTDMARKET.appendTo($trMTDMARKET);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdMTDMARKET = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].MtdMarketFee, "n2")+"</td>");
            $tdMTDMARKET.appendTo($trMTDMARKET);
        }

        px = 1;
        $trMTDCLR = $("<tr></tr>");
        $trMTDCLR.appendTo($subSummaryClientvalue);
        $tdMTDCLR = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD CLR</td>");
        $tdMTDCLR.appendTo($trMTDCLR);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdMTDCLR = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].MtdClrCommission, "n2")+"</td>");
            $tdMTDCLR.appendTo($trMTDCLR);
        }

        px = 1;
        $trMtdNfaFee = $("<tr></tr>");
        $trMtdNfaFee.appendTo($subSummaryClientvalue);
        $tdMtdNfaFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD NFA FEES</td>");
        $tdMtdNfaFee.appendTo($trMtdNfaFee);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdMtdNfaFee = $("<td style='border-right: "+px+"px solid; text-align: right;  font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].MtdNfaFee, "n2")+"</td>");
            $tdMtdNfaFee.appendTo($trMtdNfaFee);
        }

        px = 1;
        $trMtdMiscFee = $("<tr></tr>");
        $trMtdMiscFee.appendTo($subSummaryClientvalue);
        $tdMtdMiscFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD MISC FEES</td>");
        $tdMtdMiscFee.appendTo($trMtdMiscFee);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdMtdMiscFee = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].MtdMiscFee, "n2")+"</td>");
            $tdMtdMiscFee.appendTo($trMtdMiscFee);
        }

        px = 1;
        $trMtdTotalFee = $("<tr></tr>");
        $trMtdTotalFee.appendTo($subSummaryClientvalue);
        $tdMtdTotalFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>MTD TTL COMM/FEES</td>");
        $tdMtdTotalFee.appendTo($trMtdTotalFee);
        for (var i in SummaryClient){
            if(i == borderPx){
              px = 1;
            }
            $tdMtdTotalFee = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px; padding-right:10px'>"+kendo.toString(SummaryClient[i].MtdTotalFee, "n2")+"</td>");
            $tdMtdTotalFee.appendTo($trMtdTotalFee);
        }

        $tbodyTotalSummary = $("<tbody></tbody>");
        $tbodyTotalSummary.appendTo($tableMain);

        $trTotSum = $("<tr></tr>");
        $trTotSum.appendTo($tbodyTotalSummary);

        $tdTotSum = $("<td colspan='6'></td>");
        $tdTotSum.appendTo($trTotSum);

        $subTotSum = $("<table style='width:50%; border:0'></table>");
        $subTotSum.appendTo($tdTotSum);
        var totalSummaryAccount = "";
        var NlvTd4 = 0;
        var NlvTd3 = 0;
        var NlvDiff4 = 0;
        var NlvTd2 = 0;
        var NlvDiff3 = 0;
        var NlvTd1 = 0;
        var NlvDiff2 = 0;
        var NlvTd = 0;
        var NlvDiff1 = 0;
        if (SummaryClient[lastvalue] != undefined){
          totalSummaryAccount = SummaryClient[lastvalue].CurrencyCode.split(" ")[2];
          NlvTd4 = SummaryClient[lastvalue].NlvTd4;
          NlvTd3 = SummaryClient[lastvalue].NlvTd3;
          NlvDiff4 = SummaryClient[lastvalue].NlvDiff4;
          NlvTd2 = SummaryClient[lastvalue].NlvTd2;
          NlvDiff3 = SummaryClient[lastvalue].NlvDiff3;
          NlvTd1 = SummaryClient[lastvalue].NlvTd1;
          NlvDiff2 = SummaryClient[lastvalue].NlvDiff2;
          NlvTd = SummaryClient[lastvalue].NlvTd;
          NlvDiff1 = SummaryClient[lastvalue].NlvDiff1;
        }
        $trTT = $("<tr></tr>");
        $trTT.appendTo($subTotSum);
        $tdTT = $("<td></td>");
        $tdTT.appendTo($trTT);
        $tdTT = $("<td colspan='5' style='font-weight: bold;text-align: left; width: 20%; font-size: 11px; padding-top: 10px'>Last 5 NLV Values:("+totalSummaryAccount+")</td>");
        $tdTT.appendTo($trTT);

        $trT4 = $("<tr></tr>");
        $trT4.appendTo($subTotSum);
        $tdT4 = $("<td></td>");
        $tdT4.appendTo($trT4);
        $tdT4 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 4</td>");
        $tdT4.appendTo($trT4);
        $tdT4 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(NlvTd4, "n2")+"</td>");
        $tdT4.appendTo($trT4);
        $tdT4 = $("<td style='text-align: right; width: 20%; font-size: 11px'>CHG NLV</td>");
        $tdT4.appendTo($trT4);
        $tdT4 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
        $tdT4.appendTo($trT4);

        $trT3 = $("<tr></tr>");
        $trT3.appendTo($subTotSum);
        $tdT3 = $("<td></td>");
        $tdT3.appendTo($trT3);
        $tdT3 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 3</td>");
        $tdT3.appendTo($trT3);
        $tdT3 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(NlvTd3, "n2")+"</td>");
        $tdT3.appendTo($trT3);
        $tdT3 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(NlvDiff4, "n2")+"</td>");
        $tdT3.appendTo($trT3);
        $tdT3 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
        $tdT3.appendTo($trT3);

        $trT2 = $("<tr></tr>");
        $trT2.appendTo($subTotSum);
        $tdT2 = $("<td></td>");
        $tdT2.appendTo($trT2);
        $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 2</td>");
        $tdT2.appendTo($trT2);
        $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(NlvTd2, "n2")+"</td>");
        $tdT2.appendTo($trT2);
        $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(NlvDiff3, "n2")+"</td>");
        $tdT2.appendTo($trT2);
        $tdT2 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
        $tdT2.appendTo($trT2);

        $trT1 = $("<tr></tr>");
        $trT1.appendTo($subTotSum);
        $tdT1 = $("<td></td>");
        $tdT1.appendTo($trT1);
        $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 1</td>");
        $tdT1.appendTo($trT1);
        $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(NlvTd1, "n2")+"</td>");
        $tdT1.appendTo($trT1);
        $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(NlvDiff2, "n2")+"</td>");
        $tdT1.appendTo($trT1);
        $tdT1 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
        $tdT1.appendTo($trT1);

        $trT0 = $("<tr></tr>");
        $trT0.appendTo($subTotSum);
        $tdT0 = $("<td></td>");
        $tdT0.appendTo($trT0);
        $tdT0 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T</td>");
        $tdT0.appendTo($trT0);
        $tdT0 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(NlvTd,"n2")+"</td>");
        $tdT0.appendTo($trT0);
        $tdT0 = $("<td style='font-weight: bold; text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(NlvDiff1, "n2")+"</td>");
        $tdT0.appendTo($trT0);
        $tdT0 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'>(today)</td>");
        $tdT0.appendTo($trT0);
      }
    });
}

rptClearerSumm.getClients = function () {
  var param = {
  };
  var url = "/reportclient/getclearer";
  ajaxPost(url, param, function (res) {
    listClients = [];
    dataClients = res;
    for (var i in dataClients) {
      listClients.push({
        "text": dataClients[i]._id.clientnumber,
        "value": dataClients[i]._id.clientnumber,
      });
    }
    rptClearerSumm.listClients(_.sortBy(listClients, 'text'));
    rptClearerSumm.clients(listClients[1].text);
  });
}

$(document).ready(function () {
  rptClearerSumm.getClients();
  rptClearerSumm.ClientSummary();
  $("#TradeDate").closest("span.k-datepicker").width(130);
});