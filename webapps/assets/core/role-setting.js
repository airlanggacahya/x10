var rolesett = {
    //
    titleModel : ko.observable("New Roles"),
    loading : ko.observable(false),
    edit : ko.observable(true),
    roleNameEnable : ko.observable(true),
    temp: ko.observableArray([]),
    filterStatus: ko.observable(),
    //var field 
    Id : ko.observable(""),
    roleName : ko.observable(""),
    roleType : ko.observable(""),

    dealAllocation : ko.observable("Standard"),
    dealAllocationOpt : ko.observableArray(["Standard"]),
    dealAllocationEnable : ko.observable(false),

    region : ko.observableArray([]),
    regionOpt : new kendo.data.DataSource({
        transport: {
            read: function(options) {
                $.ajax({
                    url: "/sysroles/getbranch",
                    dataType: "json",
                    method: "POST",
                    success: function(result) {
                        // group by regionid
                        var region = {}

                        _.each(result, function (val) {
                            if (_.has(region, val.region.regionid))
                                return;
                            
                            region[val.region.regionid] = val.region
                        });

                        var region_ar = _.map(region, function(val) {
                            return {
                                "regionid": val.regionid,
                                "name": val.name
                            }
                        })

                        // Inject ALL options
                        region_ar.unshift({
                            name: "All",
                            regionid: 0,
                        })

                        options.success(region_ar);
                    },
                    error: function(result) {
                        options.error(result);
                    }
                });
            }
        },
    }),
    regionEnable: ko.observable(false),

    branch : ko.observableArray([]),
    branchOpt: new kendo.data.DataSource({
        transport: {
            read: function(options){
               $.ajax({
                    url: "/sysroles/getbranch",
                    dataType: "json",
                    method: "POST",
                    success: function(result) {
                        // Inject ALL options
                        result.unshift({
                            branchid: 0,
                            name: "All"
                        })

                        options.success(result);
                    },
                    error: function(result) {
                        options.error(result);
                    }
               })
            }
            
        },
    }),
    branchEnable: ko.observable(false),

    dealValue: ko.observable(""),
    dealValueOpt: new kendo.data.DataSource({
        transport: {
            read: {
                url: "/sysroles/getdealvalue",
                dataType: "json",
                type: "POST"
            }
        },
    }),

    landingPage : ko.observable(""),

    //var Filter
    filterRole : ko.observableArray([]),

    //var List
    listRole : ko.observableArray([]),

    //var Landing Page
    listPage : ko.observableArray([]),

    // var grid
    dashboardData: ko.observableArray([]),
    dealSetupData: ko.observableArray([]),
    webFormsData: ko.observableArray([]),
    dataMasterData: ko.observableArray([]),
    dataViewingData: ko.observableArray([]),
    cibilData: ko.observableArray([]),
    helpData: ko.observableArray([]),
    decisionCommitteData: ko.observableArray([]),
    caCommitteData: ko.observableArray([]),
    adminData: ko.observableArray([]),

    // all data abose will be collected here
    grantAccessNotifier: ko.observableArray([])
};

// Data grantAccessNotifier notifier
function notifGrantChanges(value) {
    rolesett.grantAccessNotifier(backMapping())
}

rolesett.dashboardData.subscribe(notifGrantChanges);
rolesett.dealSetupData.subscribe(notifGrantChanges);
rolesett.webFormsData.subscribe(notifGrantChanges);
rolesett.dataMasterData.subscribe(notifGrantChanges);
rolesett.dataViewingData.subscribe(notifGrantChanges);
rolesett.cibilData.subscribe(notifGrantChanges);
rolesett.helpData.subscribe(notifGrantChanges);
rolesett.decisionCommitteData.subscribe(notifGrantChanges);
rolesett.caCommitteData.subscribe(notifGrantChanges);
rolesett.adminData.subscribe(notifGrantChanges);

// Populate landing page from list of datagrid
rolesett.grantAccessNotifier.subscribe(function (val) {
    var page = []

    _.each(val, function(val) {
        var found = _.find(val.grant, function (val) { return val === true})
        if (!found)
            return

        page.push({
            title: val.submodule,
            menuid: val.menuid
        })
    })

    rolesett.listPage(page)
})

/*
 * Role Setting Workflow - 2017/02/24
 * 1. We get menuid array
 * 2. Map menuid array to several datasource using hardcode mapping
 *    (variable ends with Mapping)
 * 3. Display on UI
 * 4. Changes are handled using clickRole
 * 5. Datasource mapped back into menuid array
 * 6. Toggle grant on related Menuid
 * 7. Parse back menuid array into datasource
 */

// Switch dealllocation based on roletype
rolesett.roleType.subscribe(function (val) {
    switch (val) {
    case "CA":
    case "RM":
        rolesett.dealAllocation("Standard");
        rolesett.dealAllocationEnable(false);
        rolesett.dealAllocationOpt(["Standard"]);
        break;
    default:
        rolesett.dealAllocation("Branches");
        rolesett.dealAllocationEnable(true);
        rolesett.dealAllocationOpt(["Branches", "Regions"]);
        break;
    }
})

// Switch Branch and Region based on deal Reallocation
rolesett.dealAllocation.subscribe(function (val) {
    rolesett.branchEnable(false);
    rolesett.regionEnable(false);
    
    // Clear branch and region
    rolesett.branch([]);
    rolesett.region([]);

    switch (val) {
    case "Branches":
        rolesett.branchEnable(true);
        break;
    case "Regions":
        rolesett.regionEnable(true);
        break;
    }
})

// Template to generate checkbox
function checkboxField(field) {
    return '<input type="checkbox" ' +
        'data-switch-no-init ' + // disable bootstrap switch
        'id="#=menuid#_' + field + '"' +
        'class="role_#=submodule_path#_#=menuid# ' + field + '"' +
        'onclick="clickRole(\'#=submodule_path#\', \'#=menuid#\', \'' + field + '\')" ' +
        'data-path="' + field + '"' +
        '#= ' + field + ' ? checked="checked" : "" # />'
}

function clickRole(submodule_path, menuid, path) {
    // map into menuid array
    var output = backMapping();

    // process
    _.each(output, function(it) {
        if (it.menuid != menuid)
            return

        // toggle
        var sel = '.role_' + submodule_path + '_' + menuid
        var path_sel = sel + '.' + path.replace(/\./g, '\\.')
        var newVal = $(path_sel).is(":checked")
        _.set(it, path, newVal)

        // enable all if grant all selected
        if (path == 'grant.all') {
            $(sel)
                .not('.grant\\.all')
                .each(function (key, val) {
                    _.set(it, $(val).data("path"), newVal)
                })
            return
        }

        // disable all if view grant unchecked
        if (!newVal && path == 'grant.view') {
            $(sel)
                .not('.grant\\.all')
                .each(function (key, val) {
                    _.set(it, $(val).data("path"), newVal)
                })
            return
        }

        // enable view if any grant selected
        if (newVal) {
            $(sel + '.grant\\.view')
                .each(function (key, val) {
                    _.set(it, $(val).data("path"), newVal)
                })
        }
    })

    // map back to datasouce
    rolesett._privToGrid(privilegesToNewRole(output))
}

// Big hardcode mapping data
var dashboardMapping = [
    {
        "name": "Dashboard",
        "menuid": "20168521323",
        "grant": ["all", "view"]
    }
]

var dealSetupMapping = [
    {
        "name": "Deal Setup",
        "menuid": "201721163449",
        "grant": ["all", "view", "accept", "reject"]
    }
]

var webFormGrant = ["view", "edit", "confirm", "reenter", "freeze", "unfreeze"]
var webFormMapping = [
    {
        "name": "Customer Application",
        "menuid": "2016812144329",
        "grant": webFormGrant
    },
    {
        "name": "CIBIL Details",
        "menuid": "2016815163422",
        "grant": webFormGrant
    },
    {
        "name": "Balance Sheet Input",
        "menuid": "2016818132431",
        "grant": webFormGrant
    },
    {
        "name": "Stock & Book Dept",
        "menuid": "2016825141921",
        "grant": webFormGrant
    },
    {
        "name": "Account Details",
        "menuid": "201682514915",
        "grant": webFormGrant
    },
    {
        "name": "Banking Analysis",
        "menuid": "2016822104419",
        "grant": webFormGrant
    },
    {
        "name": "External Repayment Details",
        "menuid": "201682214167",
        "grant": webFormGrant
    },
    {
        "name": "Internal Repayment Details",
        "menuid": "201682613422",
        "grant": webFormGrant
    },
    {
        "name": "Due Diligence Form",
        "menuid": "2016826124919",
        "grant": webFormGrant
    }
]

var dataMasterGrant = ["view", "edit", "create", "delete"]
var dataMasterMapping = [
    {
        "name": "Balance Sheet Input Master",
        "menuid": "2016819135634",
        "grant": dataMasterGrant
    },
    {
        "name": "Formula Master",
        "menuid": "2016826135622",
        "grant": dataMasterGrant
    },
    {
        "name": "Due Diligence Form Master",
        "menuid": "2016923185829",
        "grant": dataMasterGrant
    },
    {
        "name": "Key Norms Master",
        "menuid": "2016926142839",
        "grant": dataMasterGrant
    },
    {
        "name": "Standards Master",
        "menuid": "2016102614510",
        "grant": dataMasterGrant
    },
    {
        "name": "User Master",
        "menuid": "2016825144254",
        "grant": dataMasterGrant
    },
    {
        "name": "Ratings Model Master",
        "menuid": "2016825145014",
        "grant": dataMasterGrant
    },
    {
        "name": "Distributors Master",
        "menuid": "2017126111916",
        "grant": dataMasterGrant
    }
]

var dataViewingGrant = ["view", "download", "email"]
var dataViewingMapping = [
    {
        "name": "Financial Snapshot",
        "menuid": "2016104124327",
        "grant": dataViewingGrant
    },
    {
        "name": "Credit Score Card",
        "menuid": "2016830201030",
        "grant": dataViewingGrant
    },
    {
        "name": "Detailed Financials Report",
        "menuid": "201682593414",
        "grant": dataViewingGrant
    },
    {
        "name": "Loan Approval Report",
        "menuid": "201691515422",
        "grant": dataViewingGrant
    },
    {
        "name": "Key Financials Report",
        "menuid": "2016825143634",
        "grant": dataViewingGrant
    }
]

var cibilGrant = ["view", "edit", "create", "delete"]
var cibilMapping = [
    {
        "name": "Edit Individual CIBIL Details",
        "menuid": "20161114144633",
        "grant": cibilGrant
    },
    {
        "name": "Edit Company CIBIL Details",
        "menuid": "20161219145538",
        "grant": cibilGrant
    }
]

var helpGrant = ["view", "download"]
var helpMapping = [
    {
        "name": "Formula Glossary",
        "menuid": "2016118163140",
        "grant": helpGrant
    },
    {
        "name": "Forms, Reports & Masters Logic",
        "menuid": "2016119141528",
        "grant": helpGrant
    },
    {
        "name": "UAT Documents",
        "menuid": "20161128103041",
        "grant": helpGrant
    }
]

var decisionCommitteMapping = [
    {
        "name": "Decision Committe",
        "menuid": "2016825142718",
        "grant": ["view", "dc_approve", "dc_reject", "dc_cancel", "dc_hold", "dc_send_back"]
    }
]

var caCommitteMapping = [
    {
        "name": "CA Committe",
        "menuid": "2016825142718",
        "grant": ["view", "ca_save", "ca_send_dc"]
    }
]

var adminGrant = ["view", "edit", "create", "delete"]
var adminMapping = [
    {
        "name": "User",
        "menuid": "201685212148",
        "grant": adminGrant
    },
    {
        "name": "Role",
        "menuid": "20168521215",
        "grant": adminGrant
    },
    {
        "name": "Menu",
        "menuid": "201685212251",
        "grant": adminGrant
    },
    {
        "name": "Reallocation Master",
        "menuid": "2017214122614",
        "grant": adminGrant
    },
    {
        "name": "New User",
        "menuid": "201721611052",
        "grant": adminGrant
    },
    {
        "name": "Data Browser",
        "menuid": "201711316158",
        "grant": adminGrant
    }
]

// map menuid array into datasource-compatible data
function processMapping(input, maps) {
    var ret = [];
    _.each(maps, function(component) {
        var newcomponent = {};
        newcomponent.submodule = component.name
        newcomponent.submodule_path = component.name.replace(/[^A-Za-z0-9]/g, '_').toLowerCase()
        newcomponent.menuid = component.menuid
        newcomponent.grant = {}
        // find matching menu
        var grant = {}
        _.find(input, function(it) {
            var menuid = _.get(it, "Menuid", undefined) || _.get(it, "menuid", undefined)

            if (typeof(menuid) == "undefined")
                console.log("ERROR!")

            if (menuid != component.menuid)
                return false;

            grant = _.get(it, 'Grant', undefined) || _.get(it, "grant", {})
            return true;
        })

        var all_check = true
        // set default false, collect all var
        _.each(component.grant, function (name) {
            newcomponent.grant[name] = _.get(grant, name, false)
            all_check = all_check && newcomponent.grant[name]
        })

        newcomponent.grant["all"] = all_check

        // console.log(newcomponent)
        ret.push(newcomponent)
    })

    return ret;
}

// Map back from individual data grid into one array of menuid and grant
function backMapping() {
    var lists = [
        rolesett.dashboardData,
        rolesett.dealSetupData,
        rolesett.webFormsData,
        rolesett.decisionCommitteData,
        rolesett.caCommitteData,
        rolesett.dataViewingData,
        rolesett.cibilData,
        rolesett.dataMasterData,
        rolesett.helpData,
        rolesett.adminData
    ]

    var ret = []
    _.each(lists, function(val) {
        var input = val()

        _.each(input, function(val2) {
            var idx = _.findIndex(ret, function(val3) {
                return val2.menuid == val3.menuid;
            })

            if (idx != -1) {
                ret[idx].grant = _.merge(ret[idx].grant, val2.grant)
                return
            }

            // prevent next manipulation to changes this one
            // clone it
            ret.push(_.cloneDeep(val2));
        })
    })

    return ret
}

// Split from menuid grant into individual datagrid data
function privilegesToNewRole(input) {
    var mapped = {};
    mapped["Dashboard"] = processMapping(input, dashboardMapping)
    mapped["Deal Setup"] = processMapping(input, dealSetupMapping)
    mapped["Web Forms"] = processMapping(input, webFormMapping)
    mapped["Cibil Editor"] = processMapping(input, cibilMapping)
    mapped["Data Master"] = processMapping(input, dataMasterMapping)
    mapped["Help"] = processMapping(input, helpMapping)
    mapped["DecisionCommitte"] = processMapping(input, decisionCommitteMapping)
    mapped["CaCommitte"] = processMapping(input, caCommitteMapping)
    mapped["Admin"] = processMapping(input, adminMapping)
    mapped["Data Viewing"] = processMapping(input, dataViewingMapping)
    
    return mapped;
}

// Create column and complete it with checkbox and header
function completeColumn(init) {
    var ret = [
        {
            field: "submodule",
            title: "Sub-Module",
            headerAttributes: {class: 'k-header header-bgcolor'},
            width: 200
        }
    ]

    ret.push.apply(ret, _.map(init, function(val, key) {
        return {
            field: val.field,
            title: val.title,
            headerAttributes: {class: 'k-header header-bgcolor'},
            template: checkboxField(val.field)
        }
    }))

    return ret
}

// List of datagrid column
var DashboardCol = completeColumn([
    {
        field: "grant.all",
        title: "All"
    },
    {
        field: "grant.view",
        title: "View"
    }
])

var DealSetupCol = completeColumn([
    {
        field: "grant.all",
        title: "All"
    },
    {
        field: "grant.view",
        title: "View"
    },
    {
        field: "grant.accept",
        title: "Accept"
    },
    {
        field: "grant.reject",
        title: "Reject"
    }
])

var WebFormsCol = completeColumn([
    {
        field: "grant.all",
        title: "All"
    },
    {
        field: "grant.view",
        title: "View"
    },
    {
        field: "grant.edit",
        title: "Edit & Save"
    },
    {
        field: "grant.confirm",
        title: "Confirm"
    },
    {
        field: "grant.reenter",
        title: "Re-Enter"
    },
    {
        field: "grant.freeze",
        title: "Freeze"
    },
    {
        field: "grant.unfreeze",
        title: "Unfreeze"
    }
])

var DataMasterCol = completeColumn([
    {
        field: "grant.all",
        title: "All"
    },
    {
        field: "grant.view",
        title: "View"
    },
    {
        field: "grant.edit",
        title: "Edit & Save"
    },
    {
        field: "grant.create",
        title: "Create"
    },
    {
        field: "grant.delete",
        title: "Delete"
    }
])

var DataViewingCol = completeColumn([
    {
        field: "grant.all",
        title: "All"
    },
    {
        field: "grant.view",
        title: "View"
    },
    {
        field: "grant.download",
        title: "Download"
    },
    {
        field: "grant.email",
        title: "Email"
    }
])

var decisionCommitteCol = completeColumn([
    {
        field: "grant.all",
        title: "All"
    },
    {
        field: "grant.view",
        title: "View"
    },
    {
        field: "grant.dc_approve",
        title: "Approve"
    },
    {
        field: "grant.dc_reject",
        title: "Reject"
    },
    {
        field: "grant.dc_cancel",
        title: "Cancel"
    },
    {
        field: "grant.dc_hold",
        title: "Hold"
    },
    {
        field: "grant.dc_send_back",
        title: "Send back"
    }
])

var caCommitteCol = completeColumn([
    {
        field: "grant.all",
        title: "All"
    },
    {
        field: "grant.view",
        title: "View"
    },
    {
        field: "grant.ca_save",
        title: "Save"
    },
    {
        field: "grant.ca_send_dc",
        title: "Send DC"
    }
])

// Cibil Editor
var CibilCol = completeColumn([
    {
        field: "grant.all",
        title: "All"
    },
    {
        field: "grant.view",
        title: "View"
    },
    {
        field: "grant.edit",
        title: "Edit & Save"
    },
    {
        field: "grant.create",
        title: "Create"
    },
    {
        field: "grant.delete",
        title: "Delete"
    }
])

// Help
var HelpCol = completeColumn([
    {
        field: "grant.all",
        title: "All"
    },
    {
        field: "grant.view",
        title: "View"
    },
    {
        field: "grant.download",
        title: "Download"
    },
])

// Admin
var AdminCol = completeColumn([
    {
        field: "grant.all",
        title: "All"
    },
    {
        field: "grant.view",
        title: "View"
    },
    {
        field: "grant.edit",
        title: "Edit & Save"
    },
    {
        field: "grant.create",
        title: "Create"
    },
    {
        field: "grant.delete",
        title: "Delete"
    }
])

rolesett.templateRole = {
    name: "",
    type: "",
    dealallocation: "",
    status: false,
    menu: [],
    landing: ""
};
rolesett.mappingRole = ko.mapping.fromJS(rolesett.templateRole);

rolesett.ClearField = function(){
    rolesett.branch([]);
    rolesett.region([]);
    rolesett.roleName("");
    rolesett.roleType("CA");
    // rolesett.dealAllocation("Standard");
    $('#Status').bootstrapSwitch('state',true);
    rolesett._privToGrid(privilegesToNewRole([]))
    rolesett.landingPage("");
}

rolesett.Search = function(){
    rolesett.GetDataRole();
}

rolesett.Reset = function(){
    var multiSelect = $('#filterRole').data("kendoMultiSelect");
    multiSelect.value([]);
    $('#filterStatus').bootstrapSwitch('state', true);
    rolesett.GetDataRole();
}

rolesett.AddNew = function(){
    // var landing = $("#role").data("kendoDropDownList");
    // landing.value("");
    
    $("#roleModal").modal("show");
    $("#nav-dex").css('z-index', '0');
    $("#roleModal").modal({
        backdrop: 'static',
        keyboard: false
    });
    rolesett.resizeSwitch()
    $('.rolecheck-value-check-all').prop('checked', false);
    $('.rolecheck-value-Access').prop('checked', false);
    $('.rolecheck-value-Create').prop('checked', false);
    $('.rolecheck-value-Delete').prop('checked', false);
    $('.rolecheck-value-Edit').prop('checked', false);
    $('.rolecheck-value-View').prop('checked', false);
    $('.rolecheck-value-Approve').prop('checked', false);
    $('.rolecheck-value-Process').prop('checked', false);
    rolesett.titleModel("New Roles");
    rolesett.roleNameEnable(true);
    rolesett.ClearField();
    rolesett.edit(true);
    rolesett.getTopMenu();
    rolesett.Id("");
}

rolesett.resizeSwitch = function(){
    $('.bootstrap-switch-handle-on, .bootstrap-switch-primary, .bootstrap-switch-label')
        .css("width", "55px")
    $(".bootstrap-switch-handle-off .bootstrap-switch-default").css("width", "69px");
    $('.bootstrap-switch,.bootstrap-switch-wrapper,.bootstrap-switch-on, .bootstrap-switch-id-Status, .bootstrap-switch-disabled, .bootstrap-switch-animate').css("width", "108px");
    $('.bootstrap-switch, .bootstrap-switch-label').css("font-size", "12px")
    $(".bootstrap-switch .bootstrap-switch-handle-off, .bootstrap-switch .bootstrap-switch-handle-on, .bootstrap-switch .bootstrap-switch-label")
            .css("font-size", "12px")
            .css("line-height", "17px")
}

rolesett.DeleteRole = function(id) {
    swal({
        title: "Are you sure?",
        text: "Role will be deleted.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!"
    }).then(function() {
        ajaxPost("/sysroles/removerole", { "id": id }, function(res) {
            if(res.IsError != true){
                $('#MasterGridRole').data('kendoGrid').dataSource.read();
                $('#MasterGridRole').data('kendoGrid').refresh();
            }else{
                return swal("Error", res.Message, "error");
            }
        });
    });
}

function swalErr(msg) {
    swal("Error!", msg, "error");

    return false;
}

rolesett.ValidateData = function() {
    if (rolesett.roleName().length == 0)
        return swalErr("Role Name must be filled")

    switch (rolesett.dealAllocation()) {
    case "Branches":
        if (rolesett.branch().length == 0)
            return swalErr("Branches cannot empty")
        break;
    case "Regions":
        if (rolesett.region().length == 0)
            return swalErr("Regions cannot empty")
        break;
    }

    if (rolesett.dealValue() == "")
        return swalErr("Proposed Amount Range must be filled")
    
    if (rolesett.landingPage().length == 0 || _.findIndex(rolesett.listPage(), {"menuid": rolesett.landingPage()}) == -1)
        return swalErr("Landing Page must be filled")
    
    return true
}

rolesett.SaveData = function(){
    if (!rolesett.ValidateData())
        return

    var param = {};
    param.id = rolesett.Id();
    param.name = rolesett.roleName();
    param.dealallocation = rolesett.dealAllocation();
    param.status = $('#Status').bootstrapSwitch('state');
    param.landing = rolesett.landingPage();
    param.menu = backMapping();

    // If ALL is selected, we sent empty array
    if (_.isEqual(rolesett.region(), [0]))
        param.region = [];
    else
        param.region = rolesett.region();
    
    if (_.isEqual(rolesett.branch(), [0]))
        param.branch = [];
    else
        param.branch = rolesett.branch();

    param.dealvalue = rolesett.dealValue();
    param.roletype = rolesett.roleType();

    // rolesett.Cancel();
    // rolesett.Reset();
    ajaxPost("/sysroles/savedata", param, function(res){
        if(res.IsError != true){
            rolesett.Cancel();
            rolesett.Reset();
            $("#nav-dex").css('z-index', 'none');
            swal("Success!", res.Message, "success");
            location.reload();
        }else{
            return swal("Error!", res.Message, "error");
        }
    });
}


rolesett._privToGrid = function(priv) {
    rolesett.dashboardData(priv["Dashboard"]);
    rolesett.dealSetupData(priv["Deal Setup"]);
    rolesett.webFormsData(priv["Web Forms"]);
    rolesett.cibilData(priv["Cibil Editor"]);
    rolesett.dataMasterData(priv["Data Master"]);
    rolesett.dataViewingData(priv["Data Viewing"]);
    rolesett.helpData(priv["Help"]);
    rolesett.decisionCommitteData(priv["DecisionCommitte"]);
    rolesett.caCommitteData(priv["CaCommitte"]);
    rolesett.adminData(priv["Admin"]);
}

rolesett.branch.subscribe(function(value){
    var found = _.indexOf(value, 0);

    console.log(found, 'aw', value)
    if (value.length != 1 && found != -1) {
        rolesett.branch([0])
    }
})

rolesett.region.subscribe(function(value){
    var found = _.indexOf(value, 0);

    console.log(found, 'bw')
    if (value.length != 1 && found != -1) {
        rolesett.region([0])
    }
})

rolesett.EditData = function(IdRole){
    // Old Data
    rolesett.roleNameEnable(true);

    var url = "/sysroles/getmenuedit";
    var param = {
            Id : IdRole
        }
        ajaxPost(url, param, function(res){
            if(!(res.IsError != true)){
                return swal("Error!", res.Message, "error");
            }

            // var a = $("#branch").data("kendoMultiSelect").dataSource.data();
           

            $("#roleModal").modal("show");
            $("#nav-dex").css('z-index', '0');
            $("#roleModal").modal({
                backdrop: 'static',
                keyboard: false
            });
            rolesett.titleModel("Update Roles");
            rolesett.edit(true);
            var Records = res.Data.Records[0];

            if(!Records.Deletable) {
                rolesett.roleNameEnable(false);
            }

            // FILL UP FORM
            rolesett.Id(Records.Id);
            rolesett.roleName(Records.Name);
            rolesett.roleType(_.get(Records, 'Roletype', 'Custom'));
            rolesett._privToGrid(privilegesToNewRole(Records.Menu));
            rolesett.landingPage(Records.LandingId);
            $('#Status').bootstrapSwitch('state',Records.Status);
            $('#Status').bootstrapSwitch('disabled',!Records.Deletable);
            console.log(Records.Deletable);
            rolesett.dealAllocation(Records.Dealallocation);
            rolesett.dealValue(Records.Dealvalue);
            // last to set
            rolesett.branch(Records.Branch);
            rolesett.region(Records.Region);

            if (_.isArray(Records.Branch) && Records.Branch.length == 0)
                rolesett.branch([0]);
            if (_.isArray(Records.Region) && Records.Region.length == 0)
                rolesett.region([0]);

            // old access layout setup

            // var landing = $("#role").data("kendoDropDownList");
            // landing.value(Records.Landing);
            var dataMenu = res.Data.Records[0].Menu;
            var newRecords = [];
            for (var d in dataMenu){
                newRecords.push({
                    "Access": dataMenu[d].Access,
                    "Approve": dataMenu[d].Approve,
                    "Checkall": dataMenu[d].Checkall,
                    "Create": dataMenu[d].Create,
                    "Delete": dataMenu[d].Delete,
                    "Edit": dataMenu[d].Edit,
                    "Enable": dataMenu[d].Enable,
                    "Haschild": dataMenu[d].Haschild,
                    "Id": dataMenu[d].Menuid,
                    "Title": dataMenu[d].Menuname,
                    "Parent": dataMenu[d].Parent,
                    "Process": dataMenu[d].Process,
                    "Url": dataMenu[d].Url,
                    "View": dataMenu[d].View,
                });
            }
            setTimeout(function(){
                rolesett.resizeSwitch()
            }, 500)
            
            // rolesett.GetDataMenu(newRecords);
    }); 
}

rolesett.Cancel = function(){
    $("#roleModal").modal("hide");
    $("#nav-dex").css('z-index', 'none');
}

rolesett.filterRole.subscribe(function(value){
   rolesett.GetDataRole();
});



rolesett.GetDataRole = function(){
    rolesett.loading(false);
    var param =  {
        "Name" : rolesett.filterRole(),
        "Status" : $('#filterStatus').bootstrapSwitch('state')
    };
    var dataSource = [];
    var url = "/sysroles/getdata";
    $("#MasterGridRole").html("");
    $("#MasterGridRole").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: url,
                        data: param,
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                    },
                    parameterMap: function(data) {                                 
                        return JSON.stringify(data);                                 
                    }
                },
                schema: {
                    data: function(data) {
                        rolesett.loading(false);
                        if (data.Data.Count == 0) {
                            return dataSource;
                        } else {
                            return data.Data.Records;
                        }
                    },
                    total: function(data){
                        if (data.Data.Count == 0) {
                            return 0;
                        } else {
                            return data.Data.Records.length;
                        }
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverSorting: true,
            },
            resizable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                {
                    field:"Name",
                    title:"Role Name",
                    headerAttributes: {class: 'k-header header-bgcolor'},
                    template: "#if(model.IsGranted('edit')){#<a class='grid-select' id='ls' href='javascript:rolesett.EditData(\"#: Id #\")'>#: Name #</a>#}else{#<div>#: Name #</div>#}#"

                },
                {
                    field:"Status",
                    title:"Status",
                    template : function(dt){
                        if(dt.Status){
                            return "Active"
                        }
                        return "Inactive"
                    },
                    headerAttributes: {class: 'k-header header-bgcolor'}
                },
                {
                    title: "Action",
                    headerAttributes: {class: 'k-header header-bgcolor'},
                    width: 100,
                    template: "<center>" +
                            "<button class='btn btn-xs btn-flat btn-warning edit' onclick='rolesett.EditData(\"#: Id #\")'><span class='fa fa-edit'></span></button>" +
                            "&nbsp;&nbsp;" +
                            "<button class='btn btn-xs btn-flat btn-danger del' #if(!Deletable) {# disabled='disabled' #}# onclick='rolesett.DeleteRole(\"#: Id #\")'><span class='fa fa-trash-o'></span></button>" +
                            "</center>"
                }
            ]
    });
    setTimeout(function(){
        rolesett.grantDelete();
    }, 100)
}

rolesett.getTopMenu = function(){
    var param = {
    }
    var url = "/sysroles/getmenu";
    ajaxPost(url, param, function(res){
        if(res.IsError != true){
            var dataMenu = res.Data.Records;
            // console.log(dataMenu)
            var newRecords = [];
            for (var d in dataMenu){
                newRecords.push({
                    // "Id": dataMenu[d].Id,
                    // "Enable": dataMenu[d].Enable,
                    // "Haschild": dataMenu[d].Haschild,
                    // "IndexMenu": dataMenu[d].IndexMenu,
                    // // "PageId": dataMenu[d].PageId,
                    // "Parent": dataMenu[d].Parent,
                    // "Title": dataMenu[d].Title,
                    // "Url": dataMenu[d].Url,
                    // "Checkall": false,
                    // "Access": false,
                    // "Create": false,
                    // "Edit": false,
                    // "Delete": false,
                    // "View": false,
                    // "Approve": false,
                    // "Process": false

                    "Access": false,
                    "Approve":false,
                    "Checkall": false,
                    "Create": false,
                    "Delete": false,
                    "Edit": false,
                    "Enable": true,
                    "Haschild": false,
                    "Id": dataMenu[d].Id,
                    "Title": dataMenu[d].Title,
                    "Parent": dataMenu[d].Parent,
                    "Process": false,
                    "Url": dataMenu[d].Url,
                    "View": false,
                    
                });
            }

            // rolesett.GetDataMenu(newRecords);
        }else{
            return swal("Error!", res.Message, "error");
        }
    });
}

rolesett.getRole = function(){
    var param = {
    }
    var url = "/datamaster/getroles";
    rolesett.listRole([]);
    ajaxPost(url, param, function(res){
        var dataRole = Enumerable.From(res).OrderBy("$.name").ToArray();
        for (var r in dataRole){
            rolesett.listRole.push({
                "text" : dataRole[r].name,
                "value" : dataRole[r].name,
            });
        }
    });
}

rolesett.toggleFilter = function(){
  var panelFilter = $('.panel-filter');
  var panelContent = $('.panel-content');

  if (panelFilter.is(':visible')) {
    panelFilter.hide();
    panelContent.attr('class', 'col-md-12 col-sm-12 ez panel-content');
    $('.breakdown-filter').removeAttr('style');
  } else {
    panelFilter.show();
    panelContent.attr('class', 'col-md-9 col-sm-9 ez panel-content');
    //panelContent.css('margin-top', '1.3%');
    $('.breakdown-filter').css('width', '60%');
  }

  $('.k-grid').each(function (i, d) {
    try {
      $(d).data('kendoGrid').refresh();
    } catch (err) {}
  });

  $('.k-pivot').each(function (i, d) {
    $(d).data('kendoPivotGrid').refresh();
  });

  $('.k-chart').each(function (i, d) {
    $(d).data('kendoChart').redraw();
  });
  rolesett.panel_relocated();
}

rolesett.panel_relocated = function(){
  if ($('.panel-yo').size() == 0) {
    return;
  }

  var window_top = $(window).scrollTop();
  var div_top = $('.panel-yo').offset().top;
  if (window_top > div_top) {
    $('.panel-fix').css('width', $('.panel-yo').width());
    $('.panel-fix').addClass('contentfilter');
    $('.panel-yo').height($('.panel-fix').outerHeight());
  } else {
    $('.panel-fix').removeClass('contentfilter');
    $('.panel-yo').height(0);
  }
}

rolesett.grantDelete = function(){
    if(model.IsGranted('delete') == true){
        $("#del").show()
    }else{
        $(".del").hide()
    }
}

$(document).ready(function (){ 
    $('#filterStatus').bootstrapSwitch('state',true)
    rolesett.getRole();
    rolesett.GetDataRole();
    rolesett.resizeSwitch()
    $('#filterStatus').on('switchChange.bootstrapSwitch', function (event, state) {
       setTimeout(function(){
        rolesett.GetDataRole();
    },500);
    });
});