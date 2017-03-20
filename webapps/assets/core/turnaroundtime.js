var turn = {}

turn.dataMoving = ko.observableArray([])
turn.dataHistory = ko.observableArray([])
turn.chartcolors = ["#ff2929","#ffc000","#92d050", "#2e75b6"];

turn.loadData = function(){
	turn.dataMoving([]);
	turn.dataHistory([]);
	ajaxPost("/dashboard/historytat", {}, function(res){
		if(res.Data != null){
			turn.dataHistory(res.Data);
			turn.CreateChartHistory(res.Data);
		}
	});
	ajaxPost("/dashboard/movingtat", {}, function(res){
		if(res.Data != null){
			turn.dataMoving(res.Data);
			turn.CreateChartMoving(res.Data);
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
	var historydata = new kendo.data.DataSource({
		data: data,
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
		dataSource:{
			data: data,
			group: {
				field: "dayrange"
			}
		},
		series:[{
			type: "column",
			stack: false,
			field: "count",
			name: function(e){
				// console.log(e.group.category)
				return e.group.value;
			},
			colorField: "color",
		}],
		legend: {
			// position: "bottom"
			visible: false,
		},
		seriesColors: turn.chartcolors,
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
        	categories: cat,
          //   field: "status",
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
        		console.log("------------------>>>",dt)
        		return ""
        	}
        }
	});

}

turn.CreateChartMoving = function(ondata){
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
	var movingdata = new kendo.data.DataSource({
		data: ondata,
		group:{
			field: "dayrange"
		}
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
			name: function(e){
				console.log(e)
				return e.group.value;
			},
			colorField: "color",
		}],
		legend: {
			// position: "bottom"
			visible: false
		},
		seriesColors: turn.chartcolors,
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
            	 text : "Deal Movement",
        		font: "11px sans-serif",
            	visible : true,
            	color : "#4472C4"
            },
            labels : {
        		font: "10px sans-serif",
            }
        },
	})
}

$(function(){
	turn.loadData()
});