var formula ={
	dataSource:ko.observableArray([
		{ id:  "1", Title: "HC1", Type:"section", Formula: "", value: "0", parentId: null },
		{ id:  "2", Title: "HC1.1", Type:"sub section", Formula: "", value: 0, parentId: "1" },
		{ id:  "4", Title: "HC1a", Type:"field", Formula: "", value: "0", parentId: "2" },
		{ id:  "5", Title: "HC1b", Type:"field", Formula: "", value: "0", parentId: "2" },
		{ id:  "6", Title: "HC1c", Type:"field", Formula: "", value: "0", parentId: "2" },
		{ id:  "7", Title: "HC1d", Type:"field", Formula: "", value: "0", parentId: "2" },
		{ id:  "8", Title: "HC2", Type:"section", Formula: "", value: "0", parentId: null },
		{ id:  "9", Title: "HC2.1", Type: "sub section", Formula: "", value: "0", parentId: "8" },
		{ id:  "10", Title: "HC2a", Type: "field", Formula: "", value: "0", parentId: "9" },
		{ id:  "11", Title: "HC2b", Type: "field", Formula: "", value: "0", parentId: "9" },
		{ id:  "12", Title: "HC2c", Type: "field", Formula: "", value: "0", parentId: "9" },
		{ id:  "13", Title: "HC2d", Type: "field", Formula: "", value: "0", parentId: "9" },
		
	]),
	datasource: ko.observableArray([
		{ 
		    id : "bsc01", 
		    Title : "Total Income", 
		    parentId : null, 
		    Formula : "bs01+bs02+bs03"
		},
		{ 
		    id : "bsc02", 
		    Title : "Cost of Goods Sold (COGS)", 
		    parentId : "bs07", 
		    Formula : "(bs04+bs05+bs06+bs07)-bs06*2"
		},
		{ 
		    id : "bsc03", 
		    Title : "Gross Profit (as per books)", 
		    parentId : "bsc02", 
		    Formula : "bsc01-bsc02"
		},
		{ 
		    id : "bsc04", 
		    Title : "Gross Profit (Excl. Non Business Income)", 
		    parentId : "bsc03", 
		    Formula : "bsc01-bsc02-bs03"
		},
		// { 
		//     id : "bsc05", 
		//     Title : "Profit Before Tax (as per books)", 
		//     parentId : "bs15", 
		//     Formula : "bsc03-(bs08+bs09+bs10+bs11+bs12+bs13+bs14+bs15)"
		// },
		{ 
		    id : "bsc06", 
		    Title : "Profit Before Tax (Excl. Non Business Income)", 
		    parentId : "bsc05", 
		    Formula : "bsc04-(bs08+bs09+bs10+bs11+bs12+bs13+bs14+bs15)"
		}
		
	]),

	allData: ko.observableArray([]),
}

formula.loadGrid = function(){
	$(".formula").kendoTreeList({ 
		dataSource:{
			data: formula.dataSource(),
			schema:{
				model:{
					expanded: true,

				},
				
			},
		},
		dataBound: function(){
			$(".formula").find(".tooltipster").tooltipster({
                trigger: 'hover',
                theme: 'tooltipster-val',
                animation: 'grow',
                delay: 0,
            });
            var dataView = this.dataSource.view();
            // console.log(dataView);
			for(var i = 0; i < dataView.length; i++){
				if (dataView[i].Type === "costume field"){
                    var uid = dataView[i].uid;
                    var tr = $(".grid tbody").find("tr[data-uid=" + uid + "]");
                    tr.addClass('coba');
                }
            }
		},
		columns: [
			{
				field: "Title",
				title: "Title",
				headerAttributes: { "class": "k-header header-bgcolor" },
				expandable: true,
				width: 500,
				template: function(d){
					if(d.Type ==="costume field"){
						return '<input value="'+d.Title+'" style="border: none; background-color: transparent;width: 90%; font-weight: normal; padding: 1px 4px;" class="align-left" />'
					}

					return d.Title
				}
			},
			{
				field: "Type",
				title: "Type",
				headerAttributes: { "class": "k-header header-bgcolor" },
				width: 75,
			},
			{
				headerAttributes: { "class": "k-header header-bgcolor" },
				title: "Formula",
				width: 100,
				template: function(d){
					if(d.Type !== "costume field"){
						return ''
					}
					return '<input value="'+d.Formula+'" style="border: none; background-color: transparent;width: 98%; font-weight: normal; padding: 1px 4px;" class="align-right" />'
				},

			},
			//{ command: [ "edit", "destroy", "createchild" ] },
			{
				headerAttributes: { "class": "k-header header-bgcolor" },
				width: 50,
				template: function(d){

					if(d.Type ==="costume field"){
						return '<button id="newchild" onclick="formula.addClick(\''+d.uid+'\')" class="btn btn-xs btn-flat btn-primary tooltipster" title="Add Formula" ><i class="fa fa-plus"></i></button>'
					}else if(d.Type ==="section" || d.Type ==="sub section"){
						return ''
					}

					return '<button id="newchild" onclick="formula.rowClick(\''+d.uid+'\')" class="btn btn-xs btn-flat btn-success tooltipster" title="Add Row" ><i class="fa fa-plus"></i></button>'
					
				}

			}
		],
		editable: true,
	});
}


formula.rowClick = function (uid) {
	var tree = $('.formula').data('kendoTreeList');
	// console.log(uid)
	var index = $('.formula tr[data-uid="'+uid+'"]').index();
	var data = $(".formula").data("kendoTreeList").dataSource.data()[index]
	kendo.data.TreeListDataSource
	var allData = $(".formula").data("kendoTreeList").dataSource.data()
	var newRow = { 
		id:  10 + index, 
		Title: "", 
		Type:"costume field",
		Formula:"", 
		value: "0", 
		parentId: data.parentId
	}
	console.log(index+1);
	allData.splice(index+1, 0, newRow);
}

formula.addClick = function(uid){
	var index = $('.formula tr[data-uid="'+uid+'"]').index();
	var data = $(".formula").data("kendoTreeList").dataSource.data()[index]
	var tr = $('.formula tr[data-uid="'+uid+'"]');
	var td0 = tr.find('td').eq(0)
	var td2 = tr.find('td').eq(2)
	var val0 = td0.find('input').val()
	var val2 = td2.find('input').val()
	formula.allData.push(
		{
			_id : "bsc00"+index, 
		    Title : val0, 
		    PutAfter : data.parentId, 
		    Formula : val2
		}
	)
}
$(document).ready(function(){
	formula.loadGrid();
});