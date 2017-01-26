package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
)

func NewMasterSuplier() *MasterSuplier {
	m := new(MasterSuplier)
	m.Id = bson.NewObjectId()
	return m
}

func (e *MasterSuplier) RecordID() interface{} {
	return e.Id
}

func (m *MasterSuplier) TableName() string {
	return "MasterSupplier"
}

type MasterSuplier struct {
	orm.ModelBase    `bson:"-", json:"-"`
	Id               bson.ObjectId `bson:"_id"  json:"_id" `
	AddressLine1     string        `bson:"addressLine1"`
	BankAccount      string        `bson:"bankAccount"`
	BankBranch_id    string        `bson:"bankBranch_id"`
	BankId           string        `bson:"bankId"`
	BpType           string        `bson:"bpType"`
	Country          string        `bson:"country"`
	Name             string        `bson:"name"`
	DealerDesc_1     string        `bson:"dealerDesc_l"`
	DealerId         string        `bson:"dealerId"`
	District         string        `bson:"district"`
	EmpanelledStatus string        `bson:"empanelledStatus"`
	LastUpdate       string        `bson:"lastUpdate"`
	Pincode          string        `bson:"pincode"`
	RecStatus        string        `bson:"recStatus"`
	State            string        `bson:"state"`
	UseInAD          bool          `bson:"useInAD"`
	FromOmnifin      bool          `bson:"fromOmnifin"`
}
