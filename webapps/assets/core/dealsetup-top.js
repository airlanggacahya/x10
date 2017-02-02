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
     return '<a onClick="setup.onClickDealNo(\''+dt.CustomerProfile._id+'\')">'+dt.CustomerProfile.applicantdetail.CustomerName+'</a>'
    }
 },
 {
    title : "Current Status",
    field : "Info.myInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
 },
 {
    title : "Previous Status",
    field : "Info.myInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
 },
 {
    title : "Time Stamp of status change",
    field : "Info.myInfo[0].updateTime",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    template: function(dt){
      return kendo.toString(jsonDate(dt.Info.myInfo[0].updateTime), 'dd MMM yyyy')
    }
 },
 {
    title : "CA Form",
    field : "Info.caInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
 },
 {
    title : "CIBIL Details",
    field : "Info.cibilInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
 },
 {
    title : "Balance Sheet Inputs",
    field : "Info.bsiInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
 },
 {
    title : "Stock & Book Debt",
    field : "Info.sbdInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
 },
 {
    title : "Account Details",
    field : "Info.adInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
 },
 {
    title : "Banking Analysis",
    field : "Info.baInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
 },
 {
    title : "External RTR",
    field : "Info.ertrInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
    // template: function(dt){
    //   console.log(dt.Info.irtrInfo[0].status)
    //   return dt.Info.irtrInfo.splice(-1).status
    // }
 },
 {
    title : "Internal RTR",
    field : "Info.irtrInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
 },
 {
    title : "Due Diligence",
    field : "Info.ddInfo[0].status",
    width : 200,
    headerAttributes: { "class": "sub-bgcolor" },
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

setup.onClickDealNo = function(id){
  console.log(id)
}

$(function(){
	setup.createGrid()
}) 