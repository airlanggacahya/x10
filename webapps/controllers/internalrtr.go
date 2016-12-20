package controllers

import (
	. "eaciit/x10/webapps/models"
	"errors"
	// "fmt"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type InternalRtrController struct {
	*BaseController
}

func (c *RtrController) InternalRtr(k *knot.WebContext) interface{} {
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

func (c *InternalRtrController) FetchAccountDetail(customerID string, DealNo string) (*AccountDetail, error) {
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

// func (d *InternalRtrController) GetAccountDetails(k *knot.WebContext) interface{} {
// 	k.Config.OutputType = knot.OutputJson
// 	res := new(tk.Result)

// 	payload := struct {
// 		CustomerId string
// 		DealNo     string
// 	}{}
// 	err := k.GetPayload(&payload)
// 	if err != nil {
// 		res.SetError(err)
// 		return res
// 	}

// 	// tk.Printf("---- %#v\n", payload)
// 	data, err := d.FetchAccountDetail(payload.CustomerId, payload.DealNo)
// 	if err != nil {
// 		res.SetError(err)
// 		return res
// 	}

// 	res.SetData(data)
// 	return res
// }
