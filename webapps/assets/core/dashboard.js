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
dash.RMVal = ko.observable("");
dash.CAVal = ko.observable("");
dash.DealNoVal = ko.observable("");
dash.cutomerNameVal = ko.observable("");
dash.irdataVal = ko.observable("");
dash.countLocation = ko.observable(0);
dash.countVertical = ko.observable(0);
dash.countClients = ko.observable(0);
dash.countDeals = ko.observable(0);

dash.getMasterData = function(){
	dash.Region([]);
	dash.Branch([]);
	dash.product([]);
	dash.scheme([]);
	dash.cutomerName([]);
	dash.DealNo([]);
	dash.CA([]);
	dash.RM([]);
	dash.DealNo([]);

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
			dash.DealNo.push(item.DealNo);
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

dash.BranchList = function(){
	dash.scheme([]);
	dash.Branch([])
	nm = _.groupBy(dash.dataTemp().Items, "name");
	$.each(nm, function(key, item){
		dash.Branch.push(key)
	})
}

dash.productList = function(){
	dash.product([]);
	if(dash.BranchVal() != ""){
		fl = _.filter(dash.dataonTemp(), function(res){
			return res._accountdetails.accountsetupdetails.cityname == dash.Branch()
		})
		onfl = _.groupBy(fl, "_accountdetails.accountsetupdetails.product");
		$.each(onfl, function(key, item){
			// console.log(key)
			if(key != ""){
				dash.product.push(key)
			}
			
		})

	}else{
		dash.getMasterData()
	}
}

dash.cutomerNameVal.subscribe(function(value){
	if(value != "Select One" || value != ""){
		dash.DealNo([]);
		dt = _.filter(dash.dataonTemp(), function(val){
			return val.CustomerName == value;
		})


		if(dt != undefined){
			$.each(dt, function(i, item){
				dash.DealNo.push(item.DealNo)
			})
		}

		dash.FilterField()[6].Value = value;
		
	}
	if(value == "Select One" || value == ""){
		if(dash.BranchVal() != ""){
			dash.DealNo[""]
			fl = _.filter(dash.dataonTemp(), function(res){
				return res._accountdetails.accountsetupdetails.cityname == dash.BranchVal()
			})

			city =  _.groupBy(fl, "_accountdetails.accountsetupdetails.cityname");
			// var oncity = [];
			var ondeal = [];
			$.each(city, function(key, items){
				$.each(items, function(i, k){
					// oncity.push(k.CustomerName);
					ondeal.push(k.DealNo);
				})
			})

			// dash.cutomerName(_.uniqBy(oncity));
			setTimeout(function(){
				dash.DealNo(_.uniqBy(ondeal));
			}, 200)
		}else{
			dash.getMasterData()
		}
	}
	dash.SaveFilter();
	
});

dash.DealNoVal.subscribe(function(value){
	if(value != "Select One" || value != ""){
		dash.FilterField()[7].Value = value;
	}
	if (value == "Select One" || value == ""){
		if(dash.BranchVal() != ""){
			dash.DealNo[""]
			fl = _.filter(dash.dataonTemp(), function(res){
				return res._accountdetails.accountsetupdetails.cityname == dash.BranchVal()
			})

			city =  _.groupBy(fl, "_accountdetails.accountsetupdetails.cityname");
			var oncity = [];
			// var ondeal = [];
			$.each(city, function(key, items){
				$.each(items, function(i, k){
					oncity.push(k.CustomerName);
					// ondeal.push(k.DealNo);
				})
			})

			dash.cutomerName(_.uniqBy(oncity));
			// setTimeout(function(){
			// 	dash.DealNo(_.uniqBy(ondeal));
			// }, 200)
		}else{
			dash.getMasterData()
		}
	}

	dash.SaveFilter();
})

dash.RegionVal.subscribe(function(value){
	if(value != "Select One" || value != ""){
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

		dash.FilterField()[0].Value = value;
		if(dash.Branch().length == 0){
			dash.BranchList()
		}


	}
	if(value == "Select One" || value == ""){
		dash.RegionVal("")
		dash.getMasterData();
	}

	dash.SaveFilter();
	
})

dash.BranchVal.subscribe(function(value){
	if(value != "Select One" || value != ""){
		var res = []
		// dash.Region([]);
		dash.product([])
		dash.cutomerName([]);
		dash.DealNo([])
		dash.CA([]);
		dash.RM([]);
		var dt = _.groupBy(dash.dataTemp().Items, "name")
		$.each(dt, function(key, item){
			if(key == value){
				dash.RegionVal(item[0].region.name)
			}
		})

		fl = _.filter(dash.dataonTemp(), function(res){
			return res._accountdetails.accountsetupdetails.cityname == value
		})

		var inca = []
		onca = _.groupBy(fl, "_accountdetails.accountsetupdetails.creditanalyst");
		$.each(onca, function(key, item){
			if(key != ""){
				inca.push(key)
			}
			
		})
		dash.CA(_.uniqBy(inca))

		var inrm = []
		onrm = _.groupBy(fl, "_accountdetails.accountsetupdetails.rmname");
		$.each(onrm, function(key, item){
			if(key != ""){
				inrm.push(key)
			}
			
		})
		dash.RM(_.uniqBy(inrm))

		onfl = _.groupBy(fl, "_accountdetails.accountsetupdetails.product");
		$.each(onfl, function(key, item){
			// console.log(key)
			if(key != ""){
				dash.product.push(key)
			}
			
		})

		city =  _.groupBy(fl, "_accountdetails.accountsetupdetails.cityname");
		var oncity = [];
		var ondeal = [];
		$.each(city, function(key, items){
			$.each(items, function(i, k){
				oncity.push(k.CustomerName);
				ondeal.push(k.DealNo);
			})
		})

		dash.cutomerName(_.uniqBy(oncity));
		setTimeout(function(){
			dash.DealNo(_.uniqBy(ondeal));
		}, 200)

		dash.scheme([])
		onsc = _.groupBy(fl, "_accountdetails.accountsetupdetails.scheme")
		$.each(onsc, function(key, item){
			// console.log(key)
			if(key != "" && key != "undefined"){
				dash.scheme.push(key)
			}
			
		})

		dash.FilterField()[1].Value = value;

	}

	if(value == "Select One" || value == ""){
		dash.scheme([]);
		dash.BranchVal("")
		if(dash.Branch().length == 0){
			dash.BranchList()
		}else{
			dash.getMasterData();
		}
	}

	dash.SaveFilter();
	
})

dash.productVal.subscribe(function(value){
	if(value != "Select One" || value != ""){
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

		dash.FilterField()[2].Value = value;
	}
	if(value == "Select One" || value == ""){
		dash.productVal("")
		dash.productList()
	}

	dash.SaveFilter();
})

dash.schemeVal.subscribe(function(value){
	if(value != "Select One" || value != ""){
		dash.product([]);
		dash.cutomerName([]);
		dash.CA([]);
		dash.RM([]);
		sch = _.filter(dash.dataonTemp(), function(res){
			return res._accountdetails.accountsetupdetails.scheme == value
		})

		var temp1 = [];
		var temp2 = [];
		$.each(sch, function(i, item){
			dash.cutomerName.push(item.CustomerName);
			temp1.push(item._accountdetails.accountsetupdetails.creditanalyst);
			temp2.push(item._accountdetails.accountsetupdetails.rmname);
		})

		dash.CA(_.uniqBy(temp1))
		dash.RM(_.uniqBy(temp2))

		onfl = _.groupBy(sch, "_accountdetails.accountsetupdetails.product");
		console.log(onfl)
		$.each(onfl, function(key, item){
			console.log(key)
			if(key != ""){
				dash.product.push(key)
			}
			
		})

		dash.FilterField()[3].Value = value;
		
	}
	if(value == "Select One" || value == ""){
		dash.schemeVal("")
		dash.scheme([]);
		if(dash.Branch() != ""){
			fl = _.filter(dash.dataonTemp(), function(res){
				return res._accountdetails.accountsetupdetails.cityname == value
			})
			onsc = _.groupBy(fl, "_accountdetails.accountsetupdetails.scheme")
			$.each(onsc, function(key, item){
				// console.log(key)
				if(key != "" && key != "undefined"){
					dash.scheme.push(key)
				}
				
			})
		}else{
		
			dash.getMasterData();
		}
		
	}

	dash.SaveFilter();
	
})

dash.DealNoVal.subscribe(function(value){
	if(value != "Select One" || value != ""){
		dash.FilterField()[7].Value = value;
		dash.SaveFilter();
	}else if(value == "Select One" || value != ""){
		alert("masukk")
		dash.DealNoVal("")
		dash.getMasterData();
	}
	
})

dash.irdataVal.subscribe(function(value){
	if(value != "Select One" || value != ""){
		dash.FilterField()[8].Value = value;
		dash.SaveFilter();
	}
	if(value == "Select One" || value == ""){
		dash.irdataVal("");
		dash.getMasterData();
	}
	
})

dash.CAVal.subscribe(function(value){
	if(value != "Select One" || value != ""){
		dash.FilterField()[10].Value = value;
		data = _.filter(dash.dataonTemp(), function(item){
			return item._accountdetails.accountsetupdetails.creditanalyst == value;
		})
		
		dash.CA([]);
		var inca = []
		$.each(data, function(i, key){
			inca.push(key._accountdetails.accountsetupdetails.creditanalyst)
		})
		dash.CA(_.uniqBy(inca));

		dash.cutomerName([]);
		var cust = []
		$.each(data, function(i, key){
			cust.push(key.CustomerName)
		})
		dash.cutomerName(cust)

		dash.DealNo([]);
		var deal = [];
		$.each(data, function(i, key){
			deal.push(key.DealNo)
		})
		dash.DealNo(deal)

		dash.product([]);
		var pro = []
		$.each(data, function(i, key){
			pro.push(key._accountdetails.accountsetupdetails.product)
		})
		dash.product(_.uniqBy(pro));

		dash.scheme([]);
		var sc = []
		$.each(data, function(i, key){
			sc.push(key._accountdetails.accountsetupdetails.scheme)
		})
		dash.scheme(_.uniqBy(sc));

		dash.Branch([]);
		var br = [];
		$.each(data, function(i, key){
			br.push(key._accountdetails.accountsetupdetails.cityname)
		})
		dash.Branch(_.uniqBy(br));
	}
	if(value == "Select One" || value == ""){
		dash.CAVal("")
		dash.getMasterData();
	}

	dash.SaveFilter();
})

dash.RMVal.subscribe(function(value){
	if(value != "Select One" || value != ""){
		dash.FilterField()[11].Value = value;

		data = _.filter(dash.dataonTemp(), function(item){
			return item._accountdetails.accountsetupdetails.rmname == value;
		})
		
		dash.CA([]);
		var inca = []
		$.each(data, function(i, key){
			inca.push(key._accountdetails.accountsetupdetails.creditanalyst)
		})
		dash.CA(_.uniqBy(inca));

		dash.cutomerName([]);
		var cust = []
		$.each(data, function(i, key){
			cust.push(key.CustomerName)
		})
		dash.cutomerName(cust)

		dash.DealNo([]);
		var deal = [];
		$.each(data, function(i, key){
			deal.push(key.DealNo)
		})
		dash.DealNo(deal)

		dash.product([]);
		var pro = []
		$.each(data, function(i, key){
			pro.push(key._accountdetails.accountsetupdetails.product)
		})
		dash.product(_.uniqBy(pro));

		dash.scheme([]);
		var sc = []
		$.each(data, function(i, key){
			sc.push(key._accountdetails.accountsetupdetails.scheme)
		})
		dash.scheme(_.uniqBy(sc));

		dash.Branch([]);
		var br = [];
		$.each(data, function(i, key){
			br.push(key._accountdetails.accountsetupdetails.cityname)
		})
		dash.Branch(_.uniqBy(br));
		// dash.onfilter(data, value)


	}
	if(value == "Select One" || value == ""){
		dash.RMVal("");
		// if(dash.BranchVal() != ""){

		// }else{
			dash.getMasterData();
		// }
		
	}

	dash.SaveFilter();
	
})

dash.onfilter = function(data,value){
	dash.cutomerName([]);
	var cust = []
	$.each(data, function(i, key){
		cust.push(key.CustomerName)
	})
	dash.cutomerName(cust)

	dash.DealNo([]);
	var deal = [];
	$.each(data, function(i, key){
		deal.push(key.DealNo)
	})
	dash.DealNo(deal)

	dash.product([]);
	var pro = []
	$.each(data, function(i, key){
		pro.push(key._accountdetails.accountsetupdetails.product)
	})
	dash.product(_.uniqBy(pro));

	dash.scheme([]);
	var sc = []
	$.each(data, function(i, key){
		sc.push(key._accountdetails.accountsetupdetails.scheme)
	})
	dash.scheme(_.uniqBy(sc));

	dash.Branch([]);
	var br = [];
	$.each(data, function(i, key){
		br.push(key._accountdetails.accountsetupdetails.cityname)
	})
	dash.Branch(_.uniqBy(br));
}

dash.SaveFilter = function(){
	if(vm.open() == true){
		dash.Filter.Filters(dash.FilterField());
		var param = ko.mapping.toJS(dash.Filter)
		ajaxPost("/dashboard/savefilter", param, function(res){
			console.log(res)
		})
	}

}

var irdata = [
	// {text: "Select", value: ''},
	{text: 'XFL-5', value:'<= 4.5'},
	{text: 'XFL-4', value:'> 4.5 < 6'},
	{text: 'XFL-3', value:'>= 6 < 7'},
	{text: 'XFL-2', value:'>= 7 <= 8.5'},
	{text: 'XFL-1', value:'> 8.5'},
]

dash.FilterTemplate = {
	Id : "",
	Filters: []
}

dash.FilterField = ko.observableArray([
	{
		FilterName: "Region", //0
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "Branch",//1
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "Product",//2
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "Scheme",//3
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "Client Type",//4
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "Client Turnover",//5
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "Customer Name",//6
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "Deal No",//7
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "Internal rating",//8
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "Status",//9
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "CA",//10
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "RM",//11
		ShowMe : true,
		Value : ""
	},
	{
		FilterName: "Loan Value Type",//12
		ShowMe : true,
		Value : ""
	}

]);

dash.Filter = ko.mapping.fromJS(dash.FilterTemplate);

dash.accordionSideBar = function(){
	$(".toggle").click(function(e){
		e.preventDefault();

		var $this = $(this);
		if($this.next().hasClass('show')){
			$this.next().removeClass('show');
			$this.next().slideUp(350);
			$this.find("h5>").removeClass("fa-chevron-down");
			$this.find("h5>").addClass("fa-chevron-up");

		}else{
			$this.next().removeClass('hide');
			$this.next().slideDown(350);
			$this.next().addClass("show");
			$this.find("h5>").addClass("fa-chevron-down");
			$this.find("h5>").removeClass("fa-chevron-up");
		}
	})

	$("#all").click(function(e){
		$(".toggle").next().removeClass('hide');
		$(".toggle").next().slideDown(350).addClass("show");
		$(".toggle").find("h5>").addClass("fa-chevron-down");
		$(".toggle").find("h5>").removeClass("fa-chevron-up");
		// for(var i=0; i< $(".cl").length; i++){
		// 	dash.Filter.Filters()[i].ShowMe = true;
		// 	dash.FilterField()[i].ShowMe = true;
		// }
		
		dash.Filter.Filters()[3].ShowMe = true;
		dash.Filter.Filters()[4].ShowMe = true;
		dash.Filter.Filters()[5].ShowMe = true;
		dash.Filter.Filters()[6].ShowMe = true;
		dash.Filter.Filters()[7].ShowMe = true;
		dash.Filter.Filters()[8].ShowMe = true;
		dash.Filter.Filters()[9].ShowMe = true;
		dash.Filter.Filters()[10].ShowMe = true;
		dash.Filter.Filters()[11].ShowMe = true;
		dash.Filter.Filters()[12].ShowMe = true;
		dash.FilterField()[0].ShowMe = true;
		dash.FilterField()[1].ShowMe = true;
		dash.FilterField()[2].ShowMe = true;
		dash.FilterField()[3].ShowMe = true;
		dash.FilterField()[4].ShowMe = true;
		dash.FilterField()[5].ShowMe = true;
		dash.FilterField()[6].ShowMe = true;
		dash.FilterField()[7].ShowMe = true;
		dash.FilterField()[8].ShowMe = true;
		dash.FilterField()[9].ShowMe = true;
		dash.FilterField()[10].ShowMe = true;
		dash.FilterField()[11].ShowMe = true;
		dash.FilterField()[12].ShowMe = true;
		dash.countLocation(0);
		dash.countVertical(0);
		dash.countClients(0);
		dash.countDeals(0);
		dash.SaveFilter()
		$(".form-group").show()
	})

	$(".cl0").click(function(e){
		e.preventDefault();
		var $this = $(this);
		var index = $(".cl0").index($this);
		dash.FilterField()[index].ShowMe = false;
		$($this.parent()).hide()
		dash.countLocation(dash.countLocation() + 1);
		if(index == 0){
			dash.FilterField()[0].ShowMe = false;
		}else{
			dash.FilterField()[1].ShowMe = false;
		}

		dash.SaveFilter()
	})

	$(".cl1").click(function(e){
		e.preventDefault();
		var $this = $(this);
		var index = $(".cl1").index($this);
		dash.FilterField()[index].ShowMe = false;
		$($this.parent()).hide()
		dash.countVertical(dash.countVertical() + 1)
		if(index == 0){
			dash.FilterField()[2].ShowMe = false;
		}else{
			dash.FilterField()[3].ShowMe = false;
		}

		dash.SaveFilter()
	})

	$(".cl2").click(function(e){
		e.preventDefault();
		var $this = $(this);
		var index = $(".cl2").index($this);
		dash.FilterField()[index].ShowMe = false;
		$($this.parent()).hide()
		dash.countClients(dash.countClients() + 1)
		if(index == 0){
			dash.FilterField()[4].ShowMe = false;
		}else if(index == 1){
			dash.FilterField()[5].ShowMe = false;
		}else if(index == 2){
			dash.FilterField()[6].ShowMe = false;
		}else if(index == 3){
			dash.FilterField()[7].ShowMe = false;
		}

		dash.SaveFilter()
	})

	$(".cl3").click(function(e){
		e.preventDefault();
		var $this = $(this);
		var index = $(".cl3").index($this);
		dash.FilterField()[index].ShowMe = false;
		$($this.parent()).hide()
		dash.countDeals(dash.countDeals() + 1)
		if(index == 0){
			dash.FilterField()[8].ShowMe = false;
		}else if(index == 1){
			dash.FilterField()[9].ShowMe = false;
		}else if(index == 2){
			dash.FilterField()[10].ShowMe = false;
		}else if(index == 3){
			dash.FilterField()[11].ShowMe = false;
		}else if(index == 4){
			dash.FilterField()[12].ShowMe = false;
		}

		dash.SaveFilter()
	})
}

dash.getFilterData = function(){
	ajaxPost("/dashboard/getfilter", {}, function(res){
		if(res.Data != null){
			var data = res.Data[0];
			ko.mapping.fromJS(data, dash.Filter)
			dash.FilterField(data.Filters)
			var fl = ko.mapping.toJS(dash.Filter.Filters())
			console.log(fl[0].Value)
			dash.RegionVal(fl[0].Value);
			dash.BranchVal(fl[1].Value);
			dash.productVal(fl[2].Value);
			dash.schemeVal(fl[3].Value);
			dash.cutomerNameVal(fl[6].Value);
			dash.DealNoVal(fl[7].Value);
			dash.DealNoVal(fl[7].Value);
			dash.irdataVal(fl[8].Value)
			dash.CAVal(fl[10].Value);
			dash.RMVal(fl[11].Value);

			if(!fl[0].ShowMe && !fl[1].ShowMe ){
				dash.countLocation(2);
			}

			if(!fl[2].ShowMe && !fl[3].ShowMe){
				dash.countVertical(2);
			}

			if(!fl[4].ShowMe && !fl[5].ShowMe && !fl[6].ShowMe && !fl[7].ShowMe){
				dash.countClients(4)
			}

			if(!fl[8].ShowMe && !fl[9].ShowMe && !fl[10].ShowMe && !fl[11].ShowMe && !fl[12].ShowMe){
				dash.countDeals(5)
			}
		}
		
	})
}

dash.reset = function(){
	dash.getMasterData();
	dash.cutomerNameVal("");
	dash.DealNoVal("");
	dash.CAVal("");
	dash.RMVal("");
	dash.schemeVal("");
	dash.productVal("");
	// dash.BranchVal("");
	dash.RegionVal("");

}

$(function(){
	dash.accordionSideBar()
	dash.getMasterData();
	setTimeout(function(){
		dash.getFilterData()
	}, 500)
	
});