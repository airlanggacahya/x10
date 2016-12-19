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

cc.templateProfile = {
	CompanyName: '',
	DealNo: '',
	CustomerId: 0,
	DunsNumber: '',
	Pan: '',
	Address: '',
	CityTown: '',
	Telephone: '',
	StateUnion: '',
	PinCode: '',
	Country: '',
	FileOpenDate: '',
}

cc.templateForm = {
	ReportSummary: cc.templateReportSummary,
	EnquirySummary: cc.templateEnquirySummary,
	DetailReportSummary:[],
	CreditTypeSummary: [],
	Profile: cc.templateProfile,
}

cc.form = ko.mapping.fromJS(cc.templateForm);

cc.RenderGrid = function(){
	var searchKey = $("#filter").val().toLowerCase();

	$("#transgrid").html("");
	$("#transgrid").kendoGrid({
		dataSource: new kendo.data.DataSource({
	        transport: {
	            read: function(o) {
	            	ajaxPost("/cibilcompany/getalldata", {
               			searchkey: searchKey,
	               		additional: function(){
	               			if(searchKey != ""){
		               			var foundCust = _.uniq(
		               				_.map(
		               					_.filter(filter().CustomerSearchAll(), function(cust){
		               						return cust.customer_name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
		               					}), function(cust){
		               						return cust.customer_id
		               					}
		               				)
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
	               		cc.isLoading(false)
	               	})
	            }
	        },
	        schema: {
	        	parse: function(data){
	        		cc.AllData([])
	        		cc.AllData(data.Res.Data)

	       //  		_.each(cc.AllData(), function(x){
					 		// 	_.extend(x, function(cust){
					 		// 		return { CustomerName: cust != undefined ? cust.customer_name : "" }
					 		// 	}(_.find(filter().CustomerSearchAll(), function(xi){
					 		// 		return xi.customer_id == x.ConsumersInfos.CustomerId
					 		// 	})));
				 			// })

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
		 	field : "Profile.CompanyName",
		 	title : "Customer Name",
		 	headerAttributes: { class: 'k-header header-bgcolor' },
		 	width: 200
		}, {
			field : "Profile.DealNo",
		 	title : "Deal Number",
			headerAttributes: { class: 'k-header header-bgcolor' },
			width: 150
		}, {
			field : 'Profile.Pan',
			title : 'Pan',
			headerAttributes: { class: 'k-header header-bgcolor' },
			width : 150
		}, {
			field : 'Profile.DunsNumber',
			title : 'Duns Number',
			headerAttributes: { class: 'k-header header-bgcolor' },
			width : 150
		}, {
		 	field : "Profile.FileOpenDate",
		 	title : "File Open Date",
			headerAttributes: { class: 'k-header header-bgcolor' },
			width : 150
		}, {
		 	field : "Profile.CityTown",
		 	title : "City",
			width : 100,
			headerAttributes: {class: 'k-header header-bgcolor'}
		}, {
		 	field : "Profile.StateUnion",
		 	title : "State",
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

cc.loadDateString = function(){
	var FileOpenDate = kendo.toString(new Date(cc.form.Profile.FileOpenDate()), "dd-MMM-yyyy");
	cc.form.Profile.FileOpenDate(FileOpenDate);

	var FirstopenDate = kendo.toString(new Date(cc.form.ReportSummary.FirstCreditFacilityOpenDate()), "dd-MMM-yyyy");
	cc.form.ReportSummary.FirstCreditFacilityOpenDate(FirstopenDate);

	var LatestopenDate = kendo.toString(new Date(cc.form.ReportSummary.LatestCreditFacilityOpenDate()), "dd-MMM-yyyy");
	cc.form.ReportSummary.LatestCreditFacilityOpenDate(LatestopenDate);

	var MostRecentDate = kendo.toString(new Date(cc.form.EnquirySummary.MostRecentDate()), "dd-MMM-yyyy");
	cc.form.EnquirySummary.MostRecentDate(MostRecentDate);

	// var FileOpen = kendo.toString(new Date(cc.form.EnquirySummary()), "dd-MMM-yyyy");
	// cc.form.Profile.FileOpenDate(FileOpen)

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
	cc.loadDateString()
	var param = ko.mapping.toJS(cc.form);
	ajaxPost("/cibilcompany/update", param, function(res){
		if(res.success == true){
			// $('#transgrid').data('kendoGrid').dataSource.read();
			cc.edit(false);
			cc.RenderGrid();
			swal("Success", "Data Save Successfully","success")
		}
	})
}

cc.backToMain = function(){
	cc.edit(false);
	cc.RenderGrid()
}

cc.getEdit = function(e){
	var data = $("#transgrid").data("kendoGrid").dataSource.data();
	var res = _.filter(cc.AllData(), function(dt){
		return dt.Id == e
	})

	console.log(res[0])
	if(res != undefined){
		cc.edit(true)
		cc.setForm(res[0])

		// var param = {CustomerId :res[0].ConsumersInfos.CustomerId, DealNo: res[0].ConsumersInfos.DealNo.toString()}
		// ajaxPost("/cibilcompany/getdata", param, function(res){
		// 	var data = res.data
		// 	if(data != null && res.success == true){
		// 		cc.edit(true);
		// 		cc.setForm(res[0])
		// 	}else{
		// 		swal("Error", "Data not found", "error")
		// 	}
		// })
	}
}

function FilterInput(event) {
  var keyCode = ('which' in event) ? event.which : event.keyCode;

  isNotWanted = (keyCode == 69 || keyCode == 101);
  return !isNotWanted;
};

cc.scroll = function(){
	var elementPosition = $('.btnFixed').offset();
	$(window).scroll(function(){
	    if($(window).scrollTop() > elementPosition.top){
	          $('.btnFixed').removeClass('static');
	          $('.btnFixed').addClass('fixed');
	    } else {
	        $('.btnFixed').removeClass('fixed');
	       	$('.btnFixed').addClass('static');
	    }
	});
}

cc.setForm = function(data){
	ko.mapping.fromJS(data, cc.form)

	_.each(cc.form.CreditTypeSummary(), function(o){
		o.Standard(o.Standard().split(",").join(""));
		o.Substandard(o.Substandard().split(",").join(""));
		o.Doubtful(o.Doubtful().split(",").join(""));
		o.Loss(o.Loss().split(",").join(""));
		o.SpecialMention(o.SpecialMention().split(",").join(""));
		o.TotalCurrentBalance(o.TotalCurrentBalance().split(",").join(""));
	})

	_.each(cc.form.DetailReportSummary(), function(o){
		o.CurrentBalanceOtherThanStandard(o.CurrentBalanceOtherThanStandard().split(",").join(""));
		o.CurrentBalanceStandard(o.CurrentBalanceStandard().split(",").join(""));
		o.NoOfLawSuits(o.NoOfLawSuits().split(",").join(""));
		o.NoOfOtherThanStandard(o.NoOfOtherThanStandard().split(",").join(""));
		o.NoOfStandard(o.NoOfStandard().split(",").join(""));
		o.NoOfWilfulDefaults(o.NoOfWilfulDefaults().split(",").join(""));
	})

	var FirstopenDate = (cc.form.ReportSummary.FirstCreditFacilityOpenDate()).replace(/\s/g, '');
	var LatestopenDate = (cc.form.ReportSummary.LatestCreditFacilityOpenDate()).replace(/\s/g, '');
	var MostRecentDate = (cc.form.EnquirySummary.MostRecentDate()).replace(/\s/g, '');
	var FileOpen = (cc.form.Profile.FileOpenDate()).replace(/\s/g, '');
	cc.form.ReportSummary.FirstCreditFacilityOpenDate(FirstopenDate);
	cc.form.ReportSummary.LatestCreditFacilityOpenDate(LatestopenDate);
	cc.form.EnquirySummary.MostRecentDate(MostRecentDate);
	cc.form.Profile.FileOpenDate(FileOpen)
}

function GetCustomer(){
	var url = "/datacapturing/getcustomerprofilelist";
	  ajaxPost(url, "", function(data) {
	    filter().CustomerSearchAll(data);
		cc.RenderGrid();
	});
}

cc.isLoading = function (what) {
    $('.apx-loading')[what ? 'show' : 'hide']()
    $('.app-content')[what ? 'hide' : 'show']()
}

$(document).ready(function(){
	cc.scroll();
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