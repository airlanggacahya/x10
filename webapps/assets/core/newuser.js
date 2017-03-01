var ns = {}
ns.Userdata = ko.observableArray([]);
ns.OriginalUserdata = ko.observableArray([]);
ns.SearchBarText = ko.observable();
ns.roleList = ko.observableArray([]);
ns.valuerole = ko.observableArray([]);
ns.param = ko.observableArray([]);
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

ns.PreprocessUser = function(input){
	$.each(input, function(i, temp){
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

	return input;
}

ns.LoadGetUser = function(){
	ajaxPost("/newuser/getuser", {}, function(res){
		var data = res.Data.data;
		if (data.length != 0){
			data = ns.PreprocessUser(data);
			ns.OriginalUserdata(data);
			ns.SearchBarText("");
		}
	})
}

ns.SearchBarText.subscribe(function (val) {
	ns.FilterSearchBar(val);
})

ns.FilterSearchBar = function(val) {
	val = val.toLowerCase();
	var newdata = []
	_.each(ns.OriginalUserdata(), function (i) {
		if (i.Username.toLowerCase().indexOf(val) != -1)
			return newdata.push(i)
		
		if (i.Userid.toLowerCase().indexOf(val) != -1)
			return newdata.push(i)

		if (i.Useremail.toLowerCase().indexOf(val) != -1)
			return newdata.push(i)

		if (i.Catrole.toLowerCase().indexOf(val) != -1)
			return newdata.push(i)

		if (i.Role.toLowerCase().indexOf(val) != -1)
			return newdata.push(i)
	})

	console.log(newdata);
	console.log(ns.OriginalUserdata());
	ns.Userdata(newdata);
}

ns.Userdata.subscribe(function () {
	ns.LoadGridUser();
	$("#gridUser").data("kendoGrid").refresh()
})

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
					if(model.IsGranted("edit") == true){
						return "<center><button class='btn btn-xs btn-flat btn-warning  edituserright' onclick='ns.editUser(\""+d.Id+"\")'><span class='fa fa-edit'></span></button></center>";
					}
					
					return "";
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
	ns.confPassword([]);
	$(".conf").hide()
	ns.param([])
	ajaxPost("/newuser/getuseredit", {Id: d}, function(res){
		var data = res.Data.data[0];
		ns.param(data)
		ajaxPost("/newuser/getsysrole", {}, function(res){
			var data = res.Data;
			if(data.length != 0 || data != null){
				ns.roleList(data);
			}
		});
		ns.username(ns.param().Username);
		ns.email(ns.param().Useremail);
		ns.uniqueid(ns.param().Userid);
		ns.role(ns.param().Role)
		if(ns.param().Recstatus == "X"){
			ns.status("Inactive");
		}else{
			ns.status("Active");
		}
		ns.catstatus(ns.param().Catstatus)	
		ns.uid(d);
		$("#editUser").modal("show");
		setTimeout(function(){
			$("[name='catstatus']").bootstrapSwitch('disabled',false);
			$('#StatusFilter').bootstrapSwitch('state', false);


			ns.valuerole(ns.param().Catrole);
			if(ns.catstatus() == "Enable"){
				$('#StatusFilter').bootstrapSwitch('state', true);
			}else if(ns.catstatus() == "Disable"){
				$('#StatusFilter').bootstrapSwitch('state', false);
			}else if(ns.catstatus() == ""){
				$('#StatusFilter').bootstrapSwitch('state', false);
			}

			if(ns.status() === "Inactive" && ns.catstatus() === ""){
			$("[name='catstatus']").bootstrapSwitch('disabled',true);
			}else if(ns.status() === "Inactive" && ns.catstatus() === "Disable"){
				$("[name='catstatus']").bootstrapSwitch('disabled',true);
			}else if(ns.status() === "Inactive" && ns.catstatus() === "Enable"){	
				$("[name='catstatus']").bootstrapSwitch('disabled',false);
			}else if(ns.status() === "Active" && ns.catstatus() === "Disable"){
				$("[name='catstatus']").bootstrapSwitch('disabled',false);
			}if(ns.status() === "Active" && ns.catstatus() === "Enable"){	
				$("[name='catstatus']").bootstrapSwitch('disabled',false);
			}else if(ns.status() === "Active" && ns.catstatus() === ""){
				$("[name='catstatus']").bootstrapSwitch('disabled',false);
			}
		}, 200)
		
		
	})
	
}

ns.saveEdit = function(d){
	if(ns.Password() == ns.confPassword()){
		var index = $("#gridUser tr[data-uid='"+d+"']").index();
		var data = $('#gridUser').data('kendoGrid').dataSource.data();
		// if(ns.param().Role != null){
		// 	ns.param().Role = (ns.param().Role).split("|");
		// }
		ns.param().Catrole = ns.valuerole();
		ns.param().Catpassword = ns.Password();
		if(ns.param().Catstatus == "To be assigned"){
			ns.param().Catstatus = ""
		}
		if(ns.param().Recstatus == "Inactive"){
			ns.param().Recstatus = "X"
		}else if(ns.param().Recstatus == "Active"){
			ns.param().Recstatus = "A"
		}
		if($('#StatusFilter').bootstrapSwitch('state') == true){
			ns.param().Catstatus = "Enable";
		}else{
			ns.param().Catstatus = "Disable";
		}

		if(ns.param().Catstatus == "To be assigned"){
			ns.param().Catstatus = "";
		}
		ns.param().LastUpdateDate = (new Date()).toISOString();
		ajaxPost("/newuser/saveuser", ns.param(), function(res){
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