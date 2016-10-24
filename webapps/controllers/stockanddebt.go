package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"fmt"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	// tk "github.com/eaciit/toolkit"
	// "strconv"
	// "strings"
	// "time"
	"gopkg.in/mgo.v2/bson"
)

func (c *DataCapturingController) StockAndDebt(k *knot.WebContext) interface{} {
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

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html"}

	return DataAccess
}

func (c *DataCapturingController) GetStockAndDebtDetail(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := struct {
		CustomerId string
		Dealno     string
	}{}

	k.GetPayload(&p)

	cn, err := GetConnection()
	defer cn.Close()
	csr, e := cn.NewQuery().
		Where(dbox.And(dbox.Eq("customerid", p.CustomerId+"|"+p.Dealno))).
		From("StockandDebt").
		Cursor(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	defer csr.Close()

	results := []StockandDebtModel{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(false, nil, "No data found !")
	}

	return results
}

func (c *DataCapturingController) SaveStockAndDebtDetail(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	// Username := ""
	// if k.Session("username") != nil {
	// 	Username = k.Session("username").(string)
	// }

	p := StockandDebtModel{}

	k.GetPayload(&p)

	if p.Id == "" {
		p.Id = bson.NewObjectId()
	}

	// p.LastUpdate = time.Now()
	// p.UpdatedBy = Username

	// if p.Status == 1 {
	// 	p.ConfirmedBy = Username
	// 	p.ConfirmedDate = time.Now()
	// } else if p.Status == 2 {
	// 	p.VerifiedBy = Username
	// 	p.VerifiedDate = time.Now()
	// }
	// fmt.Println(p.ApplicantDetail)
	// fmt.Println(p)
	e := c.Ctx.Save(&p)
	if e != nil {
		fmt.Println(e)
	}

	return p
}

// func (c *DataCapturingController) GetStockAndDebtList(k *knot.WebContext) interface{} {
//  k.Config.OutputType = knot.OutputJson

//  type xsorting struct {
//    Field string
//    Dir   string
//  }
//  p := struct {
//    Skip int
//    Take int
//    Sort []xsorting
//  }{}
//  e := k.GetPayload(&p)
//  if e != nil {
//    m.WriteLog(e)
//  }

//  // csr, e := m.Ctx.Find(new(IndustryModel), toolkit.M{})
//  csr, e := m.Ctx.Find(new(IndustryModel), toolkit.M{}.Set("order", []string{"industryname"}).Set("skip", p.Skip).Set("limit", p.Take))
//  defer csr.Close()

//  if len(p.Sort) > 0 {
//    var arrsort []string
//    for _, val := range p.Sort {
//      if val.Dir == "desc" {
//        arrsort = append(arrsort, strings.ToLower("-"+p.Sort[0].Field))
//      } else {
//        arrsort = append(arrsort, strings.ToLower(p.Sort[0].Field))
//      }
//    }
//    csr, e = m.Ctx.Find(new(IndustryModel), toolkit.M{}.Set("order", arrsort).Set("skip", p.Skip).Set("limit", p.Take))
//    defer csr.Close()

//    // fmt.Println(p.Sort[0].Field, p.Sort[0].Dir)
//  }
//  results := make([]IndustryModel, 0)
//  e = csr.Fetch(&results, 0, false)
//  if e != nil {
//    return e.Error()
//  }
//  results2 := results

//  query := toolkit.M{}.Set("AGGR", "$sum")
//  csr, err := m.Ctx.Find(new(IndustryModel), query)
//  defer csr.Close()
//  if err != nil {
//    return err.Error()
//  }

//  data := struct {
//    Data  []IndustryModel
//    Total int
//  }{
//    Data:  results2,
//    Total: csr.Count(),
//  }
//  // fmt.Println(data)
//  return data
// }

// func (c *DataCapturingController) DeleteIndustry(k *knot.WebContext) interface{} {
// 	k.Config.OutputType = knot.OutputJson

// 	p := struct {
// 		Id bson.ObjectId
// 	}{}
// 	e := k.GetPayload(&p)
// 	if e != nil {
// 		m.WriteLog(e)
// 	}

// 	result := new(IndustryModel)
// 	e = m.Ctx.GetById(result, p.Id)
// 	if e != nil {
// 		m.WriteLog(e)
// 	}

// 	result2 := new(CustomerModel)
// 	query := toolkit.M{}.Set("where", dbox.Eq("industry._id", p.Id))
// 	csr, _ := m.Ctx.Find(result2, query)
// 	defer csr.Close()
// 	resultcustomer := make([]CustomerModel, 0)
// 	csr.Fetch(&resultcustomer, 0, false)

// 	if len(resultcustomer) != 0 {
// 		return "This data are reference to Customer data"
// 	} else {
// 		m.LogSave(k, "Delete", "Delete Industry: {"+result.IndustryName+"}")
// 		e = m.Ctx.Delete(result)

// 		return ""
// 	}

// }

// func (c *DataCapturingController) SaveIndustry(k *knot.WebContext) interface{} {
// 	k.Config.OutputType = knot.OutputJson

// 	p := struct {
// 		Id         bson.ObjectId
// 		Name       string
// 		LastUpdate time.Time
// 	}{}
// 	e := k.GetPayload(&p)
// 	if e != nil {
// 		m.WriteLog(e)
// 	}

// 	mdl := new(IndustryModel)
// 	if p.Id == "" {
// 		mdl.Id = bson.NewObjectId()
// 		m.LogSave(k, "Insert", "Add Industry: {"+p.Name+"} with id-"+mdl.Id.Hex())
// 	} else {
// 		result := new(IndustryModel)
// 		e = m.Ctx.GetById(result, p.Id)
// 		if e != nil {
// 			m.WriteLog(e)
// 		}

// 		mdl.Id = p.Id

// 		if result.IndustryName != p.Name {
// 			desc := "Update Industry: {" + result.IndustryName + "} Change-> {IndustryName} = {" + result.IndustryName + "} to {" + p.Name + "} with id-" + p.Id.Hex()
// 			m.LogSave(k, "Update", desc)
// 		}

// 		//change city if used on cust industry obj
// 		// -> customer
// 		ress := new(CustomerModel)
// 		query := toolkit.M{}.Set("where", dbox.Eq("industry", result))
// 		csr, _ := m.Ctx.Find(ress, query)
// 		defer csr.Close()
// 		res := make([]CustomerModel, 0)
// 		csr.Fetch(&res, 0, false)
// 		if len(res) > 0 {
// 			for _, v := range res {
// 				// a := false
// 				// if v.Industry.Id == result.Id && v.Industry.IndustryName == result.IndustryName {
// 				v.Industry.IndustryName = p.Name
// 				v.Industry.Abbrv = strings.ToUpper(strings.Trim(p.Name, " "))
// 				// a = true
// 				// }
// 				// if a {
// 				m.Ctx.Save(&v)
// 				// }
// 			}
// 		}
// 		//end change all data

// 	}

// 	mdl.IndustryName = p.Name
// 	mdl.LastUpdate = time.Now()
// 	mdl.Abbrv = strings.ToUpper(strings.Trim(p.Name, " "))

// 	// check duplication
// 	query := toolkit.M{}.Set("where", dbox.And(dbox.Ne("_id", mdl.Id), dbox.Eq("abbrv", mdl.Abbrv)))

// 	csr, err := m.Ctx.Find(new(IndustryModel), query)
// 	defer csr.Close()
// 	if err != nil {
// 		return err.Error()
// 	}
// 	results := make([]IndustryModel, 0)
// 	err = csr.Fetch(&results, 0, false)
// 	if err != nil {
// 		return err.Error()
// 	}
// 	if len(results) > 0 {
// 		return "This Industry : " + p.Name + " already exists!"
// 	}

// 	e = m.Ctx.Save(mdl)

// 	// ress := new(EmployeeModel)
// 	// query = toolkit.M{}.Set("where", dbox.Eq("location._id", mdl.Id))
// 	// csr, _ = m.Ctx.Find(ress, query)
// 	// defer csr.Close()
// 	// res := make([]EmployeeModel, 0)
// 	// csr.Fetch(&res, 0, false)
// 	// for _, datares := range res {
// 	//  datares.Location = *mdl
// 	//  e = m.Ctx.Save(&datares)
// 	// }

// 	return ""
// }
