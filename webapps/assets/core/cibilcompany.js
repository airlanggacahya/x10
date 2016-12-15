var cc = {}

cc.edit = ko.observable(false)
cc.AllData = ko.observableArray([]);
cc.CurrentData = ko.observable(null);

cc.templateDetailReportSummary = {
	CreditFacilities: '',
	CurrentBalanceOtherThanStandard: '',
	CurrentBalanceStandard: '',
	NoOfLawSuits: '',
	NoOfOtherThanStandard: '',
	NoOfStandard:'',
	NoOfWilfulDefaults: '',
}

cc.templateCreditTypeSummary = {
	NoCreditFacilitiesBorrower: '',
	CreditType: '',
	CurrencyCode: '',
	Standard: '',
	Substandard: '',
	Doubtful: '',
	Loss: '',
	SpecialMention: '',
	TotalCurrentBalance: '',
}

cc.templateEnquirySummary = {
	Enquiries3Month: '',
	Enquiries6Month: '',
	Enquiries9Month: '',
	Enquiries12Month: '',
	Enquiries24Month: '',
	EnquiriesThan24Month: '',
	TotalEnquiries: '',
	MostRecentDate: '',
}

cc.templateReportSummary = {
	Grantors: '',
	Facilities: '',
	CreditFacilities: '',
	FacilitiesGuaranteed: '',
	LatestCreditFacilityOpenDate: '',
	FirstCreditFacilityOpenDate: '',	
}

cc.templateForm = {
	ReportSummary: cc.templateReportSummary,
	EnquirySummary: cc.templateEnquirySummary,
	DetailReportSummary:[],	
	CreditTypeSummary: [],
}

cc.form = ko.mapping.fromJS(cc.templateForm);

cc.RenderGrid = function(){
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
		 		return "<button class='btn btn-xs btn-primary tooltipster' onclick='cc.getEdit(\""+ x.Id + "\")'><i class='fa fa-edit'></i></button>"
		 	},
		 	width : 50,
		 	     headerAttributes: { class: 'k-header header-bgcolor' },
		}]
	});
}

cc.removeCreditTypeSummary = function(index){
	return function(){
		var credit = cc.form.CreditTypeSummary().filter(function(d,i){
			return i !== index
		})

		cc.form.CreditTypeSummary(credit)
	}
}

cc.removeDetailReportSummary = function(index){
	return function(){
		var details = cc.form.DetailReportSummary().filter(function(d,i){
			return i !== index
		})

		cc.form.DetailReportSummary(details)
	}
}

cc.addDetailReportSummary = function(){
	cc.form.DetailReportSummary.push(cc.templateDetailReportSummary)
}

cc.addCreditTypeSummary = function(){
	cc.form.CreditTypeSummary.push(cc.templateCreditTypeSummary)
}

cc.saveReport = function(){
	var param = ko.mapping.toJS(cc.form);
	ajaxPost("/cibilcompany/update", param, function(res){
		if(res.success == true){
			cc.edit(false);
			swal("Success", "Data Save Successfully","success")
		}
	})
}

cc.backToMain = function(){
	cc.edit(false);
}

cc.getEdit = function(e){
	var data = $("#transgrid").data("kendoGrid").dataSource.data();
	var res = _.filter(data, function(dt){
		return dt.Id == e
	})

	if(res != undefined){
		var param = {CustomerId :res[0].ConsumersInfos.CustomerId, DealNo: res[0].ConsumersInfos.DealNo.toString()}
		ajaxPost("/cibilcompany/getdata", param, function(res){
			var data = res.data
			if(data != null && res.success == true){
				cc.edit(true);
				cc.setForm(data)
			}else{
				swal("Error", "Data not found", "error")
			}
		})
	}

}

function FilterInput(event) {
  var keyCode = ('which' in event) ? event.which : event.keyCode;

  isNotWanted = (keyCode == 69 || keyCode == 101);
  return !isNotWanted;
};

cc.setForm = function(data){
	ko.mapping.fromJS(data, cc.form)
	var FirstopenDate = (cc.form.ReportSummary.FirstCreditFacilityOpenDate()).replace(/\s/g, '');
	var LatestopenDate = (cc.form.ReportSummary.LatestCreditFacilityOpenDate()).replace(/\s/g, '');
	var MostRecentDate = (cc.form.EnquirySummary.MostRecentDate()).replace(/\s/g, '');
	cc.form.ReportSummary.FirstCreditFacilityOpenDate(FirstopenDate);
	cc.form.ReportSummary.LatestCreditFacilityOpenDate(LatestopenDate);
	cc.form.EnquirySummary.MostRecentDate(MostRecentDate);
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

	$('.entryEditCompany').collapsible({
	    accordion : true
	 });

	$("#filter").keydown(function(){
		setTimeout(function(){
			cc.RenderGrid();
		},500);  
	})
	
})