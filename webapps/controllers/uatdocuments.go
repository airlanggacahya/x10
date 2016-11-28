package controllers

import (
	. "eaciit/x10/webapps/helper"
	// "errors"
	"fmt"
	// "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"io/ioutil"
	// "os"
	"path/filepath"
	// "time"
	. "eaciit/x10/webapps/connection"
)

type UatDocumentsController struct {
	*BaseController
}

func (c *UatDocumentsController) Default(k *knot.WebContext) interface{} {
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

	DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)
	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html"}

	return DataAccess
}

func (c *UatDocumentsController) GetAllFile(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	pathUI := "/pdf/"
	result := []tk.M{}

	var path = filepath.Join(".", "assets", "pdf")
	files, _ := ioutil.ReadDir(path)
	for _, f := range files {
		coba := tk.M{}
		fmt.Println("------>>>>", f.Sys())
		coba.Set("NameFile", f.Name())
		coba.Set("Upload", f.ModTime())
		coba.Set("Path", pathUI+f.Name())
		result = append(result, coba)
	}

	conn, err := GetConnection()
	defer conn.Close()
	query, err := conn.NewQuery().Select().From("FormAndReportLink").Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}
	defer query.Close()
	cust := []tk.M{}
	err = query.Fetch(&cust, 0, false)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	return CreateResult(false, tk.M{"data": result, "linkdata": "", "path": ""}, "")
}
