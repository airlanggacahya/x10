model.Processing = ko.observable(true)

var ratioInput = {}; var r = ratioInput;
r.TypeDate = ko.observable('FY Ending');
r.AuditedDate = ko.observable('');
r.ProjectedDate = ko.observable('');
r.unit = ko.observable('Rs. Lacs')
r.startDate = ko.observable();
r.masterBalanceSheetInput =  ko.observableArray([]);
r.masterCustomerProfile = ko.observableArray([]);
r.datePicker = ko.observable("");
r.confirmLabel = ko.observable("Confirm")
r.IsFrozen = ko.observable(false)
r.formVisibility = ko.observable(false)
r.initEvents = function () {
    filter().CustomerSearchVal.subscribe(function () {
        r.formVisibility(false)
    })
    filter().DealNumberSearchVal.subscribe(function () {
        r.formVisibility(false)
    })

    //$('#refresh').remove()
}
r.isLoading = function (what) {
    $('.apx-loading')[what ? 'show' : 'hide']()
    $('.app-content')[what ? 'hide' : 'show']()
    if(!what){
        setTimeout(function(){
            r.addScrollBottom();
        },1000);
    }
}
r.picker = ko.observableArray([
    { Value: 'FY Ending', Text: 'FY Ending' },
    { Value: 'Calendar Year', Text: 'Calendar Year' }
])
r.masterAuditStatus = ko.observableArray([
    { Status: 'AUDITED', Text: 'Audited' },
    { Status: 'UNAUDITED', Text: 'UnAudited' }
])
r.masterProvisionStatus = ko.observableArray([
    { Status: 'PROJECTED', Text: 'Projected' },
    { Status: 'ESTIMATED', Text: 'Estimated' },
    { Status: 'PROVISION', Text: 'Provision' },
])
r.masterYears = ko.observableArray([
    { Date: '31-03-2016', Text: '31-Mar-2016' },
    { Date: '31-03-2015', Text: '31-Mar-2015' },
    { Date: '31-03-2014', Text: '31-Mar-2014' },
    { Date: '31-03-2013', Text: '31-Mar-2013' },
    { Date: '31-03-2012', Text: '31-Mar-2012' },
    { Date: '31-03-2011', Text: '31-Mar-2011' },
    { Date: '31-03-2010', Text: '31-Mar-2010' },
    { Date: '31-03-2009', Text: '31-Mar-2009' },
])
r.customerId = ko.observable('')
r.isFrozen = ko.observable(false)
r.isConfirmed = ko.observable(false)
r.data = ko.observable({});
r.isEmptyRatioInputData = ko.observable(true)

r.getMasterYears = function () {
    return _.orderBy(r.masterYears(), 'Date', 'desc')
}
r.getMasterCustomerProfile = function (callback) {
    r.masterCustomerProfile([]);
    ajaxPost("/datacapturing/getcustomerprofile", {}, function (res) {
        r.masterCustomerProfile(_.orderBy(res, function (d) {
            return d.applicantdetail.CustomerName;
        }))
        if (typeof callback === 'function') {
            callback()
        }
    });
}
r.getMasterBalanceSheetInput = function (callback) {
    r.masterBalanceSheetInput([]);
    ajaxPost("/ratio/getmasterbalancesheetinput", {}, function (res) {
        r.masterBalanceSheetInput(res.filter(function (d) { return d.Use; }))
        if (typeof callback === 'function') {
            callback()
        }
    });
};
r.usePlaceholderData = function (customerId, startDate) {
    var auditStatus = [
        { Date: "", Status: "AUDITED", Unit: r.unit() }
    ]
    var provisionStatus = [
        { Date: "", Status: "PROJECTED", Unit: r.unit() }
    ]

    if (typeof startDate !== 'undefined') {
        let maxYear = moment(startDate, 'DD-MM-YYYY').year()
        let minYear = moment(r.getMasterYears().reverse()[0].Date, 'DD-MM-YYYY').year()
        var typeDate = $('.cell-picker:eq('+(r.data().AuditStatus.length - 1)+')').find('select').data('kendoDropDownList').value()

        auditStatus = []
        provisionStatus = []

        var month = (typeDate == "FY Ending") ? "Mar" : "Dec";

        for (var i = maxYear; i >= minYear; i--) {
            auditStatus.push({
                Date: '31-'+month+'-' + i,
                Status: 'AUDITED',
                TypeDate: typeDate,
                Unit: r.unit(),
                Na: "A"
            })
        }

        auditStatus = auditStatus.slice(0, 4).reverse();
        provisionStatus.push({
            Date: '31-'+month+'-' + (maxYear+7),
            Status: 'PROJECTED',
            TypeDate: typeDate,
            Unit: r.unit(),
            Na: "A"
        })
    }

    r.data({
        CustomerId: customerId,
        AuditStatus: auditStatus,
        ProvisionStatus: provisionStatus,
        FormData: []
    });
}
r.addMoreColumn = function () {
    var usedDates = r.data().AuditStatus.map(function (d) { return d.Date })
    var availableDates = r.getMasterYears().filter((d) => {
        return usedDates.indexOf(d.Date) == -1
    })

    if (availableDates.length == 0) {
        sweetAlert("Oops...", "Max column. Cannot add more column", "error");
        return
    }

    r.data().AuditStatus.push({
        Date: availableDates[0].Date,
        Status: "AUDITED",
        Unit: r.unit()
    })
    r.render()
}
r.clear = function () {
    $('.form-ratio-input').empty()
    r.data({})
}
r.getCustomerId = function () {
    var customer = $('.jf-tbl select:eq(0)').data('kendoDropDownList').value()
    var dealNumber = $('.jf-tbl select:eq(1)').data('kendoDropDownList').value()

    if (customer == '') {
        sweetAlert("Oops...", "Customer cannot be empty", "error");
        return false
    }
    if (dealNumber == '') {
        sweetAlert("Oops...", "Deal number cannot be empty", "error");
        return false
    }

    r.customerId([customer, dealNumber].join('|'))

    return [customer, dealNumber].join('|')
}

r.setData = function (data) {

    r.data(data)

    // console.log(r.data())

    r.TypeDate( r.data().AuditStatus[0].TypeDate );
    r.AuditedDate( r.data().AuditStatus[ (r.data().AuditStatus.length - 1) ].Date );
    r.ProjectedDate( r.data().ProvisionStatus[ (r.data().ProvisionStatus.length - 1) ].Date );

    $("#selectDateAudited").html('');
    r.prepareselectDateAudited();

    $("#selectDateProjected").html('');
    r.prepareselectDateProjected();

    $('#selectDateAudited').find('input').data('kendoDatePicker').value( r.AuditedDate() )
    $('#selectDateProjected').find('input').data('kendoDatePicker').value( r.ProjectedDate() )
}

r.refresh = function () {
    if (r.getCustomerId() === false) {
        return
    }
    r.isLoading(true)
    r.isEmptyRatioInputData(true)
    r.isFrozen(false)
    r.getMasterBalanceSheetInput(function () {
        var param = {}
        param.customerId = r.customerId()

        ajaxPost("/ratio/getratioinputdataall", param, function (res) {
            if (res.Data != null){
                r.formVisibility(true)
                if (res.Data.AuditStatus.length > 0){
                    $.each(res.Data.AuditStatus, function(i,v){
                        var xxx = v.Date.split("-")
                        var ccc = "Mar"
                        if(xxx[1] == "12"){
                            ccc = "Dec"
                        }
                        xxx[1] = ccc
                        res.Data.AuditStatus[i].Date = xxx.join("-")
                    })
                }
                if (res.Data.FormData.length > 0){
                    $.each(res.Data.FormData, function(i,v){
                        var xxx = v.Date.split("-")
                        var ccc = "Mar"
                        if(xxx[1] == "12"){
                            ccc = "Dec"
                        }
                        xxx[1] = ccc
                        res.Data.FormData[i].Date = xxx.join("-")
                    })
                }
                if (res.Data.ProvisionStatus.length > 0){
                    $.each(res.Data.ProvisionStatus, function(i,v){
                        var xxx = v.Date.split("-")
                        var ccc = "Mar"
                        if(xxx[1] == "12"){
                            ccc = "Dec"
                        }
                        xxx[1] = ccc
                        res.Data.ProvisionStatus[i].Date = xxx.join("-")
                    })
                }
            }

            if (res.Message != '') {
                r.TypeDate('FY Ending');
                if(res.Data!=undefined)
                r.TypeDate( toTitleCase(res.Data.AuditStatus[0].Status) );
                r.AuditedDate('');
                r.ProjectedDate('');
                $("#selectDateAudited").html('');
                r.prepareselectDateAudited();
                r.usePlaceholderData(param.customerId)
                r.isLoading(false)
                r.render()
                return;
            }

            r.isEmptyRatioInputData(false)
            r.setData(res.Data)
            r.isFrozen(res.Data.Frozen)
            r.IsFrozen(res.Data.IsFrozen)
            r.isConfirmed(res.Data.Confirmed)
            if(r.isConfirmed()) {
                r.confirmLabel("Re-Enter")
            } else {
                r.confirmLabel("Confirm")
            }
            r.isLoading(false)
            $("#selectTypeDate").find("select").data("kendoDropDownList").value( r.TypeDate() )
            r.render()

            r.endisKendoDropDown(r.isFrozen())
        }, function () {
            r.isLoading(false)
        });
    });
}
r.save = function () {
    if (r.getCustomerId() === false) {
        return
    }

    r.isLoading(true)

    var Id = ''
    if(r.data().Id != undefined) {
        Id = r.data().Id
    }

    var param = $.extend(true, { Id: Id }, r.getData());
    app.ajaxPost("/ratio/saveratioinputdata", param, function (res) {
        if (res.Message != '') {
            r.clear()
            sweetAlert("Oops...", res.Message, "error");
            r.isLoading(false)
            return;
        } else {
            swal("Success", "Changes saved", "success");
        }

        r.isLoading(false)
        r.data().CustomerId = res.Data
    }, function () {
        r.isLoading(false)
    });
}
r.getData = function () {
    if (r.getCustomerId() === false) {
        return
    }

    var auditStatus = $('.cell-audit').get().map(function (d) {
        var $cellYear = $('.cell-year:eq(' + ($(d).index() - 1) + ')')
        var $cellPicker = $('.cell-picker:eq(' + ($(d).index() - 1) + ')').find('select').data('kendoDropDownList').value()
        var $cellNa = $('.cell-na:eq(' + ($(d).index() - 1) + ')').find('select').data('kendoDropDownList').value()
        var o = {}
        o.Date = kendo.toString($cellYear.find('input').data('kendoDatePicker').value(), "dd-MM-yyyy");
        o.Status = $(d).find('select').data('kendoDropDownList').value()
        o.TypeDate = $cellPicker
        o.Unit = r.unit()
        o.Na = $cellNa
        return o
    })

    var ProvisionStatus = $('.cell-audit2').get().map(function (d) {
        var $cellYear = $('.cell-year:eq(' + ($(d).index() - 1) + ')')
        var $cellPicker = $('.cell-picker:eq(' + ($(d).index() - 1) + ')').find('select').data('kendoDropDownList').value()
        var $cellNa = $('.cell-na:eq(' + ($(d).index() - 1) + ')').find('select').data('kendoDropDownList').value()
        var o = {}
        o.Date = kendo.toString($cellYear.find('input').data('kendoDatePicker').value(), "dd-MM-yyyy");
        o.Status = $(d).find('select').data('kendoDropDownList').value()
        o.TypeDate = $cellPicker
        o.Unit = r.unit()
        o.Na = $cellNa
        return o
    })

    // var formData = $('.k-formatted-value').filter(function (i, e) {
    //     //return true
    //     return (parseFloat($(e).val()) > 0)
    // }).get().map(function (d) {
    //     var $cellYear = $('.cell-year:eq(' + ($(d).parent().parent().parent().index() - 1) + ')')
    //     var $cellPicker = $('.cell-picker:eq(' + ($(d).parent().parent().parent().index() - 1) + ')').find('select').data('kendoDropDownList').value()
    //     var c = {}
    //     c.Date = kendo.toString($cellYear.find('input').data('kendoDatePicker').value(), "dd-MMM-yyyy");
    //     c.Value = parseFloat($(d).siblings().attr('aria-valuenow'))
    //     return c
    // })

    var formData = $('.inputmasterform').filter(function (i, e) {
        return (parseFloat($(e).val()) > 0)
    }).get().map(function (d) {
        var $cellYear = $('.cell-year:eq(' + ($(d).parent().index() - 1) + ')')
        var c = {}
        c.FieldId = $(d).attr('status')+"-"+$(d).attr('data-field-id')
        c.Date = kendo.toString($cellYear.find('input').data('kendoDatePicker').value(), "dd-MM-yyyy");
        c.Value = parseFloat( $(d).val() )
        return c
    })


    var o = {}
    o.CustomerId = r.customerId()
    o.AuditStatus = auditStatus
    o.FormData = formData
    o.ProvisionStatus = ProvisionStatus

    return o
}

r.jancok = ko.observable();
var test = function(){
    r.jancok(this)
}

r.render = function () {
    var d = new Date();
    console.log("Date0 : ", d)
    $('.form-last-confirmation-info').html('')

    var headerWidth = 330
    var columnWidth = 150
    var $container = $('.form-ratio-input').empty().css('overflow-x', 'hidden')
    var $divleft = $("<div />").addClass('divleft')
        .css('width', '400px')
        .css('min-height', '50px')
        .css('float', 'left')
        // .css('background-color', 'red')
        .appendTo($container)
    var $divright = $("<div />").addClass('divright')
        .css('width', '610px')
        .css('float', 'left')
        .css('border-top-right-radius', '6px')
        // .css('background-color', 'green')
        .css('overflow-x', 'hidden')
        .appendTo($container)
    var $wrapperleft = $("<table />")
        .appendTo($divleft)
        .width('100%')
    var $wrapper = $("<table />").addClass('wrapper')
        .appendTo($divright)
        .width(r.data().AuditStatus.length * columnWidth + r.data().ProvisionStatus.length * columnWidth)
    var $wrapperfixed = $("<table />")
        .appendTo($('#divrightfixed'))
        .width(r.data().AuditStatus.length * columnWidth + r.data().ProvisionStatus.length * columnWidth)


    // ======= write row header
    var $tr1 = $('<tr />')
        .appendTo($wrapper)
        .addClass('row-header')
        .attr("id", "name1")
        .css('background-color', '#313d50 !important')
        .css('vertical-align', 'bottom')
        .css('color', 'white')
        .hide()

    var $tr1left = $('<tr />')
        .appendTo($wrapperleft)
        .addClass('row-header')
        .css('background-color', '#313d50 !important')
        .css('vertical-align', 'bottom')
        .css('color', 'white')

    var $tr1setengah = $('<tr />')
        .appendTo($wrapper)
        .addClass('row-header')
        .css('background-color', '#313d50 !important')
        .css('color', 'white')

    var $tr1setengahfixed = $('<tr />')
        .appendTo($wrapperfixed)
        .addClass('row-header')
        .css('background-color', '#313d50 !important')
        .css('color', 'white')

    var $tr2 = $('<tr />')
        .appendTo($wrapper)
        .addClass('row-header')
        .css('background-color', '#313d50 !important')
        .css('color', 'white')
        .hide()
    // var $tr3 = $('<tr />')
    //     .appendTo($wrapper)
    //     .addClass('row-header')
    var $tr4 = $('<tr />')
        .appendTo($wrapper)
        .addClass('row-header')
        .css('background-color', '#313d50 !important')
        .css('color', 'white')
        .hide()
    // var $tr5 = $('<tr />')
    //     .appendTo($wrapper)
    //     .addClass('row-header')
    var $tr6 = $('<tr />')
        .appendTo($wrapper)
        .addClass('row-header')
        .css('background-color', '#313d50 !important')
        .css('color', 'white')
        .attr("id", "sete")

    $('<td />').appendTo($tr6).attr("id", "td61").css("background-color","#F0F3F4").hide()

    var $tr6fixed = $('<tr />')
        .appendTo($wrapperfixed)
        .addClass('row-header')
        .css('background-color', '#313d50 !important')
        .css('color', 'white')

    $('<td />')
        .html('Particulars<br>(in Rs. Lacs)')
        .appendTo($tr1left)
        .addClass('title')
        .css('font-size', '12px')
        .css('font-weight', 'normal')
        .css('text-align', 'center')
        .css("height",'53px')
        .css("color",'#fff')
        .addClass('palingkiriori')

    $('<td />')
        .html('Particulars<br>(in Rs. Lacs)')
        .attr('rowspan', 2)
        .width(headerWidth)
        .appendTo($tr1)
        .addClass('title')
        .css('font-size', '12px')
        .css('font-weight', 'normal')
        .css('text-align', 'center')
        .css("min-width",headerWidth)
        .css("color",'#fff')
        .addClass('palingkiri')

    var monthFormat = (r.datePicker() == ".cell-year")? "DD-MMM-YYYY" : "DD-MM-YYYY";

    // _.orderBy(r.data().AuditStatus, function (d) {
    //     return parseInt(moment(d.Date, monthFormat).format('YYYYMMDD'), 10)
    // }, 'asc').forEach(function (d,k) {
    r.data().AuditStatus.forEach(function (d,k) {

        enabledyo = false
        color = "#F0F3F4"
        if(k == r.data().AuditStatus.length-1 && !r.data().Frozen){
            enabledyo = true
            // color = "#397d81"
        }

        var $audit = $('<td />').appendTo($tr1).addClass('cell-audit').css("background-color",color)

        $('<select />').appendTo($audit).kendoDropDownList({
            dataSource: {
                data: (d.Status == "AUDITED")? r.masterAuditStatus() : r.masterAuditStatus()
            },
            dataValueField: 'Status',
            dataTextField: 'Text',
            value: d.Status,
            enabled: false
        })

        var $auditmodif = $('<td />').appendTo($tr1setengah).addClass('cell-auditmodief')
        var $auditmodiffixed = $('<td />').appendTo($tr1setengahfixed).addClass('cell-auditmodief').css("width","152px").css("padding","2px")

        var date_edited = ""
        if(d.Date != ""){
            date_edited = kendo.toString( new Date(d.Date) , 'MMM-yyyy')
        }
        $("<span>"+toTitleCase(d.Status) + " " + date_edited +"</span>").appendTo($auditmodif).addClass("title-cell-audit")
        $("<span>"+toTitleCase(d.Status) + " " + date_edited +"</span>").appendTo($auditmodiffixed).addClass("title-cell-audit")

        var $pickDatePicker = $('<td />').appendTo($tr2).addClass('cell-picker').css("background-color",color)

        $('<select />').appendTo($pickDatePicker).kendoDropDownList({
            dataSource: {
                data: r.picker()
            },
            dataValueField: 'Value',
            dataTextField: 'Text',
            value: d.TypeDate,
            enabled: enabledyo,
            change: function(){
                max = r.data().AuditStatus.length + r.data().ProvisionStatus.length
                for (var i = 0; i < max; i++) {
                    $('.cell-year:eq('+i+')').find('input').data('kendoDatePicker').value(0)
                }
            }
        })

        var $year = $('<td />').appendTo($tr4).addClass('cell-year').css('background-color', '#f1f1f1').css("background-color",color)

        var momonth = (d.TypeDate == "Calendar Year") ? 11 : 2;

        let configDate = {
            min: new Date(2009, momonth, 31),
            max: new Date(2016, momonth, 31),
            depth: "decade",
            start: "decade",
            value: kendo.parseDate(d.Date,"dd-MMM-yyyy"),
            format: "dd-MMM-yyyy",
            enable: enabledyo,
            change: function() {
                if(k == r.data().AuditStatus.length-1){
                    r.isLoading(true)

                    var getDate = kendo.toString(this.value(), "d");
                    var isDate = getDate.split("/")
                    var year = isDate[2]
                    this.value(new Date(year, momonth, 31))
                    r.datePicker(".cell-year");
                    r.isEmptyRatioInputData(false)
                    r.usePlaceholderData(r.customerId(), kendo.toString(this.value(), "dd-MM-yyyy"))
                    r.data().ProvisionStatus[0].Date = ""
                    setTimeout(function(){
                        r.render()
                        r.isLoading(false)
                    },330);
                }
            }
        }

        if (r.isEmptyRatioInputData()) {
            configDate.change = function () {
                if(k == 0){
                    // console.log( this.value() )

                    var minYear = moment(this.value(), 'DD-MM-YYYY').year() + 2000 + 3;
                    var maxYear = moment(this.value(), 'DD-MM-YYYY').year() + 2000 + 7;

                    min = new Date(minYear, momonth, 31);
                    max = new Date(maxYear, momonth, 31);
                    // console.log(minYear,maxYear,min,max)
                    $($(".cell-year")[1]).html("")
                    $('<input />').appendTo($($(".cell-year")[1])).kendoDatePicker({
                        min: min,
                        max: max,
                        depth: "decade",
                        start: "decade",
                        format: "dd-MMM-yyyy",
                        change: function() {
                            r.isLoading(true)

                            //add auditstatus
                                var auditStatus = []
                                var maxYear2 = moment($('.cell-year:eq(0)').find('input').data('kendoDatePicker').value(), 'DD-MM-YYYY').year() + 2000;
                                var minYear2 = moment(r.getMasterYears().reverse()[0].Date, 'DD-MM-YYYY').year()
                                var typeDate = $('.cell-picker:eq('+(r.data().AuditStatus.length - 1)+')').find('select').data('kendoDropDownList').value()

                                var month2 = (typeDate == "FY Ending") ? "Mar" : "Dec";
                                for (var i = maxYear2; i >= minYear2; i--) {
                                    auditStatus.push({
                                        Date: '31-'+month2+'-' + i,
                                        Status: 'AUDITED',
                                        TypeDate: typeDate,
                                        Unit: r.unit(),
                                        Na: "A"
                                    })
                                }
                                auditStatus = auditStatus.slice(0, 4).reverse();

                                r.data().AuditStatus = auditStatus
                            //end add pertama

                            var getDate = kendo.toString(this.value(), "d");
                            var isDate = getDate.split("/")
                            var year = isDate[2]
                            this.value(new Date(year, momonth, 31))

                            var Year = moment(this.value(), 'DD-MM-YYYY').year();
                            Yearminus = Year - 1;
                            // console.log(r.data(), Year, Yearminus)
                            r.data().ProvisionStatus = []

                            r.data().ProvisionStatus.push({
                                Date: '31-'+month2+'-20'+Year,
                                Status: 'PROJECTED',
                                TypeDate: typeDate,
                                Unit:"Rs. Lacs",
                                Na: "A"
                            },{
                                Date: '31-'+month2+'-20'+Yearminus,
                                Status: 'ESTIMATED',
                                TypeDate: typeDate,
                                Unit: "Rs. Lacs",
                                Na: "A"
                            })

                            //maxyear2 = 2016
                            //Year = 2017

                            for(i = 2000 + (Year-2); i >= maxYear2+1; i--){
                                // var cccc = kendo.parseDate('31-'+(momonth+1)+'-'+i, "dd-MM-yyyy");
                                r.data().ProvisionStatus.push({
                                    Date: '31-'+month2+'-'+i,
                                    Status: 'PROVISION',
                                    TypeDate: typeDate,
                                    Unit: "Rs. Lacs",
                                    Na: "A"
                                })
                            }

                            r.data().ProvisionStatus.reverse();

                            setTimeout(function(){
                                r.render()
                                r.isLoading(false)
                            },330);
                        }
                    })
                    r.isEmptyRatioInputData(false)
                }
            }
        }

        $('<input />').appendTo($year).kendoDatePicker(configDate)

        if (!enabledyo){
            $('.cell-year:eq('+k+')').find('input').data('kendoDatePicker').enable(false)
        }

        let configna = {
            dataSource: {
                data: [{"Value": "A","Text": "Available"},{"Value": "NA","Text": "Not Available"}]
            },
            dataValueField: 'Value',
            dataTextField: 'Text',
            value: d.Na,
            enabled: !r.data().Frozen,
            change: function() {
                r.data(r.getData())

                if (r.data() != null){
                    if (r.data().AuditStatus.length > 0){
                        $.each(r.data().AuditStatus, function(i,v){
                            var xxx = v.Date.split("-")
                            var ccc = "Mar"
                            if(xxx[1] == "12"){
                                ccc = "Dec"
                            }
                            xxx[1] = ccc
                            r.data().AuditStatus[i].Date = xxx.join("-")
                        })
                    }
                    if (r.data().FormData.length > 0){
                        $.each(r.data().FormData, function(i,v){
                            var xxx = v.Date.split("-")
                            var ccc = "Mar"
                            if(xxx[1] == "12"){
                                ccc = "Dec"
                            }
                            xxx[1] = ccc
                            r.data().FormData[i].Date = xxx.join("-")
                        })
                    }
                    if (r.data().ProvisionStatus.length > 0){
                        $.each(r.data().ProvisionStatus, function(i,v){
                            var xxx = v.Date.split("-")
                            var ccc = "Mar"
                            if(xxx[1] == "12"){
                                ccc = "Dec"
                            }
                            xxx[1] = ccc
                            r.data().ProvisionStatus[i].Date = xxx.join("-")
                        })
                    }
                }

                r.isLoading(true);
                setTimeout(function(){
                    r.render();
                    r.isLoading(false);
                },330);
            }
        }

        var $NA = $('<td />').appendTo($tr6).addClass('cell-na').css("background-color",color)
        var $NAfixed = $('<td />').appendTo($tr6fixed).addClass('cell-na').css("background-color",color).css("width","152px").css("padding","2px")

        //  if(color == "#397d81"){
        //     $NA.css("border-color",color)
        //     $year.css("border-color",color)
        //     $pickDatePicker.css("border-color",color)
        //     $audit.css("border-color",color)
        // }
        $('<select />').appendTo($NA).kendoDropDownList(configna)
        $('<select />').appendTo($NAfixed).kendoDropDownList(configna)
    })

    r.data().ProvisionStatus.forEach(function (d,k) {

        enabledyo = false
        color = "#F0F3F4"
        if(k == r.data().ProvisionStatus.length-1 && !r.data().Frozen){
            enabledyo = true
            // color = "#397d81"
        }

        var $audit = $('<td />').appendTo($tr1).addClass('cell-audit2').css("background-color",color)

        $('<select />').appendTo($audit).kendoDropDownList({
            dataSource: {
                data: r.masterProvisionStatus()
            },
            dataValueField: 'Status',
            dataTextField: 'Text',
            value: d.Status,
            enabled: false,
        })

        var $auditmodif = $('<td />').appendTo($tr1setengah).addClass('cell-auditmodief')
        var $auditmodiffixed = $('<td />').appendTo($tr1setengahfixed).addClass('cell-auditmodief').css("width","152px").css("padding","2px")

        var date_edited = ""
        if(d.Date != ""){
            date_edited = kendo.toString( new Date(d.Date) , 'MMM-yyyy')
        }
        $("<span>"+toTitleCase(d.Status) + " " + date_edited +"</span>").appendTo($auditmodif).addClass("title-cell-audit")
        $("<span>"+toTitleCase(d.Status) + " " + date_edited +"</span>").appendTo($auditmodiffixed).addClass("title-cell-audit")

        var $pickDatePicker = $('<td />').appendTo($tr2).addClass('cell-picker').css("background-color",color)
        $('<select />').appendTo($pickDatePicker).kendoDropDownList({
            dataSource: {
                data: r.picker()
            },
            dataValueField: 'Value',
            dataTextField: 'Text',
            value: d.TypeDate,
            enabled: false
        })

        // set default 31 - Dec - xxxx
        var $year = $('<td />').appendTo($tr4).addClass('cell-year').css('background-color', '#f1f1f1').css("background-color",color)
        var momonth = (d.TypeDate == "Calendar Year") ? 11 : 2;

        min = new Date();
        max = new Date();

        var minYear = moment(r.data().AuditStatus[(r.data().AuditStatus.length - 1)].Date, 'DD-MM-YYYY').year() + 2000 + 3;
        var maxYear = moment(r.data().AuditStatus[(r.data().AuditStatus.length - 1)].Date, 'DD-MM-YYYY').year() + 2000 + 7;

        if(d.Status == "PROJECTED"){
            min = new Date(minYear, momonth, 31);
            max = new Date(maxYear, momonth, 31);
        }else if(d.Status == "ESTIMATED"){
            min = new Date(minYear-1, momonth, 31);
            max = new Date(maxYear-1, momonth, 31);
        }else{
            min = new Date(minYear-2, momonth, 31);
            max = new Date(maxYear-2, momonth, 31);
        }

        $('<input />').appendTo($year).kendoDatePicker({
            min: min,
            max: max,
            depth: "decade",
            start: "decade",
            value: kendo.parseDate(d.Date,"dd-MMM-yyyy"),
            format: "dd-MMM-yyyy",
            enable: enabledyo,
            change: function() {
                if(d.Status == "PROJECTED"){
                    r.isLoading(true)
                    var getDate = kendo.toString(this.value(), "d");
                    var isDate = getDate.split("/")
                    var year = isDate[2]
                    this.value(new Date(year, momonth, 31))

                    var Year = moment(this.value(), 'DD-MM-YYYY').year();
                    Yearminus = Year - 1;

                    var MinYear = moment($('.cell-year:eq('+(r.data().AuditStatus.length - 1)+')').find('input').data('kendoDatePicker').value(), 'DD-MM-YYYY').year() + 2000;
                    r.data().ProvisionStatus = []

                    var month = (d.TypeDate == "FY Ending") ? "Mar" : "Dec";

                    r.data().ProvisionStatus.push({
                        Date: '31-'+month+'-20'+Year,
                        Status: 'PROJECTED',
                        TypeDate: r.data().AuditStatus[0].TypeDate,
                        Unit:"Rs. Lacs",
                        Na: "A"
                    },{
                        Date: '31-'+month+'-20'+Yearminus,
                        Status: 'ESTIMATED',
                        TypeDate: r.data().AuditStatus[0].TypeDate,
                        Unit: "Rs. Lacs",
                        Na: "A"
                    })

                    for(i = 2000 + (Year-2); i >= MinYear+1; i--){
                        // var cccc = kendo.parseDate('31-'+(momonth+1)+'-'+i, "dd-MM-yyyy");
                        r.data().ProvisionStatus.push({
                            Date: '31-'+month+'-'+i,
                            Status: 'PROVISION',
                            TypeDate: r.data().AuditStatus[0].TypeDate,
                            Unit: "Rs. Lacs",
                            Na: "A"
                        })
                    }

                    r.data().ProvisionStatus.reverse();

                    setTimeout(function(){
                        r.render()
                        r.isLoading(false)
                    },330);
                }
            }
        })

        if (!enabledyo){
            $('.cell-year:eq('+( r.data().AuditStatus.length + k)+')').find('input').data('kendoDatePicker').enable(false)
        }

        let configna = {
            dataSource: {
                data: [{"Value": "A","Text": "Available"},{"Value": "NA","Text": "Not Available"}]
            },
            dataValueField: 'Value',
            dataTextField: 'Text',
            value: d.Na,
            enabled: !r.data().Frozen,
            change: function() {
                r.data(r.getData())
                if (r.data() != null){
                    if (r.data().AuditStatus.length > 0){
                        $.each(r.data().AuditStatus, function(i,v){
                            var xxx = v.Date.split("-")
                            var ccc = "Mar"
                            if(xxx[1] == "12"){
                                ccc = "Dec"
                            }
                            xxx[1] = ccc
                            r.data().AuditStatus[i].Date = xxx.join("-")
                        })
                    }
                    if (r.data().FormData.length > 0){
                        $.each(r.data().FormData, function(i,v){
                            var xxx = v.Date.split("-")
                            var ccc = "Mar"
                            if(xxx[1] == "12"){
                                ccc = "Dec"
                            }
                            xxx[1] = ccc
                            r.data().FormData[i].Date = xxx.join("-")
                        })
                    }
                    if (r.data().ProvisionStatus.length > 0){
                        $.each(r.data().ProvisionStatus, function(i,v){
                            var xxx = v.Date.split("-")
                            var ccc = "Mar"
                            if(xxx[1] == "12"){
                                ccc = "Dec"
                            }
                            xxx[1] = ccc
                            r.data().ProvisionStatus[i].Date = xxx.join("-")
                        })
                    }
                }
                r.isLoading(true);
                setTimeout(function(){
                    r.render();
                    r.isLoading(false);
                },330);
            }
        }
        var $NA = $('<td />').appendTo($tr6).addClass('cell-na').css("background-color",color)
        var $NAfixed = $('<td />').appendTo($tr6fixed).addClass('cell-na').css("background-color",color).css("width","152px").css("padding","2px")

        // if(color == "#397d81"){
        //     $NA.css("border-color",color)
        //     $year.css("border-color",color)
        //     $pickDatePicker.css("border-color",color)
        //     $audit.css("border-color",color)
        // }

        $('<select />').appendTo($NA).kendoDropDownList(configna)
        $('<select />').appendTo($NAfixed).kendoDropDownList(configna)
    });

    // ======= write row section
    var writeRowSection1 = _.groupBy(r.masterBalanceSheetInput(), 'Section')
    var writeRowSection2 = _.map(writeRowSection1, function (v, k) {
        return { Title: k, Order: _.maxBy(v, 'Order').Order, Data: v }
    })

    totalprocess = 0
    var d = new Date();
    var n = d.getTime();
    console.log("Date1 : ", d)
    _.orderBy(writeRowSection2, 'Order').forEach(function (section, idx) {
        if (section.Title != '') {
            var $trRowSection = $('<tr />')
                .appendTo($wrapper)
                .attr('data-section', section.Title)
                .addClass('row-section')
                .addClass("rowsection"+section.Order)

            var $trRowSectionleft = $('<tr />')
                .appendTo($wrapperleft)
                .attr('data-section', section.Title)
                .addClass('row-section')
                .addClass("rowsection"+section.Order)

            var $onleft = $('<td />').appendTo($trRowSectionleft).addClass("td"+section.Order).addClass("palingkiriori").css('background-color', '#313d50 !important').css('color', 'white !important').css("border-left-color","#397d81").css("border-right-color","#397d81")
            var $on = $('<td />').appendTo($trRowSection).addClass("td"+section.Order).addClass("palingkiri").css('background-color', '#313d50 !important').css('color', 'white !important').css("border-left-color","#397d81").css("border-right-color","#397d81")

            r.data().AuditStatus.forEach(function (au) {
                var $cell = $('<td />').appendTo($trRowSection)
                    .attr('data-id', au.Id)
                    .attr('id', au.Date)
                    .css('background-color', '#313d50 !important').css('color', 'white !important')
                    .css("height",'35px').css("border-left-color","#397d81").css("border-right-color","#397d81")
            })
            r.data().ProvisionStatus.forEach(function (au) {
                var $cell = $('<td />').appendTo($trRowSection)
                    .attr('data-id', au.Id)
                    .attr('id', au.Date)
                    .css('background-color', '#313d50 !important').css('color', 'white !important')
                    .css("height",'35px').css("border-left-color","#397d81").css("border-right-color","#397d81")
            })

            $("<i class='fa fa-caret-down' style='font-size: 12px;font-weight: normal;color: #fefefe; padding-left: 1%'></i> ").appendTo($onleft)
            .addClass("main"+section.Order)
            $("<span style='font-size: 12px;font-weight: bold;color: #fefefe'> "+section.Title+"</span>").appendTo($onleft)

            $("<i class='fa fa-caret-down' style='font-size: 12px;font-weight: normal;color: #fefefe; padding-left: 1%'></i> ").appendTo($on)
            .addClass("main"+section.Order)
            $("<span style='font-size: 12px;font-weight: bold;color: #fefefe'> "+section.Title+"</span>").appendTo($on)
        }

        // ======= write row sub section
        var writeRowSubSection1 = _.groupBy(section.Data, 'SubSection')
        var writeRowSubSection2 = _.map(writeRowSubSection1, function (v, k) {
            return { Title: k, Order: _.maxBy(v, 'Order').Order, Data: v }
        })
        _.orderBy(writeRowSubSection2, 'Order').forEach(function (subSection) {
            if (subSection.Title != '') {
                var $trRowSubSection = $('<tr />')
                    .appendTo($wrapper)
                    .attr('data-section', subSection.Title)
                    .addClass('row-sub-section')
                    .addClass("section"+section.Order)
                    .addClass("subsection"+subSection.Order)

                var $trRowSubSectionleft = $('<tr />')
                    .appendTo($wrapperleft)
                    .attr('data-section', subSection.Title)
                    .addClass('row-sub-section')
                    .addClass("section"+section.Order)
                    .addClass("subsection"+subSection.Order)

                var $tdleft = $('<td />').appendTo($trRowSubSectionleft)
                    // .attr('colspan', r.data().AuditStatus.length + 1)
                    .css('padding-left', '2%')
                    .addClass("td"+subSection.Order)
                    .css("height",'30px')
                    .addClass("palingkiriori").css("background-color","#c3dcec").css("border-left-color","#c3dcec").css("border-right-color","#c3dcec")

                var $td = $('<td />').appendTo($trRowSubSection)
                    // .attr('colspan', r.data().AuditStatus.length + 1)
                    .css('padding-left', '2%')
                    .addClass("td"+subSection.Order)
                    .css("height",'30px')
                    .addClass("palingkiri").css("background-color","#c3dcec").css("border-left-color","#c3dcec").css("border-right-color","#c3dcec")

                var $iconsubleft = $("<i class='fa fa-list' style='font-size: 12px;font-weight: normal;color: #397d81'></i> ")
                    .appendTo($tdleft)
                    .addClass("sub"+subSection.Order)
                $("<span style='font-size: 12px;font-weight: bold;color: #397d81'> "+subSection.Title+"</span>").appendTo($tdleft)

                var $iconsub = $("<i class='fa fa-list' style='font-size: 12px;font-weight: normal;color: #397d81'></i> ")
                    .appendTo($td)
                    .addClass("sub"+subSection.Order)
                $("<span style='font-size: 12px;font-weight: bold;color: #397d81'> "+subSection.Title+"</span>").appendTo($td)

                r.data().AuditStatus.forEach(function (au) {
                    var $cell = $('<td />').appendTo($trRowSubSection)
                    .css("height",'30px').css("background-color","#c3dcec").css("border-left-color","#c3dcec").css("border-right-color","#c3dcec")
                })
                r.data().ProvisionStatus.forEach(function (au) {
                    var $cell = $('<td />').appendTo($trRowSubSection)
                        .css("height",'30px').css("background-color","#c3dcec").css("border-left-color","#c3dcec").css("border-right-color","#c3dcec")
                })
           }

            // ======= write row field
            _.orderBy(subSection.Data, 'Order').forEach(function (field) {
                var $trField = $('<tr />')
                    .appendTo($wrapper)
                    .attr('data-field', field.Field)
                    .attr('data-field-id', field.Id)
                    .addClass('row-field')
                    .addClass("section"+section.Order)
                    .addClass("fieldsection"+subSection.Order)

                var $trFieldleft = $('<tr />')
                    .appendTo($wrapperleft)
                    .attr('data-field', field.Field)
                    .attr('data-field-id', field.Id)
                    .addClass('row-field')
                    .addClass("section"+section.Order)
                    .addClass("fieldsection"+subSection.Order)

                var aaa = (field.Field.length > 65) ? field.Field.substring(0,65) + "..." : field.Field;

                $('<td />').appendTo($trFieldleft)
                    .html("<span class='tooltipster' Title='"+field.Field+"'>"+ aaa +"</span>")
                    .css('padding-left', '3%')
                    .css("height",'30px')
                    .addClass("palingkiriori")

                $('<td />').appendTo($trField)
                    .html("<span class='tooltipster' Title='"+field.Field+"'>"+ aaa +"</span>")
                    .css('padding-left', '3%')
                    .css("height",'30px')
                    .addClass("palingkiri")

                r.data().AuditStatus.forEach(function (au) {
                    totalprocess++
                    var $cell = $('<td />').appendTo($trField)
                        .attr('data-id', au.Id)
                        .attr('id', au.Date)
                        .css("height",'30px')

                    var zz = 0;
                    var yy = "";
                    if(au.Na == "NA"){
                        zz = "";
                        yy = "NA";
                    }

                    var $input = $('<input />').val(zz)
                        .attr('data-field-id', field.Id)
                        .attr('data-date', au.Date)
                        .attr('status', "AUDITED")
                        .attr('type', "number")
                        .attr('min', 0)
                        .attr('placeholder', yy)
                        .attr('data-bind', 'event: {change:}')
                        .addClass('cell align-right')
                        .addClass('inputmasterform')
                        .css("width","100%")
                        .css("text-align","center")
                        .appendTo($cell)

                        if(au.Na.toLowerCase() == "na"){
                            $input.attr('disabled', 'disabled')
                        }

                    var fieldData = r.data().FormData.find(function (o) {
                        return (o.FieldId == "AUDITED-"+field.Id) && (o.Date == au.Date)
                    })

                    if (typeof fieldData !== 'undefined' && au.Na != "NA") {
                        $input.val(fieldData.Value)
                    }

                    // $input.kendoNumericTextBox({
                    //     decimals: 2,
                    //     spinners : false,
                    //     placeholder: "NA"
                    // });
                    // $('.k-numerictextbox').css('border-radius', '0');
                    // $('.k-numeric-wrap').css({'border-radius': '0', 'background-color':'white', 'background-image':'none'});
                    // $('.k-formatted-value').css('color','#636363');
                    if (r.data().Frozen) {
                        $input.prop('readonly', true)
                        $input.prop('disabled', true)
                        $input.parent().addClass('disabled')
                    }
                })

                r.data().ProvisionStatus.forEach(function (au) {
                    totalprocess++
                    var $cell = $('<td />').appendTo($trField)
                        .attr('data-id', au.Id)
                        .attr('id', au.Date)
                        .css("height",'30px')

                    var zz = 0;
                    var yy = "";
                    if(au.Na == "NA"){
                        zz = "";
                        yy = "NA";
                    }

                    var $input = $('<input />').val(zz)
                        .attr('data-field-id', field.Id)
                        .attr('data-date', au.Date)
                        .attr('status', au.Status)
                        .attr('type', "number")
                        .attr('min', 0)
                        .attr('placeholder', yy)
                        .addClass('cell align-right')
                        .addClass('inputmasterform')
                        .css("width","100%")
                        .css("text-align","center")
                        .appendTo($cell)

                    if(au.Na.toLowerCase() == "na"){
                        $input.attr('disabled', 'disabled')
                    }

                    var fieldData = r.data().FormData.find(function (o) {
                        return (o.FieldId == au.Status+"-"+field.Id) && (o.Date == au.Date)
                    })

                    if (typeof fieldData !== 'undefined' && au.Na != "NA") {
                        $input.val(fieldData.Value)
                    }

                    // $input.kendoNumericTextBox({
                    //     decimals: 2,
                    //     spinners : false,
                    //     placeholder: "NA"
                    // });
                    // $('.k-numerictextbox').css('border-radius', '0');
                    // $('.k-numeric-wrap').css({'border-radius': '0', 'background-color':'white', 'background-image':'none'});
                    // $('.k-formatted-value').css('color','#636363');
                    if (r.data().Frozen) {
                        $input.prop('readonly', true)
                        $input.prop('disabled', true)
                        $input.parent().addClass('disabled')
                    }
                })

            })
        })

        $(".rowsection"+section.Order).click(function(){
            if($(".section"+section.Order).is(':visible')){
                $(".section"+section.Order).hide()
                if($('.main'+section.Order).hasClass('fa-caret-down')){
                    $('.main'+section.Order).removeClass('fa-caret-down');
                    $('.main'+section.Order).addClass('fa-caret-right');
                 }else{
                    $('.sub'+section.Order).removeClass('fa-caret-right');
                    $('.sub'+section.Order).addClass('fa-caret-down');
                }
            }else{
                $(".section"+section.Order).show()
                if($('.main'+section.Order).hasClass('fa-caret-right')){
                    $('.main'+section.Order).removeClass('fa-caret-right');
                    $('.main'+section.Order).addClass('fa-caret-down');
                }else{
                    $('.sub'+section.Order).removeClass('fa-caret-down');
                    $('.sub'+section.Order).addClass('fa-caret-right');
                }
            }
            if($(".section"+section.Order).css(':display') == "none"){
                $(".section"+section.Order).show()
                $(".section"+section.Order).each(function() {
                    if ($(this).is(':visible')){
                        $(this).hide()
                    }
                })
            }
            r.panel_scrollrelocated();
        })
    })
    var d = new Date();
    var n2 = d.getTime();
    console.log("Date2 : ", d)
    console.log("Long Process / many process", "( ", (n2-n)/1000 , " / ", totalprocess, " )")

    if (r.isEmptyRatioInputData()) {
        $('.cell-date .k-dropdown-wrap .k-input').html('31-03-XXXX')
        $('.cell-date .k-dropdown-wrap').attr('title', 'Last Audited Balance Sheet Available For').addClass('tooltipster')
        app.prepareTooltipster($('.cell-date .k-dropdown-wrap'))
    }else{
        $('.cell-date .k-dropdown-wrap').attr('title', 'Last Audited Balance Sheet Available For').addClass('tooltipster')
        app.prepareTooltipster($('.cell-date .k-dropdown-wrap'))
        $(r.datePicker()).show();
    }

    if (r.data().Confirmed) {
        $('.form-last-confirmation-info').html('Last confirmed on: ' + kendo.toString(new Date(r.data().LastConfirm),"dd-MM-yyyy h:mm:ss tt") )
    }

    // $(".row-field").hide();
    // $(".row-sub-section").hide();
    // $(".row-section").children().find("i").removeClass('fa-caret-down');
    // $(".row-section").children().find("i").addClass('fa-caret-right');
    $(".cell-audit").find(".k-select").hide()
    $(".cell-audit").find(".k-select").parent().css({'padding' : '0'})
    $(".cell-audit2").find(".k-select").hide()
    $(".cell-audit2").find(".k-select").parent().css({'padding' : '0'})
    $('.cell-year').show();
    $('.palingkiri').hide();

    setTimeout(function(){
        if(r.data().AuditStatus.length == 4 && r.data().ProvisionStatus.length > 1){
            $('.content-grid-bottom').parent().animate({scrollLeft:306}, '300', 'swing', function() {
            });
            // console.log("ada 4");
        } else if(r.data().AuditStatus.length == 3 && r.data().ProvisionStatus.length > 1){
              $('.content-grid-bottom').parent().animate({scrollLeft:154}, '300', 'swing', function() {
            });
            // console.log("ada 3");
        } else if(r.data().AuditStatus.length == 2 && r.data().ProvisionStatus.length > 1){
             $('.content-grid-bottom').parent().animate({scrollLeft:0}, '300', 'swing', function() {
            });
            // console.log("ada 2");
        } else{
            // console.log("tidak ada");
        }
     $(".form-container").show();
    },1500);

    $('.cell').click(function(){
       var val = $(this).val()
       if(val == 0) {
        $(this).val("")
       }
    })

    $('.cell').blur(function(){
       var val = $(this).val()
       if(val == "") {
        $(this).val(0)
       }
    })
};
r.confirm = function () {
    if (r.getCustomerId() === false) {
        return
    }

    // swal({
    //     title: "Are you sure?",
    //     type: "info",
    //     showCancelButton: true,
    //     confirmButtonText: "Yes, confirm it!",
    //     closeOnConfirm: false
    // }, function () {
    var param = {};
    param.CustomerID = r.customerId()

    if(r.confirmLabel() == "Confirm"){
        param.Confirmed = true
        param.Frozen = true
    } else {
        param.Confirmed = false
        param.Frozen = false
    }
        r.isLoading(true)

        app.ajaxPost("/ratio/confirm", param, function (res) {
            if (res.Message != '') {
                r.clear()
                sweetAlert("Oops...", res.Message, "error");
                r.isLoading(false)
                return;
            } else {
                if(r.confirmLabel() == "Re-Enter"){
                    swal("Please Edit / Enter Data", "", "success");
                }else{
                    swal("Successfully Confirmed", "", "success");
                }
            }

            // r.setData(res.Data)
            // r.isConfirmed(r.data().Confirmed)

            r.refresh()
            r.isLoading(false)
            // r.render()
        }, function () {
            r.isLoading(false)
        });
    // });
}

r.freeze = function (isFrozen) {
    return function () {
        if (r.getCustomerId() === false) {
            return
        }

        if(!r.isConfirmed() && isFrozen) {
            sweetAlert("Oops...", "Please Confirm First", "error");
            return
        }

        swal({
            title: "Are you sure?",
            type: "info",
            showCancelButton: true,
            confirmButtonText: (isFrozen ? "Yes, freeze it" : 'Unfreeze it'),
            // closeOnConfirm: false
        }).then(function () {
            r.isLoading(true)

            var param = {};
            param.CustomerID = r.customerId()
            param.IsFrozen = isFrozen
            console.log(param)
            app.ajaxPost("/ratio/freeze", param, function (res) {
                if (res.Message != '') {
                    r.clear()
                    sweetAlert("Oops...", res.Message, "error");
                    r.isLoading(false)
                    return;
                } else {
                    if(isFrozen == true){
                        swal("Successfully Freezed", "", "success");
                    }else{
                        swal("Successfully Unfreezed", "", "success");
                    }

                }

                if (res.Data != null){
                    if (res.Data.AuditStatus.length > 0){
                        $.each(res.Data.AuditStatus, function(i,v){
                            var xxx = v.Date.split("-")
                            var ccc = "Mar"
                            if(xxx[1] == "12"){
                                ccc = "Dec"
                            }
                            xxx[1] = ccc
                            res.Data.AuditStatus[i].Date = xxx.join("-")
                        })
                    }
                    if (res.Data.FormData.length > 0){
                        $.each(res.Data.FormData, function(i,v){
                            var xxx = v.Date.split("-")
                            var ccc = "Mar"
                            if(xxx[1] == "12"){
                                ccc = "Dec"
                            }
                            xxx[1] = ccc
                            res.Data.FormData[i].Date = xxx.join("-")
                        })
                    }
                    if (res.Data.ProvisionStatus.length > 0){
                        $.each(res.Data.ProvisionStatus, function(i,v){
                            var xxx = v.Date.split("-")
                            var ccc = "Mar"
                            if(xxx[1] == "12"){
                                ccc = "Dec"
                            }
                            xxx[1] = ccc
                            res.Data.ProvisionStatus[i].Date = xxx.join("-")
                        })
                    }
                }

                r.setData(res.Data)
                r.isFrozen(r.data().Frozen)
                r.IsFrozen(r.data().IsFrozen)
                r.isLoading(false)
                r.render()

                r.endisKendoDropDown(r.isFrozen())

            }, function () {
                r.isLoading(false)
            });
        });
    }
}

r.endisKendoDropDown = function(what){
    $(".container-select").each(function(i,e){
      var $ddl = $(e).find("select").getKendoDropDownList();
      console.log($ddl)
      if($ddl == undefined)
        var $ddl = $(e).find("input").getKendoDropDownList();

      $('#selectDateAudited').find("input").data('kendoDatePicker').enable(!what);
      $('#selectDateProjected').find("input").data('kendoDatePicker').enable(!what);

      var $txt = $(e).find("input").eq(1).getKendoNumericTextBox();

      if($ddl != undefined)
      {
        $ddl.enable(!what);
      }else if ($txt != undefined){
        $txt.enable(!what);
      }

    });
}

r.exportExcel = function(target, title){
    $(".row-field").show();
    $(".row-sub-section").show();
    $('.palingkiri').show();
    $('.palingkiriori').hide();
    target = toolkit.$(target);
    console.log(target)
    $('#fake-table').remove();

    var body = $('body');
    var fakeTable = $('<table />').attr('id', 'fake-table').appendTo(body);
    if (target.attr('name') != 'table') {
        target = target.find('table:eq(0)');
    }

    target.clone(true).appendTo(fakeTable);

    $("#fake-table .k-select").each(function () {
        $(this).remove();
    });

    $("#fake-table .fa").each(function () {
        $(this).remove();
    });

    $("#fake-table select[data-role='dropdownlist']").each(function (i, e) {
        var value = $(e).data('kendoDropDownList').value()
        if (value == "A"){
            value = "Available"
        } else if(value == "NA"){
            value = "Not Available"
        }
        $(e).closest('td').html(value).css("color", "black");
    })

    $("#fake-table input[data-role='datepicker']").each(function (i, e) {
        var value = kendo.toString($(e).data('kendoDatePicker').value(),'dd-MMM-yyyy')
        $(e).closest('td').html(value)
    })

    $("#fake-table .inputmasterform").each(function (i, e) {
        var value = $(e).val();
        $(e).closest('td').html(value)
    })

    $("#fake-table #name1").show()
    $("#fake-table #td61").show()
    var ondate = kendo.toString(new Date(),"dd-MM-yyyy HH mm");
    var ind = title.indexOf("-") + 2;
    title = title.slice(ind);
    var name = title+" "+ ondate.toString();
    var downloader = $('<a />').attr('href', '#')
        .attr('download', name + '.xls')
        .attr('onclick', 'return ExcellentExport.excel(this, \'fake-table\', \'sheet1\')')
        .html('export')
        .appendTo(body);

    fakeTable.find('td').css('height', 'inherit');
    downloader[0].click();

    setTimeout(function () {
        fakeTable.remove();
        downloader.remove();
        // // $(".row-field").hide();
        // // $(".row-sub-section").hide();
        $('.palingkiri').hide();
        $('.palingkiriori').show();
    }, 400);
}
window.refreshFilter = function () {
    r.initEvents();
    r.refresh()
}

r.scroll = function(){
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


$(function () {
    r.scroll()
    $('.box-footer').hide();
    $('#refresh').removeClass('btn-default').addClass('btn-primary');
    $('#refresh').html('Select')

    r.prepareSelectOption();
});

r.prepareSelectOption = function(){
    // console.log( r.TypeDate() )
    $('<select />').appendTo( $("#selectTypeDate") ).kendoDropDownList({
        dataSource: {
            data: r.picker()
        },
        dataValueField: 'Value',
        dataTextField: 'Text',
        change: function (){
            console.log("sarif")
            r.TypeDate( this.value() )
            $("#selectDateAudited").html('');
            r.prepareselectDateAudited();
            $("#selectDateProjected").html('');
        }
    })

    r.prepareselectDateAudited();

}

r.prepareselectDateAudited = function(){
    var momonth = ( r.TypeDate() == "Calendar Year" ) ? 11 : 2;
    var momonth2 = ( r.TypeDate() == "Calendar Year" ) ? "Dec" : "Mar";

    var $div1 = $('<div />').appendTo( $("#selectDateAudited") ).css("float","left").css("margin-right","10px").css("margin-top","7px")

    $('<span style="font-size: 12px;font-weight: bold;">Audited Date: </span>').appendTo( $div1 )

    var $div2 = $('<div />').appendTo( $("#selectDateAudited") ).css("float","left")

    $('<input />').css("width","120px").appendTo( $div2 ).kendoDatePicker({
        min: new Date(2009, momonth, 31),
        max: new Date(2016, momonth, 31),
        depth: "decade",
        start: "decade",
        format: "dd-MMM-yyyy",
        change: function(){
            r.AuditedDate( "31-"+momonth2+"-"+kendo.toString(this.value(), "yyyy") )
            this.value( "31-"+momonth2+"-"+kendo.toString(this.value(), "yyyy") )

            $("#selectDateProjected").html('');
            r.prepareselectDateProjected();
        }
    })
}

r.prepareselectDateProjected = function(){
    var momonth = ( r.TypeDate() == "Calendar Year" ) ? 11 : 2;
    var momonth2 = ( r.TypeDate() == "Calendar Year" ) ? "Dec" : "Mar";
    console.log(r.TypeDate(), new Date(2009, momonth, 31))
    console.log(r.TypeDate(), new Date(2016, momonth, 31))

    var minYear = moment( r.AuditedDate() , 'DD-MM-YYYY').year() + 2000 + 3;
    var maxYear = moment( r.AuditedDate() , 'DD-MM-YYYY').year() + 2000 + 7;

    var $div1 = $('<div />').appendTo( $("#selectDateProjected") ).css("float","left").css("margin-right","10px").css("margin-top","7px")

    $('<span style="font-size: 12px;font-weight: bold;">Projected Date: </span>').appendTo( $div1 )

    var $div2 = $('<div />').appendTo( $("#selectDateProjected") ).css("float","left")

    $('<input />').css("width","120px").appendTo( $div2 ).kendoDatePicker({
        min: new Date(minYear, momonth, 31),
        max: new Date(maxYear, momonth, 31),
        depth: "decade",
        start: "decade",
        format: "dd-MMM-yyyy",
        change: function(){
            r.ProjectedDate( "31-"+momonth2+"-"+kendo.toString(this.value(), "yyyy") )
            this.value( "31-"+momonth2+"-"+kendo.toString(this.value(), "yyyy") )

            r.isLoading(true)

            //add auditstatus
                var auditStatus = []
                var maxYear2 = moment( r.AuditedDate() , 'DD-MM-YYYY').year() + 2000;
                var minYear2 = moment(r.getMasterYears().reverse()[0].Date, 'DD-MM-YYYY').year()

                for (var i = maxYear2; i >= minYear2; i--) {
                    auditStatus.push({
                        Date: '31-'+momonth2+'-' + i,
                        Status: 'AUDITED',
                        TypeDate: r.TypeDate(),
                        Unit: r.unit(),
                        Na: "A"
                    })
                }
                auditStatus = auditStatus.slice(0, 4).reverse();

                r.data().AuditStatus = auditStatus
            //end add auditstatus

            //add ProvisionStatus
                var Year = moment( this.value() , 'DD-MM-YYYY').year();
                Yearminus = Year - 1;
                r.data().ProvisionStatus = []

                r.data().ProvisionStatus.push({
                    Date: '31-'+momonth2+'-20'+Year,
                    Status: 'PROJECTED',
                    TypeDate: r.TypeDate(),
                    Unit:"Rs. Lacs",
                    Na: "A"
                },{
                    Date: '31-'+momonth2+'-20'+Yearminus,
                    Status: 'ESTIMATED',
                    TypeDate: r.TypeDate(),
                    Unit: "Rs. Lacs",
                    Na: "A"
                })

                for(i = 2000 + (Year-2); i >= maxYear2+1; i--){
                    r.data().ProvisionStatus.push({
                        Date: '31-'+momonth2+'-'+i,
                        Status: 'PROVISION',
                        TypeDate: r.TypeDate(),
                        Unit: "Rs. Lacs",
                        Na: "A"
                    })
                }

                r.data().ProvisionStatus.reverse();
            //end add ProvisionStatus

            setTimeout(function(){
                r.render()
                r.isLoading(false)
            },330);

        }
    })
}

$(window).scroll(function(){
   r.panel_scrollrelocated();
});

r.addScrollBottom = function (container) {
    $('.scroll-grid-bottom-yo').remove();
    $('.scroll-grid-bottom').remove();

    if (container == undefined) container = $(".form-container");

    toolkit.newEl('div').addClass('scroll-grid-bottom-yo').appendTo(container.find(".divright"));

    var tableContent = toolkit.newEl('div').addClass('scroll-grid-bottom').appendTo(container.find(".divright"));

    var arrowLeft = toolkit.newEl('div').addClass('scroll-grid-bottom arrow arrow-left viewscrollfix btn-add').html('<i class="fa fa-arrow-left"></i>').appendTo(container.find(".divright")).css("margin-left","-25px");

    var rightmen = ($(window).width() - 400 - 608 - 35 ) + "px"
    var arrowRight = toolkit.newEl('div').addClass('scroll-grid-bottom arrow arrow-right viewscrollfix btn-add').html('<i class="fa fa-arrow-right"></i>').appendTo(container.find(".divright")).css("right",rightmen);

    toolkit.newEl('div').addClass('content-grid-bottom')
    .html("&nbsp;").appendTo(tableContent);

    var target = container.find(".scroll-grid-bottom")[0];
    var target2 = container.find(".divright")[0];
    var toptarget = $("#divrightfixed");
    container.find(".divright").scroll(function () {
        target.scrollLeft = this.scrollLeft;
        toptarget.scrollLeft(this.scrollLeft);

    });
    container.find(".scroll-grid-bottom").scroll(function () {
        target2.scrollLeft = this.scrollLeft;
        toptarget.scrollLeft(this.scrollLeft);
    });

    $("#divrightfixed").scroll(function () {
        target2.scrollLeft = this.scrollLeft;
        target.scrollLeft = this.scrollLeft;
    });


    var walkLength = 50;

    arrowLeft.on('click', function () {
        var newVal = target.scrollLeft - walkLength;
        if (newVal < 0) {
            newVal = 0;
        }

        target.scrollLeft = newVal;
    });
    arrowRight.on('click', function () {
        var newVal = target.scrollLeft + walkLength;
        if (newVal < 0) {
            newVal = 0;
        }

        target.scrollLeft = newVal;
    });

    r.panel_scrollrelocated();
};

r.panel_scrollrelocated = function () {
    $(".scroll-grid-bottom").each(function (i) {
        $(this).find('.content-grid-bottom').css("min-width", $(this).parent().find('table').width());
        if ($(this).parent().find('.scroll-grid-bottom-yo').size() == 0) {
            return;
        }
        var window_top = $(window).scrollTop() + $(window).innerHeight();
        var div_top = $(this).parent().find('.scroll-grid-bottom-yo').offset().top;
        if (parseInt(div_top, 10) < parseInt(window_top, 10)) {
            $(this).removeClass('viewscrollfix');
            $(this).hide();
            $(this).css("width", "100%");
        } else {
            $(this).show();
            $(this).css("width", $('.divright').width());
            console.log(this);
            if (!$(this).hasClass('viewscrollfix')) $(this)[0].scrollLeft = $(this).parent().scrollLeft();
            $(this).addClass('viewscrollfix');
        }
    });
};

window.onscroll = function(){

 if ($(window).scrollTop() >= 300){
   var tbl = $('#divrightfixed table');

   if(tbl.length>1){
    $('#divrightfixed table:eq(0)').remove();
   }

   $('#fixedheader').show();
   $("#divrightfixed").scrollLeft($(".divright").scrollLeft());
 } else{
  $('#fixedheader').hide()
 }

}