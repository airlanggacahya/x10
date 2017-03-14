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

dataHierarchi = ko.observableArray([])
positionList = ko.observableArray([])
designationList = ko.observableArray([])
selectedPosition = ko.observableArray(["DirectorPromoter"])
instrumentTypeList = [
    {text: "Cheque", value: "Cheque"},
    {text: "Net banking", value: "NetBanking"},
    {text: "SI", value: "SI"},
    {text: "Credit / Debit Card", value: "CreditDebitCard"},
    {text: "ECS", value: "ECS"},
    {text: "Others", value: "Others"},
];


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

var getMasterAccountDetails = function(callback) {
    var param = {}
    ajaxPost("/accountdetail/getmasteraccountdetail", {}, function (res){
        if(typeof callback === "function" && res.Data != undefined) {
            callback(res.Data, setPosition)
        }
    });
}
    
var setPosition = function(){
    _.each(detail.biodata(), function(row){
        row.Position(row.Position())
    })
}

var setDesignation = function(){
    _.each(detail.biodata(), function(row){
        row.Designation(row.Designation())
    })
}

var formatDataPosition = function(param, setPosition) {
    if(param != undefined || param != "") {
        var position = _.filter(param, function(row){
            return row.Field === "Position"
        })

        var stakeholderPosition = _.filter(param, function(row){
            return row.Field === "StakeholderPosition"
        })

        if(position != undefined && position.length > 0) {
            
            formatDataDesignation(position, setDesignation)

            var temp = []
            _.each(stakeholderPosition[0].Items, function(row){
                temp.push(row.name) 
            })

            positionList(temp)
            
            if(typeof setPosition === "function")
                setPosition()
        }
    }
}

var formatDataDesignation = function(data, setDesignation) {
    var temp = []
    _.each(data[0].Items, function(row){
        temp.push(row.name) 
    })

    designationList(temp)

    if(typeof setDesignation === "function"){
        setDesignation()
    }
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
    
    $("#doi").prop("disabled", true);
    $("#TIN").prop("disabled", true);
    // $("#TAN").prop("disabled", true);
    $("#CustomerRegistrationNumber").prop("disabled", true);
    $("#CustomerPan").prop("disabled", true);
    // $("#CIN").prop("disabled", true);
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
    // $("#InstrumentType").prop("disabled", true);
    // $("#AnnualTurnOver").prop("disabled", true);
    $("#AmountLoan").prop("disabled", true);
    // $("#GroupTurnOver").prop("disabled", true);
    // $("#InstrumentNo").prop("disabled", true);
    // $("#InstrumentDate").prop("disabled", true);
    // $("#BankName").prop("disabled", true);
    // $("#Amount").prop("disabled", true);

    // promotor / guuarantor

    $(".Name").prop("disabled", true);
    $(".FatherName").prop("disabled", true);
    $(".Gender").prop("disabled", true);
    $(".DateOfBirth").prop("disabled", true);
    $(".MaritalStatus").prop("disabled", true);
    // $(".AnniversaryDate").prop("disabled", true);
    $(".ShareHoldingPercentage").prop("disabled", true);
    $(".Guarantor").prop("disabled", true);
    $(".Education").prop("disabled", true);
    // $(".Designation").data("kendoDropDownList").enable(false);
    $(".Designation").prop("disabled", true);
    $(".PAN").prop("disabled", true);
    $(".Address").prop("disabled", true);
    $(".Landmark").prop("disabled", true);
    $(".City").prop("disabled", true);
    $(".State").prop("disabled", true);
    $(".Pincode").prop("disabled", true);
    $(".Phone").prop("disabled", true);
    $(".Mobile").prop("disabled", true);
    $(".ContactPerson").prop("disabled", true);
    $(".Email").prop("disabled", true);
    $(".Ownership").prop("disabled", true);
    $(".NoOfYears").prop("disabled", true);
    // $(".ValueOfPot").prop("disabled", true);
    // $(".VehiclesOwned").prop("disabled", true);
    // $(".NetWorth").prop("disabled", true);
    $(".Email").prop("disabled", true);
    $(".Director").prop("disabled", true);
    $(".Promotor").prop("disabled", true);

    $(".disabled").prop("disabled", true);
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
    $("#Designation").prop("disabled", true);
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
    Loan: 0,
    Tenure: 0,
    Installment: 0,
    LoanAmount: 0,
    MonthlyInstallment: 0,
    Outstanding: 0,
    OutstandingAmount: 0,
    SecUnsec: ""
}

info.addPreviousLoanDetails= function(){
    var b = $('.grid1 .k-grid-content').height();
    var data = $(".grid1").data("kendoGrid").dataSource.data();
    var temp = ko.mapping.toJS(info.templateGrid1);

    data.push(temp);
    _.each(data, function(val, key) {
        data[key].SrNo = "" + (key + 1);
    })
    $(".grid1").data("kendoGrid").refresh();

    if(b < 100){
        var h = $('.grid1 .k-grid-content').height();

        if( h > 100){
            $('.grid1 .k-grid-content').height(100);
        }
    }
}

info.addPreviousLoanDetailsDummy = function(){
    var b = $('.grid10 .k-grid-content').height();
    $(".grid10").data("kendoGrid").dataSource.data([]);
    var data = $(".grid10").data("kendoGrid").dataSource.data();
    var temp = ko.mapping.toJS(info.templateGrid1);

    data.push(temp);
    _.each(data, function(val, key) {
        data[key].SrNo = "" + (key + 1);
    })
    $(".grid10").data("kendoGrid").refresh();

    if(b < 100){
        var h = $('.grid10 .k-grid-content').height();

        if( h > 100){
            $('.grid10 .k-grid-content').height(100);
        }
    }
}

info.addDetailsPertainingtoBankers = function(){
    var b = $('.grid2 .k-grid-content').height();
    var data = $(".grid2").data("kendoGrid").dataSource.data();
    var temp = ko.mapping.toJS(info.templateGrid2);

    data.push(temp);
    _.each(data, function(val, key) {
        data[key].SrNo = "" + (key + 1);
    })
    $(".grid2").data("kendoGrid").refresh();

    if(b < 100){
        var h = $('.grid2 .k-grid-content').height();

        if( h > 100){
            var h = $('.grid2 .k-grid-content').height(100);
        }
    }
    
}

info.addDetailsPertainingtoBankersDummy = function(){
    var b = $('.grid20 .k-grid-content').height();
    $(".grid20").data("kendoGrid").dataSource.data([]);
    var data = $(".grid20").data("kendoGrid").dataSource.data();
    var temp = ko.mapping.toJS(info.templateGrid2);

    data.push(temp);
    _.each(data, function(val, key) {
        data[key].SrNo = "" + (key + 1);
    })
    $(".grid20").data("kendoGrid").refresh();

    if(b < 100){
        var h = $('.grid20 .k-grid-content').height();

        if( h > 100){
            var h = $('.grid20 .k-grid-content').height(100);
        }
    }
    
}

info.ifEmpty = function(){
    var grid1 = $(".grid1").data("kendoGrid").dataSource.data();
    var grid2 = $(".grid2").data("kendoGrid").dataSource.data();
    var temp1 = ko.mapping.toJS(info.templateGrid1);
    var temp2 = ko.mapping.toJS(info.templateGrid2);

    if(grid1.length == 0){
        grid1.push(temp1);
    }

    if(grid2.length == 0){
        grid2.push(temp2)
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

info.LoanAmount = function(container, options){
    if(options.model[options.field] == 0)
        options.model[options.field] = ""

    $('<input data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            spinners : false
        });
}

info.Tenure = function(container, options){
    if(options.model[options.field] == 0)
        options.model[options.field] = ""

    $('<input data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            spinners : false
        });
}

info.Outstanding = function(container, options){
    if(options.model[options.field] == 0)
        options.model[options.field] = ""

    $('<input data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            spinners : false
        });
}

info.MonthlyInstallment = function(container, options){
    if(options.model[options.field] == 0)
        options.model[options.field] = ""

    $('<input data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            spinners : false
        });
}

info.detailPayment = function(e){
    data = []
    $.each(dataHierarchi(), function(i, set){
        $.each(set.Payment, function(i, dt){
            dt["LoanNo"] = set.LoanNo
            data.push(dt)
        })
        
    })

    

    $("<div/>").appendTo(e.detailCell).kendoGrid({
            dataSource: {
                data: data,
                // pageSize: 10,
                filter: { field: "LoanNo", operator: "eq", value: e.data.LoanNo }
            },
            // pageable: true,
            columns:[
                {
                    field: "payeeName",
                    title: "Payee Name",
                    headerAttributes: {
                        "class": "sub-bgcolor"
                    },
                },
                {
                    field: "instrumentNo",
                    title: "Payment No",
                    headerAttributes: {
                        "class": "sub-bgcolor"
                    },
                },
                {
                    field: "instrumentDate",
                    title: "Payment Date",
                    headerAttributes: {
                        "class": "sub-bgcolor"
                    },
                },
                {
                    field: "instrumentAmount",
                    title: "Payment Amount (Rs.)",
                    headerAttributes: {
                        "class": "sub-bgcolor"
                    },
                    template: function(d){
                        return app.formatnum(d.instrumentAmount)
                    }
                }
            ]
        });
    
}


$(function(){
	// info.customerList()
    info.scroll()
});