package controllers

import (
	. "eaciit/x10/webapps/models"
	"strings"

	db "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type ActivityLogController struct {
	*BaseController
}

func (c *ActivityLogController) Default(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	return DataAccess
}

func (c *ActivityLogController) GetData(k *knot.WebContext) interface{} {
	c.LoadBase(k)
	k.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}
	filterForm := struct {
		Username   []interface{}
		Activity   []interface{}
		AccessDate int
		Take       int
		Skip       int
		Sort       []tk.M
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
		sort = "-accesstime"
	}

	if dir != "" && dir != "desc" {
		sort = "-" + sort
	}

	var dbFilter []*db.Filter
	if filterForm.AccessDate > 0 {
		dbFilter = append(dbFilter, db.Eq("accessdate", filterForm.AccessDate))
	}
	if len(filterForm.Activity) > 0 {
		dbFilter = append(dbFilter, db.In("activity", filterForm.Activity...))
	}
	if len(filterForm.Username) != 0 {
		dbFilter = append(dbFilter, db.In("username", filterForm.Username...))
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

	data := make([]ActivityLogModel, 0)
	total := make([]ActivityLogModel, 0)
	retModel := tk.M{}

	crsData, errData := c.Ctx.Find(NewActivityLogModel(), query)
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
	crsTotal, errTotal := c.Ctx.Find(NewActivityLogModel(), queryTotal)
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
