package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	"github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	// "net/http"
	"fmt"
)

type DataBrowserController struct {
	*BaseController
}

func (c *DataBrowserController) Default(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"databrowser/customer.html",
		"shared/loading.html",
	}

	return DataAccess
}

func (c *DataBrowserController) NewDefault(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"shared/loading.html",
		"databrowser/filter.html",
	}

	return DataAccess
}

func (d *DataBrowserController) getFilter(t tk.M) *dbox.Filter {

	FILT := tk.M{}
	FILT = t.Get("filter", "").(map[string]interface{})

	arrfilt := FILT.Get("filters", "").([]interface{})

	filters := []*dbox.Filter{}
	var filter *dbox.Filter
	filter = new(dbox.Filter)

	fis := []*dbox.Filter{}
	for _, val := range arrfilt {
		v := val.(map[string]interface{})
		fin := v["filters"]
		fins := []*dbox.Filter{}

		if fin != nil {
			for _, valin := range fin.([]interface{}) {
				vin := valin.(map[string]interface{})

				fi := vin["field"].(string)
				operator := vin["operator"].(string)

				switch value := vin["value"].(type) {
				case string:
					if operator == "eq" {
						fins = append(fins, dbox.Eq(fi, value))
					} else if operator == "contains" {
						fins = append(fins, dbox.Contains(fi, value))
					} else if operator == "startwith" {
						fins = append(fins, dbox.Startwith(fi, value))
					} else if operator == "endwith" {
						fins = append(fins, dbox.Endwith(fi, value))
					}
				default:
					if operator == "gt" {
						fins = append(fins, dbox.Gt(fi, value))
					} else if operator == "gte" {
						fins = append(fins, dbox.Gte(fi, value))
					} else if operator == "eq" {
						fins = append(fins, dbox.Eq(fi, value))
					} else if operator == "lte" {
						fins = append(fins, dbox.Lte(fi, value))
					} else if operator == "lt" {
						fins = append(fins, dbox.Lt(fi, value))
					}
				}

			}
			if len(fins) > 0 {
				ops := v["logic"].(string)
				if ops == "or" {
					fis = append(fis, dbox.Or(fins...))
				} else {
					fis = append(fis, dbox.And(fins...))
				}
			}
		} else {
			fi := v["field"].(string)
			operator := v["operator"].(string)

			switch value := v["value"].(type) {
			case string:
				if operator == "eq" {
					fis = append(fis, dbox.Eq(fi, value))
				} else if operator == "contains" {
					fis = append(fis, dbox.Contains(fi, value))
				} else if operator == "startwith" {
					fis = append(fis, dbox.Startwith(fi, value))
				} else if operator == "endwith" {
					fis = append(fis, dbox.Endwith(fi, value))
				}
			default:
				if operator == "gt" {
					fins = append(fins, dbox.Gt(fi, value))
				} else if operator == "gte" {
					fins = append(fins, dbox.Gte(fi, value))
				} else if operator == "eq" {
					fins = append(fins, dbox.Eq(fi, value))
				} else if operator == "lte" {
					fins = append(fins, dbox.Lte(fi, value))
				} else if operator == "lt" {
					fins = append(fins, dbox.Lt(fi, value))
				}
			}
		}
	}
	if len(fis) > 0 {
		ops := FILT["logic"].(string)
		if ops == "and" {
			filters = append(filters, dbox.And(fis...))
		} else {
			filters = append(filters, dbox.Or(fis...))
		}
	}

	filters = append(filters, dbox.Ne("_id", nil))
	filter = dbox.And(filters...)

	return filter
}

//get data grid
func (a *DataBrowserController) GetListData(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	t := tk.M{}
	err := r.GetPayload(&t)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	SORT := ""
	SORT = t.Get("sort", "").(string)
	filter := a.getFilter(t)

	take := tk.ToInt(t["take"], tk.RoundingAuto)
	skip := tk.ToInt(t["skip"], tk.RoundingAuto)

	if SORT == "" {
		SORT = "_id"
	}

	//get data grid
	c, err := GetConnection()
	defer c.Close()
	csr, e := c.NewQuery().
		Where(filter).
		From("NewCust").
		Order(SORT).
		Take(take).
		Skip(skip).
		Cursor(nil)
	defer csr.Close()

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	results := []tk.M{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(false, nil, "No data found !")
	}

	//get data grid total count
	csrc, e := c.NewQuery().
		Where(filter).
		From("NewCust").
		Cursor(nil)
	defer csrc.Close()

	if e != nil {
		return CreateResult(false, nil, e.Error())
	}

	res := tk.M{}
	if csrc != nil {
		res.Set("total", csrc.Count())
	} else {
		res.Set("total", 0)
	}

	res.Set("data", results)

	return CreateResult(true, res, "success")
}

func (a *DataBrowserController) GetMasterCustomerData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := tk.M{}
	err := k.GetPayload(&t)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()

	prepQuery := conn.NewQuery().From("MasterCustomer")
	if t.Has("filter") {
		prepQuery = prepQuery.Where(a.getFilter(t))
	}
	csr, e := prepQuery.Cursor(nil)
	defer csr.Close()

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	results := []tk.M{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	return CreateResult(true, results, "")
}

func (a *DataBrowserController) GetCustomerProfileData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := tk.M{}
	err := k.GetPayload(&t)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()

	prepQuery := conn.NewQuery().From("CustomerProfile")
	if t.Has("filter") {
		prepQuery = prepQuery.Where(a.getFilter(t))
	}
	csr, e := prepQuery.Cursor(nil)
	defer csr.Close()

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	results := []tk.M{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	return CreateResult(true, results, "")
}

func (a *DataBrowserController) GetAccountDetailData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := tk.M{}
	err := k.GetPayload(&t)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()

	prepQuery := conn.NewQuery().From("AccountDetails")
	if t.Has("filter") {
		prepQuery = prepQuery.Where(a.getFilter(t))
	}
	csr, e := prepQuery.Cursor(nil)
	defer csr.Close()

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	results := []tk.M{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	return CreateResult(true, results, "")
}

func (a *DataBrowserController) GetCreditScorecardData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := tk.M{}
	err := k.GetPayload(&t)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()

	prepQuery := conn.NewQuery().From("CreditScorecard")
	if t.Has("filter") {
		prepQuery = prepQuery.Where(a.getFilter(t))
	}
	csr, e := prepQuery.Cursor(nil)
	defer csr.Close()

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	results := []tk.M{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	return CreateResult(true, results, "")
}

func AttachCustomerProfile(conn dbox.IConnection, val tk.M) {
	// tk.Printfn("%d|%s", val["customer_id"], val["deal_no"])
	qprofile, err := conn.NewQuery().
		From("CustomerProfile").
		Where(dbox.Eq("_id", fmt.Sprintf("%d|%s", val["customer_id"], val["deal_no"]))).
		Select("_id", "applicantdetail").
		Cursor(nil)
	if err != nil {
		return
	}

	resProfile := []tk.M{}
	qprofile.Fetch(&resProfile, 0, false)

	if len(resProfile) == 0 {
		return
	}

	val["_profile"] = resProfile[0]
}

func AttachAccountDetail(conn dbox.IConnection, val tk.M) {
	// tk.Printfn("%d|%s", val["customer_id"], val["deal_no"])
	qprofile, err := conn.NewQuery().
		From("AccountDetails").
		Where(dbox.Eq("_id", fmt.Sprintf("%d|%s", val["customer_id"], val["deal_no"]))).
		Select("_id", "accountsetupdetails").
		Cursor(nil)
	if err != nil {
		return
	}

	resProfile := []tk.M{}
	qprofile.Fetch(&resProfile, 0, false)

	if len(resProfile) == 0 {
		return
	}

	val["_accountdetails"] = resProfile[0]
}

func (a *DataBrowserController) GetCombinedData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	conn, err := GetConnection()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}
	defer conn.Close()

	resCust := []tk.M{}
	// qcust, err := conn.NewQuery().From("MasterCustomer").Cursor(nil)
	// if err != nil {
	// 	return CreateResult(false, nil, err.Error())
	// }

	// defer qcust.Close()
	// qcust.Fetch(&resCust, 0, false)

	if k.Session("CustomerProfileData") != nil {
		arrSes := k.Session("CustomerProfileData").([]tk.M)
		for _, val := range arrSes {
			appdet := val.Get("applicantdetail").(tk.M)
			appdet.Set("customer_id", cast.ToInt(appdet.GetString("CustomerID"), cast.RoundingAuto))
			appdet.Set("deal_no", appdet.GetString("DealNo"))
			appdet.Set("customer_name", appdet.GetString("CustomerName"))
			resCust = append(resCust, appdet)
		}
	}

	for _, val := range resCust {
		AttachCustomerProfile(conn, val)
		AttachAccountDetail(conn, val)
	}

	return CreateResult(true, resCust, "")
}
