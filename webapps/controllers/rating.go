package controllers

import (
	. "eaciit/x10/webapps/models"
	// "errors"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	"strings"
	"time"
)

type RatingController struct {
	*BaseController
}

func (c *RatingController) Input(k *knot.WebContext) interface{} {
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
	k.Config.IncludeFiles = []string{"shared/filter.html", "datacapturing/cibilcomment.html", "shared/loading.html"}

	return DataAccess
}

func (c *RatingController) FetchRatingMaster(id string) ([]RatingMaster, error) {
	query := toolkit.M{}
	query = query.Set("where", dbox.Contains("_id", id))
	csr, err := c.Ctx.Find(new(RatingMaster), query)
	defer csr.Close()
	if err != nil {
		return nil, err
	}
	results := make([]RatingMaster, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func (c *RatingController) NewRatingData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res, n, err := GetLatestRatingData()
	if err != nil {
		return err.Error()
	}

	oldId := res.Id

	res.Id = toolkit.RandomString(24)
	res.CreatedAt = time.Now()
	res.Name = toolkit.Sprintf("Rating Model New %d", n)

	return toolkit.M{"data": res, "lastId": oldId}
}

func (c *RatingController) GetRatingMaster(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson
	payload := struct {
		Id string
	}{}
	if err := k.GetPayload(&payload); err != nil {
		return err.Error()
	}
	res, err := c.FetchRatingMaster(payload.Id)
	if err != nil {
		return err.Error()
	}

	return res
}

func (c *RatingController) FetchRatingData(id string) ([]RatingData, error) {
	query := toolkit.M{}
	if id != "" {
		query = query.Set("where", dbox.Eq("_id", id))
	}

	csr, err := c.Ctx.Find(new(RatingData), query)
	defer csr.Close()
	if err != nil {
		return nil, err
	}
	results := make([]RatingData, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func (c *RatingController) GetRatingData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := toolkit.NewResult()

	payload := struct {
		Id string
	}{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	data, err := c.FetchRatingData(payload.Id)
	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(data)
	return res
}

func (c *RatingController) SaveRatingData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := toolkit.NewResult()

	payload := struct {
		Data []RatingData
	}{}

	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	var ids []string

	for _, each := range payload.Data {
		if strings.HasPrefix(each.Id, "new") {
			each.Id = bson.NewObjectId().Hex()
		}
		ids = append(ids, each.Id)
		if err := c.Ctx.Save(&each); err != nil {
			res.SetError(err)
			return res
		}
	}

	res.SetData(ids)

	return res
}

func (c *RatingController) DeleteRatingData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := toolkit.NewResult()

	payload := NewRatingData()
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	if err := c.Ctx.Delete(payload); err != nil {
		res.SetError(err)
		return res
	}

	resdt, err := c.FetchRatingMaster(payload.Id)
	if err != nil {
		return err.Error()
	}

	for _, val := range resdt {
		if err := c.Ctx.Delete(&val); err != nil {
			res.SetError(err)
			return res
		}
	}

	// toolkit.Println(k.Request.Header.Get("referer"), k.Request.Header.Get("REFERER"))

	return res
}

func (c *RatingController) SaveRatingMaster(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	// ====== REMOVE PREV DATA
	// oldData, err := c.FetchRatingMaster()
	// if err != nil {
	// 	return err.Error()
	// }

	// for _, each := range oldData {
	// 	if err := c.Ctx.Delete(&each); err != nil {
	// 		res.SetError(err)
	// 		return res
	// 	}
	// }

	// ====== INSERt PREV DATA
	payload := struct{ Data []RatingMaster }{}
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

func (c *RatingController) AddRatingMaster(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := new(RatingMaster)
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

func (c *RatingController) GetFilledRatingMasterByFieldId(fieldId string) ([]toolkit.M, error) {
	pipe := []toolkit.M{}
	pipe = append(pipe, toolkit.M{"$unwind": "$categoriesdata"})
	pipe = append(pipe, toolkit.M{"$match": toolkit.M{
		"categoriesdata.id":    fieldId,
		"categoriesdata.score": toolkit.M{"$gt": 0},
	}})

	// toolkit.Printfn("%#v", pipe)

	csr, err := c.Ctx.Connection.
		NewQuery().
		Command("pipe", pipe).
		From(new(RatingData).TableName()).
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

func (c *RatingController) GetFilledRatingMaster(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := toolkit.M{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	data, err := c.GetFilledRatingMasterByFieldId(payload.GetString("Id"))
	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(data)
	return res
}

func (c *RatingController) RemoveBeforeSave(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := toolkit.M{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	target := new(RatingMaster)
	target.Id = payload.GetString("Id")
	if err := c.Ctx.Delete(target); err != nil {
		// res.SetError(err)
		// return res
	}

	return res
}

func (c *RatingController) RemoveRatingMaster(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := toolkit.M{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	data, err := c.GetFilledRatingMasterByFieldId(payload.GetString("Id"))
	if err != nil {
		res.SetError(err)
		return res
	}

	if len(data) > 0 {
		query := toolkit.M{"name": payload.GetString("Name")}
		csr, err := c.Ctx.Find(new(RatingData), query)
		defer csr.Close()
		if err != nil {
			res.SetError(err)
			return res
		}
		results := make([]RatingData, 0)
		err = csr.Fetch(&results, 0, false)
		if err != nil {
			res.SetError(err)
			return res
		}

		if len(results) > 0 {
			data := results[0].CategoriesData
			for idx, val := range data {
				if val.Id == payload.GetString("Id") {
					data = append(data[:idx], data[idx+1:]...)
					break
				}
			}
			results[0].CategoriesData = data
		}

		if err := c.Ctx.Save(&results[0]); err != nil {
			res.SetError(err)
			return res
		}

		// res.SetError(errors.New("Field is used in some data. Cannot be deleted."))
		// return res
	}

	target := new(RatingMaster)
	target.Id = payload.GetString("Id")
	if err := c.Ctx.Delete(target); err != nil {
		// res.SetError(err)
		// return res
	}

	return res
}
