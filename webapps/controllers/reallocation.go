package controllers

import (
	"eaciit/x10/consoleapps/OmnifinMaster/helpers"

	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type ReallocationController struct {
	*BaseController
}

func (c *ReallocationController) GetReallocationDeal(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := []tk.M{}
	con, err := helpers.GetConnection()
	if err != nil {
		return res
	}

	cur, err := con.NewQuery().From("ReallocationDeal").Cursor(nil)
	if err != nil {
		return res
	}

	cur.Fetch(&res, 0, true)

	return res
}

func (c *ReallocationController) Default(k *knot.WebContext) interface{} {
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

	k.Config.IncludeFiles = []string{"shared/loading.html", "reallocation/list.html", "reallocation/new.html"}

	return DataAccess
}
