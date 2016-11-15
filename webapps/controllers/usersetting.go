package controllers

import (
	"eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"strings"

	db "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type UserSettingController struct {
	*BaseController
}

type SortPaging struct {
	Take int
	Skip int
}

func (c *UserSettingController) Default(k *knot.WebContext) interface{} {
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
	k.Config.IncludeFiles = []string{"shared/loading.html"}

	return DataAccess
}

func (d *UserSettingController) GetData(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}

	oo := struct {
		Id       string
		Username []interface{}
		Role     []interface{}
		Status   bool
		Take     int
		Skip     int
		Sort     []tk.M
	}{}

	err := r.GetPayload(&oo)
	if err != nil {
		return d.SetResultInfo(true, err.Error(), nil)
	}
	var dbFilter []*db.Filter
	if oo.Id != "" {
		dbFilter = append(dbFilter, db.Eq("_id", bson.ObjectIdHex(oo.Id)))
	} else {
		dbFilter = append(dbFilter, db.Eq("enable", oo.Status))
	}

	if len(oo.Username) != 0 {
		dbFilter = append(dbFilter, db.In("username", oo.Username...))
	}

	if len(oo.Role) != 0 {
		dbFilter = append(dbFilter, db.In("roles", oo.Role...))
	}

	sort := ""
	dir := ""
	if len(oo.Sort) > 0 {
		sort = strings.ToLower(oo.Sort[0].Get("field").(string))
		dir = oo.Sort[0].Get("dir").(string)
	}

	if sort == "" {
		sort = "username"
	}
	if dir != "" && dir != "asc" {
		sort = "-" + sort
	}

	queryTotal := tk.M{}
	query := tk.M{}
	data := make([]SysUserModel, 0)
	total := make([]SysUserModel, 0)
	retModel := tk.M{}
	query.Set("limit", oo.Take)
	query.Set("skip", oo.Skip)
	query.Set("order", []string{sort})

	if len(dbFilter) > 0 {
		query.Set("where", db.And(dbFilter...))
		queryTotal.Set("where", db.And(dbFilter...))
	}

	crsData, errData := d.Ctx.Find(NewSysUserModel(), query)
	defer crsData.Close()
	if errData != nil {
		return d.SetResultInfo(true, errData.Error(), nil)
	}
	errData = crsData.Fetch(&data, 0, false)

	if errData != nil {
		return d.SetResultInfo(true, errData.Error(), nil)
	} else {
		retModel.Set("Records", data)
	}
	crsTotal, errTotal := d.Ctx.Find(NewSysUserModel(), queryTotal)
	defer crsTotal.Close()
	if errTotal != nil {
		return d.SetResultInfo(true, errTotal.Error(), nil)
	}
	errTotal = crsTotal.Fetch(&total, 0, false)

	if errTotal != nil {
		return d.SetResultInfo(true, errTotal.Error(), nil)
	} else {
		retModel.Set("Count", len(total))
	}
	ret.Data = retModel

	return ret
}

func (c *UserSettingController) SaveData(k *knot.WebContext) interface{} {
	c.LoadBase(k)
	k.Config.OutputType = knot.OutputJson
	p := struct {
		Id       string
		UserName string
		FullName string
		Enable   bool
		Email    string
		Role     string
		Password string
	}{}
	e := k.GetPayload(&p)

	if e != nil {
		return c.SetResultInfo(true, e.Error(), nil)
	}

	data := new(SysUserModel)
	if p.Id != "" {
		data.Id = bson.ObjectIdHex(p.Id)
	} else {
		data.Id = bson.NewObjectId()
	}

	data.Username = p.UserName
	data.Fullname = p.FullName
	data.Enable = p.Enable
	data.Email = p.Email
	data.Roles = p.Role
	data.Password = helper.GetMD5Hash(p.Password)

	err := c.Ctx.Save(data)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	return c.SetResultInfo(false, "data has been saved", nil)
}
