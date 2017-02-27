package controllers

import (
	. "eaciit/x10/webapps/connection"
	"eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	// "fmt"
	"strconv"

	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type NewUserController struct {
	*BaseController
}

func (c *NewUserController) Default(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"shared/filter.html",
		"shared/loading.html",
		"newuser/userfilter.html",
	}

	return DataAccess
}

// func (c *NewUserController) Default(k *knot.WebContext) interface{} {
// 	access := c.LoadBase(k)
// 	k.Config.NoLog = true
// 	k.Config.OutputType = knot.OutputTemplate
// 	DataAccess := Previlege{}

// 	for _, o := range access {
// 		DataAccess.Create = o["Create"].(bool)
// 		DataAccess.View = o["View"].(bool)
// 		DataAccess.Delete = o["Delete"].(bool)
// 		DataAccess.Process = o["Process"].(bool)
// 		DataAccess.Delete = o["Delete"].(bool)
// 		DataAccess.Edit = o["Edit"].(bool)
// 		DataAccess.Menuid = o["Menuid"].(string)
// 		DataAccess.Menuname = o["Menuname"].(string)
// 		DataAccess.Approve = o["Approve"].(bool)
// 		DataAccess.Username = o["Username"].(string)
// 		DataAccess.Rolename = o["Rolename"].(string)
// 		DataAccess.Fullname = o["Fullname"].(string)
// 	}

// 	DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)

// 	k.Config.OutputType = knot.OutputTemplate
// 	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html"}

// 	return DataAccess
// }

func (c NewUserController) GetUser(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	payload := tk.M{}
	k.GetPayload(&payload)

	tk.Println("---------->>>>>>>", payload)

	cn, _ := GetConnection()
	defer cn.Close()

	filter := []*dbox.Filter{}

	if payload["name"] != "" {
		filter = append(filter, dbox.Eq("username", payload["name"]))
	}

	if payload["userid"] != "" {
		filter = append(filter, dbox.Eq("userid", payload["userid"]))
	}

	data := cn.NewQuery().
		From("MasterUser").
		Order("-lastUpdateDate")

	if len(filter) > 0 {
		data = data.Where(dbox.And(filter...))
	}

	csr, err := data.Cursor(nil)

	defer csr.Close()

	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	role, err := cn.NewQuery().
		From("MasterAccountDetail").
		Cursor(nil)

	defer role.Close()

	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	res := []NewUser{}
	result := tk.M{}
	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	rl := []tk.M{}
	err = role.Fetch(&rl, 0, false)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	if len(res) == 0 {
		return c.SetResultInfo(true, "data not found", nil)
	}

	if len(rl) == 0 {
		return c.SetResultInfo(true, "data not found", nil)
	}

	for _, val := range rl {
		for _, dt := range val["Data"].([]interface{}) {
			newdt, _ := tk.ToM(dt)
			it := newdt.GetString("Field")
			if it == "Departments" {
				for _, itm := range newdt["Items"].([]interface{}) {
					dp, _ := tk.ToM(itm)
					ndp := dp.GetString("departmentId")
					name := dp.GetString("name")
					// tk.Println("----------------------------->>>>>>", ndp)
					for idx, nres := range res {
						dd, _ := strconv.Atoi(ndp)
						// tk.Println("----------------------------->>>>>>", dp)
						if nres.Userdepartment == dd {
							// res[idx].Role = res[idx].Role[:0]
							if res[idx].Role == nil {
								res[idx].Role = append(nres.Role, name)
							}

						}

					}
				}
			}
		}
	}
	result.Set("data", res)

	return c.SetResultInfo(false, "success", result)
}

func (c NewUserController) GetUserEdit(k *knot.WebContext) interface{} {
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
		Order("-lastUpdateDate").
		Cursor(nil)

	defer csr.Close()

	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	role, err := cn.NewQuery().
		From("MasterAccountDetail").
		Cursor(nil)

	defer role.Close()

	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	res := []NewUser{}
	result := tk.M{}
	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	rl := []tk.M{}
	err = role.Fetch(&rl, 0, false)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	if len(res) == 0 {
		return c.SetResultInfo(true, "data not found", nil)
	}

	if len(rl) == 0 {
		return c.SetResultInfo(true, "data not found", nil)
	}

	for _, val := range rl {
		for _, dt := range val["Data"].([]interface{}) {
			newdt, _ := tk.ToM(dt)
			it := newdt.GetString("Field")
			if it == "Departments" {
				for _, itm := range newdt["Items"].([]interface{}) {
					dp, _ := tk.ToM(itm)
					ndp := dp.GetString("departmentId")
					name := dp.GetString("name")
					// tk.Println("----------------------------->>>>>>", ndp)
					for idx, nres := range res {
						dd, _ := strconv.Atoi(ndp)
						// tk.Println("----------------------------->>>>>>", dp)
						if nres.Userdepartment == dd {
							// res[idx].Role = res[idx].Role[:0]
							if res[idx].Role == nil {
								res[idx].Role = append(nres.Role, name)
							}

						}

					}
				}
			}
		}
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
	tk.Println("---------------------------", payload.Role)
	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}
	if payload.Catpassword != "" {
		payload.Catpassword = helper.GetMD5Hash(payload.Catpassword)
	} else {
		if res[0].Catpassword == "" {
			payload.Catpassword = ""
		} else {
			payload.Catpassword = res[0].Catpassword
		}
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
