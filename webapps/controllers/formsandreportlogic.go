package controllers

import (
	_ "eaciit/x10/webapps/connection"
	// . "eaciit/x10/webapps/models"
	// "errors"
	"fmt"
	// "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"io/ioutil"
	"os"
	"path/filepath"
	// "time"
)

type FormsAndReportLogicController struct {
	*BaseController
}

func (c *FormsAndReportLogicController) Default(k *knot.WebContext) interface{} {
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
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html"}

	return DataAccess
}

// func (c *FormsAndReportLogicController) GetData(k *knot.WebContext) interface{} {
// 	k.Config.OutputType = knot.OutputJson
// 	res := new(tk.Result)

// 	payload := struct {
// 		Filename string
// 	}{}

// 	err := k.GetPayload(&payload)

// 	query := tk.M{"where": dbox.And([]*dbox.Filter{dbox.Contains("filename", payload.Filename)}...)}
// 	csr, err := c.Ctx.Find(new(FormsAndReportLogic), query)
// 	defer csr.Close()

// 	if err != nil {
// 		return res.SetError(err)
// 	}

// 	results := make([]FormsAndReportLogic, 0)
// 	err = csr.Fetch(&results, 0, false)
// 	if err != nil {
// 		return res.SetError(err)
// 	}

// 	if (len(results)) == 0 {
// 		return res.SetError(errors.New("data not found"))
// 	}

// 	return res.SetData(results)
// }

func (c *FormsAndReportLogicController) GetAllFile(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	pwd, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	result := []tk.M{}
	fmt.Println("------->>>>1111", pwd)
	var path = filepath.Join(".", "assets", "pdf")
	files, _ := ioutil.ReadDir(path)
	for _, f := range files {
		coba := tk.M{}
		fmt.Println("------>>>>", f.Sys())
		coba.Set("NameFile", f.Name())
		coba.Set("Upload", f.ModTime())
		coba.Set("Path", "/pdf/"+f.Name())
		result = append(result, coba)
	}

	fmt.Println("------>>>>", result)

	return result
}
