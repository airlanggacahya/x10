package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	// "errors"
	"github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	knot "github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type LoanApprovalController struct {
	*BaseController
}

func (c *LoanApprovalController) Default(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{
		"shared/filter.html",
		"shared/loading.html",
		"loanapproval/loansummary.html",
		"loanapproval/loandetail.html",
		"loanapproval/keypolicyparametercheck.html",
		"loanapproval/promotersbackground.html",
		"loanapproval/companybackground.html",
		"loanapproval/referencecheck.html",
		"loanapproval/loanproperty.html",
		"loanapproval/loanourstanding.html",
		"loanapproval/loancompliance.html",
		"loanapproval/paymenttrack.html",
		"loanapproval/custbussinesmix.html",
		"loanapproval/distributormix.html",
		"loanapproval/compliancecheck.html",
		"loanapproval/commercialcibil.html",
	}

	return DataAccess
}

func (c *LoanApprovalController) SampleChart(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := Previlege{}

	for _, o := range access {
		DataAccess.Create = o["Create"].(bool)
		DataAccess.View = o["View"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Process = o["Process"].(bool)
		DataAccess.Delete = o["Delete"].(bool)
		DataAccess.Edit = o["Edit"].(bool)
		DataAccess.Menuid = o["Menuid"].(string)
		DataAccess.Menuname = o["Menuname"].(string)
		DataAccess.Approve = o["Approve"].(bool)
		DataAccess.Username = o["Username"].(string)
	}

	DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html"}
	k.Config.OutputType = knot.OutputTemplate
	return DataAccess
}

func (c *LoanApprovalController) GetAllData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)
	t := tk.M{}
	err := k.GetPayload(&t)
	if err != nil {
		res.SetError(err)
		return res
	}

	// id := t.GetString("customerid") + "|" + t.GetString("dealno")
	dealno := t.GetString("dealno")
	customerid := t.GetString("customerid")

	conn, err := GetConnection()
	defer conn.Close()
	//=====================================================AD
	// csr, e := conn.NewQuery().
	// 	Where(dbox.And(dbox.Eq("_id", id))).
	// 	From("AccountDetails").
	// 	Cursor(nil)
	// defer csr.Close()
	// if e != nil {
	// 	res.SetError(e)
	// 	return res
	// }

	AD := []tk.M{}
	// err = csr.Fetch(&AD, 0, false)
	// if err != nil && csr.Count() > 0 {
	// 	res.SetError(err)
	// 	return res
	// }

	err = new(DataConfirmController).GetDataConfirmed(customerid, dealno, new(AccountDetail).TableName(), &AD)
	if err != nil {
		res.SetError(err)
		return res
	}

	//==================================================CP
	// csr, e := conn.NewQuery().
	// 	Where(dbox.And(dbox.Eq("_id", id))).
	// 	From("CustomerProfile").
	// 	Cursor(nil)
	// defer csr.Close()
	// if e != nil {
	// 	res.SetError(e)
	// 	return res
	// }

	CP := []tk.M{}
	// err = csr.Fetch(&CP, 0, false)
	// if err != nil && csr.Count() > 0 {
	// 	res.SetError(err)
	// 	return res
	// }
	err = new(DataConfirmController).GetDataConfirmed(customerid, dealno, "CustomerProfile", &CP)
	if err != nil {
		res.SetError(err)
		return res
	}

	//==================================================RTR
	// csr, e = conn.NewQuery().
	// 	Where(dbox.And(dbox.Eq("CustomerId", customerid), dbox.Eq("DealNo", dealno))).
	// 	From("RepaymentRecords").
	// 	Cursor(nil)
	// defer csr.Close()
	// if e != nil {
	// 	res.SetError(e)
	// 	return res
	// }

	RTR := []tk.M{}
	// err = csr.Fetch(&RTR, 0, false)
	// if err != nil && csr.Count() > 0 {
	// 	res.SetError(err)
	// 	return res
	// }

	err = new(DataConfirmController).GetDataConfirmed(customerid, dealno, "RepaymentRecords", &RTR)
	if err != nil {
		res.SetError(err)
		return res
	}

	//==================================================CIBILCOMPANY
	csr, e := conn.NewQuery().
		Where(dbox.And(dbox.Eq("Profile.customerid", cast.ToInt(customerid, cast.RoundingAuto)), dbox.Eq("Profile.dealno", dealno))).
		From("CibilReport").
		Cursor(nil)
	defer csr.Close()
	if e != nil {
		res.SetError(e)
		return res
	}

	CBP := []tk.M{}
	err = csr.Fetch(&CBP, 0, false)
	if err != nil && csr.Count() > 0 {
		res.SetError(err)
		return res
	}

	//==================================================CIBILPROM
	csr, e = conn.NewQuery().
		Where(dbox.And(dbox.Eq("ConsumerInfo.CustomerId", cast.ToInt(customerid, cast.RoundingAuto)), dbox.Eq("ConsumerInfo.DealNo", dealno))).
		From("CibilReportPromotorFinal").
		Cursor(nil)
	defer csr.Close()
	if e != nil {
		res.SetError(e)
		return res
	}

	CBPROM := []tk.M{}
	err = csr.Fetch(&CBPROM, 0, false)
	if err != nil && csr.Count() > 0 {
		res.SetError(err)
		return res
	}

	//==================================================BA
	// csr, e = conn.NewQuery().
	// 	Where(dbox.And(dbox.Eq("CustomerId", cast.ToInt(customerid, cast.RoundingAuto)), dbox.Eq("DealNo", dealno))).
	// 	From("BankAnalysisV2").
	// 	Cursor(nil)
	// defer csr.Close()
	// if e != nil {
	// 	res.SetError(e)
	// 	return res
	// }

	BA := []tk.M{}
	// err = csr.Fetch(&BA, 0, false)
	// if err != nil && csr.Count() > 0 {
	// 	res.SetError(err)
	// 	return res
	// }
	err = new(DataConfirmController).GetDataConfirmed(customerid, dealno, "BankAnalysisV2", &BA)
	if err != nil {
		res.SetError(err)
		return res
	}

	//==================================================Norm
	csr, e = conn.NewQuery().
		Where(dbox.And(dbox.Eq("showinloanapprovalreport", true))).
		From("NormMaster").
		Cursor(nil)
	defer csr.Close()
	if e != nil {
		res.SetError(e)
		return res
	}

	NORM := []tk.M{}
	err = csr.Fetch(&NORM, 0, false)
	if err != nil && csr.Count() > 0 {
		res.SetError(err)
		return res
	}

	data := tk.M{}

	data.Set("RTR", RTR)
	data.Set("CP", CP)
	data.Set("AD", AD)
	data.Set("CIBIL", CBP)
	data.Set("CIBILPROM", CBPROM)
	data.Set("BA", BA)
	data.Set("NORM", NORM)
	res.Data = data
	return res
}
