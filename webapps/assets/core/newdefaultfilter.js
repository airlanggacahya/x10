
var filters = {}

function fetchAllDS() {
	$.ajax("/databrowser/getcombineddata", {
		success: function(body) {
			filters.MasterDS(body.data);
		}
	})
}
fetchAllDS()

function applyFilter(target, upstreamFilter, filterFun, mapFun) {
	var newVal = _.filter(filters.MasterDS(), filterFun)
	newVal = applyFilterUpstream(upstreamFilter, newVal)
	newVal = _.map(newVal, mapFun)
	newVal = _.uniqWith(newVal, _.isEqual)

	target(newVal)
	// console.log(target())
}

function createFilterUpstream(source, path) {
	return function(val) {
		if (source.length == 0)
			return true
		return _.find(source, function (haystack) {
			return haystack == _.get(val, path)
		})
	}
}

function applyFilterUpstream(level, vals) {
	if (level != CITY) {
		// 	return vals
		// Filter City
		vals = _.filter(vals, createFilterUpstream(filters.CityVal(), CITY))
	}

	if (level != PRODUCT) {
		// 	return vals	
		// Filter Product
		vals = _.filter(vals, createFilterUpstream(filters.ProductVal(), PRODUCT))
	}

	if (level != BRHEAD) {
		// 	return vals
		// Filter Product
		vals = _.filter(vals, createFilterUpstream(filters.BRHeadVal(), BRHEAD))
	}

	if (level != SCHEME) {
		// 	return vals
		// Filter Scheme
		vals = _.filter(vals, createFilterUpstream(filters.SchemeVal(), SCHEME))
	}

	if (level != RM) {
		// 	return vals
		// Filter RM
		vals = _.filter(vals, createFilterUpstream(filters.RMVal(), RM))
	}

	if (level != CA) {
		// 	return vals
		// Filter CA
		vals = _.filter(vals, createFilterUpstream(filters.CAVal(), CA))
	}

	if (level != CUSTOMER) {
		// 	return vals
		// Filter Customer
		vals = _.filter(vals, createFilterUpstream(filters.CustomerVal(), CUSTOMER))
	}

	return vals
}

const CITY = "_profile.applicantdetail.registeredaddress.CityRegistered"
const PRODUCT = "_accountdetails.accountsetupdetails.product"
const BRHEAD = "_accountdetails.accountsetupdetails.brhead"
const SCHEME = "_accountdetails.accountsetupdetails.scheme"
const RM = "_accountdetails.accountsetupdetails.rmname"
const CA = "_accountdetails.accountsetupdetails.creditanalyst"
const CUSTOMER = "customer_id"
const DEALNO = "deal_no"

function applyFilterCityDS() {
	applyFilter(filters.CityDS, CITY, function(val) {
		var v = _.get(val, CITY)
		if (typeof(v) == "undefined")
			return false
		if (v == null)
			return false
		if (v.length == 0)
			return false
		return true
	}, function (val) {
		return {
			text: _.get(val, CITY),
			value: _.get(val, CITY)
		}
	})
}

function applyFilterProductDS() {
	applyFilter(filters.ProductDS, PRODUCT,function(val) {
		var v = _.get(val, PRODUCT)
		if (typeof(v) == "undefined")
			return false
		if (v == null)
			return false
		if (v.length == 0)
			return false
		return true
	}, function (val) {
		return {
			text: _.get(val, PRODUCT),
			value: _.get(val, PRODUCT)
		}
	})
}

function applyFilterBRHeadDS() {
	applyFilter(filters.BRHeadDS, BRHEAD,function(val) {
		var v = _.get(val, BRHEAD)
		if (typeof(v) == "undefined")
			return false
		if (v == null)
			return false
		if (v.length == 0)
			return false
		return true
	}, function (val) {
		return {
			text: _.get(val, BRHEAD),
			value: _.get(val, BRHEAD)
		}
	})
}

function applyFilterSchemeDS() {
	applyFilter(filters.SchemeDS, SCHEME,function(val) {
		var v = _.get(val, SCHEME)
		if (typeof(v) == "undefined")
			return false
		if (v == null)
			return false
		if (v.length == 0)
			return false
		return true
	}, function (val) {
		return {
			text: _.get(val, SCHEME),
			value: _.get(val, SCHEME)
		}
	})
}

function applyFilterRMDS() {
	applyFilter(filters.RMDS, RM,function(val) {
		var v = _.get(val, RM)
		if (typeof(v) == "undefined")
			return false
		if (v == null)
			return false
		if (v.length == 0)
			return false
		return true
	}, function (val) {
		return {
			text: _.get(val, RM),
			value: _.get(val, RM)
		}
	})
}

function applyFilterCADS() {
	applyFilter(filters.CADS, CA,function(val) {
		var v = _.get(val, CA)
		if (typeof(v) == "undefined")
			return false
		if (v == null)
			return false
		if (v.length == 0)
			return false
		return true
	}, function (val) {
		return {
			text: _.get(val, CA),
			value: _.get(val, CA)
		}
	})
}

function applyFilterCustDS() {
	applyFilter(filters.CustomerDS, CUSTOMER,function (val) {
		return true
	}, function (val) {
		return {
			text: val.customer_name,
			value: val.customer_id
		}
	})
}

function applyFilterDealNoDS() {
	applyFilter(filters.DealNoDS, DEALNO,function(val) {
		return true
	}, function (val) {
		return {
			text: val.deal_no,
			value: val.deal_no
		}
	})
}

function applyDisableFilter() {
	/*
		TEMPORARY DISABLE function
		ON ROHITA REQUEST

		WILL BE DELETED LATER - 31/01/2017
	*/
	/*
	var input = [
		filters.ProductVal(),
		filters.BRHeadVal(),
		filters.SchemeVal(),
		filters.RMVal(),
		filters.CAVal(),
		filters.CustomerVal(),
		filters.DealNoVal()
	]
	var target = [
		"multiCity",
		"multiProduct",
		"multiBRHead",
		"multiScheme",
		"multiRM",
		"multiCA",
		"multiCustomer"
	]
	var position = []

	for(var i = 0; i < target.length; i++) {
		position.push(true)
	}

	for(var i = 0; i < input.length; i++) {
		if (input[i].length == 0)
			continue
		for(var j = 0; j < target.length && j <= i; j++) {
			position[j] = false
		}
	}

	for(var i = 0; i < position.length; i++) {
		$("#" + target[i]).data("kendoMultiSelect").enable(position[i])
	}

	// special case for customer and DealNo
	// we clear loanRange and IrRange
	// and reset value on them
	var v = filters.CustomerVal().length || filters.DealNoVal().length
	if (v) {
		filters.ddRLARangesVal("")
		$("#ddRLARanges").data("kendoDropDownList").value("");

		filters.inputRLARangeVal("")

		filters.ddIRRangesVal("")
		$("#ddIR").data("kendoDropDownList").value("");

		filters.inputIRRangeVal("")
	}

	$("#ddRLARanges").data("kendoDropDownList").enable(!v)
	$("#ddIR").data("kendoDropDownList").enable(!v)
	$("#inputRLARange").data("kendoNumericTextBox").enable(!v)
	*/
}

function reapplyFilter(without) {
	// if (without != CITY)
	applyFilterCityDS()
	
	// if (without != PRODUCT)
	applyFilterProductDS()
	
	// if (without != BRHEAD)
	applyFilterBRHeadDS()
	
	// if (without != SCHEME)
	applyFilterSchemeDS()
	
	// if (without != RM)
	applyFilterRMDS()
	
	// if (without != CA)
	applyFilterCADS()
	
	// if (without != CUSTOMER)
	applyFilterCustDS()

	// if (without != DEALNO)
	applyFilterDealNoDS()

	applyDisableFilter()
}

filters.MasterDS = ko.observableArray()
filters.MasterDS.subscribe(function(values) {
	reapplyFilter();
})

filters.CustomerVal = ko.observableArray()
filters.CustomerVal.subscribe(function(values) {
	reapplyFilter(CUSTOMER)
})
filters.CustomerDS = ko.observableArray()

filters.DealNoVal = ko.observableArray()
filters.DealNoVal.subscribe(function(values) {
	reapplyFilter(DEALNO)
})
filters.DealNoDS = ko.observableArray()

filters.CityVal = ko.observableArray()
filters.CityVal.subscribe(function(values) {
	reapplyFilter(CITY)
})
filters.CityDS = ko.observableArray()

filters.ProductVal = ko.observableArray()
filters.ProductVal.subscribe(function(values) {
	reapplyFilter(PRODUCT)
})
filters.ProductDS = ko.observableArray()

filters.BRHeadVal = ko.observableArray()
filters.BRHeadVal.subscribe(function(values) {
	reapplyFilter(BRHEAD)
})
filters.BRHeadDS = ko.observableArray()

filters.SchemeVal = ko.observableArray()
filters.SchemeVal.subscribe(function(values) {
	reapplyFilter(SCHEME)
})
filters.SchemeDS = ko.observableArray()

filters.RMVal = ko.observableArray()
filters.RMVal.subscribe(function(values) {
	reapplyFilter(RM)
})
filters.RMDS = ko.observableArray()

filters.ddRLARangesVal = ko.observable("")
filters.ddRLARangesVal.subscribe(function(values) {
	reapplyFilter()
})

filters.inputRLARangeVal = ko.observable()
filters.inputRLARangeVal.subscribe(function(values) {
	reapplyFilter()
})

filters.CAVal = ko.observableArray()
filters.CAVal.subscribe(function(values) {
	reapplyFilter(CA)
})
filters.CADS = ko.observableArray()

filters.ddIRRangesVal = ko.observable("")
filters.ddIRRangesVal.subscribe(function(values) {
	reapplyFilter()
})

filters.inputIRRangeVal = ko.observable()
filters.inputIRRangeVal.subscribe(function(values) {
	reapplyFilter()
})

filters.inputRLARangeValSpinners = ko.observable(false);
filter.isHide = ko.observable(true);
filters.dataRating = ko.observable('');

filters.loginDateVal = ko.observable();

var refreshFilter = function() {
	// rangeIR();
	databrowser.GetDataGrid();
}

var resetFilter = function(){
	// _.each($(".k-button > .k-select > .k-icon.k-i-close"), function(e) {
	// 	$(e).trigger("click")
	// })
	filters.DealNoVal.removeAll()
	filters.CustomerVal.removeAll()
	filters.CAVal.removeAll()
	filters.RMVal.removeAll()
	filters.SchemeVal.removeAll()
	filters.BRHeadVal.removeAll()
	filters.ProductVal.removeAll()
	filters.CityVal.removeAll()

	filters.ddRLARangesVal("")
	$("#ddRLARanges").data("kendoDropDownList").value("");

	filters.inputRLARangeVal("")

	filters.ddIRRangesVal("")
	$("#ddIR").data("kendoDropDownList").value("");

	filters.inputIRRangeVal("")
	filters.dataRating("")

	filters.loginDateVal("")
}

var showMoreFilter = function(){
	filter.isHide(false)
	// $("#panel-filter").show()
	$(".filterhide").show()

}

var hideMoreFilter = function(){
	filter.isHide(true)
	// $("#panel-filter").hide()
	$(".filterhide").hide()
}

var rangeIR = function(arrval){
	var str = '';
	if(arrval == "<="){
		str = "lte";
	}else if(arrval == "<"){
		str = "lt";
	}else if(arrval == "="){
		str = "eq";
	}else if(arrval == ">"){
		str = "gt";
	}else if (arrval == ">="){
		str = "gte"
	}

	return str
}

var dddata = [
	// { text: "Choose Ranges", value: "" },
    { text: "Greater Than", value: "gt" },
    { text: "Greater Than or Equal", value: "gte" },
    { text: "Equal", value: "eq" },
    { text: "Lower Than or Equal", value: "lte" },
    { text: "Lower Than", value: "lt" }
]

var irdata = [
	// {text: "Select", value: ''},
	{text: 'XFL-5', value:'<= 4.5'},
	{text: 'XFL-4', value:'> 4.5 < 6'},
	{text: 'XFL-3', value:'>= 6 < 7'},
	{text: 'XFL-2', value:'>= 7 <= 8.5'},
	{text: 'XFL-1', value:'> 8.5'},
]
