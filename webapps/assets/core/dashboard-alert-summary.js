
alertSum = {}
alertSum.trendMonth = ko.observable(moment().format('MMMM YYYY'));

alertSum.trendMonthTitle = ko.computed(function () {
    return moment(alertSum.trendMonth()).format('MMM `YY');
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
            totalAmount: obj.totalAmount,
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

alertSum.generateMonths = function (start, length) {
    var cur = moment(start)
    var ret = []
    _.times(length, function() {
        ret.push(cur.format('MMM'))
        cur.subtract(1, 'months')
    })

    return ret
}

alertSum.trendDataAjaxRefresh = function() {
    var len = 6
    $.ajax("/dashboard/summarytrends", {
        method: "post",
        data: JSON.stringify({month: alertSum.trendMonth(), length: len + 1}),
        contentType: "application/json",
        success: function(body) {
            if (body.Status == "") {

                //normalize data
                _.map(body.Data, function (val) {
                    val.data = alertSum.prepareTrendData(val.data, alertSum.trendMonth(), len + 1)
                    return val
                })
                //merge data
                var merge = alertSum.mergeTrendData(body.Data)
                alertSum.trendDataSeries(merge)
                //generate label
                var months = alertSum.generateMonths(alertSum.trendMonth(), len + 1)
                months.shift()
                alertSum.trendDataMonths(months)
                return
            }
        }
    })
}

$(function () {
    alertSum.trendDataAjaxRefresh();
})

alertSum.trendDataConfig = [
    {
        type: 'column',
        name: 'Amount Approved',
        field: 'amountApproved',
        axis: 'cr'
    },
    {
        type: 'column',
        name: 'Amount Rejected',
        field: 'amountRejected',
        axis: 'cr'
    },
    {
        type: 'line',
        name: 'Deal Count Approved',
        field: 'countApproved',
        axis: 'count'
    },
    {
        type: 'line',
        name: 'Deal Count Rejected',
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
        title: { text: 'cr' },
        min: 0,
        max: alertSum.seriesMax(['countApproved', 'countRejected']) + 5000
    },{
        name: 'count',
        title: { text: 'count' },
        min: 0,
        max: alertSum.seriesMax(['countApproved', 'countRejected']) + 5
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