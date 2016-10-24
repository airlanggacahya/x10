var dm = {
	menuMasterData :ko.observable(true),
    accountsVisible :ko.observable(false),
    clearersVisible :ko.observable(false),
    cmeCutOffVisible :ko.observable(false),
    contractsVisible :ko.observable(false),
    contractsExpiryVisible :ko.observable(false),
    updAccountsVisible :ko.observable(false),
    updContractVisible :ko.observable(false),
    updExchangeVisible :ko.observable(false),
    updExpiryVisible :ko.observable(false),
    updFileTypesVisible :ko.observable(false),
    updMappingFieldsVisible :ko.observable(false),
    updSettleVisible :ko.observable(false),
    updSpecialValueVisible :ko.observable(false),
    clientsVisible :ko.observable(false),
    currenciesVisible :ko.observable(false),
    fxRatesVisible :ko.observable(false),
    nlvVisible :ko.observable(false),
};

dm.formAcconts = function(){
    window.location.href = "/datamaster/accounts";
}

dm.formClients = function(){
    window.location.href = "/datamaster/clients";
}

dm.formCmmGroup = function(){
    window.location.href = "/datamaster/commissiongroup";
}

dm.formCmmGroupFees = function(){
    window.location.href = "/datamaster/commissiongroupfees";
}

dm.formContracts = function(){
    window.location.href = "/datamaster/contracts";
}

dm.formCurrencies = function(){
    window.location.href = "/datamaster/currencies";
}

dm.formUpdAcconts = function(){
    window.location.href = "/datamaster/updaccounts";
}

dm.formUpdContract = function(){
    window.location.href = "/datamaster/updcontracts";
}

dm.formClearers = function(){
    window.location.href = "/datamaster/clearers";
}

dm.formFxRates = function(){
    window.location.href = "/datamaster/fxratess";
}

dm.formAccFees = function(){
    window.location.href = "/datamaster/accountsfees";
}

dm.formExchange = function(){
    window.location.href = "/datamaster/exchange";
}

dm.formUpdExchange = function(){
    window.location.href = "/datamaster/updexchange";
}


dm.formCmeCutOff = function(){
    window.location.href = "/datamaster/flatfilecutoff";
}

$(document).ready(function () { 
});