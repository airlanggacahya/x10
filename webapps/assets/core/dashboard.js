var dash = CreateDashFilter()

// for top deals
// show or hide number input
// and set when empty
dash.TopFilterVal.subscribe(function (val) {
	// set topnumber when sort by is selected
	if (val.length === 0) {
		dash.TopNumberOptional(true)
		return
	}

	dash.TopNumberOptional(false)
	var number = dash.TopNumberVal()

	if (number.length !== 0)
		return
	
	dash.TopNumberVal("10")
})

// prevent empty input
dash.TopNumberVal.subscribe(function (val) {
	if (val.length === 0)
		dash.TopNumberVal("10")
})


function discardTimezone(date) {
    var newdate = moment(date)
    return newdate.format("YYYY-MM-DDT00:00:00") + "Z"
}

function cleanMoment(date) {
	return moment(discardTimezone(date))
}

dash.TimePeriodCalendarScale.subscribe(function (val) {
	$("#timeperiodCalendar").data("kendoDatePicker").setOptions({
		depth: val,
		start: val
	})
})

dash.summary2fa = function (values) {
    if (values == 0)
        return "";
    if (values < 0)
        return "fa fa-caret-down";
    if (values > 0)
        return "fa fa-caret-up";
}

dash.summary2color = function (values) {
    if (values == 0)
        return "fa-font-neutral";
    if (values < 0)
        return "fa-font-red";
    if (values > 0)
        return "fa-font-green";
}

dash.accordionSideBar = function(){
	$(".toggle").click(function(e){
		e.preventDefault();
		// alert("masuk sini")
		var $this = $(this);
		if($this.next().hasClass('show')){
			$this.next().removeClass('show');
			$this.next().slideUp(350);
			$this.find("h5>").removeClass("fa-chevron-down");
			$this.find("h5>").addClass("fa-chevron-up");
		}else{
			$this.next().removeClass('hide');
			$this.next().slideDown(350);
			$this.next().addClass("show");
			$this.find("h5>").addClass("fa-chevron-down");
			$this.find("h5>").removeClass("fa-chevron-up");
		}
	})

	$("#all").click(function(e){
		// alert("masuk")
		$(".toggle").next().removeClass('hide');
		$(".toggle").next().slideDown(350).addClass("show");
		$(".toggle").find("h5>").addClass("fa-chevron-down");
		$(".toggle").find("h5>").removeClass("fa-chevron-up");
		
		$(".form-group").show()
	})
}

dash.moveTimePeriod = function(start, end, type, movement) {
	var start = cleanMoment(start)
	var end = cleanMoment(end)
	var type = dash.FilterValue.GetVal("TimePeriod")

	switch (type) {
	case "":
	case "1month":
		start.date(1);
		end.date(1);
		start = start.add(movement, "month")
		end = end.add(movement, "month")
		break;
	case "10day":
		start = start.add(movement * 10, "day")
		end = end.add(movement * 10, "day")
		break;
	case "1year":
		start.date(1);
		end.date(1);
		start = start.add(movement, "year")
		end = end.add(movement, "year")
		break;
	case "fromtill":
		var dura = end.diff(start) * movement
		start = start.add(dura)
		end = end.add(dura)
		break;
	}

	return {
		start: start,
		end: end,
		type: type
	}
}

dash.trendDataLengthOptions = ko.computed(function () {
    var unit = dash.FilterValue.GetVal("TimePeriod")
    switch (unit) {
    case "":
    case "1month":
        unit = "months"
        break;
    case "1year":
        unit = "years"
        break;
    default:
        unit = "period"
    }
    var ret =  _.map([3, 4, 6, 12], function (val) {
        return {
            text: "" + val + " " + unit,
            value: val
        }
    });

    return ret;
});

// utilities for calculating chart grid
dash.chartMax = function(data, fieldname) {
	return _.get(_.maxBy(data, fieldname), fieldname, 1);
}

dash.chartUnit = function(data, fieldname, step) {
	return dash.chartMax(data, fieldname) / step;
}

dash.openTopNumber = function () {
	// somehow, when we do search(), the popup will have a little gap from input box
	// call to refresh() fixes it up.
	$('#dashFilterTopNumber').data('kendoAutoComplete').search()
	$('#dashFilterTopNumber').data('kendoAutoComplete').refresh()
}

function onlyNumber(event) {
	var keyCode = ('which' in event) ? event.which : event.keyCode;

	var isNumber = false;
	if (keyCode >= 48 && keyCode <= 57) {
		isNumber = true;
	}

	return isNumber;
}

$(function () {
	dash.accordionSideBar()
	ajaxPost("/dashboard/getfilter", {}, function(res) {
		if (res.IsError) {
			swal("Error", res.Message, "error")
			dash.LoadFilter([])
			return
		}

		dash.LoadFilter(res.Data.Filters)
		dash.SetSaveCallback(function (param) {
			ajaxPost("/dashboard/savefilter", param, function(res){
				if (res.IsError) {
					swal("Error", res.Message, "error")
				}
			})
		})
	})
})
