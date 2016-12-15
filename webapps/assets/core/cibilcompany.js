var cc = {}

cc.AllData = ko.observableArray([]);
cc.CurrentData = ko.observable(null);

cc.RenderGrid = function(){
	alert("masuk")
	var searchKey = $("#filter").val().toLowerCase();

	$("#transgrid").html("");
	$("#transgrid").kendoGrid({
		dataSource: new kendo.data.DataSource({
	        transport: {
	            read: function(o) {
	            	ajaxPost("/cibiltransitory/getdatacibilpromotor", { 
               			searchkey: searchKey,
	               		additional: function(){
	               			if(searchKey != ""){
		               			var foundCust = _.uniq(
		               				_.map(
		               					_.filter(filter().CustomerSearchAll(), function(cust){
		               						return cust.customer_name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
		               					}), function(cust){
		               						return cust.customer_id
		               					})
		               				);
								return JSON.stringify(foundCust)
		               		} else {
		               			return -1
		               		}
	               		}(),
	               		page: o.data.page,
	               		pageSize: o.data.pageSize,
	               		skip: o.data.skip,
	               		take: o.data.take
	               	}, function(res){
	               		o.success(res);
	               	})
	            }
	        },
	        schema: {
	        	parse: function(data){
	        		cc.AllData([])
	        		cc.AllData(data.Res.Data)
	        		
	        		_.each(cc.AllData(), function(x){
				 		_.extend(x, function(cust){
				 			return { CustomerName: cust != undefined ? cust.customer_name : "" }
				 		}(_.find(filter().CustomerSearchAll(), function(xi){
				 				return xi.customer_id == x.ConsumersInfos.CustomerId
				 			})));
				 	})
	        		return {
	        			Data: data.Res.Data,
	        			Total: data.Total
	        		}
	        	},
	            data: "Data",
	            total: "Total"
	        },
	        serverPaging: true,
	        pageSize: 10,
	    }),
		pageable: true,
		columns :[{
		 	field : "FileName", 
		 	title : "File Name",
			headerAttributes: { class: 'k-header header-bgcolor' },
			width: 200
		}, {
		 	field : "ConsumersInfos.ConsumerName", 
		 	title : "Promoter Name",
		 	headerAttributes: { class: 'k-header header-bgcolor' },
		 	width: 200
		}, {
		 	field : "CustomerName", 
		 	title : "Customer Name",
			headerAttributes: { class: 'k-header header-bgcolor' },
			width: 200
		}, {
			field : "ConsumersInfos.DealNo", 
		 	title : "Deal Number",
			headerAttributes: { class: 'k-header header-bgcolor' },
			width: 150
		}, {
			field : 'DateOfReport',
			title : 'Report Generated Date',
			headerAttributes: { class: 'k-header header-bgcolor' },
			width : 150,
			attributes : { "style" : "text-align:center" },
			template : function(x){
				var date = moment(x.DateOfReport).format("DD-MMM-YYYY")
				var time = moment(new Date(x.TimeOfReport)).utc().format("HH:mm:ss")
		 		return date + " " + time
		 	},
		}, {
		 	field : "ConsumersInfos.DateOfBirth", 
		 	title : "Date of Birth",
		 	template : function(x){
		 		return moment(x.ConsumersInfos.DateOfBirth).format("DD-MMM-YYYY")
		 	},
		 	attributes : { "style" : "text-align:center" },
		 	headerAttributes: { class: 'k-header header-bgcolor' },
			width : 150
		}, {
		 	field : "CibilScore", 
		 	title : "CIBIL Score",
			width : 100,
		 	attributes : { "style" : "text-align:right" },
			headerAttributes: {class: 'k-header header-bgcolor'},
		}, {
		 	field : "IncomeTaxIdNumber", 
		 	title : "Income Tax Id",
		 	headerAttributes: { class: 'k-header header-bgcolor' },
			width : 100
		}, {
		 	template : function(x){
		 		return "<button class='btn btn-xs btn-primary tooltipster' onclick='cc.showProm(\""+ x.Id + "\")'><i class='fa fa-edit'></i></button>"
		 	},
		 	width : 50,
		 	     headerAttributes: { class: 'k-header header-bgcolor' },
		}]
	});
}

function GetCustomer(){
	var url = "/datacapturing/getcustomerprofilelist";
	  ajaxPost(url, "", function(data) {
	    filter().CustomerSearchAll(data);
		cc.RenderGrid();
	});
}

$(document).ready(function(){

	GetCustomer();

	$("#filter").keydown(function(){
		setTimeout(function(){
			cc.RenderGrid();
		},500);  
	})
	
})