
model.Processing = ko.observable(true)
var due={}

due.dataVerifications = ko.observableArray();
due.dataDefaulterList = ko.observableArray();
due.dataTemp = ko.observableArray();
due.Name = ko.observableArray();
due.dataCustomer = ko.observableArray()
due.templateForm = {
	Id: "",
	CustomerId: "",
	DealNo: "",
	Verification: [],
	Defaulter: [],
	Background: [],
	Status: 0,
	Freeze: false,
	LastConfirmed : (new Date()).toISOString(),
};
due.formVisible = ko.observable(false);
due.form = ko.mapping.fromJS(due.templateForm);

var loanapproval = {
    companyname : ko.observable(""),
    logindate : ko.observable(""),
    businessaddress : ko.observable(""),
    product : ko.observable(""),
    location : ko.observable(""),
    internalrating : ko.observable(""),
    businesssince : ko.observable(""),
    businesssegment : ko.observable(""),
    leaddistributor : ko.observable(""),
    creditanalyst : ko.observable(""),
    proposedlimitamount : ko.observable(""),
    existingcustomer : ko.observable(""),
    firstagreementdate : ko.observable(""),
    limittenor : ko.observable(""),
    existinglimitamount : ko.observable(""),
    recentagreementdate : ko.observable(""),
    roi : ko.observable(""),
    existingroi : ko.observable(""),
    vintagex10 : ko.observable(""),
    proposedfee : ko.observable(""),
    existingpf : ko.observable(""),
    comercialcibilreport : ko.observable(""),
    maxdelaydays : ko.observable(""),
    maxpaymentdays : ko.observable(""),
    averagedelaydays : ko.observable(""),
    standarddeviation : ko.observable(""),
    averagepaymentdays : ko.observable(""),
    averagetransactionpaymentdelay : ko.observable(""),
    delaystandarddeviation : ko.observable(""),
    averagetransactionpayment : ko.observable(""),
    daystandarddeviation : ko.observable(""),
    averageutilization : ko.observable(""),
    maxdpd : ko.observable(""),
    numberdelay : ko.observable(""),
    numberearly : ko.observable(""),
    numberpayment : ko.observable(""),
    stocksell : ko.observable(""),
    govt : ko.observable(""),
    corporate : ko.observable(""),
    iriscomp : ko.observable(""),
    savex : ko.observable(""),
    rashi : ko.observable(""),
    supertron : ko.observable(""),
    compuage : ko.observable(""),
    avnet : ko.observable(""),
    promotorbio : ko.observableArray([]),
    pddone : ko.observable(""),
    pddate : ko.observable(""),
    pdplace : ko.observable(""),
    personmet : ko.observable(""),
    pdremarks : ko.observable(""),
    topCustomersName : ko.observableArray([]),
    topproducts : ko.observableArray([]),
    expansionplan : ko.observable(""),
    commentfinance : ko.observable(""),
    referencecheck : ko.observableArray([]),
    marketref : ko.observable(""),
    detailpromoters : ko.observableArray([]),
    officeaddress : ko.observable(""),
    officeownership : ko.observable(""),
    officeactivity : ko.observable(""),
    officelandarea : ko.observable(""),
    officebuiltuparea : ko.observable(""),
    officemarketvalue : ko.observable(""),
    promotersarr : ko.observableArray([]),
    amountofbusiness : ko.observable(""),
    valueregistered : ko.observable(""),
    propertyowned : ko.observable([]),
    companybackground : ko.observableArray([]),
    pdCustomerMargin: ko.observable(""),
    pdComments: ko.observable(""),
    distributorList : ko.observableArray([{Label : "", Result: ""}])
}

loanapproval.topcustomerfinal = ko.observable("");
loanapproval.topproductsfinal = ko.observable("");

var promoter = {
    Name: ko.observable(""),
    Address: ko.observable(""),
    Ownership: ko.observable(""),
    NoOfYears: ko.observable(""),
    NetWorth: ko.observable(""),
    PropertyType: ko.observable(""),
    PropertyAddress: ko.observable(""),
    PropertyMarket: ko.observable(""),
}

var promoters = [];

loanApproval = {
    loanSummary: {
        scheme: ko.observable()
    },
    loanDetail: {
        proposedLimitAmount: ko.observable(),
        proposedROI: ko.observable(),
        proposedProFee: ko.observable(),
        limitTenor: ko.observable(),
        ifExistingCustomer: ko.observable(),
        ifYesExistingLimitAmount: ko.observable(),
        existingROI: ko.observable(),
        existingProcessingFee: ko.observable(),
        firstAgreementDate: ko.observable(),
        vintageWithX10: ko.observable(),
        recentAgreementDate: ko.observable(),
        poBacked: ko.observable(),
        projectPOValue: ko.observable(),
        expectedPayment: ko.observable()
    },
    paymentTrack: {
        highestAverageDelay: ko.observable(0)
    },
    commercialCibil: {
        assessment: ko.observable(),
        comments: ko.observableArray()
    },
    companyBackgroundData: ko.observable(""),
    promoterBackgroundData: ko.observable(""),
    propertyOwnershipData: ko.observable(""),
    outstandingData: ko.observable(""),
    refresh: function() {
        loanApproval.reset();
        loanApproval.getReport(getSearchVal());
        due.getCostumerData();
        due.getData();
    },
    isFirstLoad: ko.observable(true),
    isLoading: ko.observable(true),
    loading: function (what) {
        $('.apx-loading')[what ? 'show' : 'hide']()
        $('.panel-content')[what ? 'hide' : 'show']()

        if (loanApproval.isFirstLoad() && what == true)
            loanApproval.isFirstLoad(false);

        loanApproval.isLoading(what);
    }
};

loanApproval.reset = function(){

    $("#compbackgrid").html("")

    due.dataVerifications("");
    due.dataDefaulterList("");
    due.dataTemp("");
    due.Name("");
    due.dataCustomer("")
    due.templateForm = {
        Id: "",
        CustomerId: "",
        DealNo: "",
        Verification: [],
        Defaulter: [],
        Background: [],
        Status: 0,
        Freeze: false,
        LastConfirmed : (new Date()).toISOString(),
    };
    due.formVisible(false);
    due.form = ko.mapping.fromJS(due.templateForm);

    loanapproval.companyname("")
    loanapproval.logindate("")
    loanapproval.businessaddress("")
    loanapproval.product("")
    loanapproval.location("")
    loanapproval.internalrating("")
    loanapproval.businesssince("")
    loanapproval.businesssegment("")
    loanapproval.leaddistributor("")
    loanapproval.creditanalyst("")
    loanapproval.proposedlimitamount("")
    loanapproval.existingcustomer("")
    loanapproval.firstagreementdate("")
    loanapproval.limittenor("")
    loanapproval.existinglimitamount("")
    loanapproval.recentagreementdate("")
    loanapproval.roi("")
    loanapproval.existingroi("")
    loanapproval.vintagex10("")
    loanapproval.proposedfee("")
    loanapproval.existingpf("")
    loanapproval.comercialcibilreport("")
    loanapproval.maxdelaydays("")
    loanapproval.maxpaymentdays("")
    loanapproval.averagedelaydays("")
    loanapproval.standarddeviation("")
    loanapproval.averagepaymentdays("")
    loanapproval.averagetransactionpaymentdelay("")
    loanapproval.delaystandarddeviation("")
    loanapproval.averagetransactionpayment("")
    loanapproval.daystandarddeviation("")
    loanapproval.averageutilization("")
    loanapproval.maxdpd("")
    loanapproval.numberdelay("")
    loanapproval.numberearly("")
    loanapproval.numberpayment("")
    loanapproval.stocksell("")
    loanapproval.govt("")
    loanapproval.corporate("")
    loanapproval.iriscomp("")
    loanapproval.savex("")
    loanapproval.rashi("")
    loanapproval.supertron("")
    loanapproval.compuage("")
    loanapproval.avnet("")
    loanapproval.promotorbio([])
    loanapproval.pddone("")
    loanapproval.pddate("")
    loanapproval.pdplace("")
    loanapproval.personmet("")
    loanapproval.pdremarks("")
    loanapproval.topCustomersName([])
    loanapproval.topproducts([])
    loanapproval.expansionplan("")
    loanapproval.commentfinance("")
    loanapproval.referencecheck([])
    loanapproval.marketref("")
    loanapproval.detailpromoters([])
    loanapproval.officeaddress("")
    loanapproval.officeownership("")
    loanapproval.officeactivity("")
    loanapproval.officelandarea("")
    loanapproval.officebuiltuparea("")
    loanapproval.officemarketvalue("")
    loanapproval.promotersarr([])
    loanapproval.amountofbusiness("")
    loanapproval.valueregistered("")
    loanapproval.propertyowned([])
    loanapproval.companybackground([])
    loanapproval.pdCustomerMargin("")
    loanapproval.pdComments("")
    loanapproval.distributorList([{Label : "", Result: ""}])

    loanapproval.topcustomerfinal("");
    loanapproval.topproductsfinal("");

    promoter.Name(""),
    promoter.Address(""),
    promoter.Ownership(""),
    promoter.NoOfYears(""),
    promoter.NetWorth(""),
    promoter.PropertyType(""),
    promoter.PropertyAddress(""),
    promoter.PropertyMarket(""),

    promoters = [];

    loanApproval.loanSummary.scheme("")
    loanApproval.loanDetail.proposedLimitAmount(),
    loanApproval.loanDetail.proposedROI(),
    loanApproval.loanDetail.proposedProFee(),
    loanApproval.loanDetail.limitTenor(),
    loanApproval.loanDetail.ifExistingCustomer(),
    loanApproval.loanDetail.ifYesExistingLimitAmount(),
    loanApproval.loanDetail.existingROI(),
    loanApproval.loanDetail.existingProcessingFee(),
    loanApproval.loanDetail.firstAgreementDate(),
    loanApproval.loanDetail.vintageWithX10(),
    loanApproval.loanDetail.recentAgreementDate(),
    loanApproval.loanDetail.poBacked(),
    loanApproval.loanDetail.projectPOValue(),
    loanApproval.loanDetail.expectedPayment()

    loanApproval.paymentTrack.highestAverageDelay(0)
    loanApproval.commercialCibil.assessment()
    loanApproval.commercialCibil.comments([])
    loanApproval.companyBackgroundData({
        mostLength: ko.observableArray([]),
        topCustomersName: ko.observableArray([]),
        topTable: {}
    })
    loanApproval.promoterBackgroundData("")
    loanApproval.propertyOwnershipData("")
    loanApproval.outstandingData("")
}

due.getForm = function(){
    due.form.Background([]);
    due.form.Verification([]);
    due.form.Defaulter([]);
    var customerId = filter().CustomerSearchVal();
    var dealNo = filter().DealNumberSearchVal();
    due.form.CustomerId(customerId);
    due.form.DealNo(dealNo);
    if(due.form.Status == "" || due.form.Status() != 1){
        due.form.Status(0)
    }

    // if(due.form.Status() == ""){
    //  due.form.Status(0)
    // }

    if(due.form.Freeze() == ""){
        due.form.Freeze(false)
    }
    var dataVerification = $("#gridverification0").data("kendoGrid").dataSource.data()
    $.each(dataVerification, function(i, ver){
        due.form.Verification.push({Particulars : ver.Particulars,Result: ver.Result,Mitigants : ver.Mitigants,});
    });
    var dataDefaulters = $("#gridDefaulterList0").data("kendoGrid").dataSource.data()
    $.each(dataDefaulters, function(i, App){
        due.form.Defaulter.push({Source : App.Source,Applicable: App.Applicable,BankName : App.BankName,Amount: App.Amount, Status: App.Status});
    });
    var dataBackground = $("#background0").data("kendoGrid").dataSource.data()
    $.each(dataBackground, function(i, Back){
        due.form.Background.push({Name : Back.Name,Designation: Back.Designation,CIBILScore: Back.CIBILScore, ShareHolding: Back.ShareHolding,RedFlags: Back.RedFlags});
    });
}
var resetpromoters = function(){
    promoter.Name("");
    promoter.Address("");
    promoter.Ownership("");
    promoter.NoOfYears("");
    promoter.NetWorth("");
    promoter.PropertyType("");
    promoter.PropertyAddress("");
    promoter.PropertyMarket("");
}

var keyPolicyParam = function(norm) {
    var attr = ko.observableArray();
    var columns = [
        { title: "Criteria", field: "Criteria", headerAttributes: { "class": "sub-bgcolor col-sm-2" }, attributes: { "class": "text-bold"} },
        { title: "Norm", field: "NormLabel", headerAttributes: { "class": "sub-bgcolor" }, attributes: { "class": "center"} },
        { title: "Actual", field: "calculatedvaluetodisplay", headerAttributes: { "class": "sub-bgcolor" }, attributes: { "class": "center", style: "text-align: right;"} },
        { title: "Met / Not Met", field: "ismet", headerAttributes: { "class": "sub-bgcolor" }, attributes: { "class": "center"} }

    ];

    var render = function(datas) {
                console.log(datas,"---datas");

        if(datas != null){
            _.each(datas.filter(function (d) {
                return d.ShowInLoanApprovalScreen
            }), function(data) {
                if(data.ShowInLoanApprovalReport == false) {
                    return;
                }
                if(data.CalculatedValue != undefined) {
                    var getFixedCalculatedValue = parseFloat((function () {
                        return (function(val){
                            if(data.CalculatedValue.ValueType == "percentage" || data.ValueType == "percentage")
                                return val * 100;
                            return val;
                        })(data.CalculatedValue.Value)
                    })()).toFixed(2);

                    if(data.CalculatedValue.Value != 0) {
                        if(data.CalculatedValue.ValueType == "percentage" || data.ValueType == "percentage")
                            data.calculatedvaluetodisplay = getFixedCalculatedValue + "%"
                        else
                            data.calculatedvaluetodisplay = getFixedCalculatedValue;
                    } else {
                        data.calculatedvaluetodisplay = "NA"
                    }

                    if(data.Operator == "min"){
                        data.ismet = (getFixedCalculatedValue > data.Value1) ? "Met" : "Not Met";
                    } else if(data.Operator == "max"){
                        data.ismet = (getFixedCalculatedValue < data.Value1) ? "Met" : "Not Met";
                    } else if(data.Operator == "greater than or equal"){
                        data.ismet = (getFixedCalculatedValue >= data.Value1) ? "Met" : "Not Met";
                    } else if(data.Operator == "lower than or equal"){
                        data.ismet = (getFixedCalculatedValue <= data.Value1) ? "Met" : "Not Met";
                    } else if(data.Operator == "equal"){
                        data.ismet = (getFixedCalculatedValue == data.Value1) ? "Met" : "Not Met";
                    } else if(data.Operator == "between"){
                        data.ismet = (getFixedCalculatedValue > data.Value1 && getFixedCalculatedValue < data.Value2) ? "Met" : "Not Met";
                    }
                } else {
                    _.each(columns, function(column){
                        column.field = column.field.toLowerCase();
                    })
                    data.calculatedvaluetodisplay = "No Internal Rating"
                    data.ismet = "No Internal Rating";
                }

                attr.push(data);
            })
            $("#gridpolicyparameter").html("")
            $("#gridpolicyparameter").kendoGrid({
                dataSource : { data: attr() },
                scrollable:false,
                columns: columns
            });
        }
    }

    $(function () {
        ajaxPost("/creditscorecard/getcscdata", getSearchVal(), function(cscData){

            if(cscData.Data != undefined){
                loanapproval.internalrating(cscData.Data[0].FinalRating);
                ajaxPost("/normmaster/getnormdata", {
                    Internalrating: loanapproval.internalrating().replace("-",""),
                    Customerid: filter().CustomerSearchVal(),
                    Dealno: filter().DealNumberSearchVal()
                }, function(param) {
                    render(param.Data);
                })
            } else {
                loanapproval.internalrating("");
                ajaxPost("/normmaster/getnormdata", {
                    Internalrating: loanapproval.internalrating().replace("-",""),
                    Customerid: filter().CustomerSearchVal(),
                    Dealno: filter().DealNumberSearchVal()
                }, function(param) {
                    render(param.Data);
                })
            }
        })
    })
}

var exportPDF = function() {
   return function(){
    $('#headerpdf').show();
    kendo.drawing.drawDOM($("#tab0"), {})
        .then(function(group){
            kendo.drawing.pdf.saveAs(group, loanapproval.companyname() + ".pdf");
        })
        .done(function(data){
            $('#headerpdf').hide();
        })
   }
}

var promoterBackground = function(param) {
    var data = [];
    var settings = {
        size: 3,
        getHeaderWidth: function(){
            return 16.66666667 + '%'
        },
        getContentWidth: function(){
            return ((100 - parseFloat(this.getHeaderWidth().replace('%',''))) / this.size) + '%'
        },
        getTotalWidth: function(values) {
            return (parseFloat(this.getHeaderWidth().replace('%','')) + (parseFloat(this.getContentWidth().replace('%','')) * values.length)) + '%';
        }
    }

    var setData = function(biodatas) {
        var template = function() {
            return {
                name: { values: ko.observableArray(), title: "Name", style: "center" },
                designation: { values: ko.observableArray(), title: "Designation", style: "left" },
                dateOfBirth: { values: ko.observableArray(), title: "Age (DOB)", style: "left" },
                shareHoldingPercentage: { values: ko.observableArray(), title: "% of Share Holding", style: "right" },
                cIBILScore: { values: ko.observableArray(), title: "CIBIL Score", style: "right" },
                education: { values: ko.observableArray(), title: "Education Qualification", style: "left" },
                address: { values: ko.observableArray(), title: "Residence Address", style: "left" },
                mobile: { values: ko.observableArray(), title: "Mobile No.", style: "left" },
                phone: { values: ko.observableArray(), title: "Landline No.", style: "left" },
                email: { values: ko.observableArray(), title: "Email ID", style: "left"},
                netWorth: { values: ko.observableArray(), title: "Approximate Net Worth", style: "right" },
                experience: { values: ko.observableArray(), title: "Experience and any other Business (Specify)", style: "left" },
                guarantor: { values: ko.observableArray(), title: "Personal Guarantee", style: "left" },
                redflag: { values: ko.observableArray(), title: "RedFlags", style: "left" },
            }
        }

        t = new template();
        _.each(biodatas, function(b, i){
            var redflag = "";
            _.each(due.form.Background(), function(dfb) {
                if(b.Name == dfb.Name) {
                    redflag = dfb.RedFlags;
                    return;
                }
            })

            t.name.values.push((b.Name != "") ? b.Name : "-");
            t.designation.values.push((b.Designation != "") ? b.designation : "-");
            t.dateOfBirth.values.push(moment(b.DateOfBirth).format("DD-MM-YYYY"));
            t.shareHoldingPercentage.values.push(b.ShareHoldingPercentage);
            t.cIBILScore.values.push(b.CIBILScore);
            t.education.values.push(b.Education);
            t.address.values.push((b.Address != "") ? b.Address : "-");
            t.mobile.values.push(b.Mobile);
            t.phone.values.push(b.Phone);
            t.email.values.push(b.Email);
            t.netWorth.values.push(b.NetWorth);
            t.experience.values.push("-")
            t.guarantor.values.push(b.Guarantor ? "Yes" : "No");
            t.redflag.values.push(redflag != "" ? redflag : "-")

            if( (i + 1) % settings.size == 0 && i != biodatas.length-1) {
                data.push(t);
                t = new template();
            }
        })
        data.push(t);
    }

    $(function () {
        setData(param);
    })

    return { data: data, settings: settings };
}

var propertyOwnership = function(param) {
    var attr = {
        biodatas: ko.observableArray(),
        officeDetails: ko.observable(),
        settings: {
            size: 3,
            getHeaderWidth: function(){
                return 16.66666667 + '%'
            },
            getContentWidth: function(){
                return ((100 - parseFloat(this.getHeaderWidth().replace('%',''))) / this.size) + '%'
            },
            getTotalWidth: function(values) {
                return (parseFloat(this.getHeaderWidth().replace('%','')) + (parseFloat(this.getContentWidth().replace('%','')) * values.length)) + '%';
            }
        }
    }

    var setData = function(cp) {

        function dataTemplate() {
            return {
                name: { title: "Name", values: ko.observableArray() },
                address: { title: "Address", values: ko.observableArray() },
                ownership: { title: "Ownership", values: ko.observableArray() },
                noOfYears: { title: "No. Of Years in this Address", values: ko.observableArray() },
                netWorth: { title: "Approx Market Value", values: ko.observableArray() },
                propertyType: { title: "Property Type", values: ko.observableArray() },
                propertyAddress: { title: "Address", values: ko.observableArray() },
                propertyMarket: { title: "Market Value (Rs Lacs)", values: ko.observableArray() },
                // propertyOtherDetails: {title: "Other Property Details if any", values: ko.observableArray()}
            }
        }

        var officeDetails = function(registeredAddress) {
            return ko.mapping.fromJS({
                address: registeredAddress.AddressRegistered,
                ownership: registeredAddress.Ownership,
                landarea: registeredAddress.AreaOfPlotRegistered,
                builtuparea: registeredAddress.BuiltUpAreaRegistered
            })
        }

        var dt;
        attr.officeDetails(officeDetails(cp.applicantdetail.registeredaddress));
        biodatas = cp.detailofpromoters.biodata;
        _.each(biodatas, function(b, i){
            if( (i + 1) % attr.settings.size == 1 ) {
                dt = new dataTemplate();
            }
            dt.name.values.push((b.Name != "") ? b.Name : "-");
            dt.address.values.push((b.Address != "") ? b.Address : "-");
            dt.ownership.values.push((b.Ownership != "") ? b.Ownership : "TBD");
            dt.noOfYears.values.push((b.NoOfYears != "") ? b.NoOfYears : "-");
            dt.netWorth.values.push((b.NetWorth != "") ? b.NetWorth : "-");

            if(b.PropertyOwned != undefined){
                var proptype = ""
                var propaddress = ""
                var valmarket = ""
                var otherproptype = ""
                _.each(b.PropertyOwned, function(po, j) {
                    // dt.propertyType.values()[i] =  ( i + 1 ) + ". " + po.PropertyType + "\n";
                    // dt.propertyAddress.values()[i] = ( i + 1 ) + ". " + po.Address + "\n";
                    // dt.propertyMarket.values()[i] = ( i + 1 ) + ". " + po.MarketValue + "\n";
                    proptype = proptype + ( j + 1 ) + ". " + po.PropertyType + "\n";
                    propaddress = propaddress + ( j + 1 ) + ". " + po.Address + "\n";
                    valmarket = valmarket + ( j + 1 ) + ". " + po.MarketValue + "\n";
                    otherproptype = otherproptype + ( j + 1 ) + ". " + po.PropertyType + " - " + po.Address + " - " + po.MarketValue + "\n";
                })
                dt.propertyType.values()[i] = proptype
                dt.propertyAddress.values()[i] = propaddress
                dt.propertyMarket.values()[i] = valmarket
                // dt.propertyOtherDetails.values()[i] = otherproptype
            } else {
                dt.propertyType.values.push("-")
                dt.propertyAddress.values.push("-")
                dt.propertyMarket.values.push("-")
                // dt.propertyOtherDetails.values.push("-")
            }

            if( (i + 1) % attr.settings.size == 0 ) {
                attr.biodatas.push(dt);
                dt = undefined;
            }
        })
        if(dt != undefined)
            attr.biodatas.push(dt);

        var emptySpaces = attr.settings.size - _.last(attr.biodatas()).name.values().length;
        for (var i = emptySpaces - 1; i >= 0; i--) {
            var b = _.last(attr.biodatas());
            _.each(Object.keys(b), function(prop) {
                b[prop].values().push("")
            });
        }

    }

    setData(param);
    return attr;
}

var outstanding = function(param){
    var attr = {
        topTable: ko.observableArray(),
        totalEMI: ko.observable(0)
    }

    var base = function(a, b) { return { fb: ko.observable(a), nfb: ko.observable(b) } };

    _.each(param.BA, function(ba){
        var account = ba.DataBank[0].BankAccount;
        console.log(account)
        if ( account.FacilityType.indexOf("Non-Fund Based") == -1){
            account.NonFundBased.NatureOfFacility = "";
            account.NonFundBased.SanctionDate =  "";
            account.NonFundBased.SancLimit = "";
            account.NonFundBased.SecurityOfFB = "";
        }

         if (account.FacilityType.indexOf("Fund Based") == -1){
            account.FundBased.SancLimit = "";
            account.FundBased.SecurityOfFB = "";
            account.FundBased.SanctionDate =  null;
        }

        attr.topTable().push({
            bankName: ko.observable(account.BankName),
            amount: new base(account.FundBased.SancLimit, account.NonFundBased.SancLimit),
            roi: ko.observable(account.FundBased.ROI),
            natureOfFacility: ko.observable(account.NonFundBased.NatureOfFacility),
            security: new base(account.FundBased.SecurityOfFB, account.NonFundBased.SecurityOfFB),
            sanctionDate: new base(account.FundBased.SanctionDate, account.NonFundBased.SanctionDate)
        })
    })

    _.each(param.RTR, function(rtr){
        if(rtr.LoanStatus == "Live")
            attr.totalEMI(attr.totalEMI() + rtr.EMI)
    })

    return attr;
};

var companyBackground = function(param) {
    if(param != undefined) {
        var attr = {
            topTable: {},
            topCustomersName: ko.observableArray(),
            topProducts: ko.observableArray()
        }

        attr.topTable.pdDone = param.accountsetupdetails.pdinfo.pddoneby;

        var pddt = new Date(param.accountsetupdetails.pdinfo.pddate);
        pddat = moment(pddt).format("DD/MM/YYYY");

        if(pddat == "01/01/1970"){
            attr.topTable.pdDate = "-";
        }else {
            attr.topTable.pdDate = pddat;
        }

        attr.topTable.pdPlace = param.accountsetupdetails.pdinfo.pdplace;
        attr.topTable.personMet = param.accountsetupdetails.pdinfo.personmet;

        if(!param.CMISNULL) {
            attr.topTable.pdCustomerMargin = param.accountsetupdetails.pdinfo.customermargin + "%";
        } else {
            attr.topTable.pdCustomerMargin = "-"
        }
        attr.topTable.pdRemarks = param.accountsetupdetails.pdinfo.pdremarks;
        attr.topTable.pdComments = param.accountsetupdetails.pdinfo.pdcomments;

        loanapproval.companybackground([]);
        loanapproval.companybackground.push(attr.topTable);

        rendercompbacground(loanapproval.companybackground());

        attr.mostLength = ko.computed(function() {
            if(attr.topCustomersName().length > attr.topProducts().length)
                return attr.topCustomersName()
            else
                return attr.topProducts()
        })

        if(param.borrowerdetails.TopCustomerNames != undefined)
            attr.topCustomersName(param.borrowerdetails.TopCustomerNames);
        else
            attr.topCustomersName(param.borrowerdetails.topcustomernames);

        if(param.borrowerdetails.ProductNameandDetails != undefined)
            attr.topProducts(param.borrowerdetails.ProductNameandDetails);
        else
            attr.topProducts(param.borrowerdetails.productnameanddetails);

        return attr
    } else {
        return ""
    }
}

loanApproval.test = ko.observableArray([])

loanApproval.checkValidation = function(data){
  if(data.Data.CP.length==0){
        Materialize.toast("Customer Profile Data Not Confirmed", 5000);

  }

  if(data.Data.BA.length==0){
        Materialize.toast("Bank Analysis Data Not Confirmed", 5000);

  }

  if(data.Data.CIBIL.length==0){
        Materialize.toast("CIBIL Data Not Confirmed", 5000);

  }

  if(data.Data.CIBILPROM.length==0){
        Materialize.toast("CIBIL Promotor Data Not Confirmed", 5000);

  }

  if(data.Data.AD.length==0){
        Materialize.toast("Account Details Data Not Confirmed", 5000);

  }

  if(data.Data.RTR.length==0){
        Materialize.toast("RTR Data Not Confirmed", 5000);

  }

  $("#toast-container").css("top","30%");
}

allData = ko.observableArray()

loanApproval.getReport = function(param){
    ajaxPost("/loanapproval/getalldata", param, function(data){
        loanApproval.checkValidation(data);

        if (data.Data.CP[0] != undefined){
            loanapproval.companyname (data.Data.CP[0].applicantdetail.CustomerName);
            loanapproval.businessaddress (data.Data.CP[0].applicantdetail.registeredaddress.AddressRegistered);
            loanapproval.promotersarr (data.Data.CP[0].detailofpromoters.biodata);

            loanapproval.promotorbio (data.Data.CP[0].detailofpromoters.biodata);
            loanapproval.officeaddress (data.Data.CP[0].applicantdetail.registeredaddress.AddressRegistered);
            loanapproval.officeownership (data.Data.CP[0].applicantdetail.registeredaddress.Ownership);
            loanapproval.officelandarea (data.Data.CP[0].applicantdetail.registeredaddress.AreaOfPlotRegistered);
            loanapproval.officebuiltuparea (data.Data.CP[0].applicantdetail.registeredaddress.BuiltUpAreaRegistered);
            if (data.Data.CP[0].applicantdetail.registeredaddress.ValueRegistered != undefined){
                loanapproval.valueregistered (data.Data.CP[0].applicantdetail.registeredaddress.ValueRegistered)
            }
        }

        var validation = true;
        if (data.Data.AD[0] != undefined)
        validation = checkConfirmedOrNot(data.Data.AD[0].status, 1, 1, true, false, "Account Detail");

        if (data.Data.AD[0] != undefined && validation){


            var datetime = new Date(data.Data.AD[0].accountsetupdetails.logindate);
            dt =  moment(datetime ).format("DD/MM/YYYY")
            loanapproval.logindate (dt);
            loanapproval.product (data.Data.AD[0].accountsetupdetails.product);
            loanapproval.location (data.Data.AD[0].accountsetupdetails.cityname);
            var firstdateagree = new Date(data.Data.AD[0].borrowerdetails.datebusinessstarted);
            fda = moment(data.Data.AD[0].borrowerdetails.datebusinessstarted).format("DD/MM/YYYY")
            loanapproval.businesssince (fda);
            loanapproval.businesssegment (data.Data.AD[0].borrowerdetails.customersegmentclasification);
            loanapproval.leaddistributor(data.Data.AD[0].accountsetupdetails.leaddistributor);
            loanapproval.creditanalyst(data.Data.AD[0].accountsetupdetails.creditanalyst);
            loanApproval.loanSummary.scheme(data.Data.AD[0].accountsetupdetails.scheme)

            // Loan Detail
            loanApproval.loanDetail.proposedLimitAmount(numberWithCommas( data.Data.AD[0].loandetails.requestedlimitamount));
            loanApproval.loanDetail.ifExistingCustomer((data.Data.AD[0].loandetails.ifexistingcustomer) ? "Yes" : "No");
            loanApproval.loanDetail.proposedROI(data.Data.AD[0].loandetails.proposedrateinterest + "%");
            loanApproval.loanDetail.ifYesExistingLimitAmount(data.Data.AD[0].loandetails.ifyeseistinglimitamount);
            loanApproval.loanDetail.proposedProFee(data.Data.AD[0].loandetails.proposedpfee + "%");
            loanApproval.loanDetail.existingROI(data.Data.AD[0].loandetails.existingroi + "%");
            loanApproval.loanDetail.limitTenor(data.Data.AD[0].loandetails.limittenor);
            loanApproval.loanDetail.existingProcessingFee(data.Data.AD[0].loandetails.existingpf + "%");

            if(moment(new Date(data.Data.AD[0].loandetails.firstagreementdate)).format("DD/MM/YYYY") == "01/01/1970") {
                loanApproval.loanDetail.firstAgreementDate("-")
            } else {
                loanApproval.loanDetail.firstAgreementDate(moment(new Date(data.Data.AD[0].loandetails.firstagreementdate)).format("DD/MM/YYYY"))
            }

            loanApproval.loanDetail.vintageWithX10(data.Data.AD[0].loandetails.vintagewithx10);
            if(moment(new Date(data.Data.AD[0].loandetails.recenetagreementdate)).format("DD/MM/YYYY") == "01/01/1970") {
                loanApproval.loanDetail.recentAgreementDate("-")
            } else {
                loanApproval.loanDetail.recentAgreementDate(moment(new Date(data.Data.AD[0].loandetails.recenetagreementdate)).format("DD/MM/YYYY"))
            }

            loanApproval.loanDetail.poBacked((data.Data.AD[0].loandetails.ifbackedbypo) ? "Yes" : "No"),
            loanApproval.loanDetail.projectPOValue(data.Data.AD[0].loandetails.povalueforbacktoback),
            loanApproval.loanDetail.expectedPayment(data.Data.AD[0].loandetails.expectedpayment)

            if(data.Data.CIBIL.length > 0)
            loanApproval.commercialCibil.assessment(data.Data.CIBIL[0].Rating);

            ajaxPost( "/datacapturing/commentlist", {
                CustomerId : filter().CustomerSearchVal(),
                DealNo : filter().DealNumberSearchVal()
            }, function(data) {
                loanApproval.commercialCibil.comments(data);
            });

            if (data.Data.AD[0].vendordetails.length > 0 ){
                var lead =  _.find(data.Data.AD[0].vendordetails, function(xx){ return  xx.distributorname ==  data.Data.AD[0].accountsetupdetails.leaddistributor});
                console.log(lead,"----lead")
                if(lead == undefined){
                    lead = data.Data.AD[0].vendordetails[0];
                }

                loanapproval.maxdelaydays (lead.maxdelaydays);
                loanapproval.maxpaymentdays (lead.maxpaymentdays)
                loanapproval.standarddeviation (lead.standarddeviation)
                loanapproval.averagepaymentdays (lead.averagepaymentdays)
                loanapproval.averagetransactionpaymentdelay (lead.avgtransactionweightedpaymentdelaydays);
                loanapproval.delaystandarddeviation (lead.delaydaysstandarddeviation);
                loanapproval.averagetransactionpayment (lead.avgtransactionweightedpaymentdays);
                loanapproval.daystandarddeviation (lead.daysstandarddeviation);
                // var avgdelay = 0;
                // _.each(data.Data.AD[0].vendordetails, function(vd){
                //     var highestAD = loanApproval.paymentTrack.highestAverageDelay;
                //     highestAD(vd.averagedelaydays > highestAD() ? vd.averagedelaydays : highestAD());
                //     avgdelay += vd.averagedelaydays;
                // });
                 loanapproval.averagedelaydays(lead.averagedelaydays);
                loanapproval.amountofbusiness(lead.amountofbusinessdone);

            }else{
                loanapproval.maxdelaydays("-");
                loanapproval.maxpaymentdays ("-");
                loanapproval.averagedelaydays ("-");
                loanapproval.standarddeviation ("-");
                loanapproval.averagepaymentdays ("-");
                loanapproval.averagetransactionpaymentdelay ("-");
                loanapproval.delaystandarddeviation ("-");
                loanapproval.averagetransactionpayment ("-");
                loanapproval.daystandarddeviation ("-");
                loanapproval.amountofbusiness("-");

            }

            loanapproval.stocksell(data.Data.AD[0].customerbussinesmix.stocksellin + "%");
            loanapproval.govt(data.Data.AD[0].customerbussinesmix.b2bgovtin + "%");
            loanapproval.corporate(data.Data.AD[0].customerbussinesmix.b2bcorporatein + "%");
            loanapproval.iriscomp(data.Data.AD[0].distributormix.iriscomputerslimitedin + "%");
            loanapproval.savex(data.Data.AD[0].distributormix.savexin + "%");
            loanapproval.rashi(data.Data.AD[0].distributormix.rashiin + "%");
            loanapproval.supertron(data.Data.AD[0].distributormix.supertronin + "%");
            loanapproval.compuage(data.Data.AD[0].distributormix.compuagein + "%");
            loanapproval.avnet(data.Data.AD[0].distributormix.avnetin + "%");

            if(data.Data.AD[0].distributormix.Data != undefined && data.Data.AD[0].distributormix.Data[0].Label != undefined){
              loanapproval.distributorList([])
              _.each(data.Data.AD[0].distributormix.Data, function(data){
                if(typeof data.Result == "undefined") {
                    data.Result = ""
                }
                loanapproval.distributorList.push(data)
              })

              loanapproval.distributorList(data.Data.AD[0].distributormix.Data)
            } else {
              loanapproval.distributorList([{Label : "", Result: ""}])
            }

            loanapproval.expansionplan (data.Data.AD[0].borrowerdetails.expansionplans);
            loanapproval.commentfinance (data.Data.AD[0].borrowerdetails.commentsonfinancials);
            loanapproval.marketref(data.Data.AD[0].borrowerdetails.marketreference);
            loanapproval.referencecheck (data.Data.AD[0].borrowerdetails.refrencecheck);
            createreferencecheckgrid(loanapproval.referencecheck());
        }

        if(data.Data.NORM != undefined)
            if (data.Data.NORM.length > 0)
                new keyPolicyParam(data.Data.NORM);

        if(data.Data.CP[0] != undefined)
            loanApproval.promoterBackgroundData(
                new promoterBackground(data.Data.CP[0].detailofpromoters.biodata)
                );


        loanApproval.test(data.Data.AD[0])
        loanapproval.companybackground([])

        if(data.Data.AD[0] != undefined)
            loanApproval.companyBackgroundData(
                new companyBackground(data.Data.AD[0])
            );

            if(typeof loanApproval.companyBackgroundData().topTable != "undefined" && typeof loanApproval.companyBackgroundData().topTable.pdDate != "undefined") {
                if(loanApproval.companyBackgroundData().topTable.pdDate == "01/01/1970") {
                    loanApproval.companyBackgroundData().topTable.pdDate = "-"
                }
            }

        if(data.Data.CP[0] != undefined)
            loanApproval.propertyOwnershipData(
                new propertyOwnership(data.Data.CP[0])
                );

        loanApproval.outstandingData(new outstanding(data.Data));

        getComments();
    });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var refreshFilter = function(){
    loanApproval.loading(true)
    promoters = [];
    //resetpromoters();
    loanApproval.refresh();
    createreferencecheckgrid(loanapproval.referencecheck());
}

var getSearchVal = function(){
    return {
        customerid: filter().CustomerSearchVal(),
        dealno: filter().DealNumberSearchVal()
    };
}

var createreferencecheckgrid = function(res){
    $("#referencecheckgrid").html("");
    $("#referencecheckgrid").kendoGrid({
        dataSource : {
            data : res,
        },
        scrollable:false,
        columns :
        [
            {
                title : "Source",
                headerAttributes: { "class": "sub-bgcolor col-sm-2" },
                field : "source"
            },
            {
                title : "Source Name",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "sourcename"
            },
            {
                title : "Reference Check By",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "checkby"
            },
            {
                title : "Positive/Negative",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "ispositive"
            },
            {
                title : "Brief Feedback Remark",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "feedback"
            },
        ]
    });
}


var rendercompbacground = function(res){
    if(res[0].pdDate == "01/01/1970") {
        res[0].pdDate = "-"
    }

    $("#compbackgrid").html("");
    $("#compbackgrid").kendoGrid({
        dataSource : {
            data : res,
        },
        scrollable:false,
        columns :
        [
            {
                title : "PD Done By",
                headerAttributes: { "class": "sub-bgcolor col-sm-2" },
                attributes: { "class": "center" },
                field : "pdDone"
            },
            {
                title : "PD Date",
                headerAttributes: { "class": "sub-bgcolor col-sm-1" },
                attributes: { "class": "center" },
                field : "pdDate"
            },
            {
                title : "PD Place",
                headerAttributes: { "class": "sub-bgcolor" },
                attributes: { "class": "center" },
                field : "pdPlace"
            },
            {
                title : "Person Met",
                headerAttributes: { "class": "sub-bgcolor" },
                attributes: { "class": "center" },
                field : "personMet"
            },
            {
                title : "PD Customer Margin",
                headerAttributes: { "class": "sub-bgcolor col-sm-2" },
                attributes: { "class": "center" },
                field : "pdCustomerMargin"
            },
            {
                title : "PD Remarks",
                headerAttributes: { "class": "sub-bgcolor col-sm-1" },
                attributes: { "class": "center" },
                field : "pdRemarks"
            },
            {
                title : "PD Comments",
                headerAttributes: { "class": "sub-bgcolor col-sm-3" },
                field : "pdComments"
            }
        ]
    });
}

$(document).ready(function(){
    loanApproval.reset();
    loanApproval.loading(true);
    loanApproval.isLoading(false)
    // due.LoadGrid();
    // due.getData();
    $('#headerpdf').hide()
    setTimeout(function(){
        $("#tab0 .collapsible-header").each(function(i,e){
         $(e).css("display","none");
        });

        $("#tab0 .collapsible-noreplace").each(function(i,e){
         $(e).attr("class","collapsible-header header-bgcolor");
        });

        $("#tab0 .collapsible-header").each(function(i,e){
         $(e).trigger("click");
        });

        $("#tab0 .k-grid-add").each(function(i,e){
         $(e).css("display","none");
        });

        // $("#tab0 .btn-success").each(function(i,e){
        //  $(e).css("display","block");
        // });
        $("#tab0 .collapsible-body").each(function(i,e){
            $(e).css("display","block");
        });
    },1000);
    //creategridpolicy();
});

$(document).ajaxStop(function() {
    if( ! loanApproval.isFirstLoad() && loanApproval.isLoading()) {
        loanApproval.loading(false)
        setTimeout(function(){
            //$("body").scrollTop($(window.location.hash).offset().top)
                $("body").scrollTop($("body").offset().top)
        }, 200);
    }
})

due.LoadGrid = function(){
	// due.getData();
	$("#gridDefaulterList0").html("");
	$("#gridDefaulterList0").kendoGrid({
		dataSource: {
			data:  due.form.Defaulter(),
			schema:{
				model:{
					id: "Source",
					fields: {
						Source:{editable: false, nullable: true},
						Applicable:{editable: true},
						BankName:{editable: true},
						Amount:{type: "number", editable: true, min: 1},
						Status:{editable: true},
					}
				}
			}
		},
		scrollable:false,
		edit: function (e) {
	        var fieldName = e.container.find("input").attr("name");
	        if(due.form.Freeze() == true || due.form.Status() == 1){
	        	this.closeCell();
	        }

		},
		columns:[
            {
                title:"Appearance in Defaulter Lists",
                headerAttributes: { class: "sub-bgcolor" },
                columns : [
                    {
                        field: "Source",
                        title: "Source",
                        headerAttributes: { "class": "col-sm-2" },
                        attributes: { "class": "text-bold" },
                    },
                    {
                        field: "Applicable",
                        title: "Applicable",
                        headerAttributes: { "class": "col-sm-2" },
                        attributes: { "class": "center"},
                        editor: due.LoadApplicable,
                    },
                    {
                        field: "BankName",
                        title: "Bank Name",
                        headerAttributes: { "class": "col-sm-4" },
                        // editor: due.LoadMitigantInput,
                    },
                    {
                        field: "Amount",
                        title: "Amount (in CR)",
                        headerAttributes: { "class": "col-sm-2" },
                        attributes: { "class": "text-center", "style": "text-align : right;"},
                        editor: due.amountInput,
                    },
                    {
                        field: "Status",
                        title: "Current Status",
                        headerAttributes: { "class": "col-sm-2" },
                        attributes: { "class": "center"},
                        editor: due.loadCurrentStatus,
                    },
                ]
            }
		],

	});

   	$("#gridverification0").html("");
	$("#gridverification0").kendoGrid({
		dataSource: {
			data: due.form.Verification(),
			schema:{
				model:{
					id: "Particulars",
					fields: {
						Particulars:{editable: false, nullable: true},
						Result:{editable: true},
						Mitigants:{editable: true},
					}
				}
			}
		},

		scrollable:false,
		columns:[
            {
                title:"Verifications",
                headerAttributes: { class: "sub-bgcolor" },
                columns:[
                    {
                        field: "Particulars",
                        title: "Check Particulars",
                        headerAttributes: { "class": "col-sm-4" },
                        attributes: { "class": "text-bold" },
                    },
                    {
                        field: "Result",
                        title: "Result",
                        editor: due.LoadResultDropDown,
                        headerAttributes: { "class": "col-sm-2" },
                        attributes: { "class": "center"}
                    },
                    {
                        field: "Mitigants",
                        title: "Mitigants in Case of Negative Result",
                        editor: due.LoadMitigantInput,
                    },
                ]
            }
		],

	});


	$("#background0").html("");
	$("#background0").kendoGrid({
		dataSource: {
			data:  due.form.Background(),
			schema:{
				model:{
					id: "Name",
					fields: {
						Name:{editable: true,},
						Designation:{editable: true},
						ShareHolding:{type: "number", editable: true, min: 1, spinner: false},
						CIBILScore:{type: "number", editable: true, min: 1},
						RedFlags:{editable: true},
					}
				}
			}
		},

		resizable: true,
		editable: true,
		edit: function (e) {
	        var fieldName = e.container.find("input").attr("name");
	        if(due.form.Freeze() == true || due.form.Status() == 1){
	        	this.closeCell();
	        }

		},
		navigatable: true,
		batch: true,
		columns:[
			{
				field: "Name",
				title: "Name",
				headerAttributes: { "class": "sub-bgcolor" },
				width: 50,
				editor: due.LoadNameDropDown,
				template: function(d){

					return d.Name
				}
			},
			// {
			// 	field: "Designation",
			// 	title: "Designation",
			// 	width: 100,
			// 	// editor: due.LoadResultDropDown,
			// },
			// {
			// 	field: "ShareHolding",
			// 	title: "% of Share Holding",
			// 	width: 50,
			// 	 editor: due.shareHoldingInput,
			// },
			// {
			// 	field: "CIBILScore",
			// 	title: "Cibil Score",
			// 	width: 50,
			// 	editor: due.CibilScoreInput,
			// },
			{
				field: "RedFlags",
				title: "Red Flags",
				headerAttributes: { "class": "sub-bgcolor" },
				width: 100,
				// editor: due.LoadMitigantInput,
			},
			// {
			// 	headerAttributes: { "class": "sub-bgcolor" },
			// 	width: 20,
			// 	template: function(d){
			// 		return '<center><button class="btn btn-flat btn-sm btn-danger noable" onclick="due.removeRowBackground(\''+d.uid+'\')"><i class="fa fa-trash"></i></button></center>'
			// 	}
			// }

		],

	});
}

due.getData = function(){
	due.form.Verification([])
	due.form.Defaulter([])
	due.form.Background([])
	due.form.CustomerId("")
	due.form.DealNo("")
	due.form.Freeze("")
	due.form.Id("")
	due.form.Status("")
	due.dataTemp([])
	var customerId = filter().CustomerSearchVal();
	var dealNo = filter().DealNumberSearchVal();
	var param = {
		CustomerId : customerId,
		DealNo : dealNo
	}

	ajaxPost("/duediligence/getduediligenceinputdataconfirmed", param, function(res){
		var data = res.Data[0];
		if(res.Data.length > 0){
			due.form.Background(data.Background)
			due.form.CustomerId(data.CustomerId)
			due.form.DealNo(data.DealNo)
			due.form.Defaulter(data.Defaulter)
			due.form.Freeze(data.Freeze)
			due.form.Id(data.Id)
			due.form.Status(data.Status)
			due.form.Verification(data.Verification)
			due.dataTemp(data)
			due.LoadGrid();
			if(data.Status == 1){
				$('.form-last-confirmation-info').html('Last confirmed on: '+kendo.toString(new Date(data.LastConfirmed),"dd-MM-yyyy h:mm:ss tt") );
				//due.enableConfirm(false);
			}
		}else{
             if(model.PageId() != "Approval Form"){
                Materialize.toast("Due Diligence Data Not Confirmed", 5000);
                return;
            }


			ajaxPost("/duediligence/getverificationcheck", {}, function(res){
			   	$.each(res.Data, function(w, data){
			   		due.form.Verification.push(
			   			{Particulars : data.Field, Result: "", Mitigants: "",}
			   		)
			   	});
				due.LoadGrid();
			});

			ajaxPost("/duediligence/getdefaultcheck", {}, function(res){
			   	if(res.IsError != true){
			   		$.each(res.Data, function(i, item){
			   			due.form.Defaulter.push(
				   			{Source:item.Field ,Applicable : "",BankName: "",Amount: 0,Status: "",}
				   		)
			   		});

				due.LoadGrid();
			   	}
			});

			due.form.Background.push(
				{
					Name: "",
					Designation:"",
					ShareHolding: 0,
					CIBILScore: 0,
					RedFlags: "",
				}
			)
		}
	});
}

due.getCostumerData = function(){
	var customerId = filter().CustomerSearchVal();
	var dealNo = filter().DealNumberSearchVal();

	var url = "/datacapturing/getcustomerprofiledetailconfirmed"
	var param = {
		CustomerId: customerId,
		DealNo: dealNo
	}
	due.formVisible(false);
	app.ajaxPost(url, param, function (res) {
		if (res.length > 0)
		res = checkConfirmedOrNot(res[0].Status, 1, 2, res, [], "Customer Application");

		if(due.form.Freeze() == true){
			due.EnableAllfields(false)
		}

		due.formVisible(true);
		due.Name([]);
		due.dataCustomer([]);
		if(res.length > 0){
			$.each(res[0].DetailOfPromoters.Biodata, function(i, items){
				due.Name.push(
					{text: items.Name, value: items.Name}
				)
			});
			due.dataCustomer(res[0].DetailOfPromoters.Biodata)
		}

	}, function(){
		// due.isLoading(false);
	});
}
