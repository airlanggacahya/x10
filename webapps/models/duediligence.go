package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type DueDiligence struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            string `bson:"_id" , json:"_id"`
	Alias         string
	Order         int
	Section       string
	SubSection    string
	Field         string
	Use           bool
}

func NewDueDiligence() *DueDiligence {
	m := new(DueDiligence)
	m.Id = bson.NewObjectId().Hex()
	return m
}

func (e *DueDiligence) RecordID() interface{} {
	return e.Id
}

func (m *DueDiligence) TableName() string {
	return "DueDiligence"
}

type DueDiligenceInputData struct {
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

	Frozen bool
}

// type AuditStatus struct {
// 	Date     string
// 	Status   string
// 	Unit     string
// 	TypeDate string
// 	Na       string
// }

// type FormData struct {
// 	FieldId string
// 	Date    string
// 	Value   float64
// }

func NewDueDiligenceInputData() *DueDiligenceInputData {
	m := new(DueDiligenceInputData)
	m.Id = bson.NewObjectId().Hex()
	return m
}

func (e *DueDiligenceInputData) RecordID() interface{} {
	return e.Id
}

func (m *DueDiligenceInputData) TableName() string {
	return "DueDiligenceInputData"
}
