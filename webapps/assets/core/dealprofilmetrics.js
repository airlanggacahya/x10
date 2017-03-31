var pm = {};

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

pm.titleText = ko.computed(function () {
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

    turn.loadAlleverage();
    // alert("masuk")
})

pm.setTitle = function(){
	var title = kendo.toString(new Date(pm.titleText()), "MMM 'yy");
	return title;
}

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


$(function(){
	pm.loadChaterChart();
	pm.loadContainer();
	pm.accordion();
	pm.loadAllHeadChart();
});