
var CreateDashFilter = function() {
    var dash = {}

    function fetchAllDS() {
        var defer = $.Deferred();

        $.ajax("/databrowser/getcombineddatanew", {
            success: function(body) {
                dash.MasterDS(body.data);
                defer.resolve();
            }
        })

        return defer.promise();
    }

    function applyFilter(target, upstreamFilter, filterFun, mapFun) {
        var newVal = _.filter(dash.MasterDS(), filterFun)
        newVal = applyFilterUpstream(upstreamFilter, newVal)
        newVal = _.map(newVal, mapFun)
        newVal = _.uniqWith(newVal, _.isEqual)

        target(newVal)
        // console.log(target())
    }

    function isEmptyNull(v) {
        if (typeof(v) == "undefined")
            return true
        if (v === null)
            return true
        if (v.length === 0)
            return true
        return false
    }

    // create function for filtering
    // source - filter value
    // path - path to get the value from object
    // val - object that to be filtered
    // return true is match, false is not match
    function createFilterUpstream(source, path) {
        return function(val) {
            if (isEmptyNull(source))
                return true

            if (_.isArray(source)) {
                source = _.filter(source, function (it) { return it !== "" })

                if (source.length === 0)
                    return true

                return _.indexOf(source, _.get(val, path)) !== -1
            }

            return source == _.get(val, path)
        }
    }

    function IRlambda(source, val, path) {
        // Search Regex for <space optional><ops><space optional><number><space optional>
        // play with it on https://regex101.com/r/OmCh84/1/
        var opsreg = /^\s*((?:>|=|<)=?)\s*(-?[0-9]+(?:\.[0-9]*)?)\s*/
        var ret = true
        val = parseFloat(val)
        if (isNaN(val))
            return false

        while (source.length > 0) {
            var match = opsreg.exec(source)
            if (match == null)
                alert("IR Syntax Error")
            
            switch(match[1]) {
            case "=":
            case "==":
                ret = ret && (val == parseFloat(match[2]))
                break;
            case "<":
                ret = ret && (val < parseFloat(match[2]))
                break;
            case "<=":
                ret = ret && (val <= parseFloat(match[2]))
                break;
            case ">":
                ret = ret && (val > parseFloat(match[2]))
                break;
            case ">=":
                ret = ret && (val >= parseFloat(match[2]))
                break;
            default:
                alert("IR Operation Error")
            }

            source = source.substr(source.length)
        }

        return ret
    }

    // create function for filtering
    // source - filter value
    // path - path to get the value from object
    // val - object that to be filtered
    // return true is match, false is not match
    function createFilterUpstreamIR(source, path) {
        return function (val) {
            if (isEmptyNull(source))
                return true;

            if (_.isArray(source)) {
                source = _.filter(source, function (it) { return it !== "" })

                if (source.length === 0)
                    return true

                return _.reduce(source, function (result, it) {
                    result = result || IRlambda(it, _.get(val, path))
                }, false)
            }
            return IRlambda(source, _.get(val, path))
        }
    }

    function toBool(str) {
        if (str === "true")
            return true;
        
        if (str === "false")
            return false;

        return str
    }

    function applyFilterUpstream(level, vals) {
        if (level != REGION) {
            vals = _.filter(vals, createFilterUpstream(dash.RegionVal(), REGION))
        }

        if (level != BRANCH) {
            vals = _.filter(vals, createFilterUpstream(dash.BranchVal(), BRANCH))
        }

        if (level != PRODUCT) {
            vals = _.filter(vals, createFilterUpstream(dash.ProductVal(), PRODUCT))
        }

        if (level != SCHEME) {
            vals = _.filter(vals, createFilterUpstream(dash.SchemeVal(), SCHEME))
        }

        if (level != IR) {
            vals = _.filter(vals, createFilterUpstreamIR(dash.IRVal(), IR))
        }

        if (level != CA) {
            vals = _.filter(vals, createFilterUpstream(dash.CAVal(), CA))
        }

        if (level != RM) {
            vals = _.filter(vals, createFilterUpstream(dash.RMVal(), RM))
        }

        if (level != CLIENTTYPE) {
            vals = _.filter(vals, createFilterUpstream(toBool(dash.ClientTypeVal()), CLIENTTYPE))
        }

        if (level != CUSTOMER) {
            vals = _.filter(vals, createFilterUpstream(dash.CustomerVal(), CUSTOMER))
        }

        if (level != DEALNO) {
            vals = _.filter(vals, createFilterUpstream(dash.DealNoVal(), DEALNO))
        }

        return vals
    }

    const REGION = "_branch.region.name"
    const BRANCH = "_branch.name"
    const PRODUCT = "_accountdetails.accountsetupdetails.product"
    const SCHEME = "_accountdetails.accountsetupdetails.scheme"
    const CLIENTTYPE = "_accountdetails.loandetails.ifexistingcustomer"
    const CA = "_accountdetails.accountsetupdetails.creditanalyst"
    const RM = "_accountdetails.accountsetupdetails.rmname"
    const CUSTOMER = "customer_id"
    const DEALNO = "deal_no"
    const IR = "_creditscorecard.FinalScore"

    function applyFilterRegionDS() {
        applyFilter(dash.RegionDS, REGION, function(val) {
            var v = _.get(val, REGION)
            return !isEmptyNull(v)
        }, function (val) {
            return {
                text: _.get(val, REGION),
                value: _.get(val, REGION)
            }
        })
    }

    function applyFilterBranchDS() {
        applyFilter(dash.BranchDS, BRANCH, function(val) {
            var v = _.get(val, BRANCH)
            return !isEmptyNull(v)
        }, function (val) {
            return {
                text: _.get(val, BRANCH),
                value: _.get(val, BRANCH)
            }
        })
    }

    function applyFilterProductDS() {
        applyFilter(dash.ProductDS, PRODUCT, function(val) {
            var v = _.get(val, PRODUCT)
            return !isEmptyNull(v)
        }, function (val) {
            return {
                text: _.get(val, PRODUCT),
                value: _.get(val, PRODUCT)
            }
        })
    }

    function applyFilterSchemeDS() {
        applyFilter(dash.SchemeDS, SCHEME, function(val) {
            var v = _.get(val, SCHEME)
            return !isEmptyNull(v)
        }, function (val) {
            return {
                text: _.get(val, SCHEME),
                value: _.get(val, SCHEME)
            }
        })
    }

    function applyFilterRMDS() {
        applyFilter(dash.RMDS, RM, function(val) {
            var v = _.get(val, RM)
            return !isEmptyNull(v)
        }, function (val) {
            return {
                text: _.get(val, RM),
                value: _.get(val, RM)
            }
        })
    }

    function applyFilterCADS() {
        applyFilter(dash.CADS, CA, function(val) {
            var v = _.get(val, CA)
            return !isEmptyNull(v)
        }, function (val) {
            return {
                text: _.get(val, CA),
                value: _.get(val, CA)
            }
        })
    }

    function applyFilterDealNoDS() {
        applyFilter(dash.DealNoDS, DEALNO, function(val) {
            return true
        }, function (val) {
            return {
                text: val.deal_no,
                value: val.deal_no
            }
        })
    }

    function applyFilterCustDS() {
        applyFilter(dash.CustomerDS, CUSTOMER, function (val) {
            return true
        }, function (val) {
            return {
                text: val.customer_name,
                value: val.customer_id
            }
        })
    }

    function applyFilterClientTypeDS() {
        applyFilter(dash.ClientTypeDS, CLIENTTYPE, function (val) {
            return !isEmptyNull(val)
        }, function (val) {
            val = _.get(val, CLIENTTYPE)
            if (val) {
                return {
                    text: "Existing",
                    value: true
                }
            }
            return {
                text: "New",
                value: false
            }
        })
    }

    function reapplyFilter(without) {
        applyFilterRegionDS()
        applyFilterBranchDS()
        applyFilterProductDS()
        applyFilterSchemeDS()
        applyFilterRMDS()
        applyFilterCADS()
        applyFilterCustDS()
        applyFilterDealNoDS()
        applyFilterClientTypeDS()

        dash.SaveFilter()
    }

    dash.MasterDS = ko.observableArray([])
    dash.MasterDS.subscribe(function(values) {
        reapplyFilter();
    })

    // List of all filter field initialized by initDashVal
    // Used for compile and parsing filter value
    dash.FilterList = []

    dash.initVal = function(name, path, options, def, optional = false) {
        dash[name + "Val"].subscribe(function (values) {
            reapplyFilter(path)
        })
        dash[name + "DS"] = ko.observableArray(options)
        dash[name + "ShowMe"] = ko.observable(true)
        dash[name + "ShowMe"].subscribe(function (values) {
            dash.SaveFilter()
        })

        // if optional is true, then it's hidden from filter
        // set this up to false to show from filter
        // used to hide dependent filter or special filter for certain page
        dash[name + "Optional"] = ko.observable(optional);
        dash[name + "Visible"] = ko.computed(function () {
            return dash[name + "ShowMe"]() && !dash[name + "Optional"]();
        })
        // if default not defined, put default as empty string
        // default will be forced whenever value is empty string
        switch (dash[name + "Type"]) {
        case "single":
            dash[name + "Default"] = (typeof(def) == "undefined" ? "" : _.cloneDeep(def))
            break
        case "multi":
            dash[name + "Default"] = (typeof(def) == "undefined" ? [] : _.cloneDeep(def))
            break
        }

        dash.FilterList.push(name)
    }

    dash.initDashVal = function(name, path, options, def, optional = false) {
        dash[name + "Val"] = ko.observable("")
        dash[name + "Type"] = "single"

        dash.initVal(name, path, options, def, optional)
    }

    dash.initMultiDashVal = function(name, path, options, def, optional = false) {
        dash[name + "Val"] = ko.observableArray([])
        dash[name + "Type"] = "multi"

        dash.initVal(name, path, options, def, optional)
    }

    dash.initDashVal("TimePeriod", undefined, [
        {text: 'Last 10 days', value:'10day'},
        {text: 'Month', value:'1month'},
        {text: 'Financial Year', value:'1year'},
        {text: 'From - Till', value: 'fromtill'}
    ])
    dash.initDashVal("TimePeriodCalendar", undefined, [], moment().toDate())
    dash.initDashVal("TimePeriodCalendar2", undefined, [], moment().toDate())
    dash.initMultiDashVal("Region", REGION, [])
    dash.initMultiDashVal("Branch", BRANCH, [])
    dash.initMultiDashVal("Product", PRODUCT, [])
    dash.initMultiDashVal("Scheme", SCHEME, [])
    dash.initDashVal("ClientType", CLIENTTYPE, [])
    dash.initDashVal("ClientTurnover", undefined, [
        {text: '5cr - 10cr', value:'> 50000000 <= 100000000'},
        {text: '10cr - 25cr', value:'> 100000000 <= 250000000'},
        {text: '25cr - 50cr', value:'> 250000000 <= 500000000'},
        {text: '50cr - 100cr', value:'> 500000000 <= 1000000000'},
        {text: '> 100cr', value:'> 1000000000'},
    ])
    dash.initDashVal("Customer", CUSTOMER, [])
    dash.initDashVal("DealNo", DEALNO, [])
    dash.initDashVal("IR", IR, [
        {text: 'XFL-5', value:'<= 4.5'},
        {text: 'XFL-4', value:'> 4.5 < 6'},
        {text: 'XFL-3', value:'>= 6 < 7'},
        {text: 'XFL-2', value:'>= 7 <= 8.5'},
        {text: 'XFL-1', value:'> 8.5'},
    ])
    dash.initDashVal("DealStatus", undefined, [
        {text: 'Approved', value:'Approved'},
        {text: 'Rejected', value:'Rejected'},
    ], 'Approved', true)
    dash.initDashVal("CA", CA, [])
    dash.initDashVal("RM", RM, [])
    dash.initDashVal("LoanValueType", undefined, [
        {text: 'Requested Amount', value:'reqs'},
        {text: 'Proposed Amount', value:'prop'},
        {text: 'Recommended Amount', value:'recm'},
        {text: 'Sanctioned Amount', value:'sanc'},
    ])
    dash.initDashVal("Range", undefined, [])
    dash.initDashVal("TopFilter", undefined, [
        {text: 'Turnover', value:'turnover'},
        {text: 'Proposed Amount', value:'proposed'},
        {text: 'Sanctioned Amount', value:'sanction'},
    ])
    dash.initDashVal("TopNumber", undefined, [
        "10",
        "20",
        "50"
    ], "10", true)

    // To show optional filter options
    dash.showOptionalFilter = function (name, show = false) {
        dash[name + "Optional"](show)
    }

    // Update to now
    dash.TimePeriodVal.subscribe(function (val) {
        if (val == "10day") {
            dash.TimePeriodCalendarVal(moment().toDate())
            dash.TimePeriodCalendar2Val(moment().toDate())
        }

        if (val == ""){
            var first = moment(moment().add(1,"month").year()+"-"+moment().add(1,"month").format("MMM")+"-01").add(-1,"day").toDate();
            dash.TimePeriodCalendarVal(first);
            dash.TimePeriodVal("1month");
        }
    })
    dash.TimePeriodCalendarVal.subscribe(function (val) {
        var a = cleanMoment(dash.TimePeriodCalendarVal());
        var b = cleanMoment(dash.TimePeriodCalendar2Val());

        if (a.isAfter(b)) {
            dash.TimePeriodCalendar2Val(a);
        }
    })

    // TimePeriodCalendar
    dash.TimePeriodCalendarValFormat = ko.computed(function () {
        switch (dash.TimePeriodVal()) {
        case "1month":
            return moment(dash.TimePeriodCalendarVal()).format("MMMM YYYY");
        case "1year":
            return moment(dash.TimePeriodCalendarVal()).format("YYYY") + " - " + moment(dash.TimePeriodCalendarVal()).add(1, "year").format("YYYY");
        case "fromtill":
        case "10day":
        default:
            return moment(dash.TimePeriodCalendarVal()).format("D MMM YYYY");
        }
    })
    dash.TimePeriodCalendar2ValFormat = ko.computed(function () {
        return moment(dash.TimePeriodCalendar2Val()).format("D MMM YYYY");
    })

    dash.TimePeriodCalendarScale = ko.computed(function () {
        switch (dash.TimePeriodVal()) {
        case "1month":
            return "year";
        case "1year":
            return "decade";
        case "fromtill":
        case "10day":
        default:
            return "month";
        }
    })

    dash.CompileFilter = function () {
        var param = []
        _.each(dash.FilterList, function (val) {		
            param.push({
                "FilterName": val,
                "ShowMe": dash[val + "ShowMe"](),
                "Value": dash[val + "Val"]()
            })
        })

        return param
    }

    dash.ParseFilter = function (data) {
        // fill default
        _.each(dash.FilterList, function (name) {
            dash[name + "Val"](dash[name + "Default"])
        })

        // put data from db
        _.each(data, function (val) {
            var name = val.FilterName
            if (_.indexOf(dash.FilterList, name) == -1)
                return

            dash[name + "ShowMe"](val.ShowMe)

            // default value is set
            if (val.Value === "" || val.Value === null)
                return
            
            // for array, we filter for empty string, and then exit on empty array
            if (_.isArray(val.Value)) {
                val.Value = _.filter(val.Value, function (val) { return val !== "" })

                if (val.Value.length === 0)
                    return
            }

            switch (dash[name + "Type"]) {
            case "multi":
                // when dash is multi select but the data is not array
                // make it so
                if (!_.isArray(val.Value)) {
                    val.Value = [val.Value]
                }
                break;
            case "single":
                // dash is single select and data is array
                if (_.isArray(val.Value)) {
                    val.Value = val.Value[0]
                }
                break;
            }

            dash[name + "Val"](val.Value)
        })
    }

    // Child module please subscribe here for filter changes notification
    // Will be triggered by SaveFilter_
    dash.FilterValue = ko.observable()
    dash.FilterValue.GetVal = function (field) {
        var ret = _.find(dash.FilterValue(), function (val) {
            return (val.FilterName === field)
        })

        if (typeof(ret) === "undefined")
            return ""
        
        return _.cloneDeep(ret.Value)
    }

    dash.SaveCallback_ = function(param) {}
    dash.SetSaveCallback = function (callback) {
        dash.SaveCallback_ = callback;
    }

    dash.DelayNotifyTimer = null
    dash.DelayNotify = function (param) {
        if (dash.DelayNotifyTimer) {
            clearTimeout(dash.DelayNotifyTimer)
        }
        dash.DelayNotifyTimer = setTimeout(function () {
            dash.DelayNotifyTimer = null
            dash.FilterValue(param.Filters)
        }, 50);
    }

    dash.NotifyFilter = function() {
        var param = {}
        // Id            string
        // Filters       []struct {
        // 	FilterName string
        // 	ShowMe     bool
        // 	Value      string
        // }

        param.Filters = dash.CompileFilter()
        
        // Notify subscribed chart first
        dash.DelayNotify(param)

        return param
    }

    dash.SaveFilter_ = function() {
        var param = dash.NotifyFilter()

        if (!dash.InitComplete())
             return

        dash.SaveCallback_(param)
    }

    // We delay 50ms before saving to prevent double request every propagated changes
    dash.SaveTimerDelay = null
    dash.SaveFilter = function() {
        if (dash.waitLoadFilter !== null)
            return

        if (dash.SaveTimerDelay) {
            clearTimeout(dash.SaveTimerDelay)
        }
        dash.SaveTimerDelay = setTimeout(function () {
            dash.SaveTimerDelay = null
            dash.SaveFilter_()
        }, 50);
    }


    dash.waitLoadFilter = []
    dash.InitComplete = ko.observable(false)
    dash.InitComplete.subscribe(function (val) {
        if (!val)
            return

        dash.ParseFilter(dash.waitLoadFilter)
        dash.waitLoadFilter = null
    })

    dash.LoadFilter = function(res) {
        if (!dash.InitComplete())
            dash.waitLoadFilter = res

        dash.ParseFilter(res)
        dash.NotifyFilter()

        dash.SaveFilter()
    }

    dash.ResetShowAll = function() {
        _.each(dash.FilterList, function (val) {		
            dash[val + "ShowMe"](true)
        })
    }

    dash.ResetFilter = function() {
        _.each(dash.FilterList, function (val) {
            dash[val + "ShowMe"](true)
            dash[val + "Val"](dash[val + "Default"])
        })
    }

    dash.moveTimePeriod = function(start, end, type, movement) {
        var start = cleanMoment(start)
        var end = cleanMoment(end)
        var type = dash.FilterValue.GetVal("TimePeriod")

        switch (type) {
        case "":
        case "1month":
            start.date(1);
            end.date(1);
            start = start.add(movement, "month")
            end = end.add(movement, "month")
            break;
        case "10day":
            start = start.add(movement * 10, "day")
            end = end.add(movement * 10, "day")
            break;
        case "1year":
            start.date(1);
            end.date(1);
            start = start.add(movement, "year")
            end = end.add(movement, "year")
            break;
        case "fromtill":
            var dura = end.diff(start) * movement
            start = start.add(dura)
            end = end.add(dura)
            break;
        }

        return {
            start: start,
            end: end,
            type: type
        }
    }

    dash.trendDataLengthOptions = ko.computed(function () {
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

    dash.generateXAxis = function (type, start, end, length) {
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

    $(function(){
        // dash.accordionSideBar()
        fetchAllDS().done(function () {
            // timeout here, because seems kendoknockout is still building up when we load the filter value
            setTimeout(function () {
                dash.InitComplete(true);
            }, 100);
        })
    });

    return dash;
}