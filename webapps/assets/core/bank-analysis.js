var bankaccount = {};
bankaccount.bankname = ko.observable("");
bankaccount.actype = ko.observable("");
bankaccount.acno = ko.observable("");
bankaccount.acholder = ko.observable("");
bankaccount.sanclimit = ko.observable("");
bankaccount.roiperannum = ko.observable("");
bankaccount.interestpermonth = ko.observable("");
bankaccount.banksttto = ko.observable("");
var isshow = ko.observable(false);
bankacc = {};
bankdatares = ko.observableArray([]);
var bankdetails = [];
var url = "/bankanalysis";
var abbavg = 0;

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
        e.CreditCash = parseInt(e.CreditCash / dt.TotalCredit*100);
        e.CreditCash = isFinite(e.CreditCash) ? e.CreditCash : 0;
        e.DebitCash = parseInt(e.DebitCash / dt.TotalDebit*100);
        e.DebitCash = isFinite(e.DebitCash) ? e.DebitCash : 0;
    });

    createAmlGrid(res);
}

var RebuildSummary = function(id){
    $("#"+id+" .k-header:eq(0)").append("<span class='glyphicon glyphicon-chevron-down pull-right'></span");
    $("#"+id+" .k-header:eq(0)").append("<i class='fa fa-list pull-left'></i");
    $("#"+id+" .k-grid-content").hide();
    $("#"+id+" .k-header:eq(0)").unbind("click").bind("click", function (e) {
        var content = $("#"+id+" .k-grid-content:visible");
        if(content.length == 0){
            $("#"+id+" .k-grid-content").slideDown("slow");
            $("#"+id+" .k-header:eq(0)").find("span").attr("class",'glyphicon glyphicon-chevron-up pull-right')
        }else{
            $("#"+id+" .k-grid-content").slideUp("slow");
            $("#"+id+" .k-header:eq(0)").find("span").attr("class",'glyphicon glyphicon-chevron-down pull-right')
        }
    });
    $("#"+id+" .k-header:eq(0)").addClass('header-bgcolor').attr("style","cursor: pointer;");
}

var createBankingGrid = function(res){
    for(var i in res){
        res[i]["Month"] = moment(res[i]["Month"].split("T")[0]).format("MMM-YYYY")
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
            columns:[{
                title:"Months",
                field:"Month",
                headerAttributes: { "class": "sub-bgcolor" },
                format:"{0:dd-MMM-yyyy}",
                footerTemplate: 'Total'
            }, {
                title:"Monthly Credits",
                field:"TotalCredit",
                headerAttributes: { "class": "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'> #= kendo.toString(sum, 'n0') # </div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(TotalCredit,'N0') #"
            }, {
                title:"Monthly Debits",
                field:"TotalDebit",
                headerAttributes: { "class": "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(TotalDebit,'N0') #"
            }, {
                title:"No. Of Debits",
                field:"NoOfDebit",
                headerAttributes: { "class": "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(NoOfDebit,'N0') #"
            }, {
                title:"No. Of Credits",
                field:"NoOfCredit",
                headerAttributes: { "class": "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(NoOfCredit,'N0') #"
            }, {
                title:"O/W Cheque Returns",
                field:"OwCheque",
                headerAttributes: { "class": "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(OwCheque,'N0') #"
            }, {
                title:"I/W Cheque Returns",
                field:"IwCheque",
                headerAttributes: { "class": "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(IwCheque,'N0') #"
            }, {
                title:"Utilization %",
                field:"Utilization",
                headerAttributes: { "class": "sub-bgcolor" },
                aggregates: ["average"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(average, 'P1') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(Utilization,'P1') #"
            }, {
                title:"Imp Margin",
                field:"ImpMargin",
                headerAttributes: { "class": "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(ImpMargin,'N2') #"
            }, {
                title:"O/W Return %",
                field:"OwReturnPercentage",
                headerAttributes: { "class": "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(average, 'P1') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(OwReturnPercentage,'P1') #"
            }, {
                title:"I/w return %",
                field:"LwReturnPercentage",
                headerAttributes: { "class": "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(average, 'P1') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(LwReturnPercentage,'P1') #"
            }, {
                title:"Dr./Cr. Ratio",
                field:"DrCrReturnPercentage",
                headerAttributes: { "class": "sub-bgcolor" },
                aggregates: ["sum"],
                footerTemplate: "<div style='text-align: right'>#= kendo.toString(average, 'N2') #</div>",
                attributes:{ "style": "text-align:right" },
                template : "#: kendo.toString(DrCrReturnPercentage,'N2') #"
            }]
        }],
    });
    RebuildSummary("bankinggrid");
}

var createOdDetailGrid = function(res){
    $("#oddetailgrid").html("");
    $("#oddetailgrid").kendoGrid({
        dataSource : {
			data : res,
            aggregate: [
                { field: "SancLimit", aggregate: "sum" },
                { field: "OdCcUtilization", aggregate: "average" },
                { field: "InterestPerMonth", aggregate: "sum" },
                { field: "abb", aggregate: "average" },
                // { field: "util", aggregate: "average" },
            ]
		},
        columns : [
            {
                title:"OD Details",
                columns:[
                    {
                        title:"Bank",
                        field:"Bank",
                        headerAttributes: { "class": "sub-bgcolor" },
                        footerTemplate: "Total",
                    },
                    {
                        title:"Sanction Limit",
                        field:"SancLimit",
                        headerAttributes: { "class": "sub-bgcolor" },
                        aggregates: ["sum"],
                        footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
                        attributes:{ "style": "text-align:right" },
                        template : "#: kendo.toString(SancLimit,'N0') #"
                    },
                    {
                        title:"OD Utilization",
                        field:"OdCcUtilization",
                        headerAttributes: { "class": "sub-bgcolor" },
                        format:"{0:p1}",
                        aggregates: ["average"],
                        footerTemplate: "<div style='text-align: right'>#= kendo.toString(average, 'p1') #</div>",
                        attributes:{ "style": "text-align:right" },
                        template : "#: kendo.toString(OdCcUtilization,'P1') #"
                    },
                    {
                        title:"Interest Paid",
                        field:"InterestPerMonth",
                        headerAttributes: { "class": "sub-bgcolor" },
                        aggregates: ["sum"],
                        footerTemplate: "<div style='text-align: right'>#= kendo.toString(sum, 'n0') #</div>",
                        attributes:{ "style": "text-align:right" },
                        template : "#: kendo.toString(InterestPerMonth,'N0') #"
                    },
                     {
                        title:"ABB",
                        field:"abb",
                        headerAttributes: { "class": "sub-bgcolor" },
                        aggregates: ["average"],
                        footerTemplate: "<div style='text-align: right'>#= kendo.toString(abbavg, 'n0') #</div>",
                        attributes:{ "style": "text-align:right" },
                        template : "#: kendo.toString(abb,'N0') #"
                    },
                    //  {
                    //     title:"Utilization %",
                    //     field:"util",
                    //     aggregates: ["average"],
                    //     footerTemplate: "<div style='text-align: right'>#= kendo.toString(average, 'P1') #</div>",
                    //     attributes:{ "style": "text-align:right" },
                    //     template : "#: kendo.toString(util,'P1') #"
                    // },
                ]
            },
        ],
    });
    RebuildSummary("oddetailgrid");
}

var createAmlGrid = function(data){
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
                columns:[
                    {
                        title:"Months",
                        field:"Month",
                        headerAttributes: { "class": "sub-bgcolor" },
                        footerTemplate: "Total"
                    },
                    {
                        title:"Credits",
                        field:"CreditCash",
                        headerAttributes: { "class": "sub-bgcolor" },
                        aggregates: ["average"],
                        footerTemplate: "<div style='text-align: right'>#=kendo.toString(average,'N1')#%</div>",
                        template : "#=kendo.toString(CreditCash,'N1') #%",
                        attributes:{ "style": "text-align:right" },
                    },
                    {
                        title:"Debits",
                        field:"DebitCash",
                        headerAttributes: { "class": "sub-bgcolor" },
                        aggregates: ["average"],
                        footerTemplate: "<div style='text-align: right'>#=kendo.toString(average,'N1')#%</div>",
                        template : "#=kendo.toString(DebitCash,'N1') #%",
                        attributes:{ "style": "text-align:right" },
                    },
                ]
            },
        ],
    });
    RebuildSummary("amlgrid");
}

var getSearchVal = function(){
    return {
        CustomerId: parseInt(filter().CustomerSearchVal()),
        DealNo: filter().DealNumberSearchVal()
    };
}

var createBankDetailGridCols = function(isForm){

    cols = [{
        title : "Month",
        field : "Month",
        headerAttributes: { "class": "sub-bgcolor" },
        template: "#= kendo.toString(kendo.parseDate(Month, 'yyyy-MM-dd'), 'dd-MM-yyyy') #"
    }, {
        headerTemplate: "Monthly Credits<br />Rs. Lacs",
        headerAttributes: { "class": "sub-bgcolor" },
        columns: [{
            title : "Non Cash",
            field : "CreditNonCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.CreditNonCash == 0){
                    return "";
                }else{
                    return d.CreditNonCash
                }
            },
            editor: disableSpinner
        }, {
            title : "Cash",
            field : "CreditCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.CreditCash == 0){
                    return "";
                }else{
                    return d.CreditCash
                }
            },
            editor: disableSpinner
        }, {
            title : "Total",
            headerAttributes: { "class": "sub-bgcolor" },
            template : "#:CreditNonCash+CreditCash#"
        }]
    }, {
        headerTemplate: "Monthly Debits<br />Rs. Lacs",
        headerAttributes: { "class": "sub-bgcolor" },
        columns: [{
            title : "Non Cash",
            field : "DebitNonCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.DebitNonCash == 0){
                    return "";
                }else{
                    return d.DebitNonCash
                }
            },
            editor: disableSpinner
        }, {
            title : "Cash",
            field : "DebitCash",
            headerAttributes: { "class": "sub-bgcolor" },
            template: function(d){
                if (d.DebitCash == 0){
                    return "";
                }else{
                    return d.DebitCash
                }
            },
            editor: disableSpinner
        }, {
            title : "Total",
            headerAttributes: { "class": "sub-bgcolor" },
            template : "#:DebitNonCash+DebitCash#"
        }]
    }, {
        title : "AVG BAL ON 1+7+14+21+28",
        field : "AvgBalon",
        headerAttributes: { "class": "sub-bgcolor" },
        width : 120,
        template: function(d){
            if (d.AvgBalon == 0){
                return "";
            }else{
                return d.AvgBalon
            }
        },
        editor: disableSpinner
    }, {
        title : "OD/CC Utilization Per Months",
        headerAttributes: { "class": "sub-bgcolor" },
        template : function (d) {
            var value = toolkit.number(d.AvgBalon / d.OdCcLimit)
            return kendo.toString(value, 'p1')
        }
    }, {
        title : "OD/CC Limit Per Months",
        field : "OdCcLimit",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.OdCcLimit == 0){
                return "";
            }else{
                return d.OdCcLimit
            }
        },
        editor: disableSpinner
    }, {
        title : "Actual Interest paid Rs.Lacs",
        field : "ActualInterestPaid",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.ActualInterestPaid == 0){
                return "";
            }else{
                return d.ActualInterestPaid
            }
        },
        editor: disableSpinner
    }, {
        title : "No. of Debits",
        field : "NoOfDebit",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.NoOfDebit == 0){
                return "";
            }else{
                return d.NoOfDebit
            }
        },
        editor: disableSpinner
    }, {
        title : "No. of Credits",
        field : "NoOfCredit",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.NoOfCredit == 0){
                return "";
            }else{
                return d.NoOfCredit
            }
        },
        editor: disableSpinner
    }, {
        title : "O/W Cheque Returns",
        field : "OwCheque",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.OwCheque == 0){
                return "";
            }else{
                return d.OwCheque
            }
        },
        editor: disableSpinner
    }, {
        title : "I/W Cheque Returns",
        field : "IwCheque",
        headerAttributes: { "class": "sub-bgcolor" },
        template: function(d){
            if (d.IwCheque == 0){
                return "";
            }else{
                return d.IwCheque
            }
        },
        editor: disableSpinner
    }];

    if (isForm) cols.splice(4, 1);

    return cols;
}

var createBankDetailGrid = function(res){

    //detail grid
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
                    callData.CustomerId = filter().CustomerSearchVal();
                    callData.DealNo = filter().DealNumberSearchVal();
                    bankacc.BankName = $("#bankname").val();
                    bankacc.AccountType = $("#actype").data("kendoDropDownList").text();
                    bankacc.AccountNo = $("#acno").val();
                    bankacc.AccountHolder = $("#acholder").val();
                    bankacc.SancLimit = Number($("#sanclimit").val());
                    bankacc.ROI = Number($("#roiperannum").val());
                    bankacc. InterestPerMonth = Number($("#interestpermonth").val());
                    if (bankacc.BankStatementTo != ""){
                        var val = $("#bankstt").data("kendoDatePicker");
                        values = val.value();
                        dateval = new Date(values);
                        var month = dateval.getMonth()+1;
                        var datestr = month+"-"+dateval.getDate()+"-"+dateval.getFullYear();
                        var resdate = moment(datestr).toDate().toISOString();
                        bankacc.BankStatementTo = resdate;
                    }
                    callData.BankAccount = bankacc;

                    for(var i in yo.data["models"]){
                        var dt = yo.data["models"][i];
                        callData.BankDetails.push(dt);
                    }
                    ajaxPost(url+"/create",callData, function(res){
                            yo.success(res.data);
                            swal("Success","Data Saved","success");
                            $('#modalAdd').modal('hide');
                            createDataBankGrid(getSearchVal());
                            resetInput();
                            //$('#bankdetailgridform').html("");
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
        height: 300,
        toolbar: [{name:"save",text:"Save Bank Data"},{name:"cancel",text:"Cancel"}],
        editable: true,
        columns: createBankDetailGridCols(true),
    });

    $(".k-grid-cancel-changes").attr("class","btn btn-sm btn-warning k-grid-cancel-changes mgright pull-right");
    $(".k-grid-save-changes").attr("class","btn btn-sm btn-save k-grid-save-changes mgright pull-right");
}

function onChange(){
    if (filter().CustomerSearchVal() == ""){
        swal("Warning","Select Customer First","warning");
        return;
    }else{
        var val = $("#bankstt").data("kendoDatePicker");
        values = val.value();
        dateval = new Date(values);
        var month = dateval.getMonth()+1;
        var datestr = month+"-"+dateval.getDate()+"-"+dateval.getFullYear();
        var resdate = moment(datestr).toDate().toISOString();

        bankdetails = [];
        bankdetails.push({
            Month:resdate,
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

        for (i = 0 ; i < 5 ; i++){
            dateval.setMonth(dateval.getMonth()-1);
            var month = dateval.getMonth()+1;
            var datestr = month+"-"+dateval.getDate()+"-"+dateval.getFullYear();
            var resdate = moment(datestr).toDate().toISOString();
            bankdetails.push({
                Month:resdate,
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
        bankacc.BankStatementTo = resdate;
        var bankdetailtemplate = {
            CustomerId : "",
            BankDetails : []
        };
        bankdetailtemplate.CustomerId = filter().CustomerSearchVal();
        bankdetailtemplate.BankDetails = bankdetails;

        ajaxPost(url+"/savedetailbanktemplate",bankdetailtemplate,function(res){
            createBankingGrid(res.data)
        });

        createBankDetailGrid(bankdetails);
    }
}

var constructOdccModel = function(res){
    var amls = [];
    var odccs = [];
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
        var eachDataBank = detail.DataBank[0];

        aml.Bank        = eachDataBank.BankAccount.BankName;
        aml.SancLimit   = eachDataBank.BankAccount.SancLimit;

        aml.OdCcUtilization = 0;
        aml.InterestPerMonth = 0;
        aml.abb = 0;
        aml.util = 0;

        // var utilarr = _.map(eachDataBank.BankDetails, function (bd) {
        //         return toolkit.number(bd.AvgBalon / bd. OdCcLimit);
        //     });
        // aml.util =  _.reduce(utilarr, function(memo, num){ return memo + num; }, 0)/ _.filter(utilarr, function(x){ return x > 0; }).length ;
        // aml.util = isFinite(aml.util) ? aml.util : 0;

        if (eachDataBank.BankAccount.AccountType.toLowerCase().indexOf('od') > -1) {

            aml.OdCcUtilization = _.max(_.map(eachDataBank.BankDetails, function (bd) {
                return toolkit.number(bd.AvgBalon / bd. OdCcLimit);
            }))

            var interestPerMonth    = eachDataBank.BankAccount.InterestPerMonth;
            var actualInterestPaids = _.map(eachDataBank.BankDetails, function(bd) {
                return bd.ActualInterestPaid;
            })

            var actualInterestPaidValue = toolkit.number(_.sum(actualInterestPaids) / actualInterestPaids.length)
            aml.InterestPerMonth = _.max([interestPerMonth, actualInterestPaidValue])
        }else{
            aml.abb = _.reduce(eachDataBank.BankDetails, function(memo, num){ return memo + num.AvgBalon; }, 0)/_.filter(eachDataBank.BankDetails, function(x){ return x.AvgBalon > 0; }).length ;
        }

        amls.push(aml);
    });

    abbavg = _.reduce(amls, function(memo, num){ return memo + num.abb; }, 0) /  _.filter(amls, function(x){ return x.abb > 0; }).length ;

    // for(var i in amls){
    //     amls[i].amlavg = amlavg;
    // }

    // console.log(amls)
    createOdDetailGrid(amls);
}

var DetailBank = ko.observable({});

var createDataBankGrid = function(id){
    ajaxPost(url+"/getdatabank", id, function(res){

        var c = true;
        _.each(res.data.Detail, function(p){
            if(!p.IsConfirmed){
                c = false;
                return;
            }
        });

        if(c){
            $('#bconfirm').removeClass('btn-confirm').addClass('btn-reenter').html("Reconfirm");
        } else {
            $('#bconfirm').removeClass('btn-reenter').addClass('btn-confirm').html("Confirm All");
        }

        // databankacc = [];
        // databankacc.push(res.data[0].Detail[0].DataBank[0].BankAccount);
        constructOdccModel(res);
        createBankingGrid(res.data.Summary);
        bankdatares(res.data.Detail);
        DetailBank(res.data.Detail);
        setTimeout(function() {
            bankdatares().forEach(function(e,i) {
                draDatabankGrid(i,e);
            }, this);
                generateAML(res.data);
        }, 200);
    });
}

function numChange(){
    try{
        var sanc = parseFloat($("#sanclimit").val());
        var roi = parseFloat($("#roiperannum").val());
        var res = sanc*(roi/100)/12;
        $("#interestpermonth").val( kendo.toString(res,'N1').split(",").join("") );
    }
    catch(e){
        console.log(e);
    }
}

var draDatabankGrid = function(id,res){
    var arr = [];
    arr.push(res.DataBank[0].BankAccount);

    $("#bankaccgrid"+id).kendoGrid({
        dataSource : {
            data : arr,
            schema:{
                model: {
                    id: "BankName",
                    fields: {
                        BankName: {editable: true},
                        AccountType: {editable: true},
                        AccountNo: {editable: true},
                        AccountHolder: {editable: true},
                        SancLimit: {type: "number", editable: true, min: 1},
                        ROI: {type: "number", editable: true, min: 1},
                        InterestPerMonth: {type: "number", editable: false, min: 1},
                        BankStatementTo:{ editable: false, nullable: true },
                    }
                }
            }
        },
        editable: false,
        batch: true,
        navigatable: true,
        columns : [
            {
                title : "Bank Name",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "BankName",
            },
            {
                title : "A/c Type",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "AccountType"
            },
            {
                title : "A/c No.",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "AccountNo"
            },
            {
                title : "A/c Holder",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "AccountHolder"
            },
            {
                title : "Sanc Limit Rs.Lacs",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "SancLimit",
                editor: disableSpinner
            },
            {
                title : "ROI PER ANNUM",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "ROI",
                editor: disableSpinner
            },
            {
                title : "Interest Per Month",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "InterestPerMonth",
                template : "#: SancLimit*(ROI/100)/12 #",
            },
            {
                title : "Bank Stt To",
                headerAttributes: { "class": "sub-bgcolor" },
                field : "BankStatementTo",
                template: "#= kendo.toString(kendo.parseDate(BankStatementTo, 'yyyy-MM-dd'), 'dd-MM-yyyy') #"
            },
        ],
    });

    //detail grid
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
        editable: false,
        navigatable: true,
        batch: true,
        columns : createBankDetailGridCols(false),
        dataBound: function () {
            var data = res.DataBank[0].BankDetails
            var account = res.DataBank[0].BankAccount

            var averageReceipt = {}

            averageReceipt.creditTotal = _.sumBy(data, function (d) {
                return d.CreditNonCash + d.CreditCash;
            }) / (data.length == 0 ? 1 : data.length)

            averageReceipt.debitTotal = _.sumBy(data, function (d) {
                return d.DebitNonCash + d.DebitCash;
            }) / (data.length == 0 ? 1 : data.length)

            var BlonLength = _.filter(data,function(x){return x.AvgBalon > 0});
            BlonLength = BlonLength == undefined ? 0 : BlonLength.length;
            averageReceipt.avgBlon = _.sumBy(data, 'AvgBalon')
                / (BlonLength == 0 ? 1 : BlonLength)

            averageReceipt.utilPerMonth = _.max(data.map(function (d) {
                return d.AvgBalon / d.OdCcLimit
            }))

            averageReceipt.actualInterestPaid = _.sumBy(data, 'ActualInterestPaid')
                / (data.length == 0 ? 1 : data.length)

            averageReceipt.noOfDebit = _.sumBy(data, 'NoOfDebit')
            averageReceipt.noOfCredit = _.sumBy(data, 'NoOfCredit')
            averageReceipt.owCheque = _.sumBy(data, 'OwCheque')
            averageReceipt.iwCheque = _.sumBy(data, 'IwCheque')

            var $footer1 = $('<tr />').addClass('k-footer-template')
                .appendTo($("#bankdetailgrid"+id).find('tbody'))

            $('<td />').appendTo($footer1)
                .html('Average Receipts').attr('colspan', 3)
            $('<td />').appendTo($footer1)
                .html(kendo.toString(averageReceipt.creditTotal, 'n1'))
            $('<td />').appendTo($footer1)
                .html('&nbsp;').attr('colspan', 2)
            $('<td />').appendTo($footer1)
                .html(kendo.toString(averageReceipt.debitTotal, 'n1'))
            $('<td />').appendTo($footer1)
                .html(kendo.toString(averageReceipt.avgBlon, 'n1'))
            $('<td />').appendTo($footer1)
                .html(kendo.toString(averageReceipt.utilPerMonth, 'p1'))
            $('<td />').appendTo($footer1)
                .html('&nbsp;')
            $('<td />').appendTo($footer1)
                .html(kendo.toString(averageReceipt.actualInterestPaid, 'n1'))
            $('<td />').appendTo($footer1)
                .html(kendo.toString(averageReceipt.noOfDebit, 'n1'))
            $('<td />').appendTo($footer1)
                .html(kendo.toString(averageReceipt.noOfCredit, 'n1'))
            $('<td />').appendTo($footer1)
                .html(kendo.toString(averageReceipt.owCheque, 'n1'))
            $('<td />').appendTo($footer1)
                .html(kendo.toString(averageReceipt.iwCheque, 'n1'))

            var averageOpenLimit = {}

            averageOpenLimit.creditTotal = account.SancLimit * averageReceipt.utilPerMonth
            averageOpenLimit.annualisedCredit = averageReceipt.creditTotal * 12

            var $footer2 = $('<tr />').addClass('k-footer-template')
                .appendTo($("#bankdetailgrid"+id).find('tbody'))

            $('<td />').appendTo($footer2)
                .html('Average Open Limit').attr('colspan', 3)
            $('<td />').appendTo($footer2)
                .html(kendo.toString(averageOpenLimit.creditTotal, 'n2'))
            $('<td />').appendTo($footer2)
                .html('&nbsp;').attr('colspan', 3)
            $('<td />').appendTo($footer2)
                .html("Annualised Credits").attr('colspan', 2)
            $('<td />').appendTo($footer2)
                .html(kendo.toString(averageOpenLimit.annualisedCredit, 'n2'))
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

var resetInput = function(){
    $("#bankname").val("");
    $("#actype").val("");
    $("#acno").val("");
    $("#acholder").val("");
    $("#sanclimit").val("");
    $("#roiperannum").val("");
    $("#interestpermonth").val("");
    $('#bankdetailgridform').html("");
    $('#bankstt').data('kendoDatePicker').enable(true);
    bankdetails = [];
}

function numChangeGrid(index){
    setTimeout(function(){
        var sanc =  parseFloat($("#bankaccgrid"+index).find('table tr td:nth-child(5)').html().split("</span>")[1]);
        var roi = parseFloat($("#bankaccgrid"+index).find('table tr td:nth-child(6)').html().split("</span>")[1]);
        if( !isFinite(sanc)){
            sanc =  parseFloat($("#bankaccgrid"+index).find('table tr td:nth-child(5)').html());
        }
        if ( !isFinite(roi)){
            roi = parseFloat($("#bankaccgrid"+index).find('table tr td:nth-child(6)').html());
        }
        $("#bankaccgrid"+index).find('table tr td:nth-child(7)').html(kendo.toString(sanc*(roi/100)/12,'N1'));
    },300);
}

var editDataBank = function(index, reset){
     return function () {
        if (reset) {
            var data = $("#bankdetailgrid"+index).data("kendoGrid").dataSource.data();
            var originalData = JSON.parse(kendo.stringify(data));
            _.each(originalData, function(e,i){
                originalData[i].ActualInterestPaid = 0;
                originalData[i].AvgBalon = 0;
                originalData[i].CreditCash = 0;
                originalData[i].CreditNonCash = 0;
                originalData[i].CreditTotal = 0;
                originalData[i].DebitCash = 0;
                originalData[i].DebitNonCash = 0;
                originalData[i].DebitTotal = 0;
                originalData[i].IwCheque = 0;
                // originalData[i].Month = 0;
                originalData[i].NoOfCredit = 0;
                originalData[i].NoOfDebit = 0;
                originalData[i].OdCcLimit = 0;
                originalData[i].OdCcUtilization = 0;
                originalData[i].OwCheque = 0;
            });
            $("#bankdetailgrid"+index).data("kendoGrid").setDataSource(new kendo.data.DataSource({data: originalData}))
        }

        var gridbankacc = $("#bankaccgrid"+index).data("kendoGrid");
        var gridbankdet = $("#bankdetailgrid"+index).data("kendoGrid");

        gridbankacc.setOptions({editable:true});
        gridbankdet.setOptions({editable:true});

        $("#update"+index).show();
        $("#bedit"+index).hide();

        $("#bankaccgrid"+index).find('table tr td:nth-child(5)').unbind("click").bind("click", function (e) {
            setTimeout(function(){
                 $("input[data-bind='value:SancLimit']").getKendoNumericTextBox().bind("change", function (e) { numChangeGrid(index); });
            },500);
        });

        $("#bankaccgrid"+index).find('table tr td:nth-child(6)').unbind("click").bind("click", function (e) {
            setTimeout(function(){
                 $("input[data-bind='value:ROI']").getKendoNumericTextBox().bind("change", function (e) { numChangeGrid(index); });
            },500);
        });

        return true;
    }
}

var updateDataBank = function(index){
    return function (){
        var gridbankacc = $("#bankaccgrid"+index).data("kendoGrid");
        var gridbankdet = $("#bankdetailgrid"+index).data("kendoGrid");
        var gridbankaccdirty = $("#bankaccgrid"+index).data("kendoGrid").dataSource.hasChanges();
        var gridbankdetdirty = $("#bankdetailgrid"+index).data("kendoGrid").dataSource.hasChanges();
        acc = gridbankacc.dataSource._data[0];
        det = gridbankdet.dataSource._data;
        var bankaccountup = {};
        bankaccountup.BankName = acc.BankName;
        bankaccountup.AccountType = acc.AccountType;
        bankaccountup.AccountNo = acc.AccountNo;
        bankaccountup.AccountHolder = acc.AccountHolder;
        bankaccountup.SancLimit = acc.SancLimit;
        bankaccountup.ROI = acc.ROI;
        bankaccountup.InterestPerMonth = acc.InterestPerMonth;
        bankaccountup.BankStatementTo = acc.BankStatementTo;

        var param = {
            CustomerId : "",
            DealNo : "",
            BankAccount : {},
            BankDetails : []
        }
        param.CustomerId = filter().CustomerSearchVal();
        param.DealNo = filter().DealNumberSearchVal();
        param.BankAccount = bankaccountup;
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
        var xparam = {Id: DetailBank()[index].Id ,Param:param}
        ajaxPost(url+"/update",xparam,function(res){
            swal("Success","Data Updated","success");
            createDataBankGrid(getSearchVal());
        })
        return true;
    }
}

var disableSpinner = function(container, options){
    $('<input data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoNumericTextBox({
        spinners : false,
        min: 0,
    });
}

var refreshFilter = function(){
    createDataBankGrid(getSearchVal());
}

$(document).ready(function(){
    createBankingGrid();
    createOdDetailGrid();
    createAmlGrid();

    $("#bankstt").kendoDatePicker({
        format: "dd-MM-yyyy",
        change: onChange,
    });

    $("#add").click(function(){
        if (filter().CustomerSearchVal() == ""){
            swal("Warning","Select Customer First","warning");
            return;
        }else{
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
                    $('#modalAdd').modal('show');

                }else{
                    $('#modalAdd').modal('show');
                }
            });

        }
    });

    $("#bconfirm").click(function(){
        if (filter().CustomerSearchVal() == "" || filter().DealNumberSearchVal() == ""){
            swal("Warning","Select Customer First","warning");
            return;
        }else{
            resetInput();
            ajaxPost(url+"/setconfirmed", getSearchVal(), function(){
                swal("Success","Data confirmed","success");
                $('#bconfirm').removeClass('btn-confirm').addClass('btn-reenter').html("Reconfirm");
            });
        }
    });

    $("#bankdetailgridform").on("mousedown", ".k-grid-cancel-changes", function (e) {
        $('#modalAdd').modal('hide');
        resetInput();
    });

    $("#actype").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            {text: "OD/CC", value: "OD/CC"},
            {text: "Current", value: "Current"},
        ],
        index: 0,
    });

    $("#sanclimit").keyup(function(){
        numChange();
    });

    $("#roiperannum").keyup(function(){
        numChange();
    });

});