package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
)

type DealSetupModel struct {
	orm.ModelBase   `bson:"-",json:"-"`
	Id              bson.ObjectId ` bson:"_id" , json:"_id" `
	Info            interface{}
	CustomerProfile interface{}
	AccountDetail   interface{}
	InternalRtr     interface{}
}

func NewDealSetupModel() *DealSetupModel {
	m := new(DealSetupModel)
	m.Id = bson.NewObjectId()
	return m
}

func (e *DealSetupModel) RecordID() interface{} {
	return e.Id
}

func (m *DealSetupModel) TableName() string {
	return "DealSetup"
}
