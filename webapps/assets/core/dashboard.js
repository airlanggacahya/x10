var dash = {}

function fetchAllDS() {
	var defer = $.Deferred();

	$.ajax("/databrowser/getcombineddata", {
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

function createFilterUpstream(source, path) {
	return function(val) {
		if (isEmptyNull(source))
			return true

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

function createFilterUpstreamIR(source, path) {
	return function (val) {
		if (isEmptyNull(source))
			return true;
		
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
	dash.SaveFilter()

	applyFilterRegionDS()
	applyFilterBranchDS()
	applyFilterProductDS()
	applyFilterSchemeDS()
	applyFilterRMDS()
	applyFilterCADS()
	applyFilterCustDS()
	applyFilterDealNoDS()
	applyFilterClientTypeDS()
}

dash.MasterDS = ko.observableArray([])
dash.MasterDS.subscribe(function(values) {
	reapplyFilter();
})

// List of all filter field initialized by initDashVal
// Used for compile and parsing filter value
dash.FilterList = []

dash.initDashVal = function(name, path, options, def) {
	dash.FilterList.push(name)

	dash[name + "Val"] = ko.observable("")
	dash[name + "Val"].subscribe(function (values) {
		reapplyFilter(path)
	})
	dash[name + "DS"] = ko.observableArray(options)
	dash[name + "ShowMe"] = ko.observable(true)
	dash[name + "ShowMe"].subscribe(function (values) {
		dash.SaveFilter()
	})
	// if default not defined, put default as empty string
	dash[name + "Default"] = (typeof(def) == "undefined" ? "" : _.cloneDeep(def))
}

dash.initDashVal("TimePeriod", undefined, [
	{text: 'Last 10 days', value:'10day'},
	{text: 'Month', value:'1month'},
	{text: 'Financial Year', value:'1year'},
	{text: 'From - Till', value: 'fromtill'}
])
dash.initDashVal("TimePeriodCalendar", undefined, [], moment().toDate())
dash.initDashVal("TimePeriodCalendar2", undefined, [], moment().toDate())
dash.initDashVal("Region", REGION, [])
dash.initDashVal("Branch", BRANCH, [])
dash.initDashVal("Product", PRODUCT, [])
dash.initDashVal("Scheme", SCHEME, [])
dash.initDashVal("ClientType", CLIENTTYPE, [])
dash.initDashVal("ClientTurnover", undefined, [])
dash.initDashVal("Customer", CUSTOMER, [])
dash.initDashVal("DealNo", DEALNO, [])
dash.initDashVal("IR", IR, [
	{text: 'XFL-5', value:'<= 4.5'},
	{text: 'XFL-4', value:'> 4.5 < 6'},
	{text: 'XFL-3', value:'>= 6 < 7'},
	{text: 'XFL-2', value:'>= 7 <= 8.5'},
	{text: 'XFL-1', value:'> 8.5'},
])
dash.initDashVal("Status", undefined, [])
dash.initDashVal("CA", CA, [])
dash.initDashVal("RM", RM, [])
dash.initDashVal("LoanValueType", undefined, [
	{text: 'Requested Amount', value:'reqs'},
	{text: 'Proposed Amount', value:'prop'},
	{text: 'Recommended Amount', value:'recm'},
	{text: 'Sanctioned Amount', value:'sanc'},
])
dash.initDashVal("Range", undefined, [])

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
dash.TimePeriodCalendarScale.subscribe(function (val) {
	$("#timeperiodCalendar").data("kendoDatePicker").setOptions({
		depth: val,
		start: val
	})
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
		if (val.Value == "")
			return

		dash[name + "ShowMe"](val.ShowMe)
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

dash.SaveFilter_ = function() {
	if (!dash.InitComplete) {
		return
	}

	var param = {}
	// Id            string
	// Filters       []struct {
	// 	FilterName string
	// 	ShowMe     bool
	// 	Value      string
	// }

	param.Filters = dash.CompileFilter()
	
	// Notify subscribed chart first
	dash.FilterValue(param.Filters)

	ajaxPost("/dashboard/savefilter", param, function(res){
		if (res.IsError) {
			swal("Error", res.Message, "error")
		}
	})
}

// We delay 200ms before saving to prevent double request every propagated changes
dash.SaveTimerDelay = null
dash.SaveFilter = function() {
	if (dash.SaveTimerDelay) {
		clearTimeout(dash.SaveTimerDelay)
	}
	dash.SaveTimerDelay = setTimeout(function () {
		dash.SaveTimerDelay = null
		dash.SaveFilter_()
	}, 200);
}

dash.InitComplete = false

dash.LoadFilter = function() {
	ajaxPost("/dashboard/getfilter", {}, function(res) {
		if (res.IsError) {
			swal("Error", res.Message, "error")
			dash.InitComplete = true
			return
		}

		dash.ParseFilter(res.Data.Filters)
		dash.InitComplete = true
		dash.SaveFilter()
	})
}

dash.accordionSideBar = function(){
	$(".toggle").click(function(e){
		e.preventDefault();

		var $this = $(this);
		if($this.next().hasClass('show')){
			$this.next().removeClass('show');
			$this.next().slideUp(350);
			$this.find("h5>").removeClass("fa-chevron-down");
			$this.find("h5>").addClass("fa-chevron-up");
		}else{
			$this.next().removeClass('hide');
			$this.next().slideDown(350);
			$this.next().addClass("show");
			$this.find("h5>").addClass("fa-chevron-down");
			$this.find("h5>").removeClass("fa-chevron-up");
		}
	})

	$("#all").click(function(e){
		$(".toggle").next().removeClass('hide');
		$(".toggle").next().slideDown(350).addClass("show");
		$(".toggle").find("h5>").addClass("fa-chevron-down");
		$(".toggle").find("h5>").removeClass("fa-chevron-up");
		
		$(".form-group").show()
	})
}

dash.ResetFilter = function(){
	_.each(dash.FilterList, function (val) {		
		dash[val + "ShowMe"](true)
		dash[val + "Val"]("")
	})
}

$(function(){
	dash.accordionSideBar()
	fetchAllDS().done(function () {
		dash.LoadFilter()
	})
});