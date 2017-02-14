package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	// "errors"
	// "fmt"

	// "time"

	// "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type ReallocationController struct {
	*BaseController
}

func (c *ReallocationController) Default(k *knot.WebContext) interface{} {
	access := c.LoadBase(k)
	k.Config.NoLog = true

	k.Config.IncludeFiles = []string{"shared/loading.html"}

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

	return DataAccess
}

func (c *ReallocationController) GetData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	result := tk.M{}
	AD, err := new(AccountDetail).GetDataByParam()

	if err != nil {
		res.SetError(err)
		return res
	}

	result.Set("AccountDetails", AD)

	users, _ := GetAllUser()
	result.Set("MasterUser", users)

	return res
}

func GetAllUser() (interface{}, error) {
	resCust := []tk.M{}

	conn, err := GetConnection()
	if err != nil {
		return resCust, err
	}
	defer conn.Close()

	qcust, err := conn.NewQuery().From("MasterCustomer").Cursor(nil)
	if err != nil {
		return resCust, err
	}

	defer qcust.Close()
	qcust.Fetch(&resCust, 0, false)

	return resCust, err
}
