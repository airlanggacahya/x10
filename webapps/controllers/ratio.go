package controllers

import (
	. "eaciit/x10/webapps/models"
	"errors"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"strings"
	"time"
)

type RatioController struct {
	*BaseController
}

func (c *RatioController) Input(k *knot.WebContext) interface{} {
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

func (c *RatioController) Pdf(k *knot.WebContext) interface{} {
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
	k.Config.IncludeFiles = []string{"shared/filter.html", "shared/loading.html"}

	return DataAccess
}

func (c *RatioController) Master(k *knot.WebContext) interface{} {
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

func (c *RatioController) Formula(k *knot.WebContext) interface{} {
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

func (c *RatioController) Report(k *knot.WebContext) interface{} {
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

func (c *RatioController) FetchMasterBalanceSheetInput() ([]BalanceSheetInput, error) {
	query := toolkit.M{"order": []string{"Order"}}
	csr, err := c.Ctx.Find(new(BalanceSheetInput), query)
	defer csr.Close()
	if err != nil {
		return nil, err
	}
	results := make([]BalanceSheetInput, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func (c *RatioController) GetMasterBalanceSheetInput(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res, err := c.FetchMasterBalanceSheetInput()
	if err != nil {
		return err.Error()
	}

	return res
}

func (c *RatioController) SaveMasterBalanceSheetInput(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	// ====== REMOVE PREV DATA
	oldData, err := c.FetchMasterBalanceSheetInput()
	if err != nil {
		return err.Error()
	}

	for _, each := range oldData {
		if err := c.Ctx.Delete(&each); err != nil {
			res.SetError(err)
			return res
		}
	}

	// ====== INSERt PREV DATA
	payload := struct{ Data []BalanceSheetInput }{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	for _, each := range payload.Data {
		if err := c.Ctx.Save(&each); err != nil {
			res.SetError(err)
			return res
		}
	}

	return res
}

func (c *RatioController) AddMasterBalanceSheetInput(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := new(BalanceSheetInput)
	if err := k.GetPayload(payload); err != nil {
		res.SetError(err)
		return res
	}

	if payload.Id == "" {
		payload.Id = bson.NewObjectId().Hex()
	}

	if err := c.Ctx.Save(payload); err != nil {
		res.SetError(err)
		return res
	}

	return res
}

func (c *RatioController) FetchFilledBalanceSheetInputByFieldId(fieldId string) ([]toolkit.M, error) {
	pipe := []toolkit.M{}
	pipe = append(pipe, toolkit.M{"$unwind": "$formdata"})
	pipe = append(pipe, toolkit.M{"$match": toolkit.M{
		"formdata.fieldid": fieldId,
		"formdata.value":   toolkit.M{"$gt": 0},
	}})

	csr, err := c.Ctx.Connection.
		NewQuery().
		Command("pipe", pipe).
		From(new(RatioInputData).TableName()).
		Cursor(nil)
	if err != nil {
		return nil, err
	}
	defer csr.Close()

	data := []toolkit.M{}
	if err := csr.Fetch(&data, 0, false); err != nil {
		return nil, err
	}

	return data, nil
}

func (c *RatioController) GetFilledBalanceSheetInput(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := toolkit.M{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	data, err := c.FetchFilledBalanceSheetInputByFieldId(payload.GetString("Id"))
	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(data)
	return res
}

func (c *RatioController) RemoveMasterBalanceSheetInput(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := toolkit.M{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	data, err := c.FetchFilledBalanceSheetInputByFieldId(payload.GetString("Id"))
	if err != nil {
		res.SetError(err)
		return res
	}

	if len(data) > 0 {
		res.SetError(errors.New("Field is used in some data. Cannot be deleted."))
		return res
	}

	target := new(BalanceSheetInput)
	target.Id = payload.GetString("Id")
	if err := c.Ctx.Delete(target); err != nil {
		// res.SetError(err)
		// return res
	}

	return res
}

func (c *RatioController) FetchRatioInputDataByCustomerIDNotConfirmed(customerID string) (*RatioInputData, error) {
	query := toolkit.M{"where": dbox.Eq("customerid", customerID)}
	csr, err := c.Ctx.Find(new(RatioInputData), query)
	defer csr.Close()
	if err != nil {
		return nil, err
	}

	results := make([]RatioInputData, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, err
	}

	if (len(results)) == 0 {
		return nil, errors.New("data not found")
	}

	return &results[0], nil
}

func (c *RatioController) FetchRatioInputDataByCustomerID(customerID string) (*RatioInputData, error) {
	query := toolkit.M{"where": dbox.And(dbox.Eq("customerid", customerID), dbox.Eq("confirmed", true))}
	csr, err := c.Ctx.Find(new(RatioInputData), query)
	defer csr.Close()
	if err != nil {
		return nil, err
	}

	results := make([]RatioInputData, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, err
	}

	if (len(results)) == 0 {
		return nil, errors.New("data not found")
	}

	return &results[0], nil
}

func (c *RatioController) Freeze(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := NewRatioInputData()
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	rowData, err := c.FetchRatioInputDataByCustomerIDNotConfirmed(payload.CustomerID)
	if err != nil {
		res.SetError(err)
		return res
	}

	rowData.IsFrozen = payload.IsFrozen

	if err := c.Ctx.Save(rowData); err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(rowData)
	return res
}

func (c *RatioController) Confirm(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := NewRatioInputData()
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	rowData, err := c.FetchRatioInputDataByCustomerIDNotConfirmed(payload.CustomerID)
	if err != nil {
		res.SetError(err)
		return res
	}

	rowData.ConfirmedAuditStatus = rowData.AuditStatus
	rowData.ConfirmedProvisionStatus = rowData.ProvisionStatus
	rowData.ConfirmedFormData = rowData.FormData

	rowData.Confirmed = payload.Confirmed
	rowData.Frozen = payload.Frozen
	rowData.LastConfirm = time.Now()

	if err := c.Ctx.Save(rowData); err != nil {
		res.SetError(err)
		return res
	}

	if payload.Confirmed {
		cust := strings.Split(rowData.CustomerID, "|")[0]
		deal := strings.Split(rowData.CustomerID, "|")[1]
		if err := new(DataConfirmController).SaveDataConfirmed(cust, deal, rowData.TableName(), rowData, true); err != nil {
			return err
		}
	}

	res.SetData(rowData)
	return res
}

func (c *RatioController) GetRatioInputDataALL(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := NewRatioInputData()
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	rowData, err := c.FetchRatioInputDataByCustomerIDNotConfirmed(payload.CustomerID)
	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(rowData)
	return res
}

func (c *RatioController) GetRatioInputData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := NewRatioInputData()
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	rowData, err := c.FetchRatioInputDataByCustomerID(payload.CustomerID)
	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(rowData)
	return res
}

func (c *RatioController) SaveRatioInputData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := NewRatioInputData()
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}
	if payload.Id == "" {
		payload.Id = bson.NewObjectId().Hex()
	}

	rowData, _ := c.FetchRatioInputDataByCustomerID(payload.CustomerID)
	if rowData != nil {
		payload.Id = rowData.Id
	}

	if err := c.Ctx.Save(payload); err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(payload.Id)
	return res
}

func (c *RatioController) FetchRatioFormula() ([]RatioFormula, error) {
	query := toolkit.M{}
	csr, err := c.Ctx.Find(new(RatioFormula), query)
	defer csr.Close()
	if err != nil {
		return nil, err
	}
	results := make([]toolkit.M, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, err
	}

	resultsParsed := make([]RatioFormula, 0)
	for _, each := range results {
		eachParsed := NewRatioFormula()
		if err := toolkit.Serde(each, eachParsed, "json"); err != nil {
			continue
		}

		eachParsed.Id = each.GetString("_id")
		resultsParsed = append(resultsParsed, *eachParsed)
	}

	return resultsParsed, nil
}

func (c *RatioController) GetFormulaData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := struct {
		ForModule string
	}{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	fm := new(FormulaModel)
	err := fm.GetRatioFormula()
	if err != nil {
		res.SetError(err)
		return res
	}
	err = fm.GetDataBalanceSheet()
	if err != nil {
		res.SetError(err)
		return res
	}
	fields := fm.GetFieldsInOrder()

	res.SetData(toolkit.M{
		"Fields":       fields,
		"Formula":      fm.RatioFormula,
		"BalanceSheet": fm.BalanceSheet.FormData,
	})
	return res
}

func (c *RatioController) ChangePutAfter(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	type PayloadItem struct {
		Alias      string
		PutAfter   string
		Section    string
		SubSection string
	}

	payload := struct {
		Data []PayloadItem
	}{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	getById := func(id string) (*RatioFormula, error) {
		query := toolkit.M{"where": dbox.Eq("_id", id)}
		csr, err := c.Ctx.Find(new(RatioFormula), query)
		defer csr.Close()
		if err != nil {
			return nil, err
		}
		results := make([]RatioFormula, 0)
		err = csr.Fetch(&results, 0, false)
		if err != nil {
			return nil, err
		}

		if len(results) == 0 {
			return nil, errors.New("No data of put after")
		}

		return &(results[0]), nil
	}

	for _, each := range payload.Data {
		from, err := getById(each.Alias)
		if err != nil {
			res.SetError(err)
			return res
		}

		from.PutAfter = each.PutAfter
		from.Section = each.Section
		from.SubSection = each.SubSection

		err = c.Ctx.Save(from)
		if err != nil {
			res.SetError(err)
			return res
		}
	}

	return res
}

func (c *RatioController) Reorder(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	type PayloadItem struct {
		Alias          string
		PutAfter       string
		SectionName    string
		SubSectionName string
	}

	payload := struct {
		Data []PayloadItem
	}{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	getById := func(id string) (*RatioFormula, error) {
		query := toolkit.M{"where": dbox.Eq("_id", id)}
		csr, err := c.Ctx.Find(new(RatioFormula), query)
		defer csr.Close()
		if err != nil {
			return nil, err
		}
		results := make([]RatioFormula, 0)
		err = csr.Fetch(&results, 0, false)
		if err != nil {
			return nil, err
		}

		if len(results) == 0 {
			return nil, errors.New("No data of put after")
		}

		return &(results[0]), nil
	}

	for _, each := range payload.Data {
		from, err := getById(each.Alias)
		if err != nil {
			res.SetError(err)
			return res
		}

		from.PutAfter = each.PutAfter
		from.Section = each.SectionName
		from.SubSection = each.SubSectionName

		err = c.Ctx.Save(from)
		if err != nil {
			toolkit.Println("reorder error", err.Error())
		}
	}

	return res
}

func (c *RatioController) SaveFormula(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := struct {
		RatioFormula
		IsNew bool
	}{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	if payload.IsNew {
		query := toolkit.M{"where": dbox.Eq("_id", payload.Id)}
		csr, err := c.Ctx.Find(new(RatioFormula), query)
		defer csr.Close()
		if err != nil {
			res.SetError(err)
			return res
		}

		if csr.Count() > 0 {
			res.SetError(errors.New("Alias is used. Try another."))
			return res
		}
	}

	fakeFM := NewFormulaModel()
	payload.ParseFormula(fakeFM)
	payload.PrepareVariables("31-03-2015", fakeFM)
	if _, err := payload.Calculate(); err != nil {
		res.SetError(err)
		return res
	}

	csr, err := c.Ctx.Find(new(RatioFormula), toolkit.M{"where": dbox.Eq("_id", payload.RatioFormula.Id)})
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		res.SetError(err)
		return res
	}
	oldFormulas := make([]RatioFormula, 0)
	err = csr.Fetch(&oldFormulas, 0, false)
	if err != nil {
		res.SetError(err)
		return res
	}
	if len(oldFormulas) > 0 {
		if payload.RatioFormula.PutAfter == oldFormulas[0].PutAfter {
			payload.RatioFormula.Section = oldFormulas[0].Section
			payload.RatioFormula.SubSection = oldFormulas[0].SubSection
		}
	}

	if err := c.Ctx.Save(&payload.RatioFormula); err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(true)
	return res
}

func (c *RatioController) DeleteFormula(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := new(RatioFormula)
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	if err := c.Ctx.GetById(payload, payload.Id); err != nil {
		res.SetError(err)
		return res
	}

	if err := c.Ctx.Delete(payload); err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(true)
	return res
}

func (c *RatioController) GetReportData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	fm := new(FormulaModel)
	if err := k.GetPayload(fm); err != nil {
		res.SetError(err)
		return res
	}

	err := fm.GetData()
	if err != nil {
		res.SetError(err)
		return res
	}

	bs, err := fm.CalculateBalanceSheet()
	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(bs)
	return res
}

func (c *RatioController) GetFormulaModelData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	fm := new(FormulaModel)
	if err := k.GetPayload(fm); err != nil {
		res.SetError(err)
		return res
	}

	err := fm.GetData()
	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(fm)
	return res
}
