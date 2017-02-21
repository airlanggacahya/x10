var ns = {}
ns.Userdata = ko.observableArray([]);
ns.roleList = ko.observableArray([]);
ns.valuerole = ko.observableArray([]);
ns.param = ko.observableArray([]);
ns.catStatusList = ko.observableArray(["Enable", "Disable"]);
ns.status = ko.observable("");
ns.catstatus = ko.observable("");
ns.Password = ko.observable("");
ns.confPassword = ko.observable("");
ns.uid = ko.observable("");
ns.username = ko.observable("");
ns.email = ko.observable("");
ns.uniqueid = ko.observable("");
ns.role = ko.observable("");

ns.LoadGetUser = function(){
	ns.Userdata([])
	ajaxPost("/newuser/getuser", {}, function(res){
		var data = res.Data.data;
		if(data.length != 0){
			ns.Userdata(data)
			ns.param(data)
			$.each(ns.Userdata(), function(i, temp){
				if(temp.Recstatus == "X"){
					temp.Recstatus = "Inactive";
				}else if(temp.Recstatus == "A"){
					temp.Recstatus = "Active";
				}else{
					temp.Recstatus = "To be assigned";
				}

				if(temp.Catstatus == ""){
					temp.Catstatus = "To be assigned"
				}
				if(temp.Catrole != null){

					temp.Catrole = temp.Catrole.join("|")
				}else{
					temp.Catrole = "To be assigned";
				}

				if(temp.Role != null){

					temp.Role = temp.Role.join("|");
				}
				

			})
			ns.LoadGridUser()
		}
	})
}

ns.LoadGridUser = function(){
	$("#gridUser").html("");
	$("#gridUser").kendoGrid({
		// dataSource: ns.Userdata(),
		dataSource: {
			data:  ns.Userdata(),
			schema: {
				model: {Username: "Username"}
			},
			pageSize: 10,
		},

		filterable: true,
		pageable: {
			refresh: true,
			pageSizes: true,
			buttonCount: 10
        },
		columns: [
			{
				field: "Username",
				title: "Name",
				headerAttributes : {"class":"k-header header-bgcolor"},
				
			},
			{
				field: "Userid",
				title: "Unique ID",
				headerAttributes : {"class":"k-header header-bgcolor"},
				width: 100,
				
			},
			{
				field: "Useremail",
				title: "Email ID",
				headerAttributes : {"class":"k-header header-bgcolor"},
				
			},
			{
				field: "Role",
				title: "Role",
				headerAttributes : {"class":"k-header header-bgcolor"},
				attributes:{"class": "no-padding"},
				template: function(d){
					var res = '';
					try{
						if((d.Role).length != 0 && d.Role != null){
							var rest = (d.Role).split("|")
							var last = rest.length - 1;
							res += "<table role='grid' id='tab1'>"
							$.each(rest, function(i, item){
								res += "<tr>"
								if(i == last){
									res += "<td class='line1' role='gridcell' style='height: 20px;border-bottom: hidden;'>"+item+"</td>"
								}else{
									res += "<td class='line1' role='gridcell' style='height: 20px;'>"+item+"</td>"
								}
								
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
				headerAttributes : {"class":"k-header header-bgcolor"},
				attributes:{"class": "no-padding"},
				// filterable: false,
				template: function(d){

					var res = '';
					try{
						if(d.Catrole != null){
							var rest = (d.Catrole).split("|")
							var last = rest.length - 1;
							res += "<table role='grid'>"
							$.each(rest, function(i, item){
								res += "<tr>"
								if(i == last){
									res += "<td class='line' role='gridcell' style='height: 20px;border-bottom: hidden;'>"+item+"</td>"
								}else{
									res += "<td class='line' role='gridcell' style='height: 20px;'>"+item+"</td>"
								}
								
								res += "</tr>"
							})
							res += "</table>"
							return res
						}
					}catch(e){

					}
					

					return "&nbsp To be assigned"
				}
			},
			{
				field: "Recstatus",
				title: "Status",
				headerAttributes : {"class":"k-header header-bgcolor"},
				width: 100,
				filterable:{
					multi: true,
				}
			},
			{
				field: "Catstatus",
				title: "CAT Status",
				headerAttributes : {"class":"k-header header-bgcolor"},
				width: 100,
				filterable: {
					multi: true,
				}
			},
			{
				field: "",
				title: "Action",
				headerAttributes : {"class":"k-header header-bgcolor"},
				width: 50,
				template: function(d){
					return "<center><button class='btn btn-xs btn-flat btn-warning  edituserright' onclick='ns.editUser(\""+d.uid+"\")'><span class='fa fa-edit'></span></button></center>"
					
				}
			},
		],
	});
}

ns.editUser = function(d){
	ns.username("");
	ns.email("");
	ns.uniqueid("");
	ns.roleList([]);
	ns.valuerole([]);
	ns.status("");
	ns.catstatus("");
	ns.Password("");
	ns.confPassword("");
	$(".conf").hide()
	var index = $("#gridUser tr[data-uid='"+d+"']").index();
	var data = $('#gridUser').data('kendoGrid').dataSource.data();
	if(data[index].Catrole == null){
		ns.valuerole([])
	}else{
		setTimeout(function(){
			ns.valuerole((data[index].Catrole).split("|"))
		}, 250)
	}
	ajaxPost("/newuser/getsysrole", {}, function(res){
		var data = res.Data;
		if(data.length != 0 || data != null){
			ns.roleList(data);
		}
	});
	ns.username(data[index].Username);
	ns.email(data[index].Useremail);
	ns.uniqueid(data[index].Userid);
	ns.role(data[index].Role)
	if(data[index].Recstatus == "X"){
		ns.status("Inactive");
	}else{
		ns.status("Active");
	}
	ns.catstatus(data[index].Catstatus)
	if(ns.catstatus() == "Enable"){
		$('#StatusFilter').bootstrapSwitch('state', true);
	}else{
		$('#StatusFilter').bootstrapSwitch('state', false);
	}
	ns.uid(d);
	$("#editUser").modal("show");
}

ns.saveEdit = function(d){
	if(ns.Password() == ns.confPassword()){
		var index = $("#gridUser tr[data-uid='"+d+"']").index();
		var data = $('#gridUser').data('kendoGrid').dataSource.data();
		if(data[index].Role != null){
			data[index].Role = (data[index].Role).split("|");
		}
		data[index].Catrole = ns.valuerole();
		data[index].Catpassword = ns.Password();
		if(data[index].Catstatus == "To be assigned"){
			data[index].Catstatus = ""
		}
		if(data[index].Recstatus == "Inactive"){
			data[index].Recstatus = "X"
		}else if(data[index].Recstatus == "Active"){
			data[index].Recstatus = "A"
		}
		if($('#StatusFilter').bootstrapSwitch('state') == true){
			data[index].Catstatus = "Enable";
		}else{
			data[index].Catstatus = "Disable";
		}
		var param =ko.mapping.toJS(data[index]);
		console.log(param)
		ajaxPost("/newuser/saveuser", param, function(res){
			ns.LoadGetUser()
			$("#editUser").modal("hide");
			swal("", "Save sucessfully", "success");
		})
	}else{
		$(".conf").show()
	}
	
}

ns.onPass = function(){
	$(".conf").hide()
}

$(function(){
	// ns.LoadGridUser()
	ns.LoadGetUser();
	$("#gridUser").css("overflow", "hidden")
	
});