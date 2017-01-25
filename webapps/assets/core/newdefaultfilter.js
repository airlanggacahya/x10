
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
	if (level == CITY)
		return vals
	// Filter City
	vals = _.filter(vals, createFilterUpstream(filters.CityVal(), CITY))

	if (level == PRODUCT)
		return vals	
	// Filter Product
	vals = _.filter(vals, createFilterUpstream(filters.ProductVal(), PRODUCT))

	if (level == BRHEAD)
		return vals
	// Filter Product
	vals = _.filter(vals, createFilterUpstream(filters.BRHeadVal(), BRHEAD))

	if (level == SCHEME)
		return vals
	// Filter Scheme
	vals = _.filter(vals, createFilterUpstream(filters.SchemeVal(), SCHEME))

	if (level == RM)
		return vals
	// Filter RM
	vals = _.filter(vals, createFilterUpstream(filters.RMVal(), RM))

	if (level == CA)
		return vals
	// Filter CA
	vals = _.filter(vals, createFilterUpstream(filters.CAVal(), CA))

	if (level == CUSTOMER)
		return vals
	// Filter Customer
	vals = _.filter(vals, createFilterUpstream(filters.CustomerVal(), CUSTOMER))

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
	applyFilter(filters.RMDS, "",function(val) {
		var v = _.get(val, RM)
		if (typeof(v) == "undefined")
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
	applyFilter(filters.CADS, "",function(val) {
		var v = _.get(val, CA)
		if (typeof(v) == "undefined")
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

function reapplyFilter() {
	applyFilterCityDS()
	applyFilterProductDS()
	applyFilterBRHeadDS()
	applyFilterSchemeDS()
	applyFilterRMDS()
	applyFilterCADS()
	applyFilterCustDS()
	applyFilterDealNoDS()
}

filters.MasterDS = ko.observableArray()
filters.MasterDS.subscribe(function(values) {
	reapplyFilter();
})

filters.CustomerVal = ko.observableArray()
filters.CustomerVal.subscribe(function(values) {
	reapplyFilter()
 	updateDSWithout("Cust")
})
filters.CustomerDS = ko.observableArray()

filters.DealNoVal = ko.observableArray()
filters.DealNoVal.subscribe(function(values) {
	reapplyFilter()
	updateDSWithout("Dealno")
})
filters.DealNoDS = ko.observableArray()

filters.CityVal = ko.observableArray()
filters.CityVal.subscribe(function(values) {
	reapplyFilter()
	updateDSWithout("City")
})
filters.CityDS = ko.observableArray()

filters.ProductVal = ko.observableArray()
filters.ProductVal.subscribe(function(values) {
	reapplyFilter()
	updateDSWithout("Product")
})
filters.ProductDS = ko.observableArray()

filters.BRHeadVal = ko.observableArray()
filters.BRHeadVal.subscribe(function(values) {
	reapplyFilter()
	updateDSWithout("BRHead")
})
filters.BRHeadDS = ko.observableArray()

filters.SchemeVal = ko.observableArray()
filters.SchemeVal.subscribe(function(values) {
	reapplyFilter()
	updateDSWithout("Scheme")
})
filters.SchemeDS = ko.observableArray()

filters.RMVal = ko.observableArray()
filters.RMVal.subscribe(function(values) {
	reapplyFilter()
	updateDSWithout("RM")
})
filters.RMDS = ko.observableArray()

filters.ddRLARangesVal = ko.observable("")
filters.ddRLARangesVal.subscribe(function(values) {
	reapplyFilter()
	updateDSWithout()
})

filters.inputRLARangeVal = ko.observable()
filters.inputRLARangeVal.subscribe(function(values) {
	reapplyFilter()
	updateDSWithout()
})

filters.CAVal = ko.observableArray()
filters.CAVal.subscribe(function(values) {
	reapplyFilter()
	updateDSWithout("CA")
})
filters.CADS = ko.observableArray()

filters.ddIRRangesVal = ko.observable("")
filters.ddIRRangesVal.subscribe(function(values) {
	reapplyFilter()
	updateDSWithout()
})

filters.inputIRRangeVal = ko.observable()
filters.inputIRRangeVal.subscribe(function(values) {
	reapplyFilter()
	updateDSWithout()
})

filters.inputRLARangeValSpinners = ko.observable(false);
filter.isHide = ko.observable(true);
filters.dataRating = ko.observable('');

var refreshFilter = function() {
	// rangeIR();
	databrowser.GetDataGrid();
}

var resetFilter = function(){
	_.each($(".k-button > .k-select > .k-icon.k-i-close"), function(e) {
		$(e).trigger("click")
	})

	filters.ddRLARangesVal("")
	$("#ddRLARanges").data("kendoDropDownList").value("");

	filters.inputRLARangeVal("")

	filters.ddIRRangesVal("")
	$("#ddIR").data("kendoDropDownList").value("");

	filters.inputIRRangeVal("")
}

var showMoreFilter = function(){
	filter.isHide(false)
	$("#panel-filter").show()

}

var hideMoreFilter = function(){
	filter.isHide(true)
	$("#panel-filter").hide()
}

var updateDSWithout = function(DSName = ""){
	if(DSName != "Cust")
		updateCustDS()
	
	if(DSName != "Dealno")
		updateDealNoDS()
	
	if(DSName != "City")
		updateCityDS()
	
	if(DSName != "Product")
		updateProductDS()
	
	if(DSName != "BRHead")
		updateBRHeadDS()
	
	if(DSName != "Scheme")
		updateSchemeDS()
	
	if(DSName != "RM")
		updateRMDS()
	
	if(DSName != "CA")
		updateCADS()
}

//--------------------------------------------------------------------

var critCustomer = function(fieldName, isString){
	var criteria = { logic: "or", filters: [] }
	_.each(filters.CustomerVal(), function(val){
		criteria.filters.push({ field: fieldName, operator: "eq", value: (isString ? val.toString() : val) })
	})
	return criteria
}

var critDealNo = function(fieldName){
	var criteria = { logic: "or", filters: [] }
	_.each(filters.DealNoVal(), function(val){
		criteria.filters.push({ field: fieldName, operator: "eq", value: val })
	})
	return criteria
}

var critCity = function(fieldName){
	var criteria = { logic: "or", filters: [] }
	_.each(filters.CityVal(), function(val){
		ajaxPost("/databrowser/getcustomerprofiledata", { 
			filter: { 
				logic: "or", 
				filters: [{ field: "applicantdetail.registeredaddress.CityRegistered", operator: "eq", value: val }] 
			} 
		}, function(res){
			_.each(res.data, function(data){
				criteria.filters.push({ field: fieldName, operator: "eq", value: data.applicantdetail.DealNo })
			})
		})
	})
	return criteria
}

var critProduct = function(fieldName){
	var criteria = { logic: "or", filters: [] }
	_.each(filters.ProductVal(), function(val){
		ajaxPost("/databrowser/getaccountdetaildata", { 
			filter: { 
				logic: "or", 
				filters: [{ field: "accountsetupdetails.product", operator: "eq", value: val }] 
			} 
		}, function(res){
			_.each(res.data, function(data){
				criteria.filters.push({ field: fieldName, operator: "eq", value: data.dealno })
			})
		})
	})
	return criteria
}

var critBRHead = function(fieldName){
	var criteria = { logic: "or", filters: [] }
	_.each(filters.BRHeadVal(), function(val){
		ajaxPost("/databrowser/getaccountdetaildata", { 
			filter: { 
				logic: "or", 
				filters: [{ field: "accountsetupdetails.brhead", operator: "eq", value: val }] 
			} 
		}, function(res){
			_.each(res.data, function(data){
				criteria.filters.push({ field: fieldName, operator: "eq", value: data.dealno })
			})
		})
	})
	return criteria
}

var critScheme = function(fieldName){
	var criteria = { logic: "or", filters: [] }
	_.each(filters.SchemeVal(), function(val){
		ajaxPost("/databrowser/getaccountdetaildata", { 
			filter: { 
				logic: "or", 
				filters: [{ field: "accountsetupdetails.scheme", operator: "eq", value: val }] 
			} 
		}, function(res){
			_.each(res.data, function(data){
				criteria.filters.push({ field: fieldName, operator: "eq", value: data.dealno })
			})
		})
	})
	return criteria
}

var critRM = function(fieldName){
	var criteria = { logic: "or", filters: [] }
	_.each(filters.RMVal(), function(val){
		ajaxPost("/databrowser/getaccountdetaildata", { 
			filter: { 
				logic: "or", 
				filters: [{ field: "accountsetupdetails.rmname", operator: "eq", value: val }] 
			} 
		}, function(res){
			_.each(res.data, function(data){
				criteria.filters.push({ field: fieldName, operator: "eq", value: data.dealno })
			})
		})
	})
	return criteria
}

var critRLA = function(fieldName){
	var criteria = { logic: "or", filters: [] }
	
	if(filters.ddRLARangesVal() != "")
		ajaxPost("/databrowser/getcustomerprofiledata", { 
			filter: { 
				logic: "or", 
				filters: [{ field: "applicantdetail.AmountLoan", operator: filters.ddRLARangesVal(), value: filters.inputRLARangeVal() }] 
			} 
		}, function(res){
			_.each(res.data, function(data){
				criteria.filters.push({ field: fieldName, operator: "eq", value: data.applicantdetail.DealNo })
			})
		})

	return criteria
}

var critCA = function(fieldName){
	var criteria = { logic: "or", filters: [] }
	_.each(filters.CAVal(), function(val){
		ajaxPost("/databrowser/getaccountdetaildata", { 
			filter: { 
				logic: "or", 
				filters: [{ field: "accountsetupdetails.creditanalyst", operator: "eq", value: val }] 
			} 
		}, function(res){
			_.each(res.data, function(data){
				criteria.filters.push({ field: fieldName, operator: "eq", value: data.dealno })
			})
		})
	})
	return criteria
}

var critIR = function(fieldName){
	// alert("masuk")
	var criteria = { logic: "or", filters: [] }
	if(filters.ddIRRangesVal() != "")
		ajaxPost("/databrowser/getcreditscorecarddata", { 
			filter: { 
				logic: "or", 
				filters: [{ field: "FinalScoreDob", operator: filters.ddIRRangesVal(), value: filters.inputIRRangeVal() }] 
			} 
		}, function(res){
			_.each(res.data, function(data){
				criteria.filters.push({ field: fieldName, operator: "eq", value: data.DealNo })
			})
		})
	
	return criteria
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

var updateCustDS = function(){
	var initFilter = { logic: "and", filters: [] }
	initFilter.filters.push(critDealNo("deal_no"))
	initFilter.filters.push(critCity("deal_no"))
	initFilter.filters.push(critProduct("deal_no"))
	initFilter.filters.push(critBRHead("deal_no"))
	initFilter.filters.push(critScheme("deal_no"))
	initFilter.filters.push(critRM("deal_no"))
	initFilter.filters.push(critIR("deal_no"))
	initFilter.filters.push(critCA("deal_no"))
	initFilter.filters.push(critRLA("deal_no"))

	//benakno
	setTimeout(function(){
		multiCustomerDS.filter(initFilter)
	}, 1000)
}

var updateDealNoDS = function(){
	var initFilter = { logic: "and", filters: [] }
	initFilter.filters.push(critCustomer("customer_id", false))
	initFilter.filters.push(critCity("deal_no"))
	initFilter.filters.push(critProduct("deal_no"))
	initFilter.filters.push(critBRHead("deal_no"))
	initFilter.filters.push(critScheme("deal_no"))
	initFilter.filters.push(critRM("deal_no"))
	initFilter.filters.push(critIR("deal_no"))
	initFilter.filters.push(critCA("deal_no"))
	initFilter.filters.push(critRLA("deal_no"))

	//benakno
	setTimeout(function(){
		multiDealNoDS.filter(initFilter);
	}, 1000)
}

var updateCityDS = function(){
	var initFilter = { logic: "and", filters: [] }
	initFilter.filters.push(critCustomer("applicantdetail.CustomerID", false))
	initFilter.filters.push(critDealNo("applicantdetail.DealNo"))
	initFilter.filters.push(critProduct("applicantdetail.DealNo"))
	initFilter.filters.push(critBRHead("applicantdetail.DealNo"))
	initFilter.filters.push(critScheme("applicantdetail.DealNo"))
	initFilter.filters.push(critRM("applicantdetail.DealNo"))
	initFilter.filters.push(critIR("applicantdetail.DealNo"))
	initFilter.filters.push(critCA("applicantdetail.DealNo"))
	initFilter.filters.push(critRLA("applicantdetail.DealNo"))

	//benakno
	setTimeout(function(){
		multiCityDS.filter(initFilter)
	}, 1000)
}

var updateProductDS = function(){
	var initFilter = { logic: "and", filters: [] }
	initFilter.filters.push(critCustomer("customerid", true))
	initFilter.filters.push(critDealNo("dealno"))
	initFilter.filters.push(critCity("dealno"))
	initFilter.filters.push(critBRHead("dealno"))
	initFilter.filters.push(critScheme("dealno"))
	initFilter.filters.push(critRM("dealno"))
	initFilter.filters.push(critIR("dealno"))
	initFilter.filters.push(critCA("dealno"))
	initFilter.filters.push(critRLA("dealno"))

	//benakno
	setTimeout(function(){
		multiProductDS.filter(initFilter)
	}, 1000)
}

var updateBRHeadDS = function(){
	var initFilter = { logic: "and", filters: [] }
	initFilter.filters.push(critCustomer("customerid", true))
	initFilter.filters.push(critDealNo("dealno"))
	initFilter.filters.push(critCity("dealno"))
	initFilter.filters.push(critProduct("dealno"))
	initFilter.filters.push(critScheme("dealno"))
	initFilter.filters.push(critRM("dealno"))
	initFilter.filters.push(critIR("dealno"))
	initFilter.filters.push(critCA("dealno"))
	initFilter.filters.push(critRLA("dealno"))

	//benakno
	setTimeout(function(){
		multiBRHeadDS.filter(initFilter)
	}, 1000)
}

var updateSchemeDS = function(){
	var initFilter = { logic: "and", filters: [] }
	initFilter.filters.push(critCustomer("customerid", true))
	initFilter.filters.push(critDealNo("dealno"))
	initFilter.filters.push(critCity("dealno"))
	initFilter.filters.push(critProduct("dealno"))
	initFilter.filters.push(critBRHead("dealno"))
	initFilter.filters.push(critRM("dealno"))
	initFilter.filters.push(critIR("dealno"))
	initFilter.filters.push(critRLA("dealno"))

	//benakno
	setTimeout(function(){
		multiSchemeDS.filter(initFilter)
	}, 1000)
}

var updateRMDS = function(){
	var initFilter = { logic: "and", filters: [] }
	initFilter.filters.push(critCustomer("customerid", true))
	initFilter.filters.push(critDealNo("dealno"))
	initFilter.filters.push(critCity("dealno"))
	initFilter.filters.push(critProduct("dealno"))
	initFilter.filters.push(critBRHead("dealno"))
	initFilter.filters.push(critScheme("dealno"))
	initFilter.filters.push(critIR("dealno"))
	initFilter.filters.push(critRLA("dealno"))

	//benakno
	setTimeout(function(){
		multiRMDS.filter(initFilter)
	}, 1000)
}

var updateCADS = function(){
	var initFilter = { logic: "and", filters: [] }
	initFilter.filters.push(critCustomer("customerid", true))
	initFilter.filters.push(critDealNo("dealno"))
	initFilter.filters.push(critCity("dealno"))
	initFilter.filters.push(critProduct("dealno"))
	initFilter.filters.push(critBRHead("dealno"))
	initFilter.filters.push(critScheme("dealno"))
	initFilter.filters.push(critRM("dealno"))
	initFilter.filters.push(critIR("dealno"))
	initFilter.filters.push(critRLA("dealno"))

	//benakno
	setTimeout(function(){
		multiCADS.filter(initFilter)
	}, 1000)
}

var generateDataSource = function(url, param, text, c){

	var checkFilter = function(filter) {
        _.each(filter.filters, function(fs){
        	if (fs.filters != undefined)
        		checkFilter(fs)
        	else
				if(fs.field == "text")
					fs.field = text
		})

		var checkDuplicatedAnd = function(f){
			if(f.logic == "and")
				_.each(f.filters, function(value, key, list){
		        	if (value.filters != undefined)
		        		checkDuplicatedAnd(value)
		        	else
						if (key > 0)
							if(value.field == list[key-1].field)
								list.splice(0, 1)
				})
		}
		
		checkDuplicatedAnd(filter)
	}

	return new kendo.data.DataSource({
		serverFiltering: true,
	    transport: {
	        read: function(o) {
	        	if (o.data.filter != undefined){
	        		param.filter = o.data.filter
	        	} else {
		        	param.filter = { filters: [] }
		        }
		        	
		        checkFilter(param.filter)

	        	ajaxPost(url, param, function(res){
	           		o.success(res.data);
	           	})
	        }
	    },
	    schema: {
	    	parse: function(data){
	    		return _.reject(
	    			_.map(
	    				_.groupBy(
	    					_.sortBy(
	    						_.map(data, c), function(d){
	    							return d.value
	    						}), 
	    					function(d){
	    						return d.text;
	    					}), 
	    				function(d){
	    					return d[0];
	    				}), 
	    			function(d) {
	    				return _.isEmpty(d.text)
	    			})
	    	}
	    },
	})
}

var getMasterCustomerDS = function(text, c) {
	return generateDataSource("/databrowser/getmastercustomerdata", {}, text, c)
}

var multiCustomerDS = getMasterCustomerDS("customer_name", function(d){
	return {
		"text": d.customer_name,
		"value": d.customer_id
	}
})

var multiDealNoDS = getMasterCustomerDS("deal_no", function(d){
	return {
		"text": d.deal_no,
		"value": d.deal_no
	}
})

// --------------------------------------------------------------------

var multiCityDS = generateDataSource("/databrowser/getcustomerprofiledata", {}, "applicantdetail.registeredaddress.CityRegistered", function(d){
	return {
		"text": d.applicantdetail.registeredaddress.CityRegistered,
		"value": d.applicantdetail.registeredaddress.CityRegistered
	}
})

//--------------------------------------------------------------------

var getAccountDetailDS = function(text, c) {
	return generateDataSource("/databrowser/getaccountdetaildata", {}, text, c)
}

var multiProductDS = getAccountDetailDS("accountsetupdetails.product", function(d){
	return {
		"text": d.accountsetupdetails.product,
		"value": d.accountsetupdetails.product
	}
})

var multiBRHeadDS = getAccountDetailDS("accountsetupdetails.brhead", function(d){
	return {
		"text": d.accountsetupdetails.brhead,
		"value": d.accountsetupdetails.brhead
	}
})

var multiSchemeDS = getAccountDetailDS("accountsetupdetails.scheme", function(d){
	return {
		"text": d.accountsetupdetails.scheme,
		"value": d.accountsetupdetails.scheme
	}
})

var multiRMDS = getAccountDetailDS("accountsetupdetails.rmname", function(d){
	return {
		"text": d.accountsetupdetails.rmname,
		"value": d.accountsetupdetails.rmname
	}
})

var dddata = [
	{ text: "Choose Ranges", value: "" },
    { text: "Greater Than", value: "gt" },
    { text: "Greater Than or Equal", value: "gte" },
    { text: "Equal", value: "eq" },
    { text: "Lower Than or Equal", value: "lte" },
    { text: "Lower Than", value: "lt" }
]

var irdata = [
	{text: 'XFL-5', value:'<= 4.5'},
	{text: 'XFL-4', value:'> 4.5 < 6'},
	{text: 'XFL-3', value:'>= 6 < 7'},
	{text: 'XFL-2', value:'>= 7 <= 8.5'},
	{text: 'XFL-1', value:'> 8.5'},
]

// This is redudant call since we use Knockout-Kendo
// $("#inputRLARange").kendoNumericTextBox();
// $("#inputIRRange").kendoNumericTextBox();

var multiCADS = getAccountDetailDS("accountsetupdetails.creditanalyst", function(d){
	return {
		"text": d.accountsetupdetails.creditanalyst,
		"value": d.accountsetupdetails.creditanalyst
	}
})