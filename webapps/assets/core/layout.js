'use strict';

var vm = model;

vm.currentMenu = ko.observable('Dashboard');
vm.currentTitle = ko.observable('Dashboard');
vm.tabsubmenu = ko.observableArray([]);
vm.viewtab = ko.observable(false);
vm.Old = ko.observable("");
vm.New = ko.observable("");
vm.Confirm = ko.observable("");
vm.OldMessage = ko.observable("")
vm.NewMessage = ko.observable("")
// vm.menu = ko.observableArray([
// { title: 'Dashboard', icon: 'fa fa-home', href: "/dashboard/default", submenu: [] }, 
// { title: 'Data Master', icon: 'fa fa-home', href:"/datamaster/default", submenu: [
// 	{ title: 'Data Master Account', icon: 'fa fa-home', href: "/datamaster/accounts", submenu: [] },
// 	{ title: 'Data Master Receipt Payment Type', icon: 'fa fa-home', href:"/datamaster/receiptpaymenttype", submenu: [] },
// 	{ title: 'Data Master Clients', icon: 'fa fa-home', href: "/datamaster/clients", submenu: [] },
// 	{ title: 'Data Master Commission Group Fees', icon: 'fa fa-home', href: "/datamaster/commissiongroupfees", submenu: [] },
// 	{ title: 'Data Master Commission Group', icon: 'fa fa-home', href:"/datamaster/commissiongroup", submenu: [] },
// 	{ title: 'Data Master Contracts', icon: 'fa fa-home', href: "/datamaster/contracts", submenu: [] },
// 	{ title: 'Data Master Currencies', icon: 'fa fa-home', href: "/datamaster/currencies", submenu: [] },
// 	{ title: 'Data Master Contract Expiry', icon: 'fa fa-home', href: "/datamaster/contractexpiry", submenu: [] },
// 	{ title: 'Data Master Clearers', icon: 'fa fa-home', href: "/datamaster/clearers", submenu: [] },
// 	{ title: 'Data Master FXRates', icon: 'fa fa-home', href: "/datamaster/fxrates", submenu: [] },
// 	{ title: 'Data Master Account Fees', icon: 'fa fa-home', href: "/datamaster/accountsfees", submenu: [] },
// 	{ title: 'Data Master Exchange', icon: 'fa fa-home', href: "/datamaster/exchange", submenu: [] },
// 	{ title: 'Data Master Flat File Cut Off', icon: 'fa fa-home', href: "/datamaster/flatfilecutoff", submenu: [] },
// 	{ title: 'Data Master Clients Group', icon: 'fa fa-home', href: "/datamaster/clientsgroup", submenu: [] },
// 	{ title: 'Data Master Titles', icon: 'fa fa-home', href: "/datamaster/titles", submenu: [] },
// 	{ title: 'Data Master Countries', icon: 'fa fa-home', href: "/datamaster/countries", submenu: [] },
// 	{ title: 'Data Master Companies', icon: 'fa fa-home', href: "/datamaster/companies", submenu: [] },
// 	{ title: 'Data Master Clients-v2', icon: 'fa fa-home', href: "/datamaster/clients_v2", submenu: [] },
// ] }, 
// { title: 'Master Upload', icon: 'fa fa-home', href:'', submenu: [
// 	{ title: 'Data Master Upd Accounts', icon: 'fa fa-home', href: "/datamaster/updaccounts", submenu: [] }, 
// 	{ title: 'Data Master Upd Conracts', icon: 'fa fa-home', href: "/datamaster/updcontracts", submenu: [] }, 
// 	{ title: 'Data Master Upd Exchange', icon: 'fa fa-home', href: "/datamaster/updexchange", submenu: [] }, 
// ] }, 
// { title: 'Data Browser', icon: 'fa fa-home', href: '', submenu: [
// 	{ title: 'Open Trade', icon: 'fa fa-home', href: "/databrowser/opentrade", submenu: [] },
// 	{ title: 'Purchase And Sale', icon: 'fa fa-home', href: "/databrowser/purchaseandsale", submenu: [] },
// 	{ title: 'Trade Fee', icon: 'fa fa-home', href: "/databrowser/tradefee", submenu: [] },
// 	{ title: 'Transaction', icon: 'fa fa-home', href: "/databrowser/default", submenu: [] },
// 	{ title: 'Payment / Receipt', icon: 'fa fa-home', href: "/databrowser/paymentandreceipt", submenu: [] },
// 	{ title: 'Setlement Price', icon: 'fa fa-home', href: "/updsettlementprice/default", submenu: [] },
// ] }, 
// { title: 'Upload File', icon: 'fa fa-home', href: "/uploadfilev2/default", submenu: [] }, 
// { title: 'Manual Entries', icon: 'fa fa-home', href: "", submenu: [
// 	{ title: 'Payment / Receipt (Desk Fee)', icon: 'fa fa-home', href: "/manualpaymentreceipt/default", submenu: [] },
// ] }, 
// { title: 'Report PDF', icon: 'fa fa-home', href: '', submenu: [
// 	{ title: 'Clients Account Summary', icon: 'fa fa-home', href: "/reportpdf/rptclientsaccountsummarypdf", submenu: [] },
// 	{ title: 'Clients Summary', icon: 'fa fa-home', href: "/reportpdf/rptclientssummarypdf", submenu: [] },
// 	{ title: 'Clearers Account Summary', icon: 'fa fa-home', href: "/reportpdf/rptcleareraccountsummarypdf", submenu: [] },
// 	{ title: 'Clearers Summary', icon: 'fa fa-home', href: "/reportpdf/rptclearersummarypdf", submenu: [] },
// 	{ title: 'Send Email', icon: 'fa fa-home', href: "/reportpdf/sendemail", submenu: [] },
// ] }, 
// { title: 'Report', icon: 'fa fa-home', href: '', submenu: [
// 	{ title: 'Clients Account Summary', icon: 'fa fa-home', href: "/reportclient/default", submenu: [] },
// 	{ title: 'Clients Summary', icon: 'fa fa-home', href: "/reportclientsummary/default", submenu: [] },
// 	{ title: 'Clearers Account Summary', icon: 'fa fa-home', href: "/reportclearer/default", submenu: [] },
// 	{ title: 'Clearers Summary', icon: 'fa fa-home', href: "/reportclearersummary/default", submenu: [] },
// ] }, 
// { title: 'Administrator', icon: 'fa fa-home', href: '', submenu: [] },
// 	]);
vm.menu = ko.observableArray([]);
vm.breadcrumb = ko.observableArray([{ title: 'Godrej', href: '#' }, { title: 'Dashboard', href: '#' }]);

vm.menuIcon = function (data) {
	return ko.computed(function () {
		return 'fa fa-' + data.icon;
	});
};

vm.prepareDropDownMenu = function () {
	$('ul.nav li.dd-hover').hover(function () {
		$(this).find('.dropdown-menu').stop(true, true).fadeIn(200);
	}, function () {
		$(this).find('.dropdown-menu').stop(true, true).fadeOut(200);
	});
};

vm.menuclick = function(index){
	// vm.viewtab(true)
	vm.tabsubmenu([])
	if(vm.tabsubmenu().length == 0){
		var menu = vm.menu()[index].submenu();
		console.log(menu);
		vm.tabsubmenu.push(menu);
	}
}

vm.prepareFilterToggle = function () {
	$('.material-switch input[type="checkbox"]').on('change', function () {
		var show = $(this).is(':checked');
		var $target = $(this).closest('.panel').find('.panel-filter');
		if (show) {
			$target.show(200);
		} else {
			$target.hide(200);
		}
	}).trigger('click');
};
vm.adjustLayout = function () {
	var height = window.innerHeight - $('.app-top').height();
	// $('.app-container').css('min-height', height);
};
vm.showFilterCallback = toolkit.noop;
vm.showFilter = function () {
	var btnToggleFilter = $('.btn-toggle-filter');
	var panelFilterContainer = $('.panel-filter').parent();

	panelFilterContainer.removeClass('minimized');
	btnToggleFilter.find('.fa').removeClass('color-blue').addClass('color-orange').removeClass('fa-angle-double-right').addClass('fa-angle-double-left');

	$('.panel-filter').show(300);
	$('.panel-content').animate({ 'width': 'auto' }, 300, vm.showFilterCallback);
};
vm.hideFilterCallback = toolkit.noop;
vm.hideFilter = function () {
	var btnToggleFilter = $('.btn-toggle-filter');
	var panelFilterContainer = $('.panel-filter').parent();

	panelFilterContainer.addClass('minimized');
	btnToggleFilter.find('.fa').removeClass('color-orange').addClass('color-blue').removeClass('fa-angle-double-left').addClass('fa-angle-double-right');

	$('.panel-filter').hide(300);
	$('.panel-content').animate({ 'width': '100%' }, 300, vm.hideFilterCallback);
};
vm.prepareToggleFilter = function () {
	var btnToggleFilter = $('.btn-toggle-filter');
	var panelFilterContainer = $('.panel-filter').parent();

	$('<i class="fa fa-angle-double-left tooltipster align-center color-orange" title="Toggle filter pane visibility"></i>').appendTo(btnToggleFilter);
	toolkit.prepareTooltipster($(btnToggleFilter).find('.fa'));

	btnToggleFilter.on('click', function () {
		if (panelFilterContainer.hasClass('minimized')) {
			vm.showFilter();
		} else {
			vm.hideFilter();
		}
	});
};
vm.prepareLoader = function () {
	$('.loader canvas').each(function (i, cvs) {
		var ctx = cvs.getContext("2d");
		var sA = Math.PI / 180 * 45;
		var sE = Math.PI / 180 * 90;
		var ca = canvas.width;
		var ch = canvas.height;

		ctx.clearRect(0, 0, ca, ch);
		ctx.lineWidth = 15;

		ctx.beginPath();
		ctx.strokeStyle = "#ffffff";
		ctx.shadowColor = "#eeeeee";
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 5;
		ctx.arc(50, 50, 25, 0, 360, false);
		ctx.stroke();
		ctx.closePath();

		sE += 0.05;
		sA += 0.05;

		ctx.beginPath();
		ctx.strokeStyle = "#aaaaaa";
		ctx.arc(50, 50, 25, sA, sE, false);
		ctx.stroke();
		ctx.closePath();
	});
};
vm.logout = function () {
	toolkit.ajaxPost(model.appName + 'login/logout', {}, function (res) {
		if (!toolkit.isFine(res)) {
			return;
		}
		swal({
			title: 'Logout Success',
			text: 'Will automatically redirect to login page in 3 seconds',
			type: 'success',
			timer: 3000,
			showConfirmButton: false
		}, function () {
			location.href = model.appName + 'page/login';
		});
	});
};

vm.ChangePassword = function(){
	$("#oldmessage").hide()
	$("#newmessage").hide()
	var param = {
		OldPassword : $("#old").val(),
		NewPassword : $("#new").val(),
		ConfirmPassword: $("#conf").val(),
	}
	ajaxPost("/usersetting/changepassword", param, function(res){
		console.log(res.Message)
		if(res.IsError == false){
			swal("Password Change Sucessfully", "", "success");
			$("#modalPass").modal("hide")
		}else{
			if(res.Message.indexOf("Old") > -1){
				$("#oldmessage")
					.show()
					.text(res.Message)
					.css("color", "red")
			}else{
				$("#newmessage")
					.show()
					.text(res.Message)
					.css("color", "red")
			}
		}

	});
}

vm.showPas = function(){
	$("#oldmessage").hide()
	$("#newmessage").hide()
	$("#old").val("");
	$("#new").val("");
	$("#conf").val("")
}

vm.accordionSideBar = function(){
	// alert("#"+id)
	// var acc = $(".accordion");
	// for(var i = 0; i < acc.length; i++){
	// 	$(acc[i]).attr("id", "acc"+i)
	// 	acc[i].onclick = function(){
	// 		// this.addClass("coba")
			
	// 		// this.classList.toggle('active');
	// 		// 	acc.css("color","#1586f0");

	// 		// var panel = this.nextElementSibling;
	// 		// if(panel.style.display === 'block'){
	// 		// 	panel.style.display = "none";
	// 		// 	panel.style.color = "white";
	// 		// 	// panel.addClass("show");
	// 		// }else{
	// 		// 	panel.style.display = 'block';
	// 		// 	panel.style.color = 'white';
	// 		// 	// panel.addClass("hide");
				
	// 		// }
	// 	}
	// }

	// if($("."+id).find("h5>").hasClass("fa-chevron-down")){
	// 	alert("masuk hide")
	// 	// $("#"+id).addClass("hide")
	// 	// $("#"+id).removeClass("show");
	// 	$("."+id).find("h5>").removeClass("fa-chevron-down");
	// 	$("."+id).find("h5>").addClass("fa-chevron-up");

	// }else{
	// 	alert("masuk show")
	// 	$("."+id).find("h5>").addClass("fa-chevron-down");
	// 	$("."+id).find("h5>").removeClass("fa-chevron-up");
	// 	// $("#"+id).addClass("show")
	// 	// $("#"+id).removeClass("hide");
		
	// }
	// $('#'+id).toggleClass('hide').toggleClass('show');
 //    return false;
			// $("#"+id).toggleClass("hide").toggleClass("show")

			// 	return false
	$(".toggle").click(function(e){
		e.preventDefault();

		var $this = $(this);
		if($this.next().hasClass('show')){
			$this.next().removeClass('show');
			$this.next().slideUp(350);
			$this.find("h5>").removeClass("fa-chevron-down");
			$this.find("h5>").addClass("fa-chevron-up");

		}else{
			$this.next().removeClass('hide');
			$this.next().slideDown(350);
			$this.next().addClass("show");
			$this.find("h5>").addClass("fa-chevron-down");
			$this.find("h5>").removeClass("fa-chevron-up");
		}
	})

	$("#all").click(function(e){
		$(".toggle").next().removeClass('hide');
		$(".toggle").next().slideDown(350).addClass("show");
		$(".toggle").find("h5>").addClass("fa-chevron-down");
		$(".toggle").find("h5>").removeClass("fa-chevron-up");
	})
}

$(function () {
	vm.accordionSideBar();
	vm.prepareDropDownMenu();
	vm.prepareFilterToggle();
	vm.adjustLayout();
	vm.prepareToggleFilter();
	toolkit.prepareTooltipster();
	vm.prepareLoader();
	// vm.accordionSideBar();

	// try {
	// 	$('#refresh').removeClass('btn-default')
	// 		.addClass('btn-primary')[0]
	// 		.childNodes[2].nodeValue = " Select"
	// } catch (err) {
	// 	console.log(err)
	// }
});