var ttrack = {};

ttrack.chartcolors = ["#4472C4","#70AD47","#FFC000","#FF0000"];
ttrack.renderChart = function(datas){
			datas = ttrack.normalisasiData(datas)

			datas = _.sortBy(datas,["status"])

			var stocksDataSource = new kendo.data.DataSource({
            data : datas,
            group: {
                field: "timestatus"
            },
        });
			$("#timeTrackerChart").html("");

			if(datas.length == 0){
				$("#timeTrackerChart").html("Data not available..")
			}

			$("#timeTrackerChart").kendoChart({
                title: { text: "Stock Prices" },
                dataSource: stocksDataSource,
                series: [{
                    type: "column",
                    stack : true,
                    field: "count",
                    name: "#= group.value.split('*')[1] #"
                }],
                legend: {
                    position: "right"
                },
                seriesColors : ttrack.chartcolors,
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

ttrack.getData = function(){
	ajaxPost("/dashboard/timetracker",{},function(res){
		   ttrack.renderChart(res.Data)
		})
	}

ttrack.normalisasiData = function(data){
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
      console.log(data)
    return data
}


$(document).ready(function(){
	ttrack.getData();
})
