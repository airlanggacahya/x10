package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	"errors"
	"fmt"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type AccountDetailController struct {
	*BaseController
}

func (c *AccountDetailController) Input(k *knot.WebContext) interface{} {
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
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html"}

	return DataAccess
}

func (c *AccountDetailController) Default(k *knot.WebContext) interface{} {
	k.Config.ViewName = "accountdetail/input.html"
	return c.Input(k)
}

func (c *AccountDetailController) Test(k *knot.WebContext) interface{} {
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

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html"}

	return DataAccess
}

func (c *AccountDetailController) GetAccountDetail(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := struct {
		CustomerId string
		DealNo     string
	}{}
	err := k.GetPayload(&payload)
	if err != nil {
		res.SetError(err)
		return res
	}

	tk.Printf("---- %#v\n", payload)

	data, err := c.FetchAccountDetail(payload.CustomerId, payload.DealNo)
	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(data)
	return res
}

func (c *AccountDetailController) GetAccountDetailConfirmed(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := struct {
		CustomerId string
		DealNo     string
	}{}
	err := k.GetPayload(&payload)
	if err != nil {
		res.SetError(err)
		return res
	}

	tk.Printf("---- %#v\n", payload)

	// data, err := c.FetchAccountDetail(payload.CustomerId, payload.DealNo)
	// if err != nil {
	// 	res.SetError(err)
	// 	return res
	// }

	data := AccountDetail{}

	err = new(DataConfirmController).GetDataConfirmed(payload.CustomerId, payload.DealNo, new(AccountDetail).TableName(), &data)

	if err != nil {
		res.SetError(err)
		return res
	}
	res.SetData(data)
	return res
}

// func (c *AccountDetailController) FetchCustomerProfile(customerID string, DealNo string) (*CustomerProfiles, error) {
// 	query := tk.M{"where": dbox.And([]*dbox.Filter{dbox.Eq("_id", customerID+"|"+DealNo)}...)}
// 	csr, err := c.Ctx.Find(new(CustomerProfiles), query)
// 	defer csr.Close()
// 	if err != nil {
// 		return nil, err
// 	}

// 	results := make([]CustomerProfiles, 0)
// 	err = csr.Fetch(&results, 0, false)
// 	if err != nil {
// 		return nil, err
// 	}

// 	if (len(results)) == 0 {
// 		return nil, errors.New("data not found")
// 	}

// 	return &results[0], nil
// }

func (c *AccountDetailController) FetchCustomerProfile(customerID string, DealNo string) (*CustomerProfiles, error) {
	var data = CustomerProfiles{}
	err := new(DataConfirmController).GetDataConfirmed(customerID, DealNo, new(CustomerProfiles).TableName(), &data)
	if err != nil {
		return nil, err
	}

	return &data, nil
}

func (c *AccountDetailController) FetchMasterAccountDetail() (*tk.M, error) {

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return nil, err
	}

	query, err := conn.NewQuery().From("MasterAccountDetail").Cursor(nil)
	if err != nil {
		return nil, err
	}
	results := []tk.M{}
	err = query.Fetch(&results, 0, false)
	defer query.Close()

	if err != nil {
		return nil, err
	}

	if (len(results)) == 0 {
		return nil, errors.New("data not found")
	}

	return &results[0], nil
}

func (c *AccountDetailController) FetchAccountDetail(customerID string, DealNo string) (*AccountDetail, error) {
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
		return nil, errors.New("data not found")
	}

	return &results[0], nil
}

func (c *AccountDetailController) GetMasterAccountDetail(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(tk.Result)

	rd, err := c.FetchMasterAccountDetail()

	if err != nil {
		res.SetError(err)
		return res
	}

	res.Data = rd.Get("Data")

	return res
}

func (c *AccountDetailController) SaveAccountDetail(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(tk.Result)

	payload := new(AccountDetail)
	if err := k.GetPayload(payload); err != nil {
		res.SetError(err)
		return res
	}

	if payload.Id == "" {
		payload.Id = payload.CustomerId + "|" + payload.DealNo
	}

	if err := c.Ctx.Save(payload); err != nil {
		res.SetError(err)
		return res
	}

	if payload.Status == 1 {
		if err := new(DataConfirmController).SaveDataConfirmed(payload.CustomerId, payload.DealNo, payload.TableName(), payload, true); err != nil {
			res.SetError(err)
			return res
		}
	}

	return res
}

func (c *AccountDetailController) SaveSectionAccount(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)
	// fmt.Println("-------1", res)
	payload := new(AccountDetail)

	if err := k.GetPayload(payload); err != nil {
		res.SetError(err)
		return res
	}

	if payload.Id == "" {
		payload.Id = payload.CustomerId + "|" + payload.DealNo

		if err := c.Ctx.Save(payload); err != nil {
			res.SetError(err)
			return res
		}
	} else {
		data, err := c.FetchAccountDetail(payload.CustomerId, payload.DealNo)

		// saveData := new(AccountDetail)
		// .AccountSetupDetails =
		if err != nil {
			res.SetError(err)
			return res
		}

		fmt.Printf("--------- data", data.AccountSetupDetails)
		data.AccountSetupDetails = payload.AccountSetupDetails

		if err := c.Ctx.Save(data); err != nil {
			res.SetError(err)
			return res
		}
	}

	return res
}

func (c *AccountDetailController) SaveSectionBorrower(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := new(AccountDetail)

	if err := k.GetPayload(payload); err != nil {
		res.SetError(err)
		return res
	}

	if payload.Id == "" {
		payload.Id = payload.CustomerId + "|" + payload.DealNo

		if err := c.Ctx.Save(payload); err != nil {
			res.SetError(err)
			return res
		}
	} else {

		data, err := c.FetchAccountDetail(payload.CustomerId, payload.DealNo)

		if err != nil {
			res.SetError(err)
			return res
		}

		data.BorrowerDetails = payload.BorrowerDetails

		if err := c.Ctx.Save(data); err != nil {
			res.SetError(err)
			return res
		}

	}

	return res
}

func (c *AccountDetailController) SaveSectionPromotor(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := new(AccountDetail)

	if err := k.GetPayload(payload); err != nil {
		res.SetError(err)
		return res
	}
	if payload.Id == "" {
		payload.Id = payload.CustomerId + "|" + payload.DealNo

		if err := c.Ctx.Save(payload); err != nil {
			res.SetError(err)
			return res
		}
	} else {
		data, err := c.FetchAccountDetail(payload.CustomerId, payload.DealNo)

		if err != nil {
			res.SetError(err)
			return res
		}

		data.PromotorDetails = payload.PromotorDetails

		if err := c.Ctx.Save(data); err != nil {
			res.SetError(err)
			return res
		}
	}

	return res
}

func (c *AccountDetailController) SaveSectionVendor(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)
	payload := new(AccountDetail)

	if err := k.GetPayload(payload); err != nil {
		res.SetError(err)
		return res
	}

	if payload.Id == "" {
		payload.Id = payload.CustomerId + "|" + payload.DealNo

		if err := c.Ctx.Save(payload); err != nil {
			res.SetError(err)
			return res
		}
	} else {
		data, err := c.FetchAccountDetail(payload.CustomerId, payload.DealNo)

		if err != nil {
			res.SetError(err)
			return res
		}

		data.VendorDetails = payload.VendorDetails

		if err := c.Ctx.Save(data); err != nil {
			res.SetError(err)
			return res
		}
	}

	return res
}

func (c *AccountDetailController) SaveSectionLoan(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)
	payload := new(AccountDetail)

	if err := k.GetPayload(payload); err != nil {
		res.SetError(err)
		return res
	}

	if payload.Id == "" {
		payload.Id = payload.CustomerId + "|" + payload.DealNo

		if err := c.Ctx.Save(payload); err != nil {
			res.SetError(err)
			return res
		}
	} else {
		data, err := c.FetchAccountDetail(payload.CustomerId, payload.DealNo)

		if err != nil {
			res.SetError(err)
			return res
		}

		data.LoanDetails = payload.LoanDetails

		if err := c.Ctx.Save(data); err != nil {
			res.SetError(err)
			return res
		}
	}

	return res
}

func (c *AccountDetailController) SaveSectionCustomer(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)
	payload := new(AccountDetail)

	if err := k.GetPayload(payload); err != nil {
		res.SetError(err)
		return res
	}

	if payload.Id == "" {
		payload.Id = payload.CustomerId + "|" + payload.DealNo
		if err := c.Ctx.Save(payload); err != nil {
			res.SetError(err)
			return res
		}
	} else {
		data, err := c.FetchAccountDetail(payload.CustomerId, payload.DealNo)

		if err != nil {
			res.SetError(err)
			return res
		}

		data.CustomerBussinesMix = payload.CustomerBussinesMix

		if err := c.Ctx.Save(data); err != nil {
			res.SetError(err)
			return res
		}
	}

	return res
}

func (c *AccountDetailController) SaveSectionDistributor(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)
	payload := new(AccountDetail)

	if err := k.GetPayload(payload); err != nil {
		res.SetError(err)
		return res
	}

	if payload.Id == "" {
		payload.Id = payload.CustomerId + "|" + payload.DealNo
		if err := c.Ctx.Save(payload); err != nil {
			res.SetError(err)
			return res
		}
	} else {
		data, err := c.FetchAccountDetail(payload.CustomerId, payload.DealNo)

		if err != nil {
			res.SetError(err)
			return res
		}

		data.DistributorMix = payload.DistributorMix

		if err := c.Ctx.Save(data); err != nil {
			res.SetError(err)
			return res
		}
	}

	return res
}

func (c *AccountDetailController) GetDataBrowser(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)
	payload := tk.M{}

	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	filtersAD := []*dbox.Filter{}
	var filterAD *dbox.Filter
	filterAD = new(dbox.Filter)

	filtersCA := []*dbox.Filter{}
	var filterCA *dbox.Filter
	filterCA = new(dbox.Filter)

	if len(payload.Get("city").([]interface{})) == 0 {
		filtersCA = append(filtersCA, dbox.Ne("applicantdetail.registeredaddress.CityRegistered", "!z"))
		filtersAD = append(filtersAD, dbox.Ne("accountsetupdetails.cityname", "!z"))
	} else {
		filtersCA = append(filtersCA, dbox.In("applicantdetail.registeredaddress.CityRegistered", payload.Get("city").([]interface{})...))
		filtersAD = append(filtersAD, dbox.In("accountsetupdetails.cityname", payload.Get("city").([]interface{})...))
	}

	if len(payload.Get("product").([]interface{})) == 0 {
		filtersAD = append(filtersAD, dbox.Ne("accountsetupdetails.product", "!z"))
	} else {
		filtersAD = append(filtersAD, dbox.In("accountsetupdetails.product", payload.Get("product").([]interface{})...))
	}

	if len(payload.Get("brhead").([]interface{})) == 0 {
		filtersAD = append(filtersAD, dbox.Ne("accountsetupdetails.brhead", "!z"))
	} else {
		filtersAD = append(filtersAD, dbox.In("accountsetupdetails.brhead", payload.Get("brhead").([]interface{})...))
	}

	if len(payload.Get("scheme").([]interface{})) == 0 {
		filtersAD = append(filtersAD, dbox.Ne("accountsetupdetails.scheme", "!z"))
	} else {
		filtersAD = append(filtersAD, dbox.In("accountsetupdetails.scheme", payload.Get("scheme").([]interface{})...))
	}

	if len(payload.Get("rm").([]interface{})) == 0 {
		filtersAD = append(filtersAD, dbox.Ne("accountsetupdetails.rmname", "!z"))
	} else {
		filtersAD = append(filtersAD, dbox.In("accountsetupdetails.rmname", payload.Get("rm").([]interface{})...))
	}

	if len(payload.Get("ca").([]interface{})) == 0 {
		filtersAD = append(filtersAD, dbox.Ne("accountsetupdetails.creditanalyst", "!z"))
	} else {
		filtersAD = append(filtersAD, dbox.In("accountsetupdetails.creditanalyst", payload.Get("ca").([]interface{})...))
	}

	cn, err := GetConnection()
	defer cn.Close()

	if payload.GetString("rating") != "" {
		filtersRT := []*dbox.Filter{}
		opr := payload.GetString("ratingopr")
		valrat := payload.GetFloat64("rating")
		if opr == "gt" {
			filtersRT = append(filtersRT, dbox.Gt("FinalScoreDob", valrat))
		} else if opr == "gte" {
			filtersRT = append(filtersRT, dbox.Gte("FinalScoreDob", valrat))
		} else if opr == "lte" {
			filtersRT = append(filtersRT, dbox.Lte("FinalScoreDob", valrat))
		} else if opr == "lt" {
			filtersRT = append(filtersRT, dbox.Lt("FinalScoreDob", valrat))
		} else if opr == "eq" {
			filtersRT = append(filtersRT, dbox.Eq("FinalScoreDob", valrat))
		}
		tk.Println(opr, "-----OPR")
		tk.Println(valrat, "VAL----")
		csr, e := cn.NewQuery().
			Where(dbox.And(filtersRT...)).
			From("CreditScorecard").
			// Order(SORT).
			// Take(take).
			// Skip(skip).
			Cursor(nil)

		if e != nil {
			res.SetError(e)
			return res
		}

		defer csr.Close()

		resultsRT := []tk.M{}
		err = csr.Fetch(&resultsRT, 0, false)
		if err != nil {
			res.SetError(err)
			return res
		}

		tk.Println(resultsRT, "----RT")

		customerids := []interface{}{}
		customeridsstr := []interface{}{}
		dealnos := []interface{}{}

		for _, val := range resultsRT {
			customerids = append(customerids, val.GetInt("CustomerId"))

			customeridsstr = append(customeridsstr, val.GetString("CustomerId"))
			dealnos = append(dealnos, val.GetString("DealNo"))
		}

		tk.Println(customerids, "----INT")
		tk.Println(customeridsstr, "----STR")

		if len(resultsRT) > 0 {
			filtersCA = append(filtersCA, dbox.In("applicantdetail.CustomerID", customerids...))
			filtersCA = append(filtersCA, dbox.In("applicantdetail.DealNo", dealnos...))
			filtersAD = append(filtersAD, dbox.In("customerid", customeridsstr...))
			filtersAD = append(filtersAD, dbox.In("dealno", dealnos...))
		}
	}

	if payload.GetString("loanamount") != "" {
		opr := payload.GetString("loanamountopr")
		valrat := payload.GetFloat64("loanamount")
		if opr == "gt" {
			filtersCA = append(filtersCA, dbox.Gt("applicantdetail.AmountLoan", valrat))
		} else if opr == "gte" {
			filtersCA = append(filtersCA, dbox.Gte("applicantdetail.AmountLoan", valrat))
		} else if opr == "lte" {
			filtersCA = append(filtersCA, dbox.Lte("applicantdetail.AmountLoan", valrat))
		} else if opr == "lt" {
			filtersCA = append(filtersCA, dbox.Lt("applicantdetail.AmountLoan", valrat))
		} else if opr == "eq" {
			filtersCA = append(filtersCA, dbox.Eq("applicantdetail.AmountLoan", valrat))
		}
	}

	filterAD = dbox.And(filtersAD...)

	//get data grid

	csr, e := cn.NewQuery().
		Where(filterAD).
		From("AccountDetails").
		// Order(SORT).
		// Take(take).
		// Skip(skip).
		Cursor(nil)

	if e != nil {
		res.SetError(e)
		return res
	}

	defer csr.Close()

	resultsAD := []tk.M{}
	err = csr.Fetch(&resultsAD, 0, false)
	if err != nil {
		res.SetError(err)
		return res
	}

	customerids := []interface{}{}
	dealnos := []interface{}{}

	for _, val := range resultsAD {
		customerids = append(customerids, val.GetInt("customerid"))
		dealnos = append(dealnos, val.GetString("dealno"))
	}

	if len(payload.Get("product").([]interface{})) > 0 || len(payload.Get("brhead").([]interface{})) > 0 || len(payload.Get("scheme").([]interface{})) > 0 || len(payload.Get("ca").([]interface{})) > 0 || len(payload.Get("rm").([]interface{})) > 0 {
		if len(resultsAD) > 0 {
			filtersCA = append(filtersCA, dbox.In("applicantdetail.CustomerID", customerids...))
			filtersCA = append(filtersCA, dbox.In("applicantdetail.DealNo", dealnos...))
		}
	}
	filterCA = dbox.And(filtersCA...)

	csr, e = cn.NewQuery().
		Where(filterCA).
		From("CustomerProfile").
		// Order(SORT).
		// Take(take).
		// Skip(skip).
		Cursor(nil)

	if e != nil {
		res.SetError(e)
		return res
	}

	resultsCA := []tk.M{}
	err = csr.Fetch(&resultsCA, 0, false)
	if err != nil {
		res.SetError(err)
		return res
	}

	finalres := []tk.M{}

	for _, val := range resultsCA {
		re := tk.M{}
		re.Set("CA", val)
		for _, valx := range resultsAD {
			if val.GetString("_id") == valx.GetString("_id") {
				re.Set("AD", valx)
				break
			}
			re.Set("AD", new(AccountDetail))
		}
		finalres = append(finalres, re)
	}

	res.SetData(finalres)

	return res
}
