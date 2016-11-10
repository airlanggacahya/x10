var frl = {}
frl.AllDataFile = ko.observableArray([]);
frl.FilterFile = ko.observableArray([]);
frl.dataListFile = ko.observableArray([]);
frl.filter = ko.observableArray([])

frl.onfilter = function(){
	$("#filter").keydown(function(){
		var str = $("#filter").val();
		str = (str).toLowerCase();
		if(str != ""){
			frl.filter([])
			var res = _.filter(frl.AllDataFile(), function(data){
				return data.NameFile.toLowerCase().indexOf(str) > -1;
			});
			if(res != undefined){
				frl.filter(res);
				frl.renderGrid()
			}
		}else{
			frl.getData()	
		}
	});
}


frl.getData = function(){
	frl.filter([])
	frl.AllDataFile([])
	var param = {};
	var url = "/formsandreportlogic/getallfile"
	ajaxPost(url, param, function(res){
		frl.AllDataFile(res)
		frl.filter(res)
		frl.renderGrid()
		$.each(res, function(i, item){
			frl.dataListFile.push(item.NameFile)
		})
		
	})
}

frl.renderGrid = function(){
	$(".grid").html("");
    $(".grid").kendoGrid({
            dataSource: frl.filter(),
            columnMenu: false,
	        dataBound: function () {
				app.gridBoundTooltipster('.grid')()
				
			},
            columns: [
                {
                    field:"NameFile",
                    title:"Name of File",         
                    width:300,
                    headerAttributes: {class: 'k-header header-bgcolor'},
                },
                {
                    field:"Upload",
                    title:"Last Upload",
                    width:200,
                    headerAttributes: {class: 'k-header header-bgcolor'},
                    template: function(d){
                    	return kendo.toString(new Date(d.Upload),"dd-MM-yyyy HH:mm");
                    }
                },
                {
                    // field:"",
                    title:"",
                    width:40,
                    headerAttributes: {class: 'k-header header-bgcolor'},
                    template: function(d){
                    	return [
                    	"<button class='btn btn-xs btn-primary tooltipster' title='Download File' onclick='frl.download(\""+d.NameFile+"\")'><i class='fa fa-download'></i></button>",
                    	"<a type='button' class='btn btn-xs btn-success tooltipster' title='Open File' target='_blank' href='/static/pdf/"+d.NameFile+"'><i class='fa fa-folder-open-o'></i></a>",
                    	].join(' ')
                    }
                },
                
            ]
    });
	console.log(frl.AllDataFile())
	

}

frl.download = function(d){
	var link = document.createElement('a');
	link.href = "/static/pdf/"+d;
	link.download = d;
	link.dispatchEvent(new MouseEvent('click'));
}

$(document).ready(function(){
	frl.getData();
	frl.onfilter();
	// frl.renderGrid();

});