package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	"fmt"
	"os"
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
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"shared/filter.html",
		"datacapturing/detailforapplicant.html",
		"datacapturing/financialinformation.html",
		"datacapturing/nonrefundableprocessingfeesdetails.html",
		"datacapturing/detailsofpromotersdirectorsguarantors.html",
		"shared/loading.html",
	}

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
		return CreateResult(false, nil, err.Error())
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

	csr, e = cn.NewQuery().
		Where(dbox.And(dbox.Eq("customerid", p.CustomerId), dbox.Eq("dealno", p.DealNo))).
		From("AccountDetails").
		Cursor(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	} else if csr == nil {
		return CreateResult(true, nil, "")
	}

	AD := AccountDetail{}
	err = csr.Fetch(&AD, 1, true)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	} else if csr == nil {
		return CreateResult(false, nil, "No data found !")
	}

	defer csr.Close()

	loginDate := AD.AccountSetupDetails.LoginDate
	expdate := loginDate.AddDate(0, 2, 0)

	csr, e = cn.NewQuery().
		Where(
			dbox.And(dbox.Eq("Profile.customerid", id),
				dbox.Eq("Profile.dealno", p.DealNo),
				dbox.Lte("CreatedDate", expdate),
				dbox.Lte("ReportDate", expdate),
			),
		).
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
		return CreateResult(false, nil, err.Error())
	} else if csr == nil {
		return CreateResult(false, nil, "No data found !")
	}

	csr, e = cn.NewQuery().
		Where(
			dbox.And(
				dbox.Eq("Profile.customerid", id),
				dbox.Eq("Profile.dealno", p.DealNo),
				dbox.Lte("CreatedDate", expdate),
				dbox.Lte("ReportDate", expdate),
			),
		).
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
		Where(
			dbox.And(
				dbox.Eq("ConsumerInfo.CustomerId", id),
				dbox.Eq("ConsumerInfo.DealNo", p.DealNo),
				dbox.Lte("CreatedDate", expdate),
				dbox.Lte("DateOfReport", expdate),
			),
		).
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

	//get unconfirmId
	csr, e = cn.NewQuery().
		Where(
			dbox.And(
				dbox.Eq("UnconfirmID", p.CustomerId+"_"+p.DealNo),
				dbox.Lte("CreatedDate", expdate),
				dbox.Lte("ReportDate", expdate),
			),
		).
		From("CibilReport").
		Cursor(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	}

	cbUnconfirm := []tk.M{}
	e = csr.Fetch(&cbUnconfirm, 0, false)
	if e != nil {
		return CreateResult(false, nil, e.Error())
	}

	//get unconfirmId
	csr, e = cn.NewQuery().
		Where(
			dbox.And(
				dbox.Eq("UnconfirmID", p.CustomerId+"_"+p.DealNo),
				dbox.Lte("CreatedDate", expdate),
				dbox.Lte("DateOfReport", expdate),
			),
		).
		From("CibilReportPromotorFinal").
		Cursor(nil)

	if e != nil {
		return CreateResult(false, nil, e.Error())
	}

	promUnconfirm := []tk.M{}
	e = csr.Fetch(&promUnconfirm, 0, false)
	if e != nil {
		return CreateResult(false, nil, e.Error())
	}

	results := []tk.M{}
	results = append(results, tk.M{}.Set("CustomerProfile", customerProfile))
	results = append(results, tk.M{}.Set("CibilReport", cibilReport))
	results = append(results, tk.M{}.Set("CibilDraft", cibilDraft))
	results = append(results, tk.M{}.Set("Promotors", resprom))
	results = append(results, tk.M{}.Set("PromotorsUnconfirm", promUnconfirm))
	results = append(results, tk.M{}.Set("CibilReportUnconfirm", cbUnconfirm))

	return results
}

func (c *DataCapturingController) ReCreateCibil(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	p := struct {
		CustomerId string
		DealNo     string
	}{}

	err := k.GetPayload(&p)

	if err != nil {
		res.SetError(err)
		return res
	}

	cn, err := GetConnection()
	defer cn.Close()

	//get unconfirmId
	csr, err := cn.NewQuery().
		Where(dbox.And(dbox.Eq("UnconfirmID", p.CustomerId+"_"+p.DealNo))).
		From("CibilReport").
		Cursor(nil)

	if err != nil {
		res.SetError(err)
		return res
	}

	cibilModel := []CibilReportModel{}
	err = csr.Fetch(&cibilModel, 0, false)
	if err != nil {
		res.SetError(err)
		return res
	}

	qinsert := cn.NewQuery().
		From("CibilReport").
		SetConfig("multiexec", true).
		Save()
	defer qinsert.Close()

	qinsertprom := cn.NewQuery().
		From("CibilReportPromotorFinal").
		SetConfig("multiexec", true).
		Save()
	defer qinsert.Close()

	for _, val := range cibilModel {
		val.Profile.DealNo = p.DealNo
		val.Profile.CustomerId = cast.ToInt(p.CustomerId, cast.RoundingAuto)
		val.UnconfirmID = ""
		val.IsMatch = true

		insertdata := tk.M{}.Set("data", val)
		err = qinsert.Exec(insertdata)
		if err != nil {
			return res.SetError(err)
		}
	}

	//get unconfirmId
	csr, err = cn.NewQuery().
		Where(dbox.And(dbox.Eq("UnconfirmID", p.CustomerId+"_"+p.DealNo))).
		From("CibilReportPromotorFinal").
		Cursor(nil)

	if err != nil {
		res.SetError(err)
		return res
	}

	cibilIndividual := []ReportData{}
	err = csr.Fetch(&cibilIndividual, 0, false)
	if err != nil {
		res.SetError(err)
		return res
	}

	for _, curr := range cibilIndividual {
		wh := []*dbox.Filter{}
		wh = append(wh, dbox.Eq("ConsumerInfo.DealNo", p.DealNo), dbox.Or(dbox.Eq("IncomeTaxIdNumber", curr.IncomeTaxIdNumber), dbox.Eq("ConsumerInfo.ConsumerName", curr.ConsumersInfos.ConsumerName)))

		err = cn.NewQuery().
			From("CibilReportPromotorFinal").
			Delete().
			Where(wh...).
			Exec(nil)
		if err != nil {
			res.SetError(err)
			return res
		}

		curr.ConsumersInfos.DealNo = p.DealNo
		curr.ConsumersInfos.CustomerId = cast.ToInt(p.CustomerId, cast.RoundingAuto)
		curr.UnconfirmID = ""
		curr.IsMatch = true
		insertdata := tk.M{}.Set("data", curr)
		err = qinsertprom.Exec(insertdata)
		if err != nil {
			return res.SetError(err)
		}

	}

	wh := []*dbox.Filter{}
	wh = append(wh, dbox.Eq("UnconfirmID", p.CustomerId+"_"+p.DealNo))

	err = cn.NewQuery().
		From("CibilReportPromotorFinal").
		Delete().
		Where(wh...).
		Exec(nil)
	if err != nil {
		res.SetError(err)
		return res
	}
	return res
}

func (c *DataCapturingController) SaveCustomerProfileDetail(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	Username := ""
	if k.Session("username") != nil {
		Username = k.Session("username").(string)
	}

	p := CustomerProfiles{}

	err := k.GetPayload(&p)

	c.WriteLog(err)
	c.WriteLog(p)

	if err != nil {
		return p
	}

	p.LastUpdate = time.Now()
	p.UpdatedBy = Username

	p.ApplicantDetail.AnnualTurnOver = cast.ToF64(p.ApplicantDetail.AnnualTurnOver, 2, cast.RoundingAuto)

	custstring := cast.ToString(p.ApplicantDetail.CustomerID)
	dealstring := cast.ToString(p.ApplicantDetail.DealNo)
	// p.Status
	// 0 - Save / Re-enter
	// 1 - Confirm / Unfreeze
	// 2 - Freeze
	switch p.Status {
	case 1:
		new(CustomerProfiles).SyncCustomerData(custstring, dealstring)

		p.ConfirmedBy = Username
		p.ConfirmedDate = time.Now()
		if err := new(DataConfirmController).SaveDataConfirmed(custstring, dealstring, p.TableName(), &p, true); err != nil {
			return err
		}

		UpdateUnmatchData(p)
	case 2:
		p.VerifiedBy = Username
		p.VerifiedDate = time.Now()
	}
	// fmt.Println(p.ApplicantDetail)
	// fmt.Println(p)
	e := c.Ctx.Save(&p)
	if e != nil {
		fmt.Println(e)
	}

	// Update DealSetup Status
	statusmap := []string{
		"Under Process",
		"Confirmed",
		"Freeze",
	}
	UpdateDealSetup(custstring, dealstring, "ca", statusmap[p.Status], k)

	return p
}

func UpdateUnmatchData(c CustomerProfiles) {
	// tk.Println("test")
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
			// tk.Println("test2")
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

				// tk.Println(cuttingcpname, cuttingcompname, cppan, cibilpan, similar, isMatch)

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

func (c *DataCapturingController) SaveUploadFile(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	DirLocation := c.UploadPath + "/"

	fileType := k.Request.FormValue("filetype")
	newName := k.Request.FormValue("filenamephoto") + "." + fileType
	c.WriteLog(newName)
	os.RemoveAll(DirLocation + newName)

	erro, _ := UploadHandler(k, "fileUpload", DirLocation, newName)

	sourcefile := DirLocation + newName
	destinationfile := DirLocation + newName
	ResizeImg(220, 320, sourcefile, destinationfile)

	if erro != nil {
		return CreateResult(false, nil, "No Images")
	}

	return CreateResult(true, newName, "Success")
}
