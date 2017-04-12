var  conv = {}

conv.dummyData = ko.observableArray([
	{"avgdays":2.2,"date":"2016-10-01T00:00:00Z","dateStr":"Oct-2016","dealcount":8,"median":4},
	{"avgdays":3.3,"date":"2016-11-01T00:00:00Z","dateStr":"Nov-2016","dealcount":5,"median":3},
	{"avgdays":4.4,"date":"2016-12-01T00:00:00Z","dateStr":"Dec-2016","dealcount":3,"median":5},
	{"avgdays":2.0,"date":"2017-01-01T00:00:00Z","dateStr":"Jan-2017","dealcount":7,"median":6},
	{"avgdays":8.0,"date":"2017-02-01T00:00:00Z","dateStr":"Feb-2017","dealcount":9,"median":7},
	{"avgdays":4.0,"date":"2017-03-01T00:00:00Z","dateStr":"Mar-2017","dealcount":2,"median":8}])

conv.loadAllTop = function(){
	$("#rate").html("")
	$("#rate").kendoChart({
		theme: "Material",
        title: { 
            // text: "Processing TAT",
            font:  "bold 10px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
        },
        dataSource: conv.dummyData(),
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
            field: "avgdays",
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
		        visible:true,
		         skip: 2,
                step: 2
		    }
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
        dataSource: conv.dummyData(),
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
            field: "avgdays",
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
		        visible:true,
		         skip: 2,
                step: 2
		    }
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
        dataSource: conv.dummyData(),
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
            field: "avgdays",
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
		        visible:true,
		         skip: 2,
                step: 2
		    }
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
            value: 5
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

conv.loadContainer = function(){
	$("#chartContainer").html('')
	$("#chartContainer").kendoChart({
        // theme: "Material",
            // title: { 
            //         // text: "Average Conversion TAT",
            //         font:  "bold 12px Arial,Helvetica,Sans-Serif",
            //         align: "left",
            //         color: "#58666e",
            //     },
				// title:{
				// 	text: "Average Conversion TAT",
				// 	font:  "12px Arial,Helvetica,Sans-Serif",
				// 	align: "left",
				// 	color: "#58666e",
				// 	padding: {
				// 		top: 0
				// 	}
				// },
				plotArea: {
					margin: {
						right: 4,
					}
				},
                dataSource: conv.dummyData(),
                series: [
                {
                    type: "line",
                    stack : false,
                    field: "avgdays",
                    // axis: "dc",
                    dashType: "dot",
                    color: '#2e75b6',
                    overlay: {
		                gradient: "none"
		            },
                    name: "Avg Days"
                },
                {
                    type: "line",
                    stack : false,
                    field: "median",
                    // axis: "dc",
                    dashType: "dot",
                    color: '#00b0f0',
                    overlay: {
		                gradient: "none"
		            },
                    name: "Median"
                },
                ],
                chartArea:{
                	height: 220,
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
                    // max: 10,
     //                plotBands: [{
					// 	from: 2.9,
					// 	to: 3.0,
					// 	color: "#70ad47",
					// 	name: "Target"
					// }]
     			},//{
     	// 			name: "dc",
     	// 			title: { 
     	// 				text: "Deal Count",
     	// 				font: "10px sans-serif",
     	// 				color : "#4472C4",
						// margin: {
						// 	left: 1,
						// }
     	// 			},
      //               min: 0,
      //               labels : {
      //               	font: "10px sans-serif",
      //               	step : 2,
      //               	skip : 2
      //               },
      //               // max: 10
     	// 		}
     			],
                categoryAxis: {
                	// categories: month,
                	field: "dateStr",
                	// visible : true,
                	title : {
                    	text : "Time Period",
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
}

conv.octData = ko.observableArray([
	{
    category: "Impressions ",
	    value: 434823,
	    color: "#0e5a7e"
	},{
	    category: "Clicks",
	    value: 356854,
	    color: "#166f99"
	},{
	    category: "Unique Visitors",
	    value: 280022,
	    color: "#2185b4"
	},{
	    category: "Downloads",
	    value: 190374,
	    color: "#319fd2"
	},{
	    category: "Purchases",
	    value: 120392,
	    color: "#3eaee2"
	}
]);

conv.loadFunnelChart = function(){
	$('#funnelChart').kendoChart({
        title: {
            text: "dicoba",
            position: "bottom"
        },
        legend: {
            visible: false
        },
        chartArea:{
        	height: 220,
            background: "white"
        },
        seriesDefaults: {
            labels: {
                visible: true,
                background: "transparent",
                color:"white",
                format: "N0"
            },
            dynamicSlope: false,
            dynamicHeight: false
        },
        series: [{
            type: "funnel",
            data: conv.octData()
        }],
        tooltip: {
            visible: true,
            template: "#= category #"
        }
    });
}


$(function(){
	conv.loadFunnelChart();
	conv.loadRadialGauge();
	conv.loadAllTop();
	conv.loadContainer();
});