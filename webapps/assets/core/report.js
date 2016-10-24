var report = {
  process: ko.observable(false),
  tradeDate: ko.observable(new Date()),
  dateReport: ko.observable(),
  listAccount: ko.observableArray([]),
  listClients: ko.observableArray([]),
  listReportType: ko.observableArray([
    {"text": "All", "value": "All"},
    {"text": "New Trade", "value": "NewTrade"},
    {"text": "Purchase & Sale", "value": "PurchaseAndSales"},
    {"text": "Trade Fees", "value": "TradeFees"},
    {"text": "Open Trade", "value": "OpenTrade"}
  ]),
  account: ko.observable(""),
  clients: ko.observable(""),
  reportType: ko.observable("All"),
  hTradeDate: ko.observable(""),
  hClient: ko.observable(""),
  hAccount: ko.observable(""),
  hDescription: ko.observable(""),
  DataHeader: ko.observableArray(""),
  // Visble Report
  visbleRptAll: ko.observable(true),
  visbleRptNewTrade: ko.observable(false),
  visbleRptPurchaseAndSales: ko.observable(false),
  visbleRptTradeFees: ko.observable(false),
  visbleRptOpenTrade: ko.observable(false),
};

report.printData = function () {
  var divToPrint = document.getElementsByClassName("printTable")[0];
  newWin = window.open("");
  newWin.document.write(divToPrint.outerHTML);
  newWin.print();
  newWin.close();
}

report.exportReport = function () {
  report.search();
  var htmlTable = document.getElementById("reportZep");
  var TextHtml = "";
  if (htmlTable != undefined){
    var Report = $("<div />").append($(htmlTable)).html();
    Report = Report.replace("/static/img/logo-ecdoc.png", "../../img/logo-ecdoc.png");
    TextHtml = Report.toString();
    $("#reportZep").html("");
  }
 

  var param = {
    TextHtml: TextHtml,
    TradeDate: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Account: report.account()
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
  hiddenField.setAttribute("value", moment(report.tradeDate()).format("YYYY-MM-DD"));
  form.appendChild(hiddenField);
  hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "Account");
  hiddenField.setAttribute("value", report.account());
  form.appendChild(hiddenField);
  document.body.appendChild(form);
  setTimeout(function () {
    form.submit();
  }, 2500);
}

report.search = function () {
  typeReport = report.reportType();
  switch (typeReport) {
    case "NewTrade":
      report.visbleRptAll(false);
      report.visbleRptNewTrade(true);
      report.visbleRptPurchaseAndSales(false);
      report.visbleRptTradeFees(false);
      report.visbleRptOpenTrade(false);
      report.getDataReportNewTradeAccount();
      break;
    case "PurchaseAndSales":
      report.visbleRptAll(false);
      report.visbleRptNewTrade(false);
      report.visbleRptPurchaseAndSales(true);
      report.visbleRptTradeFees(false);
      report.visbleRptOpenTrade(false);
      report.getDataReportPurchaseAndSalesAccount();
      break;
    case "TradeFees":
      report.visbleRptAll(false);
      report.visbleRptNewTrade(false);
      report.visbleRptPurchaseAndSales(false);
      report.visbleRptTradeFees(true);
      report.visbleRptOpenTrade(false);
      report.getDataReportTradeFeesAccount();
      break;
    case "OpenTrade":
      report.visbleRptAll(false);
      report.visbleRptNewTrade(false);
      report.visbleRptPurchaseAndSales(false);
      report.visbleRptTradeFees(false);
      report.visbleRptOpenTrade(true);
      report.getDataReportOpenTradeAccount();
      break;
    default:
      report.visbleRptAll(true);
      report.visbleRptNewTrade(false);
      report.visbleRptPurchaseAndSales(false);
      report.visbleRptTradeFees(false);
      report.visbleRptOpenTrade(false);
      report.getDataReportIceTradingRpt();
      break;
  }
}

report.refresh = function () {
  report.tradeDate(new Date());
  report.getAccount();
  report.getDataReportIceTradingRpt();
}

report.getAccount = function () {
  var param = {
  };
  var url = "/allreport/getaccount";
  ajaxPost(url, param, function (res) {
    listAccount = [];
    dataAccount = res;
    for (var i in dataAccount) {
      listAccount.push({
        "text": dataAccount[i]._id.account,
        "value": dataAccount[i]._id.account,
      });
    }
    report.listAccount(_.sortBy(listAccount, 'text'));
    report.account(listAccount[1].text);
    report.getDataReportIceTradingRpt();
  });
}

report.getDataReportIceTradingRpt = function () {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Account: report.account(),
  };
  var dataValueReport = [];
  var url = "/allreport/allreport";

  ajaxPost(url, param, function (res) {
    var dateHeader = res.Data.Header;
    var dataReport = Enumerable.From(res.Data.Details).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ToArray();
    var detailDeskFee = res.Data.DetailDeskFee;


    if (dateHeader == undefined) {
      return swal("Confirmation!", "Report Trade Date " + moment(report.tradeDate()).format("YYYY-MM-DD") + " Is Empty", "error");
    }
    report.hTradeDate = moment(new Date(dateHeader.TransactionDate)).format("dddd, DD-MMMM-YYYY");
    report.hClient = dateHeader.Clientnumber;
    report.hAccount = dateHeader.AccountNumber;
    report.hDescription = dateHeader.Description;

    $('#HeaderAllreport').html("");
    $divAllReport = $('#HeaderAllreport');
    $tableMain = $("<table width='100%' id='reportZep' style='font-family: 'Courier New''></table>");
    $tableMain.appendTo($divAllReport);
    $theadMain = $("<thead>" +
            "<tr>" +
            "<th style='text-align: left; width: 15%'>Trade Date</th>" +
            "<th style='text-align: left; width: 1%'>:</th>" +
            "<th style='text-align: left; width: 20%'>" + report.hTradeDate + "</th>" +
            "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
            "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
            "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>Client</th>" +
            "<th style='text-align: left'>:</th>" +
            "<th style='text-align: left'>" + report.hClient + "</th>" +
            "<th>&nbsp;</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>Account</th>" +
            "<th style='text-align: left'>:</th>" +
            "<th style='text-align: left'>" + report.hAccount + "</th>" +
            "<th style='text-align: left'>" + report.hDescription + "</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</thead>");
    $theadMain.appendTo($tableMain);

    // ==== Tbody Report New Trades ==============
    $tbodyNewTrades = $("<tbody></tbody>");
    $tbodyNewTrades.appendTo($tableMain);

    $trNewTrades = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>New Trades</td>" +
            "</tr>");
    $trNewTrades.appendTo($tbodyNewTrades);

    $trNewTrades = $("<tr></tr>");
    $trNewTrades.appendTo($tbodyNewTrades);

    $tdNewTrades = $("<td colspan='6'></td>");
    $tdNewTrades.appendTo($trNewTrades);

    $subTableNewTrades = $("<table style='width:100%; border:0'></table>");
    $subTableNewTrades.appendTo($tdNewTrades);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px'>TRADE NUMBER</th>" +
            "<th style='text-align: left; font-size: 10px'>CONTRACT</th>" +
            "<th style='text-align: left; font-size: 10px'>MONTH</th>" +
            "<th style='text-align: center; font-size: 10px'>BUY</th>" +
            "<th style='text-align: center; font-size: 10px'>SELL</th>" +
            "<th style='text-align: right; font-size: 10px'>PRICE</th>" +
            "<th style='text-align: center; font-size: 10px'>CUR</th>" +
            "</tr>");
    $tr.appendTo($subTableNewTrades);
    $tr = $("<tr>" +
            "<th style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='8'></th>" +
            "</tr>");
    $tr.appendTo($subTableNewTrades);
    for (var i in dataReport) {
      var item = Enumerable.From(dataReport[i].item).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ThenBy("$.TransactionType").ToArray();
      var buyGroup = 0;
      var SellGroup = 0;
      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='8'>" + dataReport[i].Fullname + "</td>" +
              "</tr>");
      $tr.appendTo($subTableNewTrades);
      for (var j in item) {
        var Buy = "";
        var SELL = "";
        if (item[j].TransactionType == "B") {
          Buy = item[j].Qty;
          SELL = "";
          buyGroup = buyGroup + item[j].Qty;
          SellGroup = SellGroup + 0;
        } else {
          Buy = "";
          SELL = item[j].Qty;
          buyGroup = buyGroup + 0;
          SellGroup = SellGroup + item[j].Qty;
        }

        $tr = $("<tr>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(new Date(item[j].TransactionDateString)).format("D-MMM-YY") + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + item[j].TransactionID + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + item[j].ProductID + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(item[j].ContractExpiry).format("MMM-YY") + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + Buy + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + SELL + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + item[j].PriceReport.toFixed(4) + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + item[j].Currency + "</td>" +
                "</tr>");
        $tr.appendTo($subTableNewTrades);
      }

      // ====Buy ====
      if (buyGroup == 0) {
        buyGroup = "";
      } else {
        buyGroup = buyGroup.toString() + "*";
      }

      // ====Sell ====
      if (SellGroup == 0) {
        SellGroup = "";
      } else {
        SellGroup = SellGroup.toString() + "*";
      }

      $tr = $("<tr>" +
              "<td colspan='4'></td>" +
              "<td style='text-align: center; font-size: 10px;font-weight:bold'>" + buyGroup + "</td>" +
              "<td style='text-align: center; font-size: 10px;font-weight:bold'>" + SellGroup + "</td>" +
              "<td colspan='2'></td>" +
              "</tr>");
      $tr.appendTo($subTableNewTrades);
    }

    // ==== Tbody Report Trades Fees ========================================================================================================
    var dataReportfees = Enumerable.From(res.Data.TradeFeeData).OrderBy("$.Currency").ToArray();
    $tbodyTradesFees = $("<tbody></tbody>");
    $tbodyTradesFees.appendTo($tableMain);

    $trTradesFees = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Trades Fees</td>" +
            "</tr>");
    $trTradesFees.appendTo($tbodyTradesFees);

    $trTradesFees = $("<tr></tr>");
    $trTradesFees.appendTo($tbodyTradesFees);

    $tdTradesFees = $("<td colspan='6'></td>");
    $tdTradesFees.appendTo($trTradesFees);

    $subTradesFees = $("<table style='width:100%; border:0'></table>");
    $subTradesFees.appendTo($tdTradesFees);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px'>CONTRACT AND DELIVERY</th>" +
            "<th style='text-align: right; font-size: 10px'>LOTS</th>" +
            "<th style='text-align: right; font-size: 10px'>MARKET FEES</th>" +
            "<th style='text-align: right; font-size: 10px'>CLR COMM</th>" +
            "<th style='text-align: right; font-size: 10px'>NFA</th>" +
            "<th style='text-align: right; font-size: 10px'>MISC FEES</th>" +
            "</tr>");
    $tr.appendTo($subTradesFees);
    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>");
    $tr.appendTo($subTradesFees);

    for (var i in dataReportfees) {
      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='6'>" + dataReportfees[i].Currency + "</td>" +
              "</tr>");
      $tr.appendTo($subTradesFees);

      var totMarketFees = 0;
      var totCLRComm = 0;
      var totNFA = 0;
      var totMiscFees = 0;

      for (var s in dataReportfees[i].item){
        var ItemReportfees = Enumerable.From(dataReportfees[i].item).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
        $tr = $("<tr>" +
              "<td style='text-align: left; font-size: 9px'>" + ItemReportfees[s].Fullname + "  " + moment(ItemReportfees[s].Contractexpiry).format("MMM-YY") + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + ItemReportfees[s].Lots + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (ItemReportfees[s].Marketfee * -1).toFixed(2) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (ItemReportfees[s].Clrcommission * -1).toFixed(2) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (ItemReportfees[s].Nfafee * -1).toFixed(2) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (ItemReportfees[s].Miscfee * -1).toFixed(2) + "</td>" +
              "</tr>");
        $tr.appendTo($subTradesFees);

        totMarketFees = totMarketFees + ItemReportfees[s].Marketfee;
        totCLRComm = totCLRComm + ItemReportfees[s].Clrcommission;
        totNFA = totNFA + ItemReportfees[s].Nfafee;
        totMiscFees = totMiscFees + ItemReportfees[s].Miscfee;
      }

      
      $tr = $("<tr>" +
            "<td colspan ='2'style='text-align: right; font-size: 10px; font-weight:bold'>TOTAL "+dataReportfees[i].Currency +"</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totMarketFees * -1).toFixed(2) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totCLRComm * -1).toFixed(2) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totNFA * -1).toFixed(2) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totMiscFees * -1).toFixed(2) + "</td>" +
            "</tr>");
      $tr.appendTo($subTradesFees);
    }

    // ==== Tbody Report Purchases and Sales ===========================================================================================
    var PurchaseSales = Enumerable.From(res.Data.PurchaseSalesData).OrderBy("$.Currency").ToArray();
    $tbodyPurchasesSales = $("<tbody></tbody>");
    $tbodyPurchasesSales.appendTo($tableMain);

    $trPurchasesSales = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Purchases and Sales</td>" +
            "</tr>");
    $trPurchasesSales.appendTo($tbodyPurchasesSales);

    $trPurchasesSales = $("<tr></tr>");
    $trPurchasesSales.appendTo($tbodyPurchasesSales);

    $tdPurchasesSales = $("<td colspan='6'></td>");
    $tdPurchasesSales.appendTo($trPurchasesSales);

    $subTablePurchasesSales = $("<table style='width:100%; border:0'></table>")
    $subTablePurchasesSales.appendTo($tdPurchasesSales);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px; width: 15%'>TRADE NUMBER</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>LONG</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>SHORT</th>" +
            "<th style='text-align: right; font-size: 10px; width: 10%'>PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>CUR</th>" +
            "<th style='text-align: right; font-size: 10px; width: 15%'>CONTRACT VALUE</th>" +
            "</tr>");
    $tr.appendTo($subTablePurchasesSales);
    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>");
    $tr.appendTo($subTablePurchasesSales);
    for (var i in PurchaseSales) {
      var TotalUSDPurchase = 0;
      var DetailsPurchaseSales = Enumerable.From(PurchaseSales[i].Details).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ToArray();
      for (var d in DetailsPurchaseSales){
        var LongGroup = 0;
        var ShortGroup = 0;
        var ContValue = 0;
        $tr = $("<tr>" +
                "<td style='font-weight: bold; font-size: 10px' colspan='7'>" + DetailsPurchaseSales[d].Value.Fullname + " " + moment(DetailsPurchaseSales[d].Value.ContractExpiry).format("MMM-YY") + "</td>" +
                "</tr>");
        $tr.appendTo($subTablePurchasesSales);
        var ItemPurchaseSales = Enumerable.From(DetailsPurchaseSales[d].Value.item).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ThenBy("$.TransactionType").ToArray();
        
        for (var s in ItemPurchaseSales){
          var Long = "";
          var Short = "";
          if (ItemPurchaseSales[s].TransactionType == "B") {
            Long = ItemPurchaseSales[s].Qty;
            Short = "";
            LongGroup = LongGroup + ItemPurchaseSales[s].Qty;
            ShortGroup = ShortGroup + 0;
          } else {
            Long = "";
            Short = ItemPurchaseSales[s].Qty;
            LongGroup = LongGroup + 0;
            ShortGroup = ShortGroup + ItemPurchaseSales[s].Qty;
          }
          $tr = $("<tr>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(getUTCDate(ItemPurchaseSales[s].TransactionDate)).format("D-MMM-YY") + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + ItemPurchaseSales[s].TransactionID + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + Long + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + Short + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + ItemPurchaseSales[s].PriceReport.toFixed(4) + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + ItemPurchaseSales[s].Currency + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(ItemPurchaseSales[s].ContractValue, "n2") + "</td>" +
                "</tr>");
          $tr.appendTo($subTablePurchasesSales);
          ContValue = ContValue + ItemPurchaseSales[s].ContractValue;

        }
        $tr = $("<tr>" +
              "<td colspan='2'></td>" +
              "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + LongGroup + "*</td>" +
              "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + ShortGroup + "*</td>" +
              "<td colspan='2'  style='text-align: right; font-size: 10px; font-weight:bold'>Realized Profit or Loss</td>" +
              "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(ContValue, "n2") + "</td>" +
              "</tr>");
        TotalUSDPurchase = TotalUSDPurchase + ContValue;
        $tr.appendTo($subTablePurchasesSales);
      }

      $tr = $("<tr>" +
            "<td colspan='6'  style='text-align: right; font-size: 10px; font-weight:bold'>Total "+PurchaseSales[i].Currency+"</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(TotalUSDPurchase, "n2") + "</td>" +
            "</tr>");
      $tr.appendTo($subTablePurchasesSales);
    }
    
    // ==== Tbody Report Payments and Receipts ================================================================================================
    $tbodyDeskFee = $("<tbody></tbody>");
    $tbodyDeskFee.appendTo($tableMain);

    $trDeskFee = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Payments and Receipts</td>" +
            "</tr>");
    $trDeskFee.appendTo($tbodyDeskFee);

    $trDeskFee = $("<tr></tr>");
    $trDeskFee.appendTo($tbodyDeskFee);

    $tdDeskFee = $("<td colspan='6'></td>");
    $tdDeskFee.appendTo($trDeskFee);

    $subDeskFee = $("<table style='width:100%; border:0'></table>");
    $subDeskFee.appendTo($tdDeskFee);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width:10%'>DATE</th>" +
            "<th style='text-align: left; font-size: 10px; width:15%'>VALUE DATE</th>" +
            "<th style='text-align: right; font-size: 10px; width:10%'>TYPE</th>" +
            "<th style='text-align: right; font-size: 10px; width:40%'>DESCRIPTION</th>" +
            "<th style='text-align: right; font-size: 10px; width:10%'>CUR</th>" +
            "<th style='text-align: right; font-size: 10px; width:15%'>AMOUNT</th>" +
            "</tr>");
    $tr.appendTo($subDeskFee);
    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>");
    $tr.appendTo($subDeskFee);
    var totAmount = 0;

    for (var i in detailDeskFee) {
      $tr = $("<tr>" +
              "<td style='text-align: left; font-size: 9px'>" + moment(detailDeskFee[i].FeeDate).format("D/MM/YYYY") + "</td>" +
              "<td style='text-align: left; font-size: 9px'>" + moment(detailDeskFee[i].FeeDate).format("D/MM/YYYY") + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + detailDeskFee[i].FeeDescription2 + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + detailDeskFee[i].FeeDescription1 + "</td>" +
              "<td style='text-align: right; font-size: 9px'>USD</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (detailDeskFee[i].FeeAmount).toFixed(2) + "</td>" +
              "</tr>");
      $tr.appendTo($subDeskFee);

      totAmount = totAmount + detailDeskFee[i].FeeAmount;
    }

    $tr = $("<tr>" +
            "<td colspan ='5'style='text-align: right; font-size: 10px; font-weight:bold'>TOTAL USD</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + totAmount.toFixed(2) + "</td>" +
            "</tr>");
    $tr.appendTo($subDeskFee);

    // ==== Tbody Report Open Trades ==============
    var dataReportOpenTrede = Enumerable.From(res.Data.DetailsOpenTrade).OrderBy("$.Currency").ToArray();
    $tbodyOpenTrades = $("<tbody></tbody>");
    $tbodyOpenTrades.appendTo($tableMain);

    $trOpenTrades = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Open Trades</td>" +
            "</tr>");
    $trOpenTrades.appendTo($tbodyOpenTrades);

    $trOpenTrades = $("<tr></tr>");
    $trOpenTrades.appendTo($tbodyOpenTrades);

    $tdOpenTrades = $("<td colspan='6'></td>");
    $tdOpenTrades.appendTo($trOpenTrades);

    $subTableOpenTrades = $("<table style='width:100%; border:0'></table>")
    $subTableOpenTrades.appendTo($tdOpenTrades);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px; width: 15%'>CONTRACT DESCRIPTION</th>" +
            "<th style='text-align: right; font-size: 10px; width: 9%'>TRADE PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 10%'>SETTLEMENT PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>LONG</th>" +
            "<th style='text-align: right; font-size: 10px; width: 6%'>SHORT</th>" +
            "<th style='text-align: right; font-size: 10px; width: 15%'>NOTIONAL VALUE</th>" +
            "</tr>");
    $tr.appendTo($subTableOpenTrades);
    $tr = $("<tr>" +
            "<th style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></th>" +
            "</tr>");
    $tr.appendTo($subTableOpenTrades);
    
    for (var i in dataReportOpenTrede) {
      var toatalNationalValue = 0;
      var item = Enumerable.From(dataReportOpenTrede[i].item).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='7'>" + dataReportOpenTrede[i].Currency + "</td>" +
              "</tr>");
      $tr.appendTo($subTableOpenTrades);


      var itemSort = Enumerable.From(item).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
      var arrayObj = [];
      for (var s in itemSort) {
        arrayObj = arrayObj.concat(itemSort[s]);
      }
      var DataGroup = Enumerable.From(arrayObj).GroupBy("$.Fullname").ToArray();

      for (var d in DataGroup) {

        var groubByItem = DataGroup[d].source;

        var groupedData = _.groupBy(groubByItem, function (d) {
          return d.Contractexpiry
        });
        for (var gb in groupedData) {
          var groubByItem = groupedData[gb];
          var LongGroup = 0;
          var ShortGroup = 0;
          var ContValue = 0;
          var Bintang = "";
          var Bintang2 = "";
          for (var item in groubByItem) {
            var Long = "";
            var Short = "";
            if (groubByItem[item].TransactionType == "B") {
              Long = groubByItem[item].BalanceQty;
              Short = "";
              LongGroup = LongGroup + groubByItem[item].BalanceQty;
              ShortGroup = "";
              Bintang2 = "";
              Bintang = "*";
            } else {
              Long = "";
              Short = groubByItem[item].BalanceQty;
              LongGroup = "";
              ShortGroup = ShortGroup + groubByItem[item].BalanceQty;
              Bintang2 = "*";
              Bintang = "";
            }

            $tr = $("<tr>" +
                    "<td  style='text-align: left; font-size: 9px'>" + moment(getUTCDate(new Date(groubByItem[item].Tradedate))).format("D-MMM-YY") + "</td>" +
                    "<td  style='text-align: left; font-size: 9px'>" + groubByItem[item].Fullname + " " + moment(getUTCDate(groubByItem[item].Contractexpiry)).format("MMM-YY") + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(groubByItem[item].TradePrice, "n4") + "</td>" +                    
                    "<td  style='text-align: right; font-size: 9px'>" + (groubByItem[item].SettlementPrice).toFixed(4) + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + Long + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + Short + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(groubByItem[item].NationalValue, "n2") + "</td>" +
                    "</tr>");
            $tr.appendTo($subTableOpenTrades);
            ContValue = ContValue + groubByItem[item].NationalValue;
            toatalNationalValue = toatalNationalValue + groubByItem[item].NationalValue;
          }

          $tr = $("<tr>" +
                  "<td colspan='4'></td>" +
                  "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + LongGroup + "" + Bintang + "</td>" +
                  "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + ShortGroup + "" + Bintang2 + "</td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(ContValue, "n2") + "</td>" +
                  "</tr>");
          $tr.appendTo($subTableOpenTrades);
        }
      }
      $tr = $("<tr>" +
            "<td colspan='4'></td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold' colspan='2'>Unrealized Profit or Loss ("+dataReportOpenTrede[i].Currency+")</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(toatalNationalValue, "n2") + "</td>" +
            "</tr>");
      $tr.appendTo($subTableOpenTrades);
    }
    report.getDataReportSummaryAccount($tableMain, dateHeader.Description, report.account(), moment(report.tradeDate()).format("YYYY-MM-DD"));
  });
}
report.getDataReportNewTradeAccount = function () {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Account: report.account(),
  };
  var dataValueReport = [];
  var url = "/allreport/byaccountnewtrade";

  ajaxPost(url, param, function (res) {
    var dateHeader = res.Data.Header;
    var dataReport = Enumerable.From(res.Data.Details).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ToArray();


    if (dateHeader == undefined) {
      return swal("Confirmation!", "Report Trade Date " + moment(report.tradeDate()).format("YYYY-MM-DD") + " Is Empty", "error");
    }
    report.hTradeDate = moment(dateHeader.TransactionDate).format("DD-MMMM-YYYY");
    report.hClient = dateHeader.Clientnumber;
    report.hAccount = dateHeader.AccountNumber;
    report.hDescription = dateHeader.Description;

    $('#HeaderClientNewTradereport').html("");
    $divAllReport = $('#HeaderClientNewTradereport');
    $tableMain = $("<table width='100%' id='reportZep'></table>");
    $tableMain.appendTo($divAllReport);
    $theadMain = $("<thead>" +
            "<tr>" +
            "<th style='text-align: left; width: 15%'>Trade Date</th>" +
            "<th style='text-align: left; width: 1%'>:</th>" +
            "<th style='text-align: left; width: 20%'>" + report.hTradeDate + "</th>" +
            "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
            "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
            "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>Client</th>" +
            "<th style='text-align: left'>:</th>" +
            "<th style='text-align: left'>" + report.hClient + "</th>" +
            "<th style='text-align: left'>" + report.hDescription + "</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</thead>");
    $theadMain.appendTo($tableMain);
    // ==== Tbody Report New Trades ==============
    $tbodyNewTrades = $("<tbody></tbody>");
    $tbodyNewTrades.appendTo($tableMain);

    $trNewTrades = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>New Trades</td>" +
            "</tr>");
    $trNewTrades.appendTo($tbodyNewTrades);

    $trNewTrades = $("<tr></tr>");
    $trNewTrades.appendTo($tbodyNewTrades);

    $tdNewTrades = $("<td colspan='6'></td>");
    $tdNewTrades.appendTo($trNewTrades);

    $subTableNewTrades = $("<table style='width:100%; border:0'></table>");
    $subTableNewTrades.appendTo($tdNewTrades);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px'>TRADE NUMBER</th>" +
            "<th style='text-align: left; font-size: 10px'>CONTRACT</th>" +
            "<th style='text-align: left; font-size: 10px'>MONTH</th>" +
            "<th style='text-align: center; font-size: 10px'>BUY</th>" +
            "<th style='text-align: center; font-size: 10px'>SELL</th>" +
            "<th style='text-align: right; font-size: 10px'>PRICE</th>" +
            "<th style='text-align: center; font-size: 10px'>CUR</th>" +
            "</tr>");
    $tr.appendTo($subTableNewTrades);
    $tr = $("<tr>" +
            "<th style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='8'></th>" +
            "</tr>");
    $tr.appendTo($subTableNewTrades);
    for (var i in dataReport) {
      var item = Enumerable.From(dataReport[i].item).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ThenBy("$.TransactionType").ToArray();
      var buyGroup = 0;
      var SellGroup = 0;
      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='8'>" + dataReport[i].Fullname + "</td>" +
              "</tr>");
      $tr.appendTo($subTableNewTrades);
      for (var j in item) {
        var Buy = "";
        var SELL = "";
        if (item[j].TransactionType == "B") {
          Buy = item[j].Qty;
          SELL = "";
          buyGroup = buyGroup + item[j].Qty;
          SellGroup = SellGroup + 0;
        } else {
          Buy = "";
          SELL = item[j].Qty;
          buyGroup = buyGroup + 0;
          SellGroup = SellGroup + item[j].Qty;
        }

        $tr = $("<tr>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(new Date(item[j].TransactionDateString)).format("D-MMM-YY") + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + item[j].TransactionID + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + item[j].ProductID + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(item[j].ContractExpiry).format("MMM-YY") + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + Buy + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + SELL + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + item[j].PriceReport.toFixed(4) + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + item[j].Currency + "</td>" +
                "</tr>");
        $tr.appendTo($subTableNewTrades);
      }

      // ====Buy ====
      if (buyGroup == 0) {
        buyGroup = "";
      } else {
        buyGroup = buyGroup.toString() + "*";
      }

      // ====Sell ====
      if (SellGroup == 0) {
        SellGroup = "";
      } else {
        SellGroup = SellGroup.toString() + "*";
      }

      $tr = $("<tr>" +
              "<td colspan='4'></td>" +
              "<td style='text-align: center; font-size: 10px;font-weight:bold'>" + buyGroup + "</td>" +
              "<td style='text-align: center; font-size: 10px;font-weight:bold'>" + SellGroup + "</td>" +
              "<td colspan='2'></td>" +
              "</tr>");
      $tr.appendTo($subTableNewTrades);
    }
  });
}
report.getDataReportPurchaseAndSalesAccount = function () {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Account: report.account(),
  };
  var dataValueReport = [];
  var url = "/allreport/byaccountpurchasesales";

  ajaxPost(url, param, function (res) {
    var dateHeader = res.Data.HeaderPurchsaeSales;
    var PurchaseSales = Enumerable.From(res.Data.DetailsPurchaseSales).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ToArray();
    if (dateHeader == undefined) {
      return swal("Confirmation!", "Report Trade Date " + moment(report.tradeDate()).format("YYYY-MM-DD") + " Is Empty", "error");
    }
    report.hTradeDate = moment(dateHeader.TransactionDate).format("DD-MMMM-YYYY");
    report.hClient = dateHeader.Clientnumber;
    report.hAccount = dateHeader.AccountNumber;
    report.hDescription = dateHeader.Description;

    $('#HeaderClientsPurchaseAndSalereport').html("");
    $divAllReport = $('#HeaderClientsPurchaseAndSalereport');
    $tableMain = $("<table width='100%' id='reportZep'></table>");
    $tableMain.appendTo($divAllReport);
    $theadMain = $("<thead>" +
            "<tr>" +
            "<th style='text-align: left; width: 15%'>Trade Date</th>" +
            "<th style='text-align: left; width: 1%'>:</th>" +
            "<th style='text-align: left; width: 20%'>" + report.hTradeDate + "</th>" +
            "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
            "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
            "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>Client</th>" +
            "<th style='text-align: left'>:</th>" +
            "<th style='text-align: left'>" + report.hClient + "</th>" +
            "<th style='text-align: left'>" + report.hDescription + "</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</thead>");
    $theadMain.appendTo($tableMain);

    // ==== Tbody Report Purchases and Sales ========================================================================================
    $tbodyPurchasesSales = $("<tbody></tbody>");
    $tbodyPurchasesSales.appendTo($tableMain);

    $trPurchasesSales = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Purchases and Sales</td>" +
            "</tr>");
    $trPurchasesSales.appendTo($tbodyPurchasesSales);

    $trPurchasesSales = $("<tr></tr>");
    $trPurchasesSales.appendTo($tbodyPurchasesSales);

    $tdPurchasesSales = $("<td colspan='6'></td>");
    $tdPurchasesSales.appendTo($trPurchasesSales);

    $subTablePurchasesSales = $("<table style='width:100%; border:0'></table>")
    $subTablePurchasesSales.appendTo($tdPurchasesSales);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px; width: 15%'>TRADE NUMBER</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>LONG</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>SHORT</th>" +
            "<th style='text-align: right; font-size: 10px; width: 10%'>PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>CUR</th>" +
            "<th style='text-align: right; font-size: 10px; width: 15%'>CONTRACT VALUE</th>" +
            "</tr>");
    $tr.appendTo($subTablePurchasesSales);
    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>");
    $tr.appendTo($subTablePurchasesSales);
    var TotalUSDPurchase = 0;
    for (var i in PurchaseSales) {
      var item = Enumerable.From(PurchaseSales[i].item).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ThenBy("$.TransactionType").ToArray();
      var LongGroup = 0;
      var ShortGroup = 0;
      var ContValue = 0;

      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='7'>" + PurchaseSales[i].Fullname + " " + moment(PurchaseSales[i].ContractExpiry).format("MMM-YY") + "</td>" +
              "</tr>");
      $tr.appendTo($subTablePurchasesSales);
      for (var j in item) {
        var Long = "";
        var Short = "";
        if (item[j].TransactionType == "B") {
          Long = item[j].Qty;
          Short = "";
          LongGroup = LongGroup + item[j].Qty;
          ShortGroup = ShortGroup + 0;
        } else {
          Long = "";
          Short = item[j].Qty;
          LongGroup = LongGroup + 0;
          ShortGroup = ShortGroup + item[j].Qty;
        }

        $tr = $("<tr>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(getUTCDate(item[j].TransactionDate)).format("D-MMM-YY") + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + item[j].TransactionID + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + Long + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + Short + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + item[j].PriceReport.toFixed(4) + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + item[j].Currency + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(item[j].ContractValue, "n2") + "</td>" +
                "</tr>");
        $tr.appendTo($subTablePurchasesSales);
        ContValue = ContValue + item[j].ContractValue;
      }

      $tr = $("<tr>" +
              "<td colspan='2'></td>" +
              "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + LongGroup + "*</td>" +
              "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + ShortGroup + "*</td>" +
              "<td colspan='2'  style='text-align: right; font-size: 10px; font-weight:bold'>Realized Profit or Loss</td>" +
              "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(ContValue, "n2") + "</td>" +
              "</tr>");
      TotalUSDPurchase = TotalUSDPurchase + ContValue;
      $tr.appendTo($subTablePurchasesSales);
    }
    $tr = $("<tr>" +
            "<td colspan='6'  style='text-align: right; font-size: 10px; font-weight:bold'>Total USD</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(TotalUSDPurchase, "n2") + "</td>" +
            "</tr>");
    $tr.appendTo($subTablePurchasesSales);

  });
}
report.getDataReportTradeFeesAccount = function () {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Account: report.account(),
  };
  var dataValueReport = [];
  var url = "/allreport/byaccounttradefee";

  ajaxPost(url, param, function (res) {
    var dateHeader = res.Data.HeaderTradeFee;
    var dataReportfees = Enumerable.From(res.Data.DetailTradeFee).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ToArray();
    if (dateHeader == undefined) {
      return swal("Confirmation!", "Report Trade Date " + moment(report.tradeDate()).format("YYYY-MM-DD") + " Is Empty", "error");
    }
    report.hTradeDate = moment(dateHeader.TransactionDate).format("DD-MMMM-YYYY");
    report.hClient = dateHeader.Clientnumber;
    report.hAccount = dateHeader.AccountNumber;
    report.hDescription = dateHeader.Description;

    $('#HeaderClientsTradeFeesreport').html("");
    $divAllReport = $('#HeaderClientsTradeFeesreport');
    $tableMain = $("<table width='100%' id='reportZep'></table>");
    $tableMain.appendTo($divAllReport);
    $theadMain = $("<thead>" +
            "<tr>" +
            "<th style='text-align: left; width: 15%'>Trade Date</th>" +
            "<th style='text-align: left; width: 1%'>:</th>" +
            "<th style='text-align: left; width: 20%'>" + report.hTradeDate + "</th>" +
            "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
            "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
            "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>Client</th>" +
            "<th style='text-align: left'>:</th>" +
            "<th style='text-align: left'>" + report.hClient + "</th>" +
            "<th style='text-align: left'>" + report.hDescription + "</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</thead>");
    $theadMain.appendTo($tableMain);
    // ==== Tbody Report Trades Fees ==============
    $tbodyTradesFees = $("<tbody></tbody>");
    $tbodyTradesFees.appendTo($tableMain);

    $trTradesFees = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Trades Fees</td>" +
            "</tr>");
    $trTradesFees.appendTo($tbodyTradesFees);

    $trTradesFees = $("<tr></tr>");
    $trTradesFees.appendTo($tbodyTradesFees);

    $tdTradesFees = $("<td colspan='6'></td>");
    $tdTradesFees.appendTo($trTradesFees);

    $subTradesFees = $("<table style='width:100%; border:0'></table>");
    $subTradesFees.appendTo($tdTradesFees);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px'>CURRENCY</th>" +
            "<th style='text-align: left; font-size: 10px'>CONTRACT AND DELIVERY</th>" +
            "<th style='text-align: right; font-size: 10px'>LOTS</th>" +
            "<th style='text-align: right; font-size: 10px'>MARKET FEES</th>" +
            "<th style='text-align: right; font-size: 10px'>CLR COMM</th>" +
            "<th style='text-align: right; font-size: 10px'>NFA</th>" +
            "<th style='text-align: right; font-size: 10px'>MISC FEES</th>" +
            "</tr>");
    $tr.appendTo($subTradesFees);
    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>");
    $tr.appendTo($subTradesFees);
    var totMarketFees = 0;
    var totCLRComm = 0;
    var totNFA = 0;
    var totMiscFees = 0;

    for (var i in dataReportfees) {
      $tr = $("<tr>" +
              "<td style='text-align: left; font-size: 9px'>" + dataReportfees[i].Currency + "</td>" +
              "<td style='text-align: left; font-size: 9px'>" + dataReportfees[i].Fullname + "  " + moment(dataReportfees[i].Contractexpiry).format("MMM-YY") + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + dataReportfees[i].Lots + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Marketfee * -1).toFixed(4) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Clrcommission * -1).toFixed(4) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Nfafee * -1).toFixed(4) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Miscfee * -1).toFixed(4) + "</td>" +
              "</tr>");
      $tr.appendTo($subTradesFees);

      totMarketFees = totMarketFees + dataReportfees[i].Marketfee;
      totCLRComm = totCLRComm + dataReportfees[i].Clrcommission;
      totNFA = totNFA + dataReportfees[i].Nfafee;
      totMiscFees = totMiscFees + dataReportfees[i].Miscfee;
    }

    $tr = $("<tr>" +
            "<td colspan ='3'style='text-align: right; font-size: 10px; font-weight:bold'>TOTAL USD</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totMarketFees * -1).toFixed(4) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totCLRComm * -1).toFixed(4) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totNFA * -1).toFixed(4) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totMiscFees * -1).toFixed(4) + "</td>" +
            "</tr>");
    $tr.appendTo($subTradesFees);
  });
}
report.getDataReportOpenTradeAccount = function () {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Account: report.account(),
  };
  var dataValueReport = [];
  var url = "/allreport/byaccountopentrade";

  ajaxPost(url, param, function (res) {
    var dateHeader = res.Data.OpenTradeReport;
    if (dateHeader.Clientnumber == undefined) {
      return swal("Confirmation!", "Report Trade Date " + moment(report.tradeDate()).format("YYYY-MM-DD") + " Is Empty", "error");
    }
    report.hTradeDate = moment(dateHeader.TransactionDate).format("DD-MMMM-YYYY");
    report.hClient = dateHeader.Clientnumber;
    report.hAccount = dateHeader.AccountNumber;
    report.hDescription = dateHeader.Description;

    $('#HeaderClientsOpenTradereport').html("");
    $divAllReport = $('#HeaderClientsOpenTradereport');
    $tableMain = $("<table width='100%' id='reportZep'></table>");
    $tableMain.appendTo($divAllReport);
    $theadMain = $("<thead>" +
            "<tr>" +
            "<th style='text-align: left; width: 15%'>Trade Date</th>" +
            "<th style='text-align: left; width: 1%'>:</th>" +
            "<th style='text-align: left; width: 20%'>" + report.hTradeDate + "</th>" +
            "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
            "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
            "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>Client</th>" +
            "<th style='text-align: left'>:</th>" +
            "<th style='text-align: left'>" + report.hClient + "</th>" +
            "<th style='text-align: left'>" + report.hDescription + "</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th style='text-align: left'>&nbsp</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</thead>");
    $theadMain.appendTo($tableMain);
    // ==== Tbody Report Open Trades ==============
    var dataReportOpenTrede = dateHeader.details;
    $tbodyOpenTrades = $("<tbody></tbody>");
    $tbodyOpenTrades.appendTo($tableMain);

    $trOpenTrades = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Open Trades</td>" +
            "</tr>");
    $trOpenTrades.appendTo($tbodyOpenTrades);

    $trOpenTrades = $("<tr></tr>");
    $trOpenTrades.appendTo($tbodyOpenTrades);

    $tdOpenTrades = $("<td colspan='6'></td>");
    $tdOpenTrades.appendTo($trOpenTrades);

    $subTableOpenTrades = $("<table style='width:100%; border:0'></table>");
    $subTableOpenTrades.appendTo($tdOpenTrades);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px; width: 15%'>CONTRACT DESCRIPTION</th>" +
            "<th style='text-align: right; font-size: 10px; width: 9%'>TRADE PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 10%'>SETTLEMENT PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>LONG</th>" +
            "<th style='text-align: right; font-size: 10px; width: 6%'>SHORT</th>" +
            "<th style='text-align: right; font-size: 10px; width: 15%'>NOTIONAL VALUE</th>" +
            "</tr>");
    $tr.appendTo($subTableOpenTrades);
    $tr = $("<tr>" +
            "<th style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></th>" +
            "</tr>");
    $tr.appendTo($subTableOpenTrades);
    
    for (var i in dataReportOpenTrede) {
      var toatalNationalValue = 0;
      var item = Enumerable.From(dataReportOpenTrede[i].item).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='7'>" + dataReportOpenTrede[i].Currency + "</td>" +
              "</tr>");
      $tr.appendTo($subTableOpenTrades);


      var itemSort = Enumerable.From(item).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
      var arrayObj = [];
      for (var s in itemSort) {
        arrayObj = arrayObj.concat(itemSort[s]);
      }
      var DataGroup = Enumerable.From(arrayObj).GroupBy("$.Fullname").ToArray();

      for (var d in DataGroup) {

        var groubByItem = DataGroup[d].source;

        var groupedData = _.groupBy(groubByItem, function (d) {
          return d.Contractexpiry;
        });
        for (var gb in groupedData) {
          var groubByItem = groupedData[gb];
          var LongGroup = 0;
          var ShortGroup = 0;
          var ContValue = 0;
          var Bintang = "";
          var Bintang2 = "";
          for (var item in groubByItem) {
            var Long = "";
            var Short = "";
            if (groubByItem[item].TransactionType == "B") {
              Long = groubByItem[item].Qty;
              Short = "";
              LongGroup = LongGroup + groubByItem[item].Qty;
              ShortGroup = "";
              Bintang2 = "";
              Bintang = "*";
            } else {
              Long = "";
              Short = groubByItem[item].Qty;
              LongGroup = "";
              ShortGroup = ShortGroup + groubByItem[item].Qty;
              Bintang2 = "*";
              Bintang = "";
            }

            $tr = $("<tr>" +
                    "<td  style='text-align: left; font-size: 9px'>" + moment(getUTCDate(new Date(groubByItem[item].Tradedate))).format("D-MMM-YY") + "</td>" +
                    "<td  style='text-align: left; font-size: 9px'>" + groubByItem[item].Fullname + " " + moment(getUTCDate(groubByItem[item].Contractexpiry)).format("MMM-YY") + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(groubByItem[item].TradePrice, "n4") + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + (groubByItem[item].SettlementPrice).toFixed(4) + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + Long + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + Short + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(groubByItem[item].NationalValue, "n2") + "</td>" +
                    "</tr>");
            $tr.appendTo($subTableOpenTrades);
            ContValue = ContValue + groubByItem[item].NationalValue;
            toatalNationalValue = toatalNationalValue + groubByItem[item].NationalValue;
          }

          $tr = $("<tr>" +
                  "<td colspan='4'></td>" +
                  "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + LongGroup + "" + Bintang + "</td>" +
                  "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + ShortGroup + "" + Bintang2 + "</td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(ContValue, "n2") + "</td>" +
                  "</tr>");
          $tr.appendTo($subTableOpenTrades);
        }
      }
      $tr = $("<tr>" +
            "<td colspan='4'></td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold' colspan='2'>Unrealized Profit or Loss ("+dataReportOpenTrede[i].Currency+")</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(toatalNationalValue, "n2") + "</td>" +
            "</tr>");
      $tr.appendTo($subTableOpenTrades);
    }
    
  });
}

report.getDataReportSummaryAccount = function (MainTable, Desc, Account, dateStr) {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Account: report.account()
  };
  var url = "/allreport/getsummary";
  ajaxPost(url, param, function (res) {
    var DataSummary = res.AccountSummary;
    // ==== Tbody Report Trades Fees ==============
    $tableMain = MainTable;
    $tbodySummaryAccount = $("<tbody></tbody>");
    $tbodySummaryAccount.appendTo($tableMain);

    $trSummaryAccount = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Summary</td>" +
            "</tr>");
    $trSummaryAccount.appendTo($tbodySummaryAccount);

    $trSummaryAccount = $("<tr></tr>");
    $trSummaryAccount.appendTo($tbodySummaryAccount);

    $tdSummaryAccount = $("<td colspan='6'></td>");
    $tdSummaryAccount.appendTo($trSummaryAccount);

    $subSummaryAccount = $("<table style='width:100%; border:0'></table>");
    $subSummaryAccount.appendTo($tdSummaryAccount);


    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>" +
            "<tr>" +
            "<td colspan='7'>Account Summary : " + Account + " " + Desc + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td colspan='7'>Comsolidate Financial Statement as of : " + dateStr + " </td>" +
            "</tr>");
    $tr.appendTo($subSummaryAccount);

    
    $trHederCurrCode = $("<tr></tr>");
    $trHederCurrCode.appendTo($subSummaryAccount);
    $tdCurrCode = $("<td style='text-align: left; width: 15%;  font-size: 10px'></td>");
    $tdCurrCode.appendTo($trHederCurrCode);

    var wd = (Math.round(85 / DataSummary.length) - 5);
    var borderPx = (DataSummary.length - 1);
    var px = 1;
    var colspanHeader = (DataSummary.length);
    var lastvalue = (DataSummary.length-1);

    for (var i in DataSummary){
        $tdCurrCode = $("<td style='text-align: center;  width: 15%; font-size: 10px'>"+DataSummary[i].CurrencyCode+"</td>");
        $tdCurrCode.appendTo($trHederCurrCode);
    }

    $trFXSPORTRATE = $("<tr></tr>");
    $trFXSPORTRATE.appendTo($subSummaryAccount);
    $tdFXSPORTRATE = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>FX SPOT RATE</td>");
    $tdFXSPORTRATE.appendTo($trFXSPORTRATE);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdFXSPORTRATE = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].SpotRate, "n4")+"</td>");
        $tdFXSPORTRATE.appendTo($trFXSPORTRATE);
    }

    px = 1;
    $trACCOUNTCASHBAL = $("<tr></tr>");
    $trACCOUNTCASHBAL.appendTo($subSummaryAccount);
    $tdACCOUNTCASHBAL = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>ACCOUNT CASH BAL</td>");
    $tdACCOUNTCASHBAL.appendTo($trACCOUNTCASHBAL);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdACCOUNTCASHBAL = $("<td style='border-right: "+px+"px solid; text-align: right;  font-size: 10px'>"+kendo.toString(DataSummary[i].AccountCashBalance, "n2")+"</td>");
        $tdACCOUNTCASHBAL.appendTo($trACCOUNTCASHBAL);
    }

    px = 1;
    $trPAYRECEIPTS = $("<tr></tr>");
    $trPAYRECEIPTS.appendTo($subSummaryAccount);
    $tdPAYRECEIPTS = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>PAYMENTS/RECEIPTS</td>");
    $tdPAYRECEIPTS.appendTo($trPAYRECEIPTS);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdPAYRECEIPTS = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].PaymentReceipt, "n2")+"</td>");
        $tdPAYRECEIPTS.appendTo($trPAYRECEIPTS);
    }

    px = 1;
    $trFXTRADES = $("<tr></tr>");
    $trFXTRADES.appendTo($subSummaryAccount);
    $tdFXTRADES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>FX TRADES</td>");
    $tdFXTRADES.appendTo($trFXTRADES);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdFXTRADES = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>0</td>");
        $tdFXTRADES.appendTo($trFXTRADES);
    }

    px = 1;
    $trREALIZEDPL = $("<tr></tr>");
    $trREALIZEDPL.appendTo($subSummaryAccount);
    $tdREALIZEDPL = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>REALIZED P/L</td>");
    $tdREALIZEDPL.appendTo($trREALIZEDPL);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdREALIZEDPL = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].RealizeProfitLoss, "n2")+"</td>");
        $tdREALIZEDPL.appendTo($trREALIZEDPL);
    }

    px = 1;
    $trMARKETFEES = $("<tr></tr>");
    $trMARKETFEES.appendTo($subSummaryAccount);
    $MARKETFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MARKET FEES</td>");
    $MARKETFEES.appendTo($trMARKETFEES);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $MARKETFEES = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].MarketFee, "n2")+"</td>");
        $MARKETFEES.appendTo($trMARKETFEES);
    }

    px = 1;
    $trCLRCOMMISSION = $("<tr></tr>");
    $trCLRCOMMISSION.appendTo($subSummaryAccount);
    $tdCLRCOMMISSION = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;CLR COMMISSION</td>");
    $tdCLRCOMMISSION.appendTo($trCLRCOMMISSION);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdCLRCOMMISSION = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].ClrCommission, "n2")+"</td>");
        $tdCLRCOMMISSION.appendTo($trCLRCOMMISSION);
    }

    px = 1;
    $trNFAFEES = $("<tr></tr>");
    $trNFAFEES.appendTo($subSummaryAccount);
    $tdNFAFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;NFA FEES</td>");
    $tdNFAFEES.appendTo($trNFAFEES);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdNFAFEES = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].NfaFee, "n2")+"</td>");
        $tdNFAFEES.appendTo($trNFAFEES);
    }

    px = 1;
    $trMISCFEES = $("<tr></tr>");
    $trMISCFEES.appendTo($subSummaryAccount);
    $MISCFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MISC FEES</td>");
    $MISCFEES.appendTo($trMISCFEES);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $MISCFEES = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].MiscFee, "n2")+"</td>");
        $MISCFEES.appendTo($trMISCFEES);
    }

    px = 1;
    $trTOTALFEES = $("<tr></tr>");
    $trTOTALFEES.appendTo($subSummaryAccount);
    $tdTOTALFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>TOTAL FEES</td>");
    $tdTOTALFEES.appendTo($trTOTALFEES);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdTOTALFEES = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].TotalFee, "n2")+"</td>");
        $tdTOTALFEES.appendTo($trTOTALFEES);
    }

    px = 1;
    $trNEWCASHBALANCE = $("<tr></tr>");
    $trNEWCASHBALANCE.appendTo($subSummaryAccount);
    $tdNEWCASHBALANCE = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>NEW CASH BALANCE</td>");
    $tdNEWCASHBALANCE.appendTo($trNEWCASHBALANCE);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdNEWCASHBALANCE = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].NewCashBalance, "n2")+"</td>");
        $tdNEWCASHBALANCE.appendTo($trNEWCASHBALANCE);
    }

    px = 1;
    $trOPENTRADEEQUITY = $("<tr></tr>");
    $trOPENTRADEEQUITY.appendTo($subSummaryAccount);
    $tdOPENTRADEEQUITY = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>OPEN TRADE EQUITY</td>");
    $tdOPENTRADEEQUITY.appendTo($trOPENTRADEEQUITY);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdOPENTRADEEQUITY = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].OpenTradeEquity, "n2")+"</td>");
        $tdOPENTRADEEQUITY.appendTo($trOPENTRADEEQUITY);
    }

    px = 1;
    $trTOTALEQUITY = $("<tr></tr>");
    $trTOTALEQUITY.appendTo($subSummaryAccount);
    $tdTOTALEQUITY = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>TOTAL EQUITY</td>");
    $tdTOTALEQUITY.appendTo($trTOTALEQUITY);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdTOTALEQUITY = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].TotalEquity, "n2")+"</td>");
        $tdTOTALEQUITY.appendTo($trTOTALEQUITY);
    }

    px = 1;
    $trNETLIQUIDVALUE = $("<tr></tr>");
    $trNETLIQUIDVALUE.appendTo($subSummaryAccount);
    $tdNETLIQUIDVALUE = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>NET LIQUID. VALUE</td>");
    $tdNETLIQUIDVALUE.appendTo($trNETLIQUIDVALUE);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdNETLIQUIDVALUE = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].NewLiquidValue, "n2")+"</td>");
        $tdNETLIQUIDVALUE.appendTo($trNETLIQUIDVALUE);
    }

    px = 1;
    $trMARGDEFEXCESS = $("<tr></tr>");
    $trMARGDEFEXCESS.appendTo($subSummaryAccount);
    $tdMARGDEFEXCESS = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 10px'>MARG. DEF/EXCESS</td>");
    $tdMARGDEFEXCESS.appendTo($trMARGDEFEXCESS);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdMARGDEFEXCESS = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>0</td>");
        $tdMARGDEFEXCESS.appendTo($trMARGDEFEXCESS);
    }

    px = 1;
    $trMtdPaymentReceipt = $("<tr></tr>");
    $trMtdPaymentReceipt.appendTo($subSummaryAccount);
    $tdMtdPaymentReceipt = $("<td style='border-right: 1px solid; text-align: left; width: 15%; font-size: 11px'>MTD PAY./RCPTS</td>");
    $tdMtdPaymentReceipt.appendTo($trMtdPaymentReceipt);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdMtdPaymentReceipt = $("<td style='border-right: "+px+"px solid; font-weight: bold;text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].MtdPaymentReceipt, "n2")+"</td>");
        $tdMtdPaymentReceipt.appendTo($trMtdPaymentReceipt);
    }

    px = 1;
    $trMtdRealizedPl = $("<tr></tr>");
    $trMtdRealizedPl.appendTo($subSummaryAccount);
    $tdMtdRealizedPl = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>MTD REALIZED</td>");
    $tdMtdRealizedPl.appendTo($trMtdRealizedPl);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdMtdRealizedPl = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].MtdRealizedPl, "n2")+"</td>");
        $tdMtdRealizedPl.appendTo($trMtdRealizedPl);
    }

    px = 1;
    $trMTDMARKET = $("<tr></tr>");
    $trMTDMARKET.appendTo($subSummaryAccount);
    $tdMTDMARKET = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD MARKET</td>");
    $tdMTDMARKET.appendTo($trMTDMARKET);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdMTDMARKET = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].MtdMarketFee, "n2")+"</td>");
        $tdMTDMARKET.appendTo($trMTDMARKET);
    }

    px = 1;
    $trMTDCLR = $("<tr></tr>");
    $trMTDCLR.appendTo($subSummaryAccount);
    $tdMTDCLR = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD CLR</td>");
    $tdMTDCLR.appendTo($trMTDCLR);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdMTDCLR = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].MtdClrCommission, "n2")+"</td>");
        $tdMTDCLR.appendTo($trMTDCLR);
    }

    px = 1;
    $trMtdNfaFee = $("<tr></tr>");
    $trMtdNfaFee.appendTo($subSummaryAccount);
    $tdMtdNfaFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD NFA FEES</td>");
    $tdMtdNfaFee.appendTo($trMtdNfaFee);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdMtdNfaFee = $("<td style='border-right: "+px+"px solid; text-align: right;  font-size: 10px'>"+kendo.toString(DataSummary[i].MtdNfaFee, "n2")+"</td>");
        $tdMtdNfaFee.appendTo($trMtdNfaFee);
    }

    px = 1;
    $trMtdMiscFee = $("<tr></tr>");
    $trMtdMiscFee.appendTo($subSummaryAccount);
    $tdMtdMiscFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD MISC FEES</td>");
    $tdMtdMiscFee.appendTo($trMtdMiscFee);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdMtdMiscFee = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].MtdMiscFee, "n2")+"</td>");
        $tdMtdMiscFee.appendTo($trMtdMiscFee);
    }

    px = 1;
    $trMtdTotalFee = $("<tr></tr>");
    $trMtdTotalFee.appendTo($subSummaryAccount);
    $tdMtdTotalFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>MTD TTL COMM/FEES</td>");
    $tdMtdTotalFee.appendTo($trMtdTotalFee);
    for (var i in DataSummary){
        if(i == borderPx){
          px = 0;
        }
        $tdMtdTotalFee = $("<td style='border-right: "+px+"px solid; text-align: right; font-size: 10px'>"+kendo.toString(DataSummary[i].MtdTotalFee, "n2")+"</td>");
        $tdMtdTotalFee.appendTo($trMtdTotalFee);
    }
    
    $trTT = $("<tr></tr>");
    $trTT.appendTo($subSummaryAccount);
    $tdTT = $("<td></td>");
    $tdTT.appendTo($trTT);
    $tdTT = $("<td colspan = "+colspanHeader+" style='font-weight: bold;text-align: left; width: 20%; font-size: 11px'>Last 5 NLV Values:("+DataSummary[lastvalue].BaseCurrencyCode+")</td>");
    $tdTT.appendTo($trTT);

    $trT4 = $("<tr></tr>");
    $trT4.appendTo($subSummaryAccount);
    $tdT4 = $("<td></td>");
    $tdT4.appendTo($trT4);
    $tdT4 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 4</td>");
    $tdT4.appendTo($trT4);
    $tdT4 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(DataSummary[lastvalue].NlvTd4, "n2")+"</td>");
    $tdT4.appendTo($trT4);
    $tdT4 = $("<td style='text-align: right; width: 20%; font-size: 11px'>CHG NLV</td>");
    $tdT4.appendTo($trT4);
    $tdT4 = $("<td colspan = "+(colspanHeader -3 )+" style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
    $tdT4.appendTo($trT4);

    $trT3 = $("<tr></tr>");
    $trT3.appendTo($subSummaryAccount);
    $tdT3 = $("<td></td>");
    $tdT3.appendTo($trT3);
    $tdT3 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 3</td>");
    $tdT3.appendTo($trT3);
    $tdT3 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(DataSummary[lastvalue].NlvTd3, "n2")+"</td>");
    $tdT3.appendTo($trT3);
    $tdT3 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(DataSummary[lastvalue].NlvDiff4, "n2")+"</td>");
    $tdT3.appendTo($trT3);
    $tdT3 = $("<td colspan = "+(colspanHeader -3 )+" style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
    $tdT3.appendTo($trT3);

    $trT2 = $("<tr></tr>");
    $trT2.appendTo($subSummaryAccount);
    $tdT2 = $("<td></td>");
    $tdT2.appendTo($trT2);
    $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 2</td>");
    $tdT2.appendTo($trT2);
    $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(DataSummary[lastvalue].NlvTd2, "n2")+"</td>");
    $tdT2.appendTo($trT2);
    $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(DataSummary[lastvalue].NlvDiff3, "n2")+"</td>");
    $tdT2.appendTo($trT2);
    $tdT2 = $("<td colspan = "+(colspanHeader -3 )+" style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
    $tdT2.appendTo($trT2);

    $trT1 = $("<tr></tr>");
    $trT1.appendTo($subSummaryAccount);
    $tdT1 = $("<td></td>");
    $tdT1.appendTo($trT1);
    $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 1</td>");
    $tdT1.appendTo($trT1);
    $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(DataSummary[lastvalue].NlvTd1, "n2")+"</td>");
    $tdT1.appendTo($trT1);
    $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(DataSummary[lastvalue].NlvDiff2, "n2")+"</td>");
    $tdT1.appendTo($trT1);
    $tdT1 = $("<td colspan = "+(colspanHeader -3 )+" style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
    $tdT1.appendTo($trT1);

    $trT0 = $("<tr></tr>");
    $trT0.appendTo($subSummaryAccount);
    $tdT0 = $("<td></td>");
    $tdT0.appendTo($trT0);
    $tdT0 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T</td>");
    $tdT0.appendTo($trT0);
    $tdT0 = $("<td style='text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(DataSummary[lastvalue].NlvTd,"n2")+"</td>");
    $tdT0.appendTo($trT0);
    $tdT0 = $("<td style='font-weight: bold; text-align: right; width: 20%; font-size: 11px'>"+kendo.toString(DataSummary[lastvalue].NlvDiff1, "n2")+"</td>");
    $tdT0.appendTo($trT0);
    $tdT0 = $("<td colspan = "+(colspanHeader -3 )+" style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'>(today)</td>");
    $tdT0.appendTo($trT0);

  });
}

report.getDataReportSummary = function (MainTable, Desc, Account, dateStr) {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Clients: report.clients()
  };
  var url = "/allreportclient/getsummary";
  ajaxPost(url, param, function (res) {
    var DataSummary = res;
    // ==== Tbody Report Trades Fees ==============
    $tableMain = MainTable;
    $tbodySummaryAccount = $("<tbody></tbody>");
    $tbodySummaryAccount.appendTo($tableMain);

    $trSummaryAccount = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Summary</td>" +
            "</tr>");
    $trSummaryAccount.appendTo($tbodySummaryAccount);

    $trSummaryAccount = $("<tr></tr>");
    $trSummaryAccount.appendTo($tbodySummaryAccount);

    $tdSummaryAccount = $("<td colspan='6'></td>");
    $tdSummaryAccount.appendTo($trSummaryAccount);

    $subSummaryAccount = $("<table style='width:100%; border:0'></table>");
    $subSummaryAccount.appendTo($tdSummaryAccount);


    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>" +
            "<tr>" +
            "<td colspan='7'>Account Summary : " + Account + " " + Desc + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td colspan='7'>Comsolidate Financial Statement as of : " + dateStr + " </td>" +
            "</tr>");
    $tr.appendTo($subSummaryAccount);
    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; width: 20%;  font-size: 10px'></th>" +
            "<th style='text-align: right; width: 10%; font-size: 10px'>Buy</th>" +
            "<th style='text-align: right; width: 10%; font-size: 10px'>Sell</th>" +
            "<th style='text-align: right; width: 10%; font-size: 10px'></th>" +
            "<th style='text-align: right; width: 10%; font-size: 10px'></th>" +
            "<th style='text-align: right; width: 10%; font-size: 10px'></th>" +
            "<th style='text-align: right; width: 30%; font-size: 10px'></th>" +
            "</tr>");
    $tr.appendTo($subSummaryAccount);
    var CountTRXBuy = 0;
    var CountTRXSell = 0;
    var SumQTYBuy = 0;
    var SumQTYSell = 0;
    var TotalLossProfitBuy = 0;
    var TotalLossProfitSell = 0;
    if (DataSummary.length != 0) {
      CountTRXBuy = DataSummary[0].CountTRX;
      CountTRXSell = DataSummary[1].CountTRX;
      SumQTYBuy = DataSummary[0].SumQTY;
      SumQTYSell = DataSummary[1].SumQTY;
      TotalLossProfitBuy = DataSummary[0].TotalLossProfit; //
      TotalLossProfitSell = DataSummary[1].TotalLossProfit;//
    }

    $tr = $("<tr>" +
            "<td style='text-align: left;font-size: 10px'><b>Total Trx</b></td>" +
            "<td style='text-align: right; font-size: 9px'>" + CountTRXBuy + "</td>" +
            "<td style='text-align: right; font-size: 9px'>" + CountTRXSell + "</td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "</tr>" +
            "<tr>" +
            "<td style='text-align: left; font-size: 10px'><b>Total Qty</b></td>" +
            "<td style='text-align: right; font-size: 9px'>" + SumQTYBuy + "</td>" +
            "<td style='text-align: right; font-size: 9px'>" + SumQTYSell + "</td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "</tr>" +
            "<tr>" +
            "<td style='text-align: left; font-size: 10px'><b>Total Loss Or Profit</b></td>" +
            "<td style='text-align: right; font-size: 9px'>" + kendo.toString(TotalLossProfitBuy, "n2") + "</td>" +
            "<td style='text-align: right; font-size: 9px'>" + kendo.toString(TotalLossProfitSell, "n2") + "</td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "<td style='text-align: right; font-size: 9px'></td>" +
            "</tr>");
    $tr.appendTo($subSummaryAccount);

    var Total = TotalLossProfitSell - (TotalLossProfitBuy * -1);
    $tr = $("<tr>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>TOTAL USD</td>" +
            "<td colspan ='6' style='text-align: left; font-size: 10px; font-weight:bold'>" + kendo.toString(Total, "n2") + "</td>" +
            "</tr>");
    $tr.appendTo($subSummaryAccount);
  });
}
// Function Process Report Clients
report.exportReportClients = function () {
  report.searchClients();
  var htmlTable = document.getElementById("reportZep");
  if (htmlTable != undefined){
    var Report = $("<div />").append($(htmlTable)).html();
    Report = Report.replace("/static/img/logo-ecdoc.png", "../../img/logo-ecdoc.png");
    TextHtml = Report.toString();
    $("#reportZep").html("");
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
  hiddenField.setAttribute("value", moment(report.tradeDate()).format("YYYY-MM-DD"));
  form.appendChild(hiddenField);
  hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "Clients");
  hiddenField.setAttribute("value", report.clients());
  form.appendChild(hiddenField);
  hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "ReportType");
  hiddenField.setAttribute("value", report.reportType());
  form.appendChild(hiddenField);
  document.body.appendChild(form);
  // form.submit();

  setTimeout(function () {
    form.submit();
  }, 2500);
}

report.getClients = function () {
  var param = {
  };
  var url = "/allreportclient/getclient";
  ajaxPost(url, param, function (res) {
    listClients = [];
    dataClients = res;
    for (var i in dataClients) {
      listClients.push({
        "text": dataClients[i]._id.client,
        "value": dataClients[i]._id.client,
      });
    }
    report.listClients(_.sortBy(listClients, 'text'));
    report.clients(listClients[1].text);
    report.getDataReportAllClients();
  });
}

report.searchClients = function () {
  typeReport = report.reportType();
  switch (typeReport) {
    case "NewTrade":
      report.visbleRptAll(false);
      report.visbleRptNewTrade(true);
      report.visbleRptPurchaseAndSales(false);
      report.visbleRptTradeFees(false);
      report.visbleRptOpenTrade(false);
      report.getDataReportNewTradeClients();
      break;
    case "PurchaseAndSales":
      report.visbleRptAll(false);
      report.visbleRptNewTrade(false);
      report.visbleRptPurchaseAndSales(true);
      report.visbleRptTradeFees(false);
      report.visbleRptOpenTrade(false);
      report.getDataReportPurchaseAndSalesClients();
      break;
    case "TradeFees":
      report.visbleRptAll(false);
      report.visbleRptNewTrade(false);
      report.visbleRptPurchaseAndSales(false);
      report.visbleRptTradeFees(true);
      report.visbleRptOpenTrade(false);
      report.getDataReportTradeFeesClients();
      break;
    case "OpenTrade":
      report.visbleRptAll(false);
      report.visbleRptNewTrade(false);
      report.visbleRptPurchaseAndSales(false);
      report.visbleRptTradeFees(false);
      report.visbleRptOpenTrade(true);
      report.getDataReportOpenTradeClients();
      break;
    default:
      report.visbleRptAll(true);
      report.visbleRptNewTrade(false);
      report.visbleRptPurchaseAndSales(false);
      report.visbleRptTradeFees(false);
      report.visbleRptOpenTrade(false);
      report.getDataReportAllClients();
      break;
  }
}

report.refreshClients = function () {
  report.tradeDate(new Date());
  report.getClients();
  report.reportType("All");
  report.getDataReportAllClients();
}

report.getDataReportAllClients = function () {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Clients: report.clients(),
  };
  var dataValueReport = [];
  var url = "/allreportclient/allreportclient";

  ajaxPost(url, param, function (res) {
    var dateHeader = res.Data.Header;
    var dataReport = Enumerable.From(res.Data.Details).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ToArray();
    var PurchaseSales = Enumerable.From(res.Data.DetailsPurchaseSales).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ToArray();
    var dataReportfees = Enumerable.From(res.Data.ResultDataTradeFees).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
    var detailDeskFee = res.Data.DetailDeskFee;

    if (dateHeader == undefined) {
      return swal("Confirmation!", "Report Trade Date " + moment(report.tradeDate()).format("YYYY-MM-DD") + " Is Empty", "error");
    }
    report.hTradeDate = moment(dateHeader.TransactionDate).format("DD-MMMM-YYYY");
    report.hClient = dateHeader.Clientnumber;
    report.hDescription = dateHeader.Description;

    $('#HeaderClientAllreport').html("");
    $divAllReport = $('#HeaderClientAllreport');
    $tableMain = $("<table width='100%' id='reportZep'></table>");
    $tableMain.appendTo($divAllReport);
    $theadMain = $("<thead>" +
            "<tr>" +
            "<th style='text-align: left; width: 15%'>Trade Date</th>" +
            "<th style='text-align: left; width: 1%'>:</th>" +
            "<th style='text-align: left; width: 20%'>" + report.hTradeDate + "</th>" +
            "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
            "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
            "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>Client</th>" +
            "<th style='text-align: left'>:</th>" +
            "<th style='text-align: left'>" + report.hClient + "</th>" +
            "<th style='text-align: left'>" + report.hDescription + "</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</thead>");
    $theadMain.appendTo($tableMain);

    // ==== Tbody Report New Trades ==============
    $tbodyNewTrades = $("<tbody></tbody>");
    $tbodyNewTrades.appendTo($tableMain);

    $trNewTrades = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>New Trades</td>" +
            "</tr>");
    $trNewTrades.appendTo($tbodyNewTrades);

    $trNewTrades = $("<tr></tr>");
    $trNewTrades.appendTo($tbodyNewTrades);

    $tdNewTrades = $("<td colspan='6'></td>");
    $tdNewTrades.appendTo($trNewTrades);

    $subTableNewTrades = $("<table style='width:100%; border:0'></table>");
    $subTableNewTrades.appendTo($tdNewTrades);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px'>TRADE NUMBER</th>" +
            "<th style='text-align: left; font-size: 10px'>CONTRACT</th>" +
            "<th style='text-align: left; font-size: 10px'>MONTH</th>" +
            "<th style='text-align: center; font-size: 10px'>BUY</th>" +
            "<th style='text-align: center; font-size: 10px'>SELL</th>" +
            "<th style='text-align: right; font-size: 10px'>PRICE</th>" +
            "<th style='text-align: center; font-size: 10px'>CUR</th>" +
            "</tr>");
    $tr.appendTo($subTableNewTrades);
    $tr = $("<tr>" +
            "<th style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='8'></th>" +
            "</tr>");
    $tr.appendTo($subTableNewTrades);
    for (var i in dataReport) {
      var item = Enumerable.From(dataReport[i].item).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ThenBy("$.TransactionType").ToArray();
      var buyGroup = 0;
      var SellGroup = 0;
      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='8'>" + dataReport[i].Fullname + "</td>" +
              "</tr>");
      $tr.appendTo($subTableNewTrades);
      for (var j in item) {
        var Buy = "";
        var SELL = "";
        if (item[j].TransactionType == "B") {
          Buy = item[j].Qty;
          SELL = "";
          buyGroup = buyGroup + item[j].Qty;
          SellGroup = SellGroup + 0;
        } else {
          Buy = "";
          SELL = item[j].Qty;
          buyGroup = buyGroup + 0;
          SellGroup = SellGroup + item[j].Qty;
        }

        $tr = $("<tr>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(new Date(item[j].TransactionDateString)).format("D-MMM-YY") + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + item[j].TransactionID + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + item[j].ProductID + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(item[j].ContractExpiry).format("MMM-YY") + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + Buy + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + SELL + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + item[j].PriceReport.toFixed(4) + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + item[j].Currency + "</td>" +
                "</tr>");
        $tr.appendTo($subTableNewTrades);
      }

      // ====Buy ====
      if (buyGroup == 0) {
        buyGroup = "";
      } else {
        buyGroup = buyGroup.toString() + "*";
      }

      // ====Sell ====
      if (SellGroup == 0) {
        SellGroup = "";
      } else {
        SellGroup = SellGroup.toString() + "*";
      }


      $tr = $("<tr>" +
              "<td colspan='4'></td>" +
              "<td style='text-align: center; font-size: 10px;font-weight:bold'>" + buyGroup + "</td>" +
              "<td style='text-align: center; font-size: 10px;font-weight:bold'>" + SellGroup + "</td>" +
              "<td colspan='2'></td>" +
              "</tr>");
      $tr.appendTo($subTableNewTrades);
    }

    // ==== Tbody Report Trades Fees ==============
    $tbodyTradesFees = $("<tbody></tbody>");
    $tbodyTradesFees.appendTo($tableMain);

    $trTradesFees = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Trades Fees</td>" +
            "</tr>");
    $trTradesFees.appendTo($tbodyTradesFees);

    $trTradesFees = $("<tr></tr>");
    $trTradesFees.appendTo($tbodyTradesFees);

    $tdTradesFees = $("<td colspan='6'></td>");
    $tdTradesFees.appendTo($trTradesFees);

    $subTradesFees = $("<table style='width:100%; border:0'></table>")
    $subTradesFees.appendTo($tdTradesFees);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px'>CURRENCY</th>" +
            "<th style='text-align: left; font-size: 10px'>CONTRACT AND DELIVERY</th>" +
            "<th style='text-align: right; font-size: 10px'>LOTS</th>" +
            "<th style='text-align: right; font-size: 10px'>MARKET FEES</th>" +
            "<th style='text-align: right; font-size: 10px'>CLR COMM</th>" +
            "<th style='text-align: right; font-size: 10px'>NFA</th>" +
            "<th style='text-align: right; font-size: 10px'>MISC FEES</th>" +
            "</tr>");
    $tr.appendTo($subTradesFees);
    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>");
    $tr.appendTo($subTradesFees);
    var totMarketFees = 0;
    var totCLRComm = 0;
    var totNFA = 0;
    var totMiscFees = 0;

    for (var i in dataReportfees) {
      $tr = $("<tr>" +
              "<td style='text-align: left; font-size: 9px'>" + dataReportfees[i].Currency + "</td>" +
              "<td style='text-align: left; font-size: 9px'>" + dataReportfees[i].Fullname + "  " + moment(dataReportfees[i].Contractexpiry).format("MMM-YY") + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + dataReportfees[i].Lots + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Marketfee * -1).toFixed(4) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Clrcommission * -1).toFixed(4) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Nfafee * -1).toFixed(4) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Miscfee * -1).toFixed(4) + "</td>" +
              "</tr>");
      $tr.appendTo($subTradesFees);

      totMarketFees = totMarketFees + dataReportfees[i].Marketfee;
      totCLRComm = totCLRComm + dataReportfees[i].Clrcommission;
      totNFA = totNFA + dataReportfees[i].Nfafee;
      totMiscFees = totMiscFees + dataReportfees[i].Miscfee;
    }

    $tr = $("<tr>" +
            "<td colspan ='3'style='text-align: right; font-size: 10px; font-weight:bold'>TOTAL USD</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totMarketFees * -1).toFixed(4) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totCLRComm * -1).toFixed(4) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totNFA * -1).toFixed(4) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totMiscFees * -1).toFixed(4) + "</td>" +
            "</tr>");
    $tr.appendTo($subTradesFees);

    // ==== Tbody Report Purchases and Sales ==============

    $tbodyPurchasesSales = $("<tbody></tbody>");
    $tbodyPurchasesSales.appendTo($tableMain);

    $trPurchasesSales = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Purchases and Sales</td>" +
            "</tr>");
    $trPurchasesSales.appendTo($tbodyPurchasesSales);

    $trPurchasesSales = $("<tr></tr>");
    $trPurchasesSales.appendTo($tbodyPurchasesSales);

    $tdPurchasesSales = $("<td colspan='6'></td>");
    $tdPurchasesSales.appendTo($trPurchasesSales);

    $subTablePurchasesSales = $("<table style='width:100%; border:0'></table>");
    $subTablePurchasesSales.appendTo($tdPurchasesSales);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px; width: 15%'>TRADE NUMBER</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>LONG</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>SHORT</th>" +
            "<th style='text-align: right; font-size: 10px; width: 10%'>PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>CUR</th>" +
            "<th style='text-align: right; font-size: 10px; width: 15%'>CONTRACT VALUE</th>" +
            "</tr>");
    $tr.appendTo($subTablePurchasesSales);
    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>");
    $tr.appendTo($subTablePurchasesSales);
    var TotalUSDPurchase = 0;
    for (var i in PurchaseSales) {
      var item = Enumerable.From(PurchaseSales[i].item).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ThenBy("$.TransactionType").ToArray();
      var LongGroup = 0;
      var ShortGroup = 0;
      var ContValue = 0;

      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='7'>" + PurchaseSales[i].Fullname + " " + moment(PurchaseSales[i].ContractExpiry).format("MMM-YY") + "</td>" +
              "</tr>");
      $tr.appendTo($subTablePurchasesSales);
      for (var j in item) {
        var Long = "";
        var Short = "";
        if (item[j].TransactionType == "B") {
          Long = item[j].Qty;
          Short = "";
          LongGroup = LongGroup + item[j].Qty;
          ShortGroup = ShortGroup + 0;
        } else {
          Long = "";
          Short = item[j].Qty;
          LongGroup = LongGroup + 0;
          ShortGroup = ShortGroup + item[j].Qty;
        }

        $tr = $("<tr>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(getUTCDate(item[j].TransactionDate)).format("D-MMM-YY") + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + item[j].TransactionID + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + Long + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + Short + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + item[j].PriceReport.toFixed(4) + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + item[j].Currency + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(item[j].ContractValue, "n2") + "</td>" +
                "</tr>");
        $tr.appendTo($subTablePurchasesSales);
        ContValue = ContValue + item[j].ContractValue;
      }

      $tr = $("<tr>" +
              "<td colspan='2'></td>" +
              "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + LongGroup + "*</td>" +
              "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + ShortGroup + "*</td>" +
              "<td colspan='2'  style='text-align: right; font-size: 10px; font-weight:bold'>Realized Profit or Loss</td>" +
              "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(ContValue, "n2") + "</td>" +
              "</tr>");
      TotalUSDPurchase = TotalUSDPurchase + ContValue;
      $tr.appendTo($subTablePurchasesSales);
    }
    $tr = $("<tr>" +
            "<td colspan='6'  style='text-align: right; font-size: 10px; font-weight:bold'>Total USD</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(TotalUSDPurchase, "n2") + "</td>" +
            "</tr>");
    $tr.appendTo($subTablePurchasesSales);

    // ==== Tbody Report Open Trades ==============
    var dataReportOpenTrede = res.Data.DetailsOpenTrade;
    $tbodyOpenTrades = $("<tbody></tbody>");
    $tbodyOpenTrades.appendTo($tableMain);

    $trOpenTrades = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Open Trades</td>" +
            "</tr>");
    $trOpenTrades.appendTo($tbodyOpenTrades);

    $trOpenTrades = $("<tr></tr>");
    $trOpenTrades.appendTo($tbodyOpenTrades);

    $tdOpenTrades = $("<td colspan='6'></td>");
    $tdOpenTrades.appendTo($trOpenTrades);

    $subTableOpenTrades = $("<table style='width:100%; border:0'></table>");
    $subTableOpenTrades.appendTo($tdOpenTrades);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px; width: 15%'>CONTRACT DESCRIPTION</th>" +
            "<th style='text-align: right; font-size: 10px; width: 9%'>TRADE PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 10%'>SETTLEMENT PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>LONG</th>" +
            "<th style='text-align: right; font-size: 10px; width: 6%'>SHORT</th>" +
            "<th style='text-align: right; font-size: 10px; width: 15%'>NOTIONAL VALUE</th>" +
            "</tr>");
    $tr.appendTo($subTableOpenTrades);
    $tr = $("<tr>" +
            "<th style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></th>" +
            "</tr>");
    $tr.appendTo($subTableOpenTrades);
    
    for (var i in dataReportOpenTrede) {
      var toatalNationalValue = 0;
      var item = Enumerable.From(dataReportOpenTrede[i].item).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='7'>" + dataReportOpenTrede[i].Currency + "</td>" +
              "</tr>");
      $tr.appendTo($subTableOpenTrades);


      var itemSort = Enumerable.From(item).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
      var arrayObj = [];
      for (var s in itemSort) {
        arrayObj = arrayObj.concat(itemSort[s])
      }
      var DataGroup = Enumerable.From(arrayObj).GroupBy("$.Fullname").ToArray();

      for (var d in DataGroup) {

        var groubByItem = DataGroup[d].source;

        var groupedData = _.groupBy(groubByItem, function (d) {
          return d.Contractexpiry
        });
        for (var gb in groupedData) {
          var groubByItem = groupedData[gb];
          var LongGroup = 0;
          var ShortGroup = 0;
          var ContValue = 0;
          var Bintang = "";
          var Bintang2 = "";
          for (var item in groubByItem) {
            var Long = "";
            var Short = "";
            if (groubByItem[item].TransactionType == "B") {
              Long = groubByItem[item].Qty;
              Short = "";
              LongGroup = LongGroup + groubByItem[item].Qty;
              ShortGroup = "";
              Bintang2 = "";
              Bintang = "*";
            } else {
              Long = "";
              Short = groubByItem[item].Qty;
              LongGroup = "";
              ShortGroup = ShortGroup + groubByItem[item].Qty;
              Bintang2 = "*";
              Bintang = "";
            }

            $tr = $("<tr>" +
                    "<td  style='text-align: left; font-size: 9px'>" + moment(getUTCDate(new Date(groubByItem[item].Tradedate))).format("D-MMM-YY") + "</td>" +
                    "<td  style='text-align: left; font-size: 9px'>" + groubByItem[item].Fullname + " " + moment(getUTCDate(groubByItem[item].Contractexpiry)).format("MMM-YY") + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(groubByItem[item].TradePrice, "n4") + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + (groubByItem[item].SettlementPrice).toFixed(4) + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + Long + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + Short + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(groubByItem[item].NationalValue, "n2") + "</td>" +
                    "</tr>");
            $tr.appendTo($subTableOpenTrades);
            ContValue = ContValue + groubByItem[item].NationalValue;
            toatalNationalValue = toatalNationalValue + groubByItem[item].NationalValue;
          }

          $tr = $("<tr>" +
                  "<td colspan='4'></td>" +
                  "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + LongGroup + "" + Bintang + "</td>" +
                  "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + ShortGroup + "" + Bintang2 + "</td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(ContValue, "n2") + "</td>" +
                  "</tr>");
          $tr.appendTo($subTableOpenTrades);
        }
      }
       $tr = $("<tr>" +
            "<td colspan='4'></td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold' colspan='2'>Unrealized Profit or Loss ("+dataReportOpenTrede[i].Currency+")</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(toatalNationalValue, "n2") + "</td>" +
            "</tr>");
      $tr.appendTo($subTableOpenTrades);
    }
   

    // ==== Tbody Report Payments and Receipts ==============
    $tbodyDeskFee = $("<tbody></tbody>");
    $tbodyDeskFee.appendTo($tableMain);

    $trDeskFee = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Payments and Receipts</td>" +
            "</tr>");
    $trDeskFee.appendTo($tbodyDeskFee);

    $trDeskFee = $("<tr></tr>");
    $trDeskFee.appendTo($tbodyDeskFee);

    $tdDeskFee = $("<td colspan='6'></td>");
    $tdDeskFee.appendTo($trDeskFee);

    $subDeskFee = $("<table style='width:100%; border:0'></table>");
    $subDeskFee.appendTo($tdDeskFee);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width:10%'>DATE</th>" +
            "<th style='text-align: left; font-size: 10px; width:15%'>VALUE DATE</th>" +
            "<th style='text-align: right; font-size: 10px; width:10%'>TYPE</th>" +
            "<th style='text-align: right; font-size: 10px; width:40%'>DESCRIPTION</th>" +
            "<th style='text-align: right; font-size: 10px; width:10%'>CUR</th>" +
            "<th style='text-align: right; font-size: 10px; width:15%'>AMOUNT</th>" +
            "</tr>");
    $tr.appendTo($subDeskFee);
    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>");
    $tr.appendTo($subDeskFee);
    var totAmount = 0;

    for (var i in detailDeskFee) {
      $tr = $("<tr>" +
              "<td style='text-align: left; font-size: 9px'>" + moment(detailDeskFee[i].FeeDate).format("D/MM/YYYY") + "</td>" +
              "<td style='text-align: left; font-size: 9px'>" + moment(detailDeskFee[i].FeeDate).format("D/MM/YYYY") + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + detailDeskFee[i].FeeDescription2 + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + detailDeskFee[i].FeeDescription1 + "</td>" +
              "<td style='text-align: right; font-size: 9px'>USD</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (detailDeskFee[i].FeeAmount).toFixed(2) + "</td>" +
              "</tr>");
      $tr.appendTo($subDeskFee);

      totAmount = totAmount + detailDeskFee[i].FeeAmount;
    }

    $tr = $("<tr>" +
            "<td colspan ='5'style='text-align: right; font-size: 10px; font-weight:bold'>TOTAL USD</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + totAmount.toFixed(2) + "</td>" +
            "</tr>");
    $tr.appendTo($subDeskFee);

    // ==== Tbody Report Summary ==============
    report.getDataReportSummary($tableMain, dateHeader.Description, report.clients(), moment(report.tradeDate()).format("YYYY-MM-DD"));
  });
}

report.getDataReportNewTradeClients = function () {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Clients: report.clients(),
  };
  var dataValueReport = [];
  var url = "/allreportclient/displaynewtradeclient"

  ajaxPost(url, param, function (res) {
    var dateHeader = res.Data.Header;
    var dataReport = Enumerable.From(res.Data.Details).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ToArray();
    if (dateHeader == undefined) {
      return swal("Confirmation!", "Report Trade Date " + moment(report.tradeDate()).format("YYYY-MM-DD") + " Is Empty", "error");
    }
    report.hTradeDate = moment(dateHeader.TransactionDate).format("DD-MMMM-YYYY");
    report.hClient = dateHeader.Clientnumber;
    report.hDescription = dateHeader.Description;

    $('#HeaderClientNewTradereport').html("");
    $divAllReport = $('#HeaderClientNewTradereport');
    $tableMain = $("<table width='100%' id='reportZep'></table>");
    $tableMain.appendTo($divAllReport);
    $theadMain = $("<thead>" +
            "<tr>" +
            "<th style='text-align: left; width: 15%'>Trade Date</th>" +
            "<th style='text-align: left; width: 1%'>:</th>" +
            "<th style='text-align: left; width: 20%'>" + report.hTradeDate + "</th>" +
            "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
            "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
            "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>Client</th>" +
            "<th style='text-align: left'>:</th>" +
            "<th style='text-align: left'>" + report.hClient + "</th>" +
            "<th style='text-align: left'>" + report.hDescription + "</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</thead>");
    $theadMain.appendTo($tableMain);
    // ==== Tbody Report New Trades ==============
    $tbodyNewTrades = $("<tbody></tbody>");
    $tbodyNewTrades.appendTo($tableMain);

    $trNewTrades = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>New Trades</td>" +
            "</tr>");
    $trNewTrades.appendTo($tbodyNewTrades);

    $trNewTrades = $("<tr></tr>");
    $trNewTrades.appendTo($tbodyNewTrades);

    $tdNewTrades = $("<td colspan='6'></td>");
    $tdNewTrades.appendTo($trNewTrades);

    $subTableNewTrades = $("<table style='width:100%; border:0'></table>");
    $subTableNewTrades.appendTo($tdNewTrades);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px'>TRADE NUMBER</th>" +
            "<th style='text-align: left; font-size: 10px'>CONTRACT</th>" +
            "<th style='text-align: left; font-size: 10px'>MONTH</th>" +
            "<th style='text-align: center; font-size: 10px'>BUY</th>" +
            "<th style='text-align: center; font-size: 10px'>SELL</th>" +
            "<th style='text-align: right; font-size: 10px'>PRICE</th>" +
            "<th style='text-align: center; font-size: 10px'>CUR</th>" +
            "</tr>");
    $tr.appendTo($subTableNewTrades);
    $tr = $("<tr>" +
            "<th style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='8'></th>" +
            "</tr>");
    $tr.appendTo($subTableNewTrades);
    for (var i in dataReport) {
      var item = Enumerable.From(dataReport[i].item).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ThenBy("$.TransactionType").ToArray();
      var buyGroup = 0;
      var SellGroup = 0;
      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='8'>" + dataReport[i].Fullname + "</td>" +
              "</tr>");
      $tr.appendTo($subTableNewTrades);
      for (var j in item) {
        var Buy = "";
        var SELL = "";
        if (item[j].TransactionType == "B") {
          Buy = item[j].Qty;
          SELL = "";
          buyGroup = buyGroup + item[j].Qty;
          SellGroup = SellGroup + 0;
        } else {
          Buy = "";
          SELL = item[j].Qty;
          buyGroup = buyGroup + 0;
          SellGroup = SellGroup + item[j].Qty;
        }

        $tr = $("<tr>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(new Date(item[j].TransactionDateString)).format("D-MMM-YY") + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + item[j].TransactionID + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + item[j].ProductID + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(item[j].ContractExpiry).format("MMM-YY") + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + Buy + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + SELL + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + item[j].PriceReport.toFixed(4) + "</td>" +
                "<td  style='text-align: center; font-size: 9px'>" + item[j].Currency + "</td>" +
                "</tr>");
        $tr.appendTo($subTableNewTrades);
      }

      // ====Buy ====
      if (buyGroup == 0) {
        buyGroup = "";
      } else {
        buyGroup = buyGroup.toString() + "*";
      }

      // ====Sell ====
      if (SellGroup == 0) {
        SellGroup = "";
      } else {
        SellGroup = SellGroup.toString() + "*";
      }

      $tr = $("<tr>" +
              "<td colspan='4'></td>" +
              "<td style='text-align: center; font-size: 10px;font-weight:bold'>" + buyGroup + "</td>" +
              "<td style='text-align: center; font-size: 10px;font-weight:bold'>" + SellGroup + "</td>" +
              "<td colspan='2'></td>" +
              "</tr>");
      $tr.appendTo($subTableNewTrades);
    }
  });
}

report.getDataReportPurchaseAndSalesClients = function () {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Clients: report.clients()
  };
  var dataValueReport = [];
  var url = "/allreportclient/displaypurchasesalesclient";

  ajaxPost(url, param, function (res) {
    var dateHeader = res.Data.HeaderPurchsaeSales;
    var PurchaseSales = Enumerable.From(res.Data.DetailsPurchaseSales).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ToArray();
    if (dateHeader == undefined) {
      return swal("Confirmation!", "Report Trade Date " + moment(report.tradeDate()).format("YYYY-MM-DD") + " Is Empty", "error");
    }
    report.hTradeDate = moment(dateHeader.TransactionDate).format("DD-MMMM-YYYY");
    report.hClient = dateHeader.Clientnumber;
    report.hDescription = dateHeader.Description;

    $('#HeaderClientsPurchaseAndSalereport').html("");
    $divAllReport = $('#HeaderClientsPurchaseAndSalereport');
    $tableMain = $("<table width='100%' id='reportZep'></table>");
    $tableMain.appendTo($divAllReport);
    $theadMain = $("<thead>" +
            "<tr>" +
            "<th style='text-align: left; width: 15%'>Trade Date</th>" +
            "<th style='text-align: left; width: 1%'>:</th>" +
            "<th style='text-align: left; width: 20%'>" + report.hTradeDate + "</th>" +
            "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
            "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
            "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>Client</th>" +
            "<th style='text-align: left'>:</th>" +
            "<th style='text-align: left'>" + report.hClient + "</th>" +
            "<th style='text-align: left'>" + report.hDescription + "</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</thead>");
    $theadMain.appendTo($tableMain);
    // ==== Tbody Report Purchases and Sales ==============

    $tbodyPurchasesSales = $("<tbody></tbody>");
    $tbodyPurchasesSales.appendTo($tableMain);

    $trPurchasesSales = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Purchases and Sales</td>" +
            "</tr>");
    $trPurchasesSales.appendTo($tbodyPurchasesSales);

    $trPurchasesSales = $("<tr></tr>");
    $trPurchasesSales.appendTo($tbodyPurchasesSales);

    $tdPurchasesSales = $("<td colspan='6'></td>");
    $tdPurchasesSales.appendTo($trPurchasesSales);

    $subTablePurchasesSales = $("<table style='width:100%; border:0'></table>");
    $subTablePurchasesSales.appendTo($tdPurchasesSales);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px; width: 15%'>TRADE NUMBER</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>LONG</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>SHORT</th>" +
            "<th style='text-align: right; font-size: 10px; width: 10%'>PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>CUR</th>" +
            "<th style='text-align: right; font-size: 10px; width: 15%'>CONTRACT VALUE</th>" +
            "</tr>");
    $tr.appendTo($subTablePurchasesSales);
    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>");
    $tr.appendTo($subTablePurchasesSales);
    var TotalUSDPurchase = 0;
    for (var i in PurchaseSales) {
      var item = Enumerable.From(PurchaseSales[i].item).OrderBy("$.Fullname").ThenBy("$.ProductID").ThenBy("$.ContractExpiry").ThenBy("$.TransactionType").ToArray();
      var LongGroup = 0;
      var ShortGroup = 0;
      var ContValue = 0;

      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='7'>" + PurchaseSales[i].Fullname + " " + moment(PurchaseSales[i].ContractExpiry).format("MMM-YY") + "</td>" +
              "</tr>");
      $tr.appendTo($subTablePurchasesSales);
      for (var j in item) {
        var Long = "";
        var Short = "";
        if (item[j].TransactionType == "B") {
          Long = item[j].Qty;
          Short = "";
          LongGroup = LongGroup + item[j].Qty;
          ShortGroup = ShortGroup + 0;
        } else {
          Long = "";
          Short = item[j].Qty;
          LongGroup = LongGroup + 0;
          ShortGroup = ShortGroup + item[j].Qty;
        }

        $tr = $("<tr>" +
                "<td  style='text-align: left; font-size: 9px'>" + moment(getUTCDate(item[j].TransactionDate)).format("D-MMM-YY") + "</td>" +
                "<td  style='text-align: left; font-size: 9px'>" + item[j].TransactionID + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + Long + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + Short + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + item[j].PriceReport.toFixed(4) + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + item[j].Currency + "</td>" +
                "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(item[j].ContractValue, "n2") + "</td>" +
                "</tr>");
        $tr.appendTo($subTablePurchasesSales);
        ContValue = ContValue + item[j].ContractValue;
      }

      $tr = $("<tr>" +
              "<td colspan='2'></td>" +
              "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + LongGroup + "*</td>" +
              "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + ShortGroup + "*</td>" +
              "<td colspan='2'  style='text-align: right; font-size: 10px; font-weight:bold'>Realized Profit or Loss</td>" +
              "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(ContValue, "n2") + "</td>" +
              "</tr>");
      TotalUSDPurchase = TotalUSDPurchase + ContValue;
      $tr.appendTo($subTablePurchasesSales);
    }
    $tr = $("<tr>" +
            "<td colspan='6'  style='text-align: right; font-size: 10px; font-weight:bold'>Total USD</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(TotalUSDPurchase, "n2") + "</td>" +
            "</tr>");
    $tr.appendTo($subTablePurchasesSales);
  });
}

report.getDataReportTradeFeesClients = function () {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Clients: report.clients()
  };
  var dataValueReport = [];
  var url = "/allreportclient/displaytradefeesclient";

  ajaxPost(url, param, function (res) {
    var dateHeader = res.Data.Header;
    var dataReportfees = Enumerable.From(res.Data.ResultDataTradeFees).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
    if (dateHeader == undefined) {
      return swal("Confirmation!", "Report Trade Date " + moment(report.tradeDate()).format("YYYY-MM-DD") + " Is Empty", "error");
    }
    report.hTradeDate = moment(dateHeader.TransactionDate).format("DD-MMMM-YYYY");
    report.hClient = dateHeader.Client;
    report.hDescription = dateHeader.description;

    $('#HeaderClientsTradeFeesreport').html("");
    $divAllReport = $('#HeaderClientsTradeFeesreport');
    $tableMain = $("<table width='100%' id='reportZep'></table>");
    $tableMain.appendTo($divAllReport);
    $theadMain = $("<thead>" +
            "<tr>" +
            "<th style='text-align: left; width: 15%'>Trade Date</th>" +
            "<th style='text-align: left; width: 1%'>:</th>" +
            "<th style='text-align: left; width: 20%'>" + report.hTradeDate + "</th>" +
            "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
            "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
            "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>Client</th>" +
            "<th style='text-align: left'>:</th>" +
            "<th style='text-align: left'>" + report.hClient + "</th>" +
            "<th style='text-align: left'>" + report.hDescription + "</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</thead>");
    $theadMain.appendTo($tableMain);
    // ==== Tbody Report Trades Fees ==============
    $tbodyTradesFees = $("<tbody></tbody>");
    $tbodyTradesFees.appendTo($tableMain);

    $trTradesFees = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Trades Fees</td>" +
            "</tr>");
    $trTradesFees.appendTo($tbodyTradesFees);

    $trTradesFees = $("<tr></tr>");
    $trTradesFees.appendTo($tbodyTradesFees);

    $tdTradesFees = $("<td colspan='6'></td>");
    $tdTradesFees.appendTo($trTradesFees);

    $subTradesFees = $("<table style='width:100%; border:0'></table>");
    $subTradesFees.appendTo($tdTradesFees);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px'>CURRENCY</th>" +
            "<th style='text-align: left; font-size: 10px'>CONTRACT AND DELIVERY</th>" +
            "<th style='text-align: right; font-size: 10px'>LOTS</th>" +
            "<th style='text-align: right; font-size: 10px'>MARKET FEES</th>" +
            "<th style='text-align: right; font-size: 10px'>CLR COMM</th>" +
            "<th style='text-align: right; font-size: 10px'>NFA</th>" +
            "<th style='text-align: right; font-size: 10px'>MISC FEES</th>" +
            "</tr>");
    $tr.appendTo($subTradesFees);
    $tr = $("<tr>" +
            "<td style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></td>" +
            "</tr>");
    $tr.appendTo($subTradesFees);
    var totMarketFees = 0;
    var totCLRComm = 0;
    var totNFA = 0;
    var totMiscFees = 0;

    for (var i in dataReportfees) {
      $tr = $("<tr>" +
              "<td style='text-align: left; font-size: 9px'>" + dataReportfees[i].Currency + "</td>" +
              "<td style='text-align: left; font-size: 9px'>" + dataReportfees[i].Fullname + "  " + moment(dataReportfees[i].Contractexpiry).format("MMM-YY") + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + dataReportfees[i].Lots + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Marketfee * -1).toFixed(4) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Clrcommission * -1).toFixed(4) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Nfafee * -1).toFixed(4) + "</td>" +
              "<td style='text-align: right; font-size: 9px'>" + (dataReportfees[i].Miscfee * -1).toFixed(4) + "</td>" +
              "</tr>");
      $tr.appendTo($subTradesFees);

      totMarketFees = totMarketFees + dataReportfees[i].Marketfee;
      totCLRComm = totCLRComm + dataReportfees[i].Clrcommission;
      totNFA = totNFA + dataReportfees[i].Nfafee;
      totMiscFees = totMiscFees + dataReportfees[i].Miscfee;
    }

    $tr = $("<tr>" +
            "<td colspan ='3'style='text-align: right; font-size: 10px; font-weight:bold'>TOTAL USD</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totMarketFees * -1).toFixed(4) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totCLRComm * -1).toFixed(4) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totNFA * -1).toFixed(4) + "</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + (totMiscFees * -1).toFixed(4) + "</td>" +
            "</tr>");
    $tr.appendTo($subTradesFees);
  });
}

report.getDataReportOpenTradeClients = function () {
  var param = {
    Transactiondatestring: moment(report.tradeDate()).format("YYYY-MM-DD"),
    Clients: report.clients()
  };
  var dataValueReport = [];
  var url = "/allreportclient/displayopentradeclient";

  ajaxPost(url, param, function (res) {
    var dateHeader = res.Data.HeaderOpenTrade;
    var dataReportfees = Enumerable.From(res.Data.DetailsOpenTrade).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
    var dateHeader = res.Data.Header;
    var dataReportOpenTrede = Enumerable.From(res.Data.DetailsOpenTrade).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
    if (dateHeader == undefined) {
      return swal("Confirmation!", "Report Trade Date " + moment(report.tradeDate()).format("YYYY-MM-DD") + " Is Empty", "error");
    }
    report.hTradeDate = moment(dateHeader.TransactionDate).format("DD-MMMM-YYYY");
    report.hClient = dateHeader.Client;
    report.hDescription = dateHeader.description;

    $('#HeaderClientsOpenTradereport').html("");
    $divAllReport = $('#HeaderClientsOpenTradereport');
    $tableMain = $("<table width='100%' id='reportZep'></table>");
    $tableMain.appendTo($divAllReport);
    $theadMain = $("<thead>" +
            "<tr>" +
            "<th style='text-align: left; width: 15%'>Trade Date</th>" +
            "<th style='text-align: left; width: 1%'>:</th>" +
            "<th style='text-align: left; width: 20%'>" + report.hTradeDate + "</th>" +
            "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
            "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
            "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
            "</tr>" +
            "<tr>" +
            "<th style='text-align: left'>Client</th>" +
            "<th style='text-align: left'>:</th>" +
            "<th style='text-align: left'>" + report.hClient + "</th>" +
            "<th style='text-align: left'>" + report.hDescription + "</th>" +
            "<th>&nbsp;</th>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "<tr>" +
            "</tr>" +
            "</thead>");
    $theadMain.appendTo($tableMain);
    // ==== Tbody Report Open Trades ==============
    var dataReportOpenTrede = res.Data.DetailsOpenTrade;
    $tbodyOpenTrades = $("<tbody></tbody>");
    $tbodyOpenTrades.appendTo($tableMain);

    $trOpenTrades = $("<tr>" +
            "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Open Trades</td>" +
            "</tr>");
    $trOpenTrades.appendTo($tbodyOpenTrades);

    $trOpenTrades = $("<tr></tr>");
    $trOpenTrades.appendTo($tbodyOpenTrades);

    $tdOpenTrades = $("<td colspan='6'></td>");
    $tdOpenTrades.appendTo($trOpenTrades);

    $subTableOpenTrades = $("<table style='width:100%; border:0'></table>");
    $subTableOpenTrades.appendTo($tdOpenTrades);

    $tr = $("<tr class='pageBreak'>" +
            "<th style='text-align: left; font-size: 10px; width: 25%'>TRADE DATE</th>" +
            "<th style='text-align: left; font-size: 10px; width: 15%'>CONTRACT DESCRIPTION</th>" +
            "<th style='text-align: right; font-size: 10px; width: 9%'>TRADE PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 10%'>SETTLEMENT PRICE</th>" +
            "<th style='text-align: right; font-size: 10px; width: 5%'>LONG</th>" +
            "<th style='text-align: right; font-size: 10px; width: 6%'>SHORT</th>" +
            "<th style='text-align: right; font-size: 10px; width: 15%'>NOTIONAL VALUE</th>" +
            "</tr>");
    $tr.appendTo($subTableOpenTrades);
    $tr = $("<tr>" +
            "<th style='margin-top:5px;border-top:1pt solid #3c82be;' colspan='7'></th>" +
            "</tr>");
    $tr.appendTo($subTableOpenTrades);
    var toatalNationalValue = 0;
    for (var i in dataReportOpenTrede) {
      var item = Enumerable.From(dataReportOpenTrede[i].item).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
      $tr = $("<tr>" +
              "<td style='font-weight: bold; font-size: 10px' colspan='7'>" + dataReportOpenTrede[i].Currency + "</td>" +
              "</tr>");
      $tr.appendTo($subTableOpenTrades);


      var itemSort = Enumerable.From(item).OrderBy("$.Fullname").ThenBy("$.Contractexpiry").ToArray();
      var arrayObj = [];
      for (var s in itemSort) {
        arrayObj = arrayObj.concat(itemSort[s])
      }
      var DataGroup = Enumerable.From(arrayObj).GroupBy("$.Fullname").ToArray();

      for (var d in DataGroup) {

        var groubByItem = DataGroup[d].source;

        var groupedData = _.groupBy(groubByItem, function (d) {
          return d.Contractexpiry
        });
        for (var gb in groupedData) {
          var groubByItem = groupedData[gb];
          var LongGroup = 0;
          var ShortGroup = 0;
          var ContValue = 0;
          var Bintang = "";
          var Bintang2 = "";
          for (var item in groubByItem) {
            var Long = "";
            var Short = "";
            if (groubByItem[item].TransactionType == "B") {
              Long = groubByItem[item].Qty;
              Short = "";
              LongGroup = LongGroup + groubByItem[item].Qty;
              ShortGroup = "";
              Bintang2 = "";
              Bintang = "*";
            } else {
              Long = "";
              Short = groubByItem[item].Qty;
              LongGroup = "";
              ShortGroup = ShortGroup + groubByItem[item].Qty;
              Bintang2 = "*";
              Bintang = "";
            }

            $tr = $("<tr>" +
                    "<td  style='text-align: left; font-size: 9px'>" + moment(getUTCDate(new Date(groubByItem[item].Tradedate))).format("D-MMM-YY") + "</td>" +
                    "<td  style='text-align: left; font-size: 9px'>" + groubByItem[item].Fullname + " " + moment(getUTCDate(groubByItem[item].Contractexpiry)).format("MMM-YY") + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(groubByItem[item].TradePrice, "n4") + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + (groubByItem[item].SettlementPrice).toFixed(4) + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + Long + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + Short + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(groubByItem[item].NationalValue, "n2") + "</td>" +
                    "</tr>");
            $tr.appendTo($subTableOpenTrades);
            ContValue = ContValue + groubByItem[item].NationalValue;
            toatalNationalValue = toatalNationalValue + groubByItem[item].NationalValue;
          }

          $tr = $("<tr>" +
                  "<td colspan='4'></td>" +
                  "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + LongGroup + "" + Bintang + "</td>" +
                  "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + ShortGroup + "" + Bintang2 + "</td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(ContValue, "n2") + "</td>" +
                  "</tr>");
          $tr.appendTo($subTableOpenTrades);
        }
      }
    }
    $tr = $("<tr>" +
            "<td colspan='4'></td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold' colspan='2'>Unrealized Profit or Loss (USD)</td>" +
            "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(toatalNationalValue, "n2") + "</td>" +
            "</tr>");
    $tr.appendTo($subTableOpenTrades);
  });
}

$(document).ready(function () {
  if (model.PageId() == "ReportAccount") {
    report.getAccount();
  } else {
    report.getClients();
  }
  var date = report.tradeDate();
  report.dateReport(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay());
  $("#TradeDate").closest("span.k-datepicker").width(130);
});