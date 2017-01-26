package controllers

import (
	. "eaciit/x10/webapps/models"
	"github.com/eaciit/knot/knot.v1"
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
		c.SetResultInfo(true, err.Error(), nil)
	}

	return c.SetResultInfo(false, "success", results)

}
