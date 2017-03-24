var turn = {}

turn.dataMoving = ko.observableArray([])
turn.dataHistory = ko.observableArray([])
turn.dataPeriod = ko.observableArray([
	{text: 'Period', value: 'period'},
	{text: 'Region', value: 'region'},
])
turn.ValueDatePeriod = ko.observable(kendo.toString(new Date(), "MMM-yyyy"));
turn.ValueDataPeriod = ko.observable('period');
turn.chartcolors = ["#ff2929","#ffc000","#92d050", "#2e75b6"];
turn.averageConversion = ko.observable(0);
turn.averageDecision = ko.observable(0);
turn.averageProcessing = ko.observable(0);
turn.averageAcceptance = ko.observable(0);

turn.dummyData = ko.observableArray([
	{"avgdays":2.2,"date":"2016-10-01T00:00:00Z","dateStr":"Oct-2016","dealcount":8,"median":4},
	{"avgdays":3.3,"date":"2016-11-01T00:00:00Z","dateStr":"Nov-2016","dealcount":5,"median":3},
	{"avgdays":4.4,"date":"2016-12-01T00:00:00Z","dateStr":"Dec-2016","dealcount":3,"median":5},
	{"avgdays":2.0,"date":"2017-01-01T00:00:00Z","dateStr":"Jan-2017","dealcount":7,"median":6},
	{"avgdays":8.0,"date":"2017-02-01T00:00:00Z","dateStr":"Feb-2017","dealcount":9,"median":7},
	{"avgdays":4.0,"date":"2017-03-01T00:00:00Z","dateStr":"Mar-2017","dealcount":2,"median":8}])

turn.loadAlleverage = function(){
	var date = kendo.toString(turn.ValueDatePeriod(), "MMM-yyyy");
	var param ={
		trend: '',
		groupby: turn.ValueDataPeriod(),
		period: date,
	}

	param.trend = 'acceptance';
	ajaxPost("/dashboard/snapshottat",param,function(res){ 
		// console.log(res)
		var data = res.Data[0];
		var data = turn.dummyData();
		var sum = _.sumBy(data, 'avgdays');
		var res = kendo.toString(sum/data.length, 'n2')
		// var d = new Date("Apr-2017");
		// d.setMonth(d.getMonth() - 1);
		// turn.averageAcceptance(res)
		var ondata = [];
		ondata.push(data.avgdays)
		$("#acceptance").html('')
		$("#acceptance").kendoChart({
			theme: "Material",
            title: { 
                    // text: "Processing TAT",
                    font:  "bold 10px Arial,Helvetica,Sans-Serif",
                    align: "left",
                    color: "#58666e",
                },
                dataSource: turn.dummyData(),
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
                    height: 100,
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
				    }
                },
                categoryAxis: {
                    visible: true,
                   	line: {
				        visible: true
				    },
				    majorGridLines:{
				        visible:true
				    }
                },
                tooltip : {
                	visible: false,
                	template : function(dt){
                		return dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
                	}
                }
        });
        $("#tatgoals").html('')
        $("#tatgoals").kendoRadialGauge({
           pointer: {
                            value: 65
                        },

                        scale: {
                            minorUnit: 5,
                            startAngle: -30,
                            endAngle: 210,
                            max: 180,
                            labels: {
                                position: "outside	"
                            },
                            ranges: [
                                {
                                    from: 80,
                                    to: 120,
                                    color: "#ffc700"
                                }, {
                                    from: 120,
                                    to: 150,
                                    color: "#ff7a00"
                                }, {
                                    from: 150,
                                    to: 180,
                                    color: "#c20000"
                                }
                            ]
                        }
        }); 
        $("#tatgoals")
	       .css({ width: "150px", height: "125px", marginTop: "19px"})
	       .data("kendoRadialGauge").resize(); 
	});

	param.trend = 'total';
	// ajaxPost("/dashboard/snapshottat",param,function(res){ 
		// console.log(res)
		// var data = res.Data[0];
		var ondata = [];
		// ondata.push(data.avgdays)
		$("#total").html('')
		$("#total").kendoChart({
           theme: "Material",
            title: { 
                    // text: "Processing TAT",
                    font:  "bold 10px Arial,Helvetica,Sans-Serif",
                    align: "left",
                    color: "#58666e",
                },
                dataSource: turn.dummyData(),
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
                    height: 100,
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
				    }
                },
                categoryAxis: {
                    visible: true,
                   	line: {
				        visible: true
				    },
				    majorGridLines:{
				        visible:true
				    }
                },
                tooltip : {
                	visible: false,
                	template : function(dt){
                		return dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
                	}
                }
        });    
	// });

	param.trend = 'processing';
	ajaxPost("/dashboard/snapshottat",param,function(res){ 
		// console.log(res)
		var data = res.Data[0];
		var data = turn.dummyData();
		var sum = _.sumBy(data, 'avgdays');
		var res = kendo.toString(sum/data.length, 'n2')
		turn.averageProcessing(res)
		var ondata = [];
		ondata.push(data.avgdays)
		$("#processing").html('')
		$("#processing").kendoChart({
            theme: "Material",
            title: { 
                    // text: "Processing TAT",
                    font:  "bold 10px Arial,Helvetica,Sans-Serif",
                    align: "left",
                    color: "#58666e",
                },
                dataSource: turn.dummyData(),
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
                    height: 100,
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
				    }
                },
                categoryAxis: {
                    visible: true,
                   	line: {
				        visible: true
				    },
				    majorGridLines:{
				        visible:true
				    }
                },
                tooltip : {
                	visible: false,
                	template : function(dt){
                		return dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
                	}
                }
        });  
	});
	param.trend = 'decision';
	ajaxPost("/dashboard/snapshottat",param,function(res){ 
		console.log(res)
		var data = res.Data;
		var data = turn.dummyData();
		var sum = _.sumBy(data, 'avgdays');
		var res = kendo.toString(sum/data.length, 'n2')
		turn.averageDecision(res);
		console.log(JSON.stringify(data))
		$("#decision").html('')
		$("#decision").kendoChart({
            theme: "Material",
            title: { 
                    // text: "Processing TAT",
                    font:  "bold 10px Arial,Helvetica,Sans-Serif",
                    align: "left",
                    color: "#58666e",
                },
                dataSource: turn.dummyData(),
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
                	// width: 245,
                    height: 100,
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
				    }
                },
                categoryAxis: {
                    visible: true,
                   	line: {
				        visible: true
				    },
				    majorGridLines:{
				        visible:true
				    }
                },
                tooltip : {
                	visible: false,
                	template : function(dt){
                		return dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
                	}
                }
        });  
	});

	param.trend = 'action';
	// ajaxPost("/dashboard/snapshottat",param,function(res){ 
		// console.log(res)
		// var data = res.Data;
		var data = turn.dummyData();
		var sum = _.sumBy(data, 'avgdays');
		var res = kendo.toString(sum/data.length, 'n2')
		turn.averageConversion(res);
		turn.loadChartContainer(turn.dummyData());
		$("#action").html('')
		$("#action").kendoChart({
            theme: "Material",
            title: { 
                    // text: "Processing TAT",
                    font:  "bold 10px Arial,Helvetica,Sans-Serif",
                    align: "left",
                    color: "#58666e",
                },
                dataSource: turn.dummyData(),
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
                    height: 100,
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
				    }
                },
                categoryAxis: {
                    visible: true,
                   	line: {
				        visible: true
				    },
				    majorGridLines:{
				        visible:true
				    }
                },
                tooltip : {
                	visible: false,
                	template : function(dt){
                		return dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
                	}
                }
        });   
	// });
}

turn.loadChartContainer = function(data){
	$("#chartContainer").html('')
	$("#chartContainer").kendoChart({
        // theme: "Material",
            // title: { 
            //         // text: "Average Conversion TAT",
            //         font:  "bold 12px Arial,Helvetica,Sans-Serif",
            //         align: "left",
            //         color: "#58666e",
            //     },
                dataSource: turn.dummyData(),
                series: [
                {
                    type: "column",
                    stack : false,
                    field: "avgdays",
                    color: '#2e75b6',
                    overlay: {
		                gradient: "none"
		            },
                    name: "Avgdays"
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
                	height: 250,
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
     					text: "Days",
     					font: "11px sans-serif",
     					color : "#4472C4" 
     				},
                    min: 0,
                    max: 10,
                    plotBands: [{
						from: 3.0,
						to: 3.5,
						color: "#70ad47",
						name: "Target"
					}]
     			},{
     				name: "dc",
     				title: { 
     					text: "Deal Count",
     					font: "11px sans-serif",
     					color : "#4472C4" 
     				},
                    min: 0,
                    max: 10
     			}
     			],
                categoryAxis: {
                	field: "dateStr",
                	title : {
                    	 text : "Deal Stages",
                		font: "11px sans-serif",
                    	visible : true,
                    	color : "#4472C4"
                    },
                    labels : {
                		font: "10px sans-serif",
                    },
                    axisCrossingValues: [0, 7]
                },
                tooltip : {
                	visible: false,
                	template : function(dt){
                		return dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
                	}
                }
    });
}

turn.loadData = function(){
	turn.dataMoving([]);
	turn.dataHistory([]);
	ajaxPost("/dashboard/historytat", {}, function(res){
		if(res.Data != null){
			turn.dataHistory(res.Data);
			turn.CreateChartHistory(res.Data);
		}
	});
	ajaxPost("/dashboard/movingtat", {}, function(rest){
		if(rest.Data != null){
			turn.dataMoving(rest.Data);
			// turn.setUpData(rest.Data)
			turn.CreateChartMoving(rest.Data);
		}
	})
}

turn.CreateChartHistory = function(data){
	// var status = _.groupBy(data, ["status"])
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
	// console.log("---------->>>>32", historydata)
	$("#historytat").html("");
	$("#historytat").kendoChart({
		title:{
			text: "History TAT",
			font:  "bold 12px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",

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
            background: "white"
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
        		font: "11px sans-serif",
            	visible : true,
            	color : "#4472C4"
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
        			console.log("----------->>>86",dt)
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
	});

}

turn.CreateChartMoving = function(ondata){
	var status = _.groupBy(ondata, "status")
	var cat = [];
	$.each(status, function(key, item){
		cat.push(key)
	});
	console.log(status)
	$.each(ondata, function(i, item){
		if(item.dayrange == "15 + Days"){
			ondata[i].color = "#ff2929"
		}else if(item.dayrange == "11 - 15 Days"){
			ondata[i].color = "#ffc000"
		}else if(item.dayrange == "6 - 10 Days"){
			ondata[i].color = "#92d050"
		}else if(item.dayrange == "0 - 5 Days"){
			ondata[i].color = "#2e75b6"
		}
	})
	var set = turn.normalisasiData(ondata)
	set = _.sortBy(set,["status"])
	// console.log(JSON.stringify(ondata))
	var movingdata = new kendo.data.DataSource({
		data: set,
		group:{
			field: "dayrange"
		},

	});
	$("#movingtat").html("");
	$("#movingtat").kendoChart({
		title:{
			text: "Moving TAT",
			font:  "bold 12px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",

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
            background: "white"
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
        		font: "11px sans-serif",
            	visible : true,
            	color : "#4472C4"
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
        console.log("--------------->>>> d", d)
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

turn.loadChaterChart = function(){
	$(".cater").html("");
	$(".cater").kendoChart({
        seriesDefaults: {
        	type: "scatter",
            labels: {
                visible: true
            }
        },
        series: [{
	        name: "January 2008",
	        data: [[10, 10], [15, 20], [20, 25], [32, 40], [39, 33], [40, 38]
                [11, 33], [38, 22], [35, 22], [33, 35], [10, 12], [10, 32], [10, 35]
            ],
	    },{
	        name: "January 2009",
	        data: [[10, 10], [15, 20], [20, 25], [32, 40], [39, 33], [40, 38]
                [11, 33], [38, 22], [35, 22], [33, 35], [10, 12], [10, 32], [10, 35]
            ],
	    },{
	        name: "January 2010",
	        data: [[10, 10], [15, 20], [20, 25], [32, 40], [39, 33], [40, 38]
                [11, 33], [38, 22], [35, 22], [33, 35], [10, 12], [10, 32], [10, 35]
            ],
	    }],
        xAxis: {
            max: 40,
            labels: {
				template: "#= changeLabels()#",
				skip: 1,
				step: 1
			},
			majorUnit: 10,
			minorUnit: 20,
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
                text: "Deal Amount"
            },
            labels: {
                format: "{0}%"
            }
        }
    });
}

var categories =  ["<=10", "<=20", "<=30", "<=40", "<=50", "<=60", "<=70", "<=80", "<=90", "<=100"],
					categoriesIndex = 0;
				
				function changeLabels() {
					return categories[categoriesIndex++];
				}

$(function(){
	turn.loadData();
	turn.loadAlleverage();
	turn.loadChaterChart()
	
});