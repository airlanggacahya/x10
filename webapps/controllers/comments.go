package controllers

import (
	. "eaciit/x10/webapps/models"
	db "github.com/eaciit/dbox"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	// "strings"
	"fmt"
	"time"
)

func (m *DataCapturingController) CommentDelete(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	query := toolkit.M{}

	p := toolkit.M{}

	e := k.GetPayload(&p)
	if e != nil {
		m.WriteLog(e)
	}

	query = toolkit.M{}.Set("where", db.And(db.Eq("_id", bson.ObjectIdHex(p.GetString("Id")))))

	csr, err := m.Ctx.Find(new(CommentModel), query)
	defer csr.Close()
	if err != nil {
		return err.Error()
	}
	results := make([]CommentModel, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return err.Error()
	}

	if len(results) > 0 {
		err = m.Ctx.Delete(&results[0])
		if err != nil {
			return err.Error()
		}

	}

	return results
}

func (m *DataCapturingController) CommentList(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	query := toolkit.M{}

	p := toolkit.M{}

	e := k.GetPayload(&p)
	if e != nil {
		m.WriteLog(e)
	}

	query = toolkit.M{}.Set("where", db.And(db.Eq("customerid", p.GetString("CustomerId")), db.Eq("dealno", p.GetString("DealNo"))))

	csr, err := m.Ctx.Find(new(CommentModel), query)
	defer csr.Close()
	if err != nil {
		return err.Error()
	}
	results := make([]CommentModel, 0)
	err = csr.Fetch(&results, 0, false)
	if err != nil {
		return err.Error()
	}

	return results
}

func (m *DataCapturingController) CommentSave(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	p := struct {
		Id         string
		CustomerId string
		DealNo     string
		Comment    string
		Active     int
		DateInput  time.Time
	}{}
	e := k.GetPayload(&p)
	if e != nil {
		m.WriteLog(e)
	}

	mdl := new(CommentModel)
	if k.Session("userid") != nil && k.Session("username") != nil && k.Session("fullname") != nil {
		mdl.CustomerId = p.CustomerId
		mdl.CustomerName = ""
		mdl.UserId = k.Session("userid").(string)
		mdl.UserName = k.Session("username").(string)
		mdl.FullName = k.Session("fullname").(string)
		mdl.Comment = p.Comment
		mdl.Active = p.Active
		mdl.LastEdit = time.Now()
		mdl.DealNo = p.DealNo

		if p.Id == "" {

			mdl.Id = bson.NewObjectId()
			mdl.DateInput = time.Now()
		} else {
			mdl.Id = bson.ObjectIdHex(p.Id)
			mdl.DateInput = p.DateInput
		}

		e = m.Ctx.Save(mdl)
		fmt.Println(e)
		return ""
	} else {
		return "you not loggin yet"
	}

}
