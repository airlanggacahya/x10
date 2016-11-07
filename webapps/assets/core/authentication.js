var auth ={
	view: ko.observable(),
	create: ko.observable(),
	delete: ko.observable(),
	edit: ko.observable(),
	coba: ko.observable("percobaan"),
	menu: ko.observableArray([]),
}

auth.loadAuth = function(){
	if(model.View() == "false"){
		$(".btn-primary").hide();                   
		$(".btn-danger").hide();
	}

	if(model.Create() == "false"){
		$(".btn-success").hide();                   
	}

	if(model.Delete() == "false"){
		$(".btn-warning").hide();                   
	}
}

$(document).ready(function(){
	auth.loadAuth();
	
})