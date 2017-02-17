package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	// "github.com/eaciit/dbox"\
	"fmt"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type NewUserController struct {
	*BaseController
}

func (c *NewUserController) Default(k *knot.WebContext) interface{} {
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

func (c NewUserController) GetUser(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	payload := tk.M{}
	k.GetPayload(&payload)

	cn, _ := GetConnection()
	defer cn.Close()

	csr, err := cn.NewQuery().
		From("MasterUser").
		Skip(payload.GetInt("skip")).
		Take(payload.GetInt("take")).
		Cursor(nil)

	defer csr.Close()

	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	res := []NewUser{}
	result := tk.M{}
	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	if len(res) == 0 {
		return c.SetResultInfo(true, "data not found", nil)
	}

	result.Set("data", res)
	result.Set("total", csr.Count())

	return c.SetResultInfo(false, "success", result)
}

func (c NewUserController) SaveUser(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	payload := NewUser{}
	k.GetPayload(&payload)

	fmt.Printf("---------------------------------->>> id %s\n", payload.ID)

	err := c.Ctx.Save(&payload)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	return c.SetResultInfo(false, "save success", nil)
}
