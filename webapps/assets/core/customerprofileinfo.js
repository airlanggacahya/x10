var info = {
	
    formVisibility: ko.observable(false),
    edit: ko.observable(false),
    confirm: ko.observable(false),
}

// info.customerList = function(){
// 	info.custnamelist([]);
// 	var param = {}
// 	ajaxPost("/datacapturing/getcustomerprofile", param, function (res){
//     	var data = res;
//     	$.each(data, function(i, items){
//     		info.custnamelist.push({
//     			text: items.customer_name, value: items._id
//     		})
//     	});
//     });
// }

// info.filtercustid.subscribe(function(value){
// 	var param = {Id: value};
// 	ajaxPost("/datacapturing/getcustomerprofiledetail", param, function (res){
//     	var data = res[0];
//     	console.log(data);
//     	info.custname(data.customer_name);
//     	info.custid(data.customer_id);
//     });
// });

info.scroll = function(){
  var elementPosition = $('.btnFixed').offset();
  $(window).scroll(function(){
      if($(window).scrollTop() > elementPosition.top){
            $('.btnFixed').removeClass('static');
            $('.btnFixed').addClass('fixed');
      } else {
          $('.btnFixed').removeClass('fixed');
          $('.btnFixed').addClass('static');
      }    
  });
}

info.initEvents = function () {
  filter().CustomerSearchVal.subscribe(function () {
    info.formVisibility(false)
  })
  filter().DealNumberSearchVal.subscribe(function () {
    info.formVisibility(false)
  })
}

info.getReEnter = function(){
    info.condReEnter();
    swal("Please Edit / Enter Data", "", "success");
}

info.getConfirmed = function(){
    info.condConfirmed()
    swal("Successfully Confirmed", "", "success");
}

info.getFreeze = function(){
    info.condReEnter()
    swal("Successfully Freezed", "", "success");
}

info.getUnfreeze = function(){
    swal("Successfully Unfreezed", "", "success");
    info.condUnFreeze();
}

info.condConfirmed = function(){
    $("#edit").hide();
    $("#save").show();
    $("#re").show();
    $("#vf").show();
    $("#cf").hide();
    $("#uvf").hide();
    disableedit();
    $("#re").prop("disabled", false);
    $(".add").prop("disabled", true);
    $(".del").prop("disabled", true);
    $("#save").prop("disabled", true);
    EnableAllkendo(false);
    
    
}

info.condReEnter = function(){
    $("#edit").hide();
    $("#save").show();
    $("#cf").show();
    $("#re").hide();
    $("#vf").show();
    $("#uvf").hide();
    $("#save").prop("disabled", false);
    $("#re").prop("disabled", false);
    $("#save").prop("disabled", false);
    $(".add").prop("disabled", false);
    $(".del").prop("disabled", false);
    enableedit()
    $("#CustomerName").prop("disabled", true);
    $("#CustomerConstitution").prop("disabled", true);
    $("#doi").data("kendoDatePicker").enable(false);
    $("#TIN").prop("disabled", true);
    $("#TAN").prop("disabled", true);
    $("#CustomerRegistrationNumber").prop("disabled", true);
    $("#CustomerPan").prop("disabled", true);
    $("#CIN").prop("disabled", true);
    $("#NatureOfBussiness").prop("disabled", true);
    $("#YearsInBusiness").prop("disabled", true);
    $("#NoOfEmployees").prop("disabled", true);
    $("#UserGroupCompanies").prop("disabled", true);
    $("#CapitalExpansionPlans").prop("disabled", true);
    $("#AddressRegistered").prop("disabled", true);
    $("#ContactPersonRegistered").prop("disabled", true);
    $("#PhoneRegistered").prop("disabled", true);
    $("#EmailRegistered").prop("disabled", true);
    $("#MobileRegistered").prop("disabled", true);
    $("#Ownership").prop("disabled", true);
    $("#NoOfYearsAtAboveAddressRegistered").prop("disabled", true);
    $("#CityRegistered").prop("disabled", true);
    $("#InstrumentType").prop("disabled", true);
    $("#AnnualTurnOver").prop("disabled", true);
    $("#AmountLoan").prop("disabled", true);
    $("#GroupTurnOver").prop("disabled", true);
    $("#InstrumentNo").prop("disabled", true);
    $("#InstrumentDate").prop("disabled", true);
    $("#BankName").prop("disabled", true);
    $("#Amount").prop("disabled", true);

    // promotor / guuarantor

    $(".Name").prop("disabled", true);
    $(".FatherName").prop("disabled", true);
    // $(".Gender").data("kendoDropDownList").enable(false);
    $(".DateOfBirth").prop("disabled", true);
    // $(".MaritalStatus").data("kendoDropDownList").enable(false);
    $(".AnniversaryDate").prop("disabled", true);
    $(".ShareHoldingPercentage").prop("disabled", true);;
    // $(".Guarantor").data("kendoDropDownList").enable(false);
    $(".Education").prop("disabled", true);
    // $(".Designation").data("kendoDropDownList").enable(false);
    $(".PAN").prop("disabled", true);
    $(".Address").prop("disabled", true);
    $(".Landmark").prop("disabled", true);
    $(".City").prop("disabled", true);
    $(".State").prop("disabled", true);
    $(".Pincode").prop("disabled", true);
    $(".Phone").prop("disabled", true);
    $(".Mobile").prop("disabled", true);
    $(".NoOfYears").prop("disabled", true);
    $(".ValueOfPot").prop("disabled", true);
    $(".VehiclesOwned").prop("disabled", true);
    $(".NetWorth").prop("disabled", true);
    $(".Email").prop("disabled", true);
    // $(".Director").data("kendoDropDownList").enable(false);
    // $(".Promotor").data("kendoDropDownList").enable(false);
    EnableAllkendo(false);
    $("#Ownership").prop("disabled", true);
    $("#Ownership").prop("disabled", true);
    $("#Ownership").prop("disabled", true);
    $("#Ownership").prop("disabled", true);
    $("#Ownership").prop("disabled", true);
    $("#Ownership").prop("disabled", true);
    $("#Ownership").prop("disabled", true);
    $("#Ownership").prop("disabled", true);
    $("#Ownership").prop("disabled", true);
    $("#Ownership").prop("disabled", true);
}

info.condFreeze = function(){
    $("#uvf").show();
    $("#cf").hide();
    $("#re").show();
    $("#edit").hide();
    $("#save").show();
    $("#save").prop("disabled", true);
    $("#re").prop("disabled", true);
    $(".add").prop("disabled", true);
    $(".del").prop("disabled", true);
    disableedit();
    $("#vf").hide();
}

info.condUnFreeze = function(){
    $("#vf").hide();
    $("#uvf").show();
    $("#re").show();
    $("#edit").hide();
    $("#cf").hide();
    $("#save").show();
    $("#save").prop("disabled", true);
    $("#re").prop("disabled", false);
}

// info

info.ButtonLogic = function(status){
    setTimeout(function(){
        if(status == 0){
            info.condReEnter();
        }if(status == 1){
            info.condConfirmed()
        }if(status == 2){
            info.condFreeze()
        }
    }, 500)
}

info.templateGrid3 = {
    LoanNo : "",
    TypeOfLoan: "",
    Payment: ""
}

info.templateGrid2 = {
    SrNo: "",
    NameOfBanks: "",
    AddressContactNo: "",
    AcNo: "",
    TypeOfAc: "",
    YearOpening: "",
}

info.templateGrid1 = {
    SrNo: "",
    Banks: "",
    Loan: "",
    Tenure: "",
    Installment: "",
    Outstanding: "",
    SecUnsec: ""
}

info.addPreviousLoanDetails= function(){
    var b = $('.grid1 .k-grid-content').height();
    var data = $(".grid1").data("kendoGrid").dataSource.data();
    var temp = ko.mapping.toJS(info.templateGrid1);
    data.push(temp);

    if(b < 100){
        var h = $('.grid1 .k-grid-content').height();

        if( h > 100){
            $('.grid1 .k-grid-content').height(100);
        }
    }
}

info.addDetailsPertainingtoBankers = function(){
    var b = $('.grid2 .k-grid-content').height();
    var data = $(".grid2").data("kendoGrid").dataSource.data();
    var temp = ko.mapping.toJS(info.templateGrid2);
    data.push(temp);
    if(b < 100){
        var h = $('.grid2 .k-grid-content').height();

        if( h > 100){
            var h = $('.grid2 .k-grid-content').height(100);
        }
    }
    
}

// info.addExistingRelationship = function(){
//     var b = $('.grid3 .k-grid-content').height();
//     var data = $(".grid3").data("kendoGrid").dataSource.data();
//     var temp = ko.mapping.toJS(info.templateGrid3);
//     data.push(temp);

//     if(b < 100){
//         var h = $('.grid3 .k-grid-content').height();

//         if( h > 100){
//             var h = $('.grid3 .k-grid-content').height(100);
//         }
//     }
// }

info.removeRowGrid1 = function(id){
    var index =  $('.grid1 tr[data-uid="'+id+'"]').index();
    var allData = $('.grid1').data('kendoGrid').dataSource.data();
    allData.splice(index, 1);
}

info.removeRowGrid2 = function(id){
    var index =  $('.grid2 tr[data-uid="'+id+'"]').index();
    var allData = $('.grid2').data('kendoGrid').dataSource.data();
    allData.splice(index, 1);
}

info.removeRowGrid3 = function(id){
    var index =  $('.grid3 tr[data-uid="'+id+'"]').index();
    var allData = $('.grid3').data('kendoGrid').dataSource.data();
    allData.splice(index, 1);
}

$(function(){
	// info.customerList()
    info.scroll()
});