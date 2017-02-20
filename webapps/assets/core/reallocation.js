
//template 

r = {}
r.visibleFilter = ko.observable(true)

r.masterUserList = ko.observableArray()
r.allCaName = ko.observableArray()
r.allRmName = ko.observableArray()
r.tempForCAOrRM = ko.observableArray()
r.dataGrid = ko.observableArray()
r.paramSave = ko.observableArray()
r.dealNoList = ko.observableArray()
r.dealNoSelected = ko.observableArray()

r.customerList = ko.observableArray()
r.customerSelected = ko.observableArray()

r.rmNameList = ko.observableArray()
r.rmNameSelected = ko.observableArray()

r.caNameList = ko.observableArray()
r.caNameSelected = ko.observableArray()

r.allocateRoleList = ko.observableArray(["CA", "RM"])
r.allocateRoleSelected = ko.observable("CA")

r.getData = function(){
	$.ajax("/reallocation/getdata", {
		success: function(body) {
			r.masterUserList(body.Data.MasterUser)

			r.renderFilter(body.Data)
			
			r.renderCAName(r.allCaName, body.Data.AccountDetails)
			r.renderRMName(r.allRmName, body.Data.AccountDetails)

			// r.renderKendoGrid(r.normalisasiDataGrid, body.Data.AccountDetails)
		}
	})
}

r.renderFilter = function(data) {
	r.renderDealNo(r.dealNoList, data.AccountDetails)
	r.renderRMName(r.rmNameList, data.AccountDetails)
	r.renderCAName(r.caNameList, data.AccountDetails)
	r.renderCustomer(r.customerList, data.MasterUser, data.AccountDetails)
}

r.refreshFilter = function() {
	param = {}
	param.DealNo = r.dealNoSelected()
	param.Customer = r.customerSelected()
	param.CaName = r.caNameSelected()
	param.RMName = r.rmNameSelected()

	var filter = false

	if(param.DealNo.length > 0 || param.Customer.length > 0 || param.CaName.length > 0 || param.RMName.length > 0) {
		filter = true
	} 

	ajaxPost("/reallocation/getdatabyparam",param, function(res){
		r.dataGrid([])
		if(filter === true) {
			r.renderKendoGrid(r.normalisasiDataGrid, res.Data)
		}

		if(param.DealNo.length === 0) {
			r.renderDealNo(r.dealNoList, res.Data)
		}

		if(param.Customer.length === 0) {
			r.renderCustomer(r.customerList, r.masterUserList(), res.Data)	
		}

		if(param.CaName.length === 0) {
			r.renderCAName(r.caNameList, res.Data)	
		}

		if(param.RMName.length === 0) {
			r.renderRMName(r.rmNameList, res.Data)	
		} 
    });
}

r.resetFilter = function() {
	r.dealNoSelected([])
	r.customerSelected([])
	r.rmNameSelected([])
	r.caNameSelected([])
}

r.save = function() {
	var validate = r.validateDataGrid(r.dataGrid())
	if( validate === true) {
		if(r.paramSave().length > 0) {
			ajaxPost("/reallocation/updatereallocationrole", r.paramSave(), function(res){
				r.paramSave([])
				
				console.log(res) 
		    });			
		}
		r.paramSave([])
	} else {
		console.log("ok zone")
		r.paramSave([])
	}
}

r.edit = function(dealno) {
	var param = {}
	param.DealNo = dealno

	ajaxPost("/reallocation/getdatabydealno", param, function(res){
		r.renderKendoGrid(r.normalisasiDataGrid, res.Data)
		$('.modal-reallocation').modal('show')
		r.visibleFilter(false)
	});
}

test = function(data, index) {
	return function(){
		if($("#select"+index).val() === "CA") {
			$("#from"+index).text(data.AccountSetupDetails.CreditAnalyst)
			if(data.AccountSetupDetails.CreditAnalystId !== undefined) {
				$("#fromid"+index).val(data.AccountSetupDetails.CreditAnalystId)
			}
			r.tempForCAOrRM(r.allCaName())
		} else {
			$("#from"+index).text(data.AccountSetupDetails.RmName)
			if(data.AccountSetupDetails.RmNameId !== undefined) {
				$("#fromid"+index).val(data.AccountSetupDetails.RmNameId)
			}
			r.tempForCAOrRM(r.allRmName())
		}
	}
}

r.renderKendoGrid = function(normalisasi, data) {
	if(typeof normalisasi === "function") {
		data = normalisasi(data)
		r.dataGrid(data)

		// colconfig = [
		// 	{
		// 		field : "CustomerId",
		// 		title : "Customer Id",
		// 		hidden : true,
		// 		width : 150,
		// 		headerAttributes: { "class": "sub-bgcolor" },
		// 	},
		// 	{
		// 		field : "RMCASelection",
		// 		title : "Reallocate Role",
		// 		hidden : false,
		// 		width : 150,
		// 		headerAttributes: { "class": "sub-bgcolor" },
		// 		template : function(o) {
		// 			console.log(o.AccountSetupDetails.RmName)
		// 			param = {}
		// 			param.Id = o.Id
		// 			param.RmName = o.AccountSetupDetails.RmName
		// 			param.CaName = o.AccountSetupDetails.CreditAnalyst

		// 			return "<select onChange=test('"+o.Id+"', '"+o.AccountSetupDetails.RmName+"', '"+o.AccountSetupDetails.CreditAnalyst+"')><option>select one</option><option>CA</option><option>RM</option></select>"
		// 		}
		// 	},
		// 	{
		// 		field : "DealNo",
		// 		title : "Deal No",
		// 		hidden : false,
		// 		width : 150,
		// 		headerAttributes: { "class": "sub-bgcolor" },
		// 		template : function(o) {
		// 			console.log(o)
		// 			return "<label id='"+o.Id+"'></label>"
		// 		}
		// 	},
		// 	 {
		// 		field : "AccountSetupDetails.RmName",
		// 		title : "RM Name",
		// 		hidden : false,
		// 		width : 150,
		// 		headerAttributes: { "class": "sub-bgcolor" },
		// 	},
		// 	{
		// 		field : "AccountSetupDetails.CreditAnalyst",
		// 		title : "CA Name",
		// 		hidden : false,
		// 		width : 150,
		// 		headerAttributes: { "class": "sub-bgcolor" },
		// 	}
		// ]

		// $("#griddb").kendoGrid({
		// 	 dataSource: {
		// 	 	data : data
		// 	 },
		// 	 columns : colconfig,
		// 	 editable: true,
		// 	 toolbar: [{ template: kendo.template($("#template").html()) }],
		// 	 scrollable : true,
		// 	 height:450,
		// 	 dataBinding: function(x) {
		// 	 	setTimeout(function(){
		// 	 		_.each($(".intable").parent(),function(e){
		// 				$(e).css("padding",0)
		// 			})
		// 	 	},10)
		// 	}
		// }).data("kendoGrid");
	}
}

r.validateDataGrid = function(data) {
	var validate = false 
	for(var i=0; i<data.length; i++) {
		allocateSelect = $("#select" + i).val()
		toSelect = $("#to" + i).val()
		reason = $("#reason" + i).val()

		if(allocateSelect === "" || toSelect === "" || reason === "") {
			validate = false
			break
		} else {
			validate = true
			var ADFormat =  {}
			ADFormat.Id = data[i].Id
			ADFormat.CustomerName = data[i].CustomerName
			ADFormat.DealNo = data[i].DealNo
			ADFormat.Role = allocateSelect
			ADFormat.FromText = $("#from"+i).text()
			ADFormat.FromId = $("#fromid"+i).val()
			ADFormat.ToText = toSelect
			ADFormat.ToId = ""

			user = r.findCustomerByName(toSelect)
			if(user !== undefined && user.length > 0) {
				ADFormat.ToId = "" + user[0].userid
			}

			ADFormat.Reason = reason

			r.paramSave.push(ADFormat)
		}
	}

	return validate
}

r.normalisasiDataGrid = function(data) {
	_.each(data, function(row){

		user = r.findCustomerById(row.CustomerId)

		if(user !== undefined && user.length > 0) {
			row.CustomerName = user[0].username
		} else {
			row.CustomerName = ""
		}


	})

	return data
}

r.dealNoSelected.subscribe(function(values) {
	r.refreshFilter()
})

r.customerSelected.subscribe(function(values) {
	r.refreshFilter()
})

r.rmNameSelected.subscribe(function(values) {
	r.refreshFilter()
})

r.caNameSelected.subscribe(function(values) {
	r.refreshFilter()
})

r.renderDealNo = function(target, data) {
	r.buildFilter(target, data, function(val){
		return {
			text : val.DealNo,
			value : val.DealNo
		}
	})
}

r.renderRMName = function(target, data) {
	r.buildFilter(target, data, function(val){
		return {
			text : val.AccountSetupDetails.RmName,
			value : val.AccountSetupDetails.RmName
		}
	})
}

r.renderCAName = function(target, data) {
	r.buildFilter(target, data, function(val){
		return {
			text : val.AccountSetupDetails.CreditAnalyst,
			value : val.AccountSetupDetails.CreditAnalyst
		}
	})
}

r.renderCustomer = function(target, user, account) {
	r.buildFilter(target, account, function(val){

		custId = val.CustomerId

		userResult = r.findCustomerById(custId)
		textName = ""
		if(userResult.length > 0 && userResult[0].username !== undefined) {
			textName = userResult[0].username
		}

		return {
			text : textName,
			value : val.CustomerId
		}
	})
}

r.buildFilter = function(target, data, mapFormatting){
	newVal = _.map(data, mapFormatting)
	newVal = _.uniqWith(newVal, _.isEqual)
	newVal = _.remove(newVal, function(val){
		if(val.text === "") {
			return false
		} else {
			return true
		}
	})
	target(newVal)
} 

r.findCustomerById = function(zone){
	var user = _.filter(r.masterUserList(), function(row){
		return zone === row.userid
	})	

	return user
} 

r.findCustomerByName = function(name) {
	var user = _.filter(r.masterUserList(), function(row){
		return name === row.username
	})

	return user
}

r.showModal = function(selector) {
	return function(){
		r.visibleFilter(true)
		$(selector).modal('show')
	}
}

//editor
reallocateRoleEditor = function(container, options){
	$('<input data-text-field="Text" data-value-field="Text" data-bind="value:' + options.model.RMCASelection + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                dataTextField: "Text",
                dataValueField: "Text",
                dataSource: [{"Value":"CA","Text":"CA"},{"Value":"RM","Text":"RM"}],
                optionLabel: "Select One..",
            });
}

carmEditor = function(container, options) {
	$('<label data-bind="text:' + options.field + '"/></label>')
            .appendTo(container)
}

$(document).ready(function(){
	r.getData()
})