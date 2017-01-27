package controllers

import (
	"gopkg.in/mgo.v2/bson"
	// . "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	"fmt"
	db "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type MasterSuplierController struct {
	*BaseController
}

func (c *MasterSuplierController) Default(k *knot.WebContext) interface{} {
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
	k.Config.IncludeFiles = []string{"shared/loading.html"}

	return DataAccess
}

func (c *MasterSuplierController) GetMasterSuplier(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	csr, err := c.Ctx.Find(new(MasterSuplier), nil)
	defer csr.Close()
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	results := make([]MasterSuplier, 0)
	err = csr.Fetch(&results, 0, false)

	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	return c.SetResultInfo(false, "success", results)

}

func (c *MasterSuplierController) DeleteMasterSuplier(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	payload := tk.M{}

	err := k.GetPayload(&payload)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	res := []MasterSuplier{}
	query := tk.M{"where": db.Eq("_id", bson.ObjectIdHex(payload["Id"].(string)))}
	csr, err := c.Ctx.Find(new(MasterSuplier), query)
	defer csr.Close()
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	fmt.Println("____________________>>>> masuk sini---", res)

	if len(res) > 0 {
		fmt.Println("____________________>>>> masuk sini")
		err = c.Ctx.Delete(&res[0])
		if err != nil {
			c.SetResultInfo(true, err.Error(), nil)
		}
	}

	return c.SetResultInfo(false, "delete success", nil)
}

func (c *MasterSuplierController) SaveMasterSuplier(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	payload := []tk.M{}
	err := k.GetPayload(&payload)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	mp := NewMasterSuplier()
	results := []MasterSuplier{}
	for _, o := range payload {
		if o["Id"] != "" {
			mp.Id = bson.ObjectIdHex(o["Id"].(string))
		} else {
			mp.Id = bson.NewObjectId()
		}

		mp.AddressLine1 = o["AddressLine1"].(string)
		mp.BankAccount = o["BankAccount"].(string)
		mp.BankBranch_id = o["BankBranch_id"].(string)
		mp.BankId = o["BankId"].(string)
		mp.BpType = o["BpType"].(string)
		mp.Country = o["Country"].(string)
		mp.Name = o["Name"].(string)
		mp.DealerDesc_1 = o["DealerDesc_1"].(string)
		mp.DealerId = o["DealerId"].(string)
		mp.District = o["District"].(string)
		mp.EmpanelledStatus = o["EmpanelledStatus"].(string)
		mp.LastUpdate = o["LastUpdate"].(string)
		mp.Pincode = o["RecStatus"].(string)
		mp.RecStatus = o["RecStatus"].(string)
		mp.State = o["State"].(string)
		mp.UseInAD = o["UseInAD"].(bool)
		mp.FromOmnifin = o["FromOmnifin"].(bool)

		save := c.Ctx.Save(mp)
		if save != nil {
			c.SetResultInfo(false, save.Error(), nil)
		}

	}

	return c.SetResultInfo(false, "success", results)

}
