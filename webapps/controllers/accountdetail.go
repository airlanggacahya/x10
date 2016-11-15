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
	}

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
