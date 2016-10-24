var SettingEmail = {
  Id: ko.observable(""),
  SenderName: ko.observable(""),
  SenderEmail: ko.observable(""),
  SmtpAddress: ko.observable(""),
  Port: ko.observable(""),
  Username: ko.observable(""),
  Password: ko.observable(""),
  Edit: ko.observable(false),
};

SettingEmail.cancelData = function () {
  SettingEmail.getDataLoad();
}

SettingEmail.saveData = function () {
  var param = {
    Id: 1,
    SenderName: SettingEmail.SenderName(),
    SenderEmail: SettingEmail.SenderEmail(),
    SmtpAddress: SettingEmail.SmtpAddress(),
    Port: parseInt(SettingEmail.Port()),
    Username: SettingEmail.Username(),
    Password: SettingEmail.Password(),
  }
  var url = "/masteremailsetting/savedata";
  var validator = $("#SettEmail").data("kendoValidator");
  if (validator == undefined) {
    validator = $("#SettEmail").kendoValidator().data("kendoValidator");
  }
  if (validator.validate()) {
    ajaxPost(url, param, function (res) {
      if (res.IsError != true) {
        SettingEmail.getDataLoad();
        swal("Success!", res.Message, "success");
      } else {
        return swal("Error!", res.Message, "error");
      }
    });
  }
}

SettingEmail.saveEdit = function () {
}

SettingEmail.getDataLoad = function () {
  var param = {
  }
  var url = "/masteremailsetting/getdata";

  ajaxPost(url, param, function (res) {
    if (res.Data.Count != 0) {
      var dataSetting = res.Data.Records[0];
      SettingEmail.Id(dataSetting.Id);
      SettingEmail.SenderName(dataSetting.SenderName);
      SettingEmail.SenderEmail(dataSetting.SenderEmail);
      SettingEmail.SmtpAddress(dataSetting.SmtpAddress);
      SettingEmail.Port(dataSetting.Port);
      SettingEmail.Username(dataSetting.Username);
      SettingEmail.Password(dataSetting.Password);
    }
  });
}
$(document).ready(function () {
  SettingEmail.getDataLoad();
});