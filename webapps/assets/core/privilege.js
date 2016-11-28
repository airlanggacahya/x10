var dataEntryPrivilege = function(){
	var buttonPrivilege = [
		{ name: 'save', klas: 'btn-save'},
		{ name: 'confirm', klas: 'btn-confirm'},
		{ name: 'reenter', klas: 'btn-reenter'},
		{ name: 'freeze', klas: 'btn-freeze'},
		{ name: 'unfreeze', klas: 'btn-unfreeze'}
	]

	allowedButtons = _.flatten(_.map(function(){
		allActions = ["save", "confirm", "reenter", "freeze", "unfreeze"];
		allowedActions = getAllowedActions({
			"Credit Analyst": {
				"Account Details": ["save", "confirm", "reenter"],
				"Approval Form": ["save", "confirm", "reenter"],
				"Balance Sheet Inputs": ["save", "confirm", "reenter"],
				"Banking Analysis": ["save", "confirm", "reenter"],
				"CIBIL Details": ["save", "confirm", "reenter"],
				"Customer Application": ["save", "confirm", "reenter"],
				"Due Diligence Form": ["save", "confirm", "reenter"],
				"External Repayment Details": ["save", "confirm", "reenter"],
				"Internal Repayment Details": ["save", "confirm", "reenter"],
				"Stock & Book Debt": ["save", "confirm", "reenter"]
			},
			"Business User": {
				"Account Details": allActions,
				"Approval Form": allActions,
				"Balance Sheet Inputs": allActions,
				"Banking Analysis": allActions,
				"CIBIL Details": allActions,
				"Customer Application": allActions,
				"Due Diligence Form": allActions,
				"External Repayment Details": allActions,
				"Internal Repayment Details": allActions,
				"Stock & Book Debt": allActions,
			},
			"IT User": {
				"Account Details": allActions,
				"Approval Form": allActions,
				"Balance Sheet Inputs": allActions,
				"Banking Analysis": allActions,
				"CIBIL Details": allActions,
				"Customer Application": allActions,
				"Due Diligence Form": allActions,
				"External Repayment Details": allActions,
				"Internal Repayment Details": allActions,
				"Stock & Book Debt": allActions,
			},
		})
		return allowedActions != undefined ? allowedActions : allActions
	}(), function(p){
		return buttonPrivilege.filter(function( obj ) {
		  	return obj.name == p;
		});
	}))

	forbidButtons(buttonPrivilege, allowedButtons);
}

var RestrictWithFunction = function(menuId,Rolename){
	setTimeout(function(){
		try{
			var vacase = menuId + "|"+Rolename
			switch(vacase){
				case "Approval Form|Credit Analyst": disableDecisionCommit(); break;
			}
		}catch(e){
			console.log(e)
		}
	},3000);
}

var getAllowedActions = function(data){
	return _.find(
		_.find(data, function(d, role){
			return role == model.Rolename()	
		}), function(actions, page){
			return page == model.PageId()
		})
}

var forbidButtons = function(buttons, allowedButtons){
	_.each(
		_.map(
			_.difference(buttons, allowedButtons), function(button){ 
				return button.klas 
			}), function(forbiddenButton){
			$('.'+forbiddenButton).remove()
		});
}

var disableDecisionCommit = function(){
		$("#commentdate").data("kendoDatePicker").enable(false);
		$("#commentamount").attr("disabled",true)
		$("#commentroi").attr("disabled",true)
		$("#commentpf").attr("disabled",true)
		$("#commentpg").attr("disabled",true)
		$("#commentsecurity").attr("disabled",true)
		$("#commentconditions").attr("disabled",true)
		$("#commentremarks").attr("disabled",true)
		$(".btn-confirm.sanction").attr("disabled",true)
		$(".btn-hold.sanction").attr("disabled",true)
}

$(document).ready(function(){
	switch(model.PageTopMenu()){
		case "Data Entry": dataEntryPrivilege(); break;
	}
	try{
		RestrictWithFunction(model.PageId(),model.Rolename());
	}catch(e){
		console.log(e)
	}
})