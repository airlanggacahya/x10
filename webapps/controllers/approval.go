package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"errors"
	// "fm	t"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"strconv"
)

type ApprovalController struct {
	*BaseController
}

func (c *ApprovalController) Default(k *knot.WebContext) interface{} {
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
		DataAccess.Rolename = o["Rolename"].(string)
		DataAccess.Fullname = o["Fullname"].(string)
	}

	DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{
		"shared/filter.html",
		"shared/loading.html",
		"approval/accountdetails.html",
		"approval/balancesheet.html",
		"approval/default.html",
		"approval/liquidityratios.html",
		"approval/pandl.html",
		"approval/bankingsnapshot.html",
		"approval/keyfinancialparameters.html",
		"approval/loandetails.html",
		"approval/borrowerdetails.html",
		"approval/keyfinancialratios.html",
		"approval/operatingratios.html",
		"approval/ratingsandreferences.html",
		"approval/cibildetails.html",
		"approval/keypolicyparameters.html",
		"approval/outstandingdebt.html",
		"approval/realestateposition.html",
		"approval/coverageratios.html",
		"approval/leverageratios.html",
		"approval/overview.html",
		"approval/redflags.html",
		"approval/comments.html",
		"approval/headerstatis.html",
		"approval/allfield.html",
		"loanapproval/loansummary.html",
		"loanapproval/loandetail.html",
		"loanapproval/paymenttrack.html",
		"loanapproval/keypolicyparametercheck.html",
		"loanapproval/promotersbackground.html",
		"loanapproval/companybackground.html",
		"loanapproval/referencecheck.html",
		"loanapproval/loanproperty.html",
		"loanapproval/loanourstanding.html",
		"loanapproval/loancompliance.html",
		"loanapproval/custbussinesmix.html",
		"loanapproval/compliancecheck.html",
	}

	return DataAccess
}

func (c *ApprovalController) GetCreditAnalys(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	datas := tk.M{}
	err := k.GetPayload(&datas)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	customerId, e := strconv.Atoi(datas.GetString("CustomerId"))
	if e != nil {
		panic(e)
	}
	dealNo := datas.GetString("DealNo")

	model := NewCreditAnalysModel()
	result, err := model.Get(customerId, dealNo, "")

	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	return CreateResult(true, result, "")
}

func (c *ApprovalController) GetDCFinalSanction(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	datas := tk.M{}
	err := k.GetPayload(&datas)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	customerId, e := strconv.Atoi(datas.GetString("CustomerId"))
	if e != nil {
		panic(e)
	}
	dealNo := datas.GetString("DealNo")

	model := NewDCFinalSanctionModel()
	result, err := model.Get(customerId, dealNo)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	return CreateResult(true, result, "")
}

func (c *ApprovalController) GetDCAndCreditAnalys(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	datas := tk.M{}
	err := k.GetPayload(&datas)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	customerId, e := strconv.Atoi(datas.GetString("CustomerId"))
	if e != nil {
		panic(e)
	}
	dealNo := datas.GetString("DealNo")

	modelDC := NewDCFinalSanctionModel()
	resultDC, err := modelDC.Get(customerId, dealNo)
	if err != nil {
		c.WriteLog(err)
		//return CreateResult(false, nil, err.Error())
	}

	modelCredit := NewCreditAnalysModel()
	resultCredit, err := modelCredit.Get(customerId, dealNo, "")
	if err != nil {
		//return CreateResult(false, nil, err.Error())
	}

	return []tk.M{{"CreditAnalys": resultCredit}, {"DCFinalSanction": resultDC}}
}

func (c *ApprovalController) GetDCAndCreditAnalysDraft(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	datas := tk.M{}
	err := k.GetPayload(&datas)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	customerId, e := strconv.Atoi(datas.GetString("CustomerId"))
	if e != nil {
		panic(e)
	}
	dealNo := datas.GetString("DealNo")

	modelDC := NewDCFinalSanctionModel()
	resultDC, err := modelDC.Get(customerId, dealNo)
	if err != nil {
		//return CreateResult(false, nil, err.Error())
	}

	modelCredit := NewCreditAnalysModel()
	resultCredit, err := modelCredit.Get(customerId, dealNo, "Draft")
	if err != nil {
		//return CreateResult(false, nil, err.Error())
	}

	resultCreditFix, err := modelCredit.Get(customerId, dealNo, "")
	if err != nil {
		//return CreateResult(false, nil, err.Error())
	}

	return []tk.M{{"CreditAnalys": resultCredit}, {"DCFinalSanction": resultDC}, {"CreditAnalysFix": resultCreditFix}}
}

func (c *ApprovalController) SaveCreditAnalys(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	datas := struct {
		Ca     CreditAnalysModel
		Status int
	}{}

	err := k.GetPayload(&datas)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	model := NewCreditAnalysModel()

	result, err := model.Save(datas.Ca, datas.Status)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	if datas.Status == 1 {
		err = UpdateDealSetup(strconv.Itoa(datas.Ca.CustomerId), datas.Ca.DealNo, "ds", "Decision Committee Action Awaited")
		if err != nil {
			c.WriteLog(err.Error())
			// return CreateResult(false, nil, err.Error())
		}

		DC := NewDCFinalSanctionModel()

		DCResult, err := DC.Get(datas.Ca.CustomerId, datas.Ca.DealNo)

		if err != nil {
			// return CreateResult(false, nil, err.Error())
		} else {
			DCResult.LatestStatus = "Awaiting Action"

			err = DC.Update(DCResult)
			if err != nil {
				c.WriteLog(err)
				return CreateResult(false, nil, err.Error())
			}
		}
	}

	return CreateResult(true, result, "")
}

func (c *ApprovalController) SaveDCFinalSanction(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	datas := DCFinalSanctionModel{}
	err := k.GetPayload(&datas)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	model := NewDCFinalSanctionModel()
	result, err := model.Save(datas)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	return CreateResult(true, result, "")
}

func (c *ApprovalController) UpdateDateAndLatestValue(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	credit := NewCreditAnalysModel()

	datas := DCFinalSanctionModel{}
	err := k.GetPayload(&datas)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	model := NewDCFinalSanctionModel()
	err = model.Update(datas)
	if err != nil {
		c.WriteLog("sarif")
		return CreateResult(false, nil, err.Error())
	}

	cid := strconv.Itoa(datas.CustomerId)
	dealno := datas.DealNo

	arr := []string{"AccountDetails", "InternalRTR", "BankAnalysisV2", "CustomerProfile", "RatioInputData", "RepaymentRecords", "StockandDebt", "CibilReport", "CibilReportPromotorFinal", "DueDiligenceInput"}

	if datas.LatestStatus == "Sent Back" {
		for _, val := range arr {
			err = changeStatus(cid, dealno, val, 1)
			if err != nil {
				return CreateResult(false, nil, err.Error())
			}
		}

		credit.Delete(datas.CustomerId, datas.DealNo, "")
		creditList, err := credit.Get(datas.CustomerId, datas.DealNo, "Draft")

		if err != nil {
			return CreateResult(false, nil, err.Error())
		}

		err = credit.UpdateIsFreezeByStruct(creditList, false, "Draft")
		if err != nil {
			return CreateResult(false, nil, err.Error())
		}

	} else {
		for _, val := range arr {
			err = changeStatus(cid, dealno, val, 2)
			if err != nil {
				return CreateResult(false, nil, err.Error())
			}
		}
	}

	err = UpdateDealSetup(cid, dealno, "ds", datas.LatestStatus)

	// if err != nil {
	// 	return CreateResult(false, nil, err.Error())
	// }

	return CreateResult(true, nil, "")
}

func (c *ApprovalController) GetCheckConfirm(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	payload := tk.M{}

	res := new(tk.Result)
	result := tk.M{}
	er := k.GetPayload(&payload)

	if er != nil {
		return res.SetError(er)
	}
	ad, er := c.FetchAccountDetail(payload["customerID"].(string), payload["dealNO"].(string))
	if er != nil {
		result.Set("AdStatus", -1)
	} else {
		result.Set("AdStatus", ad.Status)

	}

	d, er := strconv.Atoi(payload["customerID"].(string))
	ac, er := c.FetchCustomerApplication(d, payload["dealNO"].(string))
	if er != nil {
		result.Set("AcStatus", -1)
	} else {
		result.Set("AcStatus", ac.Status)

	}

	ci, er := c.FetchCibil(d, payload["dealNO"].(string))
	if er != nil {
		result.Set("CiStatus", -1)
	} else {
		result.Set("CiStatus", ci.IsConfirm)
	}

	ba, er := c.FetchBankAnalis(d, payload["dealNO"].(string))
	if er != nil {
		result.Set("BaStatus", -1)
	} else {
		result.Set("BaStatus", ba.Status)

	}

	due, er := c.FetchDueDiligence(payload["customerID"].(string), payload["dealNO"].(string))
	if er != nil {
		result.Set("DueStatus", -1)
	} else {
		result.Set("DueStatus", due.Status)

	}

	prom, er := c.FetchCibilPromotor(d, payload["dealNO"].(string))
	if er != nil {
		result.Set("CibPromStatus", -1)
	} else {
		result.Set("CibPromStatus", prom.StatusCibil)

	}

	rtr, er := c.FetchRTR(payload["customerID"].(string), payload["dealNO"].(string))
	if er != nil {
		result.Set("rtrStatus", -1)
	} else {
		result.Set("rtrStatus", rtr.Status)
	}

	Sc, er := c.FetchCrediScoreCard(payload["customerID"].(string), payload["dealNO"].(string))
	if er != nil {
		result.Set("ScFound", nil)
	} else {
		if Sc != nil {
			result.Set("ScFound", true)
		} else {
			result.Set("ScFound", false)
		}
	}

	custid := payload["customerID"].(string) + "|" + payload["dealNO"].(string)

	in, er := c.FetchInternalRTR(custid)
	if er != nil {
		result.Set("SdStatus", -1)
	} else {

		result.Set("intRTRStatus", in.Status)

	}

	sd, er := c.FetchStockAndDebt(custid)
	if er != nil {
		result.Set("SdStatus", -1)
	} else {
		if sd.IsConfirm == true {
			result.Set("SdStatus", 1)
		} else {
			result.Set("SdStatus", 0)
		}

	}

	bsc, er := c.FetchBalanceSheet(custid)

	if er != nil {
		result.Set("BscStatus", -1)
	} else {
		if bsc.Confirmed == true {
			result.Set("BscStatus", 1)
		} else {
			result.Set("BscStatus", 0)
		}
	}

	return c.SetResultInfo(false, "", result)
}

func (c *ApprovalController) FetchAccountDetail(customerID string, DealNo string) (*AccountDetail, error) {
	query := tk.M{"where": dbox.And([]*dbox.Filter{dbox.Eq("customerid", customerID), dbox.Eq("dealno", DealNo)}...)}
	csr, err := c.Ctx.Find(new(AccountDetail), query)
	defer csr.Close()
	if err != nil {
		return nil, err
	}

	results := make([]AccountDetail, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, err
	}

	if (len(results)) == 0 {
		return nil, errors.New("Account Detail data not found")
	}

	return &results[0], nil
}

func (c *ApprovalController) FetchInternalRTR(custid string) (*InternalRtr, error) {
	query := tk.M{"where": dbox.And([]*dbox.Filter{dbox.Eq("_id", custid)}...)}
	csr, err := c.Ctx.Find(new(InternalRtr), query)
	defer csr.Close()
	if err != nil {
		return nil, err
	}

	results := make([]InternalRtr, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, err
	}

	if (len(results)) == 0 {
		return nil, errors.New("Internal RTR data not found")
	}

	return &results[0], nil
}

func (c *ApprovalController) FetchStockAndDebt(custid string) (*StockandDebtModel, error) {
	query := tk.M{"where": dbox.And([]*dbox.Filter{dbox.Eq("customerid", custid)}...)}
	csr, err := c.Ctx.Find(new(StockandDebtModel), query)
	defer csr.Close()
	if err != nil {
		return nil, err
	}

	results := make([]StockandDebtModel, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, err
	}

	if (len(results)) == 0 {
		return nil, errors.New("Credit Score Card data not found")
	}

	return &results[0], nil
}

func (c *ApprovalController) FetchBalanceSheet(custid string) (*RatioInputData, error) {
	query := tk.M{"where": dbox.And([]*dbox.Filter{dbox.Eq("customerid", custid)}...)}
	csr, err := c.Ctx.Find(new(RatioInputData), query)
	defer csr.Close()
	if err != nil {
		return nil, err
	}

	results := make([]RatioInputData, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, err
	}

	if (len(results)) == 0 {
		return nil, errors.New("Balance Sheet data not found")
	}

	return &results[0], nil
}

// var stock tk.M{}

func (c *ApprovalController) FetchCrediScoreCard(customerID string, DealNo string) (interface{}, error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return nil, err
	}

	res := []tk.M{}
	query := []*dbox.Filter{}
	query = append(query, dbox.And(
		dbox.Eq("CustomerId", customerID),
		dbox.Eq("DealNo", DealNo)))

	csr, err := conn.NewQuery().
		Select().
		From("CreditScorecard").
		Where(query...).
		Cursor(nil)

	if err != nil {
		return nil, err
	}
	defer csr.Close()
	if csr != nil {
		err = csr.Fetch(&res, 0, false)

		if err != nil {
			return nil, err
		}
	}

	if (len(res)) == 0 {
		return nil, errors.New("Credit Score Card data not found")
	}

	return &res[0], nil
}

func (c *ApprovalController) FetchDueDiligence(customerID string, DealNo string) (*DueDiligenceInput, error) {
	query := tk.M{"where": dbox.And([]*dbox.Filter{dbox.Eq("customerid", customerID), dbox.Eq("dealno", DealNo)}...)}
	csr, err := c.Ctx.Find(new(DueDiligenceInput), query)
	defer csr.Close()
	if err != nil {
		return nil, err
	}

	results := make([]DueDiligenceInput, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, err
	}

	if (len(results)) == 0 {
		return nil, errors.New("DueDiligence data not found")
	}

	return &results[0], nil
}

func (c *ApprovalController) FetchCustomerApplication(customerID int, DealNo string) (*CustomerProfiles, error) {
	query := tk.M{"where": dbox.And([]*dbox.Filter{dbox.Eq("applicantdetail.CustomerID", customerID), dbox.Eq("applicantdetail.DealNo", DealNo)}...)}
	csr, err := c.Ctx.Find(new(CustomerProfiles), query)
	if err != nil {
		return nil, err
	}

	res := make([]CustomerProfiles, 0)
	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return nil, err
	}

	if (len(res)) == 0 {
		return nil, errors.New("Customer Application data not found")
	}

	return &res[0], nil
}

func (c *ApprovalController) FetchRTR(customerID string, DealNo string) (*RTRBottom, error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return nil, err
	}

	res := []RTRBottom{}
	query := []*dbox.Filter{}
	query = append(query, dbox.And(
		dbox.Eq("CustomerId", customerID),
		dbox.Eq("DealNo", DealNo)))

	csr, err := conn.NewQuery().
		Select().
		From("RepaymentRecords").
		Where(query...).
		Cursor(nil)

	if err != nil {
		return nil, err
	}
	defer csr.Close()
	if csr != nil {
		err = csr.Fetch(&res, 0, false)

		if err != nil {
			return nil, err
		}
	}

	if (len(res)) == 0 {
		return nil, errors.New("RTR data not found")
	}

	return &res[0], nil
}

func (c *ApprovalController) FetchCibilPromotor(customerID int, DealNo string) (*ReportData, error) {
	query := tk.M{"where": dbox.And([]*dbox.Filter{dbox.Eq("ConsumerInfo.CustomerId", customerID), dbox.Eq("ConsumerInfo.DealNo", DealNo)}...)}
	csr, err := c.Ctx.Find(new(ReportData), query)
	if err != nil {
		return nil, err
	}

	res := make([]ReportData, 0)
	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return nil, err
	}

	if (len(res)) == 0 {
		return nil, errors.New("CIBIL Promotor data not found")
	}

	return &res[0], nil
}

func (c *ApprovalController) FetchCibil(customerID int, DealNo string) (*CibilReportModel, error) {
	query := tk.M{"where": dbox.And([]*dbox.Filter{dbox.Eq("Profile.customerid", customerID), dbox.Eq("Profile.dealno", DealNo)}...)}
	csr, err := c.Ctx.Find(new(CibilReportModel), query)
	if err != nil {
		return nil, err
	}

	res := make([]CibilReportModel, 0)
	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return nil, err
	}

	if (len(res)) == 0 {
		return nil, errors.New("CIBIL data not found")
	}

	return &res[0], nil
}

func (c *ApprovalController) FetchBankAnalis(customerID int, DealNo string) (*BankAnalysisV2, error) {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return nil, err
	}

	res := []BankAnalysisV2{}

	wh := []*dbox.Filter{}
	wh = append(wh, dbox.Eq("CustomerId", customerID))
	wh = append(wh, dbox.Eq("DealNo", DealNo))

	query, err := conn.NewQuery().
		Select().
		From("BankAnalysisV2").
		Where(wh...).
		Cursor(nil)
	if err != nil {
		return nil, err
	}
	err = query.Fetch(&res, 0, false)
	if (len(res)) == 0 {
		return nil, errors.New("Bank Analis data not found")
	}
	defer query.Close()

	return &res[0], nil
}
