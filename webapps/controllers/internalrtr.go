package controllers

import (
	. "eaciit/x10/webapps/models"
	"errors"
	// "fmt"
	"strings"

	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type InternalRtrController struct {
	*BaseController
}

func (c *RtrController) InternalRtr(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/dataaccess.html", "shared/filter.html", "shared/loading.html"}

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

func (d *InternalRtrController) GetDataInternalRtR(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	payload := struct {
		Id string
	}{}

	err := k.GetPayload(&payload)
	if err != nil {
		d.SetResultInfo(true, err.Error(), nil)
	}

	query := tk.M{"where": dbox.Eq("_id", payload.Id)}
	csr, err := d.Ctx.Find(new(InternalRtr), query)
	defer csr.Close()
	if err != nil {
		return d.SetResultInfo(true, err.Error(), nil)
	}

	results := make([]InternalRtr, 0)
	err = csr.Fetch(&results, 0, false)

	if err != nil {
		return d.SetResultInfo(true, err.Error(), nil)
	}

	return d.SetResultInfo(false, "success", results)

}

func (d *InternalRtrController) InternalRtrConfirmed(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	// res := new(tk.Result)

	payload := new(InternalRtr)
	err := k.GetPayload(payload)
	if err != nil {
		return d.SetResultInfo(true, err.Error(), nil)
	}

	err = d.Ctx.Save(payload)

	if err != nil {
		return d.SetResultInfo(true, err.Error(), nil)
	}

	str := strings.Split(payload.Id, "|")
	id, deal := str[0], str[1]

	if payload.Status == 1 {
		if err := new(DataConfirmController).SaveDataConfirmed(id, deal, payload.TableName(), payload, true); err != nil {
			return d.SetResultInfo(true, err.Error(), nil)
		}
	}

	// Update DealSetup
	if payload.Isfreeze {
		UpdateDealSetup(id, deal, "irtr", "Freeze")
	} else if payload.Status == 1 {
		UpdateDealSetup(id, deal, "irtr", "Confirmed")
	} else {
		UpdateDealSetup(id, deal, "irtr", UnderProcess)
	}

	return d.SetResultInfo(false, "success", nil)
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
