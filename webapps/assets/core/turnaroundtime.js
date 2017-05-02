var turn = {}

turn.dataMoving = ko.observableArray([])
turn.dataHistory = ko.observableArray([])
turn.dataPeriod = ko.observableArray([
	{text: 'Period', value: 'period'},
	{text: 'Region', value: 'region'},
]);
turn.dataMenu = ko.observableArray([
	{text: 'Underwriting TAT (Avg)', value: 'conversion'},
	{text: 'Decision TAT (Avg)', value: 'decision'},
	{text: 'Analysis TAT (Avg)', value: 'processing'},
	{text: 'Acceptance TAT (Avg)', value: 'acceptance'},
]);
turn.dataMenuValue = ko.observable('conversion');
turn.ValueDatePeriod = ko.observable(kendo.toString(new Date(), "MMM-yyyy"));
turn.ValueDataPeriod = ko.observable('period');
turn.chartcolors = ["#ff2929","#ffc000","#92d050", "#2e75b6"];

turn.avgConversion = ko.observable(0);
turn.avgConversionPercent = ko.observable(0);
turn.dealConversion = ko.observable(0);
turn.averageConversionData = ko.observableArray([]);

turn.avgDecision = ko.observable(0);
turn.dealDecision = ko.observable(0);
turn.avgDecisionPercent = ko.observable(0);
turn.averageDecisionData = ko.observableArray([]);

turn.avgProcessing = ko.observable(0);
turn.avgProcessingPercent = ko.observable(0);
turn.dealProcessing = ko.observable(0);
turn.averageProcessingData = ko.observableArray([]);

turn.avgAcceptance = ko.observable(0);
turn.avgAcceptancePercent = ko.observable(0);
turn.dealAcceptance = ko.observable(0);
turn.averageAcceptanceData = ko.observableArray([]);

turn.trendDataLength = ko.observable(6)

turn.ValueDataPeriod.subscribe(function (val) {
	switch (val) {
	case 'period':
		$("#chartContainer").show();
		$("#chartContainer").data('kendoChart').redraw();
		$("#chartContainer2").hide();
		break;
	case 'region':
		$("#chartContainer2").show();
		$("#chartContainer2").data('kendoChart').redraw();
		$("#chartContainer").hide();
		break;
	}
})

turn.titleText = ko.computed(function () {
    var type = dash.FilterValue.GetVal("TimePeriod")
    var start = moment(dash.FilterValue.GetVal("TimePeriodCalendar"))
    var end = moment(dash.FilterValue.GetVal("TimePeriodCalendar2"))

    if (!start.isValid())
        return "-"

    switch (type) {
    case "10day":
        return start.clone().subtract(10, "day").format("DD MMM YYYY") + " - " + start.format("DD MMM YYYY")
    case "":
    case "1month":
        return start.format("MMMM YYYY")
    case "1year":
        return start.format("YYYY")
    case "fromtill":
        return start.format("DD MMM YYYY") + " - " + end.format("DD MMM YYYY")
    }
})


turn.dummyData = ko.observableArray([
	{"avgdays":2.2,"date":"2016-10-01T00:00:00Z","dateStr":"Oct-2016","dealcount":8,"median":4},
	{"avgdays":3.3,"date":"2016-11-01T00:00:00Z","dateStr":"Nov-2016","dealcount":5,"median":3},
	{"avgdays":4.4,"date":"2016-12-01T00:00:00Z","dateStr":"Dec-2016","dealcount":3,"median":5},
	{"avgdays":2.0,"date":"2017-01-01T00:00:00Z","dateStr":"Jan-2017","dealcount":7,"median":6},
	{"avgdays":8.0,"date":"2017-02-01T00:00:00Z","dateStr":"Feb-2017","dealcount":9,"median":7},
	{"avgdays":4.0,"date":"2017-03-01T00:00:00Z","dateStr":"Mar-2017","dealcount":2,"median":8}])

dash.FilterValue.subscribe(function (val) {
	turn.loadAlleverage()
    turn.loadData()
})
turn.averageConversionClick = function(){
	$(".dl").removeClass("onactive");
	$("#conv").addClass("onactive");
	turn.loadChartContainer(turn.averageConversionData());
}

turn.averageDecisionClick = function(){
	$(".dl").removeClass("onactive");
	$("#dec").addClass("onactive");
	turn.loadChartContainer(turn.averageDecisionData());
} 

turn.averageProcessingClick = function(){
	$(".dl").removeClass("onactive");
	$("#process").addClass("onactive");
	turn.loadChartContainer(turn.averageProcessingData());
}

turn.averageAcceptanceClick = function(){
	$(".dl").removeClass("onactive");
	$("#acep").addClass("onactive");
	turn.loadChartContainer(turn.averageAcceptanceData())
}

turn.dataMenuValue.subscribe(function(value){
	if(value == 'conversion'){
		turn.averageConversionClick()
	}else if(value == 'decision'){
		turn.averageDecisionClick()
	}else if(value == 'processing'){
		turn.averageProcessingClick()
	}else if(value == 'acceptance'){
		turn.averageAcceptanceClick()
	}

})
// turn.loadFirst = function(){
// 	$(".dl").removeClass("onactive");
// 	$("#acep").addClass("onactive");
// 	turn.containerTitle("Average Acceptance TAT");
// 	if((turn.averageAcceptanceData()).length != 0){
// 		turn.loadChartContainer(turn.averageAcceptanceData())
// 	}
// }

turn.loadAlleverage = function(){
	setTimeout(function(){
		var param = {
			trend: '',
			groupby: 'period',
			start: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar")),
			end: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar2")),
			type: dash.FilterValue.GetVal("TimePeriod"),
			filter: dash.FilterValue()
		}

		param.trend = 'acceptance';
		ajaxPost("/dashboard/snapshottat",param,function(res){ 
			var acce = [];
			$.each(res.Data, function(i, item){
				if(i != 0){
					acce.push(item)
				}
			})
			var days = turn.lastMonth("ace", "avgdays", res.Data)
			var deals = turn.lastMonth("dealacc", "dealcount", res.Data)
			turn.averageAcceptanceData(acce);
			if(res.Data[0].avgdays != null || res.Data[0].dealcount != null){
				rest = kendo.toString(res.Data[0].avgdays, "n0");
				turn.avgAcceptance(rest)
				turn.avgAcceptancePercent(days)
				turn.dealAcceptance(deals)
			}else{
				turn.avgAcceptance(0)
				turn.avgAcceptancePercent(0)
				turn.dealAcceptance(0)
			}
			turn.lastMonth("ace", "avgdays", res.Data)
			$("#acceptance").html('')
			$("#acceptance").kendoChart({
				theme: "Material",
				title: { 
					font:  "bold 10px Arial,Helvetica,Sans-Serif",
					align: "left",
					color: "#58666e",
				},
				dataSource: turn.averageAcceptanceData(),
				seriesDefaults: {
					type: "area",
					area: {
						line: {
							style: "smooth"
						}
					}
				},
				series: [{
					stack : false,
					field: "avgdays",
				}],
				chartArea:{
					// width: 250,
					height: 75,
					background: "transparent"
				},
				legend: {
					visible: false,
					position: "right",
					labels:{
						font: "10px Arial,Helvetica,Sans-Serif"
					}
				},
				// seriesColors : ttrack.chartcolors,
				valueAxis: [{
					visible: false,
					line: {
						visible: false
					},
					majorGridLines: {
						visible: true,
					},
					majorUnit: dash.chartUnit(turn.averageAcceptanceData(), 'avgdays', 4),
					max: dash.chartMax(turn.averageAcceptanceData(), 'avgdays')
				}],
				categoryAxis: {
					visible: false,
					line: {
						visible: false
					},
					majorGridLines:{
						visible: false
					}
				},
				tooltip : {
					visible: false
				}
			});

			turn.loadRadialGauge();
		});

		param.trend = 'processing';
		ajaxPost("/dashboard/snapshottat",param,function(res){ 
			var proc = [];
			$.each(res.Data, function(i, item){
				if(i != 0){
					proc.push(item)
				}
				
			});
			var days = turn.lastMonth("proce", "avgdays", res.Data)
			var deals = turn.lastMonth("proces", "dealcount", res.Data)
			turn.averageProcessingData(proc);
			if(res.Data[0].avgdays != null || res.Data[0].dealcount != null){
				rest = kendo.toString(res.Data[0].avgdays, "n0");
				turn.avgProcessing(rest)
				turn.avgProcessingPercent(days)
				turn.dealProcessing(deals)
			}else{
				turn.avgProcessing(0)
				turn.avgProcessingPercent(0)
				turn.dealProcessing(0)
			}
			$("#processing").html('')
			$("#processing").kendoChart({
				theme: "Material",
				title: { 
					font:  "bold 10px Arial,Helvetica,Sans-Serif",
					align: "left",
					color: "#58666e",
				},
				dataSource: turn.averageProcessingData(),
				seriesDefaults: {
					type: "area",
					area: {
						line: {
							style: "smooth"
						}
					}
				},
				series: [{
					stack : false,
					field: "avgdays",
				}],
				chartArea:{
					// width: 250,
					height: 75,
					background: "transparent"
				},
				legend: {
					visible: false,
					position: "right",
					labels:{
						font: "10px Arial,Helvetica,Sans-Serif"
					}
				},
				// seriesColors : ttrack.chartcolors,
				valueAxis: [{
					visible: false,
					line: {
						visible: false
					},
					majorGridLines: {
						visible: true,
					},
					majorUnit: dash.chartUnit(turn.averageProcessingData(), 'avgdays', 4),
					max: dash.chartMax(turn.averageProcessingData(), 'avgdays')
				}],
				categoryAxis: {
					visible: false,
					line: {
						visible: false
					},
					majorGridLines:{
						visible: false
					}
				},
				tooltip : {
					visible: false
				}
			});
		});
		param.trend = 'decision';
		ajaxPost("/dashboard/snapshottat",param,function(res){ 
			var dec = [];
			$.each(res.Data, function(i, item){
				if(i != 0){
					dec.push(item)
				}
			})
			var days = turn.lastMonth("deci", "avgdays", res.Data)
			var deals = turn.lastMonth("dealdeci", "dealcount", res.Data)
			turn.averageDecisionData(dec);
			if(res.Data[0].avgdays != null || res.Data[0].dealcount != null){
				rest = kendo.toString(res.Data[0].avgdays, "n0");
				turn.avgDecision(rest)
				turn.avgDecisionPercent(days)
				turn.dealDecision(deals)
			}else{
				turn.avgDecision(0)
				turn.avgDecisionPercent(days)
				turn.dealDecision(deals)
			}
			$("#decision").html('')
			$("#decision").kendoChart({
				theme: "Material",
				title: { 
					font:  "bold 10px Arial,Helvetica,Sans-Serif",
					align: "left",
					color: "#58666e",
				},
				dataSource: turn.averageDecisionData(),
				seriesDefaults: {
					type: "area",
					area: {
						line: {
							style: "smooth"
						}
					}
				},
				series: [{
					stack : false,
					field: "avgdays",
				}],
				chartArea:{
					// width: 250,
					height: 75,
					background: "transparent"
				},
				legend: {
					visible: false,
					position: "right",
					labels:{
						font: "10px Arial,Helvetica,Sans-Serif"
					}
				},
				// seriesColors : ttrack.chartcolors,
				valueAxis: [{
					visible: false,
					line: {
						visible: false
					},
					majorGridLines: {
						visible: true,
					},
					majorUnit: dash.chartUnit(turn.averageDecisionData(), 'avgdays', 4),
					max: dash.chartMax(turn.averageDecisionData(), 'avgdays')
				}],
				categoryAxis: {
					visible: false,
					line: {
						visible: false
					},
					majorGridLines:{
						visible: false
					}
				},
				tooltip : {
					visible: false
				}
			});
		});

		param.trend = 'conversion';
		ajaxPost("/dashboard/snapshottat",param,function(res){ 
			var conv = [];
			$.each(res.Data, function(i, item){
				if(i != 0){
					conv.push(item)
				}
			})
			var days = turn.lastMonth("conve", "avgdays", res.Data)
			var deals = turn.lastMonth("convers", "dealcount", res.Data)
			turn.averageConversionData(conv)
			if(res.Data[0].avgdays != null || res.Data[0].avgdays != null){
				rest = kendo.toString(res.Data[0].avgdays, "n0");
				turn.avgConversion(rest)
				turn.avgConversionPercent(days)
				turn.dealConversion(deals)
			}else{
				turn.avgConversion(0)
				turn.avgConversionPercent(0)
				turn.dealConversion(0)
			}

			turn.averageConversionClick()
			
			$("#conversion").html('')
			$("#conversion").kendoChart({
				theme: "Material",
				title: { 
					font:  "bold 10px Arial,Helvetica,Sans-Serif",
					align: "left",
					color: "#58666e",
				},
				dataSource: turn.averageConversionData(),
				seriesDefaults: {
					type: "area",
					area: {
						line: {
							style: "smooth"
						}
					}
				},
				series: [{
					stack : false,
					field: "avgdays",
				}],
				chartArea:{
					// width: 250,
					height: 75,
					background: "transparent"
				},
				legend: {
					visible: false,
					position: "right",
					labels:{
						font: "10px Arial,Helvetica,Sans-Serif"
					}
				},
				// seriesColors : ttrack.chartcolors,
				valueAxis: [{
					visible: false,
					line: {
						visible: false
					},
					majorGridLines: {
						visible: true,
					},
					majorUnit: dash.chartUnit(turn.averageConversionData(), 'avgdays', 4),
					max: dash.chartMax(turn.averageConversionData(), 'avgdays')
				}],
				categoryAxis: {
					visible: false,
					line: {
						visible: false
					},
					majorGridLines:{
						visible: false
					}
				},
				tooltip : {
					visible: false
				}
			});
		});
	}, 500)
}

turn.lastMonth = function(id, field, data){
	$("#"+id)
		.removeClass('fa-caret-up')
		.removeClass('fa-caret-down');

	if(field == "avgdays"){
		if(data[0].avgdays > data[1].avgdays){
			$("#"+id)
				.addClass('fa-caret-up')
				.css("color", "green");
		}else{
			$("#"+id)
				.addClass('fa-caret-down')
				.css("color", "red")
		}
		var days = data[0].avgdays - data[1].avgdays
		return days
	}else if(field == "dealcount"){
		if(data[0].dealcount > data[1].dealcount){
			$("#"+id)
				.addClass('fa-caret-up')
				.css("color", "green");
		}else{
			$("#"+id)
				.addClass('fa-caret-down')
				.css("color", "red")
		}
		var deals = data[0].dealcount - data[1].dealcount
		return deals
	}
}

turn.loadChartRegionContainer = function() {
	var param = {
		trend: '',
		groupby: 'region',
		start: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar")),
		end: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar2")),
		type: dash.FilterValue.GetVal("TimePeriod"),
		filter: dash.FilterValue(),
		trend: turn.dataMenuValue()
	}

	ajaxPost("/dashboard/snapshottat",param,function(res) {
		$("#chartContainer2").html('')
		$("#chartContainer2").kendoChart({
			plotArea: {
				margin: {
					right: 4,
				}
			},
			dataSource: res.Data,
			series: [
			{
				type: "column",
				stack : false,
				field: "avgdays",
				color: '#2e75b6',
				overlay: {
					gradient: "none"
				},
				name: "Avg Days"
			},
			{
				type: "column",
				stack : false,
				field: "median",
				color: '#00b0f0',
				overlay: {
					gradient: "none"
				},
				name: "Median"
			},
			{
				type: "column",
				stack : false,
				field: "dealcount",
				axis: "dc",
				// dashType: "dot",
				color: '#ffc000',
				overlay: {
					gradient: "none"
				},
				name: "Deal Count"
			},
			{
				// field: "wind",
				name: "Target TAT"
			}
			],
			chartArea:{
				height: 220,
				background: "white"
			},
			legend: {
				visible: false,
				position: "bottom",
				labels:{
					font: "10px Arial,Helvetica,Sans-Serif"
				}
			},
			valueAxes: [{
				title: { 
					text: "Days",
					font: "10px sans-serif",
					color : "#4472C4", 
					margin: {
						right: 1,
					}
				},
				min: 0,
				labels : {
					font: "10px sans-serif",
					step : 2,
					skip : 2
				},
				// max: 10,
				plotBands: [{
					from: 2.9,
					to: 3.0,
					color: "#70ad47",
					name: "Target"
				}]
			},{
				name: "dc",
				title: { 
					text: "Deal Count",
					font: "10px sans-serif",
					color : "#4472C4",
					margin: {
						left: 1,
					}
				},
				min: 0,
				labels : {
					font: "10px sans-serif",
					step : 2,
					skip : 2
				},
				// max: 10
			}
			],
			categoryAxis: {
				// categories: month,
				field: "idx",
				// visible : true,
				title : {
					text : "Region",
					font: "10px sans-serif",
					visible : true,
					color : "#4472C4"
				},
				labels : {
					font: "10px sans-serif",
					// visible : true,
				},
				axisCrossingValues: [0, 7]
			},
			tooltip : {
				visible: true,
				template : function(dt){
					console.log(dt);
					return dt.series.name + " : "+ dt.value//dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
				}
			}
	    });
	})
}

turn.CreateChartTrendOption_  = function (data) {
	var len = data._request.len;
    var start = data._request.start;
    var end = data._request.end;
    var type = data._request.type;
	var month = dash.generateXAxis(type, start, end, len + 1)
	month.shift();
	console.log("---------------->>>", month)

	var opt = {
		plotArea: {
			margin: {
				right: 4
			}
		},
		dataSource: data.response,
		series: [
		{
			type: "column",
			stack : false,
			field: "avgdays",
			color: '#2e75b6',
			overlay: {
				gradient: "none"
			},
			name: "Avg Days"
		},
		{
			type: "column",
			stack : false,
			field: "median",
			color: '#00b0f0',
			overlay: {
				gradient: "none"
			},
			name: "Median"
		},
		{
			type: "line",
			stack : false,
			field: "dealcount",
			axis: "dc",
			dashType: "dot",
			color: '#ffc000',
			name: "Deal Count"
		},
		{
			// field: "wind",
			name: "Target TAT"
		}
		],
		chartArea:{
			height: 220,
			background: "white"
		},
		legend: {
			visible: false,
			position: "bottom",
			labels:{
				font: "10px Arial,Helvetica,Sans-Serif"
			}
		},
		valueAxes: [{
			title: { 
				text: "Days",
				font: "10px sans-serif",
				color : "#4472C4", 
				margin: {
					right: 1,
				}
			},
			min: 0,
			labels : {
				font: "10px sans-serif",
				step : 2,
				skip : 2,
			},
			// max: 10,
			plotBands: [{
				from: 2.9,
				to: 3.0,
				color: "#70ad47",
				name: "Target"
			}]
		},{
			name: "dc",
			title: { 
				text: "Deal Count",
				font: "10px sans-serif",
				color : "#4472C4",
				margin: {
					left: 1,
				}
			},
			min: 0,
			labels : {
				font: "10px sans-serif",
				step : 2,
				skip : 2
			},
			// max: 10
		}
		],
		categoryAxis: {
			categories: month,
			// field: "dateStr",
			// visible : true,
			title : {
				text : "Deal Stages",
				font: "10px sans-serif",
				visible : true,
				color : "#4472C4"
			},
			labels : {
				font: "10px sans-serif",
				// rotation: -45,   
				template:function(e){
					// try to split using dash
					// if length is one, then return because not a from till
					var data = (e.value).split(" - ");
					if (data.length === 1)
						return e.value;

					var tgl1 = data[0].split("/");
					var tgl2 = data[1].split("/");

					// take out year if there is year value
					if (tgl1.length >= 3 && tgl2.length >= 3) {
						data[0] = tgl1[0] + "/" + tgl1[1]
						data[1] = tgl2[0] + "/" + tgl2[1]
					}

					return data[0] + "\n" + data[1];
				}
				// visible : true,
			},
			axisCrossingValues: [0, 7]
		},
		tooltip : {
			visible: true,
			template : function(dt){
				console.log(dt);
				return dt.series.name + " : "+ dt.value//dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
			}
		}
	}

	if (data._request.title) {
		opt.title = {
			text: "Unknown",
			font:  "12px Arial,Helvetica,Sans-Serif",
			align: "left",
			color: "#58666e",
			padding: {
				top: 0
			}
		}

		switch (data._request.groupby) {
		case "conversion":
			opt.title.text = "Average Conversion TAT";
			break
		}
	}

	return opt;
}

turn.loadChartContainer = function(data){
	turn.loadChartRegionContainer();

	var param = {
		_request: {
			len: turn.trendDataLength(),
			start: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar")),
			end: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar2")),
			type: dash.FilterValue.GetVal("TimePeriod"),
			title: false,
			trend: turn.dataMenuValue(),
			groupby: 'period'
		},
		response: data
	}
	
	var opt = turn.CreateChartTrendOption_(param);
	setTimeout(function(){
		$("#chartContainer").html('')
		$("#chartContainer").kendoChart(opt);
	},200)

}

turn.loadRadialGauge = function(){
	$("#tatgoals").html('')
    $("#tatgoals").kendoRadialGauge({
       	pointer: {
            value: parseInt(turn.avgConversion())
        },

        scale: {
            minorUnit: 5,
            startAngle: -30,
            endAngle: 210,
            max: 30,
            majorTicks: {
	            size: 5
	        },
            labels: {
                position: "inside"
            },
            ranges: [
                {
                    from: 0,
                    to: 10,
                    color: "green"
                }, {
                    from: 10,
                    to: 20,
                    color: "yellow"
                }, {
                    from: 20,
                    to: 30,
                    color: "red"
                }
            ]
        }
    }); 
}

turn.loadData = function(){
	turn.dataHistory([]);
	turn.CreateChartHistoryData({
		start: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar")),
		end: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar2")),
		type: dash.FilterValue.GetVal("TimePeriod"),
		filter: dash.FilterValue()
	}, function(res){
		if(res.Data != null){
			turn.dataHistory(res.Data);
			
			var opt = turn.CreateChartHistoryOptions_(res.Data);
			$("#historytat").html("");
			$("#historytat").kendoChart(opt);
		}
	});

	turn.dataMoving([]);
	turn.CreateChartMovingData({
		start: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar")),
		end: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar2")),
		type: dash.FilterValue.GetVal("TimePeriod"),
		filter: dash.FilterValue()
	}, function(rest){
		if(rest.Data != null){
			turn.dataMoving(rest.Data);
			
			var opt = turn.CreateChartMovingOptions_(rest.Data);
			$("#movingtat").html("");
			$("#movingtat").kendoChart(opt);
		}
	})

	turn.dataScatter([]);
	ajaxPost("/dashboard/griddetailstat", {
		start: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar")),
		end: discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar2")),
		type: dash.FilterValue.GetVal("TimePeriod"),
		filter: dash.FilterValue()
	}, function(rest) {
		if (rest.Data != null) {
			turn.dataScatter(rest.Data);
			turn.loadChaterChart();
		}
	})
}

turn.CreateChartMovingOptions_ = function (data) {
	var status = _.groupBy(data, "status")
	var cat = [];
	$.each(status, function(key, item){
		cat.push(key)
	});
	$.each(data, function(i, item){
		if(item.dayrange == "15 + Days"){
			data[i].color = "#ff2929"
		}else if(item.dayrange == "11 - 15 Days"){
			data[i].color = "#ffc000"
		}else if(item.dayrange == "6 - 10 Days"){
			data[i].color = "#92d050"
		}else if(item.dayrange == "0 - 5 Days"){
			data[i].color = "#2e75b6"
		}
	})
	var set = turn.normalisasiData(data)
	set = _.sortBy(set,["status"])
	// console.log(JSON.stringify(ondata))
	var movingdata = new kendo.data.DataSource({
		data: set,
		group:{
			field: "dayrange"
		},

	});
	
	return {
		title:{
			text: "Moving TAT",
			font:  "12px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
			padding: {
				top: 0
			}
		},
		plotArea: {
			margin: {
				left: 4,
				right: 4
			}
		},
		dataSource: movingdata,
		series:[{
			type: "column",
			stack: false,
			field: "count",
			name : "#= group.value#",
			overlay: {
                gradient: "none"
            },
		}],
		legend: {
			// position: "bottom"
			visible: false,
		},
		chartArea:{
            background: "white",
            height: 250,
        },
		valueAxis: {
            labels: {
                // format: "${0}",
        		font: "10px sans-serif",
                skip: 2,
                step: 2
            },
            title : {
            	text : "No. of Deals",
        		font: "10px sans-serif",
            	visible : true,
            	color : "#4472C4",
				margin: {
					right: 1,
				}
            }
        },
        categoryAxis: {
        	// categories: cat,
            field: "status",
           	title : {
            	text : "Deal Movement",
        		font: "10px sans-serif",
            	visible : true,
            	color : "#4472C4"
            },
            labels : {
        		font: "10px sans-serif",
            }
        },
        tooltip : {
        	visible: true,
        	template : function(dt){
        		// console.log("------------------>>>",dt)
        		return "<div class='left'>Deal Stage : "+dt.category+"<br>"+
        				"Processing Days : "+dt.dataItem.dayrange+"<br>"+
        				" Deal Count: "+dt.dataItem.count+"</div>";
        	}
        }
	}
}

turn.CreateChartHistoryOptions_ = function (data) {
	var status = _.groupBy(data, "status")
	var cat = [];
	$.each(status, function(key, item){
		cat.push(key)
	});
	$.each(data, function(i, item){
		if(item.dayrange == "15 + Days"){
			data[i].color = "#ff2929"
		}else if(item.dayrange == "11 - 15 Days"){
			data[i].color = "#ffc000"
		}else if(item.dayrange == "6 - 10 Days"){
			data[i].color = "#92d050"
		}else if(item.dayrange == "0 - 5 Days"){
			data[i].color = "#2e75b6"
		}
	})
	var set = turn.normalisasiData(data)
	set = _.sortBy(set,["status"])
	var historydata = new kendo.data.DataSource({
		data: set,
		group: {
			field: "dayrange"
		}
	});

	return {
		title:{
			text: "History TAT",
			font:  "12px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
			padding: {
				top: 0
			}
		},
		plotArea: {
			margin: {
				left: 4,
				right: 4
			}
		},
		dataSource: historydata,
		series:[{
			type: "column",
			stack: false,
			field: "count",
			name: function(e){
				// console.log(e.group.category)
				return e.group.value;
			},
			overlay: {
                gradient: "none"
            },
		}],
		legend: {
			// position: "bottom"
			visible: false,
		},
		chartArea:{
            background: "white",
            height: 250,
        },
		valueAxis: {
            labels: {
                // format: "${0}",
        		font: "10px sans-serif",
                skip: 2,
                step: 2
            },
            title : {
            	text : "No. of Deals",
        		font: "10px sans-serif",
            	visible : true,
            	color : "#4472C4",
				margin: {
					right: 1,
				}
            }
        },
        categoryAxis: {
        	// categories: cat,
            field: "status",
           	title : {
            	text : "Deal Movement",
        		font: "10px sans-serif",
            	visible : true,
            	color : "#4472C4"
            },
            labels : {
        		font: "10px sans-serif",
        		name:function(dt){
        			// console.log("----------->>>86",dt)
        			return "";
        		}
            }
        },
        tooltip : {
        	visible: true,
        	template : function(dt){
        		// console.log("------------------>>>",dt)
        		return "<div class='left'>Deal Stage : "+dt.category+"<br>"+
        				"Processing Days : "+dt.dataItem.dayrange+"<br>"+
        				" Deal Count: "+dt.dataItem.count+"</div>";
        	}
        }
	}
}

turn.CreateChartHistoryData = function(param, callback) {
	ajaxPost("/dashboard/historytat", param, function (data) {
		callback(data)
	})
}

turn.CreateChartHistory = function(param, callback) {
	turn.CreateChartHistoryData(param, function(data) {
		callback(turn.CreateChartHistoryOptions_(data.Data))
	})
}

turn.CreateChartMovingData = function(param, callback) {
	ajaxPost("/dashboard/movingtat", param, function (data) {
		callback(data)
	})
}

turn.CreateChartMoving = function(param, callback) {
	turn.CreateChartMovingData(param, function(data) {
		callback(turn.CreateChartMovingOptions_(data.Data))
	})
}

turn.normalisasiData = function(data){
	var category = [];
    var comdata = [];
    var lengcomdata = 0;
    var group = [];
    //each category maybe have different number of group, make it all same number
    for(var i in data){
        if(category.indexOf(data[i].status)==-1){
          category.push(data[i].status);
        }
        if(group.indexOf(data[i].dayrange)==-1){
          group.push(data[i].dayrange);
        }
    }

     lengcomdata = group.length;
    //add dummy data if in some category, group number is different 
     for(var i in category){
        var d = _.filter(data,function(x){return x.status == category[i]});
        // console.log("--------------->>>> d", d)
        if(d.length<lengcomdata){
          for(var x in group){
              if(_.find(d,function(g){ return g.dayrange == group[x] } ) == undefined){
                data.push({
                  "status" : category[i] ,  
                  "dayrange":group[x] ,
                  "count":null,
                });
              }
          }
        }
      }
      console.log(data)

    return data
}

turn.dataScatter = ko.observableArray([]);
turn.dataScatter.subscribe(function (val) {
	turn.loadChaterChart();
})

turn.currentscatter = ko.observable({});
turn.listscatter = ko.observableArray([]);
turn.loadChaterChart = function(){
	$(".cater").html("");
	$(".cater").kendoChart({
		title:{
			text: "Conversion TAT Vs. Deal Amount",
			font:  "12px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
			padding: {
				top: 0
			}
		},
        seriesDefaults: {
        	type: "scatter",
            labels: {
                visible: false,
            }
        },
        chartArea:{
        	height: 250,
        },
        dataSource: {
            data: turn.dataScatter()
        },
        series: [{
	        xField: "Conversion",
            yField: "amount"
	    }],
	    legend: {
	    	visible: false,
	    },
        xAxis: {
            max: 50,
            // min: 0,
            labels: {
				template: "&lt;= #= value #",
				skip: 1,
				step: 1,
				font: "10px sans-serif",
			},
			majorUnit: 10,
			minorUnit: 10,
			majorTicks: {
				visible: false
			},
			majorGridLines: {
				visible: false
			},
			minorTicks: {
				visible: true
			},
			minorGridLines: {
				visible: true
			}
        },
        yAxis: {
            min: 0,
            title: {
                text: "Deal Amount (Rs. Lacs)",
                font: "10px sans-serif",
            	visible : true,
            	color : "#4472C4",
				padding: {
					left: 0,
					right: 0
				}
            },
            labels : {
            	// template : "#: kendo.toString( value/100000 , 'n0')#",
            	 font: "10px sans-serif",
            }
        },
        click : function(val){
        	console.log(val)
        },
        tooltip : {
        	visible : true,
        	template : function(x){
        		turn.currentscatter(x.dataItem);
        		$('circle').off('click');
        		$("circle").click(function(){ 
        			var fi = _.find(turn.listscatter(),function(xx){ return xx.dealno == x.dataItem.dealno })
        			if(fi == undefined)
			    	turn.listscatter.push(turn.currentscatter());
			     });
        		return "<div style='text-align: left;'>"+
        			"Deal No : " + x.dataItem.dealno + "</br>" +
        			"Customer : " + x.dataItem.custname + "</br>" +
        			"Deal Amount : " + app.formatnum(x.dataItem.amount) + "</br>" +
        			"Acceptance : " + x.dataItem.Acceptance + "</br>" +
        			"Processing : " + x.dataItem.Processing + "</br>" +
        			"Decisioning : " + x.dataItem.Decision + "</br>" + 
        			"Conversion : " + x.dataItem.Conversion + "</div>"
        	},
        	 font: "11px sans-serif",
        }
    });
	// setTimeout(function(){
	    
	// },1000);
}

turn.removescatterGrid = function(index){
	return function(){
	var dt = turn.listscatter().filter(function (d, i) {
			return i !== index
		})
		turn.listscatter(dt)
	}
}
				
function changeLabels(val) {
	if (val >= 50)
		return "";
	return "&lt;= " + val;
}

turn.accordion = function(){
    $(".toggle1").click(function(e){
		console.log("lala");
        e.preventDefault();

        var $this = $(this);
        if($this.next().children().hasClass('show')){
            $this.next().children().removeClass('show');
            $this.next().children().slideUp(500);
            $this.find("h5>.ic").removeClass("acc-down");
            $this.find("h5>.ic").addClass("acc-up");

        }else{
            $this.next().children().removeClass('hide');
            $this.next().children().slideDown(500);
            $this.next().children().addClass("show");
            $this.find("h5>.ic").addClass("acc-down");
            $this.find("h5>.ic").removeClass("acc-up");
        }
    })
}

turn.setTitle = function(){
	var start = cleanMoment(dash.FilterValue.GetVal("TimePeriodCalendar")) 
	var end = cleanMoment(dash.FilterValue.GetVal("TimePeriodCalendar2"))
	var type = dash.FilterValue.GetVal("TimePeriod")
	var title = "All";

	if(type == "10day"){
		title = "Last 10 Days"
	}else if (type == "1month"){
		start = moment(start).format("MMM-YYYY")
		end = moment(end).format("MMM-YYYY")
		title = start 
	}else if (type == "1year"){
		start = moment(start).format("YYYY")
		end = moment(start).add(1,"years").format("YYYY")
		title = start + " - " + end
	}else if (type == "fromtill"){
		start = moment(start).format("DD-MMM-YYYY")
		end = moment(end).format("DD-MMM-YYYY")
		title = start + " - " + end
	}

	return title;
}

$(window).bind("resize", function() {
	$("#historytat").data("kendoChart").refresh();
	$(".cater").data("kendoChart").refresh();
	$("#chartContainer").data("kendoChart").refresh();
	$("#movingtat").data("kendoChart").refresh();
	$("#conversion").data("kendoChart").refresh();
	$("#decision").data("kendoChart").refresh();
	$("#processing").data("kendoChart").refresh();
	$("#acceptance").data("kendoChart").refresh();
});


$(function(){
	// turn.loadChaterChart()
	turn.accordion()
	$(".sidebar-toggle").click(function(){
		var infilter = $("#infilter")
		if(infilter.is(":visible") == true){
			turn.loadChaterChart()
			$("#onselect").css("width", "117px")
			$("#historytat").data("kendoChart").refresh();
			$(".cater").data("kendoChart").refresh();
			$("#movingtat").data("kendoChart").refresh();
			$("#conversion").data("kendoChart").refresh();
			$("#decision").data("kendoChart").refresh();
			$("#processing").data("kendoChart").refresh();
			$("#acceptance").data("kendoChart").refresh();
			$("#chartContainer").data("kendoChart").refresh();
		}else{
			turn.loadChaterChart()
			$("#onselect").css("width", "150px")
			$("#historytat").data("kendoChart").refresh();
			$(".cater").data("kendoChart").refresh();
			$("#movingtat").data("kendoChart").refresh();
			$("#conversion").data("kendoChart").refresh();
			$("#decision").data("kendoChart").refresh();
			$("#processing").data("kendoChart").refresh();
			$("#acceptance").data("kendoChart").refresh();
			$("#chartContainer").data("kendoChart").refresh();
		}
	})
	
});
