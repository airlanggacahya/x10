package controllers

import (
	. "eaciit/x10/webapps/models"
	"strconv"
	"strings"

	db "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type SysRolesController struct {
	*BaseController
}

func (c *SysRolesController) Default(k *knot.WebContext) interface{} {
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

	k.Config.IncludeFiles = []string{"shared/loading.html"}

	return DataAccess
}

func (d *SysRolesController) GetData(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}

	oo := struct {
		Name   []interface{}
		Status bool
		Take   int
		Skip   int
		Sort   []tk.M
	}{}

	err := r.GetPayload(&oo)
	if err != nil {
		return d.SetResultInfo(true, err.Error(), nil)
	}
	var dbFilter []*db.Filter

	dbFilter = append(dbFilter, db.Eq("status", oo.Status))

	if len(oo.Name) != 0 {
		dbFilter = append(dbFilter, db.In("name", oo.Name...))
	}

	sort := ""
	dir := ""
	if len(oo.Sort) > 0 {
		sort = strings.ToLower(oo.Sort[0].Get("field").(string))
		dir = oo.Sort[0].Get("dir").(string)
	}

	if sort == "" {
		sort = "acc_no_map"
	}
	if dir == "" {
		dir = "-"
	}
	if dir != "" && dir != "asc" {
		sort = "-" + sort
	}

	queryTotal := tk.M{}
	query := tk.M{}
	data := make([]SysRolesModel, 0)
	total := make([]SysRolesModel, 0)
	retModel := tk.M{}
	query.Set("limit", oo.Take)
	query.Set("skip", oo.Skip)
	query.Set("order", []string{sort})

	if len(dbFilter) > 0 {
		query.Set("where", db.And(dbFilter...))
		queryTotal.Set("where", db.And(dbFilter...))
	}

	crsData, errData := d.Ctx.Find(NewSysRolesModel(), query)
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
	crsTotal, errTotal := d.Ctx.Find(NewSysRolesModel(), queryTotal)
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

func (c *SysRolesController) GetMenu(k *knot.WebContext) interface{} {
	c.LoadBase(k)
	k.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}
	filterForm := struct {
		Id   string
		Take int
		Skip int
		Sort []tk.M
	}{}
	err := k.GetPayload(&filterForm)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	sort := ""
	dir := ""
	if len(filterForm.Sort) > 0 {
		sort = strings.ToLower(filterForm.Sort[0].Get("field").(string))
		dir = filterForm.Sort[0].Get("dir").(string)
	}

	if sort == "" {
		sort = "name"
	}

	if dir != "" && dir != "asc" {
		sort = "-" + sort
	}

	var dbFilter []*db.Filter
	if filterForm.Id != "" {
		id, _ := strconv.Atoi(filterForm.Id)
		dbFilter = append(dbFilter, db.Eq("_id", id))
	}

	queryTotal := tk.M{}
	query := tk.M{}
	query.Set("limit", filterForm.Take)
	query.Set("skip", filterForm.Skip)
	query.Set("order", []string{sort})
	if len(dbFilter) > 0 {
		query.Set("where", db.And(dbFilter...))
		queryTotal.Set("where", db.And(dbFilter...))
	}

	data := make([]TopMenuModel, 0)
	total := make([]TopMenuModel, 0)
	retModel := tk.M{}

	crsData, errData := c.Ctx.Find(NewTopMenuModel(), query)
	defer crsData.Close()
	if errData != nil {
		return c.SetResultInfo(true, errData.Error(), nil)
	}
	errData = crsData.Fetch(&data, 0, false)

	if errData != nil {
		return c.SetResultInfo(true, errData.Error(), nil)
	} else {
		retModel.Set("Records", data)
	}
	crsTotal, errTotal := c.Ctx.Find(NewTopMenuModel(), queryTotal)
	defer crsTotal.Close()
	if errTotal != nil {
		return c.SetResultInfo(true, errTotal.Error(), nil)
	}
	errTotal = crsTotal.Fetch(&total, 0, false)

	if errTotal != nil {
		return c.SetResultInfo(true, errTotal.Error(), nil)
	} else {
		retModel.Set("Count", len(total))
	}
	ret.Data = retModel

	return ret
}

func (c *SysRolesController) GetMenuEdit(k *knot.WebContext) interface{} {
	c.LoadBase(k)
	k.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}
	filterForm := struct {
		Id   string
		Name string
	}{}
	err := k.GetPayload(&filterForm)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	var dbFilter []*db.Filter

	if filterForm.Id != "" {
		dbFilter = append(dbFilter, db.Eq("_id", bson.ObjectIdHex(filterForm.Id)))
	}

	if filterForm.Name != "" {
		dbFilter = append(dbFilter, db.Eq("name", filterForm.Name))
	}

	query := tk.M{}
	if len(dbFilter) > 0 {
		query.Set("where", db.And(dbFilter...))
	}

	data := make([]SysRolesModel, 0)
	retModel := tk.M{}

	crsData, errData := c.Ctx.Find(NewSysRolesModel(), query)
	defer crsData.Close()
	if errData != nil {
		return c.SetResultInfo(true, errData.Error(), nil)
	}
	errData = crsData.Fetch(&data, 0, false)

	if errData != nil {
		return c.SetResultInfo(true, errData.Error(), nil)
	}

	retModel.Set("Records", data)

	ret.Data = retModel

	return ret
}

func defaultDetailsMenu(conn db.IConnection, menuid string) (Detailsmenu, error) {
	dtl := Detailsmenu{}

	dtl.Checkall = true
	dtl.Access = true
	dtl.Approve = true
	dtl.Create = true
	dtl.Delete = true
	dtl.View = true
	dtl.Edit = true
	dtl.Process = true

	dtl.Grant = make(map[string]bool)

	dtl.Menuid = menuid

	cur, err := conn.
		NewQuery().
		From("TopMenu").
		Where(db.Eq("_id", menuid)).
		Cursor(nil)
	if err != nil {
		return dtl, err
	}

	menu := tk.M{}
	err = cur.Fetch(&menu, 1, true)
	if err != nil {
		return dtl, err
	}

	dtl.Menuname = menu["Title"].(string)
	dtl.Parent = menu["Parent"].(string)
	dtl.Url = menu["Url"].(string)
	dtl.Haschild = menu["haschild"].(bool)
	dtl.Enable = menu["Enable"].(bool)

	return dtl, nil
}

func (d *SysRolesController) SaveData(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson
	oo := struct {
		Id             string
		Name           string
		Status         bool
		Landing        string
		Menu           []tk.M
		Branch         []string
		District       []string
		Dealallocation string
	}{}
	ret := ResultInfo{}
	o := NewSysRolesModel()

	err := r.GetPayload(&oo)
	if err != nil {
		return d.SetResultInfo(true, err.Error(), nil)
	}

	if oo.Id != "" {
		o.Id = bson.ObjectIdHex(oo.Id)
	} else {
		o.Id = bson.NewObjectId()
	}

	o.Name = oo.Name
	o.Status = oo.Status
	o.Landing = oo.Landing
	o.Branch = oo.Branch
	o.District = oo.District
	o.Dealallocation = oo.Dealallocation

	// helper for parent add
	menuDone := make(map[string]bool)
	menuQueue := make(map[string]bool)

	tempMenu := o.Menu
	for _, det := range oo.Menu {
		dtl, err := defaultDetailsMenu(d.Ctx.Connection, det["menuid"].(string))
		if err != nil {
			return d.SetResultInfo(true, err.Error(), nil)
		}

		var isAccess = false
		for key, val := range det["grant"].(map[string]interface{}) {
			dtl.Grant[key] = val.(bool)
			isAccess = isAccess || dtl.Grant[key]
		}

		// no access found, skip this menu
		if !isAccess {
			continue
		}

		tempMenu = append(tempMenu, dtl)

		menuDone[dtl.Menuid] = true

		// no parent
		if len(dtl.Parent) == 0 {
			continue
		}

		// parent is already loaded
		if _, found := menuDone[dtl.Parent]; found {
			continue
		}

		// parent is already queued
		if _, found := menuQueue[dtl.Parent]; found {
			continue
		}

		// queue parent
		menuQueue[dtl.Parent] = true
	}

	for menuid, _ := range menuQueue {
		// already loaded
		if _, found := menuDone[menuid]; found {
			continue
		}

		dtl, err := defaultDetailsMenu(d.Ctx.Connection, menuid)

		if err != nil {
			return d.SetResultInfo(true, err.Error(), nil)
		}

		tempMenu = append(tempMenu, dtl)
	}

	o.Menu = append(o.Menu, tempMenu...)

	e := d.Ctx.Save(o)
	if e != nil {
		return d.SetResultInfo(true, err.Error(), nil)
	}

	ret.IsError = false
	ret.Message = "Saving Data Successfully"
	ret.Data = ""

	return ret
}

func (d *SysRolesController) DistinctArray(xs *[]string) {
	found := make(map[string]bool)
	j := 0
	for i, x := range *xs {
		if !found[x] {
			found[x] = true
			(*xs)[j] = (*xs)[i]
			j++
		}
	}
	*xs = (*xs)[:j]
}

func (d *SysRolesController) GetLandingPage(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson
	r.Config.NoLog = true

	result := []tk.M{}
	page := []tk.M{}

	csr, err := d.Ctx.Connection.NewQuery().Select("Title").From("TopMenu").Cursor(nil)

	if err != nil {
		tk.Println(err.Error())
	}

	err = csr.Fetch(&result, 0, false)
	defer csr.Close()

	for _, val := range result {
		if val.GetString("Title") != "Administrator" {
			page = append(page, tk.M{}.Set("Title", val.Get("Title")))
		}
	}

	return page
}

func (d *SysRolesController) GetBranch(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson
	r.Config.NoLog = true

	acc, err := GetMasterAccountDetailv2()
	if err != nil {
		tk.Println(err.Error())
	}

	for key, val := range acc {
		if key != "Branch" {
			continue
		}

		return val
	}

	return nil
}

func (d *SysRolesController) GetDistrict(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson
	r.Config.NoLog = true

	acc, err := GetMasterAccountDetailv2()
	if err != nil {
		tk.Println(err.Error())
	}

	for key, val := range acc {
		if key != "District" {
			continue
		}

		return val
	}

	return nil
}
