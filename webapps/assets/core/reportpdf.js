var report = {

}

report.menu = ko.observableArray([
  { to: '/reportpdf/rptclientsaccountsummarypdf', title: 'Clients Account Summary', icon: 'fa fa-file-pdf-o', color: 'rgb(10, 114, 183)' }, 
  { to: '/reportpdf/rptclientssummarypdf', title: 'Clients Summary', icon: 'fa fa-file-pdf-o', nope: true, color: 'rgb(17, 134, 212)' },
  { to: '/reportpdf/rptcleareraccountsummarypdf', title: 'Clearer Account Summary', icon: 'fa fa-file-pdf-o', nope: true, color: '#3498DB' }, 
  { to: '/reportpdf/rptclearersummarypdft', title: 'Clearer Summary', icon: 'fa fa-file-pdf-o', nope: true, color: 'rgb(23, 142, 73)' },
  { to: '/reportpdf/sendemail', title: 'Send Email', icon: 'fa fa-file-pdf-o', color: 'rgb(32, 162, 87)' }, 
  { to: '/reportpdf/consolidatedopentradespdf', title: 'Consolidated Open Trades', nope: true, icon: 'fa fa-file-pdf-o', color: '#28B463' }, 
  { to: '/reportpdf/cleareraccountvolume', title: 'Clearer / Account Volume', icon: 'fa fa-file-pdf-o', color: 'rgb(212, 130, 0)' }, 
  { to: '/reportpdf/dailyperformancesummarypdf', title: 'Daily Performance Summary', icon: 'fa fa-file-pdf-o', color: 'rgb(234, 144, 0)' }, 
  { to: '/reportpdf/opentradesummarypdf', title: 'Open Trade Summary', icon: 'fa fa-file-pdf-o', color: '#F39C12' },
  { to: '/reportpdf/opentradesummarybyclientspdf', title: 'Clearport Open Trades Report', icon: 'fa fa-file-pdf-o', color: 'rgb(243, 18, 111)' },
  { to: '#', title: 'Concentration Risk', icon: 'fa fa-file-pdf-o', color: 'rgb(243, 18, 111)' },
  { to: '#', title: 'Roger Daily', icon: 'fa fa-file-pdf-o', color: 'rgb(243, 18, 111)' },
  { to: '#', title: 'ADV AME Volume Report', icon: 'fa fa-file-pdf-o', color: 'rgb(243, 195, 18)' }
  ]);