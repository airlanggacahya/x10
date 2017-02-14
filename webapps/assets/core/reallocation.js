

r = {}

r.dealNoList = ko.observableArray()
r.dealNoSelected = ko.observableArray()

r.customerList = ko.observableArray()
r.customerSelected = ko.observableArray()

r.getData = function(){
	$.ajax("/reallocation/getdataaccountdetails", {
		success: function(body) {
			r.renderFilter(body.Data)
		}
	})
}

r.renderFilter = function(data) {
	r.buildFilter(r.dealNoList, data, function(val){
		return {
			text : val.DealNo,
			value : val.DealNo
		}
	})

	r.buildFilter(r.customerList, data, function(val){
		return {
			text : val.DealNo,
			value : val.DealNo
		}
	})
}

r.buildFilter = function(target, data, mapFormatting){
	console.log(data)
	newVal = _.map(data, mapFormatting)

	target(newVal)
} 

$(document).ready(function(){
	r.getData()
})