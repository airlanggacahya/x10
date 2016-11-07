customerprofile().DetailofPromoters = ko.observable(detail)
var detail = {
	biodata : ko.observableArray([
		{
			// name: "",
			// gender: ko.observable(""),
			// datebirth: "",
			// ismaried: ko.observable(""),
			// guarantor : ko.observable(""),
			// anniversarrydate: "",
			// holdingpercent: "",
			// education: "",
			// designation: ko.observable(""),
			// pan: "",
			// address: "",
			// landmark: "",
			// city: "",
			// state: "",
			// pincode: "",
			// phone: "",
			// hp: "",
			// ownership: ko.observable(""),
			// noyear: "",
			// valueplot: "",
			// vehiclesowned: "",
			// networth: "",
			// email: "",
			// date: "",
			// fotoprofilecustomer: ""
		},

	]),

	detailReference: ko.observableArray([
		{
			name: "",
			address: "",
			contact: "",
			relation: "",
		}
	]),

}

detail.genderChoose = ko.observable("");

// PropertyOwned = ko.observableArray([])
function addOPD(i,ii){
	// console.log(i)
	detail.biodata()[i].PropertyOwnedkendo.push({PropertyType: "",Address: "",MarketValue: ""})
}
function deleteOPD(i,ii){
	// console.log(i,ii)
	detail.biodata()[i].PropertyOwnedkendo.splice(ii,1)
}

detail.addbiodata = function(){
	var BiodataValue = {
		name: "",
		gender: ko.observable(""),
		datebirth: "",
		guarantor : ko.observable(""),
		ismaried: ko.observable(""),
		anniversarrydate: "",
		holdingpercent: "",
		education: "",
		designation: ko.observable(""),
		pan: "",
		address: "",
		landmark: "",
		city: "",
		state: "",
		pincode: "",
		phone: "",
		hp: "",
		ownership: ko.observable(""),
		noyear: "",
		valueplot: "",
		vehiclesowned: "",
		networth: "",
		email: "",
		date: "",
		OPD: ko.observableArray(["","",""])
	}
	detail.biodata.push(BiodataValue);
	ko.utils.arrayForEach(detail.biodata(), function(item, index) {
	    $('#gender'+index).bootstrapSwitch();
	    $('#ismaried'+index).bootstrapSwitch();
	    $('#guarantor'+index).bootstrapSwitch();
	    console.log(detail.biodata())
	});
}

// detail.addRefrence = function(){
// 	var reference ={
// 		name: "",
// 		address: "",
// 		contact: "",
// 		relation: "",
// 	}

// 	detail.detailReference.push(reference);
// }

function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
}

function readURL(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          $('#imgCustomerProfile')
              .attr('src', e.target.result)
              .width("100%")
              .height("100%");
      };
      reader.readAsDataURL(input.files[0]);
  }
 }

detail.desain = [
	{text: "Director", value: "Director"},
	{text: "Partner", value: "Partner"},
	{text: "Proprietor", value: "Proprietor"},
]

detail.genderList = [
	{text: "Male", value: "M"},
	{text: "Female", value: "F"},
]

detail.guarantorList = [
	{text: "Yes", value: true},
	{text: "No", value: false},
]

detail.maritalStatusList = [
	{text: "Single", value: "S"},
	{text: "Married", value: "M"},
]

detail.ownershiplist = [
	{text: "Self Owned", value: "Self Owned"},
	{text: "Parental", value: "Parental"},
	{text: "Leased", value: "Leased"},
	{text: "Rental", value: "Rental"},
	{text: "R", value: "R"},
]

$(document).ready(function(){
	$('#accordion1').on('hidden.bs.collapse', toggleChevron);
	$('#accordion1').on('shown.bs.collapse', toggleChevron);
	$('#gender').bootstrapSwitch('state', true);
});