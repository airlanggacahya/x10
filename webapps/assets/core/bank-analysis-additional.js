
var url = "/bankanalysis";
databank = ko.observableArray([]);
var abbavg = 0;
var abbavgs = 0;
var isempty = ko.observable(false);
var idx = ko.observable();
var ebitdamargin = {}
var finalsummary = []
var odutilmax = 0
var unfreeze = ko.observable(false);
var caba = ko.observable(0);
var formVisibility = ko.observable(false);
var textConfirm = ko.observable("confirm");
var isEdit = false

var statusPage = {
    isConfirmed : ko.observable(false),
    isFreeze : ko.observable(false),
    rtrConfirm : ko.observable(false),
    confirmText : ko.observable('Confirm'),
    freezeText : ko.observable('Freeze')
};

var totalGrid = {
    BS : {
        BSMonthlyCredits : ko.observable(0),
        BSMonthlyDebits : ko.observable(0),
        BSNoOfCredits : ko.observable(0),
        BSNoOfDebits : ko.observable(0),
        BSOWChequeReturns : ko.observable(0),
        BSIWChequeReturns : ko.observable(0),
        BSIMarginPercent : ko.observable(0),
        BSImpMargin : ko.observable(0),
        BSOWReturnPercent : ko.observable(0),
        BSIWReturnPercent : ko.observable(0),
        BSDRCRRatio : ko.observable(0),
        ODUtilizationPercent : ko.observable(0)
    },
    OD : {
        ODSactionLimit : ko.observable(0),
        ODAvgUtilization : ko.observable(0),
        ODInterestPaid : ko.observable(0)
    },
    AML : {
        AMLAvgCredits : ko.observable(0),
        AMLAvgDebits : ko.observable(0)
    },
    ABB : ko.observable(0)
}

var initEvents = function () {
    filter().CustomerSearchVal.subscribe(function () {
        formVisibility(false)
    })
    filter().DealNumberSearchVal.subscribe(function () {
        formVisibility(false)
    })

    //$('#refresh').remove()
}
var fundbased = {
    accounttype : ko.observable(""),
    accountno : ko.observable(""),
    accountholder : ko.observable(""),
    sanclimit : ko.observable(""),
    roi : ko.observable(""),
    interestpermonth : ko.observable(""),
    sanctiondate : ko.observable(""),
    securityoffb : ko.observableArray([]),
}
var nonfundbased = {
    natureoffacility : ko.observable(""),
    othernatureoffacility : ko.observable(""),
    sanclimit : ko.observable(""),
    sanctiondate : ko.observable(""),
    securityofnfb : ko.observableArray([]),
}
var currentbased = {
    accounttype: ko.observable(""),
    accountno: ko.observable(""),
    accountholder: ko.observable("")
}

var fbselected = ko.observable(false)
var nfbselected = ko.observable(false)
var currentselected = ko.observable(false)

var bankaccount = {
    bankname : ko.observable(""),
    facilitytype : ko.observableArray([]),
    bankstttill : ko.observable(""),
    fundbased : {},
    nonfundbased : {},
    currentbased : {},
    nfbsecurity : ko.observableArray([]),
    fbsecurity : ko.observableArray([])
}
var getSearchVal = function(){
    return {
        CustomerId: parseInt(filter().CustomerSearchVal()),
        DealNo: filter().DealNumberSearchVal()
    };
}
var refreshFilter = function(){
    $(".toaster").html("");
    DrawDataBank(getSearchVal());
    setdatestt();
    initEvents();
    checkBSI();
}

var checkBSI = function(){
    ajaxPost("/ratio/getratioinputdataallconfirmed",{"customerId" : filter().CustomerSearchVal() + "|" + filter().DealNumberSearchVal()},function(res){
        if(res.Status != "OK"){
            fixToast("Balance Sheet Input Data Not Confirmed");
        }
    })
}

var addRowSecurityNFB = function(){
    return function(){
    bankaccount.nfbsecurity.push("")
    }
}

var deleteRowSecurityNFB = function(idx){
    return function(){
    bankaccount.nfbsecurity.splice(idx,1)
    }
}

var addRowSecurityFB = function(){
    return function(){
    bankaccount.fbsecurity.push("")
    }
}

var deleteRowSecurityFB = function(idx){
    return function(){
    bankaccount.fbsecurity.splice(idx,1)
    }
}

var setdatestt = function(){
    ajaxPost(url+"/getdatetemplate",getSearchVal(),function(res){
        //console.log(res.data.length)
        if (res.data.length > 0){
            //console.log(res.data[0].BankDetails[0].Month)
            $('#bankstt').data('kendoDatePicker').value(res.data[0].BankDetails[0].Month)
        }
    })
}

var disableSpinner = function(container, options){

    if(options.model[options.field] == 0)
        options.model[options.field] = ""
    
    $('<input data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoNumericTextBox({
        spinners : false,
        min: 0,
    });

}

var disableSpinnerAll = function(container, options){

    if(options.model[options.field] == 0)
        options.model[options.field] = ""
    
    $('<input data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoNumericTextBox({
        spinners : false,
        // min: 0,
    });

}

var disableInputSpinner = function(id){
    var numeric = $("#"+id).data("kendoNumericTextBox");
    numeric.wrapper
   .find(".k-numeric-wrap")
       .addClass("expand-padding")
       .find(".k-select").hide();
}
var onNatureChange = function(){
    var selected = $("#naturefacility").data("kendoDropDownList").value();
    if (selected == "Other"){
        $("#othernf").show();
    }else{
        $("#othernf").hide();
    }
}
function numChange(){
    try{
        var sanc = parseFloat($("#sanclimit").val());
        var roi = parseFloat($("#roiperannum").val());
        var res = app.checkNanOrInfinity((sanc*(roi/100)/12), 0);
        var sanc1 = app.checkNanOrInfinity((parseFloat(Math.round(res * 100) / 100).toFixed(2)), 0);
        $("#interestpermonth").val(sanc1);
    }
    catch(e){
        //console.log(e);
    }
}
function resetInput(){
    $('#bankdetailgridform').html("");
    $('#currentbankdetailgridform').html("");
    $('#nfb').hide();
    $('#fb').hide();
    $('#current').hide();
    $('#othernf').hide();
    $('#facilitytype').getKendoMultiSelect().value("")
    $('#actype').data('kendoDropDownList').select(0);
    $('#naturefacility').data('kendoDropDownList').select(0);
    $('#fbsanctiondate').data('kendoDatePicker').value(null);
    $('#nfbsanctiondate').data('kendoDatePicker').value(null);
    $('#bankstt').data('kendoDatePicker').value(null);
    $('input[name=fb]').attr('checked',false);
    $('input[name=nfb]').attr('checked',false);
    $('input[name=both]').attr('checked',false);
    $("#bankname").val("");
    $("#actype").val("");
    $("#acno").val("");
    $("#acholder").val("");
    $("#sanclimit").val("");
    $("#roiperannum").val("");
    $("#interestpermonth").val("");
    $("#securityfb").val("");
    //$("#naturefacility").val("");
    $("#othernaturefacility").val("");
    $("#nfbsanclimit").val("");
    $("#securitynfb").val("");
    $('#samenfb').attr('checked', false);
    $('#currentacno').val('')
    $('#currentacholder').val('')
    $('#same').hide();
    bankaccount.fbsecurity([])
    bankaccount.nfbsecurity([])
}

///Create Grid Data Bank///
var DrawDataBank = function(id){
    var fre = 0;
    var un= 0;
    var sa = 0;
    ajaxPost(url+"/getdatabankv2", id, function(res){
        var c = true;
        if(res.message != "" ){
            swal("Warning",res.message,"warning");
        }else{
            if(typeof res.data.SummaryAll != "undefined") {
                if(res.data.IsUpdate) {
                    swal("Warning", "There is an update for IMP Margin, please Re enter to load changes","warning");
                } else {
                    totalGrid.BS.BSMonthlyCredits(res.data.SummaryAll.BSMonthlyCredits)
                    totalGrid.BS.BSMonthlyDebits(res.data.SummaryAll.BSMonthlyDebits)
                    totalGrid.BS.BSNoOfCredits(res.data.SummaryAll.BSNoOfCredits)
                    totalGrid.BS.BSNoOfDebits(res.data.SummaryAll.BSNoOfDebits)
                    totalGrid.BS.BSOWChequeReturns(res.data.SummaryAll.BSOWChequeReturns)
                    totalGrid.BS.BSIWChequeReturns(res.data.SummaryAll.BSIWChequeReturns)
                    totalGrid.BS.BSIMarginPercent(res.data.SummaryAll.BSIMarginPercent)
                    totalGrid.BS.BSImpMargin(res.data.SummaryAll.BSImpMargin)
                    totalGrid.BS.BSOWReturnPercent(res.data.SummaryAll.BSOWReturnPercent)
                    totalGrid.BS.BSIWReturnPercent(res.data.SummaryAll.BSIWReturnPercent)
                    totalGrid.BS.BSDRCRRatio(res.data.SummaryAll.BSDRCRRatio)
                    totalGrid.BS.ODUtilizationPercent(res.data.SummaryAll.ODUtilizationPercent)
                    totalGrid.OD.ODSactionLimit(res.data.SummaryAll.ODSactionLimit)
                    totalGrid.OD.ODAvgUtilization(res.data.SummaryAll.ODAvgUtilization)
                    totalGrid.OD.ODInterestPaid(res.data.SummaryAll.ODInterestPaid)
                    totalGrid.AML.AMLAvgCredits(res.data.SummaryAll.AMLAvgCredits)
                    totalGrid.AML.AMLAvgDebits(res.data.SummaryAll.AMLAvgDebits)
                    totalGrid.ABB(res.data.SummaryAll.ABB)
                }
            }

            _.each(res.data.Detail, function(p){
                if(!p.IsConfirmed){
                    c = false;
                    return;
                }

                if(p.Status == 1 && p.IsFreeze == true){
                    fre++;
                }else if( p.Status == 1 && p.IsFreeze == false){
                    un++;
                }else if(p.Status == 0 && p.IsFreeze == false){
                    sa++;
                }
            });

            if(res.data.Detail != undefined && res.data.Detail.length > 0) {
                var bankDetail = res.data.Detail[0]
                statusPage.isConfirmed(bankDetail.IsConfirmed)
                statusPage.isFreeze(bankDetail.IsFreeze)
                checkStatusPage()
            }
        }

        // if(res.data.RTR != undefined && res.data.RTR.length > 0) {
        //     statusPage.rtrConfirm(res.data.RTR[0].Confirmed)
        // }

        if(res.data.AccountDetail.length != 0){
            checkConfirmedOrNot(res.data.AccountDetail[0].status, 1, 2, res.data, [], "Accounts Details");
        }else{
            checkConfirmedOrNot(0, 1, 2, res.data, [], "Accounts Details");
        }

        if(res.data.Detail.length != 0){
            formVisibility(true)
            isempty(false)

            constructOdccModel(res);
            databank(res.data.Detail);

            if(res.data.AccountDetail.length==0 && res.data.Ratio.Data.AuditStatus.length == 0){
                // swal("Warning", "Please Fill Account Detail Data First","warning");
                createBankingGrid(res.data.Summary,0);
            }else{
                createBankingGrid(res.data.Summary,totalGrid.BS.BSIMarginPercent()*100);
            }

            setTimeout(function() {
                databank().forEach(function(e,i) {
                    RenderGridDataBank(i,e);
                }, this);
                    generateAML(res.data);
            }, 100);
        }else{
            // checkConfirmedOrNot(0, 1, 2, res.data, [], "Accounts Details");
            isempty(true);
            // swal("Warning","Data Bank not found","warning");
            $("#bankstt").data("kendoDatePicker").value("")
        }

    });
}

var checkStatusPage = function() {
    if(statusPage.isConfirmed()) {
        statusPage.confirmText("Re-Enter")
        disabledAll(false)
    } else {
        statusPage.confirmText("Confirm")
        statusPage.freezeText("Freeze")
        statusPage.isFreeze(false)
        disabledAll(true)
    }

    if(statusPage.isFreeze()) {
        statusPage.freezeText("Unfreeze")
    } else {
        statusPage.freezeText("Freeze")
    }
}

var checkBtnFreeze = ko.pureComputed(function(){
    return (statusPage.isFreeze())? "btn-unfreeze":"btn-freeze"
})

var showModal = function(){
    //console.log("sarif")
}

var RenderGridDataBank = function(id, res){
    if (res.Status == 1){
        $('#bedit'+id).prop('disabled',true)
        $('#bdelete'+id).prop('disabled',true)
        $('#add').prop('disabled',true)
        $('#bankstt').data('kendoDatePicker').enable(false)
    }else{
        $('#bedit'+id).prop('disabled',false)
        $('#bdelete'+id).prop('disabled',false)
        $('#add').prop('disabled',false)
        $('#bankstt').data('kendoDatePicker').enable(true)
    }

    var fund = [];
    fund.push(res.DataBank[0].BankAccount.FundBased);
    var nonfund = [];
    nonfund.push(res.DataBank[0].BankAccount.NonFundBased);
    var current = [];
    current.push(res.DataBank[0].BankAccount.CurrentBased);
    var factype = res.DataBank[0].BankAccount.FacilityType;

    $('#fundgrid'+id).kendoGrid({
        dataSource : fund,
        scrollable:false,
        columns :[
            {
                title : 'Account Type',
                field : 'AccountType',
                headerAttributes: { "class": "sub-bgcolor" },
            },
            {
                title : 'Account Holder',
                field : 'AccountHolder',
                headerAttributes: { "class": "sub-bgcolor" },
            },
            {
                title : 'Account No',
                field : 'AccountNo',
                headerAttributes: { "class": "sub-bgcolor" },
                attributes:{ "style": "text-align:right" },
            },
            {
                title : 'ROI (%)',
                field : 'ROI',
                headerAttributes: { "class": "sub-bgcolor" },
                template: function(){
                    var num = fund[0].ROI
                    // if (fund[id] != undefined ){
                    //     return fund[0].ROI + "%"
                    // }
                    return num + "%"
                },
                attributes:{ "style": "text-align:right" },
            },
            {
                title : 'Sanction Limit (Rs. Lacs)',
                field : 'SancLimit',
                headerAttributes: { "class": "sub-bgcolor" },
                template : "#: app.formatnum( SancLimit, 2 ) #",
                attributes:{ "style": "text-align:right" },
            },
            {
                title : 'Sanction Date',
                field : 'SanctionDate',
                headerAttributes: { "class": "sub-bgcolor" },
                template: function(d){
                    if(d.SanctionDate.indexOf("1970") > -1){
                        return "";
                    }

                    return  kendo.toString(new Date(d.SanctionDate), 'dd-MMM-yyyy');
                }
            },
            {
                title : 'Interest Per Month (Rs. Lacs)',
                field : 'InterestPerMonth',
                headerAttributes: { "class": "sub-bgcolor" },
                template: function(){
                    var num = app.formatnum(fund[0].InterestPerMonth, 2);
                    // if (fund[id] != undefined ){
                    //     return app.formatnum(fund[id].InterestPerMonth, 2)
                    // }

                    return num
                },
                attributes:{ "style": "text-align:right" },
            },
            // {
            //     title : 'Security For FB',
            //     field : 'SecurityOfFB',
            // },
        ]
    });

    var fbsecdata = []
    for (var i = 0; i < fund.length; i++){
        if (typeof fund[i].SecurityOfFB === 'string' || fund[i].SecurityOfFB == '' || fund[i].SecurityOfFB == null){
            fbsecdata.push([])
        }else{
            for (var j = 0; j < fund[i].SecurityOfFB.length; j++){
                var d = {fbsec : fund[i].SecurityOfFB[j]}
                fbsecdata.push(d)
            }
        }
    }
    if (fbsecdata.length != 0 && fbsecdata[0] != ""){
        $('#secfbs'+id).kendoGrid({
        dataSource : fbsecdata,
        scrollable:false,
        columns:[
            {
                title : 'Security for Fund Based',
                field : 'fbsec',
                headerAttributes: { "class": "headersecfb k-header header-bgcolor" },
            },
        ]
     });
    }


    var nonfundExpanded = (function (dataBefore) {
        var dataAfter = [];
        dataBefore.forEach(function (d) {
            var uniq = toolkit.randomNumber(0, 1000000);
            if(typeof d.SecurityOfNFB == "string" || d.SecurityOfNFB == null){
                 d.SecurityOfNFB = []
            }
            d.SecurityOfNFB.forEach(function (e) {
                dataAfter.push({
                    uniq: uniq,
                    NatureOfFacility: d.NatureOfFacility,
                    OtherNatureOfFacility: d.OtherNatureOfFacility,
                    SancLimit: d.SancLimit,
                    SanctionDate: d.SanctionDate,
                    SecurityOfNFB: e
                })
            })

            if(d.SecurityOfNFB.length ==0){
                dataAfter.push({
                    uniq: uniq,
                    NatureOfFacility: d.NatureOfFacility,
                    OtherNatureOfFacility: d.OtherNatureOfFacility,
                    SancLimit: d.SancLimit,
                    SanctionDate: d.SanctionDate,
                    SecurityOfNFB: ""
                })
            }
        })
        return dataAfter;
    })(nonfund);

    //console.log(nonfund);
    //console.log(nonfundExpanded);

    $('#nonfundgrid'+id).kendoGrid({
        dataSource : nonfundExpanded,
        columns :[
            {
                title : 'Nature of Facility',
                headerAttributes: { "class": "sub-bgcolor" },
                width : 150,
                field : 'NatureOfFacility',
                template : function (d) {
                    return '<span data-uniq="' + d.uniq + '">' + d.NatureOfFacility + '</span>'
                }
            },
            {
                title : 'Sanction Limit (Rs. Lacs)',
                headerAttributes: { "class": "sub-bgcolor" },
                width : 150,
                field : 'SancLimit',
                template : "#: app.formatnum( SancLimit, 2 ) #",
                attributes:{ "style": "text-align:right" },
            },
            {
                title : 'Sanction Date',
                field : 'SanctionDate',
                headerAttributes: { "class": "sub-bgcolor" },
                width : 150,
                template: function(d){
                    if(d.SanctionDate.indexOf("1970") > -1){
                        return "";
                    }

                    return  kendo.toString(new Date(d.SanctionDate), 'dd-MMM-yyyy');
                }
            },
            {
                title : 'Security for Non-Fun Based',
                field : 'SecurityOfNFB',
                headerAttributes: { "class": "sub-bgcolor" }
            },
        ],
        dataBound: function () {
            var $nonFundSel = $('#nonfundgrid'+id);
            var $nonFundGrid = $nonFundSel.data('kendoGrid')

            Object.keys(_.groupBy(nonfundExpanded, 'uniq')).forEach(function (uniq) {
                var $foundRows = $('[data-uniq="' + uniq + '"]');

                $('[data-uniq="' + uniq + '"]').each(function (i, e) {
                    var $row = $(e).closest('tr');

                    if (i == 0) {
                        $row.find('td:lt(3)')
                            .attr('rowspan', $foundRows.size());
                    } else {
                        $row.find('td:eq(3)').css('border-left', '1px solid #ebebeb');
                        $row.find('td:lt(3)').remove();
                    }
                })
            })
        }
    });

    $('#currentgrid'+id).kendoGrid({
        dataSource:current,
        scrollable:false,
        columns :[
            {
                title : 'Account Type',
                field : 'AccountType',
                headerAttributes: { "class": "sub-bgcolor" },
            },
            {
                title : 'Account Holder',
                field : 'AccountHolder',
                headerAttributes: { "class": "sub-bgcolor" },
            },
            {
                title : 'Account No',
                field : 'AccountNo',
                headerAttributes: { "class": "sub-bgcolor" },
            },
        ]
    });

    // idxfb = _.findIndex(factype,"Fund Based")
    // idxnfb = _.findIndex(factype,"Non-Fund Based")
    // idxcurr = _.findIndex(factype,"Current")

    idxfb = factype.indexOf("Fund Based")
    idxnfb = factype.indexOf("Non-Fund Based")
    idxcurr = factype.indexOf("Current")

    $('#fundgrid'+id).hide();
    $("#bankdetailgrid"+id).hide();
    $('#headersecfbs'+id).hide();
    $('#secfbs'+id).hide();
    $('#nonfundgrid'+id).hide();
    $('#headernfbs'+id).hide();
    $('#currentgrid'+id).hide();
    $("#currentbankdetailgrid"+id).hide();
    $('#headercurrents'+id).hide()

    if (idxfb > -1){
        $('#fundgrid'+id).show();
        $("#bankdetailgrid"+id).show();
        $('#headersecfbs'+id).show();
        $('#secfbs'+id).show();
    }
    if (idxnfb > -1){
        $('#nonfundgrid'+id).show();
        $('#headernfbs'+id).show();
    }
    if (idxcurr > -1){
        $('#currentgrid'+id).show();
        $("#currentbankdetailgrid"+id).show();
        $('#headercurrents'+id).show();
    }

    $("#bankdetailgrid"+id).kendoGrid({
        dataSource : {
            data : res.DataBank[0].BankDetails,
            schema:{
                model: {
                    id: "Month",
                    fields: {
                        Month:{ editable: false, nullable: true },
                        CreditNonCash: {type: "number", editable: true, min: 1},
                        CreditCash: {type: "number", editable: true, min: 1},
                        DebitNonCash: {type: "number", editable: true, min: 1},
                        DebitCash: {type: "number", editable: true, min: 1},
                        AvgBalon: {type: "number", editable: true, min: 1},
                        OdCcLimit: {type: "number", editable: true, min: 1},
                        ActualInterestPaid: {type: "number", editable: true, min: 1},
                        NoOfDebit: {type: "number", editable: true, min: 1},
                        NoOfCredit: {type: "number", editable: true, min: 1},
                        OwCheque: {type: "number", editable: true, min: 1},
                        IwCheque: {type: "number", editable: true, min: 1},
                    }
                }
            },
        },
        scrollable:false,
        editable: false,
        navigatable: true,
        batch: true,
        columns : createBankDetailGridCols(false),
        dataBound: function () {
            var data = res.DataBank[0].BankDetails
            var account = res.DataBank[0].BankAccount

            var averageReceipt = {}

            averageReceipt.creditTotal = app.checkNanOrInfinity((_.sumBy(data, function (d) {
                return d.CreditNonCash + d.CreditCash;
            }) / (data.length == 0 ? 1 : data.length)), 0)

            averageReceipt.debitTotal = app.checkNanOrInfinity((_.sumBy(data, function (d) {
                return d.DebitNonCash + d.DebitCash;
            }) / (data.length == 0 ? 1 : data.length)),0)

            var BlonLength = _.filter(data,function(x){return x.AvgBalon > 0});
            BlonLength = BlonLength == undefined ? 0 : BlonLength.length;
            averageReceipt.avgBlon = app.checkNanOrInfinity((_.sumBy(data, 'AvgBalon')
                / (BlonLength == 0 ? 1 : BlonLength)),0)

            averageReceipt.utilPerMonth = _.max(data.map(function (d) {
                var result = app.checkNanOrInfinity((d.AvgBalon / d.OdCcLimit), 0)

                if(result == Infinity){
                    return 0
                }else{
                    return result
                }

            }))

            var pembagi = 0
            if(data.length > 0){
                for(var i=0;i<data.length;i++){
                    if(data[i].ActualInterestPaid > 0) pembagi++;
                }
            }

            averageReceipt.actualInterestPaid = app.checkNanOrInfinity((_.sumBy(data, 'ActualInterestPaid') / (pembagi == 0 ? 1 : pembagi)),0) //(data.length == 0 ? 1 : data.length)

            averageReceipt.noOfDebit = _.sumBy(data, 'NoOfDebit')
            averageReceipt.noOfCredit = _.sumBy(data, 'NoOfCredit')
            averageReceipt.owCheque = _.sumBy(data, 'OwCheque')
            averageReceipt.iwCheque = _.sumBy(data, 'IwCheque')

            var $footer1 = $('<tr />').addClass('k-footer-template')
                .appendTo($("#bankdetailgrid"+id).find('tbody'))

            $('<td />').appendTo($footer1)
                .html('Average Receipts').attr('colspan', 3)
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.creditTotal, 2)).attr("style","text-align:right")
            $('<td />').appendTo($footer1)
                .html('&nbsp;').attr('colspan', 2)
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.debitTotal, 2)).attr("style","text-align:right")
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.avgBlon, 2)).attr("style","text-align:right")
            $('<td />').appendTo($footer1)
                .html(kendo.toString(averageReceipt.utilPerMonth, 'p2')).attr("style","text-align:right")
            $('<td />').appendTo($footer1)
                .html('&nbsp;')
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.actualInterestPaid, 2)).attr("style","text-align:right")
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.noOfDebit)).attr("style","text-align:right")
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.noOfCredit)).attr("style","text-align:right")
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.owCheque)).attr("style","text-align:right")
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.iwCheque)).attr("style","text-align:right")

            var averageOpenLimit = {}

            //averageOpenLimit.creditTotal = account.SancLimit * averageReceipt.utilPerMonth
            if (averageReceipt.utilPerMonth == 0 || account.FundBased.SancLimit == 0){
                averageOpenLimit.creditTotal = 0
            }else{
                averageOpenLimit.creditTotal = account.FundBased.SancLimit * (1-averageReceipt.utilPerMonth)
            }

            averageOpenLimit.annualisedCredit = averageReceipt.creditTotal * 12

            var $footer2 = $('<tr />').addClass('k-footer-template')
                .appendTo($("#bankdetailgrid"+id).find('tbody'))

            $('<td />').appendTo($footer2)
                .html('Average Open Limit').attr('colspan', 3)
            $('<td />').appendTo($footer2)
                .html(app.formatnum(averageOpenLimit.creditTotal, 2)).attr("style","text-align:right")
            $('<td />').appendTo($footer2)
                .html('&nbsp;').attr('colspan', 3)
            $('<td />').appendTo($footer2)
                .html("Annualised Credits").attr('colspan', 2)
            $('<td />').appendTo($footer2)
                .html(app.formatnum(averageOpenLimit.annualisedCredit, 2)).attr("style","text-align:right")
            $('<td />').appendTo($footer2)
                // .html('% BTO In This Account').attr('colspan', 5)
                .html('&nbsp').attr('colspan', 5)
        }
    });

    $("#currentbankdetailgrid"+id).kendoGrid({
        dataSource : {
            data : res.DataBank[0].CurrentBankDetails,
            schema:{
                model: {
                    id: "Month",
                    fields: {
                        Month:{ editable: false, nullable: true },
                        CreditNonCash: {type: "number", editable: true, min: 1},
                        CreditCash: {type: "number", editable: true, min: 1},
                        DebitNonCash: {type: "number", editable: true, min: 1},
                        DebitCash: {type: "number", editable: true, min: 1},
                        AvgBalon: {type: "number", editable: true, min: 1},
                        NoOfDebit: {type: "number", editable: true, min: 1},
                        NoOfCredit: {type: "number", editable: true, min: 1},
                        OwCheque: {type: "number", editable: true, min: 1},
                        IwCheque: {type: "number", editable: true, min: 1},
                    }
                }
            },
        },
        scrollable:false,
        editable: false,
        navigatable: true,
        batch: true,
        columns : createCurrentBankDetailGridCols(false),
        dataBound: function () {
            var data = res.DataBank[0].CurrentBankDetails
            var account = res.DataBank[0].BankAccount

            var averageReceipt = {}

            averageReceipt.creditTotal = app.checkNanOrInfinity((_.sumBy(data, function (d) {
                return d.CreditNonCash + d.CreditCash;
            }) / (data.length == 0 ? 1 : data.length)),0)

            averageReceipt.debitTotal = app.checkNanOrInfinity((_.sumBy(data, function (d) {
                return d.DebitNonCash + d.DebitCash;
            }) / (data.length == 0 ? 1 : data.length)),0)

            var BlonLength = _.filter(data,function(x){return x.AvgBalon > 0});
            BlonLength = BlonLength == undefined ? 0 : BlonLength.length;
            averageReceipt.avgBlon = app.checkNanOrInfinity((_.sumBy(data, 'AvgBalon')
                / (BlonLength == 0 ? 1 : BlonLength)),0)

            averageReceipt.utilPerMonth = app.checkNanOrInfinity((_.max(data.map(function (d) {
                var result = app.checkNanOrInfinity((d.AvgBalon / d.OdCcLimit),0)

                if(result == Infinity){
                    return 0
                }else{
                    return result
                }

            }))),0)

            averageReceipt.actualInterestPaid = app.checkNanOrInfinity((_.sumBy(data, 'ActualInterestPaid')
                / (data.length == 0 ? 1 : data.length)),0)

            averageReceipt.noOfDebit = _.sumBy(data, 'NoOfDebit')
            averageReceipt.noOfCredit = _.sumBy(data, 'NoOfCredit')
            averageReceipt.owCheque = _.sumBy(data, 'OwCheque')
            averageReceipt.iwCheque = _.sumBy(data, 'IwCheque')

            var $footer1 = $('<tr />').addClass('k-footer-template')
                .appendTo($("#currentbankdetailgrid"+id).find('tbody'))

            $('<td />').appendTo($footer1)
                .html('Average Receipts').attr('colspan', 3)
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.creditTotal, 2))
            $('<td />').appendTo($footer1)
                .html('&nbsp;').attr('colspan', 2)
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.debitTotal, 2))
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.avgBlon, 2))
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.noOfDebit, 1))
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.noOfCredit, 1))
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.owCheque))
            $('<td />').appendTo($footer1)
                .html(app.formatnum(averageReceipt.iwCheque))

            var averageOpenLimit = {}

            //averageOpenLimit.creditTotal = account.SancLimit * averageReceipt.utilPerMonth
            if (averageReceipt.utilPerMonth == 0 || account.FundBased.SancLimit == 0){
                averageOpenLimit.creditTotal = 0
            }else{
                averageOpenLimit.creditTotal = account.FundBased.SancLimit * (1-averageReceipt.utilPerMonth)
            }

            averageOpenLimit.annualisedCredit = averageReceipt.creditTotal * 12

            var $footer2 = $('<tr />').addClass('k-footer-template')
                .appendTo($("#currentbankdetailgrid"+id).find('tbody'))

            $('<td />').appendTo($footer2)
                .html('').attr('colspan', 3)
            $('<td />').appendTo($footer2)
                .html('')
            $('<td />').appendTo($footer2)
                .html('&nbsp;').attr('colspan', 3)
            $('<td />').appendTo($footer2)
                .html("Annualised Credits").attr('colspan', 2)
            $('<td />').appendTo($footer2)
                .html(app.formatnum(averageOpenLimit.annualisedCredit, 2))
            $('<td />').appendTo($footer2)
                .html('% BTO In This Account').attr('colspan', 5)
        }
    });

    $(".k-grid-cancel-changes").attr("class","btn btn-sm btn-warning k-grid-cancel-changes mgright pull-right");
    $(".k-grid-save-changes").attr("class","btn btn-sm btn-success k-grid-save-changes mgright pull-right");
    $(".k-grid-edit").attr("class","btn btn-sm btn-warning k-grid-edit mgright pull-right");
    $(".k-grid-update").attr("class","btn btn-sm btn-success k-grid-update");
    $(".k-grid-cancel").attr("class","btn btn-sm btn-warning k-grid-cancel");
}

var createBankDetailGridCols = function(isForm){

    cols = [{
        title : "Month",
        field : "Month",
        width : 100,
        //format:"{0:dd-MMM-yyyy}",
        headerAttributes: { "class": "sub-bgcolor" },
        template: "#= kendo.toString(kendo.parseDate(Month, 'yyyy-MM-dd'), 'MMM-yyyy') #"
    }, {
        headerTemplate: "Monthly Credits<br />(Rs. Lacs)",
        headerAttributes: { "class": "sub-bgcolor" },
        columns: [{
            title : "Non Cash",
            field : "CreditNonCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.CreditNonCash == 0 ){
                    return "";
                }else{
                    return app.formatnum(d.CreditNonCash,2)
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "Cash",
            field : "CreditCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.CreditCash == 0 ){
                    return "";
                }else{
                    return app.formatnum(d.CreditCash,2)
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "Total",
            headerAttributes: { "class": "sub-bgcolor" },
            template : "#: app.formatnum(CreditNonCash+CreditCash,2)#",
            attributes:{ "style": "text-align:right" },
        }]
    }, {
        headerTemplate: "Monthly Debits<br />(Rs. Lacs)",
        headerAttributes: { "class": "sub-bgcolor" },
        columns: [{
            title : "Non Cash",
            field : "DebitNonCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.DebitNonCash == 0 ){
                    return "";
                }else{
                    return app.formatnum( d.DebitNonCash,2)
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "Cash",
            field : "DebitCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.DebitCash == 0 ){
                    return "";
                }else{
                    return app.formatnum(d.DebitCash,2)
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "Total",
            headerAttributes: { "class": "sub-bgcolor" },
            template : "#:app.formatnum(DebitNonCash+DebitCash,2)#",
            attributes:{ "style": "text-align:right" },
        }]
    }, {
        title : "AVG BAL ON<br />1+7+14+21+28<br />(Rs. Lacs)",
        field : "AvgBalon",
        headerAttributes: { "class": "sub-bgcolor" },
        width : 120,
        template: function(d){
            if (d.AvgBalon == 0 ){
                    return "";
            }else{
                return app.formatnum(d.AvgBalon,2)
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "OD/CC Utilization Per Month",
        headerAttributes: { "class": "sub-bgcolor" },
        template : function (d) {
            var value = toolkit.number(d.AvgBalon / d.OdCcLimit)
            return kendo.toString(value, 'p2')
        },
        attributes:{ "style": "text-align:right" },
    }, {
        title : "OD/CC Limit Per Month (Rs. Lacs)",
        field : "OdCcLimit",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.OdCcLimit == 0 ){
                    return "";
            }else{
                return app.formatnum(d.OdCcLimit,2)
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "Actual Interest paid (Rs. Lacs)",
        field : "ActualInterestPaid",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.ActualInterestPaid == 0 ){
                    return "";
            }else{
                return app.formatnum(d.ActualInterestPaid, 2)
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "No. of Debits",
        field : "NoOfDebit",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.NoOfDebit == 0 ){
                    return "";
            }else{
                return d.NoOfDebit
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "No. of Credits",
        field : "NoOfCredit",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.NoOfCredit == 0 ){
                    return "";
            }else{
                return d.NoOfCredit
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "O/W Cheque Returns",
        field : "OwCheque",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.OwCheque == 0 ){
                    return "";
            }else{
                return app.formatnum(d.OwCheque)
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "I/W Cheque Returns",
        field : "IwCheque",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.IwCheque == 0 ){
                    return "";
            }else{
                return app.formatnum(d.IwCheque)
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }];

    //if (isForm) cols.splice(4, 1);
    if (isForm){
        cols = [{
            title : "Month",
            field : "Month",
            width : 100,
            headerAttributes: { "class": "sub-bgcolor" },
            template: "#= kendo.toString(kendo.parseDate(Month, 'yyyy-MM-dd'), 'MMM-yyyy') #"
        }, {
            headerTemplate: "Monthly Credits<br />(Rs. Lacs)",
            headerAttributes: { "class": "sub-bgcolor" },
            columns: [{
                title : "Non Cash",
                field : "CreditNonCash",
                headerAttributes: { "class": "sub-bgcolor" },
                template: function(d){
                    if (d.CreditNonCash == "" || d.CreditNonCash == null){
                        return 0;
                    }else{
                        return app.formatnum(d.CreditNonCash,2)
                    }
                },
                editor: disableSpinner,
                attributes:{ "style": "text-align:right" },
            }, {
                title : "Cash",
                field : "CreditCash",
                headerAttributes: { "class": "sub-bgcolor" },
                template: function(d){
                    if (d.CreditCash == "" || d.CreditCash == null){
                    return 0;
                    }else{
                        return app.formatnum(d.CreditCash,2)
                    }
                },
                editor: disableSpinnerAll,
                attributes:{ "style": "text-align:right" },
            },
            // {
            //     title : "Total",
            //     headerAttributes: { "class": "sub-bgcolor" },
            //     template : "#:CreditNonCash+CreditCash#"
            // }
            ]
        }, {
            headerTemplate: "Monthly Debits<br />(Rs. Lacs)",
            headerAttributes: { "class": "sub-bgcolor" },
            columns: [{
                title : "Non Cash",
                field : "DebitNonCash",
                headerAttributes: { "class": "sub-bgcolor" },
                template: function(d){
                    if (d.DebitNonCash == "" || d.DebitNonCash == null){
                    return 0;
                    }else{
                        return app.formatnum(d.DebitNonCash,2)
                    }
                },
                editor: disableSpinner,
                attributes:{ "style": "text-align:right" },
            }, {
                title : "Cash",
                field : "DebitCash",
                headerAttributes: { "class": "sub-bgcolor" },
                template: function(d){
                    if (d.DebitCash == "" || d.DebitCash == null){
                    return 0;
                    }else{
                        return app.formatnum(d.DebitCash,2)
                    }
                },
                editor: disableSpinnerAll,
                attributes:{ "style": "text-align:right" },
            },
            // {
            //     title : "Total",
            //     headerAttributes: { "class": "sub-bgcolor" },
            //     template : "#:DebitNonCash+DebitCash#"
            // }
            ]
        }, {
            title : "AVG BAL ON<br />1+7+14+21+28<br />(Rs. Lacs)",
            field : "AvgBalon",
            headerAttributes: { "class": "sub-bgcolor" },
            width : 120,
            template: function(d){
                if (d.AvgBalon == "" || d.AvgBalon == null){
                    return 0;
                }else{
                    return app.formatnum(d.AvgBalon,2)
                }
            },
            editor: disableSpinnerAll,
            attributes:{ "style": "text-align:right" },
        },
        // {
        //     title : "OD/CC Utilization Per Months",
        //     headerAttributes: { "class": "sub-bgcolor" },
        //     template : function (d) {
        //         var value = toolkit.number(d.AvgBalon / d.OdCcLimit)
        //         return kendo.toString(value, 'p1')
        //     }
        // },
        {
            title : "OD/CC Limit Per Month (Rs. Lacs)",
            field : "OdCcLimit",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.OdCcLimit == "" || d.OdCcLimit == null){
                    return 0;
                }else{
                    return app.formatnum(d.OdCcLimit,2)
                }
            },
            editor: disableSpinnerAll,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "Actual Interest paid (Rs. Lacs)",
            field : "ActualInterestPaid",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.ActualInterestPaid == "" || d.ActualInterestPaid == null){
                    return 0;
                }else{
                    return app.formatnum(d.ActualInterestPaid,2)
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "No. of Debits",
            field : "NoOfDebit",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.NoOfDebit == "" || d.NoOfDebit == null){
                    return 0;
                }else{
                    return d.NoOfDebit
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "No. of Credits",
            field : "NoOfCredit",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.NoOfCredit == "" || d.NoOfCredit == null){
                    return 0;
                }else{
                    return d.NoOfCredit
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "O/W Cheque Returns",
            field : "OwCheque",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.OwCheque == "" || d.OwCheque == null){
                    return 0;
                }else{
                    return d.OwCheque
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "I/W Cheque Returns",
            field : "IwCheque",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.IwCheque == "" || d.IwCheque == null){
                    return 0;
                }else{
                    return d.IwCheque
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }];
    }

    return cols;
}

var createCurrentBankDetailGridCols = function(isForm){

    cols = [{
        title : "Monthoi",
        field : "Month",
        width : 100,
        headerAttributes: { "class": "sub-bgcolor" },
        template: "#= kendo.toString(kendo.parseDate(Month, 'yyyy-MM-dd'), 'MMM-yyyy') #"
    }, {
        headerTemplate: "Monthly Credits<br />(Rs. Lacs)",
        headerAttributes: { "class": "sub-bgcolor" },
        columns: [{
            title : "Non Cash",
            field : "CreditNonCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.CreditNonCash == 0 ){
                    return "";
                }else{
                    return app.formatnum(d.CreditNonCash,2)
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "Cash",
            field : "CreditCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.CreditCash == 0 ){
                    return "";
                }else{
                    return app.formatnum(d.CreditCash,2)
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "Total",
            headerAttributes: { "class": "sub-bgcolor" },
            template : "#:app.formatnum(CreditNonCash+CreditCash,2)#",
            attributes:{ "style": "text-align:right" },
        }]
    }, {
        headerTemplate: "Monthly Debits<br />(Rs. Lacs)",
        headerAttributes: { "class": "sub-bgcolor" },
        columns: [{
            title : "Non Cash",
            field : "DebitNonCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.DebitNonCash == 0 ){
                    return "";
                }else{
                    return app.formatnum(d.DebitNonCash,2)
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "Cash",
            field : "DebitCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.DebitCash == 0 ){
                    return "";
                }else{
                    return app.formatnum(d.DebitCash,2)
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "Total",
            headerAttributes: { "class": "sub-bgcolor" },
            template : "#:app.formatnum(DebitNonCash+DebitCash,2)#",
            attributes:{ "style": "text-align:right" },
        }]
    }, {
        title : "AVG BAL ON<br />1+7+14+21+28<br />(Rs. Lacs)",
        field : "AvgBalon",
        headerAttributes: { "class": "sub-bgcolor" },
        width : 120,
        template: function(d){
            if (d.AvgBalon == 0 ){
                    return "";
            }else{
                return app.formatnum(d.AvgBalon,2)
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    },
       {
        title : "No. of Debits",
        field : "NoOfDebit",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.NoOfDebit == 0 ){
                    return "";
            }else{
                return d.NoOfDebit
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "No. of Credits",
        field : "NoOfCredit",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.NoOfCredit == 0 ){
                    return "";
            }else{
                return d.NoOfCredit
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "O/W Cheque Returns",
        field : "OwCheque",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.OwCheque == 0 ){
                    return "";
            }else{
                return app.formatnum(d.OwCheque)
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "I/W Cheque Returns",
        field : "IwCheque",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.IwCheque == 0 ){
                    return "";
            }else{
                return app.formatnum(d.IwCheque)
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }];

    //if (isForm) cols.splice(4, 1);
    if (isForm){
        cols = [{
        title : "Month",
        field : "Month",
        width : 100,
        headerAttributes: { "class": "sub-bgcolor" },
        template: "#= kendo.toString(kendo.parseDate(Month, 'yyyy-MM-dd'), 'MMM-yyyy') #"
    }, {
        headerTemplate: "Monthly Credits<br />(Rs. Lacs)",
        headerAttributes: { "class": "sub-bgcolor" },
        columns: [{
            title : "Non Cash",
            field : "CreditNonCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.CreditNonCash == "" || d.CreditNonCash == null){
                    return 0;
                }else{
                    return app.formatnum(d.CreditNonCash,2)
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "Cash",
            field : "CreditCash",
            headerAttributes: { "class": "sub-bgcolor"  },
            template: function(d){
                if (d.CreditCash == ""|| d.CreditCash == null){
                    return 0;
                }else{
                    return app.formatnum(d.CreditCash,2)
                }
            },
            editor: disableSpinnerAll,
            attributes:{ "style": "text-align:right" },
        },
        // {
        //     title : "Total",
        //     headerAttributes: { "class": "sub-bgcolor" },
        //     template : "#:CreditNonCash+CreditCash#"
        // }
        ]
    }, {
        headerTemplate: "Monthly Debits<br />(Rs. Lacs)",
        headerAttributes: { "class": "sub-bgcolor" },
        columns: [{
            title : "Non Cash",
            field : "DebitNonCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.DebitNonCash == ""|| d.DebitNonCash == null){
                    return 0;
                }else{
                    return app.formatnum(d.DebitNonCash,2)
                }
            },
            editor: disableSpinner,
            attributes:{ "style": "text-align:right" },
        }, {
            title : "Cash",
            field : "DebitCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.DebitCash == ""|| d.DebitCash == null){
                    return 0;
                }else{
                    return app.formatnum(d.DebitCash,2)
                }
            },
            editor: disableSpinnerAll,
            attributes:{ "style": "text-align:right" },
        },

        ]
    }, {
        title : "AVG BAL ON<br />1+7+14+21+28<br />(Rs. Lacs)",
        field : "AvgBalon",
        headerAttributes: { "class": "sub-bgcolor" },
        width : 120,
        template: function(d){
            if (d.AvgBalon == ""|| d.AvgBalon == null){
                    return 0;
            }else{
                return app.formatnum(d.AvgBalon,2)
            }
        },
        editor: disableSpinnerAll,
        attributes:{ "style": "text-align:right" },
    },
      {
        title : "No. of Debits",
        field : "NoOfDebit",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.NoOfDebit == ""|| d.NoOfDebit == null){
                    return 0;
            }else{
                return d.NoOfDebit
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "No. of Credits",
        field : "NoOfCredit",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.NoOfCredit == ""|| d.NoOfCredit == null){
                    return 0;
            }else{
                return d.NoOfCredit
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "O/W Cheque Returns",
        field : "OwCheque",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.OwCheque == ""|| d.OwCheque == null){
                    return 0;
            }else{
                return app.formatnum(d.OwCheque)
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }, {
        title : "I/W Cheque Returns",
        field : "IwCheque",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.IwCheque == "" || d.IwCheque == null){
                    return 0;
            }else{
                return app.formatnum(d.IwCheque)
            }
        },
        editor: disableSpinner,
        attributes:{ "style": "text-align:right" },
    }];
    }

    return cols;
}

var createBankDetailGrid = function(res){
    $("#bankdetailgridform").kendoGrid({
        dataSource: {
            transport: {
                read: function(yo){
                    yo.success(res);
                },
                create:function(yo){
                    var dirty = $('#bankdetailgridform').data('kendoGrid').dataSource.hasChanges();
                    if(!dirty){
                        swal("Warning","Data has no changes","warning");
                        return;
                    }
                    var callData = {
                        CustomerId : "",
                        DealNo : "",
                        BankAccount : {},
                        BankDetails : []
                    };
                    fundbased.accounttype($("#actype").data("kendoDropDownList").value());
                    fundbased.accountholder($("#acholder").val());
                    fundbased.accountno($("#acno").val());
                    fundbased.roi(Number($("#roiperannum").val()));
                    fundbased.sanclimit(Number($("#sanclimit").val()));
                    fundbased.interestpermonth(Number($("#interestpermonth").val()));
                    fundbased.securityoffb($("#securityfb").val());

                    if ($("#naturefacility").data("kendoDropDownList").value() != "Other"){
                        nonfundbased.natureoffacility($("#naturefacility").data("kendoDropDownList").value());
                    }else{
                        nonfundbased.natureoffacility($("#othernaturefacility").val());
                    }
                    nonfundbased.sanclimit(Number($("#nfbsanclimit").val()));
                    nonfundbased.securityofnfb($("#securitynfb").val());
                    bankaccount.bankname($("#bankname").val());
                    bankaccount.bankstttill($("#bankstt").data("kendoDatePicker").value());
                    var todayDate = new Date().toISOString();
                    if (bankaccount.facilitytype() != "" && bankaccount.facilitytype() == "Fund Based"){
                        nonfundbased.sanctiondate(todayDate);
                        fundbased.sanctiondate($("#fbsanctiondate").data("kendoDatePicker").value());
                    }else if (bankaccount.facilitytype() != "" && bankaccount.facilitytype() == "Non Fund Based"){
                        fundbased.sanctiondate(todayDate);
                        nonfundbased.sanctiondate($("#nfbsanctiondate").data("kendoDatePicker").value());
                    }else{
                        fundbased.sanctiondate($("#fbsanctiondate").data("kendoDatePicker").value());
                        nonfundbased.sanctiondate($("#nfbsanctiondate").data("kendoDatePicker").value());
                    }
                    bankaccount.fundbased = fundbased;
                    bankaccount.nonfundbased = nonfundbased;

                    callData.CustomerId = filter().CustomerSearchVal();
                    callData.DealNo = filter().DealNumberSearchVal();
                    callData.BankAccount = bankaccount;

                    for(var i in yo.data["models"]){
                        var dt = yo.data["models"][i];
                        callData.BankDetails.push(dt);
                    }

                    ajaxPost(url+"/createbankanalysis",callData, function(res){
                        yo.success(res.data);
                        swal("Success","Data Saved","success");
                        $('#modaldb').modal('hide');
                        DrawDataBank(getSearchVal());
                        resetInput();
                    });

                }
            },
            batch: true,
            navigatable: true,
            schema:{
                model: {
                    id: "Id",
                    fields: {
                        Id: { editable: false, nullable: true },
                        Month:{type: "date",editable: false, nullable: false},
                        CreditNonCash:{type: "number", editable: true, min: 1},
                        CreditCash:{type: "number", editable: true, min: 1 },
                        DebitNonCash:{type: "number", editable: true,min: 1 },
                        DebitCash:{type: "number", editable: true,min: 1 },
                        AvgBalon:{type: "number", editable: true,min: 1 },
                        OdCcLimit:{type: "number", validation: { required: true, min: 1} },
                        ActualInterestPaid:{type: "number",  validation: { required: true, min: 1} },
                        NoOfDebit:{type: "number",  validation: { required: true, min: 1} },
                        NoOfCredit:{type: "number",  validation: { required: true, min: 1} },
                        OwCheque:{type: "number", editable: true, min: 1 },
                        IwCheque:{type: "number", editable: true, min: 1 },
                    }
                }
            }
        },
        height: 200,
        //toolbar: [{name:"save",text:"Save Bank Data"},{name:"cancel",text:"Cancel"}],
        editable: true,
        columns: createBankDetailGridCols(true),
    });

    $(".k-grid-cancel-changes").attr("class","btn btn-sm btn-reset k-grid-cancel-changes mgright pull-right");
    $(".k-grid-save-changes").attr("class","btn btn-sm btn-save k-grid-save-changes mgright pull-right");

    $("#currentbankdetailgridform").kendoGrid({
        dataSource: {
            data:res,
            batch: true,
            navigatable: true,
            schema:{
                model: {
                    id: "Id",
                    fields: {
                        Id: { editable: false, nullable: true },
                        Month:{type: "date",editable: false, nullable: false},
                        CreditNonCash:{type: "number", editable: true, min: 1},
                        CreditCash:{type: "number", editable: true, min: 1 },
                        DebitNonCash:{type: "number", editable: true,min: 1 },
                        DebitCash:{type: "number", editable: true,min: 1 },
                        AvgBalon:{type: "number", editable: true,min: 1 },
                        NoOfDebit:{type: "number",  validation: { required: true, min: 1} },
                        NoOfCredit:{type: "number",  validation: { required: true, min: 1} },
                        OwCheque:{type: "number", editable: true, min: 1 },
                        IwCheque:{type: "number", editable: true, min: 1 },
                    }
                }
            }
        },
        height: 200,
        editable: true,
        columns: createCurrentBankDetailGridCols(true),
    });
}

function onSelect(e) {
    var dataItem = e.dataItem;
    //console.log(e)
    if (dataItem.text == 'Fund Based'){
        $('#fb').show()
        fbselected(true)
        if (nfbselected() == true){
            $('#same').show()
        }
    }else if(dataItem.text == 'Non-Fund Based'){
        $('#nfb').show()
        nfbselected(true)
        if (fbselected() == true){
            $('#same').show()
        }
    }else{
        $('#current').show()
    }
};

function onDeselect(e) {
    var dataItem = e.dataItem;
    if (dataItem.text == 'Fund Based'){
        $('#fb').hide()
        fbselected(false)
        $('#same').hide()
    }else if(dataItem.text == 'Non-Fund Based'){
        $('#nfb').hide()
        nfbselected(false)
        $('#same').hide()
    }else{
        $('#current').hide()
    }
};

var onfactypechange = function(){
    if ($('#facilitytype').getKendoMultiSelect().value().length == 0){
        $('#fb').hide()
        $('#nfb').hide()
        $('#same').hide()
        $('#current').hide()
        $('#savebtn').prop('disabled',true);
    }else{
         $('#savebtn').prop('disabled',false);
    }


    if ($('#securitynfb0').val() == undefined){
        bankaccount.nfbsecurity([""])
    }

    if ($('#securityfb0').val() == undefined){
        bankaccount.fbsecurity([""])
    }
}

scroll = function(){
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

$(document).ready(function(){
    scroll()
    $('#facilitytype').kendoMultiSelect({
        dataTextField: "text",
        dataValueField: "value",
        dataSource:[
            {text:"Fund Based",value:"Fund Based"},
            {text:'Non-Fund Based',value:'Non-Fund Based'},
            {text:'Current',value:'Current'},
        ],
        deselect: onDeselect,
        select: onSelect,
        change: onfactypechange,
    });

    $('#savebtn').prop('disabled',true);
    $('#updatebtn').hide();
    $('#cancelbtn').click(function(){
        $('#modaldb').modal('hide');
        resetInput();
        setdatestt();
    });
    $('#updatebtn').click(function(){
        updateDataBank(idx());
    });
    $("#bankstt").kendoDatePicker({
        format: "MMM-yyyy",
        change: onChange,
        depth:"year",
        start:"year"
    });
    $('#savebtn').click(function(){
        saveDataBank();
    });

    $("#add").click(function(){
        // $("#nfbsl").css("margin-left", "0px !important")
        // $("#ee").css("margin-left", "0px !important")
        // $("#aa").css("margin-left", "0px !important")
        bankaccount.nfbsecurity([""])
        bankaccount.fbsecurity([""])
        if (filter().CustomerSearchVal() == ""){
            swal("Warning","Select Customer First","warning");
            return;
        }else{
            $('#updatebtn').hide();
            //$('#savebtn').prop('disabled',true);
            $('#savebtn').show();

            resetInput();
            ajaxPost(url+"/getdetailbanktemplate",filter().CustomerSearchVal(),function(res){
                if (res.data.length > 0) {
                    res.data[0].BankDetails.forEach(function(bd){
                        bd.ActualInterestPaid = 0;
                        bd.AvgBalon = 0;
                        bd.CreditCash = 0;
                        bd.CreditNonCash = 0;
                        bd.CreditTotal = 0;
                        bd.DebitCash = 0;
                        bd.DebitNonCash = 0;
                        bd.DebitTotal = 0;
                        bd.IwCheque = 0;
                    })

                    createBankDetailGrid(res.data[0].BankDetails);
                    $('#bankstt').data('kendoDatePicker').value(res.data[0].BankDetails[0].Month);

                    $("#nfbsanclimit").data('kendoNumericTextBox').value("")
                    $("#sanclimit").data('kendoNumericTextBox').value("")
                    $("#roiperannum").data('kendoNumericTextBox').value("")

                    $('#modaldb').modal('show');

                    setTimeout(function(){
                        $("#nfbsanctiondate").getKendoDatePicker().value("");
                        $("#fbsanctiondate").getKendoDatePicker().value("");

                    },2000);

                }else{
                    //$('#modaldb').modal('show');
                    swal("Warning","Select Statement Date","warning");
                }
            });

        }
    });

    function validateDataBank(databank) {
        $(".toaster").html("");
        var listCheck = {
            "_" : [
                {
                    "field": "BankAccount.BankName",
                    "name": "Bank Name"
                },
                {
                    "field": "BankAccount.FacilityType",
                    "name": "Facility Type"
                }
            ],
            "Fund Based" : [
                {
                    "field": "BankAccount.FundBased.AccountType",
                    "name": "A/C Type"
                },
                {
                    "field": "BankAccount.FundBased.AccountNo",
                    "name": "A/C No"
                },
                {
                    "field": "BankAccount.FundBased.AccountHolder",
                    "name": "A/C Holder"
                },
                {
                    "field": "BankAccount.FundBased.SancLimit",
                    "name": "Sanction Limit"
                },
                {
                    "field": "BankAccount.FundBased.ROI",
                    "name": "ROI Per Annum"
                },
                {
                    "field": "BankAccount.FundBased.SanctionDate",
                    "name": "Sanction Date",
                    "type": "date"
                },
                {
                    "field": "BankAccount.FundBased.SecurityOfFB",
                    "name": "Security for FB"
                }
            ],
            "Non-Fund Based": [
                {
                    "field": "BankAccount.NonFundBased.NatureOfFacility",
                    "name": "Nature of Facility"
                },
                {
                    "field": "BankAccount.NonFundBased.SancLimit",
                    "name": "Sanction Limit"
                },
                {
                    "field": "BankAccount.NonFundBased.SanctionDate",
                    "name": "Sanction Date",
                    "type": "date"
                },
                {
                    "field": "BankAccount.NonFundBased.SecurityOfNFB",
                    "name": "Security for NFB"
                }
            ],
            "Current": [
                {
                    "field": "BankAccount.CurrentBased.AccountNo",
                    "name": "A/C No"
                },
                {
                    "field": "BankAccount.CurrentBased.AccountHolder",
                    "name": "A/C Holder"
                }
            ]
        }

        var facilitylist = _.cloneDeep(_.get(databank, "BankAccount.FacilityType", []))
        var error = false
        facilitylist.unshift("_");
        _.each(facilitylist, function (facility) {
            _.each(listCheck[facility], function (check) {
                var v = _.get(databank, check.field, undefined)
                console.log(v)
                if (typeof(v) == "undefined" || // v is undefined
                    v == null || // v is null
                    (typeof(v) == "string" && v.trim().length == 0) || // v is string and empty
                    (_.isArray(v) && v.length == 0) || // v is array and empty
                    (_.isArray(v) && _.findIndex(v, function(val) { return val.trim().length == 0; }) != -1) || // v is array, and one of them is empty string
                    (_.get(check, "type", "") == "date" && v.substring(0, 10) == "1970-01-01")) // type date
                    {
                    error = true
                    fixToast("Please fill " + _.get(databank, "BankAccount.BankName", "") + " " + check.name)
                }
            })
        })

        return error
    }

    function validateBank(val) {
        var error = false
        _.each(_.get(val, "DataBank", []), function (databank) {
            error = error || validateDataBank(databank)
        })

        return error
    }

    function validateForm() {
        var error = false
        _.each(databank(), function (val) {
            error = error || validateBank(val)
        })

        return error
    }

    $("#othernf").hide();
    $("#bconfirm").click(function(){
        if(statusPage.isConfirmed() == false){
            if (validateForm())
                return;
        }
        

        if (filter().CustomerSearchVal() == "" || filter().DealNumberSearchVal() == ""){
            swal("Warning","Select Customer First","warning");
            return;
        }else{
            resetInput();
            var param = getSearchVal()
            param.IsConfirm = !statusPage.isConfirmed()

            ajaxPost(url+"/setconfirmedv2", param, function(){
                if(!statusPage.isConfirmed()) {
                    swal("Successfully Confirmed", "", "success");
                } else {
                    swal("Please Edit / Enter Data", "", "success");
                    DrawDataBank(getSearchVal());
                }
                statusPage.isConfirmed(!statusPage.isConfirmed())
                checkStatusPage()

                // swal("Success","Data confirmed","success");
                // if($('#bconfirm').text() == "confirm"){
                //     $('#bconfirm').removeClass('btn-confirm').addClass('btn-reenter').html("Re-Enter");
                //     swal("Successfully Confirmed", "", "success");
                //     caba(1)
                //     textConfirm("reenter")
                // }else{
                //     $('#bconfirm').removeClass('btn-reenter').addClass('btn-confirm').html("Confirm");
                //     swal("Please Edit / Enter Data", "", "success");
                //     caba(0)
                //     textConfirm("confirm")
                // }
                // //setTimeout(function() {
                //     databank().forEach(function(e,i) {
                //         RenderGridDataBank(i,e);
                //     }, this);

                // //}, 50);
                // refreshFilter()
            });
        }
    });

    $("#bankdetailgridform").on("mousedown", ".k-grid-cancel-changes", function (e) {
        $('#modaldb').modal('hide');
        resetInput();
    });

    $("#bankdetailgridform").on("mousedown", ".k-grid-update", function (e) {
       updateDataBank(idx());
    });

    $("#actype").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            {text: "OD/CC", value: "OD/CC"},
            {text: "Other", value: "Other"},
        ],
        index: 0,
    });
    $("#nfbsanclimit").kendoNumericTextBox({ format: '#.00', spinners:false });
    // $('#interestpermonth').kendodoNumericTextBox({format: '#.00', spinners:false });
    $('#sanclimit').kendoNumericTextBox({format: '#.00', spinners:false });
    $('#roiperannum').kendoNumericTextBox({format: '#.00', spinners:false });

    $("#sanclimit").keyup(function(){
        numChange();
    });

    $("#roiperannum").keyup(function(){
        numChange();
    });

    $("#fbsanctiondate").kendoDatePicker({
        format:"dd/MM/yyyy"
    });

    $("#nfbsanctiondate").kendoDatePicker({
        format:"dd/MM/yyyy"
    });

    $("#naturefacility").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            {text: "Letter of Credit", value: "Letter of Credit"},
            {text: "Bank Guarantee", value: "Bank Guarantee"},
            {text: "Other", value: "Other"},
        ],
        index: 0,
        change: onNatureChange,
    });

    $("#nfb").hide();
    $("#fb").hide();
    $("#same").hide();
    $('#current').hide()

    $('input[type=radio][name=fb]').change(function(){
        $('#savebtn').prop('disabled',false);
        if ($("input[name=fb]:checked").val()){
            $("#same").hide();
            $("#fb").show();
            $("#nfb").hide();
            $('input[name=nfb]').attr('checked',false);
            $('input[name=both]').attr('checked',false);
            bankaccount.facilitytype("Fund Based");
        }
    });

    $('input[type=radio][name=nfb]').change(function(){
        $('#savebtn').prop('disabled',false);
        if ($("input[name=nfb]:checked").val()){
            $("#same").hide();
            $("#fb").hide();
            $("#nfb").show();
            $('input[name=fb]').attr('checked',false);
            $('input[name=both]').attr('checked',false);
            bankaccount.facilitytype("Non Fund Based");
        }
    });

    $('input[type=radio][name=both]').change(function(){
        $('#savebtn').prop('disabled',false);
        if ($("input[name=both]:checked").val()){
            $("#fb").show();
            $("#nfb").show();
            $("#same").show();
            $('input[name=fb]').attr('checked',false);
            $('input[name=nfb]').attr('checked',false);
            bankaccount.facilitytype("Both");
        }
    });
    $("#samenfb").change(function(){
        if($("#samenfb").is(':checked')){
            $('#securityfb').val($('#securitynfb').val());
            arrnfbsec = []
            for (var i = 0; i < bankaccount.nfbsecurity().length; i++){
                arrnfbsec.push($("#securitynfb"+i).val())
            }
            bankaccount.fbsecurity(arrnfbsec)
            for (var i = 0; i < arrnfbsec.length; i++){
                $('#securityfb'+i).val(arrnfbsec[i])
            }
        }
    });
})

// var editBankData = function(index){
//     return function(){
//         $('#savebtn').hide();
//         $('#updatebtn').show();
//         var gridfund = $("#fundgrid"+index).data("kendoGrid");
//         var gridnonfund = $("#nonfundgrid"+index).data("kendoGrid");
//         resetInput();
//         $('#bankname').val(databank()[index].DataBank[0].BankAccount.BankName);
//         if (databank()[index].DataBank[0].BankAccount.FacilityType == "Fund Based"){

//             $('#fbradio').prop('checked', true);
//             $('#fb').show();
//             if(databank()[index].DataBank[0].BankAccount.FundBased.AccountType == "Current"){
//                 $('#actype').data('kendoDropDownList').select(1);
//             }else{
//                 $('#actype').data('kendoDropDownList').select(0);
//             }
//             $('#acno').val(databank()[index].DataBank[0].BankAccount.FundBased.AccountNo);
//             $('#acholder').val(databank()[index].DataBank[0].BankAccount.FundBased.AccountHolder);
//             $('#sanclimit').val(databank()[index].DataBank[0].BankAccount.FundBased.SancLimit);
//             $('#roiperannum').val(databank()[index].DataBank[0].BankAccount.FundBased.ROI);
//             $('#interestpermonth').val(databank()[index].DataBank[0].BankAccount.FundBased.InterestPerMonth);
//             $('#fbsanctiondate').data('kendoDatePicker').value(databank()[index].DataBank[0].BankAccount.FundBased.SanctionDate);
//             $('#securityfb').val(databank()[index].DataBank[0].BankAccount.FundBased.SecurityOfFB);
//         }else if (databank()[index].DataBank[0].BankAccount.FacilityType == "Non Fund Based"){

//             $('#nfbradio').prop('checked', true);
//             $('#nfb').show();
//             if(databank()[index].DataBank[0].BankAccount.NonFundBased.NatureOfFacility == "Letter Of Credit"){
//                 $('#naturefacility').data('kendoDropDownList').select(0);
//             }else if(databank()[index].DataBank[0].BankAccount.NonFundBased.NatureOfFacility == "Bank Guarantee"){
//                 $('#naturefacility').data('kendoDropDownList').select(1);
//             }else{
//                 $('#naturefacility').data('kendoDropDownList').select(2);
//                 $('#othernf').show();
//                 $('#othernaturefacility').val(databank()[index].DataBank[0].BankAccount.NonFundBased.NatureOfFacility);
//             }

//             $('#nfbsanclimit').val(databank()[index].DataBank[0].BankAccount.NonFundBased.SancLimit);
//             $('#nfbsanctiondate').data('kendoDatePicker').value(databank()[index].DataBank[0].BankAccount.NonFundBased.SanctionDate);
//             $('#securitynfb').val(databank()[index].DataBank[0].BankAccount.NonFundBased.SecurityOfNFB);
//         }else{

//             $('#bothradio').prop('checked', true);
//             $('#fb').show();
//             $('#same').show();
//             if(databank()[index].DataBank[0].BankAccount.FundBased.AccountType == "Current"){
//                 $('#actype').data('kendoDropDownList').select(1);
//             }else{
//                 $('#actype').data('kendoDropDownList').select(0);
//             }
//             $('#acno').val(databank()[index].DataBank[0].BankAccount.FundBased.AccountNo);
//             $('#acholder').val(databank()[index].DataBank[0].BankAccount.FundBased.AccountHolder);
//             $('#sanclimit').val(databank()[index].DataBank[0].BankAccount.FundBased.SancLimit);
//             $('#roiperannum').val(databank()[index].DataBank[0].BankAccount.FundBased.ROI);
//             $('#interestpermonth').val(databank()[index].DataBank[0].BankAccount.FundBased.InterestPerMonth);
//             $('#fbsanctiondate').data('kendoDatePicker').value(databank()[index].DataBank[0].BankAccount.FundBased.SanctionDate);
//             $('#securityfb').val(databank()[index].DataBank[0].BankAccount.FundBased.SecurityOfFB);

//             $('#nfb').show();
//             if(databank()[index].DataBank[0].BankAccount.NonFundBased.NatureOfFacility == "Letter Of Credit"){
//                 $('#naturefacility').data('kendoDropDownList').select(0);
//             }else if(databank()[index].DataBank[0].BankAccount.NonFundBased.NatureOfFacility == "Bank Guarantee"){
//                 $('#naturefacility').data('kendoDropDownList').select(1);
//             }else{
//                 $('#naturefacility').data('kendoDropDownList').select(2);
//                 $('#othernf').show();
//                 $('#othernaturefacility').val(databank()[index].DataBank[0].BankAccount.NonFundBased.NatureOfFacility);
//             }
//             // $('#naturefacility').val(databank()[index].DataBank[0].BankAccount.NonFundBased.NatureOfFacility);
//             //$('#othernaturefacility').val(databank()[index].DataBank[0].BankAccount.NonFundBased.OtherNatureOfFacility);
//             $('#nfbsanclimit').val(databank()[index].DataBank[0].BankAccount.NonFundBased.SancLimit);
//             $('#nfbsanctiondate').data('kendoDatePicker').value(databank()[index].DataBank[0].BankAccount.NonFundBased.SanctionDate);
//             $('#securitynfb').val(databank()[index].DataBank[0].BankAccount.NonFundBased.SecurityOfNFB);
//         }

//         ajaxPost(url+"/getdetailbanktemplate",filter().CustomerSearchVal(),function(res){
//             if (res.data.length > 0) {
//                 res.data[0].BankDetails.forEach(function(bd){
//                     bd.ActualInterestPaid = 0;
//                     bd.AvgBalon = 0;
//                     bd.CreditCash = 0;
//                     bd.CreditNonCash = 0;
//                     bd.CreditTotal = 0;
//                     bd.DebitCash = 0;
//                     bd.DebitNonCash = 0;
//                     bd.DebitTotal = 0;
//                     bd.IwCheque = 0;
//                 })
//                 createBankDetailGrid(res.data[0].BankDetails);
//                 $('#bankstt').data('kendoDatePicker').value(res.data[0].BankDetails[0].Month);
//                 $('#modaldb').modal('show');
//                 loadGridDataBank(databank()[index].DataBank[0].BankDetails);
//                 loadGridCurrentDataBank(databank()[index].DataBank[0].BankDetails)

//             }else{
//                 $('#modaldb').modal('show');
//                 loadGridDataBank(databank()[index].DataBank[0].BankDetails);
//                 loadGridCurrentDataBank(databank()[index].DataBank[0].BankDetails)
//             }
//         });
//         idx(index);
//         return true;
//     }
// }

var deleteBankData = function(index) {
    return function(){
        swal({
            title: "Are you sure?",
            text: "You want to delete",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it"
        }).then(function() {
            var id = databank()[index].Id
            var param = {Id: id}
            ajaxPost(url+"/deletev2",param,function(res){
                //console.log(res)


                if(res.success) {
                    swal("Success","Data deleted !","success")
                    refreshFilter()
                } else {
                    swal("Error",res.message,"error")
                }
            })
        })
    }
}

var editBankData = function(index){
    return function(){
        isEdit = true
        $('#savebtn').hide()
        $('#updatebtn').show()
        resetInput()
        $('#bankname').val(databank()[index].DataBank[0].BankAccount.BankName)
        var factype = databank()[index].DataBank[0].BankAccount.FacilityType
        $('#facilitytype').getKendoMultiSelect().value(factype)
        if (factype.indexOf('Non-Fund Based') > -1 && factype.indexOf('Fund Based') > -1){
            $('#same').show()
        }

        if (factype.indexOf('Fund Based') > -1){
            fbselected(true)
            $('#fb').show()
            if(databank()[index].DataBank[0].BankAccount.FundBased.AccountType == "OD/CC"){
                $('#actype').data('kendoDropDownList').select(0)
            }else{
                $('#actype').data('kendoDropDownList').select(1)
            }
            $('#acno').val(databank()[index].DataBank[0].BankAccount.FundBased.AccountNo)
            $('#acholder').val(databank()[index].DataBank[0].BankAccount.FundBased.AccountHolder)
            $('#sanclimit').data('kendoNumericTextBox').value(databank()[index].DataBank[0].BankAccount.FundBased.SancLimit)
            $('#roiperannum').data('kendoNumericTextBox').value(databank()[index].DataBank[0].BankAccount.FundBased.ROI)
            var sanc1 = app.checkNanOrInfinity((parseFloat(Math.round(databank()[index].DataBank[0].BankAccount.FundBased.InterestPerMonth * 100) / 100).toFixed(2)),0);
            $('#interestpermonth').val(sanc1)
            if(databank()[index].DataBank[0].BankAccount.FundBased.SanctionDate.indexOf("1970") > -1){
                $('#fbsanctiondate').val("")
            }else{
                $('#fbsanctiondate').data('kendoDatePicker').value(databank()[index].DataBank[0].BankAccount.FundBased.SanctionDate)
            }

            // SecurityofFB
            bankaccount.fbsecurity(databank()[index].DataBank[0].BankAccount.FundBased.SecurityOfFB)
            for (var i = 0; i < bankaccount.fbsecurity().length; i++){
                $('#securityfb'+i).val(bankaccount.fbsecurity()[i])
            }

            //loadGridDataBank(databank()[index].DataBank[0].BankDetails)
        }

        if (factype.indexOf('Non-Fund Based') > -1){
            nfbselected(true)
            $('#nfb').show()
            if(databank()[index].DataBank[0].BankAccount.NonFundBased.NatureOfFacility == "Letter Of Credit"){
                $('#naturefacility').data('kendoDropDownList').select(0)
            }else if(databank()[index].DataBank[0].BankAccount.NonFundBased.NatureOfFacility == "Bank Guarantee"){
                $('#naturefacility').data('kendoDropDownList').select(1)
            }else{
                $('#naturefacility').data('kendoDropDownList').select(2)
                $('#othernf').show()
                $('#othernaturefacility').val(databank()[index].DataBank[0].BankAccount.NonFundBased.NatureOfFacility)
            }

            $('#nfbsanclimit').data('kendoNumericTextBox').value(databank()[index].DataBank[0].BankAccount.NonFundBased.SancLimit)
            if(databank()[index].DataBank[0].BankAccount.NonFundBased.SanctionDate.indexOf("1970") > -1){
                $('#nfbsanctiondate').val("")
            }else{
                $('#nfbsanctiondate').data('kendoDatePicker').value(databank()[index].DataBank[0].BankAccount.NonFundBased.SanctionDate)
            }

            var arrsecnfbs = databank()[index].DataBank[0].BankAccount.NonFundBased.SecurityOfNFB

            if(typeof arrsecnfbs === "string" || arrsecnfbs == ""){
                bankaccount.nfbsecurity([""])
            }else{
                for (var i = 0; i < arrsecnfbs.length; i++){
                    if (arrsecnfbs[i] == ''){
                        arrsecnfbs.splice(i)
                    }
                }
                bankaccount.nfbsecurity(arrsecnfbs)
            }

            for (var i = 0; i < arrsecnfbs.length; i++){
                $('#securitynfb'+i).val(arrsecnfbs[i])
            }

        }

        if (factype.indexOf('Current') > -1){
            $('#current').show()
            $('#currentacno').val(databank()[0].DataBank[0].BankAccount.CurrentBased.AccountNo)
            $('#currentacholder').val(databank()[0].DataBank[0].BankAccount.CurrentBased.AccountHolder)
            //loadGridCurrentDataBank(databank()[index].DataBank[0].CurrentBankDetails)
        }

        ajaxPost(url+"/getdetailbanktemplate",filter().CustomerSearchVal(),function(res){
            $('#modaldb').modal('show')

            if (res.data.length > 0){
                $('#bankstt').data('kendoDatePicker').value(res.data[0].BankDetails[0].Month)
            }

            var datafunddetail = databank()[index].DataBank[0].BankDetails
            var datacurrentdetail = databank()[index].DataBank[0].CurrentBankDetails

            if (datafunddetail != null){
                loadGridDataBank(databank()[index].DataBank[0].BankDetails)
            }else{
                loadGridDataBank(res.data[0].BankDetails)
            }

            if (datacurrentdetail != null){
                loadGridCurrentDataBank(databank()[index].DataBank[0].CurrentBankDetails)
            }else{
                loadGridCurrentDataBank(res.data[0].BankDetails)
            }
        });

        // ajaxPost(url+"/getdetailbanktemplate",filter().CustomerSearchVal(),function(res){
        //     console.log(res)
        //     if (res.data.length > 0) {
        //         res.data[0].BankDetails.forEach(function(bd){
        //             bd.ActualInterestPaid = 0;
        //             bd.AvgBalon = 0;
        //             bd.CreditCash = 0;
        //             bd.CreditNonCash = 0;
        //             bd.CreditTotal = 0;
        //             bd.DebitCash = 0;
        //             bd.DebitNonCash = 0;
        //             bd.DebitTotal = 0;
        //             bd.IwCheque = 0;
        //         })
        //         createBankDetailGrid(res.data[0].BankDetails);
        //         $('#bankstt').data('kendoDatePicker').value(res.data[0].BankDetails[0].Month);
        //         $('#modaldb').modal('show');
        //         loadGridDataBank(databank()[index].DataBank[0].BankDetails);
        //         loadGridCurrentDataBank(databank()[index].DataBank[0].CurrentBankDetails)

        //     }else{
        //         $('#modaldb').modal('show');
        //         loadGridDataBank(databank()[index].DataBank[0].BankDetails);
        //         loadGridCurrentDataBank(databank()[index].DataBank[0].CurrentBankDetails)
        //     }
        // });

        // var datafunddetail = databank()[index].DataBank[0].BankDetails
        // var datacurrentdetail = databank()[index].DataBank[0].CurrentBankDetails

        // if (datafunddetail != null)

        idx(index);
        isEdit = false
        return true;
    }
}

var loadGridDataBank = function(res){
    $("#bankdetailgridform").html("");
     $("#bankdetailgridform").kendoGrid({
        dataSource: {
            data:res,
            batch: true,
            navigatable: true,
            schema:{
                model: {
                    id: "Id",
                    fields: {
                        Id: { editable: false, nullable: true },
                        Month:{type: "date",editable: false, nullable: false},
                        CreditNonCash:{type: "number", editable: true, min: 1},
                        CreditCash:{type: "number", editable: true, min: 1 },
                        DebitNonCash:{type: "number", editable: true,min: 1 },
                        DebitCash:{type: "number", editable: true,min: 1 },
                        AvgBalon:{type: "number", editable: true,min: 1 },
                        OdCcLimit:{type: "number", validation: { required: true, min: 1} },
                        ActualInterestPaid:{type: "number",  validation: { required: true, min: 1} },
                        NoOfDebit:{type: "number",  validation: { required: true, min: 1} },
                        NoOfCredit:{type: "number",  validation: { required: true, min: 1} },
                        OwCheque:{type: "number", editable: true, min: 1 },
                        IwCheque:{type: "number", editable: true, min: 1 },
                    }
                }
            }
        },
        height: 200,
        //toolbar: [{name:"update",text:"Update Bank Data"},{name:"cancel",text:"Cancel"}],
        editable: true,
        columns: createBankDetailGridCols(true),
    });

    $(".k-grid-cancel-changes").attr("class","btn btn-sm btn-warning k-grid-cancel-changes mgright pull-right");
    $(".k-grid-update").attr("class","btn btn-sm btn-success k-grid-update mgright pull-right");
}

var loadGridCurrentDataBank = function(res){
    $("#currentbankdetailgridform").html("");
     $("#currentbankdetailgridform").kendoGrid({
        dataSource: {
            data:res,
            batch: true,
            navigatable: true,
            schema:{
                model: {
                    id: "Id",
                    fields: {
                        Id: { editable: false, nullable: true },
                        Month:{type: "date",editable: false, nullable: false},
                        CreditNonCash:{type: "number", editable: true, min: 1},
                        CreditCash:{type: "number", editable: true, min: 1 },
                        DebitNonCash:{type: "number", editable: true,min: 1 },
                        DebitCash:{type: "number", editable: true,min: 1 },
                        AvgBalon:{type: "number", editable: true,min: 1 },
                        NoOfDebit:{type: "number",  validation: { required: true, min: 1} },
                        NoOfCredit:{type: "number",  validation: { required: true, min: 1} },
                        OwCheque:{type: "number", editable: true, min: 1 },
                        IwCheque:{type: "number", editable: true, min: 1 },
                    }
                }
            }
        },
        height: 200,
        //toolbar: [{name:"update",text:"Update Bank Data"},{name:"cancel",text:"Cancel"}],
        editable: true,
        columns: createCurrentBankDetailGridCols(true),
    });

    $(".k-grid-cancel-changes").attr("class","btn btn-sm btn-warning k-grid-cancel-changes mgright pull-right");
    $(".k-grid-update").attr("class","btn btn-sm btn-success k-grid-update mgright pull-right");
}

var blankdate = function(val){
    if(val == undefined)
        return true

    if(val == "")
        return true

    if(val == null){
        return true
    }
}

var saveDataBank = function(){
    if($("#bankname").val() == ""){
        swal("Warning","Please fill bank name first","warning");
        return;
    }


    nfbsanctiondate
    fbsanctiondate

    var gridbankdet = $("#bankdetailgridform").data("kendoGrid");
    var gridcurrentbankdet = $('#currentbankdetailgridform').data("kendoGrid");
    var gridbankdetdirty = $("#bankdetailgridform").data("kendoGrid").dataSource.hasChanges();
    det = gridbankdet.dataSource._data;
    currdet = gridcurrentbankdet.dataSource._data;


    var callData = {
        CustomerId : "",
        DealNo : "",
        BankAccount : {},
        BankDetails : [],
        CurrentBankDetails : [],
    };
    fundbased.accounttype($("#actype").data("kendoDropDownList").value());
    fundbased.accountholder($("#acholder").val());
    fundbased.accountno($("#acno").val());
    fundbased.roi(Number($("#roiperannum").val()));
    fundbased.sanclimit(Number($("#sanclimit").val()));
    fundbased.interestpermonth(Number($("#interestpermonth").val()));
    arrfbsec = []
    for (var i = 0; i < bankaccount.fbsecurity().length; i++){
        arrfbsec.push($("#securityfb"+i).val())
    }
    fundbased.securityoffb(arrfbsec);

    if ($("#naturefacility").data("kendoDropDownList").value() != "Other"){
        nonfundbased.natureoffacility($("#naturefacility").data("kendoDropDownList").value());
    }else{
        nonfundbased.natureoffacility($("#othernaturefacility").val());
    }
    nonfundbased.sanclimit(Number($("#nfbsanclimit").val()));
    arrnfbsec = []
    for (var i = 0; i < bankaccount.nfbsecurity().length; i++){
        arrnfbsec.push($("#securitynfb"+i).val())
    }
    nonfundbased.securityofnfb(arrnfbsec);
    bankaccount.bankname($("#bankname").val());
    bankaccount.bankstttill($("#bankstt").data("kendoDatePicker").value().toISOString());
    var todayDate = new Date().toISOString();

    var latestfacttype = $('#facilitytype').getKendoMultiSelect().value()

         if (latestfacttype.indexOf('Fund Based') > -1){
        var dat1 = $("#fbsanctiondate").data("kendoDatePicker").value()
        if(!blankdate(dat1) ){
            var date1 = kendo.toString(new Date($("#fbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z";
            fundbased.sanctiondate(date1);
        }else{
            //$("#fbsanctiondate").data("kendoDatePicker").value("01/01/1970")
            var date1 = kendo.toString(new Date($("#fbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z";
            fundbased.sanctiondate(date1);
        }
    }else{
         //$("#fbsanctiondate").data("kendoDatePicker").value("01/01/1970")
            var date1 = kendo.toString(new Date($("#fbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z";
            fundbased.sanctiondate(date1);
    }

    if (latestfacttype.indexOf("Non-Fund Based") > -1){
        var dat2 = $("#nfbsanctiondate").data("kendoDatePicker").value()
        if( !blankdate(dat2)){
            var date2 = kendo.toString(new Date($("#nfbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z";
            nonfundbased.sanctiondate(date2);
        }else{
            //$("#nfbsanctiondate").data("kendoDatePicker").value("01/01/1970")
            var date2 = kendo.toString(new Date($("#nfbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z"
            nonfundbased.sanctiondate(date2);
        }
    }else{
         //$("#nfbsanctiondate").data("kendoDatePicker").value("01/01/1970")
            var date2 = kendo.toString(new Date($("#nfbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z"
            nonfundbased.sanctiondate(date2);
    }


    bankaccount.facilitytype($('#facilitytype').getKendoMultiSelect().value())
    currentbased.accountholder($('#currentacholder').val())
    currentbased.accountno($('#currentacno').val())
    currentbased.accounttype($('#currentactype').val())

    bankaccount.fundbased = fundbased;
    bankaccount.nonfundbased = nonfundbased;
    bankaccount.currentbased = currentbased

    callData.CustomerId = filter().CustomerSearchVal();
    callData.DealNo = filter().DealNumberSearchVal();
    callData.BankAccount = bankaccount;

    for (var i = 0;i<det.length;i++){
        var bankdet = {}
        bankdet.Month = det[i].Month
        bankdet.CreditNonCash= det[i].CreditNonCash
        bankdet.CreditCash = det[i].CreditCash
        bankdet.CreditTotal = det[i].CreditTotal
        bankdet.DebitNonCash = det[i].DebitNonCash
        bankdet.DebitCash = det[i].DebitCash
        bankdet.DebitTotal = det[i].DebitTotal
        bankdet.AvgBalon = det[i].AvgBalon
        bankdet.OdCcUtilization = det[i].OdCcUtilization
        bankdet.OdCcLimit = det[i].OdCcLimit
        bankdet.ActualInterestPaid = det[i].ActualInterestPaid
        bankdet.NoOfDebit = det[i].NoOfDebit
        bankdet.NoOfCredit = det[i].NoOfCredit
        bankdet.OwCheque = det[i].OwCheque
        bankdet.IwCheque = det[i].IwCheque
        callData.BankDetails.push(bankdet);
    }

    for (var i = 0;i<currdet.length;i++){
        var currentbankdet = {}
        currentbankdet.Month = currdet[i].Month
        currentbankdet.CreditNonCash= currdet[i].CreditNonCash
        currentbankdet.CreditCash = currdet[i].CreditCash
        currentbankdet.CreditTotal = currdet[i].CreditTotal
        currentbankdet.DebitNonCash = currdet[i].DebitNonCash
        currentbankdet.DebitCash = currdet[i].DebitCash
        currentbankdet.DebitTotal = currdet[i].DebitTotal
        currentbankdet.AvgBalon = currdet[i].AvgBalon
        currentbankdet.NoOfDebit = currdet[i].NoOfDebit
        currentbankdet.NoOfCredit = currdet[i].NoOfCredit
        currentbankdet.OwCheque = currdet[i].OwCheque
        currentbankdet.IwCheque = currdet[i].IwCheque
        callData.CurrentBankDetails.push(currentbankdet);
    }

    //console.log(callData)

    ajaxPost(url+"/createbankanalysis",callData, function(res){
        //yo.success(res.data);
        swal("Success","Data Saved","success");
        $('#modaldb').modal('hide');
        DrawDataBank(getSearchVal());
        resetInput();
        //$('#savebtn').prop('disabled',true);
        setdatestt()
    });
}

// var updateDataBank = function(index){
//     var gridbankdet = $("#bankdetailgridform").data("kendoGrid");
//     var gridbankdetdirty = $("#bankdetailgridform").data("kendoGrid").dataSource.hasChanges();
//     det = gridbankdet.dataSource._data;

//     fundbased.accounttype($("#actype").data("kendoDropDownList").value());
//     fundbased.accountholder($("#acholder").val());
//     fundbased.accountno($("#acno").val());
//     fundbased.roi(Number($("#roiperannum").val()));
//     fundbased.sanclimit(Number($("#sanclimit").val()));
//     fundbased.interestpermonth(Number($("#interestpermonth").val()));
//     fundbased.securityoffb($("#securityfb").val());
//     if ($("#naturefacility").data("kendoDropDownList").value() != "Other"){
//         nonfundbased.natureoffacility($("#naturefacility").data("kendoDropDownList").value());
//     }else{
//         nonfundbased.natureoffacility($("#othernaturefacility").val());
//     }
//     nonfundbased.sanclimit(Number($("#nfbsanclimit").val()));
//     nonfundbased.securityofnfb($("#securitynfb").val());
//     bankaccount.bankname($("#bankname").val());
//     bankaccount.bankstttill($("#bankstt").data("kendoDatePicker").value());
//     if ($("input[name=fb]:checked").val()){
//         bankaccount.facilitytype("Fund Based");
//     }else if($("input[name=nfb]:checked").val()){
//         bankaccount.facilitytype("Non Fund Based");
//     }else{
//         bankaccount.facilitytype("Both");
//     }
//     var todayDate = new Date().toISOString();
//     if (bankaccount.facilitytype() != "" && bankaccount.facilitytype() == "Fund Based"){
//         nonfundbased.sanctiondate(todayDate);
//         var sd = moment($("#fbsanctiondate").getKendoDatePicker().value()).add(7,'h').toDate().toISOString()
//         fundbased.sanctiondate(sd);
//     }else if (bankaccount.facilitytype() != "" && bankaccount.facilitytype() == "Non Fund Based"){
//         fundbased.sanctiondate(todayDate);
//         var nfbsd = moment($("#nfbsanctiondate").getKendoDatePicker().value()).add(7,'h').toDate().toISOString()
//         nonfundbased.sanctiondate(nfbsd);
//     }else{
//         var sd = moment($("#fbsanctiondate").getKendoDatePicker().value()).add(7,'h').toDate().toISOString()
//         var nfbsd = moment($("#nfbsanctiondate").getKendoDatePicker().value()).add(7,'h').toDate().toISOString()
//         fundbased.sanctiondate(sd);
//         nonfundbased.sanctiondate(nfbsd);
//     }
//     bankaccount.fundbased = fundbased;
//     bankaccount.nonfundbased = nonfundbased;

//     var param = {
//         CustomerId : "",
//         DealNo : "",
//         BankAccount : {},
//         BankDetails : [],

//     }
//     param.CustomerId = filter().CustomerSearchVal();
//     param.DealNo = filter().DealNumberSearchVal();
//     param.BankAccount = bankaccount;
//     for (var i = 0;i<det.length;i++){
//         var bankdet = {}
//         bankdet.Month = det[i].Month
//         bankdet.CreditNonCash= det[i].CreditNonCash
//         bankdet.CreditCash = det[i].CreditCash
//         bankdet.CreditTotal = det[i].CreditTotal
//         bankdet.DebitNonCash = det[i].DebitNonCash
//         bankdet.DebitCash = det[i].DebitCash
//         bankdet.DebitTotal = det[i].DebitTotal
//         bankdet.AvgBalon = det[i].AvgBalon
//         bankdet.OdCcUtilization = det[i].OdCcUtilization
//         bankdet.OdCcLimit = det[i].OdCcLimit
//         bankdet.ActualInterestPaid = det[i].ActualInterestPaid
//         bankdet.NoOfDebit = det[i].NoOfDebit
//         bankdet.NoOfCredit = det[i].NoOfCredit
//         bankdet.OwCheque = det[i].OwCheque
//         bankdet.IwCheque = det[i].IwCheque
//         param.BankDetails.push(bankdet);
//     }
//     var xparam = {Id: databank()[index].Id ,Param:param}
//     ajaxPost(url+"/updatev2",xparam,function(res){
//         swal("Success","Data Updated","success");
//         DrawDataBank(getSearchVal());
//         resetInput();
//         $('#updatebtn').hide();
//         $('#savebtn').show();
//         $('#savebtn').prop('disabled',true);
//         $('#modaldb').modal('hide');
//         setdatestt()
//     })

// }

var updateDataBank = function(index){
    var gridbankdet = $("#bankdetailgridform").data("kendoGrid")
    det = gridbankdet.dataSource._data
    var gridcurrentbankdet = $('#currentbankdetailgridform').data("kendoGrid")
    currdet = gridcurrentbankdet.dataSource._data

    bankaccount.bankname($("#bankname").val());
    bankaccount.bankstttill($("#bankstt").data("kendoDatePicker").value().toISOString());
    bankaccount.facilitytype($('#facilitytype').getKendoMultiSelect().value())
    //bankaccount.bankstttill($("#bankstt").data("kendoDatePicker").value());

    fundbased.accounttype($("#actype").data("kendoDropDownList").value())
    fundbased.accountholder($("#acholder").val())
    fundbased.accountno($("#acno").val())
    fundbased.roi(Number($("#roiperannum").val()))
    fundbased.sanclimit(Number($("#sanclimit").val()))
    fundbased.interestpermonth(Number($("#interestpermonth").val()))
    arrfbsec = []
    for (var i = 0; i < bankaccount.fbsecurity().length; i++){
        arrfbsec.push($("#securityfb"+i).val())
    }
    fundbased.securityoffb(arrfbsec)

    if ($("#naturefacility").data("kendoDropDownList").value() != "Other"){
        nonfundbased.natureoffacility($("#naturefacility").data("kendoDropDownList").value());
    }else{
        nonfundbased.natureoffacility($("#othernaturefacility").val());
    }
    nonfundbased.sanclimit(Number($("#nfbsanclimit").val()));
    //nonfundbased.securityofnfb($("#securitynfb").val());
    arrnfbsec = []
    for (var i = 0; i < bankaccount.nfbsecurity().length; i++){
        arrnfbsec.push($("#securitynfb"+i).val())
    }
    nonfundbased.securityofnfb(arrnfbsec);

    var todayDate = new Date().toISOString();
    var latestfacttype = $('#facilitytype').getKendoMultiSelect().value()

    if (latestfacttype.indexOf('Fund Based') > -1){
        var dat1 = $("#fbsanctiondate").data("kendoDatePicker").value()
        if(!blankdate(dat1) ){
            var date1 = kendo.toString(new Date($("#fbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z";
            fundbased.sanctiondate(date1);
        }else{
            $("#fbsanctiondate").data("kendoDatePicker").value("01/01/1970")
            var date1 = kendo.toString(new Date($("#fbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z";
            fundbased.sanctiondate(date1);
        }
    }else{
         $("#fbsanctiondate").data("kendoDatePicker").value("01/01/1970")
            var date1 = kendo.toString(new Date($("#fbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z";
            fundbased.sanctiondate(date1);
    }

    if (latestfacttype.indexOf("Non-Fund Based") > -1){
        var dat2 = $("#nfbsanctiondate").data("kendoDatePicker").value()
        if( !blankdate(dat2)){
            var date2 = kendo.toString(new Date($("#nfbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z";
            nonfundbased.sanctiondate(date2);
        }else{
            //$("#nfbsanctiondate").data("kendoDatePicker").value("01/01/1970")
            var date2 = kendo.toString(new Date($("#nfbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z"
            nonfundbased.sanctiondate(date2);
        }
    }else{
         //$("#nfbsanctiondate").data("kendoDatePicker").value("01/01/1970")
            var date2 = kendo.toString(new Date($("#nfbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z"
            nonfundbased.sanctiondate(date2);
    }

    // if (latestfacttype.indexOf("Non-Fund Based") > -1 && latestfacttype.indexOf('Fund Based') > -1){
    //     var dat1 = $("#fbsanctiondate").data("kendoDatePicker").value()
    //     var dat2 = $("#nfbsanctiondate").data("kendoDatePicker").value()
    //     if(!blankdate(dat1) && !blankdate(dat2)){
    //         var date1 = kendo.toString(new Date($("#fbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z";
    //         var date2 = kendo.toString(new Date($("#nfbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z";
    //         fundbased.sanctiondate(date1);
    //         nonfundbased.sanctiondate(date2);
    //     }else{
    //         $("#fbsanctiondate").data("kendoDatePicker").value("01/01/1970")
    //         $("#nfbsanctiondate").data("kendoDatePicker").value("01/01/1970")
    //         var date1 = kendo.toString(new Date($("#fbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z";
    //         var date2 = kendo.toString(new Date($("#nfbsanctiondate").data("kendoDatePicker").value()), "yyyy-MM-dd")+"T00:00:00.000Z"
    //         nonfundbased.sanctiondate(date2);
    //         fundbased.sanctiondate(date1);
    //     }
    // }
    // if (bankaccount.facilitytype() != "" && bankaccount.facilitytype() == "Fund Based"){
    //     nonfundbased.sanctiondate(todayDate);
    //     var sd = moment($("#fbsanctiondate").getKendoDatePicker().value()).add(7,'h').toDate().toISOString()
    //     fundbased.sanctiondate(sd);
    // }else if (bankaccount.facilitytype() != "" && bankaccount.facilitytype() == "Non Fund Based"){
    //     fundbased.sanctiondate(todayDate);
    //     var nfbsd = moment($("#nfbsanctiondate").getKendoDatePicker().value()).add(7,'h').toDate().toISOString()
    //     nonfundbased.sanctiondate(nfbsd);
    // }else{
    //     var sd = moment($("#fbsanctiondate").getKendoDatePicker().value()).add(7,'h').toDate().toISOString()
    //     var nfbsd = moment($("#nfbsanctiondate").getKendoDatePicker().value()).add(7,'h').toDate().toISOString()
    //     fundbased.sanctiondate(sd);
    //     nonfundbased.sanctiondate(nfbsd);
    // }

    currentbased.accountholder($('#currentacholder').val())
    currentbased.accountno($('#currentacno').val())
    currentbased.accounttype($('#currentactype').val())

    bankaccount.fundbased = fundbased;
    bankaccount.nonfundbased = nonfundbased;
    bankaccount.currentbased = currentbased

    var param = {
        CustomerId : "",
        DealNo : "",
        BankAccount : {},
        BankDetails : [],
        CurrentBankDetails : [],
    }

    param.CustomerId = filter().CustomerSearchVal()
    param.DealNo = filter().DealNumberSearchVal()
    param.BankAccount = bankaccount

    for (var i = 0;i<det.length;i++){
        var bankdet = {}
        bankdet.Month = det[i].Month
        bankdet.CreditNonCash= det[i].CreditNonCash
        bankdet.CreditCash = det[i].CreditCash
        bankdet.CreditTotal = det[i].CreditTotal
        bankdet.DebitNonCash = det[i].DebitNonCash
        bankdet.DebitCash = det[i].DebitCash
        bankdet.DebitTotal = det[i].DebitTotal
        bankdet.AvgBalon = det[i].AvgBalon
        bankdet.OdCcUtilization = det[i].OdCcUtilization
        bankdet.OdCcLimit = det[i].OdCcLimit
        bankdet.ActualInterestPaid = det[i].ActualInterestPaid
        bankdet.NoOfDebit = det[i].NoOfDebit
        bankdet.NoOfCredit = det[i].NoOfCredit
        bankdet.OwCheque = det[i].OwCheque
        bankdet.IwCheque = det[i].IwCheque
        param.BankDetails.push(bankdet);
    }

    for (var i = 0;i<currdet.length;i++){
        var currentbankdet = {}
        currentbankdet.Month = currdet[i].Month
        currentbankdet.CreditNonCash= currdet[i].CreditNonCash
        currentbankdet.CreditCash = currdet[i].CreditCash
        currentbankdet.CreditTotal = currdet[i].CreditTotal
        currentbankdet.DebitNonCash = currdet[i].DebitNonCash
        currentbankdet.DebitCash = currdet[i].DebitCash
        currentbankdet.DebitTotal = currdet[i].DebitTotal
        currentbankdet.AvgBalon = currdet[i].AvgBalon
        currentbankdet.NoOfDebit = currdet[i].NoOfDebit
        currentbankdet.NoOfCredit = currdet[i].NoOfCredit
        currentbankdet.OwCheque = currdet[i].OwCheque
        currentbankdet.IwCheque = currdet[i].IwCheque
        param.CurrentBankDetails.push(currentbankdet);
    }

    var xparam = {Id: databank()[index].Id ,Param:param}
    ajaxPost(url+"/updatev2",xparam,function(res){
        swal("Success","Data Updated","success");
        DrawDataBank(getSearchVal());
        resetInput();
        $('#updatebtn').hide();
        $('#savebtn').show();
        $('#modaldb').modal('hide');
        setdatestt()
    })

}

/// Create Grid Summary ///
var generateAML = function(data){
    var detail = data.Detail;
    var res = [];
    _.each(detail,function(e,i){
        var db = e.DataBank[0].BankDetails;
        _.each(db,function(ex,ix){
            var dt = _.find(res,function(x){ return x.Month == ex.Month ;});
            if(dt==undefined){
                res.push({ Month : ex.Month , CreditCash : ex.CreditCash, DebitCash : ex.DebitCash});
            }else{
                dt.CreditCash += ex.CreditCash;
                dt.DebitCash += ex.DebitCash;
            }
        })
    });

    var datasum = $("#bankinggrid").getKendoGrid().dataSource.data();

    _.each(res,function(e,i){
        e.Month = moment(e.Month.split("T")[0]).format("MMM-YYYY");
        var dt = _.find(datasum,function(x){ return x.Month == e.Month ;});
        e.CreditCash = app.checkNanOrInfinity((parseInt(e.CreditCash / dt.TotalCredit*100)),0);
        e.DebitCash = app.checkNanOrInfinity((parseInt(e.DebitCash / dt.TotalDebit*100)),0);
    });

    createAmlGrid(res);
}

var createBankingGrid = function(res, minmargin){
    for(var i in res){
        res[i]["Month"] = moment(res[i]["Month"].split("T")[0]).format("MMM-YYYY")
        res[i]["ImpMargin"] = (minmargin / 100) * res[i]["TotalCredit"]
    }
    
    $("#bankinggrid").html("");
    $("#bankinggrid").kendoGrid({
        dataSource : {
			data : res,
            aggregate: [
                { field: "TotalCredit", aggregate: "sum" },
                { field: "TotalDebit", aggregate: "sum" },
                { field: "NoOfDebit", aggregate: "sum" },
                { field: "NoOfCredit", aggregate: "sum" },
                { field: "OwCheque", aggregate: "sum" },
                { field: "IwCheque", aggregate: "sum" },
                { field: "Utilization", aggregate: "average" },
                { field: "ImpMargin", aggregate: "sum" },
                { field: "OwReturnPercentage", aggregate: "average" },
                { field: "LwReturnPercentage", aggregate: "average" },
                { field: "DrCrReturnPercentage", aggregate: "average" },
            ]
		},
        columns : [{
            title:"Banking Snapshot",
            headerAttributes: { class: "header-bgcolor" },
            columns:[{
                title:"Months",
                field:"Month",
                headerAttributes: { class: "sub-bgcolor" },
                format:"{0:dd-MMM-yyyy}",
                footerTemplate: 'Total'
            }, {
                title:"Monthly Credits (Rs. Lacs)",
                field:"TotalCredit",
                headerAttributes: { class: "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'> #= kendo.toString(totalGrid.BS.BSMonthlyCredits(), 'n2') # </div>",
                attributes:{ "style": "text-align:right" },
                template : "#: app.formatnum(TotalCredit,2) #"
            }, {
                title:"Monthly Debits (Rs. Lacs)",
                field:"TotalDebit",
                headerAttributes: { class: "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(totalGrid.BS.BSMonthlyDebits(), 'n2') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: app.formatnum(TotalDebit,2) #"
            }, {
                title:"No. of Debits",
                field:"NoOfDebit",
                headerAttributes: { class: "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(totalGrid.BS.BSNoOfDebits(), 'n0') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(NoOfDebit,'N0') #"
            }, {
                title:"No. of Credits",
                field:"NoOfCredit",
                headerAttributes: { class: "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(totalGrid.BS.BSNoOfCredits(), 'n0') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(NoOfCredit,'N0') #"
            }, {
                title:"O/W Cheque Returns",
                field:"OwCheque",
                headerAttributes: { class: "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(totalGrid.BS.BSOWChequeReturns(), 'n0') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(OwCheque,'N0') #"
            }, {
                title:"I/W Cheque Returns",
                field:"IwCheque",
                headerAttributes: { class: "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(totalGrid.BS.BSIWChequeReturns(), 'n0') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(IwCheque,'N0') #"
            }, {
                title:"Utilization %",
                field:"Utilization",
                headerAttributes: { class: "sub-bgcolor" },
                aggregates: ["average"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(totalGrid.BS.ODUtilizationPercent(), 'P2') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(Utilization,'P2') #"
            }, {
                title:"Imp Margin (Rs. Lacs)<br> (Margin Taken : "+ kendo.toString(minmargin,"n2") +"%)",
                field:"ImpMargin",
                headerAttributes: { class: "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(totalGrid.BS.BSImpMargin(), 'n2') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: app.formatnum(ImpMargin,2) #"
            }, {
                title:"O/W Return %",
                field:"OwReturnPercentage",
                headerAttributes: { class: "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(totalGrid.BS.BSOWReturnPercent(), 'P2') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(OwReturnPercentage,'P2') #"
            }, {
                title:"I/W Return %",
                field:"LwReturnPercentage",
                headerAttributes: { class: "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(totalGrid.BS.BSIWReturnPercent(), 'P2') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(LwReturnPercentage,'P2') #"
            }, {
                title:"Dr./Cr. Ratio",
                field:"DrCrReturnPercentage",
                headerAttributes: { class: "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(totalGrid.BS.BSDRCRRatio(), 'N2') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(DrCrReturnPercentage,'N2') #"
            }]
        }],
    });
    RebuildSummary("bankinggrid");
}

var RebuildSummary = function(id){
    $("#"+id+" .k-header:eq(0)").append("<span class='glyphicon glyphicon-chevron-down pull-right'></span");
    $("#"+id+" .k-header:eq(0)").append("<i class='fa fa-list pull-left'></i");
    $("#"+id+" .k-grid-content").hide();
    $("#"+id+" .k-header:eq(0)").unbind("click").bind("click", function (e) {
        var content = $("#"+id+" .k-grid-content:visible");
        var od = $("#oddetailgrid .k-grid-content:visible")
        var aml = $("#amlgrid .k-grid-content:visible")
        var abb = $("#currentgrid .k-grid-content:visible")
        var banking = $('#bankinggrid .k-grid-content:visible')
        if(content.length == 0){
            //$('#summary-panel').animate({height: "550px"}, 500)
            $('#amlgrid').getKendoGrid().options.scrollable = false
            //$("#"+id+" .k-grid-content").slideDown("slow");
            //$("#"+id+" .k-header:eq(0)").find("span").attr("class",'glyphicon glyphicon-chevron-up pull-right')
            if (id != 'bankinggrid'){
                if((od.length == 0 || aml.length == 0 || abb.length == 0) && banking.length != 0){
                    $('#summary-panel').animate({height: "550px"}, 500)
                    $("#"+id+" .k-grid-content").slideDown("slow");
                    $("#"+id+" .k-header:eq(0)").find("span").attr("class",'glyphicon glyphicon-chevron-up pull-right')
                }else{
                    $('#summary-panel').animate({height: "400px"}, 500)
                    $("#"+id+" .k-grid-content").slideDown("slow");
                    $("#"+id+" .k-header:eq(0)").find("span").attr("class",'glyphicon glyphicon-chevron-up pull-right')
                }
            }else{
                if (od.length == 0 && aml.length == 0 && abb.length == 0){
                    $('#summary-panel').animate({height: "400px"}, 500)
                    $("#"+id+" .k-grid-content").slideDown("slow");
                    $("#"+id+" .k-header:eq(0)").find("span").attr("class",'glyphicon glyphicon-chevron-up pull-right')
                }else{
                    $('#summary-panel').animate({height: "550px"}, 500)
                    $("#"+id+" .k-grid-content").slideDown("slow");
                    $("#"+id+" .k-header:eq(0)").find("span").attr("class",'glyphicon glyphicon-chevron-up pull-right')
                }
            }
        }else{
            if(id != 'bankinggrid'){
                if(banking.length != 0){
                    if(od.length != 0 || aml.length != 0 || abb.length != 0){
                        $("#"+id+" .k-grid-content").slideUp("slow");
                        $('#summary-panel').animate({height: "550px"}, 500)
                        $("#"+id+" .k-header:eq(0)").find("span").attr("class",'glyphicon glyphicon-chevron-down pull-right')
                    }

                }else{
                    if(od.length != 0 || aml.length != 0 || abb.length != 0){
                        $("#"+id+" .k-grid-content").slideUp("slow");
                        $('#summary-panel').animate({height: "400px"}, 500)
                        $("#"+id+" .k-header:eq(0)").find("span").attr("class",'glyphicon glyphicon-chevron-down pull-right')
                    }
                }
            }else{
                if (od.length == 0 && aml.length == 0 && abb.length == 0){
                    $("#"+id+" .k-grid-content").slideUp("slow");
                    $('#summary-panel').animate({height: "200px"}, 500)
                    $("#"+id+" .k-header:eq(0)").find("span").attr("class",'glyphicon glyphicon-chevron-down pull-right')
                }else{
                    $("#"+id+" .k-grid-content").slideUp("slow");
                    $('#summary-panel').animate({height: "400px"}, 500)
                    $("#"+id+" .k-header:eq(0)").find("span").attr("class",'glyphicon glyphicon-chevron-down pull-right')
                }
            }

        }
    });
    $("#"+id+" .k-header:eq(0)").attr("style","cursor: pointer;");
}

var createAmlGrid = function(data){
    //console.log(data)
    $("#amlgrid").html("");
    $("#amlgrid").kendoGrid({
        dataSource : {
			data : data,
       aggregate: [ { field: "CreditCash", aggregate: "average" },
                  { field: "DebitCash", aggregate: "average" }]
		},

        columns : [
            {
                title:"AML",
                headerAttributes: { class: "header-bgcolor" },
                columns:[
                    {
                        title:"Months",
                        field:"Month",
                        headerAttributes: { class: "sub-bgcolor" },
                        //template: "#= kendo.toString(moment.utc(Month).format('DD-MMM-YYYY'), 'MMM-yyyy') #",
                        footerTemplate: "Total"
                    },
                    {
                        title:"Credits",
                        field:"CreditCash",
                        headerAttributes: { class: "sub-bgcolor" },
                        aggregates: ["average"],
                        footerTemplate: "<div style='text-align: right'>#=kendo.toString(totalGrid.AML.AMLAvgCredits(),'N2')#%</div>",
                        template : "#=kendo.toString(CreditCash,'N2') #%",
                        attributes:{ "style": "text-align:right" },
                    },
                    {
                        title:"Debits",
                        field:"DebitCash",
                        headerAttributes: { class: "sub-bgcolor" },
                        aggregates: ["average"],
                        footerTemplate: "<div style='text-align: right'>#=kendo.toString(totalGrid.AML.AMLAvgDebits(),'N2')#%</div>",
                        template : "#=kendo.toString(DebitCash,'N2') #%",
                        attributes:{ "style": "text-align:right" },
                    },
                ]
            },
        ],
    });
    RebuildSummary("amlgrid");
}

var constructOdccModel = function(res){
    var amls = [];
    var odccs = [];
    var currents = []
    var maxodcc = 0.0;
    var details = res.data.Detail;

    _.each(details, function(detail){
        _.each(detail.DataBank[0].BankDetails, function(bankDetail){
            if(bankDetail.OdCcLimit > 0.01){
                odccs.push(bankDetail.AvgBalon / bankDetail.OdCcLimit);
            } else {
                odccs.push(0);
            }
        });
    });

    _.each(details, function(detail){
        var aml = {};
        var current = {}
        var eachDataBank = detail.DataBank[0];
        aml.Bank        = eachDataBank.BankAccount.BankName;
        aml.SancLimit   = eachDataBank.BankAccount.FundBased.SancLimit;

        aml.OdCcUtilization = 0;
        aml.InterestPerMonth = 0;
        aml.abb = 0;
        aml.util = 0;

        current.Bank = eachDataBank.BankAccount.BankName
        // var utilarr = _.map(eachDataBank.BankDetails, function (bd) {
        //         return toolkit.number(bd.AvgBalon / bd. OdCcLimit);
        //     });
        // aml.util =  _.reduce(utilarr, function(memo, num){ return memo + num; }, 0)/ _.filter(utilarr, function(x){ return x > 0; }).length ;
        // aml.util = isFinite(aml.util) ? aml.util : 0;
        // if (eachDataBank.BankAccount.FundBased.AccountType.toLowerCase().indexOf('od') > -1) {

        //     aml.OdCcUtilization = _.max(_.map(eachDataBank.BankDetails, function (bd) {
        //         return toolkit.number(bd.AvgBalon / bd. OdCcLimit);
        //     }))

        //     var interestPerMonth    = eachDataBank.BankAccount.FundBased.InterestPerMonth;
        //     var actualInterestPaids = _.map(eachDataBank.BankDetails, function(bd) {
        //         return bd.ActualInterestPaid;
        //     })

        //     var actualInterestPaidValue = toolkit.number(_.sum(actualInterestPaids) / actualInterestPaids.length)
        //     aml.InterestPerMonth = _.max([interestPerMonth, actualInterestPaidValue])
        //     var abbv = _.reduce(eachDataBank.BankDetails, function(memo, num){ return memo + num.AvgBalon; }, 0)/_.filter(eachDataBank.BankDetails, function(x){ return x.AvgBalon > 0; }).length
        //     aml.abb = isNaN(abbv) ? 0 : abbv ;
        //     amls.push(aml);
        //}else{
            // current.abb = _.reduce(eachDataBank.CurrentBankDetails, function(memo, num){ return memo + num.AvgBalon; }, 0)/_.filter(eachDataBank.CurrentBankDetails, function(x){ return x.AvgBalon > 0; }).length
            // current.abb = isNaN(current.abb) ? 0 : current.abb ;
            // currents.push(current)
        //}

        //amls.push(aml);
        if (eachDataBank.BankAccount.FundBased.AccountType.toLowerCase().indexOf("od")>-1 && eachDataBank.BankAccount.FacilityType.indexOf("Fund Based") > -1 ){
            aml.OdCcUtilization = _.max(_.map(eachDataBank.BankDetails, function (bd) {
                return toolkit.number(bd.AvgBalon / bd. OdCcLimit);
            }))

            var interestPerMonth    = eachDataBank.BankAccount.FundBased.InterestPerMonth;
            var actualInterestPaids = _.map(eachDataBank.BankDetails, function(bd) {
                return bd.ActualInterestPaid;
            })

            var actualInterestPaidValue = toolkit.number(_.sum(actualInterestPaids) / actualInterestPaids.length)
            aml.InterestPerMonth = _.max([interestPerMonth, actualInterestPaidValue])
            var abbv = _.reduce(eachDataBank.BankDetails, function(memo, num){ return memo + num.AvgBalon; }, 0)/_.filter(eachDataBank.BankDetails, function(x){ return x.AvgBalon > 0; }).length
            aml.abb = isNaN(abbv) ? 0 : abbv ;
            amls.push(aml);
        }

        if (eachDataBank.BankAccount.FacilityType.indexOf("Current") > -1 ){
            current.abb = _.reduce(eachDataBank.CurrentBankDetails, function(memo, num){ return memo + num.AvgBalon; }, 0)/_.filter(eachDataBank.CurrentBankDetails, function(x){ return x.AvgBalon > 0; }).length
            current.abb = isNaN(current.abb) ? 0 : current.abb ;
            currents.push(current)
        }
    });

    abbavg = toolkit.number(_.reduce(amls, function(memo, num){ return memo + num.abb; }, 0) /  _.filter(amls, function(x){ return x.abb > 0; }).length);
    abbavgs = toolkit.number(_.reduce(currents, function(memo, num){ return memo + num.abb; }, 0) /  _.filter(currents, function(x){ return x.abb > 0; }).length);

    // for(var i in amls){
    //     amls[i].amlavg = amlavg;
    // }

     //console.log(amls)
    createOdDetailGrid(amls);
    createCurrentDetailGrid(currents);
}

var createCurrentDetailGrid = function(res){
    //console.log(res)
    $('#currentgrid').html('')
    $('#currentgrid').kendoGrid({
        dataSource : {
            data: res,
            aggregate: [
                { field: "abb", aggregate: "average" },
            ]
        },
        scrollable:true,
        height:245,
        columns : [
            {
                title:"ABB",
                headerAttributes: { class: "header-bgcolor" },
                columns:[
                    {
                        title:"Bank",
                        field:"Bank",
                        headerAttributes: { class: "sub-bgcolor" },
                        footerTemplate: "Total",
                    },
                    {
                        title:"ABB (Rs. Lacs)",
                        field:"abb",
                        headerAttributes: { class: "sub-bgcolor" },
                        aggregates: ["average"],
                        footerTemplate: "<div style='text-align: right'>#= kendo.toString(totalGrid.ABB(), 'n2') #</div>",
                        attributes:{ "style": "text-align:right" },
                        template : "#: app.formatnum(abb,2) #"
                    }
                ]
            }
        ]
    })
    RebuildSummary('currentgrid')
    $('#currentgrid').height(0)
}

var createOdDetailGrid = function(res){
    $("#oddetailgrid").html("");

    $("#oddetailgrid").kendoGrid({
        dataSource : {
			data : res
		},
        scrollable:true,
        height:245,
        columns : [
            {
                title:"OD Details",
                headerAttributes: { class: "header-bgcolor" },
                columns:[
                    {
                        title:"Bank",
                        field:"Bank",
                        headerAttributes: { class: "sub-bgcolor" },
                        footerTemplate: "Total",
                    },
                    {
                        title:"Sanction Limit (Rs. Lacs)",
                        field:"SancLimit",
                        headerAttributes: { class: "sub-bgcolor" },
                        template : "#: app.formatnum(SancLimit, 2) #",
                        footerTemplate: "<div style='text-align: right' id='od1'>#:app.formatnum(totalGrid.OD.ODSactionLimit(), 2)#</div>"
                    },
                    {
                        title:"OD Utilization",
                        field:"OdCcUtilization",
                        headerAttributes: { class: "sub-bgcolor" },
                        attributes:{ "style": "text-align:right" },
                        template : "#: kendo.toString(OdCcUtilization,'P2') #",
                        footerTemplate: "<div style='text-align: right' id='od2'>#: kendo.toString(totalGrid.OD.ODAvgUtilization(), 'P2') #</div>"
                    },
                    {
                        title:"Interest Paid (Rs. Lacs)",
                        field:"InterestPerMonth",
                        headerAttributes: { class: "sub-bgcolor" },
                        attributes:{ "style": "text-align:right" },
                        template : "#: app.formatnum(InterestPerMonth,2) #",
                        footerTemplate: "<div style='text-align: right' id='od3'>#: app.formatnum(totalGrid.OD.ODInterestPaid(), 2)#</div>"
                    }
                ]
            },
        ]
    });

    RebuildSummary("oddetailgrid");
    $('#oddetailgrid').height(0)
}

function onFreeze(){
    if(!statusPage.isConfirmed()){
        swal("Confirm Data First","","warning");
            return;
    }

    if(filter().CustomerSearchVal() == "" || filter().DealNumberSearchVal() == ""){
        swal("Warning","Select Customer First","warning");
        return;
    }else{
        resetInput();

        var param = getSearchVal()
        param.IsFreeze = !statusPage.isFreeze()

        ajaxPost(url+"/setfreeze", param, function(){
            statusPage.isFreeze(!statusPage.isFreeze())
            if(statusPage.isFreeze()) {
                swal("Successfully Freezed","","success");
            } else {
                swal("Successfully Unfreezed","","success");
            }

            checkStatusPage();

            // unfreeze(true);
            // disabledAll(false);
            //
            // refreshFilter()
        });
    }

}

function setUnFreeze(){
    if (filter().CustomerSearchVal() == "" || filter().DealNumberSearchVal() == ""){
            swal("Warning","Select Customer First","warning");
            return;
    }else{
        resetInput();
        ajaxPost(url+"/unfreeze", getSearchVal(), function(){
            unfreeze(false);
            disabledAll(true);

            refreshFilter()
        });
    }
    unfreeze(false);
    disabledAll(true);
}

function disabledAll(what){
    setTimeout(function(){
        $.each(databank(), function(i, items){
            $("#bedit"+i).prop("disabled", !what)
            $("#bdelete"+i).prop("disabled", !what)
        })
    }, 100)
    $("#add").prop("disabled", !what)
    $("#unf").prop("disabled", false)
    $(".btn-reenter").prop("disabled", !what)
    $("#Bank-Container .k-widget").each(function(i,e){

        var $ddl = $(e).find("select").getKendoDropDownList();

        if($ddl == undefined)
        var $ddl = $(e).find("input").getKendoDropDownList();

        var $dtm = $(e).find("input").getKendoDatePicker();
        var $txt = $(e).find("input").eq(1).getKendoNumericTextBox();

        if($ddl != undefined)
        {
            $ddl.enable(what);
        }else if($dtm != undefined){
            $dtm.enable(what);
        }else if ($txt != undefined){
            $txt.enable(what);
        }
    });
}

function onChange(){
    if (filter().CustomerSearchVal() == ""){
        swal("Warning","Select Customer First","warning");
        return;
    }else{
        var val = $("#bankstt").data("kendoDatePicker");
        values = val.value().toISOString();
        dateval = new Date(values);
        bankdetails = [];
        for (i = 0 ; i < 6 ; i++){
            var bb = moment(dateval).subtract(i,'M')
            var con = moment(bb).toDate().toISOString();
            bankdetails.push({
                Month:con,
                CreditNonCash:0.0,
                CreditCash:0.0,
                DebitNonCash:0.0,
                DebitCash:0.0,
                OdCcLimit:0.0,
                ActualInterestPaid:0.0,
                NoOfDebit:0.0,
                NoOfCredit:0.0,
                OwCheque:0.0,
                IwCheque:0.0,
            });
        }
        var bankdetailtemplate = {
            CustomerId : "",
            BankDetails : []
        };
        bankdetailtemplate.CustomerId = filter().CustomerSearchVal();
        bankdetailtemplate.BankDetails = bankdetails;

        ajaxPost(url+"/savedetailbanktemplate",bankdetailtemplate,function(res){
            //createBankingGrid(res.data)
        });

        createBankDetailGrid(bankdetails);
    }
}

