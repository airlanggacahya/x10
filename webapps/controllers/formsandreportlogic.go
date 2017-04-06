package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	// "errors"
	"fmt"
	// "github.com/eaciit/dbox"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	// "time"
)

type FormsAndReportLogicController struct {
	*BaseController
}

func (c *FormsAndReportLogicController) Default(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"shared/filter.html",
		"shared/loading.html",
	}

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
		return CreateResult(false, nil, err.Error())
	}
	pathUI := "/formreportlogic/"
	result := []tk.M{}
	fmt.Println("------->>>>1111", pwd)
	var path = filepath.Join(".", "assets", "formreportlogic")
	files, _ := ioutil.ReadDir(path)
	for _, f := range files {
		var name = f.Name()

		coba := tk.M{}
		coba.Set("NameFile", name)
		coba.Set("Upload", f.ModTime())
		coba.Set("Path", pathUI+f.Name())

		// IF file ends with .disabled. Show only name but disable download.
		// Implemented on client side js
		var code = "disabled"
		var lencode = len(code)
		var lenname = len(name)
		if len(name) > (lencode+1) && name[lenname-lencode:] == "disabled" {
			coba.Set("NameFile", name[:lenname-lencode-1])
			coba.Set("Disabled", true)
		}

		result = append(result, coba)
	}

	// fmt.Println("------>>>>", result)
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

	return CreateResult(false, tk.M{"data": result, "linkdata": cust, "path": pathUI}, "")
}
