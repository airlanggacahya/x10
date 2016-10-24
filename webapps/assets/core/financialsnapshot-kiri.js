var left = {}
left.dataGrowth = ko.observableArray([])

left.dataStickChart = ko.observableArray([]);
left.dataYear = ko.observableArray([]);
left.dataTurnOver = ko.observableArray([]);
left.dataBalance = ko.observableArray([]);
left.panelVisible = ko.observable(false)

left.templateRatioData = {
	Year:[],
	EBITDA: [],
	PAT: [],
	Sales:[],
	Other:[],
}

left.templateSeries = ko.observableArray([
	{
		name: "Sales/Receipts",
		data:[],
		turnover: left.dataTurnOver(),
		color: "#5c9edb"
	},
	{
		name:"Other Income (part of Business Income)",
		data:ko.observableArray([]),
		turnover: left.dataTurnOver(),
		color: "#ed843c"
	}
]);

left.dataChartStick = ko.observableArray([]);

left.TemplateWCASSETS = {
	value: 0,
	growth: 0,
	title: "Working Capital Assets",
}
left.TemplateTNW = {
	value: 0,
	growth: 0,
	title:"Total Net worth",
}
left.TemplateADNW = {
	value: 0,
	growth: 0,
	title:"Adjusted Net worth",
}
left.TemplateTOTOBW = {
	value: 0,
	growth: 0,
	title:"Total Outside Debts",
}

left.ratioDataAudited = ko.mapping.fromJS(left.templateRatioData);
left.WCASSETS = ko.mapping.fromJS(left.TemplateWCASSETS);
left.TNW = ko.mapping.fromJS(left.TemplateTNW);
left.ADNW = ko.mapping.fromJS(left.TemplateADNW);
left.TOTOBW = ko.mapping.fromJS(left.TemplateTOTOBW);

left.loadRatioData = function(){
	left.templateSeries()[1].data = [];
	left.templateSeries()[0].data = [];
	left.ratioDataAudited.Year([]);
	left.ratioDataAudited.EBITDA([]);
	left.ratioDataAudited.PAT([]);
	left.ratioDataAudited.Other
	left.dataYear([])
	left.dataStickChart([]);
	console.log(r.rootdates())
	$("#TOTOBW").removeClass("fa fa-caret-down");
	$("#TOTOBW").removeClass("fa fa-caret-up");
	$("#TNW").removeClass("fa fa-caret-down");
	$("#TNW").removeClass("fa fa-caret-up");
	$("#WCASSETS").removeClass("fa fa-caret-down");
	$("#WCASSETS").removeClass("fa fa-caret-up");
	$("#ADNW").removeClass("fa fa-caret-down");
	$("#ADNW").removeClass("fa fa-caret-up");
	$.each(r.rootdates(), function(i, year){
		if(year.Status == "AUDITED"){
			var date = year.Date.split('-')
			left.ratioDataAudited.Year.push(date[2]);
			left.dataYear.push("FY "+moment(date,"DD-MM-YYYY").format("YY"))
		}

	});

	$.each(r.rootdata(), function(i, data){
		if(data.FieldAlias == "EBITDA"){
			$.each(data.Values, function(w, values){
				$.each(left.ratioDataAudited.Year(), function(d, items){
					if(values.Date.indexOf(items) != -1){
						left.ratioDataAudited.EBITDA.push(parseFloat(values.Value))
					}
				})
			})
		}else if(data.FieldAlias == "PAT"){
			$.each(data.Values, function(w, values){
				$.each(left.ratioDataAudited.Year(), function(d, items){
					if(values.Date.indexOf(items) != -1){
						left.ratioDataAudited.PAT.push(parseFloat(values.Value))
					}
				});
			});
		}else if(data.FieldAlias == "SALES"){
			$.each(data.Values, function(w, values){
				$.each(left.ratioDataAudited.Year(), function(d, items){
					if(values.Date.indexOf(items) != -1){
						left.ratioDataAudited.Sales.push(parseFloat(values.Value))
					}
				});
			});
		}else if(data.FieldAlias == "OIBI"){
			$.each(data.Values, function(w, values){
				$.each(left.ratioDataAudited.Year(), function(d, items){
					if(values.Date.indexOf(items) != -1){
						left.ratioDataAudited.Other.push(parseFloat(values.Value))
					}
				});
			});
		}else if(data.FieldAlias == "TO"){
			$.each(data.Values, function(g, value){
				// console.log("+++++++++", value)
				$.each(left.ratioDataAudited.Year(), function(i, year){
					if(value.Date.indexOf(year) != -1){
						// console.log(value.Value)
						left.dataTurnOver.push(value.Value)
					}
				})
			})
		}
	});

	$.each(r.rootdata(), function(e, data){
		if(data.FieldAlias == "OIBI"){
			
			console.log(data.FieldAlias)
			$.each(data.Values, function(g, value){
				$.each(left.ratioDataAudited.Year(), function(i, year){
					if(value.Date.indexOf(year) != -1){
						console.log(value.Value)
						left.templateSeries()[1].data.push(value.Value)
						left.dataStickChart.push(
							{
								categoryOrder: left.dataYear()[i],
								name: "Other Income (part of Business Income)",
								value: value.Value,
								turnover: left.dataTurnOver()[i]
							}
						)
					}
				})
			})
		}if(data.FieldAlias == "SALES"){
			left.templateSeries()[1].data = [];
			console.log(data.FieldAlias)
			$.each(data.Values, function(g, value){
				$.each(left.ratioDataAudited.Year(), function(i, year){
					if(value.Date.indexOf(year) != -1){
						console.log(value.Value)
						left.templateSeries()[0].data.push(value.Value)
						left.dataStickChart.push(
							{
								categoryOrder: left.dataYear()[i],
								name: "Sales/Receipts",
								value: value.Value,
								turnover: left.dataTurnOver()[i]
							}
						)
					}
				})
			})
		}else if(data.FieldAlias == "TNW"){
			var onyear = left.ratioDataAudited.Year();
			var ind = left.ratioDataAudited.Year().length - 1;
			$.each(data.Values, function(g, value){

				if(value.Date.indexOf(onyear[ind]) != -1){
					var growth = toolkit.number((value.Value - data.Values[g - 1].Value) / data.Values[g - 1].Value * 100);
					left.TNW.value(value.Value);
					left.TNW.growth(kendo.format('{0:n2}', growth) + ' %');
					if(value.Value > growth){
						$("#TNW").css("color", "#627f4f");
						$("#TNW1").css("color", "#627f4f");
						$("#TNW").addClass("fa fa-caret-up");
					}else{
						$("#TNW").css("color", "#ff0000");
						$("#TNW1").css("color", "#ff0000");
						$("#TNW").addClass("fa fa-caret-down");
					}
				}
				// })
			})
		}else if(data.FieldAlias == "WCASSETS"){
			var onyear = left.ratioDataAudited.Year();
			var ind = left.ratioDataAudited.Year().length - 1;
			$.each(data.Values, function(g, value){

				if(value.Date.indexOf(onyear[ind]) != -1){
					var growth = toolkit.number((value.Value - data.Values[g - 1].Value) / data.Values[g - 1].Value * 100);
					left.WCASSETS.value(value.Value);
					left.WCASSETS.growth(kendo.format('{0:n2}', growth) + ' %');
					if(value.Value > growth){
						$("#WCASSETS").css("color", "#627f4f");
						$("#WCASSETS1").css("color", "#627f4f");
						$("#WCASSETS").addClass("fa fa-caret-up");
					}else{
						$("#WCASSETS").css("color", "#ff0000");
						$("#WCASSETS1").css("color", "#ff0000");
						$("#WCASSETS").addClass("fa fa-caret-down");
					}
				}
				// })
			})
		}else if(data.FieldAlias == "ADNW"){
			var onyear = left.ratioDataAudited.Year();
			var ind = left.ratioDataAudited.Year().length - 1;
			$.each(data.Values, function(g, value){

				if(value.Date.indexOf(onyear[ind]) != -1){
					var growth = toolkit.number((value.Value - data.Values[g - 1].Value) / data.Values[g - 1].Value * 100);
					left.ADNW.value(value.Value);
					left.ADNW.growth(kendo.format('{0:n2}', growth) + ' %');
					if(value.Value > growth){
						$("#ADNW").css("color", "#627f4f");
						$("#ADNW1").css("color", "#627f4f");
						$("#ADNW").addClass("fa fa-caret-up");
					}else{
						$("#ADNW").css("color", "#ff0000");
						$("#ADNW1").css("color", "#ff0000");
						$("#ADNW").addClass("fa fa-caret-down");
					}
				}
				// })
			})
		}else if(data.FieldAlias == "TOTOBW"){
			var onyear = left.ratioDataAudited.Year();
			var ind = left.ratioDataAudited.Year().length - 1;
			$.each(data.Values, function(g, value){

				if(value.Date.indexOf(onyear[ind]) != -1){
					var growth = toolkit.number((value.Value - data.Values[g - 1].Value) / data.Values[g - 1].Value * 100);
					left.TOTOBW.value(value.Value);
					left.TOTOBW.growth(kendo.format('{0:n2}', growth) + ' %');
					if(value.Value > growth){
						$("#TOTOBW").css("color", "#627f4f");
						$("#TOTOBW1").css("color", "#627f4f");
						$("#TOTOBW").addClass("fa fa-caret-up");
					}else{
						$("#TOTOBW").css("color", "#ff0000");
						$("#TOTOBW1").css("color", "#ff0000");
						$("#TOTOBW").addClass("fa fa-caret-down");
					}
				}
				// })
			})
		}
		
	})

	left.initEvents()
	left.createChart()
	$(window).resize(function(){
		try{
			$("#chartstick").data("kendoChart").refresh();
			$("#chartline").data("kendoChart").refresh();
			// $("#profitableratios").data("kendoChart").refresh();
			$("#operatingratios").data("kendoChart").refresh();
			$("#leverageratios").data("kendoChart").refresh();
		}catch(err){
			console.log(err)
		}
		
	});
	
}

left.initEvents = function () {
	filter().CustomerSearchVal.subscribe(function () {
		left.panelVisible(false)
	})
	filter().DealNumberSearchVal.subscribe(function () {
		left.panelVisible(false)
	})

	//$('#refresh').remove()
}

left.createChart = function(){
	$("#chartline").kendoChart({
		chartArea: {
	        // width: 275,
	        height: 140,
	        background:"transparent"
	    },
        title: {
            text: ""
        },
        plotArea: {
            margin: -5
        },
        legend: {
           	visible: true,
            position: "bottom",
            orientation: "horizontal",
            offsetX: 20,
		    offsetY: 15,
		    labels: {
		        //font: "9px Arial,Helvetica,sans-serif"
		    }
        },
        seriesDefaults: {
            type: "line",
            // style: "smooth",
             markers: {
               size: 3
            }		 	
        },
        series: [{
            name: "EBITDA",
            data: left.ratioDataAudited.EBITDA(),
            color: ecisColors[1],
            padding: 0
        }, {
            name: "PAT",
            data: left.ratioDataAudited.PAT(),
            color: ecisColors[0],
            padding: 0
        }],
        valueAxis: {
            minorGridLines: {
                visible: false
            },
            majorGridLines: {
	            visible: false
	        },
	        labels : {step : 2}
        },
        categoryAxis: {
            categories: left.dataYear(),
            majorGridLines: {
                visible: false
            },
            crosshair: {
	          dashType: "dashDot",
	          visible: true
	        },
	        
        },
        tooltip: {
            visible: true,
            template: "#= series.name # :#= value #	"
        }
    });

    if(model.PageId() == "Approval Form"){
    	$("#chartline").getKendoChart().options.chartArea.height = 160;
    	$("#chartline").getKendoChart().refresh();
    }

	// $("#chartstick").kendoChart({
	// 	chartArea: {
	//         width: 200,
	//         height: 200,
	//         background: "#f3c60c"
	//     },
 //        title: {
 //            text: ""
 //        },
 //        legend: {
 //            visible: true,
 //            position: "bottom",
 //            orientation: "horizontal",
 //            offsetX: 20,
	// 	    offsetY: 15,
	// 	    labels: {
	// 	        //font: "9px Arial,Helvetica,sans-serif"
	// 	    }
 //        },
 //        seriesDefaults: {
 //            type: "column",
 //            missingValues: "gap",
 //            stack: {
 //                    type: "100"
 //                }


 //        },
 //        series: left.templateSeries(),
 //        // seriesColors: ["#cd1533", "#d43851"],
 //        valueAxis: {
 //            line: {
 //                visible: false
 //            },
 //            labels: {
	// 	        visible: false
	// 	    }

 //        },
 //        categoryAxis: {
 //            categories: left.dataYear(),
 //            majorGridLines: {
 //                visible: false
 //            }
 //        },
 //        tooltip: {
 //            visible: true,
 //             template: "#=series.name# : #= value  # </br> turnover : #= series.turnover[series.index] #"
 //             // template : kendo.template($("#templateChart").html()),
 //        }
 //    });

    $("#chartstick").kendoChart({
		title: { "text" : "" },
		chartArea: {
	        // width: 275,
	        height: 155,
	        background: "transparent"
	    },
		legend: {
	       	visible: true,
	        position: "bottom",
	        orientation: "horizontal",
	        offsetX: 20,
		    offsetY: 15,
		    labels: {
		        //font: "9px Arial,Helvetica,sans-serif"
		    }
	    },
	    dataSource: {
	        data:left.dataStickChart(),
	        group: {
	            field: "name",
	            dir: "desc"
	        },
	        sort: [
	            { field: "categoryOrder", dir: "asc" },
	            { field: "name", dir: "desc" }
	        ]
	    },
	    plotArea: {
            margin: -5
        },
	    seriesDefaults: {
	        type: "bar",
	        missingValues: "gap",
            stack: {
                type: "100"
            }
	    },
	    series: [{
	        type: "column",
	        field: "value",
	        padding: 0
	    }],
	    seriesColors: [ecisColors[0], ecisColors[4]],
	    valueAxis: {
	        line: { visible: false },
	        labels: {
		        visible: false
		    },
	        majorGridLines: {
	            visible: false
	        }
	    },
	    categoryAxis: {
	        field: "categoryOrder",
	        majorGridLines: {
                visible: false
            }
	        // crosshair: {
	        //   dashType: "dashDot",
	        //   visible: true
	        // },
	    },
	    tooltip: {
	        visible: true,
	        template: function(e){
	        	console.log(e.dataItem.name);
	        	return "<div style='text-align: left;'> "+e.dataItem.name+ " - "+e.dataItem.categoryOrder+" : "+e.dataItem.value+"</br> Turnover : "+e.dataItem.turnover +"</div>";
	        }
	    }    
	});

	
}


$(function(){
	// left.loadRatioData();
	// left.createChartLine();

})