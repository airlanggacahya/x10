var setup = {}
setup.searchValueCustomerName = ko.observable('')
setup.searchValueDealNo = ko.observable('')
setup.IdCustomerName = ko.observable('')
setup.ListCustomerName = ko.observableArray([])
setup.ListDealNo = ko.observableArray([])
setup.AllCP = ko.observableArray([])
setup.title = ko.observable("Customer Name :  | Dealno : ")

setup.SetAlias = function(status){
  if(status.toLowerCase() == "under process"){
    return "Under Analysis"
  }
  return status 
}

setup.columnGrid = [
  {
    title : "Customer Name",
    field : "CustomerProfile.applicantdetail.CustomerName",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      return '<a style="cursor: pointer;color:#676767;text-decoration: none;" onClick="setup.onClickCustomerName(\''+dt.CustomerProfile._id+'\')">'+dt.CustomerProfile.applicantdetail.CustomerName+'</a>'
    }
 },
 {
    title : "Deal No",
    field : "CustomerProfile.applicantdetail.DealNo",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
     return '<a style="cursor: pointer" onClick="setup.onClickDealNo(\''+dt.Id+'\',\''+dt.CustomerProfile._id+'\',\''+dt.CustomerProfile.applicantdetail.DealNo+'\',\''+dt.CustomerProfile.applicantdetail.CustomerName+'\')">'+dt.CustomerProfile.applicantdetail.DealNo+'</a>'
    }
 },
 {
    title : "Current Status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.myInfo.length
      count = count > 0 ? count-1 : 0 
      return "<a onclick='setup.getCurrenStatusDetails(\""+dt.Id+"\")'>"+setup.SetAlias(dt.Info.myInfo[count].status)+"</a>" 
    }
 },
 {
    title : "Previous Status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.myInfo.length
      count = count > 0 ? count-2 : 0
      return setup.SetAlias(dt.Info.myInfo[count] == undefined || dt.Info.myInfo[count] == null ? "" : dt.Info.myInfo[count].status)
    }
 },
 {
    title : "Time Stamp of <br>status change",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.myInfo.length
      count = count > 0 ? count-1 : 0 
      return kendo.toString(jsonDate(dt.Info.myInfo[count].updateTime), 'dd MMM yyyy hh:mm tt')
    }
 },
 {
    title : "CA Form",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.caInfo.length
      count = count > 0 ? count-1 : 0 
      return setup.SetAlias(dt.Info.caInfo[count].status)
    }
 },
 {
    title : "CIBIL Details",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.cibilInfo.length
      count = count > 0 ? count-1 : 0 
      return setup.SetAlias(dt.Info.cibilInfo[count].status)
    }
 },
 {
    title : "Balance Sheet Inputs",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.bsiInfo.length
      count = count > 0 ? count-1 : 0 
      return setup.SetAlias(dt.Info.bsiInfo[count].status)
    }
 },
 {
    title : "Stock & Book Debt",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.sbdInfo.length
      count = count > 0 ? count-1 : 0 
      return setup.SetAlias(dt.Info.sbdInfo[count].status)
    }
 },
 {
    title : "Account Details",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.adInfo.length
      count = count > 0 ? count-1 : 0 
      return setup.SetAlias(dt.Info.adInfo[count].status)
    }
 },
 {
    title : "Banking Analysis",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.baInfo.length
      count = count > 0 ? count-1 : 0 
      return setup.SetAlias(dt.Info.baInfo[count].status)
    }
 },
 {
    title : "External RTR",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.ertrInfo.length
      count = count > 0 ? count-1 : 0 
      return setup.SetAlias(dt.Info.ertrInfo[count].status)
    }
 },
 {
    title : "Internal RTR",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.irtrInfo.length
      count = count > 0 ? count-1 : 0 
      return setup.SetAlias(dt.Info.irtrInfo[count].status)
    }
 },
 {
    title : "Due Diligence",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.ddInfo.length
      count = count > 0 ? count-1 : 0 
      return setup.SetAlias(dt.Info.ddInfo[count].status)
    }
 },
 // {
 //    title : "Decision Committee",
 //    width : 150,
 //    hidden : true,
 //    headerAttributes: { "class": "sub-bgcolor" },
 //    template: function(dt){
 //      var count = dt.Info.dcfInfo.length
 //      count = count > 0 ? count-1 : 0 
 //      return dt.Info.dcfInfo[count].status 
 //    }
 // },
 // {
 //    title : "Credit Analyst",
 //    width : 150,
 //     hidden : true,
 //    headerAttributes: { "class": "sub-bgcolor" },
 //    template: function(dt){
 //      var count = dt.Info.cacInfo.length
 //      count = count > 0 ? count-1 : 0 
 //      return dt.Info.cacInfo[count].status 
 //    }
 // }
]

setup.createGrid = function(){
  $("#gridDealSetup").html('')
  dbgrid = $("#gridDealSetup").kendoGrid({
    dataSource: {
        serverPaging: true,
        serverSorting: true,
        transport: {
          read: {
            url: "/dealsetup/getalldatadealsetup",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
          },
          parameterMap: function(options) {
            // console.log(options);
            options.SearchCustomerName = setup.searchValueCustomerName()
            options.SearchDealNo = setup.searchValueDealNo()
            options.Id = setup.IdCustomerName()
            return JSON.stringify(options);
          }
        },
        pageSize: 10,
        schema: {
          data: "Data",
          total: "Total"
        },
      },
      groupable: false,
      sortable: false,
      filterable: false,
      pageable: {
          refresh: true,
          pageSizes: true,
          buttonCount: 5
        },
    columns : setup.columnGrid,
  }).data("kendoGrid");

}


setup.onChangeSearchCustomerName = function(){
  setup.createGrid();
}

setup.onChangeSearchDealNo = function(){
  setup.createGrid();
}

setup.onClickCustomerName = function(id){
  setup.IdCustomerName(id)
  if (setup.IdCustomerName() !== ''){
    setup.createGrid();
  }
}

setup.resetDealSetup = function(){
  setup.searchValueCustomerName('')
  setup.searchValueDealNo('')
  setup.IdCustomerName('')
  setup.createGrid(); 
}

setup.filterChange = function(){
  // setup.readUrlParam()
  var val = _.filter(setup.AllCP(), function(dt){
    return dt.CustomerName == setup.searchValueCustomerName()
  })
  
  if( val != undefined){
    try{
      // console.log("------->>>",val)
        setup.ListDealNo([]);
        $.each(val, function(i, tem){
          setup.ListDealNo.push(tem.DealNo)
        })
        if(val.length == 1){
          setup.searchValueDealNo(val[0].DealNo)
        }
        

    }catch(e){

    }
    
  }
}

window.refreshFilter = function(){
  setup.IdCustomerName('')
  setup.detailIsShow(false)
  if(setup.searchValueCustomerName() == ""){
    swal("", "Please Select Filter", "warning");
    str = "Customer Name :  | Dealno : ";
   setup.title(str)
    return;
  }
  setup.createGrid()
   str = "Customer Name : "+ setup.searchValueCustomerName() +" | Dealno : "+ setup.searchValueDealNo();
   showFilter(true);
   setup.title(str)
}

window.resetFilter = function() {
  setup.searchValueCustomerName("");
  setup.searchValueDealNo("");
  str = "Customer Name :  | Dealno : ";
  setup.title(str)
   showFilter(true);
  
  setup.createGrid()
}

setup.readUrlParam = function(){
    setup.filterChange()
    var q_str = {};
    var q = window.location.search.substring(1);
    var vr = q.split("&");
    if(vr.length != 1 && vr[0] != ""){
        $.each(vr, function(i, item){
            var p = item.split("=");
            if(typeof q_str[p[0]] == "undefined"){
                q_str[p[0]] = decodeURIComponent(p[1]);
            }else if(typeof q_str[p[0]] == "string"){
                var ar = [q_str[p[0], decodeURIComponent(p[1])]]
                q_str[p[0]] = ar
            }else{
                q_str[p[0].push(decodeURIComponent(p[1]))]
            }
        })
        // console.log("-------------->>>", q_str.dealno)
        setup.searchValueCustomerName(q_str.customername)
        setTimeout(function(){
          setup.searchValueDealNo(q_str.dealno)
        }, 200)
        
    }

}

$(function(){
  // setup.filterChange(
  setTimeout(function(){
    setup.readUrlParam()
    setup.createGrid()
  }, 500)
	
}) 