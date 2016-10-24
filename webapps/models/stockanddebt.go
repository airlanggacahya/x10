package models

import (
	"github.com/eaciit/orm"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type StockandDebtModel struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            bson.ObjectId `bson:"_id" , json:"_id" `
	CustomerId    string
	AOM           []AOM
	AA            []AA
	Flag          int
	DateFlag      time.Time `bson:"DateFlag,omitempty"`
}

type AOM struct {
	// Id                   bson.ObjectId `bson:"_id" , json:"_id" `
	OperatingRatioString string
	OperatingRatio       time.Time
	ReceivablesDays      string
	InventoryDays        string
	LessPayablesDays     string
	WCDays               string
	ReceivablesAmount    string
	InventoryAmount      string
	LessPayablesAmount   string
	WCRequirement        string
}

type AA struct {
	// Id                bson.ObjectId `bson:"_id" , json:"_id" `
	BulanString       string
	Bulan             time.Time
	ReceivableMin90   string
	ReceivableMore90  string
	ReceivableMore180 string
	InventoryMin90    string
	InventoryMore90   string
	InventoryMore180  string
}

func NewStockandDebtModel() *StockandDebtModel {
	m := new(StockandDebtModel)
	return m
}
func (e *StockandDebtModel) RecordID() interface{} {
	return e.Id
}

func (m *StockandDebtModel) TableName() string {
	return "StockandDebt"
}
