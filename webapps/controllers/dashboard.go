package controllers

import (
	"time"

	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type DashboardController struct {
	*BaseController
}

func (c *DashboardController) Default(k *knot.WebContext) interface{} {
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

	// if access != nil {
	// 	tk.Println("sdsfsdf")
	// 	e := tk.Serde(access, DataAccess, "json")
	// 	if e != nil {
	// 		tk.Println(e.Error(), "<<")
	// 	}
	// }
	k.Config.IncludeFiles = []string{"shared/loading.html", "shared/leftfilter.html"}

	return DataAccess
}

func (c *DashboardController) GetCurrentDate(k *knot.WebContext) interface{} {
	c.LoadBase(k)
	k.Config.OutputType = knot.OutputJson
	ret := ResultInfo{}
	dateNow := time.Now().Format("2006-01-02")
	timeNow := time.Now().Format("15:04:05")
	ret.Data = tk.M{}.Set("CurrentDate", dateNow).Set("CurrentTime", timeNow)
	return ret
}
