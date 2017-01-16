var frp = {}
frp.data = ko.observableArray([])
frp.isLoading = function (what) {
    $('.apx-loading')[what ? 'show' : 'hide']()
    $('.app-content')[what ? 'hide' : 'show']()
}
frp.showDetail = function (value) {
	if (typeof value === 'undefined') {
		return $('input[type=checkbox]').data('bootstrapSwitch').state()
	}

	$('input[type=checkbox]').data('bootstrapSwitch').state(value)
}
frp.showDet = function(e){
	frp.showDetail(true);
	frp.render();
	$elem = $(e);
	setTimeout(function(){
		var attr = $elem.closest("tr").attr("data-level1-id");
		$('tr[data-level1-id="'+ attr +'"]').click();
	},500)
}
frp.render = function () {
	var data = frp.data()
	var $container = $('.form-container').empty()
	var $table = $('<table />')
		.addClass('report')
		.appendTo($container)

	var $trCust = $('<tr />')
		.appendTo($table)
		.addClass('header customerrow')
		.css('display', 'none')

	$('<td />')
		.html(""+frp.customerName().split("-")[1].trim() + " - " + frp.dealno() )
		.addClass('header-bgcolor')
		.appendTo($trCust)
		.attr('colspan', 5)

	var $trMeta1 = $('<tr />')
		.appendTo($table)
		.addClass('header')
	$('<td />')
		.html('Risk Based Scoring')
		.addClass('header-bgcolor')
		.appendTo($trMeta1)
		.attr('colspan', 5)

	var $trMeta2 = $('<tr />')
		.appendTo($table)
		.addClass('header')
	$('<td />')
		.html('SME - Risk Based Scoring')
		.addClass('header-bgcolor')
		.appendTo($trMeta2)
		.attr('colspan', 2)
		.attr('rowspan', 2)
	$('<td />')
		.html('Score')
		.addClass('header-bgcolor')
		.appendTo($trMeta2)
	$('<td />')
		.attr('colspan', 2)
		.html('Rating')
		.addClass('header-bgcolor')
		.appendTo($trMeta2)

	var score = _.sum(data.filter(function (d) {
		return d.IsHeader
	}).map(function (d) {
		return kendo.parseFloat(d.WeightScore)
	}));

	var rating = (function () {
		if (score <= 4.5) {
			return "XFL-5"
		} else if (score < 6) {
			return "XFL-4"
		} else if (score < 7) {
			return "XFL-3"
		} else if (score <= 8.5) {
			return "XFL-2"
		} else {
			return "XFL-1"
		}
	})()

	var data = csc().datasource()
	ajaxPost("/creditscorecard/savedata", {
		CustomerId: filter().CustomerSearchVal(),
		DealNo: filter().DealNumberSearchVal(),
		Data: data,
		FinalScore : kendo.toString(score, 'n2'),
		FinalScoreDob : parseFloat(kendo.toString(score, 'n2')),
		FinalRating : rating
	}, function(res){
		console.log(res)
    });

	var $trMeta3 = $('<tr />')
		.appendTo($table)
		.addClass('header')
	$('<td />')
		.html(kendo.toString(score, 'n2'))
		.appendTo($trMeta3)
	$('<td />')
		.attr('colspan', 2)
		.html(rating)
		.appendTo($trMeta3)

	var $trHeader = $('<tr />')
		.appendTo($table)
		.addClass('header')

	var widthOfParameter = 200
	var widthOfBreakdown = 300
	var widthOfValue = 100
	var totalWidth = 0

	$('<td />').html('Risk Parameter')
		.addClass('header-bgcolor')
		.appendTo($trHeader)
		.width(widthOfBreakdown); totalWidth += widthOfBreakdown;
	$('<td />').html('Category')
		.addClass('header-bgcolor')
		.appendTo($trHeader)
		.width(widthOfBreakdown - 70); totalWidth += widthOfBreakdown - 70;
	$('<td />').html('Score')
		.addClass('header-bgcolor')
		.appendTo($trHeader)
		.width(widthOfValue); totalWidth += widthOfValue;
	$('<td />').html('Weight')
		.addClass('header-bgcolor')
		.appendTo($trHeader)
		.width(widthOfValue); totalWidth += widthOfValue;
	$('<td />').html('Weight Score')
		.addClass('header-bgcolor')
		.appendTo($trHeader)
		.width(widthOfValue); totalWidth += widthOfValue;

	if (frp.showDetail()) {
		$('<td />').html('Value')
			.addClass('header-bgcolor')
			.appendTo($trHeader)
			.width(widthOfValue); totalWidth += widthOfValue;

		$('<td />').html('Breakdown 1')
			.addClass('header-bgcolor')
			.appendTo($trHeader)
			.width(widthOfBreakdown); totalWidth += widthOfBreakdown;
		$('<td />').html('Value')
			.addClass('header-bgcolor')
			.appendTo($trHeader)
			.width(widthOfValue); totalWidth += widthOfValue;

		$('<td />').html('Breakdown 2')
			.addClass('header-bgcolor')
			.appendTo($trHeader)
			.width(widthOfBreakdown); totalWidth += widthOfBreakdown;
		$('<td />').html('Value')
			.addClass('header-bgcolor')
			.appendTo($trHeader)
			.width(widthOfValue); totalWidth += widthOfValue;
		$('<td />').html('Breakdown 3')
			.addClass('header-bgcolor')
			.appendTo($trHeader)
			.width(widthOfBreakdown); totalWidth += widthOfBreakdown;
		$('<td />').html('Value')
			.addClass('header-bgcolor')
			.appendTo($trHeader)
			.width(widthOfValue); totalWidth += widthOfValue;
		$('<td />').html('Breakdown 4')
			.addClass('header-bgcolor')
			.appendTo($trHeader)
			.width(widthOfBreakdown); totalWidth += widthOfBreakdown;
		$('<td />').html('Value')
			.addClass('header-bgcolor')
			.appendTo($trHeader)
			.width(widthOfValue); totalWidth += widthOfValue;
		$('<td />').html('Formulae')
			.attr('colspan', 7)
			.attr('rowspan', 3)
			.addClass('header-bgcolor')
			.appendTo($trMeta1)
	}

	$table.width(totalWidth)
	var colors = [
		{ base: "rgb(195, 220, 236)", soft: "#3498db" },
		{ base: "rgb(195, 220, 236)", soft: "#27ae60" },
		{ base: "rgb(195, 220, 236)", soft: "rgb(162, 90, 193)" },
		{ base: "rgb(195, 220, 236)", soft: "rgb(89, 110, 132)" }
	];

	var counter = 0

	// ======= LEVEL 0
	data.forEach(function (d, i) {
		var $trRow1 = $('<tr />')
			.appendTo($table)
			.attr('data-level1-id', d.Id)
			.attr('data-level', '1')

		// var color = "inherit" // colors[counter % data.length].soft
		if (d.IsHeader === true) {
			$trRow1.addClass('colored sub-bgcolor')
		}

		if (d.IsHeader === true) {
			$trRow1.addClass('row-header')
		}

		var $keyTrRow1 = $('<td />').appendTo($trRow1)
		var $iconTrRow1 = $('<i />').addClass('fa')
			.css('margin-right', '5px')
			.appendTo($keyTrRow1)

		if (d.hasOwnProperty('Children')) {
			$trRow1.addClass('row-clickable')
			if (d.Expand === true) {
				$iconTrRow1.addClass('fa-arrow-down')
			} else {
				$iconTrRow1.addClass('fa-arrow-right')
			}
		}

		$('<span />').html(d.Name)
			.appendTo($keyTrRow1)

		if (d.hasOwnProperty('Children')) {
		var $iconTrRow2 = $('<i />').addClass('fa fa-plus-square-o')
			.css('float', 'right')
			.css('font-size','20px')
			.css('color','#168846')
			.addClass('button-hidden')
			.attr("onclick","frp.showDet(this);")
			.appendTo($keyTrRow1)
		}


		$('<td />').html(d.Category)
			.appendTo($trRow1)
		$('<td />').html(kendo.toString(toolkit.redefine(d.Score, 0), 'n1'))
			.appendTo($trRow1)
			.addClass('align-right')
		$('<td />').html(toolkit.redefine(d.Weight, 0) + ' %')
			.appendTo($trRow1)
			.addClass('align-right')
		$('<td />').html(toolkit.redefine(d.WeightScore, 0))
			.appendTo($trRow1)
			.addClass('align-right')

		if (frp.showDetail()) {
			var value = ""

			if (d.hasOwnProperty('Value')) {
				if(d.Name != "Inward Bounces")
					value = kendo.toString(d.Value, 'n2')
				else
					value = kendo.toString(d.Value, 'n4')

				if (typeof d.Value === 'string') {
					if (String(d.Value).indexOf('%') > -1) {
						value = kendo.toString(parseFloat(d.Value.replace(/\%/g, '')), 'n2') + ' %'
					} else {
						value = kendo.toString(parseFloat(d.Value), 'n2')
					}
				}

				console.log('----', d.Name, d.Value, value)
			}

			$('<td />')
				.html(value)
				.addClass('align-right')
				.appendTo($trRow1)

			$('<td />').html('&nbsp;')
				.attr('colspan', 6)
				.appendTo($trRow1)
		}

		if (d.Expand) {
			// ======= LEVEL 1
			var $trRow2 = $('<tr />')
				.appendTo($table)

			var expandRow2 = d.Children.length
			var $tdRow2Formula = $('<td />').html(d.Description)
				.css('text-align', 'center')
				.appendTo($trRow2)
			var $tdRow2Space = $('<td />').html('&nbsp;')
				.attr('colspan', 5)
				.appendTo($trRow2)

			if (!frp.showDetail()) {
				return
			}

			var $currentTrRow2 = $trRow2
			d.Children.forEach(function (e) {
				$currentTrRow2
					.attr('data-level1-id', d.Id)
					.attr('data-level2-id', e.Id)
					.attr('data-level', '2')

				var $keyTrRow2 = $('<td />')
					.appendTo($currentTrRow2)
					.addClass('cell-formula')
				var $iconTrRow2 = $('<i />')
					.addClass('fa')
					.appendTo($keyTrRow2)
				$('<span />').html(e.Name)
					.appendTo($keyTrRow2)

				if (e.hasOwnProperty('Children') && frp.showDetail()) {
					$currentTrRow2.addClass('row-clickable')
					if (e.Expand === true) {
						$iconTrRow2.addClass('fa-arrow-down')
					} else {
						$iconTrRow2.addClass('fa-arrow-right')
					}
				}

				$('<td />').html(e.Value)
					.addClass('align-right')
					.appendTo($currentTrRow2)

				if (frp.showDetail()) {
					$('<td />').html('&nbsp;')
						.attr('colspan', 4)
						.appendTo($currentTrRow2)
				}

				if (e.Expand) {
					// ======= LEVEL 2
					var $trRow3 = $('<tr />')
						.appendTo($table)

					expandRow2 += e.Children.length + 1
					var expandRow3 = e.Children.length
					var $tdRow3Formula = $('<td />').html('&nbsp;')
						.appendTo($trRow3)
					var $tdRow3Space = $('<td />').html('&nbsp;')
						.appendTo($trRow3)

					var $currentTrRow3 = $trRow3
					e.Children.forEach(function (f) {
						$currentTrRow3
							.attr('data-level1-id', d.Id)
							.attr('data-level2-id', e.Id)
							.attr('data-level3-id', f.Id)
							.attr('data-level', '3')

						var $keyTrRow3 = $('<td />')
							.appendTo($currentTrRow3)
							.addClass('cell-formula')
						var $iconTrRow3 = $('<i />')
							.addClass('fa')
							.css('margin-right', '5px')
							.appendTo($keyTrRow3)
						$('<span />').html(f.Name)
							.appendTo($keyTrRow3)

						if (f.hasOwnProperty('Children')) {
							$currentTrRow3.addClass('row-clickable')
							if (f.Expand === true) {
								$iconTrRow3.addClass('fa-arrow-down')
							} else {
								$iconTrRow3.addClass('fa-arrow-right')
							}
						}

						$('<td />').html(f.Value)
							.addClass('align-right')
							.appendTo($currentTrRow3)

						if (frp.showDetail()) {
							$('<td />').html('&nbsp;')
								.attr('colspan', 2)
								.appendTo($currentTrRow3)
						}

						if (f.Expand) {
							// ======= LEVEL 3
							var $trRow4 = $('<tr />')
								.appendTo($table)

							expandRow2 += f.Children.length + 1
							expandRow3 += f.Children.length + 1
							var expandRow4 = f.Children.length
							var $tdRow4Formula = $('<td />').html('&nbsp;')
								.appendTo($trRow4)
							var $tdRow4Space = $('<td />').html('&nbsp;')
								.appendTo($trRow4)

							var $currentTrRow4 = $trRow4
							f.Children.forEach(function (g) {
								$currentTrRow4
									.attr('data-level1-id', d.Id)
									.attr('data-level2-id', e.Id)
									.attr('data-level3-id', f.Id)
									.attr('data-level4-id', g.Id)
									.attr('data-level', '4')

								var $keyTrRow4 = $('<td />')
									.appendTo($currentTrRow4)
									.addClass('cell-formula')
								var $iconTrRow4 = $('<i />')
									.addClass('fa')
									.css('margin-right', '5px')
									.appendTo($keyTrRow4)
								$('<span />').html(g.Name)
									.appendTo($keyTrRow4)

								if (g.hasOwnProperty('Children')) {
									$currentTrRow4.addClass('row-clickable')
									if (g.Expand === true) {
										$iconTrRow4.addClass('fa-arrow-down')
									} else {
										$iconTrRow4.addClass('fa-arrow-right')
									}
								}

								$('<td />').html(g.Value)
									.addClass('align-right')
									.appendTo($currentTrRow4)

								if (frp.showDetail()) {
									$('<td />').html('&nbsp;')
										.attr('colspan', 2)
										.appendTo($currentTrRow4)
								}

								if (g.Expand) {
									// ======= LEVEL 3
									var $trRow5 = $('<tr />')
										.appendTo($table)

									expandRow2 += g.Children.length + 1
									expandRow3 += g.Children.length + 1
									expandRow4 += g.Children.length + 1
									var expandRow5 = g.Children.length
									var $tdRow5Formula = $('<td />').html('&nbsp;')
										.appendTo($trRow5)
									var $tdRow5Space = $('<td />').html('&nbsp;')
										.appendTo($trRow5)

									var $currentTrRow5 = $trRow5
									g.Children.forEach(function (h) {
										$('<td />').html(h.Name)
											.appendTo($currentTrRow5)
											.addClass('cell-formula')
										$('<td />').html(h.Value)
											.appendTo($currentTrRow5)
											.css('text-align', 'right')

										$currentTrRow5 = $('<tr />')
											.appendTo($table)
									})

									$tdRow5Formula.attr('rowspan', expandRow5)
									$tdRow5Space.attr('rowspan', expandRow5)
								}

								$currentTrRow4 = $('<tr />')
									.appendTo($table)
							})

							$tdRow4Formula.attr('rowspan', expandRow4)
							$tdRow4Space.attr('rowspan', expandRow4)
						}

						$currentTrRow3 = $('<tr />')
							.appendTo($table)
					})

					$tdRow3Formula.attr('rowspan', expandRow3)
					$tdRow3Space.attr('rowspan', expandRow3)
				}

				$currentTrRow2 = $('<tr />')
					.appendTo($table)
			})

			$tdRow2Formula.attr('rowspan', expandRow2)
			$tdRow2Space.attr('rowspan', expandRow2)
		}

		if (d.IsHeader === true) {
			counter++
		}
	})

	$table.find('tr[data-level]').on('click', function () {
		var $self = $(this)
		var level = parseInt($self.attr('data-level'), 10)
		var level1Id = $self.attr('data-level1-id')
		var level2Id = $self.attr('data-level2-id')
		var level3Id = $self.attr('data-level3-id')
		var level4Id = $self.attr('data-level4-id')

		console.log(level, level1Id, level2Id, level3Id, level4Id)

		var row = undefined
		if (level >= 1) {
			row = data.find(function (d) {
				return (d.Id == level1Id) && d.hasOwnProperty('Children')
			})
			if (row == undefined) { return }
		}
		console.log('row', row)

		if (level >= 2) {
			row = row.Children.find(function (d) {
				return (d.Id == level2Id) && d.hasOwnProperty('Children')
			})
			if (row == undefined) { return }
		}
		console.log('row', row)

		if (level >= 3) {
			row = row.Children.find(function (d) {
				return (d.Id == level3Id) && d.hasOwnProperty('Children')
			})
			if (row == undefined) { return }
		}
		console.log('row', row)

		if (level >= 4) {
			row = row.Children.find(function (d) {
				return (d.Id == level4Id) && d.hasOwnProperty('Children')
			})
			if (row == undefined) { return }
		}
		console.log('row', row)

		row.Expand = !row.Expand
		frp.render()
	})
}

frp.configureData = function () {
	var data = csc().datasource()
	data.forEach(function (d) {
		if (!d.hasOwnProperty('Children')) {
			return
		}

		d.Expand = false
		d.Children.forEach(function (e) {
			if (!e.hasOwnProperty('Children')) {
				return
			}

			e.Expand = false
			e.Children.forEach(function (f) {
				if (!f.hasOwnProperty('Children')) {
					return
				}

				f.Expand = false
			})
		})
	})

	frp.data(data)
}

frp.customerName = ko.observable("")
frp.dealno = ko.observable("")

window.refreshFilter = function () {
	frp.isLoading(true)
	csc().datasource([])

	if (csc().hasOwnProperty('getCreditScoreData')) {
		csc().getCreditScoreData(function () {
			frp.isLoading(false)

			setTimeout(function () {
				frp.configureData()
				frp.render()
			}, 300)
		})
	} else {
		csc().getalldata(function () {
			frp.configureData()

			setTimeout(function () {
				frp.isLoading(false)
				frp.render()
			}, 300)
		});
	}

	frp.showDetail(false);
}

frp.exportPDF = function() {
	frp.showDetail(false)
	frp.render()

	$(".fa-arrow-right").hide()
	$(".button-hidden").hide()
	$(".customerrow").show()

	 kendo.drawing.drawDOM($(".form-container")).then(function(group){
      kendo.drawing.pdf.saveAs(group, frp.customerName() + ".pdf");
   });

	$(".customerrow").hide()
   $(".button-hidden").show()
   $(".fa-arrow-right").show()
}
