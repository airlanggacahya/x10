
alertSum = {}
alertSum.trendMonth = ko.observable(moment().format('MMMM YYYY'));
alertSum.trendMonthTitle = ko.computed(function () {
    return moment(alertSum.trendMonth()).format('MMM `YY')
})

alertSum.trendDataSeries = ko.observableArray([
    {
        amountApproved: 200,
        amountRejected: 300,
        countApproved: 4,
        countRejected: 2
    },
    {
        amountApproved: 175,
        amountRejected: 400,
        countApproved: 1,
        countRejected: 3
    },
    {
        amountApproved: 400,
        amountRejected: 300,
        countApproved: 4,
        countRejected: 1
    }
]);
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
alertSum.trendDataMonths = ["Jan", "Feb", "Mar"];

alertSum.summary2fa = function (values) {
    if (values > 0)
        return "fa fa-angle-double-down fa-font-red";
    if (values < 0)
        return "fa fa-angle-double-up fa-font-green";
    return "fa fa-minus fa-font-white";
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

alertSum.summaryApp = ko.computed(function () {
    var series = alertSum.trendDataSeries()
    return series[0].amountApproved;
})
alertSum.summaryAppChange = ko.computed(function () {
    var series = alertSum.trendDataSeries()
    return series[0].amountApproved - series[1].amountApproved;
})
alertSum.summaryAppFa = ko.computed(function () {
    return alertSum.summary2fa(alertSum.summaryAppChange());
})
alertSum.summaryRej = ko.computed(function () {
    var series = alertSum.trendDataSeries()
    return series[0].amountRejected;
})
alertSum.summaryRejChange = ko.computed(function () {
    var series = alertSum.trendDataSeries()
    return series[0].amountRejected - series[1].amountRejected;
})
alertSum.summaryRejFa = ko.computed(function () {
    return alertSum.summary2fa(alertSum.summaryRejChange());
})
