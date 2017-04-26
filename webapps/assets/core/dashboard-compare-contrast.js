
var compFilter = CreateDashFilter()
var comp = {}

comp.viewFilter = ko.observable(false)
comp.axisData = ko.observableArray([])
comp.viewFilter.subscribe(function (val) {
    if (val)
        $("#compareModal .filter-button").hide();
    else
        $("#compareModal .filter-button").show();
})

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

comp.InitialFilter = null;
comp.disableDraw = false;
comp.Open = function (chartconfig) {
    // we disable drawing until modal show up
    comp.disableDraw = true;

    // set callback function
    comp.ChartLoader = chartconfig;

    // reset state
    comp.resetModal();
    // save initial filter
    comp.InitialFilter = dash.FilterValue()
    // set default filter using clone object
    compFilter.LoadFilter(_.cloneDeep(comp.InitialFilter));
    // clear max value
    comp.axisData([])
    // clear chart
    $("#compMainWindow").html("");

    $('#compareModal').modal({show: true, backdrop: 'static', keyboard: false})
    // default open first filter
    comp.openCompare(0);
}

comp.resetModal = function(){
    _.each(comp.FilterList(), function (val) {
        comp[val.varName + "SelectedItems"]([])
    })

    comp.viewFilter(false);
}

comp.RedrawChartDelay = null;
comp.RedrawChart = function () {
    if (comp.disableDraw)
        return;

    if (comp.RedrawChartDelay) {
        clearTimeout(comp.RedrawChartDelay)
    }
    comp.RedrawChartDelay = setTimeout(function () {
        comp.RedrawChartDelay = null
        comp.RedrawChart_()
    }, 50);
}

comp.RedrawChart_ = function (firstload) {
    var parentEl = $("#compMainWindow");
    // parentEl.hide();
    parentEl.html("");

    if (comp.nameSelected() == "")
        return;
    
    comp.axisData([])

    _.each(comp.openSelected(), function (val, index) {
        var filter = _.cloneDeep(compFilter.FilterValue());

        if (index !== 0) {
            // on index not zero, set filter
            comp.setFilterVal(filter, comp.nameSelected(), val);
        }

        var param = {
            start: discardTimezone(comp.getFilterVal(filter, "TimePeriodCalendar")),
            end: discardTimezone(comp.getFilterVal(filter, "TimePeriodCalendar2")),
            type: comp.getFilterVal(filter, "TimePeriod"),
            filter: filter
        } 
        var heading = document.createElement("div");
        heading.classList.add("panel-heading");

        if (index === 0) {
            var icon = document.createElement("i");
            icon.classList.add("fa");
            icon.classList.add("fa-pencil");

            var btn = document.createElement("button");
            btn.classList.add("btn")
            btn.classList.add("btn-xs")
            btn.classList.add("btn-flat")
            btn.classList.add("btn-default")
            btn.classList.add("filter-button")
            if (comp.viewFilter() === true) {
                btn.style.display = "none"
            }

            btn.appendChild(icon)
            $(btn).on("click", function(){
                comp.viewFilter(true);
            })
            heading.appendChild(btn);
        }

        var body = document.createElement("div")
        body.classList.add("panel-body");

        // Add child
        var child = document.createElement("div");
        child.classList.add("chart-wrapper");
        child.appendChild(heading)
        child.appendChild(body)

        var row = document.createElement("div");
        row.id = "compChart" + index + "_wrapper";
        row.classList.add("col-sm-6");
        row.appendChild(child)

        var el = document.createElement("div");
        el.id = "compChar" + index;
        el.classList.add("chart");
        body.appendChild(el);

        comp.ChartLoader(param, function (opt) {
            if (index == 0) {
                opt.title.text = opt.title.text + " [Base Chart]";
            } else {
                opt.title.text = opt.title.text + " [" + val + "]";
            }

            $(el).kendoChart(opt);
            var data = $(el).data("kendoChart");

            comp.axisData.push(data._plotArea.axes[1].totalMax);

            if (comp.axisData().length != comp.openSelected().length)
                return
            
            // when all chart data collected
            // we adjust chart options to the same max axis value
            var max = Math.max(...comp.axisData())
            $("#compMainWindow .chart").each(function (i, val) {
                $(val).data("kendoChart").setOptions({ axisDefaults: { max: max}});
            })
        });

        parentEl.append(row);
    })
    // comp.RedrawChart()
    // parentEl.show();
}

compFilter.FilterValue.subscribe(function (val) {
    comp.RedrawChart();
})

compFilter.TimePeriodCalendarScale.subscribe(function (val) {
	$("#compare-timeperiodCalendar").data("kendoDatePicker").setOptions({
		depth: val,
		start: val
	})
})

$(function () {
    $('#compareModal').on('shown.bs.modal', function () {
        comp.disableDraw = false;
        comp.RedrawChart();
    });
})

