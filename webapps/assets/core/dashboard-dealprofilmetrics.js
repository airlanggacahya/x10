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
    switch (selected) {
    default:
    case "period":
        selectedData = pm.trendPeriod();
        catSelected = { categories: pm.trendDataMonths(), axisCrossingValues: [0, 7]}
        catSelected.labels = {
            font: "10px sans-serif",
            // rotation: -45,   
            template:function(e){
                data = (e.value).split(" ");
                if(data[2] != null){
                    tl = data[0].split("/");
                    tgl1 = tl[0]+"/"+tl[1];
                    tg = data[2].split("/");
                    tgl2 = tg[0]+"/"+tg[1]
                    return tgl1+"\n"+tgl2
                }

                return e.value
                
            }
            // visible : true, 
        }
        break
    case "region":
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
                    return "Date: " + moment(dt.dataItem.period).format("YYYY-MM-DD") + "<br>Amount: " + kendo.toString(dt.value, "n2") + "cr";
                }else if ((dt.series.field == "interest")){
                    return "Date: " + moment(dt.dataItem.period).format("YYYY-MM-DD") + "<br>Interest: " + kendo.toString(dt.value, "n2") + "cr";
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
    var data = _.map(pm.creditScoreAseli(), function (val) {
        var score = val.finalscoredob
        var amount = val.amount / 10000000

        if (score <= 4.5) {
            score = score / 4.5 * 2
        } else if (score <= 6) {
            score = (score - 4.5) / (6 - 4.5) * 2 + 2;
        } else if (score <= 7) {
            score = (score - 6) / (7 - 6) * 2 + 4;
        } else if (score <= 8.5) {
            score = (score - 7) / (8.5 - 7) * 2 + 6;
        } else {
            score = (score - 8.5) / (10 - 8.5) * 2 + 8;
        }

        val.data = [[score, val.amount / 10000000]]

        return val
    })

    $("#cater").html("");
    $("#cater").kendoChart({
        title: {
            text: "Deal Amount Vs. Credit Scores",
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
                font: "10px sans-serif",
                visible: true,
                color: "#4472C4"
            },
            labels: {
                template: function (dt) {
                    switch (dt.value) {
                    case 0:
                        return "0";
                    case 2:
                        return " &lt;= 4.5";
                    case 4:
                        return " &lt;= 6";
                    case 6:
                        return " &lt;= 7";
                    case 8:
                        return " &lt;= 8.5";
                    case 10:
                        return " &lt;= 10";
                    default:
                        console.log(dt);
                    }
                },
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
                // console.log(e);
                return "Deal Amount: " + kendo.toString(e.dataItem[1], "n") +
                "<br /> Interest Rate: " + e.series.ROI + "%" +
                "<br /> XFL Score: " + kendo.toString(e.series.finalscoredob, "n2");
            }
        },
        seriesClick: function(e) {
            pm.creditscoreclicked(true);

            var data = _.cloneDeep(e.series)
            // console.log(data);
            var idx = _.findIndex(pm.creditScoreDataTable(), function (val) {
                return val.dealno == data.dealno
            })

            if (idx !== -1)
                return

            delete data['data']
            data.interesetamount = (data.ROI/100) * (data.amount/10000000);
            pm.creditScoreDataTable.push(data);
            pm.creaditScoreTable();
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
        columns: [{
            headerAttributes: { "class": "k-header header-bgcolor" },
            title: "Sr. No.",
            template: "#= ++record #",
            width: 50,
        }, {
            headerAttributes: { "class": "k-header header-bgcolor" },
            field: "customername",
            title: "Customer Name"
        }, {
            headerAttributes: { "class": "k-header header-bgcolor" },
            field: "dealno",
            title: "Deal No",
        }, {
            headerAttributes: { "class": "k-header header-bgcolor" },
            field: "creditanalyst",
            title: "Credit Analyst",
        }, {
            headerAttributes: { "class": "k-header header-bgcolor" },
            field: "rmname",
            title: "RM"
        }, {
            headerAttributes: { "class": "k-header header-bgcolor" },
            field: "amount",
            title: "Sanctioned Amount",
            attributes: { style: "text-align: right" },
            template: "<div> #= kendo.toString(amount/10000000, 'n') # </div>"
        }, {
            headerAttributes: { "class": "k-header header-bgcolor" },
            field: "interesetamount",
            title: "Intereset Amount",
            attributes: { style: "text-align: right" },
            template: "<div> #= kendo.toString(interesetamount, 'n') # </div>"
        }, {
            headerAttributes: { "class": "k-header header-bgcolor" },
            field: "details",
            title: "Details",
            template: function(e){
                return "<a onclick='pm.showMore(\""+e.customername+"\", \""+e.dealno+"\")' style='text-decoration:none; cursor: pointer;'>Show More</a>";
            }
        }, {
            headerAttributes: { "class": "k-header header-bgcolor" },
            field: "",
            title: "",
            width: 50,
            template: "<button type='button' class='btn btn-sm btn-danger' onclick='pm.removecreditscorecardrow(\"#:dealno#\")'><i class='fa fa-trash'></i></button>"
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

    var title = "";
    switch (pm.ValueDataMenuDistribution()) {
    case "amount":
        title = "Deal Amount Vs. Interest Rate"
        break;
    case "count":
        title = "Deal Count Vs. Interest Rate"
        break;
    case "interest":
        title = "Deal Interest Vs. Interest Rate"
        break;
    }
    $("#distribution").html("");
    $("#distribution").kendoChart({
        title: {
            text: title,
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
                var data = "Deal Amount: " + kendo.toString(tlpData.amount, "n") +" cr<br />" + 
                    "Deal Count: " + tlpData.count + "<br />" +
                    "Deal Interest: " + kendo.toString(tlpData.interest, "n") + " cr<br />" +
                    tlpData.xfl;
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
            },
            labels: {
                font: "10px sans-serif",
            }
        }],
        categoryAxis: {
            title: {
                visible: !pm.distributionData().length,
                text: "Interest Rates (%)",
                font: "10px sans-serif",
                color: "#4472C4"
            },
            labels: {
                font: "10px sans-serif",
                template: function (dt) {
                    return dt.value + "%";
                }
            }
        },
        legend: {
            position: "bottom",
            labels:{
                font: "10px Arial,Helvetica,Sans-Serif"
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
        columns: [{
            headerAttributes: { "class": "k-header header-bgcolor" },
            field: "dealno",
            title: "Deal Number",
            width: 150
        }, {
            headerAttributes: { "class": "k-header header-bgcolor" },
            field: "dealamount",
            title: "Deal Amount",
            attributes: { style: "text-align: right" },
            template: "<div> #= kendo.toString(dealamount, 'n') #cr </div>"
        }, {
            headerAttributes: { "class": "k-header header-bgcolor" },
            field: "interestrate",
            title: "Interest Rate",
            attributes: { style: "text-align: right" },
            template: "<div> #= interestrate * 100 #% </div>"
        }// }, {
        //     field: "period",
        //     title: "Date",
        //     template: "#= moment(period).format('YYYY-MM-DD h:m:s') #",
        //     width: 150
        // }]
        ]
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
                pm.xfl2count(v.count);
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

pm.CreateChartTrendOption_ = function(param) {
    var selectedData;
    var catSelected;

    switch (param.groupby) {
    default:
    case "period":
        var months = pm.generateXAxis(param.type, param.start, param.end, 7);
        months.shift();

        selectedData = _.sortBy(param.trendPeriod, "idx");
        catSelected = {
            categories: months,
            axisCrossingValues: [0, 7]
        }
        catSelected.labels = {
            font: "10px sans-serif",
            // rotation: -45,   
            template:function(e){
                data = (e.value).split(" ");
                if(data[2] != null){
                    tl = data[0].split("/");
                    tgl1 = tl[0]+"/"+tl[1];
                    tg = data[2].split("/");
                    tgl2 = tg[0]+"/"+tg[1]
                    return tgl1+"\n"+tgl2
                }

                return e.value
                
            }
            // visible : true, 
        }
        break
    case "region":
        selectedData = param.trendRegion;
        catSelected = {
            field: "region",
            axisCrossingValues: [0, 7]
        }
    }

    return {
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
                right: 4
            }
        },
        dataSource: selectedData,
        series: [
            {
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
                name: "Target"
            }
        ],
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
                    return "Date: " + moment(dt.dataItem.period).format("YYYY-MM-DD") + "<br>Amount: " + kendo.toString(dt.value, "n2") + "cr";
                }else if ((dt.series.field == "interest")){
                    return "Date: " + moment(dt.dataItem.period).format("YYYY-MM-DD") + "<br>Interest: " + kendo.toString(dt.value, "n2") + "cr";
                }
                return;
            }
        }
    };
}

pm.openCompareTrend = function(param, callback) {
    var groupby = pm.ValueDataPeriod()

	var fun = function (param, callback) {
		ajaxPost("/dashboard/metricstrend", param, function(res) {
            var resp = res.Data;
            resp.groupby = groupby;

            // remove id 0
            resp.trendPeriod = _.without(resp.trendPeriod, _.find(resp.trendPeriod, function(e) {
                return e.idx == 0;
            }));

			callback(pm.CreateChartTrendOption_(resp))
		})
	}

	comp.Open(fun)
}

pm.CreateChartMoving = function(param, callback) {
    pm.CreateChartMovingData(param, function(data) {
        callback(pm.CreateChartMovingOptions_(data))
    })
}

pm.CreateChartMovingData = function(param, callback) {
    param.distributionchart = true
    ajaxPost("/dashboard/metricstrend", param, function (data) {
        callback(data.Data.distribution);
    })
}

// Separate decimal on number.
// Part 0 will be number ahead dot.
// Part 1 will be decimal point and below.
pm.SeparateDecimal = function (input, part) {
    var inputStr = "" + input
    var parts = inputStr.split(".", 2)

    if (part == 0) {
        return parts[0];
    }

    if (part == 1 && parts.length < 2)
        return "";
    
    return "." + parts[1]
}

pm.CreateChartMovingOptions_ = function (data) {
    console.log(data)
    var movingdata = new kendo.data.DataSource({
        data: data,
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
    });

    var title = "";
    switch (pm.ValueDataMenuDistribution()) {
    case "amount":
        title = "Deal Amount vs Interest Rate"
        break;
    case "count":
        title = "Deal Count vs Interest Rate"
        break;
    case "interest":
        title = "Deal Interest vs Interest Rate"
        break;
    }

    return {
        title: {
            text: title,
            font: "12px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
            padding: {
                top: 0
            }

        },
        dataSource: movingdata,
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
                field: pm.ValueDataMenuDistribution(),
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
                var data = "Deal Amount: " + kendo.toString(tlpData.amount, "n") +" cr<br />" + 
                    "Deal Count: " + tlpData.count + "<br />" +
                    "Deal Interest: " + kendo.toString(tlpData.interest, "n") + " cr<br />" +
                    tlpData.xfl;
                return data;
            }
        },
        valueAxis: [{
            name: pm.ValueDataMenuDistribution(),
            title: {
                text: "Deal Amount",
                font: "10px sans-serif",
                visible: true,
                color: "#4472C4",
            },
            labels: {
                font: "10px sans-serif"
            }
        }],
        categoryAxis: {
            title: {
                text: "Interest Rates (%)",
                font: "10px sans-serif",
                visible: false,
                color: "#4472C4",
            },
            labels: {
                font: "10px sans-serif",
                template: function (dt) {
                    return dt.value + "%";
                }
            }
        },
        legend: {
            visible: false,
            position: "bottom",
            labels:{
                font: "10px Arial,Helvetica,Sans-Serif"
            }
        }
    }
    /*return {
        title:{
            text: "Moving TAT",
            font:  "12px Arial,Helvetica,Sans-Serif",
            align: "left",
            color: "#58666e",
            padding: {
                top: 0
            }
        },
        plotArea: {
            margin: {
                left: 4,
                right: 4
            }
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
            background: "white",
            height: 250,
        },
        valueAxis: {
            labels: {
                // format: "${0}",
                font: "10px sans-serif",
                skip: 2,
                step: 2
            },
            title : {
                text : "Deal Amount",
                font: "10px sans-serif",
                visible : true,
                color : "#4472C4",
                margin: {
                    right: 1,
                }
            }
        },
        categoryAxis: {
            // categories: cat,
            field: "status",
            title : {
                text : "Interest Rates (%)",
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
    }*/
}

$(window).bind("resize", function() {
    $('#chartContainer').data("kendoChart").refresh()
    // $('#tatgoals').data("kendoRadialGauge").refresh()
    $('#distribution').data("kendoChart").refresh()
    $('#cater').data("kendoChart").refresh()
});

$(function() {
    pm.Target();
    pm.accordion();
    $(".sidebar-toggle").click(function(){
        var infilter = $("#infilter")
        if(infilter.is(":visible") == true){
            $('#chartContainer').data("kendoChart").refresh();
            // $('#tatgoals').data("kendoRadialGauge").refresh()
            $('#distribution').data("kendoChart").refresh();
            pm.loadChaterChart()
            $(".tabl").css("width", "98.5%");
        }else{
            $('#chartContainer').data("kendoChart").refresh()
            // $('#tatgoals').data("kendoRadialGauge").refresh()
            $('#distribution').data("kendoChart").refresh()
            pm.loadChaterChart()
            $(".tabl").css("width", "98.5%");
        }
    })
});
