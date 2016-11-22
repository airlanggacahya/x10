package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"fmt"
	"github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"strconv"
	"strings"
	"time"
)

type Param struct {
	CustomerId int
	Data       []tk.M
}

func (c *DataCapturingController) Cibil(k *knot.WebContext) interface{} {
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
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html", "datacapturing/cibilcomment.html", "datacapturing/cibilgrid.html", "datacapturing/panelcibil.html", "datacapturing/entryreportcibil.html"}

	return DataAccess
}

func (c *DataCapturingController) CibilNew(k *knot.WebContext) interface{} {
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

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html", "datacapturing/cibilcomment.html", "datacapturing/cibilgridnew.html", "datacapturing/panelcibilnew.html", "datacapturing/entryreportcibil.html", "datacapturing/panelcibildetails.html", "datacapturing/panelcibilguarantors.html", "datacapturing/entryreportcibilnew.html"}

	return DataAccess
}

func (c *DataCapturingController) GetCibilReport(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	mm, err := GetConnection()
	defer mm.Close()
	csr, e := mm.NewQuery().
		From("CibilReport").
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

	return results
}

func (c *DataCapturingController) UpdatePromotor(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := []struct {
		CustomerId string
		DealNo     string
		Name       string
		FatherName string
		Scors      string
	}{}

	_ = k.GetPayload(&param)

	if len(param) > 0 {
		cn, err := GetConnection()
		defer cn.Close()

		query := []*dbox.Filter{}
		query = append(query, dbox.Eq("_id", param[0].CustomerId))
		csr, e := cn.NewQuery().
			Where(query...).
			From("CustomerProfile").
			Cursor(nil)

		if e != nil {
			return CreateResult(false, nil, e.Error())
		} else if csr == nil {
			return CreateResult(true, nil, "")
		}

		defer csr.Close()

		results := CustomerProfiles{}

		err = csr.Fetch(&results, 1, true)
		if err != nil {
			return CreateResult(false, nil, e.Error())
		} else if csr == nil {
			return CreateResult(false, nil, "No data found !")
		}

		for index, _ := range results.DetailOfPromoters.Biodata {
			for index1, _ := range param {
				if param[index1].FatherName == results.DetailOfPromoters.Biodata[index].FatherName {
					results.DetailOfPromoters.Biodata[index].CIBILScore, _ = strconv.ParseFloat(strings.TrimSpace(param[index1].Scors), 64)
					break
				}
			}
		}
		tk.Println(results.DetailOfPromoters.Biodata[0].CIBILScore, "----------datax")
		c.Ctx.Save(&results)

		csr, e = cn.NewQuery().
			Where(query...).
			From("CustomerProfileConfirmed").
			Cursor(nil)

		if e != nil {
			return CreateResult(false, nil, e.Error())
		} else if csr.Count() > 0 {
			resultsconf := CustomerProfiles{}
			err = csr.Fetch(&resultsconf, 1, true)
			if err != nil {
				return CreateResult(false, nil, e.Error())
			} else if csr == nil {
				return CreateResult(false, nil, "No data found !")
			}

			for index, _ := range resultsconf.DetailOfPromoters.Biodata {
				for index1, _ := range param {
					if param[index1].FatherName == resultsconf.DetailOfPromoters.Biodata[index].FatherName {
						resultsconf.DetailOfPromoters.Biodata[index].CIBILScore, _ = strconv.ParseFloat(strings.TrimSpace(param[index1].Scors), 64)
						break
					}
				}
			}
			if err := new(DataConfirmController).SaveDataConfirmed(strings.Split(param[0].CustomerId, "|")[0], param[0].DealNo, "CustomerProfile", &resultsconf, true); err != nil {
				return CreateResult(false, nil, err.Error())
			}
		}

		return results
	}

	return nil
}

func (c *DataCapturingController) UpdateFreeze(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := tk.M{}
	k.GetPayload(&p)

	cibilReports := []CibilReportModel{}
	cn, err := GetConnection()
	defer cn.Close()

	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", p.GetInt("custid")))
	query = append(query, dbox.Eq("Profile.dealno", p.GetString("dealno")))
	csr, e := cn.NewQuery().
		Where(query...).
		From("CibilReport").
		Cursor(nil)

	// _ = csr
	if e != nil {
		panic(e)
	} else if csr == nil {
		panic(csr)
	}

	defer csr.Close()

	err = csr.Fetch(&cibilReports, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	qinsert := cn.NewQuery().
		From("CibilReport").
		SetConfig("multiexec", true).
		Save()
	defer qinsert.Close()

	if len(cibilReports) > 0 {
		rep := cibilReports[0]
		rep.IsFreeze = p["status"].(bool)
		insdata := map[string]interface{}{"data": rep}
		em := qinsert.Exec(insdata)
		if em != nil {
			return CreateResult(false, nil, em.Error())
		}
	}

	return CreateResult(true, nil, "")

}

func (c *DataCapturingController) SavingReportCibil(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := CibilDraftModel{}
	k.GetPayload(&p)

	if p.Id == "" {
		p.Id = bson.NewObjectId()
	}

	e := c.Ctx.Save(&p)
	if e != nil {
		fmt.Println(e)
	}

	cibilReports := []CibilReportModel{}
	cn, err := GetConnection()
	defer cn.Close()

	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", p.Profile.CustomerId))
	query = append(query, dbox.Eq("Profile.dealno", p.Profile.DealNo))
	csr, e := cn.NewQuery().
		Where(query...).
		From("CibilReport").
		Cursor(nil)

	// _ = csr
	if e != nil {
		panic(e)
	} else if csr == nil {
		panic(csr)
	}

	defer csr.Close()

	err = csr.Fetch(&cibilReports, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	query = []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", p.Profile.CustomerId))
	query = append(query, dbox.Eq("Profile.dealno", p.Profile.DealNo))
	csr, e = cn.NewQuery().
		Where(query...).
		From("CibilReport").
		Cursor(nil)

	cibilReporttk := []tk.M{}
	err = csr.Fetch(&cibilReporttk, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	for idx, _ := range cibilReporttk {
		detail := cibilReporttk[idx]["DetailReportSummary"]
		resjson := []DetailReportSummary{}
		tk.Serde(detail, &resjson, "json")
		cibilReports[idx].DetailReportSummary = resjson
	}

	for _, cibil := range cibilReports {
		cibil.Status = 1
		c.Ctx.Save(&cibil)
	}

	return p
}

func (c *DataCapturingController) SubmitReportCibil(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := CibilDraftModel{}
	k.GetPayload(&p)

	if p.Id == "" {
		p.Id = bson.NewObjectId()
	}

	p.Status = 1
	e := c.Ctx.Save(&p)
	if e != nil {
		fmt.Println(e)
	}

	cibilReports := []CibilReportModel{}
	cn, err := GetConnection()
	defer cn.Close()
	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", p.Profile.CustomerId))
	query = append(query, dbox.Eq("Profile.dealno", p.Profile.DealNo))
	csr, e := cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Cursor(nil)

	// _ = csr
	if e != nil {
		panic(e)
	} else if csr == nil {
		panic(csr)
	}

	defer csr.Close()

	err = csr.Fetch(&cibilReports, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	query = []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", p.Profile.CustomerId))
	query = append(query, dbox.Eq("Profile.dealno", p.Profile.DealNo))
	csr, e = cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Cursor(nil)

	cibilReporttk := []tk.M{}
	err = csr.Fetch(&cibilReporttk, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	for idx, _ := range cibilReporttk {
		detail := cibilReporttk[idx]["DetailReportSummary"]
		resjson := []DetailReportSummary{}
		tk.Serde(detail, &resjson, "json")
		cibilReports[idx].DetailReportSummary = resjson
	}

	for _, cibil := range cibilReports {
		cibil.Status = 1
		c.Ctx.Save(&cibil)
	}

	return p
}

func (c *DataCapturingController) ConfirmReportCibil(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := tk.M{}
	k.GetPayload(&p)

	cibildraft := []CibilDraftModel{}
	cn, err := GetConnection()
	defer cn.Close()
	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
	query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
	csr, e := cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilDraft").
		Cursor(nil)

	// _ = csr
	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr != nil {
		defer csr.Close()

		err = csr.Fetch(&cibildraft, 0, false)
		if err != nil {
			return CreateResult(false, nil, e.Error())
		}

		query = []*dbox.Filter{}
		query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
		query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
		csr, e = cn.NewQuery().
			Where(dbox.And(query...)).
			From("CibilDraft").
			Cursor(nil)

		cibilReporttk := []tk.M{}
		err = csr.Fetch(&cibilReporttk, 0, false)
		if err != nil {
			return CreateResult(false, nil, e.Error())
		}

		for idx, _ := range cibilReporttk {
			detail := cibilReporttk[idx]["DetailReportSummary"]
			resjson := []DetailReportSummary{}
			tk.Serde(detail, &resjson, "json")
			cibildraft[idx].DetailReportSummary = resjson
		}

		for _, cibil := range cibildraft {
			cibil.Status = 2
			c.Ctx.Save(&cibil)
		}
	}

	cibilReports := []CibilReportModel{}

	query = []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
	query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
	csr, e = cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Cursor(nil)

	// _ = csr
	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	defer csr.Close()

	err = csr.Fetch(&cibilReports, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	query = []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
	query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
	csr, e = cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Cursor(nil)

	cibilReporttk := []tk.M{}
	err = csr.Fetch(&cibilReporttk, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}
	for idx, _ := range cibilReporttk {
		detail := cibilReporttk[idx]["DetailReportSummary"]
		resjson := []DetailReportSummary{}
		tk.Serde(detail, &resjson, "json")
		cibilReports[idx].DetailReportSummary = resjson
	}

	for _, cibil := range cibilReports {
		cibil.Status = 2
		c.Ctx.Save(&cibil)
	}

	return cibilReports
}

func (c *DataCapturingController) GetReportCibilById(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	p := struct {
		Id     string
		DealNo string
	}{}

	k.GetPayload(&p)

	cn, err := GetConnection()
	defer cn.Close()
	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p.Id, cast.RoundingAuto)))
	query = append(query, dbox.Eq("Profile.dealno", p.DealNo))
	csr, e := cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilDraft").
		Cursor(nil)

	// _ = csr
	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	defer csr.Close()

	results := CibilDraftModel{}

	err = csr.Fetch(&results, 1, true)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	query = []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p.Id, cast.RoundingAuto)))
	query = append(query, dbox.Eq("Profile.dealno", p.DealNo))
	csr, e = cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilDraft").
		Cursor(nil)

	cibilReporttk := []tk.M{}
	err = csr.Fetch(&cibilReporttk, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	for idx, _ := range cibilReporttk {
		detail := cibilReporttk[idx]["DetailReportSummary"]
		resjson := []DetailReportSummary{}
		tk.Serde(detail, &resjson, "json")
		results.DetailReportSummary = resjson
	}

	return results
}

func (c *DataCapturingController) SetConfirmAll(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := tk.M{}
	k.GetPayload(&p)

	cibildraft := []CibilDraftModel{}
	cn, err := GetConnection()
	defer cn.Close()
	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
	query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
	csr, e := cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilDraft").
		Cursor(nil)

	// _ = csr
	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr != nil {
		defer csr.Close()

		err = csr.Fetch(&cibildraft, 0, false)
		if err != nil {
			return CreateResult(false, nil, e.Error())
		}

		query = []*dbox.Filter{}
		query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
		query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
		csr, e = cn.NewQuery().
			Where(dbox.And(query...)).
			From("CibilDraft").
			Cursor(nil)

		cibilReporttk := []tk.M{}
		err = csr.Fetch(&cibilReporttk, 0, false)
		if err != nil {
			return CreateResult(false, nil, e.Error())
		}

		for idx, _ := range cibilReporttk {
			detail := cibilReporttk[idx]["DetailReportSummary"]
			resjson := []DetailReportSummary{}
			tk.Serde(detail, &resjson, "json")
			cibildraft[idx].DetailReportSummary = resjson
		}

		for _, cibil := range cibildraft {
			cibil.AllConfirmTime = time.Now()
			c.Ctx.Save(&cibil)
		}
	}

	cibilReports := []CibilReportModel{}

	query = []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
	query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
	csr, e = cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Cursor(nil)

	// _ = csr
	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	defer csr.Close()

	err = csr.Fetch(&cibilReports, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	query = []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
	query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
	csr, e = cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Cursor(nil)

	cibilReporttk := []tk.M{}
	err = csr.Fetch(&cibilReporttk, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	for idx, _ := range cibilReporttk {
		detail := cibilReporttk[idx]["DetailReportSummary"]
		resjson := []DetailReportSummary{}
		tk.Serde(detail, &resjson, "json")
		cibilReports[idx].DetailReportSummary = resjson
	}

	for idx, cibil := range cibilReports {
		cibil.AllConfirmTime = time.Now()
		cibilReports[idx].AllConfirmTime = time.Now()
		c.Ctx.Save(&cibil)
	}

	return cibilReports
}

func (c *DataCapturingController) AcceptRejectReportCibil(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := tk.M{}
	k.GetPayload(&p)

	cibildraft := []CibilDraftModel{}
	cn, err := GetConnection()
	defer cn.Close()
	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
	query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
	csr, e := cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilDraft").
		Cursor(nil)

	// _ = csr
	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr != nil {
		defer csr.Close()

		err = csr.Fetch(&cibildraft, 0, false)
		if err != nil {
			return CreateResult(false, nil, e.Error())
		}

		query = []*dbox.Filter{}
		query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
		query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
		csr, e = cn.NewQuery().
			Where(dbox.And(query...)).
			From("CibilDraft").
			Cursor(nil)

		cibilReporttk := []tk.M{}
		err = csr.Fetch(&cibilReporttk, 0, false)
		if err != nil {
			return CreateResult(false, nil, e.Error())
		}

		for idx, _ := range cibilReporttk {
			detail := cibilReporttk[idx]["DetailReportSummary"]
			resjson := []DetailReportSummary{}
			tk.Serde(detail, &resjson, "json")
			cibildraft[idx].DetailReportSummary = resjson
		}

		for _, cibil := range cibildraft {
			cibil.Status = cast.ToInt(p["status"].(float64), cast.RoundingAuto)
			cibil.AcceptRejectTime = time.Now()
			c.Ctx.Save(&cibil)
		}
	}

	cibilReports := []CibilReportModel{}

	query = []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
	query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
	csr, e = cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Cursor(nil)

	// _ = csr
	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	defer csr.Close()

	err = csr.Fetch(&cibilReports, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	query = []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", cast.ToInt(p["customerid"].(string), cast.RoundingAuto)))
	query = append(query, dbox.Eq("Profile.dealno", p["dealno"].(string)))
	csr, e = cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Cursor(nil)

	cibilReporttk := []tk.M{}
	err = csr.Fetch(&cibilReporttk, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	}

	for idx, _ := range cibilReporttk {
		detail := cibilReporttk[idx]["DetailReportSummary"]
		resjson := []DetailReportSummary{}
		tk.Serde(detail, &resjson, "json")
		cibilReports[idx].DetailReportSummary = resjson
	}

	for idx, cibil := range cibilReports {
		cibil.Status = cast.ToInt(p["status"].(float64), cast.RoundingAuto)
		cibil.AcceptRejectTime = time.Now()
		cibilReports[idx].AcceptRejectTime = time.Now()
		c.Ctx.Save(&cibil)
	}

	return cibilReports
}

func (c *DataCapturingController) UpdateRating(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := tk.M{}
	k.GetPayload(&p)

	customerId, _ := strconv.Atoi(p.GetString("CustomerId"))

	cibilModel := []CibilReportModel{}

	cn, _ := GetConnection()
	defer cn.Close()

	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", customerId))
	query = append(query, dbox.Eq("Profile.dealno", p.GetString("DealNo")))
	csr, _ := cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Cursor(nil)

	defer csr.Close()

	_ = csr.Fetch(&cibilModel, 0, false)

	for _, cibil := range cibilModel {
		cibil.Rating = p.GetString("Rating")
		c.Ctx.Save(&cibil)
	}

	return CreateResult(true, nil, "")
}

func (c *DataCapturingController) UpdateConfirmGuarantor(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := tk.M{}
	k.GetPayload(&p)

	cibilIndividual := []ReportData{}
	customerProfile := []CustomerProfiles{}
	customerProfileConf := []CustomerProfiles{}

	cn, _ := GetConnection()
	defer cn.Close()

	customerId, _ := strconv.Atoi(p["CustomerId"].(string))

	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("ConsumerInfo.CustomerId", customerId))
	query = append(query, dbox.Eq("ConsumerInfo.DealNo", p["DealNo"].(string)))
	csr, _ := cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReportPromotorFinal").
		Cursor(nil)

	_ = csr.Fetch(&cibilIndividual, 0, false)
	csr.Close()

	query = append(query[0:0], dbox.Eq("applicantdetail.CustomerID", customerId))
	query = append(query, dbox.Eq("applicantdetail.DealNo", p["DealNo"].(string)))
	csr, _ = cn.NewQuery().
		Where(dbox.And(query...)).
		From("CustomerProfile").
		Cursor(nil)

	_ = csr.Fetch(&customerProfile, 0, false)
	csr.Close()

	err := new(DataConfirmController).GetDataConfirmed(p["CustomerId"].(string), p["DealNo"].(string), "CustomerProfile", &customerProfileConf)
	if err != nil {
		return err
	}

	for idx, promotor := range cibilIndividual {
		promotor.StatusCibil = p.GetInt("StatusPromotor")
		if promotor.StatusCibil == 1 {

			del := false
			if idx == 0 {
				del = true
			}
			if err := new(DataConfirmController).SaveDataConfirmed(p["CustomerId"].(string), p["DealNo"].(string), "CibilReportPromotorFinal", &promotor, del); err != nil {
				return err
			}
		}
		c.Ctx.Save(&promotor)
	}

	for _, customer := range customerProfile {
		customer.StatusCibil = p.GetInt("StatusPromotor")
		c.Ctx.Save(&customer)
	}

	if p.GetInt("StatusPromotor") == 1 {
		for _, customer := range customerProfileConf {
			customer.StatusCibil = p.GetInt("StatusPromotor")
			if err := new(DataConfirmController).SaveDataConfirmed(p["CustomerId"].(string), p["DealNo"].(string), "CustomerProfile", &customer, true); err != nil {
				return err
			}
		}
	}

	return CreateResult(true, nil, "")
}

func (c *DataCapturingController) UpdateConfirmCibil(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := tk.M{}
	k.GetPayload(&p)

	cibilModel := []CibilReportModel{}
	cibilDraft := []CibilReportModel{}

	cn, _ := GetConnection()
	defer cn.Close()

	customerId, _ := strconv.Atoi(p["CustomerId"].(string))

	query := []*dbox.Filter{}
	query = append(query, dbox.Eq("Profile.customerid", customerId))
	query = append(query, dbox.Eq("Profile.dealno", p["DealNo"].(string)))
	csr, _ := cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilReport").
		Cursor(nil)

	_ = csr.Fetch(&cibilModel, 0, false)
	csr.Close()

	csr, _ = cn.NewQuery().
		Where(dbox.And(query...)).
		From("CibilDraft").
		Cursor(nil)

	_ = csr.Fetch(&cibilDraft, 0, false)
	csr.Close()

	for idx, cibil := range cibilModel {
		cibil.IsConfirm = p.GetInt("IsConfirm")
		cibil.AcceptRejectTime = time.Now()
		if cibil.IsConfirm == 1 && idx == 0 && len(cibilDraft) == 0 {
			if err := new(DataConfirmController).SaveDataConfirmed(p["CustomerId"].(string), p["DealNo"].(string), "CibilReport", &cibil, true); err != nil {
				return err
			}
		} else if cibil.IsConfirm == 1 && idx == 0 {
			cibilDraft[0].Rating = cibil.Rating
			if err := new(DataConfirmController).SaveDataConfirmed(p["CustomerId"].(string), p["DealNo"].(string), "CibilReport", &cibilDraft[0], true); err != nil {
				return err
			}
		}
		c.Ctx.Save(&cibil)
	}

	return CreateResult(true, nil, "")
}
