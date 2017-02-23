package controllers

import (
	. "eaciit/x10/webapps/connection"
	. "eaciit/x10/webapps/helper"
	. "eaciit/x10/webapps/models"
	//"errors"
	"strconv"

	// "fmt"
	"time"

	"github.com/eaciit/cast"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type BankAnalysisController struct {
	*BaseController
}

func (c *BankAnalysisController) Default(k *knot.WebContext) interface{} {
	k.Config.NoLog = true
	k.Config.OutputType = knot.OutputTemplate
	DataAccess := c.NewPrevilege(k)

	k.Config.OutputType = knot.OutputTemplate
	k.Config.IncludeFiles = []string{"shared/dataaccess.html", "shared/filter.html", "shared/loading.html"}

	return DataAccess
}

// func (c *BankAnalysisController) Create(k *knot.WebContext) interface{} {
// 	k.Config.OutputType = knot.OutputJson

// 	param := DataBankParam{}

// 	err := k.GetPayload(&param)
// 	if err != nil {
// 		return CreateResult(false, nil, err.Error())
// 	}

// 	conn, err := GetConnection()
// 	defer conn.Close()
// 	if err != nil {
// 		return CreateResult(false, nil, err.Error())
// 	}
// 	id, _ := strconv.Atoi(param.CustomerId)
// 	query, err := conn.NewQuery().Select("customer_name").From("CustomerProfile").Where(dbox.Eq("customer_id", id)).Cursor(nil)
// 	if err != nil {
// 		tk.Println(err.Error())
// 	}
// 	cust := []tk.M{}
// 	err = query.Fetch(&cust, 0, false)
// 	defer query.Close()

// 	bankanalysis := BankAnalysis{}
// 	bankanalysis.Id = bson.NewObjectId()
// 	bankanalysis.CustomerId = id
// 	bankanalysis.DealNo = param.DealNo

// 	t := DataBank{}
// 	t.CustomerId = param.CustomerId
// 	t.BankAccount = param.BankAccount
// 	t.BankDetails = param.BankDetails

// 	bankanalysis.DataBank = append(bankanalysis.DataBank, t)
// 	ba := map[string]interface{}{"data": bankanalysis}

// 	qinsert := conn.NewQuery().
// 		From("BankAnalysis").
// 		SetConfig("multiexec", true).
// 		Save()
// 	err = qinsert.Exec(ba)
// 	if err != nil {
// 		return CreateResult(false, nil, err.Error())
// 	}

// 	//==================================Update All//
// 	wh := []*dbox.Filter{}
// 	wh = append(wh, dbox.Eq("CustomerId", cast.ToInt(param.CustomerId, cast.RoundingAuto)))
// 	wh = append(wh, dbox.Eq("DealNo", param.DealNo))
// 	res := []BankAnalysis{}

// 	query, err = conn.NewQuery().Select().From("BankAnalysis").Where(wh...).Cursor(nil)
// 	if err != nil {
// 		return CreateResult(false, nil, err.Error())
// 	}
// 	err = query.Fetch(&res, 0, false)
// 	defer query.Close()

// 	for _, val := range res {
// 		arr := val.DataBank[0].BankDetails

// 		for idx := range arr {
// 			arr[idx].Month = t.BankDetails[idx].Month
// 		}

// 		val.DataBank[0].BankDetails = arr

// 		ba := map[string]interface{}{"data": val}

// 		qinsert := conn.NewQuery().
// 			From("BankAnalysis").
// 			SetConfig("multiexec", true).
// 			Save()
// 		err = qinsert.Exec(ba)
// 		if err != nil {
// 			return CreateResult(false, nil, err.Error())
// 		}
// 	}

// 	return CreateResult(true, bankanalysis, "")
// }

// func (c *BankAnalysisController) Update(k *knot.WebContext) interface{} {
// 	k.Config.OutputType = knot.OutputJson

// 	tx := DataBankPayLoad{}
// 	err := k.GetPayload(&tx)

// 	param := tx.Param

// 	if err != nil {
// 		return CreateResult(false, nil, err.Error())
// 	}

// 	conn, err := GetConnection()
// 	defer conn.Close()
// 	if err != nil {
// 		return CreateResult(false, nil, err.Error())
// 	}
// 	id, _ := strconv.Atoi(param.CustomerId)
// 	query, err := conn.NewQuery().Select("customer_name").From("CustomerProfile").Where(dbox.Eq("customer_id", id)).Cursor(nil)
// 	if err != nil {
// 		tk.Println(err.Error())
// 	}
// 	cust := []tk.M{}
// 	err = query.Fetch(&cust, 0, false)
// 	defer query.Close()

// 	type listIdType struct {
// 		Id bson.ObjectId `bson:"_id" , json:"_id" `
// 	}
// 	tk.Println(tx)
// 	bankanalysis := BankAnalysis{}
// 	bankanalysis.Id = bson.ObjectIdHex(tx.Id)
// 	bankanalysis.CustomerId = id
// 	bankanalysis.DealNo = param.DealNo

// 	t := DataBank{}
// 	t.CustomerId = param.CustomerId
// 	t.BankAccount = param.BankAccount
// 	t.BankDetails = param.BankDetails

// 	bankanalysis.DataBank = append(bankanalysis.DataBank, t)
// 	ba := map[string]interface{}{"data": bankanalysis}

// 	qinsert := conn.NewQuery().
// 		From("BankAnalysis").
// 		SetConfig("multiexec", true).
// 		Update()
// 	err = qinsert.Exec(ba)
// 	if err != nil {
// 		return CreateResult(false, nil, err.Error())
// 	}

// 	return CreateResult(true, bankanalysis, "")
// }

func (c *BankAnalysisController) GetDataBank(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := struct {
		CustomerId int
		DealNo     string
	}{}
	err := k.GetPayload(&t)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	res, ressum, err := new(BankAnalysis).GetData(t.CustomerId, t.DealNo)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	result := tk.M{}.Set("Detail", res).Set("Summary", ressum)
	return CreateResult(true, result, "")
}

func (c *BankAnalysisController) SaveDetailBankTemplate(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := BankDetailsTemplate{}
	err := k.GetPayload(&p)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	e := conn.NewQuery().
		Delete().
		From("BankDetailTemplate").
		SetConfig("multiexec", true).
		Where(dbox.Eq("CustomerId", p.CustomerId)).
		Exec(nil)
	if e != nil {
		tk.Printf("Delete fail: %s", e.Error())
	}

	bankdetailtemp := BankDetailsTemplate{}
	bankdetailtemp.Id = bson.NewObjectId()
	bankdetailtemp.CustomerId = p.CustomerId
	bankdetailtemp.BankDetails = p.BankDetails

	data := map[string]interface{}{"data": bankdetailtemp}

	q := conn.NewQuery().SetConfig("multiexec", true).From("BankDetailTemplate").Save()
	err = q.Exec(data)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	bas := []BankAnalysis{}
	dbs := []DataBank{}

	db := DataBank{BankDetails: p.BankDetails}
	dbs = append(dbs, db)

	ba := BankAnalysis{DataBank: dbs}
	bas = append(bas, ba)

	tk.Println(bas)

	ret := new(BankAnalysis).GenerateBankSummary(bas)
	return CreateResult(true, ret, "")
}

func (c *BankAnalysisController) GetDetailBankTemplate(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := ""
	err := k.GetPayload(&t)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	res := []tk.M{}
	query, err := conn.NewQuery().Select().From("BankDetailTemplate").Where(dbox.Eq("CustomerId", t)).Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}
	err = query.Fetch(&res, 0, false)
	defer query.Close()

	return CreateResult(true, res, "")
}

func (c *BankAnalysisController) SetConfirmed(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := struct {
		CustomerId int
		DealNo     string
	}{}

	err := k.GetPayload(&param)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	res := []BankAnalysis{}
	// result := tk.M{}

	wh := []*dbox.Filter{}
	wh = append(wh, dbox.Eq("CustomerId", param.CustomerId))
	wh = append(wh, dbox.Eq("DealNo", param.DealNo))

	query, err := conn.NewQuery().Select().From("BankAnalysisV2").Where(wh...).Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}
	err = query.Fetch(&res, 0, false)
	defer query.Close()
	tk.Println(query.Count())

	for _, val := range res {
		// fmt.Println("-----------", val.IsConfirmed, val.DateConfirmed, "\n")
		if val.IsConfirmed {
			val.IsConfirmed = false
		} else {
			val.IsConfirmed = true
			val.DateConfirmed = time.Now()
		}
		// fmt.Println("-----------", val.IsConfirmed, val.DateConfirmed, "\n")

		ba := map[string]interface{}{"data": val}

		qinsert := conn.NewQuery().
			From("BankAnalysisV2").
			SetConfig("multiexec", true).
			Save()
		err = qinsert.Exec(ba)
		if err != nil {
			return CreateResult(false, nil, err.Error())
		}
	}

	return true
}

func (c *BankAnalysisController) CreateBankAnalysis(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := DataBankParamV2{}

	err := k.GetPayload(&param)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}
	id, _ := strconv.Atoi(param.CustomerId)
	query, err := conn.NewQuery().Select("customer_name").From("CustomerProfile").Where(dbox.Eq("customer_id", id)).Cursor(nil)
	if err != nil {
		tk.Println(err.Error())
	}
	cust := []tk.M{}
	err = query.Fetch(&cust, 0, false)
	defer query.Close()

	bankanalysis := BankAnalysisV2{}
	bankanalysis.Id = bson.NewObjectId()
	bankanalysis.CustomerId = id
	bankanalysis.DealNo = param.DealNo

	t := DataBankV2{}
	t.CustomerId = param.CustomerId
	t.BankAccount = param.BankAccount
	t.BankDetails = param.BankDetails
	t.CurrentBankDetails = param.CurrentBankDetails

	bankanalysis.DataBank = append(bankanalysis.DataBank, t)
	tk.Println(bankanalysis.DataBank)
	ba := map[string]interface{}{"data": bankanalysis}

	qinsert := conn.NewQuery().
		From("BankAnalysisV2").
		SetConfig("multiexec", true).
		Save()
	err = qinsert.Exec(ba)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	//==================================Update All//
	wh := []*dbox.Filter{}
	wh = append(wh, dbox.Eq("CustomerId", cast.ToInt(param.CustomerId, cast.RoundingAuto)))
	wh = append(wh, dbox.Eq("DealNo", param.DealNo))
	res := []BankAnalysisV2{}

	query, err = conn.NewQuery().Select().From("BankAnalysisV2").Where(wh...).Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}
	err = query.Fetch(&res, 0, false)
	defer query.Close()

	for _, val := range res {
		arr := val.DataBank[0].BankDetails
		arr2 := val.DataBank[0].CurrentBankDetails

		for idx := range arr {
			arr[idx].Month = t.BankDetails[idx].Month
		}

		for idx := range arr2 {
			arr2[idx].Month = t.BankDetails[idx].Month
		}

		val.DataBank[0].BankDetails = arr
		val.DataBank[0].CurrentBankDetails = arr2

		ba := map[string]interface{}{"data": val}

		qinsert := conn.NewQuery().
			From("BankAnalysisV2").
			SetConfig("multiexec", true).
			Save()
		err = qinsert.Exec(ba)
		if err != nil {
			return CreateResult(false, nil, err.Error())
		}
	}

	return CreateResult(true, bankanalysis, "")
}

func (c *BankAnalysisController) GetDataBankV2(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := struct {
		CustomerId int
		DealNo     string
		//ForModule  string
	}{}
	err := k.GetPayload(&t)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	res, ressum, err := new(BankAnalysis).GetDataV2(t.CustomerId, t.DealNo)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	ress := new(tk.Result)

	//Ratio
	fm := new(FormulaModel)
	fm.CustomerId = strconv.Itoa(t.CustomerId)
	fm.DealNo = t.DealNo

	err = fm.GetData()
	if err != nil {
		// ress.SetError(err)
		// return ress
		return CreateResult(true, nil, err.Error())

	}

	bs, err := fm.CalculateBalanceSheet()
	if err != nil {
		// ress.SetError(err)
		return CreateResult(true, nil, err.Error())
	}

	ress.SetData(bs)

	//Account Details

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	// csr, err := conn.NewQuery().Select().From("AccountDetails").Where(dbox.And(dbox.Eq("customerid", fm.CustomerId), dbox.Eq("dealno", fm.DealNo))).Cursor(nil)
	// if err != nil {
	// 	ress.SetError(err)
	// 	return ress
	// }

	accdet := []tk.M{}
	// err = csr.Fetch(&accdet, 0, false)
	// defer csr.Close()

	err = new(DataConfirmController).GetDataConfirmed(fm.CustomerId, fm.DealNo, new(AccountDetail).TableName(), &accdet)
	if err != nil {
		// ress.SetError(err)
		// return ress
		return CreateResult(true, nil, err.Error())

	}

	// cust := strconv.Itoa(t.CustomerId)
	// rtr, _ := new(RTRBottom).GetByCustomerDeal(cust, t.DealNo)

	allSummary, isUpdate, message, err := new(BankAnalysis).GenerateAllSummary(fm.CustomerId, fm.DealNo)
	result := tk.M{}.Set("Detail", res).Set("Summary", ressum).Set("SummaryAll", allSummary).Set("Ratio", ress).Set("AccountDetail", accdet).Set("IsUpdate", isUpdate).Set("messageImp", message)
	return CreateResult(true, result, "")
}

func (c *BankAnalysisController) GetDataBankV2Confirmed(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	t := struct {
		CustomerId int
		DealNo     string
		//ForModule  string
	}{}
	err := k.GetPayload(&t)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	res, ressum, err := new(BankAnalysis).GetDataV2Confirmed(t.CustomerId, t.DealNo)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	ress := new(tk.Result)

	//Ratio
	fm := new(FormulaModel)
	fm.CustomerId = strconv.Itoa(t.CustomerId)
	fm.DealNo = t.DealNo

	err = fm.GetData()
	if err != nil {
		// ress.SetError(err)
		// return ress
		return CreateResult(true, nil, err.Error())

	}

	bs, err := fm.CalculateBalanceSheet()
	if err != nil {
		// ress.SetError(err)
		return CreateResult(true, nil, err.Error())
	}

	ress.SetData(bs)

	//Account Details

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	// csr, err := conn.NewQuery().Select().From("AccountDetails").Where(dbox.And(dbox.Eq("customerid", fm.CustomerId), dbox.Eq("dealno", fm.DealNo))).Cursor(nil)
	// if err != nil {
	// 	ress.SetError(err)
	// 	return ress
	// }

	accdet := []tk.M{}
	// err = csr.Fetch(&accdet, 0, false)
	// defer csr.Close()

	err = new(DataConfirmController).GetDataConfirmed(fm.CustomerId, fm.DealNo, new(AccountDetail).TableName(), &accdet)
	if err != nil {
		// ress.SetError(err)
		// return ress
		return CreateResult(true, nil, err.Error())

	}

	allsum, err := new(BankAnalysis).GenerateAllSummaryConfirmed(fm.CustomerId, fm.DealNo)
	if err != nil {
		return CreateResult(true, nil, err.Error())

	}

	// cust := strconv.Itoa(t.CustomerId)
	// rtr, _ := new(RTRBottom).GetByCustomerDeal(cust, t.DealNo)

	result := tk.M{}.Set("Detail", res).Set("Summary", ressum).Set("Ratio", ress).Set("AccountDetail", accdet).Set("AllSum", allsum)
	return CreateResult(true, result, "")
}

func (c *BankAnalysisController) UpdateV2(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	tx := DataBankPayLoadV2{}
	err := k.GetPayload(&tx)

	param := tx.Param

	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}
	id, _ := strconv.Atoi(param.CustomerId)
	query, err := conn.NewQuery().Select("customer_name").From("CustomerProfile").Where(dbox.Eq("customer_id", id)).Cursor(nil)
	if err != nil {
		tk.Println(err.Error())
	}
	cust := []tk.M{}
	err = query.Fetch(&cust, 0, false)
	defer query.Close()

	type listIdType struct {
		Id bson.ObjectId `bson:"_id" , json:"_id" `
	}
	tk.Println(tx)
	bankanalysis := BankAnalysisV2{}
	bankanalysis.Id = bson.ObjectIdHex(tx.Id)
	bankanalysis.CustomerId = id
	bankanalysis.DealNo = param.DealNo

	t := DataBankV2{}
	t.CustomerId = param.CustomerId
	t.BankAccount = param.BankAccount
	t.BankDetails = param.BankDetails
	t.CurrentBankDetails = param.CurrentBankDetails

	bankanalysis.DataBank = append(bankanalysis.DataBank, t)
	ba := map[string]interface{}{"data": bankanalysis}

	qinsert := conn.NewQuery().
		From("BankAnalysisV2").
		SetConfig("multiexec", true).
		Update()
	err = qinsert.Exec(ba)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	return CreateResult(true, bankanalysis, "")
}

func (c *BankAnalysisController) DeleteV2(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	tx := tk.M{}
	err := k.GetPayload(&tx)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	err = new(BankAnalysisV2).DeleteById(tx.GetString("Id"))

	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	return CreateResult(true, tx.GetString("Id"), "")
}

func (c *BankAnalysisController) SetConfirmedV2(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := struct {
		CustomerId int
		DealNo     string
		IsConfirm  bool
	}{}

	err := k.GetPayload(&param)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	res := []BankAnalysisV2{}
	// result := tk.M{}

	wh := []*dbox.Filter{}
	wh = append(wh, dbox.Eq("CustomerId", param.CustomerId))
	wh = append(wh, dbox.Eq("DealNo", param.DealNo))

	query, err := conn.NewQuery().Select().From("BankAnalysisV2").Where(wh...).Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}
	err = query.Fetch(&res, 0, false)
	defer query.Close()
	tk.Println(query.Count())

	for idx, val := range res {
		// fmt.Println("-----------", val.IsConfirmed, val.DateConfirmed, "\n")
		if param.IsConfirm {
			val.Status = 1
			val.IsConfirmed = param.IsConfirm
			val.DateConfirmed = time.Now()

			del := false
			if idx == 0 {
				del = true
			}

			if err := new(DataConfirmController).SaveDataConfirmed(cast.ToString(val.CustomerId), val.DealNo, "BankAnalysisV2", &val, del); err != nil {
				return err
			}
		} else {
			val.IsConfirmed = false
			val.Status = 0
		}

		// fmt.Println("-----------", val.IsConfirmed, val.DateConfirmed, "\n")

		ba := map[string]interface{}{"data": val}

		qinsert := conn.NewQuery().
			From("BankAnalysisV2").
			SetConfig("multiexec", true).
			Save()
		err = qinsert.Exec(ba)
		if err != nil {
			return CreateResult(false, nil, err.Error())
		}
	}

	if param.IsConfirm {
		UpdateDealSetup(strconv.Itoa(param.CustomerId), param.DealNo, "ba", "Confirmed")
	} else {
		UpdateDealSetup(strconv.Itoa(param.CustomerId), param.DealNo, "ba", UnderProcess)
	}

	return true
}

func (c *BankAnalysisController) SetFreeze(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := struct {
		CustomerId int
		DealNo     string
		IsFreeze   bool
	}{}

	err := k.GetPayload(&param)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	res := []BankAnalysisV2{}

	wh := []*dbox.Filter{}
	wh = append(wh, dbox.Eq("CustomerId", param.CustomerId))
	wh = append(wh, dbox.Eq("DealNo", param.DealNo))

	query, err := conn.NewQuery().Select().From("BankAnalysisV2").Where(wh...).Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	err = query.Fetch(&res, 0, false)
	defer query.Close()

	for _, val := range res {
		if param.IsFreeze {
			val.DateFreeze = time.Now()
			val.IsFreeze = param.IsFreeze
		} else {
			val.IsFreeze = param.IsFreeze
		}

		has := map[string]interface{}{"data": val}
		oninsert := conn.NewQuery().
			From("BankAnalysisV2").
			SetConfig("multiexec", true).
			Save()
		err = oninsert.Exec(has)

		if err != nil {
			return CreateResult(false, nil, err.Error())
		}
	}

	if param.IsFreeze {
		UpdateDealSetup(strconv.Itoa(param.CustomerId), param.DealNo, "ba", "Freeze")
	} else {
		UpdateDealSetup(strconv.Itoa(param.CustomerId), param.DealNo, "ba", "Confirmed")
	}

	return true

}

func (c *BankAnalysisController) UnFreeze(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := struct {
		CustomerId int
		DealNo     string
	}{}

	err := k.GetPayload(&param)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	res := []BankAnalysisV2{}

	wh := []*dbox.Filter{}
	wh = append(wh, dbox.Eq("CustomerId", param.CustomerId))
	wh = append(wh, dbox.Eq("DealNo", param.DealNo))

	query, err := conn.NewQuery().Select().From("BankAnalysisV2").Where(wh...).Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	err = query.Fetch(&res, 0, false)
	defer query.Close()

	for _, val := range res {
		if val.IsFreeze {
			val.IsFreeze = false
			val.Status = 1
		} else {
			val.IsFreeze = true
			val.DateFreeze = time.Now()
			val.Status = 1
		}

		has := map[string]interface{}{"data": val}
		oninsert := conn.NewQuery().
			From("BankAnalysisV2").
			SetConfig("multiexec", true).
			Save()
		err = oninsert.Exec(has)

		if err != nil {
			return CreateResult(false, nil, err.Error())
		}
	}

	return true

}

func (c *BankAnalysisController) GetDateTemplate(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	param := struct {
		CustomerId int
		DealNo     string
	}{}

	err := k.GetPayload(&param)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	conn, err := GetConnection()
	defer conn.Close()
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}

	res := []tk.M{}

	// filter := []*dbox.Filter{}
	// filter = append(filter, dbox.Eq("CustomerId", param.CustomerId))
	cus_id := strconv.Itoa(param.CustomerId)
	query, err := conn.NewQuery().Select().From("BankDetailTemplate").Where(dbox.Eq("CustomerId", cus_id)).Cursor(nil)
	if err != nil {
		return CreateResult(false, nil, err.Error())
	}
	err = query.Fetch(&res, 0, false)
	defer query.Close()

	return CreateResult(true, res, "")

}
