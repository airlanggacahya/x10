var alertSide = {}
alertSide.notifData = ko.observableArray([])
alertSide.notifAjaxState = ko.observable("LOAD")
alertSide.notifAjaxRefresh = function () {
    alertSide.notifAjaxState("LOAD")
    $.ajax("/dashboard/getnotification", {
        method: "post",
        data: JSON.stringify({days: 3}),
        contentType: "application/json",
        success: function(body) {
            if (body.Status == "") {
                alertSide.notifData(body.Data)
                alertSide.notifAjaxState("DONE")
                return
            }

            alertSide.notifAjaxState("ERROR")
        }
    })
}
// load notifData
$(function () {
    alertSide.notifAjaxRefresh()
})

alertSide.todoData = ko.observableArray([])
alertSide.todoEditState = ko.observable("READ")
alertSide.todoAjaxState = ko.observable("LOAD")
alertSide.todoEditStateIs = function(val) {
    console.log("OW", alertSide.todoEditState())
    return alertSide.todoEditState() == val
}
alertSide.todoAjaxRefresh = function() {
    alertSide.todoAjaxState("LOAD")
    $.ajax("/dashboard/getnotes", {
        method: "post",
        success: function(body) {
            var comments = _.get(body, "Data.Comments")
            if (typeof comments === "undefined") {
                alertSide.todoAjaxState("ERROR")
                return
            }

            alertSide.todoData(comments)
            alertSide.todoAjaxState("DONE")
        }
    })
}
// load notifData
$(function () {
    alertSide.todoAjaxRefresh()
})

alertSide.todoEnableEdit = function(state) {
    if (state === true)
        alertSide.todoEditState("EDIT")
    else
        alertSide.todoEditState("READ")
}
alertSide.todoAdd = function () {
    alertSide.todoData.push({
        Text: "",
        Checked: false,
        CreatedDate: moment().toISOString()
    })
    alertSide.todoEnableEdit(true)
    console.log(alertSide.todoData())
}
alertSide.todoRemove = function (index) {
    var todo = alertSide.todoData()
    todo.splice(index, 1)
    alertSide.todoData(todo)
    alertSide.todoSave()
}
alertSide.todoSave = function() {
    console.log(alertSide.todoData())
    alertSide.todoEnableEdit(false)
    $.ajax("/dashboard/savenotes", {
        method: "post",
        data: JSON.stringify({
            comments: alertSide.todoData()
        }),
        contentType: "application/json",
        success: function(body) {
            console.log(body)
            alertSide.todoAjaxRefresh()
        }
    })
}