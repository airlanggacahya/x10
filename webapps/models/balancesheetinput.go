package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type BalanceSheetInput struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            string `bson:"_id" , json:"_id"`
	Alias         string
	Order         int
	Section       string
	SubSection    string
	Field         string
	Use           bool
}

func NewBalanceSheetInput() *BalanceSheetInput {
	m := new(BalanceSheetInput)
	m.Id = bson.NewObjectId().Hex()
	return m
}

func (e *BalanceSheetInput) RecordID() interface{} {
	return e.Id
}

func (m *BalanceSheetInput) TableName() string {
	return "BalanceSheetInput"
}

type RatioInputData struct {
	orm.ModelBase   `bson:"-",json:"-"`
	Id              string `bson:"_id" , json:"_id"`
	CustomerID      string
	AuditStatus     []*AuditStatus
	ProvisionStatus []*AuditStatus
	FormData        []*FormData

	Confirmed                bool
	ConfirmedAuditStatus     []*AuditStatus
	ConfirmedProvisionStatus []*AuditStatus
	ConfirmedFormData        []*FormData
	LastConfirm              time.Time

	Frozen   bool
	IsFrozen bool
}

type AuditStatus struct {
	Date     string
	Status   string
	Unit     string
	TypeDate string
	Na       string
}

type FormData struct {
	FieldId string
	Date    string
	Value   float64
}

func NewRatioInputData() *RatioInputData {
	m := new(RatioInputData)
	m.Id = bson.NewObjectId().Hex()
	return m
}

func (e *RatioInputData) RecordID() interface{} {
	return e.Id
}

func (m *RatioInputData) TableName() string {
	return "RatioInputData"
}
