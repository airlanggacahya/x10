package models

import (
	. "eaciit/x10/webapps/connection"
	"github.com/eaciit/dbox"
	"github.com/eaciit/orm"
	// tk "github.com/eaciit/toolkit"
	"gopkg.in/mgo.v2/bson"
	// "log"
	"time"
)

type StockandDebtModel struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            bson.ObjectId `bson:"_id" , json:"_id" `
	CustomerId    string
	AOM           []AOM
	AA            []AA
	Flag          int
	IsConfirm     bool      `bson:"IsConfirm,omitempty"`
	IsFreeze      bool      `bson:"IsFreeze,omitempty"`
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

func (m *StockandDebtModel) Confirm(id string, status bool, ctx *orm.DataContext) (StockandDebtModel, error) {
	stock, e := m.getById(id)
	if e != nil {
		return stock, e
	}

	stock.IsConfirm = status
	stock.DateFlag = time.Now()

	e = ctx.Save(&stock)

	return stock, e
}

func (m *StockandDebtModel) Freeze(id string, status bool, ctx *orm.DataContext) (StockandDebtModel, error) {
	stock, e := m.getById(id)
	if e != nil {
		return stock, e
	}

	stock.IsFreeze = status
	e = ctx.Save(&stock)

	return stock, e
}

func (m *StockandDebtModel) getById(id string) (StockandDebtModel, error) {
	cn, e := GetConnection()
	defer cn.Close()
	result := StockandDebtModel{}

	idObject := bson.ObjectIdHex(id)
	csr, e := cn.NewQuery().
		Where(dbox.Eq("_id", idObject)).
		From("StockandDebt").
		Cursor(nil)

	if csr == nil {
		return result, e
	} else {
		defer csr.Close()
	}

	e = csr.Fetch(&result, 1, true)

	return result, e
}
