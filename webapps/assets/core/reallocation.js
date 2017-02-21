
//template 

r = {}
r.visibleFilter = ko.observable(true)
r.modeEdit = ko.observable(false)
r.tempDataAllocate = ko.observableArray([{ToName: "-1", Reason: "-1"}])
r.logsList = ko.observableArray([])

r.modeChange = ko.observable(false)

r.allocationId = ko.observable("")

r.masterUserList = ko.observableArray()
r.masterCustomerList = ko.observableArray()

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

r.tempDataGrid = ko.observableArray()

var gridbrowser = {
    column: [
        {
            headerAttributes: { "class": "k-header header-bgcolor" },
            title : "Customer Name",
            field : "CustomerName",
        },
        {
            headerAttributes: { "class": "k-header header-bgcolor" },
            title : "Deal No",
            field : "DealNo",
        },
        {
            headerAttributes: { "class": "k-header header-bgcolor" },
            title : "Role",
            field : "Role",
        },
        {
            headerAttributes: { "class": "k-header header-bgcolor" },
            title : "Reallocate From",
            field : "FromName",
        },
        {
            headerAttributes: { "class": "k-header header-bgcolor" },
            title : "Reallocate To",
            field : "ToName",
            template : function(o) {
            	return "<a href=# onClick=r.showModalLogs(\""+o.Id+"\")>"+o.ToName+"</a>"
            }
        },
        {
            headerAttributes: { "class": "k-header header-bgcolor" },
            title : "Reason",
            field : "Reason",
        },
        {
            headerAttributes: { "class": "k-header header-bgcolor" },
            title : "Timestamp",
            field : "Timestamp",
            template : function(o) {
                return "<label>"+moment(o).format("DD-MMM-YYYY")+"</label>"
            }
        },
        {
            headerAttributes: { "class": "k-header header-bgcolor" },
            title : "Action",
            template : function(o) {
                return "<button class='btn btn-save' onClick=\"r.edit('"+o.DealNo+"', '"+o.Id+"')\">Edit</button>"
            }
        }
    ]
}

var source = ko.observableArray([])

r.getDataAllocate = function() {
	ajaxPost("/reallocation/getreallocationdeal",{}, function(res){
		source(res)
		_.each(source(), function(row){
			_.each(row.Logs, function(row1){
				row1.TimeStamp = moment(row.TimeStamp).format("DD-MMM-YYYY h:mm:ss a")
			})
		})		 
    });
}

r.getData = function(getAllocate){
	$.ajax("/reallocation/getdata", {
		success: function(body) {
			if(typeof getAllocate === "function") {
				getAllocate()
			}

			r.masterUserList(body.Data.MasterUser)
			r.masterCustomerList(body.Data.MasterCustomer)

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
	r.renderCompany(r.customerList, data.MasterCustomer, data.AccountDetails)
	// r.renderCustomer()
}

r.refreshFilter = function() {
	param = {}
	param.DealNo = r.dealNoSelected()
	param.Customer = r.customerSelected()
	param.CaName = r.caNameSelected()
	param.RMName = r.rmNameSelected() 
	
	r.tempDataGrid([])

	ajaxPost("/reallocation/getdatabyparam",param, function(res){
		r.tempDataGrid(res.Data)

		if(param.DealNo.length === 0) {
			r.renderDealNo(r.dealNoList, res.Data)
		}

		if(param.Customer.length === 0) {
			r.renderCompany(r.customerList, r.masterCustomerList(), res.Data)	
		}

		if(param.CaName.length === 0) {
			r.renderCAName(r.caNameList, res.Data)	
		}

		if(param.RMName.length === 0) {
			r.renderRMName(r.rmNameList, res.Data)	
		} 
    });
}

r.drawGrid = function(){
	r.renderKendoGrid(r.normalisasiDataGrid, r.tempDataGrid())
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
				
				r.getDataAllocate()

				$('.modal-reallocation').modal('hide')	
				r.modeEdit(false)	 
		    });			
		}
		r.paramSave([])
	} else {
		console.log("ok zone")
		r.paramSave([])
	}
}

r.edit = function(dealno,  id) {
	r.modeEdit(true)

	var param = {}
	param.DealNo = dealno
	param.Id = id

	r.allocationId(id)

	r.tempDataAllocate([{ToName: "-1", Reason: "-1"}])

	ajaxPost("/reallocation/getdatabydealno", param, function(res){
		r.renderKendoGrid(r.normalisasiDataGrid, res.Data.AccountDetails)
		
		reallocation = res.Data.AllocationDeal[0]

		var dropdownlistRole = $("#select0").data("kendoDropDownList");
		var dropdownlistTo = $("#to0").data("kendoDropDownList");

		dropdownlistRole.value(reallocation.Role);
		dropdownlistRole.trigger("change");

		setTimeout(function(){
			dropdownlistTo.value(reallocation.ToName);	
		}, 500)
		
		$("#reason0").val(reallocation.Reason)
		
		$('.modal-reallocation').modal('show')
		r.visibleFilter(false)

		r.tempDataAllocate([{ToName: reallocation.ToName, Reason: reallocation.Reason}])
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
			swal("Warning","Please fill all fields","warning");
			break
		} else {
			var ADFormat =  {}
			ADFormat.Id = data[i].Id
			
			if(r.modeEdit())
			ADFormat.ReallocateId = r.allocationId()
			else
			ADFormat.ReallocateId = ""

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
			if(r.validateUniqueData(ADFormat.Role,ADFormat.DealNo) || r.modeEdit()){
				if(r.tempDataAllocate()[0].ToName === ADFormat.ToText && r.tempDataAllocate()[0].Reason === ADFormat.Reason) {
					ADFormat.LogSave = "false"
				} else {
					ADFormat.LogSave = "true"
				}

				r.paramSave.push(ADFormat)
			}else{
				swal("Warning","Deal Number " + ADFormat.DealNo +" with " +ADFormat.Role+" Role re-allocation done before, please edit from the main grid.","warning")
				validate = false
				break
			}
		}
		validate = true
	}


	return validate
}

r.normalisasiDataGrid = function(data) {
	_.each(data, function(row){

		custId = parseInt(row.CustomerId)
		user = r.findCompanyById(custId)

		if(user !== undefined && user.length > 0) {
			row.CustomerName = user[0].customer_name
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

r.renderCompany = function(target, user, account) {
	r.buildFilter(target, account, function(val){
		custId = parseInt(val.CustomerId)

		userResult = r.findCompanyById(custId)

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
	
r.findCompanyById = function(zone){
	var user = _.filter(r.masterCustomerList(), function(row){
		return zone === row.customer_id
	})	

	return user
}

r.validateUniqueData = function(Role, DealNo){
	var dt  = _.filter(source(),function(x){
		return x.DealNo == DealNo && x.Role == Role
	});

	if(dt.length > 0){
		return false
	}

	return true
}

r.showModal = function(selector) {
	return function(){
		r.visibleFilter(true)
		$(selector).modal('show')
		r.modeEdit(false)
		r.dataGrid([])
		r.resetFilter()
	}
}

r.showModalLogs = function(id) {
	reallocate = _.filter(source(), function(row){
		return row.Id === id
	})

	r.logsList([])

	if(reallocate.length > 0 && reallocate[0].Logs !== null) {
		r.logsList(reallocate[0].Logs)
	}

	$(".modal-logs").modal('show')
	
	return false
} 

var allocationTimeOut = setTimeout(function(){
}, 500)

var findAllocationByParam = function() {
	clearTimeout(allocationTimeOut)

	param = {}
	param.Search = $("#filter").val()
	
	allocationTimeOut = setTimeout(function(){
		ajaxPost("/reallocation/searchbyparam", param, function(res){
			source([])
			source(res) 
			_.each(source(), function(row){
				_.each(row.Logs, function(row1){
					row1.TimeStamp = moment(row.TimeStamp).format("DD-MMM-YYYY h:mm:ss a")
				})
			})
	    });
	}, 500)
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
	r.getData(r.getDataAllocate)
	$("#filter").keyup(function(){
		findAllocationByParam()  
	})
})