'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

model.app = new Object();
var app = model.app;

app.dev = ko.observable(true);
app.noop = function () {};
app.noob = {};
app.log = function () {
    if (!app.dev()) {
        return;
    }

    console.log.apply(console, [].slice.call(arguments));
};
app.error = function () {
    if (!app.dev()) {
        return;
    }

    console.error.apply(console, [].slice.call(arguments));
};
app.validateNumber = function (d) {
    var df = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    return isNaN(d) || !isFinite(d) ? df : d;
};
app.isLastItem = function (o, d) {
    return o.indexOf(d) + 1 == o.length;
};
app.NaNable = function (o) {
    var dv = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    return isNaN(o) ? dv : o;
};
app.nbspAble = function (o) {
    var dv = arguments.length <= 1 || arguments[1] === undefined ? '&nbsp;' : arguments[1];
    return $.trim(o) == '' ? dv : o;
};
app.allKeys = function (o) {
    var keys = [];
    for (var k in o) {
        if (o.hasOwnProperty(k)) {
            keys.push(String(k));
        }
    }
    return keys;
};
app.length = function (o) {
    if (o instanceof Object) {
        var i = 0;
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                i++;
            }
        }
        return i;
    }

    return o.length;
};
app.getPropVal = function (o, key) {
    var dv = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    if (!o.hasOwnProperty(key)) {
        return dv;
    }

    return app.isUndefined(o[key]) ? dv : o[key];
};
app.isVoid = function (o) {
    if (app.isUndefined(o)) {
        return true;
    }
    if (o == null) {
        return true;
    }
    if (typeof o == 'string') {
        if ($.trim(o) == '') {
            return true;
        }
    }

    return false;
};
app.whenVoid = function (o) {
    var df = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    return app.isVoid(o) ? df : o;
};
app.hasProp = function (o, key) {
    return o.hasOwnProperty(key);
};
app.ajaxPost = function (url) {
    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var callbackSuccess = arguments.length <= 2 || arguments[2] === undefined ? app.noop : arguments[2];
    var callbackError = arguments.length <= 3 || arguments[3] === undefined ? app.noop : arguments[3];
    var otherConfig = arguments.length <= 4 || arguments[4] === undefined ? app.noob : arguments[4];

    var startReq = moment();

    var params = ko.mapping.toJSON(app.noob);
    try {
        params = ko.mapping.toJSON(data);
    } catch (err) {}

    var cache = app.getPropVal(otherConfig, 'cache', false);
    if (cache !== false) {
        if (app.hasProp(localStorage, cache)) {
            var _data = JSON.parse(localStorage[cache]);
            callbackSuccess(_data);
            return;
        }
    }

    var config = {
        url: url.toLowerCase(),
        type: 'post',
        dataType: 'json',
        contentType: 'application/json charset=utf-8',
        data: params,
        success: function success(a) {
            callbackSuccess(a);
        },
        error: function error(a, b, c) {
            callbackError(a, b, c);
        }
    };

    if (data instanceof FormData) {
        delete config.config;
        config.data = data;
        config.async = false;
        config.cache = false;
        config.contentType = false;
        config.processData = false;
    }

    config = $.extend(true, config, otherConfig);
    return $.ajax(config);
};
app.o = function (raw) {
    return raw;
};
app.seriesColorsGodrej = ['#3498DB', '#28B463', '#F39C12', '#DB3434', '#34D3DB'];
app.randomRange = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
app.capitalize = function (d) {
    return '' + d[0].toUpperCase() + d.slice(1);
};
app.typeIs = function (target, comparator) {
    return (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === comparator;
};
app.is = function (observable, comparator) {
    var a = typeof observable === 'function' ? observable() : observable;
    var b = typeof comparator === 'function' ? comparator() : comparator;

    return a === b;
};
app.isNot = function (observable, comparator) {
    var a = typeof observable === 'function' ? observable() : observable;
    var b = typeof comparator === 'function' ? comparator() : comparator;

    return a !== b;
};
app.isDefined = function (o) {
    return !app.isUndefined(o);
};
app.isUndefined = function (o) {
    return typeof o === 'undefined';
};
app.showError = function (message) {
    return sweetAlert('Oops...', message, 'error');
};
app.isFine = function (res) {
    if (!res.success) {
        sweetAlert('Oops...', res.message, 'error');
        return false;
    }

    return true;
};
app.isFormValid = function (selector) {
    app.resetValidation(selector);
    var $validator = $(selector).data('kendoValidator');
    return $validator.validate();
};
app.resetValidation = function (selectorID) {
    var $form = $(selectorID).data('kendoValidator');
    if (!$form) {
        $(selectorID).kendoValidator();
        $form = $(selectorID).data('kendoValidator');
    }

    try {
        $form.hideMessages();
    } catch (err) {}
};
app.resetForm = function ($o) {
    $o.trigger('reset');
};
app.prepareTooltipster = function ($o, argConfig) {
    var $tooltipster = typeof $o === 'undefined' ? $('.tooltipster') : $o;

    $tooltipster.each(function (i, e) {
        var position = 'top';

        if ($(e).attr('class').search('tooltipster-') > -1) {
            position = $(e).attr('class').split(' ').find(function (d) {
                return d.search('tooltipster-') > -1;
            }).replace(/tooltipster\-/g, '');
        }

        var config = {
            theme: 'tooltipster-val',
            animation: 'grow',
            delay: 0,
            offsetY: -5,
            touchDevices: false,
            trigger: 'hover',
            position: position,
            content: $('<div />').html($(e).attr('title'))
        };
        if (typeof argConfig !== 'undefined') {
            config = $.extend(true, config, argConfig);
        }

        $(e).tooltipster(config);
    });
};
app.gridBoundTooltipster = function (selector) {
    return function () {
        app.prepareTooltipster($(selector).find(".tooltipster"));
    };
};
app.redefine = function (o, d) {
    return typeof o === 'undefined' ? d : o;
};
app.capitalize = function (s) {
    var isHardcore = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    s = app.redefine(s, '');

    if (isHardcore) {
        s = s.toLowerCase();
    }

    if (s.length == 0) {
        return '';
    }

    var res = s.split(' ').map(function (d) {
        return d.length > 0 ? d[0].toUpperCase() + d.slice(1) : 0;
    }).join(' ');
    return res;
};
app.repeatAlphabetically = function (prefix) {
    return 'abcdefghijklmnopqrstuvwxyz'.split('').map(function (d) {
        return prefix + ' ' + d.toUpperCase();
    });
};
app.arrRemoveByIndex = function (arr, index) {
    arr.splice(index, 1);
};
app.arrRemoveByItem = function (arr, item) {
    var index = arr.indexOf(item);
    if (index > -1) {
        app.arrRemoveByIndex(arr, index);
    }
};
app.clone = function (o) {
    return $.extend(true, {}, o);
};
app.distinct = function (arr) {
    return arr.filter(function (v, i, self) {
        return self.indexOf(v) === i;
    });
};
app.forEach = function (d, callback) {
    if (d instanceof Array) {
        d.forEach(callback);
    }

    if (d instanceof Object) {
        for (var key in d) {
            if (d.hasOwnProperty(key)) {
                callback(key, d[key]);
            }
        }
    }
};

app.koMap = ko.mapping.fromJS;
app.koUnmap = ko.mapping.toJS;
app.observ = ko.observable;
app.observArr = ko.observArr;

app.randomString = function () {
    var length = arguments.length <= 0 || arguments[0] === undefined ? 5 : arguments[0];
    return Math.random().toString(36).substring(2, length);
};

app.latLngIndonesia = { lat: -1.8504955, lng: 117.4004627 };
app.randomGeoLocations = function () {
    var center = arguments.length <= 0 || arguments[0] === undefined ? app.latLngIndonesia : arguments[0];
    var radius = arguments.length <= 1 || arguments[1] === undefined ? 1000000 : arguments[1];
    var count = arguments.length <= 2 || arguments[2] === undefined ? 100 : arguments[2];

    var generateRandomPoint = function generateRandomPoint(center, radius) {
        var x0 = center.lng;
        var y0 = center.lat;

        // Convert Radius from meters to degrees.
        var rd = radius / 111300;

        var u = Math.random();
        var v = Math.random();

        var w = rd * Math.sqrt(u);
        var t = 2 * Math.PI * v;
        var x = w * Math.cos(t);
        var y = w * Math.sin(t);

        var xp = x / Math.cos(y0);

        return {
            name: app.randomString(10),
            latlng: [y + y0, xp + x0]
        };
    };

    var points = [];
    for (var i = 0; i < count; i++) {
        points.push(generateRandomPoint(center, radius));
    }
    return points;
};

app.split = function (arr) {
    var separator = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
    var length = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    if (length == 0) {
        return arr.split(separator);
    }

    var res = [];
    var resJoin = [];

    arr.split(separator).forEach(function (d, i) {
        if (i < length) {
            res.push(d);
            return;
        }

        resJoin.push(d);
    });

    res = res.concat(resJoin.join(separator));
    return res;
};

app.extend = function (which, klass) {
    app.forEach(klass, function (key, val) {
        if (app.typeIs(val, 'function')) {
            var body = { value: val };

            if (app.typeIs(which, 'string')) {
                Object.defineProperty(window[which].prototype, key, body);
            } else {
                Object.defineProperty(target.prototype, key, body);
            }
        }
    });
};
app.newEl = function (s) {
    return $('<' + s + ' />');
};
app.idAble = function (s) {
    return s.replace(/\./g, '_').replace(/\-/g, '_').replace(/\//g, '_').replace(/ /g, '_');
};
app.logAble = function () {
    var args = [].slice.call(arguments);
    app.log(args);
    return args[0];
};
app.htmlDecode = function (s) {
    var elem = document.createElement('textarea');
    elem.innerHTML = s;
    return elem.value;
};
app.runAfter = function () {
    for (var _len = arguments.length, jobs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        jobs[_key - 1] = arguments[_key];
    }

    var delay = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    var doWork = function doWork() {
        jobs.forEach(function (job) {
            job();
        });
    };

    var timeout = setTimeout(function () {
        return doWork;
    }, delay);
    return timeout;
};

model.StringExt = new Object();
var s = model.StringExt;

s.toObject = function () {
    var source = String(this);
    try {
        return JSON.parse(source);
    } catch (err) {
        console.error(err);
        return {};
    }
};

app.extend('String', s);

jQuery.fn.simulateClick = function() {
    return this.each(function() {
        if('createEvent' in document) {
            var doc = this.ownerDocument,
                evt = doc.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, doc.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            this.dispatchEvent(evt);
        } else {
            this.click(); // IE
        }
    });
}

function checkConfirmedOrNot(statusnow, confirmedval, verifyval, res, emptydata, message){
    if (statusnow == confirmedval || statusnow == verifyval){
        return res
    } else{
        if(message != ""){
            Materialize.toast(message+" Data Not Confirmed", 5000);
            $('.toast').css("background-color","#F26419").css("color","white")
            // swal("Warning", message+" Data Not Confirmed", "warning");
        }
        return emptydata
    }
}

app.formatnum =  function(number, decimalPlace) {
   decimalPlace = (typeof decimalPlace === "undefined" ? 0 : decimalPlace);

   var suffix = ((String(number).indexOf(".") > -1) ? String(number).split(".")[1].substring(0, decimalPlace) : "");
   var prefix = ((String(number).indexOf(".") > -1) ? String(number).split(".")[0] : String(number)).split("").reverse().join("");

   var result = "";
    for (var i = 0; i < prefix.length; i++) {
      result += prefix[i];
      if (i == 2)
          result += ",";
      else if (i > 2 && ((i - 2) % 2 == 0))
          result += ",";
    }

    result = result.split("").reverse().join("")

    if (suffix.length > 0) if (parseInt(suffix, 10) != 0) result = result + "." + suffix;
    result = result.replace(/- /g, "-");

    if(String(number).length % 2 != 0) {
      var res = result.split('')
      // var remove = res.splice(0,1,'')
      result = res.join('')
    }

    result = result.replace(/\s+/g, '');
    result = result.replace(/^\,+|\,+$/g, '');
    if(decimalPlace != 0){
        if(result.indexOf(".") == -1){
            result = result+".00"
        }
    }
    return result;
}

app.masterRTR = [
    { alias: 'TotalObligationPOS', name: 'Total Obligations - POS (Rs lacs)' },
    { alias: 'TotalObligationEMI', name: 'Total Obligations - EMI (Rs)' },
    { alias: 'CloseWithin3MonthPOS', name: 'Close Within 3 Month - POS (Rs lacs)' },
    { alias: 'CloseWithin3MonthEMI', name: 'Close Within 3 Month - EMI (Rs)' },
    { alias: 'PBSLPOS', name: 'P.B.S.L - POS (Rs lacs)' },
    { alias: 'PBSLEMI', name: 'P.B.S.L - EMI (Rs)' },
    { alias: 'BalancePOS', name: 'Balance Transfer - POS (Rs lacs)' },
    { alias: 'BalanceEMI', name: 'Balance Transfer - EMI (Rs)' },
    { alias: 'TCLPOS', name: 'Total Considered Liability - POS (Rs lacs)' },
    { alias: 'TCLEMI', name: 'Total Considered Liability - EMI (Rs)' },
    { alias: 'X10IntObligation', name: 'X10 Int. Obligation (Rs)' },
    { alias: 'SumExtenalYearly', name: 'External Yearly Repayment (Rs. Lacs)' },
    { alias: 'YearlyRepayment', name: 'External Yearly Repayment (Rs. Lacs) incl. X10 Int' },
    { alias: 'SumBounces', name: 'Total EMI Bounce' },
    { alias: 'MAXofDPDTrack', name: 'MAX of DPD Track' },
]

app.masterBank = [
    { alias: 'BSMonthlyCredits', name: 'Banking Snapshot - Total Monthly Credits' },
    { alias: 'BSMonthlyDebits', name: 'Banking Snapshot - Total Monthly Debits' },
    { alias: 'BSNoOfCredits', name: 'Banking Snapshot - Total No. of Credits' },
    { alias: 'BSNoOfDebits', name: 'Banking Snapshot - Total No. of Debits' },
    { alias: 'BSOWChequeReturns', name: 'Banking Snapshot - Total O/W Cheque Returns' },
    { alias: 'BSIWChequeReturns', name: 'Banking Snapshot - Total I/W Cheque Returns' },
    { alias: 'BSImpMargin', name: 'Banking Snapshot - Imp Margin' },
    { alias: 'BSOWReturnPercent', name: 'Banking Snapshot - O/W Return %' },
    { alias: 'BSIWReturnPercent', name: 'Banking Snapshot - I/w return %' },
    { alias: 'BSDRCRRatio', name: 'Banking Snapshot - Dr./Cr. Ratio' },
    { alias: 'ODSactionLimit', name: 'OD Details - Total Sanction Limit' },
    { alias: 'ODAvgUtilization', name: 'OD Details - Average OD Utilization' },
    { alias: 'ODInterestPaid', name: 'OD Details -  Total Interest Paid ' },
    { alias: 'AMLAvgCredits', name: 'AML - Average Credits' },
    { alias: 'AMLAvgDebits', name: 'AML - Average Debits' },
    { alias: 'BankingToTurnoverRatio', name: 'Banking to Turnover Ratio' },
    { alias: 'ABB', name: 'Average ABB' }
]

app.masterAccount = [
    { alias: 'ACSProduct', name: 'Account Setup Details - Product' ,master : "Products"},
    { alias: 'ACSScheme', name: 'Account Setup Details - Scheme', master : "Scheme" },
    { alias: 'ACSPDRemarks', name: 'Account Setup Details - PD Remarks' },
    { alias: 'PDCustomerMargin', name: 'Account Setup Details - Customer Margin' },

    { alias: 'BDDiversificationCustomers', name: 'Borrower Details - Diversification: No. of clients / customers', master : "DiversificationCustomers" },
    { alias: 'BDDependenceOnSuppliers', name: 'Borrower Details - Dependence On Suppliers',master : "DependenceOnSuppliers" },
    { alias: 'BDBusinessVintage', name: 'Borrower Details - Business Vintage' ,master : "BussinessVintages"},
    { alias: 'BDOrdersinHand', name: 'Borrower Details - Order In Hand'  },
    { alias: 'BDProjectsCompleted', name: 'Borrower Details - Projects Completed' },
    { alias: 'BDCustomerSegmentClasification', name: 'Borrower Details - Business Segment' , master : "RatingMastersCustomerSegment"  },
    { alias: 'BDBorrowerConstitution', name: 'Borrower Details - Borrower Constitution' , master : "BorrowerConstitutionList" },
    { alias: 'BDMarketReference', name: 'Borrower Details - Market Reference' ,master : "MarketReferences" },
    { alias: 'BDExternalRating', name: 'Borrower Details - External Rating',master : "ExternalRatings" },
    { alias: 'BDManagement', name: 'Borrower Details - Management' },

    { alias: 'LDProposedLoanAmount', name: 'Loan Details - Requested Loan Amount' },
    { alias: 'LDRequestedLimitAmount', name: 'Loan Details - Proposed Amount of Limit (Rs Lacs)' },
    { alias: 'LDLimitTenor', name: 'Loan Details - Limit Tenor (Months)' },
    { alias: 'LDProposedRateInterest', name: 'Loan Details - Proposed Rate of Interest (ROI) %' },
    { alias: 'LDProposedPFee', name: 'Loan Details - Proposed Pro. Fee %' },
    { alias: 'LDInterestOutgo', name: 'Loan Details - Proposed X10 Interest Outgo in Rs. (Lacs)' },

    { alias: 'LDPOValueforBacktoBack', name: 'Loan Details - Project PO Value for Back to Back Transaction' },
    { alias: 'LDExpectedPayment', name: 'Loan Details - Expected Payment from project in 120 days in Lakhs' },

    { alias: 'LDIfYesEistingLimitAmount', name: 'Loan Details - If Yes Existing Limit Amount' },
    { alias: 'LDExistingRoi', name: 'Loan Details - Existing ROI %' },
    { alias: 'LDExistingPf', name: 'Loan Details - Existing Pro. Fee %' },
    { alias: 'LDVintageWithX10', name: 'Loan Details - Vintage With X10' },

    { alias: 'LDTypeSecurity', name: 'Loan Details - Type of Security' },
    { alias: 'LDDetailsSecurity', name: 'Loan Details - Details of Security' },

    { alias: 'LDIfBackedByPO', name: 'Loan Details - If Backed By PO' },
    { alias: 'LDIfExistingCustomer', name: 'Loan Details - If Existing Customer' },

    { alias: 'CBMStockSellIn', name: 'Customer Business Mix - Stock & Sell - in %' },
    { alias: 'CBMB2BGovtIn', name: 'Customer Business Mix - B2B - Govt.- in %' },
    { alias: 'CBMB2BCorporateIn', name: 'Customer Business Mix - B2B - Corporate - in %' },

    { alias: 'DMIrisComputersLimitedIn', name: 'Distributor Mix - Iris Computers Limited - in %' },
    { alias: 'DMSavexIn', name: 'Distributor Mix - Savex - in %' },
    { alias: 'DMRashiIn', name: 'Distributor Mix - Rashi - in %' },
    { alias: 'DMSupertronIn', name: 'Distributor Mix - Supertron - in %' },
    { alias: 'DMCompuageIn', name: 'Distributor Mix - Compuage - in %' },
    { alias: 'DMAvnetIn', name: 'Distributor Mix - Avnet - in %' },

    { alias: 'PDAvgExperienceInSameLineOfBusiness', name: 'Management & Promoter Details - Average Experience in Same Line of business (Yrs)' },
    { alias: 'PDMaxExperienceInSameLineOfBusiness', name: 'Management & Promoter Details - Max Experience in Same Line of business (Yrs)' },
    { alias: 'PDMinExperienceInSameLineOfBusiness', name: 'Management & Promoter Details - Min Experience in Same Line of business (Yrs)' },
    { alias: 'PDAvgCibilScore', name: 'Management & Promoter Details - Average Cibil Score' },
    { alias: 'PDMaxCibilScore', name: 'Management & Promoter Details - Max Cibil Score' },
    { alias: 'PDMinCibilScore', name: 'Management & Promoter Details - Min Cibil Score' },
    { alias: 'PDAvgRealEstatePosition', name: 'Management & Promoter Details - Average Real Estate Position' },
    { alias: 'PDMaxRealEstatePosition', name: 'Management & Promoter Details - Max Real Estate Position' },
    { alias: 'PDMinRealEstatePosition', name: 'Management & Promoter Details - Min Real Estate Position' },
    { alias: 'PDRealEstateSumValue', name: 'Management & Promoter Details - Real Estate position of the borrower' },
    { alias: 'PDResiOwnershipStatus', name: 'Management & Promoter Details - Resi Ownership Status', master :"ResiOwnershipStatus" },
    { alias: 'PDMinIndexEducationalQualificationOfMainPromoter', name: 'Management & Promoter Details - Educational Qualification of Main Promoter' , master : "EducationalQualificationOfMainPromoters" },
    { alias: 'PDOfficeOwnershipStatus', name: 'Management & Promoter Details - Office Ownership Status' , master : "OfficeOwnershipStatus"  },

    { alias: 'VDMaxOfAverageDelayDays', name: 'Vendor Details - Max of Average Delay Days' },
    { alias: 'VDAverageDelayDays', name: 'Vendor Details - Average of Average Delay Days' },
    { alias: 'VDMaxDelayDays', name: 'Vendor Details - Max Delay Days' },
    { alias: 'VDMaxPaymentDays', name: 'Vendor Details - Max Payment Days' },
    { alias: 'VDAvgStandardDeviation', name: 'Vendor Details - Standard Deviation' },
    { alias: 'VDAveragePaymentDays', name: 'Vendor Details - Average Payment Days' },
    { alias: 'VDAvgTransactionWeightedPaymentDelayDays', name: 'Vendor Details - Avg Transaction Weighted Payment Delay Days' },
    { alias: 'VDAvgDelayDaysStandardDeviation', name: 'Vendor Details - Delay Days Standard Deviation' },
    { alias: 'VDAvgTransactionWeightedPaymentDays', name: 'Vendor Details - Avg Transaction Weighted Payment Days' },
    { alias: 'VDAvgDaysStandardDeviation', name: 'Vendor Details - Days Standard Deviation' },
    { alias: 'VDAvgAmountOfBusinessDone', name: 'Vendor Details - Amount Of Business Done' },
]

app.masterCIBIL = [
    { alias: 'SelectRating', name: 'CIBIL - Select Rating' },
    { alias: 'MinScore', name: 'CIBIL - Min Score' },
]