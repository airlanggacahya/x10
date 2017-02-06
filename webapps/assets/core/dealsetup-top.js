var setup = {}
setup.searchValueCustomerName = ko.observable('')
setup.searchValueDealNo = ko.observable('')
setup.IdCustomerName = ko.observable('')

setup.columnGrid = [
  {
    title : "Customer Name",
    field : "CustomerProfile.applicantdetail.CustomerName",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      return '<a style="cursor: pointer" onClick="setup.onClickCustomerName(\''+dt.CustomerProfile._id+'\')">'+dt.CustomerProfile.applicantdetail.CustomerName+'</a>'
    }
 },
 {
    title : "Deal No",
    field : "CustomerProfile.applicantdetail.DealNo",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
     return '<a onClick="setup.onClickDealNo(\''+dt.Id+'\',\''+dt.CustomerProfile._id+'\')">'+dt.CustomerProfile.applicantdetail.DealNo+'</a>'
    }
 },
 {
    title : "Current Status",
    // field : "Info.myInfo[0].status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.myInfo.length
      count = count > 0 ? count-1 : 0 
      return "<a onclick='setup.getCurrenStatusDetails(\""+dt.Id+"\")'>"+dt.Info.myInfo[count].status+"</a>" 
    }
 },
 {
    title : "Previous Status",
    // field : "Info.myInfo[0].status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.myInfo.length
      // count = count > 0 ? count-1 : 0 
      count = count > 0 ? count-2 : 0
      return dt.Info.myInfo[count] == undefined || dt.Info.myInfo[count] == null ? "" : dt.Info.myInfo[count].status
    }
 },
 {
    title : "Time Stamp of <br>status change",
    // field : "Info.myInfo[0].updateTime",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.myInfo.length
      count = count > 0 ? count-1 : 0 
      return kendo.toString(jsonDate(dt.Info.myInfo[count].updateTime), 'dd MMM yyyy')
    }
 },
 {
    title : "CA Form",
    // field : "Info.caInfo[0].status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.caInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.caInfo[count].status 
    }
 },
 {
    title : "CIBIL Details",
    // field : "Info.cibilInfo[0].status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.cibilInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.cibilInfo[count].status 
    }
 },
 {
    title : "Balance Sheet Inputs",
    // field : "Info.bsiInfo[0].status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.bsiInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.bsiInfo[count].status 
    }
 },
 {
    title : "Stock & Book Debt",
    // field : "Info.sbdInfo[0].status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.sbdInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.sbdInfo[count].status 
    }
 },
 {
    title : "Account Details",
    // field : "Info.adInfo[0].status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.adInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.adInfo[count].status 
    }
 },
 {
    title : "Banking Analysis",
    // field : "Info.baInfo[0].status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.baInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.baInfo[count].status 
    }
 },
 {
    title : "External RTR",
    // field : "Info.ertrInfo[0].status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.ertrInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.ertrInfo[count].status 
    }
 },
 {
    title : "Internal RTR",
    // field : "Info.irtrInfo[0].status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.irtrInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.irtrInfo[count].status 
    }
 },
 {
    title : "Due Diligence",
    // field : "Info.ddInfo[0].status",
    width : 150,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.ddInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.ddInfo[count].status 
    }
 }
]

setup.createGrid = function(){
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
      // sortable: true,
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

$(function(){
	setup.createGrid()
}) 