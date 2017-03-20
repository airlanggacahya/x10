var ttrack = {};
ttrack.trackingList = ko.observableArray([
    {text : 'Deal Region', value: 'region'},
    {text : 'Deal Stages', value: 'stages'}
]);
ttrack.trackingValue = ko.observable("stages");
ttrack.modalChartTittle = ko.observable("");
ttrack.isRegion = ko.observable(false);
ttrack.modalGridTittle = ko.observable("");
ttrack.DataGridModal = ko.observableArray([])
ttrack.popupchartcolor = ko.observableArray([])
//"#4472C4"
ttrack.chartcolors = ["#70AD47","#FFC000","#FF0000"];
ttrack.renderModalChart = function(datas){
    datas = ttrack.normalisasiData(datas)

    datas = _.sortBy(datas,["status"])

    var stocksDataSource = new kendo.data.DataSource({
        data : datas,
        group: {
            field: "timestatus"
        },
    });
    $("#chartRegion").html("");

    if(datas.length == 0){
        $("#chartRegion").html("Data not available..")
    }

    $("#chartRegion").kendoChart({
        title: { 
            text: ttrack.modalChartTittle(),
            font:  "bold 12px Arial,Helvetica,Sans-Serif",
            align: "center",
            color: "#58666e",
        },
        dataSource: stocksDataSource,
        series: [{
            type: "column",
            stack : false,
            field: "count",
            name: "#= group.value.split('*')[1] #"
        }],
        chartArea: {
            width: 700,
            height: 200
        },
        legend: {
            visible: false
        },
        seriesColors : ttrack.popupchartcolor(),
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
ttrack.renderChart = function(datas){
			datas = ttrack.normalisasiData(datas)

            var myHeight = ($(window).height() - 90)/3

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
                    height: myHeight,
                    background: "#f0f3f4"
                },
                seriesClick : function(e){
                    var status = e.dataItem.timestatus.split("*")[1];
                    if(status == "Over due"){
                        ttrack.popupchartcolor(["#FF0000"]);
                    }else if( status == "New"){
                        ttrack.popupchartcolor(["#4472C4"]);
                    }else if(status == "Getting due"){
                        ttrack.popupchartcolor(["#70AD47"]);
                    }else if(status == "In time"){
                        ttrack.popupchartcolor(["#FFC000"])
                    }
                    var str = e.dataItem.status+" : "+status+" Deals accross Stages";
                    var gstr = "In Queue : "+ status+ " Deals"
                    ttrack.modalGridTittle(gstr);

                    ttrack.modalChartTittle(str);
                    if(ttrack.trackingValue() == 'stages'){
                        ttrack.loadDataStages(e);
                    }else if(ttrack.trackingValue() == 'region'){
                        ttrack.loadDataRegion(e);
                    }
                },
                legend: {
                    position: "right",
                    labels:{
                        font: "10px Arial,Helvetica,Sans-Serif"
                    }
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

ttrack.loadDataRegion = function(d){
    ttrack.isRegion(true)
    ttrack.DataGridModal([]);
    var param ={
        regionname: d.dataItem.status,
        timestatus: d.dataItem.timestatus,
    }
    ajaxPost("/dashboard/timetrackergriddetails", param, function(res){
        ttrack.DataGridModal(res.Data)
        var onparam = {
            "regionname" : d.dataItem.status,
            "timestatus" : d.dataItem.timestatus
        }
        ajaxPost("/dashboard/timetracker", onparam,function(res){
               ttrack.renderModalChart(res.Data)
            
        });
        ttrack.loadDealGrid()

    })
}

ttrack.loadDataStages = function(d){
    ttrack.isRegion(false)
    ttrack.DataGridModal([]);
    var param ={
        stagename: d.dataItem.status,
        timestatus: d.dataItem.timestatus,
    }
    ajaxPost("/dashboard/timetrackergriddetails", param, function(res){
        ttrack.DataGridModal(res.Data);
        ttrack.loadDealGrid()
    });
    
}



ttrack.getData = function(){
    var param = {
        groupby: ttrack.trackingValue(),
    }
	ajaxPost("/dashboard/timetracker", param,function(res){
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
      // console.log(data)
    return data
}

ttrack.loadDealGrid = function(){
    $("#dealStatus").html('');
    $("#dealStatus").kendoGrid({
        dataSource: ttrack.DataGridModal(),
        columns:[
            // {
            //     field: "",
            //     title: "Sr. No.",
            //     headerAttributes: {style: "background: red; color: white"},
            //     width: 50,

            // },
            {
                field: "custname",
                title: "Customer Name",
                headerAttributes: {style: "background: red; color: white"},
                width: 120,

            },
            {
                field: "dealno",
                title: "DealNo",
                headerAttributes: {style: "background: red; color: white"},
                width: 120,

            },
            {
                field: "caname",
                title: "CA",
                headerAttributes: {style: "background: red; color: white"},
                width: 50,

            },
            {
                field: "rmname",
                title: "RM",
                headerAttributes: {style: "background: red; color: white"},
                width: 50,

            },
            {
                field: "",
                title: "Details",
                headerAttributes: {style: "background: red; color: white"},
                width: 120,

            },
        ]
    });

    $("#Deals").modal('show');
}
ttrack.accordion = function(){
    $(".toggle1").click(function(e){
        e.preventDefault();

        var $this = $(this);
        if($this.next().children().hasClass('show')){
            $this.next().children().removeClass('show');
            $this.next().children().slideUp(500);
            $this.find("h4>").removeClass("fa-chevron-down");
            $this.find("h4>").addClass("fa-chevron-up");

        }else{
            $this.next().children().removeClass('hide');
            $this.next().children().slideDown(500);
            $this.next().children().addClass("show");
            $this.find("h4>").addClass("fa-chevron-down");
            $this.find("h4>").removeClass("fa-chevron-up");
        }
    })
}


$(document).ready(function(){
	ttrack.getData();
    ttrack.accordion();
})
