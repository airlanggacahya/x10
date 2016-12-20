package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"fmt"
	"strconv"
	"strings"
	"time"

	. "github.com/eaciit/textsearch"

	"github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	// "gopkg.in/mgo.v2/bson"
)

func (c *DataCapturingController) CustomerProfileInfo(k *knot.WebContext) interface{} {
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
	k.Config.IncludeFiles = []string{"shared/filter.html", "datacapturing/detailforapplicant.html", "datacapturing/financialinformation.html", "datacapturing/nonrefundableprocessingfeesdetails.html", "datacapturing/detailsofpromotersdirectorsguarantors.html", "shared/loading.html"}

	return DataAccess
}

func (c *DataCapturingController) GetCustomerProfile(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	mm, err := GetConnection()
	defer mm.Close()
	csr, e := mm.NewQuery().
		Select("_id", "applicantdetail.CustomerName", "applicantdetail.DealNo").
		From("CustomerProfile").
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

// func (c *DataCapturingController) GetCustomerProfile(k *knot.WebContext) interface{} {
// 	k.Config.OutputType = knot.OutputJson

// 	var results = CustomerProfiles{}
// 	err := new(DataConfirmController).GetDataConfirmed(custid, dealno, new(CustomerProfiles).TableName(), &results)

// 	if err != nil {
// 		return err
// 	}

// 	return results
// }

func (c *DataCapturingController) GetCustomerProfileList(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	mm, err := GetConnection()
	defer mm.Close()
	csr, e := mm.NewQuery().
		From("MasterCustomer").
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

func (c *DataCapturingController) GetCustomerProfileListConfirmed(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	mm, err := GetConnection()
	defer mm.Close()
	csr, e := mm.NewQuery().
		From("MasterCustomer").
		Cursor(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	defer csr.Close()

	results := []tk.M{}
	err = csr.Fetch(&results, 0, false)

	csr, e = mm.NewQuery().
		From("CustomerProfile").
		Where(dbox.Eq("Status", 1)).
		Cursor(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	defer csr.Close()

	resultsconf := []tk.M{}
	err = csr.Fetch(&resultsconf, 0, false)

	if err != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(false, nil, "No data found !")
	}

	finalres := []tk.M{}
	for _, val := range results {
		for _, valv := range resultsconf {
			// tk.Println(valv)
			if valv.GetString("_id") == cast.ToString(val.GetInt("customer_id"))+"|"+val.GetString("deal_no") {
				finalres = append(finalres, val)
				break
			}
		}
	}

	return finalres
}

func (c *DataCapturingController) GetCustomerProfileDetail(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := struct {
		CustomerId string
		Dealno     string
	}{}

	k.GetPayload(&p)

	cn, err := GetConnection()
	defer cn.Close()
	csr, e := cn.NewQuery().
		Where(dbox.And(dbox.Eq("_id", p.CustomerId+"|"+p.Dealno))).
		From("CustomerProfile").
		Cursor(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	defer csr.Close()

	results := []CustomerProfiles{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(false, nil, "No data found !")
	}

	return results
}

func (c *DataCapturingController) GetCustomerProfileDetailConfirmed(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	fmt.Println("masuk GetCustomerProfileDetail")
	p := struct {
		CustomerId string
		Dealno     string
	}{}

	k.GetPayload(&p)

	var results = CustomerProfiles{}
	err := new(DataConfirmController).GetDataConfirmed(p.CustomerId, p.Dealno, new(CustomerProfiles).TableName(), &results)
	if err != nil {
		return err
	}

	if results.StatusCibil == 0 {
		for idx, _ := range results.DetailOfPromoters.Biodata {
			results.DetailOfPromoters.Biodata[idx].CIBILScore = 0
		}
	}

	return results
}

func (c *DataCapturingController) GetCustomerProfileDetailByCustid(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := struct {
		CustomerId string
		DealNo     string
	}{}

	e := k.GetPayload(&p)
	c.WriteLog(p)
	cn, err := GetConnection()
	defer cn.Close()
	id, _ := strconv.Atoi(strings.TrimSpace(p.CustomerId))
	csr, e := cn.NewQuery().
		Where(dbox.And(dbox.Eq("applicantdetail.CustomerID", id), dbox.Eq("applicantdetail.DealNo", p.DealNo))).
		From("CustomerProfile").
		Cursor(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	customerProfile := CustomerProfiles{}
	err = csr.Fetch(&customerProfile, 1, true)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	} else if csr == nil {
		return CreateResult(false, nil, "No data found !")
	}

	csr.Close()

	csr, e = cn.NewQuery().
		Where(dbox.And(dbox.Eq("Profile.customerid", id), dbox.Eq("Profile.dealno", p.DealNo))).
		From("CibilReport").
		Cursor(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	cibilReport := []CibilReportModel{}
	err = csr.Fetch(&cibilReport, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(false, nil, "No data found !")
	}

	csr, e = cn.NewQuery().
		Where(dbox.And(dbox.Eq("Profile.customerid", id), dbox.Eq("Profile.dealno", p.DealNo))).
		From("CibilReport").
		Cursor(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	cibilReporttk := []tk.M{}
	err = csr.Fetch(&cibilReporttk, 0, false)
	if err != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(false, nil, "No data found !")
	}
	for idx := range cibilReporttk {
		detail := cibilReporttk[idx]["DetailReportSummary"]
		resjson := []DetailReportSummary{}
		tk.Serde(detail, &resjson, "json")
		cibilReport[idx].DetailReportSummary = resjson
	}

	csr.Close()

	cibilDraft := CibilDraftModel{}
	if len(cibilReport) > 1 {
		csr, e = cn.NewQuery().
			Where(dbox.And(dbox.Eq("Profile.customerid", id), dbox.Eq("Profile.dealno", p.DealNo))).
			From("CibilDraft").
			Cursor(nil)
		if e != nil {
			return CreateResult(false, nil, e.Error())
		} else if csr.Count() > 0 {
			err = csr.Fetch(&cibilDraft, 1, true)
			if err != nil {
				return CreateResult(false, nil, err.Error())
			} else if csr == nil {
				return CreateResult(false, nil, "No data found !")
			}
		}

		csr.Close()
	}

	resprom := []tk.M{}
	csr, e = cn.NewQuery().
		Where(dbox.And(dbox.Eq("ConsumerInfo.CustomerId", id), dbox.Eq("ConsumerInfo.DealNo", p.DealNo))).
		From("CibilReportPromotorFinal").
		Cursor(nil)
	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr.Count() > 0 {
		err = csr.Fetch(&resprom, 0, true)
		if err != nil {
			return CreateResult(false, nil, err.Error())
		} else if csr == nil {
			return CreateResult(false, nil, "No data found !")
		}
	}

	results := []tk.M{}
	results = append(results, tk.M{}.Set("CustomerProfile", customerProfile))
	results = append(results, tk.M{}.Set("CibilReport", cibilReport))
	results = append(results, tk.M{}.Set("CibilDraft", cibilDraft))
	results = append(results, tk.M{}.Set("Promotors", resprom))

	return results
}

func (c *DataCapturingController) SaveCustomerProfileDetail(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	Username := ""
	if k.Session("username") != nil {
		Username = k.Session("username").(string)
	}

	p := CustomerProfiles{}

	k.GetPayload(&p)

	p.LastUpdate = time.Now()
	p.UpdatedBy = Username

	if p.Status == 1 {
		custstring := cast.ToString(p.ApplicantDetail.CustomerID)
		dealstring := cast.ToString(p.ApplicantDetail.DealNo)
		_ = new(CustomerProfiles).SyncCustomerData(custstring, dealstring)

		p.ConfirmedBy = Username
		p.ConfirmedDate = time.Now()
		if err := new(DataConfirmController).SaveDataConfirmed(cast.ToString(p.ApplicantDetail.CustomerID), p.ApplicantDetail.DealNo.(string), p.TableName(), &p, true); err != nil {
			return err
		}

		UpdateUnmatchData(p)

	} else if p.Status == 2 {
		p.VerifiedBy = Username
		p.VerifiedDate = time.Now()
	}
	// fmt.Println(p.ApplicantDetail)
	// fmt.Println(p)
	e := c.Ctx.Save(&p)
	if e != nil {
		fmt.Println(e)
	}
	return p
}

func UpdateUnmatchData(c CustomerProfiles) {
	tk.Println("test")
	cn, err := GetConnection()
	defer cn.Close()

	if err != nil {
		tk.Println(err.Error())
	}

	isMatch := false
	DealNos := cast.ToString(c.ApplicantDetail.DealNo)
	CustomerIds := cast.ToInt(c.ApplicantDetail.CustomerID, "16")

	wh := []*dbox.Filter{}
	wh = append(wh, dbox.Eq("Profile.dealno", DealNos))
	wh = append(wh, dbox.Eq("Profile.customerid", CustomerIds))

	curs, err := cn.NewQuery().Select().From("CibilReport").Where(wh...).Cursor(nil)
	if err != nil {
		tk.Println(err.Error())
	}
	res := []tk.M{}

	err = curs.Fetch(&res, 0, false)
	defer curs.Close()

	if len(res) == 0 {
		filter := []*dbox.Filter{}
		filter = append(filter, dbox.Eq("UnconfirmID", ""))
		filter = append(filter, dbox.Eq("IsMatch", false))
		csr, e := cn.NewQuery().Select().From("CibilReport").Where(filter...).Cursor(nil)
		if e != nil {
			tk.Println(e.Error())
		}
		result := []CibilReportModel{}

		e = csr.Fetch(&result, 0, false)
		defer csr.Close()

		if len(result) > 0 {
			tk.Println("test2")
			setting := NewSimilaritySetting()
			setting.SplitDelimeters = []rune{' ', '.', '-'}

			for _, val := range result {
				companyname := val.Profile.CompanyName
				splittedcompname := strings.Split(companyname, " ")
				splittedcpname := strings.Split(cast.ToString(c.ApplicantDetail.CustomerName), " ")
				cuttingcompname := ""
				cuttingcpname := ""
				cppan := cast.ToString(c.ApplicantDetail.CustomerPan)
				cibilpan := val.Profile.Pan
				for _, comp := range splittedcompname {
					if comp != "PVT" && comp != "LTD" && comp != "PRIVATE" && comp != "LIMITED" {
						cuttingcompname = cuttingcompname + " " + comp
					}
				}
				for _, comp := range splittedcpname {
					if comp != "PVT" && comp != "LTD" && comp != "PRIVATE" && comp != "LIMITED" {
						cuttingcpname = cuttingcpname + " " + comp
					}
				}
				similar := Similarity(cuttingcpname, cuttingcompname, setting)

				if similar >= 50 && cppan == cibilpan {
					isMatch = true
				} else if similar >= 70 {
					isMatch = true
				}

				tk.Println(cuttingcpname, cuttingcompname, cppan, cibilpan, similar, isMatch)

				if isMatch {
					val.IsMatch = isMatch
					val.Profile.DealNo = cast.ToString(c.ApplicantDetail.DealNo)
					val.Profile.CustomerId = cast.ToInt(c.ApplicantDetail.CustomerID, "16")
					err = cn.NewQuery().From("CibilReport").Update().Exec(tk.M{}.Set("data", val))
					if err != nil {
						tk.Println(err.Error())
					}
				}

			}
		}
	}

}
