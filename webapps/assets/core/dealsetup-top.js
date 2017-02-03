var setup = {}

setup.columnGrid = [
  {
    title : "Customer Name",
    field : "CustomerProfile.applicantdetail.CustomerName",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      return '<a onClick="setup.onClickCustomerName(\''+dt.CustomerProfile._id+'\')">'+dt.CustomerProfile.applicantdetail.CustomerName+'</a>'
    }
 },
 {
    title : "Deal No",
    field : "CustomerProfile.applicantdetail.DealNo",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
     return '<a onClick="setup.onClickDealNo(\''+dt.Id+'\',\''+dt.CustomerProfile._id+'\')">'+dt.CustomerProfile.applicantdetail.CustomerName+'</a>'
    }
 },
 {
    title : "Current Status",
    // field : "Info.myInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.myInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.myInfo[count].status 
    }
 },
 {
    title : "Previous Status",
    // field : "Info.myInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.myInfo.length
      // count = count > 0 ? count-1 : 0 
      count = count > 0 ? count-2 : 0
      return dt.Info.myInfo[count] == undefined || dt.Info.myInfo[count] == null ? "" : dt.Info.myInfo[count].status
    }
 },
 {
    title : "Time Stamp of status change",
    // field : "Info.myInfo[0].updateTime",
    width : 200,
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
    width : 200,
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
    width : 200,
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
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.bsiInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.bsiInfo[count].status 
    }
 },
 {
    title : "Stock & Book Debt",
    field : "Info.sbdInfo[0].status",
    width : 200,
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
    width : 200,
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
    width : 200,
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
    width : 200,
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
    width : 200,
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
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      var count = dt.Info.ddInfo.length
      count = count > 0 ? count-1 : 0 
      return dt.Info.ddInfo[count].status 
    }
 }
]

setup.createGrid = function(){
  ajaxPost("/dealsetup/getalldatadealsetup", {}, function(data){
    // console.log(data)
    dbgrid = $("#gridDealSetup").kendoGrid({
       dataSource: {
        data : data,
        pageSize: 10
       },
       columns : setup.columnGrid,
       // groupable: true,
       scrollable : true,
       pageable: true,
       height:450,
      //  dataBinding: function(x) {
      //   setTimeout(function(){
      //     _.each($(".intable").parent(),function(e){
      //       $(e).css("padding",0)
      //     })
      //   },10)
      // }
    }).data("kendoGrid");
  })
}


setup.onClickCustomerName = function(id){
  console.log(id)
}

// setup.onClickDealNo = function(id){
//   console.log(id)
// }

$(function(){
	setup.createGrid()
}) 