var  conv = {}

conv.dataPeriod = ko.observableArray([
	{text: 'Period', value: 'period'},
	{text: 'Region', value: 'Region'},
]);
conv.actRate = ko.observable(0);
conv.undrRate = ko.observable(0);
conv.apprRate = ko.observable(0);
conv.analRate = ko.observable(0);
conv.compactRate = ko.observable(0);
conv.compundrRate = ko.observable(0);
conv.compapprRate = ko.observable(0);
conv.companalRate = ko.observable(0);
conv.dataValuePeriod = ko.observable('');
conv.funneldata = ko.observable([]);
conv.summaryTrenData = ko.observable([]);
conv.trendDataLength = ko.observable(6);

conv.loadAllTop = function(data){
	$("#rate").html("")
	$("#rate").kendoChart({
		theme: "Material",
        title: { 
            // text: "Processing TAT",
            font:  "bold 10px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
        },
        dataSource: data,
        seriesDefaults: {
            type: "area",
            area: {
                line: {
                    style: "smooth"
                }
            }
        },
        series: [{
            // type: "area",
            stack : false,
            field: "underwrite_rate",
            // name: "#= group.value.split('*')[1] #"
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
        valueAxis: {
        	 visible :false,
            labels: {
                // format: "${0}",

        		font: "5px sans-serif",
                skip: 2,
                step: 2
            },
            title : {
            	text : "No. of Deals",
        		font: "5px sans-serif",
            	visible : false,
            	color : "#4472C4"
            },
            line: {
		        visible: true
		    },
		    majorGridLines:{
		        visible:true
		    },
            majorUnit: dash.chartUnit(data, 'underwrite_rate', 4),
            max: dash.chartMax(data, 'underwrite_rate')
        },
        categoryAxis: {
            visible: true,
           	line: {
		        visible: false
		    },
		    majorGridLines:{
		        visible:false
		    }
        },
        tooltip : {
        	visible: false,
        	template : function(dt){
        		return dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
        	}
        }
	});
	$("#approval").html("")
	$("#approval").kendoChart({
		theme: "Material",
        title: { 
            // text: "Processing TAT",
            font:  "bold 10px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
        },
        dataSource: data,
        seriesDefaults: {
            type: "area",
            area: {
                line: {
                    style: "smooth"
                }
            }
        },
        series: [{
            // type: "area",
            stack : false,
            field: "approve_rate",
            // name: "#= group.value.split('*')[1] #"
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
        valueAxis: {
        	 visible :false,
            labels: {
                // format: "${0}",

        		font: "5px sans-serif",
                skip: 2,
                step: 2
            },
            title : {
            	text : "No. of Deals",
        		font: "5px sans-serif",
            	visible : false,
            	color : "#4472C4"
            },
            line: {
		        visible: true
		    },
		    majorGridLines:{
		        visible:true
		    },
            majorUnit: dash.chartUnit(data, 'approve_rate', 4),
            max: dash.chartMax(data, 'approve_rate')
        },
        categoryAxis: {
            visible: true,
           	line: {
		        visible: false
		    },
		    majorGridLines:{
		        visible:false
		    }
        },
        tooltip : {
        	visible: false,
        	template : function(dt){
        		return dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
        	}
        }
	});

	$("#analysis").html("")
	$("#analysis").kendoChart({
		theme: "Material",
        title: { 
            // text: "Processing TAT",
            font:  "bold 10px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
        },
        dataSource: data,
        seriesDefaults: {
            type: "area",
            area: {
                line: {
                    style: "smooth"
                }
            }
        },
        series: [{
            // type: "area",
            stack : false,
            field: "analyze_rate",
            // name: "#= group.value.split('*')[1] #"
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
        valueAxis: {
        	 visible :false,
            labels: {
                // format: "${0}",

        		font: "5px sans-serif",
                skip: 2,
                step: 2
            },
            title : {
            	text : "No. of Deals",
        		font: "5px sans-serif",
            	visible : false,
            	color : "#4472C4"
            },
            line: {
		        visible: true
		    },
		    majorGridLines:{
		        visible:true
		    },
            majorUnit: dash.chartUnit(data, 'analyze_rate', 4),
            max: dash.chartMax(data, 'analyze_rate')
        },
        categoryAxis: {
            visible: true,
           	line: {
		        visible: false
		    },
		    majorGridLines:{
		        visible:false
		    }
        },
        tooltip : {
        	visible: false,
        	template : function(dt){
        		return dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
        	}
        }
	});
} 

conv.loadRadialGauge = function(){
	$("#tatgoals").html('')
    $("#tatgoals").kendoRadialGauge({
       	pointer: {
            value: parseInt(kendo.toString(conv.actRate(), 'n2'))
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

conv.containerPeriodData = function(){
	var param = {
		start : discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar")),
		end : discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar2")),
		type : dash.FilterValue.GetVal("TimePeriod"),
		filter: dash.FilterValue()
	}
	ajaxPost("/dashboard/conversionoption6", param, function(res){
		if(res.Data != null){
			var data = res.Data;
			conv.loadContainer(data);
			conv.loadAllTop(data)

		}
	})
}

conv.loadContainer = function(data){
		var len = conv.trendDataLength();
		var start = discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar"));
		var end = discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar2"));
		var type = dash.FilterValue.GetVal("TimePeriod");
		var title = false;
		var groupby = 'period';
		var month = dash.generateXAxis(type, start, end, len + 1)
		month.shift();
		console.log("----->>>",month)
	$("#chartContainer").html('')
	$("#chartContainer").kendoChart({
        // theme: "Material",
            title: { 
                    text: "Processing Rate",
                    font:  "12px Arial,Helvetica,Sans-Serif",
                    align: "left",
                    color: "#58666e",
                },
				plotArea: {
					margin: {
						right: 4,
					}
				},
                dataSource: data,
                series: [
                {
                    type: "line",
                    stack : false,
                    field: "underwrite_rate",
                    // axis: "dc",
                    dashType: "dot",
                    // color: 'green',
                    overlay: {
		                gradient: "none"
		            },
                    name: "Underwrite Rate"
                },
                {
                    type: "line",
                    stack : false,
                    field: "approve_rate",
                    // axis: "dc",
                    dashType: "dot",
                    // color: 'red',
                    overlay: {
		                gradient: "none"
		            },
                    name: "Approval Rate"
                },
                {
                    type: "line",
                    stack : false,
                    field: "analyze_rate",
                    // axis: "dc",
                    dashType: "dot",
                    // color: '#00b0f0',
                    overlay: {
		                gradient: "none"
		            },
                    name: "Analys Rate"
                },
                {
                    type: "line",
                    stack : false,
                    field: "accept_rate",
                    // axis: "dc",
                    dashType: "dot",
                    // color: 'brown',
                    overlay: {
		                gradient: "none"
		            },
                    name: "Accepted Rate"
                },
                {
                    type: "line",
                    stack : false,
                    field: "action_rate",
                    // axis: "dc",
                    dashType: "dot",
                    // color: 'grey',
                    overlay: {
		                gradient: "none"
		            },
                    name: "Actioned Rate"
                },
                ],
                chartArea:{
                	height: 283,
                    background: "white"
                },
                legend: {
                	visible: true,
                    position: "bottom",
                    labels:{
                        font: "10px Arial,Helvetica,Sans-Serif"
                    }
                },
     			valueAxes: [{
     				title: { 
     					text: "Rate",
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
                    
     			}],
                categoryAxis: {
                	categories: month,
                	title : {
                    	text : "Time Period",
                		font: "10px sans-serif",
                    	visible : true,
                    	color : "#4472C4"
                    },
                    labels : {
                		font: "10px sans-serif",
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
                		// console.log(dt);
                		return dt.series.name + " : " + kendo.toString(dt.value, 'n2')
                	}
                }
    });
}

conv.loadFunnelChart = function(data){
    $("#ontext1").text(data[0].pending_1)
    $("#ontext2").text(data[0].pending_2)
	$('#funnelChart').kendoChart({
        // title: {
        //     text: "Processing Funnel",
        //     position: "top",
        //     align: "left",
        //     color: "#58666e",
        //     font:  "12px Arial,Helvetica,Sans-Serif",
        //     // margin: {
        //     //     left: -20
        //     // }
        // },
        legend: {
            visible: false
        },
        chartArea:{
        	height: 250,
            background: "white"
        },
        seriesDefaults: {
            labels: {
            	template: function(d){
            		// console.log("-------------------------->>>>", d)
            		var str = ''
            		if(d.category == 'Actioned Deals'){
            			str = 'Actioned deals \n (On Hold = '+data[0].fnonhold+' , Sent Back for Analysis = '+data[0].fnsentbackforanalys+') \n'+ d.dataItem.real_value
            		}else if(d.category == 'Underwritten Deals'){
            			str = d.category +" \n (Approved = "+data[0].fnapproved+", Rejected = "+data[0].fnrejected+") \n"+ d.dataItem.real_value
            		}else{
            			str = d.category +" \n"+ d.dataItem.real_value
            		}
            		return str
            	},
                visible: true,
                background: "transparent",
                color: "#dedede",
                format: "N0",
                font: "bold 11px Arial,Helvetica,Sans-Serif"
            },
            dynamicSlope: false,
            dynamicHeight: false
        },
        series: [{
            type: "funnel",
            dynamicSlope: true,
            data: conv.funneldata()
        }],
        tooltip: {
            visible: true,
            template: function(e){
                // console.log("------->>>>> ccc", e)
                var str = ''
                if(e.dataItem.category == 'Actioned Deals'){
                    str = 'Actioned deals \n (On Hold = '+data[0].fnonhold+' , Sent Back for Analysis = '+data[0].fnsentbackforanalys+') <br/>'+ e.dataItem.real_value
                    // str = "mmm"
                }else if(e.dataItem.category == 'Underwritten Deals'){
                    str = "(Approved = "+data[0].fnapproved+", Rejected = "+data[0].fnrejected+") <br/>"+ e.dataItem.real_value
                    // str = "nnnn"
                }else{
                    str = e.dataItem.category +"<br/>"+ e.dataItem.real_value
                    // str = "sss"
                }
                return str
            }
        }
    });

    setTimeout(function(){
        var fun1 = $("#funnelChart > svg > g > g:nth-child(4) > g > g:nth-child(3) > path:nth-child(1)").offset().left
        var top1 = $("#svg1").offset().top
        var fun2 = $("#funnelChart > svg > g > g:nth-child(4) > g > g:nth-child(4) > path:nth-child(1)").offset().left
        var top2 = $("#svg2").offset().top
        $('#svg1').offset({top: top1, left: fun1 - 208})
        $('#svg2').offset({top: top2, left: fun2 - 208})
    }, 500)
}

conv.loadData = function(){
	conv.funneldata([]);
	conv.summaryTrenData([]);
	var param = {
		start : discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar")),
		end : discardTimezone(dash.FilterValue.GetVal("TimePeriodCalendar2")),
		type : dash.FilterValue.GetVal("TimePeriod"),
		filter: dash.FilterValue()
	}
	ajaxPost("/dashboard/conversionoption", param, function(res){
        var data = res.Data;
        conv.summaryTrenData(data);
        conv.actRate(data[0].action_rate);
        conv.undrRate(data[0].underwrite_rate);
        conv.apprRate(data[0].approve_rate);
        conv.analRate(data[0].analyze_rate);
        // conv.compactRate(data.compactRate);
        conv.compundrRate(data[0].underwrite_rate - data[1].underwrite_rate);
        conv.compapprRate(data[0].approve_rate - data[1].approve_rate);
        conv.companalRate(data[0].analyze_rate - data[1].analyze_rate);
        conv.summaryTrenData(data)
        var funnel = [
            {
                category: "Deals Inqueue",
                value: data[0].inqueue,
                color: "#ff2929"
            },
            {
                category: "Accepted deals ",
                value: data[0].accepted,
                color: "#FF8229"

            },{
                category: "Analized Deals",
                value: data[0].analyzed,
                color: "#FFAD29"
            },{
                category: "Actioned Deals",
                value: data[0].actioned,
                color: "#27C85E"
            },{
                category: "Underwritten Deals",
                value: data[0].underwritten,
                color: "#2e75b6"
            },{
                category: "Approved Deals",
                value: data[0].approved,
                color: "#413CC1",
                height: 500,
            }
		];
        var maxfun = _.maxBy(funnel, "value")
        var minfun = _.minBy(funnel, "value")
        var base = (maxfun.value - minfun.value) * 2
        if (base === 0)
            base = 1
        funnel = _.map(funnel, function (val) {
            val.real_value = val.value
            val.value = val.value + base
            return val
        })
        conv.funneldata(funnel);
        conv.loadFunnelChart(data)
        conv.loadRadialGauge()

	}) 
}

conv.titleText = ko.computed(function () {
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
        return start.format("MMM ' YY")
    case "1year":
        return start.format("YYYY")
    case "fromtill":
        return start.format("DD MMM YYYY") + " - " + end.format("DD MMM YYYY")
    }
    return title;
})

dash.FilterValue.subscribe(function (val) {
    // turn.loadAlleverage()
    conv.loadData();
    conv.containerPeriodData();
    conv.loadRadialGauge();
})

$(function () {        
    $(window).bind("resize", function() {
        $('#funnelChart').data("kendoChart").refresh()
        setTimeout(function(){
            var fun1 = $("#funnelChart > svg > g > g:nth-child(4) > g > g:nth-child(3) > path:nth-child(1)").offset().left
            var top1 = $("#svg1").offset().top
            var fun2 = $("#funnelChart > svg > g > g:nth-child(4) > g > g:nth-child(4) > path:nth-child(1)").offset().left
            var top2 = $("#svg2").offset().top
            $('#svg1').offset({top: top1, left: fun1 - 208})
            $('#svg2').offset({top: top2, left: fun2 - 208})
        }, 500)
        $('#chartContainer').data("kendoChart").refresh()
        $('#tatgoals').data("kendoRadialGauge").refresh()
        $('#analysis').data("kendoChart").refresh()
        $('#approval').data("kendoChart").refresh()
        $('#rate').data("kendoChart").refresh()
    });
    $(".sidebar-toggle").click(function(){
        var infilter = $("#infilter")
        if(infilter.is(":visible") == true){
            $('#funnelChart').data("kendoChart").refresh()
            $('#chartContainer').data("kendoChart").refresh()
            // $('#tatgoals').data("kendoRadialGauge").refresh()
            $('#analysis').data("kendoChart").refresh()
            $('#approval').data("kendoChart").refresh()
            $('#rate').data("kendoChart").refresh()
        }else{
            $('#funnelChart').data("kendoChart").refresh()
            $('#chartContainer').data("kendoChart").refresh()
            // $('#tatgoals').data("kendoRadialGauge").refresh()
            $('#analysis').data("kendoChart").refresh()
            $('#approval').data("kendoChart").refresh()
            $('#rate').data("kendoChart").refresh()
        }
    })
})
