package controllers

import (
	// "github.com/eaciit/dbox"
	// . "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type DealSetUpController struct {
	*BaseController
}

func (c *DealSetUpController) Default(k *knot.WebContext) interface{} {
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
		DataAccess.Fullname = o["Fullname"].(string)
	}

	DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html", "dealsetup/top.html", "dealsetup/bottom.html"}

	return DataAccess
}

func (c *DealSetUpController) GetAllDataDealSetup(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	csr, err := c.Ctx.Find(new(DealSetupModel), tk.M{})
	if err != nil {
		return c.ErrorResultInfo(err.Error(), nil)
	}
	result := make([]DealSetupModel, 0)
	err = csr.Fetch(&result, 0, false)
	if err != nil {
		return c.ErrorResultInfo(err.Error(), nil)
	}
	csr.Close()

	return result
}
