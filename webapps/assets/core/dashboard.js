var dash = {}

dash.Region = ko.observableArray([]) 
dash.RegionVal = ko.observable("") 
dash.Branch = ko.observableArray([]) 
dash.BranchVal = ko.observable("") 
dash.dataTemp = ko.observableArray([]) 
dash.dataonTemp = ko.observableArray([]) 
dash.product = ko.observableArray([])
dash.productVal = ko.observable("")
dash.scheme = ko.observableArray([])
dash.schemeVal = ko.observable("")
dash.cutomerName = ko.observableArray([]);
dash.DealNo = ko.observableArray([]);
dash.CA = ko.observableArray([]);
dash.RM = ko.observableArray([]);
dash.CAVal = ko.observable("");
dash.DealNoVal = ko.observable("");
dash.cutomerNameVal = ko.observable("");
dash.irdataVal = ko.observable("");

dash.getMasterData = function(){
	dash.Region([]);
	dash.Branch([]);
	dash.product([]);
	dash.scheme([]);
	dash.cutomerName([]);
	dash.DealNo([]);
	dash.CA([]);
	dash.RM([]);

	ajaxPost('/databrowser/getcombineddata', {}, function(res){
		var data = res.data;
		dash.dataonTemp(data)
		dt = _.groupBy(data, "_accountdetails.accountsetupdetails.product")
		$.each(dt, function(key, item){
			if(key != ""){
				dash.product.push(key)
			}
		})
		var temp1 = []
		var temp2 = []
		$.each(data, function(i, item){
			dash.cutomerName.push(item.CustomerName);
			if(item._accountdetails.accountsetupdetails.creditanalyst != ""){
				temp1.push(item._accountdetails.accountsetupdetails.creditanalyst)
				temp2.push(item._accountdetails.accountsetupdetails.rmname)
			}
		})

		dash.CA(_.uniqBy(temp1))
		dash.RM(_.uniqBy(temp2))

		sc =  _.groupBy(data, "_accountdetails.accountsetupdetails.scheme")
		$.each(sc, function(key, item){
			if(key != "" && key != "undefined"){
				dash.scheme.push(key)
			}
		})
	})

	ajaxPost('/dashboard/getbranch', {}, function(res){
		dash.dataTemp(res[0])
		dt = _.groupBy(res[0].Items, "region.name")
		$.each(dt, function(key, item){
			dash.Region.push(key)
		})

		nm = _.groupBy(res[0].Items, "name")

		$.each(nm, function(key, item){
			dash.Branch.push(key)
		})

	})
}

dash.cutomerNameVal.subscribe(function(value){
	dash.DealNo([]);
	dt = _.filter(dash.dataonTemp(), function(val){
		return val.CustomerName == value;
	})

	if(dt != undefined){
		$.each(dt, function(i, item){
			dash.DealNo.push(item.DealNo)
		})
	}
});

dash.RegionVal.subscribe(function(value){

	var res = []
	dash.Branch([]);
	var dt = _.groupBy(dash.dataTemp().Items, "region.name")
	$.each(dt, function(key, item){
		if(key == value){
			res = item
		}
	})
	$.each(res, function(i, item){
		dash.Branch.push(item.name)
	})
	
})

dash.BranchVal.subscribe(function(value){
	var res = []
	// dash.Region([]);
	dash.product([])
	dash.scheme([])
	var dt = _.groupBy(dash.dataTemp().Items, "name")
	$.each(dt, function(key, item){
		if(key == value){
			dash.RegionVal(item[0].region.name)
		}
	})

	fl = _.filter(dash.dataonTemp(), function(res){
		return res._accountdetails.accountsetupdetails.cityname == value
	})

	onfl = _.groupBy(fl, "_accountdetails.accountsetupdetails.product");
	$.each(onfl, function(key, item){
		// console.log(key)
		if(key != ""){
			dash.product.push(key)
		}
		
	})

	onsc = _.groupBy(fl, "_accountdetails.accountsetupdetails.scheme")
	$.each(onsc, function(key, item){
		// console.log(key)
		if(key != "" && key != "undefined"){
			dash.scheme.push(key)
		}
		
	})


})

dash.productVal.subscribe(function(value){
	var scheme = []
	pro = _.filter(dash.dataonTemp(), function(res){
		return res._accountdetails.accountsetupdetails.product == value
	})
	dash.Branch([]);
	br = _.groupBy(pro, "_accountdetails.accountsetupdetails.cityname")
	$.each(br, function(key, item){
		dash.Branch.push(key);
	})
	dash.scheme([])
	sc =  _.groupBy(pro, "_accountdetails.accountsetupdetails.scheme")
	$.each(sc, function(key, item){
		if(key != "" && key != "undefined"){

			dash.scheme.push(key)
		}
		
	})

})

dash.schemeVal.subscribe(function(value){
	dash.product([])
	sch = _.filter(dash.dataonTemp(), function(res){
		return res._accountdetails.accountsetupdetails.scheme == value
	})

	onfl = _.groupBy(sch, "_accountdetails.accountsetupdetails.product");
	console.log(onfl)
	$.each(onfl, function(key, item){
		console.log(key)
		if(key != ""){
			dash.product.push(key)
		}
		
	})
	
})

var irdata = [
	// {text: "Select", value: ''},
	{text: 'XFL-5', value:'<= 4.5'},
	{text: 'XFL-4', value:'> 4.5 < 6'},
	{text: 'XFL-3', value:'>= 6 < 7'},
	{text: 'XFL-2', value:'>= 7 <= 8.5'},
	{text: 'XFL-1', value:'> 8.5'},
]



$(function(){
	dash.getMasterData();
});