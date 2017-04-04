var pm = {};

// set to show up dealstatus
dash.showOptionalFilter("DealStatus")

pm.dataPeriod = ko.observableArray([
	{text: 'Period', value: 'period'},
	{text: 'Region', value: 'region'},
]);
pm.ValueDataPeriod = ko.observable('');

pm.loadAllHeadChart = function(){
	pm.Count();
	pm.Mount();
	pm.Interest();
	pm.Target();
	pm.Distribution();
}

pm.dummyData = ko.observableArray([
	{"avgdays":2.2,"date":"2016-10-01T00:00:00Z","dateStr":"Oct '16","dealcount":8,"median":4},
	{"avgdays":3.3,"date":"2016-11-01T00:00:00Z","dateStr":"Nov '16","dealcount":5,"median":3},
	{"avgdays":4.4,"date":"2016-12-01T00:00:00Z","dateStr":"Dec '16","dealcount":3,"median":5},
	{"avgdays":2.0,"date":"2017-01-01T00:00:00Z","dateStr":"Jan '17","dealcount":7,"median":6},
	{"avgdays":8.0,"date":"2017-02-01T00:00:00Z","dateStr":"Feb '17","dealcount":9,"median":7},
	{"avgdays":4.0,"date":"2017-03-01T00:00:00Z","dateStr":"Mar '17","dealcount":2,"median":8}])

pm.Target = function(){
	$("#target").html('')
    $("#target").kendoRadialGauge({
       pointer: {
            value: 65
        },

        scale: {
            minorUnit: 5,
            startAngle: -30,
            endAngle: 210,
            max: 40,
            labels: {
                position: "outside	"
            },
            ranges: [
                {
                    from: 0,
                    to: 20,
                    color: "green"
                }, {
                    from: 20,
                    to: 30,
                    color: "yellow"
                }, {
                    from: 30,
                    to: 40,
                    color: "red"
                }
            ]
        }
    }); 
    $("#target")
       .css({ width: "150px", height: "138px"})
       .data("kendoRadialGauge").resize();
}

pm.Count = function(){
	$("#count").html("")
	$("#count").kendoChart({
		title: {
			visible: false
		},
		// dataSource: ds,
		legend: {
			visible: false
		},
		chartArea: {
			background: "",
			width: 300,
			height: 200
		},
		seriesDefaults: {
			type: "donut",
			holeSize: 50,
	    	startAngle: 150,
		},
		series: [{
	        type: "donut",
	        data: [{
	            category: "Football",
	            value: 35
	        }, {
	            category: "Basketball",
	            value: 25
	        }, {
	            category: "Volleyball",
	            value: 20
	        }, {
	            category: "Rugby",
	            value: 10
	        }, {
	            category: "Tennis",
	            value: 10
	        }],
	        overlay: {
                gradient: "none"
            },
	    }],
		tooltip: {
			visible: true,
			template: "#= category # (#= series.name #): #= value #%"
		}
	});

	var text = "<span style='font-size: 43px;font-weight: bold;'>30</span><br><div id='coba' style='margin-top: -42%;'><span class='fa fa-arrow-up'></span> 30%</div>"
	$(".count-text").append(text);
}

pm.Mount = function(){
	$("#amount").html('');
	$("#amount").kendoChart({
		title: {
			visible: false
		},
		// dataSource: ds,
		legend: {
			visible: false
		},
		chartArea: {
			background: "",
			width: 300,
			height: 200
		},
		seriesDefaults: {
			type: "donut",
			holeSize: 50,
	    	startAngle: 150,
		},
		series: [{
	        type: "donut",
	        data: [{
	            category: "Football",
	            value: 35
	        }, {
	            category: "Basketball",
	            value: 25
	        }, {
	            category: "Volleyball",
	            value: 20
	        }, {
	            category: "Rugby",
	            value: 10
	        }, {
	            category: "Tennis",
	            value: 10
	        }],
	        overlay: {
                gradient: "none"
            },
	    }],
		tooltip: {
			visible: true,
			template: "#= category # (#= series.name #): #= value #%"
		}
	});

	var text = "<span style='font-size: 43px;font-weight: bold;'>30</span><span>Cr.</span> <br><div id='coba' style='margin-top: -42%;'><span class='fa fa-arrow-up'></span> 30%</div>"
	$(".amount-text").append(text);
}

pm.Interest = function(){
	$("#interest").html("");
	$("#interest").kendoChart({
		title: {
			visible: false
		},
		// dataSource: ds,
		legend: {
			visible: false
		},
		chartArea: {
			background: "",
			width: 300,
			height: 200
		},
		seriesDefaults: {
			type: "donut",
			holeSize: 50,
	    	startAngle: 150,
		},
		series: [{
	        type: "donut",
	        data: [{
	            category: "Football",
	            value: 35
	        }, {
	            category: "Basketball",
	            value: 25
	        }, {
	            category: "Volleyball",
	            value: 20
	        }, {
	            category: "Rugby",
	            value: 10
	        }, {
	            category: "Tennis",
	            value: 10
	        }],
	        overlay: {
                gradient: "none"
            },
	    }],
		tooltip: {
			visible: true,
			template: "#= category # (#= series.name #): #= value #%"
		}
	});

	var text = "<span style='font-size: 43px;font-weight: bold;'>30</span><span>Cr.</span> <br><div id='coba' style='margin-top: -42%;'><span class='fa fa-arrow-up'></span> 30%</div>"
	$(".interest-text").append(text);
}

pm.loadContainer = function(){
	$("#chartContainer").html('')
		$("#chartContainer").kendoChart({
	        // theme: "Material",
        // title: { 
        //         // text: "Average Conversion TAT",
        //         font:  "bold 12px Arial,Helvetica,Sans-Serif",
        //         align: "left",
        //         color: "#58666e",
        //     },
        dataSource: pm.dummyData(),
        series: [
        {
            type: "column",
            stack : false,
            field: "avgdays",
            color: '#2e75b6',
            overlay: {
                gradient: "none"
            },
            name: "Interest"
        },
        {
            type: "column",
            stack : false,
            field: "median",
            color: '#00b0f0',
            overlay: {
                gradient: "none"
            },
            name: "Deal Amount"
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
            name: "Target"
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
					text: "Amount (Rs. Lacs)",
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
            	 text : "Time Period",
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

pm.accordion = function(){
    $(".toggle1").click(function(e){
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

pm.setTitle = function(){
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

// pm.setTitle = function(){
// 	var title = kendo.toString(new Date(pm.titleText()), "MMM 'yy");
// 	return title;
// }

pm.loadChaterChart = function(){
	var data = [[20, 23], [40, 27]];
	$(".cater").html("");
	$(".cater").kendoChart({
		title:{
			text: "Deal Amount vs. Credit Scores",
			font:  "bold 12px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",

		},
        seriesDefaults: {
        	type: "scatter",
            labels: {
                visible: true
            }
        },
        series: [{
	        name: "Data",
	        data: data
	    }],
	    legend: {
	    	visible: false,
	    },
        xAxis: {
            max: 50,
            title: {
                text: "Credit Scores",
                font: "11px sans-serif",
            	visible : true,
            	color : "#4472C4"
            },
            labels: {
				template: "&lt;= #= value #",
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
                text: "Deal Amount",
                font: "11px sans-serif",
            	visible : true,
            	color : "#4472C4"
            }
        }
    });
}

pm.normalisasiData = function(data){
	var category = [];
    var comdata = [];
    var lengcomdata = 0;
    var group = [];
    //each category maybe have different number of group, make it all same number
    for(var i in data){
        if(category.indexOf(data[i].status)==-1){
          category.push(data[i].status);
        }
        if(group.indexOf(data[i].timestatus)==-1){
          group.push(data[i].timestatus);
        }
    }

     lengcomdata = group.length;
    //add dummy data if in some category, group number is different 
     for(var i in category){
        var d = _.filter(data,function(x){return x.status == category[i]});
        if(d.length<lengcomdata){
          for(var x in group){
              if(_.find(d,function(g){ return g.timestatus == group[x] } ) == undefined){
                data.push({
                  "status" : category[i] ,  
                  "timestatus":group[x] ,
                  "count":null,
                });
              }
          }
        }
      }
      // console.log(data)
    return data
}

pm.Distribution = function(){
	var data =[{"count":1,"order":1,"status":"Under Process","timestatus":"c*Getting due"}];
	var datas = pm.normalisasiData(data)

	var myHeight = ($(window).height() - 90)/3

	datas = _.sortBy(datas,["status"])

	var stocksDataSource = new kendo.data.DataSource({
		data : datas,
		group: {
		    field: "timestatus"
		},
	});
	$("#distribution").html("");	
	$("#distribution").kendoChart({
        title: { 
            text: "Deal-time Tracking",
            font:  "bold 12px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
        },
        dataSource: stocksDataSource,
        series: [{
            type: "column",
            stack : true,
            field: "count",
            name: "#= group.value.split('*')[1] #"
        }],
        chartArea:{
            height: 150,
            background: "white"
        },
        // seriesClick : function(e){
        //     var status = e.dataItem.timestatus.split("*")[1];
        //     if(status == "Over due"){
        //         ttrack.popupchartcolor(["#FF0000"]);
        //     }else if( status == "New"){
        //         ttrack.popupchartcolor(["#4472C4"]);
        //     }else if(status == "Getting due"){
        //         ttrack.popupchartcolor(["#FFC000"]);
        //     }else if(status == "In time"){
        //         ttrack.popupchartcolor(["#70AD47"])
        //     }
        //     var str = e.dataItem.status+" : "+status+" Deals accross Stages";
        //     var gstr = "In Queue : "+ status+ " Deals"
        //     ttrack.modalGridTittle(gstr);

        //     ttrack.modalChartTittle(str);
        //     if(ttrack.trackingValue() == 'stages'){
        //         ttrack.loadDataStages(e);
        //     }else if(ttrack.trackingValue() == 'region'){
        //         ttrack.loadDataRegion(e);
        //     }
        // },
        legend: {
            position: "right",
            labels:{
                font: "10px Arial,Helvetica,Sans-Serif"
            }
        },
        // seriesColors : ttrack.chartcolors,
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
            field: "status",
           	title : {
            	 text : "Deal Stages",
        		font: "11px sans-serif",
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
        		return dt.dataItem.timestatus.split("*")[1] + " : " + dt.value
        	}
        }
    });
}


$(function(){
	pm.loadChaterChart();
	pm.loadContainer();
	pm.accordion();
	pm.loadAllHeadChart();
});