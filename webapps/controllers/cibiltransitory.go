package controllers

import (
	. "eaciit/x10/webapps/connection"
	// . "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	// "fmt"
	// "github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	// "strconv"
	// "strings"
	// "time"
)

type CibilTransitoryController struct {
	*BaseController
}

func (c *CibilTransitoryController) Default(k *knot.WebContext) interface{} {
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

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html"}

	return DataAccess
}

func (c *CibilTransitoryController) GetDataCibilPromotor(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := tk.M{}
	k.GetForms(&param)
	tk.Println(param)

	cn, _ := GetConnection()
	defer cn.Close()

	query := []*dbox.Filter{}
	query = append(query, dbox.Ne("_id", ""))

	key := param.GetString("searchkey")
	if key != "" {
		keys := []*dbox.Filter{}
		keys = append(keys, dbox.Contains("FileName", key))
		keys = append(keys, dbox.Contains("ConsumerInfo.ConsumerName", key))

		custId := param.GetInt("additional")
		if custId != -1 {
			keys = append(keys, dbox.Eq("ConsumerInfo.CustomerId", custId))
		}

		query = append(query, dbox.Or(keys...))
	}

	csr, err := cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReportPromotorFinal").
		Skip(param.GetInt("skip")).
		Take(param.GetInt("take")).
		Cursor(nil)
	defer csr.Close()

	res := new(tk.Result)
	if err != nil {
		res.SetError(err)
	}

	cibilIndividual := []ReportData{}
	err = csr.Fetch(&cibilIndividual, 0, false)
	if err != nil {
		res.SetError(err)
	}

	cursor, e := cn.NewQuery().
		From("CibilReportPromotorFinal").
		Cursor(nil)
	defer cursor.Close()

	if e != nil {
		res.SetError(e)
	}

	res.SetData(cibilIndividual)

	return struct {
		Res   interface{}
		Total int
	}{res, cursor.Count()}
}

func (c *CibilTransitoryController) UpdateCibilPromotor(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(tk.Result)

	p := ReportData{}
	k.GetPayload(&p)

	if p.Id == "" {
		p.Id = bson.NewObjectId()
	}

	if err := c.Ctx.Save(&p); err != nil {
		res.SetError(err)
	}

	return res
}
