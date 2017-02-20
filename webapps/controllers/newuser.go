package controllers

import (
	. "eaciit/x10/webapps/connection"
	"eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"github.com/eaciit/dbox"
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

	return c.SetResultInfo(false, "success", result)
}

func (c NewUserController) SaveUser(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	payload := NewUser{}
	k.GetPayload(&payload)
	cn, _ := GetConnection()
	defer cn.Close()

	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("_id", payload.Id))
	csr, err := cn.NewQuery().
		Where(dbox.And(query...)).
		From("MasterUser").
		Cursor(nil)

	defer csr.Close()

	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	res := []NewUser{}
	// result := tk.M{}
	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}
	k.GetPayload(&payload)
	if payload.Catpassword != "" {
		payload.Catpassword = helper.GetMD5Hash(payload.Catpassword)
	} else {
		payload.Catpassword = res[0].Catpassword
	}
	err = c.Ctx.Save(&payload)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	return c.SetResultInfo(false, "save success", res)
}

func (c NewUserController) GetSysrole(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	cn, _ := GetConnection()
	defer cn.Close()

	csr, err := cn.NewQuery().
		From("SysRoles").
		Cursor(nil)

	defer csr.Close()

	res := []tk.M{}
	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return c.SetResultInfo(true, "data not Found", nil)
	}

	list := []interface{}{}

	for _, dt := range res {
		list = append(list, dt["name"])
	}

	return c.SetResultInfo(false, "success", list)
}
