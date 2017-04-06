
var compFilter = CreateDashFilter()
var comp = {}

comp.FilterList = ko.observableArray([
    {
        varName: "Region",
        title: "Region"
    },
    {
        varName: "Branch",
        title: "Branch"
    },
    {
        varName: "Product",
        title: "Product"
    },
    {
        varName: "Scheme",
        title: "Scheme"
    },
    {
        varName: "ClientType",
        title: "Client Type"
    },
    {
        varName: "ClientTurnover",
        title: "Client Turnover"
    },
    {
        varName: "IR",
        title: "Internal Rating"
    },
    {
        varName: "CA",
        title: "CA"
    },
    {
        varName: "RM",
        title: "RM"
    },
])

comp.initSelected = function (val) {
    comp[val + "SelectedItems"] = ko.observableArray([])
}
_.each(comp.FilterList(), function (val) {
    comp.initSelected(val.varName)
})

comp.openCompare = ko.observable("")
comp.openCompare.subscribe(function (id) {
    if (id === "")
        return;

    $("#compareModal .collapse").collapse('hide');
    $("#compcollapse" + id).collapse('show');

    comp.RedrawChart();
})
comp.openSelected = ko.computed(function () {
    var idx = comp.openCompare()
    if (idx == "")
        return [];

    var name = comp.FilterList()[idx].varName;

    return comp[name + "SelectedItems"]();
})

comp.IsSelected = function(section, needle) {
    return _.indexOf(comp[section + "SelectedItems"](), needle) !== -1
}

comp.ToggleSelected = function(section, needle) {
    var haystack = comp[section + "SelectedItems"]();
    var idx = _.indexOf(haystack, needle);
    if (idx === -1) {
        comp[section + "SelectedItems"].push(needle);
        comp.RedrawChart();
        return;
    }

    haystack.splice(idx, 1);
    comp[section + "SelectedItems"](haystack);
    comp.RedrawChart();
}

comp.ChartLoader = function (param, callback) {callback({})}

comp.Open = function (chartconfig) {
    comp.ChartLoader = chartconfig;

    compFilter.LoadFilter(dash.FilterValue());
    $("#compareModal").modal('show');
    comp.openCompare(0);
    comp.RedrawChart();
}

comp.RedrawChart = function () {
    console.log("in redraw")
    var parentEl = $("#compMainWindow");
    parentEl.hide();
    parentEl.html("");

    _.each(comp.openSelected(), function (val, index) {
        console.log(val);
        console.log(index);
        var child = document.createElement("div");
        child.id = "compChart" + index;

        parentEl.append(child);
    })

    parentEl.show();
}
