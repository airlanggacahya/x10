package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type InternalRtrModel struct {
	orm.ModelBase `bson: "-", json: "-"`
	Id            string `bson: " _id", json: "_id"`
	CustomerId    string
	DealNo        string
	Product       string
	Scheme        string
	DataTop       []DataTopDetails
	DataBottom    []DataBottomDetails
	DataFilter    []DataFilterDetails
	Status        int
	Freeze        bool
}

type DataTopDetails struct {
	ActiveLoans float64
	Accrued     float64
	Deliquent   float64
	Outstand    float64
	Delay       float64
	Early       float64
	DueDate     time.Time
	Average     float64
	Max         float64
	Min         float64
	Loan        float64
	Amount      float64
	AverageDPD  float64
}

type DataBottomDetails struct {
	ActiveLoans float64
	Accrued     float64
	Deliquent   float64
	Outstand    float64
	Delay       float64
	Early       float64
	DueDate     time.Time
	Average     float64
	Max         float64
	Min         float64
	Loan        float64
	Amount      float64
	AverageDPD  float64
}

type DataFilterDetails struct {
	Dealno   string
	Product  string
	Scheme   string
	Approval time.Time
	Validiy  time.Time
	Amount   string
}

func NewInternaRtrModel() *InternalRtrModel {
	m := new(InternalRtrModel)
	m.Id = bson.NewObjectId().Hex()
	return m
}

func (c *InternalRtrModel) RecordID() interface{} {
	return c.Id
}

func (c *InternalRtrModel) TableName() string {
	return "InternalRTR"
}
