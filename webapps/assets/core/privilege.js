var dataEntryPrivilege = function(){
	
	var buttonPrivilege = [
		{ name: 'save', klas: 'btn-save'},
		{ name: 'confirm', klas: 'btn-confirm'},
		{ name: 'reenter', klas: 'btn-reenter'},
		{ name: 'freeze', klas: 'btn-freeze'},
		{ name: 'unfreeze', klas: 'btn-unfreeze'}
	]

	allowedButtons = _.flatten(_.map(function(){
		allButtons = ["save", "confirm", "reenter", "freeze", "unfreeze"];
		///////////////// sementara
		if(model.PageId() == "Account Details")
			switch(model.Rolename()){
				case 'Credit Analyst': return ["save", "confirm", "reenter"]; break;
				case 'Business User': return allButtons; break;
				case 'IT User': return allButtons; break;
				default: return allButtons;
			}
		else if(model.PageId() == "Approval Form")
			switch(model.Rolename()){
				case 'Credit Analyst': return ["save", "confirm", "reenter"]; break;
				case 'Business User': return allButtons; break;
				case 'IT User': return allButtons; break;
				default: return allButtons;
			}
		else if(model.PageId() == "Balance Sheet Inputs")
			switch(model.Rolename()){
				case 'Credit Analyst': return ["save", "confirm", "reenter"]; break;
				case 'Business User': return allButtons; break;
				case 'IT User': return allButtons; break;
				default: return allButtons;
			}
		else if(model.PageId() == "Banking Analysis")
			switch(model.Rolename()){
				case 'Credit Analyst': return ["save", "confirm", "reenter"]; break;
				case 'Business User': return allButtons; break;
				case 'IT User': return allButtons; break;
				default: return allButtons;
			}
		else if(model.PageId() == "CIBIL Details")
			switch(model.Rolename()){
				case 'Credit Analyst': return ["save", "confirm", "reenter"]; break;
				case 'Business User': return allButtons; break;
				case 'IT User': return allButtons; break;
				default: return allButtons;
			}
		else if(model.PageId() == "Customer Application")
			switch(model.Rolename()){
				case 'Credit Analyst': return ["save", "confirm", "reenter"]; break;
				case 'Business User': return allButtons; break;
				case 'IT User': return allButtons; break;
				default: return allButtons;
			}
		else if(model.PageId() == "Due Diligence Form")
			switch(model.Rolename()){
				case 'Credit Analyst': return ["save", "confirm", "reenter"]; break;
				case 'Business User': return allButtons; break;
				case 'IT User': return allButtons; break;
				default: return allButtons;
			}
		else if(model.PageId() == "External Repayment Details")
			switch(model.Rolename()){
				case 'Credit Analyst': return ["save", "confirm", "reenter"]; break;
				case 'Business User': return allButtons; break;
				case 'IT User': return allButtons; break;
				default: return allButtons;
			}
		else if(model.PageId() == "Internal Repayment Details")
			switch(model.Rolename()){
				case 'Credit Analyst': return ["save", "confirm", "reenter"]; break;
				case 'Business User': return allButtons; break;
				case 'IT User': return allButtons; break;
				default: return allButtons;
			}
		else if(model.PageId() == "Stock & Book Debt")
			switch(model.Rolename()){
				case 'Credit Analyst': return ["save", "confirm", "reenter"]; break;
				case 'Business User': return allButtons; break;
				case 'IT User': return allButtons; break;
				default: return allButtons;
			}
	}(), function(p){
		return buttonPrivilege.filter(function( obj ) {
		  	return obj.name == p;
		});
	}))

	forbidButtons(buttonPrivilege, allowedButtons);
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

$(document).ready(function(){
	switch(model.PageTopMenu()){
		case "Data Entry": dataEntryPrivilege(); break;
	}
})