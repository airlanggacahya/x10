var menusett = {
	Id : ko.observable(""),
	PageId : ko.observable(""),
    Parent:ko.observable(""),
    Title:ko.observable(""),
    Url:ko.observable(""),
    Icon: ko.observable(""),
    IndexMenu:ko.observable(0),
    saveData : ko.observable(false),
    updateData : ko.observable(false),
    DataMenu : ko.observableArray([]),
    listMenu : ko.observableArray([]),
    ListMenuTree : ko.observableArray([]),
    treelistView : ko.observableArray(),
    btnNewData : ko.observable(" Add New"),
    select: ko.observable(false),
};

menusett.resetAppMenu = function(){
    menusett.Id("");
    menusett.PageId("");
    menusett.Parent("");
    menusett.Title("");
    menusett.Url("");
    menusett.Icon("");
    menusett.IndexMenu(0);
    menusett.saveData(true);
    menusett.updateData(false);
    $('#Enable').bootstrapSwitch('state', true)
    $("#Url").siblings("span.k-tooltip-validation").hide(); 
    $("#title").siblings("span.k-tooltip-validation").hide(); 
    menusett.loadmenuMaster();
}

menusett.saveAppmenu = function(){
	var url = "/menusetting/savemenutop";
	var Title = menusett.Title();
	var IndexMenu = menusett.IndexMenu();
	var Enable = $('#Enable').bootstrapSwitch('state');
	var d = new Date();
    var day = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    var Hours= d.getHours();
    var Minutes= d.getMinutes();
    var Seconds= d.getSeconds();
    var GenMenuId = year + "" + month+""+day +""+ Hours + ""+ Minutes + "" + Seconds

	if (IndexMenu == ""){
		IndexMenu = 0;
	}
	var param = {
		Id : GenMenuId,
		PageId : Title.toUpperCase().replace(/\s+/g, ''),
		Parent : menusett.Parent(),
		Title : Title,
		Url : menusett.Url(),
		Icon : menusett.Icon(),
		IndexMenu : parseInt(IndexMenu),
		Enable : Enable
	};

	var validator = $("#AppMenu").data("kendoValidator");
    if(validator==undefined){
       validator= $("#AppMenu").kendoValidator().data("kendoValidator");
    }

     if (validator.validate()) {
     	ajaxPost(url, param, function (data) {
			if (data.IsError == false){
			    menusett.resetAppMenu();
			    // window.location.href = "/menusetting/default";
			    menusett.btnNewData(" Add New");
			    menusett.saveData(false);
				$("#parent").data("kendoDropDownList").readonly(true);
				$("#IndexMenu").data("kendoNumericTextBox").readonly(true);
				$("#Url").attr("readonly", true);
				$("#title").attr("readonly", true);
				$("#Icon").attr("readonly", true);
				$('#Enable').bootstrapSwitch('readonly', true);
				swal("Success!", data.Message, "success");
			}else{
				return swal("Error!", data.Message, "error");
			}
		});
     }
	
}

menusett.updateAppmenu = function(){
	var url = "/menusetting/updatemenutop";
	var Title = menusett.Title();
	var IndexMenu = menusett.IndexMenu();
	var Enable = $('#Enable').bootstrapSwitch('state');

	if (IndexMenu == ""){
		IndexMenu = 0;
	}
	var param = {
		Id : menusett.Id(),
		PageId : menusett.PageId(),
		Parent : menusett.Parent(),
		Title : Title,
		Url : menusett.Url(),
		Icon : menusett.Icon(),
		IndexMenu : parseInt(IndexMenu),
		Enable : Enable
	};
	ajaxPost(url, param, function (data) {
		if (data.IsError == false){
		    menusett.resetAppMenu();
		    // window.location.href = "/menusetting/default";
		    menusett.select(false);
		    menusett.saveData(false);
		    $("#parent").data("kendoDropDownList").readonly(true);
			$("#IndexMenu").data("kendoNumericTextBox").readonly(true);
			$("#Url").attr("readonly", true);
			$("#title").attr("readonly", true);
			$("#Icon").attr("readonly", true);
			$('#Enable').bootstrapSwitch('readonly', true);
			swal("Success!", data.Message, "success");
		}else{
			return swal("Error!", data.Message, "error");
		}
	});
}

menusett.checkSelect = function(){
	var tv = $("#menu-list").data("kendoTreeView");
	selected = tv.select();
	item = tv.dataItem(selected);
    if (item === undefined) {
       	return swal("Confirmation!", "Please select menu.", "error");
    }else{
    	menusett.Id(item.Id);
    	menusett.saveData(true);
    	menusett.updateData(true);
    }
}

menusett.editdataMenulist = function(){
	menusett.checkSelect();
	$("#parent").data("kendoDropDownList").readonly(false);
	$("#IndexMenu").data("kendoNumericTextBox").readonly(false);
	$("#Url").attr("readonly", false);
	$("#title").attr("readonly", false);
	$("#Icon").attr("readonly", false);
	$('#Enable').bootstrapSwitch('readonly', false);
	menusett.saveData(false);
}

menusett.newdataMenulist = function(){
	menusett.select(false);
	$("#parent").data("kendoDropDownList").readonly(false);
	$("#IndexMenu").data("kendoNumericTextBox").readonly(false);
	$("#Url").attr("readonly", false);
	$("#title").attr("readonly", false);
	$("#Icon").attr("readonly", false);
	$('#Enable').bootstrapSwitch('readonly', false);	
	menusett.saveData(true);
    menusett.updateData(false);
    menusett.Id("");
    menusett.PageId("");
    menusett.Parent("");
    menusett.Title("");
    menusett.Url("");
    menusett.Icon("");
    menusett.IndexMenu(0);
    menusett.loadmenuMaster();
    $('#Enable').bootstrapSwitch('state', true)
    $("#Url").siblings("span.k-tooltip-validation").hide(); 
    $("#title").siblings("span.k-tooltip-validation").hide(); 
    if (menusett.btnNewData() == " Add New"){
    	menusett.btnNewData(" Cancel");
    	menusett.saveData(true);
    }else{
    	menusett.btnNewData(" Add New");
    	menusett.saveData(false);
    	menusett.updateData(false);
    	$("#parent").data("kendoDropDownList").readonly(true);
		$("#IndexMenu").data("kendoNumericTextBox").readonly(true);
		$("#Url").attr("readonly", true);
		$("#title").attr("readonly", true);
		$("#Icon").attr("readonly", true);
		$('#Enable').bootstrapSwitch('readonly', true);
    }
}


menusett.deleteMunulist = function(){
	if (menusett.Id() == ""){
		return swal("Confirmation!", "Please select menu.", "error");
	}

	var param = {
		Id : menusett.Id()
	}
	var url = "/menusetting/deletemenutop";
	swal({
            title: "Are you sure?",
            text: "Are you sure remove this menu!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, I am sure!',
            cancelButtonText: "No, cancel it!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function(isConfirm) {
            if (isConfirm) {
			    ajaxPost(url, param, function(data){
					if (data.IsError == false){
						menusett.resetAppMenu();
						swal("Success!","Menu Success "+ menusett.Id() +" Delete","success");
						menusett.saveData(false);
						// window.location.href = "/menusetting/default";
					}else{
						swal("Error!",data.Message,"error");
						menusett.saveData(false);
					}
				});
            } else {
            	menusett.saveData(false);
			    menusett.updateData(false);
			    menusett.Id("");
			    menusett.PageId("");
			    menusett.Parent("");
			    menusett.Title("");
			    menusett.Url("");
			    menusett.Icon("");
			    menusett.IndexMenu(0);
			    menusett.loadmenuMaster();
			    $('#Enable').bootstrapSwitch('state', true)
			    $("#Url").siblings("span.k-tooltip-validation").hide(); 
			    $("#title").siblings("span.k-tooltip-validation").hide(); 
                swal("Cancelled", "Cancelled Delete Menu", "error");
            }
        });
}

menusett.convert = function (array){
    var map = {};
    for(var i = 0; i < array.length; i++){
        var obj = array[i];
        obj.Submenus= [];

        map[obj.Id] = obj;

        var parent = obj.Parent || '-';
        if(!map[parent]){
            map[parent] = {
                Submenus: []
            };
        }
        map[parent].Submenus.push(obj);
    }
    return map['-'].Submenus;
}


menusett.subMenuMaster = function(SubData, spacer){
	spacer += "--";
	for (var i in SubData){
			if (SubData[i].Submenus.length != 0 ){
				menusett.listMenu.push({
						"title" : spacer + " " + SubData[i].Title,
						"Id" : SubData[i].Id
					});
				menusett.subMenuMaster(SubData[i].Submenus, spacer);
			}else{
				menusett.listMenu.push({
						"title" : spacer + " " + SubData[i].Title,
						"Id" : SubData[i].Id
					});
			}
		}
}

menusett.subtreelist = function(SubData){
	for (var i in SubData){
			if (SubData[i].Submenus.length != 0 ){
				menusett.treelistView.push({
						"Id" : SubData[i].Id,
						"title" : SubData[i].Title,
						"url" : "#",
						"icon" : SubData[i].Icon,
						"pageid" : SubData[i].PageId,
						"Parent" : SubData[i].Parent,
						"indexmenu" : SubData[i].IndexMenu,
						"enable" : SubData[i].Enable,
					});
				menusett.subtreelist(SubData[i].Submenus);
			}else{
				menusett.treelistView.push({
						"Id" : SubData[i].Id,
						"title" : SubData[i].Title,
						"url" : "#",
						"icon" : SubData[i].Icon,
						"pageid" : SubData[i].PageId,
						"Parent" : SubData[i].Parent,
						"indexmenu" : SubData[i].IndexMenu,
						"enable" : SubData[i].Enable,
					});
			}
		}
}

menusett.loadmenuMaster = function(){
	var url = "/menusetting/getselectmenu";
	var param = {
	};
	menusett.listMenu([{title: "[TOP LEVEL]", Id: ""}]);
	menusett.treelistView([]);
	ajaxPost(url, param, function (data) {
		var dataMenu = data.Data.Records;
		var sortdataMenu =  Enumerable.From(dataMenu).OrderBy("$.Parent").ThenBy("$.IndexMenu").ToArray();
		var dataTree =  menusett.convert(sortdataMenu);
		var spacer = "--";
		var listSubmenu = [];

		for (var i in dataTree){
			if (dataTree[i].Submenus.length  != 0 ){
				menusett.listMenu.push({
						"title" : spacer + " " + dataTree[i].Title,
						"Id" : dataTree[i].Id
					});
				menusett.subMenuMaster(dataTree[i].Submenus, spacer);
				//=================== 
				menusett.treelistView.push({
					"Id" : dataTree[i].Id,
					"title" : dataTree[i].Title,
					"url" : "#",
					"icon" : dataTree[i].Icon,
					"pageid" : dataTree[i].PageId,
					"Parent" : dataTree[i].Parent,
					"indexmenu" : dataTree[i].IndexMenu,
					"enable" : dataTree[i].Enable,
				});
				menusett.subtreelist(dataTree[i].Submenus);

			}else{
				menusett.listMenu.push({
						"title" : spacer + " " + dataTree[i].Title,
						"Id" : dataTree[i].Id
					});

				menusett.treelistView.push({
					"Id" : dataTree[i].Id,
					"title" : dataTree[i].Title,
					"url" : "#",
					"icon" : dataTree[i].Icon,
					"pageid" : dataTree[i].PageId,
					"Parent" : dataTree[i].Parent,
					"indexmenu" : dataTree[i].IndexMenu,
					"enable" : dataTree[i].Enable,
				});

			}
		}

		var sortdataTree =  menusett.convert(menusett.treelistView());
		menusett.ListMenuTree(sortdataTree);

		var inline = new kendo.data.HierarchicalDataSource({
                        data: menusett.ListMenuTree(),
                        schema: {
                            model: {
                                children: "Submenus"
                            }
                        }
                    });	
	 	var treeview = $("#menu-list").kendoTreeView({
                animation: false,
                template: kendo.template($("#menulist-template").html()),
                dataTextField: "title",
                dataSource:inline,
                select: menusett.selectDirFolder,
                loadOnDemand: false
            }).data("kendoTreeView");
            treeview.expand(".k-item");

	});
}

menusett.oncancel = function(){
	if(menusett.btnNewData() == ' Cancel'){
		menusett.saveData(false);
		$("#parent").data("kendoDropDownList").readonly(true);
		$("#IndexMenu").data("kendoNumericTextBox").readonly(true);
		$("#Url").attr("readonly", true);
		$("#title").attr("readonly", true);
		$("#Icon").attr("readonly", true);
		$('#Enable').bootstrapSwitch('readonly', true);
	}	
}    

menusett.selectDirFolder = function(e){
	menusett.oncancel();
	var data = $('#menu-list').data('kendoTreeView').dataItem(e.node);
	var param = {
		Id : data.Id
	}
	var url = "/menusetting/getselectmenu";
	ajaxPost(url, param, function(data){
		if (data.IsError == false){
			menusett.select(true);
			menusett.saveData(false);
			var dataMenu =  data.Data.Records[0];
			menusett.Id(dataMenu.Id);
			menusett.PageId(dataMenu.PageId);
			menusett.Parent(dataMenu.Parent);
		    menusett.Title(dataMenu.Title);
		    menusett.Url(dataMenu.Url);
		    menusett.Icon(dataMenu.Icon);
		    menusett.IndexMenu(dataMenu.IndexMenu);
		    $('#Enable').bootstrapSwitch('state', dataMenu.Enable)
		}else{
			swal("Error!",data.Message,"error");
		}
	});
}
$(document).ready(function () { 
	menusett.loadmenuMaster();
	$("#IndexMenu").data("kendoNumericTextBox").readonly();
});