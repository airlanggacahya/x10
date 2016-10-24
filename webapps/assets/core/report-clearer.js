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

rptClearerSumm.tradeDate.subscribe(function (value) {
  if (model.View() != "false") {
    rptClearerSumm.search();
  }
});

rptClearerSumm.clients.subscribe(function (value) {
  if (model.View() != "false") {
    rptClearerSumm.search();
  }
});

rptClearerSumm.reportType.subscribe(function (value) {
  if (model.View() != "false") {
    rptClearerSumm.search();
  }
});

rptClearerSumm.search = function () {
  var typeReport = rptClearerSumm.reportType();
  switch (typeReport) {
    case "All":
      rptClearerSumm.ClearerSummary();
      break;
    default:
      break;
  }
}

rptClearerSumm.refresh = function () {
  rptClearerSumm.tradeDate(new Date());
  rptClearerSumm.getClients();
  rptClearerSumm.ClearerSummary();
}

rptClearerSumm.exportReport = function () {
  rptClearerSumm.search();
  var TextHtml = "";
  for (var i in rptClearerSumm.lenRpt()) {
    var htmlTable = document.getElementsByClassName("reportZep" + i);
    if (htmlTable != undefined) {
      var Report = $("<div />").append($(htmlTable)).html();
      Report = Report.replace("/static/img/logo-ecdoc.png", "../../img/logo-ecdoc.png");
      TextHtml = TextHtml + Report.toString();
    }
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

rptClearerSumm.ClearerSummary = function () {
  var url = "/reportclient/accountsummary";
  var param = {
    TradeDate: moment(rptClearerSumm.tradeDate()).format("YYYY-MM-DD"),
    Clients: rptClearerSumm.clients(),
  }
  ajaxPost(url, param, function (res) {
    $('#allClientReport').html("");
    $divAllReport = $('#allClientReport');
    var DataRptClientAccounts = res.Data;
    rptClearerSumm.lenRpt(DataRptClientAccounts);
    for (var rpt in DataRptClientAccounts) {
      var Header = DataRptClientAccounts[rpt].Header;
      var Account = DataRptClientAccounts[rpt].Account;
      var NewTradeData = DataRptClientAccounts[rpt].NewTradeData;
      var TradeFeeData = DataRptClientAccounts[rpt].TradeFeeData;
      var PurchaseSalesData = DataRptClientAccounts[rpt].PurchaseSalesData;
      var DeskFeeData = DataRptClientAccounts[rpt].DeskFeeData;
      var OpenTradeData = DataRptClientAccounts[rpt].OpenTradeData;
      var SummaryAccount = DataRptClientAccounts[rpt].SummaryAccount;

      $tableMain = $("<table width='100%' class='reportZep" + rpt + "' style='font-family: 'Courier New''></table>");
      $tableMain.appendTo($divAllReport);
      $theadMain = $("<thead>" +
              "<tr>" +
              "<th style='text-align: left; width: 15%'>Trade Date</th>" +
              "<th style='text-align: left; width: 1%'>:</th>" +
              "<th style='text-align: left; width: 20%'>" + moment(new Date(Header.reportdate)).format("dddd, DD-MMMM-YYYY") + "</th>" +
              "<th style='text-align: left; width: 20%'>&nbsp;</th>" +
              "<th style='text-align: left; width: 4%'>&nbsp;</th>" +
              "<th style='text-align: right; width: 30%'  rowspan='4'><img src='/static/img/logo-ecdoc.png' alt='Logo Zephirum' /></th>" +
              "</tr>" +
              "<tr>" +
              "<th style='text-align: left'>Client</th>" +
              "<th style='text-align: left'>:</th>" +
              "<th style='text-align: left'>" + Header.clientnumber + "</th>" +
              "<th>&nbsp;</th>" +
              "<th>&nbsp;</th>" +
              "</tr>" +
              "<tr>" +
              "<th style='text-align: left'>Account</th>" +
              "<th style='text-align: left'>:</th>" +
              "<th style='text-align: left'>" + Header.accountid + "</th>" +
              "<th style='text-align: left'>" + Header.description + "</th>" +
              "<th>&nbsp;</th>" +
              "</tr>" +
              "<tr>" +
              "</tr>" +
              "</thead>");
      $theadMain.appendTo($tableMain);

      // ==== Tbody Report New Trades =======================================================================================
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
      if (NewTradeData.length == 0) {
        $tr = $("<tr>" +
                "<td style='text-align: center; font-weight: bold; font-size: 10px' colspan='8'>No New Trades</td>" +
                "</tr>");
        $tr.appendTo($subTableNewTrades);
      } else {
        for (newTd in NewTradeData) {
          $tr = $("<tr>" +
                  "<td style='font-weight: bold; font-size: 10px' colspan='8'>" + NewTradeData[newTd].Fullname + "</td>" +
                  "</tr>");
          $tr.appendTo($subTableNewTrades);
          var ItemNewTrade = NewTradeData[newTd].items;
          var buyGroup = 0;
          var SellGroup = 0;
          for (items in ItemNewTrade) {
            var listItem = ItemNewTrade[items];
            var Buy = "";
            var SELL = "";
            if (listItem.TrType == "B") {
              Buy = listItem.Qty;
              SELL = "";
              buyGroup = buyGroup + listItem.Qty;
              SellGroup = SellGroup + 0;
            } else {
              Buy = "";
              SELL = listItem.Qty;
              buyGroup = buyGroup + 0;
              SellGroup = SellGroup + listItem.Qty;
            }

            $tr = $("<tr>" +
                    "<td  style='text-align: left; font-size: 9px'>" + moment(new Date(listItem.TradeDate)).format("D-MMM-YY") + "</td>" +
                    "<td  style='text-align: left; font-size: 9px'>" + listItem.TrId + "</td>" +
                    "<td  style='text-align: left; font-size: 9px'>" + listItem.ProductId + "</td>" +
                    "<td  style='text-align: left; font-size: 9px'>" + moment(listItem.ContractExpiry).format("MMM-YY") + "</td>" +
                    "<td  style='text-align: center; font-size: 9px'>" + Buy + "</td>" +
                    "<td  style='text-align: center; font-size: 9px'>" + SELL + "</td>" +
                    "<td  style='text-align: right; font-size: 9px'>" + listItem.Price.toFixed(4) + "</td>" +
                    "<td  style='text-align: center; font-size: 9px'>" + listItem.Currency + "</td>" +
                    "</tr>");
            $tr.appendTo($subTableNewTrades);
          }
          if (buyGroup == 0) {
            buyGroup = "";
          } else {
            buyGroup = buyGroup.toString() + "*";
          }

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
      }

      // ==== Tbody Report Trades Fees ======================================================================================
      if (TradeFeeData.length != 0) {
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


        for (tf in TradeFeeData) {
          $tr = $("<tr>" +
                  "<td style='font-weight: bold; font-size: 10px' colspan='6'>" + TradeFeeData[tf].Currency + "</td>" +
                  "</tr>");
          $tr.appendTo($subTradesFees);
          var itemstf = TradeFeeData[tf].items;
          var totMarketFees = 0;
          var totCLRComm = 0;
          var totNFA = 0;
          var totMiscFees = 0;
          for (var rptTF in itemstf) {
            $tr = $("<tr>" +
                    "<td style='text-align: left; font-size: 9px'>" + itemstf[rptTF].ProductName + "  " + moment(itemstf[rptTF].ContractExpiry).format("MMM-YY") + "</td>" +
                    "<td style='text-align: right; font-size: 9px'>" + itemstf[rptTF].Qty + "</td>" +
                    "<td style='text-align: right; font-size: 9px'>" + (itemstf[rptTF].MarketFee * -1).toFixed(2) + "</td>" +
                    "<td style='text-align: right; font-size: 9px'>" + (itemstf[rptTF].ClrCommission * -1).toFixed(2) + "</td>" +
                    "<td style='text-align: right; font-size: 9px'>" + (itemstf[rptTF].NfaFee * -1).toFixed(2) + "</td>" +
                    "<td style='text-align: right; font-size: 9px'>" + (itemstf[rptTF].MiscFee * -1).toFixed(2) + "</td>" +
                    "</tr>");
            $tr.appendTo($subTradesFees);

            totMarketFees = totMarketFees + itemstf[rptTF].MarketFee;
            totCLRComm = totCLRComm + itemstf[rptTF].ClrCommission;
            totNFA = totNFA + itemstf[rptTF].NfaFee;
            totMiscFees = totMiscFees + itemstf[rptTF].MiscFee;
          }
          $tr = $("<tr>" +
                  "<td colspan ='2'style='text-align: right; font-size: 10px; font-weight:bold'>TOTAL " + TradeFeeData[tf].Currency + "</td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString((totMarketFees * -1), "n2") + "</td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString((totCLRComm * -1), "n2") + "</td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString((totNFA * -1), "n2") + "</td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString((totMiscFees * -1), "n2") + "</td>" +
                  "</tr>");
          $tr.appendTo($subTradesFees);
        }
      }

      // ==== Tbody Report Purchases and Sales ==============================================================================
      if (PurchaseSalesData.length != 0) {
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
        for (var ps in PurchaseSalesData) {
          var dtlPSheder = PurchaseSalesData[ps];
          var dtlPSDetails = PurchaseSalesData[ps].Details;
          var TotalUSDPurchase = 0;
          for (dtlPS in dtlPSDetails) {
            $tr = $("<tr>" +
                    "<td style='font-weight: bold; font-size: 10px' colspan='7'>" + dtlPSDetails[dtlPS].Fullname + " " + moment(dtlPSDetails[dtlPS].Expiry).format("MMM-YY") + "</td>" +
                    "</tr>");
            $tr.appendTo($subTablePurchasesSales);
            var itemsPS = dtlPSDetails[dtlPS].items;
            var LongGroup = 0;
            var ShortGroup = 0;
            var ContValue = 0;
            for (var psItemsindex in itemsPS) {
              var Long = "";
              var Short = "";
              if (itemsPS[psItemsindex].TransType == "B") {
                Long = itemsPS[psItemsindex].Qty;
                Short = "";
                LongGroup = LongGroup + itemsPS[psItemsindex].Qty;
                ShortGroup = ShortGroup + 0;
              } else {
                Long = "";
                Short = itemsPS[psItemsindex].Qty;
                LongGroup = LongGroup + 0;
                ShortGroup = ShortGroup + itemsPS[psItemsindex].Qty;
              }

              $tr = $("<tr>" +
                      "<td  style='text-align: left; font-size: 9px'>" + moment(getUTCDate(itemsPS[psItemsindex].TradeDate)).format("D-MMM-YY") + "</td>" +
                      "<td  style='text-align: left; font-size: 9px'>" + itemsPS[psItemsindex].TrId + "</td>" +
                      "<td  style='text-align: right; font-size: 9px'>" + Long + "</td>" +
                      "<td  style='text-align: right; font-size: 9px'>" + Short + "</td>" +
                      "<td  style='text-align: right; font-size: 9px'>" + itemsPS[psItemsindex].Price.toFixed(4) + "</td>" +
                      "<td  style='text-align: right; font-size: 9px'>" + itemsPS[psItemsindex].Currency + "</td>" +
                      "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(itemsPS[psItemsindex].ContractValue, "n2") + "</td>" +
                      "</tr>");
              $tr.appendTo($subTablePurchasesSales);
              ContValue = ContValue + itemsPS[psItemsindex].ContractValue;
            }
            if (LongGroup == 0) {
              LongGroup = "";
            } else {
              LongGroup = LongGroup.toString() + "*";
            }

            if (ShortGroup == 0) {
              ShortGroup = "";
            } else {
              ShortGroup = ShortGroup.toString() + "*";
            }

            $tr = $("<tr>" +
                    "<td colspan='2'></td>" +
                    "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + LongGroup + "</td>" +
                    "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + ShortGroup + "</td>" +
                    "<td colspan='2'  style='text-align: right; font-size: 10px; font-weight:bold'>Realized Profit or Loss</td>" +
                    "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(ContValue, "n2") + "</td>" +
                    "</tr>");
            TotalUSDPurchase = TotalUSDPurchase + ContValue;
            $tr.appendTo($subTablePurchasesSales);
          }
          $tr = $("<tr>" +
                  "<td colspan='6'  style='text-align: right; font-size: 10px; font-weight:bold'>Total " + PurchaseSalesData[ps].Currency + "</td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(TotalUSDPurchase, "n2") + "</td>" +
                  "</tr>");
          $tr.appendTo($subTablePurchasesSales);
        }
      }

      // ==== Tbody Report Payments and Receipts ============================================================================
      if (DeskFeeData.length > 0 && DeskFeeData[0].items.length != 0) {
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
        for (var dfIndex in DeskFeeData) {
          var itemsDf = DeskFeeData[dfIndex].items
          var totAmount = 0;
          for (var itemsDfIndex in itemsDf) {
            $tr = $("<tr>" +
                    "<td style='text-align: left; font-size: 9px'>" + moment(itemsDf[itemsDfIndex].FeeDate).format("D/MM/YYYY") + "</td>" +
                    "<td style='text-align: left; font-size: 9px'>" + moment(itemsDf[itemsDfIndex].ValueDate).format("D/MM/YYYY") + "</td>" +
                    "<td style='text-align: right; font-size: 9px'>" + itemsDf[itemsDfIndex].Description + "</td>" +
                    "<td style='text-align: right; font-size: 9px'>" + itemsDf[itemsDfIndex].Description + "</td>" +
                    "<td style='text-align: right; font-size: 9px'>" + itemsDf[itemsDfIndex].Currency + "</td>" +
                    "<td style='text-align: right; font-size: 9px'>" + (itemsDf[itemsDfIndex].Amount).toFixed(2) + "</td>" +
                    "</tr>");
            $tr.appendTo($subDeskFee);
            totAmount = totAmount + itemsDf[itemsDfIndex].Amount;
          }
          $tr = $("<tr>" +
                  "<td colspan ='5'style='text-align: right; font-size: 10px; font-weight:bold'>TOTAL USD</td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + totAmount.toFixed(2) + "</td>" +
                  "</tr>");
          $tr.appendTo($subDeskFee);
        }
      }

      // ==== Tbody Report Open Trades ======================================================================================
      if (OpenTradeData.length != 0) {
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
        for (opTrade in OpenTradeData) {
          $tr = $("<tr>" +
                  "<td style='font-weight: bold; font-size: 10px' colspan='7'>" + OpenTradeData[opTrade].Currency + "</td>" +
                  "</tr>");
          $tr.appendTo($subTableOpenTrades);
          var dtlOpenTrade = OpenTradeData[opTrade].Details;
          var toatalNationalValue = 0;

          for (dtlOpIndex in dtlOpenTrade) {
            var dtlItemOpTr = dtlOpenTrade[dtlOpIndex].items;
            var LongGroup = 0;
            var ShortGroup = 0;
            var ContValue = 0;
            var Bintang = "";
            var Bintang2 = "";

            for (var dtlOpItemIndex in dtlItemOpTr) {
              var Long = "";
              var Short = "";
              if (dtlItemOpTr[dtlOpItemIndex].TransactionType == "B") {
                Long = dtlItemOpTr[dtlOpItemIndex].Qty;
                Short = "";
                LongGroup = LongGroup + dtlItemOpTr[dtlOpItemIndex].Qty;
                ShortGroup = "";
                Bintang2 = "";
                Bintang = "*";
              } else {
                Long = "";
                Short = dtlItemOpTr[dtlOpItemIndex].Qty;
                LongGroup = "";
                ShortGroup = ShortGroup + dtlItemOpTr[dtlOpItemIndex].Qty;
                Bintang2 = "*";
                Bintang = "";
              }
              $tr = $("<tr>" +
                      "<td  style='text-align: left; font-size: 9px'>" + moment(getUTCDate(new Date(dtlItemOpTr[dtlOpItemIndex].TradeDate))).format("D-MMM-YY") + "</td>" +
                      "<td  style='text-align: left; font-size: 9px'>" + dtlItemOpTr[dtlOpItemIndex].ContractDescription + " " + moment(getUTCDate(dtlItemOpTr[dtlOpItemIndex].ContractExpiry)).format("MMM-YY") + "</td>" +
                      "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(dtlItemOpTr[dtlOpItemIndex].TradePrice, "n4") + "</td>" +
                      "<td  style='text-align: right; font-size: 9px'>" + (dtlItemOpTr[dtlOpItemIndex].SettlementPrice).toFixed(4) + "</td>" +
                      "<td  style='text-align: right; font-size: 9px'>" + Long + "</td>" +
                      "<td  style='text-align: right; font-size: 9px'>" + Short + "</td>" +
                      "<td  style='text-align: right; font-size: 9px'>" + kendo.toString(dtlItemOpTr[dtlOpItemIndex].NotionalValue, "n2") + "</td>" +
                      "</tr>");
              $tr.appendTo($subTableOpenTrades);
              ContValue = ContValue + dtlItemOpTr[dtlOpItemIndex].NotionalValue;
              toatalNationalValue = toatalNationalValue + dtlItemOpTr[dtlOpItemIndex].NotionalValue;
            }
            $tr = $("<tr>" +
                    "<td colspan='4'></td>" +
                    "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + LongGroup + "" + Bintang + "</td>" +
                    "<td style='text-align: right; font-size: 10px;font-weight:bold'>" + ShortGroup + "" + Bintang2 + "</td>" +
                    "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(ContValue, "n2") + "</td>" +
                    "</tr>");
            $tr.appendTo($subTableOpenTrades);

          }
          $tr = $("<tr>" +
                  "<td colspan='4'></td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold' colspan='2'>Unrealized Profit or Loss (" + OpenTradeData[opTrade].Currency + ")</td>" +
                  "<td style='text-align: right; font-size: 10px; font-weight:bold'>" + kendo.toString(toatalNationalValue, "n2") + "</td>" +
                  "</tr>");
          $tr.appendTo($subTableOpenTrades);
        }
      }

      // ==== Tbody Report Summary ==========================================================================================
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
              "<td style='text-align: left; font-weight: bold; font-size: 10px' colspan='7'>Account Summary : " + Account + " " + Header.description + "</td>" +
              "</tr>" +
              "<tr>" +
              "<td style='text-align: left; font-size: 10px; font-weight: bold' colspan='7'>Comsolidate Financial Statement as of : " + moment(new Date(Header.reportdate)).format("dddd, DD-MMMM-YYYY") + " </td>" +
              "</tr>");
      $tr.appendTo($subSummaryAccount);


      $tbodySummaryAccountValue = $("<tbody></tbody>");
      $tbodySummaryAccountValue.appendTo($tableMain);
      $trHederCurrCode = $("<tr></tr>");
      $trHederCurrCode.appendTo($tbodySummaryAccountValue);
      $tdCurrSummary = $("<td colspan='6' style='text-align: left; width: 15%;  font-size: 10px'></td>");
      $tdCurrSummary.appendTo($trHederCurrCode);

      $subSummaryAccountvalue = $("<table style='border:0'></table>");
      $subSummaryAccountvalue.appendTo($tdCurrSummary);



      var borderPx = (SummaryAccount.length - 1);
      var px = 1;
      var colspanHeader = (SummaryAccount.length);
      var lastvalue = (SummaryAccount.length - 1);

      $trHederCurrCodeValue = $("<tr></tr>");
      $trHederCurrCodeValue.appendTo($subSummaryAccountvalue);
      $tdCurrCode = $("<td style='text-align: left; width: 15%;  font-size: 10px'></td>");
      $tdCurrCode.appendTo($trHederCurrCodeValue);
      for (var SumIndex in SummaryAccount) {
        $tdCurrCode = $("<td style='text-align: center; font-weight: bold;  width: 15%; font-size: 10px;text-align: right; padding-right:20px'>" + SummaryAccount[SumIndex].CurrencyCode + "</td>");
        $tdCurrCode.appendTo($trHederCurrCodeValue);
      }

      $trFXSPORTRATE = $("<tr></tr>");
      $trFXSPORTRATE.appendTo($subSummaryAccountvalue);
      $tdFXSPORTRATE = $("<td style='border-right: 1px solid; font-weight: bold; width: 15%;  font-size: 11px; text-align: left; padding-right:20px'>FX SPOT RATE</td>");
      $tdFXSPORTRATE.appendTo($trFXSPORTRATE);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdFXSPORTRATE = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].SpotRate, "n4") + "</td>");
        $tdFXSPORTRATE.appendTo($trFXSPORTRATE);
      }
      px = 1;
      $trACCOUNTCASHBAL = $("<tr></tr>");
      $trACCOUNTCASHBAL.appendTo($subSummaryAccountvalue);
      $tdACCOUNTCASHBAL = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>ACCOUNT CASH BAL</td>");
      $tdACCOUNTCASHBAL.appendTo($trACCOUNTCASHBAL);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdACCOUNTCASHBAL = $("<td style='border-right: " + px + "px solid; text-align: right;  font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].AccountCashBalance, "n2") + "</td>");
        $tdACCOUNTCASHBAL.appendTo($trACCOUNTCASHBAL);
      }

      px = 1;
      $trPAYRECEIPTS = $("<tr></tr>");
      $trPAYRECEIPTS.appendTo($subSummaryAccountvalue);
      $tdPAYRECEIPTS = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>PAYMENTS/RECEIPTS</td>");
      $tdPAYRECEIPTS.appendTo($trPAYRECEIPTS);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdPAYRECEIPTS = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].PaymentReceipt, "n2") + "</td>");
        $tdPAYRECEIPTS.appendTo($trPAYRECEIPTS);
      }

      px = 1;
      $trFXTRADES = $("<tr></tr>");
      $trFXTRADES.appendTo($subSummaryAccountvalue);
      $tdFXTRADES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>FX TRADES</td>");
      $tdFXTRADES.appendTo($trFXTRADES);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdFXTRADES = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>0</td>");
        $tdFXTRADES.appendTo($trFXTRADES);
      }

      px = 1;
      $trREALIZEDPL = $("<tr></tr>");
      $trREALIZEDPL.appendTo($subSummaryAccountvalue);
      $tdREALIZEDPL = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>REALIZED P/L</td>");
      $tdREALIZEDPL.appendTo($trREALIZEDPL);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdREALIZEDPL = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].RealizeProfitLoss, "n2") + "</td>");
        $tdREALIZEDPL.appendTo($trREALIZEDPL);
      }

      px = 1;
      $trMARKETFEES = $("<tr></tr>");
      $trMARKETFEES.appendTo($subSummaryAccountvalue);
      $MARKETFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MARKET FEES</td>");
      $MARKETFEES.appendTo($trMARKETFEES);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $MARKETFEES = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].MarketFee, "n2") + "</td>");
        $MARKETFEES.appendTo($trMARKETFEES);
      }

      px = 1;
      $trCLRCOMMISSION = $("<tr></tr>");
      $trCLRCOMMISSION.appendTo($subSummaryAccountvalue);
      $tdCLRCOMMISSION = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;CLR COMMISSION</td>");
      $tdCLRCOMMISSION.appendTo($trCLRCOMMISSION);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdCLRCOMMISSION = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].ClrCommission, "n2") + "</td>");
        $tdCLRCOMMISSION.appendTo($trCLRCOMMISSION);
      }

      px = 1;
      $trNFAFEES = $("<tr></tr>");
      $trNFAFEES.appendTo($subSummaryAccountvalue);
      $tdNFAFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;NFA FEES</td>");
      $tdNFAFEES.appendTo($trNFAFEES);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdNFAFEES = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].NfaFee, "n2") + "</td>");
        $tdNFAFEES.appendTo($trNFAFEES);
      }

      px = 1;
      $trMISCFEES = $("<tr></tr>");
      $trMISCFEES.appendTo($subSummaryAccountvalue);
      $MISCFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MISC FEES</td>");
      $MISCFEES.appendTo($trMISCFEES);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $MISCFEES = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].MiscFee, "n2") + "</td>");
        $MISCFEES.appendTo($trMISCFEES);
      }

      px = 1;
      $trTOTALFEES = $("<tr></tr>");
      $trTOTALFEES.appendTo($subSummaryAccountvalue);
      $tdTOTALFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>TOTAL FEES</td>");
      $tdTOTALFEES.appendTo($trTOTALFEES);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdTOTALFEES = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].TotalFee, "n2") + "</td>");
        $tdTOTALFEES.appendTo($trTOTALFEES);
      }

      px = 1;
      $trNEWCASHBALANCE = $("<tr></tr>");
      $trNEWCASHBALANCE.appendTo($subSummaryAccountvalue);
      $tdNEWCASHBALANCE = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%;  font-size: 11px'>NEW CASH BALANCE</td>");
      $tdNEWCASHBALANCE.appendTo($trNEWCASHBALANCE);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdNEWCASHBALANCE = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].NewCashBalance, "n2") + "</td>");
        $tdNEWCASHBALANCE.appendTo($trNEWCASHBALANCE);
      }

      px = 1;
      $trOPENTRADEEQUITY = $("<tr></tr>");
      $trOPENTRADEEQUITY.appendTo($subSummaryAccountvalue);
      $tdOPENTRADEEQUITY = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>OPEN TRADE EQUITY</td>");
      $tdOPENTRADEEQUITY.appendTo($trOPENTRADEEQUITY);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdOPENTRADEEQUITY = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].OpenTradeEquity, "n2") + "</td>");
        $tdOPENTRADEEQUITY.appendTo($trOPENTRADEEQUITY);
      }

      px = 1;
      $trTOTALEQUITY = $("<tr></tr>");
      $trTOTALEQUITY.appendTo($subSummaryAccountvalue);
      $tdTOTALEQUITY = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>TOTAL EQUITY</td>");
      $tdTOTALEQUITY.appendTo($trTOTALEQUITY);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdTOTALEQUITY = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].TotalEquity, "n2") + "</td>");
        $tdTOTALEQUITY.appendTo($trTOTALEQUITY);
      }

      px = 1;
      $trNETLIQUIDVALUE = $("<tr></tr>");
      $trNETLIQUIDVALUE.appendTo($subSummaryAccountvalue);
      $tdNETLIQUIDVALUE = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>NET LIQUID. VALUE</td>");
      $tdNETLIQUIDVALUE.appendTo($trNETLIQUIDVALUE);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdNETLIQUIDVALUE = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].NewLiquidValue, "n2") + "</td>");
        $tdNETLIQUIDVALUE.appendTo($trNETLIQUIDVALUE);
      }

      px = 1;
      $trMARGDEFEXCESS = $("<tr></tr>");
      $trMARGDEFEXCESS.appendTo($subSummaryAccountvalue);
      $tdMARGDEFEXCESS = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 10px'>MARG. DEF/EXCESS</td>");
      $tdMARGDEFEXCESS.appendTo($trMARGDEFEXCESS);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMARGDEFEXCESS = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>0</td>");
        $tdMARGDEFEXCESS.appendTo($trMARGDEFEXCESS);
      }

      px = 1;
      $trMtdPaymentReceipt = $("<tr></tr>");
      $trMtdPaymentReceipt.appendTo($subSummaryAccountvalue);
      $tdMtdPaymentReceipt = $("<td style='border-right: 1px solid; font-weight: bold; text-align: left; width: 15%; font-size: 10px'>MTD PAY./RCPTS</td>");
      $tdMtdPaymentReceipt.appendTo($trMtdPaymentReceipt);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMtdPaymentReceipt = $("<td style='border-right: " + px + "px solid;text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].MtdPaymentReceipt, "n2") + "</td>");
        $tdMtdPaymentReceipt.appendTo($trMtdPaymentReceipt);
      }

      px = 1;
      $trMtdRealizedPl = $("<tr></tr>");
      $trMtdRealizedPl.appendTo($subSummaryAccountvalue);
      $tdMtdRealizedPl = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>MTD REALIZED</td>");
      $tdMtdRealizedPl.appendTo($trMtdRealizedPl);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMtdRealizedPl = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].MtdRealizedPl, "n2") + "</td>");
        $tdMtdRealizedPl.appendTo($trMtdRealizedPl);
      }

      px = 1;
      $trMTDMARKET = $("<tr></tr>");
      $trMTDMARKET.appendTo($subSummaryAccountvalue);
      $tdMTDMARKET = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD MARKET</td>");
      $tdMTDMARKET.appendTo($trMTDMARKET);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMTDMARKET = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].MtdMarketFee, "n2") + "</td>");
        $tdMTDMARKET.appendTo($trMTDMARKET);
      }

      px = 1;
      $trMTDCLR = $("<tr></tr>");
      $trMTDCLR.appendTo($subSummaryAccountvalue);
      $tdMTDCLR = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD CLR</td>");
      $tdMTDCLR.appendTo($trMTDCLR);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMTDCLR = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].MtdClrCommission, "n2") + "</td>");
        $tdMTDCLR.appendTo($trMTDCLR);
      }

      px = 1;
      $trMtdNfaFee = $("<tr></tr>");
      $trMtdNfaFee.appendTo($subSummaryAccountvalue);
      $tdMtdNfaFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD NFA FEES</td>");
      $tdMtdNfaFee.appendTo($trMtdNfaFee);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMtdNfaFee = $("<td style='border-right: " + px + "px solid; text-align: right;  font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].MtdNfaFee, "n2") + "</td>");
        $tdMtdNfaFee.appendTo($trMtdNfaFee);
      }

      px = 1;
      $trMtdMiscFee = $("<tr></tr>");
      $trMtdMiscFee.appendTo($subSummaryAccountvalue);
      $tdMtdMiscFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD MISC FEES</td>");
      $tdMtdMiscFee.appendTo($trMtdMiscFee);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMtdMiscFee = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].MtdMiscFee, "n2") + "</td>");
        $tdMtdMiscFee.appendTo($trMtdMiscFee);
      }

      px = 1;
      $trMtdTotalFee = $("<tr></tr>");
      $trMtdTotalFee.appendTo($subSummaryAccountvalue);
      $tdMtdTotalFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; width: 15%; font-size: 11px'>MTD TTL COMM/FEES</td>");
      $tdMtdTotalFee.appendTo($trMtdTotalFee);
      for (var i in SummaryAccount) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMtdTotalFee = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryAccount[i].MtdTotalFee, "n2") + "</td>");
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
      if (SummaryAccount[lastvalue] != undefined) {
        totalSummaryAccount = SummaryAccount[lastvalue].CurrencyCode.split(" ")[2];
        NlvTd4 = SummaryAccount[lastvalue].NlvTd4;
        NlvTd3 = SummaryAccount[lastvalue].NlvTd3;
        NlvDiff4 = SummaryAccount[lastvalue].NlvDiff4;
        NlvTd2 = SummaryAccount[lastvalue].NlvTd2;
        NlvDiff3 = SummaryAccount[lastvalue].NlvDiff3;
        NlvTd1 = SummaryAccount[lastvalue].NlvTd1;
        NlvDiff2 = SummaryAccount[lastvalue].NlvDiff2;
        NlvTd = SummaryAccount[lastvalue].NlvTd;
        NlvDiff1 = SummaryAccount[lastvalue].NlvDiff1;
      }
      $trTT = $("<tr></tr>");
      $trTT.appendTo($subTotSum);
      $tdTT = $("<td></td>");
      $tdTT.appendTo($trTT);
      $tdTT = $("<td colspan='5' style='font-weight: bold;text-align: left; width: 20%; font-size: 11px; padding-top: 10px'>Last 5 NLV Values:(" + totalSummaryAccount + ")</td>");
      $tdTT.appendTo($trTT);

      $trT4 = $("<tr></tr>");
      $trT4.appendTo($subTotSum);
      $tdT4 = $("<td></td>");
      $tdT4.appendTo($trT4);
      $tdT4 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 4</td>");
      $tdT4.appendTo($trT4);
      $tdT4 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvTd4, "n2") + "</td>");
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
      $tdT3 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvTd3, "n2") + "</td>");
      $tdT3.appendTo($trT3);
      $tdT3 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvDiff4, "n2") + "</td>");
      $tdT3.appendTo($trT3);
      $tdT3 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
      $tdT3.appendTo($trT3);

      $trT2 = $("<tr></tr>");
      $trT2.appendTo($subTotSum);
      $tdT2 = $("<td></td>");
      $tdT2.appendTo($trT2);
      $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 2</td>");
      $tdT2.appendTo($trT2);
      $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvTd2, "n2") + "</td>");
      $tdT2.appendTo($trT2);
      $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvDiff3, "n2") + "</td>");
      $tdT2.appendTo($trT2);
      $tdT2 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
      $tdT2.appendTo($trT2);

      $trT1 = $("<tr></tr>");
      $trT1.appendTo($subTotSum);
      $tdT1 = $("<td></td>");
      $tdT1.appendTo($trT1);
      $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 1</td>");
      $tdT1.appendTo($trT1);
      $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvTd1, "n2") + "</td>");
      $tdT1.appendTo($trT1);
      $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvDiff2, "n2") + "</td>");
      $tdT1.appendTo($trT1);
      $tdT1 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
      $tdT1.appendTo($trT1);

      $trT0 = $("<tr></tr>");
      $trT0.appendTo($subTotSum);
      $tdT0 = $("<td></td>");
      $tdT0.appendTo($trT0);
      $tdT0 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T</td>");
      $tdT0.appendTo($trT0);
      $tdT0 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvTd, "n2") + "</td>");
      $tdT0.appendTo($trT0);
      $tdT0 = $("<td style='font-weight: bold; text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvDiff1, "n2") + "</td>");
      $tdT0.appendTo($trT0);
      $tdT0 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'>(today)</td>");
      $tdT0.appendTo($trT0);
    }
//    rptClearerSumm.ClientSummary($divAllReport, rptClearerSumm.clients(), rptClearerSumm.tradeDate());
  });
}

rptClearerSumm.ClientSummary = function (MainTable, Clients, tradeDate) {
  var param = {
    TradeDate: moment(tradeDate).format("YYYY-MM-DD"),
    Clients: Clients
  };
  var url = "/reportclient/clientsummary";
  ajaxPost(url, param, function (res) {
    var SummaryClient = res.SummaryClient;
    if (SummaryClient.length != 0) {
      $tableMain = MainTable;
      $tbodySummaryClient = $("<tbody></tbody>");
      $tbodySummaryClient.appendTo($tableMain);

      $trSummaryClient = $("<tr>" +
              "<td colspan='6' style='font-size: 12px;font-weight: bold;color: #3c82be;text-align: center;padding-top: 10px;'>Client Summary</td>" +
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
              "<td style='text-align: left; font-weight: bold; font-size: 10px' colspan='7'>Clients Summary : " + Clients + "</td>" +
              "</tr>" +
              "<tr>" +
              "<td style='text-align: left; font-size: 10px; font-weight: bold' colspan='7'>Comsolidate Financial Statement as of : " + moment(new Date(tradeDate)).format("dddd, DD-MMMM-YYYY") + " </td>" +
              "</tr>");
      $tr.appendTo($subSummaryClient);


      $tbodySummaryClientValue = $("<tbody></tbody>");
      $tbodySummaryClientValue.appendTo($tableMain);
      $trHederClientCode = $("<tr></tr>");
      $trHederClientCode.appendTo($tbodySummaryClientValue);
      $tdClientSummary = $("<td colspan='6' style='text-align: left; width: 15%;  font-size: 10px'></td>");
      $tdClientSummary.appendTo($trHederClientCode);

      $subSummaryClientvalue = $("<table style='border:0'></table>");
      $subSummaryClientvalue.appendTo($tdClientSummary);

      var borderPx = (SummaryClient.length - 1);
      var px = 1;
      var colspanHeader = (SummaryClient.length);
      var lastvalue = (SummaryClient.length - 1);

      $trHederCurrCodeValue = $("<tr></tr>");
      $trHederCurrCodeValue.appendTo($subSummaryClientvalue);
      $tdCurrCode = $("<td style='text-align: left; width: 12%;  font-size: 10px'></td>");
      $tdCurrCode.appendTo($trHederCurrCodeValue);
      for (var SumIndex in SummaryClient) {
        $tdCurrCode = $("<td style='text-align: center; font-weight: bold;  width: 12%; font-size: 10px;text-align: right; padding-right:20px'>" + SummaryClient[SumIndex].CurrencyCode + "</td>");
        $tdCurrCode.appendTo($trHederCurrCodeValue);
      }

      $trFXSPORTRATE = $("<tr></tr>");
      $trFXSPORTRATE.appendTo($subSummaryClientvalue);
      $tdFXSPORTRATE = $("<td style='border-right: 1px solid; font-weight: bold; text-align:left; font-size: 11px; padding-right:20px'>FX SPOT RATE</td>");
      $tdFXSPORTRATE.appendTo($trFXSPORTRATE);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdFXSPORTRATE = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].SpotRate, "n4") + "</td>");
        $tdFXSPORTRATE.appendTo($trFXSPORTRATE);
      }
      px = 1;
      $trACCOUNTCASHBAL = $("<tr></tr>");
      $trACCOUNTCASHBAL.appendTo($subSummaryClientvalue);
      $tdACCOUNTCASHBAL = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>ACCOUNT CASH BAL</td>");
      $tdACCOUNTCASHBAL.appendTo($trACCOUNTCASHBAL);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdACCOUNTCASHBAL = $("<td style='border-right: " + px + "px solid; text-align: right;  font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].AccountCashBalance, "n2") + "</td>");
        $tdACCOUNTCASHBAL.appendTo($trACCOUNTCASHBAL);
      }

      px = 1;
      $trPAYRECEIPTS = $("<tr></tr>");
      $trPAYRECEIPTS.appendTo($subSummaryClientvalue);
      $tdPAYRECEIPTS = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>PAYMENTS/RECEIPTS</td>");
      $tdPAYRECEIPTS.appendTo($trPAYRECEIPTS);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdPAYRECEIPTS = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].PaymentReceipt, "n2") + "</td>");
        $tdPAYRECEIPTS.appendTo($trPAYRECEIPTS);
      }

      px = 1;
      $trFXTRADES = $("<tr></tr>");
      $trFXTRADES.appendTo($subSummaryClientvalue);
      $tdFXTRADES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>FX TRADES</td>");
      $tdFXTRADES.appendTo($trFXTRADES);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdFXTRADES = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>0</td>");
        $tdFXTRADES.appendTo($trFXTRADES);
      }

      px = 1;
      $trREALIZEDPL = $("<tr></tr>");
      $trREALIZEDPL.appendTo($subSummaryClientvalue);
      $tdREALIZEDPL = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>REALIZED P/L</td>");
      $tdREALIZEDPL.appendTo($trREALIZEDPL);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdREALIZEDPL = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].RealizeProfitLoss, "n2") + "</td>");
        $tdREALIZEDPL.appendTo($trREALIZEDPL);
      }

      px = 1;
      $trMARKETFEES = $("<tr></tr>");
      $trMARKETFEES.appendTo($subSummaryClientvalue);
      $MARKETFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MARKET FEES</td>");
      $MARKETFEES.appendTo($trMARKETFEES);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $MARKETFEES = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].MarketFee, "n2") + "</td>");
        $MARKETFEES.appendTo($trMARKETFEES);
      }

      px = 1;
      $trCLRCOMMISSION = $("<tr></tr>");
      $trCLRCOMMISSION.appendTo($subSummaryClientvalue);
      $tdCLRCOMMISSION = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;CLR COMMISSION</td>");
      $tdCLRCOMMISSION.appendTo($trCLRCOMMISSION);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdCLRCOMMISSION = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].ClrCommission, "n2") + "</td>");
        $tdCLRCOMMISSION.appendTo($trCLRCOMMISSION);
      }

      px = 1;
      $trNFAFEES = $("<tr></tr>");
      $trNFAFEES.appendTo($subSummaryClientvalue);
      $tdNFAFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;NFA FEES</td>");
      $tdNFAFEES.appendTo($trNFAFEES);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdNFAFEES = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].NfaFee, "n2") + "</td>");
        $tdNFAFEES.appendTo($trNFAFEES);
      }

      px = 1;
      $trMISCFEES = $("<tr></tr>");
      $trMISCFEES.appendTo($subSummaryClientvalue);
      $MISCFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MISC FEES</td>");
      $MISCFEES.appendTo($trMISCFEES);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $MISCFEES = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].MiscFee, "n2") + "</td>");
        $MISCFEES.appendTo($trMISCFEES);
      }

      px = 1;
      $trTOTALFEES = $("<tr></tr>");
      $trTOTALFEES.appendTo($subSummaryClientvalue);
      $tdTOTALFEES = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>TOTAL FEES</td>");
      $tdTOTALFEES.appendTo($trTOTALFEES);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdTOTALFEES = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].TotalFee, "n2") + "</td>");
        $tdTOTALFEES.appendTo($trTOTALFEES);
      }

      px = 1;
      $trNEWCASHBALANCE = $("<tr></tr>");
      $trNEWCASHBALANCE.appendTo($subSummaryClientvalue);
      $tdNEWCASHBALANCE = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>NEW CASH BALANCE</td>");
      $tdNEWCASHBALANCE.appendTo($trNEWCASHBALANCE);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdNEWCASHBALANCE = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].NewCashBalance, "n2") + "</td>");
        $tdNEWCASHBALANCE.appendTo($trNEWCASHBALANCE);
      }

      px = 1;
      $trOPENTRADEEQUITY = $("<tr></tr>");
      $trOPENTRADEEQUITY.appendTo($subSummaryClientvalue);
      $tdOPENTRADEEQUITY = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>OPEN TRADE EQUITY</td>");
      $tdOPENTRADEEQUITY.appendTo($trOPENTRADEEQUITY);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdOPENTRADEEQUITY = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].OpenTradeEquity, "n2") + "</td>");
        $tdOPENTRADEEQUITY.appendTo($trOPENTRADEEQUITY);
      }

      px = 1;
      $trTOTALEQUITY = $("<tr></tr>");
      $trTOTALEQUITY.appendTo($subSummaryClientvalue);
      $tdTOTALEQUITY = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>TOTAL EQUITY</td>");
      $tdTOTALEQUITY.appendTo($trTOTALEQUITY);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdTOTALEQUITY = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].TotalEquity, "n2") + "</td>");
        $tdTOTALEQUITY.appendTo($trTOTALEQUITY);
      }

      px = 1;
      $trNETLIQUIDVALUE = $("<tr></tr>");
      $trNETLIQUIDVALUE.appendTo($subSummaryClientvalue);
      $tdNETLIQUIDVALUE = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>NET LIQUID. VALUE</td>");
      $tdNETLIQUIDVALUE.appendTo($trNETLIQUIDVALUE);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdNETLIQUIDVALUE = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].NewLiquidValue, "n2") + "</td>");
        $tdNETLIQUIDVALUE.appendTo($trNETLIQUIDVALUE);
      }

      px = 1;
      $trMARGDEFEXCESS = $("<tr></tr>");
      $trMARGDEFEXCESS.appendTo($subSummaryClientvalue);
      $tdMARGDEFEXCESS = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 10px'>MARG. DEF/EXCESS</td>");
      $tdMARGDEFEXCESS.appendTo($trMARGDEFEXCESS);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMARGDEFEXCESS = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>0</td>");
        $tdMARGDEFEXCESS.appendTo($trMARGDEFEXCESS);
      }

      px = 1;
      $trMtdPaymentReceipt = $("<tr></tr>");
      $trMtdPaymentReceipt.appendTo($subSummaryClientvalue);
      $tdMtdPaymentReceipt = $("<td style='border-right: 1px solid; font-weight: bold; text-align: left; font-size: 10px'>MTD PAY./RCPTS</td>");
      $tdMtdPaymentReceipt.appendTo($trMtdPaymentReceipt);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMtdPaymentReceipt = $("<td style='border-right: " + px + "px solid;text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].MtdPaymentReceipt, "n2") + "</td>");
        $tdMtdPaymentReceipt.appendTo($trMtdPaymentReceipt);
      }

      px = 1;
      $trMtdRealizedPl = $("<tr></tr>");
      $trMtdRealizedPl.appendTo($subSummaryClientvalue);
      $tdMtdRealizedPl = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>MTD REALIZED</td>");
      $tdMtdRealizedPl.appendTo($trMtdRealizedPl);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMtdRealizedPl = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].MtdRealizedPl, "n2") + "</td>");
        $tdMtdRealizedPl.appendTo($trMtdRealizedPl);
      }

      px = 1;
      $trMTDMARKET = $("<tr></tr>");
      $trMTDMARKET.appendTo($subSummaryClientvalue);
      $tdMTDMARKET = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD MARKET</td>");
      $tdMTDMARKET.appendTo($trMTDMARKET);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMTDMARKET = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].MtdMarketFee, "n2") + "</td>");
        $tdMTDMARKET.appendTo($trMTDMARKET);
      }

      px = 1;
      $trMTDCLR = $("<tr></tr>");
      $trMTDCLR.appendTo($subSummaryClientvalue);
      $tdMTDCLR = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD CLR</td>");
      $tdMTDCLR.appendTo($trMTDCLR);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMTDCLR = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].MtdClrCommission, "n2") + "</td>");
        $tdMTDCLR.appendTo($trMTDCLR);
      }

      px = 1;
      $trMtdNfaFee = $("<tr></tr>");
      $trMtdNfaFee.appendTo($subSummaryClientvalue);
      $tdMtdNfaFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left;  font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD NFA FEES</td>");
      $tdMtdNfaFee.appendTo($trMtdNfaFee);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMtdNfaFee = $("<td style='border-right: " + px + "px solid; text-align: right;  font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].MtdNfaFee, "n2") + "</td>");
        $tdMtdNfaFee.appendTo($trMtdNfaFee);
      }

      px = 1;
      $trMtdMiscFee = $("<tr></tr>");
      $trMtdMiscFee.appendTo($subSummaryClientvalue);
      $tdMtdMiscFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>&nbsp;&nbsp;&nbsp;&nbsp;MTD MISC FEES</td>");
      $tdMtdMiscFee.appendTo($trMtdMiscFee);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMtdMiscFee = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].MtdMiscFee, "n2") + "</td>");
        $tdMtdMiscFee.appendTo($trMtdMiscFee);
      }

      px = 1;
      $trMtdTotalFee = $("<tr></tr>");
      $trMtdTotalFee.appendTo($subSummaryClientvalue);
      $tdMtdTotalFee = $("<td style='border-right: 1px solid; font-weight: bold;text-align: left; font-size: 11px'>MTD TTL COMM/FEES</td>");
      $tdMtdTotalFee.appendTo($trMtdTotalFee);
      for (var i in SummaryClient) {
        if (i == borderPx) {
          px = 1;
        }
        $tdMtdTotalFee = $("<td style='border-right: " + px + "px solid; text-align: right; font-size: 10px; padding-right:10px'>" + kendo.toString(SummaryClient[i].MtdTotalFee, "n2") + "</td>");
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
      if (SummaryClient[lastvalue] != undefined) {
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
      $tdTT = $("<td colspan='5' style='font-weight: bold;text-align: left; width: 20%; font-size: 11px; padding-top: 10px'>Last 5 NLV Values:(" + totalSummaryAccount + ")</td>");
      $tdTT.appendTo($trTT);

      $trT4 = $("<tr></tr>");
      $trT4.appendTo($subTotSum);
      $tdT4 = $("<td></td>");
      $tdT4.appendTo($trT4);
      $tdT4 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 4</td>");
      $tdT4.appendTo($trT4);
      $tdT4 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvTd4, "n2") + "</td>");
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
      $tdT3 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvTd3, "n2") + "</td>");
      $tdT3.appendTo($trT3);
      $tdT3 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvDiff4, "n2") + "</td>");
      $tdT3.appendTo($trT3);
      $tdT3 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
      $tdT3.appendTo($trT3);

      $trT2 = $("<tr></tr>");
      $trT2.appendTo($subTotSum);
      $tdT2 = $("<td></td>");
      $tdT2.appendTo($trT2);
      $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 2</td>");
      $tdT2.appendTo($trT2);
      $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvTd2, "n2") + "</td>");
      $tdT2.appendTo($trT2);
      $tdT2 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvDiff3, "n2") + "</td>");
      $tdT2.appendTo($trT2);
      $tdT2 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
      $tdT2.appendTo($trT2);

      $trT1 = $("<tr></tr>");
      $trT1.appendTo($subTotSum);
      $tdT1 = $("<td></td>");
      $tdT1.appendTo($trT1);
      $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T - 1</td>");
      $tdT1.appendTo($trT1);
      $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvTd1, "n2") + "</td>");
      $tdT1.appendTo($trT1);
      $tdT1 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvDiff2, "n2") + "</td>");
      $tdT1.appendTo($trT1);
      $tdT1 = $("<td colspan='3' style='font-weight: bold; text-align: left; width: 20%; font-size: 11px'></td>");
      $tdT1.appendTo($trT1);

      $trT0 = $("<tr></tr>");
      $trT0.appendTo($subTotSum);
      $tdT0 = $("<td></td>");
      $tdT0.appendTo($trT0);
      $tdT0 = $("<td style='text-align: right; width: 20%; font-size: 11px'>T</td>");
      $tdT0.appendTo($trT0);
      $tdT0 = $("<td style='text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvTd, "n2") + "</td>");
      $tdT0.appendTo($trT0);
      $tdT0 = $("<td style='font-weight: bold; text-align: right; width: 20%; font-size: 11px'>" + kendo.toString(NlvDiff1, "n2") + "</td>");
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
  rptClearerSumm.ClearerSummary();
  $("#TradeDate").closest("span.k-datepicker").width(130);
});