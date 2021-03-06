model.Processing = ko.observable(true)

var ratioMaster = {}; var r = ratioMaster;
r.templateNewData = {
	Id: "",
	Section: "",
	SubSection: "",
	Alias: "",
	Field: "",
	Use: true,
};
r.newData = ko.mapping.fromJS(r.templateNewData);
r.masterCustomerProfile = ko.observableArray([])
r.getMasterCustomerProfile = function (callback) {
    r.masterCustomerProfile([]);
    ajaxPost("/datacapturing/getcustomerprofile", {}, function (res) {
        r.masterCustomerProfile(_.sortBy(res, function (d) {
            return d.applicantdetail.CustomerName;
        }))
        if (typeof callback === 'function') {
            callback()
        }
    });
}
r.data = ko.observableArray([]);
r.optionSection = ko.computed(function () {
	return _.map(_.groupBy(r.data(), 'Section'), function (v, k) {
		return k
	}).filter(function (d) {
		return d != '';
	})
}, r.data);

r.optionSubSection = ko.observableArray([]);

// r.optionSubSection = ko.computed(function () {
// 	return  _.map(_.groupBy(_.filter(r.data(),function(x){ return x.Section == r.newData.Section() })  , 'SubSection'), function (v, k) {
// 		return k
// 	}).filter(function (d) {
// 		return d != '';
// 	})
// }, r.data);
r.constructData = function (res) {
	var flat = []

	var opSection1 = _.groupBy(res, 'Section');
	var opSection2 = _.map(opSection1, function (v, k) {
		return { key: k, data: v, order: _.minBy(v, 'Order').Order };
	});
	var opSection3 = _.sortBy(opSection2, 'order');
	var i = 1, j = 1;
	opSection3.forEach(function (section) {
		var sectionId = 'section-' + i;
		flat.push({
			id: sectionId,
			parentId: null,
			Order: _.minBy(section.data, 'Order').Order,
			Name: section.key,
			Type: 'Section'
		});
		i++;

		var opSubSection1 = _.groupBy(section.data, 'SubSection');
		var opSubSection2 = _.map(opSubSection1, function (v, k) {
			return { key: k, data: v, order: _.minBy(v, 'Order').Order };
		});
		var opSubSection3 = _.sortBy(opSubSection2, 'order')
		opSubSection3.forEach(function (subSection) {
			var subSectionId = sectionId

			if (subSection.key != '') {
				subSectionId = 'sub-section-' + j;
				flat.push({
					id: subSectionId,
					parentId: sectionId,
					Order: _.minBy(subSection.data, 'Order').Order,
					ParentName: section.key,
					Name: subSection.key,
					Type: 'Sub Section'
				});
			}
			j++

			_.sortBy(subSection.data, 'Order').forEach(function (field) {
				flat.push({
					id: field.Id,
					parentId: subSectionId,
					Order: field.Order,
					Name: field.Field,
					Section: section.key,
					SubSection: subSection.key,
					Type: 'Field',
					Use: field.Use
				});
			});
		});
	});

	return flat;
}
r.render = function () {
	var data = r.constructData(r.data())
	var dataSource = new kendo.data.TreeListDataSource({
		data: data,
		schema: {
			model: {
				expanded: true,
			}
		}
	})
	var config = {
		dataSource: dataSource,
        columns: [
            { 
            	title: 'Name', 
				headerAttributes: { "class": "k-header header-bgcolor" },
				template: function (d) {
	            	if (d.Type == 'Field') {
	            		return '<span style="font-weight: normal;">' + d.Name + '</span>';
	            	}

	            	return d.Name;
	            } 
	        }, { 
				headerAttributes: { "class": "k-header header-bgcolor" },
				template: function (d) {
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
	            }, width: 100, attributes: { class: 'align-center' }, headerTemplate: '<center>Type</center>' 
	        }, {
				headerAttributes: { "class": "k-header header-bgcolor" },
            	width: 140,
            	attributes: { class: 'align-center' },
            	headerTemplate: '<center>Show in<br />Balance Sheet Inputs</center>',
            	template: function (d) {
	            	var info = '';

	            	if (d.Type == 'Section') {
	            		var original = r.data().filter(function (e) {
	            			return e.Section == d.Name
	            		})
	            		var issue = original.filter(function (e) {
	            			return e.Use
	            		})

	            		if (original.length == issue.length) {
	            			info = 'checked'
	            		}

	            		info += " data-section='" + d.Name + "'"
	            	} else if (d.Type == 'Sub Section') {
	            		var original = r.data().filter(function (e) {
	            			return (e.Section == d.ParentName) && (e.SubSection == d.Name)
	            		})
	            		var issue = original.filter(function (e) {
	            			return e.Use
	            		})

	            		if (original.length == issue.length) {
	            			info = 'checked'
	            		}

	            		info += " data-section='" + d.ParentName + "' data-sub-section='" + d.Name + "'"
	            	} else if (d.Type == 'Field') {
	            		if (d.Use) {
	            			info = 'checked'
	            		}

	            		info += " data-section='" + d.Section + "' data-sub-section='" + d.SubSection + "' data-field='" + d.Name + "'"
	            	}

					var checkbx = model.IsGranted('edit') ?
						"<input type='checkbox' " + info + " onchange='r.setVisibility(this, \"" + d.id + "\", \"" + d.Type + "\", \"" + d.Name + "\", \"" + d.ParentName + "\")' />" :
						"<input type='checkbox' " + info + " disabled onchange='r.setVisibility(this, \"" + d.id + "\", \"" + d.Type + "\", \"" + d.Name + "\", \"" + d.ParentName + "\")' />"
	            	return checkbx
	            }
	        }, { 
				headerAttributes: { "class": "k-header header-bgcolor" },
				template: function (d) {
	            	if (d.Type != 'Field') {
	            		return "&nbsp;"
	            	}

	            	return [
	            		model.IsGranted('edit') ? "<button class='btn btn-xs btn-primary tooltipster' title='Move up' data-direction='up' onclick=\"r.moveTo(this, '" + d.id + "')\"><i class='fa fa-arrow-up'></i></button>" : "",
	            		model.IsGranted('edit') ? "<button class='btn btn-xs btn-success tooltipster' title='Move down' data-direction='down' onclick=\"r.moveTo(this, '" + d.id + "')\"><i class='fa fa-arrow-down'></i></button>" : "",
	            		"&nbsp;",
	            		"<button class='btn btn-xs btn-warning tooltipster' title='Show History' onclick=\"r.getFilledFields(this, '" + d.id + "')\"><i class='fa fa-history'></i></button>",
	            		"&nbsp;",
	            		model.IsGranted('edit') ? "<button class='btn btn-xs btn-primary tooltipster' title='Edit' onclick=\"r.edit(this, '" + d.id + "')\"><i class='fa fa-edit'></i></button>" : "",
	            		model.IsGranted('delete') ? "<button class='btn btn-xs btn-danger tooltipster' title='Remove' onclick=\"r.remove(this, '" + d.id + "')\"><i class='fa fa-trash'></i></button>" : "",
	            	].join('&nbsp;')
	            }, attributes: { class: 'align-center' }, width: 170 
	        },
            // { title: '' }
        ],
        dataBound: function (d) {
			setTimeout(function(){
	        	$('.grid tr [data-direction="up"]:first').css('visibility', 'hidden');
				$('.grid tr [data-direction="down"]:last').css('visibility', 'hidden');
				$('.grid tr.k-treelist-group').addClass('sub-bgcolor');

				app.gridBoundTooltipster('.grid')();
			}, 500);
        }
	}

	r.clearGrid()
	$('.grid').kendoTreeList(config)
}

r.clearGrid = function () {
	$('.grid').replaceWith('<div class="grid"></div>')
}

r.writeDownLoading = function () {
	r.clearGrid()
	$('.grid').html('<center><h3 style="text-decoration: none; border: none;">Loading ...</h3></center>')
}

r.setVisibility = function (o, id, type, name, parentName) {
	if (type == 'Section') {
		var rowDataSection = r.data().filter(function (d) { return d.Section == name })
		rowDataSection.forEach(function (d) {
			d.Use = o.checked;
		})

		$('.grid input[type="checkbox"][data-section="' + name + '"]').prop('checked', o.checked)
	} else if (type == 'Sub Section') {
		var rowDataSubSection = r.data().filter(function (d) {
			return (d.Section == parentName) && (d.SubSection == name)
		})
		rowDataSubSection.forEach(function (d) {
			d.Use = o.checked;
		})

		$('.grid input[type="checkbox"][data-section="' + parentName + '"][data-sub-section="' + name + '"]').prop('checked', o.checked)
	} else if (type == 'Field') {
		var rowData = r.data().find(function (d) { return d.Id == id });
		rowData.Use = o.checked;
	}
	console.log('arguments', arguments)
}
r.moveTo = function (o, id) {
	var direction = $(o).attr('data-direction');
	// var $grid = $('.grid').data('kendoTreeList')
	// var dataSource = $grid.dataSource
	// var data = dataSource.data()

	var rowData = r.data().find(function (d) { return d.Id == id });
	var rowDataPrev, rowDataNext;

	try {
		rowDataPrev = r.data()[r.data().indexOf(rowData) - 1];
	} catch (err) { }

	try {
		rowDataNext = r.data()[r.data().indexOf(rowData) + 1];
	} catch (err) { }

	IsheaderPrev = $(o).closest("tr").prev().html()
	IsheaderNext = $(o).closest("tr").next().html()

	try {
	IsheaderPrev = IsheaderPrev.indexOf("k-i-expand") > -1 || IsheaderPrev.indexOf("k-i-collapse") > -1 ? true : false;
	} catch (err) { IsheaderPrev = false}

	try {
	IsheaderNext = IsheaderNext.indexOf("k-i-expand") > -1 || IsheaderNext.indexOf("k-i-collapse") > -1 ? true : false;
	} catch (err) { IsheaderNext = false}

	// console.log("rowData", rowData, r.data().indexOf(rowData));
	// console.log("rowDataPrev", rowDataPrev, r.data().indexOf(rowData) - 1);
	// console.log("rowDataNext", rowDataNext, r.data().indexOf(rowData) + 1);

	if (direction == 'up' && (typeof rowDataPrev !== 'undefined')) {
		var rowDataPrevCloned = $.extend(true, {}, rowDataPrev);
		var rowDataCloned = $.extend(true, {}, rowData);
		if(IsheaderPrev){
			// rowData.Order = rowDataPrevCloned.Order+1;
			rowData.Section = rowDataPrevCloned.Section;
			rowData.SubSection = rowDataPrevCloned.SubSection;
		}else{
			rowDataPrev.Order = rowDataCloned.Order;
			// rowDataPrev.Section = rowDataCloned.Section;
			// rowDataPrev.SubSection = rowDataCloned.SubSection;

			rowData.Order = rowDataPrevCloned.Order;
			rowData.Section = rowDataPrevCloned.Section;
			rowData.SubSection = rowDataPrevCloned.SubSection;
		}
	}

	if (direction == 'down' && (typeof rowDataNext !== 'undefined')) {
		var rowDataNextCloned = $.extend(true, {}, rowDataNext);
		var rowDataCloned = $.extend(true, {}, rowData);
		if(IsheaderNext){
			// rowData.Order = rowDataNextCloned.Order-1;
			rowData.Section = rowDataNextCloned.Section;
			rowData.SubSection = rowDataNextCloned.SubSection;
		}else{
			rowDataNext.Order = rowDataCloned.Order;
			// rowDataNext.Section = rowDataCloned.Section;
			// rowDataNext.SubSection = rowDataCloned.SubSection;

			rowData.Order = rowDataNextCloned.Order;
			rowData.Section = rowDataNextCloned.Section;
			rowData.SubSection = rowDataNextCloned.SubSection;
		}
	}

	var opRes1 = _.orderBy(r.data(), 'Order')
	var opRes2 = _.map(opRes1, function (d, i) {
		d.Order = (i + 1)
		return d
	})
	var opRes3 = _.orderBy(opRes2, 'Order')

	r.data(opRes3);
	r.render();
}

r.getMasterBalanceSheetInput = function (callback) {
    r.data([]);
    ajaxPost("/ratio/getmasterbalancesheetinput", {}, function (res) {
        r.data(_.sortBy(res, 'Order'))

        if (typeof callback === 'function') {
            callback()
        }
    });
};

r.save = function (nomsg) {
	r.writeDownLoading()

	var param = { data: r.data() }
    app.ajaxPost("/ratio/savemasterbalancesheetinput", param, function (res) {
        if (res.Message != '') {
            sweetAlert("Oops...", res.Message, "error");
            return;
        }

        if(nomsg != true)
        swal("Success!", "Changes saved!", "success");

    	r.refresh()
    });
}

r.refresh = function () {
	r.writeDownLoading()

	r.getMasterBalanceSheetInput(function () {
		r.render()
	})
}

r.showFormAdd = function () {
	$('.modal-add-new').find('select').each(function (i, e) {
		$(e).data('kendoDropDownList').value('')
	})
	ko.mapping.fromJS(r.templateNewData, r.newData)
	$('.modal-add-new').modal('show')

	setTimeout(function(){
		$("#aliasinp").keydown(function(e){
			var charCode = (e.which) ? e.which : e.keyCode;
		    if (!(charCode > 31 && (charCode < 48 || charCode > 57 ))  && charCode  != 8 || [189,187,219,220,221,222,186,188,191,190,32].indexOf(charCode) > -1) {
		        return false;
		    }
		    return true;
		});
	},500)
}

r.emptyDropDown = function (o) {
	var $target = $(o).closest('.col-sm-12').next().find('select')
	$target.data('kendoDropDownList').value('')
}

r.saveNewData = function (e) {
	e.preventDefault();

	var info = ko.mapping.toJS(r.newData)

	if (info.Id == '') {
		var rowBySection = r.data().filter(function (d) {
			return d.Section == info.Section
		})
		if (rowBySection.length > 0) {
			var rowBySubSection = rowBySection.filter(function (d) {
				return d.SubSection == info.SubSection
			})
			if (rowBySubSection.length > 0) {
				rowBySection = rowBySubSection
			}
		}

		if (rowBySection.length > 0) {
			info.Order = _.maxBy(rowBySection, 'Order').Order + 1
		} else {
			info.Order = _.maxBy(r.data(), 'Order').Order + 1
		}

		var listorder = [];
		listorder.push(info.Order)

		r.data().forEach(function(x,i){
			var currorder = x.Order;
			if(listorder.indexOf(currorder) > -1){
				x.Order = _.max(listorder) + 1
			}
			listorder.push(x.Order);
		});

		//r.render();
		r.save(true);
	}

	setTimeout(function(){	
		info.Alias = info.Alias.toUpperCase();

	    app.ajaxPost("/ratio/addmasterbalancesheetinput", info, function (res) {
	        if (res.Message != '') {
	            sweetAlert("Oops...", res.Message, "error");
	            return;
	        }

	        swal("Success!", "New item saved!", "success");
	    	r.refresh()
	    	$('.modal-add-new').modal('hide')
	    });
    },500);
};

r.edit = function (o, id) {
	var rowData = r.data().find(function (d) { return d.Id == id })
	ko.mapping.fromJS(rowData, r.newData)
	$('.modal-add-new').modal('show')
}

r.getFilledFields = function (o, id) {
	$('.modal-history').modal('show')
	$('.modal-history .grid-history').html('Loading ...')

	var param = {}
	param.Id = id

	var fieldInfo = r.data().find(function (e) {
		return e.Id == id
	})
	if (typeof fieldInfo == 'undefined') {
		fieldInfo = {
			Section: '',
			SubSection: '',
			Field: '',
		}
	}

    app.ajaxPost("/ratio/getfilledbalancesheetinput", param, function (res) {
        if (res.Message != '') {
            sweetAlert("Oops...", res.Message, "error");
            return;
        }

    	let rowData = [];
    	res.Data.forEach(function (d) {
			var customer = r.masterCustomer().find(function (e) {
				return e.customer_id == d.customerid.split('|')[0]
			});
			if (typeof customer == 'undefined') {
				customer = { customer_name: d.customerid }
			}

			let o = {}
			o.Section = fieldInfo.Section;
			o.SubSection = fieldInfo.SubSection;
			o.Field = fieldInfo.Field;
			o.Customer = customer.customer_name;
			o.DealNo = d.customerid.split('|')[1];
			o.key = [o.Section, o.SubSection, o.Field, o.Customer, o.DealNo].join('_')
			o.DateData = {}

			var old = rowData.find(function (e) { return e.key == o.key })
			if (typeof old !== 'undefined') {
				old.DateData['Y' + d.formdata.date.split('-')[2]] = d.formdata.value
				return
			}

			for (var i = 2017; i >= 2009; i--) {
				if (d.formdata.date.split('-')[2] == String(i)) {
					o.DateData['Y' + i] = d.formdata.value
				} else {
					o.DateData['Y' + i] = 0
				}
			}

			rowData.push(o)
		});

		var columns = [
			{ field: 'Customer', width: 250, locked: true },
			{ field: 'DealNo', title: 'Deal No', width: 150, locked: true }
		]

		for (var i = 2017; i >= 2009; i--) {
			columns.push({
				field: 'DateData.Y' + String(i),
				title: '31-Mar-' + String(i),
				width: 80
			})
		}

		var gridConfig = {
			dataSource: {
				data: rowData
			},
			columns: columns
		}

		console.log('gridConfig', gridConfig)
		console.log('columns', columns)

		setTimeout(function () {
			$('.modal-history .modal-title').html('History of field ' + fieldInfo.Field)
			$('.modal-history .grid-history').replaceWith('<div class="grid-history"></div>')
			$('.modal-history .grid-history').kendoGrid(gridConfig)
		}, 200)
    });
}

r.remove = function (o, id) {
	swal({
		title: "Are you sure?",
		text: "Field will be deleted.",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, delete it!"
	}).then(function() {
		var param = {}
		param.Id = id
		console.log(param)
	    app.ajaxPost("/ratio/removemasterbalancesheetinput", param, function (res) {
	        if (res.Message != '') {
	            sweetAlert("Oops...", res.Message, "error");
	            return;
	        }

	        swal("Success!", "Item deleted!", "success");
	    	r.refresh()
	    });
	});
}
r.masterCustomer = ko.observableArray([])
r.getMasterCustomer = function () {
	ajaxPost("/datacapturing/getcustomerprofilelist", {}, function (data) {
		r.masterCustomer(data)
	});
}

r.clearSub = function(){
	r.clearSelectOne();
	setTimeout(function(){
		var sec = r.newData.Section();
		
		r.optionSubSection(_.map(_.groupBy(_.filter(r.data(),function(x){ return x.Section == r.newData.Section() })  , 'SubSection'), function (v, k) {
			return k
		}).filter(function (d) {
			return d != '';
		}))
		
	},300);
}

$(function () {
	r.getMasterCustomer()
	r.getMasterCustomerProfile()
	r.getMasterBalanceSheetInput()
	r.refresh()
	$('.modal').appendTo($('body'))
	$('.form-add').on('submit', r.saveNewData)
});


r.clearSelectOne = function(){
	setTimeout(function(){
		if(r.newData.Section() == "Select One"){
		r.newData.Section("")
		}

		if(r.newData.SubSection() == "Select One"){
			r.newData.SubSection("")
		}
	},100)
}