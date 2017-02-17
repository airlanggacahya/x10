var ns = {}
ns.Userdata = ko.observableArray([]);
ns.roleList = ko.observableArray([]);
ns.valuerole = ko.observableArray([]);
ns.catStatusList = ko.observableArray(["Enable", "Disable"]);
ns.status = ko.observable("");
ns.catstatus = ko.observable("");
ns.Password = ko.observable("");
ns.confPassword = ko.observable("");
ns.uid = ko.observable("");

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
		dataSource:{
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
	        pageSize: 10,
		},
		groupable: true,
		pageable: {
			refresh: true,
            pageSizes: true,
            buttonCount: 10
		},
		columns: [
			{
				field: "Username",
				title: "Name",
				headerAttributes : {"class":"header-bgcolor"}
			},
			{
				field: "Userid",
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
					

					return "To be assigned"
				}
			},
			{
				field: "Recstatus",
				title: "Status",
				headerAttributes : {"class":"header-bgcolor"},
				width: 100,
				template: function(d){
					if(d.Recstatus == "X"){
						return "Inactive"
					}

					return "Active"
				}
			},
			{
				field: "Catstatus",
				title: "CAT Status",
				headerAttributes : {"class":"header-bgcolor"},
				width: 100,
				template: function(d){
					if(d.Catstatus == ""){
						return "To be assigned"
					}

					return d.Catstatus
				}
			},
			{
				field: "",
				title: "Action",
				headerAttributes : {"class":"header-bgcolor"},
				width: 50,
				template: function(d){
					return "<center><button class='btn btn-xs btn-flat btn-warning  edituserright' onclick='ns.editUser(\""+d.uid+"\")'><span class='fa fa-edit'></span></button></center>"
					
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
	ns.Password("");
	ns.confPassword("");
	$(".conf").hide()
	var index = $("#gridUser tr[data-uid='"+d+"']").index();
	var data = $('#gridUser').data('kendoGrid').dataSource.data();
	ajaxPost("/newuser/getsysrole", {}, function(res){
		var data = res.Data;
		if(data.length != 0 || data != null){
			ns.roleList(data);
		}
	});
	if(data[index].Recstatus == "X"){
		ns.status("Inactive");
	}else{
		ns.status("Active");
	}
	ns.catstatus(data[index].Catstatus)
	if(data[index].Catrole == null){
		ns.valuerole([])
	}else{
		setTimeout(function(){
			ns.valuerole(data[index].Catrole)
		}, 200)
		
		console.log(ns.valuerole())
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
	if(ns.Password() == ns.confPassword() && ns.Password() != ""){
		var index = $("#gridUser tr[data-uid='"+d+"']").index();
		var data = $('#gridUser').data('kendoGrid').dataSource.data();
		data[index].Catrole = ns.valuerole();
		data[index].Catpassword = ns.Password();
		console.log("------------>>>>>", data[index].Userpassword)
		if($('#StatusFilter').bootstrapSwitch('state') == true){
			data[index].Catstatus = "Enable";
		}else{
			data[index].Catstatus = "Disable";
		}
		var param =ko.mapping.toJS(data[index]);
		console.log(param)
		ajaxPost("/newuser/saveuser", param, function(res){
			ns.LoadGridUser()
			$("#editUser").modal("hide");
		})
	}else{
		$(".conf").show()
	}
	
}

ns.onPass = function(){
	$(".conf").hide()
}

$(function(){
	ns.LoadGridUser()
	$("#gridUser").css("overflow", "hidden")
});