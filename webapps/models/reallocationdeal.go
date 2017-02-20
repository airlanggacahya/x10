package models

import (
	"time"

	. "eaciit/x10/webapps/connection"
	// "fmt"
	// "github.com/eaciit/crowd"
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm"
	tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	// "strconv"
)

type ReallocationDeal struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            bson.ObjectId `bson:"_id" , json:"_id"`
	CustomerName  string        `bson:"CustomerName,omitempty"`
	DealNo        string        `bson:"DealNo,omitempty"`
	FromName      string        `bson:"FromName,omitempty"`
	FromId        string        `bson:"FromId,omitempty"`
	ToName        string        `bson:"ToName,omitempty"`
	ToId          string        `bson:"ToId,omitempty"`
	Role          string        `bson:"Role,omitempty"`
	TimeStamp     time.Time     `bson:"TimeStamp,omitempty"`
}

func (m *ReallocationDeal) TableName() string {
	return "ReallocationDeal"
}

func (m *ReallocationDeal) UpdateReallocationRole(param []tk.M) error {

	cMongo, em := GetConnection()
	if em != nil {
		return em
	}

	defer cMongo.Close()

	qinsert := cMongo.NewQuery().
		From("AccountDetails").
		SetConfig("multiexec", true).
		Save()

	qinsertAllow := cMongo.NewQuery().
		From(m.TableName()).
		SetConfig("multiexec", true).
		Save()

	for _, v := range param {
		filter := []*dbox.Filter{}

		filter = append(filter, dbox.Eq("_id", v.GetString("Id")))
		AD, err := new(AccountDetail).Where(filter)
		if err != nil {
			return err
		}

		if len(AD) > 0 {
			if v.GetString("Role") == "CA" {
				AD[0].AccountSetupDetails.CreditAnalyst = v.GetString("ToText")
				AD[0].AccountSetupDetails.CreditAnalystId = v.GetString("ToId")
			} else {
				AD[0].AccountSetupDetails.RmName = v.GetString("ToText")
				AD[0].AccountSetupDetails.RmNameId = v.GetString("ToId")
			}

			insdata := map[string]interface{}{"data": AD[0]}
			em = qinsert.Exec(insdata)
			if em != nil {
				return em
			}
		}

		allocate := new(ReallocationDeal)
		allocate.Id = bson.NewObjectId()
		allocate.CustomerName = v.GetString("CustomerName")
		allocate.DealNo = v.GetString("DealNo")
		allocate.FromName = v.GetString("FromText")
		allocate.FromId = v.GetString("FromId")
		allocate.ToName = v.GetString("ToText")
		allocate.ToId = v.GetString("ToId")
		allocate.Role = v.GetString("Role")
		allocate.TimeStamp = time.Now()

		insdata := map[string]interface{}{"data": allocate}
		em = qinsertAllow.Exec(insdata)
		if em != nil {
			return em
		}
	}

	return nil
}
