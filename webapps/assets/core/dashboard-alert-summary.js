
alertSum = {}
alertSum.trendMonth = ko.observable(moment().format('MMMM YYYY'));

alertSum.trendMonthTitle = ko.computed(function () {
    return moment(alertSum.trendMonth()).format('MMM `YY');
})

alertSum.trendDataSeries = ko.observableArray([]);
alertSum.trendDataCurrent = ko.observable();

alertSum.prepareTrendData = function (data, start, length) {
    var cur = moment(start)
    cur.subtract(length, 'months')

    var ret = []
    _.times(length, function() {
        cur.add(1, 'months')
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

    alertSum.trendDataCurrent(ret.pop())
    return _.reverse(ret)
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

alertSum.summaryAmountMax = ko.computed(function () {
    var maxapp = _.maxBy(alertSum.trendDataSeries(), 'amountApproved');
    var maxrej = _.maxBy(alertSum.trendDataSeries(), 'amountRejected');

    return Math.max(maxapp, maxrej);
})
alertSum.summaryCountMax = ko.computed(function () {
    var maxapp = _.maxBy(alertSum.trendDataSeries(), 'countApproved');
    var maxrej = _.maxBy(alertSum.trendDataSeries(), 'countRejected');

    return Math.max(maxapp, maxrej);
})

alertSum.summaryAppChange = ko.computed(function () {
    var series = alertSum.trendDataSeries()
    if (series.length < 2)
        return 0;
    return _.get(alertSum.trendDataCurrent(), "amountApproved", 0) - _.get(series[0], "amountApproved", 0);
})
alertSum.summaryAppFa = ko.computed(function () {
    return alertSum.summary2fa(alertSum.summaryAppChange());
})

alertSum.summaryRejChange = ko.computed(function () {
    var series = alertSum.trendDataSeries()
    if (series.length < 2)
        return 0;
    return _.get(alertSum.trendDataCurrent(), "amountRejected", 0) - _.get(series[0], "amountRejected", 0);
})
alertSum.summaryRejFa = ko.computed(function () {
    return alertSum.summary2fa(alertSum.summaryRejChange());
})

alertSum.summaryCountAppChange = ko.computed(function () {
    var series = alertSum.trendDataSeries()
    if (series.length < 2)
        return 0;
    return _.get(alertSum.trendDataCurrent(), "countApproved", 0) - _.get(series[0], "countApproved", 0);
})
alertSum.summaryCountAppFa = ko.computed(function () {
    return alertSum.summary2fa(alertSum.summaryCountAppChange());
})

alertSum.summaryCountRejChange = ko.computed(function () {
    var series = alertSum.trendDataSeries()
    if (series.length < 2)
        return 0;
    return _.get(alertSum.trendDataCurrent(), "countRejected", 0) - _.get(series[0], "countRejected", 0);
})
alertSum.summaryCountRejFa = ko.computed(function () {
    return alertSum.summary2fa(alertSum.summaryCountRejChange());
})