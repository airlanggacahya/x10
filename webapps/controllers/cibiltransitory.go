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

	res := new(tk.Result)

	cn, _ := GetConnection()
	defer cn.Close()

	cibilIndividual := []ReportData{}
	query := []*dbox.Filter{}
	query = append(query, dbox.Ne("_id", ""))
	csr, err := cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReportPromotorFinal").
		Cursor(nil)

	defer csr.Close()

	if err != nil {
		res.SetError(err)
	}

	err = csr.Fetch(&cibilIndividual, 0, false)
	if err != nil {
		res.SetError(err)
	}

	csr.Close()
	res.SetData(cibilIndividual)
	return res
}

func (c *CibilTransitoryController) GetDataCibilPromotorCurrent(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(tk.Result)

	cn, _ := GetConnection()
	defer cn.Close()

	p := tk.M{}
	k.GetPayload(&p)

	cibilIndividual := []ReportData{}
	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("_id", bson.ObjectIdHex(p.GetString("Id"))))
	csr, err := cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReportPromotorFinal").
		Cursor(nil)

	defer csr.Close()

	if err != nil {
		res.SetError(err)
	}

	err = csr.Fetch(&cibilIndividual, 0, false)
	if err != nil {
		res.SetError(err)
	}

	csr.Close()
	res.SetData(cibilIndividual)
	return res
}

func (c *CibilTransitoryController) UpdateCibilPromotor(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(tk.Result)

	p := ReportData{}
	k.GetPayload(&p)

	tk.Println(p)

	c.Ctx.Save(&p)

	return res
}
