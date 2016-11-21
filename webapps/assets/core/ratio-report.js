model.Processing = ko.observable(true)

var ratioReport = {}; var r = ratioReport;
r.data = ko.observableArray([])
r.dates = ko.observableArray([])
r.fileType = ko.observable('')
r.DataInput = ko.observableArray([]);
r.isLoading = function (what) {
    $('.apx-loading')[what ? 'show' : 'hide']()
    $('.app-content')[what ? 'hide' : 'show']()
    if(!what){
        setTimeout(function(){
            r.addScrollBottom();
        },1000);
    }
}

r.getDataMaster = function(callback){
     var param = {}
    param.customerId = r.customerId()
      ajaxPost("/ratio/getratioinputdataallconfirmed", param, function (res) {
            if (res.Data != null){
              r.DataInput(res.Data)
              if (typeof callback === 'function') {
                  callback()
              }
            }
          });
}

refreshFilter = function () {
    if (r.getCustomerId() === false) {
        return
    }

  r.getDataMaster(function(){

	r.data([])
	r.dates([])

	var param = {}
	param.CustomerId = r.customerId().split('|')[0]
	param.DealNo = r.customerId().split('|')[1]
	param.ForModule = 'ratio report'

	r.isLoading(true)
	app.ajaxPost('/ratio/getreportdata', param, function (res) {
		if (res.Message != '') {
			sweetAlert("Oops...", res.Message, "error");
			r.isLoading(false)
			return
		}

    if(res.Data.AuditStatus.length > 0) {
      var currentdata = _.map(r.DataInput().FormData,function(x) {  return x.FieldId.split("-")[1] });
      res.Data.FormData = _.filter(res.Data.FormData,function(x){ return currentdata.indexOf(x.RealId) > -1 || x.RealId == "" });

      r.data(res.Data.FormData)
      r.dates(_.orderBy(res.Data.AuditStatus, 'Date', 'asc'))
      r.isLoading(false)
      r.render("PROFIT & LOSS ACCOUNT")
      r.render("RATIO")
    } else {
      sweetAlert("Oops...", "Data Not Found", "error");
      r.isLoading(false)
      return
    }
	})
  });


}
r.render = function (a) {
  r.fileType(a)
  _.each($('.tabme nav ul li'),function(v,i){

    $(v).removeClass('tab-current')
    aa = $(v).find('a').html()
    aa = aa.replace("&amp;", "&");
    if( aa == a ){
      $(v).addClass('tab-current')
    }

  })

	var data = r.constructData(r.data(), a)
	var dataSource = new kendo.data.TreeListDataSource({
		data: data,
		schema: {
			model: {
				expanded: true,
			}
		}
	})

	var columns = [
    { headerTemplate: 'Particulars (in Rs. Lacs)<br>&nbsp;', headerAttributes: { style: 'color:white; background-color: #313d50;' }, template: function (d) {
    	var isFormula = d.IsFromFormula
    	if (typeof isFormula === 'undefined') {
    		isFormula = false
    	}

    	if (d.Type == 'Field') {
    		return '<span data-is-formula=' + (isFormula ? 'true' : 'false') + '>' + d.Name + '</span>';
    	}

    	return "<span style='font-weight: bold;' data-type='" + d.Type + "'>" + d.Name + "</span>";
    }, locked: true, width: 400 },
    { template: function (d) {
    	var className = 'btn-primary';

		switch (d.Type) {
			case 'Section': {
			className = 'btn-primary';
			} break;
			case 'Sub Section': {
				className = 'btn-warning';
			} break;
			case 'Field': {
				className = 'btn-success';
			} break;
		}

		return "<button class='btn btn-tag btn-xs " + className + "'>" + d.Type + "</button>";
    }, hidden: true, locked: true, width: 100, attributes: { style: 'text-align: center;' }, headerTemplate: '<center>Type</center>' },
  ]

  lastAuditedYear = (function () {
    let years = r.dates().filter(function (d) { return d.Status == "AUDITED" })
    return years[years.length - 1].Date
  })()

    r.dates().forEach(function (d, i) {
      var columnTitle = moment(d.Date, 'DD-MM-YYYY').format('MMM-YY')
    	var columnTitleGrowth = moment(d.Date, 'DD-MM-YYYY').add(1,'year').format('MMM-YY')
      var Statuss = d.Status.replace("PROVISION", "PROVISIONAL")
    	columns.push({
    		title: toTitleCase(Statuss)+" "+columnTitle,
    		width: 120,
    		attributes: { style: 'text-align: right;' },
    		headerAttributes: {
    			style: 'color:white; background-color: #313d50;'
    			// 'data-label-1': '',
    			// 'data-label-2': d.Status+" "+columnTitle,
    			// 'data-label-3': columnTitle,
    		},
    		template: function (e) {
    			if (e.Type != 'Field') {
    				return
    			}

          if (e.SubSection == "KEY RATIOS") {
            return "<span data-what='key-ratio' data-name='" + e.Name + "'>" + e.ColumnData[i].FormattedValue + "</span>"

            // if (lastAuditedYear != d.Date) {
            //   return 'n/a'
            // }
          }

    			return e.ColumnData[i].FormattedValue
    		}
    	})

    	if (i < (r.dates().length - 1)) {
	    	columns.push({
	    		headerTemplate : '% Growth in </br>'+columnTitleGrowth,
	    		width: 120,
	    		attributes: { style: 'text-align: right;background-color: rgb(195, 220, 236);' },
	    		headerAttributes: {
	    			style: 'color:white; background-color: #313d50;'
	    			// 'data-label-1': '',
	    			// 'data-label-2': '% Growth in '+columnTitle,
	    			// 'data-label-3': columnTitle,
	    		},
	    		template: function (e) {
	    			if (["RATIO", "CASH FLOW STATEMENT"].indexOf(e.Section) > -1) {
	    				return
	    			}

	    			if (e.Type != 'Field') {
	    				return
	    			}

	    			var growthValue = 0
	    			var target = e.ColumnData.find(function (g) { return g.Date == d.Date })
	    			if (typeof target !== 'undefined') {
	    				growthValue = target.Growth
	    			}

	    			var growth = kendo.format('{0:n2}', growthValue)
	    			return kendo.format('{0:n2}', growthValue) + ' %'
	    		}
	    	})
    	}
    })

	var config = {
    // toolbar: ["excel"],
    // excel: {
    //             fileName: "Kendo UI Grid Export.xlsx",
    //             // proxyURL: "//demos.telerik.com/kendo-ui/service/export",
    //             filterable: true
    // },
		dataSource: dataSource,
		columns: columns,
		dataBound: function () {
			$grid = $('.grid .k-grid-content')
			$('[data-is-formula="true"]').each(function (i, e) {
			    var $rowHeader = $(e).closest('tr').addClass('is-formula')
			    $grid.find('tr:eq(' + $rowHeader.index() + ')').addClass('is-formula')
			})
      $('[data-is-formula="false"]').each(function (i, e) {
          var $rowHeader = $(e).closest('tr').addClass('not-formula')
          $grid.find('tr:eq(' + $rowHeader.index() + ')').addClass('not-formula')
      })

			var $container = $('.grid .k-grid-header-wrap thead')
			// var $tr2 = $('<tr />').appendTo($container)
			// var $tr3 = $('<tr />').appendTo($container)

			$('[data-label-1]').each(function (i, e) {
				// if (['AUDITED', 'UNAUDITED'].indexOf($(e).attr('data-label-1')) > -1) {
				// 	var klass = ($(e).attr('data-label-1') == 'AUDITED') ? 'btn-success' : 'btn-warning'
				// 	let text = '<button class="btn btn-tag btn-xs ' + klass + '">' + $(e).attr('data-label-1') + '</button>'
				// 	$(e).html(text).css('background-color', 'transparent')
				// } else {
				// 	$(e).html($(e).attr('data-label-1'))
				// }
				//
				// $('<th />').addClass('k-header header-bgcolor').attr('role', 'columnheader').appendTo($tr2).html($(e).attr('data-label-2'))
				// $('<th />').addClass('k-header header-bgcolor').attr('role', 'columnheader').appendTo($tr3).html($(e).attr('data-label-3'))
			})

      // when the time comes, this legendary loop will need to be recoded
      // ==========> LEGENDARY LOOP START
      $('[data-what="key-ratio"]').parent().parent().each(function (i, e) {
        var isFound = false
        var writeNA = function (d) {
            $(d).find('span').html('NA')
        }

        $(e).find('td').get().reverse().forEach(function (f, j) {
          if (isFound) {
            writeNA(f)
            return
          }

          var text = $(f).find('span').text()
          if ($.trim(text) == '') {
            writeNA(f)
            return
          }

          var number = toolkit.getNumberFromString(text)
          if (number == 0) {
            writeNA(f)
            return
          }

          switch ($(e).find('span:eq(0)').attr('data-name')) {
            case 'Leverage Including X10 (TOL/TNW)':
            case 'Gearing (times) including X10 Loan':
              if (number > 20) {
                writeNA(f)
                return
              }
            break

            case 'BTO% against FY 14 TO':
              if (number > 10000) {
                writeNA(f)
                return
              }
            break
          }

          if (number > 0) {
            isFound = true
          }

        })
      })
      // ==========> LEGENDARY LOOP FINISH

      $('.grid .k-grid-header-locked tr').css('min-height', '30px').css('height', '30px')
			$('thead tr').css('min-height', '30px').css('height', '30px')
			$('.grid .k-grid-header-locked tr th').css('vertical-align', 'middle')

      r.dates().forEach(function (d, i) {
        if(d.Na.toLowerCase() == "na") {
          var rowFormula = $('.k-grid-content tr.is-formula')
          var rowNotFormula = $('.k-grid-content tr.not-formula')
          if(i == 0) {
            rowFormula.find('td:eq('+i+')').text("N/A")
            rowNotFormula.find('td:eq('+i+')').text("N/A")
          } else {
             if( r.fileType() !="RATIO"){
                rowNotFormula.find('td:eq('+((i*2)-1)+')').text("N/A")
                rowFormula.find('td:eq('+((i*2)-1)+')').text("N/A")
             }

              rowFormula.find('td:eq('+(i*2)+')').text("N/A")
              rowNotFormula.find('td:eq('+(i*2)+')').text("N/A")

            }
          }
          //console.log(i)

          // //if(i==)
          // //
      })

			$('[data-type="Section"],[data-type="Sub Section"]').each(function (i, d) {
			    var uid = $(d).closest('tr').attr('data-uid')
			    var row = $('.k-grid-content tr[data-uid="' + uid + '"]')
			    row.find('td:eq(0)').attr('colspan', r.dates().length * 2 - 1).val("")
			    row.find('td:gt(0)').remove()
			})
		}
	}

	$('.grid').replaceWith('<div class="grid"></div>')
	$('.grid').kendoTreeList(config)

  $('.form-container').css('width','1300px')
  $('.k-grid-header-wrap').css('width','890px')
  $('.k-grid-content').css('width','890px').css('overflow-y','hidden');

  r.addScrollBottom();

  v = _.groupBy(r.dates(), "Status")
  _.each($('.scroll-grid-bottom').parent().find('.arrow'),function(v,i){

    $(v).css("text-align","center")
    $(v).find('i').css("padding-top","4px")

  })
  setTimeout(function(){
      if(v.AUDITED.length == 4){
          $('.content-grid-bottom').parent().animate({scrollLeft:480}, '300', 'swing', function() {
          });
          // console.log("ada 4");
      } else if(v.AUDITED.length == 3){
            $('.content-grid-bottom').parent().animate({scrollLeft:240}, '300', 'swing', function() {
          });
          // console.log("ada 3");
      } else if(v.AUDITED.length == 2){
           $('.content-grid-bottom').parent().animate({scrollLeft:0}, '300', 'swing', function() {
          });
          // console.log("ada 2");
      } else{
          // console.log("tidak ada");
      }
   $(".form-container").show();
  },2000);

}
r.constructData = function (res,a) {
	var flat = []

	var opSection1 = _.groupBy(res, 'SectionName');
	var opSection2 = _.map(opSection1, function (v, k) {
		return { key: k, data: v, order: _.minBy(v, 'FieldOrder').FieldOrder };
	});
	var opSection3 = _.orderBy(opSection2, 'order');
	var i = 1, j = 1;
	opSection3.forEach(function (section) {
		var sectionId = 'section-' + i;
    if(section.key == a){
  		flat.push({
  			id: sectionId,
  			parentId: null,
  			Order: _.minBy(section.data, 'FieldOrder').FieldOrder,
  			Name: section.key,
  			Type: 'Section'
  		});
    }
		i++;

		var opSubSection1 = _.groupBy(section.data, 'SubSectionName');
		var opSubSection2 = _.map(opSubSection1, function (v, k) {
			return { key: k, data: v, order: _.minBy(v, 'FieldOrder').FieldOrder };
		});
		var opSubSection3 = _.orderBy(opSubSection2, 'order')
		opSubSection3.forEach(function (subSection) {
			var subSectionId = sectionId

			if (subSection.key != '') {
				subSectionId = 'sub-section-' + j;
				flat.push({
					id: subSectionId,
					parentId: sectionId,
					Order: _.minBy(subSection.data, 'FieldOrder').FieldOrder,
					ParentName: section.key,
					Name: subSection.key,
					Type: 'Sub Section'
				});
			}
			j++

			_.orderBy(subSection.data, 'FieldOrder').forEach(function (field) {
				var isFromFormula = (field.Type === 'Formula')
				var values = _.orderBy(field.Values, 'Date', 'asc')
				values = values.map(function (d, i) {
					d.Growth = 0

					if (i > 0) {
						var currentYearValue = d.Value
						var previousYearValue = values[i - 1].Value

						values[i - 1].Growth = toolkit.number((currentYearValue - previousYearValue) / previousYearValue * 100)
					}

					return d
				})
        if(section.key == a){
			var dt = {
					id: field.Id,
  					parentId: subSectionId,
  					Order: field.FieldOrder,
  					Name: field.FieldName,
  					Section: section.key,
  					// SubSection: subSection.key,
  					Type: 'Field',
  					ColumnData: values,
  					IsFromFormula: isFromFormula,
			}
			if (field.FieldName == 'Gross Profit Margin %'){
				dt.SubSection = 'Profitable Ratio'
				flat.push(dt)
			}else{
				flat.push({
  					id: field.Id,
  					parentId: subSectionId,
  					Order: field.FieldOrder,
  					Name: field.FieldName,
  					Section: section.key,
  					SubSection: subSection.key,
  					Type: 'Field',
  					ColumnData: values,
  					IsFromFormula: isFromFormula,
  				});
			}
        }
			});
		});
	});
	console.log(flat)
	return flat;
}
r.customerId = ko.observable('')
r.getCustomerId = function () {
    var customer = $('.jf-tbl select:eq(0)').data('kendoDropDownList').value()
    var dealNumber = $('.jf-tbl select:eq(1)').data('kendoDropDownList').value()

    if (customer == '') {
        // sweetAlert("Oops...", "Customer cannot be empty", "error");
        return false
    }
    if (dealNumber == '') {
        // sweetAlert("Oops...", "Deal number cannot be empty", "error");
        return false
    }

    r.customerId([customer, dealNumber].join('|'))

    return [customer, dealNumber].join('|')
}

r.addScrollBottom = function (container) {
    $('.scroll-grid-bottom-yo').remove();
    $('.scroll-grid-bottom').remove();

    if (container == undefined) container = $(".form-container");

    toolkit.newEl('div').addClass('scroll-grid-bottom-yo').appendTo(container.find(".k-grid-content"));

    var tableContent = toolkit.newEl('div').addClass('scroll-grid-bottom').appendTo(container.find(".k-grid-content"));

    var arrowLeft = toolkit.newEl('div').addClass('scroll-grid-bottom arrow arrow-left viewscrollfix btn-add').html('<i style="padding:5px" class="fa fa-arrow-left"></i>').appendTo(container.find(".k-grid-content")).css("margin-left","-15px");

    var rightmen = ($(window).width() - 1270 ) + "px"
    var arrowRight = toolkit.newEl('div').addClass('scroll-grid-bottom arrow arrow-right viewscrollfix btn-add').html('<i style="padding:5px" class="fa fa-arrow-right"></i>').appendTo(container.find(".k-grid-content")).css("right",rightmen);

    toolkit.newEl('div').addClass('content-grid-bottom')
    .html("&nbsp;").appendTo(tableContent);

    var target = container.find(".scroll-grid-bottom")[0];
    var target2 = container.find(".k-grid-content")[0];
    var toptarget = $(".k-grid-content");
    container.find(".k-grid-content").scroll(function () {
        target.scrollLeft = this.scrollLeft;
        toptarget.scrollLeft(this.scrollLeft);

    });
    container.find(".scroll-grid-bottom").scroll(function () {
        target2.scrollLeft = this.scrollLeft;
        toptarget.scrollLeft(this.scrollLeft);
    });

    $(".k-grid-content").scroll(function () {
        target2.scrollLeft = this.scrollLeft;
        target.scrollLeft = this.scrollLeft;
    });


    var walkLength = 50;

    arrowLeft.on('click', function () {
        var newVal = target.scrollLeft - walkLength;
        if (newVal < 0) {
            newVal = 0;
        }

        target.scrollLeft = newVal;
    });
    arrowRight.on('click', function () {
        var newVal = target.scrollLeft + walkLength;
        if (newVal < 0) {
            newVal = 0;
        }

        target.scrollLeft = newVal;
    });

    r.panel_scrollrelocated();
};

r.panel_scrollrelocated = function () {
    $(".scroll-grid-bottom").each(function (i) {
        $(this).find('.content-grid-bottom').css("min-width", $(this).parent().find('table').width());
        if ($(this).parent().find('.scroll-grid-bottom-yo').size() == 0) {
            return;
        }
        var window_top = $(window).scrollTop() + $(window).innerHeight();
        var div_top = $(this).parent().find('.scroll-grid-bottom-yo').offset().top;
        if (parseInt(div_top, 10) < parseInt(window_top, 10)) {
            $(this).removeClass('viewscrollfix');
            $(this).hide();
            $(this).css("width", "100%");
        } else {
            $(this).show();
            $(this).css("width", $('.k-grid-content').width());
            //console.log(this);
            if (!$(this).hasClass('viewscrollfix')) $(this)[0].scrollLeft = $(this).parent().scrollLeft();
            $(this).addClass('viewscrollfix');
        }
    });
};

r.exportExcel = function(title){

  $("#fake-table").remove();
  $("#temp-table").remove();

  var body = $("body");
  var tempTable = $("<table/>").attr("id", "temp-table").appendTo(body);
  var head = $("<thead/>").attr("id", "head").appendTo(tempTable);
  var tr = $("<tr/>").appendTo(head);
  $("body > div.app > div > div.div-container > div:nth-child(8) > div > div > div.panel-body > div.form-container > div > div.k-grid-header > div.k-grid-header-locked > table > thead > tr > th").eq(0).clone(true).appendTo(tr)
  // $("body > div.app > div > div > div > div > div.app-content > div:nth-child(7) > div > div > div.panel-body > div.form-container > div > div.k-grid-header > div.k-grid-header-locked > table > thead > tr > th.header-bgcolor").clone(true).appendTo(tr);
  // $("body > div.app > div > div > div > div > div.app-content > div:nth-child(7) > div > div > div.panel-body > div.form-container > div > div.k-grid-header > div.k-grid-header-wrap > table > thead > tr>").clone(true).appendTo(tr)
  $("body > div.app > div > div.div-container > div:nth-child(8) > div > div > div.panel-body > div.form-container > div > div.k-grid-header > div.k-grid-header-wrap > table > thead > tr>").clone(true).appendTo(tr)

  var tbody1 = $("<tbody/>");
  var len = $("body > div.app > div > div.div-container > div:nth-child(8) > div > div > div.panel-body > div.form-container > div > div.k-grid-content-locked > table > tbody>").clone(true);

  var tdon = len
  // len.clone(true).appendTo(tbody1);

  var tbody = tbody1.appendTo(tempTable);

  var tr1 = $("<tbody/>")
 $("body > div.app > div > div.div-container > div:nth-child(8) > div > div > div.panel-body > div.form-container > div > div.k-grid-content.k-auto-scrollable > table > tbody>tr").clone(true).appendTo(tr1)
  $.each(len, function(i, items){
    var temptr = $("<tr/>").appendTo(tbody1)
    tdon.eq(i).find("td").eq(0).appendTo(tbody1.find("tr").eq(i))
    $("#temp-table > thead> tr> th").eq(i).removeClass("header-bgcolor")
    tr1.find("tr").eq(i).find("td").appendTo(tbody1.find("tr").eq(i))
  })
  var ondate = kendo.toString(new Date(),"dd-MMM-yyyy_HHmm");
  var ind = title.indexOf("-") + 2;
  title = title.slice(ind);
  var name = title+"_"+r.fileType()+"_"+ondate.toString();
  // var name = title+"_"+r.fileType()+"_"+ ondate.toString();
  var target = toolkit.$("#temp-table");
  var downloader = $('<a />').attr('href', '#')
    .attr('download', name + '.xls')
    .attr('onclick', 'return ExcellentExport.excel(this, \'temp-table\', \'Sheet1\')')
    .html('export')
    .appendTo(body);
  tempTable.find('td').css('height', 'inherit');
  downloader[0].click();
  setTimeout(function () {
    tempTable.remove();
    downloader.remove();
  }, 400);
}

$(function () {
	// $('#refresh').remove()
	r.isLoading(false)
});

$(window).scroll(function(){
   r.panel_scrollrelocated();
});