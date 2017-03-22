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
	console.log("---------->>>>32", historydata)
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
            background: "#f0f3f4"
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
        		return "Deal Stage : "+dt.category+", Processing Days : "+dt.dataItem.dayrange+", Deal Count: "+dt.dataItem.count;
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
            background: "#f0f3f4"
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
        		return "Deal Stage : "+dt.category+", Processing Days : "+dt.dataItem.dayrange+", Deal Count: "+dt.dataItem.count;
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

$(function(){
	turn.loadData()
});