package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	"errors"
	"strings"

	"github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	"gopkg.in/mgo.v2/bson"
	// "gopkg.in/mgo.v2/bson"
	// "fmt"
	"time"
	// "github.com/eaciit/dbox"
	// . "eaciit/x10/webapps/connection"
	"bytes"
	. "eaciit/x10/webapps/models"

	"encoding/json"
	"io"

	"io/ioutil"
	"net/http"

	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	// "regexp"
)

type DealSetUpController struct {
	*BaseController
}

func (c *DealSetUpController) Default(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{
		"shared/dataaccess.html",
		"shared/filter.html",
		"shared/loading.html",
		"dealsetup/top.html",
		"dealsetup/bottom.html",
		"dealsetup/dealfilter.html",
	}

	return DataAccess
}

func FetchOmnifinXML(cid string, dealno string) ([]tk.M, error) {
	cn, err := GetConnection()
	defer cn.Close()
	results := []tk.M{}

	if err != nil {
		return results, err
	}

	filters := []*dbox.Filter{}

	filters = append(filters, dbox.Eq("dealNo", dealno))
	filters = append(filters, dbox.Eq("dealCustomerId", cast.ToInt(cid, cast.RoundingAuto)))

	csr, err := cn.NewQuery().
		Where(dbox.And(filters...)).
		From("OmnifinXML").
		Cursor(nil)
	defer csr.Close()

	if err != nil {
		return results, err
	}

	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return results, err
	}

	return results, nil
}

func (c *DealSetUpController) Accept(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}

	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	// cn, err := GetConnection()
	// defer cn.Close()

	// if err != nil {
	// 	res.SetError(err)
	// 	return res
	// }

	// filters := []*dbox.Filter{}

	cid := payload.GetString("custid")
	dealno := payload.GetString("dealno")

	if dealno == "" || cid == "" {
		res.SetError(errors.New("Parameter Invalid"))
		return res
	}

	err, cou, infos, curId, latestObj := checkDealSetup(cid, dealno)
	if err != nil {
		res.SetError(err)
		return res
	}

	//if data existbefore
	if cou > 1 {
		err = BlendDealSetup(curId, latestObj, infos)
		if err != nil {
			res.SetError(err)
			return res
		}
	}

	results, err := FetchOmnifinXML(cid, dealno)
	if err != nil {
		res.SetError(err)
		return res
	}

	contentbody := tk.M{}

	if len(results) > 0 {
		contentbody = results[len(results)-1]
	} else {
		res.SetError(errors.New("No Data Found"))
		return res
	}

	crList := []tk.M{}
	crL := contentbody.Get("crDealCustomerRoleList").([]interface{})

	for _, varL := range crL {
		crList = append(crList, varL.(tk.M))
	}

	_, _, err = GenerateCustomerProfile(contentbody, crList, cid, dealno)
	if err != nil {
		res.SetError(err)
		return res
	}

	_, _, err = GenerateAccountDetail(contentbody, crList, cid, dealno)
	if err != nil {
		res.SetError(err)
	}

	err = GenerateInternalRTR(contentbody, cid, dealno)
	if err != nil {
		res.SetError(err)
	}

	comp := FindCompany(crList, contentbody.GetString("dealCustomerId"))

	customerDtl := comp.Get("customerDtl").(tk.M)
	err = SaveMaster(cid, dealno, customerDtl.GetString("customerName"))
	if err != nil {
		res.SetError(err)
	}

	if cou > 1 {
		arr := []string{"AccountDetails", "InternalRTR", "BankAnalysisV2", "CustomerProfile", "RatioInputData", "RepaymentRecords", "StockandDebt", "CibilReport", "CibilReportPromotorFinal", "DueDiligenceInput"}
		for _, val := range arr {
			err = changeStatus(cid, dealno, val, 0, k)
			if err != nil {
				res.SetError(err)
			}
		}
		err := updateDealSetupLatestData(cid, dealno, "ds", UnderProcess, k)
		if err != nil {
			res.SetError(err)
		}
	} else {
		err = updateDealSetupLatestData(cid, dealno, "all", UnderProcess, k)
		if err != nil {
			res.SetError(err)
		}
	}

	//Get Customer
	k.SetSession("CustomerProfileData", nil)
	resroles := k.Session("roles").([]SysRolesModel)
	for _, valx := range resroles {
		new(LoginController).GetListUsersByRole(k, valx, k.Session("username").(string))
	}

	return res
}

const timeFormat = "2006-01-02T15:04:05.99Z"

//
// Enable this to debug / test changeStatus
// Access with json body such as:
// {
// 	"CustomerID": "27",
// 	"DealNo": "DLBLR00615-160000018",
// 	"Table": "DueDiligenceInput",
// 	"Status": 2
// }
//
// func (c *DealSetUpController) Test(k *knot.WebContext) interface{} {
// 	k.Config.OutputType = knot.OutputJson
// 	var load struct {
// 		CustomerID string
// 		DealNo     string
// 		Table      string
// 		Status     int
// 	}
//
// 	k.GetPayload(&load)
// 	changeStatus(load.CustomerID, load.DealNo, load.Table, load.Status)
//
// 	return "OK"
// }

func GenerateRoleCondition(k *knot.WebContext) ([]*dbox.Filter, error) {
	var dbFilter []*dbox.Filter

	if k.Session("roles") == nil {
		return dbFilter, nil
	}

	roles := k.Session("roles").([]SysRolesModel)
	userid := k.Session("userid").(string)
	for _, Role := range roles {
		var dbFilterTemp []*dbox.Filter
		if !Role.Status {
			continue
		}

		Type := Role.Roletype
		Dealvalue := Role.Dealvalue

		Dv, err := new(LoginController).GetDealValue(Dealvalue)

		if err != nil {
			return dbFilter, err
		}

		if len(Dv) > 0 {
			curDv := Dv[0]
			opr := curDv.GetString("operator")
			var1 := curDv.GetFloat64("var1")
			var2 := curDv.GetFloat64("var2")

			switch opr {
			case "lt":
				dbFilterTemp = append(dbFilterTemp, dbox.Lt("accountdetails.loandetails.proposedloanamount", var1))
			case "lte":
				dbFilterTemp = append(dbFilterTemp, dbox.Lte("accountdetails.loandetails.proposedloanamount", var1))
			case "gt":
				dbFilterTemp = append(dbFilterTemp, dbox.Gt("accountdetails.loandetails.proposedloanamount", var1))
			case "gte":
				dbFilterTemp = append(dbFilterTemp, dbox.Gte("accountdetails.loandetails.proposedloanamount", var1))
			case "between":
				dbFilterTemp = append(dbFilterTemp, dbox.And(dbox.Gte("accountdetails.loandetails.proposedloanamount", var1), dbox.Lte("accountdetails.loandetails.proposedloanamount", var2)))
			}
		}
		// tk.Printf("--------- DV %v ----------- \n", Dv)
		// tk.Printf("--------- ROLETYPE %v ----------- \n", Type)
		// tk.Printf("--------- USERID %v ----------- \n", userid)
		switch strings.ToUpper(Type) {
		case "CA":
			dbFilterTemp = append(dbFilterTemp, dbox.Eq("accountdetails.accountsetupdetails.CreditAnalystId", userid))
		case "RM":
			dbFilterTemp = append(dbFilterTemp, dbox.Eq("accountdetails.accountsetupdetails.RmNameId", userid))
		case "CUSTOM":
			all := []interface{}{}

			for _, valx := range Role.Branch {
				all = append(all, cast.ToString(valx))
			}
			if len(all) != 0 {
				dbFilterTemp = append(dbFilterTemp, dbox.In("accountdetails.accountsetupdetails.citynameid", all...))
			} else {
				dbFilterTemp = append(dbFilterTemp, dbox.Ne("_id", ""))
			}
		default:
			dbFilterTemp = append(dbFilterTemp, dbox.Ne("_id", ""))

		}
		dbFilter = append(dbFilter, dbox.And(dbFilterTemp...))
	}

	return dbFilter, nil
}

func BlendDealSetup(Id bson.ObjectId, inqueObj tk.M, infos tk.M) error {
	//delete query
	ctx, e := GetConnection()
	defer ctx.Close()

	e = ctx.NewQuery().
		Delete().
		From("DealSetup").
		Where(dbox.Eq("_id", Id)).
		Exec(nil)
	if e != nil {
		return e
	}
	tk.Println(Id, "OLD ID ===============")
	tk.Println(inqueObj.GetString("_id"), "NEW ID ===============")
	tk.Println(infos, "INFOS ===============")
	inqueObj.Set("info", infos)

	qinsert := ctx.NewQuery().
		From("DealSetup").
		SetConfig("multiexec", true).
		Save()
	defer qinsert.Close()

	insertdata := tk.M{}
	insertdata = insertdata.Set("data", inqueObj)
	e = qinsert.Exec(insertdata)
	if e != nil {
		return e
	}

	return nil
}

func changeStatus(CustomerID string, DealNo string, TableName string, Status int, k *knot.WebContext) error {

	custInt := cast.ToInt(CustomerID, cast.RoundingAuto)
	concate := CustomerID + "|" + DealNo
	curTime := time.Now()

	//delete query
	ctx, e := GetConnection()
	defer ctx.Close()

	if e != nil {
		return e
	}
	que := ctx.NewQuery().
		From(TableName).
		SetConfig("multiexec", true)

	defer que.Close()

	//save query
	qinsert := ctx.NewQuery().
		From(TableName).
		SetConfig("multiexec", true).
		Save()
	defer qinsert.Close()

	insertdata := tk.M{}

	switch TableName {
	case "AccountDetails":
		que = que.Where(dbox.Eq("_id", concate))
		me := []AccountDetail{}
		csr, e := que.Cursor(nil)
		if e != nil {
			return e
		}

		defer csr.Close()

		err := csr.Fetch(&me, 0, false)
		if err != nil {
			return err
		}

		for _, dt := range me {
			switch Status {
			case 0:
				dt.Status = 0
				dt.Freeze = false
				UpdateDealSetup(CustomerID, DealNo, "ad", UnderProcess, k)
			case 1:
				dt.Status = 1
				dt.Freeze = false
				dt.DateConfirmed = curTime
				UpdateDealSetup(CustomerID, DealNo, "ad", "Confirmed", k)
			case 2:
				dt.Status = 1
				dt.Freeze = true
				dt.DateFreeze = curTime
				UpdateDealSetup(CustomerID, DealNo, "ad", "Freeze", k)
			}

			insertdata = insertdata.Set("data", dt)
			e = qinsert.Exec(insertdata)
			if e != nil {
				return e
			}
		}

	case "InternalRTR":
		que = que.Where(dbox.Eq("_id", concate))
		me := []InternalRtr{}
		csr, e := que.Cursor(nil)
		if e != nil {
			return e
		}

		defer csr.Close()

		err := csr.Fetch(&me, 0, false)
		if err != nil {
			return err
		}

		for _, dt := range me {
			switch Status {
			case 0:
				dt.Status = 0
				dt.Isfreeze = false
				UpdateDealSetup(CustomerID, DealNo, "irtr", UnderProcess, k)
			case 1:
				dt.Status = 1
				dt.Isfreeze = false
				UpdateDealSetup(CustomerID, DealNo, "irtr", "Confirmed", k)
			case 2:
				dt.Status = 1
				dt.Isfreeze = true
				UpdateDealSetup(CustomerID, DealNo, "irtr", "Freeze", k)
			}
			insertdata = insertdata.Set("data", dt)
			e = qinsert.Exec(insertdata)
			if e != nil {
				return e
			}
		}
	case "BankAnalysisV2":
		que = que.Where(dbox.Eq("CustomerId", custInt), dbox.Eq("DealNo", DealNo))
		me := []BankAnalysisV2{}

		csr, e := que.Cursor(nil)
		if e != nil {
			return e
		}

		defer csr.Close()

		err := csr.Fetch(&me, 0, false)
		if err != nil {
			return err
		}

		for _, dt := range me {
			switch Status {
			case 0:
				dt.Status = 0
				dt.IsConfirmed = false
				dt.IsFreeze = false
				UpdateDealSetup(CustomerID, DealNo, "ba", UnderProcess, k)
			case 1:
				dt.Status = 1
				dt.IsConfirmed = true
				dt.IsFreeze = false
				dt.DateConfirmed = curTime
				UpdateDealSetup(CustomerID, DealNo, "ba", "Confirmed", k)
			case 2:
				dt.Status = 1
				dt.IsConfirmed = true
				dt.IsFreeze = true
				dt.DateFreeze = curTime
				UpdateDealSetup(CustomerID, DealNo, "ba", "Freeze", k)
			}
			insertdata = insertdata.Set("data", dt)
			e = qinsert.Exec(insertdata)
			if e != nil {
				return e
			}
		}
	case "CustomerProfile":
		que = que.Where(dbox.Eq("_id", concate))
		me := []CustomerProfiles{}
		csr, e := que.Cursor(nil)
		if e != nil {
			return e
		}

		defer csr.Close()

		err := csr.Fetch(&me, 0, false)
		if err != nil {
			return err
		}

		for _, dt := range me {
			dt.Status = Status

			// specific code for customer profile handling
			dt.DateSave = curTime.Format(timeFormat)
			dt.DateFreeze = curTime.Format(timeFormat)
			dt.ConfirmedDate = curTime
			dt.LastUpdate = curTime
			// Freeze, update verified date
			if dt.Status == 2 {
				dt.VerifiedBy = ""
				dt.VerifiedDate = curTime
			}
			// Update DealSetup
			switch dt.Status {
			case 2:
				UpdateDealSetup(CustomerID, DealNo, "ca", "Freeze", k)
			case 1:
				UpdateDealSetup(CustomerID, DealNo, "ca", "Confirmed", k)
			case 0:
				UpdateDealSetup(CustomerID, DealNo, "ca", UnderProcess, k)
			}

			insertdata = insertdata.Set("data", dt)
			e = qinsert.Exec(insertdata)
			if e != nil {
				return e
			}
		}
	case "RatioInputData":
		que = que.Where(dbox.Eq("customerid", concate))
		me := []RatioInputData{}
		csr, e := que.Cursor(nil)
		if e != nil {
			return e
		}

		defer csr.Close()

		err := csr.Fetch(&me, 0, false)
		if err != nil {
			return err
		}

		for _, dt := range me {
			switch Status {
			case 0:
				dt.Confirmed = false
				dt.IsFrozen = false
				UpdateDealSetup(CustomerID, DealNo, "bsi", UnderProcess, k)
			case 1:
				dt.Confirmed = true
				dt.IsFrozen = false
				UpdateDealSetup(CustomerID, DealNo, "bsi", "Confirmed", k)
			case 2:
				dt.Confirmed = true
				dt.IsFrozen = true
				UpdateDealSetup(CustomerID, DealNo, "bsi", "Freeze", k)
			}
			insertdata = insertdata.Set("data", dt)
			e = qinsert.Exec(insertdata)
			if e != nil {
				return e
			}

		}
	case "RepaymentRecords":
		que = que.Where(dbox.Eq("CustomerId", CustomerID), dbox.Eq("DealNo", DealNo))
		me := []RTRBottom{}
		csr, e := que.Cursor(nil)
		if e != nil {
			return e
		}

		defer csr.Close()

		err := csr.Fetch(&me, 0, false)
		if err != nil {
			return err
		}

		for _, dt := range me {

			dt.Status = Status
			dt.DateSave = curTime
			switch Status {
			case 0:
				UpdateDealSetup(CustomerID, DealNo, "ertr", UnderProcess, k)
			case 1:
				dt.DateConfirmed = curTime
				UpdateDealSetup(CustomerID, DealNo, "ertr", "Confirmed", k)
			case 2:
				dt.DateFreeze = curTime
				UpdateDealSetup(CustomerID, DealNo, "ertr", "Freeze", k)
			}

			insertdata = insertdata.Set("data", dt)
			e = qinsert.Exec(insertdata)
			if e != nil {
				return e
			}
		}
	case "StockandDebt":
		que = que.Where(dbox.Eq("customerid", concate))
		me := []StockandDebtModel{}
		csr, e := que.Cursor(nil)
		if e != nil {
			return e
		}

		defer csr.Close()

		err := csr.Fetch(&me, 0, false)
		if err != nil {
			return err
		}

		for _, dt := range me {
			switch Status {
			case 0:
				dt.IsConfirm = false
				dt.IsFreeze = false
				UpdateDealSetup(CustomerID, DealNo, "sbd", UnderProcess, k)
			case 1:
				dt.IsConfirm = true
				dt.IsFreeze = false
				UpdateDealSetup(CustomerID, DealNo, "sbd", "Confirmed", k)
			case 2:
				dt.IsConfirm = true
				dt.IsFreeze = true
				UpdateDealSetup(CustomerID, DealNo, "sbd", "Freeze", k)
			}
			insertdata = insertdata.Set("data", dt)
			e = qinsert.Exec(insertdata)
			if e != nil {
				return e
			}
		}
	case "CibilReport":
		que = que.Where(dbox.Eq("Profile.customerid", custInt), dbox.Eq("Profile.dealno", DealNo))
		me := []CibilReportModel{}
		csr, e := que.Cursor(nil)
		if e != nil {
			return e
		}

		defer csr.Close()

		err := csr.Fetch(&me, 0, false)
		if err != nil {
			return err
		}

		for _, dt := range me {

			// status is not saved in status
			// but in isconfirm and IsFreeze
			switch Status {
			case 0:
				dt.IsConfirm = 0
				dt.IsFreeze = false
				UpdateDealSetup(CustomerID, DealNo, "cibil", UnderProcess, k)
			case 1:
				dt.IsConfirm = 1
				dt.IsFreeze = false
				UpdateDealSetup(CustomerID, DealNo, "cibil", "Confirmed", k)
			case 2:
				dt.IsConfirm = 1
				dt.IsFreeze = true
				UpdateDealSetup(CustomerID, DealNo, "cibil", "Freeze", k)
			}

			dt.Status = Status

			insertdata = insertdata.Set("data", dt)
			e = qinsert.Exec(insertdata)
			if e != nil {
				return e
			}
		}
	case "CibilReportPromotorFinal":
		que = que.Where(dbox.Eq("ConsumerInfo.CustomerId", custInt), dbox.Eq("ConsumerInfo.DealNo", DealNo))
		me := []ReportData{}
		csr, e := que.Cursor(nil)
		if e != nil {
			return e
		}

		defer csr.Close()

		err := csr.Fetch(&me, 0, false)
		if err != nil {
			return err
		}

		for _, dt := range me {
			// Status cibil is not freezed
			// Ignore on freezed
			switch Status {
			case 0:
				dt.StatusCibil = 0
			case 1:
				dt.StatusCibil = 1
			case 2:
				dt.StatusCibil = 1
			}
			insertdata = insertdata.Set("data", dt)
			e = qinsert.Exec(insertdata)
			if e != nil {
				return e
			}
		}
	case "DueDiligenceInput":
		que = que.Where(dbox.Eq("_id", concate))
		me := []DueDiligenceInput{}
		csr, e := que.Cursor(nil)
		if e != nil {
			return e
		}

		defer csr.Close()

		err := csr.Fetch(&me, 0, false)
		if err != nil {
			return err
		}

		for _, dt := range me {
			dt.DateSave = curTime
			switch Status {
			case 0:
				dt.Status = 0
				dt.Freeze = false
				UpdateDealSetup(CustomerID, DealNo, "dd", UnderProcess, k)
			case 1:
				dt.Status = 1
				dt.Freeze = false
				dt.LastConfirmed = curTime
				UpdateDealSetup(CustomerID, DealNo, "dd", "Confirmed", k)
			case 2:
				dt.Status = 1
				dt.Freeze = true
				dt.DateFreeze = curTime
				UpdateDealSetup(CustomerID, DealNo, "dd", "Freeze", k)
			}
			insertdata = insertdata.Set("data", dt)
			e = qinsert.Exec(insertdata)
			if e != nil {
				return e
			}
		}
	default:
		return errors.New("Table Name Not Registered")
	}

	return nil
}

func SendJSONtoOmnifin(custid string, dealno string) error {
	res := tk.M{}
	c := ReadConfig()
	dataLog := tk.M{}

	usercred := tk.M{}.Set("userId", c["userOmnifin"]).Set("userPassword", c["passOmnifin"])
	res.Set("userCredentials", usercred)

	results, err := FetchOmnifinXML(custid, dealno)
	if err != nil {
		return err
	}

	if len(results) == 0 {
		return errors.New("Error, Omnifin data not found")
	}

	OmXML := results[len(results)-1]

	procdetail := tk.M{}
	procdetail.Set("dealId", cast.ToString(OmXML.GetInt("dealId")))
	procdetail.Set("approvalStatus", "X")
	procdetail.Set("approvalRemark", "Send back from CAT stage")
	res.Set("processedDealDetails", procdetail)

	tk.Printfn(" ----- SEND TO OMNIFIN ------ %v ------", res)
	id := custid + "|" + dealno
	dataLog.Set("dataSent", res)
	dataLog.Set("createdDate", time.Now())
	dataLog.Set("_id", id+cast.ToString(dataLog.Get("createdDate")))

	resp, err := doSendBackRequest("http://103.251.60.132:8085/OmniFinServices/restServices/applicationProcessing/processedDeal/submit", res)
	dataLog.Set("dataReceived", resp)
	CreateLogSendBack(dataLog)

	if err != nil {
		dataLog.Set("error", err.Error())
		CreateLogSendBack(dataLog)
		return err
	}
	defer resp.Close()

	jsonResp, err := ioutil.ReadAll(resp)
	if err != nil {
		dataLog.Set("error", err.Error())
		CreateLogSendBack(dataLog)
		return err
	}

	data := tk.M{}
	err = json.Unmarshal(jsonResp, &data)
	dataLog.Set("dataReceived", data)
	CreateLogSendBack(dataLog)

	if err != nil {
		dataLog.Set("error", err.Error())
		CreateLogSendBack(dataLog)
		return err
	}

	tk.Printfn(" ----- RESPOND FROM OMNIFIN ------ %v ------", data)

	if data.GetString("operationStatus") == "0" {
		return errors.New("Failed to Send Back - " + data.GetString("operationMessage"))
	}

	return nil
}

func doSendBackRequest(url string, body tk.M) (io.ReadCloser, error) {
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(body)

	resp, err := http.Post(url, "application/json", buf)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("Response is not HTTP 200 OK")
	}

	return resp.Body, nil
}

func (c *DealSetUpController) SendBack(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)

	payload := tk.M{}

	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	cid := payload.GetString("custid")
	dealno := payload.GetString("dealno")

	// err, _, _ := checkDealSetup(cid, dealno)
	// if err != nil {
	// 	message := strings.Replace(err.Error(), "Accept", "Send Back", -1)
	// 	res.SetError(errors.New(message))
	// 	return res
	// }

	err := SendJSONtoOmnifin(cid, dealno)
	if err != nil {
		res.SetError(err)
		return res
	}

	err = updateDealSetupLatestData(cid, dealno, "ds", SendBackOmnifin, k)
	if err != nil {
		res.SetError(err)
		return res
	}

	return res
}

func CreateLogSendBack(LogData tk.M) error {
	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		tk.Println(err.Error())
		return err
	}

	qinsert := conn.NewQuery().
		From("OmnifinSendBackLog").
		SetConfig("multiexec", true).
		Save()

	csc := map[string]interface{}{"data": LogData}
	err = qinsert.Exec(csc)
	if err != nil {
		tk.Println(err.Error())
		return err
	}

	if LogData.Get("error") != nil {
		// SendMail(LogData.GetString("error"), LogData.GetString("_id"))
	}

	return nil
}

func (c *DealSetUpController) CheckData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	res := new(tk.Result)
	payload := tk.M{}

	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	cid := payload.GetString("custid")
	dealno := payload.GetString("dealno")

	err, cou, _, _, _ := checkDealSetup(cid, dealno)

	if err != nil && !strings.Contains(err.Error(), "Accept") {
		res.SetError(err)
		return res
	}

	res.SetData(tk.M{"count": cou})

	return res
}

func checkDealSetup(cid string, dealno string) (error, int, tk.M, bson.ObjectId, tk.M) {
	cn, err := GetConnection()
	defer cn.Close()

	id := bson.NewObjectId()

	if err != nil {
		return err, 0, tk.M{}, id, tk.M{}
	}

	csr, e := cn.NewQuery().
		Where(dbox.Eq("customerprofile._id", cid+"|"+dealno)).
		From("DealSetup").
		Cursor(nil)
	defer csr.Close()

	if e != nil {
		return e, 0, tk.M{}, id, tk.M{}
	}

	result := []tk.M{}
	err = csr.Fetch(&result, 0, false)
	if err != nil {
		return err, 0, tk.M{}, id, tk.M{}
	}

	if len(result) > 1 {
		latest := result[len(result)-2]
		inque := result[len(result)-1]
		infos := latest.Get("info").(tk.M)
		// myInfo := infos.Get("myInfo").([]interface{})
		// latestinfo := myInfo[len(myInfo)-1].(tk.M).GetString("status")
		// if latestinfo == Approve || latestinfo == Reject || latestinfo == Cancel {
		return nil, len(result), infos, latest.Get("_id").(bson.ObjectId), inque
		// }
	}
	return nil, len(result), tk.M{}, id, tk.M{}
}

func updateDealSetupLatestData(cid string, dealno string, formname string, formstatus string, r *knot.WebContext) error {

	cn, err := GetConnection()
	defer cn.Close()

	if err != nil {
		return err
	}

	csr, e := cn.NewQuery().
		Where(dbox.Eq("customerprofile._id", cid+"|"+dealno)).
		From("DealSetup").
		Cursor(nil)
	defer csr.Close()

	if e != nil {
		return err
	}

	results := []tk.M{}
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return err
	}

	if len(results) == 0 {
		return errors.New("Data Deal Set-up not found")
	}

	result := results[len(results)-1]

	infos := result.Get("info").(tk.M)

	switch formname {
	case "ds":
		myInfos := CheckArraytkM(infos.Get("myInfo"))
		myInfos = append(myInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("myInfo", myInfos)
	case "ca":
		caInfos := CheckArraytkM(infos.Get("caInfo"))
		caInfos = append(caInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("caInfo", caInfos)
	case "cibil":
		cibilInfos := CheckArraytkM(infos.Get("cibilInfo"))
		cibilInfos = append(cibilInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("cibilInfo", cibilInfos)
	case "bsi":
		bsiInfos := CheckArraytkM(infos.Get("bsiInfo"))
		bsiInfos = append(bsiInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("bsiInfo", bsiInfos)
	case "sbd":
		sbdInfos := CheckArraytkM(infos.Get("sbdInfo"))
		sbdInfos = append(sbdInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("sbdInfo", sbdInfos)
	case "ad":
		adInfos := CheckArraytkM(infos.Get("adInfo"))
		adInfos = append(adInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("adInfo", adInfos)
	case "ba":
		baInfos := CheckArraytkM(infos.Get("baInfo"))
		baInfos = append(baInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("baInfo", baInfos)
	case "ertr":
		ertrInfos := CheckArraytkM(infos.Get("ertrInfo"))
		ertrInfos = append(ertrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("ertrInfo", ertrInfos)
	case "irtr":
		irtrInfos := CheckArraytkM(infos.Get("irtrInfo"))
		irtrInfos = append(irtrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("irtrInfo", irtrInfos)
	case "dd":
		ddInfos := CheckArraytkM(infos.Get("ddInfo"))
		ddInfos = append(ddInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("ddInfo", ddInfos)
	case "dcf":
		dcfInfos := CheckArraytkM(infos.Get("dcfInfo"))
		dcfInfos = append(dcfInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("dcfInfo", dcfInfos)
	case "cac":
		cacInfos := CheckArraytkM(infos.Get("cacInfo"))
		cacInfos = append(cacInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("cacInfo", cacInfos)
	case "all":
		myInfos := CheckArraytkM(infos.Get("myInfo"))
		myInfos = append(myInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("myInfo", myInfos)
		caInfos := CheckArraytkM(infos.Get("caInfo"))
		caInfos = append(caInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("caInfo", caInfos)

		cibilInfos := CheckArraytkM(infos.Get("cibilInfo"))
		cibilInfos = append(cibilInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("cibilInfo", cibilInfos)

		bsiInfos := CheckArraytkM(infos.Get("bsiInfo"))
		bsiInfos = append(bsiInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("bsiInfo", bsiInfos)

		sbdInfos := CheckArraytkM(infos.Get("sbdInfo"))
		sbdInfos = append(sbdInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("sbdInfo", sbdInfos)

		adInfos := CheckArraytkM(infos.Get("adInfo"))
		adInfos = append(adInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("adInfo", adInfos)

		baInfos := CheckArraytkM(infos.Get("baInfo"))
		baInfos = append(baInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("baInfo", baInfos)

		ertrInfos := CheckArraytkM(infos.Get("ertrInfo"))
		ertrInfos = append(ertrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("ertrInfo", ertrInfos)

		irtrInfos := CheckArraytkM(infos.Get("irtrInfo"))
		irtrInfos = append(irtrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("irtrInfo", irtrInfos)

		ddInfos := CheckArraytkM(infos.Get("ddInfo"))
		ddInfos = append(ddInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("ddInfo", ddInfos)

		dcfInfos := CheckArraytkM(infos.Get("dcfInfo"))
		dcfInfos = append(dcfInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("dcfInfo", dcfInfos)

		cacInfos := CheckArraytkM(infos.Get("cacInfo"))
		cacInfos = append(cacInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("cacInfo", cacInfos)
	}

	result.Set("info", infos)

	qinsert := cn.NewQuery().
		From("DealSetup").
		SetConfig("multiexec", true).
		Save()

	csc := map[string]interface{}{"data": result}
	err = qinsert.Exec(csc)
	if err != nil {
		return err
	}

	return nil

}

var ErrorDataNotFound = errors.New("Data Deal Set-up Not Found")

func UpdateDealSetup(cid string, dealno string, formname string, formstatus string, r *knot.WebContext) error {
	cn, err := GetConnection()
	defer cn.Close()

	if err != nil {
		return err
	}

	csr, e := cn.NewQuery().
		Where(dbox.Eq("customerprofile._id", cid+"|"+dealno)).
		From("DealSetup").
		Cursor(nil)
	if e != nil {
		return err
	}
	defer csr.Close()

	results := []tk.M{}
	err = csr.Fetch(&results, 0, true)
	if err != nil {
		return err
	}

	found := false
	var result tk.M

	// find the last one where status is not In queue
	for _, val := range results {
		infos := val.Get("info").(tk.M)
		myInfos := CheckArraytkM(infos.Get("myInfo"))
		if len(myInfos) == 0 {
			continue
		}

		status := myInfos[len(myInfos)-1].GetString("status")
		if status == Inque || status == SendBackOmnifin {
			continue
		}

		found = true
		result = val
	}

	if !found {
		return ErrorDataNotFound
	}

	infos := result.Get("info").(tk.M)

	switch formname {
	case "ds":
		myInfos := CheckArraytkM(infos.Get("myInfo"))
		myInfos = append(myInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("myInfo", myInfos)
	case "ca":
		caInfos := CheckArraytkM(infos.Get("caInfo"))
		caInfos = append(caInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("caInfo", caInfos)
	case "cibil":
		cibilInfos := CheckArraytkM(infos.Get("cibilInfo"))
		cibilInfos = append(cibilInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("cibilInfo", cibilInfos)
	case "bsi":
		bsiInfos := CheckArraytkM(infos.Get("bsiInfo"))
		bsiInfos = append(bsiInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("bsiInfo", bsiInfos)
	case "sbd":
		sbdInfos := CheckArraytkM(infos.Get("sbdInfo"))
		sbdInfos = append(sbdInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("sbdInfo", sbdInfos)
	case "ad":
		adInfos := CheckArraytkM(infos.Get("adInfo"))
		adInfos = append(adInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("adInfo", adInfos)
	case "ba":
		baInfos := CheckArraytkM(infos.Get("baInfo"))
		baInfos = append(baInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("baInfo", baInfos)
	case "ertr":
		ertrInfos := CheckArraytkM(infos.Get("ertrInfo"))
		ertrInfos = append(ertrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("ertrInfo", ertrInfos)
	case "irtr":
		irtrInfos := CheckArraytkM(infos.Get("irtrInfo"))
		irtrInfos = append(irtrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("irtrInfo", irtrInfos)
	case "dd":
		ddInfos := CheckArraytkM(infos.Get("ddInfo"))
		ddInfos = append(ddInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("ddInfo", ddInfos)
	case "dcf":
		dcfInfos := CheckArraytkM(infos.Get("dcfInfo"))
		dcfInfos = append(dcfInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("dcfInfo", dcfInfos)
	case "cac":
		cacInfos := CheckArraytkM(infos.Get("cacInfo"))
		cacInfos = append(cacInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("cacInfo", cacInfos)
	case "all":
		myInfos := CheckArraytkM(infos.Get("myInfo"))
		myInfos = append(myInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("myInfo", myInfos)
		caInfos := CheckArraytkM(infos.Get("caInfo"))
		caInfos = append(caInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("caInfo", caInfos)

		cibilInfos := CheckArraytkM(infos.Get("cibilInfo"))
		cibilInfos = append(cibilInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("cibilInfo", cibilInfos)

		bsiInfos := CheckArraytkM(infos.Get("bsiInfo"))
		bsiInfos = append(bsiInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("bsiInfo", bsiInfos)

		sbdInfos := CheckArraytkM(infos.Get("sbdInfo"))
		sbdInfos = append(sbdInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("sbdInfo", sbdInfos)

		adInfos := CheckArraytkM(infos.Get("adInfo"))
		adInfos = append(adInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("adInfo", adInfos)

		baInfos := CheckArraytkM(infos.Get("baInfo"))
		baInfos = append(baInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("baInfo", baInfos)

		ertrInfos := CheckArraytkM(infos.Get("ertrInfo"))
		ertrInfos = append(ertrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("ertrInfo", ertrInfos)

		irtrInfos := CheckArraytkM(infos.Get("irtrInfo"))
		irtrInfos = append(irtrInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("irtrInfo", irtrInfos)

		ddInfos := CheckArraytkM(infos.Get("ddInfo"))
		ddInfos = append(ddInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("ddInfo", ddInfos)

		dcfInfos := CheckArraytkM(infos.Get("dcfInfo"))
		dcfInfos = append(dcfInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("dcfInfo", dcfInfos)

		cacInfos := CheckArraytkM(infos.Get("cacInfo"))
		cacInfos = append(cacInfos, tk.M{}.Set("updateTime", time.Now()).Set("status", formstatus).Set("updateBy", r.Session("username")))
		infos.Set("cacInfo", cacInfos)
	}

	result.Set("info", infos)

	qinsert := cn.NewQuery().
		From("DealSetup").
		SetConfig("multiexec", true).
		Save()

	csc := map[string]interface{}{"data": result}
	err = qinsert.Exec(csc)
	if err != nil {
		return err
	}

	return nil

}
func (c *DealSetUpController) GetAllDataDealSetup(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	type xsorting struct {
		Field string
		Dir   string
	}

	p := struct {
		Skip               int
		Take               int
		Sort               []xsorting `omitempty`
		SearchCustomerName string
		SearchDealNo       string
		Id                 string
	}{}

	e := k.GetPayload(&p)

	if e != nil {
		c.WriteLog(e)
	}

	cn, err := GetConnection()
	defer cn.Close()

	if err != nil {
		return err.Error()
	}

	keys := []*dbox.Filter{}
	if p.SearchCustomerName != "" {
		keys = append(keys, dbox.Contains("customerprofile.applicantdetail.CustomerName", p.SearchCustomerName))
	}

	if p.SearchDealNo != "" {
		keys = append(keys, dbox.Contains("customerprofile.applicantdetail.DealNo", p.SearchDealNo))
	}

	if p.Id != "" {
		keys = append(keys, dbox.Eq("customerprofile._id", p.Id))
	}

	//Restrict Base On Role
	// if k.Session("CustomerProfileData") != nil {
	// 	list := k.Session("CustomerProfileData").([]tk.M)
	// 	keyx := []*dbox.Filter{}
	// 	for _, valx := range list {
	// 		keyx = append(keyx, dbox.Eq("customerprofile._id", valx.GetString("_id")))
	// 	}
	// 	keys = append(keys, dbox.Or(keyx...))
	// }

	//RESTRICT ACCESS
	dbf, err := GenerateRoleCondition(k)
	if err != nil {
		return err.Error()
	}

	keys = append(keys, dbox.Or(dbf...))

	query1 := cn.NewQuery().
		From("DealSetup")

	if p.Skip > 0 {
		query1 = query1.Skip(p.Skip)
	}

	if p.Take > 0 {
		query1 = query1.Take(p.Take)
	}

	if len(keys) > 0 {
		query1 = query1.Where(dbox.And(keys...))
	}

	if len(p.Sort) > 0 {
		var arrsort []string
		for _, val := range p.Sort {
			if val.Dir == "desc" {
				arrsort = append(arrsort, strings.ToLower("-"+p.Sort[0].Field))
			} else {
				arrsort = append(arrsort, strings.ToLower(p.Sort[0].Field))
			}
		}
		query1 = query1.Order(arrsort...)
	}

	csr, e := query1.Cursor(nil)

	if e != nil {
		return e.Error()
	}
	defer csr.Close()

	results1 := make([]DealSetupModel, 0)
	e = csr.Fetch(&results1, 0, false)
	// c.WriteLog(results1)
	if e != nil {
		return e.Error()
	}
	// results2 := results1

	query := tk.M{}.Set("AGGR", "$sum")
	query.Set("Where", dbox.And(keys...))
	csr, err = cn.NewQuery().
		From("DealSetup").
		Where(dbox.And(keys...)).
		Cursor(nil)
	defer csr.Close()
	if err != nil {
		return err.Error()
	}

	data := struct {
		Data  []DealSetupModel
		Total int
	}{
		Data:  results1,
		Total: csr.Count(),
	}

	return data

}

func (c *DealSetUpController) GetSelectedDataDealSetup(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	payload := tk.M{}

	err := k.GetPayload(&payload)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	res := make([]DealSetupModel, 0)
	query := tk.M{"where": dbox.Eq("_id", bson.ObjectIdHex(payload["Id"].(string)))}
	csr, err := c.Ctx.Find(new(DealSetupModel), query)
	defer csr.Close()
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	err = csr.Fetch(&res, 0, false)
	if err != nil {
		return c.SetResultInfo(true, err.Error(), nil)
	}

	return c.SetResultInfo(false, "success", res)
}
