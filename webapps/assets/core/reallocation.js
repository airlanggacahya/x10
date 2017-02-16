

r = {}
r.masterUserList = ko.observableArray()

r.dealNoList = ko.observableArray()
r.dealNoSelected = ko.observableArray()

r.customerList = ko.observableArray()
r.customerSelected = ko.observableArray()

r.rmNameList = ko.observableArray()
r.rmNameSelected = ko.observableArray()

r.caNameList = ko.observableArray()
r.caNameSelected = ko.observableArray()

r.getData = function(){
	$.ajax("/reallocation/getdata", {
		success: function(body) {
			r.renderFilter(body.Data)
			r.masterUserList(body.Data.MasterUser)

			r.renderKendoGrid(r.normalisasiDataGrid, body.Data.AccountDetails)
		}
	})
}

r.renderFilter = function(data) {
	r.renderDealNo(data.AccountDetails)
	r.renderRMName(data.AccountDetails)
	r.renderCAName(data.AccountDetails)
	r.renderCustomer(data.MasterUser, data.AccountDetails)
}

r.refreshFilter = function() {
	param = {}
	param.DealNo = r.dealNoSelected()
	param.Customer = r.customerSelected()
	param.CaName = r.caNameSelected()
	param.RMName = r.rmNameSelected()

	ajaxPost("/reallocation/getdatabyparam",param, function(res){
       r.renderKendoGrid(r.normalisasiDataGrid, res.Data) 
    });
}

r.resetFilter = function() {
	r.dealNoSelected([])
	r.customerSelected([])
	r.rmNameSelected([])
	r.caNameSelected([])
}

r.renderKendoGrid = function(normalisasi, data) {
	if(typeof normalisasi === "function") {
		data = normalisasi(data)

		colconfig = [
			{
				field : "CustomerId",
				title : "Customer Id",
				hidden : true,
				width : 150,
				headerAttributes: { "class": "sub-bgcolor" },
			},
			{
				field : "CustomerName",
				title : "Customer Name",
				hidden : false,
				width : 150,
				headerAttributes: { "class": "sub-bgcolor" },
			},
			{
				field : "DealNo",
				title : "Deal No",
				hidden : false,
				width : 150,
				headerAttributes: { "class": "sub-bgcolor" },
			},
			 {
				field : "AccountSetupDetails.RmName",
				title : "RM Name",
				hidden : false,
				width : 150,
				headerAttributes: { "class": "sub-bgcolor" },
			},
			{
				field : "AccountSetupDetails.CreditAnalyst",
				title : "CA Name",
				hidden : false,
				width : 150,
				headerAttributes: { "class": "sub-bgcolor" },
			}
		]

		$("#griddb").kendoGrid({
			 dataSource: {
			 	data : data,
			 	pageSize: 10
			 },
			 columns : colconfig,
			 groupable: true,
			 scrollable : true,
			 pageable: true,
			 height:450,
			 dataBinding: function(x) {
			 	setTimeout(function(){
			 		_.each($(".intable").parent(),function(e){
						$(e).css("padding",0)
					})
			 	},10)
			}
		}).data("kendoGrid");
	}
}

r.normalisasiDataGrid = function(data) {
	_.each(data, function(row){
		var userResult = _.filter(r.masterUserList(), function(user){
			return user.customer_id === parseInt(row.CustomerId)
		})

		if(userResult !== undefined && userResult.length > 0) {
			row.CustomerName = userResult[0].customer_name
		} else {
			row.CustomerName = ""
		}


	})
	// var result = _.map(data, function(row){
	// 	return {
	// 		DealNo : row.DealNo,
	// 		RMName : row.AccountSetupDetails.RmName,
	// 		CreditAnalyst : row.AccountSetupDetails.CreditAnalyst
	// 	}
	// })

	return data
}

r.renderDealNo = function(data) {
	r.buildFilter(r.dealNoList, data, function(val){
		return {
			text : val.DealNo,
			value : val.DealNo
		}
	})
}

r.renderRMName = function(data) {
	r.buildFilter(r.rmNameList, data, function(val){
		return {
			text : val.AccountSetupDetails.RmName,
			value : val.AccountSetupDetails.RmName
		}
	})
}

r.renderCAName = function(data) {
	r.buildFilter(r.caNameList, data, function(val){
		return {
			text : val.AccountSetupDetails.CreditAnalyst,
			value : val.AccountSetupDetails.CreditAnalyst
		}
	})
}

r.renderCustomer = function(user, account) {
	r.buildFilter(r.customerList, account, function(val){
		
		userResult = _.filter(user, function(userItem) {
			if(typeof val.CustomerId === "number" ) {
				val.CustomerId = parseInt(userItem.customer_id)	
			}
			return userItem.customer_id == val.CustomerId
		})

		textName = ""
		if(userResult.length > 0 && userResult[0].customer_name !== undefined) {
			textName = userResult[0].customer_name
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

	target(newVal)
} 

$(document).ready(function(){
	r.getData()
})