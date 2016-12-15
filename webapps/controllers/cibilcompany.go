package controllers

import (
	. "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type CibilCompanyController struct {
	*BaseController
}

func (c *CibilCompanyController) GetData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := tk.M{}

	err := k.GetPayload(&param)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	data, err := new(CibilReportModel).GetData(param.GetInt("CustomerId"), param.GetString("DealNo"))

	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	return CreateResult(true, data, "")
}

func (c *CibilCompanyController) Update(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := CibilReportModel{}

	err := k.GetPayload(&param)
	tk.Println(err)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	err = new(CibilReportModel).Update(param)

	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	return CreateResult(true, nil, "")
}
