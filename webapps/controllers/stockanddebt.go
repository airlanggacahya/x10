package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"fmt"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	// "strconv"
	// "strings"
	// "time"
	"gopkg.in/mgo.v2/bson"
)

func (c *DataCapturingController) StockAndDebt(k *knot.WebContext) interface{} {
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

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html"}

	return DataAccess
}

func (c *DataCapturingController) GetStockAndDebtDetail(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := struct {
		CustomerId string
		Dealno     string
	}{}

	k.GetPayload(&p)

	cn, err := GetConnection()
	defer cn.Close()
	csr, e := cn.NewQuery().
		Where(dbox.And(dbox.Eq("customerid", p.CustomerId+"|"+p.Dealno))).
		From("StockandDebt").
		Cursor(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	defer csr.Close()

	results := []StockandDebtModel{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(false, nil, "No data found !")
	}

	return results
}

func (c *DataCapturingController) GetStockAndDebtDetailConfirmed(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := struct {
		CustomerId string
		Dealno     string
	}{}

	k.GetPayload(&p)

	// cn, err := GetConnection()
	// defer cn.Close()
	// csr, e := cn.NewQuery().
	// 	Where(dbox.And(dbox.Eq("customerid", p.CustomerId+"|"+p.Dealno))).
	// 	From("StockandDebt").
	// 	Cursor(nil)

	// if e != nil {
	// 	return CreateResult(false, nil, e.Error())
	// } else if csr == nil {
	// 	return CreateResult(true, nil, "")
	// }

	// defer csr.Close()

	results := []StockandDebtModel{}
	// err = csr.Fetch(&results, 0, false)
	// if err != nil {
	// 	return CreateResult(false, nil, e.Error())
	// } else if csr == nil {
	// 	return CreateResult(false, nil, "No data found !")
	// }
	err := new(DataConfirmController).GetDataConfirmed(p.CustomerId, p.Dealno, "StockandDebt", &results)
	if err != nil {
		return err
	}

	return results
}

func (c *DataCapturingController) SaveStockAndDebtDetail(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	// Username := ""
	// if k.Session("username") != nil {
	// 	Username = k.Session("username").(string)
	// }

	p := StockandDebtModel{}

	k.GetPayload(&p)

	if p.Id == "" {
		p.Id = bson.NewObjectId()
	}

	e := c.Ctx.Save(&p)
	if e != nil {
		fmt.Println(e)
	}

	return p
}

func (c *DataCapturingController) ConfirmStockAndDebt(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := tk.M{}
	k.GetPayload(&p)

	result, e := NewStockandDebtModel().Confirm(p.GetString("Id"), p.Get("IsConfirm").(bool), c.Ctx)
	if e != nil {
		return CreateResult(false, nil, "No data found !")
	}

	return result
}

func (c *DataCapturingController) FreezeStockAndDebt(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := tk.M{}
	k.GetPayload(&p)

	result, e := NewStockandDebtModel().Freeze(p.GetString("Id"), p.Get("IsFreeze").(bool), c.Ctx)
	if e != nil {
		return CreateResult(false, nil, "No data found !")
	}

	return result
}
