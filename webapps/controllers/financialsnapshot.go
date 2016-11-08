package controllers

import (
	// . "eaciit/x10/webapps/connection"
	// . "eaciit/x10/webapps/helper"
	// . "eaciit/x10/webapps/models"
	// //"errors"
	// "strconv"

	// // "fmt"
	// "time"

	// "github.com/eaciit/cast"
	// "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	// tk "github.com/eaciit/toolkit"
	// "gopkg.in/mgo.v2/bson"
)

type FinancialSnapshotController struct {
	*BaseController
}

func (c *FinancialSnapshotController) Default(k *knot.WebContext) interface{} {
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

	DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html", "financialsnapshot/kiri.html", "financialsnapshot/kanan.html"}

	return DataAccess
}
