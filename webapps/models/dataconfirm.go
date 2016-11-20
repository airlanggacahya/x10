package models

import (
	. "eaciit/x10/webapps/connection"
	// . "eaciit/x10/webapps/models"
	"errors"
	"github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	"github.com/eaciit/toolkit"
	"reflect"
)

type DataConfirmController struct {
	// *BaseController
}

func (a *DataConfirmController) SaveDataConfirmed(CustomerID string, DealNo string, TableName string, Data interface{}, DeleteFirst bool) error {

	custInt := cast.ToInt(CustomerID, cast.RoundingAuto)
	concate := CustomerID + "|" + DealNo

	//delete query
	ctx, e := GetConnection()
	if e != nil {
		return e
	}
	que := ctx.NewQuery().
		Delete().
		From(TableName+"Confirmed").
		SetConfig("multiexec", true)

	defer ctx.Close()
	defer que.Close()

	//save query
	qinsert := ctx.NewQuery().
		From(TableName+"Confirmed").
		SetConfig("multiexec", true).
		Insert()
	defer qinsert.Close()

	insertdata := toolkit.M{}

	switch TableName {
	case "AccountDetails":
		que = que.Where(dbox.Eq("_id", concate))
		data := Data.(*AccountDetail)
		insertdata = insertdata.Set("data", data)
	case "BankAnalysisV2":
		que = que.Where(dbox.Eq("CustomerId", custInt), dbox.Eq("DealNo", DealNo))
		data := Data.(*BankAnalysisV2)
		insertdata = insertdata.Set("data", data)
	case "CustomerProfile":
		que = que.Where(dbox.Eq("_id", concate))
		data := Data.(*CustomerProfiles)
		insertdata = insertdata.Set("data", data)
	case "RatioInputData":
		que = que.Where(dbox.Eq("customerid", concate))
		data := Data.(*RatioInputData)
		insertdata = insertdata.Set("data", data)
	case "RepaymentRecords":
		que = que.Where(dbox.Eq("CustomerId", CustomerID), dbox.Eq("DealNo", DealNo))
		data := Data.(*RTRBottom)
		insertdata = insertdata.Set("data", data)
	case "StockandDebt":
		que = que.Where(dbox.Eq("customerid", concate))
		data := Data.(*StockandDebtModel)
		insertdata = insertdata.Set("data", data)
	case "CibilReport":
		que = que.Where(dbox.Eq("Profile.customerid", custInt), dbox.Eq("Profile.dealno", DealNo))
		data := Data.(*CibilReportModel)
		insertdata = insertdata.Set("data", data)
	case "CibilReportPromotorFinal":
		que = que.Where(dbox.Eq("ConsumerInfo.CustomerId", custInt), dbox.Eq("ConsumerInfo.DealNo", DealNo))
		data := Data.(*ReportData)
		insertdata = insertdata.Set("data", data)
	case "DueDiligenceInput":
		que = que.Where(dbox.Eq("_id", concate))
		data := Data.(*DueDiligenceInput)
		insertdata = insertdata.Set("data", data)
	default:
		return errors.New("Table Name Not Registered")
	}

	if DeleteFirst {
		e = que.Exec(nil)
		if e != nil {
			return e
		}
	}

	e = qinsert.Exec(insertdata)
	if e != nil {
		return e
	}

	return nil
}

func (a *DataConfirmController) GetDataConfirmed(CustomerID string, DealNo string, TableName string, m interface{}) error {
	var coll string
	custInt := cast.ToInt(CustomerID, cast.RoundingAuto)
	concate := CustomerID + "|" + DealNo

	//delete query
	ctx, e := GetConnection()
	if e != nil {
		return e
	}
	que := ctx.NewQuery().
		Select().
		From(TableName + "Confirmed")

	defer ctx.Close()
	defer que.Close()

	var v reflect.Type
	if reflect.ValueOf(m).Elem().Kind() != reflect.Slice {
		v = reflect.TypeOf(m).Elem()
	} else {
		v = reflect.TypeOf(m).Elem().Elem()
	}

	ivs := reflect.MakeSlice(reflect.SliceOf(v), 0, 0)

	switch TableName {
	case "AccountDetails":
		que = que.Where(dbox.Eq("_id", concate))
		coll = "Account Details Not Confirmed"
	case "BankAnalysisV2":
		que = que.Where(dbox.Eq("CustomerId", custInt), dbox.Eq("DealNo", DealNo))
		coll = "Bank Analysis Not Confirmed"
	case "CustomerProfile":
		que = que.Where(dbox.Eq("_id", concate))
		coll = "Customer Profile Not Confirmed"
	case "RatioInputData":
		que = que.Where(dbox.Eq("customerid", concate))
		coll = "Balance Sheet Input Not Confirmed"
	case "RepaymentRecords":
		que = que.Where(dbox.Eq("CustomerId", CustomerID), dbox.Eq("DealNo", DealNo))
		coll = "External Repayment Record Not Confirmed"
	case "StockandDebt":
		que = que.Where(dbox.Eq("customerid", concate))
		coll = "Stock and Debt Not Confirmed"
	case "CibilReport":
		que = que.Where(dbox.Eq("Profile.customerid", custInt), dbox.Eq("Profile.dealno", DealNo))
		coll = "Cibil Report Not Confirmed"
	case "CibilReportPromotorFinal":
		que = que.Where(dbox.Eq("ConsumerInfo.CustomerId", custInt), dbox.Eq("ConsumerInfo.DealNo", DealNo))
	case "DueDiligenceInput":
		que = que.Where(dbox.Eq("_id", concate))
		coll = "DueDiligence Form Not Confirmed"
	default:
		return errors.New("Table Name Not Registered")
	}

	csr, e := que.
		Cursor(nil)

	defer csr.Close()
	if e != nil {
		return e
	}

	results := make([]toolkit.M, 0)

	err := csr.Fetch(&results, 0, false)
	if err != nil {
		return err
	}

	for idx, val := range results {
		results[idx].Set("Id", val.Get("_id"))
	}

	// if len(results) == 0 {
	// 	return errors.New(coll)
	// }
	_ = coll

	for _, val := range results {
		iv := reflect.New(v).Interface()
		toolkit.Serde(val, iv, "json")
		ivs = reflect.Append(ivs, reflect.ValueOf(iv).Elem())
	}

	if reflect.ValueOf(m).Elem().Kind() != reflect.Slice {
		if len(results) > 0 {
			reflect.ValueOf(m).Elem().Set(ivs.Index(0))
		}
	} else {
		reflect.ValueOf(m).Elem().Set(ivs)
	}

	return nil
}
