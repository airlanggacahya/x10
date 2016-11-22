package controllers

import (
	. "eaciit/x10/webapps/models"
	"github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
)

type NormMasterController struct {
	*BaseController
}

func (c *NormMasterController) DeleteNorms(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := new(NormMaster)
	if err := k.GetPayload(payload); err != nil {
		res.SetError(err)
		return res
	}

	if err := c.Ctx.Delete(payload); err != nil {
		res.SetError(err)
		return res
	}

	return res
}

func (c *NormMasterController) ChangeOrderNorms(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := struct {
		Data []NormMaster
	}{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	for _, each := range payload.Data {
		fmrl := new(NormMaster)
		if err := c.Ctx.GetById(fmrl, each.Id); err != nil {
			res.SetError(err)
			return res
		}

		fmrl.Order = each.Order

		if err := c.Ctx.Save(fmrl); err != nil {
			res.SetError(err)
			return res
		}
	}

	return res
}

func (c *NormMasterController) SaveNorms(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := struct {
		IsNew bool
		NormMaster
	}{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	where := []*dbox.Filter{
		dbox.Eq("fieldid", payload.NormMaster.FieldId),
		dbox.Eq("internalrating", payload.NormMaster.InternalRating),
	}

	if payload.IsNew {
		payload.NormMaster.Id = bson.NewObjectId().Hex()
	} else {
		where = append(where, dbox.Ne("_id", payload.NormMaster.Id))
	}

	csr, err := c.Ctx.Find(new(NormMaster), toolkit.M{"where": dbox.And(where...)})
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		res.SetError(err)
		return res
	}

	if csr.Count() > 0 {
		res.SetErrorTxt("Field with selected internal rating already added. Choose another.")
		return res
	}

	if err := c.Ctx.Save(&payload.NormMaster); err != nil {
		res.SetError(err)
		return res
	}

	return res
}

func (c *NormMasterController) GetNorms(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	csr, err := c.Ctx.Find(new(NormMaster), toolkit.M{})
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		res.SetError(err)
		return res
	}

	norms := make([]NormMaster, 0)
	err = csr.Fetch(&norms, 0, false)
	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(norms)
	return res
}

func (c *NormMasterController) GetInternalRatingCategory(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	csr, err := c.Ctx.Find(new(InternalRatingCategory), toolkit.M{})
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		res.SetError(err)
		return res
	}

	norms := make([]InternalRatingCategory, 0)
	err = csr.Fetch(&norms, 0, false)
	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(norms)
	return res
}

func (c *NormMasterController) GetNormData(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	payload := struct {
		Internalrating string
		Customerid     string
		Dealno         string
	}{}

	res := new(toolkit.Result)
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	fm := new(FormulaModel)
	fm.CustomerId = payload.Customerid
	fm.DealNo = payload.Dealno

	err := fm.GetData("norm")
	if err != nil {
		res.SetError(err)
		return res
	}

	bs, err := fm.CalculateNorm(payload.Internalrating)
	if err != nil {
		res.SetError(err)
		return res
	}

	res.SetData(bs)
	return res
}

func (c *NormMasterController) SetFreeze(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	res := new(toolkit.Result)

	payload := struct {
		IsFreeze bool
	}{}
	if err := k.GetPayload(&payload); err != nil {
		res.SetError(err)
		return res
	}

	model := new(NormMaster)
	norm, err := model.GetData()
	if err != nil {
		res.SetError(err)
		return res
	}

	result := model.SetFreeze(norm, payload.IsFreeze)
	res.SetData(result)
	return res
}
