var frl = {}

frl.dataDummy = [
	{srno: "123455", namefile: "dicoba.pdf", lastupload: "22-august-2016"},
	{srno: "123455", namefile: "dicoba.pdf", lastupload: "22-august-2016"},
	{srno: "123455", namefile: "dicoba.pdf", lastupload: "22-august-2016"},
]

frl.renderGrid = function(){

	$(".grid").html("");
    $(".grid").kendoGrid({
            dataSource: frl.dataDummy,
            columnMenu: false,
	        dataBound: function () {
				app.gridBoundTooltipster('.grid')()
				
			},
            columns: [
                {
                    field:"srno",
                    title:"SR. No",
                    width:150,
                    headerAttributes: {class: 'k-header header-bgcolor'},
                    // template: 

                },
                {
                    field:"namefile",
                    title:"Name of File",         
                    width:300,
                    headerAttributes: {class: 'k-header header-bgcolor'},
                },
                {
                    field:"lastupload",
                    title:"Last Upload",
                    width:200,
                    headerAttributes: {class: 'k-header header-bgcolor'},
                },
                {
                    // field:"",
                    title:"",
                    width:40,
                    headerAttributes: {class: 'k-header header-bgcolor'},
                    template: function(d){
                    	return [
                    	"<button class='btn btn-xs btn-primary tooltipster' title='Download File'><i class='fa fa-download'></i></button>",
                    	"<button class='btn btn-xs btn-success tooltipster' title='Open File''><i class='fa fa-folder-open-o'></i></button>",
                    	].join(' ')
                    }
                },
                
            ]
    });

}

$(document).ready(function(){
	frl.renderGrid();

});