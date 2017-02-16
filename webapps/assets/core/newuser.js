var ns = {}
ns.Userdata = ko.observableArray([])
ns.roleList = ko.observableArray([])
ns.valuerole = ko.observableArray([])
ns.catStatusList = ko.observableArray(["Enable", "Disable"])
ns.status = ko.observable("")
ns.catstatus = ko.observable("")
ns.uid = ko.observable("")

ns.LoadGetUser = function(){
	ns.Userdata([])
	ajaxPost("/newuser/getuser", {}, function(res){
		var data = res.Data;
		if(data.length != 0){
			ns.Userdata(data)
			ns.LoadGridUser()
		}
	})
}

ns.LoadGridUser = function(){
	$("#gridUser").html("");
	$("#gridUser").kendoGrid({
		dataSource: new kendo.data.DataSource({
			transport: {
				read: function(o){
					ajaxPost("/newuser/getuser", {
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
	        		return {
	        			Data: data.Data.data,
	        			Total: data.Data.total
	        		}
	        	},
	            data: "Data",
	            total: "Total"
	        },
			serverPaging: true,
	        pageSize: 5,
		}),
		pageable: true,
		columns: [
			{
				field: "Username",
				title: "Name",
				headerAttributes : {"class":"header-bgcolor"}
			},
			{
				field: "ID",
				title: "Unique ID",
				headerAttributes : {"class":"header-bgcolor"},
				width: 100
			},
			{
				field: "Useremail",
				title: "Email ID",
				headerAttributes : {"class":"header-bgcolor"}
			},
			{
				field: "Role",
				title: "Role",
				headerAttributes : {"class":"header-bgcolor"},
				attributes:{"class": "no-padding"},
				template: function(d){
					var res = '';
					try{
						if((d.Role).length != 0 && d.Role != null){
							res += "<table role='grid'>"
							$.each(d.Role, function(i, item){
								res += "<tr>"
								res += "<td class='line' role='gridcell'>"+item+"</td>"
								res += "</tr>"
							})
							res += "</table>"
							return res
						}
					}catch(e){

					}
					

					return res
				}
			},
			{
				field: "Catrole",
				title: "CAT Role",
				headerAttributes : {"class":"header-bgcolor"},
				attributes:{"class": "no-padding"},
				template: function(d){
					var res = '';
					try{
						if((d.Catrole).length != 0 && d.Catrole != null){
							res += "<table role='grid'>"
							$.each(d.Catrole, function(i, item){
								res += "<tr>"
								res += "<td class='line' role='gridcell'>"+item+"</td>"
								res += "</tr>"
							})
							res += "</table>"
							return res
						}
					}catch(e){

					}
					

					return res
				}
			},
			{
				field: "Status",
				title: "Status",
				headerAttributes : {"class":"header-bgcolor"},
				width: 100,
			},
			{
				field: "Catstatus",
				title: "CAT Status",
				headerAttributes : {"class":"header-bgcolor"},
				width: 100,
			},
			{
				field: "",
				title: "Action",
				headerAttributes : {"class":"header-bgcolor"},
				width: 50,
				template: function(d){
					console.log(d.Role)
					if(d.Role != null){
						return "<center><button class='btn btn-xs btn-flat btn-warning  edituserright' onclick='ns.editUser(\""+d.uid+"\")'><span class='fa fa-edit'></span></button></center>"
					}

					return ''
					
				}
			},
		],
	});
}

ns.editUser = function(d){
	ns.roleList([]);
	ns.valuerole([]);
	ns.status("");
	ns.catstatus("");
	var index = $("#gridUser tr[data-uid='"+d+"']").index();
	var data = $('#gridUser').data('kendoGrid').dataSource.data();
	ns.roleList(data[index].Role);
	ns.valuerole(data[index].Catrole)
	ns.status(data[index].Status);
	ns.catstatus(data[index].Catstatus)
	if(ns.valuerole() == null){
		ns.valuerole([])
	}
	if(ns.catstatus() == "Enable"){
		$('#StatusFilter').bootstrapSwitch('state', true);
	}else{
		$('#StatusFilter').bootstrapSwitch('state', false);
	}
	ns.uid(d);
	$("#editUser").modal("show");
}

ns.saveEdit = function(d){
	var index = $("#gridUser tr[data-uid='"+d+"']").index();
	var data = $('#gridUser').data('kendoGrid').dataSource.data();
	data[index].Catrole = ns.valuerole();
	data[index].Status = ns.status();
	if($('#StatusFilter').bootstrapSwitch('state') == true){
		data[index].Catstatus = "Enable";
	}else{
		data[index].Catstatus = "Disable";
	}
	var param =ko.mapping.toJS(data[index]);
	console.log(param)
	ajaxPost("/newuser/saveuser", param, function(res){
		alert("berhasil")
	})
}

$(function(){
	ns.LoadGridUser()
	$("#gridUser").css("overflow", "hidden")
});