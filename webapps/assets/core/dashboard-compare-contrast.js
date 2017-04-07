
var compFilter = CreateDashFilter()
var comp = {}

comp.setFilterVal = function (filter, field, value) {
    var ret = _.find(filter, function (val) {
        return (val.FilterName === field)
    })

    ret.Value = value

    return ret;
}

comp.getFilterVal = function (filter, field) {
    var ret = _.find(filter, function (val) {
        return (val.FilterName === field)
    })

    if (typeof(ret) === "undefined")
        return ""
    
    return _.cloneDeep(ret.Value)
}

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
comp.nameSelected = ko.computed(function () {
    var idx = comp.openCompare()
    if (idx === "")
        return "";

    var name = comp.FilterList()[idx].varName;

    return name;
})
comp.openSelected = ko.computed(function () {
    var name = comp.nameSelected();

    var base = comp.getFilterVal(comp.BaseFilter, name);
    if (name === "")
        return [base];

    var selected = _.cloneDeep(comp[name + "SelectedItems"]());
    selected.unshift(base)

    return selected;
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
    comp.BaseFilter = dash.FilterValue();

    compFilter.LoadFilter(dash.FilterValue());
    $("#compareModal").modal('show');
    if (comp.openCompare() === "")
        comp.openCompare(0);
    
    comp.RedrawChart();
}

comp.RedrawChartDelay = null;
comp.RedrawChart = function () {
    if (comp.RedrawChartDelay) {
        clearTimeout(comp.RedrawChartDelay)
    }
    comp.RedrawChartDelay = setTimeout(function () {
        comp.RedrawChartDelay = null
        comp.RedrawChart_()
    }, 100);
}

comp.RedrawChart_ = function () {
    var parentEl = $("#compMainWindow");
    // parentEl.hide();
    parentEl.html("");

    if (comp.nameSelected() == "")
        return;

    _.each(comp.openSelected(), function (val, index) {
        var filter = _.cloneDeep(comp.BaseFilter);
        comp.setFilterVal(filter, comp.nameSelected(), val);

        var param = {
            start: discardTimezone(comp.getFilterVal(filter, "TimePeriodCalendar")),
            end: discardTimezone(comp.getFilterVal(filter, "TimePeriodCalendar2")),
            type: comp.getFilterVal(filter, "TimePeriod"),
            filter: filter
        }

        // Add child
        var child = document.createElement("div");
        child.id = "compChart" + index + "_wrapper";
        child.classList.add("col-sm-6");
        child.classList.add("chart-wrapper");

        var el = document.createElement("div");
        el.id = "compChar" + index;
        el.classList.add("chart");

        comp.ChartLoader(param, function (opt) {
            var chart = $(el).kendoChart(opt);
            $(chart[0]).data('kendoChart').redraw();
        });

        child.appendChild(el);
        parentEl.append(child);
    })

    $("")

    // parentEl.show();
}
