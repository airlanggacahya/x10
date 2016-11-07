var payAndRec ={
	// filter
	loading : ko.observable(false),
	filterClient: ko.observable(""),
	filterAccounts: ko.observable(""),
	filterReceiptType: ko.observable(""),
	filterCurrency: ko.observable(" "),
	filterTradeDate: ko.observable(""),
	filterDataSource: ko.observable(""),
	reset: ko.observable(false),
	dataCurrency: ko.observableArray([]),
	dataClient: ko.observableArray([]),
	dataAccount: ko.observableArray([]),
	dataReceipType: ko.observableArray([]),
	dataonSource: ko.observableArray([
		{"text":"MANUAL", "value":"MANUAL"},
    	{"text":"UPLOAD", "value":"UPLOAD"}
	]),
	TitelFilter: ko.observable(" Hide Filter"),

}

payAndRec.dropdown = function(){
	payAndRec.dataCurrency([]);
	payAndRec.dataClient([]);
	payAndRec.dataAccount([]);
	payAndRec.dataReceipType([]);
	ajaxPost("/masterfxrates/getcurrency", {}, function (res) {
		    var sortCurr = Enumerable.From(res).OrderBy("$.currency_code").ToArray();
	    for (var c in sortCurr) {
		    payAndRec.dataCurrency.push({
		        "text": sortCurr[c].currency_code,
		        "value": sortCurr[c]._id,
		     });
	    }
	});

	ajaxPost("/manualpaymentreceipt/getclient ", {}, function (res) {
		var sortCl = Enumerable.From(res.Data).OrderBy("$.Id").ToArray();
		for (var c in sortCl) {
			payAndRec.dataClient.push({
				"text": sortCl[c].Id + " - " + sortCl[c].Fname + " " + sortCl[c].Lname,
				"value": sortCl[c].Id
			});
		}
	});

	ajaxPost("/datamaster/getaccountall ", {}, function (res) {
	    for (var c in res) {
	    	if(res[c].acc_no_map != undefined){
	    		payAndRec.dataAccount.push({
					"text": res[c].acc_no_map,
					"value": res[c].acc_no_map
				});
	    	}
			
	    }
	});

	ajaxPost("/manualpaymentreceipt/getpaymentreceipttype", {}, function (res) {
	    var sortPayType = Enumerable.From(res.Data).OrderBy("$.Description").ToArray();
	    for (var c in sortPayType) {
			payAndRec.dataReceipType.push({
				"text": sortPayType[c].Description + " - " + sortPayType[c].InternalDesc,
				"value": sortPayType[c].Id
			});
	    }
	});

}

payAndRec.resetData = function(){
	payAndRec.reset(true);
	payAndRec.filterClient("");
	payAndRec.filterAccounts("");
	payAndRec.filterTradeDate(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
	payAndRec.filterReceiptType(" ");
	payAndRec.filterCurrency("");
	payAndRec.reloadGrid();
	payAndRec.reset(false);
}

payAndRec.filterClient.subscribe(function (value) {
  if (model.View() != "false"  && payAndRec.reset() == false && payAndRec.filterClient() != "") {
    payAndRec.reloadGrid();
  }
});

payAndRec.filterAccounts.subscribe(function (value) {
  if (model.View() != "false" && payAndRec.reset() == false && payAndRec.filterAccounts() != "") {
    payAndRec.reloadGrid();
  }
});

payAndRec.filterReceiptType.subscribe(function (value) {
  if (model.View() != "false" && payAndRec.reset() == false && payAndRec.filterReceiptType() != "") {
    payAndRec.reloadGrid();
  }
});

payAndRec.filterCurrency.subscribe(function (value) {
  if (model.View() != "false" && payAndRec.reset() == false && payAndRec.filterCurrency() != "") {
    payAndRec.reloadGrid();
  }
});

payAndRec.filterDataSource.subscribe(function (value) {
  if (model.View() != "false" && payAndRec.filterCurrency() != "") {
    payAndRec.reloadGrid();
  }
});

payAndRec.reloadGrid = function(){
	payAndRec.loadDataGrid();
}

// var userid = model.User();
// var onpayrec = new GridColumn('role_paymentandreceipt', userid, 'PaymentAndReceipt');
payAndRec.loadDataGrid = function(){
	 var param = {
	    "ClientId": payAndRec.filterClient(),
	    "AccountId": payAndRec.filterAccounts(),
	    "TradeDate": payAndRec.filterTradeDate(),
	    "PaymentReceiptType": parseInt(payAndRec.filterReceiptType()),
	    "CurrencyId": parseInt(payAndRec.filterCurrency()),
	    "SourceData": payAndRec.filterDataSource(),
	  };
	payAndRec.loading(true);
	var dataSource = [];
	var url = "/manualpaymentreceipt/getdataprocessed";
	$("#PaymentAndReceipt").html("");
	$("#PaymentAndReceipt").kendoGrid({
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
				  payAndRec.loading(false);
				  $("#filtertradeDate").kendoDatePicker({
		              format: 'yyyy-MM-dd',
		              depth: 'year',
		              max: moment(new Date(data.Data.LastDate)).format('YYYY-MM-DD')
		          });
				  //onpayrec.Init();
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
		excel: {
	      allPages: true
	    },
	    excelExport: function (e) {
	      e.workbook.fileName = "Payment / Receipt.xlsx";
	    },
    	//columnMenu: true,
	    // columnHide: function(e) {
	    //     onpayrec.RemoveColumn(e.column.field);
	    // },
	    // columnShow: function(e) {
	    //     onpayrec.AddColumn(e.column.field);
	    // },
	     columns: [
			{
				field: "SourceData",
				title: "Source Data",
				attributes: {"class": "align-center"},
				width: 100,
				//template: "#if(model.Edit() != 'false'){#<a class='grid-select' href='javascript:payReceip.EditPayReceip(\"#: Id #\")'>#: SourceData  #</a>#}else{#<div>#: SourceData #</div>#}#",
			},
			{
				field: "FeeDate",
				title: "Fee Date",
				width: 100,
				attributes: {"class": "align-center"},
				template: "#= moment(FeeDate).format('YYYY-MM-DD') #",
			},
			{
				field: "FeeDateSource",
				title: "Fee Date Source",
				attributes: {"class": "align-center"},
				width: 150,
			},
			{
				field: "AccountId",
				title: "Account",
				width: 100,
			},
			{
				field: "AccountNumber",
				title: "Account Number",
				width: 150,
			},
			{
				field: "AccountName",
				title: "Account Name",
				width: 150,
			},
			{
				field: "ClientNumber",
				title: "Client Number",
				width: 150,
			},
			{
				field: "CurrencyCode",
				title: "Currency",
				width: 100,
			},
			{
				field: "FeeAmount",
				title: "Fee Amount",
				width: 100,
				template: "#= kendo.toString(FeeAmount, 'N2') #",
				attributes: {"class": "align-right"},
			},
			{
				field: "FeeDescription1",
				title: "Fee Desc 1",
				width: 200,
			},
			{
				field: "FeeDescription2",
				title: "Fee Desc 2",
				width: 200,
			}
		]
  	});
}

payAndRec.panel_relocated = function (){
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


payAndRec.toggleFilter = function (){
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
  panel_relocated();
    var FilterTitle = payAndRec.TitelFilter();
    if (FilterTitle == " Hide Filter"){
        payAndRec.TitelFilter(" Show Filter");
    }else{
        payAndRec.TitelFilter(" Hide Filter");
    }
}



$(document).ready(function(){
	payAndRec.dropdown();
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
	     payAndRec.filterTradeDate(moment(new Date(DefaultDate)).format("YYYY-MM-DD"));
	     payAndRec.loadDataGrid();
	  });
	 $("#filtertradeDate").on("change",function (){
	    payAndRec.loadDataGrid();
	  });

	$("#export").click(function (e) {
		var grid = $("#PaymentAndReceipt").data("kendoGrid");
		grid.saveAsExcel();
	});

});