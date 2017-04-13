var pm = {};
pm.trendDataMonths = ko.observableArray([]);
pm.dealCount = ko.observable(0);
pm.dealAmount = ko.observable(0);
pm.interestAmount = ko.observable(0);
pm.avgCount = ko.observable(0);
pm.avgAmount = ko.observable(0);
pm.avgInterestAmount = ko.observable(0);
pm.trendPeriod = ko.observableArray([]);
pm.trendRegion = ko.observableArray([]);
pm.creditScore = ko.observableArray([]);
pm.creditScoreAseli = ko.observableArray([]);
pm.creditscoreclicked = ko.observable(false);
pm.creditScoreDataTable = ko.observableArray([]);

pm.xfl1count = ko.observable(0);
pm.xfl2count = ko.observable(0);
pm.xfl3count = ko.observable(0);
pm.xfl4count = ko.observable(0);
pm.xfl5count = ko.observable(0);
pm.xfl1countwidth = ko.observable(0);
pm.xfl2countwidth = ko.observable(0);
pm.xfl3countwidth = ko.observable(0);
pm.xfl4countwidth = ko.observable(0);
pm.xfl5countwidth = ko.observable(0);

pm.xfl1amount = ko.observable(0);
pm.xfl2amount = ko.observable(0);
pm.xfl3amount = ko.observable(0);
pm.xfl4amount = ko.observable(0);
pm.xfl5amount = ko.observable(0);
pm.xfl1amountwidth = ko.observable(0);
pm.xfl2amountwidth = ko.observable(0);
pm.xfl3amountwidth = ko.observable(0);
pm.xfl4amountwidth = ko.observable(0);
pm.xfl5amountwidth = ko.observable(0);

pm.xfl1interest = ko.observable(0);
pm.xfl2interest = ko.observable(0);
pm.xfl3interest = ko.observable(0);
pm.xfl4interest = ko.observable(0);
pm.xfl5interest = ko.observable(0);
pm.xfl1interestwidth = ko.observable(0);
pm.xfl2interestwidth = ko.observable(0);
pm.xfl3interestwidth = ko.observable(0);
pm.xfl4interestwidth = ko.observable(0);
pm.xfl5interestwidth = ko.observable(0);

pm.distributionData = ko.observableArray([]);
pm.scatterWidth = ko.observable(0);

// Hook to filter value changes
dash.FilterValue.subscribe(function(val) {
    pm.ValueDataPeriod("period");
    pm.ValueDataMenuDistribution("amount");
    pm.init();
});

// set to show up dealstatus
dash.showOptionalFilter("DealStatus")

pm.dataPeriod = ko.observableArray([
    { text: 'Period', value: 'period' },
    { text: 'Region', value: 'region' },
]);
pm.ValueDataPeriod = ko.observable('period');
pm.ValueDataPeriod.subscribe(function(e){
    pm.loadContainer(e);
});

pm.dataMenu = ko.observableArray([
    { text: 'Deal Amount', value: 'amount' },
    { text: 'Deal Count', value: 'count' },
    { text: 'Interest Amount', value: 'interest' },
]);
pm.ValueDataMenuDistribution = ko.observable('amount');
pm.ValueDataMenuDistribution.subscribe(function(e){
    pm.Distribution(e);
});

pm.Target = function() {
    $("#tatgoals").html('')
    $("#tatgoals").kendoRadialGauge({
        pointer: {
            value: 6
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
            ranges: [{
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
            }]
        }
    });
}

pm.loadContainer = function(selected) {
    var selectedData;
    var catSelected;
    if (selected == undefined || selected == "period"){
        selectedData = pm.trendPeriod();
        catSelected = { categories: pm.trendDataMonths(), axisCrossingValues: [0, 7]}
    }else{
        selectedData = pm.trendRegion();
        catSelected = { field: "region", axisCrossingValues: [0, 7] }
    }
    $("#chartContainer").html('')
    $("#chartContainer").kendoChart({
        title: {  
            text: "Deal Amount and Interest", 
            font:  "12px Arial,Helvetica,Sans-Serif", 
            align: "left", 
            color: "#58666e", 
            padding: { 
                top: 0 
            } 
        },
        plotArea: {
            margin: {
                right: 4,
            }
        },
        dataSource: selectedData,
        series: [{
            type: "column",
            stack: false,
            field: "interest",
            color: '#2e75b6',
            overlay: {
                gradient: "none"
            },
            name: "Interest"
        }, {
            type: "column",
            stack: false,
            field: "amount",
            color: '#00b0f0',
            overlay: {
                gradient: "none"
            },
            name: "Deal Amount"
        }, {
            type: "line",
            stack: false,
            field: "count",
            axis: "dc",
            dashType: "dot",
            color: '#ffc000',
            name: "Deal Count"
        }, {
            // field: "wind",
            name: "Target"
        }],
        chartArea: {
            height: 250,
            background: "white"
        },
        legend: {
            visible: true,
            position: "bottom",
            labels: {
                font: "10px Arial,Helvetica,Sans-Serif"
            }
        },
        valueAxes: [{
            title: {
                text: "Amount (Rs. Lacs)",
                font: "10px sans-serif",
                color: "#4472C4",
                margin: {
                    right: 1,
                }
            },
            labels: {
                font: "10px sans-serif",
                step: 2,
                skip: 2
            },
            min: 0,
            // max: 10,
            plotBands: [{
                from: 2.9,
                to: 3.0,
                color: "#70ad47",
                name: "Target"
            }]
        }, {
            name: "dc",
            title: {
                text: "Deal Count",
                font: "11px sans-serif",
                color: "#4472C4",
                margin: {
                    left: 1,
                }
            },
            min: 0,
            max: 10,
            labels: {
                font: "10px sans-serif",
                step: 2,
                skip: 2
            },
        }],
        categoryAxis: catSelected,
        tooltip: {
            visible: true,
            template: function(dt) {
                if (dt.series.field == "count") {
                    return "Date: " + moment(dt.dataItem.period).format("YYYY-MM-DD") + "<br>Deal Count: " + kendo.toString(dt.value, "n0");
                }else if (dt.series.field == "amount"){
                    return "Date: " + moment(dt.dataItem.period).format("YYYY-MM-DD") + "<br>Amount: " + kendo.toString(dt.value, "n0");
                }else if ((dt.series.field == "interest")){
                    return "Date: " + moment(dt.dataItem.period).format("YYYY-MM-DD") + "<br>Interest: " + kendo.toString(dt.value, "n0");
                }
                return;
            }
        }
    });
}

pm.accordion = function() {
    $(".toggle1").click(function(e) {
        e.preventDefault();

        var $this = $(this);
        if ($this.next().children().hasClass('show')) {
            $this.next().children().removeClass('show');
            $this.next().children().slideUp(500);
            $this.find("h5>.ic").removeClass("acc-down");
            $this.find("h5>.ic").addClass("acc-up");

        } else {
            $this.next().children().removeClass('hide');
            $this.next().children().slideDown(500);
            $this.next().children().addClass("show");
            $this.find("h5>.ic").addClass("acc-down");
            $this.find("h5>.ic").removeClass("acc-up");
        }
    })
}

pm.setTitle = function() {
    var start = cleanMoment(dash.FilterValue.GetVal("TimePeriodCalendar"))
    var end = cleanMoment(dash.FilterValue.GetVal("TimePeriodCalendar2"))
    var type = dash.FilterValue.GetVal("TimePeriod")
    var title = "All";

    if (type == "10day") {
        title = "Last 10 Days"
    } else if (type == "1month") {
        start = moment(start).format("MMM-YYYY")
        end = moment(end).format("MMM-YYYY")
        title = start
    } else if (type == "1year") {
        start = moment(start).format("YYYY")
        end = moment(start).add(1, "years").format("YYYY")
        title = start + " - " + end
    } else if (type == "fromtill") {
        start = moment(start).format("DD-MMM-YYYY")
        end = moment(end).format("DD-MMM-YYYY")
        title = start + " - " + end
    }

    return title;
}

pm.loadChaterChart = function() {
    //[x axis, y axis]
    //[index 0, index 1]
    //[FinalScoreDob, amount]
    var data = [{
        name: "data",
        data: pm.creditScore()
    }];

    $("#cater").html("");
    $("#cater").kendoChart({
        title: {
            text: "Deal Amount vs. Credit Scores",
            font: "12px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
            padding: {
                top: 0
            }

        },
        chartArea: {
            height: 250,
            background: "white"
        },
        seriesDefaults: {
            type: "scatter"
        },
        series: data,
        legend: {
            visible: false,
        },
        xAxis: {
            min:0,
            max: 10,
            title: {
                // text: "Credit Scores",
                font: "11px sans-serif",
                visible: true,
                color: "#4472C4"
            },
            labels: {
                template: "# if (value != 0) { # &lt;= #= value # # }else{# #= value # #} #",
                // skip: 2,
                step: 1,
                font: "10px sans-serif",
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: "Deal Amount",
                font: "10px sans-serif",
                visible: true,
                color: "#4472C4",
                padding: {
                    left: 0,
                    right: 0
                }
            },
            labels: {
                font: "10px sans-serif",
            }
        },
        tooltip: {
            visible: true,
            template: function(e) {
                var found = _.find(pm.creditScoreAseli(), function(a){
                    return e.value.x == a.finalscoredob && e.value.y == parseFloat(kendo.toString(a.amount/10000000, "n"))
                })
                return "Deal Amount: " + kendo.toString(found.amount/10000000, "n") + "<br /> Interest Rate: " + found.ROI + "%";
            }
        },
        seriesClick: function(e) {
            pm.creditscoreclicked(true);
            var found = _.find(pm.creditScoreAseli(), function(a){
                return e.value.x == a.finalscoredob && e.value.y == parseFloat(kendo.toString(a.amount/10000000, "n"))
            })
            for (var i in found) {
                var interestamount = (found.ROI/100) * (found.amount/10000000);
                found.interesetamount = interestamount;
            }
            var exist = _.find(pm.creditScoreDataTable(), function(a){
                return e.value.x == a.finalscoredob && e.value.y == parseFloat(kendo.toString(a.amount/10000000, "n"));
            })
            if (!exist || exist == undefined) {
                pm.creditScoreDataTable().push(found);
                pm.creaditScoreTable();
            }
        }
    });
}

var record = 0;
pm.creaditScoreTable = function() {
    $("#creaditscoretable").html();
    $("#creaditscoretable").kendoGrid({
        dataSource: {
            data: pm.creditScoreDataTable(),
            pageSize: 20
        },
        sortable: true,
        columns: [{
            title: "Sr. No.",
            template: "#= ++record #",
            width: 50,
        }, {
            field: "customername",
            title: "Customer Name"
        }, {
            field: "dealno",
            title: "Deal No",
        }, {
            field: "creditanalyst",
            title: "Credit Analyst",
        }, {
            field: "rmname",
            title: "RM"
        }, {
            field: "amount",
            title: "Sanctioned Amount",
            attributes: { style: "text-align: right" },
            template: "<div> #= kendo.toString(amount/10000000, 'n') # </div>"
        }, {
            field: "interesetamount",
            title: "Intereset Amount",
            attributes: { style: "text-align: right" },
            template: "<div> #= kendo.toString(interesetamount, 'n') # </div>"
        }, {
            field: "details",
            title: "Details",
            template: function(e){
                return "<a onclick='pm.showMore(\""+e.customername+"\", \""+e.dealno+"\")' style='text-decoration:none; cursor: pointer;'>Show More</a>";
            }
        }, {
            field: "",
            title: "",
            width: 50,
            template: "<button type='button' class='btn btn-danger' onclick='pm.removecreditscorecardrow(\"#:dealno#\")'><i class='glyphicon glyphicon-remove'></i></button>"
        }],
        pageable: true,
        dataBinding: function() {
            record = (this.dataSource.page() -1) * this.dataSource.pageSize();
        }
    });
}

pm.removecreditscorecardrow = function(dealno) {
    var found = _.without(pm.creditScoreDataTable(), _.find(pm.creditScoreDataTable(), function(e){
        return e.dealno == dealno;
    }));
    pm.creditScoreDataTable(found);
    pm.creaditScoreTable();
}

pm.showMore = function(custname, dealno) {
    window.open("/dealsetup/default?customername="+custname+"&dealno="+dealno);
}

pm.normalisasiData = function(data) {
    var category = [];
    var comdata = [];
    var lengcomdata = 0;
    var group = [];
    //each category maybe have different number of group, make it all same number
    for (var i in data) {
        if (category.indexOf(data[i].status) == -1) {
            category.push(data[i].status);
        }
        if (group.indexOf(data[i].timestatus) == -1) {
            group.push(data[i].timestatus);
        }
    }

    lengcomdata = group.length;
    //add dummy data if in some category, group number is different 
    for (var i in category) {
        var d = _.filter(data, function(x) {
            return x.status == category[i] });
        if (d.length < lengcomdata) {
            for (var x in group) {
                if (_.find(d, function(g) {
                        return g.timestatus == group[x] }) == undefined) {
                    data.push({
                        "status": category[i],
                        "timestatus": group[x],
                        "count": null,
                    });
                }
            }
        }
    }
    // console.log(data)
    return data
}

pm.Distribution = function(selected) {
    var selectedoption;
    if (selected == undefined) {
        selectedoption = "amount";
    } else {
        selectedoption = selected;
    }
    $("#distribution").html("");
    $("#distribution").kendoChart({
        title: {
            text: "Deal Amount / Count vs. Interest Rate",
            font: "12px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
            padding: {
                top: 0
            }

        },
        dataSource: new kendo.data.DataSource({
            data: pm.distributionData(),
            group: [
                { field: "xfl" }
            ],
            schema: {
                model: {
                    fields: {
                        percent: {
                            type: "string"
                        },
                        xfl: {
                            type: "string"
                        },
                        roi: {
                            type: "number"
                        }
                    }
                }
            }
        }),
        chartArea: {
            height: 250
        },
        theme: 'Office365',
            seriesDefaults: {
            type: 'column'
        },
        series: [
            {
                type: "column",
                field: selectedoption,
                categoryField: "percent",
                name: "#= group.value #",
                stack: {
                    group: "xfl"
                }
            }
        ],
        dataBound: function(e) {
            if (this.options.series[0].name != "#= group.value #") {
                for(var i in this.options.series){
                    switch (this.options.series[i].name) {
                        case "XFL-1":
                            this.options.series[i].color = "#0b8140";
                            break;
                        case "XFL-2":
                            this.options.series[i].color = "#70ad47";
                            break;
                        case "XFL-3":
                            this.options.series[i].color = "#ffc000";
                            break;
                        case "XFL-4":
                            this.options.series[i].color = "#ed7d31";
                            break;
                        case "XFL-5":
                            this.options.series[i].color = "#ff2929";
                            break;
                    }
                };
            }
            
            var axis = e.sender.options.categoryAxis;
            axis.categories = _.sortBy(this.options.categoryAxis.categories);
            this.options.categoryAxis.categories.sort(function(a,b) {
                if (isNaN(a) || isNaN(b)) {
                    return a > b ? 1 : -1;
                }
                return a - b;
            });
        },
        tooltip: {
            visible: true,
            padding: {
              left: 10
            },
            template: function(e){
                var tlpData = _.find(pm.distributionData(), function(a){
                    return a.xfl == e.series.name && a.percent == e.category;
                });
                var data = "Deal Amount: " + kendo.toString(tlpData.amount, "n") + "<br /> Deal Count: " + tlpData.count + "<br /> Deal Interest: " + kendo.toString(tlpData.interest, "n");
                return data;
            }
        },
        valueAxis: [{
            name: selectedoption,
            title: {
                text: "Deal Amount",
                font: "10px sans-serif",
                visible: true,
                color: "#4472C4",
            }
        }],
        categoryAxis: {
            title: {
                text: "Interest Rates (%)",
                font: "10px sans-serif",
                visible: true,
                color: "#4472C4",
            }
        },
        seriesClick: function(e) {
            pm.dealDistributionDetails(e.value, e.category, selectedoption);
        }
    });
}

pm.dealDistributionDetails = function(value, category, selected) {
    var data = _.find(pm.distributionData(), function(e){
        return e[selected] == value && e.percent == category;
    });

    var isData = (data != undefined)? data.details : [];
    $("#interestDetailDB").html();
    $("#interestDetailDB").kendoGrid({
        dataSource: {
            data: isData
        },
        sortable: true,
        columns: [{
            field: "dealno",
            title: "Deal Number",
            width: 150
        }, {
            field: "dealamount",
            title: "Deal Amount",
            attributes: { style: "text-align: right" },
            template: "<div> #= kendo.toString(dealamount, 'n') # </div>"
        }, {
            field: "interestrate",
            title: "Interest Rate",
            attributes: { style: "text-align: right" },
            template: "<div> #= interestrate # </div>"
        }, {
            field: "period",
            title: "Date",
            template: "#= moment(period).format('YYYY-MM-DD h:m:s') #",
            width: 150
        }]
    });
}

pm.generateXAxis = function(type, start, end, length) {
    var cur = cleanMoment(start)
    var till = cleanMoment(end)
    var ret = []

    switch (type) {
        case "":
        case "1month":
            cur.day(1);
            _.times(length, function() {
                ret.push(cur.format('MMM `YY'))
                cur.subtract(1, 'months')
            })
            break;
        case "1year":
            cur.day(1);
            cur.month(4);
            _.times(length, function() {
                ret.push(cur.format('YYYY'))
                cur.subtract(1, 'year')
            })
            break;
        case "fromtill":
            var days = till.diff(cur, "days") + 1

            _.times(length, function() {
                ret.push(
                    cur.format('DD/MM') + " - " + till.format('DD/MM')
                );
                cur.subtract(days, "days")
                till.subtract(days, "days")
            })
            break;
        case "10day":
            _.times(length, function() {
                ret.push(
                    cur.format('DD/MM/YY') + " - " + cur.clone().subtract(10, "days").format('DD/MM/YY')
                );
                cur.subtract(10, "days")
            })
            break;
        default:
            _.times(length, function() {
                ret.push("");
            })
            break;
    }

    return ret
}

pm.init = function() {
    pm.trendDataMonths([]);
    pm.trendPeriod([]);
    var param = {
        type: dash.FilterValue.GetVal("TimePeriod"),
        start: cleanMoment(dash.FilterValue.GetVal("TimePeriodCalendar")),
        end: cleanMoment(dash.FilterValue.GetVal("TimePeriodCalendar2")),
        filter: dash.FilterValue()
    }
    if (param.filter != undefined) {
        ajaxPost("/dashboard/metricstrend", param, function(res) {
            pm.dealCountAmountInterest(res.Data);

            // sort by idx
            res.Data.trendPeriod = _.without(res.Data.trendPeriod, _.find(res.Data.trendPeriod, function(e) {
                return e.idx == 0;
            }));
            //generate label
            var months = pm.generateXAxis(param.type, param.start, param.end, 7);
            months.shift();
            pm.trendDataMonths(months);
            pm.trendPeriod(_.sortBy(res.Data.trendPeriod, "idx"))
            pm.trendRegion(res.Data.trendRegion);
            pm.loadContainer();

            ///load distribution chart
            pm.distributionData(res.Data.distribution);
            pm.Distribution();
            pm.dealDistributionDetails();

            ///load scatter chart
            pm.creditScoreAseli(res.Data.creditscore);
            pm.creditScoreCreator(res.Data.creditscore);
            pm.loadChaterChart();
            setTimeout(function(){
                var caterWidth = $("#cater").width();
                var tablewidth = caterWidth - pm.findWidthScatter() - 22
                $(".tabl").css({"width": pm.findWidthScatter()+"px", "margin-left": tablewidth+"px"});
            }, 500);
        });
    }
}

pm.creditScoreCreator = function(creditscore) {
    var dataCreditScroce = [];
    for(var i in creditscore) {
        if (creditscore[i].finalscoredob != 0) {
            var a = [];
            a.push(creditscore[i].finalscoredob, parseFloat(kendo.toString(creditscore[i].amount/10000000, "n")));
            dataCreditScroce.push(a)
        }
    }
    pm.creditScore(dataCreditScroce);
}

pm.dealCountAmountInterest = function(data) {
    pm.reset();
    
    if (!$.isEmptyObject(data.topwidget)){
        pm.dealCount(data.topwidget.count);
        pm.dealAmount(kendo.toString(data.topwidget.amount, "n"));
        pm.interestAmount(kendo.toString(data.topwidget.interest, "n"));
        pm.avgCount(kendo.toString(data.topwidget.avgCount, "n"));
        pm.avgAmount(kendo.toString(data.topwidget.avgAmount, "n"));
        pm.avgInterestAmount(kendo.toString(data.topwidget.avgInterest, "n"));
    }

    // XFL
    _.each(data.xfl, function(v, k) {
        switch (v.xfl) {
            case "XFL-1":
                pm.xfl1countwidth(kendo.toString(v.countwidth, "n0"));
                pm.xfl1count(v.count);
                pm.xfl1amountwidth(kendo.toString(v.amountwidth, "n0"));
                pm.xfl1amount(kendo.toString(v.amount, "n"));
                pm.xfl1interestwidth(kendo.toString(v.interestwidth, "n0"));
                pm.xfl1interest(kendo.toString(v.interest, "n"));
                break;
            case "XFL-2":
                pm.xfl2countwidth(kendo.toString(v.countwidth, "n0"));
                pm.xfl2count(kendo.toString(v.count, "n"));
                pm.xfl2amountwidth(kendo.toString(v.amountwidth, "n0"));
                pm.xfl2amount(v.amount);
                pm.xfl2interestwidth(kendo.toString(v.interestwidth, "n0"));
                pm.xfl2interest(kendo.toString(v.interest, "n"));
                break;
            case "XFL-3":
                pm.xfl3countwidth(kendo.toString(v.countwidth, "n0"));
                pm.xfl3count(v.count);
                pm.xfl3amountwidth(kendo.toString(v.amountwidth, "n0"));
                pm.xfl3amount(kendo.toString(v.amount, "n"));
                pm.xfl3interestwidth(kendo.toString(v.interestwidth, "n0"));
                pm.xfl3interest(kendo.toString(v.interest, "n"));
                break;
            case "XFL-4":
                pm.xfl4countwidth(kendo.toString(v.countwidth, "n0"));
                pm.xfl4count(v.count);
                pm.xfl4amountwidth(kendo.toString(v.amountwidth, "n0"));
                pm.xfl4amount(kendo.toString(v.amount, "n"));
                pm.xfl4interestwidth(kendo.toString(v.interestwidth, "n0"));
                pm.xfl4interest(kendo.toString(v.interest, "n"));
                break;
            case "XFL-5":
                pm.xfl5countwidth(kendo.toString(v.countwidth, "n0"));
                pm.xfl5count(v.count);
                pm.xfl5amountwidth(kendo.toString(v.amountwidth, "n0"));
                pm.xfl5amount(kendo.toString(v.amount, "n"));
                pm.xfl5interestwidth(kendo.toString(v.interestwidth, "n0"));
                pm.xfl5interest(kendo.toString(v.interest, "n"));
                break;
        }
    });
}

pm.reset = function() {
    pm.dealCount(0);
    pm.dealAmount(0);
    pm.interestAmount(0);
    pm.avgCount(0);
    pm.avgAmount(0);
    pm.avgInterestAmount(0);

    pm.xfl1count(0);
    pm.xfl2count(0);
    pm.xfl3count(0);
    pm.xfl4count(0);
    pm.xfl5count(0);
    pm.xfl1countwidth(0);
    pm.xfl2countwidth(0);
    pm.xfl3countwidth(0);
    pm.xfl4countwidth(0);
    pm.xfl5countwidth(0);

    pm.xfl1amount(0);
    pm.xfl2amount(0);
    pm.xfl3amount(0);
    pm.xfl4amount(0);
    pm.xfl5amount(0);
    pm.xfl1amountwidth(0);
    pm.xfl2amountwidth(0);
    pm.xfl3amountwidth(0);
    pm.xfl4amountwidth(0);
    pm.xfl5amountwidth(0);

    pm.xfl1interest(0);
    pm.xfl2interest(0);
    pm.xfl3interest(0);
    pm.xfl4interest(0);
    pm.xfl5interest(0);
    pm.xfl1interestwidth(0);
    pm.xfl2interestwidth(0);
    pm.xfl3interestwidth(0);
    pm.xfl4interestwidth(0);
    pm.xfl5interestwidth(0);
}

pm.findWidthScatter = function() {
    var data1 = parseInt($("#cater g:first path:eq(1)").attr("d").split(" ")[3], 10);
    var data2 = parseInt($("#cater g:first path:eq(1)").attr("d").split(" ")[7], 10);
    return data1 - data2;
}

$(function() {
    pm.Target();
    pm.accordion();
    // pm.loadAllHeadChart();
    // $('#dealcount td.tooltipdealcount').tooltipster({
    //     functionInit: function(instance, helper) {
    //         console.log(instance, helper)
    //         // // parse the content
    //         // var content = instance.content(),
    //         //     people = JSON.parse(content),
    //         //     // and use it to make a sentence
    //         //     newContent = 'We have ' + people.length + ' people today. Say hello to ' + people.join(', ');

    //         // // save the edited content
    //         // instance.content(newContent);
    //     }
    // });
});
