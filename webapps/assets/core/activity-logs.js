var activeLog = {
    loading : ko.observable(true),
    TitelFilter: ko.observable(" Hide Filter"),
    //list
    listUserName : ko.observableArray([]),
    listActivity : ko.observableArray([
            {"text":"Visit", "value":"VISIT"},
            {"text":"View", "value":"VIEW"},
            {"text":"Save", "value":"SAVE"},
        ]),

    //Filter
    filterActivity : ko.observableArray([]),
    filterUser : ko.observableArray([]),
    filterAccessTime : ko.observable("")
};

activeLog.Search = function(){
    activeLog.GetDataLog();
}

activeLog.Reset = function(){
    activeLog.filterActivity([]);
    activeLog.filterUser([]);
    // activeLog.filterAccessTime(moment(new Date(model.CurrentDate())).format("YYYY-MM-DD"));
    activeLog.filterAccessTime("");
    activeLog.GetDataLog();
}

activeLog.GetDataLog = function(){
    activeLog.loading(false);
    var param =  {
        "Username" :  activeLog.filterUser(),
        "Activity" :  activeLog.filterActivity(),
        "AccessDate" : parseInt(activeLog.filterAccessTime().replace(/-/g , ""))
    };
    var dataSource = [];
    var url = "/activitylog/getdata";
    $("#MasterGridUser").html("");
    $("#MasterGridUser").kendoGrid({
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
                        },
                    },
                    schema: {
                        data: function(data) {
                            activeLog.loading(false);
                            if (data.Data.Count == 0) {
                                return dataSource;
                            } else {
                                return data.Data.Records;
                            }
                        },
                        total: "Data.Count",
                    },
                    pageSize: 15,
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
                columnMenu: false,
            columns: [
                {
                    field:"AccessTime",
                    title:"Access Time",
                    width:150,
                    template: "#= moment(AccessTime).format('YYYY-MM-DD HH:mm:ss') #",
                    attributes: {"class": "align-center"}
                },
                {
                    field:"PageName",
                    title:"Page Name",
                    width:100

                },
                {
                    field:"Activity",
                    title:"Activity",
                    width:100,
                    template: function (d) {
                        if (d.Activity == "VISIT"){
                            return "<b style='color:green'>"+ d.Activity +"</b>";
                        }else if(d.Activity == "VIEW"){
                            return "<b style='color:yello'>"+ d.Activity +"</b>";
                        }else{
                            return "<b style='color:blue'>"+ d.Activity +"</b>";
                        }
                    }
                },
                {
                    field:"Username",
                    title:"User Name",
                    width:100
                },
                {
                    field:"IpAddress",
                    title:"Ip Address",
                    width:100
                },
                ]
    });
}

activeLog.getUserName = function(){
    var param = {
    }
    var url = "/datamaster/getusername";
    activeLog.listUserName([]);
    ajaxPost(url, param, function(res){
        var dataUser = Enumerable.From(res).OrderBy("$.username").ToArray();
        for (var u in dataUser){
            activeLog.listUserName.push({
                "text" : dataUser[u].username,
                "value" : dataUser[u].username,
            });
        }
    });
}

activeLog.toggleFilter = function(){
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
  activeLog.panel_relocated();
  var FilterTitle = activeLog.TitelFilter();
  if (FilterTitle == " Hide Filter") {
    activeLog.TitelFilter(" Show Filter");
  } else {
    activeLog.TitelFilter(" Hide Filter");
  }
}

activeLog.panel_relocated = function(){
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
$(document).ready(function () { 
    $("#filterAccessTime").kendoDatePicker({
        format: 'yyyy-MM-dd',
        depth: 'year'
    });
    activeLog.getUserName();
    activeLog.GetDataLog();
});