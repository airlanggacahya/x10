package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/models"
	// "errors"
	// "fmt"
	// "time"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type ReallocationController struct {
	*BaseController
}

func (c *ReallocationController) GetReallocationDeal(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := []ReallocationDeal{}

	con, err := GetConnection()
	if err != nil {
		return res
	}

	defer con.Close()

	cur, err := con.NewQuery().From("ReallocationDeal").Cursor(nil)
	if err != nil {
		return res
	}

	cur.Fetch(&res, 0, true)

	return res
}

func (c *ReallocationController) Default(k *knot.WebContext) interface{} {
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

	DataAccess.TopMenu = c.GetTopMenuName(DataAccess.Menuname)

	k.Config.IncludeFiles = []string{"shared/loading.html", "reallocation/list.html", "reallocation/new.html", "reallocation/modal.html"}

	return DataAccess
}

func (c *ReallocationController) SearchByParam(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := tk.M{}

	err := k.GetPayload(&param)
	if err != nil {
		panic(err)
	}

	reallo, err := new(ReallocationDeal).SearchByParam(param)

	if err != nil {
		panic(err)
	}

	return reallo
}

func (c *ReallocationController) GetData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	result := tk.M{}

	AD, err := new(AccountDetail).All()

	if err != nil {
		res.SetError(err)
		return res
	}

	result.Set("AccountDetails", AD)

	users, _ := GetAllUser()
	result.Set("MasterUser", users)

	customer, _ := GetAllCustomer()
	result.Set("MasterCustomer", customer)
	res.SetData(result)

	return res
}

func (c *ReallocationController) GetDataByParam(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)
	// result := tk.M{}

	param := tk.M{}

	err := k.GetPayload(&param)
	if err != nil {
		res.SetError(err)
		return res
	}

	filter := c.GenerateParam(param)

	AD, err := new(AccountDetail).Where(filter)

	if err != nil {
		res.SetError(err)
	}

	res.SetData(AD)

	return res
}

func (c *ReallocationController) GetDataByDealNo(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	result := tk.M{}

	param := tk.M{}

	err := k.GetPayload(&param)
	if err != nil {
		res.SetError(err)
		return res
	}

	filter := []*dbox.Filter{}
	filter = append(filter, dbox.Eq("dealno", param.GetString("DealNo")))

	AD, err := new(AccountDetail).Where(filter)

	if err != nil {
		res.SetError(err)
	}

	result.Set("AccountDetails", AD)

	filter = append(filter[0:0], dbox.Eq("_id", bson.ObjectIdHex(param.GetString("Id"))))
	Allocate, err := new(ReallocationDeal).Where(filter)

	if err != nil {
		res.SetError(err)
	}

	result.Set("AllocationDeal", Allocate)

	res.SetData(result)

	return res
}

func (c *ReallocationController) GenerateParam(param tk.M) []*dbox.Filter {
	filter := []*dbox.Filter{}

	dataDealNo := param.Get("DealNo").([]interface{})

	if len(dataDealNo) > 0 {
		filter = append(filter, dbox.In("dealno", dataDealNo...))
	}

	dataCaName := param.Get("CaName").([]interface{})

	if len(dataCaName) > 0 {
		filter = append(filter, dbox.In("accountsetupdetails.creditanalyst", dataCaName...))
	}

	dataCustomer := param.Get("Customer").([]interface{})

	if len(dataCustomer) > 0 {
		filter = append(filter, dbox.In("customerid", dataCustomer...))
	}

	dataRMName := param.Get("RMName").([]interface{})

	if len(dataRMName) > 0 {
		filter = append(filter, dbox.In("accountsetupdetails.rmname", dataRMName...))
	}

	return filter
}

func (c *ReallocationController) GetAccountDetail(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	filter := []*dbox.Filter{}

	AD, err := new(AccountDetail).Where(filter)

	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(AD)
	return res
}

func GetAllUser() (interface{}, error) {
	resCust := []tk.M{}

	conn, err := GetConnection()
	if err != nil {
		return resCust, err
	}
	defer conn.Close()

	qcust, err := conn.NewQuery().From("MasterUser").Cursor(nil)
	if err != nil {
		return resCust, err
	}

	defer qcust.Close()
	qcust.Fetch(&resCust, 0, false)

	return resCust, err
}

func GetAllCustomer() (interface{}, error) {
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

func (c *ReallocationController) UpdateReallocationRole(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	param := []tk.M{}

	err := k.GetPayload(&param)
	if err != nil {
		res.SetError(err)
		return res
	}

	allocate := new(ReallocationDeal)
	err = allocate.UpdateReallocationRole(param)

	if err != nil {
		panic(err)
	}

	res.SetData(param)

	return res
}
