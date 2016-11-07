var url = '/standard'
var backup = {}
var isEdit = ko.observable(false)

var generateDropdownEditor = function(container,options){
    var key = options.field
    var callback = function () {
        var data = backup[key]
        if(data[0].name != "All"){
            data.unshift({name:"All"})
        }
        $('<input required name="' + key + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                dataSource: data,
                dataTextField: "name",
                dataValueField: "name",
                optionLabel: 'Select one',
                change: function () {
                    var uid = $(container)
                        .closest('[data-uid]')
                        .attr('data-uid')
                    var row = $(container)
                        .closest('.k-grid')
                        .data('kendoGrid')
                        .dataSource.getByUid(uid)

                    row.set(key, this.value())
                }
            });
    }

    if (backup.hasOwnProperty(key)) {
        callback()
    } else {
        ajaxPost(url+"/getdropdownmaster", {}, function (res) {
            var found = res.data[0].Data.find(function (d) {
                return d.Field == key
            })
            if (found != undefined) {
                backup[key] = found.Items
            } else {
                backup[key] = []
            }

            callback()
        })
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

var renderDelayDaysGrid = function(res){
    $('#avgdelaydaysgrid').html("")
    $('#avgdelaydaysgrid').kendoGrid({
        dataSource : {
            transport:{
                read: function(options){
                    options.success(res)
                },
            },
            schema: {
                model:{
                    id: "Products",
                    fields: {
                        Products: {type:'string',editable:true},
                        Scheme: {type:'string',editable:true},
                        RatingMastersCustomerSegment: {type:'string',editable:true},
                        Value: {type:'number',editable:true}
                    }
                }
            }
        },
        scrollable : true,     
        editable: 'inline',
        height:235,
        toolbar: kendo.template($("#delaydaystoolbartemplate").html()),
        columns : [
            {
                title : 'Standard Deviation- Average Delay Days',
                headerAttributes: { class: "header-bgcolor" },
                columns :[
                    {
                        title : 'Product',
                        field : 'Products',
                        headerAttributes: { "class": "sub-bgcolor" },
                        width: 200,
                        editor : generateDropdownEditor
                    },
                    {
                        title : 'Scheme',
                        field : 'Scheme',
                        headerAttributes: { "class": "sub-bgcolor" },
                        width: 200,
                        editor : generateDropdownEditor
                    },
                    {
                        title : 'Business Segment',
                        field : 'RatingMastersCustomerSegment',
                        headerAttributes: { "class": "sub-bgcolor" },
                        width: 200,
                        editor : generateDropdownEditor
                    },
                    {
                        title : 'Value',
                        field : 'Value',
                        headerAttributes: { "class": "sub-bgcolor" },
                        width: 200,
                        editor: disableSpinner
                    },
                    { 
                        title: "&nbsp;", 
                        headerAttributes: { "class": "sub-bgcolor" },
                        width: 100,
                        template:kendo.template($("#customcommand1").html())
                    }
                ]
            }
        ],
    });
}

var renderPaymentDelayGrid = function(res){
    $('#avgpaymentdelaygrid').html("")
        $('#avgpaymentdelaygrid').kendoGrid({
            dataSource : {
                transport:{
                    read: function(options){
                        options.success(res)
                    },
                },
                schema: {
                    model:{
                        id: "Products",
                        fields: {
                            Products: {type:'string',editable:true},
                            Scheme: {type:'string',editable:true},
                            RatingMastersCustomerSegment: {type:'string',editable:true},
                            Value: {type:'number',editable:true}
                        }
                    }
                }
            },
            scrollable : true,     
            editable: 'inline',
            height:235,
            toolbar: kendo.template($("#paymentdelaytoolbartemplate").html()),
            columns : [
                {
                    title : 'Standard Deviation - Average Transaction Weighted Payment Delay Days',
                    headerAttributes: { class: "header-bgcolor" },
                    columns :[
                        {
                            title : 'Product',
                            field : 'Products',
                            headerAttributes: { "class": "sub-bgcolor" },
                            width: 200,
                            editor : generateDropdownEditor
                        },
                        {
                            title : 'Scheme',
                            field : 'Scheme',
                            headerAttributes: { "class": "sub-bgcolor" },
                            width: 200,
                            editor : generateDropdownEditor
                        },
                        {
                            title : 'Business Segment',
                            field : 'RatingMastersCustomerSegment',
                            headerAttributes: { "class": "sub-bgcolor" },
                            width: 200,
                            editor : generateDropdownEditor
                        },
                        {
                            title : 'Value',
                            field : 'Value',
                            headerAttributes: { "class": "sub-bgcolor" },
                            width: 200,
                            editor: disableSpinner
                        },
                        { 
                            title: "&nbsp;", 
                            headerAttributes: { "class": "sub-bgcolor" },
                            width: 100,
                            template:kendo.template($("#customcommand2").html())
                        }
                    ]
                }
            ]
    });
}

var renderPaymentDayGrid = function(res){
    $('#avgpaymentdaysgrid').html("")
        $('#avgpaymentdaysgrid').kendoGrid({
            dataSource : {
                transport:{
                    read: function(options){
                        options.success(res)
                    },
                },
                schema: {
                    model:{
                        id: "Products",
                        fields: {
                            Products: {type:'string',editable:true},
                            Scheme: {type:'string',editable:true},
                            RatingMastersCustomerSegment: {type:'string',editable:true},
                            Value: {type:'number',editable:true}
                        }
                    }
                },
            },
            scrollable : true,     
            editable: 'inline',
            height:235,
            toolbar: kendo.template($("#paymentdaytoolbartemplate").html()),
            pageSize:5,
            columns : [
                {
                    title : 'Standard Deviation - Average Transaction Weighted Payment Days',
                    headerAttributes: { class: "header-bgcolor" },
                    columns :[
                        {
                            title : 'Product',
                            field : 'Products',
                            headerAttributes: { "class": "sub-bgcolor" },
                            width: 200,
                            editor : generateDropdownEditor
                        },
                        {
                            title : 'Scheme',
                            field : 'Scheme',
                            headerAttributes: { "class": "sub-bgcolor" },
                            width: 200,
                            editor : generateDropdownEditor
                        },
                        {
                            title : 'Business Segment',
                            field : 'RatingMastersCustomerSegment',
                            headerAttributes: { "class": "sub-bgcolor" },
                            width: 200,
                            editor : generateDropdownEditor
                        },
                        {
                            title : 'Value',
                            field : 'Value',
                            headerAttributes: { "class": "sub-bgcolor" },
                            width: 200,
                            editor: disableSpinner
                        },
                        { 
                            title: "&nbsp;", 
                            headerAttributes: { "class": "sub-bgcolor" },
                            width: 100,
                            template:kendo.template($("#customcommand3").html())
                        }
                    ]
                }
            ]
    });
}

var renderStandardMasterGrid = function(){
    isEdit(false)
    ajaxPost(url+'/getalldata',{},function(res){
        renderDelayDaysGrid(res.data.AvgDelayDays)
        renderPaymentDelayGrid(res.data.AvgPaymentDelay)
        renderPaymentDayGrid(res.data.AvgPaymentDay)
        if (res.data.AvgDelayDays.length == 0){
            $('#avgdelaydaysgrid').getKendoGrid().addRow()
        }
        if (res.data.AvgPaymentDelay.length == 0){
            $('#avgpaymentdelaygrid').getKendoGrid().addRow()
        }
        if (res.data.AvgPaymentDay.length == 0){
            $('#avgpaymentdaysgrid').getKendoGrid().addRow()
        }
        var btn = $(".k-grid-edit-row").find("td:eq(4) button")
        btn.hide()
    })
}

var addData = function(idx){
    if(idx == 1){
        var data = $("#avgdelaydaysgrid").getKendoGrid().addRow()
        var btn = $(".k-grid-edit-row").find("td:eq(4) button")
        btn.hide()
    }

    if(idx == 2){
        var data = $("#avgpaymentdelaygrid").getKendoGrid().addRow()
        var btn = $(".k-grid-edit-row").find("td:eq(4) button")
        btn.hide()
    }

    if(idx == 3){
        var data = $("#avgpaymentdaysgrid").getKendoGrid().addRow()
        var btn = $(".k-grid-edit-row").find("td:eq(4) button")
        btn.hide()
    }
}

var editDataMaster = function(e,idx){
    var tr = $(e).closest("tr")
    if(idx == 1){
        var data = $("#avgdelaydaysgrid").getKendoGrid().editRow(tr)
        var btn = $(".k-grid-edit-row").find("td:eq(4) button")
        btn.hide()
        isEdit(true)
    }

    if(idx == 2){
        var data = $("#avgpaymentdelaygrid").getKendoGrid().editRow(tr)
        var btn = $(".k-grid-edit-row").find("td:eq(4) button")
        btn.hide()
    }

    if(idx == 3){
        var data = $("#avgpaymentdaysgrid").getKendoGrid().editRow(tr)
        var btn = $(".k-grid-edit-row").find("td:eq(4) button")
        btn.hide()
    }
    
}

var cancelChanges = function(idx){
    if(idx == 1){
        var data = $("#avgdelaydaysgrid").getKendoGrid().cancelChanges()
    }

    if(idx == 2){
        var data = $("#avgpaymentdelaygrid").getKendoGrid().cancelChanges()
    }

    if(idx == 3){
        var data = $("#avgpaymentdaysgrid").getKendoGrid().cancelChanges()
    }
}

var refreshGrid = function(idx){
    if(idx == 1){
        var data = $("#avgdelaydaysgrid").getKendoGrid().refresh()
    }

    if(idx == 2){
        var data = $("#avgpaymentdelaygrid").getKendoGrid().refresh()
    }

    if(idx == 3){
        var data = $("#avgpaymentdaysgrid").getKendoGrid().refresh()
    }
}

var deleteDataMaster = function(e,idx){
    var tr = $(e).closest("tr")
    if(idx == 1){
        var data = $("#avgdelaydaysgrid").getKendoGrid().dataItem(tr)
    }

    if(idx == 2){
        var data = $("#avgpaymentdelaygrid").getKendoGrid().dataItem(tr)
    }

    if(idx == 3){
        var data = $("#avgpaymentdaysgrid").getKendoGrid().dataItem(tr)
    }
    param = {
        Id:data.Id,
        Products:data.Products,
        RatingMastersCustomerSegment:data.RatingMastersCustomerSegment,
        Scheme:data.Scheme,
        Value:data.Value,
        Type:data.Type
    }

    swal({
            title: "Are you sure?",
            text: "You will not be able to recover this data!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
        }).then(function() {
            ajaxPost(url+"/deletestandardmaster",param,function(res){
                if(res.success){
                    renderStandardMasterGrid()
                    swal("Deleted!", "Your data has been deleted.", "success");
                }
                })
            
        }
    );
}

var saveMasterStandard = function(idx){
    if(idx == 1){
        var data = $("#avgdelaydaysgrid").getKendoGrid().dataSource.data()
    }

    if(idx == 2){
        var data = $("#avgpaymentdelaygrid").getKendoGrid().dataSource.data()
    }

    if(idx == 3){
        var data = $("#avgpaymentdaysgrid").getKendoGrid().dataSource.data()
    }
    var dirty = $.grep(data, function(item) {
        return item.dirty
    });
    if (!isEdit()){
        var data = {}
        var datas = []
        if(dirty.length != 0){
            for (var i = 0; i < dirty.length; i++){
                data.Products = dirty[i].Products
                data.RatingMastersCustomerSegment = dirty[i].RatingMastersCustomerSegment
                data.Scheme = dirty[i].Scheme
                data.Value = dirty[i].Value
                if(idx == 1){
                    data.Type = 'Average Delay Days'
                }

                if(idx == 2){
                    data.Type = 'Average Payment Delay Days'
                }

                if(idx == 3){
                    data.Type = 'Average Payment Days'
                }
                datas.push(data)
            }
        }
        
        var param = {
            StandardMasters:datas
        }
        ajaxPost(url+"/savestandardmaster",param,function(res){
            if(res.success){
                swal("Success","Data Save","success")
                renderStandardMasterGrid()
            }else{
                swal(
                res.message,
                'Pick Another Data Combination!',
                'error'
                )
            }
        })
    }else{
        updateMasterStandard(idx)
    }
    
    
}

var updateMasterStandard = function(idx){
    
    if(idx == 1){
        var data = $("#avgdelaydaysgrid").getKendoGrid().dataItem($("#avgdelaydaysgrid tr:eq(0)"))
        param = {
            Id:data.Id,
            Products:data.Products,
            RatingMastersCustomerSegment:data.RatingMastersCustomerSegment,
            Scheme:data.Scheme,
            Value:data.Value,
            Type:data.Type
        }

        ajaxPost(url+"/updatestandardmaster",param,function(res){
           if(res.success){
                swal("Success","Data Save","success")
                renderStandardMasterGrid()
            }else{
                swal(
                res.message,
                'Pick Another Data Combination!',
                'error'
                )
            }
        })
    }

    if(idx == 2){
        var data = $("#avgpaymentdelaygrid").getKendoGrid().dataItem($("#avgpaymentdelaygrid tr:eq(0)"))
        param = {
            Id:data.Id,
            Products:data.Products,
            RatingMastersCustomerSegment:data.RatingMastersCustomerSegment,
            Scheme:data.Scheme,
            Value:data.Value,
            Type:data.Type
        }

        ajaxPost(url+"/updatestandardmaster",param,function(res){
            if(res.success){
                swal("Success","Data Updated","success")
                renderStandardMasterGrid()
            }
        })
    }

    if(idx == 3){
        var data = $("#avgpaymentdaysgrid").getKendoGrid().editRow(tr)
        var data = $("#avgpaymentdaysgrid").getKendoGrid().dataItem($("#avgpaymentdaysgrid tr:eq(0)"))
        param = {
            Id:data.Id,
            Products:data.Products,
            RatingMastersCustomerSegment:data.RatingMastersCustomerSegment,
            Scheme:data.Scheme,
            Value:data.Value,
            Type:data.Type
        }

        ajaxPost(url+"/updatestandardmaster",param,function(res){
            if(res.success){
                swal("Success","Data Updated","success")
                renderStandardMasterGrid()
            }
        })
    }
}

$('document').ready(function(){
    renderStandardMasterGrid()
})