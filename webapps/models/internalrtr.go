package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
	// "time"
)

type InternalRtr struct {
	orm.ModelBase `bson:"-", json:"-"`
	Id            string                `bson:"_id", json:"_id"`
	Snapshot      []DataSnapshotDetails `bson:"snapshot", json:"snapshot"`
	Dealist       []DataSnapshotDealist `bson:"deallist", json:"deallist"`
	Status        int                   `bson:"status,omitempty"`
	Isfreeze      bool                  `bson:"isfreeze,omitempty"`
}

type DataSnapshotDetails struct {
	NoActiveLoan             float64 `bson:"NoActiveLoan", json:"NoActiveLoan"`
	AmountOutstandingAccured float64 `bson:"AmountOutstandingAccured", json:"AmountOutstandingAccured"`
	TotalAmount              float64 `bson:"TotalAmount", json:"TotalAmount"`
	NPREarlyClosures         float64 `bson:"NPREarlyClosures", json:"NPREarlyClosures"`
	Minimum                  float64 `bson:"Minimum", json:"Minimum"`
	NPRDelays                float64 `bson:"NPRDelays", json:"NPRDelays"`
	NoOfPaymentDueDate       float64 `bson:"NoOfPaymentDueDate", json:"NoOfPaymentDueDate"`
	MaxDPDDays               float64 `bson:"MaxDPDDays", json:"MaxDPDDays"`
	MaxDPDDAmount            float64 `bson:"MaxDPDDAmount", json:"MaxDPDDAmount"`
	AVGDPDDays               float64 `bson:"AVGDPDDays", json:"AVGDPDDays"`
	Average                  float64 `bson:"Average", json:"Average"`
	Maximum                  float64 `bson:"Maximum", json:"Maximum"`
}

type DataSnapshotDealist struct {
	AgreementDate            string  `bson:"AgreementDate", json:"AgreementDate"`
	DealNo                   string  `bson:"DealNo", json:"DealNo"`
	DealSanctionTillValidate string  `bson:"DealSanctionTillValidate", json:"DealSanctionTillValidate"`
	Product                  string  `bson:"Product", json:"Product"`
	ProductId                string  `bson:"ProductId", json:"ProductId"`
	Scheme                   string  `bson:"Scheme", json:"Scheme"`
	SchemeId                 string  `bson:"SchemeId", json:"SchemeId"`
	TotalLoanAmount          float64 `bson:"TotalLoanAmount", json:"TotalLoanAmount"`
}

func NewInternaRtr() *InternalRtr {
	m := new(InternalRtr)
	m.Id = bson.NewObjectId().Hex()
	return m
}

func (c *InternalRtr) RecordID() interface{} {
	return c.Id
}

func (c *InternalRtr) TableName() string {
	return "InternalRTR"
}
