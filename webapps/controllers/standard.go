package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"

	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	//"strconv"
)

type StandardController struct {
	*BaseController
}

func (c *StandardController) Default(k *knot.WebContext) interface{} {
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

func (c *StandardController) GetDropdownMaster(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	csr, err := conn.NewQuery().Select().From("MasterAccountDetail").Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	result := []tk.M{}
	err = csr.Fetch(&result, 0, false)
	defer csr.Close()

	return CreateResult(true, result, "")
}

func (c *StandardController) GetAllData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	csr, err := conn.NewQuery().Select().From("MasterStandard").Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	result := []StandardMaster{}
	err = csr.Fetch(&result, 0, false)
	defer csr.Close()

	avgdelayday := []StandardMaster{}
	avgpaymentdelay := []StandardMaster{}
	avgpaymentday := []StandardMaster{}

	for _, val := range result {
		if val.Type == "Average Delay Days" {
			avgdelayday = append(avgdelayday, val)
		}
		if val.Type == "Average Payment Delay Days" {
			avgpaymentdelay = append(avgpaymentdelay, val)
		}
		if val.Type == "Average Payment Days" {
			avgpaymentday = append(avgpaymentday, val)
		}
	}

	return CreateResult(true, tk.M{}.Set("AvgDelayDays", avgdelayday).Set("AvgPaymentDelay", avgpaymentdelay).Set("AvgPaymentDay", avgpaymentday), "")
}

func (c *StandardController) SaveStandardMaster(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := StandardMasterParam{}
	err := k.GetPayload(&param)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	stddata := StandardMaster{}
	stddatas := []StandardMaster{}
	query := conn.NewQuery().SetConfig("multiexec", true).From("MasterStandard").Save()

	for _, val := range param.StandardMasters {
		stddata.Id = bson.NewObjectId()
		stddata.Products = val.Products
		stddata.Scheme = val.Scheme
		stddata.RatingMastersCustomerSegment = val.RatingMastersCustomerSegment
		stddata.Value = val.Value
		stddata.Type = val.Type

		stddatas = append(stddatas, stddata)

		filter := []*dbox.Filter{}
		filter = append(filter, dbox.Eq("Products", val.Products))
		filter = append(filter, dbox.Eq("Scheme", val.Scheme))
		filter = append(filter, dbox.Eq("RatingMastersCustomerSegment", val.RatingMastersCustomerSegment))
		filter = append(filter, dbox.Eq("Type", val.Type))

		csr, err := conn.NewQuery().Select().From("MasterStandard").Where(filter...).Cursor(nil)
		if err != nil {
			return CreateResult(false, nil, err.Error())
		}

		exisdata := []StandardMaster{}
		err = csr.Fetch(&exisdata, 0, false)
		defer csr.Close()

		if len(exisdata) > 0 {
			return CreateResult(false, nil, "Combination Already Exist")
		} else {
			err = query.Exec(tk.M{}.Set("data", stddata))
			if err != nil {
				return CreateResult(false, nil, err.Error())
			}
		}

	}
	return CreateResult(true, stddatas, "")
}

func (c *StandardController) UpdateStandardMaster(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := StandardMaster{}
	err := k.GetPayload(&param)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	filter := []*dbox.Filter{}
	filter = append(filter, dbox.Eq("Products", param.Products))
	filter = append(filter, dbox.Eq("Scheme", param.Scheme))
	filter = append(filter, dbox.Eq("RatingMastersCustomerSegment", param.RatingMastersCustomerSegment))
	filter = append(filter, dbox.Eq("Type", param.Type))

	csr, err := conn.NewQuery().Select().From("MasterStandard").Where(filter...).Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	exisdata := []StandardMaster{}
	err = csr.Fetch(&exisdata, 0, false)
	defer csr.Close()

	if len(exisdata) > 0 {
		return CreateResult(false, nil, "Combination Already Exist")
	} else {
		err = conn.NewQuery().From("MasterStandard").Update().Exec(tk.M{}.Set("data", param))
		if err != nil {
			return CreateResult(false, nil, err.Error())
		}
	}

	return CreateResult(true, param, "")
}

func (c *StandardController) DeleteStandardMaster(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := StandardMaster{}
	err := k.GetPayload(&param)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	filter := []*dbox.Filter{}
	filter = append(filter, dbox.Eq("_id", param.Id))

	err = conn.NewQuery().From("MasterStandard").Delete().Where(filter...).Exec(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	return CreateResult(true, param, "")
}
