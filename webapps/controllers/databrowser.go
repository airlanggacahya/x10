package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	// "github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	// "net/http"
	// "time"
)

type DataBrowserController struct {
	*BaseController
}

func (c *DataBrowserController) Default(k *knot.WebContext) interface{} {
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
	k.Config.IncludeFiles = []string{"databrowser/customer.html", "shared/loading.html"}

	return DataAccess
}

//get data grid
func (a *DataBrowserController) GetListData(r *knot.WebContext) interface{} {
	r.Config.OutputType = knot.OutputJson

	t := tk.M{}
	err := r.GetPayload(&t)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	// PROJECTID := ""
	FILT := tk.M{}
	SORT := ""
	// CLIENTID := ""
	// DATEF := ""
	// DATET := ""
	// datefrom := time.Date(2016, 01, 01, 0, 0, 0, 0, time.UTC)
	// dateto := time.Date(2016, 12, 01, 0, 0, 0, 0, time.UTC)

	if err != nil {
		return CreateResult(false, nil, err.Error())
	} else {
		// PROJECTID = t.Get("project", "").(string)
		// CLIENTID = t.Get("client", "").(string)
		// DATEF = t.Get("datefrom", "").(string)
		// DATET = t.Get("dateto", "").(string)
		SORT = t.Get("sort", "").(string)
		FILT = t.Get("filter", "").(map[string]interface{})
		// datefrom = cast.String2Date(DATEF, "dd MMM yyyy")
		// dateto = cast.String2Date(DATET, "dd MMM yyyy")
	}

	arrfilt := FILT.Get("filters", "").([]interface{})

	filters := []*dbox.Filter{}
	var filter *dbox.Filter
	filter = new(dbox.Filter)

	//generate query from kendo grid header filter
	fis := []*dbox.Filter{}
	for _, val := range arrfilt {
		v := val.(map[string]interface{})
		fin := v["filters"]
		fins := []*dbox.Filter{}
		if fin != nil {
			for _, valin := range fin.([]interface{}) {
				vin := valin.(map[string]interface{})
				value := vin["value"].(string)
				fi := vin["field"].(string)
				operator := vin["operator"].(string)
				if operator == "eq" {
					fins = append(fins, dbox.Eq(fi, value))
				} else if operator == "contains" {
					fins = append(fins, dbox.Contains(fi, value))
				} else if operator == "startwith" {
					fins = append(fins, dbox.Startwith(fi, value))
				} else if operator == "endwith" {
					fins = append(fins, dbox.Endwith(fi, value))
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
			value := v["value"].(string)
			fi := v["field"].(string)
			operator := v["operator"].(string)
			if operator == "eq" {
				fis = append(fis, dbox.Eq(fi, value))
			} else if operator == "contains" {
				fis = append(fis, dbox.Contains(fi, value))
			} else if operator == "startwith" {
				fis = append(fis, dbox.Startwith(fi, value))
			} else if operator == "endwith" {
				fis = append(fis, dbox.Endwith(fi, value))
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

	// filters = append(filters, dbox.Gte("time_date", datefrom))
	// filters = append(filters, dbox.Lte("time_date", dateto))

	// if PROJECTID == "" {
	// 	filters = append(filters, dbox.Ne("project_code", PROJECTID))
	// } else {
	// 	filters = append(filters, dbox.Eq("project_code", PROJECTID))
	// }

	// if CLIENTID == "" {
	// 	filters = append(filters, dbox.Ne("client_code", CLIENTID))
	// } else {
	// 	filters = append(filters, dbox.Eq("client_code", CLIENTID))
	// }

	if SORT == "" {
		SORT = "_id"
	}

	filters = append(filters, dbox.Ne("_id", nil))
	filter = dbox.And(filters...)

	take := tk.ToInt(t["take"], tk.RoundingAuto)
	skip := tk.ToInt(t["skip"], tk.RoundingAuto)

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

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	defer csr.Close()

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

func (c *DataBrowserController) NewDefault(k *knot.WebContext) interface{} {
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
	k.Config.IncludeFiles = []string{"shared/loading.html"}

	return DataAccess
}
