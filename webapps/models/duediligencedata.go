package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type DueDiligenceInput struct {
	orm.ModelBase `bson:"-", json:"-"`
	Id            string `bson:"_id", json:"_id"`
	CustomerId    string
	DealNo        string
	Verification  []VerificationDetails
	Defaulter     []DefaulterDetails
	Background    []BackgroundDetails
	Status        int
	Freeze        bool
	LastConfirmed time.Time `bson:"LastConfirmed,omitempty"`
	DateFreeze    time.Time `bson:"DateFreeze,omitempty"`
	DateSave      time.Time `bson:"DateSave,omitempty"`
}

type VerificationDetails struct {
	Particulars string
	Result      string
	Mitigants   string
}

type DefaulterDetails struct {
	Source     string
	Applicable string
	BankName   string
	Amount     float64
	Status     string
}

type BackgroundDetails struct {
	Name         string
	Designation  string
	CIBILScore   float64
	ShareHolding float64
	RedFlags     string
}

func NewDueDiligenceInput() *DueDiligenceInput {
	m := new(DueDiligenceInput)
	m.Id = bson.NewObjectId().Hex()
	return m
}

func (e *DueDiligenceInput) RecordID() interface{} {
	return e.Id
}

func (m *DueDiligenceInput) TableName() string {
	return "DueDiligenceInput"
}
