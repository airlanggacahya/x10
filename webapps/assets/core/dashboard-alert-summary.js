
alertSum = {}

alertSum.height = function(){
    var myHeight = ($(window).height() - 90)/3
    return myHeight;
}

alertSum.titleText = ko.computed(function () {
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
})

alertSum.trendMonth = ko.observable(moment().format('MMMM YYYY'));
alertSum.trendMonth.subscribe(function () {
    alertSum.trendDataAjaxRefresh()
})

// Hook to filter value changes
dash.FilterValue.subscribe(function (val) {
    alertSum.trendDataAjaxRefresh()
})

alertSum.trendDataLengthOptions = ko.computed(function () {
    var unit = dash.FilterValue.GetVal("TimePeriod")
    switch (unit) {
    case "":
    case "1month":
        unit = "months"
        break;
    case "1year":
        unit = "years"
        break;
    default:
        unit = "period"
    }
    var ret =  _.map([3, 4, 6, 12], function (val) {
        return {
            text: "" + val + " " + unit,
            value: val
        }
    });

    return ret;
});

alertSum.trendDataLength = ko.observable(6);
alertSum.trendDataLength.subscribe(function () {
    alertSum.trendDataAjaxRefresh()
})
alertSum.trendDataLengthTitle = ko.computed(function () {
    return _.find(alertSum.trendDataLengthOptions(), function (val) {
        return val.value == alertSum.trendDataLength()
    }).text;
})

alertSum.trendDataSeries = ko.observableArray([]);
alertSum.trendDataCurrent = ko.observable();

alertSum.prepareTrendData = function (data, start, length) {
    var cur = moment(start)
    cur.add(1, 'months')

    var ret = []
    _.times(length, function() {
        cur.subtract(1, 'months')
        var obj = _.find(data, function(val) {
            return val.year == cur.year() && val.month == (cur.month() + 1)
        })

        if (typeof(obj) == "undefined") {
            ret.push({
                month: cur.month(),
                year: cur.year(),
                totalAmount: 0,
                totalCount: 0
            })

            return
        }

        ret.push({
            month: cur.month(),
            year: cur.year(),
            // convert to CR
            totalAmount: obj.totalAmount / 10000000,
            totalCount: obj.totalCount
        })
    })
    return ret
}

alertSum.mergeTrendData = function(data) {
    var ret = []
    _.each(data, function (wrap) {
        var name = wrap._id.status;
        _.each(wrap.data, function (val, key) {
            if (ret.length < (key + 1)) {
                ret.push({});
            }

            var el = ret[key]
            el["amount" + name] = val.totalAmount
            el["count" + name] = val.totalCount
        })
    })

    alertSum.trendDataCurrent(ret.shift())
    return ret
}

alertSum.generateXAxis = function (type, start, end, length) {
    var cur = moment(start)
    var till = moment(end)
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
    case "10day":
        _.times(length, function(idx) {
            ret.push("" + idx);
        })
        break;
    default:
        _.times(length, function(idx) {
            ret.push("");
        })
        break;
    }


    return ret
}

alertSum.trendDataAjaxRefresh = function() {
    var len = alertSum.trendDataLength();
    var start = dash.FilterValue.GetVal("TimePeriodCalendar")
    var end = dash.FilterValue.GetVal("TimePeriodCalendar2")
    var type = dash.FilterValue.GetVal("TimePeriod")

    $.ajax("/dashboard/summarytrends", {
        method: "post",
        data: JSON.stringify({
            type: type,
            start: start,
            end: end,
            length: len + 1,
            filter: dash.FilterValue()
        }),
        contentType: "application/json",
        success: function(body) {
            if (body.Status == "") {

                //normalize data
                _.map(body.Data, function (val) {
                    val.data = alertSum.prepareTrendData(val.data, start, len + 1)
                })
                //merge data
                var merge = alertSum.mergeTrendData(body.Data)
                alertSum.trendDataSeries(merge)
                //generate label
                var months = alertSum.generateXAxis(type, start, end, len + 1)
                months.shift()
                alertSum.trendDataMonths(months)
                return
            }
        }
    })
}

alertSum.trendDataConfig = [
    {
        type: 'column',
        name: 'Amount Approved',
        field: 'amountApproved',
        axis: 'cr',
    },
    {
        type: 'column',
        name: 'Amount Rejected',
        field: 'amountRejected',
        axis: 'cr'
    },
    {
        type: 'line',
        name: 'Deal Approved',
        field: 'countApproved',
        axis: 'count'
    },
    {
        type: 'line',
        name: 'Deal Rejected',
        field: 'countRejected',
        axis: 'count'
    }
]

alertSum.trendDataMonths = ko.observableArray([]);

alertSum.summary2fa = function (values) {
    if (values == 0)
        return "fa fa-minus fa-font-white";
    if (values < 0)
        return "fa fa-angle-double-down fa-font-red";
    if (values > 0)
        return "fa fa-angle-double-up fa-font-green";
}

alertSum.seriesMax = function (sections) {
    var n = _.reduce(sections, function (max, val) {
        return Math.max(
            max,
            _.get(_.maxBy(alertSum.trendDataSeries(), val), val, 0)
        )
    }, 0)

    if (isNaN(n))
        return 0
    
    return n
}

alertSum.trendDataAxes = ko.computed(function () {
    return [{
        name: 'cr',
        title: { 
            text: 'Deal Amount',
            font: '11px sans-serif',
            color: '#4472C4' 
        },
        min: 0,
        max: Math.ceil(alertSum.seriesMax(['countApproved', 'countRejected']) + 2),
        majorUnit: 1,
        
    },{
        name: 'count',
        title: { 
            text: 'Deal Account',
            font: '11px sans-serif',
            color: '#4472C4'
        },
        min: 0,
        max: alertSum.seriesMax(['countApproved', 'countRejected']) + 2,
        majorUnit: 1,
    }]
})

alertSum.seriesChange = function(section) {
    return ko.computed(function() {
        var series = alertSum.trendDataSeries()
        if (series.length < 1)
            return 0;
        return _.get(alertSum.trendDataCurrent(), section, 0) - _.get(series[0], section, 0);
    })
}
alertSum.seriesChangeFa = function(section) {
    return ko.computed(function() {
        return alertSum.summary2fa(alertSum.seriesChange(section)());
    })
}

alertSum.currentData = function(section, div = 0, rounding = 0) {
    return ko.computed(function () {
        var num = _.get(alertSum.trendDataCurrent(), section, 0)

        if (div > 0) {
            num = num / Math.pow(10, div)
        }

        return kendo.toString(num, "n" + rounding);
    })
}